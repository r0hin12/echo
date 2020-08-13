function load_trending_tags() {
    var trendingTopics = firebase.functions().httpsCallable('trendingTopics');
    trendingTopics().then(function(result) {
        $("#explore_loader").addClass('animated')
        $("#explore_loader").addClass('fadeOut')
        window.setTimeout(function() {
            $("#explore_loader").addClass('hidden')
        }, 600)

        // trending_build
        for (let i = 0; i < result.data.length; i++) {
            const element = result.data[i];
            k = document.createElement('div')
            k.classList.add('card')
            k.classList.add('animated')
            k.classList.add('fadeInUp')
            k.classList.add('trend_box')
            id = element.name.replace(/[\W_]+/g," ").replace(/\s+/g, '-').toLowerCase();
            k.onclick = function() {
                load_trend(element, this.id)
            }

            k.id = id
            k.innerHTML = '<div class="card-body">' + element.name + '</div>'

            // Stylesheet
            imagecss = 'content: ""; background-image: url("'  + element.image + '"); background-size: cover; background-position: center; position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; opacity: 0.40; border-radius: 15px;'
            if (element.image == 'nothing') {
                imagecss = ''
                newcss = ''

                k.classList.add('indeterminate_trend')
            }
            else {
                newcss = '#' + id + '::before {' + imagecss + '}'
            }

            p = document.createElement('div')
            p.innerHTML = ''
            p.id = id + 'contentcontainer'
            p.classList.add('animated');p.classList.add('hidden')
            p.classList.add('trend_content_container')

            if (!expanded) {
                p.classList.add('trend_content_container_fullwidth')   
            }

            document.getElementById('trending_content').appendChild(p)
            document.getElementById('trending_build').appendChild(k)
            document.getElementById('explorebgstyle').innerHTML = document.getElementById('explorebgstyle').innerHTML + newcss

            var trend = sessionStorage.getItem('viewTrend')
            if (trend == id) {
                load_trend(element, id)
            }

            addWaves()

        }


    }).catch(function(error) {
        $("#explore_loader").addClass('animated')
        $("#explore_loader").addClass('fadeOut')
        window.setTimeout(function() {
            $("#explore_loader").addClass('hidden')
        }, 600)


        console.log(`Error ${error.code}: ${error.message}. Details: ${error.details}`);
    })
}

function load_trend(data, id) {
    container = document.getElementById(`${id}contentcontainer`)
    window.activeTrend = id

    if ( $(`#${id}contentcontainer`).is(':empty') ) {
        // Generate Content

        a = document.createElement('h1')
        a.innerHTML = id
        document.getElementById(`${id}contentcontainer`).appendChild(a)

        b = document.createElement('img')
        b.src = data.image
        b.classList.add('imagebannertrend');b.classList.add('shadow-sm')
        document.getElementById(`${id}contentcontainer`).appendChild(b)

        c = document.createElement('div')
        c.innerHTML = `<button onclick="trend_imageCredit()'" class="eon-text iconbtn"><i class="material-icons">portrait</i></button> <button class="eon-text iconbtn"><i class="material-icons">more_vert</i></button> <button onclick="closeTrend()" class="eon-text iconbtn"><i class="material-icons">close</i></button>`
        c.classList.add('container'); c.classList.add('trend_buttons')
        document.getElementById(`${id}contentcontainer`).appendChild(c)
        f = document.createElement('center')
        f.classList.add('postgridcontainer')
        f.innerHTML = `<div class="trend_grid" id="${id}postcontainer"></div>`
        document.getElementById(`${id}contentcontainer`).appendChild(f)

        $(`#${id}contentcontainer`).addClass('backInUp')
        $(`#${id}contentcontainer`).addClass('slow')

        load_trend_content(id)

    }
    else {
        $(`#${id}contentcontainer`).removeClass('backInUp')
        $(`#${id}contentcontainer`).removeClass('slow')
        $(`#${id}contentcontainer`).addClass('fadeInUp')
        // Not generate anything
    }

    $('#' + id + 'contentcontainer').removeClass('hidden')
    $(`#${id}contentcontainer`).removeClass('backOutDown')
    $('#exploretabcontent').addClass('exploretabcontentinactive')
    history.pushState(null, "", "?trend=" + id)
    addWaves()

    // Snackbar.show({text: "Feature coming soon..."})
}

function trend_imageCredit(data) {
    console.log(data);
}

function closeTrend() {
    $(`#${activeTrend}contentcontainer`).removeClass('backInUp')
    $(`#${activeTrend}contentcontainer`).removeClass('fadeInUp')

    $(`#${activeTrend}contentcontainer`).addClass('slow')
    $(`#${activeTrend}contentcontainer`).addClass('backOutDown')

    window.setTimeout(() => {
        $('#exploretabcontent').removeClass('exploretabcontentinactive')
    }, 500)
}

async function load_trend_content(id) {

    query = await db.collection('new_posts')
        .orderBy("timestamp", "desc")
        .where("tags", "array-contains", id)
        .limit(5)
        .get()

    window.lastTrendVisible = query.docs[query.docs.length - 1]

    build_posts_trend(query.docs, id)
}

async function loadnext_trend_content(id) {
    query = await db.collection("new_posts")
    .orderBy("timestamp", "desc")
    .where("tags", "array-contains", id)
    .startAfter(lastVisible)
    .limit(5)
    .get()

    window.lastVisible = query.docs[query.docs.length - 1]
    build_posts_trend(query.docs, id)
}

