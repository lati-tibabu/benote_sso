export function CodeBlock({ children }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs leading-relaxed sm:text-sm">
      <code>{children}</code>
    </pre>
  )
}
