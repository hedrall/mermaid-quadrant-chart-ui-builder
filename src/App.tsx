import { useState } from 'react';
import './App.css';
import { MermaidEditor } from './components/MermaidEditor.tsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MermaidEditor />
    </>
  );
}

export default App;
