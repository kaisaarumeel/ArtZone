const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const BYPASS_RESTRICTED_EMAIL_RESOURCE = [
    "reviews"
]

async function restricted_resource_general(req, res, next) {
    let auth_obj = {
        "auth": false, // is user authorized
        "authEmail": "", // the user that is authorized
        "isAdmin": false // if the user is authed as admin
    }
    const expiry = parseInt(Date.now() / 1000) + 10; //1h expiry
    const result = await UserSchema.findOneAndUpdate({ "session.key": req.headers["x-auth-token"] }, { expires: expiry });
    if (result != null) {
        if (parseInt(Date.now() / 1000) < parseInt(result.session.expires)) {
            auth_obj.auth = true;
            auth_obj.authEmail = result.userEmail;
            if (result.isAdmin) {
                auth_obj.isAdmin = true;
            }
        } else {
            auth_obj.auth = false;
        }
    }
    req.auth = auth_obj;
    next()
}

async function restricted_resource_email(req, res, next) {
    const requestedPath = req.originalUrl.split("/")

    if (BYPASS_RESTRICTED_EMAIL_RESOURCE.includes(requestedPath[requestedPath.length - 1])) return next();
    if (req.headers["x-auth-token"] == undefined) return res.sendStatus(403);
    let auth_obj = {
        "auth": false, // is user authorized
        "authEmail": "", // the user that is authorized
        "isAdmin": false // if the user is authed as admin
    }
    const expiry = parseInt(Date.now() / 1000) + 3600; //1h expiry
    const result = await UserSchema.findOneAndUpdate({ "session.key": req.headers["x-auth-token"] }, { expires: expiry });

    if (result != null) {
        if (result.session.key == req.headers["x-auth-token"]) {
            if ((!result.isAdmin && req.params.email == result.userEmail && parseInt(Date.now() / 1000) < parseInt(result.session.expires))
                || (result.isAdmin && parseInt(Date.now() / 1000) < parseInt(result.session.expires))) {
                auth_obj.auth = true;
                auth_obj.authEmail = result.userEmail;
                if (result.isAdmin) {
                    auth_obj.isAdmin = true;
                }
                req.auth = auth_obj;
                return next();
            }
            else {
                req.auth = auth_obj;
                return res.sendStatus(403);
            }
        } else {
            req.auth = auth_obj;
            return res.sendStatus(403);
        }
    } else {
        req.auth = auth_obj;
        return res.sendStatus(403);
    }
}


module.exports = {
    restricted_resource_email, restricted_resource_general
}
