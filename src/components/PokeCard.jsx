import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { getPokedexNumber, getFullPokedexNumber } from "../utils/index.js";
import TypeCard from "./TypeCard.jsx";
import Modal from "./Modal.jsx";

export default function PokeCard({ selectedPokemon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [skillLoading, setSkillLoading] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList =
    data &&
    Object.keys(sprites).filter((value) => {
      if (!sprites[value]) {
        return false;
      }
      if (["versions", "other"].includes(value)) {
        return false;
      }
      return true;
    });

  async function fetchMoveData(move, moveUrl) {
    if (skillLoading || !localStorage || !moveUrl) {
      return;
    }
    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }
    if (move in cache) {
      setSkill(cache[move]);
      return;
    }

    try {
      setSkillLoading(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      const description = moveData?.flavor_text_entries?.filter(
        (value) => value?.version_group?.name === "firered-leafgreen"
      )[0]?.flavor_text;
      const skillData = {
        move,
        description,
      };
      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (error) {
      console.log("Error from fetchMoveData", error.message);
    } finally {
      setSkillLoading(false);
    }
  }

  useEffect(() => {
    if (skill) document.body.classList.add("stop-scrolling");
    else document.body.classList.remove("stop-scrolling");
  }, [skill]);

  useEffect(() => {
    if (loading || !localStorage) {
      return;
    }

    let cache = {};

    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);

      return;
    }

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
        const suffix = getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;

        const res = await fetch(finalUrl);
        const pokemonData = await res.json();

        setData(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.log("error from fetchPokemonData", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonData();
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div className="loader">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#fff"
          secondaryColor="#fff"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  function handleCloseModal() {
    setSkill(null);
  }

  return (
    <div className="poke-card">
      {skill && (
          <Modal handleCloseModal={handleCloseModal}>
            <div>
              <h6>Name</h6>
              <h2 className="skill-name">{skill.move.replaceAll("-", " ")}</h2>
            </div>
            <div>
              <h6>Description</h6>
              <p>{skill.description || "no-data"}</p>
            </div>
          </Modal>
        )
      }
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => (
          <TypeCard key={typeIndex} type={typeObj?.type?.name} />
        ))}
      </div>
      <img
        className="default-img"
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt={name}
      />
      <div className="img-container">
        {imgList.map((spriteKey, spriteIndex) => {
          const spriteUrl = sprites[spriteKey];
          return (
            <img
              key={spriteIndex}
              src={spriteUrl}
              alt={`${name}-sprite-${spriteKey}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              key={moveIndex}
              className="button-card pokemon-move"
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
