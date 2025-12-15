import axios from 'axios';

// Determine API base URL:
// - If `VITE_API_BASE` is provided at build time, use it.
// - Otherwise, when running on localhost prefer the local server address used during development.
// - In production (public host), use a relative `/api` so the browser does not attempt to access
//   the user's local network (this was triggering Chrome's "local network" permission prompt).
const envBase = (import.meta as any).env?.VITE_API_BASE;
const API_BASE_URL = envBase
  ?? (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:3001/api'
    : '/api');

// Username to fetch from GitHub if server API is not available.
const GITHUB_USERNAME = (import.meta as any).env?.VITE_GITHUB_USERNAME || 'Ihurah';

export interface Repo {id: number; name: string; description: string; language: string; stargazers_count: number; html_url: string; updated_at: string;}

export const fetchGitHubRepos = async (): Promise<Repo[]> => {
  const serverUrl = `${API_BASE_URL}/github/repos`;

  // Try server-provided API first (if present). If it fails (CORS, 404, network),
  // fall back to GitHub's public API so static deployments still show projects.
  try {
    console.debug('[fetchGitHubRepos] trying server api', serverUrl);
    const response = await axios.get<Repo[]>(serverUrl, { timeout: 4000 });
    if (response && response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
      console.debug('[fetchGitHubRepos] server returned', response.data.length, 'repos');
      return response.data;
    }
    console.debug('[fetchGitHubRepos] server returned empty or non-200, falling back');
  } catch (err) {
    const serverErrMessage = (err && typeof err === 'object' && 'message' in err)
      ? (err as any).message
      : String(err);
    console.debug('[fetchGitHubRepos] server API failed, falling back to GitHub public API', serverErrMessage);
  }

  // Fallback: GitHub public REST API (unauthenticated). Be aware of rate limits for unauthenticated requests.
  try {
    const ghUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
    console.debug('[fetchGitHubRepos] requesting github public api', ghUrl);
    const r = await axios.get<any[]>(ghUrl, { headers: { Accept: 'application/vnd.github.v3+json' } });
    const mapped: Repo[] = (r.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      language: item.language,
      stargazers_count: item.stargazers_count,
      html_url: item.html_url,
      updated_at: item.updated_at,
    }));
    console.debug('[fetchGitHubRepos] github returned', mapped.length, 'repos');
    return mapped;
  } catch (error: any) {
    console.error('[fetchGitHubRepos] github public api failed', error?.message || error);
    // Return empty array so UI shows friendly empty state instead of crashing
    return [];
  }
};
