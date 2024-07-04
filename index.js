import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import {  get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBGhD0b0IhLlDFFwxnEu8iIBsGMrMNs9c4",
    authDomain: "task-assigner-f48a4.firebaseapp.com",
    projectId: "task-assigner-f48a4",
    storageBucket: "task-assigner-f48a4.appspot.com",
    messagingSenderId: "244423551784",
    appId: "1:244423551784:web:59647aa951639e8d72be1d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');

    registerButton.addEventListener('click', register);
    loginButton.addEventListener('click', login);
});


function register() {
    console.log("Register button clicked");
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const user_type = document.getElementById('user_type').value;

    console.log("Full name:", full_name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("User type:", user_type);

    if (!validate_email(email) || !validate_password(password) || !validate_field(full_name)) {
        alert("Please enter all fields!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(function (userCredential) {
            console.log("User registered successfully");
            const user = userCredential.user;
            const database_ref = ref(database, 'users/' + user.uid);
            const userdata = {
                email: email,
                full_name: full_name,
                user_type: user_type,
                last_login: Date.now()
            };
            set(database_ref, userdata)
                .then(() => {
                    alert('User Created!');
                })
                .catch(error => {
                    console.error("Error saving user data:", error);
                });
        })
        .catch(function (error) {
            console.error("Error registering user:", error);
            alert(error.message);
        });
}

async function login() {
    console.log("Login button clicked");
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    console.log("Email:", email);
    console.log("Password:", password);
  
    if (!validate_email(email) || !validate_password(password)) {
      alert("Please enter all fields!");
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then(function (userCredential) {
        console.log("User logged in successfully");
        const user = userCredential.user;
        const databaseRef = ref(database, 'users/' + user.uid);
   
        get(databaseRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const userType = userData.user_type;
              console.log("Retrieved user data:", userData);
              console.log("User type:", userType);
  
              if (userType === 'admin') {
                window.location.href = 'admin.html';
              } else {
                window.location.href = 'user.html';
              }
            } else {
              console.error("User data not found");
              alert("Error: User data not found!");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            alert("Error: Could not retrieve user data!");
          });
      })
      .catch(function (error) {
        console.error("Error logging in user:", error);
        alert(error.message);
      });
  }

function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validate_password(password) {
    return password.length >= 6;
}

function validate_field(field) {
    return field != null && field.length > 0;
}
