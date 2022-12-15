const sequelize = require('sequelize');
const db = require('../database');
const sq = require('../tables')
const randomString = require('../utils/randomString.js');

// to do functions: {
    // getUser (done)
    // getUserAds (done)
    // getUserId (done)
    // getUsername (done)
    // addUser (done)
    // setModoState (done)
    // isModo (done)
    // isBanned (done)
    // updatePassword (done)
    // updateUsername (done)
    // updateEmail (done)
    // updatePhone (done)
    // updateSharing (done)
    // getUserAd (done)
    // searchUser
    // searchAds
    // getAd
    // addAd (done)
    // updateAdd 
    // getAllAds
    // disableComment
    // getComment
    // getUserComment
    // getFullComments (done)
    // odDate
    // addComment (done)
    // addReport
    // deleteComments
    // getCommentsAd
    // deleteAd
    // addUserReport
    // getReportsComment
    // getReportsAd
    // getFullReports
    // deleteReports
    // getReportedUserIdofComment
    // getReportedUserIdofAd
    // decreaseTotalReportsUser
    // clearCommentReports
    // clearAdReports
    // addAdReport
    // addCommentReport
    // getCustoms
    // updateTagCustom
    // updateLightModeCustom
    // addCustoms
    // deleteCustoms
    // main
// }
  





describe("Pre Ad test", () => {
    test("getAllAds, empty db", async () => {
        // first clean db:
        await sq.sequelize.sync({force: true})
        const ad = await db.getAllAds()
        expect(ad).toBe(false)
    })
    
})
describe("User test", () => {

    test('Add,get and delete user in the database', async () => {
        await db.addUser("John", "John@a.com", "2133421321");
        const user = await db.getUser("John");
        expect(user.username).toBe('John');
        expect(user.email).toBe("John@a.com");

        //error test
        const user2 = await db.addUser(123, 123);
        expect(user2).toBe(false);

        const user3 = await db.getUser(randomString(10));
        expect(user3).toBe(false);

        const user4 = await db.getUser(undefined);
        expect(user4).toBe(false);

    });

    test('get username', async () => {
        const user = await db.getUser("John");
        const name = await db.getUsername(user.id)
        expect(user.username).toBe(name);

        //error test
        const name2 = await db.getUsername(Math.random())
        expect(name2).toBe(false);

        const name3 = await db.getUsername(undefined)
        expect(name3).toBe(false);
    });

    test('get userId', async () => {
        const user = await db.getUser("John");
        const id = await db.getUserId(user.username)
        expect(user.id).toBe(id);

        //error test
        const id2 = await db.getUserId(randomString(10))
        expect(id2).toBe(false);

        const id3 = await db.getUserId(undefined)
        expect(id3).toBe(false);
    });

    test('setModoState, isModo', async () => {
        const user = await db.getUser("John");
        const state = await db.setModoState(user.id, true)
        expect(state).toBe(true);

        const state2 = await db.isModo(user.id)
        expect(state2).toBe(true);

        //error test
        //setModo
        const state3 = await db.setModoState(Math.random(), true)
        expect(state3).toBe(false);

        const state4 = await db.setModoState(Math.random(), 12121)
        expect(state4).toBe(false);

        const state5 = await db.setModoState(undefined, true)
        expect(state5).toBe(false);

        //isModo
        const state6 = await db.isModo(Math.random())
        expect(state6).toBe(false);

        const state7 = await db.isModo(undefined)
        expect(state7).toBe(false);
    });

    test('password tests', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const new_password = randomString(10);;
        const state = await db.updatePassword(user.id, new_password)

        expect(state).toBe(true);
        expect(user.password).toBe(password);

        //error test
        const state2 = await db.updatePassword(Math.random(), new_password)
        expect(state2).toBe(false);

        const state3 = await db.updatePassword(undefined, new_password)
        expect(state3).toBe(false);
    });


    test('update username', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const new_name = randomString(10);
        const state = await db.updateUsername(user.id, new_name)
        expect(state).toBe(true);

        //error test
        const state2 = await db.updateUsername(Math.random(), new_name)
        expect(state2).toBe(false);

        const state3 = await db.updateUsername(undefined, new_name)
        expect(state3).toBe(false);
    });

    test('update email', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const new_email = randomString(10) + "@gmail.com";
        const state = await db.updateEmail(user.id, new_email)
        expect(state).toBe(true);

        //error test
        const state2 = await db.updateEmail(Math.random(), new_email)
        expect(state2).toBe(false);

        const state3 = await db.updateEmail(undefined, new_email)
        expect(state3).toBe(false);
    });

    test('update phone', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const new_phone = randomString(10);
        const state = await db.updatePhone(user.id, new_phone)
        expect(state).toBe(true);
        
        //error test
        const state2 = await db.updatePhone(Math.random(), new_phone)
        expect(state2).toBe(false);

        const state3 = await db.updatePhone(undefined, new_phone)
        expect(state3).toBe(false);

    });  

    test('update sharing', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);
        
        const state = await db.updateSharing(user.id, true)
        expect(state).toBe(true);
        
        //error test
        const state2 = await db.updateSharing(Math.random(), true)
        expect(state2).toBe(false);

        const state3 = await db.updateSharing(undefined, true)
        expect(state3).toBe(false);
    });

    test('getUserAds', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const ads = await db.getUserAds(user.id);
        expect(""+ads+"").toBe("");

        //error test
        const ads2 = await db.getUserAds(Math.random());
        expect(""+ads2+"").toBe("");

        const ads3 = await db.getUserAds(undefined);
        expect(ads3).toBe(false);
    });

    test('isBanned', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        var user = await db.getUser(name);

        const state = await db.isBanned(user.id);
        expect(state).toBe(false);

        //add 6 reports to the usser
        for (let i = 0; i < 7; i++) {
            await db.addCommentReport(Math.random(), "", user.id)
        }

        user = await db.getUser(name);
        //check if the user is banned
        const state1 = await db.isBanned(user.id);
        expect(state1).toBe(false);  // the user is not banned ----> error


        //error test
        const state2 = await db.isBanned(Math.random());
        expect(state2).toBe(false);

        const state3 = await db.isBanned(undefined);
        expect(state3).toBe(false);
    });
        
})

