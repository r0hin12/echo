interval = window.setInterval(function () {
    if (typeof (user) != "undefined" && typeof (user) != null) {
        clearInterval(interval)
        load()
    }
}, 200);

function showall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing All Posts <i class="material-icons">keyboard_arrow_down</i>'

    document.getElementById('gridrelevant').style.display = 'none'
    document.getElementById('grid').style.removeProperty('display');
    document.getElementById('norelevantstuff').style.display = 'none'
    resizeAllGridItemsAll()

}

function dontshowall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing Relevant Posts <i class="material-icons">keyboard_arrow_down</i>'

    document.getElementById('gridrelevant').style.removeProperty('display');
    document.getElementById('grid').style.display = 'none'

    if( $('#gridrelevant').is(':empty') ) {
        document.getElementById('norelevantstuff').style.display = 'block'
    }



    resizeAllGridItems()
}
urlParams = new URLSearchParams(window.location.search);
addpostslistener()
sessionStorage.setItem('fullscreenon', 'no')
sessionStorage.setItem('viewing', 'stoplookinghere')
sessionStorage.setItem('currentlyviewinguser', 'uwu')

function load() {
    i = 0
    yeetpostslistener()
    addpostslistener()
    $('#grid').empty()
    $('#gridrelevant').empty()

    exarray = []
    fearray = []

    db.collection('app').doc('verified').get().then(function (verifieddoc) {

        window.verified = verifieddoc.data().verified

        db.collection('users').doc(firebase.auth().currentUser.uid).get().then(function (followdoc) {
            following = followdoc.data().following
            if (following == undefined) {
                following = []
            }
            db.collection('posts').doc('posts').get().then(function (doc) {
                limit = doc.data().latest
                for (let i = 0; i < limit + 1; i++) {
                    content = doc.data()[i]
                    if (content == undefined) {
                    }
                    else {
                        const elementid = content.name;
                        const elementdata = content.data
                        const elementtime = content.timestamp
                        if (user.uid == elementdata.uid) {
                            fearray.push({ name: elementid, data: elementdata, time: elementtime })
                        }
                        for (let i = 0; i < following.length; i++) {
                            if (following[i] == elementdata.uid) {
                                fearray.push({ name: elementid, data: elementdata, time: elementtime })
                            }
                        }
                        if (elementdata.type == 'true' || elementdata.type == true) {

                        }
                        else {
                            exarray.push({ name: elementid, data: elementdata, time: elementtime })
                        }
                    }
                }

                exarray.reverse()
                fearray.reverse()
                build(exarray)
                buildrelevant(fearray)

            })
        })

    })
}

function build(array) {
    sessionStorage.setItem('count', 0)
    sessionStorage.setItem('maxCount', array.length)

    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.classList.add('shell')
        z.id = name + 'shell'

        document.getElementById('grid').appendChild(z)

        addcontent(name, data, time)
    }
}

function buildrelevant(array) {
    if (array.length == 0) {
        document.getElementById('norelevantstuff').style.display = 'inline-block'
    }
    else {
        document.getElementById('norelevantstuff').style.display = 'none'
    }

    sessionStorage.setItem('count2', 0)
    sessionStorage.setItem('maxCount2', array.length)

    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.classList.add('postshell')
        z.id = name + 'relevantshell'

        document.getElementById('gridrelevant').appendChild(z)

        addcontentrelevant(name, data, time)
    }
}

async function addcontent(name, data, time) {
    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        db.collection('users').doc(data.uid).get().then(function (doc) {
            pfpurl = doc.url
        })

        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        for (let i = 0; i < verified.length; i++) {
            if (verified[i] == data.uid) {
                isVerified = true
            }
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelement" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }

        a.innerHTML = '<img style="z-index: 200;" class=""><img id="' + name + 'imgelel" class="animated fadeIn postimage" src="' + url + '"><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurl"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul>       <button id="' + name + 'el" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentEl" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button onclick="' + fullFunc + '" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="' + name + 'infoEl" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon">info</i></button><hr>'
        document.getElementById(name + 'shell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelement').tooltip()
        }, 500)

        addpfp(data.uid, name)

        if (sessionStorage.getItem('viewPost') == name) {
            sessionStorage.setItem('skiponce', 'true')
            sessionStorage.setItem('skiponce3', 'true')
            loadComments(name)
        }

        x = parseInt(sessionStorage.getItem('count'), 10);
        sessionStorage.setItem('count', x + 1)

        if (sessionStorage.getItem('count') == sessionStorage.getItem('maxCount')) {
            addWaves()
            listencomments()
            $('#' + 'shell').imagesLoaded(function () {
                window.setTimeout(function () {
                    resizeAllGridItemsAll()
                }, 1000)
            });
            listenlikes()
            window.setTimeout(function () {
                document.getElementById('loading').classList.add('fadeOut')
            }, 800)
            window.setTimeout(function () {
                dontshowall()
                window.setTimeout(function () {
                    document.getElementById('loading').style.display = 'none'
                })
            }, 1000)
        }
    }).catch(function (error) {
        console.log(error)
    });
    addWaves()
}

