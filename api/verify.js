export default async function handler(req, res) {
  const { tx_ref } = req.query;

  if (!tx_ref) {
    return res.status(400).json({ error: "No transaction reference provided" });
  }

  try {
    const response = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            process.env.CHAPA_SECRET_KEY ||
            "CHASECK_TEST-b0g8De2VLnKZbLH41esfc7dVUah2jx8L"
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
