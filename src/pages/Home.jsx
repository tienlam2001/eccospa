import { useEffect, useMemo, useState } from 'react';
import testimonials from '../data/testimonials.json';
import posts from '../data/posts.json';
import instagramPosts from '../data/instagramPosts';
import Section from '../components/Section';
import Button from '../components/Button';
import Card from '../components/Card';
import InstagramFeed, { INSTAGRAM_PROFILE_URL } from '../components/InstagramFeed';
import ROUTES from '../constants/routes';
import { setFaqJsonLd, setLocalBusinessJsonLd, setPageSeo } from '../utils/seo';
import { getPromotions } from '../utils/adminApi';
import useServices from '../hooks/useServices';
import MobileHomePanels from '../components/MobileHomePanels';

const whyUs = [
  {
    title: 'Immaculate Cleanliness',
    description: 'Hospital-grade sanitation at every station with individually wrapped tools.',
  },
  {
    title: 'Skilled Technicians',
    description: 'Detail-oriented artists who tailor each appointment to your preferences.',
  },
  {
    title: 'Relaxing Experience',
    description: 'Quiet, calm rooms with aromatherapy and gentle music to help you unwind.',
  },
  {
    title: 'Premium Products',
    description: 'We source gentle, long-wear formulas that respect nail health and skin.',
  },
];

const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=4300%20W%20Lake%20Mary%20Blvd%20%231030%2C%20Lake%20Mary%2C%20FL%2032746';

const toLocalDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatPromotionDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const localFaqs = [
  {
    question: 'Where is Ecco Nails & Spa located in Lake Mary, FL?',
    answer:
      'Ecco Nails & Spa is located at 4300 W Lake Mary Blvd #1030, Lake Mary, FL 32746.',
  },
  {
    question: 'What nail services are available in Lake Mary?',
    answer:
      'Ecco Nails & Spa offers manicures, spa pedicures, acrylic nails, dip powder, builder gel, Gel-X extensions, nail art, kids nail services, and waxing in Lake Mary, Florida.',
  },
  {
    question: 'Do you serve nearby areas outside Lake Mary?',
    answer:
      'Yes. Guests visit from Lake Mary, Sanford, Longwood, Heathrow, Altamonte Springs, Orlando, and surrounding Seminole County communities.',
  },
  {
    question: 'How far is Ecco Nails & Spa from Orlando?',
    answer:
      'Ecco Nails & Spa is in Lake Mary, FL, about a 20-25 minute drive from downtown Orlando, making it an easy, less crowded option for Orlando-area nail and spa appointments.',
  },
];

