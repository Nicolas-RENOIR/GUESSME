import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvrBJzYXwk4xoSpG9pujYTZoHPg7I2Qj0",
    authDomain: "guessme-9161b.firebaseapp.com",
    projectId: "guessme-9161b",
    storageBucket: "guessme-9161b.appspot.com",
    messagingSenderId: "88261236886",
    appId: "1:88261236886:web:62fbb6c59c8a5256a24ab7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadChallenge() {  // Export the function
    try {
        const today = new Date().toISOString().split('T')[0];
        const docRef = doc(db, "challenges", today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const challenge = docSnap.data();
            document.getElementById('emoji-display').textContent = challenge.emoji;
            document.getElementById('guess-input').dataset.correctAnswer = challenge.answer.toLowerCase();
        } else {
            document.getElementById('emoji-display').textContent = "Pas de défi disponible pour aujourd'hui.";
            document.getElementById('guess-input').disabled = true;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des défis :', error);
    }
}