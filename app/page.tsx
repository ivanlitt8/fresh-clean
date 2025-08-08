"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { BubblesBackground } from "@/app/components/BubblesBackground";
import Link from "next/link";
import { CTASection } from "@/app/components/CTASection";
import { ContactService } from "@/app/lib/firebase";
import { ContactEmailService } from "@/app/lib/email/contactEmailService";
import { Contact } from "@/app/types/contact";
import { toast } from "sonner";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showLocations, setShowLocations] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [servicesPerPage, setServicesPerPage] = useState(3);

  const services = [
    {
      title: "After Construction Cleaning",
      description:
        "Post-renovation dust and debris? We handle it. Our team transforms newly built or refurbished spaces into clean, move-in-ready environments with care and precision.",
      image:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3",
    },
    {
      title: "End of Lease Cleaning",
      description:
        "Moving out? We take care of the full cleaning so you can focus on what's next. Detailed, bond-ready results trusted by tenants and property managers alike.",
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
    },
    {
      title: "Residential Cleaning",
      description:
        "Need help staying on top of the mess? We offer regular or one-off home cleaning services tailored to your lifestyle, with respect and attention to every detail.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Deep Cleaning",
      description:
        "Perfect for spring resets, special occasions or when things need more than a surface clean. We go deeper to revive your space and make it feel brand new.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Carpet Cleaning",
      description:
        "Bring life back to your carpets. We remove dirt, stains and allergens using fabric-safe methods — for fresher, softer and healthier floors.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Airbnb Cleaning",
      description:
        "We help you keep your short-term rental spotless between bookings. Flexible scheduling, reliable service, and detailed cleaning that impresses every guest — every time.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Commercial Cleaning",
      description:
        "Clean spaces create trust. Our tailored cleaning services for shops, clinics and studios keep your business welcoming, professional and spotless.",
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

  const features = [
    {
      text: "We treat your home like our own",
      icon: <Star className="h-5 w-5 text-[#D8F3A3]" />,
    },
    {
      text: "Always on time, focused, and reliable",
      icon: <Star className="h-5 w-5 text-[#D8F3A3]" />,
    },
    {
      text: "Transparent, respectful, and trustworthy team",
      icon: <Star className="h-5 w-5 text-[#D8F3A3]" />,
    },
    {
      text: "We clean every corner — details matter",
      icon: <Star className="h-5 w-5 text-[#D8F3A3]" />,
    },
    {
      text: "Passionate professionals who love what they do",
      icon: <Star className="h-5 w-5 text-[#D8F3A3]" />,
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

  // Función para limpiar el formulario
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setMessage("");
  };

  // Función para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar el envío del formulario
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus("error");
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar formato del email
    if (!isValidEmail(email.trim())) {
      setFormStatus("error");
      toast.error("Por favor, ingresa un email válido.");
      return;
    }

    setIsLoading(true);
    setFormStatus("idle");

    const contactService = new ContactService();
    const contactEmailService = new ContactEmailService();

    try {
      // Crear objeto de contacto
      const contactData: Omit<Contact, "id"> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        message: message.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Enviando formulario de contacto:", contactData);

      // Guardar en Firebase
      const contactId = await contactService.createContact(contactData);
      console.log("Contacto guardado en Firebase con ID:", contactId);

      // Crear objeto completo con ID para enviar por email
      const contactWithId: Contact = {
        id: contactId,
        ...contactData,
      };

      // Enviar emails
      try {
        await contactEmailService.sendContactNotification(contactWithId);
        console.log("Emails enviados exitosamente");
      } catch (emailError) {
        console.error("Error enviando emails:", emailError);
        // No lanzamos error aquí para no afectar la experiencia del usuario
      }

      // Mostrar mensaje de éxito
      setFormStatus("success");
      resetForm();
      toast.success("¡Gracias por tu mensaje! Te responderemos pronto.");

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error enviando formulario de contacto:", error);
      setFormStatus("error");
      toast.error(
        "Hubo un problema al enviar tu mensaje. Por favor intentá de nuevo."
      );

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } finally {
      setIsLoading(false);
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
        href="https://wa.me/61426459726"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
      </a>

      <section className="relative min-h-[80vh] pt-32 pb-20 px-4 bg-gradient-to-b from-[#E6F4F1] to-white overflow-hidden">
        <div className="absolute inset-0 bg-white/30"></div>
        <BubblesBackground />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-[#264E46] mb-6 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Professional Cleaning Services for Your Home & Office
          </motion.h1>
          <motion.p
            className="text-xl text-[#264E46] mb-8 max-w-2xl mx-auto"
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
              className="bg-[#4BA585] hover:bg-[#3d8a70] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/book">Book Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#4BA585] text-[#4BA585] hover:bg-[#4BA585] hover:text-white transition-all duration-300"
              onClick={() => scrollToSection("how-it-works")}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#264E46] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[#4BA585] mb-4 font-heading">
                Because cleaning is just the beginning
              </h2>
              <h3 className="text-4xl font-bold mb-8 font-heading">
                The Helping Crew Difference
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
                className="mt-8 bg-[#4BA585] hover:bg-[#3d8a70] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                asChild
              >
                <Link href="/locations/northern-beaches">Where We Work</Link>
              </Button>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//first.jpg"
                alt="Professional cleaning team"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-[#E6F4F1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 font-heading text-[#264E46]">
                About Helping Crew
              </h2>
              <p className="text-[#264E46] mb-6 opacity-90">
                At Helping Crew, we combine international experience with a
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
                  <CheckCircle className="h-5 w-5 text-[#4BA585] mr-2" />
                  <span className="text-[#264E46]">Experienced Team</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#4BA585] mr-2" />
                  <span className="text-[#264E46]">Eco-friendly Products</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#4BA585] mr-2" />
                  <span className="text-[#264E46]">100% Satisfaction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#4BA585] mr-2" />
                  <span className="text-[#264E46]">Flexible Scheduling</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//second.jpg"
                alt="Cleaning professional at work"
                className="rounded-lg object-cover w-full h-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold font-heading text-[#264E46]">
              Our Cleaning Services
            </h2>
            <Button
              variant="outline"
              size="lg"
              className="border-[#4BA585] text-[#4BA585] hover:bg-[#4BA585] hover:text-white transition-all duration-300"
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
                          <div className="group relative overflow-hidden rounded-lg h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="relative h-[300px] overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                              <h3 className="text-2xl font-semibold mb-3 font-heading text-[#264E46]">
                                {service.title}
                              </h3>
                              <p className="text-[#264E46] mb-4 opacity-80 flex-grow">
                                {service.description}
                              </p>
                              <Button
                                className="w-full bg-[#E6F4F1] text-[#4BA585] hover:bg-[#4BA585] hover:text-white transition-all duration-300 border border-[#4BA585] mt-auto"
                                asChild
                              >
                                <Link href="/book">BOOK NOW</Link>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 z-10 hover:bg-[#E6F4F1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setCarouselIndex((prev) => Math.max(prev - 1, 0));
                setIsAutoPlaying(false);
              }}
              disabled={carouselIndex === 0}
            >
              <ChevronLeft className="h-6 w-6 text-[#4BA585]" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 z-10 hover:bg-[#E6F4F1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setCarouselIndex((prev) => Math.min(prev + 1, totalPages - 1));
                setIsAutoPlaying(false);
              }}
              disabled={carouselIndex === totalPages - 1}
            >
              <ChevronRight className="h-6 w-6 text-[#4BA585]" />
            </button>

            {/* Indicadores de página */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    carouselIndex === idx ? "bg-[#4BA585]" : "bg-[#CBD5D1]"
                  } hover:bg-[#D8F3A3]`}
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
      <section className="py-20 px-4 bg-[#E6F4F1]" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Columna Izquierda - Imagen */}
            <div className="relative h-[400px] md:h-[800px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//third.jpg"
                alt="Cleaning professional at work"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Columna Derecha - Proceso */}
            <div className="space-y-8 flex-1 max-w-2xl">
              <div>
                <p className="text-[#4BA585] font-medium uppercase tracking-wide mb-2 font-heading">
                  Simple, clear and designed around your needs.
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#264E46]">
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
                    <div className="text-[50px] md:text-[60px] font-bold leading-none text-[#CBD5D1] select-none min-w-[60px] md:min-w-[80px]">
                      {step.number}
                    </div>
                    <div className="pt-1 md:pt-2 flex-1">
                      <h3 className="text-md font-bold mb-3 font-heading text-[#264E46]">
                        {step.title}
                      </h3>
                      <p className="text-[#264E46] text-sm leading-relaxed opacity-80">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < 4 && (
                    <div className="h-px bg-[#CBD5D1] mt-4 ml-[66px] md:ml-[90px]"></div>
                  )}
                </div>
              ))}

              {/* Botón Book Now */}
              <div className="flex justify-center md:justify-start pt-4">
                <Button
                  size="lg"
                  className="bg-[#4BA585] hover:bg-[#3d8a70] text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/book">BOOK NOW</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Columna Izquierda - Contenido */}
            <div className="flex flex-col gap-8 order-2 md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-[#264E46]">
                  Why Choose Helping Crew ?
                </h2>
                <p className="text-[#264E46] text-lg opacity-80">
                  Because cleaning is more than just a chore — it&apos;s about
                  trust, care, and transformation.
                </p>
              </div>

              <div className="space-y-8">
                {/* Beneficio 1 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4BA585] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading text-[#264E46]">
                        International Standards
                      </h3>
                      <p className="text-[#264E46] opacity-80">
                        We bring global experience and attention to detail to
                        every home or business we serve.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-[#CBD5D1]" />
                </div>

                {/* Beneficio 2 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4BA585] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading text-[#264E46]">
                        Reliable & On Time
                      </h3>
                      <p className="text-[#264E46] opacity-80">
                        Punctual, efficient and consistent — we show up when we
                        say we will and finish on schedule.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-[#CBD5D1]" />
                </div>

                {/* Beneficio 3 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4BA585] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading text-[#264E46]">
                        People You Can Trust
                      </h3>
                      <p className="text-[#264E46] opacity-80">
                        Our team is respectful, discreet and committed to
                        quality. We build trust through real results.
                      </p>
                    </div>
                  </div>
                  <hr className="my-6 border-[#CBD5D1]" />
                </div>

                {/* Beneficio 4 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4BA585] flex items-center justify-center mt-1">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-heading text-[#264E46]">
                        Trusted for Results
                      </h3>
                      <p className="text-[#264E46] opacity-80">
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
            <div className="relative h-[400px] md:h-[650px] rounded-3xl overflow-hidden shadow-xl order-1 md:order-2">
              <img
                src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//quarter.jpg"
                alt="Professional cleaning team at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#264E46]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              What Our Clients Say
            </h2>
            <p className="text-xl text-[#D8F3A3] opacity-90">
              Real feedback from real people
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#4BA585] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>
              <blockquote className="text-white text-lg leading-relaxed mb-6 text-center">
                &quot;The Helping Crew team saved our routine. They&apos;re
                fast, meticulous, and always leave everything better than we
                imagined.&quot;
              </blockquote>
              <div className="text-center">
                <p className="text-white font-semibold font-heading text-xl">
                  — Tiffany, Avalon
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#4BA585] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>
              <blockquote className="text-white text-lg leading-relaxed mb-6 text-center">
                &quot;I tried several companies in Palm Beach, but they&apos;re
                the only ones who stick to the schedule, communicate well, and
                do a deep clean. I&apos;m happy.&quot;
              </blockquote>
              <div className="text-center">
                <p className="text-white font-semibold font-heading text-xl">
                  — Mónica, Palm Beach
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#4BA585] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>
              <blockquote className="text-white text-lg leading-relaxed mb-6 text-center">
                &quot;I felt at home the moment I walked in. They don&apos;t
                just clean — they transform the energy of the place. Highly
                recommended!&quot;
              </blockquote>
              <div className="text-center">
                <p className="text-white font-semibold font-heading text-xl">
                  — Jess, Newport
                </p>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-[#4BA585] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>
              <blockquote className="text-white text-lg leading-relaxed mb-6 text-center">
                &quot;Reliable, kind, effective. I love the way they work, and
                the results are excellent.&quot;
              </blockquote>
              <div className="text-center">
                <p className="text-white font-semibold font-heading text-xl">
                  — Mel, Bilgola
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 bg-[#E6F4F1]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#264E46] mb-4 font-heading">
              Have a Question?
            </h2>
            <p className="text-xl text-[#264E46] mb-2">
              We&apos;re here to help
            </p>
            <p className="text-[#264E46] opacity-80">
              Write to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Form */}
          <Card className="p-8 shadow-xl bg-white border-0">
            <form className="space-y-6" onSubmit={handleSubmitContact}>
              {/* Status Messages */}
              {formStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-medium">
                    Thank you for your message! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              {formStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-red-800 font-medium">
                    There was a problem sending your message. Please try again.
                  </p>
                </div>
              )}

              {/* Name and Email Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#264E46] mb-2"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-[#CBD5D1] focus:border-[#4BA585] focus:ring-[#4BA585] text-[#264E46] h-12"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#264E46] mb-2"
                  >
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`border-[#CBD5D1] focus:border-[#4BA585] focus:ring-[#4BA585] text-[#264E46] h-12 ${
                      email && !isValidEmail(email)
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    aria-invalid={
                      email && !isValidEmail(email) ? "true" : "false"
                    }
                  />
                  {email && !isValidEmail(email) && (
                    <span className="text-red-600 text-xs mt-1 block">
                      Please enter a valid email address.
                    </span>
                  )}
                </div>
              </div>

              {/* Phone and Address Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#264E46] mb-2"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-[#CBD5D1] focus:border-[#4BA585] focus:ring-[#4BA585] text-[#264E46] h-12"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-[#264E46] mb-2"
                  >
                    Address or Area
                  </label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Your address or area (e.g., Northern Beaches)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-[#CBD5D1] focus:border-[#4BA585] focus:ring-[#4BA585] text-[#264E46] h-12"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#264E46] mb-2"
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your cleaning needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="border-[#CBD5D1] focus:border-[#4BA585] focus:ring-[#4BA585] text-[#264E46] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4BA585] hover:bg-[#3d8a70] text-white font-semibold py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <CTASection onButtonClick={() => scrollToSection("contact")} />
    </main>
  );
}
