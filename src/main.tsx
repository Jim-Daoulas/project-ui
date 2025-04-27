import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import Register from './pages/Register.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
