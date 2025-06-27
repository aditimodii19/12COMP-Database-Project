//**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by <Your Name Here>, Term 2 202?
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************** **********************************/
const COL_C = 'white';      // These two const are part of the coloured    
const COL_B = '#CD7F32';    //  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

var FB_GAMEDB;
var FB_GAMEAUTH;

let userDetails = {
    displayName: 'n/a',
    email: 'n/a',
    photoURL: 'n/a',
    uid: 'n/a',
    age: 'n/a',
    sex: 'n/a'
};

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getDatabase, ref, set, get, update,  query, orderByChild, limitToFirst }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/*************************4*************************************/
export {
    fb_initialise, fb_authenticate, fb_detectLogin, fb_logout,
    fb_writerecord, fb_readrecord, fb_writeScore, fb_sortedread, userDetails };

/******************************************************/
// fb_initialise()
// Called by html initialise button
// Input:  n/a
// Return: n/a
/******************************************************/
function fb_initialise() {
    console.log('%c fb_initialise(): ',
                 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                 
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyAwVeMoQsZQAV-ewzSIqnfSmaQrSOBQlYY",
        authDomain: "comp-2025-aditi-modi.firebaseapp.com",
        databaseURL: "https://comp-2025-aditi-modi-default-rtdb.firebaseio.com",
        projectId: "comp-2025-aditi-modi",
        storageBucket: "comp-2025-aditi-modi.firebasestorage.app",
        messagingSenderId: "500209550082",
        appId: "1:500209550082:web:379bf3e85535587bc1f81b",
        measurementId: "G-4BV1W7JPCK"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    FB_GAMEDB = getDatabase(FB_GAMEAPP);
    FB_GAMEAUTH = getAuth(FB_GAMEAPP);
   
    console.info(FB_GAMEDB);        //DIAG
}

/******************************************************/
// fb_login()
// Called by html authenticate button
// Login to Firebase via Google authentication
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_authenticate() {
    console.log('%c fb_authenticate(): ',
       'color: ' + COL_C + '; background-color: ' + COL_B + ';');
     
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();

    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });

    signInWithPopup(AUTH, PROVIDER)
    .then((result) => {
        // Code for a successful authentication

        userDetails.displayName = result.user.displayName;
        userDetails.email = result.user.email;
        userDetails.photoURL = result.user.photoURL;
        userDetails.uid = result.user.uid;
        console.log(userDetails); //DIAG

         //sessionStorage.setItem (store session data)
        sessionStorage.setItem('displayName', userDetails.displayName );
        sessionStorage.setItem('email',  userDetails.email );
        sessionStorage.setItem('photoURL', userDetails.photoURL );
        sessionStorage.setItem('uid', userDetails.uid );

         //fb_writerecord();

        const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
        get(dbReference)
        .then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                console.log(fb_data);
                // Successful read for USERDETAILS

/******************************************************/
// READ ADMIN (registered user, now check for admin)
    const admindbReference = ref(FB_GAMEDB, 'admin/' + userDetails.uid);
    get(admindbReference)
    .then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
        console.log(fb_data);

            // Successful read for ADMIN
        sessionStorage.setItem('admin', 'y');
        window.location.href = "select_game.html";
            }
            else {
            // Successful read but no REC found for ADMIN
            sessionStorage.setItem('admin', 'n');
            window.location.href = 'select_game.html';
                }
        })
        .catch((error) => {
       alert("Look at the console for an error message");
       //read error for admin
        console.error(error);
     });

    /******************************************************/
        }
        else {
            // Successful read but then NO rec found for USERDETAILS
            window.location.href = 'reg.html';
        }
    })

        .catch((error) => {
            alert("Look at the console for an error message");
            // Read error for USERDETAILS
             console.error(error);
        });
    })
}

