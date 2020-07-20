// Width Resize

var width = $(window).width();
check(width)
$(window).on('resize', function () {
    if ($(this).width() !== width) {
        width = $(this).width();

        check(width)
    }
});

function check(width) {
    if (width < 800) {
        document.getElementById('expand').classList.add('eonnect-main-expanded')
        document.getElementById('animatedsidebar').innerHTML = '.eonnect-main-unexpanded {width: 800px; transiton: all 0.5s;} .eonnect-main-expanded {width: 100% !important; transiton: all 0.5s;}'

        document.getElementById('expandbtn').style.display = 'block'
        if (sessionStorage.getItem('currentab') == 'inbox') {
            document.getElementById('expandbtn').classList.add('expandedbtninbox')
        }
        else {
            document.getElementById('expandbtn').classList.remove('expandedbtninbox')
        }
    
        if (sessionStorage.getItem('currentab') == 'account') {
            document.getElementById('expandbtn').classList.add('expandedbtnaccount')
        }
        else {
            document.getElementById('expandbtn').classList.remove('expandedbtnaccount')
        }

    }
    else {

        document.getElementById('expandbtn').style.display = 'none'
        document.getElementById('sidebar').classList.remove('fadeOutLeft')
        document.getElementById('sidebar').classList.add('fadeInLeft')

        document.getElementById('expand').classList.add('eonnect-main-unexpanded')
        document.getElementById('expand').classList.remove('eonnect-main-expanded')
        document.getElementById('expand').classList.remove('buttonunexpanded')

        elwidth = width - 275
        document.getElementById('expand').style.width = elwidth + 'px'
        document.getElementById('animatedsidebar').innerHTML = '.eonnect-main-unexpanded {width: ' + elwidth + 'px; transiton: all 0.5s;}'

    }
}

function expand() {

    document.getElementById('sidebar').classList.add('buttonexpanded')
    document.getElementById('sidebar').classList.add('fadeInLeft')
    document.getElementById('sidebar').classList.remove('fadeOutLeft')

    document.getElementById('expandbtn').classList.remove('expandedbtnaccount')
    document.getElementById('expandbtn').classList.remove('expandedbtninbox')

    document.getElementById('expandbtn').classList.add('expandedbtn')
    document.getElementById('expandbtn').onclick = function() {
        collapse();
        this.classList.toggle('openedham');
        this.setAttribute('aria-expanded', this.classList.contains('openedham'))
    }

}

function collapse() {
    document.getElementById('sidebar').classList.remove('fadeInLeft')
    document.getElementById('sidebar').classList.add('fadeOutLeft')
    document.getElementById('expandbtn').classList.remove('expandedbtn')

    if (sessionStorage.getItem('currentab') == 'inbox') {
        document.getElementById('expandbtn').classList.add('expandedbtninbox')
    }
    else {
        document.getElementById('expandbtn').classList.remove('expandedbtninbox')
    }

    if (sessionStorage.getItem('currentab') == 'account') {
        document.getElementById('expandbtn').classList.add('expandedbtnaccount')
    }
    else {
        document.getElementById('expandbtn').classList.remove('expandedbtnaccount')
    }

    document.getElementById('expandbtn').onclick = function() {
        expand();
        this.classList.toggle('openedham');
        this.setAttribute('aria-expanded', this.classList.contains('openedham'))
    }
}



console.log("%cEonnect Developer Tools", "background: white; color: purple; font-size: x-large");
console.log('Do not mess around with console as your account could get destroyed. We do not offer support to those who run unofficial JavaScript.')
console.log('If you have any questions or need help with something, please contact us. Report errors below this line')
console.log("%c-----------------", "background: black; color: white;");


//Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

//Popovers 
$(function () {
    $('[data-toggle="popover"]').popover({
    })
})

//Grid
function resizeGridItem(item) {
    try {
        grid = document.getElementsByClassName("grid")[0];
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;   
    } catch (error) {
        console.log('Display resize error (Likely too fast scrolling)');
    }
}

function resizeAllGridItems() {
    allItems = document.getElementsByClassName("postshell");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
    }
}
function resizeAllGridItemsAll() {
    allItems = document.getElementsByClassName("shell");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItemAll(allItems[x]);
    }
}
function resizeGridItemAll(item) {
    try {
        grid = document.getElementsByClassName("grid")[1];
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;   
    } catch (error) {
        console.log('Display resize error (Likely too fast scrolling)');
    }
}


