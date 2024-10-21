import { NextRequest, NextResponse } from 'next/server';
const { Configuration, OpenAIApi } = require('openai');

// 환경 변수에서 API Key 가져오기
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, difficulty_level } = body;

    // GPT API에 보낼 프롬프트 작성
    const prompt =
      difficulty_level === 1
        ? `다음 주재료만 사용한 난이도 1의 요리 레시피를 추천해 주세요: ${ingredients}`
        : `난이도 ${difficulty_level}에 맞는 요리 레시피를 추천해 주세요. 주재료는 ${ingredients}입니다.`;

    // GPT API 요청
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const recipe =
      gptResponse.data.choices[0].message?.content.trim();

    return NextResponse.json({ recipe });
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

export function GET() {
  return NextResponse.json(
    { message: 'Method Not Allowed' },
    { status: 405 }
  );
}
