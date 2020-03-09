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
            })

            db.collection('direct').doc(user.uid).set({
                [uwu]: []
            }).then(function () {
                db.collection('direct').doc(uwu).set({
                    [user.uid]: []
                }).then(function () {
                    Snackbar.show({ text: 'Private DM created.' })
                })
            })


        }
    })
}

function loaddms() {
    db.collection('direct').doc(user.uid).get().then(function (doc) {

        dms = Object.keys(doc.data())

        for (let i = 0; i < dms.length; i++) {

            a = document.createElement('button')
            a.classList.add('eon-text')
            a.id = dms[i]
            document.getElementById('messageslist').appendChild('a')
            addpfpdirect(dms[i])
            

            
        }

    })
}

function addpfpdirect(id) {
    db.collection('users').doc(id).get().then(function(doc) {
        document.getElementById(id).innerHTML = '<img class="shadow-sm" style="border-radius: 300px; width: 40px; height: 40px; object-fit: cover;" src="' + doc.data().url + '" alt="">'
    })
}