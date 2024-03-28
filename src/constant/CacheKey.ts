const SYSTEM_NAME = 'REAC_TS_BASE'

class CacheKey {
  static TOKEN = `${SYSTEM_NAME}_token`
  static REFRESH_TOKEN = `${SYSTEM_NAME}_refreshToken`
  static USER_INFO = `${SYSTEM_NAME}_userInfo`
  static SIGNAL_KEYS = `256keys`
  static USER_SCOPE = `${SYSTEM_NAME}_userScope`
  static FINAWARE_SS_ID = `${SYSTEM_NAME}_finAwareSessionId`
}

export default CacheKey
