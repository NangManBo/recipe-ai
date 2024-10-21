// src/components/LoadingModal.tsx

'use client';

import React from 'react';
import './LoadingModal.scss'; // SCSS 모듈 import

// 컴포넌트 타입 정의
const LoadingModal: React.FC = () => {
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modalContent">
        <p>로딩중입니다...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
