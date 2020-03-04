function prenotif() {
    db = firebase.firestore()
    db.collection('users').doc(user.uid).collection('follow').doc('requested').get().then(function (doc) {
        requests = doc.data().requested
        build(requests)
    })
}
function expandnotifs() {

    document.getElementById('notifscard').classList.add('notif')
    document.getElementById('notifsbutton').classList.remove('centered')
    document.getElementById('notifsbutton').classList.add('centeredx')


    db.collection('users').doc(user.uid).collection('follow').doc('requested').get().then(function (doc) {
        requests = doc.data().requested
        build(requests)
    })




    document.getElementById('notificon').classList.add('animated')
    document.getElementById('notificon').classList.add('fadeIn')
    document.getElementById('notificon').innerHTML = 'cancel'


    window.setTimeout(function () {

        document.getElementById('actualstuff').classList.remove('fadeOut')
        document.getElementById('actualstuff').classList.add('fadeIn')

        document.getElementById('notifsbutton').onclick = function () {
            shrinknotifs()
            document.getElementById('notificon').classList.remove('animated')
            document.getElementById('notificon').classList.remove('fadeIn')
        }
    }, 500)
}

function build(array) {
    $('#notifsbam').empty()
    document.getElementById('notifnum').innerHTML = array.length
    if (array.length == 0) {
        document.getElementById('notifnum').innerHTML = ''
        document.getElementById('notifsbam').innerHTML = '<center><br>No notifications yet. Check back later!</center>'
    }

    array.forEach(element => {

        b = document.createElement('li')
        b.classList.add('list-group-item')
        b.id = element + 'requestel'
        document.getElementById('notifsbam').appendChild(b)


        addcontent(element)

    });

}

function deny(id) {
    db.collection('users').doc(user.uid).collection('follow').doc('requested').update({
        requested: firebase.firestore.FieldValue.arrayRemove(id)
    }).then(function () {
        snackbar('Follow request was declined.', '', '', '4000')
        db.collection('users').doc(user.uid).collection('follow').doc('requested').get().then(function (doc) {
            requests = doc.data().requested
            build(requests)
        })
    })
}
function accept(id) {
    db.collection('users').doc(user.uid).collection('follow').doc('requested').update({
        requested: firebase.firestore.FieldValue.arrayRemove(id)
    }).then(function () {
        db.collection('users').doc(user.uid).collection('follow').doc('followers').update({
            followers: firebase.firestore.FieldValue.arrayUnion(id)
        }).then(function () {
            db.collection('users').doc(id).collection('follow').doc('following').update({
                following: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(function () {
                snackbar('Follow request was accepted.', '', '', '4000')
                db.collection('users').doc(user.uid).collection('follow').doc('requested').get().then(function (doc) {
                    requests = doc.data().requested
                    build(requests)
                })
            })
        })
    })

}

function addcontent(element) {

    db.collection('users').doc(element).collection('details').doc('username').get().then(function (doc) {
        denyfunc = "deny('" + element + "')"
        acceptfunc = "accept('" + element + "')"
        document.getElementById(element + 'requestel').innerHTML = '<b>' + doc.data().name + '</b> requested to follow you. <a onclick="' + acceptfunc + '" style="padding-left: 3px !important; padding-right: 3px !important" class="waves btn-old-text"><i style="color: green;" class="material-icons">check_circle_outline</i></a><a onclick="' + denyfunc + '" style="padding-left: 3px !important; padding-right: 3px !important" class="waves btn-old-text"><i style="color: red;" class="material-icons">delete_outline</i></a>'
        addWaves()
    })


}

function shrinknotifs() {
    document.getElementById('notifscard').classList.remove('notif')
    document.getElementById('notifsbutton').classList.add('centered')
    document.getElementById('notifsbutton').classList.remove('centeredx')
    document.getElementById('notificon').classList.add('animated')
    document.getElementById('notificon').classList.add('fadeIn')
    document.getElementById('notificon').innerHTML = 'email'
    document.getElementById('actualstuff').classList.add('fadeOut')
    document.getElementById('actualstuff').classList.remove('fadeIn')
    window.setTimeout(function () {


        document.getElementById('notifsbutton').onclick = function () {
            expandnotifs()
            document.getElementById('notificon').classList.remove('animated')
            document.getElementById('notificon').classList.remove('fadeIn')
        }
    }, 500)

}