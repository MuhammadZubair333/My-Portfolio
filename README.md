# Muhammad Zubair — Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · lucide-react · react-icons

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Editing content

All content lives in `src/data/` — components never hardcode facts.

| File | Contents |
| --- | --- |
| `profile.ts` | Name, contact details, links, nav, About highlights |
| `projects.ts` | Projects shown in the showcase |
| `experience.ts` | Jobs, education, certifications, freelance section |
| `skills.ts` | Skill groups (primary vs supporting) |

### Adding a project

1. Save a 1440×900 screenshot as `public/projects/<slug>.webp` (optional — without it a branded placeholder is shown).
2. Add an object to `projects` in `src/data/projects.ts`.
3. Use `categories` from `projectCategories` (Web Development, WordPress, Shopify, AI, Chatbots).
   A filter button appears automatically once a category has at least one project.
4. `featured: true` moves a project to the front; the first project gets the large spotlight layout.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`) so canonical and Open Graph URLs are absolute.
On Vercel the production URL is picked up automatically if the variable isn't set.
