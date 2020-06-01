db = firebase.firestore()

function linktwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {

        var index = functiontofindIndexByKeyValue(user.providerData, "providerId", "password");

        db.collection('users').doc(user.uid).update({
            twitter: {
                name: user.providerData[index].displayName,
                id: user.providerData[index].uid,
                enabled: true,

            }
        }).then(function() {
            Snackbar.show({text: 'Twitter linked successfully.'})
            goFunc = "gotwitter('" + user.providerData[index].uid + "')"
            document.getElementById('twitterlinktext').innerHTML = 'Your account is linked to <a href="#" onclick="' + goFunc + '">' + user.providerData[index].displayName + '</a>.'
            document.getElementById('twitterlinkbutton').innerHTML = 'unlink twitter ->'
            document.getElementById('twitterlinkbutton').onclick = function() {
                unlinktwitter()
            }
        })

      }).catch(function(error) {
        document.getElementById('erorrModalMsg').innerHTML = error.message + '<br><br>Try logging out of Twitter then logging back in. If this does not work, contact us.'
        $('#errorModal').modal('toggle')
      });
}

function unlinktwitter() {
    user.unlink("twitter.com").then(function() { 
        db.collection('users').doc(user.uid).update({
            twitter: firebase.firestore.FieldValue.delete()
        }).then(function() {
            document.getElementById('twitterlinktext').innerHTML = 'Link your Twitter account to Eonnect. You will have the option to show or hide your Twitter on your profile!'
            document.getElementById('twitterlinkbutton').innerHTML = 'link twitter ->'
            document.getElementById('twitterlinkbutton').onclick = function() {
                linktwitter()
            }
            Snackbar.show({text: "Twitter unlinked successfully."})
        })
      }).catch(function(error) {
        document.getElementById('erorrModalMsg').innerHTML = error.message + '<br><br>Try logging out of Twitter then logging back in. If this does not work, contact us.'
        $('#errorModal').modal('toggle')
      });
}

function gotwitter(uid) {

youareleaving('https://twitter.com/intent/user?user_id=1075828370183737344')

}




























function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

    if (arraytosearch[i][key] == valuetosearch) {
    return i;
    }
    }
    return null;
}