import { ServiceAccount } from 'firebase-admin';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import serviceAccountKey from '../../service-account.json';

initializeApp({
  credential: cert(serviceAccountKey as ServiceAccount),
});

export const auth = getAuth();