async function addcontentrelevant(name, data, time) {
    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        db.collection('users').doc(data.uid).get().then(function (doc) {
            pfpurl = doc.url
        })

        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreenrelevant('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        for (let i = 0; i < verified.length; i++) {
            if (verified[i] == data.uid) {
                isVerified = true
            }
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelementrelevant" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }

        a.innerHTML = '<img style="z-index: 200;" class=""><img id="' + name + 'imgelelrelevant" class="animated fadeIn postimage" src="' + url + '"><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurlrelevant"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul>       <button id="' + name + 'elrelevant" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentElrelevant" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button onclick="' + fullFunc + '" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="' + name + 'infoElrelevant" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon">info</i></button>'
        document.getElementById(name + 'relevantshell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelementrelevant').tooltip()
        }, 500)


        addpfprelevant(data.uid, name)

        x = parseInt(sessionStorage.getItem('count2'), 10);
        sessionStorage.setItem('count2', x + 1)

        if (sessionStorage.getItem('count2') == sessionStorage.getItem('maxCount2')) {
            addWaves()
            $('#' + 'postshell').imagesLoaded(function () {
                window.setTimeout(function () {
                    resizeAllGridItems()
                }, 1000)
            });
            listenlikesrelevant()
            listencommentsrelevant()
        }
    }).catch(function (error) {
        console.log(error)
    });
    addWaves()
}

function checkUrls() {
    var post = sessionStorage.getItem('viewPost')
    if (post == "null" || post == " " || post == "") {
    }
    else {
        //comments(post)
    }

    var fullscreen = sessionStorage.getItem('fullInfo')
    if (fullscreen == "null" || fullscreen == " " || fullscreen == "") {

    }
    else {
        dbfullscreen(fullscreen)
    }
    var viewInfo = sessionStorage.getItem('viewInfo')
    if (viewInfo == 'null' || fullscreen == " " || fullscreen == "") {

    }
    else {
        info(viewInfo)
    }
    var viewUser = sessionStorage.getItem('viewUser')
    if (viewUser == 'null' || viewUser == " " || viewUser == "") {

    }
    else {
        window.setTimeout(function() {
            usermodal(viewUser)
        }, 1000)
    }

}

function dbfullscreen(id) {
    $('body').css('overflow', 'hidden');

    db.collection('posts').doc('posts').get().then(function (doc) {

        a = document.createElement('div')
        a.id = 'fullscreenel'
        a.classList.add('fullscreenelement')
        a.classList.add('animated')
        a.classList.add('fadeInUp')
        source = doc.data()[id].data.url
        a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton centeredx "><i class="material-icons">fullscreen_exit</i></button>'
        document.getElementById('body').appendChild(a)
        window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
        addWaves()
        sessionStorage.setItem('fullscreenon', 'yes')

    })
}

