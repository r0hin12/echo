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
    // ID is id
    console.log('Opened connection with ID: ' + id);

    var urlParams = new URLSearchParams(window.location.search);
    window.uid = urlParams.get('target');
    window.type = urlParams.get('type');

    if (uid == null || uid == undefined) {
      transferdark('app.html')
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

    string = alphabeticalized[0].toString() + alphabeticalized[1].toString();

    db.collection('rtc')
    .doc(string + type)
    .onSnapshot(function (doc) {
      if (doc.data().skiddy == 'GONE') {
        showcomplete();
      }
    });

    $('#waitingtext').removeClass('hidden')
    $('#loadingtext').removeClass('fadeIn')
    $('#loadingtext').addClass('fadeOutUp')

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
                    navigator.getUserMedia(
                      { video: true, audio: false },
                      function (stream) {
                        document.getElementById('mine').srcObject = stream;
                        document.getElementById('mine').play();
                      }
                    );
                  }

                  // Stream for peer
                  navigator.getUserMedia(
                    { video: videoya, audio: true },
                    function (stream) {
                      call = peer.call(conn.peer, stream);
                      call.on('stream', function (stream) {
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
                navigator.getUserMedia({ video: true, audio: false }, function (
                  stream
                ) {
                  document.getElementById('mine').srcObject = stream;
                  document.getElementById('mine').play();
                });
              }

              // Stream for peer
              navigator.getUserMedia({ video: videoya, audio: true }, function (
                stream
              ) {
                call.answer(stream);
                call.on('stream', function (stream) {
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
  $('#connected').removeClass('hidden')

  if (type == 'a') {
    $('#cameorabtn').addClass('hidden')
  }

  db.collection('users')
    .doc(uid)
    .get()
    .then(function (doc) {
      $('.userimg').attr('src', doc.data().url);
      $('.userimg').removeClass('hidden');
      $('#name').html(doc.data().name);
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
  $('#complete').removeClass('hidden')
  $('#connected').addClass('animated');
  $('#connected').addClass('fadeOutUp');
}
