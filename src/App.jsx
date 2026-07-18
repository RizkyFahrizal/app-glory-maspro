import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import Home from './pages/public/Home'
import ProductDetail from './pages/public/ProductDetail'

// Nanti kita uncomment kalau filenya sudah dibuat:
// import Login from './pages/auth/Login'
// import AdminLayout from './layouts/AdminLayout'
// import DashboardAdmin from './pages/admin/DashboardAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:slug" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App