import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // 'OpenAIApi' 대신 'OpenAI' 사용

// OpenAI 인스턴스 생성
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 환경 변수에서 API 키를 가져옴
});

// POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const { ingredients, difficulty_level } =
      await req.json();

    // GPT API에 보낼 프롬프트 작성
    const prompt_main =
      difficulty_level === 1
        ? `다음 주재료만 사용한 난이도 1의 요리 레시피를 추천해 주세요: ${ingredients}`
        : `난이도 ${difficulty_level}에 맞는 요리 레시피를 추천해 주세요. 주재료는 ${ingredients}입니다.`;

    // 난이도에 따른 부재료 프롬프트 작성
    const prompt_side = `난이도 ${difficulty_level}에 맞는 부재료를 추가하여 레시피를 알려주세요. 주재료는 ${ingredients}입니다.`;

    // GPT API 호출 (메인 레시피)
    const response_main =
      await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          { role: 'user', content: prompt_main },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

    const main_recipe =
      response_main.choices[0]?.message?.content?.trim() ||
      '레시피를 찾을 수 없습니다.';

    // 난이도가 2 이상인 경우 부재료 레시피 호출
    if (difficulty_level > 1) {
      const response_side =
        await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            { role: 'user', content: prompt_side },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

      const side_recipe =
        response_side.choices[0]?.message?.content?.trim() ||
        '부재료를 찾을 수 없습니다.';

      return NextResponse.json({
        main_recipe,
        side_recipe,
      });
    }

    // 난이도 1의 경우 부재료가 없으므로 부재료는 null로 응답
    return NextResponse.json({
      main_recipe,
      side_recipe: null,
    });
  } catch (error) {
    console.error(
      'Error fetching recipe from GPT API:',
      error
    );
    return NextResponse.json(
      { error: 'Failed to fetch recipe from GPT API' },
      { status: 500 }
    );
  }
}

// GET 요청을 허용하지 않음
export function GET() {
  return NextResponse.json(
    { message: 'Method Not Allowed' },
    { status: 405 }
  );
}
