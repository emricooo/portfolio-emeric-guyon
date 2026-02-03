const SITE_URL = 'https://emericguyon.com'

export function useSeo(options: {
  title?: string
  description?: string
  image?: string
  url?: string
}) {
  const route = useRoute()
  const { t, locale } = useI18n()

  const defaultImage = `${SITE_URL}/images/og-image-${locale.value === 'en' ? 'en' : 'fr'}.jpg`

  const defaults = {
    title: t('seo.title'),
    description: t('seo.description'),
    image: defaultImage,
  }

  const title = options.title || defaults.title
  const description = options.description || defaults.description
  const image = options.image?.startsWith('http') ? options.image : `${SITE_URL}${options.image || defaultImage.replace(SITE_URL, '')}`
  const canonicalUrl = options.url || `${SITE_URL}${route.path}`

  useHead({
    title,
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'fr', href: `${SITE_URL}${route.path}` },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/en${route.path}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${route.path}` },
    ],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Emeric Guyon' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  })
}
