'use client';

import { useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import Select, { SingleValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './page.scss';

interface DifficultyOption {
  value: number;
  label: string;
}

interface CuisineOption {
  value: string;
  label: string;
}

interface Recipe {
  name: string;
  ingredients: string;
  steps: string[];
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] =
    useState<DifficultyOption>({
      value: 1,
      label: '난이도 1',
    });
  const [cuisine, setCuisine] =
    useState<CuisineOption | null>(null);
  const [mainRecipe, setMainRecipe] =
    useState<Recipe | null>(null);
  const [sideRecipe, setSideRecipe] =
    useState<Recipe | null>(null);
  const [youtubeLink, setYoutubeLink] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseRecipe = (recipe: string): Recipe | null => {
    const nameMatch = recipe.match(/레시피 이름:\s*(.+)/);
    const ingredientsMatch = recipe.match(/재료:\s*(.+)/);
    const stepsMatch = recipe.match(/조리법:\s*([\s\S]+)/);

    if (nameMatch && ingredientsMatch && stepsMatch) {
      const steps = stepsMatch[1]
        .split(/\n/)
        .map((step) => step.replace(/^\d+\.\s*/, '').trim())
        .filter((step) => step !== '');
      return {
        name: nameMatch[1].trim(),
        ingredients: ingredientsMatch[1].trim(),
        steps: steps,
      };
    }
    return null;
  };

  const getRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/recommend', {
        ingredients,
        difficulty_level: difficulty.value,
        cuisine_type: cuisine?.value,
      });

      const { main_recipe, side_recipe, youtube_link } =
        response.data;

      setMainRecipe(parseRecipe(main_recipe));
      setSideRecipe(
        side_recipe ? parseRecipe(side_recipe) : null
      );
      setYoutubeLink(youtube_link || null);

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

  const cuisineOptions: CuisineOption[] = [
    { value: '한식', label: '한식' },
    { value: '중식', label: '중식' },
    { value: '양식', label: '양식' },
    { value: '일식', label: '일식' },
    { value: '분식', label: '분식' },
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
        <Select
          className="select"
          placeholder="요리 스타일"
          value={cuisine}
          onChange={(option: SingleValue<CuisineOption>) =>
            setCuisine(option as CuisineOption)
          }
          options={cuisineOptions}
        />
      </div>

      <div className="line"></div>
      {isLoading && <LoadingModal />}

      {youtubeLink && (
        <div className="youtube-link">
          <h2>추천된 YouTube 동영상</h2>
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube에서 보기
          </a>
        </div>
      )}

      {mainRecipe && (
        <div className="recipe-info">
          <h2>추천된 메인 레시피</h2>
          <p>
            <strong>이름:</strong> {mainRecipe.name}
          </p>
          <p>
            <strong>재료:</strong> {mainRecipe.ingredients}
          </p>
          <ol>
            {mainRecipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {sideRecipe && (
        <div className="recipe-info">
          <h2>추천된 부 레시피</h2>
          <p>
            <strong>이름:</strong> {sideRecipe.name}
          </p>
          <p>
            <strong>재료:</strong> {sideRecipe.ingredients}
          </p>
          <ol>
            {sideRecipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <button className="button" onClick={getRecipe}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
