import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Champions from './pages/Champions.tsx';
import ChampionDetail from './pages/ChampionDetail.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path='/' element={<Champions/>}></Route>
            <Route path='/champions/:id' element={<ChampionDetail/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)