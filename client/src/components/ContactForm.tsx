import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const recipient = "info@haru-edit.net";
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(recipient);
      } else {
        const ta = document.createElement("textarea");
        ta.value = recipient;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <section className="contact">
      <div className="contact-card">
        <div className="contact-title">
          <h2>Contact</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-main">
            <p style={{ margin: 0, fontSize: "1rem", color: "#374151" }}>
              <strong>メール:</strong>
            </p>

            <div style={{ margin: "8px 0 16px 0" }}>
              <div className="email-pill" role="group" aria-label="Email contact">
                <svg className="email-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 6.75l8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <a className="email-link" href={`mailto:${recipient}`}>{recipient}</a>

                <button type="button" className="copy-btn" onClick={copyEmail} aria-label="Copy email">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