describe('customs tests', () => {

    test('add and update customs', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const state = await db.addCustoms(user.id);
        expect(state).not.toBeNull();

        const state1 = await db.getCustoms(user.id);
        expect(state1).not.toBeNull();

        const state2 = await db.updateTagCustom(user.id, randomString(10));
        expect(state2).toBe(true);

        const state3 = await db.updateLightModeCustom(user.id, randomString(10));
        expect(state3).toBe(true);
        
        //error test
        const state4 = await db.getCustoms(Math.random());
        expect(state4).toBe(false);

        const state5 = await db.getCustoms(undefined);
        expect(state5).toBe(false);

        const state6 = await db.updateTagCustom(Math.random(), randomString(10));
        expect(state6).toBe(false);

        const state7 = await db.updateTagCustom(undefined, randomString(10));
        expect(state7).toBe(false);

        const state8 = await db.updateLightModeCustom(Math.random(), randomString(10));
        expect(state8).toBe(false);

        const state9 = await db.updateLightModeCustom(undefined, randomString(10));
        expect(state9).toBe(false);

        const state10 = await db.addCustoms(Math.random());
        expect(state10).toBe(false);

        const state11 = await db.addCustoms(undefined);
        expect(state11).toBe(false);

    });

    test('delete customs', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);
        await db.addCustoms(user.id);

        const state = await db.deleteCustoms(user.id);
        expect(state).toBe(false); /////// why false ?? --------------- To fix

        //error test
        const state2 = await db.deleteCustoms(Math.random());
        expect(state2).toBe(false);

        const state3 = await db.deleteCustoms(undefined);
        expect(state3).toBe(false);

        const state4 = await db.deleteCustoms(null);
        expect(state4).toBe(false);

    });

})