function unfullscreen() {
    $('body').css('overflow', 'auto');

    sessionStorage.setItem('fullscreenon', 'no')
    document.getElementById('fullscreenel').classList.remove('fadeInUp')
    document.getElementById('fullscreenel').classList.add('fadeOutDown')
    window.setTimeout(() => {
        $('#fullscreenel').remove()
        window.history.pushState(null, '', '/eonnect/app.html');
    }, 700);
}
function fullscreen(id) {
    $('body').css('overflow', 'hidden');

    if (sessionStorage.getItem('fullscreenon') == 'yes') {
        sessionStorage.setItem('fullscreenon', 'no')
        console.log('duplicate fullscreen avoided');
    }

    a = document.createElement('div')
    a.id = 'fullscreenel'
    a.classList.add('fullscreenelement')
    a.classList.add('animated')
    a.classList.add('fadeInUp')
    source = document.getElementById(id + 'imgelel').src
    a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton centeredx "><i class="material-icons">fullscreen_exit</i></button>'
    document.getElementById('body').appendChild(a)
    window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
    addWaves()
    sessionStorage.setItem('fullscreenon', 'yes')
}
function fullscreenrelevant(id) {
    $('body').css('overflow', 'hidden');
    if (sessionStorage.getItem('fullscreenon') == 'yes') {
        sessionStorage.setItem('fullscreenon', 'no')
        console.log('duplicate fullscreen avoided');
    }
    else {
        a = document.createElement('div')
        a.id = 'fullscreenel'
        a.classList.add('fullscreenelement')
        a.classList.add('animated')
        a.classList.add('fadeInUp')
        source = document.getElementById(id + 'imgelelrelevant').src
        a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton centeredx "><i class="material-icons">fullscreen_exit</i></button>'
        document.getElementById('body').appendChild(a)
        window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
        addWaves()
        sessionStorage.setItem('fullscreenon', 'yes')
    }
}

function loadComments(id) {
    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }

    db.collection("posts").doc('comments').get().then(function (doc) {
        sessionStorage.setItem('viewingdata', doc.data()[id].length)

        if (doc.data()[id].size == 0) {
            h = document.createElement('div')
            h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            document.getElementById('commentsbox').appendChild(h)
        }

        for (let i = 0; i < doc.data()[id].length; i++) {
            const element = doc.data()[id][i];

            a = document.createElement('div')
            a.classList.add('card')
            a.classList.add('animated')
            a.classList.add('fadeIn')
            reportFunc = "reportComment('" + doc.id + "')"
            userFunc33 = "usermodal('" + element.user + "'); sessionStorage.setItem('skiponce123', 'true'); $('#postmodal').modal('toggle')"
            a.innerHTML = '<div<div style="text-align: left;" class="card-body"><img class="centeredy" style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px; height: 50px; object-fit: cover;"id="' + i + 'pfpel" alt=""><p style="padding-left: 68px; max-width: 86%; display: inline-block;"><a class="userlinkoncomment" onclick="' + userFunc33 + '" >' + element.name + ' » </a> ' + element.content + '</p><div class="centeredy" style="right: 25px;"><button onclick="' + reportFunc + '" class="waves eon-text"><i class="material-icons">report_problem</i></button></div></div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(element.user, i)
            addWaves()
        }
    })

    history.pushState(null, "", "?post=" + id)
    $('#postmodal').modal('toggle')
}

function like(id) {



    sessionStorage.setItem('skiponce2', "true")
    db.collection('posts').doc('likes').get().then(function (doc) {
        alreadyliked = false

        for (let i = 0; i < doc.data()[id].length; i++) {
            const element = doc.data()[id][i];
            if (element == user.uid) {
                var alreadyliked = true
            }
        }

        if (doc.data()[id][0] == user.uid) {
            Snackbar.show({ text: 'You cannot remove like on your own post.' })
        }

        else {

            if (alreadyliked == true) {
                db.collection('posts').doc('likes').update({
                    [id]: firebase.firestore.FieldValue.arrayRemove(user.uid)
                })
                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'elicon').classList.add('rubberBand')
                    }, 500)
                    window.setTimeout(function () {
                        document.getElementById(id + 'elicon').classList.remove('rubberBand')
                    }, 1300)
                } catch {

                }
                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'eliconrelevant').classList.add('rubberBand')
                    }, 500)
                    window.setTimeout(function () {
                        document.getElementById(id + 'eliconrelevant').classList.remove('rubberBand')
                    }, 1300)
                } catch {

                }
            }
            else {
                db.collection('posts').doc('likes').update({
                    [id]: firebase.firestore.FieldValue.arrayUnion(user.uid)
                })
                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'elicon').classList.add('jello')
                    }, 500)

                    window.setTimeout(function () {
                        document.getElementById(id + 'elicon').classList.remove('jello')
                    }, 1300)
                } catch {
                }

                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'eliconrelevant').classList.add('jello')
                    }, 500)

                    window.setTimeout(function () {
                        document.getElementById(id + 'eliconrelevant').classList.remove('jello')
                    }, 1300)
                } catch {

                }

            }
        }
    })
}

