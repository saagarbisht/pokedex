import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PokeCard from "./components/PokeCard";

export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideMenu, setSideMenu] = useState(false);
  function toggleHandler() {
    setSideMenu(!showSideMenu);
  }
  function handleCloseMenu(){
    setSideMenu(false)
  }
  return (
    <>
      <Header toggleHandler={toggleHandler} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        showSideMenu={showSideMenu}
        handleCloseMenu={handleCloseMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}
