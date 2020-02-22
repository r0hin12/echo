function expandnotifs() {

    document.getElementById('notifscard').classList.add('notif')
    document.getElementById('notifsbutton').classList.remove('centered')
    document.getElementById('notifsbutton').classList.add('centeredx')






    document.getElementById('notificon').classList.add('animated')
    document.getElementById('notificon').classList.add('fadeIn')
    document.getElementById('notificon').innerHTML = 'cancel'


    window.setTimeout(function () {

        document.getElementById('actualstuff').classList.remove('fadeOut')
        document.getElementById('actualstuff').classList.add('fadeIn')

        document.getElementById('notifsbutton').onclick = function () {
            shrinknotifs()
            document.getElementById('notificon').classList.remove('animated')
            document.getElementById('notificon').classList.remove('fadeIn')
        }
    }, 1000)



}

function shrinknotifs() {
    document.getElementById('notifscard').classList.remove('notif')
    document.getElementById('notifsbutton').classList.add('centered')
    document.getElementById('notifsbutton').classList.remove('centeredx')
    document.getElementById('notificon').classList.add('animated')
    document.getElementById('notificon').classList.add('fadeIn')
    document.getElementById('notificon').innerHTML = 'email'
    document.getElementById('actualstuff').classList.add('fadeOut')
    document.getElementById('actualstuff').classList.remove('fadeIn')
    window.setTimeout(function () {


        document.getElementById('notifsbutton').onclick = function () {
            expandnotifs()
            document.getElementById('notificon').classList.remove('animated')
            document.getElementById('notificon').classList.remove('fadeIn')
        }
    }, 1000)

}