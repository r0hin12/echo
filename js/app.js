// OOOOHGOD THEY DONT HAVE BASIC USER STUFF SETUP
function checkfirsttime() {
    if (user.displayName == null) {
        document.getElementById('doprofile').style.display = 'block'
    }
}


function profilesetup1() {
    username = document.getElementById('usernamefield').value
    taken = false

    if (hasWhiteSpace(username) || username == "") {
        document.getElementById('usernametaken').style.display = 'inline-block'
        document.getElementById('usernametaken').innerHTML = 'Your username contains whitespace.'
    }
    else {

        db.collection('app').doc('details').get().then(function (doc) {
            for (let i = 0; i < doc.data().usernames.length; i++) {
                if (username == doc.data().usernames[i]) {
                    taken = true
                }
            }
            if (taken) {
                document.getElementById('usernametaken').style.display = 'inline-block'
                document.getElementById('usernametaken').innerHTML = 'This username already taken.'
            }
            else {
                document.getElementById('profilesetup1').classList.remove('fadeIn')
                document.getElementById('profilesetup1').classList.add('fadeOut')
                document.getElementById('profilesetup2').style.display = 'block'
            }
        })
    }

}

function profilesetup2() {

    username = document.getElementById('usernamefield').value
    displayname = document.getElementById('namefield').value
    taken = false

    if (hasWhiteSpace(username) || username == "") {
        document.getElementById('usernametaken').style.display = 'inline-block'
        document.getElementById('usernametaken').innerHTML = 'Your username contains whitespace.'
    }
    else {

        db.collection('app').doc('details').get().then(function (doc) {
            for (let i = 0; i < doc.data().usernames.length; i++) {
                if (username == doc.data().usernames[i]) {
                    taken = true
                }
            }
            if (taken) {
                window.location.reload()
            }
            else {


                db.collection('app').doc('details').update({
                    usernames: firebase.firestore.FieldValue.arrayUnion(username)
                })
                db.collection('users').doc(user.uid).set({
                    username: username,
                    name: displayname
                })
                user.updateProfile({
                    displayName: displayname,
                })

                // THIS PART MADE SENSE BEFORE - I HAVE NO IDEA WHAT IT DOES BUT ITS PROBABLY IMPORTANT
                // - rohin
                db.collection('users').doc(user.uid).collection("follow").doc('following').get().then(function (doc) {
                    if (doc.exists) { } else {
                        db.collection('users').doc(user.uid).collection('follow').doc('following').set({
                            following: []
                        })
                    }
                })

                db.collection('users').doc(user.uid).collection("follow").doc('followers').get().then(function (doc) {
                    if (doc.exists) { } else {
                        db.collection('users').doc(user.uid).collection('follow').doc('followers').set({
                            followers: []
                        })
                    }
                })

                db.collection('users').doc(user.uid).get().then(function (doc) {
                    if (doc.data().type !== undefined) {
                        if (doc.data().type == 'private') {

                            db.collection('users').doc(user.uid).collection('follow').doc('requested').get().then(function (doc) {
                                if (doc.exists) {

                                }
                                else {
                                    db.collection('users').doc(user.uid).collection('follow').doc('requested').set({
                                        requested: []
                                    })
                                }
                            })


                        }
                    } else {
                        db.collection('users').doc(user.uid).update({
                            type: 'public'
                        })
                    }
                })

                db.collection('users').doc(user.uid).collection('details').doc('follow').collection('requested').doc('requested').get().then(function (doc) {
                    if (doc.exists) {

                    }
                    else {
                        db.collection('users').doc(user.uid).collection('follow').doc('requested').set({
                            requested: []
                        })
                    }
                })



            }
        })
    }
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

