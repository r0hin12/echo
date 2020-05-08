db = firebase.firestore()

function terms() {
    $('#termsModal').modal('toggle')
}


function go() {
    x = localStorage.getItem('destinationurl')
    transfer(x)
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('body').style.display = 'block'
        var urlParams = new URLSearchParams(window.location.search);
        var myParam = urlParams.get('return');
        console.log('Doing auth change stuff');

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
sessionStorage.setItem('continue', 'true')
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
            sessionStorage.setItem('gottoadd', false)
            firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
                var errorMessage = error.message;
                document.getElementById('erorrModalMsg').innerHTML = errorMessage
                $('#errorModal').modal('toggle')
                });


        }

        }

}
function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function signupshow() {
    document.getElementById('signinpanel').style.display = 'none'
    document.getElementById('signuppanel').style.display = 'inline-block'

    document.getElementById('btnsstuff').innerHTML = '<p>If you have an account:</p><button onclick="signinshow()" class="eon-outlined">Sign in</button>'
    addWaves()
}

function signinshow() {
    document.getElementById('signinpanel').style.display = 'inline-block'
    document.getElementById('signuppanel').style.display = 'none'

    document.getElementById('btnsstuff').innerHTML = "<p>If you don't have an account:</p><button onclick='signupshow()' class='eon-outlined'>Sign Up</button>"
    addWaves()
}