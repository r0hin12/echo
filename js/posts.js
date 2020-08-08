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
        likes: [],
        photo_url: cacheuser.url,
        private: document.getElementById('privateinp').checked,
        tags: tags,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        username: cacheuser.username,
        reported: false,
        report_weight: 0,
    })

    await db.collection('new_posts').doc(doc.id).collection('comments').doc('comments').set({
        comments: []
    })

    // Post uploaded.

    Snackbar.show({showAction: false,pos: 'bottom-center', text: 'Your photo was uploaded.' })

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

    window.lastVisible = query.docs[query.docs.length-1]
    build_posts(query.docs)
}

async function load_next() {
    query = await db.collection("new_posts")
    .orderBy("timestamp", "desc")
    .startAfter(lastVisible)
    .limit(1)
    .get()
    
    window.lastVisible = query.docs[query.docs.length-1]
    build_posts(query.docs)
}

async function build_posts(query) {
    // Query array contains documents
    for (let i = 0; i < query.length; i++) {
        // query[i].data()

        a = document.createElement('div')
        a.classList.add('postshell')
        a.innerHTML = `<div class="content"><img onclick="viewpost('${query[i].id}')" id="${query[i].id}imgelelrelevant" class="postimage" src="${query[i].data().file_url}"><nav class="navbar navbar-expand-sm"><img onclick="usermodal('${query[i].data().uid}')" class="postpfp" id="${query[i].id}pfpelurlrelevant" src="${query[i].data().photo_url}" data-original-title="View User" style="background-image: linear-gradient(white, white), linear-gradient(45deg, rgb(19, 84, 122), rgb(128, 208, 199));"><h4 class="postname centeredy">${query[i].data().name}<i id="${query[i].id}verifiedelementrelevant" data-toggle="tooltip" data-placement="top" title="" class="material-icons verified" data-original-title="Verified">verified_user</i></h4><ul class="navbar-nav mr-auto"> </ul>    <button title="" id="${query[i].id}elcaptionrelevant" class="postbuttons" data-original-title="Wowww"><i class="material-icons posticon animated">subject</i></button>   <button id="${query[i].id}elrelevant" onclick="like('${query[i].id}')" class="postbuttons heart" data-original-title="Liked"><i id="${query[i].id}eliconrelevant" style=" color: red;" class="material-icons posticon animated">favorite</i> 2</button><button id="${query[i].id}commentElrelevant" onclick="loadComments('${query[i].id}', ${query[i].data().uid})" class=" postbuttons" data-original-title="View Comments"><i class="material-icons posticon">chat_bubble_outline</i> 1</button></nav><button onclick="fullscreen('${query[i].id}')" class="postbuttons postfullscreen"><i class="material-icons">fullscreen</i></button><button id="${query[i].id}infoElrelevant" onclick="info('${query[i].id}')" class="postbuttons postinfo"><i class="material-icons-outlined posticon infobtn">info</i></button><hr></div>`
        document.getElementById('grid').appendChild(a)

    }
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
            document.getElementById('deletebtnfrominfo').onclick = function() {
                deletepost(post, doc.data().uid)
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
            // reportpost() maybe
        }
        else {
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
    }

    else {

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
        }
        
        else {
            document.getElementById('usermodalpfp').classList.add('customgradientprofileimg')
            document.getElementById('dynamicstyle3').innerHTML = '.customgradientprofileimg {background-image: linear-gradient(white, white), linear-gradient(45deg, #' + doc.data().gradient.a + ', #' + doc.data().gradient.b + ') !important}'
        }

        if (doc.data().bio == undefined || doc.data().bio == null || doc.data().bio == "" || doc.data().bio == " ") {
            document.getElementById('usermodalbio').innerHTML = ""
        }

        else { 
            document.getElementById('usermodalbio').innerHTML = doc.data().bio 
        }

        document.getElementById('userrep').innerHTML = doc.data().rep

    
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

        // FOLLOW STUFF

        followersdoc = await db.collection('users').doc(uid).collection('follow').doc('followers').get()
        followingdoc = await db.collection('users').doc(uid).collection('follow').doc('following').get()
            
        document.getElementById('userfollowing').innerHTML = nFormatter(followingdoc.data().following.length, 1)
        document.getElementById('userfollowers').innerHTML = nFormatter(followersdoc.data().followers.length, 1)
            
        if (followersdoc.data().followers.filter(e => e.uid === user.uid).length > 0 && user.uid !== uid) {
            $('#followbtn').html('unfollow')
            $('#usermodalfollowtext').removeClass('fadeInUp')
            $('#usermodalfollowtext').removeClass('fadeOutDown')
            $('#usermodalfollowtext').css('visiblity', 'hidden')
            window.setTimeout(() => {
                $('#usermodalfollowtext').addClass('fadeInUp')
                $('#usermodalfollowtext').css('visiblity', 'visible') 
                $('#usermodalfollowtext').css('display', 'block')
            }, 500);
            
            document.getElementById('followbtn').onclick = function () {
                unfollow(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
            }

            // loaduserposts(uid)
            // loaduserfollowdetails(userdoc.data())
        }
        else {
            if (user.uid !== uid) {
                // Not following

                $('#usermodalfollowtext').removeClass('fadeInUp')
                $('#usermodalfollowtext').removeClass('fadeOutDown')

                window.setTimeout(() => {
                    $('#usermodalfollowtext').addClass('fadeInUp')
                    $('#usermodalfollowtext').css('visiblity', 'hidden') 
                }, 500);

                $('#followbtn').html('follow')

                $('#followbtn').html('follow')

                document.getElementById('followbtn').onclick = (() => {
                    follow(uid, userdoc.data().username, userdoc.data().url, userdoc.data().name)
                })
                    
                if (userdoc.data().type == 'private') {
                    requesteddoc = await db.collection('users').doc(uid).collection('follow').doc('requested').get()

                    $('#privatewarning').css('display', 'block')
                    
                    if (requesteddoc.data().requested.filter(e => e.uid === user.uid).length > 0 ) {

                        $('#usermodalfollowtext').removeClass('fadeInUp')
                        $('#usermodalfollowtext').removeClass('fadeOutDown')

                        window.setTimeout(() => {
                            $('#usermodalfollowtext').addClass('fadeInUp')
                            $('#usermodalfollowtext').css('visiblity', 'visible') 
                            $('#usermodalfollowtext').css('display', 'block') 
                            $('#usermodalfollowtext').html(`<i class="material-icons" id="followicon">access_time</i> Requested`) 
                        }, 500);

                        $('#followbtn').html('cancel request')

                        document.getElementById('followbtn').onclick = function () {
                            cancel_request(uid, userdoc.data().username)
                        }
                    }
                    else {
                        $('#followbtn').html('request')
                        
                        document.getElementById('followbtn').onclick = function () {
                            request(uid, userdoc.data().username)
                        } 
                    }
                }
                else {
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

    // Profile public and boutta follow

     await db.collection('users').doc(user.uid).collection('follow').doc('following').update({
        following: firebase.firestore.FieldValue.arrayUnion({
            name: name,
            uid: uid,
            username: username,
            url: url
        })
    })
                
    await db.collection('users').doc(uid).collection('follow').doc('followers').update({
        followers: firebase.firestore.FieldValue.arrayUnion({
            name: cacheuser.name,
            uid: user.uid,
            photo_url: cacheuser.url,
            username: cacheuser.username
        })
    })

    $('#userfollowers').html(parseInt($('#userfollowers').html()) + 1)
                    
    Snackbar.show({pos: 'bottom-center', text: `Started following ${name}.`})
    $('#followbtn').html('unfollow')
    document.getElementById('followbtn').onclick = function () {
        unfollow(uid, username, url, name)
    }
    $('#usermodalfollowtext').removeClass('fadeInUp')
    $('#usermodalfollowtext').removeClass('fadeOutDown')
    $('#usermodalfollowtext').css('visibility', 'hidden')
    window.setTimeout(() => {
        $('#usermodalfollowtext').addClass('fadeInUp')
        $('#usermodalfollowtext').css('visibility', 'hidden')
        $('#usermodalfollowtext').html('<i class="material-icons" id="followicon">done</i> Following')
    }) 
}

function unfollow(uid, username,  url, name) {

    $('#userfollowers').html(parseInt($('#userfollowers').html()) - 1)
}

function request(uid, username) {

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
        window.setTimeout(function() {
            document.getElementById('usermodalfollowtext').style.visibility = 'visible'; document.getElementById('usermodalfollowtext').style.display = 'block'
            document.getElementById('usermodalfollowtext').classList.add('fadeInUp')
            document.getElementById('usermodalfollowtext').innerHTML = '<i class="material-icons" id="followicon">access_time</i> Requested'
        }, 500)

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