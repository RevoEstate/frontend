import { createAuthClient } from "better-auth/react";
import env from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000",
});

export const {
  signIn,
  signOut,
  signUp,
  updateUser,
  changePassword,
  changeEmail,
  deleteUser,
  useSession,
  revokeSession,
  getSession,
  resetPassword,
  sendVerificationEmail,
  linkSocial,
  forgetPassword,
  verifyEmail,
  listAccounts,
  listSessions,
  revokeOtherSessions,
  revokeSessions,
} = authClient;
