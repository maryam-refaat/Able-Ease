import React, { useEffect } from "react";
import "../Pages/about.css";

export default function AboutUs() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 200);
    });
  }, []);

  return (
    <div className="about-container">

      <section className="fade-in">
        <h1>About Able Ease</h1>
        <p>
          Able Ease is a comprehensive digital healthcare platform designed to
          simplify the lives of patients, families, and medical service
          providers. We connect patients with trusted caretakers, specialized
          physiotherapy centers, tailored rehabilitation programs, and engaged
          relatives — ensuring holistic care at every step.
        </p>
      </section>
<hr/>
      <section className="fade-in">
        <h2>Our Mission</h2>
        <p>
          To deliver accessible and high-quality medical support by bringing
          together all aspects of patient care in one intuitive and supportive
          environment.
        </p>
      </section>
<hr/>
      <section className="fade-in">
        <h2>What We Provide</h2>

        <div className="card-grid">
          <div className="info-card">
            <h3>Patients</h3>
            <p>
              A guided way to track health, follow programs, manage
              appointments, and stay connected with care providers.
            </p>
          </div>

          <div className="info-card">
            <h3>Caretakers</h3>
            <p>
              Professional caregivers offering continuous support, monitoring,
              and assistance for every patient’s needs.
            </p>
          </div>

          <div className="info-card">
            <h3>Physiotherapy Centers</h3>
            <p>
              Accredited centers providing rehabilitation sessions and advanced
              physical therapy for recovery.
            </p>
          </div>

          <div className="info-card">
            <h3>Relatives</h3>
            <p>
              A secure channel for family members to stay informed about
              progress and patient well-being.
            </p>
          </div>

          <div className="info-card">
            <h3>Programs</h3>
            <p>
              Customized treatment programs designed to ensure effective and
              personalized recovery journeys.
            </p>
          </div>
        </div>
      </section>
<hr/>
      <section className="fade-in">
        <h2>Why Choose Able Ease?</h2>
        <ul>
          <li>All-in-one medical support system</li>
          <li>Trusted and verified healthcare providers</li>
          <li>Patient-centered technology design</li>
          <li>Seamless communication between all parties</li>
          <li>Personalized rehabilitation programs</li>
        </ul>
      </section>
<hr/>
      <section className="fade-in">
        <h2>Our Vision</h2>
        <p>
          To become the leading digital partner for medical support and
          rehabilitation — empowering every patient with clarity, confidence,
          and continuous care.
        </p>
      </section>

    </div>
  );
}
