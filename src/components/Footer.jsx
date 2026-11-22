import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import ROUTES from '../constants/routes';
import useHours, { weekdayGroups } from '../hooks/useHours';

const Footer = () => {
  const hours = useHours();
  const weekdays = weekdayGroups(hours);

  return (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="space-y-3">
          <p className="brand-title">Ecco Nails & Spa</p>
          <p className="muted">
            Clean, luxurious nail care and spa rituals crafted for Lake Mary, Florida.
          </p>
          <Button to={ROUTES.bookingExternal} variant="primary" className="mt-2">
            Book Now
          </Button>
        </div>
        <div>
          <h3 className="eyebrow" style={{ marginBottom: '0.5rem' }}>
            Visit
          </h3>
          <p className="muted">
            <a
              href="https://www.google.com/maps/search/?api=1&query=4300%20W%20Lake%20Mary%20Blvd%20%231030%2C%20Lake%20Mary%2C%20FL%2032746"
              target="_blank"
              rel="noopener noreferrer"
            >
              4300 W Lake Mary Blvd #1030, Lake Mary, FL 32746
            </a>
            <br /> <br/>
            <a href="tel:+14073330904">(407) 333-0904</a> <br />
            info@ecconailsspa.com
          </p>
        </div>
        <div>
          <h3 className="eyebrow" style={{ marginBottom: '0.5rem' }}>
            Hours
          </h3>
          <p className="muted">
            {weekdays.map((g) => (
              <Fragment key={g.label}>{g.label}: {g.value} <br /></Fragment>
            ))}
            Sat: {hours.saturday} <br />
            Sun: {hours.sunday}
            {hours.note ? <><br />{hours.note}</> : null}
          </p>
        </div>
        <div>
          <h3 className="eyebrow" style={{ marginBottom: '0.5rem' }}>
            Explore
          </h3>
          <div className="flex flex-col gap-2 muted">
            <Link to={ROUTES.services}>
              Services
            </Link>
            <Link to={ROUTES.gallery}>
              Gallery
            </Link>
            <Link to={ROUTES.promotions}>
              Promotions
            </Link>
            <Link to={ROUTES.blog}>
              Blog
            </Link>
            <Link to={ROUTES.contact}>
              Contact
            </Link>
            <Link to={ROUTES.terms}>
              Terms of Service
            </Link>
            <Link to={ROUTES.privacy}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Ecco Nails & Spa. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="pill">Instagram</span>
          <span className="pill">Facebook</span>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
