interface Profile {
  name: string
  headline: string
  url: string
  snippet: string
  matchedSkills: string[]
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base">
            {initials || '?'}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
            {profile.headline && (
              <p className="text-sm text-gray-500 truncate">{profile.headline}</p>
            )}
          </div>
        </div>
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Profile
        </a>
      </div>

      {profile.snippet && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{profile.snippet}</p>
      )}

      {profile.matchedSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
