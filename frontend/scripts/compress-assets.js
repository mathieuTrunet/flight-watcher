import { join } from 'path'
import { $ } from 'bun'

const targetDirectory = join(process.cwd(), 'dist/assets')

await $`gzip -k -9 ${targetDirectory}/*.js`
await $`gzip -k -9 ${targetDirectory}/*.geojson`
await $`gzip -k -9 ${targetDirectory}/*.css`

console.log('assets compressed in build output')
