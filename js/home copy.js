function showall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing All Posts <i class="material-icons">keyboard_arrow_down</i>'

    document.getElementById('gridrelevant').setAttribute('style', 'display:none !important');
    document.getElementById('grid').style.removeProperty('display');
    document.getElementById('norelevantstuff').style.display = 'none'
    resizeAllGridItemsAll()
    sessionStorage.setItem('view', 'all')
}

function dontshowall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing Relevant Posts <i class="material-icons">keyboard_arrow_down</i>'

    document.getElementById('gridrelevant').style.removeProperty('display');
    document.getElementById('grid').setAttribute('style', 'display:none !important');

    if( $('#gridrelevant').is(':empty') ) {
        document.getElementById('norelevantstuff').style.display = 'block'
    }
    sessionStorage.setItem('view', 'relevant')

    resizeAllGridItems()
}

urlParams = new URLSearchParams(window.location.search);
addpostslistener()
sessionStorage.setItem('fullscreenon', 'no')
sessionStorage.setItem('view', 'relevant')
sessionStorage.setItem('viewing', 'stoplookinghere')
sessionStorage.setItem('currentlyviewinguser', 'uwu')
sessionStorage.setItem('currentlyviewingpost', 'owooo ❤️')
sessionStorage.setItem('skiponce', 'false')
sessionStorage.setItem('skiponce2', 'false')
sessionStorage.setItem('skiponce3', 'false')
sessionStorage.setItem('skiponce123', 'false')
sessionStorage.setItem('skiponce1234', 'false')
// INFINITE SCROLL VARIABLES

window.infiniteScrollCount = 16
window.currentScrollCount = 0
window.currentRelScrollCount = 0
window.currentUserScrollCount = 0

function load() {
    i = 0
    yeetpostslistener()
    addpostslistener()
    $('#grid').empty()
    $('#gridrelevant').empty()

    window.exarray = []
    window.fearray = []

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

                window.currentScrollCount = 0
                window.currentRelScrollCount = 0
                sessionStorage.setItem("InfScrollData", JSON.stringify(exarray))
                build()
                sessionStorage.setItem("InfRelScrollData", JSON.stringify(fearray))
                buildrelevant()

            })
        })

    })
}

function build() {

    array = sessionStorage.getItem('InfScrollData')
    array = JSON.parse(array)
    // exarray
    for (let i = 0; i < currentScrollCount; i++) {
        array.shift()
    }

    array = array.slice(0, infiniteScrollCount);

    sessionStorage.setItem('count', 0)
    sessionStorage.setItem('maxCount', array.length)

    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.classList.add('shell')
        z.style.visibility = 'hidden'
        z.id = name + 'shell'

        document.getElementById('grid').appendChild(z)

        showelement(name + 'shell', i)

        addcontent(name, data, time)
    }

    currentScrollCount = currentScrollCount + infiniteScrollCount
}

function showelement(id, index) {
    window.setTimeout(function() {
        z = document.getElementById(id)
        z.style.visibility = 'visible'
        z.classList.add('animated')
        z.classList.add('fadeInUp')
        adelay = index * 1000;adelay = adelay / 2;adelay = adelay / 2
        z.style.animationDelay = adelay
    }, 1500)
}

function buildrelevant() {



    array = sessionStorage.getItem('InfRelScrollData')
    array = JSON.parse(array)
    // exarray
    for (let i = 0; i < currentRelScrollCount; i++) {
        array.shift()
    }

    array = array.slice(0, infiniteScrollCount);

    // fearray

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
        z.style.visibility = 'hidden'
        z.id = name + 'relevantshell'

        showelement(name + 'relevantshell', i)

        document.getElementById('gridrelevant').appendChild(z)

        addcontentrelevant(name, data, time)
    }

    currentRelScrollCount = currentRelScrollCount + infiniteScrollCount
}

async function addcontent(name, data, time) {
    if (data.url == 'eonnect-home-text_post') {
        // Text Post
        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "', '" + data.uid + "')"
        infoFunc = "info('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        if (verified.includes(data.uid)) {
            isVerified = true
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelement" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }
        if (data.url_theme == 'deep') {
            textCardClass = 'superdeepcard'
            textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + data.url_content + '</b></p></div>'            
        }
        else {
            textCardClass = data.url_theme + 'card'
            textStuff = '<div class="card-body"><h5 class="posttextclass">' + data.url_content + '</h5></div>'
        }
        postFunc = "viewpost('" + name + "')"
        a.innerHTML = '<img style="z-index: 200;" class=""><div onclick="' + postFunc + '" class="card ' + textCardClass + '">' + textStuff + '</div><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurl"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul> <button id="' + name + 'el" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentEl" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button id="' + name + 'infoEl" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr>'
        document.getElementById(name + 'shell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelement').tooltip()
        }, 500)

        addpfp(data.uid, name)

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
                window.setTimeout(function () {
                    document.getElementById('loading').style.display = 'none'
                })
            }, 1000)
        }
        return;
    }

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {
        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "', '" + data.uid + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        if (verified.includes(data.uid)) {
            isVerified = true
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelement" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }

        postFunc = "viewpost('" + name + "')"
        a.innerHTML = '<img style="z-index: 200;" class=""><img onclick="' + postFunc + '" id="' + name + 'imgelel" class="postimage" src="' + url + '"><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurl"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul> <button title="' + data.caption + '" id="' + name + 'elcaption" class="postbuttons"><i class="material-icons posticon animated">subject</i></button>    <button id="' + name + 'el" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentEl" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button onclick="' + fullFunc + '" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="' + name + 'infoEl" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr>'
        document.getElementById(name + 'shell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelement').tooltip()
        }, 500)

        addpfp(data.uid, name)

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
    if (data.url == 'eonnect-home-text_post') {
        // Text Post
        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "', '" + data.uid + "')"
        infoFunc = "info('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        if (verified.includes(data.uid)) {
            isVerified = true
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelementrelevant" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }
        if (data.url_theme == 'deep') {
            textCardClass = 'superdeepcard'
            textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + data.url_content + '</b></p></div>'            
        }
        else {
            textCardClass = data.url_theme + 'card'
            textStuff = '<div class="card-body"><h5 class="posttextclass">' + data.url_content + '</h5></div>'
        }
        postFunc = "viewpost('" + name + "')"
        a.innerHTML = '<img style="z-index: 200;" class=""><div onclick="' + postFunc + '" class="card ' + textCardClass + '">' + textStuff + '</div><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurlrelevant"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul>    <button id="' + name + 'elrelevant" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentElrelevant" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button id="' + name + 'infoElrelevant" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr>'
        document.getElementById(name + 'relevantshell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelementrelevant').tooltip()
        }, 500)

        addpfprelevant(data.uid, name)

        x = parseInt(sessionStorage.getItem('count2'), 10);
        sessionStorage.setItem('count2', x + 1)

        if (sessionStorage.getItem('count2') == sessionStorage.getItem('maxCount2')) {
            addWaves()
            document.getElementById('gridrelevant').style.display = 'grid'
            $('#' + 'postshell').imagesLoaded(function () {
                window.setTimeout(function () {
                    resizeAllGridItems()
                }, 1000)
            });
            listenlikes()
            listencomments()
        }
        return;
    }

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "', '" + data.uid + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreenrelevant('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        isVerified = false
        if (verified.includes(data.uid)) {
            isVerified = true
        }
        if (isVerified) {
            usersname = data.name + '<i id="' + name + 'verifiedelementrelevant" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i>'
        }
        else {
            usersname = data.name
        }

        postFunc = "viewpost('" + name + "')"
        a.innerHTML = '<img onclick="' + postFunc + '" id="' + name + 'imgelelrelevant" class="postimage" src="' + url + '"><nav class="navbar navbar-expand-sm"><img onclick="' + userFunc + '" class="postpfp" id="' + name + 'pfpelurlrelevant"><h4 class="postname centeredy">' + usersname + '</h4><ul class="navbar-nav mr-auto"> </ul>    <button title="' + data.caption + '" id="' + name + 'elcaptionrelevant" class="postbuttons"><i class="material-icons posticon animated">subject</i></button>   <button id="' + name + 'elrelevant" onclick="' + likeFunc + '" class="postbuttons heart"><i class="material-icons posticon animated">favorite_border</i>0</button><button id="' + name + 'commentElrelevant" onclick="' + commentFunc + '" class=" postbuttons"><i class="material-icons posticon">chat_bubble_outline</i>0</button></nav></div><button onclick="' + fullFunc + '" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="' + name + 'infoElrelevant" onclick="' + infoFunc + '" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr>'
        document.getElementById(name + 'relevantshell').appendChild(a)
        window.setTimeout(function () {
            $('#' + name + 'verifiedelementrelevant').tooltip()
        }, 500)

        addpfprelevant(data.uid, name)

        x = parseInt(sessionStorage.getItem('count2'), 10);
        sessionStorage.setItem('count2', x + 1)

        if (sessionStorage.getItem('count2') == sessionStorage.getItem('maxCount2')) {
            addWaves()
            document.getElementById('gridrelevant').style.display = 'grid'
            $('#' + 'postshell').imagesLoaded(function () {
                window.setTimeout(function () {
                    resizeAllGridItems()
                }, 1000)
            });
            listenlikes()
            listencomments()
        }
    }).catch(function (error) {
        console.log(error)
    });
    addWaves()
}

