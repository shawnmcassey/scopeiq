const https = require('https');

// ─────────────────────────────────────────────────────────────────────────────
// REAL RHODE ISLAND RESTORATION XACTIMATE PRICES
// Source: Actual estimates written by RIR using Providence RI price lists
//   RIPR8X_OCT25 → Fire reconstruction (245 Beckwith St)
//   RIPR8X_JUL25 → Fire mitigation (245 Beckwith St)
//   RIPR8X_MAY25 → Water mitigation (21 Collins Ave)
// All prices are REPLACE (unit cost) unless labeled REMOVE.
// ─────────────────────────────────────────────────────────────────────────────

const PRICE_LIST = `
RHODE ISLAND RESTORATION — REAL XACTIMATE UNIT PRICES (Providence RI)
======================================================================
Use ONLY these prices. Match description to find the right line item.
Format: Description | Unit | Remove | Replace

== GENERAL / DEMOLITION ==
General Demolition - per hour                          | HR  | $63.57  | —
Finish Carpenter - per hour                            | HR  | —       | $96.12
Carpenter - General Framer - per hour                  | HR  | —       | $96.00
Commercial Supervision / Project Management - per hour | HR  | —       | $87.37
Equipment setup, take down, and monitoring             | HR  | —       | $64.01
Cleaning - Supervisory/Administrative - per hour       | HR  | —       | $66.57
Plumber - per hour                                     | HR  | —       | $151.99
Final cleaning - construction                          | SF  | —       | $0.35
Dumpster load - approx. 20 yards, 4 tons              | EA  | $800.00 | —
Temporary toilet (per month)                           | MO  | —       | $213.00
Temporary power - overhead hookup                      | EA  | $83.17  | $653.63

== DEMOLITION — FIRE / WATER TEAROUT ==
Tear out wet plaster, cleanup, bag for disposal        | SF  | $2.58   | —
Tear out wet drywall, cleanup, bag for disposal        | SF  | $1.18   | —
Tear out wet paneling, bag for disposal                | SF  | $0.73   | —
Tear out wet carpet, cut & bag for disposal            | SF  | $0.70   | —
Tear out wet carpet pad and bag for disposal           | SF  | $0.66   | —
Tear out subfloor & bag for disposal                   | SF  | $2.10   | —
Tear out non-salv solid/eng. wood floor & bag          | SF  | $4.23   | —
Tear out non-salv floating floor & bag                 | SF  | $2.17   | —
Tear out non-salv. tile (wall) & bag                   | SF  | $3.47   | —
Tear out non-salv. tile floor & bag                    | SF  | $4.29   | —
Tear out non-salv cement board & bag                   | SF  | $1.55   | —
Tear out non-salv. vinyl, cut & bag                    | SF  | $1.67   | —
Tear out wet insulation and bag                        | SF  | $0.84   | —
Remove blown-in insulation - machine removal           | SF  | $2.71   | —
Tear out trim and bag for disposal                     | LF  | $1.35   | —
Remove Judges paneling - raised panel - hardwood       | SF  | $1.40   | —
Remove stairway - 3 ft wide (8 ft rise plus joist)     | EA  | $262.26 | —
Remove cabinetry - upper (wall) units                  | LF  | $10.61  | —
Remove cabinetry - lower (base) units                  | LF  | $10.61  | —
Remove countertop - Granite or Marble                  | SF  | $7.54   | —
Remove range - commercial 48 inch gas                  | EA  | $131.14 | —
Remove dishwasher                                      | EA  | $37.47  | —
Remove refrigerator side by side 22-25 cf              | EA  | $52.45  | —
Remove vanity                                          | LF  | $10.50  | —
Remove bathtub                                         | EA  | $104.90 | —
Remove toilet                                          | EA  | $34.97  | —
Remove custom shower door and partition                | SF  | $2.62   | —
Remove ductwork - hot/cold air - large size            | LF  | $2.11   | —
Remove ductwork - hot/cold air - extra large           | LF  | $2.11   | —
Remove ductwork - flexible insulated 12 inch round     | LF  | $1.05   | —

== CONTAINMENT (water mitigation - per room) ==
Containment barrier/airlock/decon. chamber             | SF  | —       | $1.25
Containment barrier - tension post (per day)           | DA  | —       | $3.35
Peel and seal zipper - heavy duty                      | EA  | —       | $18.50

== CLEANING — MITIGATION ==
Clean floor or roof joist system                       | SF  | —       | $1.28
Clean floor or roof joist system - Heavy               | SF  | —       | $1.81
Clean more than the walls                              | SF  | —       | $0.48
Clean stud wall (fire rate)                            | SF  | —       | $1.04
Clean stud wall (water rate)                           | SF  | —       | $1.50
Clean floor underlayment / wood subfloor               | SF  | —       | $0.59
Clean floor concrete/slab                              | SF  | —       | $0.55
Clean truss system - up to 5/12 - Heavy                | SF  | —       | $3.23
HEPA Vacuuming - Light fire rate                       | SF  | —       | $0.40
HEPA Vacuuming - Light water rate                      | SF  | —       | $0.52
HEPA Vacuuming - Detailed                              | SF  | —       | $0.79
Apply anti-microbial agent fire rate                   | SF  | —       | $0.32
Apply plant-based anti-microbial agent water rate      | SF  | —       | $0.43
Deodorize building - Hot thermal fog                   | CF  | —       | $0.09
Deodorization chamber - Ozone treatment high density   | CF  | —       | $0.18

== ENCAPSULATION ==
Seal floor/ceiling joist system anti-microbial         | SF  | —       | $3.71
Seal truss system shellac up to 5/12                   | SF  | —       | $3.14

== EQUIPMENT — MITIGATION ==
Negative air fan/Air scrubber (24 hr period)           | DA  | —       | $71.47
Add for HEPA filter negative air exhaust fan           | EA  | —       | $297.27
Dehumidifier (per 24 hr period) - 70-109 ppd           | DA  | —       | $73.23
Air mover (per 24 hour period)                         | EA  | —       | $25.00
Equipment decontamination charge per piece             | EA  | —       | $46.87
Respirator cartridge - HEPA only per pair              | EA  | —       | $16.36
Add for personal protective equipment - Heavy duty     | EA  | —       | $39.81
Respirator - full face - multi-purpose per day         | DA  | —       | $7.61
Plastic bag - disposal of contaminated items           | EA  | —       | $3.91
Add for HEPA filter canister/backpack vacuums          | EA  | —       | $95.41

== PAINT ==
Mask and prep for paint - plastic                      | LF  | —       | $1.95
Seal/prime 1 coat then paint 2 coats walls/ceiling     | SF  | —       | $1.89
Seal and paint paneling                                | SF  | —       | $1.74
Seal and paint stair tread - per side                  | LF  | —       | $7.82
Seal and paint stair riser - per side                  | LF  | —       | $5.21
Seal and paint door/window trim and jamb               | EA  | —       | $46.13
Seal and paint door slab only                          | EA  | —       | $55.54
Seal and paint handrail - wall                         | LF  | —       | $2.84
Seal 1 coat and paint 2 coats crown molding            | LF  | —       | $3.32
Seal 1 coat and paint 2 coats baseboard                | LF  | —       | $3.20
Seal 1 coat and paint 2 coats chair rail               | LF  | —       | $3.19
Seal 1 coat and paint 1 coat trim                      | LF  | —       | $2.10
Seal 1 coat and paint 2 coats baseboard heavy          | LF  | —       | $3.88
Seal and paint window stool                            | LF  | —       | $5.83
Seal and paint wood shelving 12 inch                   | LF  | —       | $6.61

== PLASTER / DRYWALL ==
Two coat plaster no lath                               | SF  | —       | $8.98
Thin coat plaster over 1/2 inch gypsum                 | SF  | —       | $8.02
Furring strip 1 inch x 2 inch                          | SF  | —       | $1.38
Builder board 1/2 inch composition board               | SF  | —       | $2.06

== MILLWORK / TRIM ==
Paneling                                               | SF  | —       | $3.23
Pegboard                                               | SF  | —       | $3.10
T and G paneling - double beaded                       | SF  | —       | $9.97
Crown molding 4-1/4 inch stain grade                   | LF  | —       | $8.82
Crown molding 4-1/4 inch hardwood                      | LF  | —       | $9.60
Crown molding 4-1/4 inch                               | LF  | —       | $6.51
Crown molding 3-1/4 inch                               | LF  | —       | $5.72
Casing 3-1/4 inch stain grade                          | LF  | —       | $4.82
Casing 3-1/4 inch                                      | LF  | —       | $4.14
Chair rail 2-1/2 inch stain grade                      | LF  | —       | $4.92
Baseboard 4-1/4 inch                                   | LF  | —       | $5.58
Baseboard 6 inch w/shoe stain                          | LF  | —       | $10.16
Baseboard 3-1/4 inch                                   | LF  | —       | $4.58
Trim board 1 x 4 installed                             | LF  | —       | $5.10
Window stool and apron stain                           | LF  | —       | $11.90
Window extension jamb 11/16 inch                       | LF  | —       | $4.28
Additional charge for wood                             | LF  | —       | $22.21
Stair nosing - cast metal                              | LF  | —       | $17.76
Door threshold wood                                    | LF  | —       | $17.57
Door opening jamb and casing                           | EA  | —       | $254.11
Interior door lauan/mahogany                           | EA  | —       | $344.70
Interior door Detach and reset                         | EA  | —       | $28.48
French door Detach and reset                           | EA  | —       | $115.15
Door knob interior High grade                          | EA  | —       | $65.24
Door knob interior                                     | EA  | —       | $48.47
Closet shelf and rod package                           | LF  | —       | $27.47
Window blind horizontal                                | EA  | —       | $44.10
Window blind PVC 1 inch                                | EA  | —       | $66.65
Vinyl window double hung 9 SF                          | EA  | —       | $392.66

== FLOORING ==
Vinyl tile                                             | SF  | —       | $4.37
Snaplock laminate simulated wood                       | SF  | —       | $6.73
Tile floor covering                                    | SF  | —       | $16.24
Marble or Granite tile                                 | SF  | —       | $33.16
Ceramic tile bullnose 2x6                              | LF  | —       | $15.63
Oak flooring select grade                              | SF  | —       | $11.99
Sand stain and finish wood floor                       | SF  | —       | $5.48
Screw down existing subfloor                           | SF  | —       | $1.00
Underlayment 1/2 inch BC plywood                       | SF  | —       | $3.18
Vapor barrier 15 lb felt                               | SF  | —       | $0.35
Vinyl metal transition strip                           | LF  | —       | $3.62

== ELECTRICAL ==
Rewire/wire avg. residence                             | SF  | —       | $5.22
Light fixture Standard grade                           | EA  | —       | $76.07
Light fixture                                          | EA  | —       | $91.98
Light fixture wall sconce                              | EA  | —       | $114.09
Hanging light fixture                                  | EA  | —       | $114.70
Hanging light fixture Premium                          | EA  | —       | $182.75
Recessed light fixture High grade                      | EA  | —       | $198.62
Ceiling fan without light                              | EA  | —       | $334.46
Ceiling fan and light                                  | EA  | —       | $437.14
Light bar 3 lights High grade                          | EA  | —       | $190.94
Outlet High grade                                      | EA  | —       | $27.47
Outlet                                                 | EA  | —       | $21.45
220 volt outlet                                        | EA  | —       | $43.61
Switch High grade                                      | EA  | —       | $31.33
Switch                                                 | EA  | —       | $22.13
Smoke detector Standard grade                          | EA  | —       | $59.54
Smoke detector                                         | EA  | —       | $84.09
Ground fault interrupter GFI                           | EA  | —       | $40.72
Bathroom ventilation fan with light                    | EA  | —       | $218.20
Ductwork flexible non-insulated                        | LF  | —       | $9.13
Detach and Reset Baseboard electric                    | EA  | $182.45 | —

== PLUMBING ==
Baseboard heat steam/hot water                         | EA  | —       | $18.57
Sink double basin Detach and reset                     | EA  | —       | $219.20
Sink single High grade                                 | EA  | —       | $500.37
Sink strainer and drain assembly                       | EA  | —       | $98.63
Sink faucet Bathroom                                   | EA  | —       | $276.43
P-trap assembly ABS plastic                            | EA  | —       | $82.52
Plumbing fixture supply line                           | EA  | —       | $25.78
Angle stop valve                                       | EA  | —       | $49.56
Toilet                                                 | EA  | —       | $611.40
Toilet seat High grade                                 | EA  | —       | $87.99
Shower faucet                                          | EA  | —       | $265.38
Bathtub High grade                                     | EA  | —       | $1317.77
Custom shower door and partition                       | SF  | —       | $96.19
Add on for undermount sink                             | EA  | —       | $318.19
Boiler unit flush and recharge                         | EA  | —       | $310.28

== INSULATION ==
Batt insulation 6 inch R19 unfaced                     | SF  | —       | $1.66
Batt insulation 6 inch R19 paper/foil                  | SF  | —       | $1.75
Batt insulation 4 inch R15 paper/foil                  | SF  | —       | $1.79
Blown-in insulation 12 inch depth                      | SF  | —       | $1.71

== CABINETRY / KITCHEN ==
Cabinetry lower base units                             | LF  | —       | $273.45
Cabinetry upper wall units                             | LF  | —       | $201.36
Cabinetry full height unit                             | LF  | —       | $377.50
Cabinet panels side end                                | SF  | —       | $18.31
Cabinet knob or pull                                   | EA  | —       | $10.00
Cabinet knob or pull High grade                        | EA  | —       | $13.39
Cabinet knob or pull Premium                           | EA  | —       | $18.40
Countertop solid surface/granite                       | SF  | —       | $43.38
Countertop Granite or Marble                           | SF  | —       | $92.86
Backsplash solid surface                               | LF  | —       | $5.02
Backsplash stainless steel                             | SF  | —       | $31.33
Dishwasher                                             | EA  | —       | $825.39
Range freestanding double                              | EA  | —       | $12731.31
Range hood stainless steel                             | EA  | —       | $3390.28
Vanity                                                 | LF  | —       | $253.72
Towel bar High grade                                   | EA  | —       | $39.69
Towel ring High grade                                  | EA  | —       | $35.51
Toilet paper dispenser single                          | EA  | —       | $69.90
Robe hook                                              | EA  | —       | $18.39
Bathroom mirror with metal frame                       | SF  | —       | $30.23

== ROOFING ==
Laminated comp shingle roofing                         | SQ  | —       | $335.54
Tear off haul and dispose of roofing                   | SQ  | $84.01  | —
Roofing felt 15 lb                                     | SQ  | —       | $47.15
Ice and water barrier                                  | SF  | —       | $2.24
Sheathing plywood 1/2 inch CDX                         | SF  | —       | $3.30
Re-nailing of roof sheathing                           | SF  | —       | $0.36
Aluminum rake/gable edge trim                          | LF  | —       | $6.85
Asphalt starter universal                              | LF  | —       | $2.48
Continuous ridge vent shingle over                     | LF  | —       | $12.64
Hip Ridge cap cut from 3 tab                           | LF  | —       | $6.31
Roof vent turtle type Metal                            | EA  | —       | $92.28
Flashing pipe jack                                     | EA  | —       | $68.29
Chimney flashing small 24 inch                         | EA  | —       | $468.57
Rafters 2x6 stick frame roof                           | LF  | —       | $4.40
Additional charge for steep roof                       | SQ  | —       | $63.52
Fascia 1x6 No.1 pine                                   | LF  | —       | $11.42
Fascia vinyl coated aluminum                           | LF  | —       | $8.77
Soffit vinyl                                           | SF  | —       | $8.43
Gutter downspout aluminum                              | LF  | —       | $10.84
Gutter downspout Detach and reset                      | LF  | $7.69   | —
`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }

  try {
    const body = await getBody(req);

    const priceMandate = `MANDATORY PRICING — RHODE ISLAND RESTORATION RULES:

1. ALL unit costs MUST come from the price list below. These are real prices from actual Providence RI Xactimate estimates (price lists RIPR8X_OCT25, RIPR8X_JUL25, RIPR8X_MAY25). Do NOT invent prices.

2. LOSS TYPE DETERMINES SCOPE:
   WATER DAMAGE: Use containment barrier ($1.25/SF per room), dehumidifier ($73.23/DA per 24hr), air scrubber ($71.47/DA), HEPA filter ($297.27/EA), plant-based anti-microbial ($0.43/SF), HEPA vac light ($0.52/SF), clean stud wall ($1.50/SF).
   FIRE: Use ozone treatment ($0.18/CF per floor), thermal fog ($0.09/CF), anti-microbial ($0.32/SF), HEPA vac ($0.40/SF), clean stud wall ($1.04/SF). No per-room containment.
   MOLD: Similar to water — containment per room, HEPA vac, anti-microbial, scrubbers.

3. SCOPE SEQUENCE for every affected room:
   Demo → Clean studs/joists/subfloor → Anti-microbial → HEPA vac → Equipment

4. BASEMENT always gets: clean floor/joist system Heavy ($1.85/SF), 2 dehumidifiers, air scrubber + HEPA filter.

5. ATTIC always gets: clean joist heavy ($1.81/SF), clean truss system ($3.23/SF), HEPA detailed ($0.79/SF), shellac encapsulation ($3.14/SF).

6. General section for every job: PPE ($39.81/EA), equipment monitoring ($64.01/HR), dumpster ($800/EA remove).

` + PRICE_LIST;

    if (body.system) {
      body.system = priceMandate + '\n\n---\n\n' + body.system;
    } else {
      body.system = priceMandate;
    }

    const result = await callAnthropic(body, process.env.ANTHROPIC_API_KEY);

    if (result.type === 'error') {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: result.error.message }));
    }

    if (result.content && Array.isArray(result.content)) {
      result.content = result.content.map(block => {
        if (block.type === 'text' && block.text) {
          let text = block.text;
          text = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
          const j1 = text.indexOf('{');
          const j2 = text.lastIndexOf('}');
          if (j1 > -1 && j2 > -1) {
            let json = text.slice(j1, j2 + 1);
            json = json.replace(/"((?:[^"\\]|\\.)*)"/g, function (m, inner) {
              return '"' + inner.replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, ' ') + '"';
            });
            text = text.slice(0, j1) + json + text.slice(j2 + 1);
          }
          block.text = text;
        }
        return block;
      });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));

  } catch (e) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: e.message }));
  }
};

function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
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
    const r = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error(data)); }
      });
    });
    r.on('error', reject);
    r.write(payload);
    r.end();
  });
}
