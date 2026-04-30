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

  // Strip the `/en` prefix to derive the locale-neutral path,
  // so hreflang variants point to the correct URL on either locale.
  const neutralPath = route.path.replace(/^\/en(?=\/|$)/, '') || '/'
  const frHref = `${SITE_URL}${neutralPath}`
  const enHref = `${SITE_URL}/en${neutralPath === '/' ? '' : neutralPath}`

  const isEn = locale.value === 'en'

  useHead({
    title,
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: 'fr', href: frHref },
      { rel: 'alternate', hreflang: 'en', href: enHref },
      { rel: 'alternate', hreflang: 'x-default', href: frHref },
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Emeric Guyon' },
      { property: 'og:locale', content: isEn ? 'en_US' : 'fr_FR' },
      { property: 'og:locale:alternate', content: isEn ? 'fr_FR' : 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:site', content: '@emericguyon' },
      { name: 'twitter:creator', content: '@emericguyon' },
    ],
  })
}