function checkUrls() {
    var post = sessionStorage.getItem('viewComments')
    if (post == "null" || post == " " || post == "") {
    }
    else {
        db.collection('posts').doc('posts').get().then(function(doc) {
            loadComments(name, doc.data()[post].data.uid)
        })
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

    var viewPost = sessionStorage.getItem('viewPost')
    if (viewPost == 'null' || viewUser == " " || viewUser == "") {

    }
    else {
        window.setTimeout(function() {
            viewpost(viewPost)
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
        a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton eon-text centeredx "><i class="material-icons">fullscreen_exit</i></button>'
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
    }

    a = document.createElement('div')
    a.id = 'fullscreenel'
    a.classList.add('fullscreenelement')
    a.classList.add('animated')
    a.classList.add('fadeInUp')
    source = document.getElementById(id + 'imgelel').src
    a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton eon-text centeredx "><i class="material-icons">fullscreen_exit</i></button>'
    document.getElementById('body').appendChild(a)
    window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
    addWaves()
    sessionStorage.setItem('fullscreenon', 'yes')
}
function fullscreenrelevant(id) {
    $('body').css('overflow', 'hidden');
    if (sessionStorage.getItem('fullscreenon') == 'yes') {
        sessionStorage.setItem('fullscreenon', 'no')
    }
    else {
        a = document.createElement('div')
        a.id = 'fullscreenel'
        a.classList.add('fullscreenelement')
        a.classList.add('animated')
        a.classList.add('fadeInUp')
        source = document.getElementById(id + 'imgelelrelevant').src
        a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton eon-text centeredx "><i class="material-icons">fullscreen_exit</i></button>'
        document.getElementById('body').appendChild(a)
        window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
        addWaves()
        sessionStorage.setItem('fullscreenon', 'yes')
    }
}

function loadComments(id, poster) {
    document.getElementById('returntouser').onclick = function() {
        sessionStorage.setItem('skiponce123', 'true')
        usermodal(poster)
    }
    document.getElementById('returntopost').onclick = function() {
        sessionStorage.setItem('skiponce123', 'true')
        viewpost(id)
    }

    document.getElementById('readonlychip').setAttribute('style', 'display:none !important');
    unnewcomment()
    document.getElementById('addcommentbtn').setAttribute('style', 'display:none !important');

    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }
    db.collection('posts').doc('commentlikes').get().then(function(doc) {
        window.cachelikes = doc.data()
        db.collection("posts").doc('comments').get().then(function (doc) {
            sessionStorage.setItem('viewingdata', doc.data()[id].length)
    
            if (doc.data()[id].length == 0) {
                h = document.createElement('div')
                h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
                document.getElementById('commentsbox').appendChild(h)
            }
            
            if (doc.data()[id].length >= 50) {
                document.getElementById('readonlychip').setAttribute('style', 'display:inline-fullscreen_exit !important');
            }
            else {
                document.getElementById('addcommentbtn').setAttribute('style', 'display:block !important');
            }
            for (let i = 0; i < doc.data()[id].length; i++) {
                const element = doc.data()[id][i];
                buildcomment(element, id, i, cachelikes, false)
            }
            addWaves()
            sortUsingNestedText($('#commentsbox'), "div.card", "div.inline")
        })
    })
    history.pushState(null, "", "?comments=" + id)
    $('#commentModal').modal('toggle')
}

function likeComment(id, i, element) {

    element.firstElementChild.classList.add('yesliked')

    oldnum = parseInt(document.getElementById(id + i + 'commentcount').innerHTML)
    newnum = oldnum + 1
    document.getElementById(id + i + 'commentcount').innerHTML = newnum
    



    arname = id + '>withindex<' + i
    element.onclick = function() {
        Snackbar.show({showAction: false,pos: 'bottom-center',
            text: "Please wait..."
        })
    }

    db.collection('posts').doc('commentlikes').update({
        [arname]: firebase.firestore.FieldValue.arrayUnion(user.uid)
    }).then(function() {
        window.setTimeout(function() {
            element.onclick = function() {
                unLikeComment(id, i, element)
            }
        }, 1500)

    })

}

function unLikeComment(id, i, element) {

    element.firstElementChild.classList.remove('yesliked')

    oldnum = parseInt(document.getElementById(id + i + 'commentcount').innerHTML)
    newnum = oldnum - 1
    document.getElementById(id + i + 'commentcount').innerHTML = newnum

    arname = id + '>withindex<' + i
    element.onclick = function() {
        Snackbar.show({showAction: false,pos: 'bottom-center',
            text: "Please wait..."
        })
    }

    db.collection('posts').doc('commentlikes').update({
        [arname]: firebase.firestore.FieldValue.arrayRemove(user.uid)
    }).then(function() {
        window.setTimeout(function() {
            element.onclick = function() {
                likeComment(id, i, element)
            }
        }, 1500)
    })

}

function buildcomment(element, id, i, likes, forceliked) {
    a = document.createElement('div')
    a.classList.add('card')
    a.classList.add('animated')
    a.classList.add('singularcommentbox')
    a.classList.add('fadeIn')
    reportFunc = "reportComment('Post: " + id + " | Id: " + i + "')"
    likeCommentFunc = "likeComment('" + id + "', '" + i + "', this)"
    unlikeCommentFunc = "unLikeComment('" + id + "', '" + i + "', this)"
    userFunc33 = "usermodal('" + element.user + "'); sessionStorage.setItem('skiponce123', 'true'); $('#commentModal').modal('toggle')"
    likesname = id + '>withindex<' + i

    if (likes[likesname] == undefined) {
        likehtml = '<button onclick="' + likeCommentFunc + '" class="waves eon-text"><i class="material-icons noliked commentlikeicon">thumb_up</i><div id="' + id + i + 'commentcount' + '" class="inline">0</div></button>'
        if (forceliked) {
            likehtml = '<button data-toggle="tooltip" data-placement="top" title="You cannot unlike your own comment!" class="waves eon-text likedtooltip"><i class="material-icons noliked yesliked commentlikeicon">thumb_up</i><div id="' + id + i + 'commentcount' + '" class="inline">1</div></button>'
        }
    }
    else {
        commentLiked = false
        if (likes[likesname].includes(user.uid)) {
            commentLiked = true
        }
     
        if (commentLiked) {
            if (element.user == user.uid) {
                likehtml = '<button data-toggle="tooltip" data-placement="top" title="You cannot unlike your own comment!" class="waves eon-text likedtooltip"><i class="material-icons noliked yesliked commentlikeicon">thumb_up</i><div id="' + id + i + 'commentcount' + '" class="inline">' + likes[likesname].length + '</div></button>'
            }
            else {
                likehtml = '<button onclick="' + unlikeCommentFunc + '" class="waves eon-text"><i class="material-icons noliked yesliked commentlikeicon">thumb_up</i> <div id="' + id + i + 'commentcount' + '" class="inline">' + likes[likesname].length + '</div></button>'
            }
        }
        else {
            if (forceliked) {
                likehtml = '<button data-toggle="tooltip" data-placement="top" title="You cannot unlike your own comment!" class="waves eon-text likedtooltip"><i class="material-icons noliked yesliked commentlikeicon">thumb_up</i><div id="' + id + i + 'commentcount' + '" class="inline">' + likes[likesname].length + '</div></button>'
            }
            else {
                likehtml = '<button onclick="' + likeCommentFunc + '" class="waves eon-text"><i class="material-icons noliked commentlikeicon">thumb_up</i><div id="' + id + i + 'commentcount' + '" class="inline">' + likes[likesname].length + '</div></button>'
            }
        }

    }

    if (element.user == user.uid) {
        flaghtml = '<i data-toggle="tooltip" data-placement="top" title="This is your comment!" class="material-icons flagtooltip">flag</i>'
        reportbtnhtml = '<button data-toggle="tooltip" data-placement="top" title="You cannot report your own comment!" class="waves eon-text tooltipreport"><i class="material-icons">report_problem</i></button>'
    }
    else {
        flaghtml = ''
        reportbtnhtml = '<button onclick="' + reportFunc + '" class="waves eon-text"><i class="material-icons">report_problem</i></button>'
    }

    a.innerHTML = '<div class="card-body commentcard"><img class="centeredy commentpfp" onclick="' + userFunc33 + '" id="' + i + 'pfpel" alt=""><p class="commenttext">' + flaghtml + '<a class="userlinkoncomment">' + element.name + ' » </a> ' + element.content + '</p><div class="centeredy commentcontent">' + likehtml + reportbtnhtml + '</div>'
    document.getElementById('commentsbox').appendChild(a)
    addWaves()
    $('.tooltipreport').tooltip()
    $('.flagtooltip').tooltip()
    $('.likedtooltip').tooltip()
    addpfpcomment(element.user, i)
}

function likeuser(id) {

    db.collection('posts').doc('likes').get().then(function (doc) {
        alreadyliked = false
        if (doc.data()[id].includes(user.uid)) {
            alreadyliked = true
        }
     
        if (doc.data()[id][0] == user.uid) {
            Snackbar.show({showAction: false,pos: 'bottom-center', text: 'You cannot remove like on your own post.' })
        }

        else {
            if (alreadyliked == true) {

                prev = document.getElementById(id + 'eluser').innerHTML
                prev = prev.replace('<i class="material-icons posticonuser">favorite_border</i> ', '')
                future = parseInt(prev) - 1
                prev = document.getElementById(id + 'eluser').innerHTML = '<i class="material-icons posticonuser">favorite_border</i> ' + future

                db.collection('posts').doc('likes').update({
                    [id]: firebase.firestore.FieldValue.arrayRemove(user.uid)
                })
                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'eluser').classList.add('rubberBand')
                    }, 500)
                    window.setTimeout(function () {
                        document.getElementById(id + 'eluser').classList.remove('rubberBand')
                    }, 1300)
                } catch {
                }
            }
            else {
                prev = document.getElementById(id + 'eluser').innerHTML
                prev = prev.replace('<i class="material-icons posticonuser">favorite_border</i> ', '')
                future = parseInt(prev) + 1
                prev = document.getElementById(id + 'eluser').innerHTML = '<i class="material-icons posticonuser">favorite_border</i> ' + future

                db.collection('posts').doc('likes').update({
                    [id]: firebase.firestore.FieldValue.arrayUnion(user.uid)
                })
                try {
                    window.setTimeout(function () {
                        document.getElementById(id + 'eluser').classList.add('jello')
                    }, 500)

                    window.setTimeout(function () {
                        document.getElementById(id + 'eluser').classList.remove('jello')
                    }, 1300)
                } catch {
                }
            }
        }
    })
}

