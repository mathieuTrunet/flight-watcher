import type { Server } from 'bun'
import { FRONTEND_DIRECTORY_PATH } from '../configs/constants'
import path from 'path'

const ASSET_DIRECTORY_PATH = path.join(FRONTEND_DIRECTORY_PATH, 'assets')

export default (request: Request, server: Server) => {
  const success = server.upgrade(request)

  if (success) return undefined

  const requestUrlPath = new URL(request.url).pathname

  if (requestUrlPath.includes('assets')) {
    const [_, assetPath] = requestUrlPath.split('assets')

    return new Response(Bun.file(path.join(ASSET_DIRECTORY_PATH, assetPath)))
  }

  if (requestUrlPath === '/') return new Response(Bun.file(path.join(FRONTEND_DIRECTORY_PATH, 'index.html')))

  return Response.redirect('/', 301)
}
