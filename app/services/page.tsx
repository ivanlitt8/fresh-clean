"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { CTASection } from "@/app/components/CTASection";
import { BubblesBackground } from "@/app/components/BubblesBackground";
import Link from "next/link";

export default function Home() {
  const [showLocations, setShowLocations] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [servicesPerPage, setServicesPerPage] = useState(3);

  const services = [
    {
      title: "After Construction Cleaning",
      description: "Post-renovation dust and debris? We handle it. Our team transforms newly built or refurbished spaces into clean, move-in-ready environments with care and precision.",
      image:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3",
    },
    {
      title: "End of Lease Cleaning",
      description:"Moving out? We take care of the full cleaning so you can focus on what's next. Detailed, bond-ready results trusted by tenants and property managers alike.",
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
    },
    {
      title: "Residential Cleaning",
      description: "Need help staying on top of the mess? We offer regular or one-off home cleaning services tailored to your lifestyle, with respect and attention to every detail.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Deep Cleaning",
      description: "Perfect for spring resets, special occasions or when things need more than a surface clean. We go deeper to revive your space and make it feel brand new.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Carpet Cleaning",
      description: "Bring life back to your carpets. We remove dirt, stains and allergens using fabric-safe methods — for fresher, softer and healthier floors.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Airbnb Cleaning",
      description: "We help you keep your short-term rental spotless between bookings. Flexible scheduling, reliable service, and detailed cleaning that impresses every guest — every time.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Commercial Cleaning",
      description: "Clean spaces create trust. Our tailored cleaning services for shops, clinics and studios keep your business welcoming, professional and spotless.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Office Cleaning",
      description:
        "A clean office means sharper focus and better morale. We clean outside working hours, respecting your team's space and time.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Strata Cleaning",
      description:
        "We maintain shared areas in buildings or complexes — keeping lobbies, stairs and hallways clean, safe and ready for everyday use.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
  ];

  const totalPages = Math.ceil(services.length / servicesPerPage);
  // Función para scroll suave
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Cerrar el menú primero
      setIsMenuOpen(false);
      setShowServices(false);
      setShowLocations(false);

      // Pequeño delay para asegurar que el menú se cierre antes del scroll
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  };

  // Cerrar menú móvil al redimensionar ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateServicesPerPage = () => {
      setServicesPerPage(window.innerWidth >= 768 ? 3 : 1);
    };

    // Inicializar en el montaje
    updateServicesPerPage();

    // Actualizar en resize
    window.addEventListener("resize", updateServicesPerPage);
    return () => window.removeEventListener("resize", updateServicesPerPage);
  }, []);

  // Efecto para la transición automática
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCarouselIndex((prevIndex) =>
          prevIndex === totalPages - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Cambia cada 5 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, totalPages]);

  return (
    <main className="min-h-screen relative">
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
      </a>

      {/* Nueva sección Hero */}
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
            for Homes & Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-[#264E46] max-w-3xl mx-auto mb-8"
          >
            Specialized in residential, commercial, and end-of-lease cleaning.
            Fresh results, every time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-[#4BA585] hover:bg-[#3d8a70] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => scrollToSection("contact")}
            >
              Get Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#4BA585] text-[#4BA585] hover:bg-[#4BA585] hover:text-white transition-all duration-300"
              onClick={() => scrollToSection("all-services")}
            >
              See Services
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="all-services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 font-heading text-[#264E46]">
            Our Services
          </h2>
          <p className="text-center text-[#264E46] mb-12 text-lg opacity-80">
            Choose the type of cleaning that best suits your needs. Reliable,
            timely services with impeccable results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-[#264E46]">
                    {service.title}
                  </h3>
                  <p className="text-[#264E46] mb-4 opacity-80 flex-grow">{service.description}</p>
                  <Button
                    className="w-full bg-[#E6F4F1] text-[#4BA585] hover:bg-[#4BA585] hover:text-white transition-all duration-300 border border-[#4BA585] mt-auto"
                    asChild
                  >
                    <Link href="/book">BOOK NOW</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTASection onButtonClick={() => scrollToSection("contact")} />
    </main>
  );
}
