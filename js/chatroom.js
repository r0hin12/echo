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

    if (document.getElementById('messageinput1').value.length > 50) {
        error('This message has ' + document.getElementById('messageinput1').value.length + ' characters. The limit is 50.')
    }
    else {
        db.collection('chatroom').doc(id).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                timestamp: new Date().valueOf(),
                senderuid: firebase.auth().currentUser.uid,
                sendername: firebase.auth().currentUser.displayName,
                senderpic: userprofilepicture,
                content: document.getElementById('messageinput1').value
            })
        }).then(function () {
            document.getElementById('messageinput1').value = ''
        })
    }


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

    postmessages = []
    localStorage.setItem('first', 'true')

    db.collection('chatroom').doc(id).onSnapshot(function (doc) {

        if (localStorage.getItem('first') == 'true') {
            localStorage.setItem('first', 'false')

            postmessages = doc.data().messages

            if (postmessages == undefined) {
                postmessages = []
            }

            for (let i = 0; i < postmessages.length; i++) {
                var element = postmessages[i];

                a = document.createElement('div')
                a.style.position = 'relative'
                a.id = i + 'el'
                infoFunc = "chatinfomodal('" + id + "','" + i + "')"
                a.innerHTML = '<img style="border-radius: 1200px; width: 32px; display: inline-block;" src="' + element.senderpic + '"class="centeredy"> <div style="padding-left: 24px; width: 100%; display: inline-block;"><center><div style="text-align: left; max-width: 90%; padding: 12px; border-radius: 12px; background-color: #404040"><p style="max-width: 90%;"><b>' + element.sendername + ' » </b>' + element.content + '</p> <div style="right: 52px" class="centeredy"><button onclick="' + infoFunc + '" class="waves"><i class="material-icons">info</i></button></div></div></center></div>'

                document.getElementById('messages').appendChild(a)
                b = document.createElement('br')
                b.id = i + 'elel'

                document.getElementById('messages').appendChild(b)
                addWaves()
            }
            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        else {

            console.log(doc.data().messages[postmessages.length]);
            element = doc.data().messages[postmessages.length]
            postmessages = doc.data().messages

            idi = postmessages.length - 1

            a = document.createElement('div')
            a.style.position = 'relative'
            a.id = idi + 'el'
            a.classList.add('animated')
            a.classList.add('fadeInUp')
            infoFunc = "chatinfomodal('" + id + "','" + idi + "')"
            a.innerHTML = '<img style="border-radius: 1200px; width: 32px; display: inline-block;" src="' + element.senderpic + '"class="centeredy"> <div style="padding-left: 24px; width: 100%; display: inline-block;"><center><div style="text-align: left; max-width: 90%; padding: 12px; border-radius: 12px; background-color: #404040"><p style="max-width: 90%;"><b>' + element.sendername + ' » </b>' + element.content + '</p> <div style="right: 52px" class="centeredy"><button onclick="' + infoFunc + '" class="waves"><i class="material-icons">info</i></button></div></div></center></div>'

            document.getElementById('messages').appendChild(a)
            b = document.createElement('br')
            b.id = idi + 'elel'

            document.getElementById('messages').appendChild(b)
            addWaves()

            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;


        }

    })
}



function chatinfomodal(id, i) {

    toggleloader()

    db.collection('chatroom').doc(id).get().then(function (doc) {

        data = doc.data().messages[i]

        document.getElementById('infoa').innerHTML = data.content
        document.getElementById('infob').innerHTML = data.timestamp
        document.getElementById('infoc').innerHTML = data.id
        document.getElementById('infod').innerHTML = data.senderuid

        if (data.senderuid == firebase.auth().currentUser.uid) {
            document.getElementById('deletemessagebutton').style.display = 'block'
            document.getElementById('deletemessagebutton').onclick = function () {

                db.collection('chatroom').doc(id).get().then(function (doc) {

                    messages = doc.data().messages
                    current = messages[i]

                    console.log(current.timestamp);
                    console.log(firebase.auth().currentUser.uid);
                    console.log(firebase.auth().currentUser.displayName);
                    console.log(current.senderpic);
                    console.log(current.content);

                    db.collection('chatroom').doc(id).update({
                        messages: firebase.firestore.FieldValue.arrayRemove({
                            timestamp: current.timestamp,
                            senderuid: firebase.auth().currentUser.uid,
                            sendername: firebase.auth().currentUser.displayName,
                            senderpic: current.senderpic,
                            content: current.content
                        })
                    }).then(function () {
                        document.getElementById(i + 'el').remove()
                        document.getElementById(i + 'elel').remove()
                        $('#messageinfomodal').modal('toggle')
                    })


                })


            }

        }
        else {
            document.getElementById('deletemessagebutton').style.display = 'none'
        }

        window.setTimeout(function () {
            toggleloader()
            $('#messageinfomodal').modal('toggle')
        }, 600)

    })
}

function joinchatroombutton() {
    foo = document.getElementById('joininput').value
    window.history.pushState('page3', 'Title', '/chatroom.html?chat=' + foo);
    window.location.reload()
}

function chatroomsinfo() {
    $('#chatroomsinfoModal').modal('toggle')
}

function chatroomrules() {
    $('#rulesModal').modal('toggle')
}

$("#messageinput1").keypress(function (event) {
    if (event.keyCode == 13) {
        $("#sendmessagebutton").click();
    }
});