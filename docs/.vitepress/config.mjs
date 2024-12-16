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
        text: 'ChiselBook Notes',

        items: [
          { text: '首页', link: '/' },
          { text: 'Ch1 Introduction', link: '/ch1' },
          { text: 'Ch2 Basic Components', link: '/ch2' },
          { text: 'Ch3 Build Process and Testing', link: '/ch3' },
          { text: 'Ch4 Components', link: '/ch4' },
          { text: 'Ch5 Combinational Building Blocks', link: '/ch5' },
          { text: 'Ch6 Sequential Building Blocks', link: '/ch6' },
          { text: 'Ch7 Input Processing', link: '/ch7' },
          { text: 'Ch8 Finite-State Machines', link: '/ch8' },
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
    math: true   // 数学公式，需要 npm add -D markdown-it-mathjax3

  }
})
