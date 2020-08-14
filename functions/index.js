const functions = require('firebase-functions');
const admin = require('firebase-admin');
var getJSON = require('get-json');
const cors = require('cors')({origin: true});


admin.initializeApp();

exports.aggregateLikes = functions.firestore
.document('new_posts/{postId}/likes/{likeId}').onWrite(async (change, context) => {
    const likeId = context.params.likeId;
    const postId = context.params.postId;
    const db = admin.firestore()

    const likeDoc = change.after

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

exports.aggregateCommentsLikes = functions.firestore
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

exports.aggregateCommentsReplies = functions.firestore
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

exports.aggregateComments = functions.firestore
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

exports.aggregateFollowers = functions.firestore
  .document('follow/{followId}/followers/{userId}')
  .onWrite(async (change, context) => {

    db = admin.firestore()
    const followId = context.params.followId
    const userId = context.params.userId

    // Get all followers and DO NOT aggregate
    // IF IT WAS QUERY.size it could get thousands of reads per action

    const doc = change.after

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

exports.aggregateFollowing = functions.firestore
  .document('follow/{followId}/following/{userId}')
  .onWrite(async (change, context) => {

    db = admin.firestore()
    const followId = context.params.followId
    const userId = context.params.userId

    const doc = change.after
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

exports.trendingTopics = functions.https.onRequest(async (req, res) => {
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