function like(id) {
    sessionStorage.setItem('skiponce2', "true")
    db.collection('posts').doc('likes').get().then(function (doc) {
        alreadyliked = false
        if (doc.data()[id].includes(user.uid)) {
            alreadyliked = true
        }

        if (doc.data()[id][0] == user.uid) {
            Snackbar.show({showAction: false,pos: 'bottom-center', text: 'You cannot remove like on your own post.' })
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

function unnewcomment() {
    document.getElementById('addcommentbtn').removeAttribute('style');
    document.getElementById('addcommentbtn').classList.remove('fadeOutUp')
    document.getElementById('addcommentbtn').classList.add('fadeInDown')
    document.getElementById('newcommentbox').style.display = 'none'
}

function newcomment() {
    document.getElementById('addcommentbtn').classList.remove('fadeInDown')
    document.getElementById('addcommentbtn').classList.add('fadeOutUp')
    document.getElementById('newcommentbox').style.display = 'block'

    window.setTimeout(function() {
        document.getElementById('addcommentbtn').setAttribute('style', 'display:none !important');
    }, 800)
}

function addComment(id) {
    text = document.getElementById('commentbox').value
    sessionStorage.setItem('wasitme', 'true')
    if (text == "" || text == " " || text == "  ") {
        Snackbar.show({showAction: false,pos: 'bottom-center', text: 'You must include content.' })
    }
    else {
        if (document.getElementById('commentbox').value.length > 200) {
            $('#commentModal').modal('toggle')
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
                db.collection('posts').doc('comments').get().then(function(doc) {
                    int = doc.data()[id].length
                    updatedint = int - 1
                    somename = id + '>withindex<' + updatedint
                    db.collection('posts').doc('commentlikes').update({
                        [somename]: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    }).then(function() {
                        document.getElementById('charcount').innerHTML = 'Post Comment (0/200 chars)'
                        a = {user: user.uid, name: user.displayName, content: text}
                        b = id
                        c = int
                        buildcomment(a, b, c, cachelikes, true)
                    })
                })
            });
        }
    };
}

function addpfpcomment(usr, int) {

    db.collection('users').doc(usr).get().then(function (doc) {
        document.getElementById(int + 'pfpel').src = doc.data().url
    })
}

async function addstuffuser(name, data, time, last) {
    if (data.data.url == 'eonnect-home-text_post') {
        // Text Post
        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "likeuser('" + name + "')"
        commentFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); loadComments('" + name + "', '" + data.data.uid + "')"
        infoFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); info('" + name + "')"
        if (data.data.url_theme == 'deep') {
            textCardClass = 'superdeepcard'
            textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + data.data.url_content + '</b></p></div>'            
        }
        else {
            textCardClass = data.data.url_theme + 'card'
            textStuff = '<div class="card-body"><h5 class="posttextclass">' + data.data.url_content + '</h5></div>'
        }
        postFunc = "viewpost('" + name + "');sessionStorage.setItem('skiponce3', 'true')"
        a.innerHTML = '<div class="card usercard animated fadeIn"><div onclick="' + postFunc + '" class="card ' + textCardClass + '">' + textStuff + '</div><br><center><br><center><button id="' + name + 'eluser" onclick="' + likeFunc + '" class="waves eon-text heart postuserbtn animated"><i class="material-icons posticonuser">favorite_border</i> ' + data.data.likes.length + '</button><button id="' + name + 'commentEluser" onclick="' + commentFunc + '" class="waves eon-text postuserbtn animated"><i class="material-icons posticonuser">chat_bubble_outline</i> ' + '</button><button id="' + name + 'infoEluser" onclick="' + infoFunc + '" class="waves eon-text postuserbtn animated"><i class="material-icons posticonuser">info</i></button><br></div></div><br></center><br></div>'
        document.getElementById(name + 'usersshell').appendChild(a)
        db.collection('posts').doc('comments').get().then(function (docee) {
            bambam = docee.data()[name].length
            document.getElementById(name + "commentEluser").innerHTML = '<i class="material-icons posticonuser">chat_bubble_outline</i> ' + bambam
        })

        if (last) {
            addWaves()
            window.setTimeout(function() {
                resizeAllGridItemsUser()
            }, 1000)
        }
        return;
    }

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.data.uid + '/' + data.data.file).getDownloadURL().then(function (url) {

        a = document.createElement('div')
        a.classList.add('content')
        likeFunc = "likeuser('" + name + "')"
        commentFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); loadComments('" + name + "', '" + data.data.uid + "')"
        infoFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"
        postFunc = "viewpost('" + name + "');sessionStorage.setItem('skiponce3', 'true')"
        a.innerHTML = '<div class="card usercard animated fadeIn"><img onclick="' + postFunc + '" id="' + name + 'imgelelel" class="animated fadeIn userimg" src="' + url + '"><br><center><br><p class="captiontxt">' + data.data.caption + '</p><center><button id="' + name + 'eluser" onclick="' + likeFunc + '" class="waves eon-text heart postuserbtn animated"><i class="material-icons posticonuser">favorite_border</i> ' + data.data.likes.length + '</button><button id="' + name + 'commentEluser" onclick="' + commentFunc + '" class="waves eon-text postuserbtn animated"><i class="material-icons posticonuser">chat_bubble_outline</i> ' + '</button><button id="' + name + 'infoEluser" onclick="' + infoFunc + '" class="waves eon-text postuserbtn animated"><i class="material-icons posticonuser">info</i></button><button onclick="' + fullFunc + '" class="waves eon-text postuserbtn animated"><i class="material-icons posticonuser">fullscreen</i></button><br></div></div><br></center><br></div>'
        document.getElementById(name + 'usersshell').appendChild(a)
        db.collection('posts').doc('comments').get().then(function (docee) {
            bambam = docee.data()[name].length
            document.getElementById(name + "commentEluser").innerHTML = '<i class="material-icons posticonuser">chat_bubble_outline</i> ' + bambam
        })

        if (last) {
            addWaves()
            window.setTimeout(function() {
                resizeAllGridItemsUser()
            }, 1000)
        }

    }).catch(function (error) {
        console.log(error)
    });
}

