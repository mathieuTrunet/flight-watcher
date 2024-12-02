import { readdirSync, mkdirSync, statSync, copyFileSync, existsSync } from 'bun:fs'
import { join } from 'path'

const sourceDirectory = join(process.cwd(), 'src/assets')
const destinationDirectory = join(process.cwd(), 'dist/assets')

function copyNonSvgFiles(source, destination) {
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true })
  }

  for (const file of readdirSync(source)) {
    const sourcePath = join(source, file)
    const destinationPath = join(destination, file)

    if (statSync(sourcePath).isDirectory()) {
      copyNonSvgFiles(sourcePath, destinationPath)
    } else if (!file.endsWith('.svg')) {
      copyFileSync(sourcePath, destinationPath)
    }
  }
}

copyNonSvgFiles(sourceDirectory, destinationDirectory)
console.log('assets copied to build output')
