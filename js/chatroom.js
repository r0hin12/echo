db = firebase.firestore()

function createchatroom() {
    $('#createModal').modal('toggle')
}

function joinchatroom() {
    $('#joinModal').modal('toggle')
}

function createchatroombutton() {
    name = document.getElementById('createinp').value
    id = document.getElementById('createidinp').value
    if (document.getElementById('createidinp').value.replace(/\s/g, '').length !== document.getElementById('createidinp').value.length) {
        error(id + ' contains whitespace. Try removing spaces, tabs or other whitespace from the id.')
    }
    else {
        if (name == '' || name == " ") {
            error('We were unable to process this name. Please modify the name of the chatroom to continue.')
        }
        else {

            db.collection('chatroom').doc(id).get().then(function (doc) {
                if (doc.exists) {
                    toggleloader()
                    error('A chatroom with this ID already exists. Please choose another one')
                }
                else {
                    db.collection('chatroom').doc(id).set({
                        name: name,
                        id: id
                    }).then(function () {
                        window.setTimeout(function () {
                            toggleloader()
                        }, 500)
                        window.setTimeout(function () {
                            window.history.pushState('page3', 'Title', '/chatroom.html?chat=' + id);
                            window.location.reload()
                        }, 1000)
                    })
                }
            })
        }
    }
}

function unloadchatroom() {
    document.getElementById('home').style.display = 'block'
    document.getElementById('chat').style.display = 'none'
    document.getElementById('home').classList.add('animated')
    document.getElementById('home').classList.add('fadeIn')

    window.history.pushState('page3', 'Title', '/chatroom.html');


}

function loadchatroom(id) {

    document.getElementById('chat').style.display = 'block'
    document.getElementById('home').style.display = 'none'
    document.getElementById('chat').classList.add('animated')
    document.getElementById('chat').classList.add('fadeIn')

    db.collection('chatroom').doc(id).get().then(function (doc) {
        if (doc.exists) {
            toggleloader()
            window.history.pushState('page3', 'Title', '/chatroom.html?chat=' + id);
            document.getElementById('chatroomtitle').innerHTML = doc.data().name
            document.getElementById('chatroomid').innerHTML = '<small>#' + doc.data().id + '</small>'
            document.getElementById('sendmessagebutton').onclick = function () {
                addmessage(id)
            }

            db.collection('users').doc(firebase.auth().currentUser.uid).collection('details').doc('pfp').get().then(function (doc) {
                userprofilepicture = doc.data().url
            })

            loadmessages(id)

        }
        else { unloadchatroom(); error('No chatroom with this ID exists.'); }
    })
}

function addmessage(id) {



    db.collection('chatroom').doc(id).collection('messages').add({
        timestamp: new Date().valueOf(),
        senderuid: firebase.auth().currentUser.uid,
        sendername: firebase.auth().currentUser.displayName,
        senderpic: userprofilepicture,
        content: document.getElementById('messageinput1').value

    }).then(function () {
        document.getElementById('messageinput1').value = ''
    })

}


firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        user = firebase.auth().currentUser;

        var urlParams = new URLSearchParams(window.location.search);
        var myParam = urlParams.get('chat');

        if (myParam == null) {
            document.getElementById('home').style.display = 'block'
            document.getElementById('chat').style.display = 'none'
            document.getElementById('home').classList.add('animated')
            document.getElementById('home').classList.add('fadeIn')

        }
        else {
            loadchatroom(myParam)
        }

    } else {
        transfer('index.html?return=' + window.location.href)
    }
});

function signout() {
    firebase.auth().signOut()
}

function loadmessages(id) {


    var d = new Date(); // today!
    x = 1
    d.setDate(d.getDate() - x);
    d = d.valueOf()

    window.setTimeout(function () {
        toggleloader()
    }, 1000)

    db.collection('chatroom').doc(id).collection('messages').where("timestamp", ">=", d)
        .onSnapshot(function (querySnapshot) {

            querySnapshot.docChanges().forEach(function (change) {
                if (change.type === "added") {

                    a = document.createElement('div')
                    a.style.position = 'relative'
                    a.id = change.doc.id + 'el'
                    infoFunc = "chatinfomodal('" + id + "','" + change.doc.id + "')"
                    a.innerHTML = '<img style="border-radius: 1200px; width: 32px; display: inline-block;" src="' + change.doc.data().senderpic + '"class="centeredy"> <div style="padding-left: 24px; width: 100%; display: inline-block;"><center><div style="text-align: left; max-width: 90%; padding: 12px; border-radius: 12px; background-color: #404040"><p style="max-width: 90%;">' + change.doc.data().content + '</p> <div style="right: 52px" class="centeredy"><button onclick="' + infoFunc + '" class="waves"><i class="material-icons">info</i></button></div></div></center></div>'

                    document.getElementById('messages').appendChild(a)
                    b = document.createElement('br')
                    b.id = change.doc.id + 'elel'

                    document.getElementById('messages').appendChild(b)
                    addWaves()


                }
                if (change.type === "removed") {
                    $('#' + change.doc.id + 'el').remove()
                    $('#' + change.doc.id + 'elel').remove()
                }
            });

            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
}

function chatinfomodal(id, id2) {

    toggleloader()

    db.collection('chatroom').doc(id).collection('messages').doc(id2).get().then(function (doc) {

        document.getElementById('infoa').innerHTML = doc.data().content
        document.getElementById('infob').innerHTML = doc.data().timestamp
        document.getElementById('infoc').innerHTML = doc.id
        document.getElementById('infod').innerHTML = doc.data().senderuid

        if (doc.data().senderuid == firebase.auth().currentUser.uid) {
            document.getElementById('deletemessagebutton').style.display = 'block'
            document.getElementById('deletemessagebutton').onclick = function () {
                db.collection('chatroom').doc(id).collection('messages').doc(id2).delete()
                $('#messageinfomodal').modal('toggle')
            }
        }
        else {
            document.getElementById('deletemessagebutton').style.display = 'none'
        }

        window.setTimeout(function () {
            toggleloader()
            $('#messageinfomodal').modal('toggle')
        }, 400)

    })
}

function joinchatroombutton() {
    foo = document.getElementById('joininput').value
    loadchatroom(foo)
}

function chatroomsinfo() {
    $('#chatroomsinfoModal').modal('toggle')
}

function chatroomrules() {
    $('#rulesModal').modal('toggle')
}