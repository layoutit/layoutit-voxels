export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",
  srcDir: "src/",
  dir: {
    static: "../static",
  },
  env: {
    supabaseUrl: process.env.NUXT_ENV_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NUXT_ENV_SUPABASE_ANON_KEY || "",
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Layoutit Voxels - 3D CSS Grid Generator",
    htmlAttrs: {
      lang: "en",
    },

    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
      {
        hid: "description",
        name: "description",
        content:
          "An interactive 3D CSS grid generator. Define a grid and generate your design!",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=auto",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css",
      },
    ],
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js",
        defer: true,
      },
    ],
  },
  css: ["prismjs/themes/prism.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/globalObject.js" },
    "~/plugins/prism.js",
    "~/plugins/supabase.js",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],
  serverMiddleware: [
    // Will register file from project server-middleware directory to handle /server-middleware/* requires
    // { path: '/api', handler: '~/server-middleware/index.js' }
  ],
};
