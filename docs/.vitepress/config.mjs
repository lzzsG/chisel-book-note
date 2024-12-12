import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/chisel-book-note/',
  title: "Lzzs ChiselBook Notes",
  description: "A VitePress Site ,for Lzzs ChiselBook Notebook",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: 'Home', link: 'https://lzzs.fun' },
      { text: 'Blog', link: 'https://lzzs.fun/blog' },
    ],

    // logo: '/favicon.svg',  // 替换为你的logo
    // siteTitle: '----',  // 可自定义标题，不设置则默认为title

    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Lzz'
    },
    sidebar: [
      {
        text: 'ChiselBook',

        items: [
          { text: '首页', link: '/' },
          { text: '未完成 Ch1', link: '/ch1' },
          { text: '未完成 Ch2', link: '/ch2' },
          { text: '未完成 Ch3', link: '/ch3' },
          { text: 'Markdown Examples1', link: '/markdown/markdown-examples' },
          { text: 'Markdown Examples2', link: '/markdown/md' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lzzsG/chisel-book-note' }
    ],
    search: {
      provider: 'local'
    }


  },
  rewrites: {
    // 'md': '1/md',  // 可以在这重定向
  },
  cleanUrls: true,
  markdown: {
    // math: true   // 数学公式，需要 npm add -D markdown-it-mathjax3

  }
})
