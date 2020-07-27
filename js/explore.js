var functions = firebase.functions();

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
                load_trend(element)
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

            document.getElementById('trending_build').appendChild(k)
            document.getElementById('explorebgstyle').innerHTML = document.getElementById('explorebgstyle').innerHTML + newcss
        }

        console.log(result.data);

    }).catch(function(error) {
        $("#explore_loader").addClass('animated')
        $("#explore_loader").addClass('fadeOut')
        window.setTimeout(function() {
            $("#explore_loader").addClass('hidden')
        }, 600)


        console.log(`Error ${error.code}: ${error.message}. Details: ${error.details}`);
    })
}

function load_trend(data) {
    console.log('Load trend with data');
    console.log(data);
    Snackbar.show({text: "Feature coming soon..."})
}