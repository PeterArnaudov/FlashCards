handlers.generateAchievements = function (id) {
    return userService.getUserByID(id)
        .then(function (user) {
            let updatedUser = user;

            achevementService.getAllAchievements()
                .then(function (achievements) {
                    let updatedAchievements = achievements.filter(x => x.requirements[0] === 'none' || user.data[x.requirements[0]] >= x.requirements[1]);
                    updatedUser.achievements = updatedAchievements;

                    userService.updateUserInfo(id, updatedUser);
                });
        });
};