async function usermodal(uid) {
    window.currentUserScrollCount = 0
    previousview = sessionStorage.getItem("currentlyviewinguser")
    document.getElementById('usermodalfollowtext').style.visibility = 'hidden'

    if (previousview == uid) {
        $('#userModal').modal('show')
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
    }

    else {
        $('#followerselementbox').empty()
        $('#followingelementbox').empty()
        sessionStorage.setItem('currentlyviewinguser', uid)
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
        $('#usergrid').empty()
        $('#userModal').modal('show')


        db.collection('users').doc(uid).get().then(function (userdoc) {
            doc = userdoc
            username = doc.data().username
            useruid = doc.data().uid
            document.getElementById('usermodaltitle').innerHTML = doc.data().name + '<span class="badge badge-dark userbadge">@' + doc.data().username + '</span>'
            document.getElementById('usermodalpfp').src = doc.data().url

            if (doc.data().gradient == undefined) {
                document.getElementById('usermodalpfp').classList.remove('customgradientprofileimg')
            }
            else {
                document.getElementById('usermodalpfp').classList.add('customgradientprofileimg')
                document.getElementById('dynamicstyle3').innerHTML = '.customgradientprofileimg {background-image: linear-gradient(white, white), linear-gradient(45deg, #' + doc.data().gradient.a + ', #' + doc.data().gradient.b + ') !important}'
            }

            if (doc.data().bio == undefined || doc.data().bio == null || doc.data().bio == "" || doc.data().bio == " ") {
                document.getElementById('usermodalbio').innerHTML = ""
             }
            else { document.getElementById('usermodalbio').innerHTML = doc.data().bio }
            document.getElementById('userrep').innerHTML = doc.data().rep

            $('#connections').empty()

            // Connections -> Twitter
            if (doc.data().twitter !== undefined) {
                if (doc.data().twitter.enabled) {
                    hs = document.createElement('button')
                    hs.classList.add('eon-text')
                    hs.classList.add('connectionbtn')
                    hs.onclick = function() {
                        $('#userModal').modal('toggle')
                        gotwitter(doc.data().twitter.id)
                    }
                    hs.innerHTML = '<img class="imginbtn" src="assets/Twitter_Logo_Blue.png"></img>'
                    document.getElementById("connections").appendChild(hs)
                }
            }

            // Connections -> GitHub
            if (doc.data().github !== undefined) {
                if (doc.data().github.enabled) {
                    hs = document.createElement('button')
                    hs.classList.add('eon-text')
                    hs.classList.add('connectionbtn')
                    hs.onclick = function() {
                        $('#userModal').modal('toggle')
                        gogithub(doc.data().github.id)
                    }
                    var customProps = window.getComputedStyle(document.documentElement);
                    hs.innerHTML = '<img class="imginbtn" src="assets/GitHub-Mark-' + customProps.getPropertyValue('--content-primary').replace(/\s/g, '').charAt(0).toUpperCase() + customProps.getPropertyValue('--content-primary').slice(1) + '.png"></img>'
                    document.getElementById("connections").appendChild(hs)
                }
            }

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
            if (followers.includes(user.uid)) {
                isfollow = true
            }

            if (isfollow) {
                if (user.uid !== uid) {

                
                document.getElementById('followbtn').innerHTML = 'unfollow'

                document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
                document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
                window.setTimeout(function() {
                    document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
                    document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
                }, 500)
                

                document.getElementById('followbtn').onclick = function () {
                    unfollow(uid, username)
                }
                loaduserposts(uid)
                loaduserfollowdetails(userdoc.data())

                }
            }
            else {
                if (user.uid !== uid) {

                    document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
                    document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
                    window.setTimeout(function() {
                        document.getElementById('usermodalfollowtext').style.visibility = 'hidden'
                    }, 500)

                    document.getElementById('followbtn').innerHTML = 'follow'
                    document.getElementById('followbtn').onclick = function () {
                        follow(uid, username)
                    }

                    if (userdoc.data().type == 'private') {
                        document.getElementById('privatewarning').style.display = 'block'
                        requested = userdoc.data().requested
                        isrequest = false
                        if (requests.includes(uid)) {
                            isrequest = true
                        }

                        if (isrequest == true) {
                            document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
                            document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
                            window.setTimeout(function() {
                                document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
                                document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
                                document.getElementById('usermodalfollowtext').innerHTML = '<i class="material-icons" id="followicon">access_time</i> Requested'
                            }, 500)

                            document.getElementById('followbtn').innerHTML = 'cancel request'
                            document.getElementById('followbtn').onclick = function () {
                                follow(uid, username)
                            }
                        }
                        else {
                            document.getElementById('followbtn').innerHTML = 'request'
                            document.getElementById('followbtn').onclick = function () {
                                follow(uid, username)
                            } 
                        }
                    }
                    else {
                        if (user.uid !== uid) {
                            loaduserposts(uid)
                            loaduserfollowdetails(userdoc.data())
                        }
                    }
                }
            }

        })
        try {
            if (user.uid == uid) {
                document.getElementById('ownwarning').style.display = 'block'
                document.getElementById('followbtn').innerHTML = 'unfollow'
                document.getElementById('followbtn').onclick = function () {
                    Snackbar.show({showAction: false,pos: 'bottom-center', pos: 'bottom-left', text: "You can't unfollow yourself." })
                }
                loaduserposts(uid)
                db.collection('users').doc(user.uid).get().then(function(doc) {
                    loaduserfollowdetails(doc.data())
                })
            }   
        } catch {
            // USER IS NOT DEFINED
        }
    }
}

