firebase.initializeApp({
  apiKey: 'AIzaSyDyiJGiWlgFaMtJA2lerw4lUkGK76Qoxvs',
  authDomain: 'eongram-87169.firebaseapp.com',
  databaseURL: 'https://eongram-87169.firebaseio.com',
  projectId: 'eongram-87169',
  storageBucket: 'eongram-87169.appspot.com',
  messagingSenderId: '725793838303',
  appId: '1:725793838303:web:f23c748b3985225c5c056a',
});

window.db = firebase.firestore();
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

sessionStorage.setItem('muted', 'false')
sessionStorage.setItem('deafened', 'false')
sessionStorage.setItem('skiponeu', 'false');
sessionStorage.setItem('skiponeu2', 'false');
sessionStorage.setItem('justsent', 'false')
window.setInterval(() => {
  sessionStorage.setItem('skiponeu', 'false');
  sessionStorage.setItem('skiponeu2', 'false');
  sessionStorage.setItem('justsent', 'false')
}, 30000);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.user = firebase.auth().currentUser;
    doconnect();
  } else {
    transfer('index.html?return=' + window.location.href);
  }
});

function doconnect() {
  window.peer = new Peer();
  peer.on('open', function (id) {
    console.log('ECP | Opened connection with ID: ' + id);
    console.log('------ STATUS EVENTS BELOW --------');

    var urlParams = new URLSearchParams(window.location.search);
    window.uid = urlParams.get('target');
    window.type = urlParams.get('type');

    if (uid == null || uid == undefined) {
      transferdark('app.html');
      return;
    }

    alphabeticalized = [];
    alphabeticalized.push(user.uid);
    alphabeticalized.push(uid);
    alphabeticalized.sort(function (a, b) {
      var textA = a.toUpperCase();
      var textB = b.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    window.string = alphabeticalized[0].toString() + alphabeticalized[1].toString();

    db.collection('rtc')
      .doc(string + type)
      .onSnapshot(function (doc) {
        if (doc.data().skiddy == 'GONE') {
          showcomplete();
        }
        db.collection('rtc').doc(string + type).update({
          lfg: 'na'
        })
        if (doc.data().lfg == 'ya') {
          if (sessionStorage.getItem('skiponeu') == 'true') {
            sessionStorage.setItem('skiponeu2', 'false');
            sessionStorage.setItem('skiponeu', 'false');
          } else {
            db.collection('rtc')
              .doc(string + type)
              .update({
                lfg: 'na',
              })
              .then(function () {
                if (sessionStorage.getItem('skiponeu2') == 'true') {
                  sessionStorage.setItem('skiponeu2', 'false');
                  console.log('ECP | Avoided reload loop with sessionStorage: ' + sessionStorage.getItem('skiponeu2') + ' and ' + sessionStorage.getItem('skiponeu') );
                } else {
                  window.location.reload();
                }
              });
          }
        }

        if (doc.data().sent !== 'nothing') {
          if (doc.data().sent == undefined) {
            db.collection('rtc').doc(string + type).update({
              sent: 'nothing',
            })
          }
          else {
            if (sessionStorage.getItem('justsent') == 'true') {
              sent(doc.data().sent)
              sessionStorage.setItem('justsent', 'false');
            } else {
              db.collection('rtc').doc(string + type).update({
                sent: 'nothing',
              })
              recieveda(doc.data().sent)
            }

          }
        }
      });

    checkstrangestuf(string + type);

    $('#waitingtext').removeClass('hidden');
    $('#loadingtext').removeClass('fadeIn');
    $('#loadingtext').addClass('fadeOutUp');

    $('#waitingid').html('Private Room ID: ' + string + type);
    if (type == 'av') {
      $('#waitingtype').html('Video & Audio Chat');
    } else {
      $('#waitingtype').html('Audio Chat');
    }

    if (alphabeticalized[0] == user.uid) {
      // I am the host because I have a more alphabeticalized name
      db.collection('rtc')
        .doc(string + type)
        .set({
          hostready: false,
        })
        .then(function () {
          window.setTimeout(function () {
            db.collection('rtc')
              .doc(string + type)
              .set({
                hostready: id,
              })
              .then(function () {
                peer.on('disconnected', function () {
                  window.close();
                });
                peer.on('connection', (conn) => {
                  showconnected();

                  videoya = true;
                  if (type == 'a') {
                    videoya = false;
                  } else {
                    // Stream for client
                    navigator.getUserMedia({
                        video: true,
                        audio: false
                      },
                      function (stream) {
                        window.mystreamfinal = stream
                        document.getElementById('mine').srcObject = stream;
                        document.getElementById('mine').play();
                      }
                    );
                  }

                  // Stream for peer
                  navigator.getUserMedia({
                      video: videoya,
                      audio: true
                    },
                    function (stream) {
                      window.mystreamfinal = stream
                      call = peer.call(conn.peer, stream);
                      call.on('stream', function (stream) {
                        window.theirstreamfinal = stream
                        // `stream` is the MediaStream of the remote peer.
                        // Here you'd add it to an HTML video/canvas element.
                        document.getElementById('theirs').srcObject = stream;
                        document.getElementById('theirs').play();
                        window.bstream = stream;
                        setInterval(() => {
                          if (bstream.active == false) {
                            clearInterval();
                            showcomplete();
                          }
                        }, 1000);
                      });
                    }
                  );

                  window.conn = conn;
                  conn.on('data', (data) => {
                    console.log(data);
                  });
                  conn.on('open', () => {});
                });
              });
          }, 2500);
        });
    } else {
      // I am not the host, so wait until the host is ready.
      listener = db
        .collection('rtc')
        .doc(string + type)
        .onSnapshot(function (doc) {
          if (doc.exists == false) {
            db.collection('rtc')
              .doc(string + type)
              .set({
                enabled: true,
              })
              .then(function () {
                window.location.reload();
              });
          }
          if (doc.data().hostready !== false) {
            // Host is ready (set it to false again)
            window.conn = peer.connect(doc.data().hostready);
            conn.on('open', () => {
              listener();
            });
            conn.on('data', (data) => {
              console.log(data);
            });
            peer.on('disconnected', function () {
              showcomplete();
            });
            peer.on('call', function (call) {
              showconnected();

              // Answer the call, providing our mediaStream
              videoya = true;
              if (window.type == 'a') {
                videoya = false;
              } else {
                // Stream for client
                navigator.getUserMedia({
                  video: true,
                  audio: false
                }, function (stream) {
                  window.mystreamfinal = stream
                  document.getElementById('mine').srcObject = stream;
                  document.getElementById('mine').play();
                });
              }

              // Stream for peer
              navigator.getUserMedia({
                video: videoya,
                audio: true
              }, function (stream) {
                window.mystreamfinal = stream
                call.answer(stream);
                call.on('stream', function (stream) {
                  window.theirstreamfinal = stream
                  document.getElementById('theirs').srcObject = stream;
                  window.astream = stream;
                  setInterval(() => {
                    if (astream.active == false) {
                      clearInterval();
                      peer.disconnect();
                      showcomplete();
                    }
                  }, 1000);
                  document.getElementById('theirs').play();
                });
              });
            });

            // doc.data().hostready is the other person peer ID
            db.collection('rtc')
              .doc(string + type)
              .set({
                hostready: false,
              });
          }
        });
    }
  });
}

function showconnected() {
  $('#unconnected').addClass('animated');
  $('#unconnected').addClass('fadeOutUp');
  $('#connected').removeClass('hidden');

  if (type == 'a') {
    $('#cameorabtn').addClass('hidden');
  }

  db.collection('users').doc(user.uid).get().then(function(doc) {
    document.getElementsByClassName('userimg')[1].setAttribute('src', doc.data().url)
    document.getElementsByClassName('userimg')[1].classList.remove('hidden')
    document.getElementsByClassName('usertext')[1].innerHTML = doc.data().name
  })

  db.collection('users').doc(uid).get().then(function (doc) {
    document.getElementsByClassName('userimg')[0].setAttribute('src', doc.data().url)
    document.getElementsByClassName('userimg')[0].classList.remove('hidden')
    document.getElementsByClassName('usertext')[0].innerHTML = doc.data().name

    $('#disconnectbtn').get(0).onclick = function () {
      peer.disconnect();
      db.collection('rtc')
        .doc(string + type)
        .update({
          skiddy: 'GONE',
        })
        .then(function () {
          window.setTimeout(function () {
            db.collection('rtc')
              .doc(string + type)
              .update({
                skiddy: 'PAPA',
              });
          }, 500);
        });
      showcomplete();
    };
    addWaves();
  });
}

function showcomplete() {
  $('#complete').removeClass('hidden');
  $('#connected').addClass('animated');
  $('#connected').addClass('fadeOutUp');
}

function checkstrangestuf(str) {
  db.collection('rtc').doc(str).update({
    lfg: 'ya',
  }).then(function () {
    sessionStorage.setItem('skiponeu', 'true');
    sessionStorage.setItem('skiponeu2', 'true');
  })
}

function send(sentitem) {
  sessionStorage.setItem('justsent', 'true');
  db.collection('rtc').doc(string + type).update({
    sent: sentitem,
  }).then(function() {
    window.setTimeout(function() {
      db.collection('rtc').doc(string + type).update({
        sent: 'nothing',
      })
    })
  })
}

function recieveda(exp, sent) {
  if (sent) {
    console.log('ECP | Playing sent expression: ' + exp);
  }
  else {
    console.log('ECP | Received expression: ' + exp);
  }

  switch (exp) {
    case 'heart':
      heartel = document.createElement('div')
      heartel.classList.add('heartbefore')
      heartel.classList.add('centered')
      heartel.innerHTML = '<i class="material-icons animated heartBeat infinite">favorite</i>'
      heartel.id = 'heartel'
      document.getElementById('body').appendChild(heartel)
      window.setTimeout(function() {
        document.getElementById('heartel').classList.add('heartafter')
      }, 100)
      window.setTimeout(function() {
        document.getElementById('heartel').classList.add('animated')
        document.getElementById('heartel').classList.add('bounceOut')
        window.setTimeout(function() {
          $('#heartel').remove()
        }, 1000)
      }, 1000)
      break;
    case 'eonnect-code-mute':
        document.getElementById('theirs').muted = true
      break;
    case 'eonnect-code-unmute':
      document.getElementById('theirs').muted = false
      break;

    default:
      break;
  }
}

function sent(exp) {
  if (exp !== 'eonnect-code-unmute' && exp !== 'eonnect-code-mute') {
    console.log('ECP | Sent expression: ' + exp);
    Snackbar.show({showAction: false,pos: 'bottom-center',text: "You sent expression: " + exp.charAt(0).toUpperCase() + exp.slice(1)})
    recieveda(exp, true)
  }
}

function togglemute(hide) {
  sessionStorage.setItem('justsent', 'true');
  if (sessionStorage.getItem('muted') == 'true') {
    if (!hide) {
      Snackbar.show({showAction: false,pos: 'bottom-center',text: "Unmuted"})
    }
    $('#mutebtn').html('<i class="material-icons animate bounceIn">mic</i>')
    db.collection('rtc').doc(string + type).update({
      sent: 'eonnect-code-unmute'
    }).then(function() {
      console.log('ECP | Unmuted client'); 
      sessionStorage.setItem('muted', 'false') 
    })
  }
  else {
    $('#mutebtn').html('<i class="material-icons animate bounceIn">mic_off</i>')
    if (!hide) {
      Snackbar.show({showAction: false,pos: 'bottom-center',text: "Muted"})
    }
    db.collection('rtc').doc(string + type).update({
      sent: 'eonnect-code-mute'
    }).then(function() {
      console.log('ECP | Muted client'); 
      sessionStorage.setItem('muted', 'true') 
    })
  }
}

function toggledeafen() {
  if (sessionStorage.getItem('deafened') == 'true') {
    $('#deafenbtn').html('<i class="material-icons animated bounceIn">hearing</i>')
    Snackbar.show({showAction: false,pos: 'bottom-center',text: "Undeafened"})
    sessionStorage.setItem('deafened', 'false') 
    sessionStorage.setItem('muted', 'true') 
    document.getElementById('theirs').muted = false
    togglemute(true)
  }
  else {
    $('#deafenbtn').html('<i class="material-icons animated bounceIn">hearing_disabled</i>')
    Snackbar.show({showAction: false,pos: 'bottom-center',text: "Deafened"})
    sessionStorage.setItem('deafened', 'true') 
    sessionStorage.setItem('muted', 'false') 
    document.getElementById('theirs').muted = true
    togglemute(true)

  }
}