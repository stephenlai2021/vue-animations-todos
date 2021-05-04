import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBm9VXXj0pjKwkWrr4lJqsGrpBHkLUdRho",
  authDomain: "udemy-course-nextjs.firebaseapp.com",
  databaseURL: "https://udemy-course-nextjs-default-rtdb.firebaseio.com",
  projectId: "udemy-course-nextjs"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export  { db, timestamp }