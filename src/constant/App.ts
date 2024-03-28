export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user'
}

export const userRoles = [
  {
    label: 'Super Admin',
    value: Role.SUPER_ADMIN
  },
  {
    label: 'Admin',
    value: Role.ADMIN
  },
  {
    label: 'User',
    value: Role.USER
  }
]

export const userStatus = [
  {
    label: 'Active',
    value: UserStatus.ACTIVE
  },
  {
    label: 'Inactive',
    value: UserStatus.INACTIVE
  }
]
