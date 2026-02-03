export interface ProjectImage {
  src: string
  cover?: boolean
}

export interface Project {
  slug: string
  title: string
  images: ProjectImage[]
  technologies: string[]
  url?: string
  agency?: { name: string, url: string }
  featured: boolean
  accentColor?: string
  takeawaysCount?: number
}

export interface Skill {
  name: string
  logo: string
  highlighted?: boolean
}

export interface SocialLink {
  label: string
  url: string
  icon: string
}
