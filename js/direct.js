db = firebase.firestore()
prevuid = 'na'
abritaryindex = 0
abritarysecondindex = 0

interval2 = window.setInterval(function () {
    if (typeof (user) != "undefined" && typeof (user) != null) {
        clearInterval(interval2)
        loaddirect()
        updateStatus()
    }
}, 200);

function newdm() {
    username = document.getElementById('newdmfield').value

    db.collection('app').doc('details').get().then(function(doc) {
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

function loaddirect() {
    loadpending()
    loadactive()
    PREPARE_LISTEN_MESSAGES()

    document.getElementById("newdmmsg").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("newdmmsgbtn").click();
        }
    })
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
            window.location.reload()
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
    db.collection('users').doc(user.uid).get().then(function(doc) {
        db.collection('app').doc("verified").get().then(function(verifieddoc) {
            arr = doc.data().direct_active
            if (arr == undefined) {
                arr = []
            }
            verification = verifieddoc.data().verified

            for (let i = 0; i < arr.length; i++) {
                const element = arr[i];

                q = document.createElement('div')
                q.classList.add('messagelistbox')
                q.classList.add('animated')
                q.classList.add('shadow-sm')
                q.onclick = function() {
                    BUILD_DIRECT(element, this.id)
                    ScrollBottom()
                    history.pushState(null, '', '/eonnect/app.html?tab=inbox&dm=' + this.id.split('chatsidebarboxel')[0]);
                }
                q.classList.add('fadeInUp')
                q.classList.add('hidden')
                q.id = element + 'chatsidebarboxel'
                document.getElementById('messagelist').appendChild(q)
                document.getElementById('messagelist').appendChild(document.createElement('br'))
                addsidebarcardcontent(element, verification)

                if (element == sessionStorage.getItem('currenDM')) {
                    window.setTimeout(function() {
                        showcomplete()
                        document.getElementById(element + 'chatsidebarboxel').click()
                    }, 1500)
                    
                }
                
            }
        })
    })
}

