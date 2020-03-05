const userService = (() => {
    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(result) {
        sessionStorage.setItem('username', result.username);
        sessionStorage.setItem('authtoken', result._kmd.authtoken);
        sessionStorage.setItem('userID', result._id);
    }

    function register(username, password) {
        return kinvey.post('user', '', 'basic',
            {
                username,
                password,
                data: {
                    "correct": "0",
                    "wrong": "0",
                    "quizes": "0",
                    "cardsCreated": "0",
                    "experience": "0",
                    "level": "1",
                    "wins": "0",
                    "losses": "0",
                    "draws": "0"
                },
                achievements: []
            });
    }

    function login(username, password) {
        return kinvey.post('user', 'login', 'basic', {username, password});
    }

    function logout() {
        return kinvey.post('user', '_logout', 'kinvey')
    }
    
    function getAllUsers() {
        return kinvey.get('user', '', 'kinvey');
    }

    function getUserByID(id) {
        return kinvey.get('user', `${id}`, 'kinvey');
    }

    function getUserByUsername(username) {
        return kinvey.get('user', `?query={"username":"${username}"}`, 'kinvey');
    }

    function updateUserInfo(id, data) {
        return kinvey.update('user', `${id}`, 'kinvey', data);
    }

    return {
        isAuth,
        saveSession,
        register,
        login,
        logout,
        getUserByID,
        getAllUsers,
        getUserByUsername,
        updateUserInfo
    }
})();