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

});


function addComment(id) {
    text = document.getElementById('commentbox').value
    if (text == "" || text == " " || text == "  ") {
        snackbar('You must include content', '', '', '4000')
    }
    else {
        document.getElementById('commentbox').value = ''
        db.collection('posts').doc(id).collection("comments").add({
            user: user.uid,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            name: user.displayName,
            likes: ['first'],
            content: text,
        }).then(function (doc) {
            document.getElementById('charcount').innerHTML = 'Post Comment (0/200 chars)'
            snackbar('Comment added.', '', '', '5000')


        })
    }


}

function addpfpcomment(usr, id) {
    db.collection('users').doc(usr).collection('details').doc('pfp').get().then(function (doc) {
        document.getElementById(id + 'pfpel').src = doc.data().url
    })
}

function loadComments(id) {


    document.getElementById('snacc').classList.remove('eonsnackbar-active')

    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }

    db.collection("posts").doc(id).collection('comments').get().then(function (querysnapshop) {

        if (querysnapshop.size == 0) {

            h = document.createElement('div')
            h.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert"><strong><i class="material-icons">notification_important</i></strong> Be the first to add a comment.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            document.getElementById('commentsbox').appendChild(h)
        }

        querysnapshop.forEach(function (doc) {
            a = document.createElement('div')
            a.classList.add('card')
            a.classList.add('animated')
            a.classList.add('fadeIn')
            likeFunc = "likeComment('" + doc.id + "')"
            reportFunc = "reportComment('" + doc.id + "')"
            a.innerHTML = '<div style="text-align: left;" class="card-body"><div class="card-header"><img style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px;"id="' + doc.id + 'pfpel" alt=""><p style="display: inline-block; line-height: 0px;"><b>' + doc.data().name + '</b></p><p style="position: absolute; right: 25px; top: 36px;">' + doc.data().created.toDate() + '</p></div><div style="padding: 8px;"><p>' + doc.data().content + '</p><button onclick="' + reportFunc + '" style="position: absolute; right: 10px; bottom: 10px;" class="waves btn-old-text"><i class="material-icons-outlined">report_problem</i></button> <div>  </div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(doc.data().user, doc.id)
            addWaves()

        })
    })
    history.pushState({ page: 1 }, "title 1", "?post=" + id)





    $('#commentModal').modal('toggle')
}



