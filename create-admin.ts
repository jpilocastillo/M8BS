import * as admin from "firebase-admin"

// Initialize Firebase Admin with your service account
const serviceAccount = {
  type: "service_account",
  project_id: "m8bsapp",
  private_key_id: "63d32ad23b5baaf3c30b0d592a95ffb0b9d84839",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDKNBi6nJHF4kEc\nb1jTOn75RC7L754+hwL88er/vvxy/SzBuRzRr6wOAUeuybu4vzfWqeEEbO9xBoKy\npSSAbDUiVvvlfxBqZbDo31NSnv4bM4oZlM0tJtY3y27D24KRpPHfcwCQD6ch1BKa\nGhH5przjkQrkCV22iLknTqDCWGgd37QBo6xHuPMy+tlfmNPdo6RrNTECLa9hw5I2\ndXsgdz6pQMC5o2sbrT3lhv+uDzjK8mnsuXTbYChsHHNglbiIP4tll70xYTWfnZMy\nz5BcG4fmZtQrRUbPMR0uD20Ftbt3JaAun/D/uzMr5VE7dyHA6bGEQ16pCYwkL3ws\ndpDNH2SVAgMBAAECggEAAujS/kRoeI9z3mPfxFJQJ2gKwFZ3UXEB4v/cIMfvu/vW\nnAb82iuL7zune2VdtR/TPtx852Jl45tzX/yuVMa50P+tajT02IMUE5W7DjJJd7y7\nHPkeJqsrY+wicOEEtPHJpSxzcp83CW6SwfLkFVKH30JkBLn5xjmbaGxiNcmt3dgm\nnyG3QCD7qEbaRBU6czwDCTS1k9ZQE6TCGWVzU0QxqlNO5BnPFi8Y6Bc5rfo8tMEK\nStfA2CmAC8oIYBVBiSODULo/0c/5ZqX2WUlUe5pzaTag2WS6zjsNI9ZFLJuJD5lP\noox++a1vPca5rfWFPniFn0vrvcCX3TxVsm6joksu9QKBgQD1D0OO5jqEVYJ/8TF3\n3jrr9iS14tqTARElIbZcZzUWujGsBhxJ3B7tYMQl8S2mYcYibWU6btTibLSaxwlr\np/+ite+ZmGPnypuXsOuEs7S7cFZKFFjOuzoaKwAiwCAa3hxbaK7z46FQCc3mF8Hu\nzv7JfjoZJ1pff7djCLyF5thNVwKBgQDTOwn0KLFButq/QGP0+8ElzVzS7n02c3k3\nBAmUWUmBG5Z81hYlUoJYVx4gzxeuYAMArKcc2zY+3F02xRV/iNJhssLdz+IZRMGk\n1vMKDAzv2A5ZwuGOWYBG6SiIvnggbPTYOL1EMFm0p2TvtFliug63NSAQqGoNeCo0\nFClUNzn98wKBgQCqr5H/oy4Y5DI8CPPKqLfjiBLzuOlCwNh/Q2bwH1aj2NYmGi9z\n5mSINAEK6FxCahGGAyohs/aFKu/0ajOOj3oHi68yDSlw1fbfhfPU/xIgB9OiT1+3\nxkJm3ZJ/oc/6xr97j4NkDiVaSSnnXJ7QRc7C6y9uO7G/mIZT7U7Z+PqpiwKBgQCW\ntS3h5VKrCg1enSt0NFdXiFFtMblmqzbV+Ox4yse19SAGy5ybXmYfb3DQidFkmZ4q\n0gSdgw4OBZ4AINe42b7489ky90pjKvpaiP54saZdTbLXekMCFHuAnIROJE+DGxoK\nV1k6mKC4UyKiH/QSi5tKPf41xGN+XrkF1UizjH+03wKBgQCqL7ohYQbtk45OffPE\nxD67MV+7/x215Nj90qn54qr9W41FeFxb3r0GtVHV9ndiLnavo64G68/Z2rOcwkBU\nkcQVzKbkS+RxgweLRl89NosFlE4ROHu8xw1E81pbBABoUIMODkTTpsLHr866fG1f\nu2NUCH/58wuXNwSItUvdQ7enkg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@m8bsapp.iam.gserviceaccount.com",
  client_id: "103766657197000328591",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40m8bsapp.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
})

// Admin user details - CHANGE THESE!
const ADMIN_EMAIL = "admin@yourdomain.com" // Change this to your email
const ADMIN_PASSWORD = "YourSecurePassword123!" // Change this to a secure password
const ADMIN_NAME = "Admin User" // Change this to your name

async function createAdminUser() {
  try {
    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true,
    })

    console.log("Successfully created user:", userRecord.uid)

    // Set custom claims (admin privileges)
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true })
    console.log("Successfully set admin claim")

    // Add user to Firestore
    const db = admin.firestore()
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log("Successfully added user to Firestore")
    console.log("Admin user creation complete!")
    console.log("Email:", ADMIN_EMAIL)
    console.log("Password:", ADMIN_PASSWORD)
    console.log("You can now log in with these credentials.")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    process.exit()
  }
}

// Run the function
createAdminUser()
