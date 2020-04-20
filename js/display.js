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
        document.getElementById('expand').style.removeProperty('width');
    }
    else {
        document.getElementById('expand').classList.add('eonnect-main-unexpanded')
        document.getElementById('expand').classList.remove('eonnect-main-expanded')

        elwidth = width - 275
        document.getElementById('expand').style.width = elwidth + 'px'
    }
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