function addpfpfollowbox(uid) {
    db.collection('users').doc(uid).get().then(function(doc) {
        document.getElementById(uid + 'followboxelementid').src = doc.data().url
    })
}

function addpfpfollowingbox(uid) {
    db.collection('users').doc(uid).get().then(function(doc) {
        document.getElementById(uid + 'followingboxelementid').src = doc.data().url
    })
}


function loaduserfollowdetails(data) {
    db.collection('app').doc('details').get().then(function(doc) {   

        for (let i = 0; i < data.followers.length; i++) {
            const uid = data.followers[i];
            place = doc.data().map.indexOf(uid)   
            name = doc.data().usernames[place]

            k = document.createElement('a')
            k.onclick = function() {
                hidefollowing()
                hidefollowers()
                $('#userModal').modal('hide')
                window.setTimeout(function() {
                    sessionStorage.setItem('skiponce123', 'true')
                    usermodal(uid)
                }, 1000)
            }
            k.classList.add('list-group-item')
            k.classList.add('waves-effect')
            k.classList.add('waves-light')
            k.innerHTML = '<img id="' + uid + 'followboxelementid" src="https://i.imgur.com/PL0xMvQ.jpg" class="followerphoto" alt=""><div class="inline folowtext">' + name + '</div>'
            document.getElementById('followerselementbox').appendChild(k)
            addpfpfollowbox(uid)

        }

        for (let i = 0; i < data.following.length; i++) {
            const uid = data.following[i];
            place = doc.data().map.indexOf(uid)   
            name = doc.data().usernames[place]

            k = document.createElement('a')
            k.onclick = function() {
                hidefollowing()
                hidefollowers()
                $('#userModal').modal('hide')
                window.setTimeout(function() {
                    sessionStorage.setItem('skiponce123', 'true')
                    usermodal(uid)
                }, 1000)
            }
            k.classList.add('list-group-item')
            k.classList.add('waves-effect')
            k.classList.add('waves-light')
            k.innerHTML = '<img id="' + uid + 'followingboxelementid" src="https://i.imgur.com/PL0xMvQ.jpg" class="followerphoto" alt=""><div class="inline folowtext">' + name + '</div>'
            document.getElementById('followingelementbox').appendChild(k)

            addpfpfollowingbox(uid)

        }

        addWaves()

    })


}

function loaduserposts(uid) {

    anarray = []
    db.collection('posts').doc('posts').get().then(function (doc) {
        userpostcount = 0
        latest = doc.data().latest
        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] == undefined) {
            }
            else {
                
                if (doc.data()[i].data.uid == uid) {
                    anarray.push({ name: i, data: doc.data()[i], time: doc.data()[i].timestamp })
                }
            }
        }

        anarray.reverse()
        sessionStorage.setItem("InfUserScrollData", JSON.stringify(anarray))
        builduser()

    }).catch(function (error) {
        console.log(error)
    })
}

