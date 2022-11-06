const { Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/database.sqlite"  
})

class User extends Model {}

class ad extends Model {}

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

ad.init({
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
    } // address: pas obligatoire | images: pas obligatoire 
      // prix: type (échange-€/h-...) + text correspondant | 
      // signalement: à lier avec l'utilisateur
      // ... à implémenter au fur et à mesure

}, {sequelize, modelName: 'Incident'})

// To sync the database, if changes are done in the above init functions, uncomment next line. Be carefull, it's maybe needed to delete database content
// sequelize.sync()