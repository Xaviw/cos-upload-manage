import { createRoot } from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import "./styles/global.css"

import { SessionProvider } from "@/contexts/session-provider"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme/theme-provider"

import MainLayout from "./layouts/main-layout"
import Home from "./pages/home"
import Login from "./pages/login"
import Records from "./pages/records"
import Users from "./pages/users"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="records" element={<Records />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>

    <Toaster position="top-center" />
  </ThemeProvider>
)
