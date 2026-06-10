import Link from "next/link"
import Navbar from "@/components/layout/Navbar"

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <Navbar />
      <div className="container flex flex-col items-center justify-center pt-48 text-center">
        <h1 className="text-3xl font-semibold">Meeting not found</h1>
        <p className="mt-3 text-muted-foreground">
          This meeting doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/history"
          className="mt-8 rounded-2xl border bg-card/60 px-6 py-3 text-sm hover:bg-card transition-colors"
        >
          Back to History
        </Link>
      </div>
    </main>
  )
}