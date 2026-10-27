/**
 * Partner logos marquee — 15 verified brand logos from the source Partners
 * section (alt texts from audit/pages/home.links.md).
 */
const LOGOS = [
  '2024-08-buy-time-attendance.png',
  '2024-08-buy-restaurant-billing-software.png',
  '2024-08-buy-pos-system.png',
  '2024-08-buy-Lenovo.png',
  '2024-08-buy-keyboard-mouse.png',
  '2024-08-buy-hp-laptop.png',
  '2024-08-buy-hikvision.png',
  '2024-08-buy-grandstream.png',
  '2024-08-buy-dlink.png',
  '2024-08-buy-dell-laptop.png',
  '2024-08-buy-cp-plus.png',
  '2024-08-buy-cctv.png',
  '2024-08-buy-belden.png',
  '2024-08-buy-avaya.png',
  '2024-08-buy-thermal-printer.png',
] as const

const ALT: Record<string, string> = {
  '2024-08-buy-time-attendance.png': 'buy-time-attendance',
  '2024-08-buy-restaurant-billing-software.png': 'buy-restaurant-billing-software',
  '2024-08-buy-pos-system.png': 'buy-pos-system',
  '2024-08-buy-Lenovo.png': 'buy-Lenovo',
  '2024-08-buy-keyboard-mouse.png': 'buy-keyboard-mouse',
  '2024-08-buy-hp-laptop.png': 'buy-hp-laptop',
  '2024-08-buy-hikvision.png': 'buy-hikvision',
  '2024-08-buy-grandstream.png': 'buy-grandstream',
  '2024-08-buy-dlink.png': 'buy-dlink',
  '2024-08-buy-dell-laptop.png': 'buy-dell-laptop',
  '2024-08-buy-cp-plus.png': 'buy-cp-plus',
  '2024-08-buy-cctv.png': 'buy-cctv',
  '2024-08-buy-belden.png': 'buy-belden',
  '2024-08-buy-avaya.png': 'buy-avaya',
  '2024-08-buy-thermal-printer.png': 'buy-thermal-printer',
}

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16" aria-hidden={ariaHidden}>
      {LOGOS.map((file) => (
        <img
          key={file}
          src={`/assets/${file}`}
          alt={ariaHidden ? '' : ALT[file]}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-xl object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-16 sm:w-16"
        />
      ))}
    </div>
  )
}

export function PartnersMarquee() {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-[var(--animate-marquee)] gap-12 group-hover:[animation-play-state:paused] sm:gap-16">
        <Row ariaHidden />
        <Row ariaHidden />
      </div>
    </div>
  )
}