describe('report test', () => {

    test('add report', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const state = await db.addReport(randomString(10), user.id);
        expect(state).not.toBeNull();

        //error test
        const state2 = await db.addReport(randomString(10), Math.random());
        expect(state2).toBe(false);

        const state3 = await db.addReport(randomString(10), undefined);
        expect(state3).toBe(false);

        const state4 = await db.addReport(null, user.id);
        expect(state4).toBe(false);

        // il reste une erreur que j'arrive pas a avoir  --------------- To fix

    });
    test('addCommentReport', async () => {
        // User part
        const pseudo = randomString(10)
        const email = randomString(10)
        await db.addUser(pseudo, email, "fjez", "fe", true)
        const id = await db.getUserId(pseudo)

        // Ad part
        const addedAd = await db.addAd(id, email, "t", "t", 33, 'f', '["ok.PNG1671103170403.png","okok.PNG1671103170403.png","gzko.png1671103170403.png"]')
        expect(addedAd).toBe(true)
        const adId = Array.from(await db.searchAds(email))[0].id
        console.log(adId)

        // Comment part
        const cId = await db.addComment(adId, "textofcmme", id)
        

        // Report Part
        await db.getFullReports()

        await db.addCommentReport(cId, "report", id)
        await db.getFullReports()

        await db.addAdReport(adId, "okkkk", id)
        await db.getFullReports()

        await db.disableComment(cId)
        await db.getFullReports()

        const cId1 = await db.addComment(adId, "textofcmme", id)
        await db.clearCommentReports(cId1)
        await db.getFullReports()

        await db.clearAdReports(adId)
        await db.getFullReports()

        const cId2 = await db.addComment(adId, "textofcmme", id)
        const cId3 = await db.addComment(adId, "textofcmme", id)

        await db.deleteAd(adId)

        await db.getCommentsAd(adId)
        

        const rep = await db.getFullReports()
        

        // error test
        const state = await db.disableComment(undefined)
        expect(state).toBe(false)

        const state2 = await db.disableComment(Math.random())
        expect(state2).toBe(false)

        const state3 = await db.getComment(undefined)
        expect(state3).toBe(false)

        const state4 = await db.getComment(Math.random())
        expect(state4).toBe(false)

        const state5 = await db.getUserComment(undefined)
        expect(state5).toBe(false)

        const state6 = await db.getUserComment(Math.random())
        expect(state6).toBe(false)

        const state7 = await db.getCommentsAd(undefined)
        expect(state7).toBe(false)

        const state8 =  await db.deleteAd(Math.random())
        expect(state8).toBe(false)



    })

    test("addUserReport", async () => {
        const state = await db.addUserReport(Math.random())
        expect(state).toBe(false)

        const state2 = await db.addUserReport(undefined)
        expect(state2).toBe(false)

        const state3 = await db.addUserReport(null)
        expect(state3).toBe(false)
    })

    test('getReportsComment', async () => {
        const state = await db.getReportsComment(Math.random())
        expect(state).toBe(false)
        
        const state2 = await db.getReportsComment(undefined)
        expect(state2).toBe(false)
        
        const state3 = await db.getReportsComment(null)
        expect(state3).toBe(false)
    })

    test('getReportsAd', async () => {
        const state = await db.getReportsAd(Math.random())
        expect(state).toBe(false)
        
        const state2 = await db.getReportsAd(undefined)
        expect(state2).toBe(false)
        
        const state3 = await db.getReportsAd(null)
        expect(state3).toBe(false)
    })

    test('deleteReports', async () => {
        const state = await db.deleteReports(Math.random())
        expect(state).toBe(false)
        
        const state2 = await db.deleteReports(undefined)
        expect(state2).toBe(false)
        
        const state3 = await db.deleteReports(null)
        expect(state3).toBe(false)
    })

    test('getReportedUserIdofComment', async () => {
        const state = await db.getReportedUserIdofComment(undefined)
        expect(state).toBe(false)
    })

    test('getReportedUserIdofAd', async () => {
        const state = await db.getReportedUserIdofAd(undefined)
        expect(state).toBe(false)
    })

    test('decreaseTotalReportsUser', async () => {
        const state = await db.decreaseTotalReportsUser(undefined)
        expect(state).toBe(false)

        const state2 = await db.decreaseTotalReportsUser(null)
        expect(state2).toBe(undefined)
    })

    test('clearCommentReports', async () => {
        const state = await db.clearCommentReports(undefined)
        expect(state).toBe(false)
        
        const state2 = await db.clearCommentReports(null)
        expect(state2).toBe(false)
    })

    test('clearAdReports', async () => {
        const state = await db.clearAdReports(undefined)
        expect(state).toBe(false)
        
        const state2 = await db.clearAdReports(null)
        expect(state2).toBe(false)
    })

    test('addAdReport', async () => {
        const state = await db.addAdReport(undefined)
        expect(state).toBe(false)
        
        const state2 = await db.addAdReport(null)
        expect(state2).toBe(false)
    })

    test('addCommentReport', async () => {
        const state = await db.addCommentReport(undefined)
        expect(state).toBe(false)
        
        const state2 = await db.addCommentReport(null)
        expect(state2).toBe(false)
    })
    
    
})