function like(id) {

    sessionStorage.setItem('skiponce2', "true")


    db.collection('users').doc(user.uid).collection('liked').doc(id).get().then(function (doc) {
        if (doc.exists) {


            db.collection('posts').doc(id).update({
                likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            }).then(function () {
                db.collection('users').doc(user.uid).collection('liked').doc(id).delete().then(function () {
                    // Was completed
                })
            })
        }
        else {


            db.collection('posts').doc(id).update({
                likes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(function () {

                db.collection('users').doc(user.uid).collection('liked').doc(id).set({
                    enabled: true
                })
                    .then(function () {
                        // Was completed
                    })
            })
        }
    })
}



function load() {

    document.getElementById('snacc').classList.remove('eonsnackbar-active')

    $('#grid').empty()
    $('#gridfeed').empty()
    loadposts()



}

function loadposts() {

    exarray = []
    fearray = []

    db.collection('users').doc(firebase.auth().currentUser.uid).collection('follow').doc("following").get().then(function (followdoc) {

        following = followdoc.data().following

        db.collection('posts').get().then(function (querysnapshop) {
            querysnapshop.forEach(function (doc) {
                if (user.uid == doc.data().uid) {
                    fearray.push({ doc: doc, date: doc.data().created.toDate() })
                }
                for (let i = 0; i < following.length; i++) {
                    if (following[i] == doc.data().uid) {
                        fearray.push({ doc: doc, date: doc.data().created.toDate() })
                    }
                }
                exarray.push({ doc: doc, date: doc.data().created.toDate() })


            })
            exarray.sort(function compare(a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
            fearray.sort(function compare(a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });

            exarray.reverse()
            fearray.reverse()
            actual(exarray)
            actualfeed(fearray)


        }).catch(function (error) {
            console.log(error)
        })

    })
}




async function addstuff(doc) {

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + doc.data().uid + '/' + doc.data().file).getDownloadURL().then(function (url) {

        db.collection('users').doc(doc.data().uid).collection('details').doc('pfp').get().then(function (doc) {
            pfpurl = doc.data().url
        })
        a = document.createElement('div')
        likeFunc = "like('" + doc.id + "')"
        commentFunc = "loadComments('" + doc.id + "')"
        infoFunc = "info('" + doc.id + "')"
        fullFunc = "fullscreen('" + doc.id + "')"
        userFunc = "usermodal('" + doc.data().uid + "')"
        a.innerHTML = '<div class="animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; border: 1px solid grey; padding: 10px 10px 0px 10px; border-radius: 12px; "><center><img id="' + doc.id + 'imgelel" class="animated fadeIn" style="max-width: 100%; height: 300px; object-fit: cover" src="' + url + '"><br><p>' + doc.data().caption + '</p> </center></div><br><h5 class="animated fadeInUp" style="font-weight: 600"><div style="text-align: left; display: inline-block;"><button style="padding: 2px 12px !important" onclick="' + userFunc + '" class="waves btn-old-secondary"><img id="' + doc.id + 'pfpelurl" style="width: 35px; padding: 2px; border-radius: 3000px"> ' + doc.data().name + '</button></div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 0px;"><button id="' + doc.id + 'el" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves btn-old-text heart"><i style="display: inline-block; color: #000" class="material-icons">favorite_border</i>0</button><button id="' + doc.id + 'commentEl" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons">comment</i>0</button><button id="' + doc.id + 'infoEl" onclick="' + infoFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons-outlined">info</i></button><button style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves btn-old-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></h5></div></div> <hr>'

        document.getElementById(doc.id + 'shell').appendChild(a)

        listencomments(doc.id)
        listenlikes(doc.id)
        addpfp(doc.data().uid, doc.id)


        if (sessionStorage.getItem('viewPost') == doc.id) {
            sessionStorage.setItem('skiponce', 'true')
            sessionStorage.setItem('skiponce3', 'true')
            loadComments(doc.id)
        }

        if (sessionStorage.getItem('viewInfo') == doc.id) {
            info(doc.id)
        }


        if (sessionStorage.getItem('fullInfo') == doc.id) {
            fullscreen(doc.id)
        }


    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

async function addstuffuser(doc) {

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + doc.data().uid + '/' + doc.data().file).getDownloadURL().then(function (url) {

        db.collection('users').doc(doc.data().uid).collection('details').doc('pfp').get().then(function (doc) {
            pfpurl = doc.data().url
        })
        a = document.createElement('div')
        likeFunc = "like('" + doc.id + "')"
        commentFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); loadComments('" + doc.id + "')"
        infoFunc = "sessionStorage.setItem('skiponce3', 'true'); $('#userModal').modal('toggle'); info('" + doc.id + "')"
        fullFunc = "sessionStorage.setItem('skiponce3', 'true'); fullscreen('" + doc.id + "')"
        a.innerHTML = '<div class="animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; border: 1px solid grey; padding: 10px 10px 0px 10px; border-radius: 12px; "><center><img id="' + doc.id + 'imgelelel" class="animated fadeIn" style="max-width: 100%; height: 300px; object-fit: cover" src="' + url + '"><br><p>' + doc.data().caption + '</p> </center></div><br><h5 class="animated fadeInUp" style="font-weight: 600"><div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 0px;"><button id="' + doc.id + 'eluser" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves btn-old-text heart"><i style="display: inline-block; color: #000" class="material-icons">favorite_border</i>0</button><button id="' + doc.id + 'commentEluser" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons">comment</i>0</button><button id="' + doc.id + 'infoEl" onclick="' + infoFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons-outlined">info</i></button><button style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves btn-old-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></h5></div></div> <hr>'

        document.getElementById(doc.id + 'shell').appendChild(a)

        listencommentsuser(doc.id)
        listenlikesuser(doc.id)

    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

async function addstufffeed(doc) {

    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + doc.data().uid + '/' + doc.data().file).getDownloadURL().then(function (url) {

        db.collection('users').doc(doc.data().uid).collection('details').doc('pfp').get().then(function (doc) {
            pfpurl = doc.data().url
        })
        a = document.createElement('div')
        likeFunc = "like('" + doc.id + "')"
        commentFunc = "loadComments('" + doc.id + "')"
        infoFunc = "info('" + doc.id + "')"
        fullFunc = "fullscreen('" + doc.id + "')"
        userFunc = "usermodal('" + doc.data().uid + "')"
        a.innerHTML = '<div class="animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; border: 1px solid grey; padding: 10px 10px 0px 10px; border-radius: 12px; "><center><img id="' + doc.id + 'imgelelfeed" class="animated fadeIn" style="max-width: 100%; height: 300px; object-fit: cover" src="' + url + '"><br><p>' + doc.data().caption + '</p> </center></div><br><h5 class="animated fadeInUp" style="font-weight: 600"><div style="text-align: left; display: inline-block;"><button style="padding: 2px 12px !important" onclick="' + userFunc + '" class="waves btn-old-secondary"><img id="' + doc.id + 'pfpelurlfeed" style="width: 35px; padding: 2px; border-radius: 3000px"> ' + doc.data().name + '</button></div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 0px;"><button id="' + doc.id + 'elfeed" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves btn-old-text heart"><i style="display: inline-block; color: #000" class="material-icons">favorite_border</i>0</button><button id="' + doc.id + 'commentElfeed" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons">comment</i>0</button><button id="' + doc.id + 'infoElfeed" onclick="' + infoFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons-outlined">info</i></button><button style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" onclick="' + fullFunc + '" class="waves btn-old-text"><i style="color: #000; font-size: 28px;" class="material-icons-outlined">fullscreen</i></button><br></div></h5></div></div> <hr>'

        document.getElementById(doc.id + 'shellfeed').appendChild(a)
        listencommentsfeed(doc.id)
        listenlikesfeed(doc.id)
        addpfpfeed(doc.data().uid, doc.id)



    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

function actual(array) {

    sessionStorage.setItem('count', 1)

    for (let i = 0; i < array.length; i++) {
        doc = array[i].doc;



        z = document.createElement('div')
        z.id = doc.id + 'shell'

        document.getElementById('grid').appendChild(z)
        document.getElementById('grid').appendChild(document.createElement('br'))

        addstuff(doc)

    }


}


function actualfeed(array) {

    sessionStorage.setItem('count', 1)

    for (let i = 0; i < array.length; i++) {
        doc = array[i].doc;



        z = document.createElement('div')
        z.id = doc.id + 'shellfeed'

        document.getElementById('gridfeed').appendChild(z)
        document.getElementById('gridfeed').appendChild(document.createElement('br'))

        addstufffeed(doc)

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

async function usermodal(uid) {
    $('#usergrid').empty()
    $('#userModal').modal('toggle')
    window.history.pushState('page3', 'Title', '/app.html?user=' + uid);
    db.collection('users').doc(uid).collection('details').doc('username').get().then(function (doc) {
        username = doc.data().username
        document.getElementById('usermodaltitle').innerHTML = doc.data().name + ' <br><span style="border-radius: 12px; font-size: 18px" class="badge badge-dark">@' + doc.data().username + '</span>'

        db.collection('users').doc(uid).collection('details').doc('pfp').get().then(function (doc) {
            document.getElementById('usermodalpfp').src = doc.data().url

            rep = 0
            db.collection('posts').where("uid", "==", uid).get().then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    rep = rep + doc.data().likes.length
                })
                document.getElementById('userrep').innerHTML = rep

                db.collection('users').doc(uid).collection('follow').doc('following').get().then(function (doc) {
                    following = doc.data().following.length
                    document.getElementById('userfollowers').innerHTML = following

                    db.collection('users').doc(uid).collection('follow').doc('followers').get().then(function (doc) {
                        followers = doc.data().followers.length
                        document.getElementById('userfollowing').innerHTML = following

                        db.collection('users').doc(uid).collection('follow').doc('followers').get().then(function (doc) {
                            ppl = doc.data().followers
                            isfollow = false
                            for (const item of ppl) {

                                if (item == uid) {
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


                                db.collection('users').doc(uid).collection('details').doc('type').get().then(function (doc) {
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


                                    }
                                    else {
                                        loaduserposts(uid)
                                    }
                                })



                            }
                        })







                    })

                })


            })


        })

    })



}

function loaduserposts(uid) {
    array = []
    db.collection('posts').where("uid", "==", uid).get().then(function (querysnapshop) {
        querysnapshop.forEach(function (doc) {

            array.push({ doc: doc, date: doc.data().created.toDate() })


        })
        array.sort(function compare(a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateA - dateB;
        });


        array.reverse()
        actualuser(array)


    }).catch(function (error) {
        console.log(error)
    })
}

function actualuser(array) {


    sessionStorage.setItem('count', 1)

    for (let i = 0; i < array.length; i++) {
        doc = array[i].doc;



        z = document.createElement('div')
        z.id = doc.id + 'shell'

        document.getElementById('usergrid').appendChild(z)
        document.getElementById('usergrid').appendChild(document.createElement('br'))

        addstuffuser(doc)

    }

}


function info(id) {

    db.collection('posts').doc(id).get().then(function (doc) {

        document.getElementById('infoa').innerHTML = doc.data().file
        document.getElementById('infob').innerHTML = doc.data().created.toDate()
        document.getElementById('infoc').innerHTML = doc.id
        document.getElementById('infod').innerHTML = doc.data().uid
        document.getElementById('infoe').innerHTML = doc.data().caption

        document.getElementById('commentbtnfrominfo').onclick = function () {
            sessionStorage.setItem('tocomments', true)
            loadComments(id)
        }

        if (doc.data().uid == user.uid) {
            document.getElementById('deletebtnfrominfo').onclick = function () {
                db.collection('posts').doc(id).delete().then(function () {
                    sessionStorage.setItem('skiponce2', "true")
                    snackbar('Post was successfully deleted.', 'Refresh Posts', 'load()', '5000')
                })
            }

            document.getElementById('deletebtnfrominfo').style.display = 'inline-block'
        }
        else {
            document.getElementById('deletebtnfrominfo').style.display = 'none'
        }

        document.getElementById('reportbtnfrominfo').onclick = function () {


            x = confirm('===== Report Post =====\n\nAre you sure you want to report this post?\n\nName: ' + doc.data().name + '\nUID: ' + doc.data().uid + '\nPost: ' + doc.id + '\n\nClick Ok to confirm:')
            if (x == true) {
                db.collection('reports-posts').doc(id).get().then(function (doc) {
                    if (doc.exists) {
                        db.collection('reports').doc(id).update({
                            reporters: firebase.firestore.FieldValue.arrayUnion(user.uid)
                        }).then(function () {
                            snackbar('Post ' + id + ' was reported', '', '', '8000')
                        })
                    }
                    else {

                        db.collection('reports-posts').doc(id).set({
                            "reporters": [user.uid]
                        }).then(function () {
                            snackbar('Post ' + id + ' was reported', '', '', '8000')
                        })

                    }
                })
            }
            else {

                snackbar('Prompt cancelled; nothing happened', '', '', '8000')
            }



        }

        $('#infoModal').modal('toggle')

        window.history.pushState('page3', 'Title', '/app.html?info=' + id);

    })

}


function reportComment(id) {
    x = confirm('===== Report Comment =====\n\nAre you sure you want to report this comment?\n\nName: ' + user.displayName + '\nUID: ' + user.uid + '\nPost: ' + id + '\n\nClick Ok to confirm:')
    if (x == true) {
        db.collection('reports').doc(id).get().then(function (doc) {
            if (doc.exists) {
                db.collection('reports').doc(id).update({
                    reporters: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }).then(function () {
                    snackbar('Post ' + id + ' was reported', '', '', '8000')
                })
            }
            else {

                db.collection('reports').doc(id).set({
                    "reporters": [user.uid]
                }).then(function () {
                    snackbar('Post ' + id + ' was reported', '', '', '8000')
                })

            }
        })
    }
    else {

        snackbar('Prompt cancelled; nothing happened', '', '', '8000')
    }

}

function refreshcomments(id) {



    sessionStorage.setItem('viewing', id)
    $('#commentsbox').empty()
    document.getElementById('charcount').onclick = function () {
        addComment(id)
    }

    db.collection("posts").doc(id).collection('comments').get().then(function (querysnapshop) {
        querysnapshop.forEach(function (doc) {
            a = document.createElement('div')
            a.classList.add('card')
            a.classList.add('animated')
            a.classList.add('fadeIn')
            likeFunc = "likeComment('" + doc.id + "')"
            reportFunc = "reportComment('" + doc.id + "')"
            a.innerHTML = '<div style="text-align: left;" class="card-body"><div class="card-header"><img style="padding: 5px; display: inline-block; border-radius: 200000px; width: 50px;"id="' + doc.id + 'pfpel" alt=""><p style="display: inline-block; line-height: 0px;"><b>' + doc.data().name + '</b></p><p style="position: absolute; right: 25px; top: 36px;">' + doc.data().created.toDate() + '</p></div><div style="padding: 8px;"><p>' + doc.data().content + '</p><button onclick="' + reportFunc + '" style="position: absolute; right: 10px; bottom: 10px;" class="waves btn-old-text"><i class="material-icons-outlined">report_problem</i></button> <div>  </div>'
            document.getElementById('commentsbox').appendChild(a)
            document.getElementById('commentsbox').appendChild(document.createElement('br'))
            addpfpcomment(doc.data().user, doc.id)
            addWaves()

        })
    })




}
sessionStorage.setItem('viewing', 'stoplookinghere')
function listencomments(docid) {
    db.collection('posts').doc(docid).collection('comments').onSnapshot(function (querySnapshot) {
        document.getElementById(docid + 'commentEl').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">comment</i> ' + querySnapshot.size
        if (sessionStorage.getItem('viewing') == docid) {
            if (sessionStorage.getItem('skiponce') == 'true') {
                sessionStorage.setItem('skiponce', 'false')
            }
            else {
                snackbar('This post has new comments.', 'Refresh', 'refreshcomments("' + docid + '")', '8000')
            }

        }
    })
}

function listencommentsuser(docid) {
    db.collection('posts').doc(docid).collection('comments').onSnapshot(function (querySnapshot) {
        document.getElementById(docid + 'commentEluser').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">comment</i> ' + querySnapshot.size
    })
}

function listencommentsfeed(docid) {
    db.collection('posts').doc(docid).collection('comments').onSnapshot(function (querySnapshot) {
        document.getElementById(docid + 'commentElfeed').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">comment</i> ' + querySnapshot.size
    })
}

function addpfpfeed(uid, docid) {
    db.collection('users').doc(uid).collection('details').doc('pfp').get().then(function (doc) {
        document.getElementById(docid + 'pfpelurlfeed').src = doc.data().url


    })
}

function addpfp(uid, docid) {
    db.collection('users').doc(uid).collection('details').doc('pfp').get().then(function (doc) {
        document.getElementById(docid + 'pfpelurl').src = doc.data().url


    })
}


function listenlikes(docid) {
    listener = db.collection("posts").doc(docid)
        .onSnapshot(function (doc) {
            displaylikes = doc.data().likes.length - 1
            document.getElementById(docid + 'el').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">favorite_border</i> ' + displaylikes + ''
            addWaves()
        });




}

function listenlikesuser(docid) {
    db.collection("posts").doc(docid)
        .onSnapshot(function (doc) {
            displaylikes = doc.data().likes.length - 1
            document.getElementById(docid + 'eluser').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">favorite_border</i> ' + displaylikes + ''
            addWaves()
        });


}

function listenlikesfeed(docid) {
    db.collection("posts").doc(docid)
        .onSnapshot(function (doc) {
            displaylikes = doc.data().likes.length - 1
            document.getElementById(docid + 'elfeed').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">favorite_border</i> ' + displaylikes + ''
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

$('#commentModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('currenttab') == null || sessionStorage.getItem('currenttab') == "null") {
        window.history.pushState('page2', 'Title', '/app.html')
    }
    else {
        window.history.pushState('page2', 'Title', '/app.html?tab=' + sessionStorage.getItem('currentab'));
    }

});

$('#userModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce3') == "true") {
        sessionStorage.setItem('skiponce3', "false")
    }
    else {

        if (sessionStorage.getItem('currenttab') == null || sessionStorage.getItem('currenttab') == "null") {
            window.history.pushState('page2', 'Title', '/app.html')
        }
        else {
            window.history.pushState('page2', 'Title', '/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }
});

$('#infoModal').on('hidden.bs.modal', function () {
    x = sessionStorage.getItem('tocomments')
    if (x == "true") {
        sessionStorage.setItem('tocomments', false)
    }
    else {
        if (sessionStorage.getItem('currenttab') == null || sessionStorage.getItem('currenttab') == "null") {
            window.history.pushState('page2', 'Title', '/app.html')
        }
        else {
            window.history.pushState('page2', 'Title', '/app.html?tab=' + sessionStorage.getItem('currentab'));
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
    db.collection("posts").onSnapshot(function (querySnapshot) {

        if (sessionStorage.getItem('skiponce2') == "true") {
            sessionStorage.setItem('skiponce2', "false")
        }
        else {

            if (localStorage.getItem('currenttab') == 'explore') {
                snackbar('Posts have been modified. Click to show latest.', 'Refresh', 'load()', '8500');
            }



        }

    });
}


function unfullscreen() {

    document.getElementById('fullscreenel').classList.remove('fadeIn')
    document.getElementById('fullscreenel').classList.add('fadeOut')
    window.setTimeout(() => {
        $('#fullscreenel').remove()
        window.history.pushState('page2', 'Title', '/app.html');
    }, 700);

}
function fullscreen(id) {

    a = document.createElement('div')
    a.id = 'fullscreenel'
    a.style = "width: 100%; height: 100%; background-color: black; top: 0px; left: 0px; position: fixed; z-indeX: 40000"
    source = document.getElementById(id + 'imgelel').src
    a.innerHTML = '<img src="' + source + '" style="max-width:100%; max-height:100%; position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"> <button onclick="unfullscreen()" class="waves btn-eon-one animated pulse infinite faster" style="position: absolute; top: 5px; left: 5px"><i class="material-icons-outlined">fullscreen</i></button>'
    a.classList.add('animated')
    a.classList.add('faster')
    a.classList.add('fadeIn')
    document.getElementById('body').appendChild(a)
    window.history.pushState('page4', 'Title', '/app.html?fullscreen=' + id);
    addWaves()

}

function follow(uid, name) {


    db.collection('users').doc(uid).collection('details').doc('type').get().then(function (doc) {
        if (doc.data().type == 'private') {

            db.collection('users').doc(uid).collection('follow').doc('requested').update({
                requested: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(function () {
                snackbar('Requested to follow ' + name, 'cancel', 'unfollow("' + uid + '", "' + name + '")', '4000')
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
                    snackbar('Started following ' + name, 'unfollow', 'unfollow("' + uid + '", "' + name + '")', '4000')
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
            snackbar('Stopped following ' + name, 'follow', 'follow("' + uid + '", "' + name + '")', '4000')
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
        snackbar('Cancelled follow request for ' + name, 'follow', 'follow("' + uid + '", "' + name + '")', '4000')
        document.getElementById('followbtn').innerHTML = 'request'
        document.getElementById('followbtn').onclick = function () {
            follow(uid, username)
        }
    })
}
