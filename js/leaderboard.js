db = firebase.firestore()

function leaderboard() {
    array = []
    $('#leadercontent').empty()


    db.collection('users').where("rep", ">", 1).get().then(function (querysnapshop) {
        querysnapshop.forEach(function (doca) {

            array.push({ id: doca.id, data: doca.data() })

        })
        array.sort((a, b) => (a.data.rep > a.data.rep) ? 1 : -1)
        array.slice(0, 3);
        buildleaderboard(array)


    })



}

function buildleaderboard(array) {

    for (let i = 0; i < array.length; i++) {
        id = array[i].id
        data = array[i].data

        a = document.createElement('div')
        a.classList.add('card')
        iplus1 = i + 1
        userFunc = "usermodal('" + id + "')"
        a.innerHTML = '<div class="card-body"><div class="row"><div class="col-sm"><center id="' + id + 'el"></center></div><div class="col-sm"><center><span style="font-size: 24px" class="badge badge-pill badge-info">' + iplus1 + '</span></center></div><div class="col-sm"><center><h2 style="display: inline-block">' + data.rep + '</h2></h4 style="display: inline-block"> rep</h4></center></div></div><center><button onclick="' + userFunc + '" class="waves btn-old-text">view profile</button></center></div>'

        document.getElementById('leadercontent').appendChild(a)
        document.getElementById('leadercontent').appendChild(document.createElement('br'))

        addstuffyo(id)


    }


}

function addstuffyo(id) {

    db.collection('users').doc(id).get().then(function (doca) {
        document.getElementById(id + 'el').innerHTML = '<img style="border-radius: 400px; width: 40px" src="' + doca.data().url + '"><h4 id="' + id + 'name"></h4>'
        document.getElementById(id + 'name').innerHTML = doca.data().name
        addWaves()



    })






}