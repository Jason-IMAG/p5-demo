import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Firework from './pages/firework';
import Scratch from './pages/scratch';
import Rainny from './pages/rainny';
import Snow from './pages/snow';
import ImageP5 from './pages/imageP5';
import ImageCanvas from './pages/imageCanvas';
import reportWebVitals from './reportWebVitals';
import Pinball from './pages/pinball';
import GamePage from './pages/GamePage';
import Spline from './pages/spline';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
     <div>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/firework' element={<Firework/>}/>
        <Route path='/scratch' element={<Scratch />}/>
        <Route path='/rainny' element={<Rainny />}/>
        <Route path='/snow' element={<Snow />}/>
        <Route path='/imageP5' element={<ImageP5/>}/>
        <Route path='/imageCanvas' element={<ImageCanvas/>}/>
        <Route path='/pinball' element={<Pinball/>}/>
        <Route path='/gamePage' element={<GamePage/>}/>
      </Routes>
     </div>
    </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
