'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { SiteInfo } from '@/lib/sites'
import fuzzysort from 'fuzzysort'

export default function Page() {
  const [query, setQuery] = useState('')
  const [sites, setSites] = useState<SiteInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        setSites(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Error en fetch:', err)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    if (!query) return sites
    const results = fuzzysort.go(query, sites, {
      key: 'name',
      threshold: -300,
    })
    return results.map(r => r.obj)
  }, [query, sites])

  return (
    <div className="h-[100dvh] flex flex-col">
      {/* Cabecera con logo */}
      <header className="w-full flex justify-start pl-6 pt-3 pb-3 bg-[#CCC5B7]">
        <Image src="/logo/logo-notext-grey-slim.png" alt="Logo" width={80} height={40} priority />
      </header>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 bg-[#F9F5F1] overflow-hidden">
        <main className="flex flex-col items-center px-4 pb-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#E5BB89] text-center leading-tight mt-4">
            Tu marca de ropa en MDP
          </h1>

          <p className="mt-3 text-gray-500 text-center text-base sm:text-l max-w-3xl">
            Escribí el nombre de tu marca favorita en MDP y te contactamos con su sitio web oficial.
          </p>

          <div className="w-full max-w-3xl mt-4">
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${query ? 'text-black' : 'text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 border border-[#d1d5db] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F5D44] text-lg placeholder-gray-400 bg-[#f9fafb] transition text-black"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Limpiar búsqueda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Resultados scrollables */}
        <div className="w-full max-w-3xl flex-1 overflow-y-auto self-center px-2 pb-2">
          {loading ? (
            <p className="text-gray-400 text-center">Cargando...</p>
          ) : filtered.length > 0 ? (
            filtered.map((site) => (
              <div className='my-2' key={site.url}>
                <a
                  href={`https://${site.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-[#CCC5B7] hover:brightness-110 border-l-4 border-[#6F5D44] text-white text-base font-medium shadow-sm rounded-md transition"
                >
                  {site.name}
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4 text-center">No se encontraron resultados.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex-shrink-0 flex flex-col items-center pt-2 pb-2 bg-[#F9F5F1]">
        <hr className="w-full max-w-3xl border-t pb-2 border-gray-300" />
        <Image src="/logo/logo-notext-grey-slim.png" alt="Logo" width={60} height={25} className="brightness-100 invert" />
      </footer>
    </div>
  )
}
