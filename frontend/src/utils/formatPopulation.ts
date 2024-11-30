const formatPopulation = (population: number) =>
  new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(population)

export default formatPopulation
