handlers.getCreate = function (context) {
    context.isAuth = userService.isAuth();
    //context.username = sessionStorage.getItem('username');

    context.loadPartials({
        header: 'templates/common/header.hbs',
        footer: 'templates/common/footer.hbs'
    })
        .then(function () {
            this.partial('templates/cards/cardCreate.hbs');
        });
};

handlers.createCard = function (context) {
    let question = context.params.question;
    let answer = context.params.answer;
    let category = context.params.category;
    let userID = sessionStorage.getItem('userID');

    if (question.length < 6) {
        notifications.showError('Question should be at least 6 characters long!');
    }
    else if (question.length > 40) {
        notifications.showError('Question should be not more than 40 characters long!')
    }
    else if (answer.length < 10) {
        notifications.showError('Answer should be at least 10 characters long!');
    }
    else if (answer.length > 240) {
        notifications.showError('Answer should be not more than 240 characters long!');
    }
    else if (!category) {
        notifications.showError('Please, select a category!');
    }
    else {
        let data = {
            question,
            answer,
            category,
            rating: {
                count: 0,
                sum: 0,
                average: 0
            }
        };

        cardService.createCard(data)
            .then(function () {
                notifications.showSuccess('Card created successfully!');
                context.redirect('#/create');
            })
            .then(function () {
                userService.getUserByID(userID)
                    .then(function (user) {
                        let updatedUser = user;
                        updatedUser.data.cardsCreated = Number(user.data.cardsCreated) + 1;
                        updatedUser.data.experience = Number(user.data.experience) + experienceGained.createCard;

                        userService.updateUserInfo(userID, updatedUser);
                    });
            });
    }
};

handlers.getCollection = function (context) {
    context.isAuth = userService.isAuth();
    //context.username = sessionStorage.getItem('username');

    cardService.getAllCards()
        .then(function (data) {
            context.cards = data;
            context.anyCards = data.length;

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                card: 'templates/cards/card-collection.hbs'
            })
                .then(function () {
                    this.partial('templates/cards/collection.hbs');
                });
        });

};

handlers.getMyCollection = function (context) {
    context.isAuth = userService.isAuth();
    //context.username = sessionStorage.getItem('username');

    cardService.getAllCardsByUser(sessionStorage.getItem('userID'))
        .then(function (data) {
            context.cards = data;
            context.anyCards = data.length;

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                card: 'templates/cards/card-collection.hbs'
            })
                .then(function () {
                    this.partial('templates/cards/myCollection.hbs');
                });
        });

};

handlers.getCardDetails = function (context) {
    let id = context.params.id.replace(':', '');

    cardService.getCard(id)
        .then(function (result) {
            context.isAuth = userService.isAuth();
            context.isCreator = result._acl.creator === sessionStorage.getItem('userID');
            context.category = result.category;
            context.question = result.question;
            context.answer = result.answer;
            context.rating = result.rating.average;
            context.id = id;

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                card: 'templates/cards/card.hbs'
            })
                .then(function () {
                    this.partial('templates/cards/cardDetails.hbs');
                });
        });
};

handlers.getCardEdit = function (context) {
    context.isAuth = userService.isAuth();
    let id = context.params.id.replace(':', '');

    cardService.getCard(id)
        .then(function (result) {
            context.category = result.category;
            context.question = result.question;
            context.answer = result.answer;
            context.id = id;

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            })
                .then(function () {
                    this.partial('templates/cards/cardEdit.hbs');
                });
        });
};

handlers.editCard = function (context) {
    let id = context.params.id.replace(':', '');

    if (context.params.question.length < 6) {
        notifications.showError('Question should be at least 6 characters long!');
    }
    else if (context.params.question.length > 40) {
        notifications.showError('Question should be not more than 40 characters long!')
    }
    else if (context.params.answer.length < 10) {
        notifications.showError('Answer should be at least 10 characters long!');
    }
    else if (context.params.answer.length > 240) {
        notifications.showError('Answer should be not more than 240 characters long!');
    }
    else if (!context.params.category) {
        notifications.showError('Please, select a category!');
    }
    else {
        cardService.getCard(id)
            .then(function (response) {
                let editedData = {
                    _id: id,
                    category: context.params.category,
                    question: context.params.question,
                    answer: context.params.answer,
                    rating: response.rating
                };

                cardService.editCard(editedData)
                    .then(function () {
                        notifications.showSuccess('Card edited successfully!');
                        context.redirect(`#/details/:${id}`);
                    });
            });
    }
};

handlers.deleteCard = function (context) {
    let id = context.params.id.replace(':', '');

    cardService.deleteCard(id)
        .then(function () {
            notifications.showSuccess('Card deleted successfully!');
            context.redirect('#/myCollection');
        })
};

handlers.rateCard = function (context) {
    let id = context.params.id.replace(':', '');
    let rate = Number(context.params.rating.replace(':', ''));

    cardService.getCard(id)
        .then(function (response) {
            let editedData = {
                _id: id,
                category: response.category,
                question: response.question,
                answer: response.answer,
                rating: {
                    count: Number(response.rating.count) + 1,
                    sum: Number(response.rating.sum) + rate,
                    average: ((Number(response.rating.sum) + rate) / (Number(response.rating.count) + 1)).toFixed(1)
                }
            };

            cardService.editCard(editedData)
                .then(function () {
                    notifications.showSuccess('Card rated successfully!');
                    $('#rate').attr('disabled', 'true');
                });
        });
};