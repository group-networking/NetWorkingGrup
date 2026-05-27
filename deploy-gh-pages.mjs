import { execSync } from 'node:child_process';
import ghpages from 'gh-pages';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRepoSlug() {
  // Prefer env provided by CI
  const repo = process.env.GITHUB_REPOSITORY; // e.g. owner/name
  if (repo) return repo;

  // Fallback to git remote
  try {
    const url = execSync('git config --get remote.origin.url', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    // Supports:
    // - git@github.com:owner/name.git
    // - https://github.com/owner/name.git
    // - https://github.com/owner/name
    const m = url.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
    if (!m) return null;
    const owner = m[1];
    const name = m[2];
    return `${owner}/${name}`;
  } catch {
    return null;
  }
}


function getBaseFromRepoName() {
  const slug = getRepoSlug();
  if (!slug) return '/';
  const name = slug.split('/')[1];
  if (!name) return '/';
  // GH Pages with project in subfolder uses: /REPO_NAME/
  return `/${name}/`;
}

const base = getBaseFromRepoName();


// Build step (optional if you already run build elsewhere)
const distDir = path.join(__dirname, 'dist');

const commitMessage = process.env.GH_PAGES_COMMIT_MESSAGE || 'Deploy to GitHub Pages';

const options = {
  // gh-pages uses `dist` by default if not provided,
  // but we pass it explicitly for clarity.
  branch: process.env.GH_PAGES_BRANCH || 'gh-pages',
  repo: process.env.GH_PAGES_REPO || undefined,
  dist: distDir,
  add: true,
  message: commitMessage,
  user: {
    name: process.env.GH_PAGES_USER_NAME || 'github-actions[bot]',
    email: process.env.GH_PAGES_USER_EMAIL || 'github-actions[bot]@users.noreply.github.com',
  },
  // If the branch already exists (common), gh-pages will handle updating.
  // Explicitly set `clone` and `cleanup` defaults remain managed by the library.
  history: false,
  // Useful for subdirectory deployments
  // We cannot directly set Vite base via gh-pages;
  // base is handled in vite.config.ts through env GH_PAGES_BASE.
};


// Set Vite base for the current build
process.env.GH_PAGES_BASE = base;

// Ensure dist exists; if not, build
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error('Build failed. Aborting GH Pages deploy.');
  process.exit(1);
}

console.log(`Deploying to gh-pages with Vite base: ${base}`);

ghpages.publish(path.join(__dirname, 'dist'), options, (err) => {
  if (err) {
    console.error('GH Pages deploy failed:', err);
    process.exit(1);
  }
  console.log('GH Pages deploy complete.');
});