function addComment(id) {
    text = document.getElementById('commentbox').value
    if (text == "" || text == " " || text == "  ") {
        Snackbar.show({ text: 'You must include content.' })
    }
    else {
        if (document.getElementById('commentbox').value.length > 200) {
            $('#postmodal').modal('toggle')
            error('Too many characters. The limit is 200.')
        }
        else {
            document.getElementById('commentbox').value = ''
            db.collection('posts').doc('comments').update({
                [id]: firebase.firestore.FieldValue.arrayUnion({
                    user: user.uid,
                    name: user.displayName,
                    content: text,
                })
            }).then(function () {
                document.getElementById('charcount').innerHTML = 'Post Comment (0/200 chars)'
                x = parseInt(sessionStorage.getItem('viewing'), 10)
                Snackbar.show({ text: 'New comments have been added.', onActionClick: function (element) { $(element).css('opacity', 0); refreshcomments(x) }, actionText: 'Refresh' })
            });
        }
    };
}

function addpfpcomment(usr, id) {
    db.collection('users').doc(usr).get().then(function (doc) {
        document.getElementById(id + 'pfpel').src = doc.data().url
    })
}

async function addstuffuser(name, data, time, last) {
    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.data.uid + '/' + data.data.file).getDownloadURL().then(function (url) {

        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); loadComments('" + name + "')"
        infoFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"

        a.innerHTML = '<div class="card animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; padding-bottom: 12px;"><img id="' + name + 'imgelelel" class="animated fadeIn" style="border-radius: 15px 15px 0px 0px; width: 100%; max-height: 800px; object-fit: cover" src="' + url + '"><br><center><p style="max-width: 100%; line-height: 0px;">' + data.data.caption + '</p><center><button id="' + name + 'eluser" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves eon-text heart"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">favorite_border</i> ' + data.data.likes.length + '</button><button id="' + name + 'commentEluser" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">chat_bubble_outline</i> ' + '</button><button id="' + name + 'infoEluser" onclick="' + infoFunc + '" style="padding: 0px !important; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">info</i></button><button style="padding: 0px !important; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves eon-text"><i style="color: #000; font-size: 28px;" class="material-icons">fullscreen</i></button><br></div></div><br></center><br></div>'
        document.getElementById(name + 'usersshell').appendChild(a)
        db.collection('posts').doc('comments').get().then(function (docee) {
            bambam = docee.data()[name].length
            document.getElementById(name + "commentEluser").innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">chat_bubble_outline</i> ' + bambam
        })


        if (last) {
            addWaves()
            window.setTimeout(function() {
                resizeAllGridItemsUser()
            }, 500)
        }

    }).catch(function (error) {
        console.log(error)
    });
}

