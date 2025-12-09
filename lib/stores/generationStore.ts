"use client"

type GenerationType = "workout" | "meal"

interface GenerationState {
  id: string
  type: GenerationType
  params: Record<string, unknown>
  status: "pending" | "streaming" | "completed" | "failed"
  progress: number
  partialContent: string
  result: unknown | null
  error: string | null
  startedAt: number
  updatedAt: number
}

interface PrefetchEntry {
  params: Record<string, unknown>
  priority: number
  createdAt: number
}

const STORAGE_KEY = "aigym_generations"
const PREFETCH_KEY = "aigym_prefetch"
const GENERATION_TTL = 30 * 60 * 1000 // 30 minutes

class GenerationStore {
  private listeners: Set<() => void> = new Set()

  private getStorage(): Record<string, GenerationState> {
    if (typeof window === "undefined") return {}
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  private setStorage(data: Record<string, GenerationState>): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      this.notify()
    } catch {
      // Storage full or unavailable
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  generateId(type: GenerationType, params: Record<string, unknown>): string {
    const paramStr = JSON.stringify(params)
    let hash = 0
    for (let i = 0; i < paramStr.length; i++) {
      const char = paramStr.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `${type}_${Math.abs(hash).toString(36)}`
  }

  start(type: GenerationType, params: Record<string, unknown>): string {
    const id = this.generateId(type, params)
    const now = Date.now()
    
    const state: GenerationState = {
      id,
      type,
      params,
      status: "pending",
      progress: 0,
      partialContent: "",
      result: null,
      error: null,
      startedAt: now,
      updatedAt: now,
    }

    const storage = this.getStorage()
    storage[id] = state
    this.setStorage(storage)
    
    return id
  }

  updateProgress(id: string, progress: number, partialContent: string): void {
    const storage = this.getStorage()
    if (!storage[id]) return

    storage[id] = {
      ...storage[id],
      status: "streaming",
      progress,
      partialContent,
      updatedAt: Date.now(),
    }
    this.setStorage(storage)
  }

  complete(id: string, result: unknown): void {
    const storage = this.getStorage()
    if (!storage[id]) return

    storage[id] = {
      ...storage[id],
      status: "completed",
      progress: 100,
      result,
      updatedAt: Date.now(),
    }
    this.setStorage(storage)
  }

  fail(id: string, error: string): void {
    const storage = this.getStorage()
    if (!storage[id]) return

    storage[id] = {
      ...storage[id],
      status: "failed",
      error,
      updatedAt: Date.now(),
    }
    this.setStorage(storage)
  }

  get(id: string): GenerationState | null {
    const storage = this.getStorage()
    const state = storage[id]
    
    if (!state) return null
    
    // Check if expired
    if (Date.now() - state.updatedAt > GENERATION_TTL) {
      this.remove(id)
      return null
    }
    
    return state
  }

  getByParams(type: GenerationType, params: Record<string, unknown>): GenerationState | null {
    const id = this.generateId(type, params)
    return this.get(id)
  }

  getIncomplete(type: GenerationType): GenerationState | null {
    const storage = this.getStorage()
    
    for (const state of Object.values(storage)) {
      if (
        state.type === type &&
        state.status === "streaming" &&
        Date.now() - state.updatedAt < GENERATION_TTL
      ) {
        return state
      }
    }
    
    return null
  }

  remove(id: string): void {
    const storage = this.getStorage()
    delete storage[id]
    this.setStorage(storage)
  }

  clear(type?: GenerationType): void {
    if (!type) {
      localStorage.removeItem(STORAGE_KEY)
      this.notify()
      return
    }

    const storage = this.getStorage()
    for (const id of Object.keys(storage)) {
      if (storage[id].type === type) {
        delete storage[id]
      }
    }
    this.setStorage(storage)
  }

  // Prefetch queue management
  getPrefetchQueue(): PrefetchEntry[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(PREFETCH_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  addToPrefetch(type: GenerationType, params: Record<string, unknown>, priority: number = 1): void {
    if (typeof window === "undefined") return
    
    const queue = this.getPrefetchQueue()
    const entry: PrefetchEntry = {
      params: { ...params, _type: type },
      priority,
      createdAt: Date.now(),
    }
    
    // Avoid duplicates
    const exists = queue.some(
      (e) => JSON.stringify(e.params) === JSON.stringify(entry.params)
    )
    
    if (!exists) {
      queue.push(entry)
      queue.sort((a, b) => b.priority - a.priority)
      localStorage.setItem(PREFETCH_KEY, JSON.stringify(queue.slice(0, 5)))
    }
  }

  clearPrefetch(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(PREFETCH_KEY)
  }
}

export const generationStore = new GenerationStore()
export type { GenerationState, GenerationType }
