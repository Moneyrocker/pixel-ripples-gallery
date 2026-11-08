# Public demo snapshots

`demo/` contains reviewed static build outputs only. The gallery remains native HTML/CSS/JavaScript; `npm run build` copies these three explicit demo directories alongside the gallery and `studio/`.

| Path | Public experience | Safety boundary |
| --- | --- | --- |
| `demo/xiangshi/` | Existing 相识 user-flow prototype | Fictional profiles and local SVG portraits; read-only fake contact fields; no administrator or test-console routes; browser-local state with an isolated key; no backend or real matchmaking |
| `demo/design-lab/` | Existing Design Lab Playground | Original style/component/motion studies; no backend |
| `demo/chat-galaxy/` | Existing Chat Galaxy orbital interaction | Fictional numbered nodes; no real contacts, personal contact details, AI analysis or backend; static Next.js export |

Living Studio stays in the gallery's detail dialog. Its source includes private residence assets and a development-only file API and has not been published.

## Updating snapshots

Build and review the relevant private project in an isolated working copy; do not copy the source repository, environment files, reference photos, source maps, development APIs or private data into this repository. 相识 and Design Lab use Vite's relative `--base=./`. 相识 uses hash routing so refreshes work on static hosting. Chat Galaxy uses `output: 'export'`, `basePath: '/demo/chat-galaxy'`, `trailingSlash: true`, and no image-optimization server. Exclude unused private source images from the exported output.

Replace only the corresponding reviewed `demo/<name>/` output, run `npm run build`, test interactions and direct refreshes, and inspect the full `public-site/` artifact before publication. Do not use an unreviewed new build from the private projects.

Chat Galaxy's gallery link uses the canonical production URL because Next.js assets have a fixed root base path. On localhost the link points to the local demo; on the GitHub Pages mirror it opens the production demo in a new tab. Relative Vite demos work on both hosts.

## Existing CloudBase hosting

Publish only `public-site/` to the existing application prefix `/pixel-ripples-site` in environment `matchmaking-d5gg0rpdfccae6a7b`. Never upload to the environment root, prune unrelated files, change DNS/SSL or touch `/matchmaking-app`. Keep a previous-release backup and verify the domain and demo subpaths after upload.
