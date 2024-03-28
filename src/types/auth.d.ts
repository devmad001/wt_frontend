declare namespace Auth {
  export interface AuthContextProps {
    username: string
    user: User.Details
  }

  export interface SignInParams {
    email: string
    password: string
  }

  export interface RegisterParams {
    registerType: string
    memberships: string[]
    activationCode?: string
    email: string
    password: string
    agency?: string
    agencyName?: string
    fieldOffice?: string
    squad?: string
    fullName: string
    phone: string
  }

  export interface ScopeInfo {
    memberships: string[]
    role: string
  }

  export interface ChangePasswordParams {
    currentPassword: string
    newPassword: string
  }

  export interface ExternalParams {
    fin_session_id: string
    expiry?: number
  }

  export interface SmsVerificationParams {
    idToken: string
    otp: string
  }

  export interface RequestOTPParams {
    email: string
    idToken: string
  }
}
