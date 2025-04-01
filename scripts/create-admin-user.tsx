// scripts/create-admin-user.tsx

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function initializeFirebase() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('Service account file not found at:', serviceAccountPath);
      process.exit(1);
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({ credential: cert(serviceAccount) });
    console.log('✅ Firebase initialized with service account');
  } else {
    initializeApp({ credential: applicationDefault() });
    console.log('✅ Firebase initialized with application default credentials');
  }
}

async function createUserWithRole() {
  const email = await ask('Enter user email: ');
  const password = await ask('Enter temporary password: ');
  const role = await ask('Enter role (admin/user): ');
  rl.close();

  const auth = getAuth();

  try {
    const user = await auth.getUserByEmail(email);
    console.log(`User already exists: ${user.uid}`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      const newUser = await auth.createUser({
        email,
        emailVerified: true,
        password,
        displayName: role === 'admin' ? 'Real Admin' : 'User',
      });
      console.log(`Created new user: ${newUser.uid}`);
    } else {
      throw err;
    }
  }

  const userRecord = await auth.getUserByEmail(email);
  const claims = role === 'admin' ? { admin: true } : { user: true };
  await auth.setCustomUserClaims(userRecord.uid, claims);
  console.log(`User ${email} is now assigned role: ${role}`);
}

initializeFirebase();

createUserWithRole().catch((e) => {
  console.error('Error creating user:', e);
  process.exit(1);
});


