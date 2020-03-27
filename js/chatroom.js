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
                            window.history.pushState('page3', 'Title', '/eonnect/chatroom.html?chat=' + id);
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

    window.history.pushState('page3', 'Title', '/eonnect/chatroom.html');


}

function loadchatroom(id) {

    document.getElementById('chat').style.display = 'block'
    document.getElementById('home').style.display = 'none'
    document.getElementById('chat').classList.add('animated')
    document.getElementById('chat').classList.add('fadeIn')

    db.collection('chatroom').doc(id).get().then(function (doc) {
        if (doc.exists) {
            toggleloader()
            window.history.pushState('page3', 'Title', '/eonnect/chatroom.html?chat=' + id);
            document.getElementById('chatroomtitle').innerHTML = doc.data().name
            document.getElementById('chatroomid').innerHTML = '<small>#' + doc.data().id + '</small>'
            document.getElementById('sendmessagebutton').onclick = function () {
                addmessage(id)
            }

            db.collection('users').doc(firebase.auth().currentUser.uid).get().then(function (doc) {
                userprofilepicture = doc.data().url
            })

            loadmessages(id)

        }
        else { unloadchatroom(); error('No chatroom with this ID exists.'); }
    })
}

function addmessage(id) {

    newmessage = document.getElementById('messageinput1').value
    backupmessage = document.getElementById('messageinput1').value
    document.getElementById('messageinput1').value = ''

    if (newmessage = '') {
        snackbar('You must include content.')
    }

    else {
        if (newmessage.length > 50) {
            error('This message has ' + newmessage.length + ' characters. The limit is 50.')
        }
        else {
            db.collection('chatroom').doc(id).update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    timestamp: new Date().valueOf(),
                    senderuid: firebase.auth().currentUser.uid,
                    sendername: firebase.auth().currentUser.displayName,
                    senderpic: userprofilepicture,
                    content: backupmessage
                })
            }).then(function () {

            })
        }
    }


}


firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        user = firebase.auth().currentUser;
        particles()
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
sessionStorage.setItem('skiparefresh', 'nono')
function loadmessages(id) {

    window.setTimeout(function () {
        toggleloader()
    }, 1000)

    postmessages = []
    localStorage.setItem('first', 'true')

    db.collection('chatroom').doc(id).onSnapshot(function (doc) {

        if (sessionStorage.getItem('skiparefresh') == 'yesyes') {
            sessionStorage.setItem('skiparefresh', 'nono')
        }
        else {

            if (localStorage.getItem('first') == 'true') {
                localStorage.setItem('first', 'false')

                postmessages = doc.data().messages

                if (postmessages == undefined || doc.data().messages.length == 0) {
                    postmessages = []



                }
                else {



                    for (let i = 0; i < postmessages.length; i++) {
                        var element = postmessages[i];

                        a = document.createElement('div')
                        a.style.position = 'relative'
                        a.classList.add('messageelement')
                        a.id = i + 'el'
                        infoFunc = "chatinfomodal('" + id + "','" + i + "')"
                        console.log(element);
                        a.innerHTML = '<img style="border-radius: 1200px; height: 32px; width: 32px; object-fit: cover; display: inline-block; " src="' + element.senderpic + '"class="centeredy"> <div style="padding-left: 24px; width: 100%; display: inline-block;"><center><div style="text-align: left; max-width: 90%; padding: 12px; border-radius: 12px; background-color: #404040"><p style="max-width: 80%;"><b>' + element.sendername + ' » </b>' + element.content + '</p> <div style="right: 52px" class="centeredy"><button onclick="' + infoFunc + '" class="waves-effect waves-button"><i class="material-icons">info</i></button></div></div></center></div>'
                        document.getElementById('messages').appendChild(a)
                        b = document.createElement('br')
                        b.id = i + 'elel'
                        b.classList.add('breakelement')
                        document.getElementById('messages').appendChild(b)
                        addWaves()
                    }
                    var objDiv = document.getElementById("messagescontainer");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }

            else {

                if (doc.data().messages.length < 20) {

                    element = doc.data().messages[doc.data().messages.length - 1]
                    idi = doc.data().messages.length - 1


                }

                else {
                    element = doc.data().messages[21]
                    idi = 20
                }
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

                var objDiv = document.getElementById("messagescontainer");
                objDiv.scrollTop = objDiv.scrollHeight;






                if (postmessages.length > 20) {
                    sessionStorage.setItem('skiparefresh', 'yesyes')
                    db.collection('chatroom').doc(id).update({
                        messages: firebase.firestore.FieldValue.arrayRemove({
                            timestamp: postmessages[0].timestamp,
                            senderuid: postmessages[0].senderuid,
                            sendername: postmessages[0].sendername,
                            senderpic: postmessages[0].senderpic,
                            content: postmessages[0].content,
                        })
                    }).then(function () {
                        $('#0el').remove()
                        $('#0elel').remove()

                        msgels = document.getElementsByClassName('messageelement')
                        var msgels = [].slice.call(msgels);

                        for (let i = 0; i < msgels.length; i++) {
                            const element = msgels[i];
                            oldoldid = element.id
                            oldid = element.id.split("el")[0]

                            newid = parseInt(oldid) - 1
                            i = newid
                            id = id

                            document.getElementById(oldoldid).id = newid + 'el'
                            document.getElementById(newid + 'el').onclick = function () {
                                chatinfomodal(id, i)
                            }



                        }



                    })

                }




            }
        }

    })

}



function chatinfomodal(id, i) {

    toggleloader()

    db.collection('chatroom').doc(id).get().then(function (doc) {

        data = doc.data().messages[i]
        document.getElementById('infoa').innerHTML = data.content
        document.getElementById('infob').innerHTML = data.timestamp
        document.getElementById('infod').innerHTML = data.senderuid


        window.setTimeout(function () {
            toggleloader()
            $('#messageinfomodal').modal('toggle')
        }, 600)

    })
}

function joinchatroombutton() {
    foo = document.getElementById('joininput').value
    window.history.pushState('page3', 'Title', 'chatroom.html?chat=' + foo);
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

function particles() {
    db.collection('users').doc(firebase.auth().currentUser.uid).get().then(function (doc) {
        if (doc.data().particles == true) {

            document.addEventListener('mousemove', function (e) {
                let body = document.querySelector('body');
                let circle = document.createElement('span');
                circle.classList.add('span')
                let x = e.pageX;
                let y = e.pageY;
                circle.style.left = x + "px";
                circle.style.top = y + "px";
                let size = Math.random() * 10;
                circle.style.width = 10 + size + "px";
                circle.style.height = 10 + size + "px";
                body.appendChild(circle);
                setTimeout(function () {
                    circle.remove();
                }, 1600);
            });

        }
        else {

        }
    })
}