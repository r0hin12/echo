db = firebase.firestore()


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        user = firebase.auth().currentUser;

        if (user.email == "rohinarya12@gmail.com") {
            adminrefresh()
        }
        else {
            transfer('index.html')
        }

    } else {
        transfer('index.html?return=' + window.location.href)
    }
});

function adminrefresh() {
    array = []
    db.collection('posts').doc('reported').get().then(function (doc) {
        limit = doc.data().latest + 1
        for (let i = 0; i < limit; i++) {

            content = doc.data()[i]
            if (content == undefined) {
            }
            else {
                const elementid = content.name;
                const elementdata = content.data
                const elementtime = content.timestamp
                array.push({ name: elementid, data: elementdata, time: elementtime })
            }
        }

        adminactual(array)


    })

}

function adminactual(array) {



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

function unreport(id) {
    db.collection('posts').doc('reported').update({
        [id]: firebase.firestore.FieldValue.delete()
    }).then(function () {
        Snackbar.show({showAction: false,pos: 'bottom-center', text: 'The post was unreported.' })
    })
}

function deletepost(id) {


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
                    Snackbar.show({showAction: false,pos: 'bottom-center', text: 'The post was deleted.' })
                })

            })
        })
    })


}

function ban(uid) {

    db.collection('app').doc('details').update({
        banned: firebase.firestore.FieldValue.arrayUnion(uid)
    })

}

async function addstuff(name, data, time) {


    var storageRef = firebase.storage().ref();
    storageRef.child('users/' + data.uid + '/' + data.file).getDownloadURL().then(function (url) {

        db.collection('users').doc(data.uid).get().then(function (doc) {
            pfpurl = doc.url
        })
        a = document.createElement('div')
        var deletepost = "deletepost('" + name + "')"
        var banuser = "ban('" + data.uid + "')"
        var unreport = "unreport('" + name + "')"
        a.innerHTML = '<div class="card animated fadeIn" style="position: relative; z-index: 2; animation-delay: 0.5s; "><img id="' + name + 'imgelel" class="animated fadeIn" style="border-radius: 15px 15px 0px 0px; width: 100%; max-height: 800px; object-fit: cover" src="' + url + '"><br><center><p style="max-width: 100%; line-height: 0px;">' + data.caption + '</p></center><h5 class="animated fadeInUp" style="padding: 12px; font-weight: 600"><div style="width: 100%; text-align: left; display: inline-block;"><button style="padding: 2px 12px !important" class="waves eon-outlined"><img id="' + name + 'pfpelurl" style="width: 35px; height: 35px; object-fit: cover; padding: 2px; border-radius: 3000px"> ' + data.name + '</button></div> <div style="display: inline-block; width: 100%; position: absolute; top: 50%; transform: translate(0,-50%);text-align: right; right: 12px;"><button onclick="' + banuser + '" class="waves eon-text">ban</button><button onclick="' + deletepost + '" class="waves eon-text">delete</button><button onclick="' + unreport + '" class="waves eon-text">unreport</button><br></div></h5></div><br></div></div> <hr>'

        document.getElementById(name + 'shell').appendChild(a)
        addpfp(data.uid, name)

        x = parseInt(sessionStorage.getItem('count')) + 1
        sessionStorage.setItem('count', x)

        if (sessionStorage.getItem('count') == sessionStorage.getItem('maxCount')) {
            addWaves()

        }


    }).catch(function (error) {
        console.log(error)
    });
    addWaves()


}

function addpfp(uid, docid) {
    db.collection('users').doc(uid).get().then(function (doc) {
        document.getElementById(docid + 'pfpelurl').src = doc.data().url


    })
}
