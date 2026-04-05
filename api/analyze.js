const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  // Serve the app HTML on GET
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.end(getHTML());
  }

  // Proxy Anthropic API on POST
  if (req.method === 'POST') {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const body = req.body || await new Promise(r => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(JSON.parse(d))); });
      const response = await client.messages.create(body);
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(response));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: e.message }));
    }
  }
  
  res.statusCode = 405;
  res.end('Method not allowed');
};

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ScopeIQ — AI Estimating</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#efefec;color:#1a1a18;min-height:100vh;margin:0;}
.app{max-width:800px;margin:0 auto;padding:2rem 1rem;}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:0.5px solid rgba(0,0,0,0.11);}
.logo{width:40px;height:40px;background:#0F6E56;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo svg{width:22px;height:22px;fill:none;stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
h1{font-size:22px;font-weight:600;margin:0;}
p{margin:0;font-size:13px;color:#6b6b67;}
.card{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:1.25rem;margin-bottom:14px;}
.slbl{font-size:11px;font-weight:600;color:#6b6b67;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
.dz{border:1.5px dashed rgba(0,0,0,0.2);border-radius:8px;padding:1.5rem 1rem;text-align:center;cursor:pointer;transition:all 0.15s;}
.dz:hover{background:#E1F5EE;border-color:#1D9E75;}
select,input,textarea{width:100%;border:0.5px solid rgba(0,0,0,0.2);border-radius:8px;padding:8px 10px;font-size:13px;font-family:inherit;color:#1a1a18;background:#fff;box-sizing:border-box;}
.fld{margin-bottom:11px;}
.fld label{display:block;font-size:12px;color:#6b6b67;margin-bottom:4px;}
.abtn{width:100%;padding:14px;background:#0F6E56;color:white;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;margin-top:4px;}
.abtn:disabled{background:#f5f5f3;color:#6b6b67;cursor:not-allowed;}
.results{margin-top:1.5rem;display:none;}
.results.vis{display:block;}
.lcrd{text-align:center;padding:3rem;background:#fff;border-radius:12px;border:0.5px solid rgba(0,0,0,0.11);}
.spinner{width:32px;height:32px;border:2.5px solid rgba(0,0,0,0.11);border-top-color:#1D9E75;border-radius:50%;animation:spin 0.75s linear infinite;margin:0 auto 1rem;}
@keyframes spin{to{transform:rotate(360deg);}}
.emsg{background:#FCEBEB;color:#A32D2D;border-radius:8px;padding:1rem;font-size:13px;margin-top:1rem;}
.tabs{display:flex;gap:2px;margin-bottom:1rem;border-bottom:0.5px solid rgba(0,0,0,0.11);}
.tab{padding:9px 14px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-0.5px;color:#6b6b67;background:none;border-top:none;border-left:none;border-right:none;font-family:inherit;}
.tab.active{color:#0F6E56;border-bottom-color:#0F6E56;font-weight:500;}
.twrap{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;overflow:hidden;overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:520px;}
thead th{text-align:left;font-size:11px;font-weight:600;color:#6b6b67;padding:8px 12px;border-bottom:0.5px solid rgba(0,0,0,0.11);text-transform:uppercase;background:#f5f5f3;}
tbody td{padding:9px 12px;border-bottom:0.5px solid rgba(0,0,0,0.11);}
tbody tr:last-child td{border-bottom:none;}
.grnd td{font-weight:700;font-size:14px;color:#0F6E56;background:#E1F5EE;}
.erow{display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;}
.eb{padding:9px 16px;border:0.5px solid rgba(0,0,0,0.2);border-radius:8px;font-size:13px;cursor:pointer;background:#fff;font-family:inherit;}
.eb.p{background:#0F6E56;color:white;border-color:#0F6E56;}
.sed{width:100%;min-height:180px;border:0.5px solid rgba(0,0,0,0.2);border-radius:8px;padding:12px;font-size:13px;font-family:inherit;line-height:1.6;resize:vertical;box-sizing:border-box;}
.pb{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:1.75rem;font-size:14px;line-height:1.8;white-space:pre-wrap;}
.thumbs{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;}
.thumb{position:relative;width:72px;height:72px;border-radius:6px;overflow:hidden;border:0.5px solid rgba(0,0,0,0.11);}
.thumb img{width:100%;height:100%;object-fit:cover;}
.tx{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(0,0,0,0.65);color:white;border-radius:50%;border:none;cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;}
footer{text-align:center;margin-top:3rem;font-size:12px;color:#9a9a94;}
</style>
</head>
<body>
<canvas id="canvas" style="display:none;"></canvas>
<div class="app">
<div class="hdr">
  <div class="logo"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
  <div><h1>ScopeIQ</h1><p>AI-powered damage estimating · Rhode Island Restoration</p></div>
</div>

<div class="slbl">Step 1 — Upload media</div>
<div class="card">
  <div class="dz" onclick="document.getElementById('photo-input').click()">
    <svg style="width:26px;height:26px;stroke:#6b6b67;margin-bottom:6px;" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
    <div style="font-size:13px;font-weight:500;">Drop job site photos here or click to browse</div>
    <div style="font-size:11px;color:#6b6b67;">JPG · PNG · WEBP — multiple files OK</div>
  </div>
  <input type="file" id="photo-input" accept="image/*" multiple style="display:none"/>
  <div class="thumbs" id="thumbs"></div>
</div>

<div class="slbl">Step 2 — Job details</div>
<div class="card">
  <div class="fld"><label>Loss type</label>
    <select id="loss-type">
      <option value="">Select...</option>
      <option value="water">Water damage</option>
      <option value="fire">Fire &amp; smoke</option>
      <option value="mold">Mold remediation</option>
      <option value="reconstruction">Full reconstruction</option>
    </select>
  </div>
  <div class="fld"><label>Claim / job number</label><input type="text" id="claim-num" placeholder="e.g. RIR-2024-0847"/></div>
  <div class="fld"><label>Insured name</label><input type="text" id="insured-name" placeholder="e.g. John Smith"/></div>
  <div class="fld"><label>Property address</label><input type="text" id="prop-addr" placeholder="e.g. 123 Main St, Providence RI"/></div>
  <div class="fld"><label>Field notes / voice dictation</label>
    <textarea id="voice-notes" rows="5" placeholder="Walk the job and describe damage room by room..."></textarea>
  </div>
</div>

<button class="abtn" id="analyze-btn" onclick="runAnalysis()">Analyze and generate estimate</button>

<div class="results" id="results">
  <div class="lcrd" id="lcrd">
    <div class="spinner"></div>
    <div style="font-size:14px;color:#6b6b67;" id="lmsg">Analyzing media and extracting measurements...</div>
  </div>
  <div id="rcontent" style="display:none;">
    <div class="tabs">
      <button class="tab active" onclick="swTab('li',this)">Line items</button>
      <button class="tab" onclick="swTab('scope',this)">Scope of work</button>
      <button class="tab" onclick="swTab('prop',this)">Proposal</button>
    </div>
    <div id="tab-li">
      <div class="twrap"><table>
        <thead><tr><th>Code</th><th>Description</th><th>Qty</th><th>Unit</th><th style="text-align:right">Unit cost</th><th style="text-align:right">Total</th></tr></thead>
        <tbody id="li-body"></tbody>
      </table></div>
      <div class="erow">
        <button class="eb p" onclick="exportESI()">Export .ESI (Xactimate)</button>
        <button class="eb" onclick="exportCSV()">Export CSV</button>
        <button class="eb" onclick="copyLI()">Copy to clipboard</button>
        <button class="eb" onclick="window.print()">Print / PDF</button>
      </div>
    </div>
    <div id="tab-scope" style="display:none;">
      <textarea class="sed" id="scope-ed"></textarea>
      <div class="erow"><button class="eb p" onclick="copyScope()">Copy scope</button></div>
    </div>
    <div id="tab-prop" style="display:none;">
      <div class="pb" id="prop-text"></div>
      <div class="erow"><button class="eb p" onclick="copyProp()">Copy proposal</button></div>
    </div>
  </div>
  <div class="emsg" id="emsg" style="display:none;"></div>
</div>

<footer>ScopeIQ · Rhode Island Restoration · Powered by Claude AI</footer>
</div>
<script>
const API_URL = '/api/analyze';
const MAX_IMGS = 6, MAX_SIZE = 800, QUALITY = 0.65;
let allImgs = [], currentLI = [], currentProp = '', currentScope = '';

async function compressImage(b64, mime) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > MAX_SIZE || h > MAX_SIZE) { const s = MAX_SIZE/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
      cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      res({ data: cv.toDataURL('image/jpeg',QUALITY).split(',')[1], type: 'image/jpeg' });
    };
    img.src = 'data:'+mime+';base64,'+b64;
  });
}

document.getElementById('photo-input').addEventListener('change', e => {
  Array.from(e.target.files).forEach(f => {
    if (!f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = ev => {
      const idx = allImgs.length;
      allImgs.push({ data: ev.target.result.split(',')[1], type: f.type });
      const g = document.getElementById('thumbs');
      const d = document.createElement('div'); d.className='thumb'; d.id='th-'+idx;
      d.innerHTML = '<img src="'+ev.target.result+'"/><button class="tx" onclick="removeImg('+idx+')">✕</button>';
      g.appendChild(d);
    };
    r.readAsDataURL(f);
  });
});

function removeImg(idx) { allImgs.splice(idx,1); const el=document.getElementById('th-'+idx); if(el) el.remove(); }
function swTab(tab,btn) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); btn.classList.add('active');
  ['li','scope','prop'].forEach(t=>{ document.getElementById('tab-'+t).style.display=t===tab?'block':'none'; });
}

async function runAnalysis() {
  const notes = document.getElementById('voice-notes').value.trim();
  const lossType = document.getElementById('loss-type').value;
  const claimNum = document.getElementById('claim-num').value.trim();
  const insured = document.getElementById('insured-name').value.trim();
  const addr = document.getElementById('prop-addr').value.trim();
  if (allImgs.length===0 && !notes) { alert('Please upload photos or add field notes.'); return; }
  
  const btn = document.getElementById('analyze-btn');
  btn.disabled=true; btn.textContent='Analyzing...';
  document.getElementById('results').style.display='block';
  document.getElementById('results').classList.add('vis');
  document.getElementById('lcrd').style.display='block';
  document.getElementById('rcontent').style.display='none';
  document.getElementById('emsg').style.display='none';
  
  const msgs = ['Analyzing media...','Extracting measurements...','Cross-referencing Providence RI price list...','Generating line items...','Writing scope and proposal...'];
  let mi=0; const iv=setInterval(()=>{ mi=(mi+1)%msgs.length; document.getElementById('lmsg').textContent=msgs[mi]; },2800);
  
  try {
    const toSend = allImgs.slice(0, MAX_IMGS);
    const compressed = await Promise.all(toSend.map(i => compressImage(i.data, i.type)));
    const imgContent = compressed.map(i => ({ type:'image', source:{ type:'base64', media_type:i.type, data:i.data } }));
    const jobCtx = 'Loss type: '+(lossType||'unknown')+' | Claim: '+(claimNum||'TBD')+' | Insured: '+(insured||'TBD')+' | Address: '+(addr||'TBD')+' | Notes: '+(notes||'none');
    const sys1 = 'You are ScopeIQ, an expert Xactimate estimator for Rhode Island Restoration. Analyze the provided images and job details. Output ONLY minified JSON with NO line breaks inside string values, NO apostrophes (use "it is" not "its"), NO smart quotes, NO trailing commas. Schema: {"summary":{"lossType":"","affectedAreas":[],"severity":"moderate","totalSF":0},"lineItems":[{"section":"MITIGATION","code":"","description":"","qty":0,"unit":"SF","unitCost":0,"total":0}],"subtotal":0,"overhead":0,"profit":0,"grandTotal":0,"scope":"","proposal":""}. Use real Xactimate codes, Providence RI pricing, 10% O&P. Write scope and proposal as plain text inside the JSON strings.';
    
    const res1 = await fetch(API_URL, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:4000, system:sys1, messages:[{ role:'user', content:[...imgContent,{ type:'text', text:jobCtx }] }] })
    });
    if (!res1.ok) throw new Error('API error: '+res1.status+' '+(await res1.text()));
    const d1 = await res1.json();
    const rawText = d1.content.map(b=>b.text||'').join('').trim();
    const j1=rawText.indexOf('{'), j2=rawText.lastIndexOf('}');
    if (j1===-1||j2===-1) throw new Error('No JSON in response. Try again.');
    const parsed = JSON.parse(rawText.slice(j1,j2+1));
    
    clearInterval(iv);
    renderResults(parsed);
  } catch(err) {
    clearInterval(iv);
    document.getElementById('lcrd').style.display='none';
    const el=document.getElementById('emsg'); el.style.display='block'; el.textContent='Error: '+err.message;
    btn.disabled=false; btn.textContent='Analyze and generate estimate';
  }
}

function renderResults(data) {
  document.getElementById('lcrd').style.display='none';
  document.getElementById('rcontent').style.display='block';
  currentLI=data.lineItems||[]; currentProp=data.proposal||''; currentScope=data.scope||'';
  const tb=document.getElementById('li-body'); tb.innerHTML=''; let sec='';
  currentLI.forEach(item=>{
    if(item.section!==sec){ sec=item.section; const r=document.createElement('tr'); r.style.background='#f5f5f3'; r.innerHTML='<td colspan="6" style="font-size:11px;font-weight:600;color:#6b6b67;text-transform:uppercase;padding:5px 12px;">'+sec+'</td>'; tb.appendChild(r); }
    const tr=document.createElement('tr');
    tr.innerHTML='<td style="font-family:monospace;color:#0F6E56;">'+item.code+'</td><td>'+item.description+'</td><td>'+item.qty+'</td><td>'+item.unit+'</td><td style="text-align:right">$'+Number(item.unitCost).toFixed(2)+'</td><td style="text-align:right">$'+Number(item.total).toFixed(2)+'</td>';
    tb.appendChild(tr);
  });
  [['Subtotal',data.subtotal],['Overhead (10%)',data.overhead],['Profit (10%)',data.profit]].forEach(([l,v])=>{
    const tr=document.createElement('tr'); tr.style.fontWeight='600'; tr.style.background='#f5f5f3';
    tr.innerHTML='<td></td><td>'+l+'</td><td></td><td></td><td></td><td style="text-align:right">$'+Number(v).toFixed(2)+'</td>'; tb.appendChild(tr);
  });
  const gr=document.createElement('tr'); gr.className='grnd';
  gr.innerHTML='<td></td><td>Grand total</td><td></td><td></td><td></td><td style="text-align:right">$'+Number(data.grandTotal).toFixed(2)+'</td>'; tb.appendChild(gr);
  document.getElementById('scope-ed').value=currentScope;
  document.getElementById('prop-text').textContent=currentProp;
  const btn=document.getElementById('analyze-btn'); btn.disabled=false; btn.textContent='Re-analyze / update estimate';
}

function exportESI(){let o='[XACTIMATE ESI EXPORT]\n[SCOPE ITEMS]\n';currentLI.forEach(i=>{o+=i.code+'\t'+i.description+'\t'+i.qty+'\t'+i.unit+'\t'+Number(i.unitCost).toFixed(2)+'\t'+Number(i.total).toFixed(2)+'\n';});dl2(o,'estimate_scopeiq.esi','text/plain');}
function exportCSV(){const rows=[['Code','Description','Qty','Unit','Unit Cost','Total']];currentLI.forEach(i=>rows.push([i.code,'"'+i.description+'"',i.qty,i.unit,Number(i.unitCost).toFixed(2),Number(i.total).toFixed(2)]));dl2(rows.map(r=>r.join(',')).join('\n'),'estimate_scopeiq.csv','text/csv');}
function dl2(c,n,t){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click();}
function copyLI(){navigator.clipboard.writeText(currentLI.map(i=>i.code+'\t'+i.description+'\t'+i.qty+' '+i.unit+'\t$'+Number(i.unitCost).toFixed(2)+'\t$'+Number(i.total).toFixed(2)).join('\n')).then(()=>alert('Copied!'));}
function copyScope(){navigator.clipboard.writeText(document.getElementById('scope-ed').value).then(()=>alert('Scope copied!'));}
function copyProp(){navigator.clipboard.writeText(currentProp).then(()=>alert('Proposal copied!'));}
</script>
</body>
</html>`;
}