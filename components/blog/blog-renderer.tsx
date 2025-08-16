"use client"

interface Block {
  id: string
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "list" | "image" | "quote" | "code" | "link"
  content: string
  metadata?: {
    url?: string
    alt?: string
    caption?: string
    items?: string[]
  }
}

interface BlogRendererProps {
  content: Block[]
}

export default function BlogRenderer({ content }: BlogRendererProps) {
  if (!content || !Array.isArray(content)) {
    return <div className="text-muted-foreground">No content available.</div>
  }

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={block.id} className="text-foreground leading-relaxed mb-4">
            {block.content}
          </p>
        )

      case "heading1":
        return (
          <h1 key={block.id} className="text-3xl font-bold text-foreground mb-6 mt-8">
            {block.content}
          </h1>
        )

      case "heading2":
        return (
          <h2 key={block.id} className="text-2xl font-semibold text-foreground mb-4 mt-6">
            {block.content}
          </h2>
        )

      case "heading3":
        return (
          <h3 key={block.id} className="text-xl font-medium text-foreground mb-3 mt-5">
            {block.content}
          </h3>
        )

      case "list":
        return (
          <ul key={block.id} className="list-disc list-inside space-y-2 mb-4 text-foreground">
            {(block.metadata?.items || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )

      case "quote":
        return (
          <blockquote key={block.id} className="border-l-4 border-primary pl-6 py-2 mb-4 italic text-foreground">
            {block.content}
          </blockquote>
        )

      case "code":
        return (
          <pre key={block.id} className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{block.content}</code>
          </pre>
        )

      case "image":
        return (
          <div key={block.id} className="mb-6">
            {block.metadata?.url && (
              <img
                src={block.metadata.url || "/placeholder.svg"}
                alt={block.metadata?.alt || ""}
                className="w-full rounded-lg border border-border"
              />
            )}
            {block.metadata?.caption && (
              <p className="text-sm text-muted-foreground text-center mt-2">{block.metadata.caption}</p>
            )}
          </div>
        )

      case "link":
        return (
          <p key={block.id} className="mb-4">
            <a
              href={block.metadata?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline transition-colors"
            >
              {block.content}
            </a>
          </p>
        )

      default:
        return null
    }
  }

  return <div className="prose prose-invert max-w-none">{content.map(renderBlock)}</div>
}
