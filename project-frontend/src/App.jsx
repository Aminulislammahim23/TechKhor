import { useState } from 'react'
import './App.css'
import Navbar from './layouts/Navbar'

function App() {
  return (
    <div>

      {/* Navbar */}
      <Navbar/>

      {/* Page Content */}
      <div className="p-5">
        <h1 className="text-3xl font-bold">
          Welcome TechKhor
        </h1>
      </div>

    </div>
  )
}

export default App