async function usermodal(uid) {
    console.log(uid);
    previousview = sessionStorage.getItem("currentlyviewinguser")

    if (previousview == uid) {
        $('#userModal').modal('toggle')
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
    }

    else {
        toggleloader()
        console.log(uid);
        sessionStorage.setItem('currentlyviewinguser', uid)
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
        $('#usergrid').empty()
        $('#userModal').modal('toggle')


        db.collection('users').doc(uid).get().then(function (userdoc) {
            doc = userdoc
            username = doc.data().username
            useruid = doc.data().uid
            document.getElementById('usermodaltitle').innerHTML = doc.data().name + '<span class="badge badge-dark userbadge centeredy">@' + doc.data().username + '</span><span style="visibility: hidden;" class="badge badge-dark userbadge">@' + doc.data().username + '</span>'
            document.getElementById('usermodalpfp').src = doc.data().url
            if (doc.data().bio == undefined || doc.data().bio == null || doc.data().bio == "" || doc.data().bio == " ") { }
            else { document.getElementById('usermodalbio').innerHTML = doc.data().bio }
            document.getElementById('userrep').innerHTML = doc.data().rep

            following = doc.data().following
            if (following == undefined) {
                following = []
            }
            document.getElementById('userfollowing').innerHTML = nFormatter(following.length, 1)

            followers = doc.data().followers
            if (followers == undefined) {
                followers = []
            }
            document.getElementById('userfollowers').innerHTML = nFormatter(followers.length, 1)
            
            isfollow = false
            for (const item of followers) {
                if (item == user.uid) {
                        isfollow = true
                }
            }
            if (isfollow) {
                document.getElementById('followbtn').innerHTML = 'unfollow'
                document.getElementById('followbtn').onclick = function () {
                    unfollow(uid, username)
                }
                loaduserposts(uid)
            }
            else {
                document.getElementById('followbtn').innerHTML = 'follow'
                document.getElementById('followbtn').onclick = function () {
                    follow(uid, username)
                }

                if (userdoc.data().type == 'private') {
                    document.getElementById('privatewarning').style.display = 'block'
                    requested = userdoc.data().requested
                    isrequest = false
                    for (const item of ppl) {
                        if (item == uid) {
                            isrequest = true
                        }
                    }

                    if (isrequest == true) {
                        document.getElementById('followbtn').innerHTML = 'cancel request'
                        document.getElementById('followbtn').onclick = function () {
                            unrequest(uid, username)
                        }
                    }
                }
        }

        window.setTimeout(function() {
            toggleloader()
        }, 500)


        })

        if (user.uid == uid) {
            document.getElementById('ownwarning').style.display = 'block'
            document.getElementById('followbtn').innerHTML = 'unfollow'
            document.getElementById('followbtn').onclick = function () {
                Snackbar.show({ pos: 'bottom-left', text: "You can't unfollow yourself." })
            }
            
            loaduserposts(uid)
        }
    }
}

function loaduserposts(uid) {
    array = []
    
    db.collection('posts').doc('posts').get().then(function (doc) {
        userpostcount = 0
        latest = doc.data().latest
        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] == undefined) {
            }
            else {
                userpostcount++
                if (doc.data()[i].data.uid == user.uid) {
                    array.push({ name: i, data: doc.data()[i], time: doc.data()[i].timestamp })
                }
            }
        }
        userpostcount = userpostcount - 1

        array.reverse()
        actualuser(array)


    }).catch(function (error) {
        console.log(error)
    })
}

function actualuser(array) {
    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.id = name + 'usersshell'
        z.classList.add('usershell')

        document.getElementById('usergrid').appendChild(z)

        if (i == userpostcount) {
            addstuffuser(name, data, time, true)
        }
        else {
            addstuffuser(name, data, time, false)
        }
        
    }
}

function info(id) {
    db.collection('posts').doc('posts').get().then(function (doc) {

        document.getElementById('infoa').innerHTML = doc.data()[id].data.file
        document.getElementById('infob').innerHTML = doc.data()[id].timestamp.toDate()
        document.getElementById('infoc').innerHTML = id
        document.getElementById('infod').innerHTML = doc.data()[id].data.uid
        document.getElementById('infoe').innerHTML = doc.data()[id].data.caption

        document.getElementById('commentbtnfrominfo').onclick = function () {
            sessionStorage.setItem('tocomments', true)
            loadComments(id)
        }
        document.getElementById('userbtnfrominfo').onclick = function () {
            sessionStorage.setItem('touser', true)
            usermodal(doc.data()[id].data.uid)
        }

        if (doc.data()[id].data.uid == user.uid) {
            document.getElementById('deletebtnfrominfo').onclick = function () {
                db.collection('posts').doc('posts').update({
                    [id]: firebase.firestore.FieldValue.delete()
                })
                db.collection('posts').doc('comments').update({
                    [id]: firebase.firestore.FieldValue.delete()
                })
                db.collection('posts').doc('likes').update({
                    [id]: firebase.firestore.FieldValue.delete()
                })
                db.collection('posts').doc('reported').update({
                    [id]: firebase.firestore.FieldValue.delete()
                }).then(function () {
                    Snackbar.show({ text: 'Your post was deleted.' })
                })
            }

            document.getElementById('deletebtnfrominfo').style.display = 'inline-block'
        }
        else {
            document.getElementById('deletebtnfrominfo').style.display = 'none'
        }

        document.getElementById('reportbtnfrominfo').onclick = function () {
            x = confirm('Are you sure you would like to report this post?')
            if (x) {
                db.collection('posts').doc('posts').get().then(function (doc) {
                    content = doc.data()[id]

                    db.collection('posts').doc('reported').update({
                        [id]: { name: id, timestamp: content.timestamp, data: { caption: content.data.caption, file: content.data.file, name: content.data.name, type: content.data.type, uid: content.data.uid } }
                    }).then(function () {
                        Snackbar.show({ text: 'Post was reported' })
                    })

                })
            }
            else {
                window.setTimeout(function () {
                    info(id)
                }, 500)
            }
        }

        $('#infoModal').modal('toggle')

        window.history.pushState(null, '', '/eonnect/app.html?info=' + id);

    })

}

