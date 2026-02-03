import type { Project } from '~/types'

export const projects: Project[] = [
  {
    slug: 'elitetrackr',
    title: 'EliteTrackr',
    images: [
      { src: '/images/projects/elitetracker-1.jpg' },
      { src: '/images/projects/elitetracker-cover.jpg', cover: true },
    ],
    technologies: ['Nuxt.js', 'TypeScript', 'AdonisJS', 'Python', 'D3.js'],
    featured: true,
    accentColor: '#F59E0B',
    url:'https://elitetrackr.com/'
  },
  {
    slug: 'ekkinox',
    title: 'Ekkinox',
    images: [
      { src: '/images/projects/ekkinox-1.jpg' },
      { src: '/images/projects/ekkinox-2.jpg',  cover: true },
      { src: '/images/projects/ekkinox-3.jpg' },
    ],
    technologies: ['Vue.js', 'TypeScript'],
    featured: true,
    accentColor: '#8B5CF6',
  },
  {
    slug: '25lieuxinnovation',
    title: '25lieuxinnovation',
    images: [
      { src: '/images/projects/25lieuxinnovation-2.jpg' },
      { src: '/images/projects/25lieuxinnovation-cover.jpg', cover: true },
    ],
    technologies: ['WordPress', 'ACF', 'Timber', 'GSAP'],
    featured: true,
    accentColor: '#3B82F6',
    url: 'https://www.25lieuxinnovation.fr/'
  },
  {
    slug: 'evianchezvous',
    title: 'Evianchezvous',
    images: [
      { src: '/images/projects/evianchezvous-2.jpg' },
      { src: '/images/projects/evianchezvous-3.jpg' },
      { src: '/images/projects/evianchezvous.jpg', cover: true },
    ],
    technologies: ['React.js', 'GraphQL', 'Magento 2'],
    url: 'https://evianchezvous.com',
    featured: true,
    accentColor: '#4fc3f7',
  },
  {
    slug: 'lonn',
    title: 'Lonn',
    images: [
      { src: '/images/projects/lonn-1.jpg' },
      { src: '/images/projects/lonn-2.jpg' },
      { src: '/images/projects/lonn-cover.jpg', cover: true },
    ],
    technologies: ['Symfony', 'Vue.js', 'TypeScript'],
    agency: { name: 'Le Collectif 40', url: 'https://lecollectif40.fr/' },
    featured: true,
    accentColor: '#10B981',
  },
  {
    slug: 'juriscan',
    title: 'Juriscan',
    images: [
      { src: '/images/projects/juriscan-cover.jpg', cover: true },
    ],
    technologies: ['Vue.js', 'TypeScript', 'AdonisJS'],
    featured: true,
    accentColor: '#06B6D4',
  },
  {
    slug: 'parentsdouceur',
    title: 'ParentsDouceur',
    images: [
      { src: '/images/projects/parentsdouceur-cover.jpg', cover: true },
    ],
    technologies: ['WordPress', 'ACF', 'Timber', 'GSAP'],
    featured: true,
    accentColor: '#F97316',
  },
  {
    slug: 'inria',
    title: 'MALT : Malloc Tracker (Inria)',
    images: [
      { src: '/images/projects/inria-1.jpg' },
      { src: '/images/projects/inria-2.jpg' },
      { src: '/images/projects/inria-cover.jpg', cover: true },
    ],
    technologies: ['Vue.js', 'TypeScript', 'D3.js'],
    agency: { name: 'Le Collectif 40', url: 'https://lecollectif40.fr/' },
    featured: true,
    accentColor: '#ef5350',
    url: 'https://github.com/memtt/malt',
    takeawaysCount: 3,
  },
  {
    slug: 'uplexa',
    title: 'Uplexa',
    images: [
      { src: '/images/projects/uplexa-cover.jpg', cover: true },
    ],
    technologies: ['Next.js'],
    featured: true,
    accentColor: '#ce93d8',
    url:'https://uplexa.com/'

  },
]
