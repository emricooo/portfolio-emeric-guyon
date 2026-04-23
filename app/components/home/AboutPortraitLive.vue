<script setup lang="ts">
const props = defineProps<{
  src: string
  alt: string
  city?: string
}>()

const city = computed(() => props.city ?? 'Chambéry')
const { locale } = useI18n()
const { scrollTo: lenisScrollTo } = useLenis()

// === Local time in Chambéry — schedules at the next minute boundary so it
//     stays accurate even after long sessions or background tabs ===
const localTime = ref('')
let nextTickTimeout: ReturnType<typeof setTimeout> | null = null

function updateTime() {
  localTime.value = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

// === Time-of-day slots (Europe/Paris) ===
type Slot = 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend'
const timeSlot = ref<Slot>('afternoon')

function computeSlot(): Slot {
  const parisNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }))
  const hour = parisNow.getHours()
  const day = parisNow.getDay() // 0 = Sun, 6 = Sat
  if (day === 0 || day === 6) return 'weekend'
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

function tick() {
  updateTime()
  timeSlot.value = computeSlot()
  // Schedule next tick exactly at the next minute boundary
  const now = new Date()
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
  nextTickTimeout = setTimeout(tick, msToNextMinute)
}

// === Browser language detection (FR vs EN) ===
const userLang = ref<'fr' | 'en'>('fr')
function detectLang() {
  // Prefer the i18n locale (user choice via toggle), fallback to browser
  if (locale.value === 'fr' || locale.value === 'en') {
    userLang.value = locale.value
    return
  }
  if (typeof navigator !== 'undefined') {
    userLang.value = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  }
}
watch(() => locale.value, detectLang)

// === Long-pause nudge (after 5min on page) ===
const isLongPause = ref(false)
let pauseTimeout: ReturnType<typeof setTimeout> | null = null
const PAUSE_MS = 5 * 60 * 1000

// === Visibility: re-sync when user returns to tab ===
function onVisibilityChange() {
  if (document.visibilityState === 'visible') {
    updateTime()
    timeSlot.value = computeSlot()
  }
}

onMounted(() => {
  detectLang()
  tick()
  pauseTimeout = setTimeout(() => { isLongPause.value = true }, PAUSE_MS)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (nextTickTimeout) clearTimeout(nextTickTimeout)
  if (pauseTimeout) clearTimeout(pauseTimeout)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

// === Status message dictionary (5 slots + pause, FR + EN) ===
const STATUS: Record<Slot | 'pause', { fr: string, en: string }> = {
  morning: { fr: 'Un projet ? Parlons', en: 'Got a project? Let\'s talk' },
  afternoon: { fr: 'Une idée ? Pitch-moi', en: 'An idea? Pitch me' },
  evening: { fr: 'On range · Demain promis', en: 'Tidying up · Tomorrow promise' },
  night: { fr: 'Une idée ? Email au matin', en: 'Got an idea? Email me at dawn' },
  weekend: { fr: 'Urgent ? Lundi sinon', en: 'Urgent? Otherwise Monday' },
  pause: { fr: 'Une question ? Allez !', en: 'A question? Go ahead' },
}

const statusMessage = computed(() => {
  const key = isLongPause.value ? 'pause' : timeSlot.value
  return STATUS[key][userLang.value]
})

// === Click → scroll to #contact (via Lenis if available) ===
function onPillClick() {
  const el = document.getElementById('contact')
  if (el) lenisScrollTo(el)
}
</script>

<template>
  <div class="about-portrait-live relative h-full w-full" :aria-label="alt" role="img">
    <div class="relative h-full w-full overflow-hidden rounded-2xl bg-surface">
      <NuxtImg
        :src="src"
        :alt="alt"
        sizes="sm:100vw md:600px"
        width="640"
        height="853"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-top"
      />

      <!-- Subtle top + bottom gradients for pill readability -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/35 to-transparent" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent" />

      <!-- Top-right: Smart status pill (clickable, scrolls to #contact) -->
      <button
        type="button"
        class="group absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md ring-1 ring-white/10 transition-colors hover:bg-black/55"
        :aria-label="statusMessage"
        @click="onPillClick"
      >
        <span class="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <Transition name="status" mode="out-in">
          <span :key="statusMessage" class="tracking-wide whitespace-nowrap">{{ statusMessage }}</span>
        </Transition>
        <span class="text-white/55 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </button>

      <!-- Bottom-left: Time + city -->
      <div class="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md ring-1 ring-white/10">
        <span class="text-white/60" aria-hidden="true">⏱</span>
        <span class="tabular-nums">{{ localTime || '--:--' }}</span>
        <span class="text-white/40">·</span>
        <span class="text-white/85">{{ city }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-enter-active,
.status-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.status-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.status-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
