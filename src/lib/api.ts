import type { AuthResponse, User, Video, VideosResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file.")
}

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

async function apiFetch<T>(endpoint: string, options?: RequestInit, requiresAuth = false): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  }

  if (requiresAuth) {
    const token = getToken()
    if (!token) {
      throw new Error("Authentication required. No token found.")
    }
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }))
    const errorMessage = errorData.message || `API Error: ${res.status}`
    const error = new Error(errorMessage) as Error & { status?: number }
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

export async function fetchProfile(): Promise<User> {
  return apiFetch<User>("/api/auth/profile", { method: "GET" }, true)
}

export async function uploadVideo(formData: FormData): Promise<Video> {
  const token = getToken()
  if (!token) {
    throw new Error("Authentication required. No token found.")
  }

  const res = await fetch(`${API_URL}/api/videos/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }))
    const errorMessage = errorData.error || errorData.message || `Upload failed: ${res.status}`
    const error = new Error(errorMessage) as Error & { status?: number }
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function fetchVideos(page?: number, limit?: number): Promise<VideosResponse> {
  let endpoint = "/api/videos"
  const queryParams = new URLSearchParams()
  if (page !== undefined) queryParams.append("page", String(page))
  if (limit !== undefined) queryParams.append("limit", String(limit))

  if (queryParams.toString()) {
    endpoint += `?${queryParams.toString()}`
  }
  return apiFetch<VideosResponse>(endpoint, { method: "GET" })
}

export async function fetchRecommendedVideos(): Promise<Video[]> {
  return apiFetch<Video[]>("/api/videos/recommended", { method: "GET" })
}

export async function fetchVideoById(id: string): Promise<Video> {
  return apiFetch<Video>(`/api/videos/${id}`, { method: "GET" })
}