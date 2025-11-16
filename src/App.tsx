import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './global.css'
import Login from './pages/Login'
import Signup from './pages/signup'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/signup'
        element={<Signup />}
      />
      <Route
        path='/'
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
    </Routes>
  </BrowserRouter>,
)
