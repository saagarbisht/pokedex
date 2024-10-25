import React from 'react'

export default function Header({toggleHandler}) {
  return (
    <header>
      <button className='open-nav-button' onClick={toggleHandler}>
      <i className='fa-solid fa-bars'></i>
      </button>
      <h1 className='text-gradient'> Pokedex</h1>
    </header>
  )
}
