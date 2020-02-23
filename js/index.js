db = firebase.firestore()

function terms() {
    $('#termsModal').modal('toggle')
}


function go() {
    x = localStorage.getItem('destinationurl')
    window.location.replace(x)
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('body').style.display = 'block'
        var urlParams = new URLSearchParams(window.location.search);
        var myParam = urlParams.get('return');
        console.log('Doing auth change stuff');

        x = sessionStorage.getItem('gottoadd')
        console.log(x);

        if (x == false || x == 'false') {
            sessionStorage.removeItem('gottoadd')
            console.log('updating');
            theusername = document.getElementById('user1').value
            console.log('username: ' + theusername);
            db.collection('app').doc('details').update({
                usernames: firebase.firestore.FieldValue.arrayUnion(theusername)
            })
            db.collection('users').doc(user.uid).collection('details').doc('username').set({
                username: document.getElementById('user1').value,
            }).then(function () { })
        }

        else {

        }


        if (myParam == null) {


            $('#successmodal').modal('toggle')
            localStorage.setItem('destinationurl', 'app.html')

        }
        else {
            $('#successmodal').modal('toggle')
            localStorage.setItem('destinationurl', urlParams.get('return'))
        }



        user = firebase.auth().currentUser
    } else {
        document.getElementById('body').style.display = 'block'
    }
});

function signinemail() {
    email = document.getElementById('email2').value
    password = document.getElementById('pass2').value

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        document.getElementById('erorrModalMsg').innerHTML = errorMessage
        $('#errorModal').modal('toggle')
        // ...
    });
}

function signupemail() {
    email = document.getElementById('email1').value
    pass = document.getElementById('pass1').value
    user = document.getElementById('user1').value

    if (email == '' || pass == '' || user == '') {
        error('You must fill all fields.')
    }
    else {
        if (hasWhiteSpace(email) || hasWhiteSpace(pass) || hasWhiteSpace(user)) {
            error('You can not use whitespace in these fields.')
        }
        else {


            db.collection('app').doc('details').get().then(function (doc) {
                usernames = doc.data().usernames
            }).then(function () {

                for (let i = 0; i < usernames.length; i++) {
                    if (usernames[i] == user) {
                        console.log(usernames[i]);
                        sessionStorage.setItem('continue', 'false')
                        console.log(sessionStorage.getItem('continue'));
                    }

                }

                if (sessionStorage.getItem('continue') == 'false') {
                    error('This username is taken.')
                }

                else {
                    sessionStorage.setItem('gottoadd', false)
                    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
                        var errorMessage = error.message;
                        document.getElementById('erorrModalMsg').innerHTML = errorMessage
                        $('#errorModal').modal('toggle')

                        // ...
                    });

                }

            })




        }

    }

}
function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function signupshow() {
    document.getElementById('signinpanel').style.display = 'none'
    document.getElementById('signuppanel').style.display = 'inline-block'

    document.getElementById('btnsstuff').innerHTML = '<p>If you have an account:</p><button onclick="signinshow()" class="waves btn-eon-one">Sign in</button>'
}

function signinshow() {
    document.getElementById('signinpanel').style.display = 'inline-block'
    document.getElementById('signuppanel').style.display = 'none'

    document.getElementById('btnsstuff').innerHTML = "<p>If you don't have an account:</p><button onclick='signupshow()' class='waves btn-eon-one'>Sign Up</button>"
}