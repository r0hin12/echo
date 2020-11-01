async function loadCredits() {
  db.collection('products').where('active', '==', true).get().then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {

      const priceSnap = await doc.ref.collection('prices').get();
      priceSnap.docs.forEach((doc) => {
        price = doc.data().unit_amount / 100
        priceID = doc.id
      });

      a = document.createElement('div')
      a.setAttribute('class', 'purchaseItem shadow hidden animated fadeIn')
      a.id = doc.id + 'priceItem'
      a.innerHTML = `
        <img src="${doc.data().images[0]}"/>
        <h2 class="animated zoomIn">${doc.data().name}</h2>
        <p class="animated fadeInUp">${doc.data().description}</p>
        <br>
        <center>
          <button onclick="startCheckout('${priceID}', '${doc.id}')" class="eon-contained animated fadeIn">Purchase ($${price}usd)</button>
        </center>
      `

      $('#purchaseBoxes').get(0).appendChild(a)

      $('#' + doc.id + 'priceItem').imagesLoaded(() => {
        $('#priceLoader').addClass('hidden')
        $('#' + doc.id + 'priceItem').removeClass('hidden')
      })
    });

    addWaves()
  });
}

async function startCheckout(id, package) {
  checkDoc = await db.collection('dealt').doc(user.uid).get()

  if (checkDoc.exists && checkDoc.data()[package]) {
    alert('You are already subscribed to this monthly package.')
    return;
  }

  toggleloader()
  const docRef = await db.collection("customers").doc(user.uid).collection('checkout_sessions').add({
    price: id,
    success_url: window.location.href.split('?').shift() + '?tab=checkStripe',
    cancel_url: window.location.href.split('?').shift() + '?tab=cancelStripe',
  })

  docRef.onSnapshot(snap => {
    const {sessionId } = snap.data();

    if (sessionId) {
      // Redirect to checkout
      const stripe = Stripe('pk_live_51HiZ1SBa3MWDKrNRDi6Gl1mfeAhFmUGtP7EmEjWFB32FIF6d44fR0a2IPw7OBaJle88TSq5OS6qRxvhIh2wVMd9X00Fpw3SMEG');
      stripe.redirectToCheckout({sessionId})
    }
  })

}


async function checkStripe() {
  console.log('Check it');
  var manageSubAdd = firebase.functions().httpsCallable('manageSubAdd');
  result = await manageSubAdd()

  if (result.data.result[1]) {
    // Something changed

    Snackbar.show({text: "You've got new credits!!"})
  }

}