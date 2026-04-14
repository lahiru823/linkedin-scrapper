'use client'

import { useState, useMemo } from 'react'
import TagInput from '@/components/TagInput'
import ProfileCard from '@/components/ProfileCard'

interface Profile {
  name: string
  headline: string
  url: string
  snippet: string
  matchedSkills: string[]
}

const PAGE_SIZE = 25

export default function Home() {
  const [skills, setSkills] = useState<string[]>([])
  const [qualifications, setQualifications] = useState<string[]>([])
  const [experiences, setExperiences] = useState<string[]>([])
  const [location, setLocation] = useState('Sri Lanka')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  function addTag(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    tag: string
  ) {
    if (tag && !current.includes(tag)) setter((prev) => [...prev, tag])
  }

  function removeTag(setter: React.Dispatch<React.SetStateAction<string[]>>, tag: string) {
    setter((prev) => prev.filter((t) => t !== tag))
  }

  const hasTerms = skills.length > 0 || qualifications.length > 0 || experiences.length > 0

  const totalPages = Math.ceil(profiles.length / PAGE_SIZE)
  const paginatedProfiles = useMemo(
    () => profiles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [profiles, currentPage]
  )

  async function handleSearch() {
    if (!hasTerms) {
      setError('Please add at least one skill, qualification, or experience.')
      return
    }
    setLoading(true)
    setError('')
    setSearched(true)
    setProfiles([])
    setCurrentPage(1)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, qualifications, experiences, location }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setProfiles(data.profiles)
      if (data.query) setSearchQuery(data.query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function goToPage(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Profile Search</h1>
          <p className="text-gray-500 text-sm">
            Find professionals by skills, qualifications &amp; experience
          </p>
        </div>

        {/* Help tip */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Type a value and press <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">,</kbd> to add it as a tag. Press <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Backspace</kbd> to remove the last tag.
          </span>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <TagInput
            label="Skills"
            placeholder="e.g. Python, React, Machine Learning"
            tags={skills}
            onAdd={(tag) => addTag(setSkills, skills, tag)}
            onRemove={(tag) => removeTag(setSkills, tag)}
            colorClass="bg-blue-100 text-blue-700"
          />
          <TagInput
            label="Qualifications"
            placeholder="e.g. BSc Computer Science, MBA, PhD"
            tags={qualifications}
            onAdd={(tag) => addTag(setQualifications, qualifications, tag)}
            onRemove={(tag) => removeTag(setQualifications, tag)}
            colorClass="bg-purple-100 text-purple-700"
          />
          <TagInput
            label="Experience"
            placeholder="e.g. 5 years experience, Senior Engineer"
            tags={experiences}
            onAdd={(tag) => addTag(setExperiences, experiences, tag)}
            onRemove={(tag) => removeTag(setExperiences, tag)}
            colorClass="bg-orange-100 text-orange-700"
          />

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sri Lanka, London, Remote"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors bg-white"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading || !hasTerms}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching LinkedIn...
              </>
            ) : (
              'Search LinkedIn Profiles'
            )}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">
                {profiles.length > 0
                  ? `${profiles.length} profile${profiles.length > 1 ? 's' : ''} found`
                  : 'No profiles found'}
              </h2>
              {profiles.length > 0 && (
                <span className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {profiles.length > 0 ? (
              <>
                <div className="space-y-4 mb-6">
                  {paginatedProfiles.map((profile, i) => (
                    <ProfileCard key={i} profile={profile} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="mb-1">No profiles matched your search.</p>
                <p className="text-sm">Try using fewer or broader search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
