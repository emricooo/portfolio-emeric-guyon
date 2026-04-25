<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { SplitText } from 'gsap/SplitText'
import { projects } from '~/data/projects'

const { t } = useI18n()
const { letterReveal, wordReveal, projectsReveal } = useScrollAnimation()
const { instance: lenisInstance } = useLenis()

const featuredProjects = computed(() => projects.filter(p => p.featured))

// DESKTOP strip: reversed so newest (data[0]) renders RIGHTMOST in normal flex.
// We avoid `flex-row-reverse` because Chromium's scrollWidth ignores items that
// overflow "to the start" (left in LTR), making the pin distance compute as 0.
const stripProjects = computed(() => [...featuredProjects.value].reverse())

// MOBILE: alternating hero + grid (kept as-is)
const projectGroups = computed(() => {
  const groups: { type: 'hero' | 'grid', projects: typeof featuredProjects.value }[] = []
  let i = 0
  const list = featuredProjects.value
  while (i < list.length) {
    groups.push({ type: 'hero', projects: [list[i]!] })
    i++
    if (i < list.length) {
      groups.push({ type: 'grid', projects: list.slice(i, i + 4) })
      i += 4
    }
  }
  return groups
})

function coverSrc(p: typeof featuredProjects.value[0]) {
  return p.images.find(i => i.cover)?.src ?? p.images[0]!.src
}

// MOBILE animations (existing)
letterReveal('.projects-label')
wordReveal('.projects-title', 0.2)
projectsReveal('.projects-content')

// DESKTOP cinema strip refs
const stripPinRef = ref<HTMLElement | null>(null)
const stripTrackRef = ref<HTMLElement | null>(null)
const hudIndexRef = ref<HTMLElement | null>(null)
const hudNameRef = ref<HTMLElement | null>(null)
const hudProgressFillRef = ref<HTMLElement | null>(null)

// Exposed navigation function — populated inside the GSAP setup.
const navigateStrip = ref<((dir: 'older' | 'newer') => void) | null>(null)

let mm: ReturnType<typeof gsap.matchMedia> | null = null

