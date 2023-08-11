import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.delete){
        handleDelete(e.target.dataset.delete)
    }
})
 
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}


function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId) {
    const replySection = document.getElementById(`replies-${replyId}`);
    replySection.classList.toggle('hidden');
    if (!replySection.classList.contains('hidden')) {
        const replyInputHtml = `
            <div class="reply-input">
                <textarea id="reply-input-${replyId}" placeholder="Enter your reply..."></textarea>
                <button class="reply-submit" data-reply="${replyId}">Submit</button>
            </div>
        `;
        replySection.innerHTML += replyInputHtml;
        const replySubmitButton = replySection.querySelector('.reply-submit');
        replySubmitButton.addEventListener('click', function () {
            handleReplySubmit(replyId);
        });
    }
}

function handleReplySubmit(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const replyText = replyInput.value;
    const targetTweet = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (targetTweet) {
        targetTweet.replies.push({
            handle: `@YourUsername`, 
            profilePic: `images/userprofile.png`, 
            tweetText: replyText,
        })
        render();
    }
    replyInput.value = ''
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function handleDelete(tweetId) {
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    if (tweetIndex !== -1) {    
        tweetsData.splice(tweetIndex, 1)
        render();
    }
}


function getFeedHtml(){
    let feedHtml = ``
    tweetsData.forEach(function(tweet){
        let likeIconClass = ''   
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                            repliesHtml+=`
                                <div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                            </div>
                                        </div>
                                </div>
                                `
            })
        }
          
        feedHtml += `
                    <div class="tweet">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                        <i class="fa-regular fa-comment-dots"
                                        data-reply="${tweet.uuid}"
                                        ></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}"
                                        data-like="${tweet.uuid}"
                                        ></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                                        data-retweet="${tweet.uuid}"
                                        ></i>
                                        ${tweet.retweets}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-trash ${retweetIconClass}"
                                        data-delete="${tweet.uuid}"
                                        ></i>
                                    </span>
                                </div>   
                            </div>            
                        </div>
                    <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                    </div>   
                </div>
                `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}
render()

