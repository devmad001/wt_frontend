import UniversalCookie from 'universal-cookie'
import CacheKey from '../../constant/CacheKey'

const cookie = new UniversalCookie()

export function setAccessToken(token: string): void {
  cookie.set(CacheKey.TOKEN, token, { path: '/' })
}

export function getAccessToken(): string {
  return cookie.get(CacheKey.TOKEN)
}

export function setRefreshToken(token: string): void {
  cookie.set(CacheKey.REFRESH_TOKEN, token, {
    path: '/'
  })
}

export function getRefreshToken(): string {
  return cookie.get(CacheKey.REFRESH_TOKEN)
}

export function setUserInfo(user: any): void {
  cookie.set(CacheKey.USER_INFO, user, { path: '/' })
}

export function getUserInfo(): any {
  return cookie.get(CacheKey.USER_INFO)
}

export function isAuthenticated(): boolean {
  const token = getAccessToken()
  return !!token
}

export function revokeUser(): void {
  const options = {
    path: '/'
  }
  cookie.remove(CacheKey.TOKEN, options)
  cookie.remove(CacheKey.REFRESH_TOKEN, options)
  cookie.remove(CacheKey.USER_INFO, options)
  cookie.remove(CacheKey.USER_SCOPE, options)
  cookie.remove(CacheKey.FINAWARE_SS_ID, options)
  localStorage.clear()
}

export function setUserScopeInfo(data: any): void {
  cookie.set(CacheKey.USER_SCOPE, data, { path: '/' })
}

export function getUserScopeInfo(): any {
  return cookie.get(CacheKey.USER_SCOPE)
}

export function setFinAwareSessionId(data: any): void {
  cookie.set(CacheKey.FINAWARE_SS_ID, data, { path: '/' })
}

export function getFinAwareSessionId(): any {
  return cookie.get(CacheKey.FINAWARE_SS_ID)
}
