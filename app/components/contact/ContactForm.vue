<script setup lang="ts">
const { t } = useI18n()

type ProjectType = 'showcase' | 'ecommerce' | 'webapp' | 'redesign' | 'other'
type FormState = 'idle' | 'submitting' | 'success'
type ErrorKey =
  | 'nameRequired' | 'emailRequired' | 'emailInvalid'
  | 'typeRequired' | 'messageRequired' | 'messageMin'
  | 'network' | 'rateLimit'

interface FieldErrors {
  name?: ErrorKey
  email?: ErrorKey
  type?: ErrorKey
  message?: ErrorKey
}

const TYPE_OPTIONS: ProjectType[] = ['showcase', 'ecommerce', 'webapp', 'redesign', 'other']

const name = ref('')
const email = ref('')
const type = ref<ProjectType | ''>('')
const message = ref('')
const website = ref('') // honeypot — never user-visible

const state = ref<FormState>('idle')
const fieldErrors = ref<FieldErrors>({})
const submitError = ref<ErrorKey | null>(null)
const submittedName = ref('')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  const errs: FieldErrors = {}
  if (name.value.trim().length < 2) errs.name = 'nameRequired'
  if (!email.value.trim()) errs.email = 'emailRequired'
  else if (!EMAIL_RE.test(email.value.trim())) errs.email = 'emailInvalid'
  if (!type.value) errs.type = 'typeRequired'
  if (!message.value.trim()) errs.message = 'messageRequired'
  else if (message.value.trim().length < 20) errs.message = 'messageMin'
  fieldErrors.value = errs
  return Object.keys(errs).length === 0
}

async function onSubmit() {
  submitError.value = null
  if (!validate()) return
  state.value = 'submitting'

  try {
    const res = await $fetch<{ ok: boolean, errors?: Record<string, string>, error?: string }>('/api/contact', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        email: email.value.trim(),
        type: type.value,
        message: message.value.trim(),
        website: website.value,
      },
      ignoreResponseError: true,
    })

    if (res.ok) {
      submittedName.value = name.value.trim().split(' ')[0] || name.value.trim()
      state.value = 'success'
      return
    }

    if (res.error === 'rate_limit') {
      submitError.value = 'rateLimit'
    }
    else if (res.errors) {
      // Server-side validation rejected something the client missed — surface generic network msg.
      submitError.value = 'network'
    }
    else {
      submitError.value = 'network'
    }
    state.value = 'idle'
  }
  catch (err) {
    console.error('[ContactForm] submit failed', err)
    submitError.value = 'network'
    state.value = 'idle'
  }
}

function reset() {
  name.value = ''
  email.value = ''
  type.value = ''
  message.value = ''
  website.value = ''
  fieldErrors.value = {}
  submitError.value = null
  submittedName.value = ''
  state.value = 'idle'
}
</script>

<template>
  <div class="w-full max-w-md">
    <form
      v-if="state !== 'success'"
      class="space-y-6"
      novalidate
      @submit.prevent="onSubmit"
    >
      <!-- Honeypot — invisible to humans, attractive to bots -->
      <div aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">
        <label for="contact-website">Website</label>
        <input
          id="contact-website"
          v-model="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        >
      </div>

      <!-- Name -->
      <div>
        <label for="contact-name" class="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          {{ t('contact.form.name') }}
        </label>
        <input
          id="contact-name"
          v-model="name"
          type="text"
          :placeholder="t('contact.form.namePlaceholder')"
          :disabled="state === 'submitting'"
          :aria-invalid="!!fieldErrors.name"
          :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined"
          class="w-full bg-transparent border-b border-border py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
        >
        <p
          v-if="fieldErrors.name"
          id="contact-name-error"
          role="alert"
          class="mt-1 text-xs text-red-500"
        >
          {{ t(`contact.form.errors.${fieldErrors.name}`) }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label for="contact-email" class="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          {{ t('contact.form.email') }}
        </label>
        <input
          id="contact-email"
          v-model="email"
          type="email"
          :placeholder="t('contact.form.emailPlaceholder')"
          :disabled="state === 'submitting'"
          :aria-invalid="!!fieldErrors.email"
          :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined"
          class="w-full bg-transparent border-b border-border py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
        >
        <p
          v-if="fieldErrors.email"
          id="contact-email-error"
          role="alert"
          class="mt-1 text-xs text-red-500"
        >
          {{ t(`contact.form.errors.${fieldErrors.email}`) }}
        </p>
      </div>

      <!-- Type -->
      <div>
        <label for="contact-type" class="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          {{ t('contact.form.type') }}
        </label>
        <select
          id="contact-type"
          v-model="type"
          :disabled="state === 'submitting'"
          :aria-invalid="!!fieldErrors.type"
          :aria-describedby="fieldErrors.type ? 'contact-type-error' : undefined"
          class="w-full bg-transparent border-b border-border py-3 text-base text-foreground focus:border-foreground focus:outline-none transition-colors appearance-none"
        >
          <option value="" disabled>
            {{ t('contact.form.typePlaceholder') }}
          </option>
          <option v-for="opt in TYPE_OPTIONS" :key="opt" :value="opt">
            {{ t(`contact.form.typeOptions.${opt}`) }}
          </option>
        </select>
        <p
          v-if="fieldErrors.type"
          id="contact-type-error"
          role="alert"
          class="mt-1 text-xs text-red-500"
        >
          {{ t(`contact.form.errors.${fieldErrors.type}`) }}
        </p>
      </div>

      <!-- Message -->
      <div>
        <label for="contact-message" class="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          {{ t('contact.form.message') }}
        </label>
        <textarea
          id="contact-message"
          v-model="message"
          rows="4"
          :placeholder="t('contact.form.messagePlaceholder')"
          :disabled="state === 'submitting'"
          :aria-invalid="!!fieldErrors.message"
          :aria-describedby="fieldErrors.message ? 'contact-message-error' : undefined"
          class="w-full bg-transparent border-b border-border py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors resize-none"
        />
        <p
          v-if="fieldErrors.message"
          id="contact-message-error"
          role="alert"
          class="mt-1 text-xs text-red-500"
        >
          {{ t(`contact.form.errors.${fieldErrors.message}`) }}
        </p>
      </div>

      <!-- Submit -->
      <div>
        <button
          type="submit"
          :disabled="state === 'submitting'"
          :aria-busy="state === 'submitting'"
          class="inline-flex items-center gap-2 text-base text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors disabled:opacity-50"
        >
          <span>{{ state === 'submitting' ? t('contact.form.submitting') : t('contact.form.submit') }}</span>
          <span aria-hidden="true">→</span>
        </button>
        <p
          v-if="submitError"
          role="alert"
          class="mt-3 text-xs text-red-500"
        >
          {{ t(`contact.form.errors.${submitError}`) }}
        </p>
      </div>
    </form>

    <!-- Success block (Task 8 will animate the transition) -->
    <div v-else class="space-y-4 text-foreground">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 16 l7 7 l13 -14" />
      </svg>
      <p class="text-base">
        {{ t('contact.form.success.title', { name: submittedName }) }}
      </p>
      <button
        type="button"
        class="text-sm text-muted-foreground underline underline-offset-4 decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
        @click="reset"
      >
        {{ t('contact.form.success.again') }} →
      </button>
    </div>
  </div>
</template>
