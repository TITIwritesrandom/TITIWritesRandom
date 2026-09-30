# TITIwritesRandom — setup

## 1. Supabase
Create a Supabase project and create ONE Auth user for yourself.

Disable public sign-ups after creating your account.

## 2. Database
Open Supabase SQL Editor. Before running `supabase-schema.sql`, uncomment the final admin INSERT and replace `YOUR-AUTH-USER-UUID` with the UUID of your Auth user.

Run the complete file.

## 3. Browser configuration
Open `config.js` and replace the two placeholders with the Supabase project URL and publishable key. Never put a secret/service_role key in this file.

## 4. Test
Open `admin.html`, sign in, create a writing, and publish it. Then open `writings.html` in a separate tab. The published writing should appear there.

## 5. GitHub + Vercel
Push the folder to a GitHub repository and import that repository into Vercel. The site can then be given a Vercel URL and later a custom domain.
