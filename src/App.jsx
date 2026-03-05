import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Menu, X, ArrowRight, Crosshair, Map as MapIcon, ShieldAlert, Activity, Wifi, CheckCircle2, Lock, MousePointer2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    const mainRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Setup default smooth appearance
            gsap.utils.toArray('.fade-up').forEach(elem => {
                gsap.fromTo(elem,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="bg-primary text-background min-h-screen font-sans font-light selection:bg-accent/30 selection:text-accent overflow-hidden">
            <Navbar />
            <main>
                <MapIntegrationSection />
                <HeroSection />
                <FeaturesSection />
                <PhilosophySection />
                <ProtocolSection />
            </main>
            <Footer />
        </div>
    );
}

function Navbar() {
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 rounded-full px-6 py-4 flex items-center justify-between
        ${scrolled ? 'bg-primary/70 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent'}
      `}
        >
            <div className="flex items-center gap-2">
                <RadarIcon className="text-accent w-6 h-6 animate-pulse" />
                <span className="font-bold text-lg tracking-tight">EpiRadar</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-background/80">
                <a href="#features" className="hover:text-accent transition-colors">Intelligence</a>
                <a href="#protocol" className="hover:text-accent transition-colors">Protocol</a>
                <a href="#map" className="hover:text-accent transition-colors">Live Map</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <a href="#map" className="btn-magnetic px-5 py-2.5 rounded-full bg-accent text-primary font-semibold text-sm">
                    <span className="relative z-10 flex items-center gap-2">View Reports <ArrowRight className="w-4 h-4" /></span>
                </a>
            </div>

            <button className="md:hidden text-background" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full mt-4 bg-primary/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 md:hidden">
                    <a href="#features" className="text-lg font-medium">Intelligence</a>
                    <a href="#protocol" className="text-lg font-medium">Protocol</a>
                    <a href="#map" className="text-lg font-medium">Live Map</a>
                    <a href="#map" className="mt-4 text-center px-5 py-3 rounded-full bg-accent text-primary font-bold">View Reports</a>
                </div>
            )}
        </nav>
    );
}

function RadarIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
            <path d="M4 6h.01" />
            <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
            <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
            <path d="M12 18h.01" />
            <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
            <circle cx="12" cy="12" r="2" />
            <path d="m13.41 10.59 5.66-5.66" />
        </svg>
    );
}

function HeroSection() {
    const comp = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from(".hero-text", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out",
                delay: 0.2
            }).from(".hero-btn", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6");
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} className="relative w-full min-h-[100dvh] flex items-center py-32">
            {/* Background Image & Gradient */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070&auto=format&fit=crop"
                    alt="Dark City Grid"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-9 lg:col-span-8">
                    <div className="flex flex-col gap-4">
                        <h1 className="flex flex-col gap-2">
                            <span className="hero-text text-5xl md:text-7xl font-sans font-bold tracking-tight text-background">
                                Vigilance meets
                            </span>
                            <span className="hero-text text-7xl md:text-[8rem] leading-[0.9] font-serif italic text-accent pb-4">
                                Precision.
                            </span>
                        </h1>
                        <p className="hero-text text-xl md:text-2xl font-light text-background/80 max-w-2xl mt-4">
                            Real-time outbreak tracking and proximity intelligence. See the unseen threats and nearest hospitals.
                        </p>
                        <div className="hero-btn mt-8 flex flex-col sm:flex-row gap-4">
                            <a href="#map" className="btn-magnetic px-8 py-4 rounded-full bg-accent text-primary font-bold text-lg inline-flex items-center gap-3">
                                Access Live Radar <Crosshair className="w-5 h-5" />
                                <span className="btn-hover-layer"></span>
                            </a>
                            <a href="#features" className="btn-magnetic px-8 py-4 rounded-full bg-white/5 border border-white/10 text-background font-medium text-lg inline-flex items-center gap-3 backdrop-blur-sm">
                                System Overview
                                <span className="btn-hover-layer"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section id="features" className="py-32 px-6 w-full max-w-7xl mx-auto relative z-10">
            <div className="fade-up mb-20 text-center md:text-left">
                <p className="text-accent font-mono text-sm tracking-widest uppercase mb-4">Core Systems</p>
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-background mb-6">Interactive Functional Artifacts</h2>
                <p className="text-lg text-background/60 max-w-2xl">A suite of precision tools designed to dissect regional anomaly reports and communicate actionable safety intelligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DiagnosticShufflerCard />
                <TelemetryTypewriterCard />
                <CursorProtocolSchedulerCard />
            </div>
        </section>
    );
}

function DiagnosticShufflerCard() {
    const [cards, setCards] = useState([
        { id: 1, title: "Real-time Detection", desc: "Instant pattern recognition of sudden localized health anomalies." },
        { id: 2, title: "Proximity Warnings", desc: "Geofenced alerts immediately when you enter high-risk coordinates." },
        { id: 3, title: "Threat Assessment", desc: "AI-driven severity scoring based on regional density and report velocity." }
    ]);
    const containerRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const next = [...prev];
                const last = next.pop();
                next.unshift(last);
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fade-up bg-[#1A1A24] rounded-[2rem] border border-white/5 p-8 flex flex-col h-[400px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-xl">Alert Triage</h3>
            </div>

            <div ref={containerRef} className="relative flex-1 mt-4">
                {cards.map((curr, idx) => {
                    const isTop = idx === 0;
                    return (
                        <div
                            key={curr.id}
                            className="absolute top-0 left-0 w-full p-6 bg-primary border border-white/10 rounded-2xl shadow-xl transition-all duration-700 ease-in-out"
                            style={{
                                transform: `translateY(${idx * 16}px) scale(${1 - idx * 0.05})`,
                                opacity: 1 - idx * 0.2,
                                zIndex: cards.length - idx
                            }}
                        >
                            <h4 className="font-mono text-accent text-sm mb-2 opacity-90">{curr.title}</h4>
                            <p className="text-sm text-background/70">{curr.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TelemetryTypewriterCard() {
    const fullText = "> BROADCASTING LOCAL HEALTH ADVISORY...\n> SECURE CHANNELS ACTIVE.\n> CONNECTING TO REGIONAL HOSPITALS...\n> DATA STREAM SECURED.";
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            setText(fullText.substring(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 50);
        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div className="fade-up bg-[#1A1A24] rounded-[2rem] border border-white/5 p-8 flex flex-col h-[400px] relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Wifi className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-bold text-xl">Communicate</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span className="text-xs font-mono text-accent uppercase">Live Feed</span>
                </div>
            </div>

            <div className="flex-1 bg-[#09090D] rounded-xl p-5 border border-white/5 font-mono text-sm leading-relaxed overflow-hidden flex flex-col">
                <div className="text-green-500/80 break-words whitespace-pre-wrap">
                    {text}
                    {isTyping && <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse"></span>}
                </div>
            </div>
        </div>
    );
}

function CursorProtocolSchedulerCard() {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            tl.set(".cursor", { x: 0, y: 0, opacity: 0 })
                .to(".cursor", { opacity: 1, duration: 0.3 })
                .to(".cursor", { x: 140, y: 60, duration: 1, ease: "power2.inOut" })
                .to(".cursor", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to(".day-cell", { backgroundColor: "rgba(201, 168, 76, 0.2)", borderColor: "rgba(201, 168, 76, 0.5)", duration: 0.2 }, "-=0.1")
                .to(".cursor", { x: 220, y: 140, duration: 1, ease: "power2.inOut", delay: 0.5 })
                .to(".cursor", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to(".save-btn", { backgroundColor: "rgba(201, 168, 76, 1)", color: "#0D0D12", duration: 0.2 }, "-=0.1")
                .to(".cursor", { opacity: 0, duration: 0.3, delay: 0.5 })
                .to(".day-cell", { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.05)", duration: 0.2 }, "+=0.5")
                .to(".save-btn", { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(250, 248, 245, 0.5)", duration: 0.2 }, "<");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fade-up bg-[#1A1A24] rounded-[2rem] border border-white/5 p-8 flex flex-col h-[400px] relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-xl">Safety Planning</h3>
            </div>

            <p className="text-sm text-background/60 mb-6">Automate check-ins and log regional safety perimeters weekly.</p>

            <div className="relative flex-1 border border-white/5 rounded-xl bg-primary/50 p-4">
                {/* Cursor */}
                <div className="cursor absolute z-20 top-4 left-4 text-accent mix-blend-difference pointer-events-none drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]">
                    <MousePointer2 fill="currentColor" className="w-6 h-6 rotate-[-15deg]" />
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-xs font-mono text-background/40">{day}</div>
                    ))}
                    {Array(14).fill(0).map((_, i) => (
                        <div key={i} className={`h-8 rounded-md border border-white/5 transition-colors ${i === 10 ? 'day-cell' : ''}`}></div>
                    ))}
                </div>

                <div className="absolute bottom-4 right-4">
                    <button className="save-btn px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-background/50 transition-colors">Confirm Safety Route</button>
                </div>
            </div>
        </div>
    );
}

function PhilosophySection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".phil-line", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-48 w-full border-t border-b border-white/5 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
                    alt="Abstract Network"
                    className="w-full h-full object-cover opacity-20 filter grayscale"
                />
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
                <p className="phil-line text-2xl md:text-3xl font-sans font-medium text-background/60 mb-8">
                    Most tracking systems focus on: delayed reporting and cluttered data.
                </p>
                <h2 className="phil-line text-5xl md:text-7xl lg:text-[6rem] leading-[1.1] font-serif text-background mb-4">
                    We focus on:
                </h2>
                <h2 className="phil-line text-6xl md:text-8xl lg:text-[8rem] font-serif italic text-accent drop-shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                    immediate intelligence.
                </h2>
            </div>
        </section>
    );
}

function ProtocolSection() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (window.innerWidth < 768) return; // Skip stacking on mobile for better UX

        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: "top 12%",
                    endTrigger: ".protocol-container",
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: false,
                });

                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.3,
                    filter: "blur(10px)",
                    scrollTrigger: {
                        trigger: cards[i + 1],
                        start: "top 70%",
                        end: "top 20%",
                        scrub: true,
                    }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const protocols = [
        {
            step: "01",
            title: "Detect & Ingest",
            desc: "Raw localized reports are continuously ingested via decentralized encrypted endpoints. The algorithm seeks anomalies.",
            Icon: Motif1
        },
        {
            step: "02",
            title: "Analyze Surface",
            desc: "Cross-referencing reported geolocations against known healthcare facility capacities and real-time civic data.",
            Icon: Motif2
        },
        {
            step: "03",
            title: "Broadcast Alert",
            desc: "Immediate visual and telemetry warnings distributed via strict operational channels to ensure zero-latency awareness.",
            Icon: Motif3
        }
    ];

    return (
        <section id="protocol" className="protocol-container relative py-32 px-6 w-full max-w-5xl mx-auto">
            <div className="fade-up mb-24">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-background mb-4">Sticky Stacking Archive</h2>
                <p className="text-xl text-background/50">The EpiRadar operational architecture.</p>
            </div>

            <div ref={containerRef} className="relative w-full pb-20">
                {protocols.map((p, i) => (
                    <div key={i} className="protocol-card w-full min-h-[500px] mb-8 md:mb-0 bg-[#14141A] border border-white/5 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row shadow-2xl origin-top md:absolute top-0 left-0" style={{ zIndex: i }}>
                        <div className="flex-1 flex flex-col justify-between order-2 md:order-1 mt-10 md:mt-0">
                            <span className="font-mono text-6xl text-accent/30 hidden md:block">{p.step}</span>
                            <div>
                                <span className="font-mono text-accent text-lg mb-4 block md:hidden">STEP {p.step}</span>
                                <h3 className="text-3xl md:text-5xl font-serif mb-6 text-background">{p.title}</h3>
                                <p className="text-xl text-background/60 leading-relaxed font-light">{p.desc}</p>
                            </div>
                        </div>
                        <div className="flex-1 order-1 md:order-2 flex justify-center items-center">
                            <p.Icon />
                        </div>
                    </div>
                ))}
            </div>
            {/* Spacer for sticky scrolling */}
            <div className="hidden md:block h-[1200px]"></div>
        </section>
    );
}

// SVG Animations for Protocol
function Motif1() {
    return (
        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] max-w-[300px] animate-[spin_20s_linear_infinite] opacity-80" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="40" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" stroke="rgba(201,168,76,0.4)" strokeWidth="1" strokeDasharray="4 4" />
            <polygon points="50,15 80,75 20,75" stroke="#C9A84C" strokeWidth="1.5" className="animate-pulse" />
            <circle cx="50" cy="50" r="5" fill="#C9A84C" />
        </svg>
    );
}

function Motif2() {
    return (
        <div className="relative w-full max-w-[300px] aspect-square border border-white/10 rounded-2xl overflow-hidden bg-primary grid grid-cols-8 grid-rows-8 gap-1 p-2">
            {Array(64).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-sm"></div>
            ))}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent drop-shadow-[0_0_8px_#C9A84C] animate-[ping_3s_ease-in-out_infinite]"></div>
            <div className="absolute top-0 left-0 w-[2px] h-full bg-accent/50 animate-[ping_4s_linear_infinite] animation-delay-500"></div>
        </div>
    );
}

function Motif3() {
    return (
        <svg viewBox="0 0 200 100" className="w-[80%] h-auto max-w-[300px] opacity-90" fill="none" stroke="currentColor">
            <path
                d="M0,50 L40,50 L50,20 L60,80 L70,50 L100,50 L110,10 L120,90 L130,50 L200,50"
                stroke="#C9A84C" strokeWidth="2"
                strokeDasharray="400" strokeDashoffset="400"
                className="animate-[dash_3s_linear_infinite]"
            />
            <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </svg>
    );
}

function MapIntegrationSection() {
    return (
        <section id="map" className="w-full min-h-[100dvh] bg-[#0A0A0F] pt-40 md:pt-48 pb-24 px-6 flex flex-col items-center justify-start relative overflow-hidden">
            <div className="fade-up w-full max-w-7xl mx-auto mb-12 relative z-20 text-center">
                <h1 className="text-5xl md:text-7xl font-sans font-bold text-background mb-6 tracking-tight">Live Operational Radar</h1>
                <p className="text-xl md:text-2xl font-light text-background/60 max-w-3xl mx-auto">Tracking outbreak severity clusters and coordinating nearest emergency grid capacity in real-time.</p>
            </div>

            {/* Metrics Strip */}
            <div className="fade-up w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 relative z-20">
                <div className="bg-[#1A1A24]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                    <span className="text-sm font-mono text-background/50 mb-2">Total Active Cases</span>
                    <span className="text-4xl font-sans font-bold text-red-400">12,482</span>
                    <span className="text-xs font-sans text-red-400/70 mt-2">+8.4% since yesterday</span>
                </div>
                <div className="bg-[#1A1A24]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                    <span className="text-sm font-mono text-background/50 mb-2">Hospitals in Range</span>
                    <span className="text-4xl font-sans font-bold text-emerald-400">47</span>
                    <span className="text-xs font-sans text-emerald-400/70 mt-2">12 At Capacity Warning</span>
                </div>
                <div className="bg-[#1A1A24]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                    <span className="text-sm font-mono text-background/50 mb-2">Critical Clusters</span>
                    <span className="text-4xl font-sans font-bold text-orange-400">9</span>
                    <span className="text-xs font-sans text-orange-400/70 mt-2">3 mapped in Sector 4</span>
                </div>
                <div className="bg-[#1A1A24]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                    <span className="text-sm font-mono text-background/50 mb-2">System Uplink</span>
                    <span className="text-4xl font-sans font-bold text-accent">Stable</span>
                    <span className="text-xs font-sans text-accent/70 mt-2">Latency: 14ms</span>
                </div>
            </div>

            <div className="fade-up w-full max-w-7xl mx-auto relative h-[600px] md:h-[700px] rounded-[3rem] border border-white/10 overflow-hidden bg-[#0D0D14] shadow-2xl flex items-center justify-center group shrink-0">

                {/* Abstract Map Background */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen transition-transform duration-1000 group-hover:scale-105 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></svg>
                </div>

                {/* Glowing Data Overlay Vectors to simulate D3/Mapbox UI without heavy deps */}
                <div className="absolute inset-0 z-10 p-8 md:p-16 w-full h-full relative">

                    {/* Main Anomaly Area */}
                    <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full border border-red-500/10 bg-red-500/5 animate-pulse mix-blend-lighten blur-[2px] flex items-center justify-center">
                        <div className="w-[200px] h-[200px] border border-red-500/20 bg-red-500/10 rounded-full flex items-center justify-center delay-75 animate-pulse">
                            <div className="w-[50px] h-[50px] bg-red-500/60 blur-[10px] rounded-full"></div>
                        </div>
                    </div>

                    {/* Outbreak Points */}
                    <OutbreakPoint top="40%" left="30%" severity="High" />
                    <OutbreakPoint top="35%" left="45%" severity="Critical" />
                    <OutbreakPoint top="60%" left="25%" severity="Elevated" />

                    {/* Hospital Points */}
                    <HospitalPoint top="30%" left="60%" name="Sector 4 General" status="Optimal" />
                    <HospitalPoint top="70%" left="50%" name="Metro Clinic Alpha" status="Capacity Warning" />
                    <HospitalPoint top="50%" left="80%" name="North Medical Hub" status="Optimal" />

                </div>

                {/* Map UI Floating Panel */}
                <div className="absolute top-8 left-8 z-30 bg-[#1A1A24]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl w-[300px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                        <span className="font-mono text-sm tracking-widest text-background/80">SECTOR STATUS: <span className="text-red-400">ALERT</span></span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-sm font-light text-background/50">Active Reports</span>
                            <span className="text-2xl font-mono text-background">3,142</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-sm font-light text-background/50">Risk Velocity</span>
                            <span className="text-xl font-mono text-accent">+14.2%</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-light text-background/50">Hospitals In Range</span>
                            <span className="text-xl font-mono text-emerald-400">12</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

function OutbreakPoint({ top, left, severity }) {
    const isCrit = severity === 'Critical';
    return (
        <div className="absolute flex flex-col items-center group cursor-crosshair z-20" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-4 h-4 rounded-full ${isCrit ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'}`}></div>
            <div className="absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background text-primary text-xs font-mono font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-30">
                {severity} Anomaly
            </div>
        </div>
    );
}

