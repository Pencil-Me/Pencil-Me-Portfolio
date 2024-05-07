export interface TechStack {
  id: number
  name: string
}

export interface Project {
  id: number
  tech_stack: TechStack[]
  start_date: string
  finish_date: string
  job_title: string
  customer: string
  title: string
  images: Images[]
  description: string[]
}

export type ImageSizes = 'w45' | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

export interface Images {
  base_url: string
  secure_base_url: string
  backdrop_sizes: string[]
  logo_sizes: string[]
  poster_sizes: ImageSizes[]
  profile_sizes: string[]
  still_sizes: string[]
}
