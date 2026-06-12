import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { getChatRoom, uploadChatFile } from '../assets/services/chatService';
import styles from './ChatWindow.module.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const ChatWindow = ({ applicationId, onClose }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch Chat Room Details & History
    const initChat = async () => {
      try {
        const res = await getChatRoom(applicationId);
        setChatRoom(res);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load chat room', err);
      }
    };
    initChat();

    // 2. Initialize Socket.io connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [applicationId]);

  useEffect(() => {
    if (socket && chatRoom) {
      socket.emit('join_room', chatRoom.chatRoom._id);

      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [socket, chatRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !chatRoom) return;

    const messageData = {
      chatRoomId: chatRoom.chatRoom._id,
      senderId: user.id || user._id,
      text: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadChatFile(file);
      
      const messageData = {
        chatRoomId: chatRoom.chatRoom._id,
        senderId: user.id || user._id,
        text: '', // Empty text for file uploads
        fileUrl: res.fileUrl,
        fileName: res.fileName,
      };

      socket.emit('send_message', messageData);
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input
    }
  };

  if (!chatRoom) {
    return (
      <div className={styles.overlay}>
        <div className={styles.chatBox}>
          <div className={styles.loader}>Loading chat...</div>
        </div>
      </div>
    );
  }

  const chatPartnerName = user.role === 'recruiter' ? chatRoom.candidateName : chatRoom.companyName;

  return (
    <div className={styles.overlay}>
      <div className={styles.chatBox}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.headerTitle}>{chatPartnerName}</h3>
            <span className={styles.headerSubtitle}>
              {user.role === 'recruiter' ? 'Candidate' : 'Recruiter'} • {chatRoom.jobTitle}
            </span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        {/* Message Area */}
        <div className={styles.messageArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyChat}>
              Say hello to {chatPartnerName}!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderId === (user.id || user._id);
              return (
                <div key={index} className={`${styles.messageWrapper} ${isMine ? styles.myMessage : styles.theirMessage}`}>
                  <div className={styles.messageBubble}>
                    {msg.text && <p className={styles.messageText}>{msg.text}</p>}
                    {msg.fileUrl && (
                      <a 
                        href={`http://localhost:5000/${msg.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileAttachment}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                        {msg.fileName}
                      </a>
                    )}
                    <span className={styles.timestamp}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <label className={styles.fileUploadBtn}>
            <input type="file" onChange={handleFileUpload} disabled={isUploading} hidden />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
          </label>
          <input
            type="text"
            placeholder={isUploading ? "Uploading file..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.textInput}
            disabled={isUploading}
          />
          <button type="submit" className={styles.sendBtn} disabled={isUploading || (!newMessage.trim())}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