function builduser() {
    userarray = sessionStorage.getItem('InfUserScrollData')
    userarray = JSON.parse(userarray)


    for (let i = 0; i < currentUserScrollCount; i++) {
        userarray.shift()
    }

    userarray = userarray.slice(0, infiniteScrollCount);
    currentUserScrollCount = currentUserScrollCount + infiniteScrollCount

    for (let i = 0; i < userarray.length; i++) {
        name = userarray[i].name;
        data = userarray[i].data;
        time = userarray[i].time;

        z = document.createElement('div')
        z.id = name + 'usersshell'
        z.classList.add('usershell')

        document.getElementById('usergrid').appendChild(z)

        arraylengthminusone = userarray.length - 1

        if (i == arraylengthminusone) {
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
        if (doc.data()[id].data.caption == undefined) {
            document.getElementById('infoe').innerHTML = "Caption N/A."
        }
        
        document.getElementById('postbtnfrominfo').onclick = function () {
            sessionStorage.setItem('tocomments', true)
            viewpost(id)
        }
        document.getElementById('commentbtnfrominfo').onclick = function () {
            sessionStorage.setItem('tocomments', true)
            loadComments(id, doc.data()[id].data.uid)
        }
        document.getElementById('userbtnfrominfo').onclick = function () {
            sessionStorage.setItem('touser', true)
            usermodal(doc.data()[id].data.uid)
        }

        if (doc.data()[id].data.uid == user.uid) {
            document.getElementById('deletebtnfrominfo').onclick = function () {

                document.getElementById('deletebtnfrominfo').innerHTML = '<i class="material-icons gradicon">delete_forever</i> confirm';
                document.getElementById('deletebtnfrominfo').classList.add('deletebtnexpanded')
                document.getElementById('deletebtnfrominfo').classList.add('fadeIn')
                document.getElementById('deletebtnfrominfo').onclick = function() {
                    deletepost(id, doc.data()[id].data.uid)
                }
            }

            document.getElementById('deletebtnfrominfo').style.display = 'inline-block'
        }
        else {
            document.getElementById('deletebtnfrominfo').setAttribute('style', 'display:none !important');
        }

        document.getElementById('reportbtnfrominfo').onclick = function () {
            x = confirm('Are you sure you would like to report this post?')
            if (x) {
                db.collection('posts').doc('posts').get().then(function (doc) {
                    content = doc.data()[id]

                    db.collection('posts').doc('reported').update({
                        [id]: { name: id, timestamp: content.timestamp, data: { caption: content.data.caption, file: content.data.file, name: content.data.name, type: content.data.type, uid: content.data.uid } }
                    }).then(function () {
                        Snackbar.show({showAction: false,pos: 'bottom-center', text: 'Post was reported' })
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

function deletepost(id, credentials) {
    if (credentials !== user.uid) {
        error('Suspicious activity detected. Your account has been flagged.')
        reportUser(user.uid)
    }
    else {

    document.getElementById('deletebtnfrominfo').classList.remove('fadeIn')
    document.getElementById('deletebtnfrominfo').innerHTML = '<i class="material-icons gradicon">restore_from_trash</i> deleting...';
    document.getElementById('deletebtnfrominfo').classList.add('deletebtnexpandeddone')
    document.getElementById('deletebtnfrominfo').classList.add('fadeOutUp')

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
        $('#infomodallist').children().each(function(i, el) {
            randomnum = Math.floor(Math.random() * 3)
            if (randomnum == 0 || randomnum == 1) {
                el.classList.add('animated')
                el.classList.add('hinge')
                el.classList.add('slower')
                bam = Math.floor(Math.random() * 3)
                el.style.animationDelay = bam + 's'
            }
        })
        $('#infobtngroup').children().each(function(i, el) {
            randomnum = Math.floor(Math.random() * 3)
            if (randomnum == 0 || randomnum == 1) {
                el.classList.add('animated')
                el.classList.add('hinge')
                el.classList.add('slower')
                bam = Math.floor(Math.random() * 3)
                el.style.animationDelay = bam + 's'
            }
        })


        window.setTimeout(function() {
            $('#infobtngroup').children().each(function(index) {
                this.classList.remove('animated')
                this.classList.remove('hinge')
                this.classList.remove('slower')
            })


            $('#infomodallist').children().each(function(index) {
                this.classList.remove('animated')
                this.classList.remove('hinge')
                this.classList.remove('slower')
            })
        }, 5000)

        window.setTimeout(function() {
            $('#infoModal').modal('hide')
            Snackbar.show({showAction: false,pos: 'bottom-center', text: 'Your post was deleted.' })

            try {
                document.getElementById(id + "relevantshell").classList.add('animated')
                document.getElementById(id + "relevantshell").classList.add('zoomOut')
                window.setTimeout(function() {document.getElementById(id + "relevantshell").remove()}, 500)   
            } catch (error) {
                
            }
            try {
                document.getElementById(id + "shell").classList.add('animated')
                document.getElementById(id + "shell").classList.add('zoomOut')
                window.setTimeout(function() {document.getElementById(id + "shell").remove()}, 500)
            } catch (error) {
    
            }

            localStorage.removeItem('currentlyviewinguser')

            document.getElementById('deletebtnfrominfo').onclick = function () {

                document.getElementById('deletebtnfrominfo').innerHTML = '<i class="material-icons gradicon">delete_forever</i> confirm';
                document.getElementById('deletebtnfrominfo').classList.add('deletebtnexpanded')
                document.getElementById('deletebtnfrominfo').classList.add('fadeIn')
                document.getElementById('deletebtnfrominfo').onclick = function() {
                    deletepost(id, doc.data()[id].data.uid)
                }
            }
            document.getElementById('deletebtnfrominfo').innerHTML = '<i class="material-icons gradicon">delete</i>'
            document.getElementById('deletebtnfrominfo').classList.remove('deletebtnexpanded')
            document.getElementById('deletebtnfrominfo').classList.remove('deletebtnexpandeddone')

        }, 4000)
    })
}
}

function reportComment(id, index) {
    console.log("REPORTNG FUNCTION");
    console.log(id);
    console.log(index);
}

function reportUser(id) {
    alert('Incomplete report function. \n\n\nTarget: ' + id)
    console.log('report user function??');
}

function refreshcomments(id) {
    document.getElementById('readonlychip').setAttribute('style', 'display:none !important');
    unnewcomment()
    document.getElementById('addcommentbtn').setAttribute('style', 'display:none !important');

    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }
    db.collection('posts').doc('commentlikes').get().then(function(doc) {
        window.cachelikes = doc.data()
        db.collection("posts").doc('comments').get().then(function (doc) {
            sessionStorage.setItem('viewingdata', doc.data()[id].length)
    
            if (doc.data()[id].length == 0) {
                h = document.createElement('div')
                h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
                document.getElementById('commentsbox').appendChild(h)
            }
            
            if (doc.data()[id].length >= 50) {
                document.getElementById('readonlychip').setAttribute('style', 'display:inline-fullscreen_exit !important');
            }
            else {
                document.getElementById('addcommentbtn').setAttribute('style', 'display:block !important');
            }
            for (let i = 0; i < doc.data()[id].length; i++) {
                const element = doc.data()[id][i];
                buildcomment(element, id, i, cachelikes, false)
            }
            addWaves()
            sortUsingNestedText($('#commentsbox'), "div.card", "div.inline")
        })
    })
}

function listencomments() {
    commentslistener = db.collection('posts').doc('comments').onSnapshot(function (doc) {    
        viewing = sessionStorage.getItem('viewing')
            if (viewing !== 'stoplookinghere') {
                savedsession = doc.data()[parseInt(sessionStorage.getItem('viewing'), 10)].length   
                if (savedsession !== parseInt(sessionStorage.getItem('viewingdata'), 10)) {
                    wasitme = sessionStorage.getItem('wasitme')
                    
                    if (wasitme == 'true') {
                        sessionStorage.setItem('addedcomment', 'false')
                    }

                    else {
                        x = parseInt(sessionStorage.getItem('viewing'), 10)
                        Snackbar.show({pos: 'bottom-center', pos: 'bottom-left', text: "New comments are added.", onActionClick: function (element) { $(element).css('opacity', 0); refreshcomments(x) }, actionText: "refresh" })
                    }
                }
            }

        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] !== undefined) {
                try {
                    document.getElementById(i + 'commentEl').innerHTML = '<i class="material-icons posticon">chat_bubble_outline</i> ' + doc.data()[i].length
                    $('#' + i + 'commentEl').attr('data-original-title', 'View Comments').tooltip('show').tooltip('hide')
                }
                catch (error) {}
                try {
                    document.getElementById(i + 'commentElrelevant').innerHTML = '<i class="material-icons posticon">chat_bubble_outline</i> ' + doc.data()[i].length   
                    $('#' + i + 'commentElrelevant').attr('data-original-title', 'View Comments').tooltip('show').tooltip('hide')
                } catch (error) {}
                addWaves()
            }   
        }
    })
}

function addpfprelevant(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurlrelevant').src = doc.data().url
        $('#' + docid + "pfpelurlrelevant").attr('data-original-title', 'View User').tooltip('show').tooltip('hide')
        
        if (doc.data().gradient == undefined) {
            gradientstyle = ''
        }
        else {
            gradientstyle = 'linear-gradient(white, white), linear-gradient(45deg, #' + doc.data().gradient.a + ', #' + doc.data().gradient.b + ')'
        }

        $('#' + docid + 'pfpelurlrelevant').css('background-image', gradientstyle)
    })
}

function addpfp(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurl').src = doc.data().url
        $('#' + docid + "pfpelurl").attr('data-original-title', 'View User').tooltip('show').tooltip('hide')

        if (doc.data().gradient == undefined) {
            gradientstyle = ''
        }
        else {
            gradientstyle = 'linear-gradient(white, white), linear-gradient(45deg, #' + doc.data().gradient.a + ', #' + doc.data().gradient.b + ')'
        }

        $('#' + docid + 'pfpelurl').css('background-image', gradientstyle)
    })
}

