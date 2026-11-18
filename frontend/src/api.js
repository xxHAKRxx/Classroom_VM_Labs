// A small helper so every component fetches from the API the same way.
//
// `url` is just a path like '/api/labs/'. No 'https://labs.example.com:8000' in front
// is needed, because this code runs on a page from that same site.
//
// The browser automatically sends the Django login cookie with the request,
// so the API knows which student is asking (no tokens needed).
export async function getJSON(url) {
  // Ask for JSON; otherwise DRF may send its HTML "browsable API" page.
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  // fetch() only throws if the network fails. A 403 or 404 is still a "successful"
  // response to fetch, so check the status ourselves and turn it into an error.
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${url}`);
  }

  // Turn the JSON text in the response into JavaScript objects and arrays.
  return response.json();
}