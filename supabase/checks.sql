-- Optional manual security review, run from Supabase SQL editor.
-- Check RLS enabled on each table:
select relname, relrowsecurity from pg_class where relname in ('admin_users','content_items','site_settings');
-- Check policies:
select tablename, policyname, roles, cmd from pg_policies where schemaname='public' and tablename in ('admin_users','content_items','site_settings') order by tablename, policyname;
