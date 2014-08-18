$(function () {
    $('input, select, textarea').on('focus', function () {
        $(this).nextAll('.error').addClass('visible');
    }).on('blur', function () {
        $(this).nextAll('.error').removeClass('visible');
    });
});