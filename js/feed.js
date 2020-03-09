var urlParams = new URLSearchParams(window.location.search);
var post = urlParams.get('post');
sessionStorage.setItem('viewPost', post)

var urlParams = new URLSearchParams(window.location.search);
var post = urlParams.get('info');
sessionStorage.setItem('viewInfo', post)


var urlParams = new URLSearchParams(window.location.search);
var post = urlParams.get('fullscreen');
sessionStorage.setItem('fullInfo', post)


db = firebase.firestore()


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function () {
    readURL(this);
    document.getElementById('blah').style.display = 'block'
    document.getElementById('captionel').style.display = 'block'
    document.getElementById('captionelel').style.display = 'block'

});


function addComment(id) {
    text = document.getElementById('commentbox').value
    if (text == "" || text == " " || text == "  ") {
        Snackbar.show({ text: 'You must include content.' })
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
                document.getElementById('charcount').innerHTML = 'Post Comment (0/200 chars)'
                x = parseInt(sessionStorage.getItem('viewing'), 10)
                Snackbar.show({ text: 'New comments have been added.', onActionClick: function (element) { $(element).css('opacity', 0); refreshcomments(x) }, actionText: 'Refresh' })


            })
        }

    }


}

function addpfpcomment(usr, id) {
    db.collection('users').doc(usr).get().then(function (doc) {
        document.getElementById(id + 'pfpel').src = doc.data().url
    })
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
            a.innerHTML = '<div<div style="text-align: left;" class="card-body"><img class="centeredy" style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px; height: 50px; object-fit: cover;"id="' + i + 'pfpel" alt=""><p style="padding-left: 68px; max-width: 86%; display: inline-block;"><b>' + element.name + ' » </b> ' + element.content + '</p><div class="centeredy" style="right: 25px;"><button onclick="' + reportFunc + '" class="waves eon-text"><i class="material-icons-outlined">report_problem</i></button></div></div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(element.user, i)
            addWaves()

        }

    })
    history.pushState(null, "", "?post=" + id)





    $('#commentModal').modal('toggle')
}



function like(id) {

    sessionStorage.setItem('skiponce2', "true")

    db.collection('posts').doc('likes').get().then(function (doc) {
        alreadyliked = false
        for (let i = 0; i < doc.data()[id].length; i++) { const element = doc.data()[id][i]; if (element == user.uid) { var alreadyliked = true } }

        if (alreadyliked == true) {

            db.collection('posts').doc('likes').update({
                [id]: firebase.firestore.FieldValue.arrayRemove(user.uid)
            })

        }
        else {
            db.collection('posts').doc('likes').update({
                [id]: firebase.firestore.FieldValue.arrayUnion(user.uid)
            })


        }

    })

}



function load() {
    yeetpostslistener()
    addpostslistener()
    $('#grid').empty()
    $('#gridfeed').empty()
    loadposts()
}



function loadposts() {

    exarray = []
    fearray = []

    db.collection('users').doc(firebase.auth().currentUser.uid).collection('follow').doc("following").get().then(function (followdoc) {

        following = followdoc.data().following


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
            actual(exarray)
            actualfeed(fearray)
        })

    })

}


