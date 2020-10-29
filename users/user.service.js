const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, ...userWithoutHash }, config.secret, { expiresIn:'12h' });
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function generateUserName(userParam, rounds = 0) {
    let username = "";
    if(!userParam && !userParam.fullName) {
        return userParam;
    } else if(userParam.username){
        username = userParam.username;
    } else {
        let nameArray = userParam.fullName.split(" ");
        let temp = nameArray[0] + nameArray[nameArray.length -1];
        if(nameArray[0] == nameArray[nameArray.length -1]) {
            temp = nameArray[0];
        }
        username = temp || "";
        userParam.username = username.toLowerCase();
    }
    if(await User.findOne({ username: userParam.username })) {
        userParam.username += rounds+1;
        return generateUserName(userParam, rounds+1);
    } else {  
        return userParam;
    }
}

async function create(userParam) {
    // generate username
    userParam = await generateUserName(userParam, 0)
    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}