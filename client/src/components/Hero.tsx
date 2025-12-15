import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-header">
        <div className="hero-banner" />

        <div className="hero-profile-card">
          <img
            className="hero-avatar"
            src="https://pbs.twimg.com/profile_images/1952233026320257024/U5NtemJb_400x400.jpg"
            alt="hahaha"
          />
          <div className="hero-meta">
            <div className="hero-top">
              <div>
                <span className="hero-name">hahaha</span>
              </div>
            </div>

            <div className="hero-handle">@hahaha_mp4</div>
            <div className="hero-bio">ガジェットとかブログとか</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
