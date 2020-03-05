const challengeService = (() => {
    function getAllChallenges() {
        return kinvey.get('appdata', 'challenges', 'kinvey');
    }

    function getAllChallengesOfUser(userID) {
        return kinvey.get('appdata', `challenges?query={"$or":[{"senderID":"${userID}"}, {"receiverID":"${userID}"}]}`, 'kinvey');
    }

    function getChallenge(id) {
        return kinvey.get('appdata', 'challenges/' + id, 'kinvey');
    }

    function createChallenge(data) {
        return kinvey.post('appdata', 'challenges', 'kinvey', data);
    }

    function deleteChallenge(id) {
        return kinvey.remove('appdata', 'challenges/' + id, 'kinvey');
    }

    function editChallenge(data) {
        return kinvey.update('appdata', 'challenges/' + data._id, 'kinvey', data)
    }

    return {
        getAllChallenges,
        getAllChallengesOfUser,
        getChallenge,
        createChallenge,
        deleteChallenge,
        editChallenge
    }
})();