import React from "react";
import Hero from "./components/Hero";
import ProfileSection from "./components/ProfileSection";
import GitHubSection from "./components/GitHubSection";
import ContactForm from "./components/ContactForm";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <div className="header-title">
          <h2>haru-edit&nbsp;Portfolio</h2>
        </div>
      </header>
      <main>
        <Hero />
        <ProfileSection />
        <GitHubSection />
        <ContactForm />
      </main>
      <footer className="footer">
        <p>©&nbsp;{new Date().getFullYear()}&nbsp;haru.edit</p>
      </footer>
    </div>
  );
};
export default App;
