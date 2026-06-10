"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const SAMPLE_TRANSCRIPT = `Sarah: Okay everyone, let's get started. We need to finalize the onboarding flow before the July 18 launch.

Michael: Engineering can deliver the API updates by Monday. Auth and user creation endpoints will be ready.

Emma: I'll have the design revisions done by Thursday. The mobile screens are almost wrapped.

Sarah: Good. We also agreed on freemium pricing — that's locked in. Michael, can you update the pricing docs?

Michael: Yes, I'll do that by Monday as well.

Sarah: Emma, you own the onboarding screens. That's high priority — can we get those by Friday?

Emma: Confirmed, Friday works.

Sarah: One more thing — mobile onboarding is the priority over desktop. Let's align on that.

Michael: Agreed. Desktop can follow in the next sprint.

Sarah: Perfect. So to recap: launch is July 18, freemium pricing approved, mobile onboarding first. Let's ship.`

interface Props {
  onAnalyze: (transcript: string) => void
}

export default function UploadZone({ onAnalyze }: Props) {
  const [transcript, setTranscript] = useState("")
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = () => {
    const text = transcript.trim()
    if (!text) return
    onAnalyze(text)
  }

  const handleSample = () => {
    setTranscript(SAMPLE_TRANSCRIPT)
    setFileName(null)
  }

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setTranscript(e.target?.result as string)
      setFileName(file.name)
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) readFile(file)
  }, [])

  const clearFile = () => {
    setFileName(null)
    setTranscript("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur-xl">
      <div className="p-6 space-y-5">

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-7 text-center transition-colors duration-200 ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border/60 bg-background/40 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />

          {fileName ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">File loaded</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile() }}
                className="absolute right-3 top-3 rounded-lg p-1 hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop a file or click to browse</p>
                <p className="text-xs text-muted-foreground mt-0.5">.txt .md .pdf .doc</p>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs text-muted-foreground">or paste directly</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Textarea */}
        <div className="relative">
          <Textarea
            placeholder="Paste your meeting transcript here..."
            className="min-h-48 resize-none rounded-2xl border-border/60 bg-background/60 text-sm leading-7"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          {transcript && (
            <button
              onClick={() => { setTranscript(""); setFileName(null) }}
              className="absolute right-3 top-3 rounded-lg p-1 hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSample}
            className="text-xs text-primary hover:underline"
          >
            Use sample transcript
          </button>
          <Button
            size="lg"
            className="rounded-2xl px-8 shadow-lg shadow-primary/20"
            onClick={handleAnalyze}
            disabled={!transcript.trim()}
          >
            Analyze with Qwen AI
          </Button>
        </div>
      </div>
    </div>
  )
}