function listenlikes() {
    likeslistener = db.collection("posts").doc('likes').onSnapshot(function (doc) {

        for (let i = 0; i < doc.data().latest + 1; i++) {
            try {
                $('#' + i + 'elcaptionrelevant').tooltip()
            } catch (error) {}
            try {
                $('#' + i + 'elcaption').tooltip()    
            } catch (error) {}
            
            if (doc.data()[i] !== undefined) {
    
                isliked = false
                if (doc.data()[i].includes(user.uid)) {
                    isliked = true
                }

                if (isliked) {
                    try {
                        document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" style="color: red;" class="material-icons posticon animated">favorite</i> ' + doc.data()[i].length
                        $('#' + i + 'el').attr('data-original-title', 'Liked').tooltip('show').tooltip('hide') 
                    } catch (error) {}
                    try {
                        document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" style=" color: red;" class="material-icons posticon animated">favorite</i> ' + doc.data()[i].length
                        $('#' + i + 'elrelevant').attr('data-original-title', 'Liked').tooltip('show').tooltip('hide')
                    } catch (error) {} 
                }
                else {
                    if (doc.data()[i].length == 0) {
                        try {
                            document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" class="material-icons posticon animated">favorite_border</i> '
                            $('#' + i + 'el').attr('data-original-title', 'Like').tooltip('show').tooltip('hide')
                        } catch (error) { }
                        try {
                            document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" class="material-icons posticon animated">favorite_border</i> '    
                            $('#' + i + 'elrelevant').attr('data-original-title', 'Like').tooltip('show').tooltip('hide')
                        } catch (error) {}
                    }
                    else {
                        try {
                            document.getElementById(i + 'el').innerHTML = '<i id="' + i + 'elicon" class="material-icons posticon animated">favorite_border</i> ' + doc.data()[i].length
                            $('#' + i + 'el').attr('data-original-title', 'Like').tooltip('show').tooltip('hide')   
                        } catch (error) {}
                        try {
                            document.getElementById(i + 'elrelevant').innerHTML = '<i id="' + i + 'eliconrelevant" class="material-icons posticon animated">favorite_border</i> ' + doc.data()[i].length    
                            $('#' + i + 'elrelevant').attr('data-original-title', 'Like').tooltip('show').tooltip('hide')
                        } catch (error) {}

                    }
                } 
            }   
        }
        addWaves()
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


$('#postModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce1234') == "true") {
        sessionStorage.setItem('skiponce1234', "false")
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

$('#commentModal').on('hidden.bs.modal', function () {
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
    hidefollowers()
    hidefollowing()
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
                Snackbar.show({pos: 'bottom-center', pos: 'bottom-left', text: "Posts have been modified.", onActionClick: function (element) { $(element).css('opacity', 0); refreshhome() }, actionText: "refresh" })
            };
        };
    });
}

