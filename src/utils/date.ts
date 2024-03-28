import moment from 'moment'

export function formatDate(value: string | null | Date | undefined, formatStr = 'MM/DD/YYYY'): string {
  if (value) {
    return moment(new Date(value)).format(formatStr)
  }
  return ''
}
