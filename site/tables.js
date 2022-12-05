const { Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/database.sqlite",
    logging: false
})

class User extends Model {}

class Ad extends Model {}

class Comment extends Model {}

// class Images extends Model {}

User.init({
    id: {
        unique: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        unique: true,
        type: DataTypes.TEXT,
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
    },
    total_report: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
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
    city: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    reports: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    reports : {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    user : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    ad : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ad,
            key: "id"
        }
    },
    repAuthorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: "id"
        }
    }
}, {sequelize, modelName: 'Comment'})

// To sync the database, if changes are done in the above init functions, uncomment next line. Be carefull, it's maybe needed to delete database content
// sequelize.sync({force: true})


module.exports = {
    User,
    Ad,
    Comment
}