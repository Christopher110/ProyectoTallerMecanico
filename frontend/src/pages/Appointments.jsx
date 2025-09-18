import BackToDashboard from '../components/BackToDashboard'
import Swal from 'sweetalert2'

export default function Appointments(){
  function soon(){
    Swal.fire({icon:'info', title:'Próximamente', text:'Vista de calendario con drag & drop y asignación por mecánico'})
  }
  return (
    <div className="container py-4">
      <h2>Agenda</h2>
      <div className="card p-4">
        <p className="mb-2">Aquí irá el calendario semanal con creación de citas, confirmaciones y asignaciones por técnico.</p>
        <button className="btn btn-gradient" onClick={soon}>Ver demo</button>
      </div>
        <BackToDashboard />
    </div>
  )
}
