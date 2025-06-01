"use client";

import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { QuoteForm } from "../components/QuoteForm";
import { CTASection } from "../components/CTASection";

export default function Home() {
  const [showLocations, setShowLocations] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [servicesPerPage, setServicesPerPage] = useState(3);

  const services = [
    {
      title: "Airbnb Cleaning",
      description:
        "Airbnb cleaning services are professional services specifically designed to clean Airbnb properties.",
      image:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3",
    },
    {
      title: "After Construction Cleaning",
      description:
        "Do you need professional and reliable after-construction cleaning services in Sydney? Look no further",
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
    },
    {
      title: "End of Lease Cleaning",
      description:
        "No Sweat Cleaning is a professional cleaning company that specialises in end-of-lease cleaning.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Residential Cleaning",
      description:
        "Do you ever feel like you're constantly cleaning your house, but it never seems clean enough?",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Deep Cleaning",
      description:
        "Are you looking for a professional cleaning service that specialises in deep cleaning?",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Carpet Cleaning",
      description:
        "Let us delve into the world of carpet cleaning and discover how No Sweat Cleaning can transform your space.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Commercial Cleaning",
      description:
        "When it comes to maintaining a clean and sanitary work environment, businesses in Sydney's Northern Beaches turn to No Sweat Cleaning.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Office Cleaning",
      description:
        "A clean office creates a positive impression on visitors and employees alike. It shows that the company is organised, professional, and cares about its employees.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Strata Cleaning",
      description:
        "In properties with strata titles, such as apartment buildings, condominiums, or business complexes, common areas are cleaned and maintained as part of the strata cleaning service.",
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

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        {/* <h2 className="text-3xl font-bold text-gray-900 mb-3 font-heading">
          Get Your Cleaning Quote in Seconds
        </h2>
        <p className="text-gray-600">
          Tell us what you need and get an instant, personalized price directly
          to your email.
        </p> */}
        <QuoteForm />
      </section>
      <CTASection onButtonClick={() => scrollToSection("contact")} />
    </main>
  );
}
