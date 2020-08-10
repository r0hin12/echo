storageRef = firebase.storage().ref();
db = firebase.firestore()

sessionStorage.setItem('fullscreenon', 'no')
sessionStorage.setItem('view', 'relevant')
sessionStorage.setItem('viewing', 'stoplookinghere')
sessionStorage.setItem('currentlyviewinguser', 'uwu')
sessionStorage.setItem('currentlyviewingpost', 'owooo ❤️')
sessionStorage.setItem('skiponce', 'false')
sessionStorage.setItem('skiponce2', 'false')
sessionStorage.setItem('skiponce3', 'false')
sessionStorage.setItem('skiponce123', 'false')
sessionStorage.setItem('skiponce1234', 'false')


$("#imgInp").change(function(){if(this.files&&this.files[0]){var e=new FileReader;e.onload=function(e){$("#blah").attr("src",e.target.result)},e.readAsDataURL(this.files[0])}document.getElementById("blah").style.display="block",document.getElementById("captionel").style.display="block",document.getElementById("captionelel").style.display="block"});

function showall() {
    done_loading()
    document.getElementById('grid').style.removeProperty('display');
    resizeAllGridItems()
    sessionStorage.setItem('view', 'all')
}

function done_loading() {
    addWaves()

    document.getElementById('loading').classList.add('fadeOut')
    window.setTimeout(() => {
        document.getElementById('loading').style.display = 'none'        
    }, 800);
}

$('#postModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce1234') == "true") {
        sessionStorage.setItem('skiponce1234', "false")
    }
    else {

        if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
            window.history.pushState(null, '', '/eonnect/app.html')
        }
        else {
            window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }

});

$('#commentModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce123') == "true") {
        sessionStorage.setItem('skiponce123', "false")
    }
    else {

        if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
            window.history.pushState(null, '', '/eonnect/app.html')
        }
        else {
            window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }

});

$('#userModal').on('hidden.bs.modal', function () {
    if (sessionStorage.getItem('skiponce3') == "true") {
        sessionStorage.setItem('skiponce3', "false")
    }
    else {

        if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
            window.history.pushState(null, '', '/eonnect/app.html')
        }
        else {
            window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
        }
    }
});

$('#infoModal').on('hidden.bs.modal', function () {
    x = sessionStorage.getItem('tocomments')
    if (x == "true") {
        sessionStorage.setItem('tocomments', false)
    }
    else {
        x = sessionStorage.getItem('touser')
        if (x == "true") {
            sessionStorage.setItem('touser', false)
        }
        else {
            if (sessionStorage.getItem('currentab') == null || sessionStorage.getItem('currentab') == "null") {
                window.history.pushState(null, '', '/eonnect/app.html')
            }
            else {
                window.history.pushState(null, '', '/eonnect/app.html?tab=' + sessionStorage.getItem('currentab'));
            }
        }
    }

});

$(function () {
    $(".heart").on("click", function () {
        $(this).toggleClass("is-active");
    });
});


function checkUrls() {
    var post = sessionStorage.getItem('viewComments')
    if (post == "null" || post == " " || post == "") {
    }
    else {
        db.collection('new_posts').doc(post).get().then(function(doc) {
            if (doc.exists) {
                loadComments(post, doc.data().uid)
            }
        })
    }

    var fullscreenpost = sessionStorage.getItem('fullInfo')
    if (fullscreenpost == "null" || fullscreenpost == " " || fullscreenpost == "") {

    }
    else {
        showcomplete()
        fullscreen(fullscreenpost)
    }
    var viewInfo = sessionStorage.getItem('viewInfo')
    if (viewInfo == 'null' || viewInfo == " " || viewInfo == "") {

    }
    else {
        info(viewInfo)
    }
    var viewUser = sessionStorage.getItem('viewUser')
    if (viewUser == 'null' || viewUser == " " || viewUser == "") {

    }
    else {
        window.setTimeout(function() {
            usermodal(viewUser)
        }, 1000)
    }

    var viewPost = sessionStorage.getItem('viewPost')
    if (viewPost == 'null' || viewUser == " " || viewUser == "") {

    }
    else {
        window.setTimeout(function() {
            viewpost(viewPost)
        }, 1000)
    }

}
