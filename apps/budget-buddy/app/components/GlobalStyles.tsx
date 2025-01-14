'use client'

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      :root {
        --scrollbar-thumb: #a0aec0;
        --scrollbar-track: #e2e8f0;
      }
      ::-webkit-scrollbar {
        width: 14px;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 7px;
        border: 4px solid var(--scrollbar-track);
      }
      ::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
      }
    `}</style>
  )
}

