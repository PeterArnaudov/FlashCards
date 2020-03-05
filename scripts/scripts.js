const scripts = (() => {

    return {

    }
})();

$(() => {
    $('#darkMode').click(function () {
        let style = $('#style');

        if (!style.attr('href').includes('dark')) {
            style.attr('href', 'styles/themes/styles-dark.css');
            $('#unicornMode').attr('aria-pressed', 'false');
            $('#unicornMode').removeClass('active');
        }
        else {
            style.attr('href', 'styles/themes/styles.css');
        }
    });

    $('#unicornMode').click(function () {
        let style = $('#style');

        if (!style.attr('href').includes('unicorn')) {
            style.attr('href', 'styles/themes/styles-unicorn.css');
            $('#darkMode').attr('aria-pressed', 'false');
            $('#darkMode').removeClass('active');
        }
        else {
            style.attr('href', 'styles/themes/styles.css');
        }
    });
});