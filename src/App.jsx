import { BrowserRouter, Routes, Route } from 'react-router-dom'

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

function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:slug" element={<ProductDetail />} />
        </Route>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="accounts/create" element={<AccountForm />} />
          <Route path="accounts/edit/:id" element={<AccountForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App