function addsidebarcardcontent(uid, verification) {
    db.collection("users").doc(uid).get().then(function(doc) {
        alphabeticalized = []
        alphabeticalized.push(user.uid)
        alphabeticalized.push(uid)
        alphabeticalized.sort(function(a, b) {
            var textA = a.toUpperCase();
            var textB = b.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        string = alphabeticalized[0].toString() + alphabeticalized[1].toString()

        
        document.getElementById(uid + 'chatsidebarboxel').innerHTML = '<img src="' + doc.data().url + '" class="msgimg centeredy" alt=""><div class="boxtext centeredy"><h4 class="heavy">' + doc.data().name + '</h4><br><p id="' + uid + 'recenttextel" class="grey nolineheight"></p></div><div class="boxtext2 centeredy"><span id="' + string + 'notifbadge" class="badge badge-pill badge-info animated jello infinite"></span></div>'
        document.getElementById(uid + 'chatsidebarboxel').classList.remove('hidden')
        addWaves()
        BUILD_DIRECT_VARIABLES(uid)
    })
}

function BUILD_DIRECT_VARIABLES(uid) {
    alphabeticalized = []
    alphabeticalized.push(user.uid)
    alphabeticalized.push(uid)
    alphabeticalized.sort(function(a, b) {
        var textA = a.toUpperCase();
        var textB = b.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    
    this[string + abritaryindex] = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    db.collection('direct').doc(this[string + abritaryindex]).get().then(function(doc) {

        this["marker"+doc.id] = doc.data().messages
        
        reallength = doc.data().messages.length - 1
        if (doc.data().messages[reallength].content.length > 12) {
            document.getElementById(uid + 'recenttextel').innerHTML = doc.data().messages[reallength].content.substring(0,12) + '...'
        }
        else {
            document.getElementById(uid + 'recenttextel').innerHTML = doc.data().messages[reallength].content.substring(0,12)
        }
        

        unreadkey = "unread_" + user.uid
        if (doc.data()[unreadkey]) {
            document.getElementById(string + 'notifbadge').innerHTML = "!!"
        }

    })

    

}

function BUILD_DIRECT(uid, btnel) {

    alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    if ($('#' + string + 'chatcontainer').length) {
        if (!$('#' + string + 'chatcontainer').hasClass('hidden')) {
            return;
        }
    }

    if (document.getElementById(string + 'notifbadge').innerHTML == '!!') {
        // Clear notifications
        document.getElementById(string + 'notifbadge').innerHTML = ''
        notifkey = 'unread_' + user.uid
        db.collection('direct').doc(string).update({
            [notifkey]: false,
        })
    }

    // Element Management
    $('.messagelistboxactive').removeClass('messagelistboxactive')
    $('#' + btnel).addClass('messagelistboxactive')
    $('.chatcontainer').addClass('hidden')
    

    db.collection('users').doc(uid).get().then(function(doc) {
        $('.topbarimg').attr('src', doc.data().url)
        $('#navbarname').html(doc.data().name)


        document.getElementById('refreshstatusbtn').onclick = function() {
            Snackbar.show({text: "You are doing this too much!"})
        }
    
        window.setTimeout(function() {
            document.getElementById('refreshstatusbtn').onclick = function() {
                $('#navbarstatus').html("Loading...")
                window.setTimeout(function() {
                    refreshStatus(uid)
                }, 500)
            } 
        }, 3000)


        if (doc.data().direct_activity == undefined || doc.data().direct_activity == null) {
            status = 'unknown status'
        }
        else {
            ts = doc.data().direct_activity.toDate()
            now = new Date();
            const diff = now.getTime() -  ts.getTime();

            if (diff > 10 * 60 * 1000) {
                status = 'Inactive'
            }
            else {
                status = 'Online'
            }
        }
        $('#navbarstatus').html(status)

        $('#chatnav').removeClass('hidden')
        $('.divider1').removeClass('hidden')
        $('.divider2').removeClass('hidden')
        $('.directfooter').removeClass('hidden')
        document.getElementById('newdmmsgbtn').onclick = function() {
            ADD_MESSAGE(uid)
        }
        
        alphabeticalized = []
        alphabeticalized.push(user.uid)
        alphabeticalized.push(uid)
        alphabeticalized.sort(function(a, b) {
            var textA = a.toUpperCase();
            var textB = b.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
        stringvar = this["marker" + string]

        if ($('#' + string + 'chatcontainer').is(':empty')){
            for (let i = 0; i < stringvar.length; i++) {
                BUILD_MESSAGE(doc.data().name, stringvar[i], string)
            }
    
            ScrollBottom()
        }
    })

    // Chat Management
    alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()

    if ($('#' + string + 'chatcontainer').length) {
        $('#' + string + 'chatcontainer').removeClass('hidden')
    }
    else {
        chatcontainer = document.createElement('div')
        chatcontainer.classList.add('chatcontainer')
        chatcontainer.classList.add('animated')
        chatcontainer.classList.add('fadeIn')
        chatcontainer.id = string + 'chatcontainer'

        document.getElementById('messagecontent').appendChild(chatcontainer)
    }

}

function ADD_MESSAGE(uid) {
    content = document.getElementById('newdmmsg').value

    if (content == "" || content == " " || content == "  " || content == "    " || content.replace(" ", "") == "") {
        return;
    }

    else {
        document.getElementById('newdmmsg').value = ''

        alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
        now = new Date()

        unreadkey = 'unread_' + uid
        db.collection('direct').doc(string).update({
            [unreadkey]: true,
            messages: firebase.firestore.FieldValue.arrayUnion({
                app_preset: 'none',
                content: content,
                sender: user.uid,
                timestamp: now,
            })
        }).then(function() {
            ENACT_CHANGES(uid)
        })
        db.collection('directlisteners').doc(uid).update({
            most_recent_sender: user.uid
        }).then(function() {
            db.collection('directlisteners').doc(uid).update({
                most_recent_sender: 'none'
            })
        })
    }

}

function BUILD_MESSAGE(name, msg, string) {
    p = document.createElement('div')

    p.classList.add('messagecontainer')
    p.classList.add('clearfix')

    if (msg.sender == user.uid) {
        // Client sent it
        textContainer = 'msgcontainerclient shadow-sm'
    }
    else {
        // Not client
        textContainer = 'msgcontainerother shadow-sm'
    }

    //TIMESTAMP IS msg.timestamp.toDate().toLocaleTimeString().slice(0, msg.timestamp.toDate().toLocaleTimeString().lastIndexOf(":")) + ' ' + msg.timestamp.toDate().toLocaleTimeString().slice(-2)

    msgcontent = msg.content

    
    if (msg.app_preset == 'eonnect-direct-invitation') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">question_answer</i>Invitation to ' + name + '</h3>You requested to message ' + name + '.' 
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">question_answer</i>Invitation from ' + name + '</h3>' + name + ' requested to message you.' 
        }
        textContainer = 'msgcontainerapp shadow-lg'
        prevuid == 'disabled'
    }
    if (msg.app_preset == 'eonnect-direct-rejection') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">close</i>You declied ' + name + ".</h3>You rejected " + name + "'s request to message you."
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">close</i>' + name + ' declied you.</h3>' + name + ' rejected your request to message them.'
        }
        textContainer = 'msgcontainerapp shadow-lg'
        prevuid == 'disabled'
    }
    if (msg.app_preset == 'eonnect-direct-approval') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">check</i>You approved ' + name + ".</h3>You accepted " + name + "'s request to message you."
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">check</i>' + name + ' approved you.</h3>' + name + ' accepted your request to message them.'
        }
        textContainer = 'msgcontainerapp shadow-lg'
        prevuid == 'disabled'
    }


        p.innerHTML = '<div class="' + textContainer + '">' + msgcontent + '</div>'

    if (prevuid == msg.sender) {
        if (msg.sender == user.uid) {
            try {
                $('#' + string + 'chatcontainer').children('.messagecontainer').last().children('.msgcontainerclient').last().get(0).innerHTML += '<br>' + msgcontent   
            } catch (error) {
                
            }
        }
        else {
            try {
                $('#' + string + 'chatcontainer').children('.messagecontainer').last().children('.msgcontainerother').last().get(0).innerHTML += '<br>' + msgcontent   
            } catch (error) {
                
            }
        }

    }

    else {
        document.getElementById(string + 'chatcontainer').appendChild(p)
        document.getElementById(string + 'chatcontainer').appendChild(document.createElement('br'))
    }

    prevuid = msg.sender
    if (msg.app_preset.startsWith('eonnect-')) {
        prevuid = 'disabled'
    }
}

