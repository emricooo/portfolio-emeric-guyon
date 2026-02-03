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
            'name': t('seo.title'),
            'url': 'https://emericguyon.com',
            'description': t('seo.description'),
            'inLanguage': ['fr-FR', 'en-US'],
          },
          {
            '@type': 'Person',
            'name': 'Emeric Guyon',
            'url': 'https://emericguyon.com',
            'jobTitle': 'Développeur Fullstack Freelance',
            'sameAs': [
              'https://www.linkedin.com/in/emeric-guyon/',
              'https://github.com/emricooo',
            ],
            'knowsAbout': ['Vue.js', 'React', 'Nuxt', 'Next.js', 'TypeScript', 'Node.js', 'Symfony', 'E-commerce', 'Magento', 'Prestashop'],
            'email': 'hello@emericguyon.com',
            'telephone': '+33628087180',
            'address': {
              '@type': 'PostalAddress',
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
    <LazyHomeProjects />
    <LazyHomeClients />
    <LazyAppContact />
  </div>
</template>