function resizeAllGridItemsUser() {
    allItems = document.getElementsByClassName("usershell");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItemUser(allItems[x]);
    }
}
function resizeGridItemUser(item) {
    try {
        grid = document.getElementById("usergrid");
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;
    } catch (error) {
        console.log('Display resize error (Likely too fast scrolling)');

    }
}

document.querySelectorAll('.grid-list').forEach(button => button.addEventListener('click', toggle));

function toggle() {
    let btn = this;
    btn.classList.add('animation');
    btn.classList.toggle('active');
    let newElem = btn.cloneNode(true);
    btn.parentNode.replaceChild(newElem, btn);
    newElem.addEventListener('click', toggle);
}


function disablegrid() {
    document.getElementById('togglegrid').innerHTML = '.grid {display: block !important; width: 80% !important} .postshell {width: 100% !important;} .shell {width: 100% !important;} .postimage {max-height: 2400px !important;}'
    document.getElementById('containerhometab').classList.add('animated')
    document.getElementById('containerhometab').classList.add('fadeIn')
    document.getElementById('gridbtn').onclick = function () {

    }
    window.setTimeout(function () {
        document.getElementById('containerhometab').classList.remove('animated')
        document.getElementById('containerhometab').classList.remove('fadeIn')
        document.getElementById('gridbtn').onclick = function () {
            enablegrid()
        }
    }, 500)
}

function enablegrid() {
    document.getElementById('togglegrid').innerHTML = ''
    document.getElementById('containerhometab').classList.add('animated')
    document.getElementById('containerhometab').classList.add('fadeIn')
    document.getElementById('gridbtn').onclick = function () {

    }
    window.setTimeout(function () {
        document.getElementById('containerhometab').classList.remove('animated')
        document.getElementById('containerhometab').classList.remove('fadeIn')
        document.getElementById('gridbtn').onclick = function () {
            disablegrid()
        }
        resizeAllGridItems()
        resizeAllGridItemsAll()
    }, 500)

}

const d = 40;

document.querySelectorAll('.rocket-button').forEach(elem => {

    elem.querySelectorAll('.default, .success > div').forEach(text => {
        charming(text);
        text.querySelectorAll('span').forEach((span, i) => {
            span.innerHTML = span.textContent == ' ' ? '&nbsp;' : span.textContent;
            span.style.setProperty('--d', i * d + 'ms');
            span.style.setProperty('--ds', text.querySelectorAll('span').length * d - d - i * d + 'ms');
        });
    });

    elem.addEventListener('click', e => {
        e.preventDefault();
        if (elem.classList.contains('animated')) {
            return;
        }
        elem.classList.add('animated');
        elem.classList.toggle('live');
        setTimeout(() => {
            elem.classList.remove('animated');
        }, 2400);
    });

});

// AUTOCOMPLETE

function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items animated fadeIn fast");

        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {

          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

            b = document.createElement("DIV");
            b.value = arr[i]
            b.innerHTML = "@<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);

            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

            b.addEventListener("click", function(e) {
                document.getElementById('search-box').value = ''
                db.collection('users').where("username", "==", this.value).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        usermodal(doc.data().uid)
                    })
                })

                

                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
          x[i].classList.add('fadeOut')
          x[i].classList.remove('fadeIn')
      }
    }
    /*execute a function when someone clicks in the document:*/
    $("#search-box").focusout(function(e){
        closeAllLists(e.target);
      });
  }
  


function preesearch() {
    window.presearch = false
    db.collection('app').doc('details').get().then(function(doc) {
        window.usersearch = doc.data().usernames
        autocomplete(document.getElementById("search-box"), usersearch);
    })
}

window.setInterval(function() {
    resizeAllGridItems()
    resizeAllGridItemsAll()
    resizeAllGridItemsUser()
    addWaves()
}, 3500)

$( "#userModal" ).scroll(function() { 
    obj = document.getElementById('userModal')
    if( obj.scrollTop === (obj.scrollHeight - obj.offsetHeight)) {

        builduser()

    }
});

// SCRLLING INFINITE SCROLL

function loadscrolling() {
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            document.getElementById('returntotop').setAttribute('style', 'display:block !important');
            document.getElementById('returntotop').classList.add('fadeInUp')
            document.getElementById('returntotop').classList.remove('fadeOutDown')
        }
        else {
            document.getElementById('returntotop').classList.add('fadeOutDown')
            document.getElementById('returntotop').classList.remove('fadeInUp')
        }
        docheightminus1 = $(document).height() - 1
        docheightplus1 = $(document).height() + 1
        if($(window).scrollTop() + $(window).height() > docheightminus1 && $(window).scrollTop() + $(window).height() < docheightplus1) {
            if (sessionStorage.getItem('view') == 'all') {
                build()
                likeslistener()
                listenlikes()
                commentslistener()
                listencomments()
            }
            else {
                buildrelevant()
                likeslistenerrelevant()
                listenlikesrelevant()
                commentsrelevantlistener()
                listencommentsrelevant()
            }
        }
     });
}

 //ERROR BACKUP WTF

 function error(msg) {
    document.getElementById('erorrModalMsg').innerHTML = msg
    $('#errorModal').modal('toggle')
}

