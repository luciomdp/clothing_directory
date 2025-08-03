import fs from 'fs/promises';
import path from 'path';

export async function getInstancesUrls(): Promise<string[]> {
  const isProd = process.env.NODE_ENV === 'production';
  const fileName = isProd ? 'instances.prod.json' : 'instances.dev.json';
  const filePath = path.resolve('public', 'data', fileName);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}
