import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const maxDuration = 30;

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monthly, rate, years, age, initial, result } = body;

    if (!monthly || !rate || !years || !age || !result) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { totalPrincipal, futureValue, totalProfit, gainRate, taxSaving } =
      result;

    const systemPrompt = `あなたはFP（ファイナンシャルプランナー）のAIアシスタントです。
つみたてNISAのシミュレーション結果をわかりやすく、かつ前向きに説明してください。
以下の点を含めて200〜300文字程度で説明してください：
1. 積立の効果（元本に対して何倍になるか）
2. 複利の力についてのポイント
3. ユーザーへの励ましメッセージ
専門用語は避け、親しみやすい言葉で説明してください。`;

    const userMessage = `月々${monthly.toLocaleString("ja-JP")}円を年利${rate}%で${years}年間積み立てた結果：
- 現在の保有資産: ${(initial || 0).toLocaleString("ja-JP")}円
- 元本: ${totalPrincipal.toLocaleString("ja-JP")}円
- 総資産: ${futureValue.toLocaleString("ja-JP")}円
- 運用益: ${totalProfit.toLocaleString("ja-JP")}円（+${gainRate}%）
- 非課税メリット: ${taxSaving.toLocaleString("ja-JP")}円
この結果を説明してください。`;

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
