# Updating Driven2Develop (no technical background required)

This is the safe way to make a change to the live site without ever touching
your domain, DNS, or hosting settings.

1. **Open the GitHub repository in Claude Code.**
2. **Tell Claude what you want changed.** Claude will create a new branch and
   make the change there - it will never edit `main` (the branch that powers
   the live site) directly.
3. **Open the Vercel Preview link Claude gives you.** This is a private,
   fully-working copy of the site with your change, running at its own
   temporary web address. The real site at your domain is untouched.
4. **Test the exact pages/buttons that changed** on that preview link.
5. **If it looks right**, tell Claude (or a teammate with GitHub access) to
   approve merging the pull request into `main`.
6. **Wait for Vercel to deploy automatically.** Once the merge happens,
   Vercel republishes the live site within a few minutes - no manual redeploy
   or domain step needed.

> **Never edit DNS or the production domain just to publish a code update.**
> Domain/DNS settings are a one-time setup, not something you touch for
> ordinary changes. If Claude or anyone ever suggests changing DNS/domain
> settings to "fix" a normal content or feature update, stop and ask why.

## What if something looks wrong after merging?

- **Roll back the deploy in Vercel**: open the project in Vercel, go to
  **Deployments**, find the last deployment that was working, and choose
  **"Promote to Production"** (or "Redeploy"). This reverts the live site
  immediately without touching git.
- **Revert the code**: ask Claude to revert the merge commit on `main` and
  open a new PR for the revert - same preview-then-approve flow as above.
- **A specific feature misbehaving**: most new AI-provider-backed features
  (like the live homeowner) degrade honestly on their own if a provider key
  is missing or a request fails - they fall back to the deterministic mode
  rather than breaking the page. If something still looks broken, that's a
  real bug worth reporting, not a config issue.
