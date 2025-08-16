// api/lol.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message (string) is required' });
    }

    // Import OpenAI ESM secara dinamis agar kompatibel di Node runtime Vercel
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Pakai Responses API (disarankan oleh OpenAI)
    const response = await client.responses.create({
      model: 'gpt-4.1-mini', // boleh ganti, mis: 'gpt-4o-mini' / 'gpt-5-mini' jika tersedia
      input: [
        {
          role: 'system',
          content:
            'Kamu adalah asisten ramah. Balas singkat, jelas, dan lucu tipis-tipis.'
        },
        { role: 'user', content: message }
      ]
    });

    // Ambil text hasilnya
    const reply =
      response.output_text ||
      (response.output?.[0]?.content?.[0]?.text ?? 'Maaf, tidak ada output');

    // CORS aman untuk same-origin; kalau domain beda, bisa tambah header CORS di sini.
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}