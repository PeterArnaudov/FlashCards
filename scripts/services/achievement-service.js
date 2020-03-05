const achevementService = (() => {
    function getAllAchievements() {
        return kinvey.get('appdata', 'achievements', 'kinvey');
    }

    return {
        getAllAchievements
    }
})();