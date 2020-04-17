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