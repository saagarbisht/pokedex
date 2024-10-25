import React, { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils/index.js";

export default function SideNav({ selectedPokemon, setSelectedPokemon, showSideMenu, handleCloseMenu }) {
  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((value, valueIndex) => {
    if (getFullPokedexNumber(valueIndex).includes(searchValue)) {
      return true;
    }
    if (value.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <nav className={"" + (showSideMenu ? " open" : " ")}>
      <div className={`header` + (showSideMenu ? " open" : " ")}>
      <button className='open-nav-button' onClick={handleCloseMenu}>
      <i className='fa-solid fa-arrow-left-long'></i>
      </button>
        <h1 className="text-gradient">Pokedex</h1>
      </div>
      <input
      placeholder="E.g. 001 or Bulba..."
        type="text"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <div className="scroll">
        {filteredPokemon.map((pokemon, pokemonIndex) => {
          const truePokemonIndex = first151Pokemon.indexOf(pokemon);
          return (
            <button
              key={pokemonIndex}
              className={
                "nav-card " +
                (pokemonIndex === selectedPokemon ? " nav-card-selected" : " ")
              }
              onClick={() => {
                setSelectedPokemon(truePokemonIndex);
                handleCloseMenu()
              }}
            >
              <p>{getFullPokedexNumber(truePokemonIndex)}</p>
              <p>{pokemon}</p>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
