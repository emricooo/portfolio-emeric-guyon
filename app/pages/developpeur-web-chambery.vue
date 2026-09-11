<script setup lang="ts">
import { projects } from '~/data/projects'
import type { ContactProjectType } from '~/composables/useContactPrefill'

// French-only local landing page: no /en counterpart is generated.
defineI18nRoute({ locales: ['fr'] })

const { t, tm, rt } = useI18n()
const { goToContact } = useContactPrefill()

const PAGE_URL = 'https://emericguyon.com/developpeur-web-chambery'

type Item = { title: string, desc: string }
type Offer = Item & { price: string, delay: string, type: ContactProjectType }
type Faq = { q: string, a: string }
type Client = { name: string, city: string }

const list = <T extends object>(key: string): T[] =>
  (tm(key) as Record<string, unknown>[]).map(obj =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, rt(v as string)])) as T,
  )

const pills = (tm('local.hero.pills') as string[]).map(p => rt(p))
const whoItems = list<Item>('local.who.items')
const offers = list<Offer>('local.offers.items')
const whyItems = list<Item>('local.why.items')
const clients = list<Client>('local.proof.clients')
const faqItems = list<Faq>('local.faq.items')
const processSteps = list<Item>('services.process.steps')
const cities = (tm('local.area.cities') as string[]).map(c => rt(c))

