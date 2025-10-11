import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const auth = getAuth();
    const db = getFirestore();
    const profileImg = document.getElementById('profileImg');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const toolbar = document.getElementById('toolbar');

    onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Use the email from the Firebase Auth user
        const email = user.email; // this comes from Auth
        const username = email.split('@')[0]; // just the part before @
        usernameDisplay.textContent = username;

        try {
            const userDoc = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const profileId = data.profileImage || "PPB0";
                profileImg.src = `profiles/${profileId}.png`;
            } else {
                profileImg.src = "profiles/PPB0.png";
            }
        } catch (err) {
            console.error("Error fetching Firestore document:", err);
            profileImg.src = "profiles/PPB0.png";
        }
    } else {
        window.location.href = "login.html";
    }
});


    // Start quiz button
    startQuizBtn.addEventListener('click', () => {
        window.location.href = "quiz.html";
    });

    // Toolbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 5) toolbar.classList.add('scrolled');
        else toolbar.classList.remove('scrolled');
    });

});
