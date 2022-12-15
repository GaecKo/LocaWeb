const { Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/database.sqlite",
    logging: false
})

class User extends Model {}

class Ad extends Model {}

class Comment extends Model {}

class Report extends Model {}

class Custom extends Model {}


User.init({
    id: {
        unique: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: { // username of the User: changeable
        unique: true,
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: { // email of the User: changeable
        unique: true,
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: { // phone of the User: changeable
        type:DataTypes.TEXT,
        allowNull: true
    },
    sharing: { // User allows his informations to be shared on his ads
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    password: { // Password of the User: changeable
        type: DataTypes.TEXT, 
        allowNull: false
    },
    moderator: { // Modo or not, for site moderation purpose
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    total_report: { // Number of reports (Comment + Ad) to set ban status
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    banned: { // banned if total_report > 6
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    description: { // Description of the Ad: changeable
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: { // Title of the Ad: changeable
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: { // City of the Ad: changeable
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: { // Price of the Ad: changeable
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rate: { // Rate of the Ad: changeable
        type: DataTypes.TEXT,
        allowNull: false
    },
    reports_list: { // List of all the ad's reports 
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]"
    },
    reports: { // number of reports
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    comments: { // object representing ad's comments hierarchy 
        type: DataTypes.TEXT,
        allowNull: true
    },
    visibility: { // if reports > 3, ad becomes blurred 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    user: { // User that created the ad
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }, // list of the path to images
    images: {
        type: DataTypes.TEXT,
        allowNull: false,
    }

}, {sequelize, modelName: 'Ad'})

Comment.init({
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    content : { // content of the Comment
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reports_list : { // List of all the comment's reports 
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]"
    },
    reports: { // number of reports
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    user : { // User that created the comment
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    visibility: { // if reports > 3, comment blurred
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    disabled: { // if modo has disabled the comment, comment still exists but content is deleted
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    ad : { // Ad on which the comment was posted
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ad,
            key: "id"
        }
    },
    repAuthorId: { // The perso to who the comment is destinated
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: "id"
        }
    }
}, {sequelize, modelName: 'Comment'})


Report.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { // Id of the User who created the report
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    commentId: { // If the report is on a comment, this is the comment id
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Comment,
            key: "id"
        }
    },
    adId: { // If the report is on an ad, this is the ad id
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Ad,
            key: "id"
        }
    },
    content: { // Content of the report
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {sequelize, modelName: 'Report'})


Custom.init({
    user: { // Reference to the User
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: "id"
        }
    },
    tag_color: { // Color of the the tag when a comment in tagging this User
        type: DataTypes.TEXT,
        allowNull: true
    },
    light_mode: { // Light or Dark mode for this User
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {sequelize, modelName: 'Custom'})

// To sync the database, if changes are done in the above init functions, uncomment next line. Be carefull, it's maybe needed to delete database content
// sequelize.sync({force: true})


module.exports = {
    User,
    Ad,
    Comment,
    Report,
    Custom,
    sequelize
}