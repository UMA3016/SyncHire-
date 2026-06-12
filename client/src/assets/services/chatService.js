import api from './api';

export const getChatRoom = async (applicationId) => {
  const response = await api.get(`/chat/${applicationId}`);
  return response.data;
};

export const uploadChatFile = async (file) => {
  const formData = new FormData();
  formData.append('chatFile', file);
  
  const response = await api.post('/chat/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
