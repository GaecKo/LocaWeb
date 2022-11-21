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


async function get_User(email){
    return await User.findOne({where: {email: email}})
}


async function addUser(username, email, password, modo) {
    /*
     * return true if User has been added to database
     * return false if error
     */

    return User.create({
        username: username,
        email: email,
        password: password,
        moderator: modo
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
    */
    if (typeof state != Boolean) {
        console.log("Wrong State input")
        return;
    }
    await User.update({moderator: state}, {where: {username: username}})
    // const user = await User.findOne({where: {username: username}});
    // user.modo = state;
    // await user.save()
}

async function getAllUsers() {
    /*
    *  Return a list with all the users in it with simple attributes
    */
    const users = await User.findAll()
    const lst = []

    return User.findAll().then(users => {
        if (users) {
            Object.entries(users).forEach(user => {
                lst.push(Array.from(user)[1].dataValues) 
                // the object user contains important data in 
                // User : Datavalues : {...}, User is located at index 1 of array representing the user object
            })
            return lst;
        } else {
            return false;
        }
    }).catch(err => {
        console.log("Error occuried while retrieving all Users data: " + err);
    })
}

async function main() {
    const users = await getAllUsers();
    console.log(users)
    
    
}
main()


