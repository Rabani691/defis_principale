"use client";

import TuxResistance from "@/components/TuxResistance";
import { useState } from "react";

type FocusOS = "all" | "Linux" | "Windows/macOS";

const FACTORS = [
  {
    id: "licence",
    title: "1. Licence et coût",
    linuxText:
      'Linux est le système d’exploitation du “tout est permis… et gratuit !”. Pas besoin de casser votre tirelire ou de vendre un rein pour l’installer sur votre ordinateur. La plupart des distributions Linux sont open-source, ce qui signifie que vous pouvez non seulement l’utiliser, mais aussi regarder sous le capot, modifier le moteur, et même créer votre propre version que vous pourriez appeler… “SuperLinuxMagique”.',
    othersText:
      "À l’inverse, les systèmes comme Windows ou macOS ont tendance à être plus stricts sur la licence : il faut payer pour l’utiliser légalement, et les modifications personnelles sont limitées. Si vous essayez de bricoler trop, vous risquez de vous retrouver face à un joli panneau “Accès refusé”.",
    memeSrc: "/mms/licence.jpg",
  },
  {
    id: "securite",
    title: "2. Sécurité",
    linuxText:
      "Linux est comme un gardien vigilant 🛡️ : les virus et malwares ont du mal à passer. Sa communauté repère vite les failles et les corrige.",
    othersText:
      "Windows, très populaire, attire beaucoup plus d’attaques, tandis que macOS est globalement plus sûr, mais reste loin d’être invincible.",
    memeSrc: "/mms/security.jpg",
  },
  {
    id: "performance",
    title: "3. Performance",
    linuxText:
      "Linux est souvent léger et rapide, même sur des machines un peu anciennes 🚀. Il démarre vite, utilise moins de ressources et laisse votre PC respirer.",
    othersText:
      "Windows et macOS peuvent être plus gourmands : parfois votre ordinateur se sent comme un marathonien avec un sac de 20 kg sur le dos.",
    memeSrc: "/mms/perf_meems.jpg",
  },
  {
    id: "compatibilite",
    title: "4. Compatibilité logicielle",
    linuxText:
      "Linux adore les logiciels libres et open-source, avec un énorme catalogue disponible.",
    othersText:
      "Certains programmes populaires (jeux, logiciels pro) ne sont pas toujours disponibles directement sous Linux. Windows, lui, parle à presque tout le monde, tandis que macOS reste un peu plus sélectif.",
    memeSrc: "/mms/compatibilit.jpg",
  },
  {
    id: "personnalisation",
    title: "5. Personnalisation",
    linuxText:
      "Avec Linux, vous pouvez tout changer : l’apparence, le menu, le bureau… même le moindre petit détail. C’est comme un Lego infini pour votre PC !",
    othersText:
      "Windows et macOS offrent moins de liberté : vous pouvez changer quelques pièces, mais pas reconstruire le château entier.",
    memeSrc: "/mms/personalisation.jpg",
  },
  {
    id: "stabilite",
    title: "6. Stabilité et mises à jour",
    linuxText:
      "Linux est généralement très stable : les plantages sont rares et les mises à jour arrivent régulièrement, souvent sans interrompre votre travail.",
    othersText:
      "Windows peut parfois redémarrer quand on s’y attend le moins, et macOS reste stable, mais avec moins de contrôle laissé à l’utilisateur sur les mises à jour.",
    memeSrc: "/mms/mis_ajour.jpg",
  },
  {
    id: "materiel",
    title: "7. Support matériel",
    linuxText:
      "Linux supporte la majorité des matériels courants, surtout ceux qui ont quelques années.",
    othersText:
      "Certains périphériques très récents ou très propriétaires peuvent poser problème sous Linux. macOS, lui, fonctionne parfaitement… mais uniquement sur ses propres machines.",
    memeSrc: "/mms/old_meems.jpg",
  },
  {
    id: "facilite",
    title: "8. Facilité d’utilisation",
    linuxText:
      "Linux peut demander un petit temps d’adaptation pour les débutants, mais une fois qu’on le connaît, c’est un vrai plaisir.",
    othersText:
      "Windows est simple et familier pour la majorité des gens, tandis que macOS est intuitif, élégant… et parfois un peu trop verrouillé.",
    memeSrc: "/mms/facilit.jpg",
  },
  {
    id: "ecosysteme",
    title: "9. Écosystème et support technique",
    linuxText:
      "Linux a une communauté très active : forums, tutoriels et aides en ligne à profusion.",
    othersText:
      "Windows et macOS offrent un support officiel solide, mais parfois payant ou limité aux guides officiels.",
    memeSrc: "/mms/eco.jpg",
  },
  {
    id: "publicite",
    title: "10. Publicité dans le système",
    linuxText:
      "Linux est presque toujours sans pubs : pas de pop-ups ni de bannières qui vous interrompent.",
    othersText:
      "Windows et certains logiciels intégrés peuvent vous envoyer des pubs ou des « suggestions », un peu comme un vendeur insistant qui frappe à votre porte.",
    memeSrc: "/mms/ads.jpg",
  },
];

