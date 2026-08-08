const SOURCE_URL = "https://adstxt.journeymv.com/sites/64f14515-ba63-41f9-be04-b71420407486/ads.txt";

export async function onRequestGet() {
  const upstream = await fetch(SOURCE_URL);

  if (!upstream.ok) {
    return new Response("", { status: 502 });
  }

  const body = await upstream.text();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