const localProjects = ['25lieuxinnovation', 'ekkinox', 'inria']
  .map(slug => projects.find(p => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

useSeo({
  title: t('local.seo.title'),
  description: t('local.seo.description'),
  url: PAGE_URL,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${PAGE_URL}#webpage`,
            'url': PAGE_URL,
            'name': t('local.seo.title'),
            'description': t('local.seo.description'),
            'inLanguage': 'fr-FR',
            'isPartOf': { '@id': 'https://emericguyon.com/#website' },
            'about': { '@id': 'https://emericguyon.com/#service' },
            'mainEntity': { '@id': 'https://emericguyon.com/#person' },
          },
          {
            '@type': 'Service',
            'serviceType': 'Développement web',
            'name': 'Développeur web freelance à Chambéry',
            'description': t('local.seo.description'),
            'provider': { '@id': 'https://emericguyon.com/#person' },
            'url': PAGE_URL,
            'areaServed': [
              { '@type': 'City', 'name': 'Chambéry' },
              { '@type': 'City', 'name': 'Aix-les-Bains' },
              { '@type': 'City', 'name': 'Annecy' },
              { '@type': 'City', 'name': 'Grenoble' },
              { '@type': 'City', 'name': 'Lyon' },
              { '@type': 'AdministrativeArea', 'name': 'Savoie' },
            ],
            'offers': offers.map(o => ({
              '@type': 'Offer',
              'name': o.title,
              'description': o.desc,
              ...(o.type === 'showcase' ? { 'price': '2500', 'priceCurrency': 'EUR', 'priceSpecification': { '@type': 'PriceSpecification', 'minPrice': 2500, 'priceCurrency': 'EUR' } } : {}),
            })),
          },
          {
            '@type': 'FAQPage',
            'mainEntity': faqItems.map(f => ({
              '@type': 'Question',
              'name': f.q,
              'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': t('local.breadcrumb.home'), 'item': 'https://emericguyon.com' },
              { '@type': 'ListItem', 'position': 2, 'name': t('local.breadcrumb.current'), 'item': PAGE_URL },
            ],
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="max-w-3xl">
          <span class="section-label">{{ t('local.hero.label') }}</span>
          <h1 class="section-title mt-4">{{ t('local.hero.title') }}</h1>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {{ t('local.hero.intro') }}
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" class="svc-btn group" @click="goToContact()">
              {{ t('local.hero.cta') }}
            </button>
            <NuxtLink to="/projets" class="svc-btn svc-btn--outline group">
              {{ t('local.hero.ctaSecondary') }}
            </NuxtLink>
          </div>
          <div class="mt-8 flex flex-wrap gap-2">
            <span v-for="pill in pills" :key="pill" class="svc-pill">
              <IconsCheck class="h-4 w-4" />{{ pill }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pour qui -->
    <section class="py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.who.label') }}</span>
        <h2 class="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.who.title') }}
        </h2>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <article v-for="item in whoItems" :key="item.title" class="svc-card p-6 md:p-8">
            <h3 class="font-display text-lg font-bold text-foreground">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Prestations -->
    <section class="bg-muted py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.offers.label') }}</span>
        <h2 class="mt-4 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.offers.title') }}
        </h2>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <article v-for="offer in offers" :key="offer.type" class="svc-card flex flex-col p-6 md:p-8">
            <h3 class="font-display text-lg font-bold text-foreground">{{ offer.title }}</h3>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{{ offer.desc }}</p>
            <dl class="mt-6 space-y-1 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-muted-foreground">Tarif</dt>
                <dd class="font-semibold text-foreground">{{ offer.price }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-muted-foreground">Délai</dt>
                <dd class="font-semibold text-foreground">{{ offer.delay }}</dd>
              </div>
            </dl>
            <button type="button" class="svc-btn svc-btn--outline group mt-6 self-start" @click="goToContact(offer.type)">
              {{ t('services.forfait.cta') }}
            </button>
          </article>
        </div>
        <p class="mt-6 text-xs text-muted-foreground">{{ t('services.forfait.meta') }}</p>
      </div>
    </section>

    <!-- Freelance vs agence -->
    <section class="py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.why.label') }}</span>
        <h2 class="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.why.title') }}
        </h2>
        <div class="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          <div v-for="item in whyItems" :key="item.title">
            <h3 class="font-display text-lg font-bold text-foreground">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Références locales -->
    <section class="bg-muted py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.proof.label') }}</span>
        <h2 class="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.proof.title') }}
        </h2>
        <p class="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {{ t('local.proof.text') }}
        </p>
        <ul class="mt-6 flex flex-wrap gap-2">
          <li v-for="client in clients" :key="client.name" class="svc-pill">
            <IconsMapPin class="h-4 w-4" />{{ client.name }} · {{ client.city }}
          </li>
        </ul>
        <h3 class="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {{ t('local.proof.projectsLabel') }}
        </h3>
        <div class="mt-4 grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="project in localProjects"
            :key="project.slug"
            :to="`/projets/${project.slug}`"
            class="svc-card group block p-6 transition-colors hover:border-foreground/30 md:p-8"
          >
            <h4 class="font-display text-lg font-bold text-foreground">{{ project.title }}</h4>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {{ t(`projects.items.${project.slug}.description`) }}
            </p>
            <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              {{ t('projects.viewProject') }}
              <IconsArrowTopRight class="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section class="py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.process.label') }}</span>
        <h2 class="mt-4 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.process.title') }}
        </h2>
        <ol class="mt-10 grid gap-8 md:grid-cols-3">
          <li v-for="(step, i) in processSteps" :key="step.title">
            <span class="font-mono text-xs text-primary">0{{ i + 1 }}</span>
            <h3 class="mt-3 font-display text-lg font-bold text-foreground">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Zone -->
    <section class="bg-muted py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.area.label') }}</span>
        <h2 class="mt-4 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.area.title') }}
        </h2>
        <p class="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {{ t('local.area.text') }}
        </p>
        <ul class="mt-6 flex flex-wrap gap-2">
          <li v-for="city in cities" :key="city" class="svc-pill">{{ city }}</li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <span class="section-label">{{ t('local.faq.label') }}</span>
        <h2 class="mt-4 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl">
          {{ t('local.faq.title') }}
        </h2>
        <dl class="mt-10 max-w-3xl divide-y divide-border">
          <div v-for="item in faqItems" :key="item.q" class="py-6">
            <dt class="font-display text-lg font-bold text-foreground">{{ item.q }}</dt>
            <dd class="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{{ item.a }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <AppContact />
  </div>
</template>
