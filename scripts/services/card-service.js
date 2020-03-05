const cardService = (() => {
    function getAllCards() {
        return kinvey.get('appdata', 'cards', 'kinvey');
    }

    function getAllCardsByUser(id) {
        return kinvey.get('appdata', `cards?query={"_acl.creator":"${id}"}`, 'kinvey');
    }

    function getAllCardsByCategory(category) {
        return kinvey.get('appdata', `cards?query={"category":"${category}"}`, 'kinvey');
    }

    function getCard(id) {
        return kinvey.get('appdata', 'cards/' + id, 'kinvey');
    }

    function createCard(data) {
        return kinvey.post('appdata', 'cards', 'kinvey', data);
    }

    function deleteCard(id) {
        return kinvey.remove('appdata', 'cards/' + id, 'kinvey');
    }

    function editCard(data) {
        return kinvey.update('appdata', 'cards/' + data._id, 'kinvey', data)
    }

    return {
        getAllCards,
        getAllCardsByUser,
        getAllCardsByCategory,
        getCard,
        createCard,
        deleteCard,
        editCard
    }
})();