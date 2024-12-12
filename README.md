# 🍳재료로 음식 레시피 추천

## 만들게 된 계기

- 요리 이름을 검색하지 않고 음식 재료로 레시피 추천받으면 재미있을거 같아서!

## 💻사용 기술

- NEXT.js 활용 (프론트엔드, 백엔드)
- GPT API key 사용 (ver 4.0)
- Netlify를 활용하여 서버 배포

## 📄서비스 설명

|                                   이미지                                   | 설명                                                                                                    |
| :------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------ |
| <img src="image.png" alt="alt text" style="width: 150px; height: auto;" /> | 1. 페이지에서 요리 재료 입력<br>2. 자신의 요리 실력에 맞게 난이도 설정<br>3. 요리 스타일 선택 (한식 등) |

- 페이지 안에서 GPT API와 연동된 서버에서 레시피와 링크 추천
- 레시피 내용 확인 가능
- 링크 클릭 시 유튜브 자동 연결

### 난이도 조절 (1 ~ 5단계)

- 난이도 1단계 : 주재료를 기반으로 한 레시피 및 링크 추천
- 난이도 2단계 이상 : 주재료를 기반으로 하고 추가로 부재료를 추천하여 만들 수 있는 레시피 추천

### 요리 스타일

- 요리 스타일 선택 : 한식, 중식, 일식, 양식, 분식으로 자신의 스타일 대로 선택 가능
