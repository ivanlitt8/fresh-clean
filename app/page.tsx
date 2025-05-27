"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  Star,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { BubblesBackground } from "./components/BubblesBackground";
import { QuoteForm } from "./components/QuoteForm";

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
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Fresh & Clean</span>
            </div>

            {/* Botón de menú móvil */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>

            {/* Menú de escritorio */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              <motion.button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <motion.button
                  className="text-gray-600 hover:text-primary flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
                <AnimatePresence>
                  {showServices && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    >
                      {servicesList.map((service, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            scrollToSection("services");
                            setShowServices(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          whileHover={{ x: 5 }}
                          custom={index}
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                        >
                          {service}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Locations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowLocations(true)}
                onMouseLeave={() => setShowLocations(false)}
              >
                <motion.button
                  className="text-gray-600 hover:text-primary flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Locations <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
                <AnimatePresence>
                  {showLocations && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    >
                      {locations.map((location, index) => (
                        <motion.button
                          key={index}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          whileHover={{ x: 5 }}
                          custom={index}
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                        >
                          {location}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => scrollToSection("contact")}>
                  Book Now
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Menú móvil */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col space-y-4 py-4">
                  <motion.button
                    variants={menuItemVariants}
                    custom={0}
                    onClick={() => scrollToSection("about")}
                    className="text-left text-gray-600 hover:text-primary px-4 py-2"
                  >
                    About
                  </motion.button>

                  {/* Services en móvil */}
                  <div className="px-4">
                    <motion.button
                      variants={menuItemVariants}
                      custom={1}
                      onClick={() => setShowServices(!showServices)}
                      className="text-left text-gray-600 hover:text-primary flex items-center"
                    >
                      Services <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.button>
                    <AnimatePresence>
                      {showServices && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-2 pl-4"
                        >
                          {servicesList.map((service, index) => (
                            <motion.button
                              key={index}
                              variants={menuItemVariants}
                              custom={index + 2}
                              onClick={() => scrollToSection("services")}
                              className="block w-full text-left py-2 text-sm text-gray-700 hover:text-primary"
                            >
                              {service}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Locations en móvil */}
                  <div className="px-4">
                    <motion.button
                      variants={menuItemVariants}
                      custom={2}
                      onClick={() => setShowLocations(!showLocations)}
                      className="text-left text-gray-600 hover:text-primary flex items-center"
                    >
                      Locations <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.button>
                    <AnimatePresence>
                      {showLocations && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-2 pl-4"
                        >
                          {locations.map((location, index) => (
                            <motion.button
                              key={index}
                              variants={menuItemVariants}
                              custom={index + 3}
                              onClick={() => setShowLocations(false)}
                              className="block w-full text-left py-2 text-sm text-gray-700 hover:text-primary"
                            >
                              {location}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    variants={menuItemVariants}
                    custom={3}
                    onClick={() => scrollToSection("contact")}
                    className="text-left text-gray-600 hover:text-primary px-4 py-2"
                  >
                    Contact
                  </motion.button>

                  <motion.div
                    variants={menuItemVariants}
                    custom={4}
                    className="px-4"
                  >
                    <Button
                      onClick={() => scrollToSection("contact")}
                      className="w-full"
                    >
                      Book Now
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
      </a>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50/50 to-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-white/30"></div>
        <BubblesBackground />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Professional Cleaning Services for Your Home & Office
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the difference with our expert cleaning services. We
            bring sparkle to every corner.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-[#00AEEF] hover:bg-[#0098d1] text-white"
            >
              Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B1C2C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 font-heading">
                CLEANING MADE EASY
              </h2>
              <h3 className="text-4xl font-bold mb-8 font-heading">
                The No Sweat Difference
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.icon}
                    <span className="text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="mt-8 bg-blue-500 hover:bg-blue-600 text-white"
              >
                GET INSTANT QUOTE
              </Button>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3"
                alt="Professional cleaning team"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 font-heading">
                About Fresh & Clean
              </h2>
              <p className="text-gray-600 mb-6">
                Fresh & Clean is your trusted partner in maintaining a clean and
                healthy environment. With years of experience and a dedicated
                team of professionals, we deliver exceptional cleaning services
                that exceed expectations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Experienced Team</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Eco-friendly Products</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>100% Satisfaction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Flexible Scheduling</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3"
                alt="Cleaning professional at work"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold font-heading">
              Our Cleaning Services
            </h2>
            <Button variant="outline" size="lg">
              ALL SERVICES
            </Button>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                initial={false}
                animate={{ x: `${-carouselIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {Array.from({
                  length: Math.ceil(services.length / servicesPerPage),
                }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="w-full flex-shrink-0 flex gap-8"
                    style={{ padding: "0 1rem" }}
                  >
                    {services
                      .slice(
                        pageIndex * servicesPerPage,
                        (pageIndex + 1) * servicesPerPage
                      )
                      .map((service, index) => (
                        <div key={index} className="flex-1">
                          <div className="group relative overflow-hidden rounded-lg h-full bg-white">
                            <div className="relative h-[300px] overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="text-2xl font-semibold mb-3 font-heading">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {service.description}
                              </p>
                              <Button className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                                BOOK NOW
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Botones de navegación */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow p-3 z-10 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setCarouselIndex((prev) => Math.max(prev - 1, 0));
                setIsAutoPlaying(false);
              }}
              disabled={carouselIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow p-3 z-10 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setCarouselIndex((prev) => Math.min(prev + 1, totalPages - 1));
                setIsAutoPlaying(false);
              }}
              disabled={carouselIndex === totalPages - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores de página */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    carouselIndex === idx ? "bg-blue-600" : "bg-gray-300"
                  } hover:bg-blue-400`}
                  onClick={() => {
                    setCarouselIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Columna Izquierda - Imagen */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3"
                alt="Cleaning professional at work"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Columna Derecha - Proceso */}
            <div className="space-y-12">
              <div>
                <p className="text-blue-600 font-medium uppercase tracking-wide mb-2 font-heading">
                  OUR PROCESS
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-heading">
                  How it works
                </h2>
              </div>

              {/* Paso 1 */}
              <div className="relative flex gap-4 md:gap-8">
                <div className="text-[80px] md:text-[120px] font-bold leading-none text-[#e1ebf7] select-none">
                  01
                </div>
                <div className="pt-4 md:pt-6 flex-1 mb-4">
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    Fill out the online form
                  </h3>
                  <p className="text-gray-600">
                    Choose your home size in terms of bedrooms and bathrooms or
                    select an hourly rate for the partial cleaning of extra
                    large, or really dirty homes.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 mt-8"></div>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="relative flex gap-4 md:gap-8">
                <div className="text-[80px] md:text-[120px] font-bold leading-none text-[#e1ebf7] select-none">
                  02
                </div>
                <div className="pt-4 md:pt-6 flex-1 mb-4">
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    Configure your booking
                  </h3>
                  <p className="text-gray-600">
                    Select the added extras you wish to add to your booking
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 mt-8"></div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="relative flex gap-4 md:gap-8">
                <div className="text-[80px] md:text-[120px] font-bold leading-none text-[#e1ebf7] select-none">
                  03
                </div>
                <div className="pt-4 md:pt-6 flex-1">
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    Select the service frequency that suits your needs
                  </h3>
                  <p className="text-gray-600">
                    Choose your service frequency and complete our online
                    booking form. Our team will quickly assign expert cleaners
                    who are the perfect fit for your needs. You&apos;ll receive
                    confirmation and detailed information about your service.
                    Book now for an elevated cleaning experience.
                  </p>
                </div>
              </div>

              {/* Botón Book Now */}
              <div className="flex justify-center md:justify-start">
                <Button
                  size="lg"
                  className="mt-8 bg-[#00AEEF] hover:bg-blue-500 text-white font-semibold px-8"
                >
                  BOOK NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Columna Izquierda - Contenido */}
            <div className="flex flex-col gap-8 order-2 md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
                  Why Choose No Sweat Cleaning?
                </h2>
                <p className="text-gray-600 text-lg">
                  Bid farewell to germs, dust, and dirt! Our loyal customers
                  return to us time and time again because...
                </p>
              </div>

              <div className="space-y-8">
                {/* Beneficio 1 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading">
                        Professionalism and Expertise
                      </h3>
                      <p className="text-gray-600">
                        We prides ourselves on maintaining a highly professional
                        and experienced team of cleaners.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-gray-200" />
                </div>

                {/* Beneficio 2 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading">
                        Comprehensive Cleaning Solutions
                      </h3>
                      <p className="text-gray-600">
                        Whether you need residential, commercial, or specialised
                        cleaning services, we offer a wide range of cleaning
                        solutions to meet your specific requirements.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-gray-200" />
                </div>

                {/* Beneficio 3 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading">
                        Good Practices
                      </h3>
                      <p className="text-gray-600">
                        If you value good practices, you&apos;ll be pleased to
                        know that we emphasise using quality cleaning products
                        and methods.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-gray-200" />
                </div>

                {/* Beneficio 4 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading">
                        Customer Satisfaction
                      </h3>
                      <p className="text-gray-600">
                        We places a strong emphasis on customer satisfaction.
                        They strive to exceed your expectations and ensure that
                        you are completely satisfied with their services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3"
                alt="Professional cleaning team at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        {/* <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Get in Touch</h2>
          <Card className="p-6">
            <form className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </Card>
        </div> */}
        <QuoteForm />
      </section>

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
