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
              'https://www.malt.fr/profile/emericguyon',
              'https://www.collective.work/profile/emeric-gu',
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
            'name': 'Emeric Guyon, développement fullstack freelance',
            'url': 'https://emericguyon.com',
            'image': 'https://emericguyon.com/images/og-image-fr.jpg',
            'description': t('seo.description'),
            'provider': { '@id': 'https://emericguyon.com/#person' },
            'telephone': '+33628087180',
            'email': 'hello@emericguyon.com',
            'priceRange': '€€',
            'sameAs': [
              'https://www.linkedin.com/in/emeric-guyon/',
              'https://www.malt.fr/profile/emericguyon',
            ],
            'geo': { '@type': 'GeoCoordinates', 'latitude': 45.5646, 'longitude': 5.9178 },
            'openingHoursSpecification': {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              'opens': '09:00',
              'closes': '18:00',
            },
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
              'postalCode': '73000',
              'addressRegion': 'Auvergne-Rhône-Alpes',
              'addressCountry': 'FR',
            },
            'hasOfferCatalog': {
              '@type': 'OfferCatalog',
              'name': 'Développement web au forfait',
              'itemListElement': [
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': 'Création de site vitrine',
                    'description': 'Site vitrine sur-mesure pour présenter votre activité et convertir : conception, développement et mise en ligne.',
                    'provider': { '@id': 'https://emericguyon.com/#person' },
                    'areaServed': [
                      { '@type': 'City', 'name': 'Chambéry' },
                      { '@type': 'City', 'name': 'Annecy' },
                      { '@type': 'City', 'name': 'Lyon' },
                      { '@type': 'City', 'name': 'Grenoble' },
                      { '@type': 'City', 'name': 'Paris' },
                      { '@type': 'AdministrativeArea', 'name': 'Savoie' },
                      { '@type': 'Country', 'name': 'France' },
                    ],
                  },
                },
                {
                  '@type': 'Offer',
                  'itemOffered': {
                    '@type': 'Service',
                    'name': 'Développement d\'application web',
                    'description': 'Application web et SaaS sur-mesure, du cadrage technique au déploiement.',
                    'provider': { '@id': 'https://emericguyon.com/#person' },
                    'areaServed': [
                      { '@type': 'City', 'name': 'Chambéry' },
                      { '@type': 'City', 'name': 'Annecy' },
                      { '@type': 'City', 'name': 'Lyon' },
                      { '@type': 'City', 'name': 'Grenoble' },
                      { '@type': 'City', 'name': 'Paris' },
                      { '@type': 'AdministrativeArea', 'name': 'Savoie' },
                      { '@type': 'Country', 'name': 'France' },
                    ],
                  },
                },
              ],
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
