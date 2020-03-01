db = firebase.firestore()

var urlParams = new URLSearchParams(window.location.search);
var post = urlParams.get('tab');
if (post == null || post == "") { } else {
    try {
        document.getElementById(post + '-tab').click()
    } catch (error) {

    }
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var user = firebase.auth().currentUser;
        refresh()

    } else {
        transfer('index.html?return=' + window.location.href)
    }
});

function refresh() {
    refreshmain()
    pfp()
    load()
    checkuserurl()
    prenotif()
    verified()

}

function refreshmain() {

    user = firebase.auth().currentUser

    if (user.displayName == null) {
        document.getElementById('doprofile').style.zIndex = '2000'
        document.getElementById('doprofile').style.display = 'block'
        document.getElementById('doprofile').classList.add('fadeIn')
        document.getElementById('cover').classList.add('fadeOut')
        setTimeout(function () {
            $('body').addClass('loaded');
        }, 400);
    }
    else {
        db.collection('users').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                db.collection('users').doc(user.uid).update({
                    name: user.displayName,
                    uid: user.uid
                })
            }
            else {
                db.collection('users').doc(user.uid).set({
                    name: user.displayName,
                    uid: user.uid
                })
                    .then(function () {
                        window.location.reload()
                    })


            }
        })
        document.getElementById('nameel').innerHTML = user.displayName
        rep = 0
        db.collection('posts').doc('posts').get().then(function (doc) {
            for (let i = 0; i < doc.data().latest + 1; i++) {
                if (doc.data()[i] == undefined) { } else {
                    if (doc.data()[i].data.uid == user.uid) {
                        rep = rep + doc.data()[i].data.likes.length
                    }
                }
            }

            db.collection('users').doc(user.uid).collection('follow').doc('followers').get().then(function (doc) {
                number = doc.data().followers.length

                rep = rep + number


                document.getElementById('ownrepcount').innerText = rep
                db.collection('users').doc(user.uid).update({
                    rep: rep
                })


            })

        })


        db.collection('users').doc(user.uid).collection('follow').doc('following').get().then(function (doc) {
            document.getElementById('ownfollowingcount').innerHTML = doc.data().following.length
        })
        db.collection('users').doc(user.uid).collection('follow').doc('followers').get().then(function (doc) {
            document.getElementById('ownfollowerscount').innerHTML = doc.data().followers.length
        })


        db.collection('users').doc(user.uid).get().then(function (doc) {
            document.getElementById('userel').innerHTML = '@' + doc.data().username
        })

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
    if (caption == '' || caption == " " || caption == null) {
        snackbar('Post was not uploaded. Try again later.', '', '', '3000')
    }
    else {
        if (document.getElementById('captioninput').value.length > 50) {
            error('Too many characters in your caption. The limit is 50.')
            $('#postModal').modal('toggle')
        }
        else {



            document.getElementById('captioninput').value = ''
            var storageRef = firebase.storage().ref();
            var file = document.getElementById('imgInp').files[0]
            filenoext = file.name.replace(/\.[^/.]+$/, "")
            ext = file.name.split('.').pop();
            valuedate = new Date().valueOf()
            filename = filenoext + valuedate + '.' + ext
            var fileRef = storageRef.child('users/' + user.uid + '/' + filename);


            db.collection('posts').doc('posts').get().then(function (doc) {
                num = doc.data().latest
                newnum = num + 1

                fileRef.put(file).then(function (snapshot) {
                    db.collection('posts').doc('posts').update({
                        [newnum]: {
                            name: newnum,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            data: {
                                caption: caption,
                                likes: ['first'],
                                file: filename,
                                name: user.displayName,
                                type: document.getElementById('privateinp').checked,
                                uid: user.uid,
                            }
                        },
                        latest: newnum
                    }).then(function () {
                        db.collection('posts').doc('comments').update({
                            [newnum]: [],
                            latest: newnum
                        }).then(function () {
                            snackbar('Post successfully uploaded.', '', '', '4000')
                            document.getElementById('captionel').style.display = 'none'
                            document.getElementById('blah').style.display = 'none'
                            document.getElementById('captionel').style.display = 'none'

                        })
                    })
                })
            })
        }
    }
}


function pfp() {

    db.collection('users').doc(user.uid).get().then(function (doc) {
        if (doc.data().url !== undefined) {

            var storage = firebase.storage();
            document.getElementById('pfp1').src = doc.data().url
            setTimeout(function () {
                $('body').addClass('loaded');
            }, 400);
        }
        else {
            console.log('Setting to defaul pfp');

            var storage = firebase.storage();
            var storageref = storage.ref();

            db.collection('users').doc(user.uid).collection('details').doc('pfp').get().then(function (doc) {
                storageref.child('logos/example.png').getDownloadURL().then(function (url) {
                    db.collection('users').doc(user.uid).update({
                        url: url
                    })

                })
            })
            pfp()
        }
    })

}


function tab(tab) {

    switch (tab) {
        case 'feed':

            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('feed-tab').classList.add('navthing')
            document.getElementById('feed-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=feed');
            sessionStorage.setItem('currentab', tab)
            break;
        case 'explore':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('explore-tab').classList.add('navthing')
            document.getElementById('explore-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=explore');
            sessionStorage.setItem('currentab', tab)
            break;
        case 'direct':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('direct-tab').classList.add('navthing')
            document.getElementById('direct-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=direct');
            sessionStorage.setItem('currentab', tab)
            break;
        case 'public':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('public-tab').classList.add('navthing')
            document.getElementById('public-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=public');
            sessionStorage.setItem('currentab', tab)
            break;
        case 'leaderboard':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('leaderboard-tab').classList.add('navthing')
            document.getElementById('leaderboard-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=leaderboard');
            sessionStorage.setItem('currentab', tab)
            break;
        case 'account':
            $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); this.classList.add('nopurple') })
            document.getElementById('account-tab').classList.add('navthing')
            document.getElementById('account-tab').classList.remove('nopurple')
            history.pushState(null, '', '/eonnect/app.html?tab=account');
            sessionStorage.setItem('currentab', tab)
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
        setTimeout(function () {
            $('body').addClass('loaded');
        }, 400);

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


$(function () {
    $('[data-toggle="popover"]').popover()
})