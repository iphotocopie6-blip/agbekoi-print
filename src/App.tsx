import { useState, useMemo, useEffect } from "react";
import {
  Printer, Flag, CreditCard, FileText, Shirt, Sticker, Heart, BookOpen,
  Zap, Award, Wallet, Truck, MessageCircle, Phone, MapPin, Clock,
  ArrowUpRight, Check, Calculator, Sparkles, Upload, X, Settings,
  Save, Eye, DollarSign, Type, Lock
} from "lucide-react";

type Service = {
  id: string;
  label: string;
  desc: string;
  iconName: string;
  base: number;
  unit: string;
  formats: string[];
};

type Config = {
  whatsapp: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  services: Service[];
  badge: string;
  clientsText: string;
  delaiText: string;
};

const DEFAULT_SERVICES: Service[] = [
  { id: "affiche", label: "Impression Affiche", desc: "A3, A2, A1, A0 - Papier photo ou mat", iconName: "Printer", base: 2500, unit: "par affiche", formats: ["A3","A2","A1","A0"] },
  { id: "bache", label: "Bâche / Bandéroles", desc: "Résistante, œillets inclus, extérieur", iconName: "Flag", base: 6500, unit: "par m²", formats: ["1m²","2m²","3m²","6m²"] },
  { id: "carte", label: "Cartes de visite", desc: "Recto/verso, pelliculage mat soft-touch", iconName: "CreditCard", base: 15000, unit: "les 100", formats: ["Standard","Premium","Luxe"] },
  { id: "flyer", label: "Flyers / Dépliants", desc: "A5, A4 pliés, distribution efficace", iconName: "FileText", base: 12000, unit: "les 100", formats: ["A5","A4","A4 plié"] },
  { id: "tshirt", label: "T-shirts / Personnalisation", desc: "Sérigraphie, DTG, flocage pro", iconName: "Shirt", base: 5500, unit: "par pièce", formats: ["S-M-L","XL-XXL","Enfant"] },
  { id: "vinyle", label: "Autocollants / Vinyle", desc: "Découpe, impression véhicule", iconName: "Sticker", base: 2000, unit: "par planche A3", formats: ["A3","A2","Découpe"] },
  { id: "fairepart", label: "Faire-part / Invitations", desc: "Mariage, baptême, luxe dorure", iconName: "Heart", base: 500, unit: "par pièce", formats: ["Simple","Avec enveloppe","Luxe"] },
  { id: "reliure", label: "Reliure / Plastification", desc: "Mémoires, dossiers, protection", iconName: "BookOpen", base: 1000, unit: "par document", formats: ["A4","A3","Spirale métal"] },
];

const DEFAULT_CONFIG: Config = {
  whatsapp: "2250546721249",
  heroTitle1: "Impression Pro",
  heroTitle2: "à Abidjan – Rapide, Qualité, Pas Cher.",
  badge: "#1 IMPRESSION À ABIDJAN • DEVIS EN 30s",
  heroSubtitle: "Affiches, bâches, cartes, flyers, t-shirts, vinyle. On imprime aujourd'hui, tu récupères ou on livre partout à Abidjan. Prix clair en FCFA.",
  services: DEFAULT_SERVICES,
  clientsText: "+1,200 clients satisfaits\nNote 4.9/5 à Abidjan",
  delaiText: "Prêt en 2h\nExpress disponible",
};

const STORAGE_KEY = "agbekoi_config_v2";
const ADMIN_PWD = "agbekoi123";
const iconMap: Record<string, any> = { Printer, Flag, CreditCard, FileText, Shirt, Sticker, Heart, BookOpen };
const formatFactors: Record<string, number> = {
  A5: 0.7, A4: 1, "A4 plié": 1.3, A3: 1.8, A2: 3, A1: 5, A0: 8,
  "1m²": 1, "2m²": 1.9, "3m²": 2.7, "6m²": 5,
  Standard: 1, Premium: 1.4, Luxe: 2, "Avec enveloppe": 1.6, Simple: 1,
  "S-M-L": 1, "XL-XXL": 1.2, Enfant: 0.85, Découpe: 1.3, "Spirale métal": 1.5,
};

