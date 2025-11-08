import BackToDashboard from '../components/BackToDashboard'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx-js-style'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({
    plate: "",
    brand: "",
    model: "",
    year: "",
  });

  const [customers, setCustomers] = useState([]);

  async function load() {
    const res = await api(`/vehicles?q=${encodeURIComponent(q)}`)
    setVehicles(res.items)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    async function loadCustomers() {
      const res = await api(`/customers?q=${encodeURIComponent(q)}`)

      setCustomers(res.items ?? res); // depende de cómo devuelva tu API
    }

    loadCustomers();
  }, []);  

  async function create(e) {
    e.preventDefault()

    try {
      console.log(form)

      await api('/vehicles', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      Swal.fire({
        icon: 'success',
        title: 'Vehiculo agregado',
        timer: 1500,
        showConfirmButton: false
      })
      setForm({ plate: '', brand: '', model: '', year: '' })
      await load()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    }
  }

  function obtenerNombreCliente(idCliente) {
    const c = customers.find((x) => x.id === idCliente);
    return c ? c.fullName : "";
  }
  
  // función para exportar a Excel
  function exportExcel() {
    if (!vehicles || vehicles.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay datos para exportar',
        confirmButtonColor: '#ff7b9c'
      })
      return
    }

    const data = vehicles.map(v => ({
      Placa: v.plate,
      Marca: v.brand,
      Modelo: v.model,
      Año: v.year
    }))

    // crear hoja con los datos (asegura el orden de columnas)
    const headers = ['Placa', 'Marca', 'Modelo', 'Año']
    const ws = XLSX.utils.json_to_sheet(data, { header: headers })

    // definir anchos de columna (wch = characters)
    ws['!cols'] = [
      { wch: 20 }, // Placa
      { wch: 30 }, // Marca
      { wch: 20 }, // Modelo
      { wch: 15 }  // Año
    ]

    // aplicar estilo a las celdas de encabezado (negrita y color de fondo)
    const headerCells = ['A1', 'B1', 'C1', 'D1']
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
    XLSX.utils.book_append_sheet(wb, ws, 'Vehículos')

    // descarga el archivo
    XLSX.writeFile(wb, 'ReporteVehiculos.xlsx')
  }

  return (
    <div className="container py-4">
      <h2>Vehículos</h2>
      <div className="row">
        <div className="col-md-8">
          <input
            className="form-control mb-2"
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-gradient mb-3" onClick={load}>
            Buscar
          </button>
          <button className="btn btn-gradient mb-3 ms-2" onClick={exportExcel}>
            Exportar Excel
          </button>

          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.plate}</td>
                  <td>{v.brand}</td>
                  <td>{v.model}</td>
                  <td>{v.year}</td>
                  <td>{obtenerNombreCliente(v.customerId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h5>Nuevo Vehículo</h5>
          <form onSubmit={create}>
            <input
              className="form-control mb-2"
              placeholder="Placa"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Marca"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Modelo"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Año"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <select
              className="form-select mb-2"
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            >
              <option value="">Seleccione un cliente</option>

              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
            <button className="btn btn-gradient w-100">Guardar</button>
          </form>
        </div>
      </div>

      <BackToDashboard />
    </div>
  );
}
