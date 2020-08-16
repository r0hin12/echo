const functions = require('firebase-functions');
const admin = require('firebase-admin');
const getJSON = require('get-json');
const cors = require('cors')({origin: true});

const mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const tmpdir = os.tmpdir();
const fs = require('fs')
const request = require('request');

admin.initializeApp();

const JPEG_EXTENSION = '.png';

// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.createAccount = functions.https.onCall(async (data, context) => {
    
    const uid = context.auth.uid;
    const name = data.displayname;
    const username = data.username
    const db = admin.firestore()

    function hasWhiteSpace(s) {
        return /\s/g.test(s);
    }

    // Username verification
    if (hasWhiteSpace(username) || username == "") {
        return {data: false};
    }

    doc = await db.collection('app').doc('details').get()
    
    if (doc.data().usernames.includes(username)) {
        return {data: false};
    }

    // Approved, create account.

    await db.collection('app').doc('details').update({
        usernames: admin.firestore.FieldValue.arrayUnion(data.username),
        map: admin.firestore.FieldValue.arrayUnion(uid)
    })

    await db.collection('follow').doc(uid).collection('followers').doc('a').set({
        status: false,
    })

    await db.collection('follow').doc(uid).collection('following').doc('a').set({
        status: false,
    })
    await db.collection('follow').doc(uid).collection('requested').doc('a').set({
        status: false,
    })
    await db.collection('follow').doc(uid).collection('requesting').doc('a').set({
        status: false,
    })

    await db.collection('follow').doc(uid).set({
        following: 0,
        followers: 0,
        requested: 0,
        requesting: 0,
    })
    
    await db.collection('users').doc(uid).set({
        username: username,
        name: name,
        enabled: true,
        type: 'public',
        emailchange: admin.firestore.FieldValue.serverTimestamp(),
        passchange: admin.firestore.FieldValue.serverTimestamp(),
        created: admin.firestore.FieldValue.serverTimestamp(),
        repcheck: admin.firestore.FieldValue.serverTimestamp(),
        url: 'https://firebasestorage.googleapis.com/v0/b/eongram-87169.appspot.com/o/logos%2F' + uid + '.png?alt=media',
        rep: 0,
        direct_active: [],
        direct_pending: [],
        direct_activity: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true})
    
    // Upload Profile Photo

    return request("https://firebasestorage.googleapis.com/v0/b/eongram-87169.appspot.com/o/app%2Flogo.png?alt=media").pipe(fs.createWriteStream(path.join(tmpdir,'default.png'))).on('close', async () => {
        const bucket = admin.storage().bucket();
        
        await bucket.upload(path.join(tmpdir,'default.png'), {
            destination: `logos/${uid}.png`,
        });

        fs.unlink(path.join(tmpdir,'default.png'), () => {
            return {data: true};
        })
    });
        
});

exports.imageToJPG = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name;
    const baseFileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);
    const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: JPEG_EXTENSION}));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);

    if (filePath.includes('logos/')) {
        console.log(filePath);
        if (object.contentType.startsWith('image/png')) {
            console.log('Already a PNG.');
            return null;
        }

        const bucket = admin.storage().bucket(object.bucket);

        await mkdirp(tempLocalDir);

        await bucket.file(filePath).download({destination: tempLocalFile});

        await spawn('convert', [tempLocalFile, tempLocalJPEGFile]);

        await bucket.upload(tempLocalJPEGFile, {destination: JPEGFilePath});

        await bucket.upload(tempLocalJPEGFile, {destination: JPEGFilePath});

        fs.unlinkSync(tempLocalJPEGFile);
        fs.unlinkSync(tempLocalFile);;
        functions.logger.log("Converted Image")
    }
})

exports.EaggregateLikes = functions.firestore
.document('new_posts/{postId}/likes/{likeId}').onWrite(async (change, context) => {
    const likeId = context.params.likeId;
    const postId = context.params.postId;
    const db = admin.firestore()

    const likeDoc = change.after

    if (likeId == 'a') {
        return;
    }

    if (likeDoc.data().status) {
        // increment likes
        return await db.collection('new_posts').doc(postId).update({
            likes: admin.firestore.FieldValue.increment(1)
        })
    }

    else {
        return await db.collection('new_posts').doc(postId).update({
            likes: admin.firestore.FieldValue.increment(-1)
        })
    }

})

exports.EaggregateCommentsLikes = functions.firestore
  .document('new_posts/{postId}/comments/{commentId}/likes/{likeId}')
  .onWrite(async (change, context) => {
   
    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const likeId = context.params.likeId;
    const db = admin.firestore()

    if (commentId == 'a' || likeId == 'a') {
        return;
    }
    
    // Status
    if (change.after.data().status) {
        // Liked
        if (change.after.data().bookStatus && !change.before.data().status) {
            // Added bookmark only. logic pending
        }
        else {
            // Added like only
            // increment likes
            return await db.collection('new_posts').doc(postId).collection('comments').doc(commentId).update({
                likes: admin.firestore.FieldValue.increment(1),
            })
        }
    }
    else {
        if (change.after.data().bookStatus && !change.before.data().status) {
            // Removed bookmark only. logic pending
        }
        else {
            // Removed like only
            // decrement likes
            return await db.collection('new_posts').doc(postId).collection('comments').doc(commentId).update({
                likes: admin.firestore.FieldValue.increment(-1),
            })
        }
        
    }
})

exports.EaggregateCommentsReplies = functions.firestore
  .document('new_posts/{postId}/comments/{commentId}/replies/{replyId}')
  .onCreate(async (change, context) => {
    
    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const replyId = context.params.replyId;
    const db = admin.firestore()

    if (replyId == 'a') {
        return;
    }

    // get latest reply and increment reply count
    return await db.collection('new_posts').doc(postId).collection('comments').doc(commentId).update({
        replies: admin.firestore.FieldValue.increment(1),
        latest_reply_content: change.data().content,
        latest_reply_photo: change.data().photo_url,
        latest_reply_name: change.data().name,
    })

})

