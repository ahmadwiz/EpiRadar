import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OUTBREAKS = [
  // Africa
  { id: 1,  disease: "Malaria",       lat: 6.5,   lng: 3.4,   country: "Nigeria",              severity: "high",   cases: 1240, color: "#ef4444" },
  { id: 2,  disease: "Cholera",       lat: 15.5,  lng: 32.5,  country: "Sudan",                severity: "high",   cases: 890,  color: "#ef4444" },
  { id: 3,  disease: "Influenza",     lat: -1.3,  lng: 36.8,  country: "Kenya",                severity: "medium", cases: 430,  color: "#f97316" },
  { id: 5,  disease: "Tuberculosis",  lat: 14.7,  lng: -17.4, country: "Senegal",              severity: "medium", cases: 310,  color: "#f97316" },
  { id: 7,  disease: "Chicken Pox",   lat: -8.8,  lng: 13.2,  country: "Angola",               severity: "low",    cases: 190,  color: "#4aad2a" },
  { id: 8,  disease: "Measles",       lat: 12.4,  lng: -1.5,  country: "Burkina Faso",         severity: "high",   cases: 780,  color: "#ef4444" },
  { id: 9,  disease: "Influenza",     lat: 17.6,  lng: -3.9,  country: "Mali",                 severity: "low",    cases: 220,  color: "#4aad2a" },
  { id: 10, disease: "Malaria",       lat: -13.9, lng: 33.8,  country: "Malawi",               severity: "high",   cases: 1560, color: "#ef4444" },
  { id: 12, disease: "Cholera",       lat: -17.7, lng: 31.0,  country: "Zimbabwe",             severity: "medium", cases: 490,  color: "#f97316" },
  { id: 13, disease: "Typhoid",       lat: 9.1,   lng: 40.5,  country: "Ethiopia",             severity: "low",    cases: 260,  color: "#4aad2a" },
  { id: 14, disease: "Measles",       lat: 3.8,   lng: 11.5,  country: "Cameroon",             severity: "medium", cases: 340,  color: "#f97316" },
  { id: 15, disease: "Malaria",       lat: 5.6,   lng: -0.2,  country: "Ghana",                severity: "medium", cases: 920,  color: "#f97316" },
  { id: 16, disease: "Cholera",       lat: -25.9, lng: 32.6,  country: "Mozambique",           severity: "high",   cases: 1100, color: "#ef4444" },
  { id: 17, disease: "Tuberculosis",  lat: -29.0, lng: 25.0,  country: "South Africa",         severity: "medium", cases: 540,  color: "#f97316" },
  // Asia
  { id: 4,  disease: "Dengue",        lat: 23.8,  lng: 90.4,  country: "Bangladesh",           severity: "high",   cases: 2100, color: "#ef4444" },
  { id: 6,  disease: "Typhoid",       lat: 33.7,  lng: 73.1,  country: "Pakistan",             severity: "medium", cases: 670,  color: "#f97316" },
  { id: 11, disease: "Dengue",        lat: 13.1,  lng: 80.3,  country: "India",                severity: "medium", cases: 3400, color: "#f97316" },
  { id: 18, disease: "Influenza",     lat: 35.6,  lng: 139.7, country: "Japan",                severity: "low",    cases: 890,  color: "#4aad2a" },
  { id: 19, disease: "Dengue",        lat: 14.1,  lng: 100.5, country: "Thailand",             severity: "medium", cases: 1200, color: "#f97316" },
  // United Kingdom
  { id: 20, disease: "Influenza",     lat: 51.5,  lng: -0.1,  country: "United Kingdom",       severity: "medium", cases: 3200, color: "#f97316" },
  { id: 21, disease: "Measles",       lat: 53.8,  lng: -1.5,  country: "United Kingdom",       severity: "low",    cases: 140,  color: "#4aad2a" },
  { id: 22, disease: "Tuberculosis",  lat: 52.5,  lng: -1.9,  country: "United Kingdom",       severity: "low",    cases: 95,   color: "#4aad2a" },
  { id: 23, disease: "Chicken Pox",   lat: 55.8,  lng: -4.2,  country: "United Kingdom",       severity: "low",    cases: 210,  color: "#4aad2a" },
  // Europe
  { id: 24, disease: "Influenza",     lat: 48.8,  lng: 2.3,   country: "France",               severity: "medium", cases: 2800, color: "#f97316" },
  { id: 25, disease: "Measles",       lat: 41.9,  lng: 12.5,  country: "Italy",                severity: "medium", cases: 310,  color: "#f97316" },
  { id: 26, disease: "Influenza",     lat: 52.5,  lng: 13.4,  country: "Germany",              severity: "low",    cases: 1900, color: "#4aad2a" },
  // North America
  { id: 27, disease: "Influenza",     lat: 40.7,  lng: -74.0, country: "USA (New York)",       severity: "medium", cases: 4100, color: "#f97316" },
  { id: 28, disease: "Measles",       lat: 34.0,  lng: -118.2,country: "USA (California)",     severity: "low",    cases: 88,   color: "#4aad2a" },
  { id: 29, disease: "Influenza",     lat: 41.8,  lng: -87.6, country: "USA (Chicago)",        severity: "medium", cases: 2600, color: "#f97316" },
  { id: 30, disease: "Typhoid",       lat: 29.8,  lng: -95.4, country: "USA (Texas)",          severity: "low",    cases: 55,   color: "#4aad2a" },
  { id: 32, disease: "Influenza",     lat: 43.7,  lng: -79.4, country: "Canada",               severity: "low",    cases: 1400, color: "#4aad2a" },
  { id: 33, disease: "Measles",       lat: 19.4,  lng: -99.1, country: "Mexico",               severity: "medium", cases: 430,  color: "#f97316" },
  { id: 34, disease: "Dengue",        lat: 15.5,  lng: -88.0, country: "Honduras",             severity: "high",   cases: 890,  color: "#ef4444" },
  // South America
  { id: 35, disease: "Dengue",        lat: -23.5, lng: -46.6, country: "Brazil (Sao Paulo)",   severity: "high",   cases: 5800, color: "#ef4444" },
  { id: 36, disease: "Malaria",       lat: -3.1,  lng: -60.0, country: "Brazil (Amazon)",      severity: "high",   cases: 2200, color: "#ef4444" },
  { id: 37, disease: "Cholera",       lat: -0.2,  lng: -78.5, country: "Ecuador",              severity: "medium", cases: 310,  color: "#f97316" },
  { id: 38, disease: "Dengue",        lat: -12.0, lng: -77.0, country: "Peru",                 severity: "medium", cases: 980,  color: "#f97316" },
  { id: 39, disease: "Influenza",     lat: -34.6, lng: -58.4, country: "Argentina",            severity: "low",    cases: 1700, color: "#4aad2a" },
  { id: 40, disease: "Typhoid",       lat: 4.7,   lng: -74.1, country: "Colombia",             severity: "low",    cases: 190,  color: "#4aad2a" },
  { id: 41, disease: "Dengue",        lat: 10.5,  lng: -66.9, country: "Venezuela",            severity: "high",   cases: 1340, color: "#ef4444" },
  { id: 42, disease: "Malaria",       lat: 5.8,   lng: -55.2, country: "Suriname",             severity: "medium", cases: 410,  color: "#f97316" },
  // Extra cluster points for heat map density — West Africa Malaria cluster
  { id: 43, disease: "Malaria",       lat: 7.4,   lng: 4.0,   country: "Nigeria",              severity: "high",   cases: 870,  color: "#ef4444" },
  { id: 44, disease: "Malaria",       lat: 5.5,   lng: 0.2,   country: "Ghana",                severity: "high",   cases: 640,  color: "#ef4444" },
  { id: 45, disease: "Malaria",       lat: 8.5,   lng: 2.1,   country: "Benin",                severity: "high",   cases: 510,  color: "#ef4444" },
  { id: 46, disease: "Malaria",       lat: 6.3,   lng: 1.2,   country: "Togo",                 severity: "medium", cases: 290,  color: "#f97316" },
  // Brazil Dengue cluster
  { id: 47, disease: "Dengue",        lat: -22.9, lng: -43.2, country: "Brazil (Rio)",         severity: "high",   cases: 3100, color: "#ef4444" },
  { id: 48, disease: "Dengue",        lat: -25.4, lng: -49.3, country: "Brazil (Curitiba)",    severity: "high",   cases: 1800, color: "#ef4444" },
  { id: 49, disease: "Dengue",        lat: -19.9, lng: -44.0, country: "Brazil (Belo Horiz.)", severity: "medium", cases: 1200, color: "#f97316" },
  // South/Southeast Asia Dengue cluster
  { id: 50, disease: "Dengue",        lat: 10.8,  lng: 106.7, country: "Vietnam",              severity: "high",   cases: 2400, color: "#ef4444" },
  { id: 51, disease: "Dengue",        lat: 3.1,   lng: 101.7, country: "Malaysia",             severity: "high",   cases: 1600, color: "#ef4444" },
  { id: 52, disease: "Dengue",        lat: 1.3,   lng: 103.8, country: "Singapore",            severity: "medium", cases: 540,  color: "#f97316" },
  { id: 53, disease: "Dengue",        lat: 12.9,  lng: 77.6,  country: "India (Bangalore)",    severity: "medium", cases: 980,  color: "#f97316" },
  // East Africa Cholera cluster
  { id: 54, disease: "Cholera",       lat: 2.0,   lng: 45.3,  country: "Somalia",              severity: "high",   cases: 730,  color: "#ef4444" },
  { id: 55, disease: "Cholera",       lat: -6.2,  lng: 35.7,  country: "Tanzania",             severity: "medium", cases: 420,  color: "#f97316" },
  { id: 56, disease: "Cholera",       lat: -3.4,  lng: 29.9,  country: "Burundi",              severity: "high",   cases: 610,  color: "#ef4444" },
  // Central America Dengue cluster
  { id: 57, disease: "Dengue",        lat: 13.7,  lng: -89.2, country: "El Salvador",          severity: "high",   cases: 670,  color: "#ef4444" },
  { id: 58, disease: "Dengue",        lat: 14.6,  lng: -90.5, country: "Guatemala",            severity: "high",   cases: 820,  color: "#ef4444" },
  { id: 59, disease: "Dengue",        lat: 12.1,  lng: -86.3, country: "Nicaragua",            severity: "medium", cases: 440,  color: "#f97316" },
];

