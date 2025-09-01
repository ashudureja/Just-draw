import React from 'react'
import Sidebox from './Sidebox'
import Navbar from './Navabar'
import Canvas from './Canvas'

const Drawing = () => {
  return (
    <div className='h-screen w-full relative'>
        <Canvas/>
        <Sidebox/>
        <Navbar/>
    </div>
  )
}

export default Drawing