// import { createAuthClient } from "better-auth/react";
// import env from "@/env";

// export const authClient = createAuthClient({
//   baseURL: env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000",
// });

// export const {
//   signIn,
//   signOut,
//   signUp,
//   updateUser,
//   changePassword,
//   changeEmail,
//   deleteUser,
//   useSession,
//   revokeSession,
//   getSession,
//   resetPassword,
//   sendVerificationEmail,
//   linkSocial,
//   forgetPassword,
//   verifyEmail,
//   listAccounts,
//   listSessions,
//   revokeOtherSessions,
//   revokeSessions,
// } = authClient;
import { createAuthClient } from "better-auth/react";
import env from "@/env";

// Extend SignUpEmail type
type CustomSignUpEmail = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image?: string;
  callbackURL?: string;
  role: "customer";
};

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_ENDPOINT,
}) as typeof authClient & {
  signUp: {
    email: (data: CustomSignUpEmail) => Promise<any>;
  };
};

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
