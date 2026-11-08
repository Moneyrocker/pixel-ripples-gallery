import { cp, mkdir, readdir, readFile, realpath, rm, stat } from 'node:fs/promises'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceFile = join(repoRoot, 'index.html')
const outputDir = join(repoRoot, 'public-site')

const ignoredReference = (value) => {
  const ref = value.trim().split(/[?#]/, 1)[0]
  return !ref || ref.startsWith('#') || ref.startsWith('data:') || ref.startsWith('http:') || ref.startsWith('https:') || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('javascript:')
}

const referencesIn = (html, cssOnly = false) => {
  const refs = new Set()
  if (!cssOnly) for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) refs.add(match[1])
  for (const match of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) refs.add(match[1])
  return [...refs].filter((ref) => !ignoredReference(ref))
}

const copiedPaths = new Set()
const copyReferencedAsset = async (ref, fromFile = sourceFile) => {
  const clean = ref.split(/[?#]/, 1)[0]
  let source = clean.startsWith('/') ? resolve(repoRoot, clean.slice(1)) : resolve(dirname(fromFile), clean)
  if (source === repoRoot) return 'index.html'
  if (source === join(repoRoot, 'studio')) source = join(source, 'index.html')
  const repoRelative = relative(repoRoot, source)
  if (!repoRelative || repoRelative.startsWith('..') || isAbsolute(repoRelative)) throw new Error(`Reference escapes repository: ${ref}`)
  if (/^demo\/(xiangshi|design-lab|chat-galaxy)\/?$/.test(clean)) return clean
  const studioPage = repoRelative === 'studio/index.html'
  if (!studioPage && (!repoRelative.startsWith('assets/') || !['.png','.jpg','.jpeg','.webp','.svg','.gif','.avif','.css','.js','.woff','.woff2','.ttf','.otf','.mp4','.webm'].includes(extname(source).toLowerCase()))) throw new Error(`Only website assets may be published: ${ref}`)
  const resolvedSource = await realpath(source)
  if (relative(repoRoot, resolvedSource).startsWith('..')) throw new Error(`Asset symlink escapes repository: ${ref}`)
  if (copiedPaths.has(repoRelative)) return repoRelative
  const info = await stat(source)
  if (!info.isFile()) throw new Error(`Referenced local asset is not a file: ${ref}`)
  const target = join(outputDir, repoRelative)
  await mkdir(dirname(target), { recursive: true })
  await cp(source, target)
  copiedPaths.add(repoRelative)
  if (extname(source) === '.css') for (const child of referencesIn(await readFile(source, 'utf8'), true)) await copyReferencedAsset(child, source)
  if (studioPage) for (const child of referencesIn(await readFile(source, 'utf8'))) await copyReferencedAsset(child, source)
  return repoRelative
}

const html = await readFile(sourceFile, 'utf8')
const refs = referencesIn(html)
await rm(outputDir, { recursive: true, force: true })
await mkdir(outputDir, { recursive: true })
await cp(sourceFile, join(outputDir, 'index.html'))
const copied = []
for (const ref of refs) copied.push(await copyReferencedAsset(ref))

// Explicit public demo roots. No source trees, source maps or development files.
const demoExtensions = new Set(['.html', '.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.woff', '.woff2', '.ttf', '.ico', '.txt'])
async function copyDemo(dir, target) {
  const resolvedDir = await realpath(dir)
  if (relative(repoRoot, resolvedDir).startsWith('..')) throw new Error(`Demo escapes repository: ${dir}`)
  await mkdir(target, { recursive: true })
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') throw new Error(`Unexpected hidden/development demo asset: ${entry.name}`)
    const source = join(dir, entry.name)
    const destination = join(target, entry.name)
    if (entry.isDirectory()) await copyDemo(source, destination)
    else if (entry.isFile() && demoExtensions.has(extname(entry.name).toLowerCase())) await cp(source, destination)
    else throw new Error(`Unapproved demo asset: ${source}`)
  }
}
for (const demo of ['xiangshi', 'design-lab', 'chat-galaxy']) {
  await copyDemo(join(repoRoot, 'demo', demo), join(outputDir, 'demo', demo))
}

const outputFiles = []
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else outputFiles.push(relative(outputDir, path))
  }
}
await walk(outputDir)
console.log(JSON.stringify({ output: 'public-site', files: outputFiles, copiedAssets: copied }, null, 2))