//Preflight Email Change. Add text to popover when click button
function prepreflightemail() {
    window.setTimeout(() => {
        $('#changemailpopoverbtn').click()    
    }, 100);
}

function preflightemail() {
    try {
        window.setTimeout(() => {
            document.getElementById('currentemail').innerHTML = user.email    
            addWaves()
        }, 400);   
    } catch (error) {
    }
}

$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

function prepreflightpassword() {
    window.setTimeout(() => {
        $('#changpasswordpopoverbtn').click()    
    }, 100);
}

function prepreflightvisibility() {
    window.setTimeout(() => {
        $('#changevisibilitypopoverbtn').click()    
    }, 100);
}

function preflightemail() {
    try {
        window.setTimeout(() => {
            document.getElementById('currentemail').innerHTML = user.email
            addWaves()
        }, 400);   
    } catch (error) {
    }
}

function preflightvisibility() {
    try {
        window.setTimeout(() => {

            document.getElementById('currentvisibility').innerHTML = cacheuser.type

            if (cacheuser.type == "public") {
                document.getElementById('btnconfirmvisibilitybtn').onclick = function() {
                    confirmchangevisibility('private')
                }
                document.getElementById('btnconfirmvisibilitybtn').innerHTML = 'Switch to Private'
            }
            else {
                document.getElementById('btnconfirmvisibilitybtn').onclick = function() {
                    confirmchangevisibility('public')
                }
                document.getElementById('btnconfirmvisibilitybtn').innerHTML = 'Switch to Public'
            }
            addWaves()
        }, 400);
    } catch (error) {
        
    }
}

function fixdisplayheight() {
    height = $('#calculationheight1').height()
    $('#messageliststyle').html('#messagelist {height: calc(100% - ' + height + 'px)}')
}

function newpost_selectimage() {
    $('#newposttitlestyle6').html('#newposttitle { font-size: 28px !important; transition: all 1s !important; }')
    $('#unselectedpost').addClass('fadeOutUp')
    $('#unselectedpost').removeClass('fadeInDown')
    $('#selectimage').addClass("fadeInDown")
    $('#selectimage').removeClass("hidden")
    $('#selectimage').removeClass("fadeOutDown")
    $('#backbtn').removeClass('hidden')
    $('#backbtn').removeClass('fadeOutLeft')
    $('#backbtn').addClass('fadeInRight')

    $('#selecttext').addClass('hidden')
}

function newpost_selecttext() {
    $('#newposttitlestyle6').html('#newposttitle { font-size: 28px !important; transition: all 1s !important;}')
    $('#unselectedpost').addClass('fadeOutUp')
    $('#unselectedpost').removeClass('fadeInDown')
    $('#selecttext').addClass("fadeInDown")
    $('#selecttext').removeClass("hidden")
    $('#selecttext').removeClass("fadeOutDown")
    $('#backbtn').removeClass('hidden')
    $('#backbtn').removeClass('fadeOutLeft')
    $('#backbtn').addClass('fadeInRight')

    $('#selectimage').addClass('hidden')
}

function newpost_back() {
    $('#newposttitlestyle6').html('')
    $('#unselectedpost').removeClass('fadeOutUp')
    $('#unselectedpost').addClass('fadeInDown')
    $('#backbtn').removeClass('fadeInRight')
    $('#backbtn').addClass('fadeOutLeft')

    $('#selecttext').removeClass("fadeInDown")
    $('#selecttext').addClass("fadeOutDown")
    $('#selectimage').removeClass("fadeInDown")
    $('#selectimage').addClass("fadeOutDown")

    window.setTimeout(function() {
        if (document.getElementById('imgInp').files.length > 0) {
            $('#selectimage').addClass('hidden')
        }
    }, 500)
}


function nexttextstep() {
    value = document.getElementById('textpostbox').value

    $('#step1').addClass('animated')
    $('#step1').addClass('fadeOutUp')
    window.setTimeout(function() {
        $('#step2').addClass('animated')
        $('#step2').removeClass('fadeOutDown')
        $('#step2').addClass('fadeInUp')
        $('#step1').addClass('hidden')
        $('#step2').removeClass('hidden')
    }, 1000)

    $('.emulatedtext').html(value)
}

