import { NextResponse } from 'next/server'
import { type SiteInfo } from '@/lib/sites'
import { getInstancesUrls } from '@/lib/instances'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 86400 })
const baseCacheKey = 'site-info'

export async function GET(): Promise<NextResponse<SiteInfo[]>> {

  const results: SiteInfo[] = [];
  const instancesUrls = await getInstancesUrls()

  for (const url of instancesUrls) 
    results.push(...await getSiteInfo(url))

  return NextResponse.json(results)
}

async function getSiteInfo(url: string): Promise<SiteInfo[]> {
  const cacheKey = `${baseCacheKey}-${url}`;
  
  const cacheResult: SiteInfo[] = getResultFromCache(cacheKey);

  if (cacheResult.length > 0) {
    console.info(`✅ Respuesta desde cache para ${url}`)
    return cacheResult;
  }
  
  console.info(`🔄 No cache found for ${url}, fetching data...`);

  const apiResult: SiteInfo[] = await getResultFromAPI(url);

  if (apiResult.length > 0) {
    console.info(`✅ Respuesta de API desde ${url}`);
    cache.set(cacheKey, apiResult);
    return apiResult;
  }
  
  return [];
}

async function getResultFromAPI(url: string): Promise<SiteInfo[]> {
  try {
    const response = await fetch(`http://${url}/api/public/site/siteswebappinfo`, {
      cache: 'no-store',
    })

    if (!response.ok) 
      console.error(`❌ Error fetching data from ${url}: ${response.statusText}`)

    const data: SiteInfo[] = await response.json()
    data.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
    return data

  } catch (error) {
    console.error(`❌ Error fetching data from ${url} response: ${error}`)
  } 
  return []
}

function getResultFromCache(cacheKey: string): SiteInfo[] {
  return cache.get<SiteInfo[]>(cacheKey) || [];
}

