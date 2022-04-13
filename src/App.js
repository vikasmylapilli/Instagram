import { ClassNames } from '@emotion/react';
import { Box, Button, Input, Modal, } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Post from './components/Post';
import db from './firebase';
import { makeStyles } from "@material-ui/core/styles";
import { auth } from './firebase';
import Imageupload from './components/ImageUpload';


function getModalStyle(){
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [opensignIn, setOpenSignIn ] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user has logged in....
        // console.log(authUser)
        setUser(authUser)
        console.log(user.DisplayName)
      }else{
        // user has logged out...
        setUser(null);
      }
    });
    return ()=>{
      unsubscribe();
    };
  },[user, username])




  useEffect(()=>{
      db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot=>{
        setPosts(snapshot.docs.map(doc=>({id:doc.id, post:doc.data()})))
      })
  },[])


  const signUp = (event)=>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
            displayName: username
      });
    })
    .catch((error)=>alert(error.message))
    // setOpen(false)
  }

  const signIn = (event)=>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))
    setOpenSignIn(false)
  }

  return (
        <div>
          <Modal
            open={open}
            onClose={()=>setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form className='app__signup'>
                <center>
                  <img 
                    className='app__headerImage' 
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                  </center>
                <Input 
                placeholder='username'
                type="text"
                value={username}
                onChange ={ (e)=> setUsername(e.target.value)}
                />
                <Input 
                placeholder='email'
                type="text"
                value={email}
                onChange ={ (e)=> setEmail(e.target.value)}
                />
                <Input 
                placeholder='password'
                type="password"
                value={password}
                onChange = {(e)=> setPassword(e.target.value)}
                />
                <Button type='submit' onClick={signUp}>SignUp</Button>
                
              </form>
            </div>
            
        </Modal>
        <Modal
            open={opensignIn}
            onClose={()=>setOpenSignIn(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form className='app__signup'>
                <center>
                  <img 
                    className='app__headerImage' 
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                  </center>
                <Input 
                placeholder='email'
                type="text"
                value={email}
                onChange ={ (e)=> setEmail(e.target.value)}
                />
                <Input 
                placeholder='password'
                type="password"
                value={password}
                onChange = {(e)=> setPassword(e.target.value)}
                />
                <Button type='submit' onClick={signIn}>SignIn</Button>
                
              </form>
            </div>
            
        </Modal>
        <div className='app__header' >
          <img 
          className='app__headerImage' 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

          {user?  (
          <Button onClick={()=>auth.signOut()}>LogOut</Button>
            ):(
              <div className="app__loginContainer">
                <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={()=>setOpen(true)}>Sign Up</Button>
              </div>
              
            )}
        </div>
        
        <div className='app__posts'>
        {
          posts.map(({id, post})=>(
          
          <Post 
          key={id}
          postId = {id}
          username = {post.username}
          caption={post.caption} 
          imageURL={post.imageURL}
          user={user}
          />
        ))} 
            {
            user?.displayName? (
              <Imageupload username ={user.displayName}/>
            )
            :
            (
              <h3>Sorry You need to login</h3>
            )
          }       
        </div>
    </div>
  );
}

export default App;
