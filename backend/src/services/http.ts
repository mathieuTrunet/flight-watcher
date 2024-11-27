import { FRONTEND_DIRECTORY_PATH } from '../configs/constants'
import path from 'path'

const ASSETS_DIRECTORY_PATH = path.join(FRONTEND_DIRECTORY_PATH, 'assets')

export default (request: Request) => {
  const requestUrlPath = new URL(request.url).pathname

  if (requestUrlPath.includes('assets')) {
    const [_, assetPath] = requestUrlPath.split('assets')

    return new Response(Bun.file(path.join(ASSETS_DIRECTORY_PATH, assetPath)))
  }

  if (requestUrlPath === '/') return new Response(Bun.file(path.join(FRONTEND_DIRECTORY_PATH, 'index.html')))

  return Response.redirect('/', 301)
}
