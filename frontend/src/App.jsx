import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Appointments from './pages/Appointments'
import { Protected } from './components/Protected'

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Protected><Dashboard/></Protected>} />
      <Route path="/customers" element={<Protected><Customers/></Protected>} />
      <Route path="/orders" element={<Protected><Orders/></Protected>} />
      <Route path="/inventory" element={<Protected><Inventory/></Protected>} />
      <Route path="/appointments" element={<Protected><Appointments/></Protected>} />
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  )
}
