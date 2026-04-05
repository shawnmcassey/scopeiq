const https = require('https');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(getHTML());
  }
  if (req.method === 'POST') {
    try {
      const body = await getBody(req);
      const result = await callAnthropic(body, process.env.ANTHROPIC_API_KEY);
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    } catch(e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({error: e.message}));
    }
  }
  res.statusCode = 405; res.end('Method not allowed');
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
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    const reqHttp = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(new Error(data)); } });
    });
    reqHttp.on('error', reject);
    reqHttp.write(payload);
    reqHttp.end();
  });
}

function getHTML() { return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ScopeIQ — AI Estimating</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#ffffff;--bg2:#f5f5f3;--bg3:#efefec;--text:#1a1a18;--text2:#6b6b67;--text3:#9a9a94;--border:rgba(0,0,0,0.11);--border2:rgba(0,0,0,0.2);--green:#0F6E56;--gm:#1D9E75;--gl:#E1F5EE;--r:8px;--rl2:12px;--f:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
body{font-family:var(--f);background:var(--bg3);color:var(--text);min-height:100vh;}
.app{max-width:1020px;margin:0 auto;padding:2rem 1rem 5rem;}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:0.5px solid var(--border);}
.logo{width:40px;height:40px;background:var(--green);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo svg{width:22px;height:22px;fill:none;stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.hdr h1{font-size:22px;font-weight:600;letter-spacing:-0.02em;}
.hdr p{font-size:13px;color:var(--text2);margin-top:1px;}
.hbadge{margin-left:auto;font-size:11px;background:var(--gl);color:var(--green);padding:4px 10px;border-radius:20px;font-weight:500;white-space:nowrap;}
.slbl{font-size:11px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
.card{background:var(--bg);border:0.5px solid var(--border);border-radius:var(--rl2);padding:1.25rem;margin-bottom:14px;}
.dz{border:1.5px dashed var(--border2);border-radius:var(--r);padding:1.5rem 1rem;text-align:center;cursor:pointer;transition:all 0.15s;}
.dz:hover{background:var(--gl);border-color:var(--gm);}
.dz svg{width:26px;height:26px;stroke:var(--text2);margin-bottom:6px;}
.dz-main{font-size:13px;font-weight:500;margin-bottom:2px;}
.dz-sub{font-size:11px;color:var(--text2);}
.thumbs{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;}
.thumb{position:relative;width:72px;height:72px;border-radius:6px;overflow:hidden;border:0.5px solid var(--border);flex-shrink:0;}
.thumb img{width:100%;height:100%;object-fit:cover;}
.tx{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(0,0,0,0.65);color:white;border-radius:50%;border:none;cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;}
.fld{margin-bottom:11px;}
.fld label{display:block;font-size:12px;color:var(--text2);margin-bottom:4px;}
select,input[type=text],textarea{width:100%;border:0.5px solid var(--border2);border-radius:var(--r);padding:8px 10px;font-size:13px;font-family:var(--f);color:var(--text);background:var(--bg);transition:border 0.15s;}
select:focus,input:focus,textarea:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px rgba(29,158,117,0.12);}
textarea{resize:vertical;line-height:1.5;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:640px){.g2{grid-template-columns:1fr;}}
.abtn{width:100%;padding:14px;background:var(--green);color:white;border:none;border-radius:var(--r);font-size:15px;font-weight:500;cursor:pointer;font-family:var(--f);letter-spacing:-0.01em;transition:all 0.15s;margin-top:4px;}
.abtn:hover{filter:brightness(1.1);}
.abtn:disabled{background:var(--bg2);color:var(--text2);cursor:not-allowed;filter:none;}
.results{margin-top:1.5rem;display:none;}
.results.vis{display:block;}
.lcrd{text-align:center;padding:3rem;background:var(--bg);border-radius:var(--rl2);border:0.5px solid var(--border);}
.spinner{width:32px;height:32px;border:2.5px solid var(--border);border-top-color:var(--gm);border-radius:50%;animation:spin 0.75s linear infinite;margin:0 auto 1rem;}
@keyframes spin{to{transform:rotate(360deg);}}
.lmsg{font-size:14px;color:var(--text2);}
.tabs{display:flex;gap:2px;margin-bottom:1rem;border-bottom:0.5px solid var(--border);flex-wrap:wrap;}
.tab{padding:9px 14px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-0.5px;color:var(--text2);background:none;border-top:none;border-left:none;border-right:none;font-family:var(--f);transition:color 0.12s;}
.tab.active{color:var(--green);border-bottom-color:var(--green);font-weight:500;}
.tab:hover{color:var(--text);}
.twrap{background:var(--bg);border:0.5px solid var(--border);border-radius:var(--rl2);overflow:hidden;overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:520px;}
thead th{text-align:left;font-size:11px;font-weight:600;color:var(--text2);padding:8px 12px;border-bottom:0.5px solid var(--border);text-transform:uppercase;letter-spacing:0.04em;background:var(--bg2);}
tbody td{padding:9px 12px;border-bottom:0.5px solid var(--border);color:var(--text);vertical-align:top;}
tbody tr:last-child td{border-bottom:none;}
tbody tr:hover td{background:var(--bg2);}
.cc{font-family:monospace;font-size:12px;color:var(--green);}
.secr td{background:var(--bg2);font-size:11px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.06em;padding:5px 12px;}
.totr td{font-weight:600;background:var(--bg2);}
.grnd td{font-weight:700;font-size:14px;color:var(--green);background:var(--gl);}
.sed{width:100%;min-height:180px;border:0.5px solid var(--border2);border-radius:var(--r);padding:12px;font-size:13px;font-family:var(--f);color:var(--text);background:var(--bg);line-height:1.6;resize:vertical;}
.sed:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px rgba(29,158,117,0.12);}
.erow{display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap;}
.eb{padding:9px 16px;border:0.5px solid var(--border2);border-radius:var(--r);font-size:13px;cursor:pointer;background:var(--bg);color:var(--text);font-family:var(--f);transition:background 0.12s;}
.eb:hover{background:var(--bg2);}
.eb.p{background:var(--green);color:white;border-color:var(--green);}
.eb.p:hover{filter:brightness(1.1);}
.pb{background:var(--bg);border:0.5px solid var(--border);border-radius:var(--rl2);padding:1.75rem;font-size:14px;line-height:1.8;color:var(--text);white-space:pre-wrap;}
.emsg{background:#FCEBEB;color:#A32D2D;border-radius:var(--r);padding:1rem;font-size:13px;margin-top:1rem;}
canvas{display:none;}
footer{text-align:center;margin-top:3rem;font-size:12px;color:var(--text3);}
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<div class="app">
<div class="hdr">
  <div class="logo"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
  <div><h1>ScopeIQ</h1><p>AI-powered damage estimating · Rhode Island Restoration</p></div>
  <span class="hbadge">Providence, RI price list</span>
</div>

<div class="slbl">Step 1 — Upload media</div>
<div class="card">
  <div class="dz" id="photo-dz" onclick="document.getElementById('photo-input').click()">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
    <div class="dz-main">Drop job site photos here or click to browse</div>
    <div class="dz-sub">JPG · PNG · WEBP — multiple files OK</div>
  </div>
  <input type="file" id="photo-input" accept="image/*" multiple style="display:none"/>
  <div class="thumbs" id="photo-thumbs"></div>
</div>

<div class="slbl">Step 2 — Job details &amp; scope</div>
<div class="g2">
  <div class="card">
    <div class="fld"><label>Loss type</label>
      <select id="loss-type">
        <option value="">Select...</option>
        <option value="water">Water damage</option>
        <option value="fire">Fire &amp; smoke</option>
        <option value="mold">Mold remediation</option>
        <option value="reconstruction">Full reconstruction</option>
        <option value="new_construction">New construction</option>
      </select>
    </div>
    <div class="fld"><label>Claim / job number</label><input type="text" id="claim-num" placeholder="e.g. RIR-2024-0847"/></div>
    <div class="fld"><label>Insured name</label><input type="text" id="insured-name" placeholder="e.g. John Smith"/></div>
    <div class="fld"><label>Property address</label><input type="text" id="prop-addr" placeholder="e.g. 123 Main St, Providence RI"/></div>
  </div>
  <div class="card">
    <div class="fld">
      <label>Voice dictate or type field notes — AI auto-generates scope from this</label>
      <textarea id="voice-notes" rows="8" placeholder="Walk the job and dictate... e.g. Master bath — ceiling collapsed, drywall saturated all four walls to 24 inches, vinyl plank buckled, vanity cabinet damaged at base, subfloor soft in two spots..."></textarea>
    </div>
  </div>
</div>

<button class="abtn" id="analyze-btn" onclick="runAnalysis()">Analyze all inputs and generate estimate</button>

<div class="results" id="results">
  <div class="lcrd" id="lcrd">
    <div class="spinner"></div>
    <div class="lmsg" id="lmsg">Analyzing media and extracting measurements...</div>
  </div>
  <div id="rcontent" style="display:none;">
    <div class="tabs">
      <button class="tab active" onclick="swTab('li',this)">Line items</button>
      <button class="tab" onclick="swTab('meas',this)">Measurements</button>
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
    <div id="tab-meas" style="display:none;">
      <div class="twrap"><table>
        <thead><tr><th>Room</th><th>L x W</th><th>Height</th><th>SF</th><th>Wall LF</th><th>Source</th></tr></thead>
        <tbody id="meas-body"></tbody>
      </table></div>
      <div class="erow"><button class="eb p" onclick="copyMeas()">Copy measurements</button></div>
    </div>
    <div id="tab-scope" style="display:none;">
      <div style="font-size:13px;color:var(--text2);margin-bottom:8px;">AI-generated scope — edit before finalizing</div>
      <textarea class="sed" id="scope-ed"></textarea>
      <div class="erow">
        <button class="eb p" onclick="copyScope()">Copy scope</button>
        <button class="eb" onclick="window.print()">Print / PDF</button>
      </div>
    </div>
    <div id="tab-prop" style="display:none;">
      <div class="pb" id="prop-text"></div>
      <div class="erow">
        <button class="eb p" onclick="copyProp()">Copy proposal</button>
        <button class="eb" onclick="window.print()">Print / PDF</button>
      </div>
    </div>
  </div>
  <div class="emsg" id="emsg" style="display:none;"></div>
</div>

<footer>ScopeIQ · Rhode Island Restoration · Powered by Claude AI</footer>
</div>
<script>
const API_URL='/api/analyze';
const MAX_IMGS=6,MAX_SIZE=800,QUALITY=0.65;
let allImgs=[],currentLI=[],currentProp='',currentScope='',currentRooms=[];

async function compressImage(b64,mime){return new Promise(res=>{const img=new Image();img.onload=()=>{const cv=document.createElement('canvas');let w=img.width,h=img.height;if(w>MAX_SIZE||h>MAX_SIZE){const s=MAX_SIZE/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s);}cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);res({data:cv.toDataURL('image/jpeg',QUALITY).split(',')[1],type:'image/jpeg'});};img.src='data:'+mime+';base64,'+b64;});}

