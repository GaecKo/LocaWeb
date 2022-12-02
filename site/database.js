const { Sequelize, DataTypes, Model} = require('sequelize');
const util = require('util')
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/database.sqlite"  
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
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
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
        console.log("User added: " + user);
        return true;
    }).catch(err => {
        console.log("User already exists?: " + err);
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
            console.log("User: " + username + " has been updated: " + state)
            return true
        } else {
            console.log("User couldn't be updated (not found).")
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
    /*
    *  Return true if User with username is modo
    *  return false if not
    */
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

async function getAuthors(JSONComment) {
    let Author_list = []
    while (JSONComment.response != false) {
        break
    }
}

async function getAd(adId) {
    /*
    *  Return an object: {id, desc, title, reports, comments, userId}
    *  return false if id doesnt correspond to any known ad
    */
    return Ad.findOne({where: {id: adId}}).then( ad => {
        if (ad) {
            console.log("ad: " + adId + " was found and retrieved.")
            ad = ad.dataValues
            ad.comments = JSON.parse(ad.comments)
            return ad
        } else {
            console.log("ad: " + adId + " was NOT found.")
            return false
        }
    }
    ).catch( err => {
        console.log("Error while retrieving ad: " + err)
        return false
    })
}

async function addAd(description, title, userId) {
    return Ad.create({
        description: description,
        title: title,
        comments: JSON.stringify({comments: null}),
        user: userId
    }).then(ad => {
        console.log('Ad added: ' + ad)
        return true
    }).catch(err => {
        console.log("Error while adding Ad: " + err)
    })
}

function RecAddComment(comments, parentId, id, content) {
    if (parentId in comments) {
        comments[parentId][id] = content
        return [true, comments]
    } 
    for (key1 in comments) {
        // console.log(key1)
        let comment_key = null;
        let in_com = comments[key1]
        for (key2 in in_com) {
            if (typeof in_com[key2] == 'object') {
                comment_key = key2
            }
        }
        if (comment_key != null) {
            let [found, temp] = RecAddComment(comments[key1], parentId, id, content)
            if (found) {
                comments[key1] = temp
                
            }
        
     }
}
    return [false, comments]
}

function main() {
    let a = 
    {
        1: {
            text: "text1",
            author: "author1",
            3: {
                text: "text3", 
                author: "author3",
                6: {
                    text: "text6",
                    author: "author6"
                }
            }
        },
        2: {
            text: "text",
            author: "author2",
            8: {
                9: {
                    10:{
                        text: "hello"
                    }
                }
            }
        }
    }
    a  = RecAddComment(a, 10, "NEW", {text: "WOWOWOW", author: "HEHEHEH"})[1]
    //console.log(JSON.stringify(a))
    console.log(util.inspect(a, {showHidden: false, depth: null}))
    
    
}

async function addComment(adId, cId, text, author, parentId=null) {
    let ad = await getAd(adId)
    let comments = ad.comments
    content = {
        text: text,
        author: author
    }
    if (parentId == null) {
        comments.cId = content
    } else {
        
    }
    return Ad.update({comments: comments}, {where: {id: adId}}).then(state => {
        if (state == 1) {
            console.log("Ad: " + adId + " has been updated.")
            return true
        } else {
            console.log("Ad: " + adId + " couldn't be updated (not found).")
            return false
        }
    }).catch(err => {
        console.log("unable to add comment: " + err)
        return false
    })

    
}


main()

module.exports = {
    getUser,
    addUser,
    setModoState,
    getAllUsers,
    isModo
}
