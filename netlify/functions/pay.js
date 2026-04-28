exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);

  const response = await fetch(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer CHASECK_TEST-b0g8De2VLnKZbLH41esfc7dVUah2jx8L",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