function PREPARE_LISTEN_MESSAGES() {
    db.collection('directlisteners').doc(user.uid).get().then(function(doc) {
        if (doc.exists) {
            LISTEN_MESSAGES()
        }
        else {
            db.collection('directlisteners').doc(user.uid).set({
                most_recent_sender: 'none'
            })
        }
    })


}

function LISTEN_MESSAGES() {
    db.collection('directlisteners').doc(user.uid).onSnapshot(function(doc) {
        changed_dm = doc.data().most_recent_sender
        if (changed_dm == 'none') {

        }
        else {
            ENACT_CHANGES(changed_dm)
        }
    })
}

function ENACT_CHANGES(uid) {
    alphabeticalized = []
    alphabeticalized.push(user.uid)
    alphabeticalized.push(uid)
    alphabeticalized.sort(function(a, b) {
        var textA = a.toUpperCase();
        var textB = b.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    db.collection('direct').doc(string).get().then(function(doc) {
        length = doc.data().messages.length - 1
        msg = doc.data().messages[length]
        document.getElementById(uid + 'recenttextel').innerHTML = msg.content.substring(0,12)
        if (msg.content.length > 12) {
            document.getElementById(uid + 'recenttextel').innerHTML = msg.content.substring(0,12) + '...'
        }
        else {
            document.getElementById(uid + 'recenttextel').innerHTML = msg.content.substring(0,12)
        }
        

        if( $('#' + string + 'chatcontainer').length ) {
            BUILD_MESSAGE(undefined, msg, string)
            ScrollBottom()

            if ($('#' + string + 'chatcontainer').hasClass('hidden')) {
                document.getElementById(string + 'notifbadge').innerHTML = '!!'
            }

        }
        else {
            // Add a ping
            document.getElementById(string + 'notifbadge').innerHTML = '!!'

            if (sessionStorage.getItem('currentab') !== 'inbox') {
                Snackbar.show({
                    text: "New Message: " + msg.content.substring(0,12) + '...',
                    pos: 'bottom-right'
                })
            }

            this["marker"+string] = doc.data().messages

        }
    })
}

function ScrollBottom() {
    var objDiv = document.getElementById("messagecontent");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function updateStatus() {
    db.collection('users').doc(user.uid).update({
        direct_activity: firebase.firestore.FieldValue.serverTimestamp()
    })
}

setInterval(function(){ updateStatus }, 720000);

function refreshStatus(uid) {


    db.collection('users').doc(uid).get().then(function(doc) {
        if (doc.data().direct_activity == undefined || doc.data().direct_activity == null) {
            status = 'unknown status'
        }
        else {
            ts = doc.data().direct_activity.toDate()
            now = new Date();
            const diff = now.getTime() -  ts.getTime();

            if (diff > 10 * 60 * 1000) {
                status = 'Inactive'
            }
            else {
                status = 'Online'
            }
        }
        $('#navbarstatus').html(status)
    })
}