import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/blocked/',
        ],
      },
    ],
    sitemap: 'https://v0-portfolio-app-prototype-weeklate.vercel.app/sitemap.xml',
  }
}
