db = firebase.firestore()
prevuid = 'na'
abritaryindex = 0
abritarysecondindex = 0
infScrollEnabled = false
sessionStorage.setItem('itwasmesoskip', 'false')
sessionStorage.setItem('active_dm', 'false')

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
        if (index == -1) {Snackbar.show({showAction: false,pos: 'bottom-center',text: "This username does not exist in our records."})}
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
                                content: 'Invitation',
                                timestamp: now,

                            }
                        ]
                    })
                    db.collection('users').doc(user.uid).update({
                        direct_active: firebase.firestore.FieldValue.arrayUnion(dmuid)
                    }).then(function() {
                        refreshactive()
                    })
                    db.collection('users').doc(dmuid).update({
                        direct_pending: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    })
                }
            })
        }
    })

}

function loaddirectclick() {
    loadpending()
}

function loaddirect() {
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
        Snackbar.show({showAction: false,pos: 'bottom-center',text: 'You are doing this too much!'})
    }

    window.setTimeout(function() {
        document.getElementById('skiddpypo').onclick = function() {
            loadpending()
            Snackbar.show({showAction: false,pos: 'bottom-center',text: 'Refreshing...'})
        } 
    }, 3000)
    db.collection('users').doc(user.uid).get().then(function(doc) {
        db.collection('app').doc("verified").get().then(function(verifieddoc) {
            verifiedlist = verifieddoc.data().verified 
            loadpendingfr(doc.data(), verifiedlist)

            pending = doc.data().direct_pending 

            document.getElementById('dmreqstatus').innerHTML = pending.length
            if (pending.length == 0) {
                document.getElementById('dmreqstatus').innerHTML = ''
            }
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
            content: "Rejection",
            sender: user.uid,
            timestamp: now,
        })
    }).then(function() {
        document.getElementById(uid + 'pendingcardel').classList.add('animated')
        document.getElementById(uid + 'pendingcardel').classList.add('zoomOutUp')
        window.setTimeout(function() {
            $('#' + uid + 'pendingcardel').remove()
            newnum = parseInt(document.getElementById('dmreqstatus').innerHTML) - 1
            document.getElementById('dmreqstatus').innerHTML = newnum
            if (newnum == 0) {
                document.getElementById('dmreqstatus').innerHTML = ''
                document.getElementById('skiddpypo').classList.remove('hidden')
            }
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
            content: "Approved",
            sender: user.uid,
            timestamp: now,
        })
    }).then(function() {
        document.getElementById(uid + 'pendingcardel').classList.add('animated')
        document.getElementById(uid + 'pendingcardel').classList.add('fadeOutUp')
        window.setTimeout(function() {
            $('#' + uid + 'pendingcardel').remove()
            newnum = parseInt(document.getElementById('dmreqstatus').innerHTML) - 1
            document.getElementById('dmreqstatus').innerHTML = newnum
            if (newnum == 0) {
                document.getElementById('dmreqstatus').innerHTML = ''
                document.getElementById('skiddpypo').classList.remove('hidden')
            }
        }, 1000)
        refreshactive()
        db.collection('directlisteners').doc(uid).update({
            most_recent_sender: 'eonnect_direct_approverq_' + user.uid
        })
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

function refreshactive() {
    $('#messagelist').empty()
    $('#messagecontent').empty()
    loadactive()
}

function loadactive() {
    if (sessionStorage.getItem('currenDM') == 'eonnect-news') {
        showEonnectNews()
        window.setTimeout(function() {
            $('#changelogbamstyle').html('#messagecontent {height: calc(100%) !important;  margin-top: 0px; overflow-y: scroll; transition: all 1s;}')
        }, 600)
        $('#unselectedconten').addClass('fadeOutUp')
        $('#unselectedconten').removeClass('fadeInDown')
        
    }

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
                        document.getElementById(element + 'chatsidebarboxel').click()
                    }, 1500)
                }
                
            }
            fixdisplayheight()
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
        document.getElementById(uid + 'chatsidebarboxel').innerHTML = '<img src="' + doc.data().url + '" class="msgimg centeredy" alt=""><div class="boxtext centeredy"><h4 class="heavy">' + doc.data().name + '</h4><br><p id="' + uid + 'recenttextel" class="grey nolineheight"></p></div><div class="boxtext2 centeredy"><span id="' + string + 'notifbadge" class="badge badge-pill notifbadge badge-secondary animated jello infinite"></span></div>'
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
            console.log('a');
            document.getElementById(doc.id + 'notifbadge').innerHTML = "!!"
            checkAllNotifs()
        }

    })

    

}

