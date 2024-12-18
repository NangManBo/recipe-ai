'use client';

import { useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import Select, { SingleValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './page.scss';

// 난이도 인터페이스
interface DifficultyOption {
  value: number;
  label: string;
}

// 요리 종류 인터페이스
interface CuisineOption {
  value: string;
  label: string;
}

// 서버에서 받아오는 레시피 데이터 인터페이스
interface Recipe {
  name: string;
  ingredients: string;
  steps: string[];
}

// 메인 페이지지
export default function Home() {
  // 순서대로
  // 재료, 난이도, 요리 스타일, 메인 레시피, 부재료 레시피, 유튜브 링크, 로딩 상태태
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

  // 서버에서 받아오는 레시피들 순서대로 나타내기 위한 코드 (이름, 재료, 조리법)
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
  // 서버에서 레시피 받기
  const getRecipe = async () => {
    // 서버에서 값 받아오는 동안 로딩 모달 창 보이게 하기
    setIsLoading(true);
    // 서버에 데이터 요청
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_OPENAI_API_KEY}/api/recommend`,
        {
          ingredients,
          difficulty_level: difficulty.value,
          cuisine_type: cuisine?.value,
        }
      );

      const { main_recipe, side_recipe, youtube_link } =
        response.data;

      // 여기서 이제 parseRecipe를 통해 레시피 정리 시키기
      setMainRecipe(parseRecipe(main_recipe));
      setSideRecipe(
        side_recipe ? parseRecipe(side_recipe) : null
      );
      setYoutubeLink(youtube_link || null);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      // 로딩 모달 창 없애기
      setIsLoading(false);
    }
  };

  // 각 Select에 값 넣을 것들
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
      {/* 재료 입력창 */}
      <input
        className="input"
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="재료를 입력하세요"
      />
      {/*난이도 조절, 요리 조절 박스*/}
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
      {/* 로딩 시 나타나는 모달창 */}
      {isLoading && <LoadingModal />}

      {/* 유튜브 링크창 */}
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
      {/* 메인 레시피 */}
      {mainRecipe && (
        <div className="recipe-info">
          <h2>추천된 메인 레시피</h2>
          <p>
            <strong>이름:</strong> {mainRecipe.name}
          </p>
          <p>
            <strong className="margin-text">재료:</strong>{' '}
            {mainRecipe.ingredients}
          </p>
          <ol>
            {mainRecipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {/* 난이도 2이상일 경우 부 레시피 */}
      {sideRecipe && (
        <div className="recipe-info">
          <h2>추천된 부 레시피</h2>
          <p>
            <strong>이름:</strong> {sideRecipe.name}
          </p>
          <p>
            <strong className="margin-text">재료:</strong>{' '}
            {sideRecipe.ingredients}
          </p>
          <ol>
            {sideRecipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {/* 서버에 요청 버튼*/}
      <button className="button" onClick={getRecipe}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
