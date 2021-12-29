const url = "https://twitter-clone-rjakubczyk.herokuapp.com/"

function follow(userToFollow) {

  const currentUser = document.getElementById("current-user").innerHTML
  const follow = {
    user: currentUser,
    follows: userToFollow
  }

  fetch(url + "follow", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(follow) 
  })
  .then(res => { 
    getFollowedPosts()
    getFollowed()
    getSuggestedFollowed()
  })

}

function unfollow(userToUnfollow) {

  const currentUser = document.getElementById("current-user").innerHTML
  const unfollow = {
    user: currentUser,
    unfollows: userToUnfollow
  }
  console.log(unfollow)
  fetch(url + "unfollow", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(unfollow) 
  })
  .then(res => { 
    getFollowedPosts()
    getFollowed()
    getSuggestedFollowed()
  })

}


function changeUser() {

  const form = document.getElementById("create-user")
  
  const user = {
    username: form.username.value
  }

  fetch(url + "user", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(user) 
  })
  .then(res => { 
    changeCurrentUser(user.username)
    getUserPosts()
    getSuggestedFollowed()
    getFollowed()
    getFollowedPosts()
  })

}

function getSuggestedFollowed() {
  
  const username = document.getElementById("current-user").innerHTML
  document.getElementById("to-follow").innerHTML = ""

  fetch(url + `suggested_followers/${username}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    json.forEach(el => addSuggestedFollowed(el))
  })

}

function getFollowed() {
  
  const username = document.getElementById("current-user").innerHTML
  document.getElementById("followed").innerHTML = ""

  fetch(url + `followed/${username}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    json.forEach(el => addFollowed(el))
  })

}

function changeCurrentUser(newUserName) {

  const user = document.getElementById("current-user")
  user.innerHTML = newUserName

}

function createPost() { 

  const content = document.getElementById("new-post-content").value
  const username = document.getElementById("current-user").innerHTML
  
  const post = {
    username: username,
    content: content
  }

  fetch(url + "post", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(post) 
  })
  .then(res => { 
    if (res.status == 404) alert(res)
    getUserPosts()
  })


}

function getUserPosts() {

  const username = document.getElementById("current-user").innerHTML
  document.getElementById("user-posts").innerHTML = ""

  fetch(url + `post/${username}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'} 
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    json.forEach(el => addPost(el))
  })

}

function getFollowedPosts() {

  const username = document.getElementById("current-user").innerHTML
  document.getElementById("followed-posts").innerHTML = ""

  fetch(url + `post/followed/${username}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    json.forEach(el => addFollowedPost(el))
  })

}

function addPost(post) {

  const posts = document.getElementById("user-posts")
  const newPost = document.createElement('div')
  newPost.className = 'post'
  newPost.appendChild(addPostId(post[1]))
  newPost.appendChild(addPostContent(post[0]))
  newPost.appendChild(addPostLikes(post[2]))
  newPost.appendChild(likeButton(post[1]))
  newPost.appendChild(document.createElement('hr'))
  newPost.appendChild(addPostComments(post[1]))
  newPost.appendChild(commentButton(post[1]))
  posts.appendChild(newPost)

  fetch(url + `comment/${post[1]}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    const comments = document.getElementById(`post-${post[1]}`)
    console.log('here')
    json.forEach(comment => {
      comments.innerHTML += `<div class="comment">${comment[0]} <p style='text-align:right;font-style:italic;font-size:12px;'>${comment[1]}</p></div>`
    })
  })

}

function addFollowedPost(post) {

  const posts = document.getElementById("followed-posts")
  const newPost = document.createElement('div')
  newPost.className = 'post'
  newPost.appendChild(addPostId(post[2]))
  newPost.appendChild(addPostAuthor(post[0]))
  newPost.appendChild(addPostContent(post[1]))
  newPost.appendChild(addPostLikes(post[3]))
  newPost.appendChild(likeButton(post[2]))
  newPost.appendChild(document.createElement('hr'))
  newPost.appendChild(addPostComments(post[2]))
  newPost.appendChild(commentButton(post[2]))
  posts.appendChild(newPost)

  fetch(url + `comment/${post[2]}`, { 
    method: "GET", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'} 
    // mode: 'cors'
  })
  .then(res => res.json())
  .then(json => {
    const comments = document.getElementById(`post-${post[2]}`)
    console.log('here')
    json.forEach(comment => {
      comments.innerHTML += `<div class="comment">${comment[0]} <p style='text-align:right;font-style:italic;font-size:12px;'>${comment[1]}</p></div>`
    })
  })

}

function addPostComments(postId) {

  const comments = document.createElement('div')
  comments.id = `post-${postId}`
  commentButton.className = 'comments'
  comments.innerHTML += "<p style='text-align:center;'>komentarze:</p>"
  return comments
}

function addSuggestedFollowed(followed) {

  const _followed = document.getElementById("to-follow")
  _followed.innerHTML += `<li>${followed[0]} - ${followed[1]} obserwujących <div id="user-follow" class="user-hover" onclick=follow("${followed[0]}")>Obserwuj</div></li>`

}

function addFollowed(followed) {

  const _followed = document.getElementById("followed")
  _followed.innerHTML += `<li>${followed[0]} <div id="user-unfollow" class="user-hover" onclick=unfollow("${followed[0]}")>Usuń z obserwowanych</div></li>`

}

function addPostLikes(likes) {
  const _likes = document.createElement('div')
  _likes.className = "post-likes"
  _likes.innerHTML = `${likes} polubień`
  return _likes
}

function addPostId(id) {
  const _id = document.createElement('div')
  _id.className = "post-id"
  _id.innerHTML = `#${id}`
  return _id
}

function addPostContent(content) {
  const _content = document.createElement('div')
  _content.className = "post-content"
  _content.innerHTML = content
  return _content
}

function addPostAuthor(author) {
  const _author = document.createElement('div')
  _author.className = "post-author"
  _author.innerHTML = author
  return _author
}

function likeButton(postId) {
  const button = document.createElement('button')
  button.className = "like-button"
  button.innerText = "Polub post"
  button.addEventListener('click', () => sendLike(postId))
  return button 
}

function commentButton(postId) {
  const comment_form = document.createElement('div')

  const textarea = document.createElement('textarea')
  textarea.className = "comment-content"
  comment_form.appendChild(textarea)

  const button = document.createElement('button')
  button.className = "comment-button"
  button.innerText = "Dodaj komentarz"
  button.addEventListener('click', () => sendComment(postId, textarea.value))
  comment_form.appendChild(button)

  return comment_form
}

function sendComment(postId, content) {

  const comment = {
    author: document.getElementById("current-user").innerHTML,
    post: postId,
    content: content
  }
  fetch(url + "comment", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(comment) 
  })
  .then(res => { 
    getFollowedPosts()
    getUserPosts()
  })

}

function sendLike(postId) {

  const currentUser = document.getElementById("current-user").innerHTML
  const like = {
    user: currentUser,
    post: postId
  }
  fetch(url + "like", { 
    method: "POST", 
    headers: {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'}, 
    // mode: 'cors', 
    body: JSON.stringify(like) 
  })
  .then(res => { 
    getFollowedPosts()
    getUserPosts()
  })

}