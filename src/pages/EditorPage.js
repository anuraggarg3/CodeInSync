import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation,useNavigate ,Navigate , useParams} from 'react-router-dom';
import { toast } from 'react-hot-toast';
const EditorPage = () => {

    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation();

    const {roomId}=useParams();
    // console.log(roomId); 
    const reactNavigator=useNavigate();

    const[clients,setClients]=useState([]);

    useEffect(()=>{
      const init =async()=>{
        socketRef.current= await initSocket();

        socketRef.current.on('connect_error', (err) => handleErrors(err));

         socketRef.current.on('connect_failed', (err) => handleErrors(err));

         function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
          
        socketRef.current.emit(ACTIONS.JOIN,{
          roomId,
          username:location.state?.username,
        });

        //Listening for joined event 
        socketRef.current.on(
          ACTIONS.JOINED,
          ({clients,username,socketId})=>{
             if(username!==location.state?.username){
               toast.success(`${username} joined the room.`);
               console.log(`${username} joined`)
             }
             setClients(clients);
             //here we code sync 
             socketRef.current.emit(ACTIONS.SYNC_CODE,{
              code:codeRef.current,
              socketId,
             });
          }
        );

        //Listening for disconnected 
        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
          toast.success(`${username} left the room.`);
          setClients((prev)=>{
            return prev.filter(
              client=>client.socketId!=socketId
              );
          })
        })

      };
      init();
      return ()=>{
        socketRef.current.off(ACTIONS.JOINED); 
        socketRef.current.off(ACTIONS.DISCONNECTED); 
        socketRef.current.disconnect(); 
      }
    },[]);
    

       if(!location.state){
        return <Navigate to="/"/>;
       }


// button copy room id function
 async function copyRoomid(){
   try{
    await navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied successfully')
   } 
   catch(err){
    toast.error('could not copied room id');
    console.error(err);
   }
 }

 // button leave room function
  
  function leaveRoom(){
    reactNavigator('/');
  }

  return (
    <div className='mainWrap'>
     <div className='leftSide'>
        <div className='leftSideInner'>
            <div className='logo'>
            <img src='/websitelogo.png'height='60px' width='200px' alt='logo of our website'/>
            </div>
            <h3>Connected</h3>
            <div className='clientLists'>
                {clients.map(client=>(<Client 
                key={client.socketId}
                username={client.username}/>))}
            </div>
        </div>
        <button className='btn coptBtn ' onClick={copyRoomid}>Copy Room ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
     </div>
     <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code;}} />
     </div>
    </div>
  )
}

export default EditorPage
