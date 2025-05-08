export type UserRole = "systemAdmin" | "manager" | "agent" | "support" | "customer";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image?: string;
  role: UserRole;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  role: UserRole;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, "password">> {
  isVerified?: boolean;
  lastLogin?: Date;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
} 
