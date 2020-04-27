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
    document.getElementById('expandbtn').classList.add('zoomOut')
    window.setTimeout(function () {
        document.getElementById('expandbtn').style.display = 'none'
        document.getElementById('expandbtn').classList.remove('zoomOut')
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
    document.getElementById('collapsebtn').classList.add('zoomOut')
    window.setTimeout(function () {
        document.getElementById('collapsebtn').style.display = 'none'
        document.getElementById('collapsebtn').classList.remove('zoomOut')
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


// Search Box
document.addEventListener("touchstart", function () { }, true);

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
    grid = document.getElementsByClassName("grid")[0];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
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
    grid = document.getElementsByClassName("grid")[1];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
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