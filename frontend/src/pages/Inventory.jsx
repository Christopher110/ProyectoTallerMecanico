import BackToDashboard from '../components/BackToDashboard'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2'

export default function Inventory(){
  const [parts,setParts] = useState([])
  const [alerts,setAlerts] = useState([])
  const [form,setForm] = useState({ sku:'', name:'', unitCost:0, stock:0, minStock:0 })
  const [mov,setMov] = useState({ partId:'', type:'In', quantity:0, unitCost:0, reason:'' })

  async function load(){
    try{
      const p = await api('/parts'); setParts(p)
      const a = await api('/inventory/alerts'); setAlerts(a)
    }catch(err){
      Swal.fire({icon:'error', title:'Error al cargar inventario', text: err.message})
    }
  }
  useEffect(()=>{ load() }, [])

  async function createPart(e){
    e.preventDefault()
    try{
      await api('/parts', { method:'POST', body: JSON.stringify({...form, unitCost: Number(form.unitCost), stock: Number(form.stock), minStock: Number(form.minStock)}) })
      setForm({ sku:'', name:'', unitCost:0, stock:0, minStock:0 })
      await load()
      Swal.fire({ icon:'success', title:'Repuesto creado', timer:1400, showConfirmButton:false })
    }catch(err){
      Swal.fire({ icon:'error', title:'No se pudo crear', text: err.message })
    }
  }

  async function movement(e){
    e.preventDefault()
    try{
      await api('/inventory/movement', { method:'POST', body: JSON.stringify({...mov, quantity: Number(mov.quantity), unitCost: Number(mov.unitCost)}) })
      await load()
      Swal.fire({ icon:'success', title:'Movimiento registrado', timer:1300, showConfirmButton:false })
    }catch(err){
      Swal.fire({ icon:'error', title:'No se registró', text: err.message })
    }
  }

  return (
    <div className="container py-4">
      <h2>Inventario</h2>
      <div className="row g-4">
        <div className="col-lg-7">
          <table className="table table-dark table-striped table-hover">
            <thead><tr><th>SKU</th><th>Nombre</th><th>Stock</th><th>Mín</th></tr></thead>
            <tbody>{parts.map(p=>(<tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{p.stock}</td><td>{p.minStock}</td></tr>))}
              {parts.length===0 && <tr><td colSpan="4" className="text-center">Sin repuestos</td></tr>}
            </tbody>
          </table>
          <div className="mt-3">
            <h5>Alertas de stock</h5>
            {alerts.length === 0 ? <div className="text-secondary">Sin alertas</div> :
              <ul className="list-group">{alerts.map(a=>(<li className="list-group-item d-flex justify-content-between align-items-center" key={a.id}>
                {a.name} <span className="badge bg-danger rounded-pill">{a.stock}</span>
              </li>))}</ul>}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card p-3 mb-3">
            <h5>Nuevo repuesto</h5>
            <form onSubmit={createPart}>
              <input className="form-control mb-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} />
              <input className="form-control mb-2" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <div className="row">
                <div className="col"><input className="form-control mb-2" placeholder="Costo" value={form.unitCost} onChange={e=>setForm({...form, unitCost:e.target.value})} /></div>
                <div className="col"><input className="form-control mb-2" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} /></div>
                <div className="col"><input className="form-control mb-2" placeholder="Mín" value={form.minStock} onChange={e=>setForm({...form, minStock:e.target.value})} /></div>
              </div>
              <button className="btn btn-gradient w-100">Crear</button>
            </form>
          </div>
          <div className="card p-3">
            <h5>Movimiento</h5>
            <form onSubmit={movement}>
              <select className="form-select mb-2" value={mov.partId} onChange={e=>setMov({...mov, partId:e.target.value})}>
                <option value="">Seleccione repuesto</option>
                {parts.map(p=>(<option key={p.id} value={p.id}>{p.sku} — {p.name}</option>))}
              </select>
              <div className="row">
                <div className="col">
                  <select className="form-select mb-2" value={mov.type} onChange={e=>setMov({...mov, type:e.target.value})}>
                    <option>In</option><option>Out</option><option>Return</option><option>Adjustment</option>
                  </select>
                </div>
                <div className="col"><input className="form-control mb-2" placeholder="Cantidad" value={mov.quantity} onChange={e=>setMov({...mov, quantity:e.target.value})} /></div>
                <div className="col"><input className="form-control mb-2" placeholder="Costo" value={mov.unitCost} onChange={e=>setMov({...mov, unitCost:e.target.value})} /></div>
              </div>
              <input className="form-control mb-2" placeholder="Motivo" value={mov.reason} onChange={e=>setMov({...mov, reason:e.target.value})} />
              <button className="btn btn-gradient w-100">Registrar</button>
            </form>
          </div>
        </div>
      </div>
        <BackToDashboard />
    </div>
  )
}
