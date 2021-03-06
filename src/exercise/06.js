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
import {ErrorBoundary} from 'react-error-boundary'

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
    if (status === 'rejected') throw error
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

function ErrorFallBack({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
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
      <ErrorBoundary
        FallbackComponent={ErrorFallBack}
        onReset={() => setPokemonName('')}
        resetKeys={[pokemonName]}
      >
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
