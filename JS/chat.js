'use strict';

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
//var logInButton = document.getElementById('logIn');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var userNotLoggedInSection = document.getElementById('posts-hidden');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var listeningFirebaseRefs = [];


// Saves a new post to the Firebase DB.
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}


// Creates a post element.
function createPostElement(postId, title, text, author, authorId, authorPic) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post post-' + postId + '">' +
        '<div class="mdl-card">' +
          '<div class="mdl-card__title">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="userDetails">' +
            '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username"></div>' +
            '</div>' +
          '</div>' +
          '<div class="text"></div>' +
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
 
  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
  postElement.getElementsByClassName('avatar')[0].style.backgroundImage = 'url("' +
      (authorPic || '../silhouette.jpg') + '")';

  return postElement;
}


// Starts listening for new posts and populates posts lists.
function startDatabaseQueries() {
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  //var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END my_top_posts_query]
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(3);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
          containerElement.firstChild);
    });
		
	//changed and removed prob not necessary TODO!!
    postsRef.on('child_changed', function(data) {	
		var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
		var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
		postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
		postElement.getElementsByClassName('username')[0].innerText = data.val().author;
		postElement.getElementsByClassName('text')[0].innerText = data.val().body;
    });
    postsRef.on('child_removed', function(data) {
		var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
		var post = containerElement.getElementsByClassName('post-' + data.key)[0];
	    post.parentElement.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(recentPostsRef);
  listeningFirebaseRefs.push(userPostsRef);
}

// Writes the user's data to the database.
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
// [END basic_write]

// Cleanups the UI and removes all Firebase listeners.
function cleanupUi() {
  // Remove all previously displayed posts.
  recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
  userPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';

  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

// The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just programmatic token refresh but not a User status change.
var currentUID;

// Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    currentUID = user.uid;
    //splashPage.style.display = 'none';
		signInButton.style.display = 'none';
		signOutButton.style.display = 'block';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    //Display the splash page where you can sign-in.
    //splashPage.style.display = '';
		signInButton.style.display = 'block';
		signOutButton.style.display = 'none';
  }
}

// Creates a new post for the current user.
function newPostForCurrentUser(title, text) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().username;
    // [START_EXCLUDE]
    return writeNewPost(firebase.auth().currentUser.uid, username,
        firebase.auth().currentUser.photoURL,
        title, text);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}

// Displays the given section element and changes styling of the given button.
function showSection(sectionElement, buttonElement) {
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'none';
  addPost.style.display = 'none';
	userNotLoggedInSection.style.display = 'none'; //TEST  
  recentMenuButton.classList.remove('is-active');
  myPostsMenuButton.classList.remove('is-active');
	addButton.classList.remove('is-active');
	signOutButton.classList.remove('is-active'); //TEST

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

// Bindings on load.
window.addEventListener('load', function() {
	$('#posts-hidden').show();
  // Bind Sign in button.
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
		$('.pages').hide(); //Added to TEST
		$('#messageBoard').show(); //Added to TEST
		showSection(recentPostsSection, signInButton); //TODO 
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
		$('.pages').hide(); //Added to TEST
		$('#messageBoard').show(); //Added to TEST
		showSection(userNotLoggedInSection, signOutButton); //TODO 
  }); 
	
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text).then(function() {
        myPostsMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };

  // Bind menu buttons.
  recentMenuButton.onclick = function() {
    showSection(recentPostsSection, recentMenuButton);
  };
  myPostsMenuButton.onclick = function() {
    showSection(userPostsSection, myPostsMenuButton);
  };
  addButton.onclick = function() {
    showSection(addPost);
    messageInput.value = '';
    titleInput.value = '';
  };
  recentMenuButton.onclick();
}, false);