// api/lol.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: message,
    });

    res.status(200).json({ reply: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}