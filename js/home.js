user = firebase.auth().currentUser

while (typeof user !== undefined) {
    loadposts()
    break;
}

function showall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing All Posts'
}

function dontshowall() {
    document.getElementById('dropdownMenuButton1').innerHTML = 'Showing Relevant Posts'
}

function loadposts() {

}