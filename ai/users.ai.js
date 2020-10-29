const db = require("_helpers/db");
const User = db.User;

const prepareData = userData => {
  return {
    date: userData.date || new Date(),
    name: userData.name || "Filled",
    description: userData.description || "",
    referenceModel: "User",
    referenceId: userData._id,
    createdBy: userData.createdBy
  };
};

async function usersAi(userData) {
  let prepareduserData = prepareData(userData);
  let user = await User.findOne({
    referenceId: prepareduserData.referenceId
  });

  if (!user) {
    user = new User(prepareduserData);
  } else {
    Object.assign(user, prepareduserData);
  }
  return await user.save();
}

module.exports = {
    usersAi
  };
