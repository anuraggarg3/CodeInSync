import React, { useState } from 'react'
import { v4 as uudidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';
const Home = () => {

    const navigate=useNavigate();

    const [roomId,setRoomID]=useState('');
    const [username,setUsername]=useState('');

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uudidv4();
        setRoomID(id);
        // console.log(id);
        toast.success('Created a new room')
   }

   const joinRoom=()=>{
     if(!roomId) {
        toast.error('Room ID is required')
        return;
     }
     else if(!username||username==' '||username=='  '){
        toast.error('username is required')
        return;
     }
     toast('Joined Successfull!', {
        icon: '🎉',
        duration: 1000,
      });
     // redirect to editor page 
     navigate(`/editor/${roomId}`,{
        state:{username,},
     });
   };

   const handleInputEnter=(e)=>{
    // console.log('event',e.code);
    if(e.code=='Enter')
    {
        joinRoom();
    }
   }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src='/websitelogo.png'height='70px'  alt='logo of our website'/>
            <div className='mainLabel'>&nbsp;  Paste Invitation Room Id :</div>
            <div className='inputGroup'>
                <input type='text' className='inputBox' placeholder='ROOM ID' 
                onChange={(e)=>setRoomID(e.target.value )}
                value={roomId} 
                onKeyUp={handleInputEnter} />
                <input type='text' className='inputBox' placeholder='USERNAME'
                onChange={(e)=>setUsername(e.target.value )}
                value={username}
                onKeyUp={handleInputEnter}  />
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createinfo'>
                    If you don't have an invite then create &nbsp; 
                    <a href='' onClick={createNewRoom} className='createNewBtn'>New Room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4>Build with ♥ by <a href='https://www.linkedin.com/in/anurag-garg-760109213/'>Anurag Garg</a> </h4>
        </footer>
    </div>
  )
}

export default Home