/******************************************************/
// fb_detectLogin()
// Called by html DETECT LOGIN change button
// Detect changes to user authentication
// Input:  n/a
// Return: n/a
/******************************************************/
function fb_detectLogin() {
    console.log('%c fb_detectLogin(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    let fb_loginStatus = 'n/a';

    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
    if (user) {
    // Code for user logged in goes here
    console.log('%c fb_detectLogin(): logged IN',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    } else {

    // Code for user logged out goes here
    console.log('%c fb_detectLogin(): logged OUT',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    }
    console.log('%c fb_detectLogin(): ' + fb_userLogin,
                'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    },

    (error) => {
    alert("Look at the console for an error message");
    // Code for an onAuthStateChanged error goes here
    console.error(error);
    });
}

/******************************************************/
// fb_logout()
// Called by html logout button
// Logout of firebase
// Input:  n/a
// Return: n/a
/******************************************************/
function fb_logout() {
    console.log('%c fb_logout(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    signOut(AUTH)
    .then(() => {

    // Code for a successful logout
    console.log('%c fb_logout(): logout successful', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    })
    .catch((error) => {
    alert("Look at the console for an error message");
    // Code for a logout error
    console.error(error);
    });
 }

/******************************************************/
// fb_writerecord()
// Called by html write record
// Write a specific record to the DB
// Input:  path and key to write to and the data to write
// Return: n/a
/******************************************************/
function fb_writerecord(userDetails) {
    console.log('%c fb_writerecord(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
    set(dbReference, userDetails).then(() => {
         // Code for a successful write rec
        console.log('%c fb_writerecord(): successful! ',
            'color: ' + COL_C + '; background-color: ' + COL_B + ';');

        window.location.href = 'select_game.html';
    }).catch((error) => {
        alert("Look at the console for an error message");
         // Code for a write record error
        console.error(error);
    });
}

/******************************************************/
// fb_writeScore()
// Called by html write record
// Save a score to the database under scores/fruitCatcher
// Input:  record (with uid + score)
// Return: n/a
/******************************************************/
function fb_writeScore(scoreRecord) {
    console.log('%c fb_writeScore(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

     const dbReference = ref(FB_GAMEDB, 'scores/fc/' + scoreRecord.uid);
    set(dbReference, scoreRecord).then(() => {
        console.log('%c fb_writeScore(): score saved! ',
            'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    })
    .catch((error) => {
    alert("Look at the console for an error message");
        // Code for a write score error
        console.error(error);
    });
}

/******************************************************/
// fb_readrecord()
// Called by html read record button
// Read a specific DB record
// Input:  path and key of rec to read
// Return: n/a
/******************************************************/
function fb_readrecord() {
    console.log('%c fb_readrecord(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference= ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
        console.log(fb_data);

        // Code for a successful read goes here
        console.log('%c fb_readrecord(): successful!',
            'color: ' + COL_C + '; background-color: ' + COL_B + ';');

        } else {
            //Code for no record found goes here
            console.log('no record found');
        }
    }).catch((error) => {
    alert("Look at the console for an error message");
        // Code for a read error goes here
        console.error(error);
    });
}

/******************************************************/
// fb_sortedread()
// Called by leaderboard.mjs to get scores in order
// It does a sorted read-all from firebase and stores it into the dataArray
// Input:  n/a
// Return: n/a
/******************************************************/
function fb_sortedread() {
    console.log('%c fb_sortedread(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const scoresArray = [];

    // query for displaying top 5 scores
    const dbReference = query(ref(FB_GAMEDB, "scores/fc"), orderByChild("score"), limitToFirst(5));

    get(dbReference)
    .then((snapshot) => {
        if (snapshot.val() != null) {
            // successful read and there ARE records
            snapshot.forEach(function(childSnapshot) {
                let childData = childSnapshot.val();
                scoresArray.push(childData);
            });

            // Successful read for sorted read
            console.log('%c fb_sortedread(): successful!', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

            // To log the scores array
            scoresArray.reverse();
            console.log('Scores:', scoresArray);

            // LOOP CONTROL LOGIC
            let loopControl;
            if (5 < scoresArray.length) {
                loopControl = 5;
            } else {
                loopControl = scoresArray.length;
            }

            const leaderboardBody = document.getElementById("leaderboard"); // the tbody ID from my lb HTML
            leaderboardBody.innerHTML = ""; // Clear old rows

            for (let i = 0; i < loopControl; i++) {
                leaderboardBody.innerHTML += `
                    <tr>
                        <td>${scoresArray[i].displayName}</td>
                        <td>${scoresArray[i].score}</td>
                    </tr>
                  `;
            }

        } else {
            // Successful read BUT no records found
            console.log('no record found');
        }
    })
    .catch((error) => {
        alert("Look at the console for an error message");
        // Code for a sorted read error 
        console.error(error);
    });
}

/*******************************************************/
// END OF APP
/*******************************************************/




