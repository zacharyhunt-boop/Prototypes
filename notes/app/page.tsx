"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NotesPanel } from "@/components/notes-panel"
import { StickyNote } from "lucide-react"

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Click the button below to open the Notes panel.
        </p>

        <Button onClick={() => setIsPanelOpen(true)} className="gap-2">
          <StickyNote className="h-4 w-4" />
          Open Notes Panel
        </Button>
      </div>

      <NotesPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </main>
  )
}
