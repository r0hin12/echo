function enableparticles() {
    document.getElementById('particlesdiv').classList.add('rubberBand')
    window.setTimeout(function () {
        document.getElementById('particlesdiv').classList.remove('rubberBand')
    }, 1000)
    document.getElementById('c3').checked = true
    document.getElementById('c3').onchange = function () {
        nothing()
    }
    window.setTimeout(function () {
        document.getElementById('c3').onchange = function () {
            disableparticles()
        }
    }, 3000)

    db.collection('users').doc(user.uid).update({
        particles: true
    }).then(function () {
        Snackbar.show({ text: 'Enabled chatroom particles.' });



    })
}

function disableparticles() {
    document.getElementById('particlesdiv').classList.add('rubberBand')
    document.getElementById('c3').checked = false
    document.getElementById('c3').onchange = function () {
        nothing()
    }
    window.setTimeout(function () {
        document.getElementById('c3').onchange = function () {
            enableparticles()
        }
    }, 3000)
    window.setTimeout(function () {
        document.getElementById('particlesdiv').classList.remove('rubberBand')
    }, 1000)
    db.collection('users').doc(user.uid).update({
        particles: false
    }).then(function () {
        Snackbar.show({ text: 'Disabled chatroom particles.' })

    })




}
function checkparticles() {
    db.collection('users').doc(user.uid).get().then(function (doc) {
        if (doc.data().particles) {
            document.getElementById('c3').onchange = function () {
                disableparticles()
            }
            document.getElementById('c3').checked = true
        }
        else {
            document.getElementById('c3').onchange = function () {
                enableparticles()

            }
            document.getElementById('c3').checked = false
        }
    })
}

function nothing() {
    Snackbar.show({ text: 'Processing too many requests. Please wait a moment.' })

    if (document.getElementById('c3').checked) {
        document.getElementById('c3').checked = false
    }
    else {
        document.getElementById('c3').checked = true
    }

}