async function addstuff(name, data, time) {


    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        db.collection('users').doc(data.uid).get().then(function (doc) {
            pfpurl = doc.url
        })
        a = document.createElement('div')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        a.innerHTML = '<div class="card animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; "><img id="' + name + 'imgelel" class="animated fadeIn" style="border-radius: 15px 15px 0px 0px; width: 100%; max-height: 800px; object-fit: cover" src="' + url + '"><br><center><p style="max-width: 100%; line-height: 0px;">' + data.caption + '</p></center><h5 class="animated fadeInUp" style="padding: 12px; font-weight: 600"><div style="width: 100%; text-align: left; display: inline-block;"><button style="padding: 2px 12px !important" onclick="' + userFunc + '" class="waves btn-old-secondary"><img id="' + name + 'pfpelurl" style="width: 35px; height: 35px; object-fit: cover; padding: 2px; border-radius: 3000px"> ' + data.name + '</button></div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 12px;"><button id="' + name + 'el" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves eon-text heart"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">favorite_border</i>0</button><button id="' + name + 'commentEl" onclick="' + commentFunc + '" style="; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i>0</button><button id="' + name + 'infoEl" onclick="' + infoFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons-outlined">info</i></button><button style="; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves eon-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></h5></div><br></div></div> <hr>'

        document.getElementById(name + 'shell').appendChild(a)
        addpfp(data.uid, name)


        if (sessionStorage.getItem('viewPost') == name) {
            sessionStorage.setItem('skiponce', 'true')
            sessionStorage.setItem('skiponce3', 'true')
            loadComments(name)
        }

        if (sessionStorage.getItem('viewInfo') == name) {
            info(name)
        }


        if (sessionStorage.getItem('fullInfo') == name) {
            fullscreen(name)
        }


        x = parseInt(sessionStorage.getItem('count'), 10);
        sessionStorage.setItem('count', x + 1)


        if (sessionStorage.getItem('count') == sessionStorage.getItem('maxCount')) {
            addWaves()
            listencomments()
            listenlikes()

        }


    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

async function addstuffuser(name, data, time) {

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.data.uid + '/' + data.data.file).getDownloadURL().then(function (url) {

        a = document.createElement('div')

        likeFunc = "like('" + name + "')"
        commentFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); loadComments('" + name + "')"
        infoFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"

        a.innerHTML = '<div class="card animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; padding-bottom: 12px;"><img id="' + name + 'imgelelel" class="animated fadeIn" style="border-radius: 15px 15px 0px 0px; width: 100%; max-height: 800px; object-fit: cover" src="' + url + '"><br><center><p style="max-width: 100%; line-height: 0px;">' + data.data.caption + '</p><center><button id="' + name + 'eluser" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves eon-text heart"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">favorite_border</i> ' + data.data.likes.length + '</button><button id="' + name + 'commentEluser" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i> ' + '</button><button id="' + name + 'infoEluser" onclick="' + infoFunc + '" style="padding: 0px !important; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons-outlined">info</i></button><button style="padding: 0px !important; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves eon-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></div><br></center><br></div> <hr>'
        document.getElementById(name + 'usersshell').appendChild(a)
        db.collection('posts').doc('comments').get().then(function (docee) {
            bambam = docee.data()[name].length
            document.getElementById(name + "commentEluser").innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i> ' + bambam
        })
        addWaves()


    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

async function addstufffeed(name, data, time) {


    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        db.collection('users').doc(data.uid).get().then(function (doc) {
            pfpurl = doc.url
        })
        a = document.createElement('div')
        likeFunc = "like('" + name + "')"
        commentFunc = "loadComments('" + name + "')"
        infoFunc = "info('" + name + "')"
        fullFunc = "fullscreen('" + name + "')"
        userFunc = "usermodal('" + data.uid + "')"
        a.innerHTML = '<div class="card animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; "><img id="' + name + 'imgelelfeed" class="animated fadeIn" style="border-radius: 15px 15px 0px 0px; width: 100%; max-height: 800px; object-fit: cover" src="' + url + '"><br><center><p style="max-width: 100%; line-height: 0px;">' + data.caption + '</p></center><h5 class="animated fadeInUp" style="padding: 12px; font-weight: 600"><div style="width: 100%; text-align: left; display: inline-block;"><button style="padding: 2px 12px !important" onclick="' + userFunc + '" class="waves btn-old-secondary"><img id="' + name + 'pfpelurlfeed" style="width: 35px; height: 35px; object-fit: cover; padding: 2px; border-radius: 3000px"> ' + data.name + '</button></div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 12px;"><button id="' + name + 'elfeed" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves eon-text heart"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">favorite_border</i>0</button><button id="' + name + 'commentElfeed" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i>0</button><button id="' + name + 'infoElfeed" onclick="' + infoFunc + '" style="; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves eon-text"><i style="display: inline-block; color: #000; padding: 3px;" class="material-icons-outlined">info</i></button><button style="padding; 0px !important; padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves eon-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></h5></div><br></div></div> <hr>'

        document.getElementById(name + 'feedshell').appendChild(a)
        addpfpfeed(data.uid, name)

        if (sessionStorage.getItem('fullInfo') == name) {
            fullscreen(name)
        }


        x = parseInt(sessionStorage.getItem('count2'), 10);
        sessionStorage.setItem('count2', x + 1)


        if (sessionStorage.getItem('count2') == sessionStorage.getItem('maxCount2')) {
            addWaves()
            listenlikesfeed()
            listencommentsfeed()

        }


    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

function actual(array) {


    sessionStorage.setItem('count', 0)
    sessionStorage.setItem('maxCount', array.length)

    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.id = name + 'shell'

        document.getElementById('grid').appendChild(z)

        addstuff(name, data, time)

    }
}


function actualfeed(array) {


    if (array.length == 0) {
        document.getElementById('nofeedstuff').style.display = 'inline-block'
    }
    else {
        document.getElementById('nofeedstuff').style.display = 'none'
    }

    sessionStorage.setItem('count2', 0)
    sessionStorage.setItem('maxCount2', array.length)

    for (let i = 0; i < array.length; i++) {
        name = array[i].name;
        data = array[i].data;
        time = array[i].time;

        z = document.createElement('div')
        z.id = name + 'feedshell'

        document.getElementById('gridfeed').appendChild(z)

        addstufffeed(name, data, time)

    }

}



function checkuserurl() {
    var urlParams = new URLSearchParams(window.location.search);
    var post = urlParams.get('user');

    if (post == null || post == " " || post == "") {

    }
    else {
        usermodal(post)
    }


}
sessionStorage.setItem('currentlyviewinguser', 'uwu')
async function usermodal(uid) {
    previousview = sessionStorage.getItem("currentlyviewinguser")
    if (previousview == uid) {
        $('#userModal').modal('toggle')
        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
    }
    else {
        toggleloader()
        sessionStorage.setItem('currentlyviewinguser', uid)

        window.history.pushState(null, '', '/eonnect/app.html?user=' + uid);
        db.collection('users').doc(uid).get().then(function (doc) {
            username = doc.data().username
            useruid = doc.data().uid
            document.getElementById('usermodaltitle').innerHTML = doc.data().name + ' <br><span style="border-radius: 12px; font-size: 18px" class="badge badge-dark">@' + doc.data().username + '</span>'
            document.getElementById('usermodalpfp').src = doc.data().url
            if (doc.data().bio == undefined || doc.data().bio == null || doc.data().bio == "" || doc.data().bio == " ") {

            }
            else {
                document.getElementById('usermodalbio').innerHTML = doc.data().bio
            }

            document.getElementById('userrep').innerHTML = doc.data().rep


            db.collection('users').doc(uid).collection('follow').doc('following').get().then(function (doc) {
                following = doc.data().following.length
                document.getElementById('userfollowers').innerHTML = following


                db.collection('users').doc(uid).collection('follow').doc('followers').get().then(function (doc) {
                    followers = doc.data().followers.length
                    document.getElementById('userfollowing').innerHTML = following
                    $('#usergrid').empty()
                    $('#userModal').modal('toggle')
                    if (user.uid == uid) {
                        document.getElementById('ownwarning').style.display = 'block'
                        document.getElementById('followbtn').innerHTML = 'unfollow'
                        document.getElementById('followbtn').onclick = function () {
                            Snackbar.show({ pos: 'bottom-left', text: "You can't unfollow yourself." })
                        }
                        loaduserposts(uid)
                    }
                    else {

                        db.collection('users').doc(uid).collection('follow').doc('followers').get().then(function (doc) {
                            ppl = doc.data().followers
                            isfollow = false
                            for (const item of ppl) {
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



                                db.collection('users').doc(uid).get().then(function (doc) {
                                    if (doc.data().type == 'private') {
                                        document.getElementById('privatewarning').style.display = 'block'

                                        db.collection('users').doc(uid).collection('follow').doc('requested').get().then(function (doc) {
                                            ppl = doc.data().requested
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
                                        })
                                    } else { loaduserposts(uid) }
                                })
                            }
                        })

                    }
                })
            })
        })

        window.setTimeout(function () {
            toggleloader()
        }, 1000)
    }

}

function loaduserposts(uid) {
    array = []
    db.collection('posts').doc('posts').get().then(function (doc) {

        latest = doc.data().latest
        for (let i = 0; i < doc.data().latest + 1; i++) {
            if (doc.data()[i] == undefined) {
            }
            else {

                if (doc.data()[i].data.uid == user.uid) {
                    array.push({ name: i, data: doc.data()[i], time: doc.data()[i].timestamp })
                }
            }
        }

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

        document.getElementById('usergrid').appendChild(z)
        document.getElementById('usergrid').appendChild(document.createElement('br'))

        addstuffuser(name, data, time)

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
                }).then(function () {
                    db.collection('posts').doc('comments').update({
                        [id]: firebase.firestore.FieldValue.delete()
                    }).then(function () {
                        db.collection('posts').doc('likes').update({
                            [id]: firebase.firestore.FieldValue.delete()
                        }).then(function () {
                            db.collection('posts').doc('reported').update({
                                [id]: firebase.firestore.FieldValue.delete()
                            }).then(function () {
                                Snackbar.show({ text: 'Your post was deleted.' })
                            })

                        })
                    })
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
            a.innerHTML = '<div<div style="text-align: left;" class="card-body"><img class="centeredy" style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px; height: 50px; object-fit: cover;"id="' + i + 'pfpel" alt=""><p style="padding-left: 68px; max-width: 86%; display: inline-block;"><b>' + element.name + ' » </b> ' + element.content + '</p><div class="centeredy" style="right: 25px;"><button onclick="' + reportFunc + '" class="waves eon-text"><i class="material-icons-outlined">report_problem</i></button></div></div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(element.user, i)
            addWaves()

        }

    })

}
sessionStorage.setItem('viewing', 'stoplookinghere')
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
                document.getElementById(i + 'commentEl').innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i> ' + doc.data()[i].length
                addWaves()
            }
        }

    })
}

