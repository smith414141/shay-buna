export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            process.env.CHAPA_SECRET_KEY ||
            "CHASECK_TEST-b0g8De2VLnKZbLH41esfc7dVUah2jx8L"
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
