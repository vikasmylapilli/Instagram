import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import db from '../firebase';
import "../style/Post.css"
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageURL}) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

    useEffect(()=>{
      let unsubscribe;
      if (postId){
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp","desc")
        .onSnapshot( (snapshot)=>{
          setComments(snapshot.docs.map((doc)=> doc.data()))});
      }
      return ()=> {
        unsubscribe()
      };
    }, [postId]);


    const postComment = (event) =>{
      event.preventDefault();
      db.collection('posts')
      .doc(postId)
      .collection("comments").add({
        text : comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment('')
    }
  return (
    <div className='post'>
      <div className='post__head'>
      <Avatar 
      className='post__avatar'
      alt={"smayuktha_menon"}
      src={"https://pbs.twimg.com/media/EFyM-AhVAAA2T3Q?format=jpg&name=large"}
      />
        <h3>{username}</h3>
      </div>
        <img className='post__image' src={imageURL} alt="" />

        <h4 className='post__text'> <strong>{username}</strong> {caption}</h4>

        
        <div className="post__comments">
            {
              comments.map((comment)=> (
                <p>
                  <strong>
                    {comment.username}
                  </strong>
                  {comment.text}
                </p>
              ))
            }
        </div>
        {
          user && (
              <form className='post__commentBox'>
          <input
          className='post__input'
          type="text"
          placeholder='Add a comment'
          value={comment}
          onChange={(e)=> setComment(e.target.value)}
          />
          <button 
          className="post__button"
          disabled ={!comment}
        
          type='submit'
          onClick={postComment}
          >
            Post
          </button>
        </form>
        )
      }

        
        {/* usrename + caption */}
    </div>
  )
}

export default Post