import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA5mDQx2A20wPRyPk-M3sBOyGFHqaGq8hI',
  authDomain: 'bet-mali.firebaseapp.com',
  databaseURL: 'https://bet-mali-default-rtdb.firebaseio.com',
  projectId: 'bet-mali',
  storageBucket: 'bet-mali.firebasestorage.app',
  messagingSenderId: '752891870014',
  appId: '1:752891870014:web:c4c7236bddadd8e1150a6f',
  measurementId: 'G-LJEY3Y799M',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
