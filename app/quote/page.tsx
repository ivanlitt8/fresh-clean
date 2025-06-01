"use client";

import {
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  MessageSquare,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { QuoteForm } from "../components/QuoteForm";
import { CTASection } from "../components/CTASection";
import { Navbar } from "../components/Navbar";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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

  const paginatedServices = services.slice(
    carouselIndex * servicesPerPage,
    carouselIndex * servicesPerPage + servicesPerPage
  );

  const locations = [
    "Downtown",
    "North Side",
    "South Side",
    "East Side",
    "West Side",
  ];

  const servicesList = [
    "House Cleaning",
    "Office Cleaning",
    "Deep Cleaning",
    "Move-in/Move-out Cleaning",
    "Post-construction Cleaning",
  ];

  const features = [
    {
      text: "100% Guaranteed",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Liaise directly with real estate to secure bond",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "50+ 5 Star Google Reviews",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Flexible, Local, Trusted by 100+ clients",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Accept credit cards including Amex",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
  ];

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

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const submenuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

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
      {/* Navbar */}
      <Navbar />

      {/* WhatsApp Button */}
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
        <QuoteForm />
      </section>
      <CTASection onButtonClick={() => scrollToSection("contact")} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="ml-2 text-lg font-bold">Fresh & Clean</span>
              </div>
              <p className="text-gray-400">
                Professional cleaning services for homes and businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <PhoneCall className="h-5 w-5 mr-2" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span>info@freshandclean.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>123 Clean Street, City</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-primary">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-primary">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Mon - Fri: 8am - 6pm</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Sat: 9am - 4pm</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Sun: Closed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Fresh & Clean. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
