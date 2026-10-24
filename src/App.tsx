import { useEffect, useState, type FormEvent } from "react";
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Menu,
  MessageCircle,
  Moon,
  Navigation,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Trees,
  Users,
  Waves,
  X,
  CalendarDays,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Dados da pousada                                                    */
/* ------------------------------------------------------------------ */

const NAME = "Pousada da Lua";
const WHATSAPP_NUMBER = "5563991327503";
const PHONE_DISPLAY = "(63) 99132-7503";
const ADDRESS = "Av. Beira Rio, 867, Itaguatins - TO, 77920-000";
const PLUS_CODE = "6GHC+P8 Itaguatins, Tocantins";
const RATING = 4.5;
const REVIEWS_COUNT = 25;
const MAPS_QUERY = encodeURIComponent(`${NAME}, ${ADDRESS}`);

const whatsappLink = (text = `Olá! Gostaria de mais informações sobre a ${NAME}.`) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const photo = (id: number, w = 1600, h = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

const HERO_IMAGE = photo(33744117, 2000, 1200);

const GALLERY = [
  { id: 33744117, title: "Vista externa", desc: "Área tropical com palmeiras" },
  { id: 36394732, title: "Área da pousada", desc: "Espaço moderno com piscina" },
  { id: 14025023, title: "Quarto", desc: "Vista para o jardim" },
  { id: 3755590, title: "Roupa de cama", desc: "Conforto para o seu descanso" },
  { id: 14025911, title: "Suíte", desc: "Madeira e aconchego" },
  { id: 39369927, title: "Varanda", desc: "Um lugar para relaxar" },
  { id: 17489489, title: "Jardim", desc: "Vegetação tropical ao redor" },
  { id: 6935382, title: "Rio ao entardecer", desc: "Pôr do sol na beira do rio" },
];

const ROOMS = [
  {
    id: 14025023,
    name: "Quarto Standard",
    desc: "Acomodação confortável e prática, com cama de casal ou solteiro, ideal para estadias curtas.",
    icon: BedDouble,
  },
  {
    id: 3755590,
    name: "Quarto Superior",
    desc: "Mais espaço e conforto, com roupa de cama macia para um descanso completo após o dia.",
    icon: Sparkles,
  },
  {
    id: 14025911,
    name: "Suíte",
    desc: "Ambiente reservado com toques de madeira, pensado para casais e para quem busca mais privacidade.",
    icon: Moon,
  },
];

const HIGHLIGHTS = [
  {
    icon: Waves,
    title: "Na beira do rio",
    text: "Localizada na Avenida Beira Rio, em Itaguatins, com a paisagem ribeirinha logo ali.",
  },
  {
    icon: Trees,
    title: "Ambiente tranquilo",
    text: "Jardim tropical e clima acolhedor para desacelerar e recarregar as energias.",
  },
  {
    icon: Heart,
    title: "Hospitalidade",
    text: "Atendimento próximo e cordial, com reservas diretas pelo WhatsApp.",
  },
];

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#acomodacoes", label: "Acomodações" },
  { href: "#galeria", label: "Galeria" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#localizacao", label: "Localização" },
];

/* ------------------------------------------------------------------ */
/* Utilitários de data                                                 */
/* ------------------------------------------------------------------ */

const toISO = (d: Date) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const parseISO = (s: string) => new Date(`${s}T00:00:00`);

const formatBR = (s: string) => {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

/* ------------------------------------------------------------------ */
/* Componentes auxiliares                                              */
/* ------------------------------------------------------------------ */

function Stars({ value = RATING, className = "h-4 w-4" }: { value?: number; className?: string }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${className} text-amber-200`} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${className} fill-amber-400 text-amber-400`} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-slate-600">{text}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cabeçalho                                                           */
/* ------------------------------------------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-slate-950/95 shadow-lg shadow-black/20 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#topo" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900">
            <Moon className="h-5 w-5" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-wide">{NAME}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/85 transition hover:text-amber-300">
              {l.label}
            </a>
          ))}
          <a
            href="#reserva"
            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            Reservar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-white md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-slate-950 px-5 pb-6 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {[...NAV_LINKS, { href: "#reserva", label: "Reservar" }].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/90 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="topo" className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      <img src={HERO_IMAGE} alt={`Vista da ${NAME}`} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-stone-50 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/10 px-4 py-1.5 text-sm font-medium text-amber-200 backdrop-blur">
            <Moon className="h-4 w-4" /> Hotel em Itaguatins, Tocantins
          </span>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl">{NAME}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/85">
            Descanso, conforto e hospitalidade no coração de Itaguatins. Um refúgio tranquilo para quem quer
            desacelerar.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-white">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <Stars />
              <span className="font-semibold">{RATING.toString().replace(".", ",")}</span>
              <span className="text-sm text-white/75">({REVIEWS_COUNT} avaliações)</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#reserva"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-900/30 transition hover:bg-amber-300"
            >
              <CalendarDays className="h-5 w-5" /> Ver disponibilidade
            </a>
            <a
              href="#galeria"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-900"
            >
              Ver fotos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Faixa de informações rápidas                                        */
/* ------------------------------------------------------------------ */

function InfoStrip() {
  const items = [
    { icon: MapPin, label: "Endereço", value: ADDRESS, sub: PLUS_CODE },
    { icon: Phone, label: "Telefone / WhatsApp", value: PHONE_DISPLAY, sub: "Atendimento direto" },
    { icon: Star, label: "Avaliação Google", value: `${RATING.toString().replace(".", ",")} de 5`, sub: `${REVIEWS_COUNT} avaliações` },
  ];
  return (
    <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-5">
      <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 md:grid-cols-3 md:p-8">
        {items.map((it) => (
          <div key={it.label} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <it.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{it.label}</p>
              <p className="mt-1 break-words font-medium text-slate-900">{it.value}</p>
              <p className="text-sm text-slate-500">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sobre                                                               */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Sobre nós</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
            Um refúgio acolhedor à beira do Tocantins
          </h2>
          <p className="mt-6 leading-relaxed text-slate-600">
            A {NAME} recebe você com atenção e simplicidade. Localizada na Avenida Beira Rio, em Itaguatins, é uma
            boa escolha para quem visita a cidade a trabalho, a lazer ou para conhecer a região ribeirinha.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Entre um passeio e outro, aproveite o clima tranquilo, o jardim tropical e o descanso que só um lugar
            acolhedor oferece.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-1">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-amber-300">
                  <h.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{h.title}</h3>
                  <p className="text-sm text-slate-600">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-200 to-indigo-200 opacity-60 blur-2xl" />
          <img
            src={photo(6935382, 1200, 1000)}
            alt="Pôr do sol no rio"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
            loading="lazy"
          />
          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
            <span className="text-3xl font-bold text-slate-900">{RATING.toString().replace(".", ",")}</span>
            <div>
              <Stars className="h-3.5 w-3.5" />
              <p className="text-xs text-slate-500">{REVIEWS_COUNT} avaliações no Google</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Acomodações                                                         */
/* ------------------------------------------------------------------ */

function Rooms() {
  return (
    <section id="acomodacoes" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle
          eyebrow="Acomodações"
          title="Escolha o seu espaço"
          text="Quartos pensados para o conforto e o descanso, do modelo mais prático à suíte."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {ROOMS.map((r) => (
            <article
              key={r.name}
              className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-900/10 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo(r.id, 900, 675)}
                  alt={r.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-slate-900">{r.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.desc}</p>
                <a
                  href={whatsappLink(`Olá! Gostaria de saber disponibilidade e valores do ${r.name} na ${NAME}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-amber-600"
                >
                  Consultar disponibilidade <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Galeria com lightbox                                                */
/* ------------------------------------------------------------------ */

function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? null : (i + 1) % GALLERY.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? null : (i - 1 + GALLERY.length) % GALLERY.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const current = active !== null ? GALLERY[active] : null;

  return (
    <section id="galeria" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Galeria" title="Conheça a pousada" text="Um olhar sobre os espaços, quartos e paisagens." />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {GALLERY.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full" : "aspect-square"
              }`}
              aria-label={`Ampliar foto: ${g.title}`}
            >
              <img
                src={photo(g.id, i === 0 ? 1200 : 700, i === 0 ? 1200 : 700)}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-left opacity-0 transition group-hover:opacity-100">
                <p className="font-semibold text-white">{g.title}</p>
                <p className="text-xs text-white/80">{g.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {current && active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="absolute left-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + GALLERY.length) % GALLERY.length);
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={photo(current.id, 1600, 1100)}
              alt={current.title}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-white">
              <span className="font-semibold">{current.title}</span>
              <span className="text-white/70"> · {current.desc}</span>
              <span className="ml-2 text-sm text-white/50">
                {active + 1}/{GALLERY.length}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % GALLERY.length);
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Avaliações                                                          */
/* ------------------------------------------------------------------ */

function Reviews() {
  return (
    <section id="avaliacoes" className="scroll-mt-20 bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Avaliações</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Bem avaliada pelos hóspedes</h2>
            <p className="mt-4 text-white/70">
              A {NAME} tem nota média de {RATING.toString().replace(".", ",")} no Google, com base em{" "}
              {REVIEWS_COUNT} avaliações de quem já se hospedou.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-200"
            >
              Ver avaliações no Google <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-6">
              <span className="font-serif text-7xl font-semibold text-amber-300">
                {RATING.toString().replace(".", ",")}
              </span>
              <div>
                <Stars className="h-7 w-7" />
                <p className="mt-2 text-white/70">{REVIEWS_COUNT} avaliações</p>
                <p className="text-sm text-white/50">Hotel · Google Maps</p>
              </div>
            </div>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              {[
                { icon: Heart, text: "Hospitalidade e atenção dos anfitriões" },
                { icon: Trees, text: "Ambiente tranquilo, com jardim e clima agradável" },
                { icon: Navigation, text: "Localização prática no centro de Itaguatins" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-white/85">
                  <f.icon className="h-5 w-5 text-amber-300" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reserva (monta pedido e envia pelo WhatsApp)                        */
/* ------------------------------------------------------------------ */

function BookingForm() {
  const [checkin, setCheckin] = useState(() => toISO(new Date()));
  const [checkout, setCheckout] = useState(() => toISO(addDays(new Date(), 1)));
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const nights =
    checkin && checkout
      ? Math.round((parseISO(checkout).getTime() - parseISO(checkin).getTime()) / 86400000)
      : 0;

  const handleCheckin = (value: string) => {
    setCheckin(value);
    if (value && checkout && parseISO(checkout) <= parseISO(value)) {
      setCheckout(toISO(addDays(parseISO(value), 1)));
    }
    setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkin || !checkout) {
      setError("Selecione as datas de check-in e check-out.");
      return;
    }
    if (nights <= 0) {
      setError("A data de check-out deve ser posterior ao check-in.");
      return;
    }
    setError("");

    const lines = [
      `Olá! Gostaria de fazer uma reserva na ${NAME}.`,
      name.trim() ? `Nome: ${name.trim()}` : null,
      `Check-in: ${formatBR(checkin)}`,
      `Check-out: ${formatBR(checkout)} (${nights} ${nights === 1 ? "noite" : "noites"})`,
      `Hóspedes: ${guests}`,
      "Poderia me informar a disponibilidade e os valores?",
    ].filter(Boolean);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-200";

  return (
    <section id="reserva" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionTitle
          eyebrow="Reserva"
          title="Verifique a disponibilidade"
          text="Escolha as datas e envie o pedido direto pelo WhatsApp. Confirmamos valores e disponibilidade para você."
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 sm:p-10 md:grid-cols-2 lg:grid-cols-4"
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              <CalendarDays className="mr-1 inline h-4 w-4 text-amber-600" />
              Check-in
            </span>
            <input
              type="date"
              value={checkin}
              min={toISO(new Date())}
              onChange={(e) => handleCheckin(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              <CalendarDays className="mr-1 inline h-4 w-4 text-amber-600" />
              Check-out
            </span>
            <input
              type="date"
              value={checkout}
              min={checkin ? toISO(addDays(parseISO(checkin), 1)) : undefined}
              onChange={(e) => {
                setCheckout(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              <Users className="mr-1 inline h-4 w-4 text-amber-600" />
              Hóspedes
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "hóspede" : "hóspedes"}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Seu nome</span>
            <input
              type="text"
              value={name}
              placeholder="Como podemos te chamar?"
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </label>

          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {nights > 0 ? (
                <p>
                  <span className="font-semibold text-slate-900">
                    {formatBR(checkin)} → {formatBR(checkout)}
                  </span>{" "}
                  · {nights} {nights === 1 ? "noite" : "noites"} · {guests}{" "}
                  {guests === 1 ? "hóspede" : "hóspedes"}
                </p>
              ) : (
                <p>Selecione um período de hospedagem.</p>
              )}
              {error && <p className="mt-1 font-medium text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-600"
            >
              <MessageCircle className="h-5 w-5" /> Enviar pedido pelo WhatsApp
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Apenas pedido de informação. A reserva é confirmada após contato com a pousada.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Localização                                                         */
/* ------------------------------------------------------------------ */

function Location() {
  return (
    <section id="localizacao" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Localização" title="Como chegar" text="Estamos na Avenida Beira Rio, em Itaguatins, Tocantins." />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-3xl bg-stone-50 p-8 ring-1 ring-slate-900/5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">Endereço</p>
                <p className="text-slate-600">{ADDRESS}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Navigation className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">Código Plus</p>
                <p className="text-slate-600">{PLUS_CODE}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">Telefone</p>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-slate-600 hover:text-amber-700">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                <Navigation className="h-4 w-4" /> Como chegar
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:border-slate-900"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-900/10 lg:col-span-2">
            <iframe
              title={`Mapa de localização da ${NAME}`}
              src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
              className="h-[420px] w-full border-0 lg:h-full lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rodapé e botão flutuante                                            */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900">
              <Moon className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold">{NAME}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm">{ADDRESS}</p>
          <p className="text-sm">{PHONE_DISPLAY}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-amber-300">
              {l.label}
            </a>
          ))}
          <a href="#reserva" className="hover:text-amber-300">
            Reservar
          </a>
        </nav>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3.5 font-semibold text-white shadow-xl shadow-emerald-900/30 transition hover:scale-105 hover:bg-emerald-600"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 antialiased">
      <Header />
      <main>
        <Hero />
        <InfoStrip />
        <About />
        <Rooms />
        <Gallery />
        <Reviews />
        <BookingForm />
        <Location />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
