db = firebase.firestore()

function loaddirect() {
    loadpending()
    loadactive()
}

function loadpending() {
    document.getElementById('skiddpypo').onclick = function() {
        Snackbar.show({text: 'You are doing this too much!'})
    }

    window.setTimeout(function() {
        document.getElementById('skiddpypo').onclick = function() {
            loadpending()
            Snackbar.show({text: 'Refreshing...'})
        } 
    }, 3000)
    db.collection('users').doc(user.uid).get().then(function(doc) {
        db.collection('app').doc("verified").get().then(function(verifieddoc) {
            verifiedlist = verifieddoc.data().verified 

            pending = doc.data().direct_pending 

            document.getElementById('dmreqstatus').innerHTML = pending.length
            if (pending.length > 0) {
                document.getElementById('dmreqstatus').classList.add('jello')
                document.getElementById('clickybtnshowdmreq').click()
                document.getElementById('skiddpypo').classList.add('hidden')
            }
            else {
                document.getElementById('skiddpypo').classList.remove('hidden')
            }

            for (let i = 0; i < pending.length; i++) {
                const element = pending[i];
                u = document.createElement('div')
                u.classList.add('card')
                u.id = element + 'pendingcardel'
                u.classList.add('pendingcard')
                document.getElementById('dmreqlist').appendChild(u)
                addpendingcardcontent(element, verifiedlist)
            }
        })
    })
}

function reject(uid) {

    db.collection('users').doc(user.uid).update({
        direct_pending: firebase.firestore.FieldValue.arrayRemove(uid)
    })

    alphabeticalized = []
    alphabeticalized.push(user.uid)
    alphabeticalized.push(uid)
    alphabeticalized.sort(function(a, b) {
        var textA = a.toUpperCase();
        var textB = b.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    var now = new Date()

    db.collection('direct').doc(string).update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            app_preset: "eonnect-direct-rejection",
            content: "eonnect-direct-rejection",
            sender: user.uid,
            timestamp: now,
        })
    }).then(function() {
        document.getElementById(uid + 'pendingcardel').classList.add('animated')
        document.getElementById(uid + 'pendingcardel').classList.add('zoomOutUp')
        window.setTimeout(function() {
            $('#' + uid + 'pendingcardel').remove()
        }, 1000)
        
    })
}

function approve(uid) {

    db.collection('users').doc(user.uid).update({
        direct_pending: firebase.firestore.FieldValue.arrayRemove(uid)
    })

    db.collection('users').doc(user.uid).update({
        direct_active: firebase.firestore.FieldValue.arrayUnion(uid)
    })

    alphabeticalized = []
    alphabeticalized.push(user.uid)
    alphabeticalized.push(uid)
    alphabeticalized.sort(function(a, b) {
        var textA = a.toUpperCase();
        var textB = b.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    var now = new Date()

    db.collection('direct').doc(string).update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            app_preset: "eonnect-direct-approval",
            content: "eonnect-direct-approval",
            sender: user.uid,
            timestamp: now,
        })
    }).then(function() {
        document.getElementById(uid + 'pendingcardel').classList.add('animated')
        document.getElementById(uid + 'pendingcardel').classList.add('zoomOutUp')
        window.setTimeout(function() {
            $('#' + uid + 'pendingcardel').remove()
        }, 1000)

        // Build sidebar for person
        
    })


}

function addpendingcardcontent(element, verification) {
    db.collection('users').doc(element).get().then(function(doc) {
        verified = ''
        for (let i = 0; i < verification.length; i++) {if (verification[i] == element) {verified = '<i id="' + name + 'verifiedelement" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i><br><br>'}   }

        rejectFunc = "reject('" + element + "')"
        approveFunc = "approve('" + element + "')"
        viewuserFunc = "usermodal('" + element + "')"
    
        document.getElementById(element + 'pendingcardel').innerHTML = '<img class="dmreqpfp" src="' + doc.data().url + '" alt=""><h3>' + doc.data().name + '</h3>' + verified + '<p class="nolineheight">' + doc.data().rep + ' Rep</p><br><center><button onclick="' + viewuserFunc + '" class="eon-contained">view user</button><br><br></center><button onclick="' + rejectFunc + '" class="eon-text reject refreshbtn"><i class="material-icons">close</i></button><button onclick="' + approveFunc + '" class="eon-text approve refreshbtn"><i class="material-icons">check</i></button>'
        $('.verified').tooltip()
        addWaves()
    })
}

function loadactive() {

    


}

function newdm() {
    username = document.getElementById('newdmfield').value

    db.collection('app').doc('details').get().then(function(doc) {
        console.log(doc.data().usernames);
        index = doc.data().usernames.indexOf(username)
        if (index == -1) {Snackbar.show({text: "This username does not exist in our records."})}
        else {
            dmuid = doc.data().map[index]
            alphabeticalized = []
            alphabeticalized.push(user.uid)
            alphabeticalized.push(dmuid)

            alphabeticalized.sort(function(a, b) {
                var textA = a.toUpperCase();
                var textB = b.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
            db.collection('direct').doc(string).get().then(function(doc) {
                if (doc.exists) {
                    // DM already exists
                } 
                else {
                    var now = new Date()
                    db.collection('direct').doc(string).set({
                        info: {
                            start_date: firebase.firestore.FieldValue.serverTimestamp(),
                            start_user: user.uid,
                        },
                        messages: [
                            {
                                sender: user.uid,
                                app_preset: 'eonnect-direct-invitation',
                                content: 'eonnect-direct-invitation',
                                timestamp: now,

                            }
                        ]
                    })
                    db.collection('users').doc(user.uid).update({
                        direct_active: firebase.firestore.FieldValue.arrayUnion(dmuid)
                    })
                    db.collection('users').doc(dmuid).update({
                        direct_pending: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    })
                }
            })
        }
    })

}