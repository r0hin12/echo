firebase.initializeApp({
    apiKey: "AIzaSyDyiJGiWlgFaMtJA2lerw4lUkGK76Qoxvs",
    authDomain: "eongram-87169.firebaseapp.com",
    databaseURL: "https://eongram-87169.firebaseio.com",
    projectId: "eongram-87169",
    storageBucket: "eongram-87169.appspot.com",
    messagingSenderId: "725793838303",
    appId: "1:725793838303:web:f23c748b3985225c5c056a"
});

db = firebase.firestore()
storage = firebase.storage();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        window.user = firebase.auth().currentUser
        console.log("User is signed in: " + user.displayName);
        checkfirsttime()

    } else {
        transferdark('index.html')

    }
});

