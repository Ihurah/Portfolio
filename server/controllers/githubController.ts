import { Request, Response } from 'express';
import axios from 'axios';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Ihurah';

let cachedRepos: any[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = Number(process.env.GITHUB_CACHE_TTL_MS || 5 * 60 * 1000);

export const getRepos = async (req: Request, res: Response) => {
  if (cachedRepos && Date.now() - cachedAt < CACHE_TTL_MS) {
    console.debug('Serving GitHub repos from cache');
    return res.json(cachedRepos);
  }
  try {
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        headers,
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
        },
      }
    );
    const repos = (response.data as any[]).map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '説明なし',
      language: repo.language || 'N/A',
      stargazers_count: repo.stargazers_count,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
    }));
    cachedRepos = repos;
    cachedAt = Date.now();
    try {
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('X-Cache-Age', '0');
    } catch (e) {
    }
    res.json(repos);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const respData = error?.response?.data;
    const respHeaders = error?.response?.headers || {};
    console.error('Error fetching GitHub repos:', {
      status,
      requestUrl: `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      responseData: respData,
      responseHeaders: respHeaders,
      message: error?.message,
    });

    const details = respData || error?.message || 'Unknown error';

    try {
      const reset = respHeaders['x-ratelimit-reset'];
      if (reset) {
        const resetTs = Number(reset) * 1000;
        const now = Date.now();
        const retryAfterSec = Math.max(0, Math.ceil((resetTs - now) / 1000));
        res.setHeader('Retry-After', String(retryAfterSec));
      }
      if (respHeaders['x-ratelimit-remaining']) {
        res.setHeader('X-RateLimit-Remaining', String(respHeaders['x-ratelimit-remaining']));
      }
      if (respHeaders['x-ratelimit-limit']) {
        res.setHeader('X-RateLimit-Limit', String(respHeaders['x-ratelimit-limit']));
      }
      if (respHeaders['x-ratelimit-reset']) {
        res.setHeader('X-RateLimit-Reset', String(respHeaders['x-ratelimit-reset']));
      }
    } catch (e) {
    }

    if (cachedRepos) {
      console.warn('GitHub API error — returning cached repos as fallback', { status, details });
      try {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Age', String(Math.floor((Date.now() - cachedAt) / 1000)));
      } catch (e) {
      }
      return res.json(cachedRepos);
    }

    res.status(status).json({ message: 'GitHub リポジトリの取得に失敗しました', details, status });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const details = error.response?.data || error.message;
    res.status(status).json({ message: 'GitHub ユーザー情報の取得に失敗しました', details, status });
  }
};

export default { getRepos, getUser };
