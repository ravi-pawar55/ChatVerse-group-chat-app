const users = {};

const setUser = (userName, socket) => {
    users[userName] = socket.id;
}

const getUser = (userName) => {
    return users[userName];
}

const getAllUser = () => {
    return users;
}

const deleteUser = (userName) => {
    delete users[userName];
}

module.exports = {
    setUser, 
    getUser, 
    getAllUser,
    deleteUser
};