/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://neetell.in',
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true, // Automatically generates a robots.txt file
  sitemapSize: 7000,       // Split sitemap into multiple files if URL count exceeds this
  exclude: ['/server-sitemap.xml', '/robots.txt', '/sitemap.xml', '/sitemap-*.xml'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      images: path === '/'
        ? [
            { loc: new URL('/logo-outline.png', config.siteUrl) },
            { loc: new URL('/logo-nobg.png', config.siteUrl) },
            { loc: new URL('/hero-light.png', config.siteUrl) },
            { loc: new URL('/hero-dark.png', config.siteUrl) },
            { loc: new URL('/og-one.png', config.siteUrl) },
            { loc: new URL('/og-two.png', config.siteUrl) },
          ]
        : undefined,
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
