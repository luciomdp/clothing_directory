import { NextResponse } from 'next/server'
import { type SiteInfo } from '@/lib/sites'

export async function GET(): Promise<NextResponse<SiteInfo[]>> {

  const results: SiteInfo[] = [
    {
      name: 'Azyz Indumentaria',
      description: 'Ropa de calidad y estilo al mejor precio',
      url: 'www.instagram.com/azyz.indumentaria/'
    },
    {
      name: 'Maldo \'co',
      description: 'Un estilo único de autor',
      url: 'www.instagram.com/maldoco_/'
    },
    {
      name: 'Univives',
      description: 'Marca insignia de UNICEN',
      url: 'univibes.com.ar/?fbclid=PAZXh0bgNhZW0CMTEAAadL7v-RrCulUbV7vSHF8u4QzXIToftQNVd45NnEEZkeZtk9Xr1cv7qY6C8b7A_aem_Jy0AeDJCFOAuPZFRJ2MMeg'
    }
  ];

  return NextResponse.json(results)
}

