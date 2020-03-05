const handlers = {};

$(() => {
   const app = Sammy('#root', function () {
       this.use('Handlebars', 'hbs');

       //Home
       this.get('/index.html', handlers.getHome);
       this.get('#/home', handlers.getHome);

       //User
       this.get('#/register', handlers.getRegister);
       this.get('#/login', handlers.getLogin);
       this.post('#/login', handlers.loginUser);
       this.post('#/register', handlers.registerUser);
       this.get('#/logout', handlers.logoutUser);

       //Profile
       this.get('#/profile', handlers.getProfile);

       //Leaderboards
       this.get('#/leaderboards/:criteria', handlers.getLeaderboards);
       this.post('#/leaderboards', handlers.chooseLeaderboardCriteria);

       //Challenges
       this.get('#/challenges', handlers.getChallenges);
       this.post('#/challenge', handlers.challengePlayer);
       this.get('#/challenges/:id/play', handlers.playChallenge);
       this.get('#/challenges/:id/reject', handlers.rejectChallenge);
       this.get('#/challenges/:id/delete', handlers.deleteChallenge);
       this.get('#/challenges/:id/results', handlers.getChallengeResults);
       this.get('#/challenge/:id/quiz', handlers.getQuiz);

       //Collection
       this.get('#/collection', handlers.getCollection);
       this.get('#/myCollection', handlers.getMyCollection);
       this.get('#/details/:id', handlers.getCardDetails);
       this.get('#/edit/:id', handlers.getCardEdit);
       this.post('#/edit/:id', handlers.editCard);
       this.get('#/delete/:id', handlers.deleteCard);
       //Create
       this.get('#/create', handlers.getCreate);
       this.post('#/create', handlers.createCard);
       //Quiz
       this.get('#/start', handlers.getStart);
       this.post('#/quiz', handlers.chooseCategory);
       this.get('#/quiz', handlers.getQuiz);
       this.get('#/quiz/correct', handlers.quizCorrect);
       this.get('#/quiz/wrong', handlers.quizWrong);
       this.get('#/quiz/skip', handlers.quizSkip);
       this.get('#/quiz/next', handlers.quizGetNextCard);
       this.get('#/quiz/final-score', handlers.getFinalScore);
       this.post('#/rateCard/:id/:rate', handlers.rateCard);
   });

    app.run();
});