import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import React, { useEffect, useState } from 'react';

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
}

const PokeCard: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
      const data: Pokemon = await response.json();
      setPokemon(data);
    };
    fetchPokemon();
  }, []);

const client = generateClient<Schema>();

function App() {

  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  
  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map(todo => <li
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          {todo.content}
        </li>)}
      </ul>
      <div>
      {pokemon && (
        <>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </>
      )}
      </div>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/">Review next step of this tutorial.</a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}



export default App;
