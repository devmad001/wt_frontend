import jwtDecode from 'jwt-decode'
import moment from 'moment'
import { get } from 'lodash'
import { getAccessToken } from './cache/cookies'

declare let CryptoJS: any

const base64url = (source: any) => {
  let encodedSource = CryptoJS.enc.Base64.stringify(source)

  encodedSource = encodedSource.replace(/=+$/, '')

  encodedSource = encodedSource.replace(/\+/g, '-')
  encodedSource = encodedSource.replace(/\//g, '_')

  return encodedSource
}

export function shouldRefreshToken(): boolean {
  const token = getAccessToken()
  if (token) {
    const data = jwtDecode(token)
    const iat: any = get(data, 'iat')
    const exp: any = get(data, 'exp')
    const validRemainTime = moment.unix(exp).diff(moment.unix(iat), 'seconds') / 3 // 1/3 expire time
    return moment.unix(exp).isAfter(moment()) && moment.unix(exp).diff(moment(), 'seconds') <= validRemainTime
  }
  return false
}

export function expiryIsComming(token: string): boolean {
  if (token) {
    const data = jwtDecode(token)
    const iat: any = get(data, 'iat')
    const exp: any = get(data, 'exp')
    const validRemainTime = moment.unix(exp).diff(moment.unix(iat), 'seconds') / 3 // 1/3 expire time
    return moment.unix(exp).isAfter(moment()) && moment.unix(exp).diff(moment(), 'seconds') <= validRemainTime
  }
  return false
}

/**
 * Customize token generation
 * @param expiry How long will the token expire from now?
 * @returns String token
 */
export function generateToken(expiry = 12): string {
  const userToken = getAccessToken()
  const data = jwtDecode(userToken)
  const sub: any = get(data, 'sub')
  const email: any = get(data, 'email')
  const iat: any = get(data, 'iat')
  const exp: any = get(data, 'exp')
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const payload = {
    sub: sub,
    email: email,
    iat: iat,
    exp: moment(iat * 1000).add(expiry, 'hours')
  }

  const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
  const encodedHeader = base64url(stringifiedHeader)

  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload))
  const encodedData = base64url(stringifiedData)

  let signature = encodedHeader + '.' + encodedData
  signature = CryptoJS.HmacSHA256(signature, sub)

  return [encodedHeader, encodedData, signature].filter(Boolean).join('.')
}
