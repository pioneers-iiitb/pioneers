# Pioneers · GitHub Pages + Supabase

A separate, static-hosting version of the Pioneers website. The public visual theme is carried over from the club-approved v1.3 website: dark navy hero, paper-coloured pages, muted sage, original Pioneers emblem, and no 3D/animations.

This is **not** the old FastAPI/SQLite backend. Do not put `.env`, SQLite databases, admin secrets or old private PDFs in this repository.

## What works

- Public homepage, events, Unsolved Monday problems, general archive, resources, team, About and contact pages.
- Only **published** records appear to public visitors, enforced using Supabase Row Level Security (RLS).
- An admin console at `#/admin` to write/edit/publish content and change home, contact and About text.
- KaTeX syntax inside problem bodies: `$x^2$`, `$$\\sum_{n=1}^N n$$`.
- External Google Docs/Drive links for papers and solutions. Admins paste the sharing link into a content record; no file storage account is needed.
- Project runs from a public GitHub repository and a default `github.io` URL, or a custom domain later.
- **No** public submission forms, no user login, no file uploads, no Oracle VM.

## Quick local preview, without Supabase

Open `index.html` using a static web server:

```bash
cd Pioneers-GitHub-Supabase
python -m http.server 8080
```

Visit `http://localhost:8080/`. Empty archives and the default branding render even before Supabase is configured. The admin sign-in stays disabled until configuration.

## Supabase setup

1. Create a project on Supabase **Free**, with no paid upgrades. Note that inactive Free projects can pause and quotas/policies can change. Supabase storage is *not* used by this build.
2. Go to **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql) exactly once on the new project.
3. Under **Authentication → Providers → Email**, disable public signups / allow new users (wording differs across dashboards). Configure email/password sign-in; keep user creation restricted to the project owner.
4. Under **Authentication → Users**, create your owner/editor account through Supabase's admin dashboard. Use a long unique password. **Never** put this password in the repository.
5. Copy the created user's **User UID**. In SQL Editor, run:

   ```sql
   insert into public.admin_users(user_id)
   values ('THE-AUTH-USER-UUID');
   ```

   Adding a user to this allowlist is what grants editing rights. All others remain read-only, even if they have a valid Supabase account.
6. Open **Project Settings → API** (or **Connect** in the newer interface). Copy **Project URL** and the **publishable (anon) key** into [`config.js`](config.js). The URL and publishable key are intentionally public and safe in frontend code **only when RLS is active and properly configured**. Never copy a secret/service-role key into the site.
7. Reload the site and visit `#/admin`. Log in with your authorized editor credentials.
8. Create an event or problem, leave it as **Draft** and verify it does **not** appear in a separate incognito/private browser window. Then publish it and verify it appears. Check that non-admin users cannot insert/update/delete data.

**Admin security note:** This version relies on strong passwords, disabled open signup and RLS; it doesn't yet enforce authenticator-app MFA. Before inviting additional editors or keeping sensitive drafts in Supabase, enable and test MFA enforcement or keep unreleased material completely outside the service. Do not treat a hidden link as private access control.

## Google Drive / Docs links

- Upload a public-ready PDF into Google Drive, select **Share → General access → Anyone with the link → Viewer** (if your institution allows it), and copy the URL.
- In Content Studio, add an **Archive** entry or edit a **Problem**, and paste the URL into **Google Docs / Drive link**.
- Published entries link to Google in a new tab. If the document is restricted, visitors will see Google's request-access screen.
- **Anyone who can view a document can potentially copy or capture its contents.** Do not publish material requiring guaranteed non-downloadability.
- Keep unreleased questions and solutions restricted in Drive and do not mark their site records Published until release time.

## GitHub Pages deployment

1. Create a repository in your own GitHub account (public, if using ordinary Free GitHub Pages). The repository can be named `pioneers-website`.
2. Upload/commit the **contents of this folder** at the repository root (`index.html`, `config.js`, `assets/`, `supabase/`, etc.). Never commit credentials or original private PDFs.
3. Go to **Settings → Pages → Build and deployment → Deploy from a branch**. Choose `main` and `/ (root)` and save.
4. Your site is available at `https://USERNAME.github.io/pioneers-website/`. This version uses fragment routing such as `#/events`, so it works without web-server rewrite rules and without 404 errors on refresh.
5. To use a custom domain later, enter it under **Settings → Pages → Custom domain** and update the domain's DNS as GitHub instructs. Enable **Enforce HTTPS** after the certificate is issued.
6. In Supabase **Authentication → URL Configuration**, set the Site URL to the published GitHub Pages address; add relevant redirect URLs if you later use email flows. The current password-login form does not use redirect-based auth.

## Ownership and future handover

Keep the GitHub repository under your personal account for now and transfer it to a club organization later. Supabase project ownership is managed separately—invite the next trusted maintainer before you graduate. Export the `content_items` and `site_settings` tables periodically, especially before schema changes. Keep a source code backup and an independent document archive.

## Important limitations

- This intentionally does **not** migrate the SQLite database; the site starts with empty content.
- This build does not offer a browser-based binary image uploader. Admins can paste the URL of a hosted image or use a real image placed in the repository with a corresponding absolute HTTPS URL. Google Drive preview URLs aren't reliably usable as `<img>` sources.
- Currently the admin editor has one form for all content types, with some irrelevant optional fields. Leave them blank. A more refined editor could hide fields per type, but no additional functionality is necessary to launch a basic archive.
- The Supabase JS module and KaTeX load from public CDNs. Public pages still display textual LaTeX source if KaTeX fails to load. If you need a fully offline site, vendor these dependencies.
- Supabase Free quotas and project pausing mean no provider can promise *lifetime* uptime at zero cost.
- Google Docs and Drive documents are managed outside this editor; the editor controls titles, descriptions and links only.

## Security smoke tests before launch

1. In a private browser window, published records visible; drafts never visible.
2. A visitor without admin access cannot add or alter records through the Supabase REST endpoint.
3. Secret/service-role credentials are absent from the GitHub source and browser devtools.
4. Open signup is disabled; only explicitly authorized account IDs can edit.
5. Existing Google Docs links are public-ready; unpublished materials are not accessible.
6. The club has a recovery method for GitHub and Supabase account access.