const Home = () => {
  const services = useServices();
  const [promotions, setPromotions] = useState([]);
  const [promotionsLoaded, setPromotionsLoaded] = useState(false);
  const [showBookingPromo, setShowBookingPromo] = useState(false);
  const [bookingGateBusy, setBookingGateBusy] = useState(false);

  useEffect(() => {
    setPageSeo({
      title: 'Nail Salon in Lake Mary, FL Near Orlando',
      description:
        'Ecco Nails & Spa is an Lake Mary, FL nail salon near Orlando for manicures, pedicures, acrylic nails, dip powder, builder gel, Gel-X, nail art, waxing, and spa treatments.',
      path: '/',
      keywords:
        'nail salon Lake Mary FL, best nail salon Lake Mary, manicure Lake Mary, pedicure Lake Mary, acrylic nails Lake Mary, dip powder Lake Mary, Gel-X Lake Mary, nail salon near Orlando',
    });
    setLocalBusinessJsonLd();
    setFaqJsonLd(localFaqs);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadPromotions = async () => {
      try {
        const items = await getPromotions();
        if (mounted) setPromotions(items);
      } catch {
        if (mounted) setPromotions([]);
      } finally {
        if (mounted) setPromotionsLoaded(true);
      }
    };

    loadPromotions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector('.home-page');
    if (!root) return undefined;

    const revealItems = Array.from(root.querySelectorAll('.reveal'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));

    let frameId = 0;
    const updateHeroDrift = () => {
      const drift = Math.min(window.scrollY * 0.025, 14);
      root.style.setProperty('--hero-drift', `${drift}px`);
      frameId = 0;
    };
    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateHeroDrift);
    };

    updateHeroDrift();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const featuredServices = services.slice(0, 4);
  const latestPosts = posts.slice(0, 3);
  const activePromotion = useMemo(() => {
    const today = toLocalDateValue(new Date());
    return promotions.find((promotion) => (
      promotion.isActive &&
      promotion.startDate <= today &&
      promotion.endDate >= today
    ));
  }, [promotions]);

  const continueToBooking = () => {
    window.location.href = ROUTES.bookingExternal;
  };

  const findActivePromotion = (items) => {
    const today = toLocalDateValue(new Date());
    return items.find((promotion) => (
      promotion.isActive &&
      promotion.startDate <= today &&
      promotion.endDate >= today
    ));
  };

  const handleMobileBooking = async (event) => {
    event.preventDefault();
    if (bookingGateBusy) return;

    if (promotionsLoaded) {
      if (activePromotion) setShowBookingPromo(true);
      else continueToBooking();
      return;
    }

    setBookingGateBusy(true);
    try {
      const items = await getPromotions();
      setPromotions(items);
      setPromotionsLoaded(true);
      const nextActivePromotion = findActivePromotion(items);
      if (nextActivePromotion) {
        setShowBookingPromo(true);
      } else {
        continueToBooking();
      }
    } catch {
      continueToBooking();
    } finally {
      setBookingGateBusy(false);
    }
  };

  const closeBookingPromotion = () => {
    if (bookingGateBusy) return;
    setShowBookingPromo(false);
  };

  const handleContinueToBooking = () => {
    if (bookingGateBusy) return;
    setBookingGateBusy(true);
    continueToBooking();
  };

  return (
    <div className="home-page">
      <section className="mobile-app-home" aria-label="Ecco Nails and Spa mobile home">
        <MobileHomePanels services={services}>
        <div className="mobile-app-card">
          <p className="mobile-app-logo mobile-app-logo-text">ECCO</p>
          <h1>Ecco Nails &amp; Spa</h1>
          <p className="mobile-app-welcome">
            Welcome. Book your relaxing nail and spa visit in Lake Mary.
          </p>
          <div className="mobile-app-actions" aria-label="Primary actions">
            <a className="mobile-app-action mobile-app-action-primary" href={ROUTES.bookingExternal} onClick={handleMobileBooking} aria-busy={bookingGateBusy}>
              {bookingGateBusy ? 'Checking Offers...' : 'Book Online'}
            </a>
            <button type="button" className="mobile-app-action" data-mobile-panel="pricing">
              Smart Pricing Menu
            </button>
            <button type="button" className="mobile-app-action" data-mobile-panel="gallery">Gallery</button>
            <a className="mobile-app-action" href="tel:+14073330904">
              Call Us
            </a>
            <a className="mobile-app-action" href={directionsUrl} target="_blank" rel="noreferrer">
              Get Directions
            </a>
            <a className="mobile-app-action" href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noreferrer">
              Follow Us
            </a>
          </div>
        </div>
        </MobileHomePanels>
      </section>

      {showBookingPromo && activePromotion ? (
        <div className="mobile-booking-promo-backdrop" role="dialog" aria-modal="true" aria-labelledby="mobile-booking-promo-title">
          <div className="mobile-booking-promo-sheet">
            <button
              type="button"
              className="mobile-booking-promo-close"
              onClick={closeBookingPromotion}
              aria-label="Close promotion"
            >
              ×
            </button>
            {activePromotion.imageUrl ? (
              <img
                className="mobile-booking-promo-image"
                src={activePromotion.imageUrl}
                alt={`${activePromotion.title} promotion`}
              />
            ) : null}
            <div className="mobile-booking-promo-content">
              <p className="mobile-booking-promo-label">Current Promotion</p>
              <h2 id="mobile-booking-promo-title">{activePromotion.title}</h2>
              {activePromotion.offer ? <p className="mobile-booking-promo-offer">{activePromotion.offer}</p> : null}
              <p className="mobile-booking-promo-description">{activePromotion.description}</p>
              <p className="mobile-booking-promo-validity">
                Valid {formatPromotionDate(activePromotion.startDate)} - {formatPromotionDate(activePromotion.endDate)}
              </p>
              <button type="button" className="mobile-booking-promo-primary" onClick={handleContinueToBooking} disabled={bookingGateBusy}>
                {bookingGateBusy ? 'Opening...' : 'Continue to Booking'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="desktop-home-content">
        <div className="hero">
        <div className="container section-inner hero-grid hero-inner">
          <div className="hero-copy">
            <span className="pill hero-kicker">
              Lake Mary, Florida
            </span>
            <h1 className="hero-title">Nail salon in Lake Mary, FL, near Orlando, for polished manicures, pedicures, and spa care.</h1>
            <p className="hero-text">
              Ecco Nails & Spa is a modern, immaculate studio in Lake Mary, just a short drive from Orlando, delivering tailored manicures, spa pedicures, acrylic nails, dip powder, Gel-X, builder gel, nail art, waxing, and calming massage.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button to={ROUTES.bookingExternal} variant="primary">
                Book Now
              </Button>
              <Button to={ROUTES.services} variant="secondary">
                View Services
              </Button>
            </div>
            <div className="hero-badges">
              <span className="pill">Cleanliness-first</span>
              <span className="pill">Tailored care</span>
              <span className="pill">Premium products</span>
            </div>
          </div>
          <div className="hero-media">
            <Card className="image-card float brand-wordmark-card">
              <div className="brand-wordmark">
                <p className="brand-wordmark-title">ECCO</p>
                <p className="brand-wordmark-subtitle">NAILS &amp; SPA</p>
              </div>
              <div className="image-overlay" />
              <div className="image-info">
                <div>
                  <p className="eyebrow" style={{ marginBottom: 0, color: '#fff' }}>
                    Ecco Nails & Spa
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Lake Mary, Florida</p>
                </div>
                <span className="pill" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--charcoal)', boxShadow: 'none' }}>
                  Appointments daily
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Section id="why" eyebrow="Why Ecco" title="Calm, meticulous care">
        <div className="grid-2">
          {whyUs.map((item) => (
            <Card key={item.title} className="reveal">
              <h3 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                {item.title}
              </h3>
              <p className="section-description" style={{ marginTop: '0.5rem' }}>
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Local Nail Salon"
        title="Serving Lake Mary, Orlando, and nearby Seminole County communities"
        description="Visit Ecco Nails & Spa at 4300 W Lake Mary Blvd #1030 in Lake Mary, FL 32746, about a 20-25 minute drive from downtown Orlando. Guests come to us from Lake Mary, Orlando, Sanford, Longwood, Heathrow, Altamonte Springs, and nearby neighborhoods for clean nail care and relaxing spa services."
      >
        <div className="grid-3">
          <Card className="reveal">
            <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Manicures and nail enhancements
            </h2>
            <p className="section-description" style={{ marginTop: '0.5rem' }}>
              Classic and deluxe manicures, acrylic full sets, acrylic fills, dip powder, builder gel, Gel-X extensions, French tips, chrome, cat eye finishes, and custom nail art for Lake Mary and Orlando-area guests.
            </p>
          </Card>
          <Card className="reveal reveal-delay-1">
            <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Spa pedicures in Lake Mary
            </h2>
            <p className="section-description" style={{ marginTop: '0.5rem' }}>
              Refresh, premium, deluxe glow, organic fresh, collagen smooth, volcano spa, espresso, and golden pedicures with gel polish and massage add-ons.
            </p>
          </Card>
          <Card className="reveal reveal-delay-2">
            <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Easy local appointments
            </h2>
            <p className="section-description" style={{ marginTop: '0.5rem' }}>
              Call <a href="tel:+14073330904">(407) 333-0904</a> or book online for nail salon appointments near Lake Mary on weekdays, Saturdays, and Sundays.
            </p>
          </Card>
          <Card className="reveal reveal-delay-3">
            <h2 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Convenient for Orlando guests
            </h2>
            <p className="section-description" style={{ marginTop: '0.5rem' }}>
              Skip the downtown Orlando crowds—Ecco Nails & Spa offers the same premium manicures, pedicures, and spa care in a calmer, easy-to-reach Lake Mary studio.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        id="services"
        eyebrow="Featured Services"
        title="Beautiful nails, thoughtfully executed"
        description="Explore client favorites—from immaculate gel manicures to spa pedicures crafted to relax."
      >
        <div className="grid-2">
          {featuredServices.map((service) => (
            <Card key={service.name} className="reveal">
              <div className="service-row" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <p className="eyebrow" style={{ marginBottom: '0.35rem', color: 'rgba(31,41,51,0.55)' }}>
                    {service.category}
                  </p>
                  <h3 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                    {service.name}
                  </h3>
                </div>
                <div className="service-price">
                  <p style={{ margin: 0 }}>${service.priceFrom}+</p>
                  <p style={{ margin: '0.2rem 0 0' }}>{service.duration}</p>
                </div>
              </div>
              <p className="section-description" style={{ marginTop: '0.75rem' }}>
                {service.shortDescription}
              </p>
            </Card>
          ))}
        </div>
        <div className="section-actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <p className="muted">Looking for something specific? We customize every appointment.</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button to={ROUTES.services} variant="secondary">
              View All Services
            </Button>
            <Button to={ROUTES.bookingExternal}>Book Now</Button>
          </div>
        </div>
      </Section>

      {testimonials.length > 0 ? (
        <Section eyebrow="Testimonials" title="Guests love the calm, upscale feel">
          <div className="grid-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="reveal">
                <div className="testimonial-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{testimonial.name}</p>
                    <p className="eyebrow" style={{ margin: '0.2rem 0 0', color: 'rgba(31,41,51,0.55)' }}>
                      {testimonial.service}
                    </p>
                  </div>
                  <div className="testimonial-rating">
                    {'★'.repeat(testimonial.rating)}
                    <span style={{ color: 'rgba(31,41,51,0.3)' }}>{'★'.repeat(5 - testimonial.rating)}</span>
                  </div>
                </div>
                <p className="section-description" style={{ marginTop: '0.75rem' }}>
                  “{testimonial.quote}”
                </p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        eyebrow="Gallery"
        title="Nails and spa moments"
        description="Photos of our Lake Mary studio and finished nail sets are coming soon."
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button to={ROUTES.gallery} variant="secondary">
            View Gallery
          </Button>
        </div>
      </Section>

      {instagramPosts.length > 0 ? (
        <Section
          eyebrow="Instagram"
          title="Recent looks from Ecco Nails & Spa"
          description="See fresh nail sets, spa details, and client-ready inspiration from our Lake Mary studio."
        >
          <InstagramFeed posts={instagramPosts} />
          <div className="instagram-actions">
            <Button to={INSTAGRAM_PROFILE_URL} variant="secondary" target="_blank" rel="noreferrer">
              Follow on Instagram
            </Button>
          </div>
        </Section>
      ) : null}

      <Section eyebrow="Local FAQ" title="Lake Mary nail salon questions">
        <div className="grid-3">
          {localFaqs.map((item, index) => (
            <Card key={item.question} className={`reveal${index ? ` reveal-delay-${index}` : ''}`}>
              <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                {item.question}
              </h2>
              <p className="section-description" style={{ marginTop: '0.5rem' }}>
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {latestPosts.length > 0 ? (
        <Section eyebrow="Journal" title="From the Ecco blog">
          <div className="grid-3">
            {latestPosts.map((post) => (
              <Card key={post.id} className="reveal">
                <p className="eyebrow" style={{ color: 'rgba(31,41,51,0.55)', marginBottom: '0.2rem' }}>
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <h3 className="section-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                  {post.title}
                </h3>
                <p className="section-description" style={{ marginTop: '0.65rem' }}>
                  {post.excerpt}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Button to={`${ROUTES.blog}/${post.slug}`} variant="ghost">
                    Read Post →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button to={ROUTES.blog} variant="secondary">
              View All Posts
            </Button>
          </div>
        </Section>
      ) : null}

      <Section>
        <Card className="cta-strip reveal">
          <div>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '0.35rem' }}>
              Ready when you are
            </p>
            <h3 className="section-title" style={{ color: '#fff', margin: 0, fontSize: '1.6rem' }}>
              Book your next visit to Lake Mary&apos;s calmest nail spa.
            </h3>
            <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
              Tell us your preferred time and service—we&apos;ll confirm quickly with a clean, prepared station.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button to={ROUTES.bookingExternal} variant="secondary">
              Book Now
            </Button>
            <Button to={ROUTES.contact} variant="ghost" className="btn-ghost" style={{ color: '#fff' }}>
              Contact
            </Button>
          </div>
        </Card>
      </Section>
      </div>
    </div>
  );
};

export default Home;
