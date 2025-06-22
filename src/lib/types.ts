export interface User {
  id: string
  name: string
  email: string
}

export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  uploader: { id: string; name: string }
  uploadDate: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface VideosResponse {
  videos: Video[]
  page?: number
  limit?: number
  totalPages?: number
  totalVideos?: number
}
