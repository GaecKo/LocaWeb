const {User, Ad, Comment, Report} = require("./tables")

// USERS SECTIONS

async function checkReportsUser() {
    /*
    * Function to check if Users are +- banned
    * 
    */
   // TODO
}

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

async function getUserId(username) {
    return User.findOne({where: {username: username}, attributes: ["id"]}).then(usr => {
        if (usr) {
            return usr.dataValues.id
        } else {
            console.log("Couldn't find id of User " + username)
            return false
        }
    }).catch(err => {
        "Error while retrieving id of " + username + ": " + err
        return false
    })
}

async function getUsername(id) {
    return User.findOne({where: {id: id}, attributes: ["username"]}).then(usr => {
        if (usr) {
            return usr.dataValues.username
        } else {
            console.log("Couldn't find username of User " + id)
            return false
        }
    }).catch(err => {
        "Error while retrieving username of " + id + ": " + err
        return false
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
        console.log("User added: " + user.dataValues.username);
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

async function isModo(id) {
    /*
    *  Return true if User with username is modo
    *  return false if not
    */
    return User.findOne({where: {id: id, moderator: true}}).then(user => {
        if (user) {
            console.log(id + " is modo")
            return true
        } else {
            console.log(id + " is NOT modo")
            return false
        }
    }).catch(err => {
        console.log("Error while trying to find user with " + id + " : " + err)
        return false
    })
}

async function isBanned(id) {
    return User.findOne({where: {id: id, banned: true}}).then(user => {
        if (user) {
            console.log(id + " is banned")
            return true
        } else {
            console.log(id + " is NOT banned")
            return false
        }
    }).catch(err => {
        console.log("Error while trying to find user with " + id + " : " + err)
        return false
    })
}

// ADS SECTION

async function getUserAd(adId) {
    return Ad.findOne({where: {id: adId}, attributes: ["user"]}).then(usr => {
        if (usr) {
            console.log("Author of ad " + adId + " was found")
            return usr.dataValues.user
        } else {
            console.log("Author of ad " + adId + " was NOT found, Ad exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while finding author of ad " + adId + ": " + err)
        return false
    })
}

async function getAd(adId) {
    /*
    *  Return an object: {id, desc, title, reports, comments, userId}
    *  return false if id doesnt correspond to any known ad
    */
    return Ad.findOne({where: {id: adId}}).then(async ad => {
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
/**
 * 
 * @param {int} coId id of the comment which is deleted
 * @param {int} adId id of the ad in which to search
 * @returns true if successfull, false otherwise
 * @post changes the content of a comment because of his undesirable content
 */
async function ChangeCommentRef(coId, adId) {
    return Ad.findOne({where: {id: adId}, attributes: ["comments"]})
}

async function addAd(userId, title, description, city, price, rate, images) {
    return Ad.create({
        user : userId,
        title: title,
        description: description,
        city: city,
        price: price,
        rate: rate,
        images: images,
        comments: JSON.stringify({})
    }).then(ad => {
        console.log('Ad added: ' + ad)
        return true
    }).catch(err => {
        console.log("Error while adding Ad: " + err)
    })
}

async function getAllAds() {
    /*
    *  Return a list with all the ads in it with simple attributes
    *  return false if no ads
    */
    const lst = []

    return Ad.findAll().then(async ads => {
        if (ads.length > 0) {
            for (ad in ads) {
                ads[ad].dataValues.username = await getUsername(ads[ad].dataValues.user)
                lst.push(ads[ad].dataValues)
            } 
            // the object ad contains important data in 
            // Ad : Datavalues : {...} 
            console.log("All ads were retrieved")
            return lst;
        } else {
            console.log("No ad found")
            return false;
        }
    }).catch(err => {
        console.log("Error occuried while retrieving all Ads data: " + err);
        return false;
    })
}

// COMMENTS SECTION

async function disableComment(coId) {
    Comment.update({content: "This comment has been suspended for undesirable content.", visibility: true, disabled: true}, {where: {id: coId}}).then(state => {
        if (state == 1) {
            console.log("Comment with id " + coId + " has been suspended")
            return true
        } else {
            console.log("Comment with id " + coId + " COULDN'T be suspended")
            return false
        }
    }).catch(err => {
        console.log("Unable to disable comment with id " + coId + ": " + err)
        return false
    })
}

async function getComment(coId) {
    return Comment.findOne({where: {id: coId}}).then(co => {
        if (co) {
            return co.dataValues
        } else {
            console.log("Couldn't retrieve " + coId + " content")
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving comment " + coId + ": " + err)
        return false
    })
}

async function getUserComment(coId) {
    return Comment.findOne({where: {id: coId}, attributes: ["user"]}).then(async co => {
        if (co) {
            console.log("Author of comment " + coId + " was found.")
            return co.dataValues.user
        } else {
            console.log("Author couldn't be retrieved, does comment " + coId + " exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving author of comment " + coId + ": " + err)
        return false
    })
}

async function getFullComments(comments) {
    function goodDate(date) {
        // Returns a string of length two corresponding to the minutes (4 -> 04, 15 -> 15)
        if (date.toString().length == 1) {
          return "0" + date;
        }
        return date;
      }
    for (main_id in comments) {
        main_Content = await getComment(main_id)
        console.log(main_Content.createdAt)
        date = main_Content.createdAt
        repAuthorId = main_Content.repAuthorId
        
        main_Content.createdAt = date.toLocaleDateString() + " " + date.getHours() + "h" + goodDate(date.getMinutes())
        main_Content.username = await getUsername(main_Content.user)      
        val = {
            responses : comments[main_id],
        }
        val = Object.assign(val, main_Content)

        val.responses = await Comment.findAll({where: {id: val.responses}}).then(async coms => {
            let mens = {}
            for (co in coms) {
                co = coms[co]
                date = co.dataValues.createdAt
                co.dataValues.createdAt = date.toLocaleDateString() + " " + date.getHours() + "h" + goodDate(date.getMinutes())
                if (co.dataValues.repAuthorId != null && !co.dataValues.disabled) {
                    co.dataValues.toAuthor = "@" + await getUsername(co.dataValues.repAuthorId)
                }
                co.dataValues.username = await getUsername(co.dataValues.user)
                mens[co.dataValues.id] = co.dataValues
            }
            return mens
        }).catch(err => {
            console.log(err)
        })
        
        comments[main_id] = val
    }
    return comments
}

async function addComment(adId, text, authorId, parentId=null, repId=null) {
    /* parentId: main comment, in which this comment is a subcomment
    *  repId: id to who the comment is responding (could be the same as parentId)
    */
    if (parentId != null && repId == null) {
        repId = parentId
    }
    let ad = await getAd(adId)
    let comments = ad.comments
    repAuthorId = null
    if (repId != null) {
        repAuthorId = await getUserComment(repId)
    } else {
        if (parentId != null) {
            repAuthorId = await getUserComment(parentId)
        }   
    }
    cId = await Comment.create({
        content: text,
        user: authorId,
        ad: adId,
        repAuthorId: repAuthorId
    }).then(co => {
        if (co) {
            console.log("Comment added in database")
            return co.dataValues.id
        } else {
            console.log("Are you sure " + author + " is in db?")
            return false
        }
    }).catch(err => {
        console.log("Error while creating comment: " + err)
        return false
    })
    if (typeof cId == "boolean") {
        console.log("Couldn't add comment...")
        return 
    }
    if (parentId == null) {
        comments[cId] = []
    } else {
        comments[parentId].push(cId)
    } 
        
    return Ad.update({comments: JSON.stringify(comments)}, {where: {id: adId}}).then(state => {
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

// REPORTS SECTIONS
async function addReport(report_text) {
    /* Return reportId if report has been added successfully  
    * Return false if not
    */ 
    return Report.create({
        content: report_text
    }).then(repo => {
        if (repo) {
            console.log("Report has been added to database")
            return repo.dataValues.id
        } else {
            console.log("Report could'nt be added to db.")
            return false
        }
    }).catch(err => {
        console.log("Error while adding comment: " + err)
        return false
    })
}

async function deleteAd(adId) {
    reports_list = await getReportsAd(adId)
    deleted = await deleteReports(reports_list)
    return Ad.destroy({where: {id: adId}}).then(state => {
        if (state == 1) {
            console.log("Add " + adId + " its reports deleted successfully")
            return true
        } else {
            console.log("Add " + adId + " its reports deleted successfully")
            return false
        }
    })
}

async function addUserReport(userId) {
    return User.findOne({
        where: {
            id: userId
        },
        attributes: ["total_report"] }).then(usr => {
            if (usr) {
                let nbr_report = usr.dataValues.total_report + 1
                let banned = nbr_report > 6
                User.update({total_report: nbr_report, banned: banned}, {where: {id: userId}}).then(state => {
                    if (state == 1) {
                        return true
                    } else {
                        return false
                    }
                }).catch(err => {
                    console.log("Unable to update User with new report: " + err)
                    return false
                })
            } else {
                console.log("User " + userId + " wasn't found..")
                return false;
            }
        }).catch(err => {
            console.log("Error while working on User " + userId + ": " + err)
            return false;
        })
}

async function getReportsComment(coId) {
    return Comment.findOne({where: {id: coId}, attributes: ["reports_list"]}).then(rep_l => {
        if (rep_l) {
            console.log("Reports of comment " + coId + " was retrieved")
            return JSON.parse(rep_l.dataValues.reports_list)
        } else {
            console.log("Repports couldn't be retrieve... Comment: " + coId + " , comment exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving reports_list of comment " + coId + ": " + err)
        return false
    })
}

async function getReportsAd(adId) {
    return Ad.findOne({where: {id: adId}, attributes: ["reports_list"]}).then(rep_l => {
        if (rep_l) {
            console.log("Reports of ad " + adId + " was retrieved")
            return JSON.parse(rep_l.dataValues.reports_list)
        } else {
            console.log("Repports couldn't be retrieve... Ad: " + adId + " , ad exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving reports_list of ad " + adId + ": " + err)
        return false
    })
}

async function deleteReports(reportIdList) {
    return await Report.destroy({where: {id: reportIdList}}).then(state => {
        if (state == reportIdList.length) {
            console.log("Reports " + reportIdList + " were deleted")
            return true
        } else {
            console.log("Report  " + reportIdList + " couldn't be deleted.. Report exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while deleting " + reportIdList +": " + err)
        return false
    })
}

/**
 * @param {int} userID is the id of the user you want to decrease the number of reports
 * @param {int} nbr the number of reports you want to delete
 * @returns `true` if successfull, `false` otherwise
 */
async function decreaseTotalReportsUser(userId, nbr) {
    let cur_reports = await User.findOne({where: {id: userId}, attributes: ["total_report"]}).then(usr => {
        if (usr) {
            console.log("Total reports of User with id " + userId + " was retrieved")
            return usr.dataValues.total_report
        } else {
            console.log("Couldn't retrieve total reports of User with id " + userId + ", are you sure he exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving total report of User with id " + userId + " :" + err)
        return false
    })
    return User.update({total_report: cur_reports - nbr}, {where: {id: userId}}).then(state => {
        if (state == 1) {
            console.log("Reports were re-adjusted")
            return true
        } else {
            console.log("Couldn't update total reports of User with id " + userId + " does he exists?")
        }
    }).catch(err => {
        console.log("Error while retrieving total report of User with id " + userId + " :" + err)
        return false
    })
}

async function clearCommentReports(coId) {
    let reports_list = await getReportsComment(coId)
    let userId = await getUserComment(coId)
    let userUpdate = await decreaseTotalReportsUser(userId, reports_list.length)
    if (userUpdate) {
        console.log("User had his comments report re-adjusted")
    } else {
        console.log("User DIDN'T had his comments report re-adjusted")
    }
    let deleted = await deleteReports(reports_list)
    if (deleted) {
        console.log("reports were deleted successfully")
    } else {
        console.log("Reports could'n be deleted")
    }
    return Comment.update({
        reports: 0,
        visibility: true,
        reports_list: "[]"
    }, {where: {id: coId}}).then(state => {
        if (state == 1) {
            console.log("Reports on comment " + coId + " have been reset")
            return true
        } else {
            console.log("Reports on comment " + coId + " couldn't be reset, comment exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while reseting report on comment " + coId + ": " + err)
        return false
    })
}

async function clearAdReports(adId) {
    let reports_list = await getReportsAd(adId)
    let userId = await getUserAd(adId)

    let userUpdate = await decreaseTotalReportsUser(userId, reports_list.length)
    if (userUpdate) {
        console.log("User had his comments report re-adjusted")
    } else {
        console.log("User DIDN'T had his comments report re-adjusted")
    }

    let deleted = await deleteReports(reports_list)
    if (deleted) {
        console.log("reports were deleted successfully")
    } else {
        console.log("Reports could'n be deleted")
    }

    return Ad.update({
        reports: 0,
        visibility: true,
        reports_list: "[]"
    }, {where: {id: adId}}).then(async state => {
        if (state == 1) {
            console.log("Reports on ad " + adId + " have been reset")
            return true
        } else {
            console.log("Reports on ad " + adId + " couldn't be reset, ad exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while reseting report on ad " + adId + ": " + err)
        return false
    })
}

async function addAdReport(adId, report_text="") {
    reportId = await addReport(report_text)
    return Ad.findOne({where: { id: adId},
        attributes: ["reports", "user", "reports_list"] }).then(ad => {
            if (ad) {
                reports = ad.dataValues.reports + 1
                reports_list = JSON.parse(ad.dataValues.reports_list)
                reports_list.push(reportId)
                visibility = (!reports_list.length > 3)
                return Ad.update({reports: reports, reports_list: JSON.stringify(reports_list), visibility: visibility}, {where: {id: adId}}).then(async state => {
                    return await addUserReport(ad.dataValues.user);   
                })
            } else {
                console.log("Ad " + adId + " wasn't found..")
                return false;
            }
        }).catch(err => {
            console.log("Error while working on add " + adId + ": " + err)
            return false;
        })
}

async function addCommentReport(coId, report_text="") {
    let reportId = await addReport(report_text)
    return Comment.findOne({
        where: {
            id: coId
        },
        attributes: ["reports", "user", "reports_list"] }).then(co => {
            if (co) {
                reports = co.dataValues.reports + 1
                reports_list = JSON.parse(co.dataValues.reports_list)
                reports_list.push(reportId)
                visibility = (!reports_list.length > 3)
                return Comment.update({reports: reports, reports_list: JSON.stringify(reports_list), visibility: visibility}, {where: {id: coId}}).then(async state => {
                    return await addUserReport(co.dataValues.user);   
                })
            } else {
                console.log("Ad " + coId + " wasn't found..")
                return false;
            }
        }).catch(err => {
            console.log("Error while working on add " + coId + ": " )
            console.log(err)
            return false;
        })
}

module.exports = {
    getUserId,
    getUser,
    addUser,
    getUsername,
    setModoState,
    getAllUsers,
    isModo,
    addCommentReport,
    addUserReport,
    addAdReport,
    getAd,
    addAd,
    getAllAds,
    getComment,
    addComment,
    getFullComments,
    checkReportsUser,
    getUserAd,
    clearCommentReports, 
    clearAdReports, 
    decreaseTotalReportsUser,
    isBanned

}

async function main(){
    // await addUser("Max", "gagxxx", "password")
    // await addUser("GaecKo", "mohem", "password")
    // await addAd(1, "titredelad", "descript", "city", "3000", "path")

    // await addComment(1, "Bonjour puis-je venir", 1)
    // await addComment(1, "Oui pas de soucis", 2, 1, 1)
    // await addComment(1, "Ok super j'arrive", 1, 1, 2)


    // await addComment()

    // await Ad.update({visibility: false}, {where: {id: 1}})

    // await addCommentReport(2, "Je n'aime pas ce message")
    // for (let i = 0; i < 10; i++) await addAdReport(1, i + ": hephephepo");
    
    
    // await clearAdReports(1)

    // ad = await getAd(1)
    // ful = await getFullComments(ad.comments)
    // const util = require('util')
    // console.log(util.inspect(ful, {showHidden: false, depth: null, colors: true}))
    // ad = await getAllAds()
    // await User.update({username: "MonNom"}, {where: {id: 1}})
}

main()
