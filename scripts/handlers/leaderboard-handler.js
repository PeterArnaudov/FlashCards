handlers.getLeaderboards = function (context) {
    context.isAuth = userService.isAuth();

    userService.getAllUsers()
        .then(function (response) {
            let criteria = context.params.criteria.replace(':', '');

            if (criteria === 'experience') {
                response = response.sort((a, b) => Number(b.data.experience) - Number(a.data.experience));
            }
            else if (criteria === 'correct answers') {
                response = response.sort((a, b) => Number(b.data.correct) - Number(a.data.correct));
            }
            else if (criteria === 'wins') {
                response = response.sort((a, b) => Number(b.data.wins) - Number(a.data.wins));
            }
            else if (criteria === 'cards created') {
                response = response.sort((a, b) => Number(b.data.cardsCreated) - Number(a.data.cardsCreated));
            }

            context.criteria = criteria.charAt(0).toUpperCase() + criteria.slice(1);
            context.players = response;

            context.isExperience = criteria === 'experience';
            context.isWins = criteria === 'wins';
            context.isCardsCreated = criteria === 'cards created';
            context.isCorrectAnswers = criteria === 'correct answers';

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            })
                .then(function () {
                    this.partial('templates/leaderboards/leaderboards.hbs');
                });
        });
};

handlers.chooseLeaderboardCriteria = function (context) {
    context.redirect(`#/leaderboards/:${context.params.criteria}`);
};