async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/home-settings');
    const text = await res.text();
    console.log('API RESPONSE:', res.status, text.substring(0, 500));
  } catch (e) {
    console.error('Fetch failed', e);
  }
}
run();
