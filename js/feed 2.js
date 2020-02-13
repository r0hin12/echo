var urlParams = new URLSearchParams(window.location.search);
var post = urlParams.get('post');
sessionStorage.setItem('viewPost', post)

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
load()

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
    history.pushState({ page: 1 }, "title 1", "?post=" + id)
    $('#commentModal').modal('toggle')
}



function like(id) {


    db.collection('users').doc(user.uid).collection('liked').doc(id).get().then(function (doc) {
        if (doc.exists) {


            db.collection('posts').doc(id).update({
                likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            }).then(function () {
                db.collection('users').doc(user.uid).collection('liked').doc(id).delete().then(function () {
                    snackbar('Like revoked.', '', '', '2000')
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
                        snackbar('Like added.', '', '', '2000')
                    })
            })
        }
    })
}



async function load() {
    postsarray = []
    sessionStorage.setItem('count', 1)
    query = db.collection('posts').orderBy("created")
    query.onSnapshot(snapshot => {
        snapshot.forEach(function (doc) {

            postsarray.push(doc)


        })

        build(postsarray);
    });



}

function build(array) {

    for (let i = 0; i < array.length; i++) {

        console.log(array[i].id);


        var storageRef = firebase.storage().ref();
        storageRef.child('users/' + array[i].data().uid + '/' + array[i].data().file).getDownloadURL().then(function (url) {

            db.collection('users').doc(array[i].data().uid).collection('details').doc('pfp').get().then(function (doc) {
                pfpurl = array[i].data().url
            })
            a = document.createElement('div')
            likeFunc = "like('" + array[i].id + "')"
            commentFunc = "loadComments('" + array[i].id + "')"
            a.innerHTML = '<div class="animated fadeIn" style="animation-delay: 0.5s; border: 1px solid grey; padding: 20px; border-radius: 12px; "><img class="animated fadeIn" style="max-height: 800px; width: 100%;" src="' + url + '"><br><div style="width: 100%; height: 32px; background-color: #fff;"><div style="height: 8px;"></div><h6 class="animated fadeInUp" style="font-weight: 700"><div style="text-align: left; display: inline-block;"><img id="' + array[i].id + 'pfpelurl" style="width: 35px; padding: 2px; border-radius: 3000px"> ' + array[i].data().name + '</div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 0px;"><button id="' + array[i].id + 'el" style="padding-left: 3px !important; padding-right: 3px !important; color: #000 !important;" onclick="' + likeFunc + '" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons">favorite_border</i>0</button><button id="' + array[i].id + 'commentEl" onclick="' + commentFunc + '" style="padding-left: 3px !important; padding-right: 3px !important;color: #000 !important;" class="waves btn-old-text"><i style="display: inline-block; color: #000" class="material-icons">comment</i>0</button></div></h6></div></div><hr>'



            document.getElementById('col' + sessionStorage.getItem('count')).appendChild(a)
            document.getElementById('col' + sessionStorage.getItem('count')).appendChild(document.createElement('br'))
            listencomments(array[i].id)
            listenlikes(array[i].id)
            addpfp(array[i].data().uid, array[i].id)


            if (sessionStorage.getItem('viewPost') == array[i].id) {
                sessionStorage.setItem('skiponce', 'true')
                loadComments(array[i].id)

            }


            c = sessionStorage.getItem('count')
            c++
            sessionStorage.setItem('count', c++)
            if (sessionStorage.getItem('count') == 4) {
                sessionStorage.setItem('count', 1)
            }



        }).catch(function (error) {
            console.log(error)
        });




        addWaves()

    }

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
function addpfp(uid, docid) {
    db.collection('users').doc(uid).collection('details').doc('pfp').get().then(function (doc) {
        document.getElementById(docid + 'pfpelurl').src = doc.data().url
    })
}
function listenlikes(docid) {
    db.collection("posts").doc(docid)
        .onSnapshot(function (doc) {
            displaylikes = doc.data().likes.length - 1
            document.getElementById(docid + 'el').innerHTML = '<i style="display: inline-block; color: #000" class="material-icons">favorite_border</i> ' + displaylikes + ''
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