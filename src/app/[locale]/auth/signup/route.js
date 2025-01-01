// app/api/auth/sign-up/route.js

import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
  const { provider } = await req.json();  // Get the provider from the request body (e.g., 'google')

  if (provider === 'google') {
    try {
      // Create Supabase client on the server
      const supabase = await createClient();

      // Trigger the OAuth sign-in flow with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      // Return user data or session if necessary
      return new Response(JSON.stringify({ user: data.user, session: data.session }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Invalid provider' }), { status: 400 });
}
