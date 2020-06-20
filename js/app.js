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
                    usernames: firebase.firestore.FieldValue.arrayUnion(username),
                    map: firebase.firestore.FieldValue.arrayUnion(user.uid)
                })
                db.collection('users').doc(user.uid).update({
                    username: username,
                    name: displayname,
                    emailchange: firebase.firestore.FieldValue.serverTimestamp(),
                    passchange: firebase.firestore.FieldValue.serverTimestamp(),
                    direct_active: [],
                    direct_activity: firebase.firestore.FieldValue.serverTimestamp(),
                    direct_pending: []
                }).then(function() {
                    $('#savebtn').html('confirm (click again)')
                    document.getElementById('savebtn').onclick = function() {
                        window.location.reload()
                    }
                })
                user.updateProfile({
                    displayName: displayname,
                })

                // THIS PART MADE SENSE BEFORE - I HAVE NO IDEA WHAT IT DOES BUT ITS PROBABLY IMPORTANT
                // - rohin

                db.collection('users').doc(user.uid).get().then(function (doc) {
                    if (doc.data().type == undefined) {
                        db.collection('users').doc(user.uid).update({
                            type: 'public',

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

function addappcontent() {
    document.getElementById('viewprofilebtn').onclick = function() {
        usermodal(user.uid)
    }
    
    db.collection('users').doc(user.uid).get().then(function(doc) {

        window.cacheuser = doc.data()

        document.getElementsByClassName('main-avatar')[0].src = doc.data().url
        document.getElementById('pfp3').src = doc.data().url
        document.getElementsByClassName('main-avatar')[0].style.display = 'block'
        document.getElementById('pfcard').style.display = 'block'

        if (doc.data().name == null || doc.data().name == undefined) {
            db.collection('users').doc(user.uid).update({
                name: user.displayName
            })
        }

        if (doc.data().twitter == null || doc.data().twitter == undefined) {
        }
        else {
            var index = functiontofindIndexByKeyValue(user.providerData, "providerId", "twitter.com");
            goFunc = "gotwitter('" + user.providerData[index].uid + "')"
            document.getElementById('twitterlinktext').innerHTML = 'Your account is linked to <a href="#" onclick="' + goFunc + '">' + user.providerData[index].displayName + '</a>.'
            document.getElementById('twitterlinkbutton').innerHTML = 'unlink twitter ->'
            document.getElementById('twitterlinkbutton').onclick = function() {
                unlinktwitter()
            }
            hs = document.createElement('button')
            hs.classList.add('eon-text')
            hs.classList.add('connectionbtn')
            hs.onclick = function() {
                gotwitter(user.providerData[index].uid)
            }
            hs.innerHTML = '<img class="imginbtn" src="assets/Twitter_Logo_Blue.png"></img>'
            document.getElementById("cardconnections").appendChild(hs)
        }

        if (doc.data().github == null || doc.data().twitter == undefined) {
        }
        else {
            var index = functiontofindIndexByKeyValue(user.providerData, "providerId", "github.com");
            goFunc = "gogithub('" + user.providerData[index].uid + "')"
            getgithubprofile(user.providerData[index].uid).then(function(data) {
                document.getElementById('githublinktext').innerHTML = 'Your account is linked to <a href="#" onclick="' + goFunc + '">' + data.login + '</a>.'
            })
            document.getElementById('githublinkbutton').innerHTML = 'unlink github ->'
            document.getElementById('githublinkbutton').onclick = function() {
                unlinkgithub()
            }
            hs = document.createElement('button')
            hs.classList.add('eon-text')
            hs.classList.add('connectionbtn')
            hs.onclick = function() {
                gogithub(user.providerData[index].uid)
            }
            var customProps = window.getComputedStyle(document.documentElement);
            hs.innerHTML = '<img class="imginbtn" src="assets/GitHub-Mark-' + customProps.getPropertyValue('--content-primary').replace(/\s/g, '').charAt(0).toUpperCase() + customProps.getPropertyValue('--content-primary').slice(1) + '.png"></img>'
            document.getElementById("cardconnections").appendChild(hs)
        }

        document.getElementById('sidebarname').innerHTML = user.displayName + '<br><span class="badge badge-dark userbadge">@' + doc.data().username + '</span>'

        document.getElementById('name5').innerHTML = user.displayName
        if (doc.data().bio == undefined || doc.data().bio == null) {
            document.getElementById('bio5').innerHTML = 'Your bio is empty.'
        }
        else {
            document.getElementById('bio5').innerHTML = doc.data().bio
        }
        

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


        document.getElementById('following1').innerHTML = nFormatter(doc.data().following.length, 1)
        document.getElementById('followers1').innerHTML = nFormatter(doc.data().followers.length, 1)


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


function youareleaving(id) {
    if (cacheuser.skipwarning1) {
        window.open("" + id)
    }
    else {
        $('#leavingmodal').modal('toggle')
        document.getElementById('continuebtn').onclick = function() {
            if (document.getElementById('skipdialogswitch').checked) {
                db.collection('users').doc(user.uid).update({
                    skipwarning1: true
                }).then(function(doc) {
                    window.cacheuser = doc.data()
                    window.open(id)
                    $('#leavingmodal').modal('toggle')
                })
            }
            else {
                window.open(id)
                $('#leavingmodal').modal('toggle')
            }
            
        }
    }
}

function changedisplayname() {
    sessionStorage.removeItem('viewUser')
    toggleloader()
    newdisplayname = document.getElementById('newdisplayname').value
    if (newdisplayname == '' || newdisplayname == ' ' || newdisplayname == null || newdisplayname == undefined) {
        error('Something went wrong. Please try again later.')
    }
    else {
        user.updateProfile({
            displayName: newdisplayname
        }).then(function () {
            db.collection('users').doc(user.uid).update({
                name: newdisplayname
            }).then(function() {
                window.setTimeout(function () {
                    toggleloader()
                    showcomplete()
                    window.setTimeout(function() {
                        window.location.reload()
                    }, 1100)
                }, 2800)
            }).catch(function(error) {
                togglelsoader()
                alert(error.message)
            })
        }).catch(function (error) {
            toggleloader()
            alert(error.message)
        });
    }
}

function preparenamechange() {
    document.getElementById('newdisplayname').placeholder = user.displayName
    $('#changenamemodal').modal('toggle')
}

function preparebiochange() {
    db.collection('users').doc(user.uid).get().then(function(doc) {
        document.getElementById('newbio').placeholder = doc.data().bio
    }).then(function() {
        $('#changebiomodal').modal('toggle')
    })
}

function changebio() {
    sessionStorage.removeItem('currentlyviewinguser')
    toggleloader()
    newbio = document.getElementById('newbio').value
    if (newbio == '' || newbio == ' ' || newbio == null || newbio == undefined) {
        error('Something went wrong. Please try again later.')
    }
    else {
        db.collection('users').doc(user.uid).update({
            bio: newbio
        }).then(function() {
            window.setTimeout(function () {
                toggleloader()
                showcomplete()
                $('#bio5').html(newbio)
            }, 2800)
        }).catch(function(error) {
            togglelsoader()
            alert(error.message)
        })
    }
}

function confirmchangemeil() {
    toggleloader()
    db.collection('users').doc(user.uid).get().then(function(doc) {
        firebasedate = doc.data().emailchange.toDate()
        currentdate = new Date()
        var diffMinutes = parseInt((currentdate - firebasedate) / (1000 * 60), 10); 
        if (diffMinutes > 120) {
            user.updateEmail(document.getElementById('newemail').value).then(function() {
                $('#changemailpopoverbtn').popover('hide');
                db.collection("users").doc(user.uid).update({
                    emailchange: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                    window.setTimeout(function() {
                        toggleloader()
                        window.setTimeout(function() {
                            showcomplete()
                            window.setTimeout(function() {
                                history.pushState(null, '', '/eonnect/app.html?tab=returnstatusemail');
                                window.location.reload()
                            }, 3600)
                            Snackbar.show({text: "Updating records... Do not leave this page."})
                        }, 200)
                    }, 500)
                })
            }).catch(function(error) {
                window.setTimeout(function() {
                    toggleloader()
                    document.getElementById('erorrModalMsg').innerHTML = error
                    $('#errorModal').modal('toggle')
                }, 800)
            });
        }
        else {

            
            window.setTimeout(function() {
                error('You are doing this too much! Please wait up to 2 hours or contact support.')
                toggleloader()
            }, 1000)

        }
    })
}

function confirmchangepass() {
    $('#changpasswordpopoverbtn').popover('hide');
    toggleloader()
    db.collection('users').doc(user.uid).get().then(function(doc) {
        firebasedate = doc.data().passchange.toDate()
        currentdate = new Date()
        var diffMinutes = parseInt((currentdate - firebasedate) / (1000 * 60), 10); 
        if (diffMinutes > 120) {
            user.updatePassword(document.getElementById('newpassword').value).then(function() {
                db.collection("users").doc(user.uid).update({
                    passchange: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                    window.setTimeout(function() {
                        toggleloader()
                        window.setTimeout(function() {
                            showcomplete()
                            window.setTimeout(function() {
                                history.pushState(null, '', '/eonnect/app.html?tab=returnstatuspass');
                                window.location.reload()
                            }, 3600)
                            Snackbar.show({text: "Updating records... Do not leave this page."})
                        }, 200)
                    }, 500)
                })
            }).catch(function(error) {
                window.setTimeout(function() {
                    toggleloader()
                    document.getElementById('erorrModalMsg').innerHTML = error
                    $('#errorModal').modal('toggle')
                }, 800)
            });
        }
        else {

            
            window.setTimeout(function() {
                error('You are doing this too much! Please wait up to 2 hours or contact support.')
                toggleloader()
            }, 1000)

        }
    })
}

function confirmchangevisibility(result) {
    $('#changpasswordpopoverbtn').popover('hide');
    toggleloader()

    db.collection('users').doc(user.uid).update({
        type: result,
    }).then(function(doc) {
        window.setTimeout(function() {
            toggleloader()
            window.setTimeout(function() {
                showcomplete()
                window.setTimeout(function() {
                    history.pushState(null, '', '/eonnect/app.html?tab=returnstatus' + result);
                    window.location.reload()
                }, 3600)
                Snackbar.show({text: "Updating records... Do not leave this page."})
            }, 200)
        }, 800)
    })
}

function sharewithqr() {
    transfer('https://r0h.in/qr/api.html?target=' + location.protocol + '//' + location.host + location.pathname + "?user=" + user.uid + "&return=" + location.protocol + '//' + location.host + location.pathname + "?tab=account&typeof=url&return-site=Eonnect") 
}

