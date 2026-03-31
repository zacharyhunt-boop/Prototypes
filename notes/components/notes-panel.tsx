"use client"

import { useRef, useState, useEffect } from "react"
import { X, Search, SlidersHorizontal, ChevronDown, ArrowUp, MoreVertical, Columns2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Note {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  reference: string
}

interface NotesPanelProps {
  isOpen: boolean
  onClose: () => void
}

function makeNote(id: string, author: string, date: string, content: string, reference: string): Note {
  return { id, author, avatar: "", date, content, reference }
}

const policyNotes: Note[] = [
  makeNote("p1", "Karen Nelson", "Feb 14, 2026, 3:02 PM", "Mauris vehicula, odio nec sagittis consectetur, magna risus mollis nisi, eget.", "CIP-GL-2026.03.1A"),
  makeNote("p2", "James Whitmore", "Feb 15, 2026, 10:14 AM", "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.", "CIP-GL-2026.03.2B"),
  makeNote("p3", "Linda Cho", "Feb 16, 2026, 1:45 PM", "Suspendisse potenti. Curabitur at lorem vel arcu tincidunt facilisis ut nec justo.", "CIP-GL-2026.03.3C"),
]

const lossAmountNotes: Note[] = [
  makeNote("l1", "Karen Nelson", "Feb 14, 2026, 3:02 PM", "Mauris vehicula, odio nec sagittis consectetur, magna risus mollis nisi, eget.", "CIP-GL-2026.03.1A"),
  makeNote("l2", "James Whitmore", "Feb 15, 2026, 9:30 AM", "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.", "CIP-GL-2026.04.1A"),
  makeNote("l3", "Linda Cho", "Feb 15, 2026, 11:00 AM", "Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.", "CIP-GL-2026.04.2B"),
  makeNote("l4", "Marcus Bell", "Feb 16, 2026, 8:55 AM", "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.", "CIP-GL-2026.04.3C"),
  makeNote("l5", "Karen Nelson", "Feb 16, 2026, 2:10 PM", "Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.", "CIP-GL-2026.04.4D"),
  makeNote("l6", "James Whitmore", "Feb 17, 2026, 9:00 AM", "Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.", "CIP-GL-2026.04.5E"),
  makeNote("l7", "Linda Cho", "Feb 17, 2026, 3:30 PM", "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.", "CIP-GL-2026.04.6F"),
  makeNote("l8", "Marcus Bell", "Feb 18, 2026, 10:20 AM", "Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.", "CIP-GL-2026.04.7G"),
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("")
}

// Deterministic avatar color based on name
function getAvatarColor(name: string) {
  const colors = [
    "bg-amber-700",
    "bg-blue-600",
    "bg-emerald-700",
    "bg-rose-700",
    "bg-indigo-600",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function NoteCard({ note }: { note: Note }) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className={`${getAvatarColor(note.author)} text-white text-sm font-medium`}>
              {getInitials(note.author)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{note.author}</p>
            <p className="text-xs text-muted-foreground">{note.date}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-3 text-sm text-foreground leading-relaxed">{note.content}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note.reference}</p>
    </div>
  )
}

interface SectionProps {
  title: string
  notes: Note[]
  topOffset: number
}

function NotesSection({ title, notes, topOffset }: SectionProps) {
  return (
    <div>
      <div
        className="sticky z-10 -mx-4 px-4 py-2.5"
        style={{
          top: topOffset,
          backgroundColor: "var(--background)",
        }}
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-3 pt-2 pb-8">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}

export function NotesPanel({ isOpen, onClose }: NotesPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const addNoteRef = useRef<HTMLDivElement>(null)
  const [addNoteShadow, setAddNoteShadow] = useState(false)
  const [addNoteHeight, setAddNoteHeight] = useState(0)

  // Measure the sticky "Add a note" block height so section headers can offset correctly
  useEffect(() => {
    if (!addNoteRef.current) return
    const ro = new ResizeObserver(() => {
      setAddNoteHeight(addNoteRef.current?.offsetHeight ?? 0)
    })
    ro.observe(addNoteRef.current)
    return () => ro.disconnect()
  }, [])

  // Show shadow on add-note block when scrolled past 0
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => setAddNoteShadow(el.scrollTop > 0)
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  // Section headers stack on top of the add-note block, so each one is offset by addNoteHeight.
  // Because only one section header is visible as sticky at a time (they push each other),
  // all section headers use the same top value.
  const sectionTop = addNoteHeight

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header — never scrolls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Notes</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Columns2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search — never scrolls */}
        <div className="px-4 py-3 shrink-0 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Notes" className="pl-9 bg-muted/50 border-border" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">

          {/* Sticky "Add a note" block */}
          <div
            ref={addNoteRef}
            className="sticky top-0 z-20 px-4 pt-3 pb-3 bg-background border-b border-transparent transition-colors duration-200"
            style={{
              borderBottomColor: addNoteShadow ? "var(--border)" : "transparent",
            }}
          >
            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Add a note</p>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="text-sm font-normal text-foreground bg-background">
                  Loss Amounts
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
                <Button size="icon" className="h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notes sections */}
          <div className="px-4 pt-4 pb-6">
            <NotesSection
              title="Policy Notes"
              notes={policyNotes}
              topOffset={sectionTop}
            />
            <NotesSection
              title="Loss Amounts"
              notes={lossAmountNotes}
              topOffset={sectionTop}
            />
          </div>

        </div>
      </div>
    </>
  )
}
