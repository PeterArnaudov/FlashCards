const experienceGained = {
    createCard: 5,
    correct: 2,
    win: 50,
    draw: 25,
    loss: 10
};

const levels = {
    1: 0,
    2: 100,
    3: 300,
    4: 500,
    5: 900,
    6: 1500,
    7: 2300,
    8: 3300,
    9: 4500,
    10: 5900,
    11: 7500,
    12: 9300,
    13: 11300,
    14: 13500,
    15: 15900,
    16: 18500,
    17: 21300,
    18: 24300,
    19: 27500,
    20: 30900
};

handlers.updateLevel = function (id) {
    userService.getUserByID(id)
        .then(function (user) {
            let updatedLevel = Object.entries(levels)
                .filter(x => x[1] <= user.data.experience)
                .sort((a, b) => Number(b[1]) - Number(a[1]))[0][0];

            let updatedUser = user;
            updatedUser.data.level = updatedLevel;

            userService.updateUserInfo(id, updatedUser);
        });
};