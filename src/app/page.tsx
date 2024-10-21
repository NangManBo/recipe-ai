'use client';

import { useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal'; // 로딩 모달 컴포넌트
import './page.scss'; // SCSS 모듈 import

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [mainRecipe, setMainRecipe] = useState('');
  const [sideRecipe, setSideRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const getRecipe = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await axios.post('/api/recommend', {
        ingredients,
        difficulty_level: difficulty,
      });

      const { main_recipe, side_recipe } = response.data; // 서버로부터 받은 데이터
      setMainRecipe(main_recipe); // 메인 레시피 설정
      setSideRecipe(side_recipe || '부재료 없음'); // 부재료 레시피가 없는 경우 대체 텍스트
      console.log('Recipe:', response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="main-page">
      <p className="title">AI 요리 추천</p>
      <input
        className="input"
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="재료를 입력하세요"
      />
      <div className="select-button-box">
        <select
          className="select"
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
        <button className="button" onClick={getRecipe}>
          레시피 가져오기
        </button>
      </div>
      {isLoading && <LoadingModal />}{' '}
      {/* 로딩 중일 때 모달 표시 */}
      {/* 메인 레시피와 부재료 레시피 출력 */}
      {mainRecipe && (
        <div>
          <h2>추천된 메인 레시피:</h2>
          <p>{mainRecipe}</p>
        </div>
      )}
      {sideRecipe && (
        <div>
          <h2>추천된 부재료 레시피:</h2>
          <p>{sideRecipe}</p>
        </div>
      )}
    </div>
  );
}
