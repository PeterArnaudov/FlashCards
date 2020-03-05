handlers.getChallenges = function (context) {
    context.isAuth = userService.isAuth();

    challengeService.getAllChallengesOfUser(sessionStorage.getItem('userID'))
        .then(function (challenges) {
            for (let challenge of challenges) {
                if (challenge.status === 'Pending') {
                    challenge.isPending = true;
                }
                else if (challenge.status === 'Rejected') {
                    challenge.isRejected = true;
                }
                else if (challenge.status === 'Closed') {
                    challenge.isClosed = true;
                }

                if (challenge.sender === sessionStorage.getItem('username')) {
                    challenge.isSender = true;
                }
                else {
                    challenge.isReceiver = true;
                }
            }

            context.challenges = challenges;

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                challenge: 'templates/challenge/challenge-table.hbs'
            })
                .then(function () {
                    this.partial('templates/challenge/challenges.hbs');
                });
        });
};

handlers.challengePlayer = function (context) {
    let category = context.params.category;

    if (!category) {
        notifications.showError('Please select a category!');
        return;
    }

    let senderUsername = sessionStorage.getItem('username');
    let senderID = sessionStorage.getItem('userID');
    let receiverUsername = context.params.username.replace(':', '');

    if (receiverUsername === senderUsername) {
        notifications.showError('You cannot challenge yourself!');
        return;
    }

    userService.getUserByUsername(receiverUsername)
        .then(function (receiver) {
            if (receiver[0] === undefined) {
                notifications.showError(`User ${receiverUsername} doesn't exist!`);
                return;
            }

            let receiverID = receiver[0]._id;

            let challenge = {
                status: 'Pending',
                category,
                sender: senderUsername,
                senderID,
                senderPoints: 0,
                receiver: receiverUsername,
                receiverID,
                receiverPoints: 0
            };

            challengeService.createChallenge(challenge)
                .then(function (response) {
                    sessionStorage.setItem('category', category);
                    sessionStorage.setItem('challengeID', response._id);
                    context.redirect(`#/quiz`);
                });
        });
};

handlers.playChallenge = function (context) {
    let challengeID = context.params.id.replace(':', '');

    challengeService.getChallenge(challengeID)
        .then(function (challenge) {
            sessionStorage.setItem('challengeID', challengeID);
            sessionStorage.setItem('category', challenge.category);

            context.redirect(`#/quiz`);
        })
};

handlers.rejectChallenge = function (context) {
    let challengeID = context.params.id.replace(':', '');

    challengeService.getChallenge(challengeID)
        .then(function (challenge) {
            challenge.status = 'Rejected';

            challengeService.editChallenge(challenge)
                .then(function () {
                    notifications.showSuccess('Challenge rejected successfully!');
                    context.redirect('#/challenges');
                })
        })
};

handlers.deleteChallenge = function (context) {
    let challengeID = context.params.id.replace(':', '');

    challengeService.deleteChallenge(challengeID)
        .then(function () {
            notifications.showSuccess('Challenge deleted successfully!');
            context.redirect('#/challenges');
        })
};

handlers.getChallengeResults = function (context) {
    context.isAuth = userService.isAuth();
    let challengeID = context.params.id.replace(':', '');

    challengeService.getChallenge(challengeID)
        .then(function (challenge) {
            let senderPoints = Number(challenge.senderPoints);
            let receiverPoints = Number(challenge.receiverPoints);
            let proportion = Math.min(senderPoints, receiverPoints) / Math.max(senderPoints, receiverPoints) * 100;

            if (challenge.sender === sessionStorage.getItem('username')) {
                context.isSender = true;
            }
            else {
                context.isReceiver = true;
            }

            context.sender = challenge.sender;
            context.receiver = challenge.receiver;
            context.senderPoints = senderPoints;
            context.receiverPoints = receiverPoints;
            context.proportion = proportion;
            context.winner = senderPoints > receiverPoints ? challenge.sender : senderPoints < receiverPoints ? challenge.receiver : 'Draw';

            context.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            })
                .then(function () {
                    this.partial('templates/challenge/results.hbs');
                });
        });
};