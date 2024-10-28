// Daniel Wu
// C21460524

// Lab 5


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA25TLG_viYRCOxAmobyYckBdoSE6uSDg",
  authDomain: "lab-5-d49e0.firebaseapp.com",
  projectId: "lab-5-d49e0",
  storageBucket: "lab-5-d49e0.appspot.com",
  messagingSenderId: "460519810767",
  appId: "1:460519810767:web:16c3bf207b2708fa13f9ba",
  measurementId: "G-RB0FSXTHB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Function to handle user sign-up
window.signUp = async function() {
  // Get email and password input values from the sign-up form
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;

  // Validate inputs to ensure both email and password are provided
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;  // Stop function if inputs are invalid
  }

  try {
    // Create a new user with email and password in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully:", userCredential.user);
    alert("Sign-up successful! Redirecting to Users Page.");
    window.location.href = "users.html"; 
  } catch (error) {
    // Handle any errors that occur during sign-up
    console.error("Error signing up:", error.code, error.message);
    alert(`Sign-up error: ${error.message}`);
  }
};

// Function to handle user sign-in
window.signIn = async function() {
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  // Validate inputs to ensure both email and password are provided
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;  // Stop function if inputs are invalid
  }

  try {
    // Sign in an existing user with email and password in Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully:", userCredential.user);
    window.location.href = "users.html"; 
  } catch (error) {
    // Handle any errors that occur during sign-in
    console.error("Error signing in:", error.code, error.message);
    alert(`Sign-in error: ${error.message}`);
  }
};

// Function to retrieve and display the list of users from Firestore
async function displayUserList() {
  const userListDiv = document.getElementById("userList");
  userListDiv.innerHTML = ""; // Clear any existing content

  try {
    // Retrieve all documents from the "lab5_collection" collection in Firestore
    const querySnapshot = await getDocs(collection(db, "lab5_collection"));
    if (querySnapshot.empty) {
      // If no users are found, display a message
      userListDiv.innerHTML = "<p>No users found.</p>";
    } else {
      // Loop through each document and display the user name
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        const userDiv = document.createElement("div");
        userDiv.textContent = user.name || "Unnamed User";  // Fallback if 'name' is missing
        userListDiv.appendChild(userDiv);
      });
    }
    console.log("User list displayed successfully.");
  } catch (error) {
    console.error("Error fetching users:", error.code, error.message);
    alert("Error fetching users. Please try again later.");
  }
}

// Function to add a new user to Firestore
window.addUser = async function() {
  const name = document.getElementById("userName").value;

  // Validate input to ensure a name is provided
  if (!name) {
    alert("Please enter a name for the new user.");
    return;  // Stop function if input is invalid
  }

  // Check if a user is authenticated before allowing to add a new user
  if (auth.currentUser) {
    try {
      // Add a new document to the "lab5_collection" collection with the user's name
      await addDoc(collection(db, "lab5_collection"), { name });
      console.log("User added successfully:", name);
      displayUserList(); // Refresh the user list to show the newly added user
    } catch (error) {
      // Handle any errors that occur while adding the user
      console.error("Error adding user:", error.code, error.message);
      alert("Error adding user. Please try again.");
    }
  } else {
    // Prompt user to sign in if they are not authenticated
    alert("Please sign in to add a user.");
  }
};

// Function to handle user sign-out
window.signOutUser = function() {
  signOut(auth).then(() => {
    // Sign out the user and redirect to the sign-in page
    alert("You have been signed out.");
    window.location.href = "signIn.html";
  }).catch((error) => {
    // Handle any errors that occur during sign-out
    console.error("Error signing out:", error.code, error.message);
    alert("Error signing out. Please try again.");
  });
};

// Authentication state change listener to manage access to users page
document.addEventListener("DOMContentLoaded", () => {
  // Listen for authentication state changes (sign-in or sign-out)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If the user is authenticated, show the authenticated content
      console.log("User is authenticated:", user.uid);
      document.getElementById("authContent").style.display = "block";
      document.getElementById("nonAuthContent").style.display = "none";
      displayUserList(); 
    } else {
      // If the user is not authenticated, show the non-authenticated message
      console.log("User is not authenticated.");
      document.getElementById("authContent").style.display = "none";
      document.getElementById("nonAuthContent").style.display = "block";
    }
  });
});
