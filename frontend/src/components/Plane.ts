const getColor = (state: 'selected' | 'landed' | 'flying') =>
  state === 'selected' ? '#d288ff' : state === 'landed' ? '#ffbb2a' : '#1fdf70'

export default function (parameters: {
  rotation?: number
  state?: 'selected' | 'landed' | 'flying'
  size?: number
}) {
  const { rotation = 0, state = 'flying', size = 16 } = parameters
  return `<svg
height="${size}px"
width="${size}px"
version="1.1"
id="Capa_1"
xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 46.876 46.876"
xml:space="preserve"
transform="rotate(${rotation})">
<g>
  <path
    style="fill: ${getColor(state)}"
    d="M26.602,24.568l15.401,6.072l-0.389-4.902c-10.271-7.182-9.066-6.481-14.984-10.615V2.681c0-1.809-1.604-2.701-3.191-2.681c-1.587-0.021-3.19,0.872-3.19,2.681v12.44c-5.918,4.134-4.714,3.434-14.985,10.615l-0.39,4.903l15.401-6.072c0,0-0.042,15.343-0.006,15.581l-5.511,3.771v2.957l7.044-2.427h3.271l7.046,2.427V43.92l-5.513-3.771C26.644,39.909,26.602,24.568,26.602,24.568z" />
</g>
</svg>`
}
