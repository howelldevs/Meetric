"use client"

import { useState } from "react"
import { Users, Sparkles, FileText, RotateCcw, MessageSquare } from "lucide-react"
import type { MeetingAnalysis } from "@/types/analysis"
import ActionItems from "@/components/results/action-items"
import FollowUpChat from "@/components/results/follow-up-chat"
import ExportButton from "@/components/results/export-button"
import Link from "next/link"

interface Props {
  analysis: MeetingAnalysis
}

export default function ResultsDashboard({ analysis: initial }: Props) {
  const [analysis, setAnalysis] = useState(initial)
  const [showChat, setShowChat] = useState(false)

  if (!analysis) return null

  const { title, summary, processingTime, decisions, participants, transcript } = analysis

  return (
    <div className="container relative pb-32 pt-8">

      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Analysis complete
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-muted-foreground leading-7">{summary}</p>
        </div>

        {/* Stats + Actions */}
        <div className="flex flex-col gap-3 lg:items-end lg:shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border bg-card/60 px-4 py-3 backdrop-blur text-center">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="mt-0.5 text-lg font-semibold">{processingTime}s</p>
            </div>
            <div className="rounded-2xl border bg-card/60 px-4 py-3 backdrop-blur text-center">
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="mt-0.5 text-lg font-semibold">{analysis.actionItems.length}</p>
            </div>
            <div className="rounded-2xl border bg-card/60 px-4 py-3 backdrop-blur text-center">
              <p className="text-xs text-muted-foreground">People</p>
              <p className="mt-0.5 text-lg font-semibold">{participants.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton analysis={analysis} />
            <Link
              href="/upload"
              className="flex items-center gap-2 rounded-2xl border bg-card/60 px-4 py-2.5 text-sm backdrop-blur hover:bg-card transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">

        {/* Left */}
        <div className="space-y-8">

          {/* Action Items */}
          <ActionItems
            initial={analysis.actionItems}
            onChange={(items) => setAnalysis((a) => ({ ...a, actionItems: items }))}
          />

          {/* Decisions */}
          <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">
            <h2 className="text-lg font-semibold mb-5">Key Decisions</h2>
            {decisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No decisions recorded.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {decisions.map((d, i) => (
                  <div key={i} className="rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 text-sm">
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Transcript</h2>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-2xl bg-background/50 p-5 text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-6">

          {/* Participants */}
          <div className="rounded-3xl border bg-card/70 p-6 backdrop-blur">
            <div className="flex items-center gap-2 mb-5">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Participants</h2>
            </div>
            <div className="space-y-4">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No participants detected.</p>
              ) : (
                participants.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ask AI teaser */}
          <div
            onClick={() => setShowChat(true)}
            className="group cursor-pointer rounded-3xl border bg-card/70 p-6 backdrop-blur hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Ask AI</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-6">
              Ask anything about this meeting — who owns what, key commitments, or a quick recap.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary">
              <span>Start chatting</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat overlay */}
      {showChat && (
        <FollowUpChat
          analysis={analysis}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}