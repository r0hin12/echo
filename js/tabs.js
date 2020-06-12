$(window).ready(function () {

    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-account', 'true')
    sessionStorage.setItem('first-time-inbox', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')


    var urlParams = new URLSearchParams(window.location.search);
    tab = urlParams.get('tab')

    switch (tab) {
        case "returnstatusemail":
            Snackbar.show({text: "You email was successfully changed."})
            tab = 'account'
            break;
        case "returnstatuspass":
            Snackbar.show({text: "You password was successfully changed."})
            tab = 'account'
            break;
        case "returnstatusprivate":
            Snackbar.show({text: "You visibility was successfully changed to private."})
            tab = 'account'
            break;
        case "returnstatuspublic":
            Snackbar.show({text: "You password was successfully changed to public."})
            tab = 'account'
            break;
        default:
            break;
    }



    if (tab == null || tab == undefined) {

        sessionStorage.setItem('viewPost', urlParams.get('post'))
        sessionStorage.setItem('viewInfo', urlParams.get('info'))
        sessionStorage.setItem('fullInfo', urlParams.get('fullscreen'))
        sessionStorage.setItem('viewUser', urlParams.get('user'))
        tabe("home")
        checkUrls()
        
    }
    else {
        tabe(tab)
    }

})

function tabe(tab) {
    //sessionStorage.setItem("currentviewingdm", 'not')
    //unshowdm()

    document.getElementById('title').innerHTML = tab.charAt(0). toUpperCase() + tab.split(tab.charAt(0))[1] + ' | Eonnect'

    sessionStorage.setItem("currentab", tab)
    $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); })
    $('.iconactive').each(function(i, obj) {
        obj.classList.remove('iconactive')
    })
    $('.navbarbuttontextactive').each(function() {this.classList.remove('navbarbuttontextactive')})
    document.getElementById(tab + '-tab').classList.add('navthing')
    document.getElementById(tab + '-icon').classList.add('iconactive')
    document.getElementById(tab + '-text').classList.add('navbarbuttontextactive')
    document.getElementById(tab + '-tab').click()
    Waves.ripple('#' + tab + '-tab');
    history.pushState(null, '', '/eonnect/app.html?tab=' + tab);

    val = sessionStorage.getItem('first-time-' + tab)
    if (val == 'true') {
        sessionStorage.setItem('first-time-' + tab, 'false')

        switch (tab) {
            case "home":
                interval = window.setInterval(function () {
                    if (typeof (user) != "undefined" && typeof (user) != null) {
                        clearInterval(interval)
                        load()
                        loadscrolling()
                    }
                }, 200);
                break;
            case "inbox":
                loaddirect()
                break;
            case "account":
                //
                break;
            default:
                break;
        }
    }
}