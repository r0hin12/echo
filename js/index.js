db = firebase.firestore()

function terms() {
    $('#termsModal').modal('toggle')
}


function go() {
    sessionStorage.removeItem('gottoadd')
    x = localStorage.getItem('destinationurl')

    if (x == null || x == undefined) {
        transfer('app.html')
    }
    else {
        transfer(x)
    }

    
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {


        db.collection("users").doc(user.uid).get().then(function (doc) {

            if (user.displayName == null) {
                document.getElementById('pfp').innerHTML = '<img alt="..." style="object-fit: cover; height: 32px; width: 32px;" class="chip-img" src="' + doc.data().url + '">' + user.email
            }
            else {
                document.getElementById('pfp').innerHTML = '<img alt="..." style="object-fit: cover; height: 32px; width: 32px;" class="chip-img" src="' + doc.data().url + '">' + user.displayName
            }

            
            document.getElementById('pfp').style.display = 'inline-block'
            document.getElementById('zoomBtn').style.display = 'block'
        })


        document.getElementById('body').style.display = 'block'
        var urlParams = new URLSearchParams(window.location.search);
        var myParam = urlParams.get('return');
        console.log('Doing auth change stuff');

        x = sessionStorage.getItem('emptything')

        if (x == 'false') {
            go()
        }

        else {

            db.collection("users").doc(user.uid).set({
                uid: user.uid,
                type: 'public',
                filename: 'example',
                created: firebase.firestore.FieldValue.serverTimestamp(),
                repcheck: firebase.firestore.FieldValue.serverTimestamp(),
                following: [],
                followers: [],
                filetype: 'png',
                url: 'https://firebasestorage.googleapis.com/v0/b/eongram-87169.appspot.com/o/logos%2Fexample.png?alt=media&token=2f3c4769-b40e-4f76-a9ec-f43d934353a6',
                rep: 0,
            })

        }


        if (myParam == null) {


            window.setTimeout(function() {
                $('#successmodal').modal('toggle')
            }, 1000)
            localStorage.setItem('destinationurl', 'app.html')

        }
        else {
            window.setTimeout(function() {
                $('#successmodal').modal('toggle')
            }, 1000)
        
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
    sessionStorage.setItem('emptything', "false")
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
    email = document.getElementById('email2').value
    pass = document.getElementById('pass2').value
    //user = document.getElementById('user1').value

    if (email == '' || pass == '') {
        error('You must fill all fields.')
    }
    else {
        if (hasWhiteSpace(email) || hasWhiteSpace(pass)) {
            error('You can not use whitespace in these fields.')
        }
        else {

            sessionStorage.setItem('emptything', "true")
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

    document.getElementById('btnsstuff').innerHTML = '<p>Already have an account?</p><button onclick="signinshow()" class="eon-outlined">Sign in</button>'
    addWaves()
}

function signinshow() {
    document.getElementById('signinpanel').style.display = 'inline-block'
    document.getElementById('signuppanel').style.display = 'none'

    document.getElementById('btnsstuff').innerHTML = "<p>Don't have an account?</p><button onclick='signupshow()' class='eon-outlined'>Sign Up</button>"
    addWaves()
}

var input = document.getElementById("pass2");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    signinemail()
  }
});