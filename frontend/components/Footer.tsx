import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sv-footer">
      <div className="sv-footer-top">
        <div className="sv-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Inker Robotics" style={{ height: 28, width: 'auto' }} />
          <span>Inker Robotics</span>
        </div>

        <dl className="sv-footer-cols">
          <div className="sv-footer-col">
            <dt>Email</dt>
            <dd>info@inkerrobotics.com</dd>
          </div>
          <div className="sv-footer-col">
            <dt>Solutions</dt>
            <dd>
              <Link href="/robotics">Robotics</Link> / <Link href="/ai-solutions">AI</Link> /{' '}
              <Link href="/roboparks">RoboParks</Link>
            </dd>
          </div>
          <div className="sv-footer-col">
            <dt>Company</dt>
            <dd>
              <Link href="/about">About</Link> / <Link href="/gallery">Gallery</Link> /{' '}
              <Link href="/careers">Careers</Link>
            </dd>
          </div>
          <div className="sv-footer-col">
            <dt>Learn</dt>
            <dd>
              <Link href="/edutech">EduTech</Link> / <Link href="/contact">Contact</Link>
            </dd>
          </div>
        </dl>
      </div>

      <div className="sv-footer-mid">
        <div className="sv-footer-address">
          <span>Based in</span>
          <p>Kerala, India — building for the world.</p>
        </div>

        <p className="sv-footer-slogan">
          ENGINEER<br />THE FUTURE
        </p>
      </div>

      <div className="sv-footer-bottom">
        <div className="sv-footer-social">
          <a href="https://www.linkedin.com/company/inkerrobotics/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/inkerrobotics" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/inkerrobotics" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
        <div>&copy; {new Date().getFullYear()} Inker Robotics. All rights reserved.</div>
      </div>
    </footer>
  );
}
