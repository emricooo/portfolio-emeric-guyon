<script setup lang="ts">
import { gsap } from 'gsap'

const overlay = ref<HTMLElement | null>(null)
const router = useRouter()

onMounted(() => {
  const removeBefore = router.beforeEach((to, from, next) => {
    if (!overlay.value || to.path === from.path) return next()

    gsap.set(overlay.value, { scaleX: 0, transformOrigin: 'left center', display: 'block' })
    gsap.to(overlay.value, {
      scaleX: 1,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => next(),
    })
  })

  const removeAfter = router.afterEach(() => {
    if (!overlay.value) return

    gsap.set(overlay.value, { transformOrigin: 'right center' })
    gsap.to(overlay.value, {
      scaleX: 0,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        if (overlay.value) overlay.value.style.display = 'none'
      },
    })
  })

  onUnmounted(() => {
    removeBefore()
    removeAfter()
  })
})
</script>

<template>
  <div
    ref="overlay"
    class="pointer-events-none fixed inset-0 z-9999 hidden bg-foreground"
  />
</template>
