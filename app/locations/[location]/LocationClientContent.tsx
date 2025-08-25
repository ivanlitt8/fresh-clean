"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { CTASection } from "@/app/components/CTASection";
import { BubblesBackground } from "@/app/components/BubblesBackground";
import { useRouter, usePathname } from "next/navigation";

const LOCATIONS = [
  {
    slug: "northern-beaches",
    name: "Northern Beaches",
    image:
      "https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images/norther_beaches.jpg",
  },
  {
    slug: "north-shore",
    name: "North Shore",
    image:
      "https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images/north_shore.jpg",
  },
  {
    slug: "eastern-suburbs",
    name: "Eastern Suburbs",
    image:
      "https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images/eastern_suburbs.jpg",
  },
  {
    slug: "south-sydney",
    name: "South Sydney",
    image:
      "https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images/south_sydney.jpg",
  },
  {
    slug: "sutherland-shire",
    name: "Sutherland Shire",
    image:
      "https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images/sutherland_shire.jpg",
  },
];

interface Props {
  name: string;
  iframeSrc: string;
}

export default function LocationClientContent({ name, iframeSrc }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  // Obtener el slug actual desde la URL
  const currentSlug = pathname.split("/").pop();
  // Filtrar las otras locations
  const otherLocations = LOCATIONS.filter((loc) => loc.name !== name);

  return (
    <main className="min-h-screen relative">
      <a
        href="https://wa.me/61426459726"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
      </a>

      {/* Hero dinámico */}
      <section className="relative h-[30vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <BubblesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-blue-600/30 backdrop-blur-sm" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full mb-6"
          >
            CLEANING SERVICES
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-[#264E46] mb-6 font-heading"
          >
            Expert Cleaning Services
            <br />
            for Homes & Businesses in {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-[#264E46] max-w-3xl mx-auto mb-8"
          >
            We offer professional cleaning services in {name} and surrounding
            areas. Our team is trained to deliver impeccable results, adapting
            to the needs of homes and businesses in the area. Trust us to keep
            your spaces clean and healthy!
          </motion.p>
        </div>
      </section>

      {/* Iframe de la ubicación y texto descriptivo */}
      <section className="py-20 px-4 bg-[#E6F4F1] flex flex-col items-center">
        <div className="flex flex-col md:flex-row w-full max-w-4xl items-stretch justify-center gap-8 mb-6">
          {/* Mapa */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-[500px] aspect-[4/3] shadow-lg bg-white rounded-xl">
              <iframe
                src={iframeSrc}
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Google Map of ${name}`}
              />
            </div>
          </div>
          {/* Columna derecha: título, texto, disclaimer y botón */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-2 md:px-0">
            <h2 className=" font-heading text-2xl md:text-3xl font-bold text-[#264E46] mb-4 text-center md:text-left w-full">
              Serving {name} with Professional Cleaning Solutions
            </h2>
            <p className="text-[#264E46] text-base md:text-lg mb-2 text-center md:text-left w-full">
              We proudly serve homes and businesses in {name}, offering tailored
              cleaning services that fit local needs.
              <br />
              Check the map below to see our current service area in {name}, and
              feel free to reach out if you&apos;re unsure whether we cover your
              address.
            </p>
            <span className="text-sm text-[#264E46] block mt-4 mb-4 text-center md:text-left w-full opacity-80">
              If you&apos;re located near this area but don’t see your suburb
              covered, contact us—we may still be able to help!
            </span>
            {/* Botón de WhatsApp debajo del texto */}
            <a
              href="https://wa.me/61426459726"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow transition-colors mb-2 w-full md:w-auto justify-center md:justify-start"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
              <span className="text-base font-medium">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Navegación entre locations */}
      <section className="bg-[#264E46] ">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-8 text-center">
            Explore Other Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {otherLocations.map((loc) => (
              <div
                key={loc.slug}
                className="relative h-56 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => router.push(`/locations/${loc.slug}`)}
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300" />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <span className="text-white text-2xl font-bold text-center drop-shadow-lg font-heading">
                    {loc.name.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        onButtonClick={() =>
          (window.location.href = "/?fromLocations=true#contact")
        }
      />
    </main>
  );
}
