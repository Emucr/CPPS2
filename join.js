$("form").submit(function (e) {

    e.preventDefault();

    var nickname = $('#nickname').val();
    var email = $('#email').val();
    var password = $('#password').val();

    // Remove spaces from beginning and end of nickname
    nickname = nickname.trim();
    $('#nickname').val(nickname);

    var isValid = false;

    $('.form-error').hide();

    if (password.length < 6 || password.length > 100) {
        $('#password').addClass('is-invalid').focus();
        $('.form-error').text('Invalid password').show();
        isValid = false;
    } else {
        $('#password').removeClass('is-invalid');
    }

    if (!checkEmail(email)) {
        $('#email').addClass('is-invalid').focus();
        $('.form-error').text('Invalid email address').show();
        isValid = false;
    } else {
        $('#email').removeClass('is-invalid');
    }

    if (!checkNickname(nickname)) {
        $('#nickname').addClass('is-invalid').focus();
        $('.form-error').text('Invalid nickname').show();
        isValid = true;
    } else if (nickname.length < 1 || nickname.length > 25) {
        $('#nickname').addClass('is-invalid').focus();
        $('.form-error').text('Invalid nickname').show();
        isValid = true;
    } else {
        $('#nickname').removeClass('is-invalid');
    }

    if (isValid) {
        PlayFabClientSDK.RegisterPlayFabUser({
            TitleId: '5417',
            DisplayName: nickname,
            Email: email,
            Password: password,
            RequireBothUsernameAndEmail: false
        }, function (result, error) {
            if (error) {
                console.error(error);
                $('.form-error').text(error.errorMessage).show();

                // Password error
                if (error.error == 'InvalidParams') {
                    $('#password').addClass('is-invalid').focus();
                } else {
                    $('#password').removeClass('is-invalid');
                }

                if (error.error == 'EmailAddressNotAvailable') {
                    $('#email').addClass('is-invalid').focus();
                } else {
                    $('#email').removeClass('is-invalid');
                }

                if (error.error == 'NameNotAvailable') {
                    $('#nickname').addClass('is-invalid').focus();
                    $('.form-error').text('Nickname is not available. Try again');
                } else {
                    $('#inputNickname').removeClass('is-invalid');
                }

            } else if (result) {
                console.log(result);
                sessionStorage.setItem("playerId", result.data.PlayFabId);
                sessionStorage.setItem("sessionTicket", result.data.SessionTicket);
                sessionStorage.setItem("isNewPlayer", true);
                document.location.href = '/play/index.html';

            } else {
                $('.form-error').text('Grub! Something went wrong.').show();
            }
        });
    }

});
