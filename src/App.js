import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';
import { TeamProvider } from './components/TeamContext';
import { FileProvider } from './components/FileContext';


function App() {
  return (
    <TeamProvider>
      <FileProvider>
        <div style={{ backgroundColor: '#14151a' }}>
          <div>
            <Toaster position='top-center'></Toaster>
          </div>
          <Routes>
            <Route path='/editor/:roomId/:fileName' element={<EditorPage />} />
            <Route path='/editor/:roomId' element={<EditorPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/' element={<Login />} />
          </Routes>
        </div>
      </FileProvider>
    </TeamProvider>
  );
}

export default App;
