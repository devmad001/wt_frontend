import Payment from 'payment'

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function isAvailablePath(path: string): boolean {
  const pathArray = window.location.pathname.split('/')
  return pathArray.includes(path) || window.location.pathname.includes(path)
}

export const chunkArray = (arr: any, chunkSize: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}

export function formatCreditCardNumber(value: any) {
  if (!value) {
    return value
  }

  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(
        12,
        19
      )}`
      break
  }

  return nextValue.trim()
}

export function formatPromoCode(value: any) {
  if (!value) {
    return value
  }

  const clearValue = value.trim().replace(/[\s-]+/g, '')

  const nextValue = [
    clearValue.length >= 6 ? `${clearValue.slice(0, 6)}` : value,
    clearValue.length >= 11 ? `${clearValue.slice(6, 11)}` : `${clearValue.slice(6, clearValue.length)}`,
    clearValue.length >= 16 ? `${clearValue.slice(11, 16)}` : `${clearValue.slice(11, clearValue.length)}`
  ]
    .filter(Boolean)
    .join('-')

  return nextValue.trim()
}
