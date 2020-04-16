db = firebase.firestore()

function newdm() {

    userval = document.getElementById('newdmel').value
    db.collection('users').where('username', '==', userval).get().then(function (querysnapshot) {
        if (querysnapshot.size == 0) {

            document.getElementById('erorrModalMsg').innerHTML = 'No user can be found with this ID.'
            $('#errorModal').modal('toggle')

        }

        else {


            querysnapshot.forEach(function (doc) {
                uwu = doc.data().uid
                uwuunread = uwu + 'unread'
                uwuunread2 = user.uid + 'unread'
            })

            db.collection('direct').doc(user.uid).set({
                [uwu]: [],
                [uwuunread]: []
            }).then(function () {
                db.collection('direct').doc(uwu).set({
                    [user.uid]: [],
                    [uwuunread2]: []
                }).then(function (doc) {
                    Snackbar.show({ text: 'Private DM created.' })
                    $('#messageslist').empty()
                    loaddms()

                })
            })


        }
    })
}
sessionStorage.setItem('initial', 'true')
function loaddms() {
    db.collection('direct').doc(user.uid).get().then(function (doc) {


        if (doc.exists) {
            document.getElementById('nodirectstuff').style.display = 'none'
            document.getElementById('messageslistcontainer').style.display = 'block'
            dms = Object.keys(doc.data())

            for (let i = 0; i < dms.length; i++) {

                if (dms[i].endsWith("unread")) {

                }
                else {



                    a = document.createElement('button')
                    a.classList.add('eon-text')
                    a.id = dms[i]
                    a.onclick = function () {

                        dummy = this.id
                        document.getElementById(this.id).style.pointerEvents = 'none';
                        window.setTimeout(function () {
                            document.getElementById(dummy).style.pointerEvents = 'auto';
                        }, 3456)

                        sessionStorage.setItem('firsttime112', 'true')

                        document.getElementById('messagescontainer').style.display = 'block'
                        document.getElementById('newmsgcard').style.display = 'block'
                        document.getElementById('directmessagesendbutton').onclick = function () {
                            newdirect(dms[i])
                        }
                        $('#messages').empty()
                        sessionStorage.setItem("currentviewingdm", dms[i])
                        loadmessages(dms[i])

                        unreadtext = dms[i] + 'unread'
                        db.collection('direct').doc(user.uid).update({
                            [unreadtext]: firebase.firestore.FieldValue.arrayRemove(user.uid),
                        })

                    }
                    document.getElementById('messageslist').appendChild(a)
                    addpfpdirect(dms[i])
                    updatenotifs()

                }

            }

            loadmessages(dms[0])

            if (dms.length > 50) {


                db.collection('chatroom').doc(id).update({
                    messages: firebase.firestore.FieldValue.arrayRemove({
                        content: dms[0].content,
                        sender: dms[0].sender,
                        uniqueid: dms[0].uniqueid,
                    })
                }).then(function () {
                    $('#0el').remove()
                    $('#0elel').remove()


                    /* 
                    
                    CHANGE ALL EXISTING IDS
    
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
                        */



                })


            }


        }
        else {

            document.getElementById('nodirectstuff').style.display = 'block'
            document.getElementById('messageslistcontainer').style.display = 'none'

        }
    })
}

$("#directnewmessage").keypress(function (event) {
    if (event.keyCode == 13) {
        $("#directmessagesendbutton").click();
    }
});

function addpfpdirect(id) {
    db.collection('users').doc(id).get().then(function (doc) {
        url = doc.data().url
        document.getElementById(id).innerHTML = '<img class="shadow-sm" style="border-radius: 300px; width: 40px; height: 40px; object-fit: cover;" src="' + url + '" alt=""><div class="animated" style="position: absolute;" id="' + id + 'unreadcount' + '"></div>'
    })
}

function newdirect(id) {
    content = document.getElementById('directnewmessage').value
    document.getElementById('directnewmessage').value = ''

    db.collection('direct').doc(user.uid).update({
        [id]: firebase.firestore.FieldValue.arrayUnion({
            sender: user.uid,
            content: content,
            uniqueid: messages.length,
        })
    }).then(function () {
        unreadtext = user.uid + 'unread'
        db.collection('direct').doc(id).update({
            [unreadtext]: firebase.firestore.FieldValue.arrayUnion(id),
        })
        db.collection('direct').doc(id).update({
            [user.uid]: firebase.firestore.FieldValue.arrayUnion({
                sender: user.uid,
                content: content,
                uniqueid: messages.length
            })
        }).then(function () {
            var objDiv = document.getElementById("messagescontainer");
            objDiv.scrollTop = objDiv.scrollHeight;
        })

    })

}

