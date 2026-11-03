import { WHATSAPP } from './nav'

export function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MYR on WhatsApp"
      title="Chat with MYR on WhatsApp"
      className="fixed bottom-5 right-5 z-70 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/25 transition hover:scale-105 hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:bottom-7 sm:right-7"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        <path d="M16 3.5a12 12 0 0 0-10.3 18.1L4 28l6.6-1.7A12 12 0 1 0 16 3.5Z" />
        <path d="M11.2 9.8c.3-.6.7-.7 1.1-.7h.8c.3 0 .6.2.7.6l1 2.4c.1.3.1.6-.1.8l-.8 1c-.2.2-.2.5 0 .8.6 1 1.5 1.9 2.6 2.5.3.2.6.2.8-.1l1-1.2c.2-.3.5-.3.8-.2l2.2 1c.3.2.5.4.5.7 0 .6-.3 1.7-1.1 2.2-.7.5-1.6.8-2.7.5-1.1-.3-2.5-.8-4.1-2.2-1.9-1.7-3.1-3.8-3.4-4.9-.4-1.2 0-2.3.7-3.2Z" />
      </svg>
    </a>
  )
}