export default function HomePage() {
  const [focusedOS, setFocusedOS] = useState<FocusOS>("all");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showSubmenu, setShowSubmenu] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Désolé, je n'ai pas pu obtenir de réponse.",
        },
      ]);
    } catch (error) {
      console.error("Erreur:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erreur de connexion. Assurez-vous que le serveur est lancé.",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NIRDE
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Choisi le meilleur sys pour toi
              </p>
            </div>

            <nav className="relative flex gap-2 flex-wrap items-center justify-start lg:justify-end">
              <Anchor href="#overview" label="Vue d'ensemble" />

              {/* Dropdown Comparatif détaillé */}
              <div className="relative">
                <button
                  onClick={() => setShowSubmenu((prev) => !prev)}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1"
                >
                  Comparatif détaillé
                  <span className="text-xs">▾</span>
                </button>
                {showSubmenu && (
                  <div className="absolute left-0 top-full mt-2 w-56 sm:w-64 bg-white shadow-lg border border-slate-200 rounded-xl p-2 sm:p-3 z-50">
                    <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
                      {FACTORS.map((factor) => (
                        <a
                          key={factor.id}
                          href={`#${factor.id}`}
                          onClick={() => setShowSubmenu(false)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition"
                        >
                          {factor.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a
                href="https://chatbruti-404.vercel.app/"
                className="mt-1 sm:mt-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg transition-all text-center"
              >
                Pas encore convaincu ? Discute avec l’IA.
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 sm:pb-16 space-y-16 sm:space-y-20">
        {/* HERO SECTION */}
        <section id="overview" className="pt-10 sm:pt-16 lg:pt-24">
          <div className="grid lg:grid-cols-1 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 border border-cyan-300">
                <span className="text-xl sm:text-2xl">🚀</span>
                <span className="text-xs sm:text-sm text-cyan-700 font-medium">
                  Comparaison détaillée
                </span>
              </div>

              <p className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-cyan-900 bg-clip-text text-transparent">
                  Vos ordinateurs sont anciens
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Allez-vous acheter de nouvelles machines Windows
                  <span className="hidden sm:inline"> </span>
                  ou installer Linux ?
                </span>
              </p>

              <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-2xl">
                Explorez les forces et faiblesses de{" "}
                <strong className="text-slate-900">Linux</strong>,{" "}
                <strong className="text-slate-900">Windows</strong> et{" "}
                <strong className="text-slate-900">macOS</strong> à travers une
                analyse comparative concrète sur 10 facteurs clés.
              </p>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Filtrer l’affichage :
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={focusedOS === "all"}
                    onClick={() => setFocusedOS("all")}
                  >
                    ✨ Tous
                  </FilterButton>
                  <FilterButton
                    active={focusedOS === "Linux"}
                    onClick={() => setFocusedOS("Linux")}
                  >
                    🐧 Linux
                  </FilterButton>
                  <FilterButton
                    active={focusedOS === "Windows/macOS"}
                    onClick={() => setFocusedOS("Windows/macOS")}
                  >
                    🪟🍎 Windows & macOS
                  </FilterButton>
                </div>
              </div>

              <a
                href="#factors"
                className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm sm:text-base font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all"
              >
                Commencer l'exploration
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* FACTORS SECTION */}
        <section id="factors" className="scroll-mt-24 space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
              Comparatif Linux vs Windows & macOS
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl">
              Chaque carte ci-dessous reprend un facteur important (licence,
              sécurité, performance, etc.) avec une comparaison claire entre
              Linux et le duo Windows/macOS, accompagnée d’un meme illustratif.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            {FACTORS.map((factor, index) => (
              <section
                key={factor.id}
                id={factor.id}
                className="scroll-mt-24 sm:scroll-mt-28"
              >
                <FactorCard
                  index={index + 1}
                  title={factor.title}
                  linuxText={factor.linuxText}
                  othersText={factor.othersText}
                  memeSrc={factor.memeSrc}
                  focusedOS={focusedOS}
                />
              </section>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-xl">
        {/* Le jeu prend toute la largeur avec scroll horizontal si besoin sur mobile */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[320px] max-w-5xl mx-auto">
            <TuxResistance />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 text-center md:text-left">
            <p>© 2025 NIRD</p>
            <p className="text-[10px] sm:text-xs text-slate-500">
              Créé par GROUPE 404 pour aider les utilisateurs à faire des choix
            </p>
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
      className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
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
      className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm"
      }`}
    >
      {children}
    </button>
  );
}

function FactorCard({
  index,
  title,
  linuxText,
  othersText,
  memeSrc,
  focusedOS,
}: {
  index: number;
  title: string;
  linuxText: string;
  othersText: string;
  memeSrc: string;
  focusedOS: FocusOS;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-md sm:shadow-lg shadow-slate-200/60 overflow-hidden">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 p-4 sm:p-6 lg:p-8">
        {/* Text zone */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xs sm:text-sm font-bold">
              {index}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              {title}
            </h4>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {/* Linux card */}
            <div
              className={`rounded-2xl border bg-gradient-to-br from-cyan-50 to-white p-3 sm:p-4 shadow-sm transition-all ${
                focusedOS !== "all" && focusedOS !== "Linux"
                  ? "opacity-40"
                  : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">🐧</span>
                <span className="text-xs sm:text-sm font-semibold text-cyan-700">
                  Linux
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {linuxText}
              </p>
            </div>

            {/* Windows + macOS card */}
            <div
              className={`rounded-2xl border bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 shadow-sm transition-all ${
                focusedOS !== "all" && focusedOS !== "Windows/macOS"
                  ? "opacity-40"
                  : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">🪟🍎</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Windows & macOS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {othersText}
              </p>
            </div>
          </div>
        </div>

        {/* Meme zone */}
        <div className="flex items-start justify-center">
          <img
            src={memeSrc}
            alt={title}
            className="w-full max-w-xs sm:max-w-sm h-auto rounded-2xl border border-slate-200 object-contain"
          />
        </div>
      </div>
    </article>
  );
}
