const https = require('https');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  try {
    const body = await getBody(req);
    const result = await callAnthropic(body, process.env.ANTHROPIC_API_KEY);
    // If Anthropic returned an error, pass it through with 400 status
    if (result.type === 'error') {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: result.error.message }));
    }
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  } catch(e) {
    res.statusCode = 500;
    return res.end(JSON.stringify({error: e.message}));
  }
};
function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    req.on('error', reject);
  });
}
function callAnthropic(body, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Length': Buffer.byteLength(payload) }
    };
    const r = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(new Error(data)); } });
    });
    r.on('error', reject);
    r.write(payload);
    r.end();
  });
}