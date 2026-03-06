import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// ─── West Africa / Nigeria-region data only (consistent with PublicPortal) ────
const OUTBREAKS = [
  { id:1,  disease:"Malaria",       lat:6.5,   lng:3.4,   country:"Nigeria — Lagos",    sev:"high",   cases:1240 },
  { id:43, disease:"Malaria",       lat:7.4,   lng:4.0,   country:"Nigeria — Ibadan",   sev:"high",   cases:870  },
  { id:44, disease:"Malaria",       lat:5.5,   lng:0.2,   country:"Ghana — Accra",      sev:"high",   cases:640  },
  { id:15, disease:"Malaria",       lat:5.6,   lng:-0.2,  country:"Ghana — Cape Coast", sev:"medium", cases:920  },
  { id:45, disease:"Malaria",       lat:8.5,   lng:2.1,   country:"Benin — Cotonou",    sev:"high",   cases:510  },
  { id:46, disease:"Malaria",       lat:6.3,   lng:1.2,   country:"Togo — Lomé",        sev:"medium", cases:290  },
  { id:8,  disease:"Measles",       lat:12.4,  lng:-1.5,  country:"Burkina Faso",       sev:"high",   cases:780  },
  { id:14, disease:"Measles",       lat:3.8,   lng:11.5,  country:"Cameroon — Yaoundé", sev:"medium", cases:340  },
  { id:9,  disease:"Influenza",     lat:17.6,  lng:-3.9,  country:"Mali — Bamako",      sev:"low",    cases:220  },
  { id:5,  disease:"Tuberculosis",  lat:14.7,  lng:-17.4, country:"Senegal — Dakar",    sev:"medium", cases:310  },
];

const SEV_COLOR: Record<string,string> = { high:"#ef4444", medium:"#f97316", low:"#22c55e" };
const DISEASE_COLOR: Record<string,string> = { Malaria:"#ef4444", Measles:"#f97316", Influenza:"#8b5cf6", Tuberculosis:"#d97706" };

function renderReportMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const h2       = line.match(/^##\s+(.*)/);
    const bold     = line.match(/^\*\*(.*)\*\*$/);
    const hr       = line.trim() === "---";
    const bullet   = line.match(/^-\s+(.*)/);
    const empty    = line.trim() === "";

    if (hr)     return <hr key={i} style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" }} />;
    if (empty)  return <div key={i} style={{ height: "8px" }} />;

    if (h2) return (
      <h2 key={i} style={{ fontSize: "14px", fontWeight: 800, color: "#111", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "20px", marginBottom: "8px" }}>
        {h2[1]}
      </h2>
    );

    if (bold) return (
      <p key={i} style={{ fontSize: "13px", fontWeight: 700, color: "#111", margin: "10px 0 4px" }}>
        {bold[1]}
      </p>
    );

    if (bullet) return (
      <div key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, paddingLeft: "12px", borderLeft: "2px solid #e5e7eb", marginBottom: "4px" }}>
        {renderInlineBold(bullet[1])}
      </div>
    );

    return (
      <p key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "4px 0" }}>
        {renderInlineBold(line)}
      </p>
    );
  });
}

// Handles inline **bold** within lines (e.g. "**TO:** Lagos Ministry")
function renderInlineBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#111", fontWeight: 700 }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}


const HOSPITAL = {
  name:"Lagos University Teaching Hospital", id:"LUTH-001",
  lat:6.52, lng:3.39, address:"Idi-Araba, Lagos Island, Nigeria",
  capacity:800, occupied:612, zone:"Lagos State",
  staff:{ consultants:142, nurses:380, allied:210, admin:95 },
  icu:{ total:48, available:18 }, isolation:{ total:30, available:11 },
};

type MedItem  = { name:string; dose:string; unit:string; perPt:number; note:string };
type StaffReq = { role:string; ratio:number };
type EquipItem = { name:string; unit:string; perPt:number };
interface DiseaseSupply { color:string; icon:string; hospRate:number; avgStay:number; meds:MedItem[]; staff:StaffReq[]; equip:EquipItem[] }

