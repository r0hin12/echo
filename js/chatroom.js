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
            toggleloader()
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
                            loadchatroom(id)
                        }, 1000)
                    })
                }
            })
        }
    }
}


loadchatroomurl()

function loadchatroomurl() {
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
}
function loadchatroom(id) {

    document.getElementById('chat').style.display = 'block'
    document.getElementById('home').style.display = 'none'
    document.getElementById('chat').classList.add('animated')
    document.getElementById('chat').classList.add('fadeIn')



}

