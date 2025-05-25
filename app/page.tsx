'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MapPin, PhoneCall, Sparkles, CheckCircle, ArrowRight, Calendar, MessageSquare, ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showLocations, setShowLocations] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const services = [
      {
        title: 'Airbnb Cleaning',
        description: 'Airbnb cleaning services are professional services specifically designed to clean Airbnb properties.',
        image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3',
      },
      {
        title: 'After Construction Cleaning',
        description: 'Do you need professional and reliable after-construction cleaning services in Sydney? Look no further',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3',
      },
      {
        title: 'End of Lease Cleaning',
        description: 'No Sweat Cleaning is a professional cleaning company that specialises in end-of-lease cleaning.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',
      },
      {
        title: 'Residential Cleaning',
        description: 'Do you ever feel like you’re constantly cleaning your house, but it never seems clean enough?',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',

      },
      {
        title: 'Deep Cleaning',
        description: 'Are you looking for a professional cleaning service that specialises in deep cleaning?',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',

      },
      {
        title: 'Carpet Cleaning',
        description: 'Let us delve into the world of carpet cleaning and discover how No Sweat Cleaning can transform your space.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',

      },
      {
        title: 'Commercial Cleaning',
        description: 'When it comes to maintaining a clean and sanitary work environment, businesses in Sydney’s Northern Beaches turn to No Sweat Cleaning.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',

      },
      {
        title: 'Office Cleaning',
        description: 'A clean office creates a positive impression on visitors and employees alike. It shows that the company is organised, professional, and cares about its employees.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',
      },
      {
        title: 'Strata Cleaning',
        description: 'In properties with strata titles, such as apartment buildings, condominiums, or business complexes, common areas are cleaned and maintained as part of the strata cleaning service.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',
      }
    ]    
  ];

  const locations = [
    'Downtown',
    'North Side',
    'South Side',
    'East Side',
    'West Side',
  ];

  const servicesList = [
    'House Cleaning',
    'Office Cleaning',
    'Deep Cleaning',
    'Move-in/Move-out Cleaning',
    'Post-construction Cleaning',
  ];

  const features = [
    {
      text: '100% Guaranteed',
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: 'Liaise directly with real estate to secure bond',
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: '50+ 5 Star Google Reviews',
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: 'Flexible, Local, Trusted by 100+ clients',
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      text: 'Accept credit cards including Amex',
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
  ];

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
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-primary">About</a>
              
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button className="text-gray-600 hover:text-primary flex items-center">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {showServices && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    {servicesList.map((service, index) => (
                      <a
                        key={index}
                        href="#services"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Locations Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowLocations(true)}
                onMouseLeave={() => setShowLocations(false)}
              >
                <button className="text-gray-600 hover:text-primary flex items-center">
                  Locations <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {showLocations && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    {locations.map((location, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {location}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <Button>Book Now</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Cleaning Services for Your Home & Office
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the difference with our expert cleaning services. We bring sparkle to every corner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Book Now</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B1C2C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">CLEANING MADE EASY</h2>
              <h3 className="text-4xl font-bold mb-8">The No Sweat Difference</h3>
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

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Our Cleaning Services</h2>
            <Button variant="outline" size="lg">
              ALL SERVICES
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="relative h-[300px] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button 
                    className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    BOOK NOW
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About Fresh & Clean</h2>
              <p className="text-gray-600 mb-6">
                Fresh & Clean is your trusted partner in maintaining a clean and healthy environment. 
                With years of experience and a dedicated team of professionals, we deliver exceptional 
                cleaning services that exceed expectations.
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
                <li><a href="#about" className="hover:text-primary">About Us</a></li>
                <li><a href="#services" className="hover:text-primary">Services</a></li>
                <li><a href="#contact" className="hover:text-primary">Contact</a></li>
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
            <p>&copy; {new Date().getFullYear()} Fresh & Clean. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}