async function build_posts_trend(query, id) {

    for (let i = 0; i < query.length; i++) {
        // query[i].data()

        if (query[i].data().file_url == 'eonnect-home-text_post') {
            j = document.createElement('div')
            j.classList.add('shell_trend')

            switch (query[i].data().url_theme) {
                case 'deep':
                    textCardClass = 'superdeepcard'
                    textStuff = '<div class="card-body"><p class="relative""><b class="posttextclass">' + query[i].data().url_content + '</b></p></div>'
                    break;
                case 'light':
                    textCardClass = 'lightcard'
                    textStuff = '<div class="card-body"><h5 class="posttextclass">' + query[i].data().url_content + '</h5></div>'
                case 'dark':
                    textCardClass = 'darkcard'
                    textStuff = '<div class="card-body"><h5 class="posttextclass">' + query[i].data().url_content + '</h5></div>'
                default:
                    return;
            }
            userlikedoc = await db.collection('new_posts').doc(query[i].id).collection('likes').doc(user.uid).get()
            if (userlikedoc.exists && userlikedoc.data().status) {
                desiredLikeAction = 'unlike'
                desiredLikeAction2 = 'heartactive'
                desiredLikeAction3 = 'favorite'
            }
            else {
                desiredLikeAction = 'like'
                desiredLikeAction2 = 'heart'
                desiredLikeAction3 = 'favorite_border'
            }

            j.innerHTML = `
            <div class="content">
                <img style="z-index: 200;">
                <div onclick="viewpost('${query[i].id}')" class="card ${textCardClass}">
                '${textStuff}'
                </div>
                <nav class="navbar navbar-expand-sm">
                    <img onclick="usermodal('${query[i].data().uid}')" class="postpfp" id="${query[i].id}pfptrend" src="${query[i].data().photo_url}">
                    <h4 class="postname centeredy">${query[i].data().name}</h4>
                    <ul class="navbar-nav mr-auto"> </ul> 
                    <button id="${query[i].id}likebtntrend" onclick="${desiredLikeAction}('${query[i].id}')" class="eon-text ${desiredLikeAction2} postbuttons heart ${query[i].id}likebtntrend">
                        <i id="${query[i].id}likebtnicontrend" class="material-icons posticon animated ${query[i].id}likebtnicontrend">${desiredLikeAction3}</i> 
                        <span class="${query[i].id}likeCounttrend" id="${query[i].id}likeCounttrend">${query[i].data().likes}</span>
                    </button>
                    <button id="${query[i].id}commentBtntrend" onclick="loadComments('${query[i].id}', '${query[i].data().uid}')" class="eon-text postbuttons">
                        <i class="material-icons posticon">chat_bubble_outline</i> 
                        ${query[i].data().comments} 
                    </button>
                </nav>
            </div>
            <button onclick="info('${query[i].id}')" class="postbuttons postinfo">
                <i class="material-icons-outlined posticon infobtn">info</i>
            </button>`
            document.getElementById(id + 'postcontainer').appendChild(j)
            continue;
        }

        j = document.createElement('div')
        j.classList.add('shell_trend')

        userlikedoc = await db.collection('new_posts').doc(query[i].id).collection('likes').doc(user.uid).get()
        if (userlikedoc.exists && userlikedoc.data().status) {
            desiredLikeAction = 'unlike'
            desiredLikeAction2 = 'heart heartactive'
            desiredLikeAction3 = 'favorite'
        }
        else {
            desiredLikeAction = 'like'
            desiredLikeAction2 = 'heart'
            desiredLikeAction3 = 'favorite_border'
        }

        j.innerHTML = `
        <div class="content">
            <img onclick="viewpost('${query[i].id}')" id="${query[i].id}imgtrend" class="postimage" src="${query[i].data().file_url}">
            <nav class="navbar navbar-expand-sm">
                <img onclick="usermodal('${query[i].data().uid}')" class="postpfp" id="${query[i].id}pfptrend" src="${query[i].data().photo_url}">
                <h4 class="postname centeredy">${query[i].data().name}</h4>
                <ul class="navbar-nav mr-auto"> </ul> 
                <button id="${query[i].id}likebtntrend" onclick="${desiredLikeAction}('${query[i].id}')" class="eon-text ${desiredLikeAction2} postbuttons heart ${query[i].id}likebtntrend">
                    <i id="${query[i].id}likebtnicontrend" class="material-icons posticon animated ${query[i].id}likebtnicontrend">${desiredLikeAction3}</i> 
                    <span class="${query[i].id}likeCounttrend" id="${query[i].id}likeCounttrend">${query[i].data().likes}</span>
                </button> 
                <button id="${query[i].id}commentbtntrend" onclick="loadComments('${query[i].id}', '${query[i].data().uid}')" class="eon-text postbuttons">
                    <i class="material-icons posticon">chat_bubble_outline</i> 
                    ${query[i].data().comments}
                </button>
            </nav>
            <button onclick="fullscreen('${query[i].id}')" class="postbuttons postfullscreen">
                <i class="material-icons">fullscreen</i>
            </button>
            <button onclick="info('${query[i].id}')" class="postbuttons postinfo">
                <i class="material-icons-outlined posticon infobtn">info</i>
            </button>
        </div>`
        document.getElementById(id + 'postcontainer').appendChild(j)
    }

    $(`#${id}postcontainer`).imagesLoaded(() => {
        resizeAllGridItemsTrend(id)
    });

}