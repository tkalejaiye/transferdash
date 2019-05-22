import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <h1>Fake Cakes</h1>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link className="sidebar-links__link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="sidebar-links__link" to="/new-recipient">
            Add Transfer Recipient
          </Link>
        </li>
        <li>
          <Link className="sidebar-links__link" to="/new-transfer">
            Make a Transfer
          </Link>
        </li>
      </ul>
    </div>
  )
}
