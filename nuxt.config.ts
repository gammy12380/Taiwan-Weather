// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  modules:[
    '@nuxtjs/tailwindcss',
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    apiKey: process.env.apiKey,
    public: {
      baseURL: "https://opendata.cwb.gov.tw/api"
    }
  }
})