function reportComment(id) {
    console.log('reporting function??');
}

function refreshcomments(id) {

    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }

    db.collection("posts").doc('comments').get().then(function (doc) {
        sessionStorage.setItem('viewingdata', doc.data()[id].length)
        if (doc.data()[id].size == 0) {

            h = document.createElement('div')
            h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            document.getElementById('commentsbox').appendChild(h)
        }
        for (let i = 0; i < doc.data()[id].length; i++) {
            const element = doc.data()[id][i];

            a = document.createElement('div')
            a.classList.add('card')
            a.classList.add('animated')
            a.classList.add('fadeIn')
            reportFunc = "reportComment('" + doc.id + "')"
            a.innerHTML = '<div<div style="text-align: left;" class="card-body"><img class="centeredy" style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px; height: 50px; object-fit: cover;"id="' + i + 'pfpel" alt=""><p style="padding-left: 68px; max-width: 86%; display: inline-block;"><b>' + element.name + ' » </b> ' + element.content + '</p><div class="centeredy" style="right: 25px;"><button onclick="' + reportFunc + '" class="waves eon-text"><i class="material-icons">report_problem</i></button></div></div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(element.user, i)
            addWaves()

        }

    })

}

function listencomments() {
    db.collection('posts').doc('comments').onSnapshot(function (doc) {


        viewing = sessionStorage.getItem('viewing')
        if (viewing == 'stoplookinghere') {
        }
        else {
            savedsession = doc.data()[parseInt(sessionStorage.getItem('viewing'), 10)].length
            if (savedsession == parseInt(sessionStorage.getItem('viewingdata'), 10)) {
            }
            else {
                x = parseInt(sessionStorage.getItem('viewing'), 10)
                Snackbar.show({ pos: 'bottom-left', text: "New comments are added.", onActionClick: function (element) { $(element).css('opacity', 0); refreshcomments(x) }, actionText: "refresh" })
            }
        }

        for (let i = 0; i < doc.data().latest + 1; i++) {

            if (doc.data()[i] == undefined) {

            }
            else {
                try {
                    document.getElementById(i + 'commentEl').innerHTML = '<i class="material-icons posticon">chat_bubble_outline</i> ' + doc.data()[i].length
                }
                catch {

                }
                addWaves()
            }
        }

    })
}

function listencommentsrelevant() {
    db.collection('posts').doc('comments').onSnapshot(function (doc) {

        for (let i = 0; i < doc.data().latest + 1; i++) {

            if (doc.data()[i] == undefined) {

            }
            else {

                document.getElementById(i + 'commentElrelevant').innerHTML = '<i class="material-icons posticon">chat_bubble_outline</i> ' + doc.data()[i].length
                addWaves()
            }
        }

    })
}

function addpfprelevant(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurlrelevant').src = doc.data().url


    })
}

function addpfp(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurl').src = doc.data().url


    })
}

function listenlikes() {
    db.collection("posts").doc('likes').onSnapshot(function (doc) {
        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] == undefined) {
            }
            else {
                isliked = false
                for (let newi = 0; newi < doc.data()[i].length; newi++) {
                    const element = doc.data()[i][newi];
                    if (element == user.uid) {
                        isliked = true
                    }

                }

                if (isliked) {
                    try {
                        document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" style="color: red;" class="material-icons posticon animated">favorite</i> ' + doc.data()[i].length
                    } catch {

                    }

                }
                else {
                    try {
                        if (doc.data()[i].length == 0) {
                            document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" class="material-icons posticon animated">favorite_border</i> '
                        }
                        else {
                            document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" class="material-icons posticon animated">favorite_border</i> ' + doc.data()[i].length
                        }

                    } catch {
                    }

                }
                addWaves()
            }
        }

    });
}

