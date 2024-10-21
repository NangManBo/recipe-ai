'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [recipe, setRecipe] = useState('');

  const getRecipe = async () => {
    try {
      const response = await axios.post('/api/recommend', {
        ingredients,
        difficulty_level: difficulty,
      });
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  return (
    <div>
      <h1>AI 요리 추천</h1>
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="재료를 입력하세요"
      />
      <select
        value={difficulty}
        onChange={(e) =>
          setDifficulty(Number(e.target.value))
        }
      >
        <option value={1}>난이도 1</option>
        <option value={2}>난이도 2</option>
        <option value={3}>난이도 3</option>
        <option value={4}>난이도 4</option>
        <option value={5}>난이도 5</option>
      </select>
      <button onClick={getRecipe}>레시피 가져오기</button>

      {recipe && (
        <div>
          <h2>추천된 레시피:</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
}
