class AuthHelper {
  static RoleType = {
    TECH_OWNER: 'tech_owner',
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user'
  }
  static RegisterType = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user'
  }
  static MembershipType = {
    FINAWARE: 'fin_aware',
    TRACKER: 'tracker_tool'
  }
  static ReviewType = {
    IN_PROGRESS: 'in_progress',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
  }
}

export default AuthHelper
