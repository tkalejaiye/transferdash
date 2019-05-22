import React from 'react'
import { Route } from 'react-router-dom'
import './App.css'

// Components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AddRecipientForm from './components/AddRecipientForm'
import TransferForm from './components/TransferForm'
import Home from './components/Home'

const routes = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home
  },
  {
    name: 'New Transfer Recipient',
    path: '/new-recipient',
    component: AddRecipientForm
  },
  {
    name: 'New Transfer',
    path: '/new-transfer',
    component: TransferForm
  }
]

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />

      <div className="main">
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
      </div>
    </div>
  )
}

export default App
