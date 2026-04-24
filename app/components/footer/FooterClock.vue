<script setup lang="ts">
const time = ref('')

const formatter = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function format(): string {
  // Intl outputs "14:32" in fr-FR with 2-digit hour/minute and hour12: false.
  return formatter.format(new Date())
}

let timeoutId: ReturnType<typeof setTimeout> | null = null
let intervalId: ReturnType<typeof setInterval> | null = null

function tickToMinuteBoundary() {
  time.value = format()
  const now = new Date()
  const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds())
  timeoutId = setTimeout(() => {
    time.value = format()
    intervalId = setInterval(() => {
      time.value = format()
    }, 60_000)
  }, msToNextMinute)
}

onMounted(() => {
  tickToMinuteBoundary()
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <span>Paris <span class="tabular-nums">{{ time }}</span></span>
</template>