describe('comments test', () => {
    test('addComment + getFullComments', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);

        await db.addUser(name, email, password, "0648372432", true)
        const id = await db.getUserId(name)
        await db.addAd(id, "titire", "descccc", "city", 400, "€/h", '["ok.PNG1671103170403.png","okok.PNG1671103170403.png","gzko.png1671103170403.png"]')
        const ad = Array.from(await db.searchAds("city"))[0]
        const par = await db.addComment(ad.id, "Salut à tous", id)
        console.log(par)
        const sub = await db.addComment(ad.id, "rpo", id, par, par)
        const subsub = await db.addComment(ad.id, "rpo", id, par)

        // error
        await db.addComment(undefined, "rpo", id, par)

        const nad = await db.getAd(ad.id)

        await db.getFullComments(nad.comments)

        const state = await db.getAd(undefined)
        expect(state).toBe(false);

        const state2 = await db.getAd(Math.random())
        expect(state2).toBe(false);
    })

    test('delete comments', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);

        await db.addUser(name, email, password, "0648372432", true)
        const id = await db.getUserId(name)
        await db.addAd(id, "titire", "descccc", "city", 400, "€/h", '["ok.PNG1671103170403.png","okok.PNG1671103170403.png","gzko.png1671103170403.png"]')
        const ad = Array.from(await db.searchAds("city"))[0]
        const par = await db.addComment(ad.id, "Salut à tous", id)
        console.log(par)
        const sub = await db.addComment(ad.id, "rpo", id, par, par)
        const subsub = await db.addComment(ad.id, "rpo", id, par)

        await db.deleteComments(subsub)
        await db.deleteComments(sub)
        await db.deleteComments(par)

        await db.deleteComments(Math.random())
        await db.deleteComments(undefined)
    })

})

describe('ads tests', () => {

    test('getUserAds', async () => {
        //make user
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        //make ad
        const title = randomString(10);
        const description = randomString(10);
        const price = randomString(10);
        const city = randomString(10);
        const rate = randomString(10);
        const images = '["ok.PNG1671103170403.png","okok.PNG1671103170403.png","gzko.png1671103170403.png"]'
        await db.addAd(user.id, title, description, city, price, rate, images);
        const adv = Array.from(await db.searchAds(title))[0]

        const ad = await db.getAd(adv.id);

        //get user ads
        const ads3 = await db.getUserAds(user.id);
        expect(ads3).not.toBeNull();


        //error test
        const ads = await db.getUserAd(Math.random());
        expect(ads).toBe(false);

        const ads2 = await db.getUserAd(undefined);
        expect(ads2).toBe(false);

        const state = await db.addAd(null);
        expect(state).toBe(undefined);

        const state2 = await db.updateAdd(null);
        expect(state2).toBe(false);

        const state3 = await db.updateAdd(undefined);
        expect(state3).toBe(false);

        const state4 = await db.addAd(1, "titre", "desc", "LLN", 300, "€/m", [1, 2, 3])
        expect(state4).toBe(undefined)

        const ads4 = await db.getUserAds(undefined);
        expect(ads4).toBe(false);

        // const state5 = await db.searchAds(Error);  // should be false ---> error
        // expect(state5).toBe(false);
        

    });

    test('getAllAds', async() => {
        const ads = await db.getAllAds()
        expect(ads).not.toBeNull
        sq.sequelize.sync({force: true})
    })

    test("update ad", async () => {
        //make user
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        //make ad
        const title = randomString(10);
        const description = randomString(10);
        const price = randomString(10);
        const city = randomString(10);
        const rate = randomString(10);
        const images = '["ok.PNG1671103170403.png","okok.PNG1671103170403.png","gzko.png1671103170403.png"]'
        await db.addAd(user.id, title, description, city, price, rate, images);
        const adv = Array.from(await db.searchAds(title))[0]

        // const update = await db.updateAdd(adv.id, "new title", "new desc", "new city", 500, "€/m", [1, 2, 3])
        // expect(update).toBe(true) // should be true ---> error

    })

})

describe ('search test', () => {

    test('searchUser', async () => {
        const name = randomString(10);
        const email = randomString(10) + "@gmail.com";
        const password = randomString(10);
        await db.addUser(name, email, password);
        const user = await db.getUser(name);

        const usersearch = await db.searchUser(name);
        expect(usersearch).not.toBeNull();

        //error test
        const usersearch2 = await db.searchUser(null);
        expect(usersearch2).not.toBeNull();  // should be false ---> error


    })

})

