import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://v0-portfolio-app-prototype-weeklate.vercel.app'
  
  const routes = [
    '',
    '/portfolio-security',
    '/mcp-integration',
    '/mcp-security',
    '/security-plan',
    '/security',
    '/admin',
    '/sign-in',
    '/sign-up',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.includes('security') || route.includes('mcp') ? 0.9 : 0.8,
  }))
}
