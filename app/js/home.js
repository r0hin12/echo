$("#imgInp").change(function(){if(this.files&&this.files[0]){var e=new FileReader;e.onload=function(e){$("#blah").attr("src",e.target.result)},e.readAsDataURL(this.files[0])}document.getElementById("blah").style.display="block",document.getElementById("captionel").style.display="block",document.getElementById("captionelel").style.display="block"});

async function newpost() {

    var caption = document.getElementById('captioninput').value

    if (caption == '' || caption == " " || caption == null) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    if (document.getElementById('captioninput').value.length > 100) {
        error('Caption contains more than 100 characters.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // Image Tags
    tags = $("#tagsinput1").tagsinput('items')

    if (tags.length > 8) {
        error('You have added more than 8 tags.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // Approved, create records.

    document.getElementById('tagsinput1').value = ''
    document.getElementById('captioninput').value = ''

    file = document.getElementById('imgInp').files[0]
    filenoext = file.name.replace(/\.[^/.]+$/, "")
    ext = file.name.split('.').pop();
    valuedate = new Date().valueOf()
    filename = filenoext + valuedate + '.' + ext

    var fileRef = storageRef.child('users/' + user.uid + '/' + filename);

    await fileRef.put(file)

    url = await fileRef.getDownloadURL()

    doc = await db.collection('new_posts').add({
        caption: caption,
        comments: 0,
        file_url: url,
        file_name: filename,
        latest_comment: "null",
        latest_comment_photo: "null",
        likes: 0,
        photo_url: cacheuser.url,
        private: document.getElementById('privateinp').checked,
        tags: tags,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        username: cacheuser.username,
        reported: false,
        report_weight: 0,
        name: cacheuser.name
    })

    await db.collection('new_posts').doc(doc.id).collection('comments').doc('a').set({
        status: false,
    })

    await db.collection('new_posts').doc(doc.id).collection('likes').doc('a').set({
        status: false,
    })

    // Post uploaded.

    Snackbar.show({
        showAction: false,
        pos: 'bottom-center',
        text: 'Your photo was uploaded.'
    })

    $('#uploadmodal').modal('toggle')

    document.getElementById('captionel').style.display = 'none'
    document.getElementById('blah').style.display = 'none'
    document.getElementById('captionel').style.display = 'none'

    // document.getElementById('rereshtbn').click()
    query = await db.collection('new_posts')
    .orderBy("timestamp", "desc")
    .where("uid", '==', user.uid)
    .limit(1)
    .get()

    build_posts_all(query.docs, true)
}

async function newTextPost(theme) {
    text = document.getElementById('textpostbox').value

    if (text == '' || text == " " || text == null || text == undefined) {
        error('You must include a caption.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    if (document.getElementById('textpostbox').value.length > 320) {
        error('Your text contains more than 320 characters.')
        $('#uploadmodal').modal('toggle')
        return
    }

    // Text Tags
    tags = $("#tagsinput2").tagsinput('items')
    if (tags.length > 8) {
        // More than 8 tags
        error('You have added more than 8 tags.')
        $('#uploadmodal').modal('toggle')
        return;
    }

    // All good

    document.getElementById('tagsinput2').value = ''
    document.getElementById('textpostbox').value = ''

    $('#uploadmodal').modal('toggle')

    doc = await db.collection('new_posts').add({
        comments: 0,
        file_url: 'echo-home-text_post',
        url_theme: theme,
        url_content: text,
        file: 'echo-home-text_post',
        latest_comment: "null",
        latest_comment_photo: "null",
        likes: 0,
        photo_url: cacheuser.url,
        private: document.getElementById('privateinp2').checked,
        tags: tags,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        username: cacheuser.username,
        reported: false,
        report_weight: 0,
        name: cacheuser.name
    })

    await db.collection('new_posts').doc(doc.id).collection('comments').doc('comments').set({
        comments: []
    })

    await db.collection('new_posts').doc(doc.id).collection('likes').doc('a').set({
        status: false
    })

    Snackbar.show({
        showAction: false,
        pos: 'bottom-center',
        text: 'Your text was uploaded.'
    })
    edittext()
    newpost_back()
    $('#selecttext').addClass('hidden')

    $('#captionel').css('display', 'none')
    $('#blah').css('display', 'none')
    $('#captionel').css('display', 'none')
    // $('#rereshtbn').click()
}