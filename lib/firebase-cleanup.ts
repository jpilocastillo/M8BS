/**
 * This file exists to maintain backward compatibility with the old Firebase files.
 * It re-exports everything from the new consolidated Firebase modules.
 *
 * IMPORTANT: This file is deprecated and will be removed in the future.
 * Please update your imports to use the new Firebase modules:
 *
 * import { app, auth, db, storage } from "@/lib/firebase"
 * import { loginUser, signOutUser, registerUser } from "@/lib/firebase"
 */

export * from "./firebase"
export { default } from "./firebase/client"

// For backward compatibility with firebase-config.ts
export { default as firebaseConfig } from "./firebase/config"

// For backward compatibility with firebase-auth.ts
export {
  loginUser as signIn,
  registerUser as signUp,
  signOutUser as signOut,
  useFirebaseAuth,
} from "./firebase/auth"

// For backward compatibility with firebase-admin.ts
export {
  initializeFirebaseAdmin,
  getAdminAuth,
  getAdminFirestore,
  getAdminStorage,
  admin,
} from "./firebase/admin"
