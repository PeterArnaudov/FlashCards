handlers.getProfile = function (context) {
    context.isAuth = userService.isAuth();
    context.username = sessionStorage.getItem('username');

    userService.getUserByID(sessionStorage.getItem('userID'))
        .then(function (response) {
            context.correct = response.data.correct;
            context.wrong = response.data.wrong;
            context.wins = response.data.wins;
            context.losses = response.data.losses;
            context.draws = response.data.draws;
            context.quizes = response.data.quizes;
            context.cardsCreated = response.data.cardsCreated;
            context.level = response.data.level;
            context.experience = response.data.experience;
            context.achievements = response.achievements;
            context.nextLevelExperience = levels[Number(response.data.level) + 1];
            context.experiencePercent = Number(response.data.experience) / levels[Number(response.data.level) + 1] * 100;
            //console.log(data);

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            })
                .then(function () {
                    this.partial('templates/user/profile.hbs');
                });
        });
};

handlers.getRegister = function (context) {
    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs',
        registerForm: 'templates/register/registerForm.hbs'
    })
        .then(function () {
            this.partial('templates/register/registerPage.hbs');
        });
};

handlers.getLogin = function (context) {
    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs',
        loginForm: 'templates/login/loginForm.hbs'
    })
        .then(function () {
            this.partial('templates/login/loginPage.hbs');
        });
};

handlers.registerUser = function (context) {
    let username = context.params.username;
    let password = context.params.password;
    let repeatPassword = context.params.repeatPassword;

    if (password !== repeatPassword) {
        notifications.showError("Passwords must match!");
        return;
    }
    else if (username.length < 6) {
        notifications.showError("Username should be at least 6 characters long!");
        return;
    }

    userService.register(username, password, [])
        .then((response) => {
            userService.saveSession(response);
            notifications.showSuccess("User registered successfully!");
            context.redirect('#/profile');
        })
        .catch(function (error) {
            notifications.showError(error.responseJSON.description);
        });
};

handlers.loginUser = function (context) {
    let username = context.params.username;
    let password = context.params.password;

    userService.login(username, password)
        .then(function (response) {
            userService.saveSession(response);
            notifications.showSuccess("User logged in successfully!");
            context.redirect('#/profile');
        })
        .catch(function (error) {
            notifications.showError(error.responseJSON.description);
        });
};

handlers.logoutUser = function (context) {
  userService.logout()
      .then(function () {
          sessionStorage.clear();
          notifications.showSuccess("User logged out successfully!");
          context.redirect('#/home');
      })
      .catch(function (error) {
          notifications.showError(error.responseJSON.description);
      });
};