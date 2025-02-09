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
      <div
  className="card-body text-center"
  style={{
    backgroundImage: "url('/images/bgimg.png')", // Use absolute path from public/
    backgroundSize: "fit",
    backgroundPosition: "center",
    height: "100vh",
  }}>
         <div>
            <Toaster position='top-center'></Toaster>
          </div>
          <Routes>
            <Route path='/editor/:roomId/:fileName' element={<EditorPage />} />
            <Route path='/editor/:roomId' element={<EditorPage />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
      </FileProvider>
    </TeamProvider>
  );
}

export default App;
