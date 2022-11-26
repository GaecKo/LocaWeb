const { Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"  
})

class User extends Model {}

class Ad extends Model {}

class Comment extends Model {}

User.init({
    username: {
        unique: true,
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false
    },
    email: {
        unique: true,
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    moderator: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {sequelize, modelName: 'User'})

Ad.init({
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reports: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    user: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: User,
            key: "username"
        }
    }
    
    // address: pas obligatoire | images: pas obligatoire 
      // prix: type (échange-€/h-...) + text correspondant | 
      // signalement: à lier avec l'utilisateur
      // ... à implémenter au fur et à mesure

}, {sequelize, modelName: 'Ad'})

Comment.init({
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    content : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user : {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: User,
            key: "username"
        }
    },
    ad : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ad,
            key: "id"
        }
    }
}, {sequelize, modelName: 'Comment'})


// To sync the database, if changes are done in the above init functions, uncomment next line. Be carefull, it's maybe needed to delete database content
// sequelize.sync()


async function getUser(username){
    /*
    * Return user (object with user's info) if finded, false if not
    */
    return User.findOne({where: {username: username}}).then(user => {
        if (user) {   
            return user.dataValues
        } else {
            console.log("User not found")
            return false
        }
        
    }).catch(err => {
        console.log("Error while looking for " + username + " : " + err)
        return false;
    })
}

async function addUser(username, email, password) {
    /*
     * return true if User has been added to database
     * return false if error
     */

    return User.create({
        username: username,
        email: email,
        password: password
    }).then(user => {
        console.log("User added " + user);
        return true;
    }).catch(err => {
        console.log("User already exists " + err);
        return false;
    })
}

async function setModoState(username, state) {
    /*
    *  Update User (username) to the given state (true or false)
    *  return true if updated, false if not    
    */
    if (typeof state !== 'boolean') {
        console.log("Wrong State input")
        return false;
    }
    return User.update({moderator: state}, {where: {username: username}}).then(state => {
        if (state == 1) {
            console.log("User :" + username + " has been updated to modo: " + state)
            return true
        } else {
            console.log("User couldn't be updated (not found)")
            return false
        }
    }).catch(err => {
        console.log("unable to change state: " + err)
        return false
    })        
}

async function getAllUsers() {
    /*
    *  Return a list with all the users in it with simple attributes
    *  return false if no users
    */
    const lst = []

    return User.findAll().then(users => {
        if (users.length > 0) {
            Object.entries(users).forEach(user => {
                lst.push(Array.from(user)[1].dataValues) 
                // the object user contains important data in 
                // User : Datavalues : {...}, User is located at index 1 of array representing the user object
            })
            console.log("All users were retrieved")
            return lst;
        } else {
            console.log("No user found")
            return false;
        }
    }).catch(err => {
        console.log("Error occuried while retrieving all Users data: " + err);
        return false;
    })
}

async function isModo(username) {
    return User.findOne({where: {username: username, moderator: true}}).then(user => {
        if (user) {
            console.log(username + " is modo")
            return true
        } else {
            console.log(username + " is NOT modo")
            return false
        }
    }).catch(err => {
        console.log("Error while trying to find " + username + " : " + err)
        return false
    })
}

async function main() {
    // const modo = await setModoState("GaecK", true)
    // User.destroy({where: {username: "GaecKo"}})
    const users = await getAllUsers()
    console.log(users)  
    
}

main()

module.exports = {
    getUser,
    addUser,
    setModoState,
    getAllUsers,
    isModo
}