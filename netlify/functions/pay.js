exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

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
        body: JSON.stringify({
          amount: body.amount,
          currency: "ETB",
          email: body.email || "supporter@shaybuna.com",
          first_name: body.first_name || "Fan",
          last_name: body.last_name || "",
          phone_number: body.phone_number,
          tx_ref: body.tx_ref,
          callback_url: body.callback_url,
          return_url: body.return_url,
          customization: body.customization,
        }),
      }
    );

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
