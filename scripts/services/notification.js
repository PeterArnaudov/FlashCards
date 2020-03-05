const notifications = (() => {
    $(document).on({
        ajaxStart: () => $('#loadingBox').fadeIn(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    $(() => {
        $('#errorBox').click(e => $(e.target).hide());
        $('#successBox').click(e => $(e.target).hide());
    });

    function showSuccess(message) {
        let successBox = $('#successBox');
        successBox.text(message);
        successBox.fadeIn();
        successBox.fadeOut(3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.fadeIn();
        errorBox.fadeOut(3000);
    }

    return {
        showSuccess,
        showError
    }
})();