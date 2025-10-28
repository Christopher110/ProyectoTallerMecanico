import BackToDashboard from '../components/BackToDashboard'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2'

export default function Customers() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '' })

  async function load() {
    const res = await api(`/customers?q=${encodeURIComponent(q)}`)
    setItems(res.items)
  }

  useEffect(() => { load() }, [])

  async function create(e) {
    e.preventDefault()

    // 💌 Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo válido (ejemplo@dominio.com)',
        confirmButtonColor: '#ff7b9c'
      })
      return
    }

    try {
      await api('/customers', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      Swal.fire({
        icon: 'success',
        title: 'Cliente agregado',
        timer: 1500,
        showConfirmButton: false
      })
      setForm({ fullName: '', phone: '', email: '', address: '' })
      await load()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    }
  }

  return (
    <div className="container py-4">
      <h2>Clientes</h2>
      <div className="row">
        <div className="col-md-8">
          <input
            className="form-control mb-2"
            placeholder="Buscar..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="btn btn-gradient mb-3" onClick={load}>Buscar</button>

          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr><th>Nombre</th><th>Teléfono</th><th>Email</th></tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td>{c.fullName}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h5>Nuevo Cliente</h5>
          <form onSubmit={create}>
            <input
              className="form-control mb-2"
              placeholder="Nombre completo"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Teléfono"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Dirección"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
            <button className="btn btn-gradient w-100">Guardar</button>
          </form>
        </div>
      </div>

      <BackToDashboard />
    </div>
  )
}
