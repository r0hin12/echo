window.presearch = true
window.usersearch = []

// OOOOHGOD THEY DONT HAVE BASIC USER STUFF SETUP
function checkfirsttime() {
    if (user.displayName == null) {
        document.getElementById('doprofile').style.display = 'block'
    }
    if (!user.emailVerified) {
        document.getElementById('doemail').style.display = 'block'
        document.getElementById('doprofile').style.display = 'none'
    }
}


function verifyemail() {
    user.sendEmailVerification().then(function() {
        document.getElementById('verifybutton').remove()
        document.getElementById('status').style.display = 'block'
        document.getElementById('verifyresponse').innerHTML = "We've sent " + user.email + " an email containing a verification link. <b>After verifying</b>, click the button below."
    }).catch(function(error) {
        document.getElementById('verifyresponse').innerHTML = error
    });
}

function checkverification() {
        document.getElementById('verifyresponse').innerHTML = 'Checking...'
        window.setTimeout(function() {
            window.location.reload()
        }, 1000)
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
                db.collection('users').doc(user.uid).update({
                    username: username,
                    name: displayname
                })
                user.updateProfile({
                    displayName: displayname,
                })

                // THIS PART MADE SENSE BEFORE - I HAVE NO IDEA WHAT IT DOES BUT ITS PROBABLY IMPORTANT
                // - rohin

                db.collection('users').doc(user.uid).get().then(function (doc) {
                    if (doc.data().type == undefined) {
                        db.collection('users').doc(user.uid).update({
                            type: 'public'
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

function signout() {
    Snackbar.show({ text: 'Signing out...' })
    window.setTimeout(function () {
        firebase.auth().signOut()
    }, 2000)
}

function addappcontent() {
    db.collection('users').doc(user.uid).get().then(function(doc) {

        document.getElementsByClassName('main-avatar')[0].src = doc.data().url
        document.getElementsByClassName('main-avatar')[0].style.display = 'block'

        document.getElementById('sidebarname').innerHTML = user.displayName + '<br><span class="badge badge-dark userbadge">@' + doc.data().username + '</span>'

        // REPUTATION

        repfirebasedate = doc.data().repcheck.toDate()
        repcurrentdate = new Date()

        var diffMinutes = parseInt((repcurrentdate - repfirebasedate) / (1000 * 60), 10); 
        if (diffMinutes > 15) {
            // Calculate Rep & Upload

            rep = 0
            db.collection('posts').doc('posts').get().then(function (postdoc) {
                for (let i = 0; i < postdoc.data().latest + 1; i++) {
                    if (postdoc.data()[i] == undefined) { } else {
                        if (postdoc.data()[i].data.uid == user.uid) {
                            rep = rep + postdoc.data()[i].data.likes.length
                        }
                    }
                }

                    number = doc.data().followers.length
                    rep = rep + number    
                    db.collection('users').doc(user.uid).update({
                        rep: rep,
                        repcheck: firebase.firestore.FieldValue.serverTimestamp(),
                    }).then(function() {
                        document.getElementById('rep1').innerHTML = doc.data().rep
                    })    
            })
        }  
        else {
            // USE OLD REP
            document.getElementById('rep1').innerHTML = doc.data().rep
        }


        document.getElementById('following1').innerHTML = '~' + nFormatter(doc.data().following, 1)
        document.getElementById('followers1').innerHTML = '~' + nFormatter(doc.data().followers, 1)


    })
}

function nFormatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

    