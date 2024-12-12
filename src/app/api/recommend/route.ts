import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { ingredients, difficulty_level, cuisine_type } =
      await req.json();

    // 재료 리스트 확인
    let ingredientsList: string;
    if (Array.isArray(ingredients)) {
      ingredientsList = ingredients.join(', ');
    } else if (typeof ingredients === 'string') {
      ingredientsList = ingredients;
    } else {
      throw new Error('Invalid ingredients format');
    }

    // 메인 레시피 프롬프트 생성
    const prompt_main = `
      다음 주재료를 사용한 난이도 ${difficulty_level}의 ${
      cuisine_type || '요리'
    } 레시피를 추천해 주세요.
      주재료는 ${ingredientsList}입니다.
      반드시 아래 형식으로 결과를 제공해 주세요:

      레시피 이름: (요리 이름)
      재료: (필요한 재료 목록)
      조리법: (조리 방법)
    `;

    // 메인 레시피 요청
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
        max_tokens: 700,
        temperature: 0.7,
      });

    const main_recipe =
      response_main.choices[0]?.message?.content?.trim() ||
      '메인 레시피를 찾을 수 없습니다.';

    let side_recipe = null;

    // 난이도가 1 초과일 경우 부재료 레시피 요청
    if (difficulty_level > 1) {
      const prompt_side = `
        난이도 ${difficulty_level}에 맞는 부재료를 추가하여 ${
        cuisine_type || '요리'
      }에 어울리는 레시피를 제공해 주세요.
        반드시 아래 형식으로 결과를 제공해 주세요:

        레시피 이름: (요리 이름)
        재료: (필요한 재료 목록)
        조리법: (조리 방법)
      `;

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
          max_tokens: 700,
          temperature: 0.7,
        });

      side_recipe =
        response_side.choices[0]?.message?.content?.trim() ||
        '부재료 레시피를 찾을 수 없습니다.';
    }

    // YouTube 검색 URL 생성
    const youtube_link = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      main_recipe.split('\n')[0]?.trim() || '요리'
    )}`;

    // 응답 반환
    return NextResponse.json({
      main_recipe,
      side_recipe,
      youtube_link,
    });
  } catch (error) {
    console.error(
      'Error fetching recipe or link from GPT API:',
      error
    );
    return NextResponse.json(
      {
        error:
          'Failed to fetch recipe or link from GPT API',
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: 'Method Not Allowed' },
    { status: 405 }
  );
}
