import React, { useState, useEffect } from "react";
import { fetchGitHubRepos } from "../api/github";
import { motion } from "framer-motion";

// カードの型を定義
interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
}

const GitHubRepoCard: React.FC<{ repo: Repo }> = ({ repo }) => (
  <motion.a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="repo-card"
  >
    <h3>{repo.name}</h3>
    <p className="repo-desc">{repo.description}</p>
    <div className="repo-meta">
      <span>言語: {repo.language}</span>
      <span>
        <i className="fa-regular fa-star" /> {repo.stargazers_count}
      </span>
    </div>
  </motion.a>
);

const GitHubSection: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubRepos()
      .then((data) => {
        console.debug("[GitHubSection] fetched repos", data);
        // Sort by updated_at descending so the newest repos appear first (leftmost)
        const sorted = data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
        setRepos(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[GitHubSection] fetch error", err);
        setLoading(false);
      });
  }, []);

  const githubUsername =
    (import.meta as any).env?.VITE_GITHUB_USERNAME || "Ihurah";

  return (
    <section className="github">
      <div className="github-projects-title">
        <h2>Projects</h2>
      </div>
      {loading ? null : repos.length === 0 ? (
        <div>
          <p>
            作品が見つかりません。
          </p>
        </div>
      ) : (
        <div className="repo-list">
          {repos.slice(0, 10).map((repo) => (
            <GitHubRepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
      {repos.length > 10 && (
        <a
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-all-button"
        >
          All Projects
        </a>
      )}
    </section>
  );
};

export default GitHubSection;
