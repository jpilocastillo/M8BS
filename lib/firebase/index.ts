// Re-export everything from the Firebase modules
export * from "./config"
export * from "./client"
export * from "./auth"

// Note: admin.ts is not exported here because it's server-side only
// and should be imported directly when needed
