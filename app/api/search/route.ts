import { NextRequest, NextResponse } from 'next/server'

interface SerpResult {
  title?: string
  link?: string
  snippet?: string
}

export async function POST(req: NextRequest) {
  const { skills, qualifications, experiences, location, openToWork } = await req.json()

  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    return NextResponse.json(
      { error: 'SERPAPI_KEY is not configured. Copy .env.local.example to .env.local and add your key from serpapi.com' },
      { status: 500 }
    )
  }

  const allTerms: string[] = [...skills, ...qualifications, ...experiences]
  if (allTerms.length === 0) {
    return NextResponse.json({ error: 'No search terms provided' }, { status: 400 })
  }

  // Build Google search query targeting LinkedIn profiles
  const quoted = allTerms.map((t: string) => `"${t}"`).join(' ')
  const locationTerm = location?.trim() ? ` "${location.trim()}"` : ''
  const openToWorkTerm = openToWork ? ' "#OpenToWork"' : ''
  const query = `site:linkedin.com/in ${quoted}${locationTerm}${openToWorkTerm}`

  try {
    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'google')
    url.searchParams.set('q', query)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('num', '100')

    const response = await fetch(url.toString())

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`SerpAPI error: ${response.status} — ${text}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    const profiles = (data.organic_results || [])
      .filter((r: SerpResult) => r.link?.includes('linkedin.com/in/'))
      .map((result: SerpResult) => {
        // LinkedIn title format: "First Last - Title | LinkedIn" or "First Last | LinkedIn"
        const rawTitle = result.title?.replace(' | LinkedIn', '').replace(' - LinkedIn', '') || ''
        const titleParts = rawTitle.split(' - ')
        const name = titleParts[0]?.trim() || 'Unknown'
        const headline = titleParts.slice(1).join(' - ').trim()
        const snippet = result.snippet || ''

        // Find which input skills appear in the snippet or headline
        const matchedSkills = skills.filter((skill: string) =>
          snippet.toLowerCase().includes(skill.toLowerCase()) ||
          headline.toLowerCase().includes(skill.toLowerCase())
        )

        return {
          name,
          headline,
          url: result.link,
          snippet,
          matchedSkills,
        }
      })

    return NextResponse.json({ profiles, query })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
