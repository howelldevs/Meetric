"use client"

import { useState } from "react"
import { Download, Copy, Check, ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MeetingAnalysis } from "@/types/analysis"
import { downloadMarkdown, downloadPDF, toMarkdown, copyToClipboard, toNotionClipboard } from "@/lib/export"

interface Props {
  analysis: MeetingAnalysis
}

export default function ExportButton({ analysis }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (type: "markdown" | "notion") => {
    const text = type === "notion" ? toNotionClipboard(analysis) : toMarkdown(analysis)
    await copyToClipboard(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="rounded-2xl gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown className="h-3 w-3" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">

            <button
              onClick={() => { downloadPDF(analysis); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              <FileText className="h-4 w-4 text-primary" />
              Download PDF
            </button>

            <button
              onClick={() => { downloadMarkdown(analysis); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              <Download className="h-4 w-4 text-primary" />
              Download .md file
            </button>

            <button
              onClick={() => handleCopy("markdown")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              {copied === "markdown" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-primary" />}
              Copy as Markdown
            </button>

            <button
              onClick={() => handleCopy("notion")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              {copied === "notion" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-primary" />}
              Copy for Notion
            </button>
          </div>
        </>
      )}
    </div>
  )
}