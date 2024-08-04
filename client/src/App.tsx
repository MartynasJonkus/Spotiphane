import React, { useState } from 'react';
import SongForm from './components/SongForm';
import Viewer3D from './components/Viewer3D';

const App: React.FC = () => {
  const [stlUrl, setStlUrl] = useState<string | null>(null);

  return (
    <main className='h-screen flex bg-gray-800 text-gray-300 p-10 gap-10'>
      <SongForm stlUrl={stlUrl} setStlUrl={setStlUrl} />
      <Viewer3D stlUrl={stlUrl} />
    </main>
  );
};

export default App;
