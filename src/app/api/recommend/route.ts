import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { ingredients, difficulty_level, cuisine_type } =
      await req.json();

    let ingredientsList: string;
    if (Array.isArray(ingredients)) {
      ingredientsList = ingredients.join(', ');
    } else if (typeof ingredients === 'string') {
      ingredientsList = ingredients;
    } else {
      throw new Error('Invalid ingredients format');
    }

    // GPT API에 보낼 메인 레시피 프롬프트 작성
    const prompt_main = `
      다음 주재료를 사용한 난이도 ${difficulty_level}의 ${
      cuisine_type || '요리'
    } 레시피를 추천해 주세요.
      주재료는 ${ingredientsList}입니다.
      반드시 현실적인 요리 레시피만 추천해주세요.
    `;

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
    if (difficulty_level > 1) {
      const prompt_side = `
        난이도 ${difficulty_level}에 맞는 부재료를 추가하여
        ${
          cuisine_type || '요리'
        }에 어울리는 추가 재료들을 포함한 레시피를 제공해 주세요.
        주재료는 ${ingredientsList}입니다.
        반드시 현실적인 요리 레시피만 추천해주세요.
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

    // GPT API에 보낼 YouTube 링크 추천 프롬프트 작성
    const prompt_youtube = `
      다음 요리에 적합한 YouTube 동영상 링크를 추천해 주세요:
      ${ingredientsList}을(를) 사용한 ${
      cuisine_type || '요리'
    }.
      동영상은 실제 요리 방법을 다루는 신뢰할 수 있는 YouTube 채널에서 추천해 주세요.
    `;

    const response_youtube =
      await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          { role: 'user', content: prompt_youtube },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

    const youtube_link =
      response_youtube.choices[0]?.message?.content?.trim() ||
      'YouTube 링크를 찾을 수 없습니다.';

    return NextResponse.json({
      main_recipe,
      side_recipe,
      youtube_link,
    });
  } catch (error) {
    console.error(
      'Error fetching recipe or YouTube link from GPT API:',
      error
    );
    return NextResponse.json(
      {
        error:
          'Failed to fetch recipe or YouTube link from GPT API',
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