const dz=document.getElementById('photo-dz');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.style.background='var(--gl)';dz.style.borderColor='var(--gm)';});
dz.addEventListener('dragleave',()=>{dz.style.background='';dz.style.borderColor='';});
dz.addEventListener('drop',e=>{e.preventDefault();dz.style.background='';dz.style.borderColor='';handleFiles(e.dataTransfer.files);});
document.getElementById('photo-input').addEventListener('change',e=>handleFiles(e.target.files));

function handleFiles(files){Array.from(files).forEach(f=>{if(!f.type.startsWith('image/'))return;const r=new FileReader();r.onload=ev=>{const idx=allImgs.length;allImgs.push({data:ev.target.result.split(',')[1],type:f.type});addThumb('photo-thumbs',ev.target.result,idx);};r.readAsDataURL(f);});}
function addThumb(gid,src,idx){const g=document.getElementById(gid);const d=document.createElement('div');d.className='thumb';d.id='th-'+idx;d.innerHTML='<img src="'+src+'"/><button class="tx" onclick="removeImg('+idx+')">&#x2715;</button>';g.appendChild(d);}
function removeImg(idx){allImgs.splice(idx,1);const el=document.getElementById('th-'+idx);if(el)el.remove();}
function swTab(tab,btn){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');['li','meas','scope','prop'].forEach(t=>{document.getElementById('tab-'+t).style.display=t===tab?'block':'none';});}

async function runAnalysis(){
  const notes=document.getElementById('voice-notes').value.trim();
  const lossType=document.getElementById('loss-type').value;
  const claimNum=document.getElementById('claim-num').value.trim();
  const insured=document.getElementById('insured-name').value.trim();
  const addr=document.getElementById('prop-addr').value.trim();
  if(allImgs.length===0&&!notes){alert('Please upload photos or add field notes.');return;}
  const btn=document.getElementById('analyze-btn');
  btn.disabled=true;btn.textContent='Analyzing...';
  document.getElementById('results').style.display='block';
  document.getElementById('results').classList.add('vis');
  document.getElementById('lcrd').style.display='block';
  document.getElementById('rcontent').style.display='none';
  document.getElementById('emsg').style.display='none';
  const msgs=['Analyzing media and reading measurements...','Extracting room dimensions...','Cross-referencing Providence, RI Xactimate price list...','Generating line items...','Writing scope of work and proposal...'];
  let mi=0;const iv=setInterval(()=>{mi=(mi+1)%msgs.length;document.getElementById('lmsg').textContent=msgs[mi];},2800);
  try{
    const toSend=allImgs.slice(0,MAX_IMGS);
    document.getElementById('lmsg').textContent='Compressing images for upload...';
    const compressed=await Promise.all(toSend.map(i=>compressImage(i.data,i.type)));
    document.getElementById('lmsg').textContent='Analyzing media and reading measurements...';
    const imgContent=compressed.map(i=>({type:'image',source:{type:'base64',media_type:i.type,data:i.data}}));
    const jobCtx='Loss type: '+(lossType||'not specified')+' | Claim: '+(claimNum||'TBD')+' | Insured: '+(insured||'TBD')+' | Address: '+(addr||'TBD')+' | Notes: '+(notes||'none');
    const sys1='You are ScopeIQ, an expert Xactimate estimator. Analyze the provided images and job details. Output ONLY minified JSON with NO line breaks inside string values, NO apostrophes (use "it is" not "its"), NO smart quotes, NO trailing commas, NO comments. Schema (all fields required, use 0 or [] if not applicable): {"summary":{"lossType":"","affectedAreas":[],"severity":"moderate","totalSF":0,"confidence":"medium"},"rooms":[{"name":"","length":0,"width":0,"height":0,"sf":0,"lf_wall":0,"measurement_source":"estimated","notes":""}],"lineItems":[{"section":"MITIGATION","code":"","description":"","qty":0,"unit":"SF","unitCost":0,"total":0}],"subtotal":0,"overhead":0,"profit":0,"grandTotal":0,"scope":"[write detailed room-by-room scope of work here]","proposal":"[write professional proposal letter here]"}. Use real Xactimate codes, Providence RI pricing, 10% O&P.';
    const res1=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:4000,system:sys1,messages:[{role:'user',content:[...imgContent,{type:'text',text:jobCtx}]}]})});
    if(!res1.ok)throw new Error('API error: '+res1.status+' '+(await res1.text()));
    const d1=await res1.json();
    const rawText=d1.content.map(b=>b.text||'').join('').trim();
    const j1=rawText.indexOf('{'),j2=rawText.lastIndexOf('}');
    if(j1===-1||j2===-1)throw new Error('No JSON in response. Try again with fewer images.');
    const parsed=JSON.parse(rawText.slice(j1,j2+1));
    clearInterval(iv);
    renderResults(parsed);
  }catch(err){
    clearInterval(iv);
    document.getElementById('lcrd').style.display='none';
    const el=document.getElementById('emsg');el.style.display='block';el.textContent='Error: '+err.message+'. Check your inputs and try again.';
    btn.disabled=false;btn.textContent='Analyze all inputs and generate estimate';
  }
}

