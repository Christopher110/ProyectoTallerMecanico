import BackToDashboard from '../components/BackToDashboard'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/client'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function Login(){
  const [email,setEmail] = useState('admin@example.com')
  const [password,setPassword] = useState('Admin123*')
  const nav = useNavigate()
  const { login:doLogin } = useAuth()

  async function onSubmit(e){
    e.preventDefault()
    try{
      //const data = await login(email, password)
      const data = { name: "Admin User", email: email } // Mocked response
      doLogin(data)
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${data.name}, acceso exitoso 🚗`,
        timer: 1500,
        showConfirmButton: false
      })
      nav('/')
    }catch(err){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Credenciales inválidas, intenta de nuevo',
      })
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"
         style={{ background: "linear-gradient(135deg, #283E51, #485563)" }}>
      <div className="card shadow-lg p-4" style={{ borderRadius: "1rem", minWidth: "350px" }}>
        <h3 className="text-center mb-3">Taller Mecánico</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control"
                   value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control"
                   value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btn-gradient w-100">Entrar</button>
        </form>
      </div>
        <BackToDashboard />
    </div>
  )
}
