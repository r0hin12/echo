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


        db.collection('app').doc('details').get().then(function (doc) {
            for (let i = 0; i < doc.data().banned.length; i++) {
                const element = doc.data().banned[i];
                if (doc.data().banned[i] == firebase.auth().currentUser.uid) {
                    transfer('banned.html')
                }
            }

        })


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
    checkparticles()
    loaddms()

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
                document.getElementById('accountbio').innerHTML = doc.data().bio
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
        document.getElementById('accountname').innerHTML = user.displayName
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
    Snackbar.show({ text: 'Signing out...' })
    window.setTimeout(function () {
        firebase.auth().signOut()
    }, 2000)
}

function newpost() {
    var caption = document.getElementById('captioninput').value
    if (caption == '' || caption == " " || caption == null) {
        Snackbar.show({ text: 'An error occured. Try again later.', onActionClick: function (element) { $(element).css('opacity', 0); window.location.reload() }, actionText: 'Reload Page' })
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

                            db.collection('posts').doc('likes').update({
                                [newnum]: [],
                                latest: newnum
                            }).then(function () {
                                db.collection('posts').doc('reported').update({
                                    latest: newnum
                                }).then(function () {
                                    Snackbar.show({ text: 'Post uploaded.', onActionClick: function (element) { $(element).css('opacity', 0); load() }, actionText: 'refresh' })
                                    document.getElementById('captionel').style.display = 'none'
                                    document.getElementById('blah').style.display = 'none'
                                    document.getElementById('captionel').style.display = 'none'
                                })
                            })

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
            document.getElementById('accountpfp').src = doc.data().url
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
                        url: url,
                        filename: 'example',
                        filetype: 'png',
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

function changedisplayname() {


    $('#changedisplaynamemodal').modal('toggle')


}

function changedisplaynameconfirm() {
    newdisplayname = document.getElementById('newdisplayname').value

    if (newdisplayname == '' || newdisplayname == ' ' || newdisplayname == null || newdisplayname == undefined) {
        error('Something went wrong. Please try again later.')
    }
    else {



        user.updateProfile({
            displayName: newdisplayname
        }).then(function () {
            Snackbar.show({ text: 'Display name changed. Reloading...' })
            window.setTimeout(function () {
                window.location.reload()
            }, 1800)
        }).catch(function (error) {
            error(error)
        });
    }
}

function changeprofilepic() {

    $('#changeprofilepicmodal').modal('toggle')

}

function changeprofilepicconfirm() {
    $('#changeprofilepicmodal').modal('toggle')
    file = document.getElementById('actualclickbuttonyeet').files[0]
    console.log(file);

    db.collection('users').doc(user.uid).get().then(function (doc) {
        if (doc.data().filename == 'example') {

            var storageRef = firebase.storage().ref();
            logosRef = storageRef.child('logos/' + file.name);
            logosRef.put(file).then(function () {
                storageRef.child('logos/' + file.name).getDownloadURL().then(function (url) {
                    db.collection('users').doc(user.uid).update({
                        url: url,
                        filetype: file.name.split('.').pop(),
                        filename: file.name.split('.').slice(0, -1).join('.')
                    }).then(function () {
                        Snackbar.show({ text: 'Profile picture was successfully replaced' })
                        console.log(url);
                        document.getElementById('accountpfp').src = url
                        document.getElementById('pfp1').src = url
                    })
                })
            })

        }
        else {

            db.collection('users').doc(user.uid).get().then(function (doc) {

                var storageRef = firebase.storage().ref();
                logoRef = storageRef.child('logos/' + doc.data().filename + '.' + doc.data().filetype)
                logoref.delete().then(function () {
                    var storageRef = firebase.storage().ref();
                    logosRef = storageRef.child('logos/' + file.name);
                    logosRef.put(file).then(function () {
                        storageRef.child('logos/' + file.name).getDownloadURL().then(function (url) {
                            db.collection('users').doc(user.uid).update({
                                url: url,
                                filetype: file.name.split('.').pop(),
                                filename: file.name.split('.').slice(0, -1).join('.')
                            }).then(function () {
                                Snackbar.show({ text: 'Profile picture was successfully replaced' })
                                console.log(url);
                                document.getElementById('accountpfp').src = url
                                document.getElementById('pfp1').src = url
                            })
                        })
                    })
                })

            })


        }
    })

}

function changebiography() {

    $('#changebiographymodal').modal('toggle')

}
function changebiographyconfirm() {

    newbiography = document.getElementById('newbiography').value

    if (newbiography == '' || newbiography == ' ' || newbiography == null || newbiography == undefined) {
        error('Something went wrong. Please try again later.')
    }
    else {


        db.collection('users').doc(user.uid).update({
            bio: newbiography
        })

            .then(function () {
                Snackbar.show({ text: 'Biography changed.' })
                window.setTimeout(function () {
                    document.getElementById('accountbio').innerHTML = newbiography
                    document.getElementsByClassName('newbiography').value = ''
                }, 500)
            }).catch(function (error) {
                error(error)
            });
    }

}


function loadcredits() {
    $('#creditsmodal').modal('toggle')
    document.getElementById('namegoeshereyourwelcome').innerHTML = 'Thanks to you, ' + user.displayName + ', for using Eonnect!'
}
