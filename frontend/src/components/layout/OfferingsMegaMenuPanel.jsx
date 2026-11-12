import React from 'react';
import { Link } from 'react-router-dom';
import rippleImage from '../../assets/nc_home/aqua2.png';
import gulmoImage from '../../assets/nc_mandala/gulmo_tank.png';
import pattern from '../../assets/nc_mandala/pattern.png';
import './OfferingsMegaMenu.css';

export default function OfferingsMegaMenuPanel({ links, onClose, onMouseEnter, onMouseLeave }) {
  return (
    <div
      id="offerings-mega-menu"
      className="offerings-mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Offerings"
    >
      <div className="offerings-mega-menu__layout">
        <div className="offerings-mega-menu__intro">
          <span className="offerings-mega-menu__accent" aria-hidden="true" />
          <p className="offerings-mega-menu__eyebrow">OFFERINGS</p>
          <h2><strong>Lorem Ipsum Dolor</strong><br />Sit Amet, Consectetur</h2>
          <p className="offerings-mega-menu__description">
            Liquid landscapes mirrored in mindful art,<br />a living mandala&apos;s heart.
          </p>
          <p className="offerings-mega-menu__tagline">RESET . RENEW . REBUILD</p>
        </div>

        <div className="offerings-mega-menu__cards">
          {[
            { label: 'Ripple', href: links.ripple, image: rippleImage },
            { label: 'Gulmo', href: links.gulmo, image: gulmoImage },
          ].map(({ label, href, image }) => (
            <Link key={label} to={href} onClick={onClose} className="offerings-mega-menu__card">
              <div className="offerings-mega-menu__image">
                <img src={image} alt="" />
              </div>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="offerings-mega-menu__lab">
          <div className="offerings-mega-menu__pattern" style={{ backgroundImage: `url(${pattern})` }} aria-hidden="true" />
          <div className="offerings-mega-menu__lab-links">
            <Link to={links.prakriti} onClick={onClose} className="offerings-mega-menu__lab-title">Prakriti LAB</Link>
            <Link to={links.workshop} onClick={onClose} className="offerings-mega-menu__workshop">Workshop</Link>
          </div>
          <p>Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments.</p>
        </div>
      </div>
    </div>
  );
}
