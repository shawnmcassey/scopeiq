const https = require('https');

const PRICE_LIST = `PROVIDENCE RI XACTIMATE PRICES (April 2026) - Use these EXACT codes and prices:

DRYWALL:
DRYW        Drywall - hung taped floated ready for paint    SF   $1.83
DRYW+       Drywall - High grade                            SF   $2.01
DRYR        Drywall - remove                                SF   $0.37
DRYRR       Drywall - remove and replace                    SF   $2.20
DRYTPR      Texture - popcorn - remove                      SF   $0.68
DRYTSKM     Texture - skim coat                             SF   $0.87

PAINTING:
PNTW        Paint walls - one coat                          SF   $0.63
PNTW2       Paint walls - two coats                         SF   $0.86
PNTC        Paint ceiling - one coat                        SF   $0.58
PNTC2       Paint ceiling - two coats                       SF   $0.79
PNTBS       Paint baseboard                                 LF   $1.08
PNTDR       Paint door slab (per side)                      EA  $25.14
PNTDRJT     Paint door jamb and trim (per side)             EA  $18.22
PNTCR       Paint crown molding                             LF   $1.24
PNTS        Seal stain                                      SF   $0.54

FLOORING:
FCCPAD      Carpet pad                                      SF   $0.16
FCCPADHI    Carpet pad - High grade                         SF   $0.24
FCWRF       Wood floor - refinish                           SF   $2.37
FCWRF+      Wood floor - refinish High grade                SF   $3.10
FCTCER      Tile ceramic 4x4 standard                       SF   $6.82
FCTCER+     Tile ceramic High grade                         SF   $8.14
FCTPRC      Tile porcelain                                  SF   $7.94
FCTPRC+     Tile porcelain High grade                       SF   $9.87
FCVLVT      LVT/LVP vinyl plank standard                    SF   $4.85
FCVLVT+     LVT/LVP vinyl plank High grade                  SF   $6.12

INSULATION:
INSBL6      Blown-in insulation 6 inch R-19                 SF   $1.18
INSBATT     Batt insulation 3.5 inch R-11                   SF   $0.52
INSBATT6    Batt insulation 6 inch R-19                     SF   $0.78

FRAMING:
FRMSTD2     Framing 2x4 stud wall                           SF   $3.42
FRMSTD6     Framing 2x6 stud wall                           SF   $4.18

ROOFING:
RFG240      Comp shingle 240 lb                             SQ $185.00
RFG300      Comp shingle 300 lb                             SQ $210.00
RFGFELT15   Felt paper 15 lb                                SQ  $22.50
RFGDRIP     Drip edge                                       LF   $1.85

SIDING:
SDGVIN      Vinyl siding                                    SF   $3.14
SDGHARDIE   Fiber cement siding Hardie                      SF   $5.88

WATER MITIGATION (actual PLX prices):
WTRCABFH    Tear out cabinetry - full height unit            LF  $14.86
WTRCABLOW   Tear out cabinetry - lower (base) units          LF   $7.37
WTRCABUP    Tear out cabinetry - upper (wall) units          LF   $5.33
WTRCABVAN   Tear out cabinetry - vanity                      LF   $6.73
WTRCTFL     Tear out countertop - flat laminate              LF   $3.43
WTRCTPF     Tear out countertop - post formed laminate       LF   $3.43
WTRCTGS     Tear out countertop - granite/stone              LF   $6.85
WTRWHD      Water heater - Detach                            EA  $10.92
WTRFLRCE    Tear out flooring - ceramic/porcelain tile       SF   $3.17
WTRFLRLN    Tear out flooring - vinyl/linoleum               SF   $1.52
WTRFLRCP    Tear out carpet                                  SF   $0.22
WTRFLRWD    Tear out wood flooring                           SF   $1.87
WTRDRYCP    Content manipulation charge - per item           EA   $3.05
WTRTRK      Water damage - truck charge - per load           EA $185.00
WTRDUMP     Dumpster - 10 yard                               EA $325.00
WTRDUMP20   Dumpster - 20 yard                               EA $450.00
WTRPACK     Pack out - per room                              EA $285.00

HVAC (actual PLX prices):
HVCDXCU3    Condensing unit - 3 ton - R-410A               EA  $2743.50
HVCDXCU4    Condensing unit - 4 ton - R-410A               EA  $3254.00
HVCFAN      Bathroom exhaust fan                            EA   $152.00
HVCFAN+     Bathroom exhaust fan - High grade               EA   $198.00

ELECTRICAL (actual PLX prices):
ELEOUT      Outlet - 110V - standard                        EA    $57.50
ELESWT      Switch - single pole                            EA    $48.00
ELELIGHT    Light fixture - standard                        EA    $95.00
ELEPNL100   Panel box - 100 amp                             EA  $1850.00
ELEPNL200   Panel box - 200 amp                             EA  $2950.00

PLUMBING (actual PLX prices):
PLMTOILET   Toilet - standard                               EA   $485.00
PLMTOILET+  Toilet - High grade                             EA   $685.00
PLMSINK     Sink - bathroom vanity - standard               EA   $285.00
PLMSINK+    Sink - bathroom vanity - High grade             EA   $425.00
PLMTUB      Tub - standard alcove - 5 foot                  EA  $1250.00
PLMSHWBASE  Shower base - standard                          EA   $485.00
PLMFAU      Faucet - bathroom - standard                    EA   $175.00
PLMFAU+     Faucet - bathroom - High grade                  EA   $285.00
PLMWH       Water heater - 40 gal gas - standard            EA   $985.00
PLMWH+      Water heater - 50 gal gas - High grade          EA  $1250.00
`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  try {
    const body = await getBody(req);
    // Inject price list into system prompt if present
    if (body.system) {
      body.system = body.system + '\n\n' + PRICE_LIST;
    } else {
      body.system = PRICE_LIST;
    }
    const result = await callAnthropic(body, process.env.ANTHROPIC_API_KEY);
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