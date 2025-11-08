import BackToDashboard from '../components/BackToDashboard'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

export default function Dashboard(){
  const { user, logout } = useAuth()

  function handleLogout(){
    Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#283E51",
    }).then(res=>{
      if(res.isConfirmed) logout()
    })
  }

  return (
    <div className="container py-4"
         style={{ minHeight: "100vh", color:"white" }}>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h3>Bienvenido, {user?.name}</h3>
        <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
      </header>
      <div className="row g-3">
        <div className="col-md-3">
          <Link to="/customers" className="btn btn-gradient w-100 py-3">👤 Clientes</Link>
        </div>
        <div className="col-md-3">
          <Link to="/vehicles" className="btn btn-gradient w-100 py-3">🚗 Vehículos</Link>
        </div>
        <div className="col-md-3">
          <Link to="/orders" className="btn btn-gradient w-100 py-3">📑 Órdenes</Link>
        </div>
        <div className="col-md-3">
          <Link to="/inventory" className="btn btn-gradient w-100 py-3">⚙️ Inventario</Link>
        </div>
        <div className="col-md-3">
          <Link to="/appointments" className="btn btn-gradient w-100 py-3">📅 Agenda</Link>
        </div>
      </div>
        <BackToDashboard />
    </div>
  )
}
