$(window).ready(function () {

    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')
    sessionStorage.setItem('first-time-home', 'true')

    var urlParams = new URLSearchParams(window.location.search);
    tab = urlParams.get('tab')

    if (tab == null || tab == undefined) {

        urlParams = new URLSearchParams(window.location.search);
        sessionStorage.setItem('viewPost', urlParams.get('post'))
        sessionStorage.setItem('viewInfo', urlParams.get('info'))
        sessionStorage.setItem('fullInfo', urlParams.get('fullscreen'))
        checkUrls()
        tabe("home")
    }
    else {
        console.log("Going to tab: " + tab);
        tabe(tab)
    }

})

function tabe(tab) {
    //sessionStorage.setItem("currentviewingdm", 'not')
    //unshowdm()

    sessionStorage.setItem("currentab", tab)
    $('#justifiedTab').children('a').each(function () { this.classList.remove('navthing'); })
    $('#justifiedTab').children('i').each(function () { this.classList.remove('iconactive'); })
    $('#justifiedTab').children('h4').each(function () { this.classList.remove('navbarbuttontextactive'); })
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
                // Load posts, etc
                break;
            case "account":
                // Load account details, etc
                break;

            default:
                break;
        }
    }
}