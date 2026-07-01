/**
 * GET /api/meetings/:id    — fetch a single meeting + analysis
 * PATCH /api/meetings/:id  — persists AI chat patches back to Supabase
 * DELETE /api/meetings/:id — deletes a meeting
 */
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getMeeting, updateAnalysis, deleteAnalysis } from "@/lib/storage"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const meeting = await getMeeting(id, userId)

    if (!meeting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(meeting)
  } catch (err) {
    console.error("[GET /api/meetings/:id]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const patch = await req.json()

    if (!patch || typeof patch !== "object") {
      return NextResponse.json({ error: "Invalid patch body" }, { status: 400 })
    }

    const ok = await updateAnalysis(id, patch, userId)

    if (!ok) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/meetings/:id]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    // deleteAnalysis is fire-and-forget (returns void) and scopes the
    // delete to user_id itself, so a mismatched/missing meeting just
    // results in zero rows affected rather than an error.
    await deleteAnalysis(id, userId)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[DELETE /api/meetings/:id]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}