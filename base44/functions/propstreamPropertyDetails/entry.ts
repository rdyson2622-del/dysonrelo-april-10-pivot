import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * DISABLED — PropStream integration has been permanently turned off at the
 * owner's request. No requests are made to api.propstream.com from this
 * function anymore, so no further PropStream activity or billing can occur.
 *
 * If this is called by an external scheduler (e.g. n8n) or the frontend, it
 * simply returns a disabled status without contacting PropStream.
 */
Deno.serve(async (req) => {
  return Response.json(
    {
      disabled: true,
      message: 'PropStream integration has been disabled. No requests are sent to PropStream.',
    },
    { status: 410 }
  );
});