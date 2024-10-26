'use client';

import { useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import Select, { SingleValue } from 'react-select'; // react-select와 SingleValue 타입 추가
import './page.scss';

interface DifficultyOption {
  value: number;
  label: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] =
    useState<DifficultyOption>({
      value: 1,
      label: '난이도 1',
    });
  const [mainRecipe, setMainRecipe] = useState<string[]>(
    []
  );
  const [sideRecipe, setSideRecipe] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const splitRecipeSteps = (recipe: string) => {
    return recipe.split(/\d+\.\s/).filter((step) => step);
  };

  const getRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/recommend', {
        ingredients,
        difficulty_level: difficulty.value,
      });

      const { main_recipe, side_recipe } = response.data;
      setMainRecipe(splitRecipeSteps(main_recipe));
      setSideRecipe(splitRecipeSteps(side_recipe || ''));

      console.log('Recipe:', response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyOptions: DifficultyOption[] = [
    { value: 1, label: '난이도 1' },
    { value: 2, label: '난이도 2' },
    { value: 3, label: '난이도 3' },
    { value: 4, label: '난이도 4' },
    { value: 5, label: '난이도 5' },
  ];

  return (
    <div className="main-page">
      <p className="title">AI 레시피 추천</p>
      <input
        className="input"
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="재료를 입력하세요"
      />
      <div className="select-button-box">
        <Select
          className="select"
          value={difficulty}
          onChange={(
            option: SingleValue<DifficultyOption>
          ) => setDifficulty(option as DifficultyOption)}
          options={difficultyOptions}
        />
        <button className="button" onClick={getRecipe}>
          레시피 가져오기
        </button>
      </div>

      <div className="line"></div>
      {isLoading && <LoadingModal />}

      {mainRecipe.length > 0 && (
        <div className="recipe-info">
          <h2>추천된 메인 레시피</h2>
          <ol>
            {mainRecipe.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {sideRecipe.length > 0 && (
        <div className="recipe-info">
          <h2>추천된 부재료 레시피</h2>
          <ol>
            {sideRecipe.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
