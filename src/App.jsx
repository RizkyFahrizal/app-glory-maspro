import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import PublicLayout from './layouts/PublicLayout'
import SplashScreen from './components/public/SplashScreen'
import Home from './pages/public/Home'
import ProductDetail from './pages/public/ProductDetail'
import Login from './pages/auth/Login'

import AdminLayout from './layouts/AdminLayout'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import AccountList from './pages/admin/AccountList'
import AccountForm from './pages/admin/AccountForm'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:slug" element={<ProductDetail />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/view/:id" element={<ProductForm />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="accounts/create" element={<AccountForm />} />
          <Route path="accounts/edit/:id" element={<AccountForm />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App