const DISEASE_ADVICE: Record<string, { prevention: string[]; symptoms: string[]; action: string }> = {
  Malaria:       { prevention: ["Sleep under insecticide-treated bed nets", "Use mosquito repellent with DEET", "Wear long sleeves and trousers at dusk", "Take antimalarial prophylaxis if prescribed"], symptoms: ["High fever and chills", "Headache and muscle pain", "Nausea and vomiting", "Fatigue and sweating"], action: "Seek medical care immediately if fever develops. Early diagnosis and treatment is critical." },
  Cholera:       { prevention: ["Drink only boiled or bottled water", "Wash hands thoroughly with soap", "Eat only thoroughly cooked food", "Avoid raw vegetables and unpeeled fruits"], symptoms: ["Sudden watery diarrhea", "Vomiting", "Muscle cramps", "Rapid dehydration"], action: "Rehydrate immediately with oral rehydration salts. Go to a health facility urgently." },
  Influenza:     { prevention: ["Get vaccinated annually if available", "Wash hands frequently", "Avoid close contact with sick people", "Cover mouth when coughing or sneezing"], symptoms: ["Sudden fever", "Cough and sore throat", "Body aches", "Fatigue"], action: "Rest, stay hydrated, and isolate from others. Seek care if symptoms worsen rapidly." },
  Dengue:        { prevention: ["Eliminate standing water around your home", "Use mosquito repellent during daytime", "Wear protective clothing", "Use window and door screens"], symptoms: ["High fever (40°C)", "Severe headache behind eyes", "Rash on skin", "Severe joint and muscle pain"], action: "No specific treatment exists. Stay hydrated, avoid aspirin. Seek hospital care immediately for severe symptoms." },
  Tuberculosis:  { prevention: ["Ensure good ventilation in living spaces", "Get BCG vaccination for children", "Avoid prolonged contact with known TB patients", "Maintain good nutrition to boost immunity"], symptoms: ["Persistent cough lasting 3+ weeks", "Coughing blood", "Night sweats", "Unexplained weight loss"], action: "See a healthcare worker for testing. TB is curable with a full course of antibiotics — do not stop treatment early." },
  Typhoid:       { prevention: ["Drink only safe, treated water", "Wash hands before eating and after using toilet", "Avoid food from street vendors if hygiene is uncertain", "Get vaccinated if available"], symptoms: ["Sustained high fever", "Weakness and fatigue", "Abdominal pain", "Rose-colored spots on chest"], action: "Antibiotics are effective. Seek medical diagnosis and complete the full course of treatment." },
  "Chicken Pox": { prevention: ["Vaccinate children if vaccines are available", "Avoid contact with infected individuals", "Do not share personal items", "Isolate infected people until all blisters crust over"], symptoms: ["Itchy blister-like rash", "Fever and fatigue", "Loss of appetite", "Headache"], action: "Mostly self-limiting. Keep rash clean, avoid scratching. Seek care for severe cases, especially in adults." },
  Measles:       { prevention: ["Ensure children are vaccinated (MMR)", "Isolate infected individuals immediately", "Maintain vitamin A intake", "Avoid crowded places during outbreaks"], symptoms: ["High fever", "Runny nose and cough", "Red watery eyes", "Distinctive red rash starting on face"], action: "Vaccination is the best protection. If infected, isolate immediately and seek medical care to prevent complications." },
};

