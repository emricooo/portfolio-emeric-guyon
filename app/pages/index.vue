<script setup lang="ts">
const { t } = useI18n()

useSeo({
  title: t('seo.title'),
  description: t('seo.description'),
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://emericguyon.com/#website',
            'name': t('seo.title'),
            'url': 'https://emericguyon.com',
            'description': t('seo.description'),
            'inLanguage': ['fr-FR', 'en-US'],
            'publisher': { '@id': 'https://emericguyon.com/#person' },
          },
          {
            '@type': 'Person',
            '@id': 'https://emericguyon.com/#person',
            'name': 'Emeric Guyon',
            'url': 'https://emericguyon.com',
            'image': 'https://emericguyon.com/images/portrait-about.jpg',
            'jobTitle': 'Développeur Fullstack Freelance',
            'description': t('seo.description'),
            'nationality': { '@type': 'Country', 'name': 'France' },
            'sameAs': [
              'https://www.linkedin.com/in/emeric-guyon/',
              'https://github.com/emricooo',
            ],
            'knowsAbout': ['Vue.js', 'React', 'Nuxt', 'Next.js', 'TypeScript', 'Node.js', 'Symfony', 'E-commerce', 'Magento', 'Prestashop'],
            'knowsLanguage': ['fr', 'en'],
            'email': 'hello@emericguyon.com',
            'telephone': '+33628087180',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Chambéry',
              'addressRegion': 'Auvergne-Rhône-Alpes',
              'addressCountry': 'FR',
            },
            'workLocation': [
              { '@type': 'Place', 'name': 'Chambéry' },
              { '@type': 'Place', 'name': 'Lyon' },
              { '@type': 'Place', 'name': 'Grenoble' },
              { '@type': 'Place', 'name': 'Annecy' },
              { '@type': 'Place', 'name': 'Paris' },
            ],
          },
          {
            '@type': 'ProfessionalService',
            '@id': 'https://emericguyon.com/#service',
            'name': 'Emeric Guyon — Développement Fullstack Freelance',
            'url': 'https://emericguyon.com',
            'image': 'https://emericguyon.com/images/og-image-fr.jpg',
            'description': t('seo.description'),
            'provider': { '@id': 'https://emericguyon.com/#person' },
            'priceRange': '€€',
            'serviceType': ['Développement web', 'Applications SaaS', 'Conseil technique', 'Tech lead on demand'],
            'areaServed': [
              { '@type': 'City', 'name': 'Chambéry' },
              { '@type': 'City', 'name': 'Lyon' },
              { '@type': 'City', 'name': 'Grenoble' },
              { '@type': 'City', 'name': 'Annecy' },
              { '@type': 'City', 'name': 'Paris' },
              { '@type': 'Country', 'name': 'France' },
            ],
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Chambéry',
              'addressRegion': 'Auvergne-Rhône-Alpes',
              'addressCountry': 'FR',
            },
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <HomeHero />
    <HomeAbout />
    <LazyHomeServices />
    <LazyHomeSkills />
    <HomeProjects />
    <LazyHomeClients />
    <LazyAppContact />
  </div>
</template>
