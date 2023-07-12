import { useState } from 'react';
import './App.css';
import { MermaidEditor } from './components/MermaidEditor.tsx';
import { Temp } from './components/Temp.tsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/*<Temp />*/}
      <MermaidEditor />
    </>
  );
}

export default App;
