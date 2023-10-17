const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 

async function generatePage(skip, perPage) {
    let users = await UserSchema.find();
    if (!users) throw new Error("No users in system")

    let sanitized_users = []
    for (let i = 0; i < users.length; i++) {
        let sanitized_user = JSON.parse(JSON.stringify(users[i]));
        delete sanitized_user["listings"];
        delete sanitized_user["password"];
        delete sanitized_user["session"];
        sanitized_users.push(sanitized_user)
    }

    users = sanitized_users.slice(skip, skip + perPage);
    return {
        "users": users,
        "sanitized_users": sanitized_users
    }
}

module.exports = {
    generatePage
}