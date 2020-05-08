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
        document.getElementById('collapsebtn').style.display = 'none'

    }
    else {

        document.getElementById('expandbtn').style.display = 'none'
        document.getElementById('collapsebtn').style.display = 'none'

        document.getElementById('expand').classList.add('eonnect-main-unexpanded')
        document.getElementById('expand').classList.remove('eonnect-main-expanded')

        elwidth = width - 275
        document.getElementById('expand').style.width = elwidth + 'px'
        document.getElementById('animatedsidebar').innerHTML = '.eonnect-main-unexpanded {width: ' + elwidth + 'px; transiton: all 0.5s;}'

    }
}

function expand() {
    document.getElementById('expandbtn').classList.add('fadeOutLeft')
    window.setTimeout(function () {
        document.getElementById('expandbtn').style.display = 'none'
        document.getElementById('expandbtn').classList.remove('fadeOutLeft')
    }, 800)

    document.getElementById('collapsebtn').style.display = 'block'
    document.getElementById('collapsebtn').classList.add('zoomIn')
    window.setTimeout(function () {
        document.getElementById('collapsebtn').classList.remove('zoomIn')
    }, 800)

    document.getElementById('sidebar').classList.add('buttonexpanded')
    document.getElementById('sidebar').classList.add('fadeInLeft')
    document.getElementById('sidebar').classList.remove('fadeOutLeft')

}

function collapse() {
    document.getElementById('collapsebtn').classList.add('fadeOutLeft')
    window.setTimeout(function () {
        document.getElementById('collapsebtn').style.display = 'none'
        document.getElementById('collapsebtn').classList.remove('fadeOutLeft')
    }, 800)

    document.getElementById('expandbtn').style.display = 'block'
    document.getElementById('expandbtn').classList.add('zoomIn')
    window.setTimeout(function () {
        document.getElementById('expandbtn').classList.remove('zoomIn')
    }, 800)

    window.setTimeout(function () {
        document.getElementById('sidebar').classList.remove('buttonexpanded')
    }, 800)
    document.getElementById('sidebar').classList.remove('fadeInLeft')
    document.getElementById('sidebar').classList.add('fadeOutLeft')
}



//Console Error
console.error('Please do not try to troubleshoot. If you want our support team, you may contact us using various platforms. Choose account -> support for more options.')

//Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

//Popovers 
$(function () {
    $('[data-toggle="popover"]').popover({
        trigger: "focus"
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
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
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
}, 3500)

$( "#userModal" ).scroll(function() { 
    obj = document.getElementById('userModal')
    if( obj.scrollTop === (obj.scrollHeight - obj.offsetHeight)) {

        builduser()

    }
});

// SCRLLING INFINITE SCROLL

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

    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (sessionStorage.getItem('view') == 'all') {
            build()
        }
        else {
            buildrelevant()
        }
    }
 });