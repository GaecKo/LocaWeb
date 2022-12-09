const {User, Ad, Comment, Report} = require("./tables")

// USERS SECTIONS

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

async function getUserAds(userId) {
    /* Returns all ads of a user has an array*/
    return Ad.findAll({where: {user: userId}}).then(ads => {
        if (ads) {
            //ads.images = JSON.parse(ads.images)
            for (let i = 0; i < ads.length; i++) {
                ads[i].images = JSON.parse(ads[i].images)
            }
            return ads
        } else {
            console.log("No ads found for user " + userId)
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving ads for user " + userId + ": " + err)
        return false
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

async function updatePassword(userId, password) {
    /* Finds the user in the database 
    and updates his password with the new one*/
    return User.update({password: password}, {where: {id: userId}}).then(state => {
        if (state == 1) {
            console.log("Password for user " + userId + " has been updated")
            return true
        } else {
            console.log("Password for user " + userId + " couldn't be updated, user exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while updating password for user " + userId + ": " + err)
        return false
    })
}

async function updateUsername(userId, username) {
    /* Finds the user in the database
    and updates his username with the new one*/
    return User.update({username: username}, {where: {id: userId}}).then(state => {
        if (state == 1) {
            console.log("Username for user " + userId + " has been updated")
            return true
        } else {
            console.log("Username for user " + userId + " couldn't be updated, user exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while updating username for user " + userId + ": " + err)
        return false
    })
}

async function updateEmail(userId, email) {
    /* Finds the user in the database
    and updates his email with the new one*/
    return User.update({email: email }, {where: {id: userId}}).then(state => {
        if (state == 1) {
            console.log("Email for user " + userId + " has been updated")
            return true
        } else {
            console.log("Email for user " + userId + " couldn't be updated, user exists?")
            return false
        }
    }).catch(err => {
        console.log("Error while updating email for user " + userId + ": " + err)
        return false
    })
}


// ADS SECTION

/**
 * 
 * @param {int} adId  the id of the ad
 * @returns int the id of the user who created the ad
 *          false if the ad doesnt exist
 */
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

/**
 * 
 * @param {int} adId the id of the ad
 * @returns the ad object with that id
 *          false if the ad doesnt exist
 */
async function getAd(adId) {
    /*
    *  Return an object: {id, desc, title, reports, comments, userId}
    *  return false if id doesnt correspond to any known ad
    */
    return Ad.findOne({where: {id: adId}}).then(async ad => {
        if (ad) {
            console.log("ad: " + adId + " was found and retrieved.")
            ad = ad.dataValues
            ad.images = JSON.parse(ad.images)
            ad.comments = JSON.parse(ad.comments)
            ad.reporters = await getReportedUserIdofAd(ad.id)
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
 * @param {int} userId the id of the user
 * @param {str} title the title of the ad
 * @param {str} description the description of the ad
 * @param {str} city the city of the ad
 * @param {int} price the price of the ad
 * @param {str} rate the rate of the ad
 * @param {str} images the path to the images of the ad
 * @returns true if the ad was added
 *          false if the ad was not added
 */
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


/**
 * 
 * @returns {object} all the ads in the database
 */
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
                ads[ad].dataValues.images = JSON.parse(ads[ad].dataValues.images)
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
        date = main_Content.createdAt
        repAuthorId = main_Content.repAuthorId
        
        main_Content.createdAt = date.toLocaleDateString() + " " + date.getHours() + "h" + goodDate(date.getMinutes())
        main_Content.username = await getUsername(main_Content.user)    
        main_Content.reporters =   await getReportedUserIdofComment(main_Content.id)
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
                co.dataValues.reporters = await getReportedUserIdofComment(co.dataValues.id)
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

/**
 * 
 * @param {str} report_text the text of the report
 * @param {int} userId the id of the user who reported
 * @param {int} adId the id of the ad reported
 * @param {int} coId the id of the comment reported
 * @returns int the id of the report if it has been added successfully
 *          false if not
 */
async function addReport(report_text, userId, adId=null, coId=null) {
    /* Return reportId if report has been added successfully  
    * Return false if not
    */ 
    return Report.create({
        content: report_text,
        userId: userId,
        adId: adId,
        commentId: coId
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

/**
 * 
 * @param {array[int]} comments array of comment ids 
 * @returns true if all comments have been deleted successfully
 *          false if not
 */
async function deleteComments(comments) {
    /* comments: array of comment ids
    *  Return true if all comments have been deleted successfully
    *  Return false if not
    */
   for (co in comments) {
       co = comments[co]
       await deleteReports(getReportsComment(co))
   }
    return Comment.destroy({where: {id: comments}}).then(state => {
        if (state == comments.length) {
            console.log("Comments deleted successfully")
            return true
        } else {
            console.log("Comments couldn't be deleted")
            return false
        }
    }).catch(err => {
        console.log("Error while deleting comments: " + err)
        return false
    })
}

/**
 * 
 * @param {int} adId the id of the ad
 * @returns array of the ids of the comments of the ad
 *          false if not
 */
async function getCommentsAd(adId) {
    return Comment.findAll({where: {ad: adId}}).then(coms => {
        let comments = []
        for (co in coms) {
            comments.push(coms[co].dataValues.id)
        }
        return comments
    }).catch(err => {
        console.log("Error while getting comments: " + err)
        return false
    })
}

/**
 * 
 * @param {int} adId the id of the ad
 * @returns true if the ad has been deleted successfully
 *          false if not
 */
async function deleteAd(adId) {
    comments = await getCommentsAd(adId)
    await deleteComments(comments)
    reports_list = await getReportsAd(adId)
    deleted = await deleteReports(reports_list)
    return Ad.destroy({where: {id: adId}}).then(state => {
        if (state == 1) {
            console.log("Ad " + adId + " its reports deleted successfully")
            return true
        } else {
            console.log("Ad " + adId + " its reports deleted successfully")
            return false
        }
    })
}

/**
 * 
 * @param {int} userId the id of the user
 * @returns true if the report has been added to the user successfully
 *          false if not
 */
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

/**
 * 
 * @param {int} coId the id of the comment
 * @returns array of the ids of the reports of the comment
 *          false if not
 */
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

/**
 * 
 * @param {int} adId the id of the ad
 * @returns array of the ids of the reports of the ad
 *          false if not
 */
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

/**
 * 
 * @returns array of all the reports
 *          false if there is no reports
 */
async function getFullReports() {
    all_reports = {}
    reportedAds = await Ad.findAll({where: {visibility: false}}).then(async ads => {
        if (Object.keys(ads).length > 0) {
            console.log("Ads that were reported have been retrieved")
            for (ad in ads) {
                ads[ad] = ads[ad].dataValues
                ads[ad].user = await getUsername(ads[ad].user)
                reports = JSON.parse(ads[ad].reports_list)
                ads[ad].reports_list = await Report.findAll({where: {id: reports}}).then(reps => {
                    if (Object.keys(reps).length > 0) {
                        console.log("Reports were retrieved")
                        for (rep in reps) {
                            reps[rep] = reps[rep].dataValues
                        }
                        return reps
                    } else {
                        console.log("No reports found...")
                        return false
                    }
                }).catch(err => {
                    console.log("Error while retrieving reports: " + err)
                    return false
                })
            }
            return ads;
        } else {
            console.log("No ads are reported")
            return {}
        }
    }).catch(err => {
        console.log("Error while retrieving reported ads: " + err)
        return {}
    })
    if (Object.keys(reportedAds).length == 0) {
        all_reports["ads"] = null
    } else {
        all_reports["ads"] = reportedAds
    }

    reportedComments = await Comment.findAll({where: {visibility: false}}).then(async cos => {
        if (Object.keys(cos).length > 0) {
            for (co in cos) {
                cos[co] = cos[co].dataValues
                cos[co].user = await getUsername(cos[co].user)
                reports = JSON.parse(cos[co].reports_list)
                cos[co].reports_list = await Report.findAll({where: {id: reports}}).then(reps => {
                    if (Object.keys(reps).length > 0) {
                        console.log("Reports were retrieved")
                        for (rep in reps) {
                            reps[rep] = reps[rep].dataValues
                        }
                        return reps
                    } else {
                        console.log("No reports found...")
                        return false
                    }
                }).catch(err => {
                    console.log("Error while retrieving reports: " + err)
                    return false
                })
            }
            return cos
        } else {
            console.log("No comments are reported")
            return {}
        }
    })
    if (Object.keys(reportedComments).length == 0) {
        all_reports["comments"] = null
    } else {
        all_reports["comments"] = reportedComments
    }
    return all_reports
}

/**
 * 
 * @param {int} reportIdList the list of the ids of the reports to delete
 * @returns true if the reports were deleted
 *          false if not
 */
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
 * 
 * @param {int} coId the id of the comment
 * @returns array of the ids of the users who reported the comment
 *          false if not
 */
async function getReportedUserIdofComment(coId) {
    return Report.findAll({where: {commentId: coId}, attributes: ["userId"]}).then(usrs => {
        if (usrs) {
            for (usr in usrs) {
                usrs[usr] = usrs[usr].dataValues.userId
            }
            return usrs
        } else {
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving userId of comment report: " + err)
        return false
    })
}

/**
 * 
 * @param {int} adId the id of the ad
 * @returns array of the ids of the users who reported the ad
 *          false if not
 */
async function getReportedUserIdofAd(adId) {
    return Report.findAll({where: {adId: adId}, attributes: ["userId"]}).then(usrs => {
        if (usrs) {
            for (usr in usrs) {
                usrs[usr] = usrs[usr].dataValues.userId
            }
            return usrs
        } else {
            return false
        }
    }).catch(err => {
        console.log("Error while retrieving userId of comment report: " + err)
        return false
    })
}

/**
 * @param {int} userID is the id of the user you want to decrease the number of reports
 * @param {int} nbr the number of reports you want to delete
 * @returns true if successfull 
 *          false otherwise
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

/**
 * 
 * @param {int} coId the id of the comment
 * @returns true if the comment reports were cleared
 *          false if not
 */
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

/**
 * 
 * @param {int} adId the id of the ad
 * @returns true if the ad reports were cleared
 *          false if not
 */
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

/**
 * 
 * @param {int} adId the id of the ad
 * @param {str} report_text the text of the report
 * @param {int} userId the id of the user who reported the ad
 * @returns true if the ad was reported
 *          false if not
 */
async function addAdReport(adId, report_text="", userId) {
    reportId = await addReport(report_text, userId, adId)
    return Ad.findOne({where: { id: adId},
        attributes: ["reports", "user", "reports_list"] }).then(ad => {
            if (ad) {
                reports = ad.dataValues.reports + 1
                reports_list = JSON.parse(ad.dataValues.reports_list)
                reports_list.push(reportId)
                visibility = !(reports_list.length > 3)
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

/**
 * 
 * @param {int} coId the id of the comment
 * @param {str} report_text the text of the report
 * @param {int} userId the id of the user who reported the comment
 * @returns true if the comment was reported
 *          false if not
 */
async function addCommentReport(coId, report_text="", userId) {
    let reportId = await addReport(report_text, userId, null, coId=coId)
    return Comment.findOne({
        where: {
            id: coId
        },
        attributes: ["reports", "user", "reports_list"] }).then(co => {
            if (co) {
                reports = co.dataValues.reports + 1
                reports_list = JSON.parse(co.dataValues.reports_list)
                reports_list.push(reportId)
                visibility = !(reports_list.length > 3)
                return Comment.update({reports: reports, reports_list: JSON.stringify(reports_list), visibility: visibility}, {where: {id: coId}}).then(async state => {
                    return await addUserReport(co.dataValues.user);   
                })
            } else {
                console.log("Comment " + coId + " wasn't found..")
                return false;
            }
        }).catch(err => {
            console.log("Error while working on add " + coId + ": " )
            console.log(err)
            return false;
        })
}

module.exports = {
    disableComment,
    deleteAd,
    getFullReports,
    getUserId,
    getUser,
    addUser,
    getUsername,
    getUserAds,
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
    getUserAd,
    clearCommentReports, 
    clearAdReports, 
    decreaseTotalReportsUser,
    isBanned,
    updatePassword,
    updateUsername,
    updateEmail
}

async function main(){
    // await addUser("Max", "gagxxx", "password")
    // await addUser("GaecKo", "mohem", "password")
    // await addAd(1, "titredelad", "descript", "city", "3000", "$", "path")

    // await addComment(1, "Bonjour puis-je venir", 1)
    // await addComment(1, "Oui pas de soucis", 2, 1, 1)
    // await addComment(1, "Ok super j'arrive", 1, 1, 2)


    // await addComment()
    // await deleteAd(2)
    // await Ad.update({visibility: false}, {where: {id: 1}})

    // await addCommentReport(2, "Je n'aime pas ce message")
    // for (let i = 0; i < 10; i++) await addAdReport(1, i + ": hephephepo");
    
    // a = await getFullReports()
    // const util = require('util')
    // console.log(util.inspect(a, {showHidden: false, depth: null, colors: true}))
    
    

    // await addAdReport(1, "pas cool")
    // await addAdReport(1, "pas nice")
    // await addCommentReport(1, "pas sympas", 1)

    // await addCommentReport(1, "pas sympas")
    // await addCommentReport(1, "pas sympas")

    // await clearAdReports(1)

    // ad = await getAd(1)
    // ful = await getFullComments(ad.comments)
    
    // console.log(util.inspect(ful, {showHidden: false, depth: null, colors: true}))
    // ad = await getAllAds()
    // await User.update({username: "MonNom"}, {where: {id: 1}})
    // await setModoState("GaecKo", true)
}

main()
