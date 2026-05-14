// Temporary endpoint to capture raw webhook payloads for inspection.
// POST /webhook/capture — stores the raw body in event_log for debugging.
// Remove this file after the HeroSpark adapter is built.

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.text();

    await env.DB.prepare(
      `INSERT INTO event_log (event_name, event_id, raw_email, meta_response_ok, meta_response_body, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      'WEBHOOK_CAPTURE',
      crypto.randomUUID(),
      '',
      0,
      body,
      Math.floor(Date.now() / 1000)
    ).run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