onMounted(() => {
  if (import.meta.server) return

  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText)

  mm = gsap.matchMedia()
  mm.add('(min-width: 900px)', () => {
    const handlers: Array<() => void> = []
    const splits: SplitText[] = []
    let initialized = false

    // Defer setup so CSS for nav:block is applied and dimensions are correct.
    const setup = () => {
      if (initialized) return
      const pinEl = stripPinRef.value
      const trackEl = stripTrackRef.value
      if (!pinEl || !trackEl) return
      if (getComputedStyle(pinEl).display === 'none') return
      initialized = true

      const panels = Array.from(trackEl.querySelectorAll<HTMLElement>('.strip-panel'))
      const total = panels.length
      if (!total) return

      const distance = () => trackEl.scrollWidth - window.innerWidth

      // 2-panel mode active at >= 1600px → snap by PAIRS so each scroll-step
      // reveals 2 new projects. 1-panel mode (< 1600px) snaps panel-by-panel.
      const isWide = () => window.innerWidth >= 1600

      // Compute snap values aligned to panel boundaries (1 slide = 100vw of track).
      // Returns an array of progress values [0, ..., 1] where each is exactly aligned
      // so that, at snap, exactly 2 (or 1) full panels fit the viewport — no edge peek.
      const computeSnapValues = (): number[] => {
        const dist = trackEl.scrollWidth - window.innerWidth
        if (dist <= 0) return [0, 1]
        const stepProgress = window.innerWidth / dist // = 1 full slide width / total scrollable
        const lastFull = Math.floor(1 / stepProgress)
        const arr: number[] = []
        for (let i = 0; i <= lastFull; i++) arr.push(i * stepProgress)
        if (arr[arr.length - 1]! < 1) arr.push(1)
        return arr
      }

      const stopsCount = () => computeSnapValues().length
      const transitionsCount = () => Math.max(stopsCount() - 1, 1)
      // Very short pin range — slides feel like a carousel.
      const verticalDistance = () => transitionsCount() * window.innerHeight * 0.4

      // Find nearest snap value index for given progress (used by HUD)
      const getStopIdx = (progress: number, snaps: number[]) => {
        let idx = 0
        let minDelta = Math.abs(progress - snaps[0]!)
        for (let i = 1; i < snaps.length; i++) {
          const d = Math.abs(progress - snaps[i]!)
          if (d < minDelta) { idx = i; minDelta = d }
        }
        return idx
      }

      // === Main horizontal scroll — REVERSE: scroll DOWN = travel BACK in time ===
      const scrollTween = gsap.fromTo(
        trackEl,
        { x: () => -distance() },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            start: 'top top',
            end: () => '+=' + verticalDistance(),
            // Tight scrub for instant response — track follows scroll closely
            scrub: 0.4,
            invalidateOnRefresh: true,
            refreshPriority: 4,
            // Carousel-style snap: directional (always advances in scroll direction),
            // no delay, smooth ease — user scrolls a tiny bit → snap to next slide.
            snap: {
              snapTo: (progress) => {
                const snaps = computeSnapValues()
                return snaps[getStopIdx(progress, snaps)] ?? progress
              },
              duration: { min: 0.4, max: 0.7 },
              delay: 0,
              ease: 'power2.inOut',
              directional: true,
              inertia: false,
            },
          },
        },
      )

      // === 1. Image scale parallax inside the frame (subtle ken-burns) ===
      panels.forEach((panel) => {
        const scaleEl = panel.querySelector('.strip-panel-image-scale')
        if (!scaleEl) return
        gsap.fromTo(
          scaleEl,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: 'right left',
              end: 'left right',
              scrub: true,
            },
          },
        )
      })

      // === 2. HUD update with ScrambleText + progress bar ===
      const projectTitles = featuredProjects.value.map(p => p.title.toUpperCase())
      let lastIdx = -1
      const hudIdxEl = hudIndexRef.value
      const hudNmEl = hudNameRef.value
      const hudFillEl = hudProgressFillRef.value

      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top top',
        end: () => '+=' + verticalDistance(),
        refreshPriority: 4,
        onUpdate: (self) => {
          const p = self.progress

          if (hudFillEl) gsap.set(hudFillEl, { scaleX: p })

          // At each snap stop, compute the LEFTMOST visible panel (= the new
          // arrival in our reverse time-travel scroll). HUD reflects that.
          const snaps = computeSnapValues()
          const stop = getStopIdx(p, snaps)
          const stripIdx = isWide()
            ? Math.max(0, total - 2 - 2 * stop) // 2-panel: leftmost of the pair
            : Math.max(0, total - 1 - stop) // 1-panel: the sole visible panel
          const displayIdx = total - stripIdx // 1..total

          if (displayIdx !== lastIdx) {
            lastIdx = displayIdx
            if (hudIdxEl) {
              gsap.to(hudIdxEl, {
                duration: 0.5,
                scrambleText: { text: String(displayIdx).padStart(2, '0'), chars: '0123456789', speed: 0.6 },
                ease: 'none',
              })
            }
            if (hudNmEl) {
              // projectTitles is from featuredProjects (newest first), so
              // index = displayIdx - 1 (0-indexed in featuredProjects)
              gsap.to(hudNmEl, {
                duration: 0.5,
                scrambleText: { text: projectTitles[displayIdx - 1] ?? '', chars: 'upperCase', speed: 0.6 },
                ease: 'none',
              })
            }
          }
        },
      })

      // === 3. SplitText letter reveal per panel title ===
      panels.forEach((panel) => {
        const titleEl = panel.querySelector<HTMLElement>('.strip-panel-title')
        if (!titleEl) return

        const split = SplitText.create(titleEl, { type: 'chars', mask: 'chars' })
        splits.push(split)
        gsap.set(split.chars, { yPercent: 110 })

        gsap.to(split.chars, {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.025,
          ease: 'power3.out',
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: panel,
            start: 'right 30%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      // === 4a. Magnetic frame tilt + side content stagger reveal ===
      panels.forEach((panel) => {
        const frameEl = panel.querySelector<HTMLElement>('.strip-panel-frame')
        if (frameEl) {
          const onMove = (e: MouseEvent) => {
            const rect = panel.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) * 0.025
            const y = (e.clientY - rect.top - rect.height / 2) * 0.025
            gsap.to(frameEl, { x, y, duration: 0.6, ease: 'power2.out' })
          }
          const onLeave = () => {
            gsap.to(frameEl, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' })
          }
          panel.addEventListener('mousemove', onMove)
          panel.addEventListener('mouseleave', onLeave)
          handlers.push(() => {
            panel.removeEventListener('mousemove', onMove)
            panel.removeEventListener('mouseleave', onLeave)
          })
        }

        // Side content reveal — staggered slide-in when panel enters
        const sideItems = panel.querySelectorAll<HTMLElement>('.strip-panel-side-item')
        if (sideItems.length) {
          gsap.from(sideItems, {
            x: -40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: 'right 30%',
              toggleActions: 'play none none reverse',
            },
          })
        }

        // Frame reveal — slides in from the right with subtle scale
        const frame = panel.querySelector<HTMLElement>('.strip-panel-frame')
        if (frame) {
          gsap.from(frame, {
            x: 60,
            opacity: 0,
            scale: 0.96,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: 'right 30%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      })

      // === 4b. Slide navigation (used by keyboard ← → AND HUD buttons).
      // Direction matches time-travel narrative: 'older' = forward in strip (to past),
      // 'newer' = back toward present.
      const navigate = (dir: 'older' | 'newer') => {
        const st = scrollTween.scrollTrigger
        if (!st) return
        const snaps = computeSnapValues()
        const currentStop = getStopIdx(st.progress, snaps)
        const nextStop = dir === 'older'
          ? Math.min(currentStop + 1, snaps.length - 1)
          : Math.max(currentStop - 1, 0)
        const targetProgress = snaps[nextStop] ?? st.progress
        const targetScroll = st.start + targetProgress * (st.end - st.start)
        const lenis = lenisInstance()
        if (lenis) lenis.scrollTo(targetScroll, { duration: 0.6 })
        else window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
      navigateStrip.value = navigate
      handlers.push(() => { navigateStrip.value = null })

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') navigate('older')
        else if (e.key === 'ArrowRight') navigate('newer')
      }
      window.addEventListener('keydown', onKey)
      handlers.push(() => window.removeEventListener('keydown', onKey))

      // Refresh after images/fonts settle
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    requestAnimationFrame(setup)

    return () => {
      handlers.forEach(off => off())
      splits.forEach(s => s.revert())
    }
  })
})

onUnmounted(() => mm?.revert())
</script>

<template>
  <section id="projects" class="relative">
    <!-- ============ Section header (always visible above the strip/grid) ============ -->
    <div class="projects-content relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div class="mb-12 nav:mb-16">
        <span class="section-label projects-label">{{ t('projects.label') }}</span>
        <h2 class="section-title projects-title mt-4">
          {{ t('projects.title') }}
        </h2>
      </div>
    </div>

    <!-- ============ MOBILE: existing alternating hero+grid ============ -->
    <div class="nav:hidden mx-auto max-w-7xl px-4 pb-20 md:px-8 lg:pb-32">
      <div class="space-y-8">
        <template v-for="(group, gi) in projectGroups" :key="gi">
          <NuxtLink
            v-if="group.type === 'hero'"
            :to="`/projets/${group.projects[0]!.slug}`"
            class="project-hero group relative block overflow-hidden rounded-2xl"
            data-cursor-project
            :data-cursor-text="t('projects.view')"
          >
            <NuxtImg
              :src="coverSrc(group.projects[0]!)"
              sizes="sm:100vw md:1200px"
              :alt="group.projects[0]!.title"
              width="1200"
              height="514"
              :loading="gi === 0 ? undefined : 'lazy'"
              :fetchpriority="gi === 0 ? 'high' : undefined"
              class="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-21/9"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div class="project-hero-content absolute bottom-0 left-0 p-6 md:p-12">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in group.projects[0]!.technologies"
                  :key="tech"
                  class="project-hero-tag rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] text-white/80 sm:px-3 sm:py-1 sm:text-xs"
                >
                  {{ tech }}
                </span>
              </div>
              <h3 class="project-hero-title mt-2 font-display text-xl font-bold text-white sm:mt-3 sm:text-3xl md:text-5xl">
                {{ group.projects[0]!.title }}
              </h3>
              <p class="project-hero-desc mt-1 text-xs text-white/60 sm:mt-2 sm:max-w-lg sm:text-sm sm:text-white/70">
                {{ t(`projects.items.${group.projects[0]!.slug}.description`) }}
              </p>
            </div>
          </NuxtLink>

          <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <NuxtLink
              v-for="project in group.projects"
              :key="project.slug"
              :to="`/projets/${project.slug}`"
              class="project-card group relative overflow-hidden rounded-2xl"
              data-cursor-project
              :data-cursor-text="t('projects.view')"
            >
              <NuxtImg
                :src="coverSrc(project)"
                sizes="sm:100vw md:600px"
                :alt="project.title"
                width="600"
                height="450"
                loading="lazy"
                class="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div class="project-card-content absolute bottom-0 left-0 p-6">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="project-card-tag rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] text-white/80"
                  >
                    {{ tech }}
                  </span>
                </div>
                <h3 class="project-card-title mt-2 font-display text-xl font-bold text-white md:text-2xl">
                  {{ project.title }}
                </h3>
                <p class="project-card-desc mt-1 text-xs text-white/60">
                  {{ t(`projects.items.${project.slug}.description`) }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>

    <!-- ============ DESKTOP: editorial cinema strip horizontal scroll ============ -->
    <div ref="stripPinRef" class="hidden nav:block strip-pin-wrapper relative">
      <div class="strip-viewport relative h-screen w-full overflow-hidden bg-background">
        <!-- Track: normal flex-row. Data is pre-reversed so newest is RIGHTMOST naturally. -->
        <div ref="stripTrackRef" class="strip-track flex h-screen will-change-transform">
          <NuxtLink
            v-for="(project, i) in stripProjects"
            :key="project.slug"
            :to="`/projets/${project.slug}`"
            class="strip-panel @container group relative flex h-screen w-screen shrink-0 overflow-hidden min-[1600px]:w-[50vw]"
            data-cursor-project
            :data-cursor-text="t('projects.view')"
          >
            <!-- 1. Blurred cover image as ambient background (low-res variant for perf) -->
            <div class="pointer-events-none absolute inset-0 overflow-hidden">
              <NuxtImg
                :src="coverSrc(project)"
                sizes="sm:400px md:500px lg:600px xl:700px 2xl:800px"
                alt=""
                width="800"
                height="450"
                loading="lazy"
                aria-hidden="true"
                class="absolute inset-0 h-full w-full object-cover scale-[1.18] opacity-[0.14]"
                style="filter: blur(70px) saturate(1.35);"
              />
            </div>

            <!-- 2. AccentColor tint (very subtle, uses project's signature color) -->
            <div
              class="pointer-events-none absolute inset-0 opacity-[0.05]"
              :style="{ background: project.accentColor ?? 'transparent' }"
            />

            <!-- 3. Vignette — soft dark fade at corners to focus the center -->
            <div
              class="pointer-events-none absolute inset-0"
              style="background: radial-gradient(ellipse at center, transparent 35%, rgb(0 0 0 / 22%) 100%);"
            />

            <!-- 4. Big number watermark — editorial magazine vibe -->
            <div
              class="pointer-events-none absolute -bottom-16 -right-4 select-none font-display font-bold leading-none tracking-tighter opacity-[0.05] text-[24vw] @[1100px]:text-[20vw] @[1600px]:text-[16vw]"
              :style="{ color: project.accentColor ?? 'currentColor' }"
              aria-hidden="true"
            >
              {{ String(stripProjects.length - i).padStart(2, '0') }}
            </div>

            <!-- LEFT — editorial content (sizes adapt to PANEL width via @container) -->
            <div class="relative z-10 flex w-1/2 flex-col justify-center px-6 @[700px]:px-10 @[1100px]:px-14 @[1500px]:px-20 @[1800px]:px-28">
              <div
                class="strip-panel-side-item mb-4 font-mono text-xs tracking-[0.3em] @[700px]:mb-6 @[700px]:text-sm"
                :style="{ color: project.accentColor ?? 'currentColor' }"
              >
                {{ String(stripProjects.length - i).padStart(2, '0') }}
              </div>

              <h3 class="strip-panel-title strip-panel-side-item mb-6 font-display font-bold leading-[0.95] text-balance text-foreground text-[clamp(1.75rem,4cqi,4.5rem)] @[700px]:mb-8">
                {{ project.title }}
              </h3>

              <div
                class="strip-panel-side-item mb-6 h-px w-12 @[1100px]:mb-8 @[1100px]:w-16"
                :style="{ background: project.accentColor ?? 'currentColor' }"
              />

              <p class="strip-panel-side-item mb-6 max-w-md text-sm leading-relaxed text-muted-foreground @[700px]:mb-8 @[700px]:text-base @[1500px]:text-lg">
                {{ t(`projects.items.${project.slug}.description`) }}
              </p>

              <div class="strip-panel-side-item mb-6 flex flex-wrap gap-2 @[700px]:mb-8">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="rounded-full border border-foreground/15 px-2.5 py-0.5 font-mono text-[10px] text-foreground/70 @[700px]:px-3 @[700px]:py-1 @[700px]:text-xs"
                >
                  {{ tech }}
                </span>
              </div>

              <div class="strip-panel-side-item flex items-center gap-4 @[700px]:gap-6">
                <!-- Visual CTA — the whole panel is already a NuxtLink to the project detail. -->
                <span class="inline-flex items-center gap-2 text-xs text-foreground @[700px]:text-sm">
                  <span class="border-b border-current pb-0.5 transition-colors group-hover:border-foreground/50">{{ t('projects.viewProject') }}</span>
                  <span class="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </div>

            <!-- RIGHT — browser frame (also adapts via @container) -->
            <div class="relative z-10 flex w-1/2 items-center justify-center p-6 @[700px]:p-10 @[1100px]:p-14 @[1500px]:p-16 @[1800px]:p-20">
              <div class="strip-panel-frame relative w-full aspect-[16/10] max-w-[820px] overflow-hidden rounded-xl bg-surface shadow-2xl ring-1 ring-foreground/10 will-change-transform @[1500px]:max-w-[920px] @[1800px]:max-w-[1100px]">
                <!-- Browser chrome -->
                <div class="absolute inset-x-0 top-0 z-20 flex items-center gap-3 border-b border-foreground/10 bg-surface-elevated/80 px-4 py-2.5 backdrop-blur">
                  <div class="flex gap-1.5">
                    <span class="block h-3 w-3 rounded-full bg-[#FF5F56]" />
                    <span class="block h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <span class="block h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div class="ml-2 flex-1 truncate rounded-md bg-foreground/[0.06] px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    {{ project.url ? project.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '~/internal · ' + project.slug }}
                  </div>
                </div>

                <!-- Image area (below chrome) -->
                <div class="strip-panel-image-scale absolute inset-x-0 bottom-0 top-[42px] will-change-transform">
                  <NuxtImg
                    :src="coverSrc(project)"
                    sizes="md:50vw lg:50vw xl:50vw 2xl:50vw"
                    :alt="project.title"
                    width="1280"
                    height="720"
                    :loading="i === stripProjects.length - 1 ? undefined : 'lazy'"
                    :fetchpriority="i === stripProjects.length - 1 ? 'high' : undefined"
                    class="strip-panel-image h-full w-full object-cover object-top will-change-transform"
                  />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- HUD top-right: index / total — name + progress bar (theme-aware backdrop, no border for lighter look) -->
        <div class="strip-hud absolute right-8 top-24 z-30 rounded-xl bg-background/60 px-4 py-3 backdrop-blur-md lg:right-12">
          <!-- Info row — passes clicks through to panel below -->
          <div class="pointer-events-none flex items-center gap-3 font-mono text-sm tracking-wider text-foreground">
            <span ref="hudIndexRef" class="strip-hud-index w-[2ch]" :style="{ color: 'var(--color-primary)' }">01</span>
            <span class="text-foreground/40">/</span>
            <span class="text-foreground/65">{{ String(featuredProjects.length).padStart(2, '0') }}</span>
            <span class="mx-3 text-foreground/40">—</span>
            <span ref="hudNameRef" class="strip-hud-name min-w-[14ch]">{{ featuredProjects[0]?.title.toUpperCase() }}</span>
          </div>
          <!-- Progress bar — visual only -->
          <div class="pointer-events-none mt-3 h-px w-full bg-foreground/15">
            <div ref="hudProgressFillRef" class="strip-hud-progress-fill h-full origin-left scale-x-0" :style="{ background: 'var(--color-primary)' }" />
          </div>
          <!-- Clickable navigation buttons -->
          <div class="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <button
              type="button"
              class="cursor-pointer transition-colors hover:text-foreground"
              aria-label="Older project"
              @click.stop.prevent="navigateStrip?.('older')"
            >
              ← older
            </button>
            <button
              type="button"
              class="cursor-pointer transition-colors hover:text-foreground"
              aria-label="Newer project"
              @click.stop.prevent="navigateStrip?.('newer')"
            >
              newer →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Avoid layout shift while title chars are being split (initial) */
.strip-panel-title :deep(.split-mask) {
  display: inline-block;
  overflow: clip;
}
</style>
