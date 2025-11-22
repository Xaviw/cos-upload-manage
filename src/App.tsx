import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './styles/global.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import UploadRecords from './pages/UploadRecords'
import UserManagement from './pages/UserManagement'
import { ThemeProvider } from '@/components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    defaultTheme='dark'
    storageKey='vite-ui-theme'
  >
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
          path='/forgot-password'
          element={<ForgotPassword />}
        />

        <Route
          path='/'
          element={<MainLayout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route
            path='records'
            element={<UploadRecords />}
          />
          <Route
            path='users'
            element={<UserManagement />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
)
