const getMagneticDirection = (degrees: number) => {
  const directions = [
    { name: 'Nord', range: [337.5, 360] },
    { name: 'Nord', range: [0, 22.5] },
    { name: 'Nord-Est', range: [22.5, 67.5] },
    { name: 'Est', range: [67.5, 112.5] },
    { name: 'Sud-Est', range: [112.5, 157.5] },
    { name: 'Sud', range: [157.5, 202.5] },
    { name: 'Sud-Ouest', range: [202.5, 247.5] },
    { name: 'Ouest', range: [247.5, 292.5] },
    { name: 'Nord-Ouest', range: [292.5, 337.5] },
  ]

  return directions.find(({ range }) => degrees >= range[0] && degrees < range[1])!.name
}

export default getMagneticDirection