function HospitalPoint({ top, left, name, status }) {
    const isWarn = status === 'Capacity Warning';
    return (
        <div className="absolute flex flex-col items-center group cursor-pointer z-20" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 backdrop-blur-md transition-transform group-hover:scale-110 ${isWarn ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
            </div>
            <div className="absolute top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-xl border border-white/20 text-background text-left p-3 rounded-lg shadow-2xl min-w-[200px] pointer-events-none z-30">
                <p className="font-bold text-sm mb-1">{name}</p>
                <p className="font-mono text-xs flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${isWarn ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span> {status}</p>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="w-full bg-[#050508] pt-32 pb-12 px-6 rounded-t-[4rem] border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col items-center border-b border-white/5 pb-16">
                <h2 className="text-4xl md:text-5xl font-serif text-background mb-8 text-center">Ready to secure your sector?</h2>
                <a href="#map" className="btn-magnetic px-10 py-5 rounded-full bg-accent text-primary font-bold text-xl inline-flex items-center gap-3">
                    Deploy EpiRadar Access
                    <ArrowRight className="w-6 h-6" />
                    <span className="btn-hover-layer"></span>
                </a>
            </div>

            <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <RadarIcon className="text-accent w-6 h-6" />
                        <span className="font-bold text-xl tracking-tight">EpiRadar</span>
                    </div>
                    <p className="text-background/50 max-w-sm mb-8">
                        Advanced real-time outbreak telemetry and safety communications for secure sectors.
                    </p>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-full inline-flex">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                        <span className="font-mono text-xs text-background/80 uppercase tracking-wider">System Operational</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-background text-lg">Modules</h4>
                    <ul className="space-y-4 text-background/60 text-sm">
                        <li><a href="#" className="hover:text-accent transition-colors">Threat Assessment</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Hospital Dispatch</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Geofencing API</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Encrypted Reports</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-background text-lg">Legal & Docs</h4>
                    <ul className="space-y-4 text-background/60 text-sm">
                        <li><a href="#" className="hover:text-accent transition-colors">Privacy Protocol</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Developer Portal</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 text-center text-sm font-mono text-background/30">
                &copy; 2026 EpiRadar Systems. All secure rights reserved.
            </div>
        </footer>
    );
}
