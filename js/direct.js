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
                }).then(function () {
                    Snackbar.show({ text: 'Private DM created.' })
                    $('#messageslist').empty()
                    loaddms()
                })
            })


        }
    })
}

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


                        sessionStorage.setItem('firsttime112', 'true')

                        document.getElementById('messagescontainer').style.display = 'block'
                        document.getElementById('newmsgcard').style.display = 'block'
                        document.getElementById('directmessagesendbutton').onclick = function () {
                            newdirect(dms[i])
                        }
                        $('#messages').empty()
                        loadmessages(dms[i])



                    }
                    document.getElementById('messageslist').appendChild(a)
                    addpfpdirect(dms[i])

                }

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
        document.getElementById(id).innerHTML = '<img class="shadow-sm" style="border-radius: 300px; width: 40px; height: 40px; object-fit: cover;" src="' + url + '" alt="">'
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

        db.collection('direct').doc(id).update({
            [user.uid]: firebase.firestore.FieldValue.arrayUnion({
                sender: user.uid,
                content: content,
                uniqueid: messages.length
            })
        }).then(function () {
            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        })

    })

}

sessionStorage.setItem('firsttime112', 'true')

function loadmessages(id) {
    db.collection('direct').doc(user.uid).onSnapshot(function (doc) {

        if (sessionStorage.getItem('firsttime112') == 'true') {
            // FIRST TIME
            sessionStorage.setItem('firsttime112', 'false')
            oldmessages = doc.data()[id]

            for (let i = 0; i < oldmessages.length; i++) {
                const element = oldmessages[i];
                b = document.createElement('div')
                b.style.padding = '38px'
                b.innerHTML = element.sender + ' says ' + element.content
                document.getElementById('messages').appendChild(b)


            }
            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;

        }
        else {
            // NOT FIRST TIME
            messages = doc.data()[id]


            console.log(oldmessages.length);
            console.log(messages.length);

            if (messages.length == oldmessages.length) {

                console.log('different channel');
                oldmessages = doc.data()[id]

            }

            else {

                element = messages[messages.length - 1]
                b = document.createElement('div')
                b.style.padding = '38px'
                b.innerHTML = element.sender + ' says ' + element.content
                document.getElementById('messages').appendChild(b)

            }




        }

    })
}