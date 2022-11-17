const { Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"  
})



async function get_User(email){
    user = await User.findOne({ email: email })
    console.log(user)
} 

function addUser(username, email, password) {
    /*
     * return true if User has been added to database
     * return false if error
     */

    return User.create({
        username: username,
        email: email,
        password: password
    }).then(user => {
        console.log("User added" + user);
        return true;
    }).catch(err => {
        console.log("User already exists " + err);
        return false;
    })
}


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
        allowNull: false
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