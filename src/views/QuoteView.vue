<template>
  <main class="quote-page">
    <h1>{{ t('quote.title') }}</h1>
    <blockquote>{{ quotes[currentQuoteIndex] }}</blockquote>
    <button type="button" @click="pickRandomQuote">{{ t('quote.next') }}</button>
  </main>
</template>

<script>
import { t } from '../i18n.js'

export default {
  name: 'QuoteView',
  data() {
    return { currentQuoteIndex: 0 }
  },
  computed: {
    quotes() {
      return t('quote.quotes')
    },
  },
  methods: {
    t,
    pickRandomQuote() {
      if (this.quotes.length < 2) return

      const offset = Math.floor(Math.random() * (this.quotes.length - 1)) + 1
      this.currentQuoteIndex = (this.currentQuoteIndex + offset) % this.quotes.length
    },
  },
}
</script>
