import { Link } from 'react-router-dom'

export default function BackToDashboard({ label = "Volver al Panel" }){
  return (
    <Link to="/" className="btn btn-gradient position-fixed top-0 end-0 m-3 z-3">
      ⬅️ {label}
    </Link>
  )
}