function follow(uid, name) {
    db.collection('users').doc(uid).get().then(function (doc) {
        if (doc.data().type == 'private') {

            db.collection('users').doc(uid).update({
                requested: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(function () {
                Snackbar.show({pos: 'bottom-center', text: 'Requested to follow ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); unfollow(uid) }, actionText: 'cancel' })
                document.getElementById('followbtn').innerHTML = 'cancel request'
                document.getElementById('followbtn').onclick = function () {
                    unrequest(uid, username)
                }

                document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
                document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
                document.getElementById('usermodalfollowtext').style.visibility = 'hidden'
                window.setTimeout(function() {
                    document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
                    document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
                    document.getElementById('usermodalfollowtext').innerHTML = '<i class="material-icons" id="followicon">access_time</i> Requested'
                }, 500)

            })
        }
        else {
            db.collection('users').doc(user.uid).update({
                following: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(function () {
                db.collection('users').doc(uid).update({
                    followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }).then(function () {
                    Snackbar.show({pos: 'bottom-center', text: 'Started following ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); unfollow(uid) }, actionText: 'Unfollow' })
                    document.getElementById('followbtn').innerHTML = 'unfollow'
                    document.getElementById('followbtn').onclick = function () {
                        unfollow(uid, username)
                    }
                    document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
                    document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
                    document.getElementById('usermodalfollowtext').style.visibility = 'hidden'
                    window.setTimeout(function() {
                        document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
                        document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
                        document.getElementById('usermodalfollowtext').innerHTML = '<i class="material-icons" id="followicon">done</i> Following'
                    }, 500)

                })
            })
        }
    })


}

function unfollow(uid, name) {

    db.collection('users').doc(user.uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(uid)
    }).then(function () {
        db.collection('users').doc(uid).update({
            followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
        }).then(function () {
            Snackbar.show({pos: 'bottom-center', text: 'Stopped following ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); follow(uid, name) }, actionText: 'undo' })
            document.getElementById('followbtn').innerHTML = 'follow'
            document.getElementById('followbtn').onclick = function () {
                follow(uid, username)
            }
            
            document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
            document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
            window.setTimeout(function() {
                document.getElementById('usermodalfollowtext').classList.add('fadeOutDown')
                document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
            }, 500)
        })
    })
}

function unrequest(uid, name) {

    db.collection('users').doc(uid).update({
        followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
    }).then(function () {
        Snackbar.show({pos: 'bottom-center', text: 'Cancelled follow request for ' + name + '.', onActionClick: function (element) { $(element).css('opacity', 0); follow(uid, name) }, actionText: 'undo' })
        document.getElementById('followbtn').innerHTML = 'request'
        document.getElementById('followbtn').onclick = function () {
            follow(uid, username)
        }

        document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
        document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
        window.setTimeout(function() {
            document.getElementById('usermodalfollowtext').classList.add('fadeOutDown')
            document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
        }, 500)

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
            // Image Tags
            tags = $("#tagsinput1").tagsinput('items')
            if (tags.length > 8) {
                // More than 8 tags
                error('You have added more than 8 tags.')
                $('#uploadmodal').modal('toggle')
                return;
            }

            document.getElementById('tagsinput1').value = ''
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
                                    tags: tags,
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
                        Snackbar.show({showAction: false,pos: 'bottom-center', text: 'Your photo was uploaded.' })
                        $('#uploadmodal').modal('toggle')
                        document.getElementById('captionel').style.display = 'none'
                        document.getElementById('blah').style.display = 'none'
                        document.getElementById('captionel').style.display = 'none'
                        document.getElementById('rereshtbn').click()
                    });
                });
            })
        };
    };
}

function refreshhome() {
    error('Function refreshhome() deprecated.')
}

function refresh(btn) {

    btn.onclick = function() {
        Snackbar.show({showAction: false,pos: 'bottom-center',text: "Please wait before requesting more posts."})
    }
    window.setTimeout(function() {
        btn.onclick = function() {
            refresh(this)
        }
    }, 12000)

    document.getElementById('containerhometab').classList.remove('fadeIn')
    document.getElementById('containerhometab').classList.add('animated')
    document.getElementById('containerhometab').classList.add('fadeOut')
    document.getElementById('containerhometab').classList.add('fast')

    window.setTimeout(function() {
        load()
        window.setTimeout(function() {
            document.getElementById('containerhometab').classList.remove('fadeOut')
            document.getElementById('containerhometab').classList.add('fadeIn')

            window.setTimeout(function() {
                if (sessionStorage.getItem('view') == 'relevant') {
                    dontshowall()
                }
                else {
                    showall()
                }
            }, 300)
        }, 1000)


    }, 600)

}

function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
        var vA = $(keySelector, a).text();
        var vB = $(keySelector, b).text();
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
}

// sortUsingNestedText($('#commentsbox'), "div.card", "div.inline")

function showfollowers() {
    hidefollowing()
    document.getElementById('followersbox').style.display = 'block'
    document.getElementById('followersbox').classList.add('fadeInUp')
    document.getElementById('followersbox').classList.add('fast')
    document.getElementById('followersbox').classList.remove('fadeOutDown')
    document.getElementById('viewfollowers').innerHTML = '<i class="material-icons cancelshowbtn">cancel</i>'
    document.getElementById('viewfollowers').onclick = function() {
        hidefollowers() 
    }
}

function hidefollowers() {
    document.getElementById('followersbox').classList.remove('fadeInUp')
    document.getElementById('followersbox').classList.add('fadeOutDown')
    document.getElementById('followersbox').classList.add('fast')
    document.getElementById('viewfollowers').innerHTML = 'view'
    document.getElementById('viewfollowers').onclick = function() {
        showfollowers() 
    }
    window.setTimeout(() => {
        document.getElementById('followersbox').style.display = 'block'
    }, 800)
}
function showfollowing() {
    hidefollowers()
    document.getElementById('followingbox').style.display = 'block'
    document.getElementById('followingbox').classList.add('fadeInUp')
    document.getElementById('followingbox').classList.remove('fadeOutDown')
    document.getElementById('viewfollowing').innerHTML = '<i class="material-icons cancelshowbtn">cancel</i>'
    document.getElementById('viewfollowing').onclick = function() {
        hidefollowing() 
    }
}

function hidefollowing() {
    document.getElementById('followingbox').classList.remove('fadeInUp')
    document.getElementById('followingbox').classList.add('fadeOutDown')
    document.getElementById('viewfollowing').innerHTML = 'view'
    document.getElementById('viewfollowing').onclick = function() {
        showfollowing() 
    }
}

function selecttheme(theme) {
    // New post text new text post 
    text = document.getElementById('textpostbox').value

    if (text == '' || text == " " || text == null || text == undefined) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
    }
    else {
        if (document.getElementById('textpostbox').value.length > 320) {
            error('Your text contains more than 320 characters.')
            $('#uploadmodal').modal('toggle')
        }
        else {
           // Text Tags
            tags = $("#tagsinput2").tagsinput('items')
            if (tags.length > 8) {
               // More than 8 tags
               error('You have added more than 8 tags.')
               $('#uploadmodal').modal('toggle')
               return;
            }
            document.getElementById('tagsinput2').value = ''
            document.getElementById('textpostbox').value = ''
            $('#uploadmodal').modal('toggle')
            db.collection('posts').doc('posts').get().then(function (doc) {
                num = doc.data().latest
                newnum = num + 1
                
                db.collection('posts').doc('posts').update({
                    [newnum]: {
                        name: newnum,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        data: {
                            likes: ['first'],
                            url: 'eonnect-home-text_post',
                            url_theme: theme,
                            url_content: text,
                            file: 'eonnect-home-text_post',
                            tags: tags,
                            name: user.displayName,
                            type: document.getElementById('privateinp2').checked,
                            uid: user.uid,
                        }
                    },
                    latest: newnum
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
                    Snackbar.show({showAction: false,pos: 'bottom-center', text: 'Your text was uploaded.' })
                    edittext()
                    newpost_back()
                    $('#selecttext').addClass('hidden')
                    
                    document.getElementById('captionel').style.display = 'none'
                    document.getElementById('blah').style.display = 'none'
                    document.getElementById('captionel').style.display = 'none'
                    document.getElementById('rereshtbn').click()
                });

            })
        };
    };
}

function viewpost(id) {
    $('#userModal').modal('hide')

    previouspost = sessionStorage.getItem("currentlyviewingpost")
    if (previouspost == id) {
        $('#postModal').modal('show')
        window.history.pushState(null, '', '/eonnect/app.html?post=' + id);
    }
    else {
        // Generate New
        window.history.pushState(null, '', '/eonnect/app.html?post=' + id);
        sessionStorage.setItem("currentlyviewingpost", id)
        // $('#postfull').empty()
        db.collection('posts').doc('posts').get().then(function(doc) {
            if (!doc.data()[id].data.type && doc.data()[id].data.uid !== user.uid) {
                // Check if friends
                db.collection('users').doc(doc.data()[id].data.uid).get().then((userdoc) => {
                    statusFriends = false
                    if (userdoc.data().followers !== undefined) {
                        if (userdoc.data().followers.includes(user.uid)) {
                            statusFriends = true
                        }
                    }
                    if (statusFriends) {
                        thegoahead(id, doc.data()[id], userdoc.data())
                    }
                    else {
                        $('#postfull').html('<p>This post is private and you are not following them o.O</p>')
                    }
                })
                return;
            }
            else {
                thegoahead(id, doc.data()[id])
            }
        
        })
        $('#postModal').modal('show')
    }
}

async function thegoahead(id, data, userdata) {
    if (userdata == undefined) {
        userdata = await db.collection('users').doc(data.data.uid).get()
        userdata = userdata.data()
    }

    // Get user details
    commentFunc = "loadComments('" + id + "', '" + data.data.uid + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"
    infoFunc = "info('" + id + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"
    userFunc = "usermodal('" + data.data.uid + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"

    caption = data.data.caption
    if (data.data.caption == undefined) {
        caption = data.data.url_content
    }

    if (data.data.url == 'eonnect-home-text_post') {
        // Text post
        if (data.data.url_theme == 'deep') {
            textCardClass = 'superdeepcard'
            textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + data.data.url_content + '</b></p></div>'            
        }
        else {
            textCardClass = data.data.url_theme + 'card'
            textStuff = '<div class="card-body"><h5 class="posttextclass">' + data.data.url_content + '</h5></div>'
        }
        b = '<div class="card postfullcard ' + textCardClass + '">' + textStuff + '</div>'
    }
    else {
        b = '<img src="' + data.data.url + '" class="postimg shadow" alt="">'
    }

    tags = data.data.tags
    if (tags == undefined || tags.length == 0) {
        tags = []
    }
    tagselement = ''
    for (let i = 0; i < tags.length; i++) {
        const element = tags[i];
        tagselement = tagselement + '<span class="badge badge-pill badge-primary">' + tags[i] + '</span>'
    }

    a = '<div class="row"><div class="col-8 fullpostcontainer"><center>' + b + '</center></div><div class="col-4 sidebarcontentparent"><hr id="dividerpostmodal" class="vertical-divider"><div id="sidebarcontent"> <nav class="navbar animated fadeInDown"> <button onclick="' + userFunc + '"  class="eon-text"> <img src="' + userdata.url + '" class="postmodalpfp" alt="" > ' + userdata.name + ' </button><ul class="navbar-nav mr-auto"></ul> <button onclick="' + commentFunc + '" class="eon-text navbtnicon animated fadeInUp delay1"><i class="material-icons">comment</i></button> <button onclick="' + infoFunc + '" class="eon-text navbtnicon animated fadeInUp delay2"><i class="material-icons">info</i></button> </nav><hr> <br><br><blockquote class="blockquote"><p class="mb-0">' + caption + '</p></blockquote><br>' + tagselement + '</div></div></div>'
    $('#postfull').html(a)
}