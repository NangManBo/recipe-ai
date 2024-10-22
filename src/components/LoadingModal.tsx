'use client';

import React, { useEffect, useState } from 'react';
import './LoadingModal.scss'; // SCSS 모듈 import

const LoadingModal: React.FC = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // 점 개수 0~3까지 증가하는 애니메이션 설정
    const interval = setInterval(() => {
      setDots((prevDots) =>
        prevDots === 3 ? 0 : prevDots + 1
      );
    }, 500); // 0.5초마다 점 개수 변경

    // 컴포넌트가 언마운트 될 때 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modalContent">
        <div className="spinner"></div> {/* 로딩 스피너 */}
        <p>로딩중입니다{'.'.repeat(dots)}</p>{' '}
        {/* 점 개수에 따른 텍스트 */}
      </div>
    </div>
  );
};

export default LoadingModal;
