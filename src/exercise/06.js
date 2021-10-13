// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
import React from 'react'
import {useState, useEffect} from 'react'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  const {error, pokemon, status} = state

  useEffect(() => {
    if (!pokemonName) {
      setState({status: 'idle'})
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => setState({pokemon: pokemonData, status: 'resolved'}))
      .catch(err => setState({error: err, status: 'rejected'}))
  }, [pokemonName])

  function pokemonRender() {
    if (status === 'rejected')
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    if (status === 'idle') {
      return <h2>Submit a pokemon</h2>
    }
    if (status === 'pending') {
      return <PokemonInfoFallback name={pokemonName} />
    }

    if (status === 'resolved') {
      return <PokemonDataView pokemon={pokemon} />
    }
  }
  return <div>{pokemonRender()}</div>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
