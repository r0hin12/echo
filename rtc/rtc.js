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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.user = firebase.auth().currentUser;

    doconnect();
  } else {
    transfer('index.html?return=' + window.location.href);
  }
});

function doconnect() {
  var peer = new Peer();

  peer.on('open', function (id) {
    // ID is id
    console.log(id);

    var urlParams = new URLSearchParams(window.location.search);
    uid = urlParams.get('target');
    if (uid == null || uid == undefined) {
      console.log('URL Param target is undefined.');
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

    if (alphabeticalized[0] == user.uid) {
      // I am the host because I have a more alphabeticalized name
      db.collection('rtc')
        .doc(string)
        .set({
          hostready: id,
        })
        .then(function () {

            peer.on('connection', (conn) => {
                console.log('Connected to peer. Listeners setup.');
              window.conn = conn
              conn.on('data', (data) => {
                  console.log(data);
              });
              conn.on('open', () => {
              });
            });

        });
    } else {
      // I am not the host, so wait until the host is ready.
      listener = db
        .collection('rtc')
        .doc(string)
        .onSnapshot(function (doc) {
          if (doc.data().hostready !== false) {
            // Host is ready (set it to false again)
            listener();
            window.conn = peer.connect(doc.data().hostready);
            conn.on('open', () => {
                console.log('Connected to peer. Listeners setup.');
              });
              conn.on('data', (data) => {
                console.log(data);
            });

            // doc.data().hostready is the other person peer ID
            db.collection('rtc').doc(string).set({
              hostready: false,
            });
          }
        });
    }
  });



}

