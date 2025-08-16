"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ImageIcon,
  Quote,
  Code,
  Plus,
  Trash2,
  GripVertical,
  Link,
} from "lucide-react"

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

interface BlockEditorProps {
  content: Block[]
  onChange: (content: Block[]) => void
}

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(
    content.length > 0
      ? content
      : [
          {
            id: "1",
            type: "paragraph",
            content: "",
          },
        ],
  )

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map((block) => (block.id === id ? { ...block, ...updates } : block))
    setBlocks(newBlocks)
    onChange(newBlocks)
  }

  const addBlock = (afterId: string, type: Block["type"] = "paragraph") => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      metadata: type === "list" ? { items: [""] } : {},
    }

    const index = blocks.findIndex((block) => block.id === afterId)
    const newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)]
    setBlocks(newBlocks)
    onChange(newBlocks)
  }

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return
    const newBlocks = blocks.filter((block) => block.id !== id)
    setBlocks(newBlocks)
    onChange(newBlocks)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) return

    const newBlocks = [...blocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]

    setBlocks(newBlocks)
    onChange(newBlocks)
  }

  const renderBlock = (block: Block, index: number) => {
    const commonProps = {
      className: "bg-input border-border text-foreground placeholder:text-muted-foreground",
      value: block.content,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        updateBlock(block.id, { content: e.target.value }),
    }

    return (
      <Card key={block.id} className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 cursor-grab"
                onMouseDown={(e) => e.preventDefault()}
              >
                <GripVertical className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Select
                  value={block.type}
                  onValueChange={(value: Block["type"]) => updateBlock(block.id, { type: value })}
                >
                  <SelectTrigger className="w-40 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Paragraph
                      </div>
                    </SelectItem>
                    <SelectItem value="heading1">
                      <div className="flex items-center gap-2">
                        <Heading1 className="h-4 w-4" />
                        Heading 1
                      </div>
                    </SelectItem>
                    <SelectItem value="heading2">
                      <div className="flex items-center gap-2">
                        <Heading2 className="h-4 w-4" />
                        Heading 2
                      </div>
                    </SelectItem>
                    <SelectItem value="heading3">
                      <div className="flex items-center gap-2">
                        <Heading3 className="h-4 w-4" />
                        Heading 3
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        List
                      </div>
                    </SelectItem>
                    <SelectItem value="quote">
                      <div className="flex items-center gap-2">
                        <Quote className="h-4 w-4" />
                        Quote
                      </div>
                    </SelectItem>
                    <SelectItem value="code">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Code
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Image
                      </div>
                    </SelectItem>
                    <SelectItem value="link">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Link
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, "up")}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, "down")}
                    disabled={index === blocks.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.id)}
                    disabled={blocks.length === 1}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Block Content */}
              {block.type === "paragraph" && (
                <Textarea {...commonProps} placeholder="Write your paragraph..." rows={3} className="resize-none" />
              )}

              {(block.type === "heading1" || block.type === "heading2" || block.type === "heading3") && (
                <Input {...commonProps} placeholder={`Enter ${block.type} text...`} />
              )}

              {block.type === "list" && (
                <div className="space-y-2">
                  {(block.metadata?.items || [""]).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`List item ${itemIndex + 1}...`}
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(block.metadata?.items || [])]
                          newItems[itemIndex] = e.target.value
                          updateBlock(block.id, { metadata: { ...block.metadata, items: newItems } })
                        }}
                        className="bg-input border-border text-foreground"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = (block.metadata?.items || []).filter((_, i) => i !== itemIndex)
                          updateBlock(block.id, { metadata: { ...block.metadata, items: newItems } })
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(block.metadata?.items || []), ""]
                      updateBlock(block.id, { metadata: { ...block.metadata, items: newItems } })
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
              )}

              {block.type === "quote" && (
                <Textarea {...commonProps} placeholder="Enter quote..." rows={2} className="resize-none" />
              )}

              {block.type === "code" && (
                <Textarea
                  {...commonProps}
                  placeholder="Enter code..."
                  rows={4}
                  className="font-mono text-sm resize-none"
                />
              )}

              {block.type === "image" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Image URL"
                    value={block.metadata?.url || ""}
                    onChange={(e) => updateBlock(block.id, { metadata: { ...block.metadata, url: e.target.value } })}
                    className="bg-input border-border text-foreground"
                  />
                  <Input
                    placeholder="Alt text"
                    value={block.metadata?.alt || ""}
                    onChange={(e) => updateBlock(block.id, { metadata: { ...block.metadata, alt: e.target.value } })}
                    className="bg-input border-border text-foreground"
                  />
                  <Input
                    placeholder="Caption (optional)"
                    value={block.metadata?.caption || ""}
                    onChange={(e) =>
                      updateBlock(block.id, { metadata: { ...block.metadata, caption: e.target.value } })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </div>
              )}

              {block.type === "link" && (
                <div className="space-y-2">
                  <Input {...commonProps} placeholder="Link text..." />
                  <Input
                    placeholder="URL"
                    value={block.metadata?.url || ""}
                    onChange={(e) => updateBlock(block.id, { metadata: { ...block.metadata, url: e.target.value } })}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => addBlock(block.id)}
                className="w-full border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{blocks.map((block, index) => renderBlock(block, index))}</div>
}
