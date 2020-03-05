handlers.getStart = function (context) {
    context.isAuth = userService.isAuth();
    //context.username = sessionStorage.getItem('username');

    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs'
    })
        .then(function () {
            this.partial('templates/cards/startCategory.hbs');
        });
};

handlers.chooseCategory = function (context) {
    sessionStorage.setItem('category', context.params.category);
    handlers.cards = {};
    context.redirect('#/quiz');
};

handlers.getQuiz = function (context) {
    sessionStorage.setItem('correct', '0');
    sessionStorage.setItem('wrong', '0');

    context.isAuth = userService.isAuth();
    context.correct = sessionStorage.getItem('correct');
    context.wrong = sessionStorage.getItem('wrong');
    //context.username = sessionStorage.getItem('username');

    cardService.getAllCardsByCategory(sessionStorage.getItem('category'))
        .then(function (response) {
            handlers.cards = response.filter(x => Number(x['rating']['count']) === 0 || Number(x['rating']['average'] > 2));
            let card = handlers.cards[Math.floor(Math.random() * handlers.cards.length)];
            card['picked'] = true;

            context.category = card['category'];
            context.question = card['question'];
            context.answer = card['answer'];
            context.id = card['_id'];
            context.rating = card['rating']['average'];

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                card: 'templates/cards/card.hbs'
            })
                .then(function () {
                    this.partial('templates/cards/quiz.hbs');
                });
        })
        .catch(function (error) {
            notifications.showError('Please select a category. Make sure there are cards in it.');
        });
};

handlers.quizCorrect = function (context) {
    sessionStorage.setItem('correct', Number(sessionStorage.getItem('correct')) + 1);
    context.redirect('#/quiz/next');
};

handlers.quizWrong = function (context) {
    sessionStorage.setItem('wrong', Number(sessionStorage.getItem('wrong')) + 1);
    context.redirect('#/quiz/next');
};

handlers.quizSkip = function (context) {
    context.redirect('#/quiz/next');
};

handlers.quizGetNextCard = function (context) {
    context.isAuth = userService.isAuth();
    context.correct = sessionStorage.getItem('correct');
    context.wrong = sessionStorage.getItem('wrong');
    //context.username = sessionStorage.getItem('username');

    handlers.cards = handlers.cards.filter(x => !x.hasOwnProperty('picked'));
    let card = handlers.cards[Math.floor(Math.random() * handlers.cards.length)];

    if (card === undefined) {
        context.redirect('#/quiz/final-score');
        return;
    }

    card['picked'] = true;

    context.category = card['category'];
    context.question = card['question'];
    context.answer = card['answer'];
    context.id = card['_id'];
    context.rating = card['rating']['average'];

    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs',
        card: 'templates/cards/card.hbs'
    })
        .then(function () {
            this.partial('templates/cards/quiz.hbs');
        });
};

handlers.getFinalScore = function (context) {
    let id = sessionStorage.getItem('userID');

    context.isAuth = userService.isAuth();
    context.correct = sessionStorage.getItem('correct');
    context.wrong = sessionStorage.getItem('wrong');

    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs'
    })
        .then(function () {
            this.partial('templates/cards/finalScore.hbs');
            userService.getUserByID(id)
                .then(function (user) {
                    let updatedUser = user;
                    updatedUser.data.correct = Number(user.data.correct) + Number(sessionStorage.getItem('correct'));
                    updatedUser.data.wrong = Number(user.data.wrong) + Number(sessionStorage.getItem('wrong'));
                    updatedUser.data.quizes = Number(user.data.quizes) + 1;
                    updatedUser.data.experience = Number(user.data.experience) + Number(sessionStorage.getItem('correct')) * experienceGained.correct;

                    userService.updateUserInfo(id, updatedUser)
                        .then(function () {
                            if (sessionStorage.hasOwnProperty('challengeID')) {
                                let challengeID = sessionStorage.getItem('challengeID');

                                challengeService.getChallenge(challengeID)
                                    .then(function (response) {
                                        let challenge = response;

                                        if (response.senderID === sessionStorage.getItem('userID')) {
                                            challenge.senderPoints = sessionStorage.getItem('correct');
                                        }
                                        else if (response.receiverID === sessionStorage.getItem('userID')) {
                                            challenge.status = 'Closed';
                                            challenge.receiverPoints = sessionStorage.getItem('correct');

                                            let senderPoints = Number(challenge.senderPoints);
                                            let receiverPoints = Number(challenge.receiverPoints);

                                            if (senderPoints > receiverPoints) {
                                                userService.getUserByID(challenge.senderID)
                                                    .then(function (user) {
                                                        let updatedUser = user;
                                                        updatedUser.data.wins = Number(user.data.wins) + 1;
                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.win;

                                                        userService.updateUserInfo(user._id, updatedUser)
                                                            .then(function () {
                                                                userService.getUserByID(challenge.receiverID)
                                                                    .then(function (user) {
                                                                        let updatedUser = user;
                                                                        updatedUser.data.losses = Number(user.data.losses) + 1;
                                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.loss;

                                                                        userService.updateUserInfo(user._id, updatedUser);
                                                                    });
                                                            });
                                                    });
                                            }
                                            else if (senderPoints < receiverPoints) {
                                                userService.getUserByID(challenge.receiverID)
                                                    .then(function (user) {
                                                        let updatedUser = user;
                                                        updatedUser.data.wins = Number(user.data.wins) + 1;
                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.win;

                                                        userService.updateUserInfo(user._id, updatedUser)
                                                            .then(function () {
                                                                userService.getUserByID(challenge.senderID)
                                                                    .then(function (user) {
                                                                        let updatedUser = user;
                                                                        updatedUser.data.losses = Number(user.data.losses) + 1;
                                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.loss;

                                                                        userService.updateUserInfo(user._id, updatedUser);
                                                                    });
                                                            });
                                                    });
                                            }
                                            else {
                                                userService.getUserByID(challenge.senderID)
                                                    .then(function (user) {
                                                        let updatedUser = user;
                                                        updatedUser.data.draws = Number(user.data.draws) + 1;
                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.draw;

                                                        userService.updateUserInfo(user._id, updatedUser)
                                                            .then(function () {
                                                                userService.getUserByID(challenge.receiverID)
                                                                    .then(function (user) {
                                                                        let updatedUser = user;
                                                                        updatedUser.data.draws = Number(user.data.draws) + 1;
                                                                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.draw;

                                                                        userService.updateUserInfo(user._id, updatedUser);
                                                                    });
                                                            });
                                                    });
                                            }
                                        }

                                        challengeService.editChallenge(challenge);
                                    });

                                sessionStorage.removeItem('challengeID');
                            }

                            handlers.generateAchievements(id);

                            setTimeout(function () {
                                handlers.updateLevel(id);
                            }, 2000);
                            //handlers.updateLevel(id); //TODO: Find a way to await (.then) the generateAchievements functions.

                            //sessionStorage.removeItem('correct');
                            //sessionStorage.removeItem('wrong');
                            sessionStorage.removeItem('category');
                        })
                });
        });
};