// scripts/create-admin-user.tsx

import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import readline from 'readline';

initializeApp({
  credential: applicationDefault(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
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

createUserWithRole().catch((e) => {
  console.error('Error creating user:', e);
  process.exit(1);
});


