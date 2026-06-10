import { createClient } from "@/lib/supabase/client"
import { getDeviceId } from "@/lib/device-id"
import type {
  MeetingAnalysis,
  ActionItem,
  Participant,
} from "@/types/analysis"

export type HistoryEntry = MeetingAnalysis & {
  id: string
  savedAt: string
}

interface MeetingRow {
  id: string
  created_at: string
  title: string
  summary: string
  processing_time: number
  action_items: ActionItem[]
  decisions: string[]
  participants: Participant[]
  transcript: string
  device_id: string
  user_id: string | null
}

function toRow(
  analysis: MeetingAnalysis,
  deviceId: string,
  userId?: string
) {
  return {
    device_id: deviceId,
    user_id: userId ?? null,
    title: analysis.title,
    summary: analysis.summary,
    processing_time: Math.round(analysis.processingTime),
    action_items: analysis.actionItems,
    decisions: analysis.decisions,
    participants: analysis.participants,
    transcript: analysis.transcript,
  }
}

function fromRow(row: MeetingRow): HistoryEntry {
  return {
    id: row.id,
    savedAt: row.created_at,
    title: row.title,
    summary: row.summary,
    processingTime: row.processing_time,
    actionItems: row.action_items ?? [],
    decisions: row.decisions ?? [],
    participants: row.participants ?? [],
    transcript: row.transcript ?? "",
  }
}

export async function saveAnalysis(
  analysis: MeetingAnalysis,
  userId?: string
): Promise<string | null> {
  if (!userId) return null // anonymous — don't save

  const supabase = createClient()
  const deviceId = getDeviceId()

  const { data, error } = await supabase
    .from("meetings")
    .insert(toRow(analysis, deviceId, userId))
    .select("id")
    .single()

  if (error) {
    console.error("Save error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return null
  }

  return data.id
}

export async function getHistory(
  userId?: string
): Promise<HistoryEntry[]> {
  const supabase = createClient()
  const deviceId = getDeviceId()

  console.log("Fetching history...")
  console.log("User ID:", userId)
  console.log("Device ID:", deviceId)

  let query = supabase
    .from("meetings")
    .select("*")

  if (userId) {
    query = query.or(
      `user_id.eq.${userId},device_id.eq.${deviceId}`
    )
  } else {
    query = query.eq("device_id", deviceId)
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Fetch error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    return []
  }

  console.log("Fetched rows:", data)

  return (data ?? []).map((row) =>
    fromRow(row as MeetingRow)
  )
}

export async function deleteAnalysis(
  id: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("meetings")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Delete error:", error)
  }
}