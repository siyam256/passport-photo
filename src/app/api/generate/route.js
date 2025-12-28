import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { image } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY; 
    const PROMPT = "Passport-size photo of a man wearing a black blazer, white shirt, and a solid black tie, strictly following the reference image for facial features and pose. The background must be plain white, clean, and professional. The final output must be in standard passport photo dimensions (2x2 inches or 51x51 mm) with realistic lighting and sharp details, perfect for official use";

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inlineData: { mimeType: "image/png", data: image } }] }],
        generationConfig: { responseModalities: ["IMAGE"] }
      })
    });

    const data = await res.json();
    const base64 = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    return NextResponse.json({ image: base64 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
