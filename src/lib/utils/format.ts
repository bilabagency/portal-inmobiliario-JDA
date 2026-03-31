export function formatPrecio(precio: number | null, moneda: string | null): string {
  if (!precio) return 'Consultar'
  const formatted = new Intl.NumberFormat('es-AR').format(precio)
  if (moneda === 'USD') return `USD ${formatted}`
  if (moneda === 'ARS') return `$ ${formatted}`
  return formatted
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