sessionStorage.setItem('firsttime112', 'true')





function loadmessages(id) {
    try {
        yeet()
    } catch (error) {
        // First time
    }
    yeet = db.collection('direct').doc(user.uid).onSnapshot(function (doc) {
        if (sessionStorage.getItem('firsttime112') == 'true') {
            // FIRST TIME
            sessionStorage.setItem('firsttime112', 'false')
            oldmessages = doc.data()[id]
            messages = doc.data()[id]

            for (let i = 0; i < oldmessages.length; i++) {
                const element = oldmessages[i];
                b = document.createElement('div')
                b.style.padding = '38px'
                b.id = doc.data()[id].uniqueid + 'el'
                b.classList.add('animated')
                b.classList.add('fadeInUp')
                b.innerHTML = element.sender + ' says ' + element.content
                document.getElementById('messages').appendChild(b)


            }

            var objDiv = document.getElementById("messagescontainer");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
        else {

            // NOT FIRST TIME
            messages = doc.data()[id]


            console.log(oldmessages.length);
            console.log(messages.length);

            if (messages.length == oldmessages.length) {

                updatenotifs()
                oldmessages = doc.data()[id]

            }

            else {

                if (sessionStorage.getItem('currentviewingdm') == id) {


                    unreadtext = id + 'unread'
                    db.collection('direct').doc(user.uid).update({
                        [unreadtext]: firebase.firestore.FieldValue.arrayRemove(id),
                    })


                    element = messages[messages.length - 1]
                    b = document.createElement('div')
                    b.style.padding = '38px'
                    b.classList.add('animated')
                    b.classList.add('fadeInUp')
                    b.id = doc.data().uniqueid + 'el'
                    b.innerHTML = element.sender + ' says ' + element.content
                    document.getElementById('messages').appendChild(b)
                    var objDiv = document.getElementById("messagescontainer");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
                else {
                    element = messages[messages.length - 1]
                    b = document.createElement('div')
                    b.style.padding = '38px'
                    b.classList.add('animated')
                    b.classList.add('fadeInUp')
                    b.id = doc.data().uniqueid + 'el'
                    b.innerHTML = element.sender + ' says ' + element.content
                    document.getElementById('messages').appendChild(b)
                    var objDiv = document.getElementById("messagescontainer");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }

        }

        if (sessionStorage.getItem('initial') == 'true') {
            console.log('Initial Direct Messages SETUP.');
            unshowdm()
            sessionStorage.setItem('initial', 'false')
        }
        else {
            document.getElementById(id + 'unreadcount').classList.add('fadeOut')
        }

    })
}

function unshowdm() { document.getElementById('messagescontainer').style.display = 'none'; sessionStorage.setItem('currentviewingdm', 'none') }

function updatenotifs() {

    db.collection('direct').doc(user.uid).get().then(function (doc) {

        dms = Object.keys(doc.data())

        for (let i = 0; i < dms.length; i++) {
            if (dms[i].endsWith("unread")) {

                array = doc.data()[dms[i]]
                dmsi = dms[i].replace('unread', '')
                if (array.length > 0) {

                    if (document.getElementById(dmsi + 'unreadcount').innerHTML == '') {

                    }
                    else {
                        document.getElementById(dmsi + 'unreadcount').classList.add('shake')
                        window.setTimeout(function () {
                            document.getElementById(dmsi + 'unreadcount').classList.remove('shake')
                        }, 500)
                    }

                    document.getElementById(dmsi + 'unreadcount').classList.add('fadeIn')
                    document.getElementById(dmsi + 'unreadcount').classList.remove('fadeOut')
                    document.getElementById(dmsi + 'unreadcount').innerHTML = '<span class="badge badge-danger">·</span>'
                }
                else {
                    document.getElementById(dmsi + 'unreadcount').classList.remove('fadeIn')
                    document.getElementById(dmsi + 'unreadcount').innerHTML = ''
                }


            }
            else {

            }
        }

    })

}

