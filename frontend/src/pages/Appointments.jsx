import BackToDashboard from '../components/BackToDashboard';
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx-js-style'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    plates: '',
    servicesForVehicle: [],
    appointmentDate: '',
    paymentMethod: '',
  });

  async function load() {
    const res = await api(`/appointments?q=${encodeURIComponent(q)}`)
    setAppointments(res.items)
  }
  
  useEffect(() => { load() }, [])

  async function create(e) {
    e.preventDefault()

    try {
      await api('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          servicesForVehicle: form.servicesForVehicle.join(', ')
        })
      })
      Swal.fire({
        icon: 'success',
        title: 'Cita agregada',
        timer: 1500,
        showConfirmButton: false
      })
      setForm({ customerName: '', customerPhone: '', plates: '', servicesForVehicle: [], appointmentDate: '', paymentMethod: '' })
      await load()
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    }
  }  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'servicio') {
      const selected = Array.form(e.target.selectedOptions, (option) => option.value);
      setForm({ ...form, servicio: selected});
    }else{
      setForm({ ...form, [name]: value});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Cita registrada',
      text: `Cliente: ${form.nombre}\nServicio: ${form.servicio.join(', ')}\nFecha: ${form.fecha}`,
      confirmButtonColor: '#3085d6',
    });
    setForm({
      nombre: '',
      telefono: '',
      placas: '',
      servicio: [], //lo hice arreglo xddd para la multiple jiji
      fecha: '',
    });
  };

  // función para exportar a Excel
  function exportExcel() {
    if (!appointments || appointments.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay datos para exportar',
        confirmButtonColor: '#ff7b9c'
      })
      return
    }

    const data = appointments.map(a => ({
      Nombre: a.customerName,
      Teléfono: a.customerPhone,
      Placas: a.plates,
      Servicios: a.servicesForVehicle,
      Fecha: new Date(a.appointmentDate).toLocaleDateString(),
      MetodoPago: a.paymentMethod
    }))

    // crear hoja con los datos (asegura el orden de columnas)
    const headers = ['Nombre', 'Teléfono', 'Placas', 'Servicios', 'Fecha', 'MetodoPago']
    const ws = XLSX.utils.json_to_sheet(data, { header: headers })

    // definir anchos de columna (wch = characters)
    ws['!cols'] = [
      { wch: 40 }, // Nombre
      { wch: 10 }, // Telefono
      { wch: 15 }, // Placas
      { wch: 150 }, // Servicios
      { wch: 10 }, // Fecha
      { wch: 15 }, // MetodoPago
    ]

    // aplicar estilo a las celdas de encabezado (negrita y color de fondo)
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1']
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
    XLSX.utils.book_append_sheet(wb, ws, 'Citas')

    // descarga el archivo
    XLSX.writeFile(wb, 'ReporteCitas.xlsx')
  }  

  return (
    <div className="container py-4">
      <h2>Agenda</h2>
      <div className="row">
        <div className="col-md-8">
          <p className="mb-3">Agenda tu cita con nosotros</p>
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
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Placas</th>
                <th>Servicios</th>
                <th>Fecha</th>
                <th>Método Pago</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.customerName}</td>
                  <td>{a.customerPhone}</td>
                  <td>{a.plates}</td>
                  <td>{a.servicesForVehicle}</td>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <h5>Agendar cita</h5>
          <form onSubmit={create}>
            <label>Nombre del Cliente:</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ej. Paola Suarez"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              required
            />

            <label>Teléfono</label>
            <input
              type="tel"
              className="form-control mb-2"
              placeholder="Ej. 5566778899"
              value={form.customerPhone}
              onChange={(e) =>
                setForm({ ...form, customerPhone: e.target.value })
              }
              required
            />

            <label>Placas del carro:</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ej. ABC-1234"
              value={form.plates}
              onChange={(e) => setForm({ ...form, plates: e.target.value })}
            />

            <label>Servicio deseado:</label>
            <select
              multiple
              value={form.servicesForVehicle}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                setForm({ ...form, servicesForVehicle: selected });
              }}
              className="form-control"
              required
            >
              <option value="">Selecciona un servicio</option>
              <option value="Cambio de aceite">Cambio de aceite</option>
              <option value="Revisión general">Revisión general</option>
              <option value="Frenos">Frenos</option>
              <option value="Suspensión">Suspensión</option>
              <option value="Cambio de pintura">Cambio de pintura</option>
              <option value="Llantas">Llantas</option>
              <option value="Revision de motor">Revisión de motor</option>
              <option value="Cambio de candela">Cambio de candela</option>
              <option value="Limpieza de inyectores">
                Limpieza de inyectores
              </option>
            </select>

            {form.servicesForVehicle.length > 0 && (
              <div
                className="selected-services"
                style={{
                  background: "#414345",
                  borderRadius: "8px",
                  padding: "10px 15px",
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                }}
              >
                <strong>Servicios seleccionados:</strong>
                <ul style={{ marginTop: "8px" }}>
                  {form.servicesForVehicle.map((serv, i) => (
                    <li key={i}>✅ {serv}</li>
                  ))}
                </ul>
              </div>
            )}

            <label>Fecha de la cita:</label>
            <input
              type="date"
              className="form-control mb-2"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm({ ...form, appointmentDate: e.target.value })
              }
              required
            />

            <label>Método de pago:</label>
            <select
              value={form.paymentMethod}
              onChange={(e) =>setForm({ ...form, paymentMethod: e.target.value })}
              className="form-control"
              required
            >
              <option value="">Selecciona un metodo de pago</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Pago en taller</option>
              <option value="Paypal">Paypal</option>
              <option value="VisaCuotas">VisaCuotas</option>
            </select>

            <button className="btn btn-gradient w-100">Guardar</button>
          </form>
        </div>
      </div>

      <BackToDashboard />
    </div>
  );
}
