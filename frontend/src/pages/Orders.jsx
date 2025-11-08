import BackToDashboard from '../components/BackToDashboard'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx-js-style'

export default function Orders(){
  const [orders,setOrders] = useState([])
  const [plate,setPlate] = useState('')
  const [vehicle,setVehicle] = useState(null)
  const [odometer,setOdometer] = useState('')
  const [notes,setNotes] = useState('')

  async function load(){ 
    try{
      const res = await api('/serviceorders')
      setOrders(res.items || [])
    }catch(err){
      Swal.fire({icon:'error',title:'Error cargando órdenes', text: err.message})
    }
  }
  useEffect(()=>{ load() }, [])

  async function findVehicle(){
    if(!plate) return Swal.fire({icon:'warning', title:'Ingresa una placa'})
    try{
      const v = await api(`/vehicles/search?plate=${encodeURIComponent(plate)}`)
      setVehicle(v)
      Swal.fire({icon:'success', title:'Vehículo encontrado', timer:1200, showConfirmButton:false})
    }catch(err){
      setVehicle(null)
      Swal.fire({icon:'error', title:'No encontrado', text:'Verifica la placa'})
    }
  }

  async function createOrder(e){
    e.preventDefault()
    if(!vehicle) return Swal.fire({icon:'warning', title:'Primero busca un vehículo'})
    try{
      await api('/serviceorders', { 
        method:'POST', 
        body: JSON.stringify({ vehicleId: vehicle.id, odometer: odometer? Number(odometer): null, receptionNotes: notes })
      })
      setVehicle(null); setOdometer(''); setNotes(''); setPlate('')
      await load()
      Swal.fire({icon:'success', title:'Orden creada', timer:1500, showConfirmButton:false})
    }catch(err){
      Swal.fire({icon:'error', title:'No se pudo crear', text: err.message })
    }
  }  
  
  // función para exportar a Excel
  function exportExcel() {
    if (!orders || orders.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay datos para exportar',
        confirmButtonColor: '#ff7b9c'
      })
      return
    }

     const data = orders.map(o => ({
      ID: o.id,
      Placa: o.vehicle?.plate,
      Cliente: o.vehicle?.customer?.fullName,
      Estado: o.state,
      Fecha: new Date(o.createdAt).toLocaleString()
    }))

     // crear hoja con los datos (asegura el orden de columnas)
    const headers = ['ID', 'Placa', 'Cliente', 'Estado', 'Fecha']
    const ws = XLSX.utils.json_to_sheet(data, { header: headers })

     // definir anchos de columna (wch = characters)
    ws['!cols'] = [
      { wch: 30 }, // ID
      { wch: 10 }, // Placa
      { wch: 35 }, // Cliente
      { wch: 15 }, // Estado
      { wch: 15 }  // Fecha
    ]

     // aplicar estilo a las celdas de encabezado (negrita y color de fondo)
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1']
    headerCells.forEach(cell => {
      if (!ws[cell]) return
      ws[cell].s = {
        font: { bold: true, color: { rgb: 'FFFFFFFF' } },
        fill: { fgColor: { rgb: 'FF1976D2' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: "thin", color: { rgb: "FF000000" } },
          bottom: { style: "thin", color: { rgb: "FF000000" } },
          left: { style: "thin", color: { rgb: "FF000000" } },
          right: { style: "thin", color: { rgb: "FF000000" } },
        }
      }
    })   

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ordenes')

     // descarga el archivo
    XLSX.writeFile(wb, 'ReporteOrdenes.xlsx')
  }

  return (
    <div className="container py-4">
      <h2>Órdenes de Servicio</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <button className="btn btn-gradient mb-3" onClick={exportExcel}>Exportar Excel</button>

          <table className="table table-dark table-striped table-hover">
            <thead><tr><th>ID</th><th>Placa</th><th>Cliente</th><th>Estado</th><th>Fecha</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id}>
                  <td>{o.id?.slice(0,8)}</td>
                  <td>{o.vehicle?.plate}</td>
                  <td>{o.vehicle?.customer?.fullName}</td>
                  <td>{o.state}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length===0 && <tr><td colSpan="5" className="text-center">Sin registros</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="col-lg-4">
          <div className="card p-3">
            <h5>Nueva Orden</h5>
            <div className="input-group mb-2">
              <input className="form-control" placeholder="Placa" value={plate} onChange={e=>setPlate(e.target.value)} />
              <button className="btn btn-gradient" onClick={findVehicle}>Buscar</button>
            </div>
            {vehicle && (
              <div className="alert alert-secondary">
                <div><strong>{vehicle.plate}</strong> — {vehicle.brand} {vehicle.model} ({vehicle.year})</div>
                <div>Cliente: {vehicle.customer?.fullName}</div>
              </div>
            )}
            <form onSubmit={createOrder}>
              <input className="form-control mb-2" placeholder="Odómetro" value={odometer} onChange={e=>setOdometer(e.target.value)} />
              <textarea className="form-control mb-2" placeholder="Notas de recepción" value={notes} onChange={e=>setNotes(e.target.value)} />
              <button className="btn btn-gradient w-100">Crear Orden</button>
            </form>
          </div>
        </div>
      </div>
        <BackToDashboard />
    </div>
  )
}
