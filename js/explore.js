var functions = firebase.functions();
var db = firebase.firestore();

function load_trending_tags() {
    before_load_trend_content()

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
            p.classList.add('animated');p.classList.add('fadeIn');p.classList.add('hidden')
            p.classList.add('trend_content_container')
            if (!expanded) {
                p.classList.add('trend_content_container_fullwidth')   
            }
        
            document.getElementById('trending_content').appendChild(p)
            document.getElementById('trending_build').appendChild(k)
            document.getElementById('explorebgstyle').innerHTML = document.getElementById('explorebgstyle').innerHTML + newcss
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

    if ( $(`#${id}contentcontainer`).is(':empty') ) {
        // Generate Content

        a = document.createElement('h1')
        a.innerHTML = id
        document.getElementById(`${id}contentcontainer`).appendChild(a)

        b = document.createElement('img')
        b.src = data.image
        b.classList.add('imagebannertrend')
        document.getElementById(`${id}contentcontainer`).appendChild(b)

        c = document.createElement('div')
        c.innerHTML = `<button onclick="trend_imageCredit(${data})" class="eon-text iconbtn"><i class="material-icons">portrait</i></button> <button onclick="trend_imageCredit(${data})" class="eon-text iconbtn"><i class="material-icons">more_vert</i></button>`
        c.classList.add('container'); c.classList.add('trend_buttons')
        document.getElementById(`${id}contentcontainer`).appendChild(c)

        load_trend_content(id)

    }
    else {
        // Not generate anything
    }

    $('#' + id + 'contentcontainer').removeClass('hidden')

    Snackbar.show({text: "Feature coming soon..."})
}

function trend_imageCredit(data) {
    console.log(data);
}

async function before_load_trend_content() {

    window.postsdoc = await db.collection('posts').doc('posts').get()
    window.likesdoc = await db.collection('posts').doc('likes').get()
    window.commentsdoc = await db.collection('posts').doc('comments').get()
    trend_data = {}

}

function load_trend_content(id) {

    trend_data[id] = []
    trend_likes[id] = []

    trend_likes = []

    for (let i = 0; i < postsdoc.data().latest; i++) {
        if (postsdoc.data()[i] !== undefined && postsdoc.data()[i].data.tags !== undefined) {
            if (postsdoc.data()[i].data.tags.includes(id)) {
                trend_data[id].push(postsdoc.data()[i])
                trend_likes.push(likesdoc.data()[i].length)
            }
        }
    }

    var list = [];
    for (var j = 0; j < trend_likes.length; j++) 
    list.push({'likes': trend_likes[j], 'data': trend_data[id][j]});

    list.sort(function(a, b) {
        return ((a.likes < b.likes) ? -1 : ((a.likes == b.likes) ? 0 : 1));
    });

    for (var k = 0; k < list.length; k++) {
        trend_data[id][k] = list[k].data;
        trend_likes[id][k] = list[k].likes
    }

    // Sorted by likes
}