function edittext() {
    $('#step1').removeClass('hidden')
    $('#step1').removeClass('fadeOutUp')
    $('#step1').addClass('fadeInDown')

    $('#step2').addClass('fadeOutDown')
    $('#step2').removeClass('fadeInUp')

    window.setTimeout(function() {
        $('#step2').addClass('hidden')
    }, 1000)
}

function updategradientui() {
    light = document.getElementById('themeinp').checked
    color = document.getElementById('colorthemeinp').value

    if (light) {
        partone = '--bg-primary: #f9f9f9;  --bg-secondary: #fff; --bg-tertiary: #f6f6f6; --bg-quaternary: #e7e7e7;'
        partthree = '--content-primary: black; --content-secondary: #0f0f0f; --content-tertiary: #3b3b3b; --contrast-primary: white; '
    }
    else {
        partone = '--bg-primary: #161922; --bg-secondary: #11131b; --bg-tertiary: #1f202e; --bg-quaternary: #2e2e3f;'
        partthree = '--content-primary: white; --content-secondary: #c8c8c8; --content-tertiary: #5c5c5c; --contrast-primary: black; '
    }

    switch (color) {
        case 'blue':
            parttwo = '--eon-primary: rgb(51, 147, 226); --eon-secondary: #4548fc; '
            partfour = '--ripple-primary: rgba(51, 147, 226, 0.3); --ripple-secondary: rgba(51, 147, 226, 0.1); --button-primary: rgb(76, 110, 204); '
            break;
        case 'red':
            parttwo = '--eon-primary: rgb(226, 51, 51); --eon-secondary: #fc7045; '
            partfour = '--ripple-primary: rgba(226, 51, 51, 0.3); --ripple-secondary: rgba(226, 51, 51, 0.1); --button-primary: rgb(212, 57, 57); '
            break;
        case 'orange':
            parttwo = '--eon-primary: rgb(226, 86, 51); --eon-secondary: #fcbc45; '
            partfour = '--ripple-primary: rgba(226, 86, 51, 0.3); --ripple-secondary: rgba(226, 86, 51, 0.1); --button-primary: rgb(212, 100, 35); '
            break;
        case 'lime':
            parttwo = '--eon-primary: rgb(185, 226, 51); --eon-secondary: #45fc91; '
            partfour = '--ripple-primary: rgba(185, 226, 51, 0.3); --ripple-secondary: rgba(185, 226, 51, 0.1); --button-primary: rgb(91, 212, 35);'
            break;
        case 'aqua':
            parttwo = '--eon-primary: rgb(51, 226, 211); --eon-secondary: #4557fc; '
            partfour = '--ripple-primary: rgba(51, 226, 211, 0.3); --ripple-secondary: rgba(51, 226, 211, 0.1); --button-primary: rgb(19, 124, 194); '
            break;
        case 'purple':
            parttwo = '--eon-primary: rgb(98, 51, 226); --eon-secondary: #d745fc; '
            partfour = '--ripple-primary: rgba(98, 51, 226, 0.3);  --ripple-secondary: rgba(98, 51, 226, 0.1); --button-primary: rgb(109, 19, 194); '
            break;
        case 'pink':
            parttwo = '--eon-primary: rgb(206, 51, 226); --eon-secondary: rgb(252, 69, 145); '
            partfour = '--ripple-primary: rgba(240, 108, 245, 0.3); --ripple-secondary: rgba(240, 108, 245, 0.1); --button-primary: rgb(206, 51, 226);'
            break;
        case 'hotpink':
            parttwo = '--eon-primary: rgb(226, 51, 159); --eon-secondary: #fc458b; '
            partfour = '--ripple-primary: rgba(226, 51, 159, 0.3); --ripple-secondary: rgba(226, 51, 159, 0.1); --button-primary: rgb(216, 48, 138); '
            break;
        default:
            parttwo = '--eon-primary: rgb(51, 147, 226); --eon-secondary: #4548fc; '
            partfour = '--ripple-primary: rgba(51, 147, 226, 0.3); --ripple-secondary: rgba(51, 147, 226, 0.1); --button-primary: rgb(76, 110, 204); '
            break;
    }

    $('#themeinjection').html(':root {' + partone + parttwo + partthree + partfour + '}')
    localStorage.setItem('theme', ':root {' + partone + parttwo + partthree + partfour + '}' )

}