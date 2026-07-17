import { useState, useMemo } from "react";
import {
  Printer,
  Flag,
  CreditCard,
  FileText,
  Shirt,
  Sticker,
  Heart,
  BookOpen,
  Zap,
  Award,
  Wallet,
  Truck,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  Check,
  Calculator,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "2250546721249";
const WA_LINK_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

const services = [
  {
    id: "affiche",
    label: "Impression Affiche",
    desc: "A3, A2, A1, A0 - Papier photo ou mat",
    icon: Printer,
    base: 2500,
    unit: "par affiche",
    formats: ["A3", "A2", "A1", "A0"],
  },
  {
    id: "bache",
    label: "Bâche / Bandéroles",
    desc: "Résistante, œillets inclus, extérieur",
    icon: Flag,
    base: 6500,
    unit: "par m²",
    formats: ["1m²", "2m²", "3m²", "6m²"],
  },
  {
    id: "carte",
    label: "Cartes de visite",
    desc: "Recto/verso, pelliculage mat soft-touch",
    icon: CreditCard,
    base: 15000,
    unit: "les 100",
    formats: ["Standard", "Premium", "Luxe"],
  },
  {
    id: "flyer",
    label: "Flyers / Dépliants",
    desc: "A5, A4 pliés, distribution efficace",
    icon: FileText,
    base: 12000,
    unit: "les 100",
    formats: ["A5", "A4", "A4 plié"],
  },
  {
    id: "tshirt",
    label: "T-shirts / Personnalisation",
    desc: "Sérigraphie, DTG, flocage pro",
    icon: Shirt,
    base: 5500,
    unit: "par pièce",
    formats: ["S-M-L", "XL-XXL", "Enfant"],
  },
  {
    id: "vinyle",
    label: "Autocollants / Vinyle",
    desc: "Découpe, impression véhicule",
    icon: Sticker,
    base: 2000,
    unit: "par planche A3",
    formats: ["A3", "A2", "Découpe"],
  },
  {
    id: "fairepart",
    label: "Faire-part / Invitations",
    desc: "Mariage, baptême, luxe dorure",
    icon: Heart,
    base: 500,
    unit: "par pièce",
    formats: ["Simple", "Avec enveloppe", "Luxe"],
  },
  {
    id: "reliure",
    label: "Reliure / Plastification",
    desc: "Mémoires, dossiers, protection",
    icon: BookOpen,
    base: 1000,
    unit: "par document",
    formats: ["A4", "A3", "Spirale métal"],
  },
];

const formatFactors: Record<string, number> = {
  A5: 0.7,
  A4: 1,
  "A4 plié": 1.3,
  A3: 1.8,
  A2: 3,
  A1: 5,
  A0: 8,
  "1m²": 1,
  "2m²": 1.9,
  "3m²": 2.7,
  "6m²": 5,
  Standard: 1,
  Premium: 1.4,
  Luxe: 2,
  "Avec enveloppe": 1.6,
  Simple: 1,
  "S-M-L": 1,
  "XL-XXL": 1.2,
  Enfant: 0.85,
  Découpe: 1.3,
  "Spirale métal": 1.5,
};

const gallery = [
  { title: "Campagne Orange Money", tag: "Bâche 6m²", grad: "from-[#FF8A00] to-[#FFC700]" },
  { title: "Cartes Luxe Barber", tag: "Cartes de visite", grad: "from-neutral-900 to-neutral-700" },
  { title: "Flyers Maquis Le Poulet", tag: "Flyers A5", grad: "from-[#FF3B30] to-[#FF8A00]" },
  { title: "T-shirts Team Building MTN", tag: "50 pcs Sérigraphie", grad: "from-[#FFC700] to-[#FFE55C] text-black" },
  { title: "Faire-part Mariage K&A", tag: "Dorure à chaud", grad: "from-[#1a1a1a] to-[#FF8A00]" },
  { title: "Vinyle Boutique Angré", tag: "Vitrine complète", grad: "from-white to-neutral-200 text-black border" },
];

export default function App() {
  const [calcService, setCalcService] = useState(services[2]);
  const [calcQty, setCalcQty] = useState(100);
  const [calcFormat, setCalcFormat] = useState(services[2].formats[0]);
  const [fini, setFini] = useState("Mat");
  const [waPreview, setWaPreview] = useState<string | null>(null);
  const [waMsg, setWaMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [devisFlash, setDevisFlash] = useState(false);

  // form state
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    service: "Cartes de visite",
    details: "",
    fichier: null as File | null,
  });
  const [fileName, setFileName] = useState<string | null>(null);

  const price = useMemo(() => {
    const factor = formatFactors[calcFormat] ?? 1;
    let qtyMultiplier = 1;
    if (["carte", "flyer"].includes(calcService.id)) {
      qtyMultiplier = calcQty / 100;
    } else {
      qtyMultiplier = calcQty;
    }
    let raw = calcService.base * factor * qtyMultiplier;
    if (fini === "Brillant") raw *= 1.1;
    if (fini === "Soft-Touch") raw *= 1.25;
    // quantity discount
    if (qtyMultiplier >= 5) raw *= 0.85;
    else if (qtyMultiplier >= 3) raw *= 0.92;
    return Math.round(raw / 100) * 100;
  }, [calcService, calcQty, calcFormat, fini]);

  const pricePerUnit = useMemo(() => {
    if (calcQty === 0) return 0;
    return Math.round(price / (calcService.id === "carte" || calcService.id === "flyer" ? calcQty / 100 : calcQty ? calcQty : 1));
  }, [price, calcQty, calcService]);

  function openWhatsApp(message: string) {
    const url = `${WA_LINK_BASE}?text=${encodeURIComponent(message)}`;
    setWaMsg(message);
    setWaPreview(url);
    setToast("WhatsApp prêt • Lien généré ci-dessous");
    // iframe-safe: attempt open but keep visible fallback
    try {
      window.open(url, "_blank");
    } catch {}
  }

  function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Bonjour Impression Agbekoi 👋\nJe souhaite passer une commande :\n\n• Nom: ${form.nom}\n• Téléphone: ${form.tel}\n• Service: ${form.service}\n• Détails: ${form.details || "À préciser"}\n${fileName ? `• Fichier: ${fileName} (je l'enverrai après)` : ""}\n\nMerci de me donner le prix et délai.`;
    openWhatsApp(msg);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-[Inter,system-ui,sans-serif] selection:bg-[#FFC700]/30 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* TOP BAR */}
      <div className="w-full bg-black text-white text-[12px] tracking-wide py-2 px-4 flex justify-between items-center max-w-full">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00D26A] rounded-full animate-pulse" />
          OUVERT MAINTENANT • Livraison express Abidjan
        </span>
        <span className="hidden sm:flex gap-4">
          <a href="tel:+2250546721249" className="hover:text-[#FFC700] transition">054 67 21 249</a>
          <span className="opacity-40">|</span>
          <span>Abidjan, Cocody • Riviera</span>
        </span>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-black/[0.06]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white grid place-items-center rounded-[10px] font-display font-[800] tracking-tighter text-[16px]">A</div>
            <div className="leading-[0.9]">
              <div className="font-display font-[800] text-[17px] tracking-tight">AGBEKOI<span className="text-[#FF8A00]"> PRINT</span></div>
              <div className="text-[10px] tracking-[0.18em] font-semibold opacity-60">ABIDJAN • PRO</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+2250546721249"
              className="hidden sm:flex h-10 px-4 rounded-full border border-black/10 items-center gap-2 text-[14px] font-medium hover:bg-black hover:text-white transition"
            >
              <Phone size={16} /> Appeler
            </a>
            <button
              onClick={() =>
                openWhatsApp("Bonjour Impression Agbekoi, je souhaite avoir des infos sur vos services d'impression 🙏")
              }
              className="h-10 px-5 rounded-full bg-[#111] text-white text-[14px] font-semibold flex items-center gap-2 hover:bg-black transition"
            >
              <MessageCircle size={16} /> <span className="hidden sm:inline">WhatsApp direct</span><span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* FEEDBACK BANNER - iframe safe, shows for any action */}
      {(waPreview || toast) && (
        <div className="sticky top-[64px] z-30 bg-black text-white border-b border-white/10 animate-[fadeIn_0.2s_ease]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${waPreview ? "bg-[#25D366]" : "bg-[#FFC700] text-black"}`}>{waPreview ? <MessageCircle size={14} /> : <Calculator size={14} />}</div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{toast || "Action prise en compte"}</div>
                <div className="text-[11px] opacity-60 truncate max-w-[52ch]">{waMsg || (devisFlash ? "Défilement vers le calculateur..." : "Votre demande est prête")}</div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {waPreview && <a href={waPreview} target="_blank" rel="noreferrer" className="h-9 px-4 rounded-full bg-[#FFC700] text-black text-[13px] font-semibold flex items-center gap-1.5">Ouvrir WhatsApp <ArrowUpRight size={14} /></a>}
              {waPreview && <button onClick={() => {navigator.clipboard?.writeText(waPreview); setToast("Lien WhatsApp copié !");}} className="h-9 px-4 rounded-full bg-white/10 text-white text-[13px] font-semibold border border-white/10">Copier lien</button>}
              <button onClick={() => {setWaPreview(null); setWaMsg(null); setToast(null); setDevisFlash(false);}} className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><X size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7CC] via-white to-white" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#FFC700]/25 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full bg-[#FF8A00]/20 blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 sm:pt-20 pb-12 sm:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[11px] font-semibold tracking-wide">
              <Sparkles size={12} className="text-[#FFC700]" /> #1 IMPRESSION À ABIDJAN • DEVIS EN 30s
            </div>
            <h1 className="font-display font-[800] text-[38px] sm:text-[56px] leading-[0.92] tracking-tight mt-5">
              Impression Pro
              <span className="block">à Abidjan —</span>
              <span className="inline-block bg-[#FFC700] px-2 -rotate-[1deg]">Rapide,</span>{" "}
              <span className="inline-block bg-black text-white px-2 rotate-[1deg]">Qualité,</span>{" "}
              <span className="underline decoration-[#FF8A00] decoration-[6px] underline-offset-8">Pas Cher.</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[18px] leading-7 text-neutral-600 max-w-[560px]">
              Affiches, bâches, cartes, flyers, t-shirts, vinyle. On imprime aujourd’hui, tu récupères ou on livre partout à Abidjan. Prix clair en FCFA.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  openWhatsApp("Bonjour Impression Agbekoi, je souhaite commander maintenant 🚀 Mon besoin : ")
                }
                className="h-[52px] px-7 rounded-full bg-black text-white font-semibold text-[15px] flex items-center gap-2 hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all"
              >
                Commander sur WhatsApp <ArrowUpRight size={18} />
              </button>
              <button
                onClick={() => {
                  setDevisFlash(true);
                  setWaMsg("Calculateur de devis - prix FCFA instantané");
                  setToast("Calculateur ouvert ci-dessous • Ajustez service, quantité, format");
                  setWaPreview(null);
                  document.getElementById("devis")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setDevisFlash(false), 2500);
                }}
                className="h-[52px] px-7 rounded-full bg-white border border-black/10 font-semibold text-[15px] flex items-center gap-2 hover:bg-neutral-50 transition"
              >
                <Calculator size={18} /> Devis instantané
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-[13px]">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 grid place-items-center text-[11px] font-bold">
                    {["K", "A", "M"][i]}
                  </div>
                ))}
              </div>
              <div className="leading-tight">
                <div className="font-semibold">+1,200 clients satisfaits</div>
                <div className="text-neutral-500">Note 4.9/5 à Abidjan</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 pl-6 border-l border-black/10">
                <div className="w-9 h-9 rounded-full bg-[#FFC700] grid place-items-center">
                  <Zap size={16} />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold">Prêt en 2h</div>
                  <div className="text-neutral-500">Express disponible</div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative">
            <div className="relative bg-black rounded-[28px] p-[14px] sm:p-[18px] shadow-[0_24px_64px_rgba(0,0,0,0.25)]">
              <div className="bg-white rounded-[18px] overflow-hidden">
                <div className="p-5 flex justify-between items-center border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFC700] grid place-items-center">
                      <Printer size={14} />
                    </div>
                    <span className="font-semibold text-[14px]">Aperçu commande</span>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-[#E8FFF1] text-[#0A7A3E] font-semibold">EN COURS • PRÊT 14H30</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-[#FFC700] to-[#FF8A00] grid place-items-center">
                      <CreditCard className="text-black" />
                    </div>
                    <div>
                      <div className="font-semibold">Cartes de visite Premium</div>
                      <div className="text-[12px] text-neutral-500">Recto/verso • Soft-touch • 200 pcs</div>
                      <div className="mt-2 flex gap-2">
                        <span className="text-[11px] px-2 py-1 rounded-full bg-black text-white">Mat</span>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100">Livraison Yopougon</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[1px] bg-black/5" />
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Sous-total</span>
                    <span className="font-semibold">28,000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Livraison express</span>
                    <span className="font-semibold text-[#0A7A3E]">Offerte</span>
                  </div>
                  <div className="rounded-xl bg-neutral-900 text-white p-4 flex justify-between items-center">
                    <span className="text-[13px] opacity-80">Total estimé</span>
                    <span className="font-display font-bold text-[18px]">28,000 FCFA</span>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="flex items-center gap-1"><Check size={12} /> BAT validé</span>
                    <span className="flex items-center gap-1 opacity-60"><Check size={12} /> Fichier HD reçu</span>
                  </div>
                </div>
              </div>
              {/* floating badges */}
              <div className="absolute -top-3 -right-3 bg-[#FFC700] text-black text-[12px] font-bold px-3 py-1 rounded-full rotate-3 shadow">-15% ce jour</div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-black/10 text-[12px] font-semibold px-3 py-2 rounded-full shadow flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white rounded-full grid place-items-center">✓</span> Paiement Wave / OM / Cash
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <h2 className="font-display font-[800] text-[28px] sm:text-[40px] leading-[0.9] tracking-tight">
            Tout ce qu’il faut pour<br />
            <span className="text-neutral-400">imprimer à Abidjan.</span>
          </h2>
          <p className="text-[14px] text-neutral-500 max-w-[320px]">Prix affichés en FCFA. Devis instantané, pas de surprise. Fichiers acceptés : PDF, AI, PSD, JPG HD.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setCalcService(s);
                  setCalcFormat(s.formats[0]);
                  document.getElementById("devis")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group text-left rounded-[20px] border border-black/[0.06] bg-white p-5 hover:border-black hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all"
              >
                <div className="w-11 h-11 rounded-[12px] bg-black text-white group-hover:bg-[#FFC700] group-hover:text-black grid place-items-center transition-colors">
                  <Icon size={20} />
                </div>
                <div className="mt-4 font-semibold text-[15px]">{s.label}</div>
                <div className="mt-1 text-[12.5px] leading-5 text-neutral-500 min-h-[40px]">{s.desc}</div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white transition">
                    dès {s.base.toLocaleString("fr-FR")} FCFA
                  </span>
                  <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-[1px] transition" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CALCULATOR + FORM */}
      <section id="devis" className="bg-[#0F0F0F] text-white rounded-t-[28px] sm:rounded-[32px] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 sm:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* Calculator */}
          <div className="rounded-[24px] bg-white text-black p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FFC700] grid place-items-center">
                <Calculator size={18} />
              </div>
              <div>
                <div className="font-display font-[800] text-[20px] leading-none">Calculateur instantané</div>
                <div className="text-[12px] text-neutral-500 mt-1">Estimation en FCFA • Remise auto si grosse quantité</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-[12px] font-semibold tracking-wide opacity-70">SERVICE</span>
                <select
                  value={calcService.id}
                  onChange={(e) => {
                    const found = services.find((s) => s.id === e.target.value)!;
                    setCalcService(found);
                    setCalcFormat(found.formats[0]);
                    // adjust qty default
                    if (["carte", "flyer"].includes(found.id)) setCalcQty(100);
                    else setCalcQty(1);
                  }}
                  className="w-full h-12 rounded-full border border-black/10 px-4 text-[14px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold tracking-wide opacity-70">FORMAT</span>
                <select
                  value={calcFormat}
                  onChange={(e) => setCalcFormat(e.target.value)}
                  className="w-full h-12 rounded-full border border-black/10 px-4 text-[14px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                >
                  {calcService.formats.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold tracking-wide opacity-70">QUANTITÉ</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={calcService.id === "carte" || calcService.id === "flyer" ? 50 : 1}
                    max={calcService.id === "carte" || calcService.id === "flyer" ? 1000 : 50}
                    step={calcService.id === "carte" || calcService.id === "flyer" ? 50 : 1}
                    value={calcQty}
                    onChange={(e) => setCalcQty(Number(e.target.value))}
                    className="flex-1 accent-black"
                  />
                  <div className="w-[88px] h-12 rounded-full border border-black/10 grid place-items-center font-semibold text-[14px]">{calcQty}</div>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold tracking-wide opacity-70">FINITION</span>
                <div className="flex gap-2">
                  {["Mat", "Brillant", "Soft-Touch"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFini(f)}
                      className={`h-12 flex-1 rounded-full border text-[13px] font-semibold transition ${
                        fini === f ? "bg-black text-white border-black" : "bg-white border-black/10 hover:border-black"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <div className="mt-8 rounded-[20px] bg-[#0F0F0F] text-white p-5 sm:p-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="text-[11px] tracking-wide opacity-60">PRIX ESTIMÉ TTC</div>
                <div className="font-display font-[800] text-[32px] leading-none mt-1">{price.toLocaleString("fr-FR")} FCFA</div>
                <div className="text-[12px] opacity-70 mt-2">
                  ≈ {pricePerUnit.toLocaleString("fr-FR")} FCFA / {calcService.unit} • Livraison Abidjan 2,000 F
                </div>
              </div>
              <button
                onClick={() => {
                  setForm((p) => ({ ...p, service: calcService.label }));
                  openWhatsApp(
                    `Bonjour Impression Agbekoi, je veux un devis :\nService ${calcService.label}\nFormat ${calcFormat}\nQté ${calcQty}\nFinition ${fini}\nPrix estimé ${price.toLocaleString("fr-FR")} FCFA`
                  );
                }}
                className="h-12 px-6 rounded-full bg-[#FFC700] text-black font-semibold text-[14px] hover:bg-[#FFD74D] transition"
              >
                Demander ce prix sur WhatsApp
              </button>
            </div>

            <p className="mt-4 text-[11px] text-neutral-500 leading-4">
              Prix indicatif hors livraison. Fichier non conforme = +1,000 FCFA de mise aux normes. Remise automatique dès 300 pcs.
            </p>
          </div>

          {/* Order Form */}
          <div className="rounded-[24px] bg-[#1A1A1A] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-[20px]">Commander en 30s</h3>
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/10">Réponse &lt; 5 min</span>
            </div>

            <form onSubmit={handleOrder} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold tracking-wide opacity-70">NOM COMPLET</span>
                  <input
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Koné Ibrahim"
                    className="w-full h-12 rounded-full bg-white/5 border border-white/10 px-4 text-[14px] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold tracking-wide opacity-70">TÉLÉPHONE</span>
                  <input
                    required
                    value={form.tel}
                    onChange={(e) => setForm({ ...form, tel: e.target.value })}
                    placeholder="07 00 00 00 00"
                    className="w-full h-12 rounded-full bg-white/5 border border-white/10 px-4 text-[14px] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold tracking-wide opacity-70">SERVICE SOUHAITÉ</span>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full h-12 rounded-full bg-white/5 border border-white/10 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.label} className="text-black">
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold tracking-wide opacity-70">DÉTAILS (format, quantité, délai)</span>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Ex: 200 cartes Premium recto/verso, prêt demain midi, livraison Cocody..."
                  className="w-full min-h-[96px] rounded-[18px] bg-white/5 border border-white/10 p-4 text-[14px] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FFC700] resize-none"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold tracking-wide opacity-70">FICHIER (SIMULÉ)</span>
                <div className="mt-2 relative rounded-[16px] border border-dashed border-white/15 bg-white/[0.03] p-4 flex items-center justify-between gap-3 hover:bg-white/[0.05] transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.ai,.psd"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setForm({ ...form, fichier: f });
                        setFileName(f.name);
                      }
                    }}
                  />
                  <span className="flex items-center gap-2 text-[13px]">
                    <Upload size={16} /> {fileName ? fileName : "Glissez votre fichier ou cliquez (PDF, JPG, AI)"}
                  </span>
                  {fileName && (
                    <button type="button" onClick={() => { setFileName(null); setForm({ ...form, fichier: null }); }} className="w-7 h-7 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[11px] opacity-50">Fichier non envoyé directement — il sera demandé sur WhatsApp après clic.</p>
              </label>

              <button type="submit" className="w-full h-[54px] rounded-full bg-[#FFC700] text-black font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#FFD74D] transition">
                <MessageCircle size={18} /> Envoyer commande sur WhatsApp
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] opacity-60">
                <span className="w-2 h-2 bg-[#00D26A] rounded-full animate-pulse" /> Réponse moyenne 3 min • Paiement Wave / OM / Cash
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-[800] text-[28px] sm:text-[36px] tracking-tight">Réalisations récentes</h2>
          <span className="hidden sm:flex text-[12px] px-3 py-1 rounded-full border border-black/10">+1,200 projets livrés</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <div key={i} className={`group relative rounded-[22px] overflow-hidden min-h-[220px] p-5 flex flex-col justify-end bg-gradient-to-br ${g.grad} border border-black/5`}>
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow">
                {i % 2 === 0 ? <Printer size={16} /> : <Flag size={16} />}
              </div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition bg-[radial-gradient(circle_at_50%_50%,black,transparent_60%)]`} />
              <div>
                <div className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black text-white mb-2">{g.tag}</div>
                <div className={`font-semibold leading-tight ${g.grad.includes("text-black") ? "text-black" : "text-white"} text-[16px]`}>{g.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-black/5 bg-[#FFFBEB]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12 sm:py-16 grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-display font-[800] text-[28px] leading-[0.95] tracking-tight">
              Pourquoi<br />Agbekoi Print ?
            </h2>
            <p className="mt-3 text-[13px] text-neutral-600 leading-5">Service local, réactif, créé à Abidjan pour les entrepreneurs ivoiriens. Pas de blabla, on imprime bien.</p>
          </div>
          {[
            { icon: Zap, title: "Rapidité", desc: "Devis en 5 min, impression en 2h pour l’express. Retrait ou livraison le jour même." },
            { icon: Award, title: "Qualité", desc: "Papier 300g+, encres vives, pelliculage soft-touch. On refuse un BAT moche." },
            { icon: Wallet, title: "Prix juste", desc: "Tarifs FCFA affichés, pas de frais cachés. Remise auto dès 300 ex." },
            { icon: Truck, title: "Livraison Abidjan", desc: "Cocody, Yop, Marcory, Plateau, Angré… Livreur propre, 1,500 – 2,500 F." },
          ].map((f) => (
            <div key={f.title} className="rounded-[18px] bg-white border border-black/5 p-5">
              <div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">
                <f.icon size={18} />
              </div>
              <div className="mt-4 font-semibold">{f.title}</div>
              <div className="mt-1 text-[13px] leading-5 text-neutral-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FOOTER */}
      <footer className="bg-black text-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12 sm:py-16 grid lg:grid-cols-[1.2fr_0.8fr_0.8fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FFC700] text-black grid place-items-center font-display font-[800]">A</div>
              <div className="font-display font-[800] text-[18px]">AGBEKOI PRINT</div>
            </div>
            <p className="mt-4 text-[14px] leading-6 opacity-70 max-w-[360px]">
              Impression pro à Abidjan. On aide les commerces, startups et particuliers à paraître plus premium — sans payer le prix premium.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="tel:+2250546721249" className="h-10 px-4 rounded-full bg-white text-black font-semibold text-[13px] flex items-center gap-2">
                <Phone size={14} /> 05 46 72 12 49
              </a>
              <button onClick={() => openWhatsApp("Bonjour Impression Agbekoi, je souhaite...")} className="h-10 px-4 rounded-full bg-[#FFC700] text-black font-semibold text-[13px] flex items-center gap-2">
                <MessageCircle size={14} /> wa.me/2250546721249
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[12px] tracking-wide opacity-50 font-semibold">CONTACT</div>
            <div className="space-y-3 text-[14px]">
              <div className="flex gap-2 opacity-80">
                <MapPin size={16} className="mt-0.5 text-[#FFC700]" /> Abidjan, Cocody Riviera – Livraison partout Abidjan
              </div>
              <a href="tel:+2250546721249" className="flex gap-2 hover:text-[#FFC700] transition">
                <Phone size={16} className="mt-0.5 text-[#FFC700]" /> 0546721249 (appel & WhatsApp)
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-[#FFC700] transition">
                <MessageCircle size={16} className="mt-0.5 text-[#FFC700]" /> WhatsApp direct : wa.me/{WHATSAPP_NUMBER}
              </a>
              <div className="flex gap-2 opacity-80">
                <Clock size={16} className="mt-0.5 text-[#FFC700]" /> Lun – Sam : 8h – 19h • Dim : sur RDV
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[12px] tracking-wide opacity-50 font-semibold">SERVICES</div>
            <ul className="grid grid-cols-2 gap-2 text-[13px] opacity-70">
              {services.map((s) => (
                <li key={s.id}>• {s.label}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-[16px] bg-white/5 border border-white/10 p-4">
              <div className="text-[12px] opacity-60">Paiement</div>
              <div className="mt-1 font-semibold text-[13px]">Wave • Orange Money • MTN • Cash à la livraison</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[56px] flex items-center justify-between text-[11px] opacity-50">
            <span>© {new Date().getFullYear()} Agbekoi Print • Abidjan • Tous droits réservés</span>
            <span className="hidden sm:inline">Fait avec ❤️ à Abidjan – Rapide, Qualité, Pas Cher</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <button
        onClick={() => openWhatsApp("Bonjour Impression Agbekoi, je souhaite...")}
        className="fixed bottom-5 right-5 z-50 w-[56px] h-[56px] sm:w-auto sm:h-[56px] sm:px-5 rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(37,211,102,0.5)] transition-all"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="hidden sm:inline text-[14px]">Discuter sur WhatsApp</span>
      </button>
    </div>
  );
}