type Outbreak = typeof OUTBREAKS[0];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderMarkdown(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "#111", display: "block", marginTop: "12px", marginBottom: "4px", fontSize: "13px" }}>{part}</strong>
      : <span key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.8 }}>{part}</span>
  );
}

export function PublicPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatLayerRef = useRef<any>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nearbyOutbreaks, setNearbyOutbreaks] = useState<(Outbreak & { distance: number })[]>([]);
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "high" | "medium" | "low">("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  // ── AI advice via useCallback so ref stays fresh ──
  const generateAIAdvice = useCallback(async (outbreaks: (Outbreak & { distance: number })[], locationName: string) => {
    setLoadingAI(true);
    setAiAdvice("");
    setAiPanelOpen(true);
    setSidebarOpen(true);

    const outbreakSummary = outbreaks
      .slice(0, 5)
      .map(o => `${o.disease} in ${o.country} (${Math.round(o.distance)}km away, ${o.severity} severity, ${o.cases} cases)`)
      .join("; ");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a public health advisor for EpiRadar, helping communities in developing countries stay safe during disease outbreaks.
Give clear, practical, culturally-sensitive advice. Use simple language. Be empathetic but not alarmist.
Format your response in exactly 3 sections using **bold** headers:
**Situation Overview**
2-3 sentences summarizing the nearby threats.

**Your Top 3 Priorities**
1. First action
2. Second action
3. Third action

**When To Seek Help**
1-2 sentences on when to visit a clinic or hospital.

Keep total response under 250 words. Focus on steps available in low-resource settings.`,
          messages: [{
            role: "user",
            content: `I am located near ${locationName}. Nearby disease outbreaks: ${outbreakSummary}. What should I do to protect myself and my family?`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.map((c: any) => c.text || "").join("") || "";
      setAiAdvice(text || "Unable to generate advice. Please consult your local health authority.");
    } catch {
      setAiAdvice("Unable to connect. Please consult your local health authority or visit the nearest health clinic for guidance.");
    }
    setLoadingAI(false);
  }, []);

  // Keep a ref so the global popup callback always calls the latest version
  const generateAIAdviceRef = useRef(generateAIAdvice);
  useEffect(() => { generateAIAdviceRef.current = generateAIAdvice; }, [generateAIAdvice]);

  // ── Global popup button handler ──
  useEffect(() => {
    (window as any)._epiSelectLocation = (lat: number, lng: number, locationName: string) => {
      if (leafletMapRef.current) leafletMapRef.current.closePopup();
      setUserLocation({ lat, lng, name: locationName });
      const all = OUTBREAKS.map(ob => ({ ...ob, distance: haversineDistance(lat, lng, ob.lat, ob.lng) })).sort((a, b) => a.distance - b.distance);
      const nearby = all.filter(ob => ob.distance < 2000);
      setNearbyOutbreaks(nearby);
      generateAIAdviceRef.current(nearby.length > 0 ? nearby : all.slice(0, 5), locationName);
    };
    return () => { delete (window as any)._epiSelectLocation; };
  }, []);

  // ── Load Leaflet ──
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // Load leaflet.heat after leaflet is ready
      const heatScript = document.createElement("script");
      heatScript.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
      heatScript.onload = () => setMapReady(true);
      document.head.appendChild(heatScript);
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(link); document.head.removeChild(script); };
  }, []);

  // ── Init map ──
  useEffect(() => {
    if (!mapReady || !mapRef.current || leafletMapRef.current) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current, { zoomControl: false }).setView([10, 20], 3);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { attribution: "© OpenStreetMap © CARTO", maxZoom: 18 }).addTo(map);
    leafletMapRef.current = map;
    renderMarkers(map, OUTBREAKS);
  }, [mapReady]);

  // Zones ref for cleanup
  const zonesRef = useRef<any[]>([]);

  function buildZones(map: any, outbreaks: Outbreak[]) {
    const L = (window as any).L;

    // Clear old zones
    zonesRef.current.forEach(z => map.removeLayer(z));
    zonesRef.current = [];

    // Draw a filled circle zone per outbreak — radius & opacity driven by severity & cases
    outbreaks.forEach(ob => {
      const baseRadius = ob.severity === "high" ? 180000 : ob.severity === "medium" ? 120000 : 75000;
      const caseBoost  = Math.min(ob.cases / 2000, 1.4);
      const radius     = baseRadius * (0.7 + 0.3 * caseBoost);
      const fillAlpha  = ob.severity === "high" ? 0.16 : ob.severity === "medium" ? 0.1 : 0.06;
      const borderAlpha = ob.severity === "high" ? 0.55 : ob.severity === "medium" ? 0.4 : 0.25;

      const zone = L.circle([ob.lat, ob.lng], {
        radius,
        color:       ob.color,
        weight:      1.5,
        opacity:     borderAlpha,
        fillColor:   ob.color,
        fillOpacity: fillAlpha,
        dashArray:   ob.severity === "low" ? "4 4" : undefined,
      }).addTo(map);
      zonesRef.current.push(zone);
    });

    // For same-disease clusters within 1400km, draw a connecting bridge zone
    // that visually links the two outbreak circles to show regional spread
    const groups: Record<string, Outbreak[]> = {};
    outbreaks.forEach(ob => { if (!groups[ob.disease]) groups[ob.disease] = []; groups[ob.disease].push(ob); });

    Object.values(groups).forEach(grp => {
      if (grp.length < 2) return;
      for (let i = 0; i < grp.length; i++) {
        for (let j = i + 1; j < grp.length; j++) {
          const a = grp[i], b = grp[j];
          const dist = haversineDistance(a.lat, a.lng, b.lat, b.lng);
          if (dist > 1400) continue;

          const severity = (a.severity === "high" || b.severity === "high") ? "high"
                         : (a.severity === "medium" || b.severity === "medium") ? "medium" : "low";
          const fillAlpha   = severity === "high" ? 0.09 : severity === "medium" ? 0.06 : 0.03;
          const strokeAlpha = severity === "high" ? 0.3  : severity === "medium" ? 0.2  : 0.12;

          // Place intermediate circles along the corridor at 25%, 50%, 75%
          [0.25, 0.5, 0.75].forEach(t => {
            const lat = a.lat + (b.lat - a.lat) * t;
            const lng = a.lng + (b.lng - a.lng) * t;
            // Bridge circle radius tapers — widest in middle
            const taper = 1 - Math.abs(t - 0.5) * 0.8;
            const bridgeR = (severity === "high" ? 110000 : severity === "medium" ? 75000 : 50000) * taper;
            const bridge = L.circle([lat, lng], {
              radius: bridgeR,
              color: a.color, weight: 0, opacity: 0,
              fillColor: a.color, fillOpacity: fillAlpha,
            }).addTo(map);
            zonesRef.current.push(bridge);
          });

          // Dashed polyline connecting the two dots as a visual "spread path"
          const line = L.polyline([[a.lat, a.lng],[b.lat, b.lng]], {
            color: a.color, weight: 1.5, opacity: strokeAlpha, dashArray: "5 8",
          }).addTo(map);
          zonesRef.current.push(line);
        }
      }
    });
  }

  function renderMarkers(map: any, outbreaks: Outbreak[]) {
    const L = (window as any).L;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    buildZones(map, outbreaks);
    outbreaks.forEach(ob => {
      const size = ob.severity === "high" ? 22 : ob.severity === "medium" ? 16 : 12;
      const pulse = size + 14;
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:${pulse}px;height:${pulse}px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:${ob.color};opacity:0.18;animation:epi-pulse 2s infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${size}px;height:${size}px;border-radius:50%;background:${ob.color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;"></div>
        </div>`,
        iconSize: [pulse, pulse],
        iconAnchor: [pulse / 2, pulse / 2],
      });
      const marker = L.marker([ob.lat, ob.lng], { icon }).addTo(map).bindPopup(`
        <div style="font-family:system-ui;min-width:200px;padding:6px 2px">
          <div style="font-weight:800;font-size:15px;color:#111;margin-bottom:3px">${ob.disease}</div>
          <div style="color:#6b7280;font-size:12px;margin-bottom:10px">${ob.country}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
            <span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:${ob.severity === "high" ? "#fee2e2" : ob.severity === "medium" ? "#ffedd5" : "#dcfce7"};color:${ob.severity === "high" ? "#dc2626" : ob.severity === "medium" ? "#ea580c" : "#16a34a"}">${ob.severity.toUpperCase()}</span>
            <span style="font-size:12px;color:#374151;font-weight:600">${ob.cases.toLocaleString()} cases</span>
          </div>
          <button onclick="window._epiSelectLocation(${ob.lat}, ${ob.lng}, '${ob.country}')"
            style="width:100%;padding:9px 0;border-radius:9px;border:none;background:#4aad2a;color:white;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:0.01em;">
            📍 Get AI Advice for This Area
          </button>
        </div>`, { maxWidth: 230 });
      markersRef.current.push(marker);
    });
  }

  useEffect(() => {
    if (!leafletMapRef.current || !mapReady) return;
    const filtered = filterSeverity === "all" ? OUTBREAKS : OUTBREAKS.filter(o => o.severity === filterSeverity);
    renderMarkers(leafletMapRef.current, filtered);
  }, [filterSeverity, mapReady]);

  const getLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let name = "Your location";
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          name = data.address?.city || data.address?.town || data.address?.state || data.address?.country || "Your location";
        } catch {}
        setUserLocation({ lat, lng, name });
        setLoadingLocation(false);
        if (leafletMapRef.current) {
          const L = (window as any).L;
          const userIcon = L.divIcon({ className: "", html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 2px 12px rgba(37,99,235,0.5)"></div>`, iconSize: [16,16], iconAnchor: [8,8] });
          L.marker([lat, lng], { icon: userIcon }).addTo(leafletMapRef.current).bindPopup("<b>You are here</b>").openPopup();
          leafletMapRef.current.flyTo([lat, lng], 5, { duration: 2 });
        }
        const all = OUTBREAKS.map(ob => ({ ...ob, distance: haversineDistance(lat, lng, ob.lat, ob.lng) })).sort((a, b) => a.distance - b.distance);
        const nearby = all.filter(ob => ob.distance < 2000);
        setNearbyOutbreaks(nearby);
        generateAIAdvice(nearby.length > 0 ? nearby : all.slice(0, 5), name);
      },
      () => { setLoadingLocation(false); setLocationError("Location access denied. Showing global outbreak data."); }
    );
  };

  const severityCount = (s: string) => OUTBREAKS.filter(o => o.severity === s).length;
  const displayList: any[] = userLocation ? nearbyOutbreaks : OUTBREAKS;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`
        @keyframes epi-pulse { 0%,100%{transform:scale(1);opacity:0.18} 50%{transform:scale(2);opacity:0} }
        @keyframes epi-ping  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes epi-spin  { to{transform:rotate(360deg)} }
        @keyframes epi-in    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes epi-modal { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        .epi-list-card { transition: background 0.15s, border-color 0.15s; }
        .epi-list-card:hover { background: #f0faf0 !important; border-color: #d4edcf !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="#f0faf0"; b.style.borderColor="#d4edcf"; b.style.color="#4aad2a"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="#f9fafb"; b.style.borderColor="#e5e7eb"; b.style.color="#374151"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Home
          </button>
          <div style={{ width: "1px", height: "26px", background: "#e5e7eb" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4aad2a", boxShadow: "0 0 0 3px rgba(74,173,42,0.2)", animation: "epi-ping 2s infinite" }} />
            <h1 style={{ fontSize: "17px", fontWeight: 800, color: "#111", letterSpacing: "-0.03em", margin: 0 }}>
              EpiRadar <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "14px" }}>/ Public Health Portal</span>
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user && <span style={{ fontSize: "12px", color: "#9ca3af", marginRight: "4px" }}>Hi, {user.name}</span>}
          {/* Severity filters */}
          {(["all", "high", "medium", "low"] as const).map(s => (
            <button key={s} onClick={() => setFilterSeverity(s)} style={{
              padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              background: filterSeverity === s ? (s === "high" ? "#fee2e2" : s === "medium" ? "#ffedd5" : s === "low" ? "#dcfce7" : "#111") : "#f3f4f6",
              color: filterSeverity === s ? (s === "high" ? "#dc2626" : s === "medium" ? "#ea580c" : s === "low" ? "#16a34a" : "#fff") : "#6b7280",
              border: `1px solid ${filterSeverity === s ? (s === "high" ? "#fca5a5" : s === "medium" ? "#fdba74" : s === "low" ? "#86efac" : "transparent") : "#e5e7eb"}`,
            }}>
              {s === "all" ? `All (${OUTBREAKS.length})` : `${s[0].toUpperCase() + s.slice(1)} (${severityCount(s)})`}
            </button>
          ))}
          <div style={{ width: "1px", height: "26px", background: "#e5e7eb", margin: "0 4px" }} />
          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "9px", border: `1px solid ${sidebarOpen ? "#d4edcf" : "#e5e7eb"}`, background: sidebarOpen ? "#f0faf0" : "#f9fafb", color: sidebarOpen ? "#4aad2a" : "#6b7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>
            {sidebarOpen ? "Hide Panel" : "Show Panel"}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

          {/* Locate me */}
          <button onClick={getLocation} disabled={loadingLocation} style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, padding: "10px 22px", borderRadius: "999px", background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "13px", fontWeight: 700, color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", transition: "box-shadow 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}>
            {loadingLocation
              ? <div style={{ width: "13px", height: "13px", border: "2px solid #e5e7eb", borderTopColor: "#4aad2a", borderRadius: "50%", animation: "epi-spin 0.8s linear infinite" }} />
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4aad2a" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
            }
            {loadingLocation ? "Locating…" : userLocation ? `📍 ${userLocation.name}` : "Locate Me"}
          </button>

          {locationError && (
            <div style={{ position: "absolute", top: "60px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", color: "#ea580c", whiteSpace: "nowrap" }}>
              {locationError}
            </div>
          )}

          {/* Legend */}
          <div style={{ position: "absolute", bottom: "40px", left: "16px", zIndex: 1000, background: "rgba(255,255,255,0.96)", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "8px", textTransform: "uppercase" }}>Severity</div>
            {[["#ef4444","High"],["#f97316","Medium"],["#4aad2a","Low"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                <span style={{ fontSize: "12px", color: "#374151" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disease detail modal — floats left of sidebar ── */}
        {selectedOutbreak && DISEASE_ADVICE[selectedOutbreak.disease] && (
          <div style={{
            position: "absolute",
            right: sidebarOpen ? "416px" : "16px",
            top: "16px",
            width: "300px",
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
            border: "1px solid #e5e7eb",
            zIndex: 800,
            animation: "epi-modal 0.25s ease",
            overflow: "hidden",
            transition: "right 0.3s ease",
          }}>
            {/* Header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedOutbreak.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#111" }}>{selectedOutbreak.disease}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>{selectedOutbreak.country} · {selectedOutbreak.cases.toLocaleString()} cases</div>
                <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px",
                  background: selectedOutbreak.severity === "high" ? "#fee2e2" : selectedOutbreak.severity === "medium" ? "#ffedd5" : "#dcfce7",
                  color: selectedOutbreak.severity === "high" ? "#dc2626" : selectedOutbreak.severity === "medium" ? "#ea580c" : "#16a34a" }}>
                  {selectedOutbreak.severity.toUpperCase()} SEVERITY
                </span>
              </div>
              <button onClick={() => setSelectedOutbreak(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>×</button>
            </div>

            <div style={{ padding: "16px 20px", maxHeight: "55vh", overflowY: "auto" }}>
              {/* Action */}
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#c2410c", lineHeight: 1.65 }}>
                ⚠️ <strong>Action:</strong> {DISEASE_ADVICE[selectedOutbreak.disease].action}
              </div>

              {/* Prevention */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Prevention</div>
                {DISEASE_ADVICE[selectedOutbreak.disease].prevention.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f0faf0", color: "#4aad2a", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>✓</div>
                    <span style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{p}</span>
                  </div>
                ))}
              </div>

              {/* Symptoms */}
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Watch for Symptoms</div>
                {DISEASE_ADVICE[selectedOutbreak.disease].symptoms.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f0f0f0", fontSize: "12px", color: "#374151", marginBottom: "5px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedOutbreak.color, flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Sidebar ── */}
        <div style={{ width: sidebarOpen ? "400px" : "0px", flexShrink: 0, borderLeft: sidebarOpen ? "1px solid #e5e7eb" : "none", background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.3s ease" }}>
          <div style={{ width: "400px", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* AI Advice Section */}
            <div style={{ borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              {/* Collapsible header */}
              <button onClick={() => setAiPanelOpen(v => !v)} style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", borderBottom: aiPanelOpen ? "1px solid #f5f5f5" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#f0faf0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4aad2a" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "1px" }}>AI Health Advisor</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {loadingAI ? "Generating…" : aiAdvice ? `Advice for ${userLocation?.name ?? "your area"}` : "Tap a map dot to get advice"}
                    </div>
                  </div>
                  {(loadingAI || aiAdvice) && (
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "#f0faf0", color: "#4aad2a", fontWeight: 700, border: "1px solid #d4edcf", flexShrink: 0 }}>Claude</span>
                  )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{ transform: aiPanelOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {aiPanelOpen && (
                <div style={{ padding: "16px 20px 20px", maxHeight: "300px", overflowY: "auto", animation: "epi-in 0.2s ease" }}>
                  {!userLocation && !loadingAI && !aiAdvice && (
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "1px dashed #e5e7eb", textAlign: "center" }}>
                      <div style={{ fontSize: "32px", marginBottom: "10px" }}>🗺️</div>
                      <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, lineHeight: 1.7 }}>
                        Use <strong style={{ color: "#4aad2a" }}>Locate Me</strong> to detect your position, or tap any <strong style={{ color: "#4aad2a" }}>outbreak dot</strong> on the map and click <em>"Get AI Advice"</em>.
                      </p>
                    </div>
                  )}

                  {loadingAI && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {[100, 70, 85, 55, 75].map((w, i) => (
                        <div key={i} style={{ height: "11px", borderRadius: "6px", background: "#f0faf0", width: `${w}%` }} />
                      ))}
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "10px", height: "10px", border: "2px solid #d4edcf", borderTopColor: "#4aad2a", borderRadius: "50%", animation: "epi-spin 0.8s linear infinite" }} />
                        Analyzing disease data near you…
                      </div>
                    </div>
                  )}

                  {aiAdvice && !loadingAI && (
                    <div style={{ animation: "epi-in 0.3s ease" }}>
                      {userLocation && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", padding: "6px 10px", background: "#f0faf0", borderRadius: "8px", border: "1px solid #d4edcf" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "#4aad2a", fontWeight: 600 }}>Advice for {userLocation.name}</span>
                        </div>
                      )}
                      <div>{renderMarkdown(aiAdvice)}</div>
                      <button onClick={() => { if (userLocation) generateAIAdvice(nearbyOutbreaks.length > 0 ? nearbyOutbreaks : OUTBREAKS.map(ob => ({...ob, distance: haversineDistance(userLocation.lat, userLocation.lng, ob.lat, ob.lng)})), userLocation.name); }}
                        style={{ marginTop: "14px", width: "100%", padding: "8px", borderRadius: "9px", border: "1px solid #d4edcf", background: "#f0faf0", color: "#4aad2a", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                        ↻ Refresh Advice
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Outbreak list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "14px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1, borderBottom: "1px solid #f9f9f9" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {userLocation ? `Near ${userLocation.name}` : "Active Outbreaks"}
                </span>
                <span style={{ fontSize: "11px", color: "#d1d5db", fontWeight: 500 }}>{displayList.length} shown</span>
              </div>

              {displayList.length === 0 && (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
                  <div style={{ fontSize: "13px", color: "#9ca3af" }}>No outbreaks within 2,000 km of your location.</div>
                </div>
              )}

              <div style={{ padding: "8px 12px 16px" }}>
                {displayList.map((ob: any) => (
                  <div key={ob.id} className="epi-list-card" onClick={() => {
                    setSelectedOutbreak(prev => prev?.id === ob.id ? null : ob);
                    if (leafletMapRef.current) leafletMapRef.current.flyTo([ob.lat, ob.lng], 6, { duration: 1.2 });
                  }} style={{
                    padding: "14px 16px", borderRadius: "12px", marginBottom: "6px",
                    border: `1px solid ${selectedOutbreak?.id === ob.id ? "#d4edcf" : "#f0f0f0"}`,
                    background: selectedOutbreak?.id === ob.id ? "#f0faf0" : "#fafafa",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: ob.color, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{ob.disease}</div>
                          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>
                            {ob.country}{ob.distance != null ? ` · ${Math.round(ob.distance).toLocaleString()} km` : ""}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                          background: ob.severity === "high" ? "#fee2e2" : ob.severity === "medium" ? "#ffedd5" : "#dcfce7",
                          color: ob.severity === "high" ? "#dc2626" : ob.severity === "medium" ? "#ea580c" : "#16a34a" }}>
                          {ob.severity.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{ob.cases.toLocaleString()} cases</span>
                      </div>
                    </div>
                    {selectedOutbreak?.id === ob.id && (
                      <div style={{ marginTop: "8px", fontSize: "11px", color: "#4aad2a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                        Disease info shown on left
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}