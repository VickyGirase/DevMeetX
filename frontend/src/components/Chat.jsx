import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [socket, setSocket] = useState(null); 

  useEffect(() => {
    if (!userId) return;

    const newSocket = socketConnection();
    setSocket(newSocket);

    newSocket.emit('join', {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    newSocket.on('messageReceived', ({ firstName, text, senderId }) => {
      if (senderId !== userId) {
       
        setMessages((prevMessages) => [
          ...prevMessages,
          { firstName, text, senderId },
        ]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessages = () => {
    if (!socket || !newMessage.trim()) return;

    
    socket.emit('sendMessage', {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });

   
    setMessages((prevMessages) => [
      ...prevMessages,
      { firstName: user.firstName, text: newMessage, senderId: userId },
    ]);

    setNewMessage('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-700 rounded-lg flex flex-col h-[80vh] bg-gray-900">
     
      <div className="p-5 bg-gray-800 text-white text-center font-bold text-lg">
        BAAT-CHEET
      </div>

    
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 max-w-[70%] rounded-lg ${
                msg.senderId === userId
                  ? 'bg-blue-600 text-white self-end'
                  : 'bg-gray-700 text-white self-start'
              }`}
            >
              <div className="text-sm font-semibold">{msg.firstName}</div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="p-5 border-t border-gray-700 flex items-center gap-3 bg-gray-800">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessages} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
