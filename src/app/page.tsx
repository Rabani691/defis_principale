"use client";

import { useState } from "react";

type OS = "Linux" | "Windows" | "macOS";

const ALL_OS: OS[] = ["Linux", "Windows", "macOS"];

export default function HomePage() {
  const [focusedOS, setFocusedOS] = useState<OS | "all">("all");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Appel à l'API de votre ami (adapter l'URL selon son serveur)
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      // Ajouter la réponse de l'IA
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "Désolé, je n'ai pas pu obtenir de réponse."
      }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Erreur de connexion. Assurez-vous que le serveur est lancé."
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NIRDE
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Linux • Windows • macOS
              </p>
            </div>

            <nav className="flex gap-2 flex-wrap">
              <Anchor href="#overview" label="Vue d'ensemble" />
              <Anchor href="#openness" label="Ouverture" />
              <Anchor href="#cost" label="Coût" />
              <Anchor href="#performance" label="Performance" />
              <Anchor href="#security" label="Sécurité" />
              <Anchor href="#compatibility" label="Compatibilité" />
              <button
                onClick={() => setShowChat(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg transition-all"
              >
                💬 Discuter avec IA
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 space-y-20">
        {/* HERO SECTION */}
        <section id="overview" className="pt-16 lg:pt-24">
          <div className="grid lg:grid-cols-1 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 border border-cyan-300">
                <span className="text-2xl">🚀</span>
                <span className="text-sm text-cyan-700 font-medium">Comparaison détaillée</span>
              </div>

              <p className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-cyan-900 bg-clip-text text-transparent">
                  Vos ordinateurs sont anciens 
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Allez-vous acheter de nouvelles machines Windows ou installer Linux ?
                </span>
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                Explorez les forces et faiblesses de <strong className="text-slate-900">Linux</strong>, 
                <strong className="text-slate-900"> Windows</strong> et <strong className="text-slate-900">macOS</strong> à 
                travers une analyse comparative complète.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-slate-600 font-medium">Filtrer par système :</p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={focusedOS === "all"}
                    onClick={() => setFocusedOS("all")}
                  >
                    ✨ Tous
                  </FilterButton>
                  {ALL_OS.map((os) => (
                    <FilterButton
                      key={os}
                      active={focusedOS === os}
                      onClick={() => setFocusedOS(os)}
                    >
                      {os === "Linux" ? "🐧" : os === "Windows" ? "🪟" : "🍎"} {os}
                    </FilterButton>
                  ))}
                </div>
              </div>

              <a
                href="#openness"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all"
              >
                Commencer l'exploration
                <span>→</span>
              </a>
            </div>

            
          </div>
        </section>

        {/* OPENNESS SECTION */}
        <ComparisonSection
          id="openness"
          title="🔓 Ouverture & Licence"
          description="Le niveau de transparence, d'accessibilité au code source et de contrôle utilisateur"
          focusedOS={focusedOS}
          cards={[
            {
              os: "Linux",
              color: "cyan",
              points: [
                "Code 100% open source et auditable",
                "Centaines de distributions personnalisables",
                "Communauté mondiale active et contributive"
              ]
            },
            {
              os: "Windows",
              color: "blue",
              points: [
                "Code propriétaire fermé (Microsoft)",
                "Modifications système très limitées",
                "Documentation développeur accessible"
              ]
            },
            {
              os: "macOS",
              color: "purple",
              points: [
                "Code propriétaire fermé (Apple)",
                "Base Unix mais environnement verrouillé",
                "Dépendance totale au hardware Apple"
              ]
            }
          ]}
          memeAlt="Meme comparant l'ouverture des systèmes"
        />

        {/* COST SECTION */}
        <ComparisonSection
          id="cost"
          title="💰 Coût & Licences"
          description="Prix d'acquisition, coûts cachés et budget global pour équiper plusieurs postes"
          focusedOS={focusedOS}
          cards={[
            {
              os: "Linux",
              color: "cyan",
              points: [
                "Gratuit pour la plupart des distributions",
                "Zéro coût de licence par machine",
                "Idéal pour écoles et associations"
              ]
            },
            {
              os: "Windows",
              color: "blue",
              points: [
                "Licence payante (~100-200€)",
                "Souvent incluse dans le prix du PC",
                "Licences volume pour entreprises"
              ]
            },
            {
              os: "macOS",
              color: "purple",
              points: [
                "Inclus avec l'achat d'un Mac",
                "Hardware Apple premium (>1000€)",
                "Budget élevé pour équiper une classe"
              ]
            }
          ]}
          memeAlt="Meme sur le coût des systèmes"
        />

        {/* PERFORMANCE SECTION */}
        <ComparisonSection
          id="performance"
          title="⚡ Performance & Ressources"
          description="Efficacité sur différents types de hardware, de l'ancien au dernier cri"
          focusedOS={focusedOS}
          cards={[
            {
              os: "Linux",
              color: "cyan",
              points: [
                "Fonctionne sur du matériel de 15+ ans",
                "Environnements ultra-légers disponibles",
                "Champion des serveurs et machines modestes"
              ]
            },
            {
              os: "Windows",
              color: "blue",
              points: [
                "Plus gourmand en RAM et stockage",
                "Optimisé pour le hardware récent",
                "Performances variables sur vieux PC"
              ]
            },
            {
              os: "macOS",
              color: "purple",
              points: [
                "Optimisation parfaite sur puces Apple Silicon",
                "Excellente autonomie batterie",
                "Limité au hardware Apple uniquement"
              ]
            }
          ]}
          memeAlt="Meme sur les performances"
        />

        {/* SECURITY SECTION */}
        <ComparisonSection
          id="security"
          title="🔒 Sécurité & Vie Privée"
          description="Protection contre les menaces, gestion des données personnelles et transparence"
          focusedOS={focusedOS}
          cards={[
            {
              os: "Linux",
              color: "cyan",
              points: [
                "Très peu ciblé par les malwares",
                "Contrôle total sur les processus système",
                "Mises à jour transparentes et fréquentes"
              ]
            },
            {
              os: "Windows",
              color: "blue",
              points: [
                "Cible n°1 des virus et ransomwares",
                "Windows Defender efficace maintenant",
                "Télémétrie activée par défaut"
              ]
            },
            {
              os: "macOS",
              color: "purple",
              points: [
                "Bon niveau de sécurité intégré",
                "Écosystème fermé = moins d'attaques",
                "Dépendant des politiques d'Apple"
              ]
            }
          ]}
          memeAlt="Meme sur la sécurité"
        />

        {/* COMPATIBILITY SECTION */}
        <ComparisonSection
          id="compatibility"
          title="🔌 Compatibilité & Logiciels"
          description="Disponibilité des applications, jeux, outils professionnels et facilité d'installation"
          focusedOS={focusedOS}
          cards={[
            {
              os: "Linux",
              color: "cyan",
              points: [
                "Énorme catalogue de logiciels libres",
                "Gaming en progrès (Steam Proton)",
                "Certains logiciels pro absents"
              ]
            },
            {
              os: "Windows",
              color: "blue",
              points: [
                "Catalogue le plus vaste au monde",
                "Tous les jeux AAA disponibles",
                "Standard en entreprise"
              ]
            },
            {
              os: "macOS",
              color: "purple",
              points: [
                "Référence pour création (design, vidéo)",
                "Bibliothèque de jeux limitée",
                "Outils spécifiques Apple (Final Cut, Logic)"
              ]
            }
          ]}
          memeAlt="Meme sur la compatibilité"
        />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p>© 2024 OS Comparator • Design moderne avec React & Tailwind</p>
            <p className="text-xs text-slate-500">Made with 💜 for better tech choices</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========== COMPONENTS ========== */

function Anchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
    >
      {label}
    </a>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm"
      }`}
    >
      {children}
    </button>
  );
}

function SummaryItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-3xl">{icon}</span>
      <div>
        <h4 className="text-slate-900 font-semibold mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function ScorePill({ label, linux, windows, mac, focused }: {
  label: string;
  linux: number;
  windows: number;
  mac: number;
  focused: OS | "all";
}) {
  const getTopScore = () => {
    const scores = { Linux: linux, Windows: windows, macOS: mac };
    const max = Math.max(linux, windows, mac);
    return Object.keys(scores).find(k => scores[k as OS] === max) as OS;
  };

  const winner = getTopScore();
  const isWinnerFocused = focused === winner || focused === "all";

  return (
    <div className={`text-center p-2 rounded-lg bg-white border transition-all ${
      isWinnerFocused ? "border-cyan-400 shadow-sm" : "border-slate-200"
    }`}>
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-cyan-400">{winner === "Linux" ? linux : winner === "Windows" ? windows : mac}/5</p>
    </div>
  );
}

function ComparisonSection({
  id,
  title,
  description,
  focusedOS,
  cards,
  memeAlt,
}: {
  id: string;
  title: string;
  description: string;
  focusedOS: OS | "all";
  cards: Array<{ os: OS; color: string; points: string[] }>;
  memeAlt: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-8">
        <h3 className="text-4xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-lg text-slate-600 max-w-3xl">{description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Cards Column */}
        <div className="flex-1 space-y-4">
          {cards.map((card) => (
            <OSCard
              key={card.os}
              os={card.os}
              color={card.color}
              points={card.points}
              focused={focusedOS === card.os || focusedOS === "all"}
            />
          ))}
        </div>

        {/* Meme Column - Vertical */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl h-full min-h-[400px] lg:min-h-[600px]">
            <img
              src="/mms/meems.jpg"
              alt={memeAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function OSCard({
  os,
  color,
  points,
  focused,
}: {
  os: OS;
  color: string;
  points: string[];
  focused: boolean;
}) {
  const colorClasses = {
    cyan: {
      border: "border-cyan-400",
      bg: "from-cyan-50 to-white",
      text: "text-cyan-600",
      shadow: "shadow-cyan-200"
    },
    blue: {
      border: "border-blue-400",
      bg: "from-blue-50 to-white",
      text: "text-blue-600",
      shadow: "shadow-blue-200"
    },
    purple: {
      border: "border-purple-400",
      bg: "from-purple-50 to-white",
      text: "text-purple-600",
      shadow: "shadow-purple-200"
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br backdrop-blur-xl p-6 transition-all duration-300 ${
        focused
          ? `${colors.border} ${colors.bg} shadow-xl ${colors.shadow} scale-[1.02]`
          : "border-slate-200 from-white to-slate-50 opacity-50 hover:opacity-100"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">
          {os === "Linux" ? "🐧" : os === "Windows" ? "🪟" : "🍎"}
        </span>
        <h4 className={`text-xl font-bold ${colors.text}`}>{os}</h4>
      </div>
      
      <ul className="space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex gap-3 text-slate-700">
            <span className={colors.text}>▸</span>
            <span className="text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}