storageRef = firebase.storage().ref();
db = firebase.firestore()

async function load() {

    // Clear past posts on first load
    $('#grid').empty()
    $('#gridrelevant').empty()

    load_posts_all()
}

async function newpost() {

    var caption = document.getElementById('captioninput').value

    if (caption == '' || caption == " " || caption == null) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    if (document.getElementById('captioninput').value.length > 100) {
        error('Caption contains more than 100 characters.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // Image Tags
    tags = $("#tagsinput1").tagsinput('items')

    if (tags.length > 8) {
        error('You have added more than 8 tags.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // Approved, create records.

    document.getElementById('tagsinput1').value = ''
    document.getElementById('captioninput').value = ''

    file = document.getElementById('imgInp').files[0]
    filenoext = file.name.replace(/\.[^/.]+$/, "")
    ext = file.name.split('.').pop();
    valuedate = new Date().valueOf()
    filename = filenoext + valuedate + '.' + ext

    var fileRef = storageRef.child('users/' + user.uid + '/' + filename);

    await fileRef.put(file)

    url = await fileRef.getDownloadURL()

    doc = await db.collection('new_posts').add({
        caption: caption,
        comments: 0,
        file_url: url,
        file_name: filename,
        latest_comment: "null",
        latest_comment_photo: "null",
        likes: 0,
        photo_url: cacheuser.url,
        private: document.getElementById('privateinp').checked,
        tags: tags,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        username: cacheuser.username,
        reported: false,
        report_weight: 0,
        name: cacheuser.name
    })

    await db.collection('new_posts').doc(doc.id).collection('comments').doc('comments').set({
        comments: []
    })

    await db.collection('new_posts').doc(doc.id).collection('likes').doc('a').set({
        status: false,
    })

    // Post uploaded.

    Snackbar.show({
        showAction: false,
        pos: 'bottom-center',
        text: 'Your photo was uploaded.'
    })

    $('#uploadmodal').modal('toggle')

    document.getElementById('captionel').style.display = 'none'
    document.getElementById('blah').style.display = 'none'
    document.getElementById('captionel').style.display = 'none'

    // document.getElementById('rereshtbn').click()
}

async function load_posts_all() {

    query = await db.collection('new_posts')
        .orderBy("timestamp", "desc")
        .limit(5)
        .get()

    window.lastVisible = query.docs[query.docs.length - 1]
    build_posts_all(query.docs)
}

async function load_next_all() {
    query = await db.collection("new_posts")
        .orderBy("timestamp", "desc")
        .startAfter(lastVisible)
        .limit(1)
        .get()

    window.lastVisible = query.docs[query.docs.length - 1]
    build_posts_all(query.docs)
}

async function build_posts_all(query) {
    // Query array contains documents
    for (let i = 0; i < query.length; i++) {
        // query[i].data()

        if (query[i].data().file_url == 'eonnect-home-text_post') {
            a = document.createElement('div')
            a.classList.add('postshell')

            switch (query[i].data().url_theme) {
                case 'deep':
                    textCardClass = 'superdeepcard'
                    textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + query[i].data().url_content + '</b></p></div>'
                    break;
                case 'light':
                    textCardClass = 'lightcard'
                    textStuff = '<div class="card-body"><h5 class="posttextclass">' + query[i].data().url_content + '</h5></div>'
                case 'dark':
                    textCardClass = 'darkcard'
                    textStuff = '<div class="card-body"><h5 class="posttextclass">' + query[i].data().url_content + '</h5></div>'
                default:
                    return;
            }
            userlikedoc = await db.collection('new_posts').doc(query[i].id).collection('likes').doc(user.uid).get()
            if (userlikedoc.exists && userlikedoc.data().status) {
                desiredLikeAction = 'unlike'
                desiredLikeAction2 = 'heartactive'
                desiredLikeAction3 = 'favorite'
            }
            else {
                desiredLikeAction = 'like'
                desiredLikeAction2 = 'heart'
                desiredLikeAction3 = 'favorite_border'
            }

            a.innerHTML = `<div class="content"><img style="z-index: 200;"><div onclick="viewpost('${query[i].id}')" class="card ${textCardClass}">'${textStuff}'</div><nav class="navbar navbar-expand-sm"><img onclick="usermodal('${query[i].data().uid}')" class="postpfp" id="${query[i].id}pfp" src="${query[i].data().photo_url}"><h4 class="postname centeredy">${query[i].data().name}</h4><ul class="navbar-nav mr-auto"> </ul> <button id="${query[i].id}likebtn" onclick="${desiredLikeAction}('${query[i].id}')" class="eon-text ${desiredLikeAction2} postbuttons heart"><i id="${query[i].id}likebtnicon" class="material-icons posticon animated">${desiredLikeAction3}</i> <span id="${query[i].id}likeCount">${query[i].data().likes}</span></button><button id="${query[i].id}commentBtn" onclick="loadComments('${query[i].id}', '${query[i].data().uid}')" class="eon-text postbuttons"><i class="material-icons posticon">chat_bubble_outline</i> ${query[i].data().comments} </button></nav></div><button id="${query[i].id}infoBtn" onclick="info('${query[i].id}')" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr></div>`
            document.getElementById('grid').appendChild(a)
            continue;
        }

        a = document.createElement('div')
        a.classList.add('postshell')

        userlikedoc = await db.collection('new_posts').doc(query[i].id).collection('likes').doc(user.uid).get()
        if (userlikedoc.exists && userlikedoc.data().status) {
            desiredLikeAction = 'unlike'
            desiredLikeAction2 = 'heart heartactive'
            desiredLikeAction3 = 'favorite'
        }
        else {
            desiredLikeAction = 'like'
            desiredLikeAction2 = 'heart'
            desiredLikeAction3 = 'favorite_border'
        }

        a.innerHTML = `<div class="content"><img onclick="viewpost('${query[i].id}')" id="${query[i].id}img" class="postimage" src="${query[i].data().file_url}"><nav class="navbar navbar-expand-sm"><img onclick="usermodal('${query[i].data().uid}')" class="postpfp" id="${query[i].id}pfp" src="${query[i].data().photo_url}"><h4 class="postname centeredy">${query[i].data().name}</h4><ul class="navbar-nav mr-auto"> </ul> <button id="${query[i].id}likebtn" onclick="${desiredLikeAction}('${query[i].id}')" class="eon-text ${desiredLikeAction2} postbuttons heart"><i id="${query[i].id}likebtnicon" class="material-icons posticon animated">${desiredLikeAction3}</i> <span id="${query[i].id}likeCount">${query[i].data().likes}</span></button> <button id="${query[i].id}commentbtn" onclick="loadComments('${query[i].id}', '${query[i].data().uid}')" class="eon-text postbuttons"><i class="material-icons posticon">chat_bubble_outline</i> ${query[i].data().comments}</button></nav><button onclick="fullscreen('${query[i].id}')" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="${query[i].id}infoElrelevant" onclick="info('${query[i].id}')" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr></div>`
        document.getElementById('grid').appendChild(a)

    }
    showall()
}

async function like(post) {
    document.getElementById(`${post}likebtn`).onclick = () => {
        $(`#${post}likebtnicon`).addClass('shake')
        window.setTimeout(() => {
            $(`#${post}likebtnicon`).removeClass('shake')
        }, 600)
    }

    $(`#${post}likebtn`).toggleClass('heartactive');
    $(`#${post}likebtnicon`).html('favorite');
    $(`#${post}likebtnicon`).addClass('rubberBand')
    window.setTimeout(() => {
        $(`#${post}likebtnicon`).removeClass('rubberBand')    
    }, 600);

    $(`#${post}likeCount`).html(parseInt($(`#${post}likeCount`).html()) + 1)
    
    await db.collection('new_posts').doc(post).collection('likes').doc(user.uid).set({
        status: true,
    })

    window.setTimeout(() => {
        document.getElementById(`${post}likebtn`).onclick = () => {
            unlike(post)
        }
    }, 1750);

}

async function unlike(post) {
    document.getElementById(`${post}likebtn`).onclick = () => {
        $(`#${post}likebtnicon`).addClass('shake')
        window.setTimeout(() => {
            $(`#${post}likebtnicon`).removeClass('shake')
        }, 600)
    }

    $(`#${post}likeCount`).html(parseInt($(`#${post}likeCount`).html()) - 1)

    $(`#${post}likebtn`).toggleClass('heartactive')
    $(`#${post}likebtnicon`).html('favorite_border');
    $(`#${post}likebtnicon`).addClass('jello')
    window.setTimeout(() => {
        $(`#${post}likebtnicon`).removeClass('jello')    
    }, 600);
    
    await db.collection('new_posts').doc(post).collection('likes').doc(user.uid).set({
        status: false,
    })

    window.setTimeout(() => {
        document.getElementById(`${post}likebtn`).onclick = () => {
            like(post)
        }
    }, 1750);
}

async function info(post) {
    doc = await db.collection('new_posts').doc(post).get()

    $('#infoa').html(doc.data().file_name)
    $('#infob').html(doc.data().timestamp.toDate())
    $('#infoc').html(doc.id)
    $('#infod').html(doc.data().uid)
    $('#infoe').html(doc.data().caption)

    if (doc.data().caption == undefined) {
        $('#infoe').html('No Caption')
    }

    document.getElementById('postbtnfrominfo').onclick = function () {
        sessionStorage.setItem('tocomments', true)
        viewpost(post)
    }

    document.getElementById('commentbtnfrominfo').onclick = function () {
        sessionStorage.setItem('tocomments', true)
        loadComments(post, doc.data().uid)
    }

    document.getElementById('userbtnfrominfo').onclick = function () {
        sessionStorage.setItem('touser', true)
        usermodal(doc.data().uid)
    }

    if (doc.data().uid == user.uid) {
        document.getElementById('deletebtnfrominfo').onclick = function () {
            document.getElementById('deletebtnfrominfo').innerHTML = '<i class="material-icons gradicon">delete_forever</i> confirm';
            document.getElementById('deletebtnfrominfo').classList.add('deletebtnexpanded')
            document.getElementById('deletebtnfrominfo').classList.add('fadeIn')
            document.getElementById('deletebtnfrominfo').onclick = function () {
                deletepost(post, doc.data().uid)
            }
        }
        document.getElementById('deletebtnfrominfo').style.display = 'inline-block'
    } else {
        document.getElementById('deletebtnfrominfo').setAttribute('style', 'display:none !important');
    }

    document.getElementById('reportbtnfrominfo').onclick = function () {
        x = confirm('Are you sure you would like to report this post?')
        if (x) {
            // reportpost() maybe
        } else {
            window.setTimeout(function () {
                info(post)
            }, 500)
        }
    }

    $('#infoModal').modal('toggle')
    window.history.pushState(null, '', '/eonnect/app.html?info=' + post);

}

async function fullscreen(post) {
    $('body').css('overflow', 'hidden');

    doc = await db.collection('new_posts').doc(post).get()

    a = document.createElement('div')
    a.id = 'fullscreenel'
    a.classList.add('fullscreenelement')
    a.classList.add('animated')
    a.classList.add('fadeInUp')
    source = doc.data().file_url
    a.innerHTML = '<img class="fullscreenimageelement centered" src="' + source + '"> <button onclick="unfullscreen()" class="fullscreenbutton centeredx "><i class="material-icons">fullscreen_exit</i></button>'
    document.getElementById('body').appendChild(a)
    window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + post);
    addWaves()
    sessionStorage.setItem('fullscreenon', 'yes')
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

async function usermodal(uid) {

    previousview = sessionStorage.getItem("currentlyviewinguser")

    if (previousview == uid) {
        $('#userModal').modal('show')
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
    } else {

        sessionStorage.setItem('currentlyviewinguser', uid)
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);

        $('#followerscontainer').empty()
        $('#followingcontainer').empty()
        $('#usergrid').empty()
        $('#userModal').modal('show')
        $('#connections').empty()

        doc = await db.collection('users').doc(uid).get()
        userdoc = doc
        document.getElementById('usermodaltitle').innerHTML = doc.data().name + '<span class="badge badge-dark userbadge">@' + doc.data().username + '</span>'
        document.getElementById('usermodalpfp').src = doc.data().url

        if (doc.data().gradient == undefined) {
            document.getElementById('usermodalpfp').classList.remove('customgradientprofileimg')
        } else {
            document.getElementById('usermodalpfp').classList.add('customgradientprofileimg')
            document.getElementById('dynamicstyle3').innerHTML = '.customgradientprofileimg {background-image: linear-gradient(white, white), linear-gradient(45deg, #' + doc.data().gradient.a + ', #' + doc.data().gradient.b + ') !important}'
        }

        if (doc.data().bio == undefined || doc.data().bio == null || doc.data().bio == "" || doc.data().bio == " ") {
            document.getElementById('usermodalbio').innerHTML = ""
        } else {
            document.getElementById('usermodalbio').innerHTML = doc.data().bio
        }

        document.getElementById('userrep').innerHTML = doc.data().rep


        // Connections -> Twitter
        if (doc.data().twitter !== undefined) {
            if (doc.data().twitter.enabled) {
                hs = document.createElement('button')
                hs.classList.add('eon-text')
                hs.classList.add('connectionbtn')
                hs.onclick = function () {
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
                hs.onclick = function () {
                    $('#userModal').modal('toggle')
                    gogithub(doc.data().github.id)
                }
                var customProps = window.getComputedStyle(document.documentElement);
                hs.innerHTML = '<img class="imginbtn" src="assets/GitHub-Mark-' + customProps.getPropertyValue('--content-primary').replace(/\s/g, '').charAt(0).toUpperCase() + customProps.getPropertyValue('--content-primary').slice(1) + '.png"></img>'
                document.getElementById("connections").appendChild(hs)
            }
        }

        // FOLLOW STUFF

        userfollowdoc = await db.collection('follow').doc(uid).get()

        $('#userfollowing').html('0')
        $('#userfollowers').html('0')

        if (userfollowdoc.exists) {
            $('#userfollowing').html(nFormatter(userfollowdoc.data().following, 1))
            $('#userfollowers').html(nFormatter(userfollowdoc.data().followers, 1))
    
            if(typeof(userfollowdoc.data().following) !== 'number') {
                $('#userfollowing').html('0')
            }
            if(typeof(userfollowdoc.data().followers) !== 'number') {
                $('#userfollowers').html('0')
            }
        }

        followdoc = await db.collection('follow').doc(uid).collection('followers').doc(user.uid).get()
        isFollow = false
        if (followdoc.exists && followdoc.data().status) {
            isFollow = true
        }

        if (isFollow && user.uid !== uid) {
            $('#followbtn').html('unfollow')
            $('#usermodalfollowtext').removeClass('fadeInUp')
            $('#usermodalfollowtext').removeClass('fadeOutDown')
            $('#usermodalfollowtext').css('visiblity', 'hidden')
            window.setTimeout(() => {
                $('#usermodalfollowtext').addClass('fadeInUp')
                $('#usermodalfollowtext').removeClass('hidden')
                $('#usermodalfollowtext').css('visiblity', 'visible')
                $('#usermodalfollowtext').css('display', 'block')
            }, 50);

            document.getElementById('followbtn').onclick = function () {
                unfollow(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
            }

            // loaduserposts(uid)
            // loaduserfollowdetails(userdoc.data())
        } else {
            if (user.uid !== uid) {
                // Not following

                $('#usermodalfollowtext').removeClass('fadeInUp')
                $('#usermodalfollowtext').removeClass('fadeOutDown')

                window.setTimeout(() => {
                    $('#usermodalfollowtext').addClass('fadeInUp')
                    $('#usermodalfollowtext').css('visiblity', 'hidden')
                }, 50);

                $('#followbtn').html('follow')

                document.getElementById('followbtn').onclick = (() => {
                    follow(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
                })

                if (userdoc.data().type == 'private') {
                    requesteddoc = await db.collection('follow').doc(uid).collection('requested').doc(user.uid).get()
                    isRequested = false
                    if (doc.exists && followdoc.data().status) {
                        isRequested = true
                    }
                    $('#privatewarning').css('display', 'block')
                    if (isRequested) {

                        $('#usermodalfollowtext').removeClass('fadeInUp')
                        $('#usermodalfollowtext').removeClass('fadeOutDown')

                        window.setTimeout(() => {
                            $('#usermodalfollowtext').addClass('fadeInUp')
                            $('#usermodalfollowtext').css('visiblity', 'visible')
                            $('#usermodalfollowtext').css('display', 'block')
                            $('#usermodalfollowtext').html(`<i class="material-icons" id="followicon">access_time</i> Requested`)
                        }, 50);

                        $('#followbtn').html('cancel request')

                        document.getElementById('followbtn').onclick = function () {
                            cancel_request(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
                        }
                    } else {
                        $('#followbtn').html('request')

                        document.getElementById('followbtn').onclick = function () {
                            request(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
                        }
                    }
                } else {
                    // User is not private, and you are not following
                    if (user.uid !== uid) {
                        // loaduserposts(uid)
                        // loaduserfollowdetails(userdoc.data())
                    }
                }
            }
        }

        try {
            if (user.uid == uid) {
                $('#ownwarning').css('display', 'block')
                $('#followbtn').html('unfollow')
                document.getElementById('followbtn').onclick = function () {
                    // Why they tryna unfollow themselves
                    $('#followbtn').addClass('animated')
                    $('#followbtn').addClass('heartBeat')
                    window.setTimeout(() => {
                        $('#followbtn').removeClass('heartBeat')
                        $('#followbtn').removeClass('heartBeat')
                    }, 800);
                }

                // loaduserposts(uid)
                // loadfollowdetailsig
            }
        } catch {
            // USER IS NOT DEFINED
        }
    }

}

async function follow(uid, username, url, name) {
    $('#userfollowers').html(parseInt($('#userfollowers').html()) + 1)
    // Profile public and boutta follow

    await db.collection('follow').doc(uid).collection('followers').doc(user.uid).set({
        status: true,
        name: cacheuser.name,
        uid: user.uid,
        username: cacheuser.username,
        photo_url: cacheuser.url
    })
    await db.collection('follow').doc(user.uid).collection('following').doc(uid).set({
        status: true,
        name: name,
        uid: uid,
        username: username,
        photo_url: url
    })

    Snackbar.show({
        pos: 'bottom-center',
        text: `Started following ${name}.`
    })

    $('#followbtn').html('unfollow')

    document.getElementById('followbtn').onclick = function () {
        unfollow(uid, username, url, name)
    }

    $('#usermodalfollowtext').removeClass('fadeInUp')
    $('#usermodalfollowtext').removeClass('fadeOutDown')
    $('#usermodalfollowtext').css('visibility', 'hidden')

    window.setTimeout(() => {
        $('#usermodalfollowtext').addClass('fadeInUp')
        $('#usermodalfollowtext').removeClass('hidden')
        $('#usermodalfollowtext').css('visibility', 'visible')
        $('#usermodalfollowtext').html('<i class="material-icons" id="followicon">done</i> Following')
    }, 50)

}

async function unfollow(uid, username, url, name) {
    $('#userfollowers').html(parseInt($('#userfollowers').html()) - 1)

    await db.collection('follow').doc(uid).collection('followers').doc(user.uid).set({
        status: false,
        name: cacheuser.name,
        uid: user.uid,
        username: cacheuser.username,
        photo_url: cacheuser.url
    })
    await db.collection('follow').doc(user.uid).collection('following').doc(uid).set({
        status: false,
        name: name,
        uid: uid,
        username: username,
        photo_url: url
    })
    Snackbar.show({
        pos: 'bottom-center',
        text: 'Stopped following ' + name + '.'
    })
    $('#followbtn').html('follow')

    document.getElementById('followbtn').onclick = function () {
        follow(uid, username, url, name)
    }

    $('#usermodalfollowtext').removeClass('fadeInUp')
    $('#usermodalfollowtext').removeClass('fadeOutDown')

    window.setTimeout(() => {
        $('#usermodalfollowtext').addClass('fadeOutDown')
        $('#usermodalfollowtext').css('visibility', 'visible')
        $('#usermodalfollowtext').html('<i class="material-icons" id="followicon">done</i> Following')
        $('usermodalfollowtext').css('display', 'block')
    }, 50)

}

async function request(uid, username) {

    db.collection('users').doc(uid).update({
        requested: firebase.firestore.FieldValue.arrayUnion(user.uid)
    }).then(function () {

        document.getElementById('followbtn').innerHTML = 'cancel request'
        document.getElementById('followbtn').onclick = function () {
            unrequest(uid, username)
        }

        document.getElementById('usermodalfollowtext').classList.remove('fadeInUp')
        document.getElementById('usermodalfollowtext').classList.remove('fadeOutDown')
        document.getElementById('usermodalfollowtext').style.visibility = 'hidden'
        window.setTimeout(function () {
            document.getElementById('usermodalfollowtext').style.visibility = 'visible';
            document.getElementById('usermodalfollowtext').style.display = 'block'
            document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
            document.getElementById('usermodalfollowtext').innerHTML = '<i class="material-icons" id="followicon">access_time</i> Requested'
        }, 50)

    })
}

function cancel_request(uid, username) {

}

function showfollowers() {
    uid = sessionStorage.getItem('currentlyviewinguser')

    if ($('#followerscontainer').is(':empty')) {
        for (let i = 0; i < followersdoc.data().followers.length; i++) {
            u = document.createElement("div")
            u.innerHTML = followersdoc.data().followers[i].name
            document.getElementById('followerscontainer').appendChild(u)
        }
    }
}

function showfollowing() {
    uid = sessionStorage.getItem('currentlyviewinguser')

    if ($('#followingcontainer').is(':empty')) {
        for (let i = 0; i < followingdoc.data().following.length; i++) {
            u = document.createElement("div")
            u.innerHTML = followingdoc.data().following[i].name
            document.getElementById('followingcontainer').appendChild(u)
        }
    }
}

async function viewpost(id) {
    $('#userModal').modal('hide')

    previouspost = sessionStorage.getItem("currentlyviewingpost")
    if (previouspost == id) {
        $('#postModal').modal('show')
        window.history.pushState(null, '', '/eonnect/app.html?post=' + id);
    } else {
        // Generate New
        window.history.pushState(null, '', '/eonnect/app.html?post=' + id);
        sessionStorage.setItem("currentlyviewingpost", id)
        $('#postfull').empty()

        doc = await db.collection('new_posts').doc(id).get()
        if (doc.data().private && doc.data().uid !== user.uid) {
            // Post is private, check if friends
            userdoc = await db.collection('follow').doc(doc.data().uid).collection('followers').doc(user.uid).get()
            if (userdoc.exists && userdoc.data().status) {
                approvePost(id, doc.data(), userdoc.data())
                $('#postModal').modal('show')
                return;
            }
            $('#postfull').html('<p>This post is private and you are not following them o.O</p>')
            $('#postModal').modal('show')
            return;
        } 
        approvePost(id, doc.data())
        $('#postModal').modal('show')
    }
}

async function approvePost(id, data, ) {
    // Get user details
    commentFunc = "loadComments('" + id + "', '" + data.uid + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"
    infoFunc = "info('" + id + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"
    userFunc = "usermodal('" + data.uid + "'); sessionStorage.setItem('skiponce1234', 'true'); $('#postModal').modal('hide')"

    caption = data.caption

    if (data.caption == undefined) {
        caption = data.url_content
    }

    if (data.file_url == 'eonnect-home-text_post') {
        // Text post
        if (data.url_theme == 'deep') {
            textCardClass = 'superdeepcard'
            textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + data.url_content + '</b></p></div>'
        } else {
            textCardClass = data.url_theme + 'card'
            textStuff = '<div class="card-body"><h5 class="posttextclass">' + data.url_content + '</h5></div>'
        }
        b = '<div class="card postfullcard ' + textCardClass + '">' + textStuff + '</div>'
    } else {
        b = '<img src="' + data.file_url + '" class="postimg shadow" alt="">'
    }

    tags = data.tags
    if (tags == undefined || tags.length == 0) {
        tags = []
    }
    tagselement = ''
    for (let i = 0; i < tags.length; i++) {
        tagselement = tagselement + '<span class="badge badge-pill badge-primary">' + tags[i] + '</span>'
    }

    a = '<div class="row"><div class="col-8 fullpostcontainer"><center>' + b + '</center></div><div class="col-4 sidebarcontentparent"><hr id="dividerpostmodal" class="vertical-divider"><div id="sidebarcontent"> <nav class="navbar animated fadeInDown"> <button onclick="' + userFunc + '"  class="eon-text"> <img src="' + data.photo_url + '" class="postmodalpfp" alt="" > ' + data.name + ' </button><ul class="navbar-nav mr-auto"></ul> <button onclick="' + commentFunc + '" class="eon-text navbtnicon animated fadeInUp delay1"><i class="material-icons">comment</i></button> <button onclick="' + infoFunc + '" class="eon-text navbtnicon animated fadeInUp delay2"><i class="material-icons">info</i></button> </nav><hr> <br><br><blockquote class="blockquote"><p class="mb-0">' + caption + '</p></blockquote><br>' + tagselement + '</div></div></div>'
    $('#postfull').html(a)
    addWaves()
}

async function newTextPost(theme) {
    text = document.getElementById('textpostbox').value

    if (text == '' || text == " " || text == null || text == undefined) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    if (document.getElementById('textpostbox').value.length > 320) {
        error('Your text contains more than 320 characters.')
        $('#uploadmodal').modal('toggle')
        return
    }

    // Text Tags
    tags = $("#tagsinput2").tagsinput('items')
    if (tags.length > 8) {
        // More than 8 tags
        error('You have added more than 8 tags.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // All good

    document.getElementById('tagsinput2').value = ''
    document.getElementById('textpostbox').value = ''

    $('#uploadmodal').modal('toggle')

    doc = await db.collection('new_posts').add({
        comments: 0,
        file_url: 'eonnect-home-text_post',
        url_theme: theme,
        url_content: text,
        file: 'eonnect-home-text_post',
        latest_comment: "null",
        latest_comment_photo: "null",
        likes: 0,
        photo_url: cacheuser.url,
        private: document.getElementById('privateinp2').checked,
        tags: tags,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        username: cacheuser.username,
        reported: false,
        report_weight: 0,
        name: cacheuser.name
    })

    await db.collection('new_posts').doc(doc.id).collection('comments').doc('comments').set({
        comments: []
    })

    await db.collection('new_posts').doc(doc.id).collection('likes').doc('a').set({
        status: false
    })

    Snackbar.show({
        showAction: false,
        pos: 'bottom-center',
        text: 'Your text was uploaded.'
    })
    edittext()
    newpost_back()
    $('#selecttext').addClass('hidden')

    $('#captionel').css('display', 'none')
    $('#blah').css('display', 'none')
    $('#captionel').css('display', 'none')
    // $('#rereshtbn').click()
}


function unnewcomment() {
    $('#addcommentbtn').removeAttr('style')
    $('#addcommentbtn').removeClass('fadeOutUp')
    $('#addcommentbtn').addClass('fadeInDown')
    $('#addcommentbtn').css('display', 'none')
}

function newcomment() {
    $('#addcommentbtn').removeClass('fadeInDown')
    $('#addcommentbtn').addClass('fadeOutUp')
    $('#newcommentbox').css('display', 'block')

    window.setTimeout(function() {
        document.getElementById('addcommentbtn').setAttribute('style', 'display:none !important');
    }, 800)
}

async function addComment(id) {
    text = document.getElementById('commentbox').value
    sessionStorage.setItem('wasitme', 'true')
    if (text == "" || text == " " || text == "  ") {
        Snackbar.show({showAction: false,pos: 'bottom-center', text: 'You must include content.' })
        return;
    }
    
    if (document.getElementById('commentbox').value.length > 200) {
        $('#commentModal').modal('toggle')
        error('Too many characters. The limit is 200.')
        return;
    }

    // Approved. Add comment.

    document.getElementById('commentbox').value = ''
    updatechars()
    await db.collection('new_posts').doc(id).collection('comments').doc('comments').update({
        comments: firebase.firestore.FieldValue.arrayUnion({
            content: text,
            likes: [],
            replies: [],
            name: cacheuser.name,
            uid: user.uid,
            photo_url: cacheuser.url,
            username: cacheuser.username
        })
    })
}



async function loadComments(id, poster) {

    document.getElementById('returntouser').onclick = function () {
        sessionStorage.setItem('skiponce123', 'true')
        usermodal(poster)
    }
    document.getElementById('returntopost').onclick = function () {
        sessionStorage.setItem('skiponce123', 'true')
        viewpost(id)
    }
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }

    document.getElementById('readonlychip').setAttribute('style', 'display:none !important');
    document.getElementById('addcommentbtn').setAttribute('style', 'display:none !important');
    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()

    unnewcomment()
    
    doc = await db.collection('new_posts').doc(id).collection('comments').doc('comments').get()
    
    comments = doc.data().comments

    if (comments.length == 0) {
        h = document.createElement('div')
        h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        document.getElementById('commentsbox').appendChild(h)
    }

    document.getElementById('addcommentbtn').setAttribute('style', 'display:block !important');

    // FEATURE: ADD COMMENT LIMIT PICKER
    if (comments.length >= 1200) {
        document.getElementById('readonlychip').setAttribute('style', 'display:inline-fullscreen_exit !important');
    }
    
    for (let i = 0; i < comments.length; i++) {

        comments[i]
        o = document.createElement('div')
        o.innerHTML = comments[i].content + ' by ' + comments[i].name
        document.getElementById('commentsbox').appendChild(o)

        // buildcomment(element, id, i, cachelikes, false)
        // sortUsingNestedText($('#commentsbox'), "div.card", "div.inline")
    }   
            
    history.pushState(null, "", "?comments=" + id)
    $('#commentModal').modal('toggle')
}


function updatechars() {
    window.setTimeout(() => {
        length = document.getElementById('commentbox').value.length
        document.getElementById('charcount').innerHTML = 'Post Comment (' + length + '/200 characters)'
        if (length > 200) {
            $('#charcount').removeClass('btn-eon-one')
            $('#charcount').addClass('btn-eon-four')
            $('#charcount').removeClass('yellow')
            $('#charcount').addClass('shake')
            $('#charcount').removeClass('infinite')
        }
        else {
            if (length >= 190) {
                $('#charcount').removeClass('btn-eon-one')
                $('#charcount').addClass('yellow')
                $('#charcount').removeClass('btn-eon-four')
                $('#charcount').addClass('pulse')
                $('#charcount').removeClass('shake')
                $('#charcount').addClass('infinite')
            }
            else {
                if (length >= 180) {
                    $('#charcount').removeClass('btn-eon-one')
                    $('#charcount').addClass('yellow')
                    $('#charcount').removeClass('btn-eon-four')
                    $('#charcount').addClass('pulse')
                    $('#charcount').removeClass('shake')
                    $('#charcount').removeClass('infinite')
                }
                else {
                    $('#charcount').addClass('btn-eon-one')
                    $('#charcount').removeClass('btn-eon-four')
                    $('#charcount').removeClass('shake')
                    $('#charcount').removeClass('yellow')
                    $('#charcount').removeClass('infinite')
                }
            }
        }
    }, 10);
}
