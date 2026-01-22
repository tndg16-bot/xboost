import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    // Extract original content from the prompt
    // The prompt format is: "以下の投稿を「{style}（{description}）」のスタイルで書き換えてください。\n\n元の投稿:\n{content}"
    const match = prompt.match(/元の投稿:\n([\s\S]+)/);
    const originalContent = match ? match[1].trim() : prompt;

    // Determine the style from the prompt and generate appropriate reformatted content
    let reformattedContent = '';

    if (prompt.includes('フレンドリー')) {
      reformattedContent = `😊 ${originalContent}\n\nみなさんどう思いますか？`;
    } else if (prompt.includes('プロフェッショナル')) {
      reformattedContent = `【重要】${originalContent}\n\n詳細はリンク先をご確認ください。`;
    } else if (prompt.includes('カジュアル')) {
      reformattedContent = originalContent.replace(/です/g, 'だ').replace(/ます/g, 'る');
    } else if (prompt.includes('緊急感')) {
      reformattedContent = `🚨 今すぐチェック！\n\n${originalContent}\n\nお見逃しなく！`;
    } else if (prompt.includes('物語風')) {
      reformattedContent = `この話、聞いてください...\n\n${originalContent}\n\n実は、こんなことがあったんです。`;
    } else {
      reformattedContent = `✨ ${originalContent}`;
    }

    return NextResponse.json({ content: reformattedContent })
  } catch (error) {
    console.error('Reformat API error:', error);
    return NextResponse.json({ error: "Failed to reformat" }, { status: 500 })
  }
}
