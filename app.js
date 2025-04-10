import React from 'react';
import Editor from './Editor';

function App() {
  const docId = 'default-doc'; // This could come from routing or user input
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Collaborative Document Editor</h1>
      <Editor docId={docId} />
    </div>
  );
}

export default App;