function renderResults(data){
  document.getElementById('lcrd').style.display='none';
  document.getElementById('rcontent').style.display='block';
  currentLI=data.lineItems||[];currentProp=data.proposal||'';currentScope=data.scope||'';currentRooms=data.rooms||[];
  const tb=document.getElementById('li-body');tb.innerHTML='';let sec='';
  currentLI.forEach(item=>{
    if(item.section!==sec){sec=item.section;const r=document.createElement('tr');r.className='secr';r.innerHTML='<td colspan="6">'+sec+'</td>';tb.appendChild(r);}
    const tr=document.createElement('tr');
    tr.innerHTML='<td class="cc">'+item.code+'</td><td>'+item.description+'</td><td>'+item.qty+'</td><td>'+item.unit+'</td><td style="text-align:right">$'+Number(item.unitCost).toFixed(2)+'</td><td style="text-align:right">$'+Number(item.total).toFixed(2)+'</td>';
    tb.appendChild(tr);
  });
  [['Subtotal',data.subtotal],['Overhead (10%)',data.overhead],['Profit (10%)',data.profit]].forEach(([l,v])=>{const tr=document.createElement('tr');tr.className='totr';tr.innerHTML='<td></td><td>'+l+'</td><td></td><td></td><td></td><td style="text-align:right">$'+Number(v).toFixed(2)+'</td>';tb.appendChild(tr);});
  const gr=document.createElement('tr');gr.className='grnd';gr.innerHTML='<td></td><td>Grand total</td><td></td><td></td><td></td><td style="text-align:right">$'+Number(data.grandTotal).toFixed(2)+'</td>';tb.appendChild(gr);
  const mb=document.getElementById('meas-body');mb.innerHTML='';
  currentRooms.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML='<td><strong>'+r.name+'</strong></td><td style="font-family:monospace">'+r.length+' x '+r.width+' ft</td><td style="font-family:monospace">'+r.height+' ft</td><td style="font-family:monospace;font-weight:600">'+r.sf+' SF</td><td style="font-family:monospace">'+r.lf_wall+' LF</td><td style="font-size:11px;color:var(--text2)">'+r.measurement_source+'</td>';mb.appendChild(tr);});
  document.getElementById('scope-ed').value=currentScope;
  document.getElementById('prop-text').textContent=currentProp;
  const btn=document.getElementById('analyze-btn');btn.disabled=false;btn.textContent='Re-analyze / update estimate';
}

