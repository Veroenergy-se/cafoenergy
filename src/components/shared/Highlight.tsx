// Renders copy where *wrapped* phrases are highlighted in the section's accent colour.
export default function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) =>
        i % 2 === 1 ? <span key={i} className="text-accent">{part}</span> : part,
      )}
    </>
  )
}
