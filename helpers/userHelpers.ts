import chakram = require("chakram");
const mongoose = require("mongoose");

const serviceUrl = "http://localhost";
const servicePort = "3000";
const usersEndpoint = `${serviceUrl}:${servicePort}/users`;

class UserHelpers {

    createUser = (username: String, password: String) => {

        let response;
        return chakram.post(`${usersEndpoint}/signup`, {
            "email": username,
            "password": password
        })
        .then(function(resp) {
            return response = resp;
        });
    }
    
    loginAsUser = (username: String, password: String) => {
    
        let response;
        return chakram.post(`${usersEndpoint}/login`, {
            "email": username,
            "password": password
        })
        .then(function(resp) {
            return response = resp;
        });
    }
    
    getAllUsers = async () => {
    
        let options = await this.getAuthHeader();
        return chakram.get(`${usersEndpoint}`, options);
    
    }

    getTest3UserId = async () => {

        const userSchema = new mongoose.Schema({
            _id: mongoose.Schema.Types.ObjectId,
            email: {type: String},
            password: {type: String}
        });

        const User = mongoose.model("User", userSchema);

        return User.findOne({email: "test3@test.com"},function (err, user) {
            if(! err) {
                return user.id;
            } else {
                console.log(err.message);
            }
        });

    }

    getAuthHeader = async () => {

        const username1: String = "test2@test.com";
        const password1: String = "myPassword2";

        const response = await this.loginAsUser(username1, password1);
        if(!(response.body.token == undefined)) {
            return {
                        headers: {"Authorization": `Bearer ${response.body.token}`}
                   };
        } else {
            throw new Error(`Cannot log in as ${username1} with password ${password1}`);
        }

    }

    deleteUser = async (userId: String) => {
        
        let options = await this.getAuthHeader();
        return chakram.delete(`${usersEndpoint}/${userId}`, {}, options);

    }

}

export { UserHelpers as Users };