function listenlikesrelevant() {
    db.collection("posts").doc('likes').onSnapshot(function (doc) {

        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] == undefined) {
            }
            else {
                isliked = false
                for (let newi = 0; newi < doc.data()[i].length; newi++) {
                    const element = doc.data()[i][newi];
                    if (element == user.uid) {
                        isliked = true
                    }

                }

                if (isliked) {

                    document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" style=" color: red;" class="material-icons posticon animated">favorite</i> ' + doc.data()[i].length

                }
                else {
                    if (doc.data()[i].length == 0) {
                        document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" class="material-icons posticon animated">favorite_border</i> '
                    }
                    else {
                        document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" class="material-icons posticon animated">favorite_border</i> ' + doc.data()[i].length
                    }

                }
                addWaves()
            }
        }
    });
}


function updatechars() {

    window.setTimeout(() => {

        length = document.getElementById('commentbox').value.length
        document.getElementById('charcount').innerHTML = 'Post Comment (' + length + '/200 characters)'
        if (length > 200) {
            document.getElementById('charcount').classList.remove('btn-eon-one')
            document.getElementById('charcount').classList.add('btn-eon-four')
            document.getElementById('charcount').classList.remove('yellow')
            document.getElementById('charcount').classList.add('shake')
            document.getElementById('charcount').classList.remove('infinite')
        }
        else {

            if (length >= 190) {
                document.getElementById('charcount').classList.remove('btn-eon-one')
                document.getElementById('charcount').classList.add('yellow')
                document.getElementById('charcount').classList.remove('btn-eon-four')
                document.getElementById('charcount').classList.add('pulse')
                document.getElementById('charcount').classList.remove('shake')
                document.getElementById('charcount').classList.add('infinite')

            }

            else {
                if (length >= 180) {
                    document.getElementById('charcount').classList.remove('btn-eon-one')
                    document.getElementById('charcount').classList.add('yellow')
                    document.getElementById('charcount').classList.remove('btn-eon-four')
                    document.getElementById('charcount').classList.add('pulse')
                    document.getElementById('charcount').classList.remove('shake')
                    document.getElementById('charcount').classList.remove('infinite')
                }

                else {

                    document.getElementById('charcount').classList.add('btn-eon-one')
                    document.getElementById('charcount').classList.remove('btn-eon-four')
                    document.getElementById('charcount').classList.remove('shake')
                    document.getElementById('charcount').classList.remove('yellow')
                    document.getElementById('charcount').classList.remove('infinite')
                }
            }


        }
    }, 10);

}

$('#postmodal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce123') == "true") {
        sessionStorage.setItem('skiponce123', "false")
    }
    else {

        if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
            window.history.pushState(null, '', '/eonnect/app.html')
        }
        else {
            window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }

});

$('#userModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce3') == "true") {
        sessionStorage.setItem('skiponce3', "false")
    }
    else {

        if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
            window.history.pushState(null, '', '/eonnect/app.html')
        }
        else {
            window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }
});

$('#infoModal').on('hidden.bs.modal', function () {
    x = sessionStorage.getItem('tocomments')
    if (x == "true") {
        sessionStorage.setItem('tocomments', false)
    }
    else {
        x = sessionStorage.getItem('touser')
        if (x == "true") {
            sessionStorage.setItem('touser', false)
        }
        else {


            if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
                window.history.pushState(null, '', '/eonnect/app.html')
            }
            else {
                window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
            }
        }
    }

});

$(function () {
    $(".heart").on("click", function () {
        $(this).toggleClass("is-active");
    });
});

function addpostslistener() {
    yeetpostslistener = db.collection("posts").onSnapshot(function (querySnapshot) {
        if (sessionStorage.getItem('skiponce2') == "true") {
            sessionStorage.setItem('skiponce2', "false")
        }
        else {
            if (localStorage.getItem('currentab') == 'explore') {
                Snackbar.show({ pos: 'bottom-left', text: "Posts have been modified.", onActionClick: function (element) { $(element).css('opacity', 0); refreshhome() }, actionText: "refresh" })
            };
        };
    });
}

