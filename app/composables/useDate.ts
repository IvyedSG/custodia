import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date'

export function useDate() {
  const dateFormatter = new DateFormatter('es-ES', {
    dateStyle: 'long',
  })

  const formatLongDate = (date: DateValue | undefined) => {
    if (!date) return ''
    return dateFormatter.format(date.toDate(getLocalTimeZone()))
  }

  const formatISODate = (date: DateValue | undefined): string | undefined => {
    if (!date) return undefined
    const year = date.year
    const month = String(date.month).padStart(2, '0')
    const day = String(date.day).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const datePart = dateStr.split('T')[0]
    if (!datePart) return dateStr
    
    const parts = datePart.split('-').map(Number)
    if (parts.length < 3) return dateStr
    
    const [year, month, day] = parts
    const date = new Date(Date.UTC(year!, month! - 1, day!))
    
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date)
  }

  return {
    formatLongDate,
    formatISODate,
    formatDisplayDate,
  }
}
