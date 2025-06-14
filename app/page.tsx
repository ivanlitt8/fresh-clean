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
import Link from "next/link";
import { CTASection } from "./components/CTASection";
import { Navbar } from "./components/Navbar";

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

  const features = [
    {
      text: "We treat your home like our own",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Always on time, focused, and reliable",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Transparent, respectful, and trustworthy team",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "We clean every corner — details matter",
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: "Passionate professionals who love what they do",
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

      <section className="py-20 bg-[#0B1C2C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 font-heading">
                Because cleaning is just the beginning
              </h2>
              <h3 className="text-4xl font-bold mb-8 font-heading">
                The Fresh & Clean Difference
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
                At Fresh & Clean, we combine international experience with a
                human, personalized approach. Our diverse and professional team
                has worked in homes and businesses across different countries,
                bringing excellence, discipline, and warmth to every service.{" "}
                <br /> <br />
                We believe cleaning is more than just a task — it&apos;s a way
                of caring, renewing, and creating well-being. That&apos;s why we
                carefully select each member of our team, prioritizing
                responsibility, strong ethics, and human quality. <br />
                <br /> We adapt to your real needs, offering close attention and
                clear, honest communication. When we step into a home, our goal
                isn&apos;t just to leave it clean — we want it to feel lighter,
                more harmonious, and truly refreshed.
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
            <Button
              variant="outline"
              size="lg"
              className="border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white"
              asChild
            >
              <Link href="/services">ALL SERVICES</Link>
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
            <div className="space-y-8 flex-1 max-w-2xl">
              <div>
                <p className="text-blue-600 font-medium uppercase tracking-wide mb-2 font-heading">
                  Simple, clear and designed around your needs.
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-heading">
                  How it works
                </h2>
              </div>

              {/* Pasos iterativos */}
              {[
                {
                  number: "01",
                  title: "Tell us what you need",
                  description:
                    "Fill out a short form or message us directly. Choose between general, deep, one-time or regular cleaning. Add details like number of rooms or extras like windows, ovens or fridge.",
                },
                {
                  number: "02",
                  title: "Get a tailored quote",
                  description:
                    "We'll ask a few key questions to better understand your space and your goals. Then, we'll send you a clear quote and a plan designed just for you.",
                },
                {
                  number: "03",
                  title: "Schedule your service",
                  description:
                    "Choose the best date and time for you. We're punctual, respectful and flexible with your routine.",
                },
                {
                  number: "04",
                  title: "We bring everything",
                  description:
                    "No need to worry about supplies — we arrive fully equipped with professional products and tools.",
                },
                {
                  number: "05",
                  title: "Enjoy your refreshed space",
                  description:
                    "We clean with care, precision and attention to detail. Once we finish, we'll check in with you to make sure everything met your expectations.",
                },
              ].map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="flex gap-6 md:gap-6">
                    <div className="text-[50px] md:text-[60px] font-bold leading-none text-[#e1ebf7] select-none min-w-[60px] md:min-w-[80px]">
                      {step.number}
                    </div>
                    <div className="pt-1 md:pt-2 flex-1">
                      <h3 className="text-md font-bold mb-3 font-heading">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < 4 && (
                    <div className="h-px bg-gray-200 mt-4 ml-[66px] md:ml-[90px]"></div>
                  )}
                </div>
              ))}

              {/* Botón Book Now */}
              <div className="flex justify-center md:justify-start pt-4">
                <Button
                  size="lg"
                  className="bg-[#00AEEF] hover:bg-[#0098d1] text-white font-semibold px-8"
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
                  Because cleaning is more than just a chore — it&apos;s about
                  trust, care, and transformation.
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
                        International Standards
                      </h3>
                      <p className="text-gray-600">
                        We bring global experience and attention to detail to
                        every home or business we serve.
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
                        Reliable & On Time
                      </h3>
                      <p className="text-gray-600">
                        Punctual, efficient and consistent — we show up when we
                        say we will and finish on schedule.
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
                        People You Can Trust
                      </h3>
                      <p className="text-gray-600">
                        Our team is respectful, discreet and committed to
                        quality. We build trust through real results.
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
                        Trusted for Results
                      </h3>
                      <p className="text-gray-600">
                        Over 90% of our clients recommend us — because we
                        deliver consistent, visible results that make a real
                        difference.
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
        <div className="max-w-3xl mx-auto">
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
        </div>
      </section>

      <CTASection onButtonClick={() => scrollToSection("contact")} />
    </main>
  );
}
