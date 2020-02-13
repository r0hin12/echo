db = firebase.firestore()


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        refresh()

    } else {
        window.location.replace('index.html?return=' + window.location.href)
    }
});

function refresh() {
    getrep()
    refreshmain()
    pfp()

    verified()

}

function refreshmain() {

    user = firebase.auth().currentUser

    if (user.displayName == null) {
        document.getElementById('doprofile').style.zIndex = '2000'
        document.getElementById('doprofile').style.display = 'block'
        document.getElementById('doprofile').classList.add('fadeIn')
        document.getElementById('cover').classList.add('fadeOut')
    }

    document.getElementById('nameel').innerHTML = user.displayName

    db.collection('users').doc(user.uid).collection('details').doc('username').get().then(function (doc) {
        document.getElementById('userel').innerHTML = doc.data().username
    })


}

function finishprofile() {
    var user = firebase.auth().currentUser;
    var newdisplay = document.getElementById('fullnameinput').value
    user.updateProfile({
        displayName: newdisplay,
    }).then(function () {
        window.location.reload()
    })
}

function signout() {
    firebase.auth().signOut()
}

function newpost() {
    var caption = document.getElementById('captioninput').value
    var storageRef = firebase.storage().ref();
    var file = document.getElementById('imgInp').files[0]
    var fileRef = storageRef.child('users/' + user.uid + '/' + file.name);
    fileRef.put(file).then(function (snapshot) {
        db.collection('posts').add({
            caption: caption,
            likes: ['first'],
            file: file.name,
            name: user.displayName,
            uid: user.uid,
            created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
            snackbar('Post successfully uploaded.', '', '', '2000')
        })
    });



}

function pfp() {

    db.collection('users').doc(user.uid).collection('details').doc('pfp').get().then(function (doc) {
        if (doc.exists) {

            var storage = firebase.storage();
            var storageRef = storage.ref('logos');
            storageRef.child(doc.data().name + '.' + doc.data().extension).getDownloadURL().then(function (url) {
                document.getElementById('pfp1').src = url
                document.getElementById('loading').classList.add('fadeOut')
                window.setTimeout(() => {
                    document.getElementById('loading').remove()
                }, 700);
            })
        }
        else {
            console.log('Setting to defaul pfp');
            db.collection('users').doc(user.uid).collection('details').doc('pfp').set({
                name: "example",
                extension: "png",
                uid: user.uid
            }).then(function () {

                var storage = firebase.storage();
                var storageref = storage.ref();

                db.collection('users').doc(user.uid).collection('details').doc('pfp').get().then(function (doc) {
                    storageref.child('logos/' + doc.data().name + '.' + doc.data().extension).getDownloadURL().then(function (url) {


                        db.collection('users').doc(user.uid).collection('details').doc('pfp').update({
                            url: url
                        })

                    })
                })
                pfp()
            })
        }
    })

}
function getrep() {

}

function tab(tab) {

    switch (tab) {
        case 'feed':

            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('feed-tab').classList.add('navthing')
            document.getElementById('feed-tab').classList.remove('nopurple')

            break;
        case 'explore':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('explore-tab').classList.add('navthing')
            document.getElementById('explore-tab').classList.remove('nopurple')
            break;
        case 'direct':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('direct-tab').classList.add('navthing')
            document.getElementById('direct-tab').classList.remove('nopurple')
            break;
        case 'public':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('public-tab').classList.add('navthing')
            document.getElementById('public-tab').classList.remove('nopurple')
            break;
        case 'leaderboard':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('leaderboard-tab').classList.add('navthing')
            document.getElementById('leaderboard-tab').classList.remove('nopurple')
            break;
        case 'account':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('account-tab').classList.add('navthing')
            document.getElementById('account-tab').classList.remove('nopurple')
            break;

        default:
            error('Something went wrong. Try reloading the page.')
            break;
    }


}


function verified() {
    if (user.emailVerified) {

    }
    else {
        document.getElementById('doemail').style.zIndex = '2000'
        document.getElementById('doemail').style.display = 'block'
        document.getElementById('doemail').classList.add('fadeIn')
        document.getElementById('cover').classList.add('fadeOut')

    }
}

function sendverify() {

    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function () {
        document.getElementById('sendemailbtn').onclick = function () {
            window.location.reload()
        }
        document.getElementById('sendemailbtn').innerHTML = "Confirm Verification"
        $('#emailtext').html('Check your inbox! We have sent you a email confirmation ')
    }).catch(function (error) {
        alert('An error occured. Click OK to reload')
        window.location.reload()
    });
}