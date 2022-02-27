import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { 
    collection, 
    onSnapshot,
    connectFirestoreEmulator, 
    getFirestore 
} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyDyAttj0ATTf6PSpykdQ7XaIl3Tk-I9ms0",
    authDomain: "skewax.firebaseapp.com",
    projectId: "skewax",
    storageBucket: "skewax.appspot.com",
    messagingSenderId: "147280415738",
    appId: "1:147280415738:web:ccd9746137d31b0728f243",
    measurementId: "G-Z2SJCM1Z3W"
}  

const app = initializeApp(firebaseConfig);

// auth

export const auth = getAuth(app)
// connectAuthEmulator(auth, "http://localhost:9099");

// cloud functions

// firestore

const db = getFirestore()

// connectFirestoreEmulator(db, "localhost", 8081)

export async function snapshotFiles(callback) {
    const filesCollection = collection(db, `files/${auth.currentUser.uid}/files`)
    const unsubscribe = onSnapshot(filesCollection, (querySnapshot) => {
        let files = []
        querySnapshot.forEach((doc) => {
            files.push({
                name: doc.data().name,
                text: doc.data().text,
                ref: doc.ref
            })
        })
        callback(files)
    })
}