const SUPPLY: Record<string,DiseaseSupply> = {
  Malaria:{
    color:"#ef4444", icon:"🦟", hospRate:0.12, avgStay:4,
    meds:[
      {name:"Artemether-Lumefantrine",   dose:"20/120mg",  unit:"courses",  perPt:1,   note:"1st-line ACT — 6-dose 3-day regimen"},
      {name:"Artesunate IV",             dose:"2.4mg/kg",  unit:"vials",    perPt:3,   note:"Severe malaria: loading + 2 follow-up doses"},
      {name:"Paracetamol 500mg",         dose:"500mg q6h", unit:"tablets",  perPt:24,  note:"Fever management × 3 days"},
      {name:"IV Quinine Dihydrochloride",dose:"10mg/kg",   unit:"vials",    perPt:2,   note:"Backup if ACT unavailable — 4h infusion"},
      {name:"Dextrose 5% IV",            dose:"500ml",     unit:"bags",     perPt:4,   note:"Hypoglycaemia prevention in severe cases"},
      {name:"Ceftriaxone 1g IV",         dose:"1g",        unit:"vials",    perPt:1.5, note:"Co-bacterial infection prophylaxis"},
    ],
    staff:[
      {role:"Physician / Hospitalist", ratio:1},{role:"Registered Nurse", ratio:4},
      {role:"Lab Technician",          ratio:2},{role:"Pharmacist",       ratio:0.5},
    ],
    equip:[
      {name:"Rapid Diagnostic Test (RDT) kits",unit:"kits",   perPt:1.2},
      {name:"Blood microscopy slides",         unit:"slides", perPt:3  },
      {name:"IV cannulas 18G",                 unit:"units",  perPt:2  },
      {name:"Mosquito bed nets",               unit:"nets",   perPt:0.5},
    ],
  },
  Measles:{
    color:"#f97316", icon:"🔴", hospRate:0.08, avgStay:6,
    meds:[
      {name:"Vitamin A 200,000 IU",  dose:"200,000 IU",  unit:"capsules", perPt:2,   note:"Two consecutive days — prevents blindness"},
      {name:"Paracetamol syrup",     dose:"120mg/5ml",   unit:"bottles",  perPt:2,   note:"Fever management, paediatric"},
      {name:"Amoxicillin suspension",dose:"250mg/5ml",   unit:"bottles",  perPt:1,   note:"Secondary pneumonia prophylaxis"},
      {name:"ORS sachets",           dose:"1 litre",     unit:"sachets",  perPt:6,   note:"Diarrhoea complication management"},
      {name:"Zinc sulphate 20mg",    dose:"20mg",        unit:"tablets",  perPt:14,  note:"Children <5 — adjunct diarrhoea Tx"},
    ],
    staff:[
      {role:"Paediatrician",          ratio:1},{role:"Registered Nurse",         ratio:5},
      {role:"Infection Control Officer",ratio:1},{role:"Nutritionist/Dietitian", ratio:0.5},
    ],
    equip:[
      {name:"MMR vaccine post-exposure",    unit:"vials (10-dose)", perPt:0.1},
      {name:"N95 respirators (staff)",      unit:"masks",           perPt:10 },
      {name:"Isolation gowns",              unit:"gowns",           perPt:4  },
      {name:"Negative pressure room-days",  unit:"room-days",       perPt:5  },
    ],
  },
  Influenza:{
    color:"#8b5cf6", icon:"🌬️", hospRate:0.06, avgStay:4,
    meds:[
      {name:"Oseltamivir (Tamiflu) 75mg",dose:"75mg bd",  unit:"capsules", perPt:10,  note:"5-day course — start within 48h of onset"},
      {name:"Paracetamol 500mg",         dose:"500mg q6h",unit:"tablets",  perPt:30,  note:"Fever & myalgia relief"},
      {name:"Amoxicillin 500mg",         dose:"500mg tds",unit:"capsules", perPt:21,  note:"Secondary bacterial pneumonia — 7-day course"},
      {name:"Prednisolone 30mg",         dose:"30mg od",  unit:"tablets",  perPt:5,   note:"Severe ARDS — consult intensivist"},
      {name:"Salbutamol inhaler",        dose:"100mcg",   unit:"inhalers", perPt:0.5, note:"Bronchospasm relief PRN"},
    ],
    staff:[
      {role:"General Physician",    ratio:1},{role:"Registered Nurse",      ratio:4},
      {role:"Respiratory Therapist",ratio:0.5},{role:"Physiotherapist",     ratio:0.3},
    ],
    equip:[
      {name:"Rapid Flu Antigen kits",   unit:"kits",  perPt:1 },
      {name:"N95 respirators (staff)",  unit:"masks", perPt:8 },
      {name:"Surgical masks (patients)",unit:"masks", perPt:10},
      {name:"Oxygen concentrators",     unit:"shared",perPt:0.05},
    ],
  },
  Tuberculosis:{
    color:"#d97706", icon:"🫁", hospRate:0.04, avgStay:60,
    meds:[
      {name:"Isoniazid (H) 300mg",    dose:"300mg od",  unit:"packs (60d)",perPt:1, note:"HRZE intensive phase — 2 months"},
      {name:"Rifampicin (R) 600mg",   dose:"600mg od",  unit:"packs (60d)",perPt:1, note:"Core bactericidal agent"},
      {name:"Pyrazinamide (Z) 1500mg",dose:"1500mg od", unit:"packs (60d)",perPt:1, note:"Intensive phase only"},
      {name:"Ethambutol (E) 1200mg",  dose:"1200mg od", unit:"packs (60d)",perPt:1, note:"Prevents resistance emergence"},
      {name:"Pyridoxine B6 25mg",     dose:"25mg od",   unit:"packs (60d)",perPt:1, note:"Prevents INH peripheral neuropathy"},
    ],
    staff:[
      {role:"Pulmonologist / TB Physician",ratio:1},{role:"Registered Nurse", ratio:3},
      {role:"TB DOT Supervisor",           ratio:1},{role:"Contact Tracer",    ratio:2},
    ],
    equip:[
      {name:"GeneXpert cartridges",    unit:"cartridges",perPt:2 },
      {name:"Sputum collection cups",  unit:"cups",      perPt:6 },
      {name:"N95 respirators (staff)", unit:"masks",     perPt:20},
      {name:"Chest X-ray slots",       unit:"X-rays",    perPt:2 },
    ],
  },
};

