import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import PublicLayout from './layouts/PublicLayout'
import SplashScreen from './components/public/SplashScreen'
import Home from './pages/public/Home'
import About from './pages/public/About'
import ProjectDetail from './pages/public/ProjectDetail'
import ProductDetail from './pages/public/ProductDetail'
import NotFound from './pages/public/NotFound'
import Login from './pages/auth/Login'

import AdminLayout from './layouts/AdminLayout'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import ProjectList from './pages/admin/ProjectList'
import ProjectForm from './pages/admin/ProjectForm'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import AwardList from './pages/admin/AwardList'
import AwardForm from './pages/admin/AwardForm'
import AccountList from './pages/admin/AccountList'
import AccountForm from './pages/admin/AccountForm'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="katalog" element={<Navigate to="/" replace />} />
          <Route path="project/:id" element={<ProjectDetail />} />
          <Route path="product/:slug" element={<ProductDetail />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/create" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          <Route path="projects/view/:id" element={<ProjectForm />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/view/:id" element={<ProductForm />} />
          <Route path="awards" element={<AwardList />} />
          <Route path="awards/create" element={<AwardForm />} />
          <Route path="awards/edit/:id" element={<AwardForm />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="accounts/create" element={<AccountForm />} />
          <Route path="accounts/edit/:id" element={<AccountForm />} />
        </Route>
        {/* Fallback for 404 Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SplashScreen />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App