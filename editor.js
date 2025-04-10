import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER = 'http://localhost:3001';

const Editor = ({ docId }) => {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const s = io(SOCKET_SERVER);
    setSocket(s);

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('get-document', docId);

    socket.on('load-document', data => {
      setContent(data);
    });

    return () => {
      socket.off('load-document');
    };
  }, [socket, docId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-changes', delta => {
      setContent(delta);
    });

    return () => {
      socket.off('receive-changes');
    };
  }, [socket]);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    socket.emit('send-changes', val);
    socket.emit('save-document', val);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      style={{ width: '100%', height: '90vh' }}
    />
  );
};

export default Editor;