function listencommentsfeed() {
    db.collection('posts').doc('comments').onSnapshot(function (doc) {

        for (let i = 0; i < doc.data().latest + 1; i++) {

            if (doc.data()[i] == undefined) {

            }
            else {

                document.getElementById(i + 'commentElfeed').innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons">comment</i> ' + doc.data()[i].length
                addWaves()
            }
        }

    })
}

function addpfpfeed(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurlfeed').src = doc.data().url


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

                    document.getElementById(i + 'el').innerHTML = '<i style="display: inline-block; color: red; padding: 3px;" class="material-icons animated jello">favorite</i> ' + doc.data()[i].length
                }
                else {

                    document.getElementById(i + 'el').innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons animated rubberBand">favorite_border</i> ' + doc.data()[i].length
                }
                addWaves()
            }
        }

    });
}

function listenlikesfeed() {
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

                    document.getElementById(i + 'elfeed').innerHTML = '<i style="display: inline-block; color: red; padding: 3px;" class="material-icons animated jello">favorite</i> ' + doc.data()[i].length
                }
                else {

                    document.getElementById(i + 'elfeed').innerHTML = '<i style="display: inline-block; color: #000; padding: 3px;" class="material-icons animated rubberBand">favorite_border</i> ' + doc.data()[i].length
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

$('#commentModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
        window.history.pushState(null, '', '/eonnect/app.html')
    }
    else {
        window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
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

addpostslistener()
function addpostslistener() {
    yeetpostslistener = db.collection("posts").onSnapshot(function (querySnapshot) {

        if (sessionStorage.getItem('skiponce2') == "true") {
            sessionStorage.setItem('skiponce2', "false")
        }
        else {

            if (localStorage.getItem('currentab') == 'explore') {
                Snackbar.show({ pos: 'bottom-left', text: "Posts have been modified.", onActionClick: function (element) { $(element).css('opacity', 0); load() }, actionText: "refresh" })
            }



        }

    });
}


function unfullscreen() {
    sessionStorage.setItem('fullscreenon', 'no')
    document.getElementById('fullscreenel').classList.remove('fadeIn')
    document.getElementById('fullscreenel').classList.add('fadeOut')
    window.setTimeout(() => {
        $('#fullscreenel').remove()
        window.history.pushState(null, '', '/eonnect/app.html');
    }, 700);

}
function fullscreen(id) {

    if (sessionStorage.getItem('fullscreenon') == 'yes') {
        sessionStorage.setItem('fullscreenon', 'no')
        console.log('duplicate fullscreen avoided');
    }
    else {
        a = document.createElement('div')
        a.id = 'fullscreenel'
        a.style = "width: 100%; height: 100%; background-color: black; top: 0px; left: 0px; position: fixed; z-indeX: 40000"
        source = document.getElementById(id + 'imgelel').src
        a.innerHTML = '<img src="' + source + '" style="max-width:100%; max-height:100%; position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"> <button onclick="unfullscreen()" class="waves btn-old-primary animated pulse infinite faster" style="position: absolute; top: 5px; left: 5px"><i class="material-icons-outlined">exit_to_app</i></button>'
        a.classList.add('animated')
        a.classList.add('faster')
        a.classList.add('fadeIn')
        document.getElementById('body').appendChild(a)
        window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
        addWaves()

        sessionStorage.setItem('fullscreenon', 'yes')
    }

}

function fullscreenfeed(id) {

    if (sessionStorage.getItem('fullscreenon') == 'yes') {
        sessionStorage.setItem('fullscreenon', 'no')
        console.log('duplicate fullscreen avoided');
    }
    else {
        a = document.createElement('div')
        a.id = 'fullscreenel'
        a.style = "width: 100%; height: 100%; background-color: black; top: 0px; left: 0px; position: fixed; z-indeX: 40000"
        source = document.getElementById(id + 'imgelelfeed').src
        a.innerHTML = '<img src="' + source + '" style="max-width:100%; max-height:100%; position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"> <button onclick="unfullscreen()" class="waves btn-old-primary animated pulse infinite faster" style="position: absolute; top: 5px; left: 5px"><i class="material-icons-outlined">exit_to_app</i></button>'
        a.classList.add('animated')
        a.classList.add('faster')
        a.classList.add('fadeIn')
        document.getElementById('body').appendChild(a)
        window.history.pushState(null, '', '/eonnect/app.html?fullscreen=' + id);
        addWaves()

        sessionStorage.setItem('fullscreenon', 'yes')
    }

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
