import { FRONTEND_DIRECTORY_PATH } from '../configs/constants'
import path from 'path'

const ASSETS_DIRECTORY_PATH = path.join(FRONTEND_DIRECTORY_PATH, 'assets')
const ACCEPTED_ENCODED_FILE_TYPE = ['.js', '.geojson', '.css']

export default async (request: Request) => {
  const requestUrlPath = new URL(request.url).pathname

  if (requestUrlPath.includes('assets')) return await handleAssetRequest(request, requestUrlPath)

  if (requestUrlPath === '/') return new Response(Bun.file(path.join(FRONTEND_DIRECTORY_PATH, 'index.html')))

  return Response.redirect('/', 301)
}

const handleAssetRequest = async (request: Request, requestUrlPath: string) => {
  const [_, assetPath] = requestUrlPath.split('assets')

  const assetFullPath = path.join(ASSETS_DIRECTORY_PATH, assetPath)

  const requestedFileExtension = path.extname(assetFullPath).toLowerCase()

  if (!ACCEPTED_ENCODED_FILE_TYPE.find(fileType => fileType === requestedFileExtension))
    return new Response(Bun.file(assetFullPath))

  const acceptEncoding = request.headers.get('accept-encoding') || ''

  if (!acceptEncoding.includes('gzip')) return new Response(Bun.file(assetFullPath))

  const headers = {
    'Content-Encoding': 'gzip',
    'Content-Type': getMimeType(assetFullPath),
    Vary: 'Accept-Encoding',
  }

  if (!(await Bun.file(`${assetFullPath}.gz`).exists())) return new Response(Bun.file(assetFullPath))

  return new Response(Bun.file(`${assetFullPath}.gz`), { headers: headers })
}

const getMimeType = (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase()

  const [js, geojson, css] = ACCEPTED_ENCODED_FILE_TYPE

  if (extension === js) return 'application/javascript'

  if (extension === geojson) return 'application/geo+json'

  if (extension === css) return 'text/css'

  return 'application/octet-stream'
}