function exportESI(){let o='[XACTIMATE ESI EXPORT]\n[SCOPE ITEMS]\n';currentLI.forEach(i=>{o+=i.code+'\t'+i.description+'\t'+i.qty+'\t'+i.unit+'\t'+Number(i.unitCost).toFixed(2)+'\t'+Number(i.total).toFixed(2)+'\n';});dl2(o,'estimate_scopeiq.esi','text/plain');}
function exportCSV(){const rows=[['Code','Description','Qty','Unit','Unit Cost','Total']];currentLI.forEach(i=>rows.push([i.code,'"'+i.description+'"',i.qty,i.unit,Number(i.unitCost).toFixed(2),Number(i.total).toFixed(2)]));dl2(rows.map(r=>r.join(',')).join('\n'),'estimate_scopeiq.csv','text/csv');}
function dl2(c,n,t){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click();}
function copyLI(){navigator.clipboard.writeText(currentLI.map(i=>i.code+'\t'+i.description+'\t'+i.qty+' '+i.unit+'\t$'+Number(i.unitCost).toFixed(2)+'\t$'+Number(i.total).toFixed(2)).join('\n')).then(()=>alert('Copied!'));}
function copyScope(){navigator.clipboard.writeText(document.getElementById('scope-ed').value).then(()=>alert('Scope copied!'));}
function copyProp(){navigator.clipboard.writeText(currentProp).then(()=>alert('Proposal copied!'));}
function copyMeas(){navigator.clipboard.writeText(currentRooms.map(r=>r.name+': '+r.length+'x'+r.width+'ft, '+r.sf+'SF, ceiling '+r.height+'ft, '+r.lf_wall+'LF walls').join('\n')).then(()=>alert('Measurements copied!'));}
</script>
</body>
</html>`;}