function BUILD_DIRECT(uid, btnel) {

    sessionStorage.setItem('active_dm', uid)
    infScroll_enable()

    $('#eonnectNewsContent').addClass('hidden')
    $('#changelogbamstyle').html('')
    document.getElementById('newdmmsg').click()
    document.getElementById('unselectedconten').classList.remove('fadeInDown')
    document.getElementById('unselectedconten').classList.add('fadeOutUp')

    $('#chatnav').removeClass('fadeOutUp')
    $('#chatnav').addClass('fadeIn')
    $('#divider1').removeClass('fadeOutUp')
    $('#divider1').removeClass('hidden')
    $('#divider1').addClass('zoomIn')
    $('#directfooter').addClass('fadeInUp')
    $('#directfooter').removeClass('fadeOutDown')

    alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()

    if ($('#' + string + 'chatcontainer').length) {
        if (!$('#' + string + 'chatcontainer').hasClass('hidden')) {
            // Do nothing if chat exists and it's not hidden
            return;
        }
    }

    if (document.getElementById(string + 'notifbadge').innerHTML == '!!') {
        // Clear notifications
        document.getElementById(string + 'notifbadge').innerHTML = ''
        checkAllNotifs()
        notifkey = 'unread_' + user.uid
        db.collection('direct').doc(string).update({
            [notifkey]: false,
        })
    }

    // Element Management
    $('.messagelistboxactive').removeClass('messagelistboxactive')
    $('#' + btnel).addClass('messagelistboxactive')
    $('.chatcontainer').addClass('hidden')
    

    if (this["dmcache"+uid] == undefined) {
        db.collection('users').doc(uid).get().then(function(doc) {
            this["dmcache"+uid] = doc.data()
            $('.topbarimg').attr('src', doc.data().url)
            document.getElementById("topbarimg").onclick = function() {
                usermodal(uid)
            }
            $('#navbarname').html(doc.data().name)
    
            document.getElementById('refreshstatusbtn').onclick = function() {
                Snackbar.show({showAction: false,pos: 'bottom-center',text: "You are doing this too much!"})
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
            document.getElementById('addfilebtn').onclick = function() {
                direct_UploadFile(uid)
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
    
            this["messagesarray" + uid] = []
            if ($('#' + string + 'chatcontainer').is(':empty')){
                // If its empty, build messages
                for (let i = 0; i < stringvar.length; i++) {
                    var item = {name: doc.data().name, stringvar: stringvar[i], string: string}
                    this["messagesarray" + uid].push(item)
                }
                this['messagesarray' + uid].reverse()
                $("#info2c").html(this["messagesarray" + uid].length)
                buildInfScroll()
            }
        })
    }
    else {

        $('.topbarimg').attr('src', this["dmcache"+uid].url)
        document.getElementById("topbarimg").onclick = function() {
            usermodal(uid)
        }
        $('#navbarname').html(this["dmcache"+uid].name)

        document.getElementById('refreshstatusbtn').onclick = function() {
            Snackbar.show({showAction: false,pos: 'bottom-center',text: "You are doing this too much!"})
        }
    
        window.setTimeout(function() {
            document.getElementById('refreshstatusbtn').onclick = function() {
                $('#navbarstatus').html("Loading...")
                window.setTimeout(function() {
                    refreshStatus(uid)
                }, 500)
            } 
        }, 3000)


        if (this["dmcache"+uid].direct_activity == undefined || this["dmcache"+uid].direct_activity == null) {
            status = 'unknown status'
        }
        else {
            ts = this["dmcache"+uid].direct_activity.toDate()
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
        document.getElementById('addfilebtn').onclick = function() {
            direct_UploadFile(uid)
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
            // If its empty, build messages
            for (let i = 0; i < stringvar.length; i++) {
                BUILD_MESSAGE(this["dmcache"+uid].name, stringvar[i], string)
            }
    
            ScrollBottom()
        }

    }

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
        chatcontainer.onscroll = function() {
            loadScrollingdirect(string)
        }
        chatcontainer.id = string + 'chatcontainer'

        document.getElementById('messagecontent').appendChild(chatcontainer)
    }

    // WebRTC Management
    document.getElementById('direct-callbtn').onclick = function() {
        window.open('rtc.html?type=a&target=' + uid);
        sendCallMsg(uid)
    }

    document.getElementById('direct-videobtn').onclick = function() {
        window.open('rtc.html?type=av&target=' + uid)
        sendVideoMsg(uid)
    }

    document.getElementById('direct-flagbtn').onclick = function() {
        reportUser(uid)
    }

    document.getElementById('direct-infobtn').onclick = function() {
        userInfo(uid)
    }

    $("#info2a").html(uid)
    $("#info2b").html(string)
    document.getElementById('purgefrominfo').onclick = function() {
        purgemessages(uid)
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

        tempmsg = {
            app_preset: 'none',
            content: content,
            sender: user.uid,
            timestamp: now
        }
        BUILD_MESSAGE(cacheuser.name, tempmsg , string, true)
        ScrollBottom()


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
            sessionStorage.setItem('itwasmesoskip', 'true')
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

function BUILD_MESSAGE(name, msg, string, anim, reverse) {
    p = document.createElement('div')

    if (anim == true) {
        p.classList.add('animated')
        p.classList.add('fadeIn')
    }

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


    if (msg.app_preset == 'eonnect-direct-file') {
        if (msg.sender == user.uid) {
            downloadFunc = "window.open('" + msg.app_preset_data + "')"
            msgcontent = '<h3><i class="material-icons gradicon2">attach_file</i>File</h3>You sent a file: ' + msg.content + '<br><br><button onclick="' + downloadFunc + '" class="eon-contained">view</button><br>'
            if (msg.content.endsWith('.png') || msg.content.endsWith('.jpg') || msg.content.endsWith('.jpeg') || msg.content.endsWith('.gif')) {
                msgcontent = 'You sent an image: <br><br><img src="' + msg.app_preset_data + '" class="inline-direct-img">'
            }
        }
        else {
            downloadFunc = "youareleaving('" + msg.app_preset_data + "')"
            msgcontent = '<h3><i class="material-icons gradicon2">attach_file</i>File</h3>' + name + ' sent you a file: ' + msg.content + '<br><br><button onclick="' + downloadFunc + '" class="eon-contained">view</button><br>'
            if (msg.content.endsWith('.png') || msg.content.endsWith('.jpg') || msg.content.endsWith('.jpeg') || msg.content.endsWith('.gif')) {
                msgcontent = 'You received an image: <br><br><img src="' + msg.app_preset_data + '" class="inline-direct-img">'
            }
        }
    }
    if (msg.app_preset == 'eonnect-direct-purge_request') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">delete_sweep</i>Purge Request</h3>You requested to purge your chat history with ' + name + '.' 
        }
        else {
            purgeFunc = "purge_agree('" + msg.sender + "', '" + name + "')"
            msgcontent = '<h3><i class="material-icons gradicon">delete_sweep</i>Purge Request</h3>' + name + ' requested to purge your chat history with them.<br><br><a onclick="' + purgeFunc + '" class="eon-contained">confirm</a>' 
        }
    }
    if (msg.app_preset == 'eonnect-direct-purge_approval') {
        msgcontent = '<h3><i class="material-icons gradicon">insights</i>Time to start fresh!</h3>This is the beggining of your new chat history.' 
    }    
    if (msg.app_preset == 'eonnect-direct-invitation') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">question_answer</i>Invitation to ' + name + '</h3>You requested to message ' + name + '.' 
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">question_answer</i>Invitation from ' + name + '</h3>' + name + ' requested to message you.' 
        }
    }
    if (msg.app_preset == 'eonnect-direct-rejection') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">close</i>You declied ' + name + ".</h3>You rejected " + name + "'s request to message you."
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">close</i>' + name + ' declied you.</h3>' + name + ' rejected your request to message them.'
        }
    }
    if (msg.app_preset == 'eonnect-direct-approval') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">check</i>You approved ' + name + ".</h3>You accepted " + name + "'s request to message you."
        }
        else {
            msgcontent = '<h3><i class="material-icons gradicon">check</i>' + name + ' approved you.</h3>' + name + ' accepted your request to message them.'
        }
    }
    if (msg.app_preset == 'eonnect-direct-call') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">phone</i>You started a call with ' + name + ".</h3>"
        }
        else {
            goFunc1 = "window.open('rtc.html?type=a&target=" + msg.sender + "')"
            msgcontent = '<h3><i class="material-icons gradicon">phone</i>' + name + ' started a call.</h3><center><button onclick="' + goFunc1 + '" class="eon-text">join</button></center>'
        }
    }
    if (msg.app_preset == 'eonnect-direct-video') {
        if (msg.sender == user.uid) {
            msgcontent = '<h3><i class="material-icons gradicon">videocam</i>You started a video call with ' + name + ".</h3>"
        }
        else {
            goFunc1 = "window.open('rtc.html?type=av&target=" + msg.sender + "')"
            msgcontent = '<h3><i class="material-icons gradicon">phone</i>' + name + ' started a video call.</h3><center><button onclick="' + goFunc1 + '" class="eon-text">join</button></center>'
        }
    }

    if (msg.app_preset.startsWith('eonnect-direct')) {
        p.classList.remove('messagecontainer')
        p.classList.add('systemmessagecontainer')
        textContainer = 'msgcontainerapp shadow-lg'
        prevuid = 'disabled'
    }

    p.innerHTML = '<div class="' + textContainer + '">' + msgcontent + '</div>'

    if (prevuid === msg.sender) {
        // Check if bottommost msg is a system msg
        el = $('#' + string + 'chatcontainer').find('.clearfix:first')
        if (el.hasClass('systemmessagecontainer')) {
            // Make sure dont add msg to previous sent msg
            prevuid = 'NANNANANANOOOOPE TRASH LOSER L'
        }
    }

    if (prevuid === msg.sender) {
        try {
            if (msg.sender == user.uid) {
                clientorme = 'client'
            }
            else {
                clientorme = 'other'
            }
            if (reverse) {
                $('#' + string + 'chatcontainer').children('.messagecontainer').last().children('.msgcontainer' + clientorme).first().get(0).innerHTML = msgcontent + '<br>' + $('#' + string + 'chatcontainer').children('.messagecontainer').last().children('.msgcontainer' + clientorme).first().get(0).innerHTML
                console.log('here');
            }
            else {
                $('#' + string + 'chatcontainer').children('.messagecontainer').first().children('.msgcontainer' + clientorme).last().get(0).innerHTML += '<br>' + msgcontent   
                console.log('here');
            }
            
        }
        catch { }
    }
    else {
        if (reverse == undefined) {
            reverse = false
        }
        if (reverse) {
            $('#' + string + 'chatcontainer').append(p)
            document.getElementById(string + 'chatcontainer').append(document.createElement('br'))
            console.log('here');
        }
        else {
            $('#' + string + 'chatcontainer').prepend(p)
            document.getElementById(string + 'chatcontainer').prepend(document.createElement('br'))
            console.log('here');
        }
        addWaves()
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
        if (changed_dm.startsWith('eonnect_direct_purge_approval_')) {
            db.collection('directlisteners').doc(user.uid).update({
                most_recent_sender: 'none'
            }).then(function() {
                userid = changed_dm.split('al_')[1]
                db.collection('users').doc(userid).get().then(function(doc) {
                    Snackbar.show({showAction: false,pos: 'bottom-center',text: doc.data().name + ' purged your chat history. Reloading...'})
                    window.setTimeout(function() {
                        window.location.reload()
                    }, 1200)
                })
                
            })
        }
        if (changed_dm.startsWith('eonnect_direct_approverq_')) {
            userid = changed_dm.split('rq_')[1]
            db.collection('users').doc(userid).get().then(function(doc) {
                Snackbar.show({showAction: false,pos: 'bottom-center',text: doc.data().name + ' approved your request!'})
            })
            return true
        }
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
        if (doc.data() == undefined || doc.data().messages == undefined) {
            return;
        }
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
            db.collection('users').doc(uid).get().then(function(doc) {
                if (sessionStorage.getItem('itwasmesoskip') !== 'true') {
                    BUILD_MESSAGE(doc.data().name, msg, string)
                }
                else {
                    sessionStorage.setItem('itwasmesoskip', 'false')
                }
                
                ScrollBottom()
                if ($('#' + string + 'chatcontainer').hasClass('hidden') || sessionStorage.getItem("currentab") !== 'inbox') {
                    console.log('a');
                    document.getElementById(string + 'notifbadge').innerHTML = '!!'
                    checkAllNotifs()
                    if (sessionStorage.getItem('currentab') !== 'inbox') {
                        Snackbar.show({showAction: false,pos: 'bottom-center',
                            text: "New Message: " + msg.content.substring(0,12) + '...',
                            pos: 'bottom-right'
                        })
                    }
                }
                else {
                    notifkey = 'unread_' + user.uid
                    db.collection('direct').doc(string).update({
                        [notifkey]: false,
                    })
                }
            })
        }
        else {
            // Add a ping because it means you reciveved a message but it is not built
            console.log('a');
            document.getElementById(string + 'notifbadge').innerHTML = '!!'
            checkAllNotifs()

            if (sessionStorage.getItem('currentab') !== 'inbox') {
                Snackbar.show({showAction: false,pos: 'bottom-center',
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

function ScrollTop() {
    var objDiv = document.getElementById("messagecontent");
    objDiv.scrollTop = 0;
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

function sendCallMsg(uid) {
    alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    now = new Date()

    unreadkey = 'unread_' + uid
    db.collection('direct').doc(string).update({
        [unreadkey]: true,
        messages: firebase.firestore.FieldValue.arrayUnion({
            app_preset: 'eonnect-direct-call',
            content: 'Call',
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

function sendVideoMsg(uid) {
    alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
    string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
    now = new Date()

    unreadkey = 'unread_' + uid
    db.collection('direct').doc(string).update({
        [unreadkey]: true,
        messages: firebase.firestore.FieldValue.arrayUnion({
            app_preset: 'eonnect-direct-video',
            content: 'Video Call',
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

function checkAllNotifs() {
    notifexists = false
    $('.notifbadge').each(function(i) {
        if ($(this).html().includes("!!")) {
            notifexists = true
        }
    })
    if (notifexists) {
        $('#ultimatenotifbadge').html('!!')
    }
    else {
        $('#ultimatenotifbadge').html('')
    }
}

// Follow Requests

function loadpendingfr(user, verified) {
    document.getElementById('skiddpypofr').onclick = function() {
        Snackbar.show({showAction: false,pos: 'bottom-center',text: 'You are doing this too much!'})
    }

    window.setTimeout(function() {
        document.getElementById('skiddpypofr').onclick = function() {
            db.collection('users').doc(user.uid).get().then(function(doc) {
                db.collection('app').doc("verified").get().then(function(verifieddoc) {
                    verifiedlist = verifieddoc.data().verified 
                    loadpendingfr(doc.data(), verifiedlist)
                })
            }).then(function() {
                Snackbar.show({showAction: false,pos: 'bottom-center',text: 'Refreshing...'})
            })
        } 
    }, 6000)

    requests = user.requested

    if (user.requests == undefined) {
        requests = []
    }

    document.getElementById('frreqstatus').innerHTML = requests.length

    if (requests.length == 0) {
        document.getElementById('frreqstatus').innerHTML = ''
    }
    if (requests.length > 0) {
        document.getElementById('frreqstatus').classList.add('jello')
        document.getElementById('clickybtnshowfrreq').click()
        document.getElementById('skiddpypofr').classList.add('hidden')
    }
    else {
        document.getElementById('skiddpypofr').classList.remove('hidden')
    }
    for (let i = 0; i < requests.length; i++) {
        const element = requests[i];
        u = document.createElement('div')
        u.classList.add('card')
        u.id = element + 'pendingcardelfr'
        u.classList.add('pendingcard')
        document.getElementById('frreqlist').appendChild(u)
        addpendingcardcontentfr(element, verified)
    }
}

function addpendingcardcontentfr(element, verification) {
    db.collection('users').doc(element).get().then(function(doc) {
        verified = ''
        for (let i = 0; i < verification.length; i++) {if (verification[i] == element) {verified = '<i id="' + name + 'verifiedelement" data-toggle="tooltip" data-placement="top" title="Verified" class="material-icons verified">verified_user</i><br><br>'}   }

        rejectFunc = "rejectfollow('" + element + "')"
        approveFunc = "approvefollow('" + element + "')"
        viewuserFunc = "usermodal('" + element + "')"
    
        document.getElementById(element + 'pendingcardelfr').innerHTML = '<img class="dmreqpfp" src="' + doc.data().url + '" alt=""><h3>' + doc.data().name + '</h3>' + verified + '<p class="nolineheight">' + doc.data().rep + ' Rep</p><br><center><button onclick="' + viewuserFunc + '" class="eon-contained">view user</button><br><br></center><button onclick="' + rejectFunc + '" class="eon-text reject refreshbtn"><i class="material-icons">close</i></button><button onclick="' + approveFunc + '" class="eon-text approve refreshbtn"><i class="material-icons">check</i></button>'
        $('.verified').tooltip()
        addWaves()
    })
}

function rejectfollow(id) {
    db.collection('users').doc(user.uid).update({
        requested: firebase.firestore.FieldValue.arrayRemove(id)
    }).then(function () {
        Snackbar.show({showAction: false,pos: 'bottom-center',text: "Declined follow request."})
        document.getElementById(uid + 'pendingcardelfr').classList.add('animated')
        document.getElementById(uid + 'pendingcardelfr').classList.add('zoomOutUp')
        window.setTimeout(function() {
            $('#' + id + 'pendingcardelfr').remove()
            newnum = parseInt(document.getElementById('frreqstatus').innerHTML) - 1
            document.getElementById('frreqstatus').innerHTML = newnum
            if (newnum == 0) {
                document.getElementById('frreqstatus').innerHTML = ''
                document.getElementById('skiddpypofr').classList.remove('hidden')
            }
        }, 1000)
    })
}

function approvefollow(id) {
    db.collection('users').doc(user.uid).update({
        requested: firebase.firestore.FieldValue.arrayRemove(id)
    })
    db.collection('users').doc(user.uid).update({
        followers: firebase.firestore.FieldValue.arrayUnion(id)
    })
    db.collection('users').doc(id).update({
        following: firebase.firestore.FieldValue.arrayUnion(user.uid)
    })
    Snackbar.show({showAction: false,pos: 'bottom-center',text: "Approved follow request."})
    document.getElementById(id + 'pendingcardelfr').classList.add('animated')
    document.getElementById(id + 'pendingcardelfr').classList.add('fadeOutUp')
    window.setTimeout(function() {
        $('#' + id + 'pendingcardelfr').remove()
        newnum = parseInt(document.getElementById('frreqstatus').innerHTML) - 1
        document.getElementById('frreqstatus').innerHTML = newnum
        if (newnum == 0) {
            document.getElementById('frreqstatus').innerHTML = ''
            document.getElementById('skiddpypofr').classList.remove('hidden')
        }
    }, 1000)

}

function infScroll_enable() {
    if (infScrollEnabled == true) {
        return;
    }

    window.infiniteScrollCount = 24
    infScrollEnabled = true
    activedm = sessionStorage.getItem('active_dm')
    this['currentScrollCount' + activedm] = 0
}

function buildInfScroll() {
    activedm = sessionStorage.getItem('active_dm')

    // If currentcount is NaN, disable scroll bug happened
    if (isNaN(this['currentScrollCount' + activedm])) {
        this['currentScrollCount' + activedm] = 0
    }

    // array is copy of array
    // this['currentScrollCount' + activedm] is number of postsalready printed
    array = this["messagesarray" + activedm]

    // delete first posts from temporary array that already printed
    for (let i = 0; i < this['currentScrollCount' + activedm]; i++) {
        array.shift()
    }

    // remove all posts except for next "infintie scroll count" amount
    array = array.slice(0, infiniteScrollCount);
    
    // build whats left and add it to active dm
    for (let i = 0; i < array.length; i++) {
        BUILD_MESSAGE(array[i].name, array[i].stringvar,array[i].string, false, true)
    }

    // update current scroll count
    this['currentScrollCount' + activedm] = this['currentScrollCount' + activedm] + infiniteScrollCount

}

//BUILD_MESSAGE(doc.data().name, stringvar[i], string)
//ScrollBottom()

function loadScrollingdirect(id) {
    if (document.getElementById(id + 'chatcontainer').scrollTop < 12) {
        buildInfScroll()
    }
}

function userInfo(uid) {
    $('#conversationInfo').modal('toggle')
}

function showEonnectNews() {
    sessionStorage.setItem('active_dm', 'eonnectnews')

    $('.messagelistboxactive').removeClass('messagelistboxactive')
    $('#eonnectNewschatsidebarboxel').addClass('messagelistboxactive')
    $('.chatcontainer').addClass('hidden')   
    $('#chatnav').removeClass('hidden')

    $('#eonnectNewsContent').removeClass('hidden')
    window.setTimeout(function() {
        $('#chatnav').removeClass('fadeIn')
        window.setTimeout(function() {
            $('#changelogbamstyle').html('#messagecontent {height: calc(100%) !important;  margin-top: -107px; overflow-y: scroll; transition: all 1s;}')
        }, 500)
    }, 250)
    $('#chatnav').removeClass('fadeIn')
    $('#chatnav').addClass('fadeOutUp')
    $('#divider1').removeClass('zoomIn')
    $('#divider1').addClass('fadeOutUp')
    $('#directfooter').removeClass('fadeInUp')
    $('#directfooter').addClass('fadeOutDown')
    history.pushState(null, '', '/eonnect/app.html?tab=inbox&dm=eonnect-news');

    if ($('#eonnect-dm-version').html() !== 'loading') {
        ScrollTop()
        return false;
    }
    // Have to build
    $.getJSON("https://gitlab.com/api/v4/projects/16896350/repository/commits", function( data ) {
        $('#eonnect-dm-version').html(data[0].title)
        for (let i = 0; i < data.length; i++) {
            newupdatehtml = '<div class="card updatecard"><div class="card-body"><p><b>' + data[i].title + '</b> commited by ' + data[i].author_name + '</p><div class="commentmsg">' + data[i].message.split(data[i].title)[1].replace(new RegExp("-", "g"), '<br>').replace(new RegExp("Eonnect 🔥", "g"), "<br><br><i>Eonnect 🔥</i>") + '</div><br><p>' + data[i].authored_date + ' | <a href="' + data[i].web_url + '" target="_blank">view commit</a></p></div></div>'
            document.getElementById('eonnect-dm-latest').innerHTML = document.getElementById('eonnect-dm-latest').innerHTML + newupdatehtml
        }
    });
    ScrollTop()
}

$(window).on('resize', fixdisplayheight());

function purgemessages(uid) {
    user_confirmed = confirm('Are you sure you would like to purge every message? \nThe other user must also confirm to purge each message.\n\nThis action is irreversible.')
    if (user_confirmed) {
        alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
        var now = new Date()
    
        db.collection('direct').doc(string).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                app_preset: "eonnect-direct-purge_request",
                content: "Purge Request",
                sender: user.uid,
                timestamp: now,
            })
        }).then(function() {
            ENACT_CHANGES(uid)
            db.collection('directlisteners').doc(uid).update({
                most_recent_sender: user.uid
            }).then(function() {
                Snackbar.show({
                    text: "Purge request sent.",
                    showAction: false,
                    pos: 'bottom-center'
                })
            })
        })
    }
    else {
        Snackbar.show({
            text: "Confirmation cancelled; Nothing changed.",
            showAction: false,
            pos: 'bottom-center'
        })  
    }
}

function purge_agree(uid, name) {
    user_confirmed = confirm('Are you sure you would like to purge every message with ' + name + '? \n\nThis action is irreversible.')
    if (user_confirmed) {
        alphabeticalized = [];alphabeticalized.push(user.uid);alphabeticalized.push(uid);alphabeticalized.sort(function(a, b) {var textA = a.toUpperCase();var textB = b.toUpperCase();return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
        string = alphabeticalized[0].toString() + alphabeticalized[1].toString()
        var now = new Date()
    
        db.collection('direct').doc(string).get().then(function(doc) {
            messages = doc.data().messages
            db.collection('app').doc('archive').collection('pending_deletion_transcripts').doc(string).get().then(function(doc) {
                if (doc.exists) {
                    // Do nothing
                    purge_agree_complete(uid, name, string, messages, now)            
                }
                else {
                    // Make it something
                    db.collection('app').doc('archive').collection('pending_deletion_transcripts').doc(string).set({
                        messages: []
                    }).then(function() {
                        purge_agree_complete(uid, name, string, messages, now)                    
                    })
                }
            })
        })

    }
    else {
        Snackbar.show({
            text: "Confirmation cancelled; Nothing changed.",
            showAction: false,
            pos: 'bottom-center'
        })  
    }    
}

function purge_agree_complete(uid, name, string, messages, now) {
    db.collection('app').doc('archive').collection('pending_deletion_transcripts').doc(string).update({
        messages: firebase.firestore.FieldValue.arrayUnion({messages})
    }).then(function() {
        db.collection('direct').doc(string).update({
            messages: []
        }).then(function() {
            db.collection('direct').doc(string).update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    app_preset: "eonnect-direct-purge_approval",
                    content: "Purge Approved",
                    sender: user.uid,
                    timestamp: now,
                })
            }).then(function() {
                Snackbar.show({text: "Chat history cleared. Reloading..."})
                db.collection('directlisteners').doc(uid).update({
                    most_recent_sender: 'eonnect_direct_purge_approval_' + user.uid
                }).then(function() {
                    db.collection('directlisteners').doc(uid).update({
                        most_recent_sender: 'none'
                    })
                    
                    window.setTimeout(function() {
                        window.location.reload()
                    }, 1200)
                })
            })
        })
    })
}

function leavedm() {
    $('.messagelistboxactive').removeClass('messagelistboxactive')
    $('.chatcontainer').addClass('hidden')
    $('#chatnav').addClass('hidden')
    $('#divider1').addClass('hidden')
    $('#directfooter').addClass('hidden')
    $('#unselectedconten').removeClass('fadeOutUp')
    $('#unselectedconten').addClass('fadeInDown')
    $('#eonnectNewsContent').addClass('hidden')
    history.pushState(null, '', '/eonnect/app.html?tab=inbox')   
}

function direct_UploadFile(uid) {
    document.getElementById('skiddyfileupload').value = ''
    sessionStorage.setItem('targetuid', uid)
    $('#skiddyfileupload').click()
}

function direct_confirmUpload() {
    uid = sessionStorage.getItem('targetuid')
    file = document.getElementById('skiddyfileupload').files[0]
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('conversations/' + string + '/' + file.name).put(file);
    $('#uploadprogress').removeClass('hidden')
    $('#uploadprogress').removeClass('fadeOut')
    $('#uploadprogress').addClass('fadeIn')
    $('#divider2').removeClass('zoomIn')
    $('#divider2').addClass('fadeOut')
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      $('#uploadprogressbar').css('width', progress + '%')
    }, function(error) {
      alert(error)
      $('#divider2').removeClass('fadeOut')
      $('#divider2').addClass('zoomIn')
      $('#uploadprogress').removeClass('fadeIn')
      $('#uploadprogress').addClass('fadeOut')
      window.setTimeout(function() {
        $('#uploadprogress').addClass('hidden')
      }, 1200)
    }, function() {
        $('#divider2').removeClass('fadeOut')
        $('#divider2').addClass('zoomIn')
        $('#uploadprogress').removeClass('fadeIn')
        $('#uploadprogress').addClass('fadeOut')
        window.setTimeout(function() {
          $('#uploadprogress').addClass('hidden')
        }, 1200)
      uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
        now = new Date()
        unreadkey = 'unread_' + uid

        db.collection('direct').doc(string).update({
            [unreadkey]: true,
            messages: firebase.firestore.FieldValue.arrayUnion({
                app_preset: 'eonnect-direct-file',
                app_preset_data: url,
                content: file.name,
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
      });
    });
}