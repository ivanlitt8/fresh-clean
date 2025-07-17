import LocationClientContent from "./LocationClientContent";
import { notFound } from "next/navigation";

const LOCATIONS = {
  "northern-beaches": {
    name: "Northern Beaches",
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212444.42717691255!2d151.0869938304363!3d-33.69745373251458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0d55f0bda11bab%3A0xa012b517158bb83d!2sNorthern%20Beaches%20Council%2C%20Nueva%20Gales%20del%20Sur%2C%20Australia!5e0!3m2!1ses!2sar!4v1752696376095!5m2!1ses!2sar",
  },
  "north-shore": {
    name: "North Shore",
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212530.8359958016!2d150.89000007089476!3d-33.662491102398704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0d56e9f49755f5%3A0x5dd3d80b0c01e385!2sNorth%20Shore%2C%20Nueva%20Gales%20del%20Sur%2C%20Australia!5e0!3m2!1ses!2sar!4v1752698178422!5m2!1ses!2sar",
  },
  "eastern-suburbs": {
    name: "Eastern Suburbs",
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105950.0162944566!2d151.14143751361777!3d-33.91699500545116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b18db5d79889%3A0xa061091923af585a!2sEastern%20Suburbs%2C%20Nueva%20Gales%20del%20Sur%2C%20Australia!5e0!3m2!1ses!2sar!4v1752698294048!5m2!1ses!2sar",
  },
  "south-sydney": {
    name: "South Sydney",
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211580.90125376362!2d150.7725776878457!3d-34.04511308201436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b7b46f88f1e9%3A0xef289d1f23fe010!2sSouthern%20Sydney%2C%20Nueva%20Gales%20del%20Sur%2C%20Australia!5e0!3m2!1ses!2sar!4v1752698392676!5m2!1ses!2sar",
  },
  "sutherland-shire": {
    name: "Sutherland Shire",
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105757.38397562348!2d150.99469062004064!3d-34.071609854548576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c6ef3b0a5fcf%3A0xfdc65c7d37ac7b7b!2sSutherland%2C%20Nueva%20Gales%20del%20Sur%2C%20Australia!5e0!3m2!1ses!2sar!4v1752698425602!5m2!1ses!2sar",
  },
};

export function generateStaticParams() {
  return [
    { location: "northern-beaches" },
    { location: "north-shore" },
    { location: "eastern-suburbs" },
    { location: "south-sydney" },
    { location: "sutherland-shire" },
  ];
}

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const locationKey = params.location as keyof typeof LOCATIONS;
  const locationData = LOCATIONS[locationKey];

  if (!locationData) return notFound();

  return (
    <LocationClientContent
      name={locationData.name}
      iframeSrc={locationData.iframeSrc}
    />
  );
}
