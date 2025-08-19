import React from 'react'
import Navabar from './Navabar'
import Canvas from './Canvas'
import { Sidebar } from 'lucide-react'
import Sidebox from './Sidebox'

const App = () => {
  return (
    <div className='h-screen relative bg-white w-full' >
      <Navabar/>
      <Canvas/>
     <Sidebox/>

    </div>
  )
}

export default App