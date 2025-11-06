import React from "react"
import { Link, Outlet } from "react-router-dom"

export default function App() {
  return (
    <div className="container">
      <h1>Petty Cash</h1>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/">New Envelope</Link>
      </nav>
      <Outlet />
    </div>
  )
}
