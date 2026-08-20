import { useRef, useState } from 'react'
import { Plus, Star, Trash2, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatShort, todayISO } from '../lib/date'

export function Outfits() {
  const outfits = useStore((s) => s.outfits)
  const addOutfit = useStore((s) => s.addOutfit)
  const deleteOutfit = useStore((s) => s.deleteOutfit)
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Outfit of the Day
          </h1>
          <p className="text-sm text-neutral-500">Log what you wore and how it felt.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm hover:bg-orange-600"
        >
          <Plus size={20} />
        </button>
      </header>

      {outfits.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-500">
          No outfits logged yet. Tap + to add today's look.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {outfits.map((o) => (
            <div
              key={o.id}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900"
            >
              {o.photoDataUrl ? (
                <img src={o.photoDataUrl} alt={o.description} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-orange-50 text-3xl dark:bg-orange-500/10">
                  👗
                </div>
              )}
              <button
                onClick={() => deleteOutfit(o.id)}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
              <div className="p-2.5">
                <p className="text-xs text-neutral-400">{formatShort(o.date)}</p>
                <p className="line-clamp-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {o.description}
                </p>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < o.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}
                    />
                  ))}
                </div>
                {o.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {o.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {open && <AddOutfitModal onClose={() => setOpen(false)} onSave={addOutfit} />}
    </div>
  )
}

function AddOutfitModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (entry: { date: string; description: string; tags: string[]; rating: number; photoDataUrl?: string }) => void
}) {
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [rating, setRating] = useState(4)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoDataUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function submit() {
    if (!description.trim()) return
    onSave({
      date: todayISO(),
      description: description.trim(),
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      rating,
      photoDataUrl,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-neutral-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Log today's outfit</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
        >
          {photoDataUrl ? (
            <img src={photoDataUrl} className="h-full w-full object-cover" alt="preview" />
          ) : (
            <span className="text-sm text-neutral-400">Tap to add a photo (optional)</span>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        <label className="mb-1 block text-xs font-medium text-neutral-500">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Black jeans, white tee, denim jacket..."
          rows={2}
          className="mb-3 w-full resize-none rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-orange-500 dark:border-neutral-700"
        />

        <label className="mb-1 block text-xs font-medium text-neutral-500">Tags (comma separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="casual, work, date night"
          className="mb-3 w-full rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-orange-500 dark:border-neutral-700"
        />

        <label className="mb-1 block text-xs font-medium text-neutral-500">How confident did you feel?</label>
        <div className="mb-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)}>
              <Star
                size={24}
                className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}
              />
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={!description.trim()}
          className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Save outfit
        </button>
      </div>
    </div>
  )
}
