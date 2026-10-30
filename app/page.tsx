import { AnnouncementPopup, PromotionalSlides } from "./АnnouncementPopup";
import { getFirebaseOffer } from "./ﬁrebase-offer";
import { PromotionSignup } from "./ΠromotionSignup";
import { CustomerChat } from "./ΚustomerChat";
import { ScrollReveal } from "./ΣcrollReveal";
import { Gallery } from "./Γallery";
import { getFirebaseMenu } from "./ﬁrebase-menu";
import { getFirebaseHours } from "./ﬁrebase-hours";
import { MobileExperience } from "./ΜobileExperience";

export const dynamic = "force-dynamic";

// TODO: replace placeholders with Ecco's real booking link, address, and phone
const bookingUrl = "https://abcapp.us?appid=PLACEHOLDER_ECCO_BOOKING_ID";
const siteUrl = "https://ecconails.com";
const address = "PLACEHOLDER_ECCO_ADDRESS, Lake Mary, FL";
const phone = "+1PLACEHOLDER_ECCO_PHONE";
const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=PLACEHOLDER_ECCO_ADDRESS%2C%20Lake%20Mary%2C%20FL";
const mapUrl =
  "https://www.google.com/maps?q=PLACEHOLDER_ECCO_ADDRESS%2C%20Lake%20Mary%2C%20FL&output=embed";

type MenuItem = [service: string, price: string, description?: string];

type MenuSection = {
  title: string;
  note: string;
  featured?: boolean;
  items: MenuItem[];
};