function useConfig() {
  const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCfg({...DEFAULT_CONFIG,...JSON.parse(raw), services: JSON.parse(raw).services || DEFAULT_SERVICES });
    } catch {}
  }, []);
  const save = (next: Config) => { setCfg(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  return { cfg, save, setCfg };
}

function AdminPanel({ cfg, save, onExit }: { cfg: Config; save: (c: Config) => void; onExit: () => void }) {
  const [local, setLocal] = useState<Config>(cfg);
  const [tab, setTab] = useState<"prix"|"textes"|"whatsapp">("prix");
  const [toast, setToast] = useState<string | null>(null);
  useEffect(()=>{ setLocal(cfg); }, [cfg]);
  const doSave = () => { save(local); setToast("✅ Modifications enregistrées!"); setTimeout(()=>setToast(null), 3000); };
  const updateService = (id: string, field: keyof Service, value: any) => { setLocal(l => ({...l, services: l.services.map(s => s.id===id? {...s, [field]: value } : s) })); };
  return (
    <div className="min-h-screen bg-[#f6f5f0] text-neutral-900">
      <header className="sticky top-0 z-20 bg-black text-white h- flex items-center justify-between px-6">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-[#FFC700] text-black grid place-items-center font-black">A</div><div><div className="font-bold leading-none">AGBEKOI ADMIN</div><div className="text- opacity-60">Tableau de bord</div></div></div>
        <div className="flex gap-2"><button onClick={onExit} className="h-9 px-4 rounded-full bg-white/10 flex items-center gap-2 text-"><Eye size={14}/> Voir le site</button><button onClick={doSave} className="h-9 px-4 rounded-full bg-[#FFC700] text-black font-semibold flex items-center gap-2 text-"><Save size={14}/> Enregistrer</button></div>
      </header>
      <div className="max-w- mx-auto p-6 grid lg:grid-cols-[200px_1fr] gap-6">
        <nav className="space-y-2">
          {[{ k: "prix", l: "Prix & Services", i: DollarSign },{ k: "textes", l: "Textes du site", i: Type },{ k: "whatsapp", l: "WhatsApp & Contact", i: MessageCircle },].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k as any)} className={`w-full h-11 px-4 rounded-xl flex items-center gap-3 text- font-medium text-left ${tab===t.k?"bg-black text-white":"bg-white border hover:bg-neutral-50"}`}><t.i size={16}/> {t.l}</button>
          ))}
        </nav>
        <div className="bg-white rounded- border p-6 shadow-sm min-h-">
          {tab==="prix" && (<div className="space-y-4"><h2 className="font-bold text-">Gérer les prix</h2><div className="grid gap-3">{local.services.map(s => (<div key={s.id} className="rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"><div className="flex-1"><input value={s.label} onChange={e=>updateService(s.id,"label",e.target.value)} className="font-semibold bg-transparent border-b border-transparent focus:border-black outline-none w-full"/><input value={s.desc} onChange={e=>updateService(s.id,"desc",e.target.value)} className="text- opacity-60 bg-transparent border-b border-transparent focus:border-black outline-none w-full mt-1"/><div className="text- mt-1 opacity-50">{s.unit}</div></div><div className="flex items-center gap-2"><input type="number" value={s.base} onChange={e=>updateService(s.id,"base", parseInt(e.target.value)||0)} className="w- h-11 px-3 rounded-xl border-2 border-black font-bold text-"/><div className="text- font-medium opacity-60">F</div></div></div>))}</div></div>)}
          {tab==="textes" && (<div className="space-y-6"><h2 className="font-bold text-">Textes du site</h2><div className="grid gap-4"><label className="space-y-1"><div className="text- font-semibold opacity-60">BADGE HAUT</div><input value={local.badge} onChange={e=>setLocal({...local, badge:e.target.value})} className="w-full h-11 px-4 rounded-xl border"/></label><label className="space-y-1"><div className="text- font-semibold opacity-60">TITRE LIGNE 1</div><input value={local.heroTitle1} onChange={e=>setLocal({...local, heroTitle1:e.target.value})} className="w-full h-11 px-4 rounded-xl border font-bold"/></label><label className="space-y-1"><div className="text- font-semibold opacity-60">TITRE LIGNE 2</div><input value={local.heroTitle2} onChange={e=>setLocal({...local, heroTitle2:e.target.value})} className="w-full h-11 px-4 rounded-xl border"/></label><label className="space-y-1"><div className="text- font-semibold opacity-60">SOUS-TITRE</div><textarea value={local.heroSubtitle} onChange={e=>setLocal({...local, heroSubtitle:e.target.value})} className="w-full p-4 rounded-xl border min-h-"/></label></div></div>)}
          {tab==="whatsapp" && (<div className="space-y-6"><h2 className="font-bold text-">WhatsApp</h2><label className="space-y-2 block"><div className="text- font-semibold opacity-60">NUMÉRO (format 225... sans +)</div><input value={local.whatsapp} onChange={e=>setLocal({...local, whatsapp:e.target.value})} className="w-full h-12 px-4 rounded-xl border-2 border-black font-mono font-bold text-"/></label></div>)}
          <div className="mt-10 pt-6 border-t flex flex-wrap gap-3"><button onClick={doSave} className="h-11 px-6 rounded-full bg-black text-white font-semibold flex items-center gap-2"><Save size={16}/> Enregistrer</button><button onClick={()=>{ if(confirm("Remettre les prix d'origine?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); } }} className="h-11 px-6 rounded-full border font-medium">Réinitialiser</button></div>
        </div>
      </div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full text- font-medium shadow-xl">{toast}</div>}
    </div>
  );
}

export default function App() {
  const { cfg, save } = useConfig();
  const [showAdmin, setShowAdmin] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const isAdminPath = window.location.pathname.includes("admin") || window.location.search.includes("admin") || window.location.hash.includes("admin");
    if (isAdminPath) setShowAdmin(true);
    if (localStorage.getItem("agbekoi_admin_auth")==="1") setIsAuthed(true);
  }, []);
  const [calcService, setCalcService] = useState(cfg.services[2]);
  const [calcQty, setCalcQty] = useState(100);
  const [calcFormat, setCalcFormat] = useState(cfg.services[2]?.formats[0] || "Standard");
  const [fini, setFini] = useState("Mat");
  const [waPreview, setWaPreview] = useState<string | null>(null);
  const [waMsg, setWaMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", tel: "", service: "Cartes de visite", details: "", fichier: null as File | null });
  const [fileName, setFileName] = useState<string | null>(null);
  useEffect(()=>{ setCalcService(cfg.services[2] || cfg.services[0]); setCalcFormat((cfg.services[2] || cfg.services[0])?.formats[0]); }, [cfg]);
  const WA_LINK_BASE = `https://wa.me/${cfg.whatsapp}`;
  const price = useMemo(() => {
    const factor = formatFactors[calcFormat]?? 1;
    let qtyMultiplier = 1;
    if (["carte","flyer"].includes(calcService.id)) qtyMultiplier = calcQty / 100; else qtyMultiplier = calcQty;
    let raw = calcService.base * factor * qtyMultiplier;
    if (fini === "Brillant") raw *= 1.1; if (fini === "Soft-Touch") raw *= 1.25;
    if (qtyMultiplier >= 5) raw *= 0.85; else if (qtyMultiplier >= 3) raw *= 0.92;
    return Math.round(raw / 100) * 100;
  }, [calcService, calcQty, calcFormat, fini]);
  function openWhatsApp(message: string) {
    const url = `${WA_LINK_BASE}?text=${encodeURIComponent(message)}`;
    setWaMsg(message); setWaPreview(url); setToast("WhatsApp prêt"); try { window.open(url, "_blank"); } catch {}
    setTimeout(()=>setToast(null), 4000);
  }
  function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Bonjour Agbekoi Print 👋\nCommande :\n• Nom: ${form.nom}\n• Tel: ${form.tel}\n• Service: ${form.service}\n• Détails: ${form.details || "À préciser"}${fileName?`\n• Fichier: ${fileName}`:""}\n\nMerci prix & délai.`;
    openWhatsApp(msg);
  }
  if (showAdmin) {
    if (!isAuthed) {
      return (
        <div className="min-h-screen bg-black text-white grid place-items-center p-6">
          <div className="w-full max-w- bg-white text-black rounded- p-8">
            <div className="w-12 h-12 rounded-xl bg-black text-white grid place-items-center"><Lock size={20}/></div>
            <h1 className="mt-4 font-bold text-">Admin Agbekoi</h1>
            <p className="text- opacity-60 mt-1">Entre le mot de passe</p>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Mot de passe" className="mt-6 w-full h-12 px-4 rounded-xl border-2 border-black outline-none"/>
            {pwdError && <div className="text- text-red-600 mt-2">Mot de passe incorrect</div>}
            <button onClick={()=>{ if(pwd==="agbekoi123"){ setIsAuthed(true); localStorage.setItem("agbekoi_admin_auth","1"); setPwdError(false);} else setPwdError(true); }} className="mt-4 w-full h-12 rounded-full bg-black text-white font-semibold">Se connecter</button>
            <div className="mt-3 text- opacity-50">Mot de passe: agbekoi123</div>
            <button onClick={()=>{ setShowAdmin(false); window.history.pushState({}, "", "/"); }} className="mt-3 w-full text- opacity-60">← Retour au site</button>
          </div>
        </div>
      );
    }
    return <AdminPanel cfg={cfg} save={save} onExit={()=>{ setShowAdmin(false); window.history.pushState({}, "", "/"); }} />;
  }
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-[Inter,system-ui,sans-serif] overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');.font-display{font-family:'Syne',sans-serif}`}</style>
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-black/5">
        <div className="max-w- mx-auto px-5 sm:px-8 h- flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded- bg-black text-white grid place-items-center font-display font-[800]">A</div><div className="font-display font-[800] text-">AGBEKOI PRINT</div></div>
          <div className="flex items-center gap-2"><button onClick={()=>setShowAdmin(true)} className="w-9 h-9 rounded-full bg-neutral-100 grid place-items-center"><Settings size={16}/></button><a href={`https://wa.me/${cfg.whatsapp}`} target="_blank" className="hidden sm:flex h-9 px-4 rounded-full bg-black text-white text- font-semibold items-center gap-2"><Phone size={14}/> {cfg.whatsapp.slice(-8)}</a></div>
        </div>
      <section className="bg-[#FFFEF5] border-b border-black/5">
        <div className="max-w- mx-auto px-5 sm:px-8 py-10 sm:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text- font-semibold"><Sparkles size={12} className="text-[#FFC700]"/> {cfg.badge}</div>
            <h1 className="mt-4 font-display font-[800] text- sm:text- leading-[0.9]">{cfg.heroTitle1}<br/>{cfg.heroTitle2}</h1>
            <p className="mt-4 text- leading-6 opacity-70 max-w-">{cfg.heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={()=>openWhatsApp(`Bonjour Agbekoi Print, je veux commander`)} className="h-12 px-6 rounded-full bg-black text-white font-semibold text- flex items-center gap-2">Commander sur WhatsApp <ArrowUpRight size={16}/></button>
              <a href="#devis" className="h-12 px-6 rounded-full bg-white border border-black/10 font-semibold text- flex items-center gap-2"><Calculator size={16}/> Devis instantané</a>
            </div>
          </div>
          <div id="devis" className="bg-white rounded- border shadow p-5 sm:p-6">
            <div className="flex items-center justify-between"><h3 className="font-bold flex items-center gap-2"><Calculator size={18}/> Devis 30s</h3><span className="text- px-2.5 py-1 rounded-full bg-[#FFC700] font-bold">FCFA</span></div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {cfg.services.map(s => {
                const Icon = iconMap[s.iconName] || Printer;
                const active = calcService.id===s.id;
                return <button key={s.id} onClick={()=>{ setCalcService(s); setCalcFormat(s.formats[0]); }} className={`text-left p-3 rounded-2xl border ${active?"bg-black text-white border-black":"bg-neutral-50 border-black/5"}`}><div className="flex items-center gap-2"><Icon size={14}/><span className="text- font-semibold">{s.label}</span></div><div className="text- mt-1 opacity-60">{s.base.toLocaleString()} F</div></button>;
              })}
            </div>
            <div className="mt-4 bg-[#FFFBEB] border border-[#FFC700]/30 rounded-2xl p-3"><div className="text- font-bold opacity-60">PRIX ESTIMÉ</div><div className="font-display font-[800] text-">{price.toLocaleString()} F</div></div>
            <button onClick={()=>openWhatsApp(`Bonjour, devis: ${calcService.label} ${calcFormat} x${calcQty} = ${price} F`)} className="mt-4 w-full h-12 rounded-full bg-[#25D366] text-white font-bold flex items-center justify-center gap-2"><MessageCircle size={18}/> Commander sur WhatsApp</button>
          </div>
        </div>
      </section>
      <footer className="bg-black text-white py-10 text-center text- opacity-60">© Agbekoi Print • <button onClick={()=>setShowAdmin(true)} className="underline">Admin</button> • Mot de passe: agbekoi123</footer>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-">{toast}</div>}
    </div>
  );
}