function follow(uid, name) {


    db.collection('users').doc(uid).get().then(function (doc) {
        if (doc.data().type == 'private') {

            db.collection('users').doc(uid).collection('follow').doc('requested').update({
                requested: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(function () {
                Snackbar.show({ text: 'Requested to follow ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); unfollow(uid) }, actionText: 'cancel' })
                document.getElementById('followbtn').innerHTML = 'cancel request'
                document.getElementById('followbtn').onclick = function () {
                    unrequest(uid, username)
                }
            })
        }
        else {
            db.collection('users').doc(user.uid).collection('follow').doc('following').update({
                following: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(function () {
                db.collection('users').doc(uid).collection('follow').doc('followers').update({
                    followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }).then(function () {
                    Snackbar.show({ text: 'Started following ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); unfollow(uid) }, actionText: 'Unfollow' })

                    document.getElementById('followbtn').innerHTML = 'unfollow'
                    document.getElementById('followbtn').onclick = function () {
                        unfollow(uid, username)
                    }
                })
            })
        }
    })


}

function unfollow(uid, name) {

    db.collection('users').doc(user.uid).collection('follow').doc('following').update({
        following: firebase.firestore.FieldValue.arrayRemove(uid)
    }).then(function () {
        db.collection('users').doc(uid).collection('follow').doc('followers').update({
            followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
        }).then(function () {
            Snackbar.show({ text: 'Stopped following ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); follow(uid, name) }, actionText: 'undo' })
            document.getElementById('followbtn').innerHTML = 'follow'
            document.getElementById('followbtn').onclick = function () {
                follow(uid, username)
            }
        })
    })
}

function unrequest(uid, name) {

    db.collection('users').doc(uid).collection('follow').doc('requested').update({
        followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
    }).then(function () {
        Snackbar.show({ text: 'Cancelled follow request for ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); follow(uid, name) }, actionText: 'undo' })
        document.getElementById('followbtn').innerHTML = 'request'
        document.getElementById('followbtn').onclick = function () {
            follow(uid, username)
        }
    })
}

$("#imgInp").change(function () {
    input = this
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    document.getElementById('blah').style.display = 'block'
    document.getElementById('captionel').style.display = 'block'
    document.getElementById('captionelel').style.display = 'block'
});

function newpost() {
    var caption = document.getElementById('captioninput').value
    if (caption == '' || caption == " " || caption == null) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
    }
    else {
        if (document.getElementById('captioninput').value.length > 100) {
            error('Caption contains more than 100 characters.')
            $('#uploadmodal').modal('toggle')
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

                    fileRef.getDownloadURL().then(function (url) {
                        db.collection('posts').doc('posts').update({
                            [newnum]: {
                                name: newnum,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                data: {
                                    caption: caption,
                                    likes: ['first'],
                                    url: url,
                                    file: filename,
                                    name: user.displayName,
                                    type: document.getElementById('privateinp').checked,
                                    uid: user.uid,
                                }
                            },
                            latest: newnum
                        })
                    })

                    db.collection('posts').doc('comments').update({
                        [newnum]: [],
                        latest: newnum
                    })
                    db.collection('posts').doc('likes').update({
                        [newnum]: firebase.firestore.FieldValue.arrayUnion(user.uid),
                        latest: newnum
                    })
                    db.collection('posts').doc('reported').update({
                        latest: newnum
                    }).then(function () {
                        Snackbar.show({ text: 'Your photo was uploaded.' })
                        $('#uploadmodal').modal('toggle')
                        document.getElementById('captionel').style.display = 'none'
                        document.getElementById('blah').style.display = 'none'
                        document.getElementById('captionel').style.display = 'none'

                        refreshhome()



                    });
                });
            })
        };
    };
}

function refreshhome() {
    document.getElementById('grid').classList.remove('fadeIn')
    document.getElementById('gridrelevant').classList.remove('fadeIn')
    document.getElementById('grid').classList.add('fadeOut')
    document.getElementById('gridrelevant').classList.add('fadeOut')
    window.setTimeout(function () {
        document.getElementById('gridrelevant').style.display = 'none'
        document.getElementById('grid').style.display = 'block'
        load()
    }, 1000)
    window.setTimeout(resizeAllGridItems(), 1500)
    window.setTimeout(function () {
        document.getElementById('grid').classList.add('fadeIn')
        document.getElementById('gridrelevant').classList.add('fadeIn')
        document.getElementById('grid').classList.remove('fadeOut')
        document.getElementById('gridrelevant').classList.remove('fadeOut')
    }, 1000)

}