import React from 'react'
import Navabar from './Navabar'
import Canvas from './Canvas'
import { Sidebar } from 'lucide-react'
import Sidebox from './Sidebox'
import Hero from './Hero'
import { Routes,Route } from 'react-router-dom'
import Drawing from './Drawing'

const App = () => {
  return (
    <div className='h-screen relative bg-white w-full' >
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/justdraw" element={<Drawing/>}/>

       
      </Routes>
     

    </div>
  )
}

export default App