function haversine(la1:number,ln1:number,la2:number,ln2:number){
  const R=6371,d=Math.PI/180;
  const a=Math.sin((la2-la1)*d/2)**2+Math.cos(la1*d)*Math.cos(la2*d)*Math.sin((ln2-ln1)*d/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}

const OBS_WITH_DIST = OUTBREAKS.map(o=>({...o,dist:haversine(HOSPITAL.lat,HOSPITAL.lng,o.lat,o.lng),color:SEV_COLOR[o.sev]})).sort((a,b)=>a.dist-b.dist);

const GROUPS = Object.values(
  OBS_WITH_DIST.reduce((acc:Record<string,any>,o)=>{
    if(!acc[o.disease]) acc[o.disease]={disease:o.disease,color:DISEASE_COLOR[o.disease]??"#6b7280",icon:SUPPLY[o.disease]?.icon??"🔬",total:0,sites:0,sev:"low",closest:9999,list:[]};
    acc[o.disease].total+=o.cases; acc[o.disease].sites++;
    if(o.dist<acc[o.disease].closest) acc[o.disease].closest=o.dist;
    const n=(s:string)=>s==="high"?3:s==="medium"?2:1;
    if(n(o.sev)>n(acc[o.disease].sev)) acc[o.disease].sev=o.sev;
    acc[o.disease].list.push(o); return acc;
  },{})
).sort((a:any,b:any)=>{const n=(s:string)=>s==="high"?3:s==="medium"?2:1;return n(b.sev)-n(a.sev)||b.total-a.total;}) as any[];

const TODAY = new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
const TOTAL_CASES = OBS_WITH_DIST.reduce((s,o)=>s+o.cases,0);
const OCC = Math.round(HOSPITAL.occupied/HOSPITAL.capacity*100);

type Tab="overview"|"predictions"|"map"|"report";

// ─── Reusable primitives ─────────────────────────────────────────────────────
const SevBadge=({sev}:{sev:string})=>{
  const cfg:{[k:string]:{bg:string;tx:string;label:string}}={
    high:{bg:"#fee2e2",tx:"#dc2626",label:"HIGH"},
    medium:{bg:"#fff7ed",tx:"#ea580c",label:"MED"},
    low:{bg:"#f0fdf4",tx:"#16a34a",label:"LOW"},
  };
  const c=cfg[sev]||cfg.low;
  return <span style={{fontSize:"9px",fontWeight:800,padding:"2px 7px",borderRadius:"999px",background:c.bg,color:c.tx,letterSpacing:"0.06em"}}>{c.label}</span>;
};

export function HospitalDashboard(){
  const {user,logout}=useAuth(); const navigate=useNavigate();
  const mapRef=useRef<HTMLDivElement>(null);
  const leafRef=useRef<any>(null);
  const [tab,setTab]=useState<Tab>("overview");
  const [dark,setDark]=useState(false);
  const [selD,setSelD]=useState<string>("Malaria");
  const [mapReady,setMapReady]=useState(false);
  const [rptLoading,setRptLoading]=useState(false);
  const [rptText,setRptText]=useState("");
  const [rptDone,setRptDone]=useState(false);

  const T=dark
    ?{bg:"#080b12",s1:"#0e1220",s2:"#131929",border:"#1d2538",text:"#e8edf5",text2:"#8892a4",text3:"#4a5568",top:"#0b0f1a",accent:"#4aad2a",tileStyle:"dark_all"}
    :{bg:"#f4f6fa",s1:"#ffffff",s2:"#f8fafc",border:"#e2e8f0",text:"#0d1117",text2:"#4a5568",text3:"#94a3b8",top:"#ffffff",accent:"#16a34a",tileStyle:"light_all"};

  // Leaflet load
  useEffect(()=>{
    const l=document.createElement("link");l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);
    const s=document.createElement("script");s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=()=>setMapReady(true);document.head.appendChild(s);
    return()=>{try{document.head.removeChild(l);document.head.removeChild(s);}catch{}};
  },[]);

  useEffect(()=>{
    if(!mapReady||tab!=="map"||!mapRef.current)return;
    if(leafRef.current){leafRef.current.remove();leafRef.current=null;}
    const L=(window as any).L;
    const map=L.map(mapRef.current,{zoomControl:false}).setView([HOSPITAL.lat,HOSPITAL.lng],6);
    L.control.zoom({position:"bottomright"}).addTo(map);
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${T.tileStyle}/{z}/{x}/{y}{r}.png`,{attribution:"©CARTO",maxZoom:19}).addTo(map);
    leafRef.current=map;
    // Hospital pin
    L.marker([HOSPITAL.lat,HOSPITAL.lng],{icon:L.divIcon({className:"",html:`<div style="width:22px;height:22px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 20px rgba(37,99,235,0.55)"></div>`,iconSize:[22,22],iconAnchor:[11,11]})}).addTo(map).bindPopup(`<b>${HOSPITAL.name}</b><br/><small>${HOSPITAL.address}</small>`).openPopup();
    L.circle([HOSPITAL.lat,HOSPITAL.lng],{radius:620000,color:"#2563eb",weight:1,opacity:0.2,fillOpacity:0.02,dashArray:"6 5"}).addTo(map);
    // Outbreak markers
    OBS_WITH_DIST.forEach(ob=>{
      const r=ob.sev==="high"?120000:ob.sev==="medium"?80000:50000;
      L.circle([ob.lat,ob.lng],{radius:r,color:ob.color,weight:1,opacity:0.45,fillColor:ob.color,fillOpacity:ob.sev==="high"?0.13:0.07}).addTo(map);
      const sz=ob.sev==="high"?15:ob.sev==="medium"?11:8;
      L.marker([ob.lat,ob.lng],{icon:L.divIcon({className:"",html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${ob.color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})})
        .addTo(map).bindPopup(`<div style="font-family:system-ui;padding:4px 2px"><b style="font-size:13px">${ob.disease}</b><br/><span style="color:#6b7280">${ob.country}</span><br/><small>${ob.cases.toLocaleString()} cases · ${ob.dist}km away</small></div>`);
    });
  },[mapReady,tab,dark]);

  const genReport=async()=>{
    setRptLoading(true);setRptText("");setRptDone(false);
    const lines=GROUPS.map((g:any)=>`  • ${g.disease}: ${g.total.toLocaleString()} cases, ${g.sites} site(s), ${g.sev} severity, closest ${g.closest}km`).join("\n");


  const YOUR_API_KEY = "key";

    try{
      const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${YOUR_API_KEY}`,"HTTP-Referer":"http://localhost:3000","X-Title":"EpiRadar"},body:JSON.stringify({model:"anthropic/claude-sonnet-4",max_tokens:1000,messages:[{role:"system",content:`You are Chief Medical Officer at ${HOSPITAL.name}, Lagos, Nigeria.`},{role:"user",content:`Date: ${TODAY}\nHospital occupancy: ${HOSPITAL.occupied}/${HOSPITAL.capacity} beds (${OCC}%)\nStaff: ${HOSPITAL.staff.consultants} consultants, ${HOSPITAL.staff.nurses} nurses, ${HOSPITAL.staff.allied} allied health\nActive outbreaks within 600km:\n${lines}\n\nWrite a formal Outbreak Situation Report to the Lagos State Ministry of Health.\n\nUse exactly these section headings:\n1. EXECUTIVE SUMMARY\n2. CURRENT OUTBREAK STATUS\n3. HOSPITAL IMPACT ASSESSMENT\n4. RESOURCE & SUPPLY REQUIREMENTS\n5. RECOMMENDED ACTIONS FOR AUTHORITIES\n6. PUBLIC HEALTH RECOMMENDATIONS\n\nBe concise, specific, and use formal medical language. Include specific numbers, timelines, and actionable recommendations.`}]})});
      const d=await res.json();
      setRptText(d.choices?.[0]?.message?.content||"Report generation failed. Please retry.");
    }catch{setRptText("Network error — ensure your API key is configured and try again.");}
    setRptLoading(false);setRptDone(true);
  };

  const supply=SUPPLY[selD];
  const grp=GROUPS.find((g:any)=>g.disease===selD);
  const estPts=grp&&supply?Math.round(grp.total*supply.hospRate):0;
  const highCount=GROUPS.filter((g:any)=>g.sev==="high").length;

  const card=(children:React.ReactNode,extra?:React.CSSProperties)=>(
    <div style={{background:T.s1,border:`1px solid ${T.border}`,borderRadius:"14px",transition:"background 0.2s,border-color 0.2s",...extra}}>{children}</div>
  );

  const TABS=[
    {id:"overview"   as Tab,label:"Overview",   icon:"◈"},
    {id:"predictions"as Tab,label:"Predictions",icon:"◉"},
    {id:"map"        as Tab,label:"Map View",   icon:"◎"},
    {id:"report"     as Tab,label:"AI Report",  icon:"◷"},
  ];

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden",transition:"background 0.2s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .anim{animation:fadeUp .35s ease both}
        .row:hover{background:${T.s2}!important;cursor:pointer}
        .tab-btn:hover:not(.active){background:${T.s2}!important}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:999px}
      `}</style>

      {/* ══ TOP BAR ══════════════════════════════════════════════════════════ */}
      <header style={{background:T.top,borderBottom:`1px solid ${T.border}`,height:"52px",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,transition:"background 0.2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3" fill="white" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          </div>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"16px",letterSpacing:"-0.03em",color:T.text}}>EpiRadar</span>
          <div style={{width:"1px",height:"16px",background:T.border}}/>
          <span style={{fontSize:"12px",fontWeight:600,color:T.text3}}>Hospital Portal</span>
          <span style={{display:"flex",alignItems:"center",gap:"4px",padding:"2px 8px",borderRadius:"999px",background:dark?"rgba(34,197,94,0.1)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,0.2)":"#bbf7d0"}`}}>
            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:"10px",fontWeight:700,color:"#16a34a"}}>LIVE</span>
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{textAlign:"right",marginRight:"2px"}}>
            <div style={{fontSize:"12px",fontWeight:700,color:T.text,lineHeight:1.3}}>{user?.name??"Dr. Admin"}</div>
            <div style={{fontSize:"10px",color:T.text3,lineHeight:1.3}}>{HOSPITAL.name}</div>
          </div>
          {/* Dark/light toggle */}
          <button onClick={()=>setDark(v=>!v)} title="Toggle theme" style={{width:"42px",height:"24px",borderRadius:"999px",border:`1.5px solid ${T.border}`,background:dark?"#1a2236":"#e8edf5",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
            <span style={{position:"absolute",top:"3px",left:dark?"18px":"3px",width:"14px",height:"14px",borderRadius:"50%",background:dark?"#22c55e":"#f59e0b",transition:"left 0.2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px"}}>{dark?"🌙":"☀️"}</span>
          </button>
          
          <button onClick={()=>{logout();window.location.href = "/";}} style={{padding:"5px 12px",borderRadius:"7px",border:`1px solid ${T.border}`,background:"transparent",color:T.text2,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
        </div>
      </header>

      {/* ══ NAV TABS ═════════════════════════════════════════════════════════ */}
      <nav style={{background:T.top,borderBottom:`1px solid ${T.border}`,height:"42px",padding:"0 20px",display:"flex",alignItems:"center",gap:"2px",flexShrink:0,transition:"background 0.2s"}}>
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}
            style={{padding:"5px 14px",borderRadius:"8px",border:"none",fontSize:"12px",fontWeight:tab===t.id?700:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",transition:"all 0.15s",background:tab===t.id?T.accent:"transparent",color:tab===t.id?"#fff":T.text2}}>
            <span style={{fontFamily:"monospace",fontSize:"11px"}}>{t.icon}</span>{t.label}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:"10px",color:T.text3,whiteSpace:"nowrap"}}>📍 {HOSPITAL.address} · {TODAY}</span>
      </nav>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <main style={{flex:1,overflow:"hidden",display:"flex"}}>

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {tab==="overview"&&(
          <div className="anim" style={{flex:1,overflowY:"auto",padding:"20px"}}>

            {/* Metric strip */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"12px",marginBottom:"18px"}}>
              {[
                {icon:"🏥",label:"Bed Occupancy",   val:`${OCC}%`,             sub:`${HOSPITAL.occupied} / ${HOSPITAL.capacity}`,         c:OCC>85?"#ef4444":OCC>70?"#f97316":"#22c55e"},
                {icon:"🦠",label:"Disease Alerts",  val:String(GROUPS.length), sub:`${highCount} critical`,                                 c:highCount>0?"#ef4444":"#22c55e"},
                {icon:"📊",label:"Regional Cases",  val:TOTAL_CASES.toLocaleString(), sub:"within 600 km",                                  c:"#f97316"},
                {icon:"📈",label:"Est. Admissions", val:Math.round(TOTAL_CASES*0.08).toLocaleString(), sub:"per month projected",            c:"#2563eb"},
                {icon:"👩‍⚕️",label:"Active Staff",   val:String(HOSPITAL.staff.consultants+HOSPITAL.staff.nurses), sub:`${HOSPITAL.staff.consultants} doctors · ${HOSPITAL.staff.nurses} nurses`, c:"#8b5cf6"},
              ].map(m=>(
                <div key={m.label} style={{background:T.s1,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"15px",transition:"background 0.2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
                    <span style={{fontSize:"18px"}}>{m.icon}</span>
                    <span style={{width:"8px",height:"8px",borderRadius:"50%",background:m.c,display:"block",marginTop:"4px"}}/>
                  </div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"24px",fontWeight:800,color:m.c,lineHeight:1}}>{m.val}</div>
                  <div style={{fontSize:"11px",fontWeight:700,color:T.text,marginTop:"5px"}}>{m.label}</div>
                  <div style={{fontSize:"10px",color:T.text3,marginTop:"1px"}}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Two-column layout */}
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"16px"}}>

              {/* Outbreak alerts */}
              {card(
                <div style={{padding:"18px"}}>
                  <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 14px"}}>Active Outbreak Alerts — West Africa Region</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                    {GROUPS.map((g:any)=>(
                      <div key={g.disease} className="row" onClick={()=>{setSelD(g.disease);setTab("predictions");}}
                        style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 12px",borderRadius:"10px",border:`1px solid ${T.border}`,transition:"background 0.15s"}}>
                        <span style={{fontSize:"22px",flexShrink:0}}>{g.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px"}}>
                            <span style={{fontSize:"13px",fontWeight:700,color:T.text}}>{g.disease}</span>
                            <SevBadge sev={g.sev}/>
                            <span style={{fontSize:"10px",color:T.text3}}>· {g.sites} site{g.sites>1?"s":""} · {g.closest}km</span>
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:"3px"}}>
                            {g.list.map((o:any)=><span key={o.id} style={{fontSize:"9px",padding:"1px 6px",borderRadius:"4px",background:g.color+"14",color:g.color,fontWeight:600}}>{o.country}</span>)}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"16px",fontWeight:800,color:g.color}}>{g.total.toLocaleString()}</div>
                          <div style={{fontSize:"9px",color:T.text3}}>cases</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity panel */}
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {card(
                  <div style={{padding:"16px"}}>
                    <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 12px"}}>Bed Occupancy</p>
                    <div style={{height:"10px",background:T.border,borderRadius:"999px",overflow:"hidden",marginBottom:"8px"}}>
                      <div style={{height:"100%",width:`${OCC}%`,background:OCC>85?"#ef4444":OCC>70?"#f97316":"#22c55e",borderRadius:"999px",transition:"width 1.2s ease"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:"11px",color:T.text3}}>{HOSPITAL.occupied} occupied</span>
                      <span style={{fontSize:"11px",fontWeight:700,color:OCC>85?"#ef4444":OCC>70?"#f97316":"#22c55e"}}>{OCC}%</span>
                      <span style={{fontSize:"11px",color:T.text3}}>{HOSPITAL.capacity-HOSPITAL.occupied} free</span>
                    </div>
                  </div>
                )}
                {card(
                  <div style={{padding:"16px"}}>
                    <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 12px"}}>Staffing & Facilities</p>
                    {[
                      {icon:"👨‍⚕️",label:"Consultants",  val:HOSPITAL.staff.consultants, c:"#2563eb"},
                      {icon:"👩‍⚕️",label:"Nurses",        val:HOSPITAL.staff.nurses,      c:"#8b5cf6"},
                      {icon:"🏥",label:"Allied Health",  val:HOSPITAL.staff.allied,      c:"#f97316"},
                      {icon:"🫀",label:"ICU Available",  val:HOSPITAL.icu.available,     c:"#22c55e"},
                      {icon:"🔒",label:"Isolation Rooms",val:HOSPITAL.isolation.available,c:"#ef4444"},
                      {icon:"🧪",label:"Lab Units Active",val:8,                         c:"#22d3ee"},
                    ].map(s=>(
                      <div key={s.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                        <span style={{fontSize:"12px",color:T.text2}}>{s.icon} {s.label}</span>
                        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"15px",fontWeight:800,color:s.c}}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PREDICTIONS ───────────────────────────────────────────────────── */}
        {tab==="predictions"&&(
          <div className="anim" style={{flex:1,display:"flex",overflow:"hidden"}}>
            {/* Sidebar */}
            <div style={{width:"200px",borderRight:`1px solid ${T.border}`,overflowY:"auto",padding:"14px 10px",flexShrink:0,background:T.s1,transition:"background 0.2s"}}>
              <p style={{fontSize:"9px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 10px",padding:"0 4px"}}>Disease</p>
              {GROUPS.map((g:any)=>(
                <button key={g.disease} onClick={()=>setSelD(g.disease)}
                  style={{width:"100%",padding:"9px 10px",borderRadius:"9px",marginBottom:"4px",border:`1.5px solid ${selD===g.disease?g.color:T.border}`,background:selD===g.disease?g.color+"15":"transparent",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"8px",transition:"all 0.15s",textAlign:"left"}}>
                  <span style={{fontSize:"16px"}}>{g.icon}</span>
                  <div>
                    <div style={{fontSize:"12px",fontWeight:700,color:selD===g.disease?g.color:T.text}}>{g.disease}</div>
                    <div style={{fontSize:"10px",color:T.text3}}>{g.total.toLocaleString()} cases</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main content */}
            {supply&&grp?(
              <div style={{flex:1,overflowY:"auto",padding:"22px"}}>
                {/* Header */}
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"20px",paddingBottom:"18px",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <span style={{fontSize:"40px"}}>{supply.icon}</span>
                    <div>
                      <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"20px",fontWeight:800,margin:"0 0 3px",letterSpacing:"-0.02em",color:T.text}}>{selD} — Resource Prediction</h2>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <SevBadge sev={grp.sev}/>
                        <span style={{fontSize:"11px",color:T.text3}}>{grp.sites} site{grp.sites>1?"s":""} · closest {grp.closest}km</span>
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:"right",background:T.s2,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"12px 16px"}}>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"32px",fontWeight:800,color:supply.color,lineHeight:1}}>{estPts.toLocaleString()}</div>
                    <div style={{fontSize:"10px",color:T.text3,marginTop:"3px"}}>projected admissions / month</div>
                  </div>
                </div>

                {/* KPI row */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
                  {[
                    {icon:"👤",label:"Est. Patients/mo",  val:estPts,                              c:supply.color},
                    {icon:"🛏️",label:"Avg Length of Stay", val:`${supply.avgStay} days`,            c:"#2563eb"},
                    {icon:"📊",label:"Hospitalisation Rate",val:`${Math.round(supply.hospRate*100)}%`,c:"#8b5cf6"},
                  ].map(k=>(
                    <div key={k.label} style={{background:T.s1,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px",transition:"background 0.2s"}}>
                      <span style={{fontSize:"18px"}}>{k.icon}</span>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"22px",fontWeight:800,color:k.c,marginTop:"6px"}}>{k.val}</div>
                      <div style={{fontSize:"10px",color:T.text3,marginTop:"2px"}}>{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* 3-column tables */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"14px"}}>
                  {/* Medications */}
                  {card(
                    <div style={{padding:"16px"}}>
                      <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 14px"}}>💊 Medications</p>
                      {supply.meds.map((m,i)=>(
                        <div key={i} style={{paddingBottom:"11px",marginBottom:"11px",borderBottom:i<supply.meds.length-1?`1px solid ${T.border}`:"none"}}>
                          <div style={{display:"flex",justifyContent:"space-between",gap:"8px"}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:"11px",fontWeight:700,color:T.text,lineHeight:1.3}}>{m.name}</div>
                              <div style={{fontSize:"9px",color:T.text3,marginTop:"2px",lineHeight:1.5}}>{m.dose} · {m.note}</div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"13px",fontWeight:800,color:supply.color}}>{Math.ceil(m.perPt*estPts).toLocaleString()}</div>
                              <div style={{fontSize:"9px",color:T.text3}}>{m.unit}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Staff */}
                  {card(
                    <div style={{padding:"16px"}}>
                      <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 14px"}}>👩‍⚕️ Staff Requirements</p>
                      {supply.staff.map((s,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<supply.staff.length-1?`1px solid ${T.border}`:"none"}}>
                          <span style={{fontSize:"11px",color:T.text2,fontWeight:500,flex:1,paddingRight:"8px"}}>{s.role}</span>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"16px",fontWeight:800,color:"#2563eb"}}>{Math.max(1,Math.ceil(estPts/(s.ratio*15)))}</div>
                            <div style={{fontSize:"9px",color:T.text3}}>needed</div>
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop:"12px",padding:"8px 10px",background:T.s2,borderRadius:"8px",fontSize:"9px",color:T.text3,lineHeight:1.6}}>
                        Calculated from {estPts} projected admissions using standard patient-to-staff ratios.
                      </div>
                    </div>
                  )}
                  {/* Equipment */}
                  {card(
                    <div style={{padding:"16px"}}>
                      <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 14px"}}>📦 Equipment & Supplies</p>
                      {supply.equip.map((e,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<supply.equip.length-1?`1px solid ${T.border}`:"none"}}>
                          <span style={{fontSize:"11px",color:T.text2,fontWeight:500,flex:1,paddingRight:"8px"}}>{e.name}</span>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"14px",fontWeight:800,color:"#22c55e"}}>{Math.ceil(e.perPt*estPts).toLocaleString()}</div>
                            <div style={{fontSize:"9px",color:T.text3}}>{e.unit}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop:"12px",padding:"8px 10px",background:T.s2,borderRadius:"8px",fontSize:"9px",color:T.text3,lineHeight:1.6}}>
                        ℹ️ Estimates at {Math.round(supply.hospRate*100)}% hospitalisation rate. Adjust for local stock levels and lead times.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ):<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:T.text3}}>Select a disease from the sidebar</div>}
          </div>
        )}

        {/* ── MAP ───────────────────────────────────────────────────────────── */}
        {tab==="map"&&(
          <div style={{flex:1,position:"relative"}}>
            <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
            {/* Legend */}
            <div style={{position:"absolute",bottom:"28px",left:"14px",zIndex:1000,background:dark?"rgba(8,11,18,0.92)":"rgba(255,255,255,0.94)",borderRadius:"12px",padding:"12px 16px",border:`1px solid ${T.border}`,backdropFilter:"blur(10px)"}}>
              <p style={{fontSize:"9px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 8px"}}>Map Legend</p>
              {[["#2563eb","This Hospital (LUTH)"],["#ef4444","High Severity"],["#f97316","Medium Severity"],["#22c55e","Low Severity"],["#2563eb","600km coverage zone","dashed"]].map(([c,l,d])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px"}}>
                  <div style={{width:"9px",height:"9px",borderRadius:d?"1px":"50%",background:c,flexShrink:0,border:d?`1.5px dashed ${c}`:"none",opacity:d?0.7:1}}/>
                  <span style={{fontSize:"11px",color:T.text2}}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{position:"absolute",top:"14px",left:"14px",zIndex:1000,background:dark?"rgba(8,11,18,0.88)":"rgba(255,255,255,0.92)",borderRadius:"9px",padding:"6px 12px",border:`1px solid ${T.border}`,backdropFilter:"blur(8px)",fontSize:"11px",fontWeight:600,color:T.text2}}>
              📍 {HOSPITAL.name}
            </div>
          </div>
        )}

        {/* ── AI REPORT ─────────────────────────────────────────────────────── */}
        {tab==="report"&&(
          <div className="anim" style={{flex:1,overflowY:"auto",padding:"24px",display:"flex",gap:"22px"}}>
            {/* Left sidebar */}
            <div style={{width:"270px",flexShrink:0}}>
              {card(
                <div style={{padding:"20px"}}>
                  <p style={{fontSize:"10px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 12px"}}>Report Generator</p>
                  <p style={{fontSize:"12px",color:T.text2,lineHeight:1.7,margin:"0 0 14px"}}>
                    Generates a formal outbreak situation report addressed to the <strong style={{color:T.text}}>Lagos State Ministry of Health</strong>.
                  </p>
                  <div style={{background:T.s2,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px",marginBottom:"14px"}}>
                    <p style={{fontSize:"9px",fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 8px"}}>Sections</p>
                    {["Executive Summary","Outbreak Status","Hospital Impact","Resource Requirements","Authority Actions","Public Health Measures"].map(s=>(
                      <div key={s} style={{fontSize:"11px",color:T.text2,marginBottom:"5px",display:"flex",gap:"5px",alignItems:"flex-start"}}>
                        <span style={{color:"#22c55e",fontWeight:700,flexShrink:0}}>✓</span>{s}
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:"10px",color:T.text3,lineHeight:1.8,marginBottom:"16px",background:T.s2,border:`1px solid ${T.border}`,borderRadius:"9px",padding:"10px"}}>
                    <span style={{color:T.text,fontWeight:700}}>To:</span> Lagos State Ministry of Health<br/>
                    <span style={{color:T.text,fontWeight:700}}>From:</span> {HOSPITAL.name}<br/>
                    <span style={{color:T.text,fontWeight:700}}>Date:</span> {TODAY}<br/>
                    <span style={{color:T.text,fontWeight:700}}>Ref:</span> {HOSPITAL.id}
                  </div>
                  <button onClick={genReport} disabled={rptLoading}
                    style={{width:"100%",padding:"11px",borderRadius:"10px",border:"none",background:rptLoading?T.border:"linear-gradient(135deg,#22c55e,#16a34a)",color:rptLoading?T.text3:"#fff",fontSize:"13px",fontWeight:700,cursor:rptLoading?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px",transition:"all 0.2s",boxShadow:rptLoading?"none":"0 4px 14px rgba(22,163,74,0.25)"}}>
                    {rptLoading
                      ?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin .8s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Generating…</>
                      :"🤖 Generate AI Report"}
                  </button>
                  {rptDone&&(
                    <button onClick={()=>{const b=new Blob([rptText],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`EpiRadar_${HOSPITAL.id}_${TODAY.replace(/ /g,"_")}.txt`;a.click();}}
                      style={{width:"100%",padding:"9px",borderRadius:"10px",border:`1px solid ${T.border}`,background:"transparent",color:T.text2,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:"8px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                      ⬇️ Download .txt
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Report output */}
            <div style={{flex:1}}>
              {!rptDone&&!rptLoading&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"12px",color:T.text3}}>
                  <span style={{fontSize:"56px",opacity:0.5}}>📋</span>
                  <div style={{fontSize:"15px",fontWeight:700,color:T.text2}}>No report generated</div>
                  <div style={{fontSize:"12px",textAlign:"center",maxWidth:"280px",lineHeight:1.6}}>Click "Generate AI Report" to create a formal outbreak situation report for the authorities.</div>
                </div>
              )}
              {rptLoading&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"14px"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <div style={{fontSize:"14px",fontWeight:600,color:T.text2}}>AI composing your report…</div>
                </div>
              )}
              {rptDone&&rptText&&card(
                <div style={{padding:"28px 32px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",paddingBottom:"16px",borderBottom:`2px solid ${T.border}`}}>
                    <div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"17px",fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>Outbreak Situation Report</div>
                      <div style={{fontSize:"10px",color:T.text3,marginTop:"2px"}}>{HOSPITAL.name} · {TODAY}</div>
                    </div>
                    <span style={{padding:"4px 12px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"999px",fontSize:"10px",fontWeight:700,color:"#16a34a",letterSpacing:"0.06em"}}>OFFICIAL</span>
                  </div>
                  <div style={{fontSize:"12px",color:T.text2,lineHeight:2}}>{renderReportMarkdown(rptText)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}