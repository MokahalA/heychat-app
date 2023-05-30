import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { ReactComponent as GoogleIcon } from './icons/google-icon.svg';

firebase.initializeApp({
  //firebase config
  apiKey: "AIzaSyAFLF2kvp4DEZh1F0ma1mmfqFVO75t87Ak",
  authDomain: "chat-app-9e304.firebaseapp.com",
  projectId: "chat-app-9e304",
  storageBucket: "chat-app-9e304.appspot.com",
  messagingSenderId: "97553003193",
  appId: "1:97553003193:web:ea1216898cc08b97bce168",
  measurementId: "G-L30FFBVSKB"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>HeyChat App 🔥💬</h1>
        <SignOut />
      </header>
      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className='sign-in' onClick={signInWithGoogle}><GoogleIcon className="small-icon"/> Sign in with Google </button>
  );
}

function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue ] = useState('');

  const sendMessage = async(e) => {
    
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        
        <span ref={dummy}></span>

      </main>
      
      <form onSubmit={sendMessage}>
        <input value={formValue} placeholder="Send a message..." onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">🕊️</button>
      </form>
    </>

  );
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