exports.EaggregateComments = functions.firestore
  .document('new_posts/{postId}/comments/{commentId}')
  .onCreate(async (change, context) => {
    
    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const db = admin.firestore()

    if (commentId == 'a') {
        return;
    }

    // increment comments count
    return await db.collection('new_posts').doc(postId).update({
        comments: admin.firestore.FieldValue.increment(1),
        latest_comment_content: change.data().content,
        latest_comment_photo: change.data().photo_url,
        latest_comment_name: change.data().name,
    })

})

exports.EaggregateFollowers = functions.firestore
  .document('follow/{followId}/followers/{userId}')
  .onWrite(async (change, context) => {

    db = admin.firestore()
    const followId = context.params.followId
    const userId = context.params.userId

    // Get all followers and DO NOT aggregate
    // IF IT WAS QUERY.size it could get thousands of reads per action

    const doc = change.after

    if (userId == "a") {
        return;
    }

    if (doc.data().status) {
        // Following

        return db.collection('follow').doc(followId).set({
            followers: admin.firestore.FieldValue.increment(1)
        }, {merge: true})
    }
    else {
        return db.collection('follow').doc(followId).set({
            followers: admin.firestore.FieldValue.increment(-1)
        }, {merge: true})
    }
})

exports.EaggregateFollowing = functions.firestore
  .document('follow/{followId}/following/{userId}')
  .onWrite(async (change, context) => {

    db = admin.firestore()
    const followId = context.params.followId
    const userId = context.params.userId

    const doc = change.after

    if (userId == "a") {
        return;
    }

    if (doc.data().status) {
        // Following

        return db.collection('follow').doc(followId).set({
            following: admin.firestore.FieldValue.increment(1)
        }, {merge: true})
    }
    else {
        return db.collection('follow').doc(followId).set({
            following: admin.firestore.FieldValue.increment(-1)
        }, {merge: true})
    }
})

exports.EtrendingTopics = functions.https.onRequest(async (req, res) => {
    db = admin.firestore()
    doc = await db.collection('functions').doc("trending").get()
    firebasedate = doc.data().last_accessed.toDate()
    currentdate = new Date()
    var diffMinutes = parseInt((currentdate - firebasedate) / (1000 * 60), 10); 

    if (diffMinutes > 12) {

        query = await db.collection('new_posts').orderBy("timestamp", "desc").limit(12).get()

        top = []
        for (let i = 0; i < query.docs.length; i++) {
            top.push(query.docs[i].data())
        }

        tags = []
        // Array in asc order of top tags from arr top
        top.forEach(element => {
            if (element.tags !== undefined && typeof(element.tags == 'object')) {
                for (let i = 0; i < element.tags.length; i++) {
                    tags.push(element.tags[i])
                }
            }
        });

        var cnts = tags.reduce( function (obj, val) {
            obj[val] = (obj[val] || 0) + 1;
            return obj;
        }, {} );
        var sorted = Object.keys(cnts).sort( function(a,b) {
            return cnts[b] - cnts[a];
        });

        tags = sorted.splice(0, 9);

        final = []
        
        for (i = 0; i < tags.length; i++) {
            try {
                responsea = await getJSON('https://api.unsplash.com/search/photos/?per_page=5&client_id=mdcoi0HS_f4gxizCo-88KFeojNgqkbDYLsEHCy5Ah6Q&query=' + tags[i])                
                length = responsea.results.length
                if (length < 5) {
                    p = 0
                }
                
                else {
                    p = Math.floor(Math.random() * 5)
                }

                name = tags[i];
                image = responsea.results[p].urls.regular;
                id = responsea.results[p].id;
                photographer = responsea.results[p].user.name;
                photographer_pfp = responsea.results[p].user.profile_image;
                photographer_url = responsea.results[p].links.self;

                if (tags[i] == 'memes' || tags[i] == 'meme') {
                    image = 'https://i.kym-cdn.com/photos/images/newsfeed/001/505/718/136.jpg'
                    id = 'a'
                    photographer = 'Yung Buddha'
                    photographer_pfp = "https://i.ytimg.com/vi/zJrpdH5OX-U/maxresdefault.jpg"
                    photographer_url = 'https://knowyourmeme.com/memes/woman-yelling-at-a-cat'
                }

                responseb = {
                    name: name,
                    image: image,
                    id: id,
                    photographer: photographer,
                    photographer_pfp: photographer_pfp,
                    photographer_url: photographer_url,
                }

                final.push(responseb)

            } catch (error) {
                responseb = {
                    name: tags[i],
                    image: 'nothing',
                    id: 'a',
                    photographer: 'Yung Buddha',
                    photographer_pfp: 'https://www.ctvnews.ca/polopoly_fs/1.4691731.1574134829!/httpImage/image.png_gen/derivatives/landscape_960/image.png',
                    photographer_url: 'https://www.toysrus.ca/dw/image/v2/BDFX_PRD/on/demandware.static/-/Sites-toys-master-catalog/default/dw82d5c0cb/images/E00B11C8_1.jpg',
                }

                final.push(responseb)
            }
        }

        // out of loop w arr final

        await db.collection("functions").doc('trending').update({
            data: final,
            last_accessed: admin.firestore.FieldValue.serverTimestamp()
        })   

        cors(req, res, () => {
            res.send({data: final})
        });
        

    }
    else {
        cors(req, res, () => {
            res.send({data: doc.data().data})
        });
    }
})