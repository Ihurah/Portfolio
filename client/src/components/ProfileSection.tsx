import React from "react";

const ProfileSection: React.FC = () => {
  return (
    <section className="profile">
      {/* Header moved to Hero.tsx */}

      <div className="profile-links">
        <div className="profile-links-title">
          <h2>Links</h2>
        </div>
        <div className="profile-links-list">
          <ul>
            <li>
              <a
                href="https://x.com/hahaha_mp4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-x-twitter" />
                <span>X</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/ihurah_com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Ihurah"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-github" />
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="profile-skills">
        <div className="profile-skills-title">
          <h2>Skills</h2>
        </div>
        <ul>
          <li>
            <i className="fa-brands fa-html5" />
            <span>HTML</span>
          </li>
          <li>
            <i className="fa-brands fa-css3-alt" />
            <span>CSS</span>
          </li>
          <li>
            <i className="fa-brands fa-square-js" />
            <span>JavaScript</span>
          </li>
          <li>
            <i className="fa-brands fa-php" />
            <span>PHP</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ProfileSection;
