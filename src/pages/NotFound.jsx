import { useEffect } from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import Button from '../components/Button';
import ROUTES from '../constants/routes';
import { setPageSeo } from '../utils/seo';

const NotFound = () => {
  useEffect(() => {
    setPageSeo({
      title: 'Page not found',
      description:
        'The page you are looking for is unavailable. Return to Ecco Nails & Spa in Lake Mary, Florida.',
      robots: 'noindex, follow',
    });
  }, []);

  return (
    <div>
      <Section title="Page not found" description="Let us guide you back to the Ecco Nails & Spa experience.">
        <Card>
          <p className="muted">
            The page you tried to reach does not exist. Browse services or book an appointment in Lake Mary, Florida.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button to={ROUTES.home}>Return Home</Button>
            <Button to={ROUTES.bookingExternal} variant="secondary">
              Book Now
            </Button>
          </div>
        </Card>
      </Section>
    </div>
  );
};

export default NotFound;
