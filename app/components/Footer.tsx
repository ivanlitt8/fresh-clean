"use client";
import {
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useNavigation } from "@/app/context/NavigationContext";

export const Footer = () => {
  const { navigateToSection } = useNavigation();

  return (
    <footer className="bg-[#264E46] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="ml-2 text-lg font-bold">Fresh & Clean</span>
            </div>
            <p className="text-[#E6F4F1] opacity-80">
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
                <button
                  onClick={() => navigateToSection("/", "about")}
                  className="hover:text-[#D8F3A3] text-[#E6F4F1] transition-colors duration-300"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection("/", "services")}
                  className="hover:text-[#D8F3A3] text-[#E6F4F1] transition-colors duration-300"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection("/", "contact")}
                  className="hover:text-[#D8F3A3] text-[#E6F4F1] transition-colors duration-300"
                >
                  Contact
                </button>
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
        <div className="border-t border-[#4BA585] mt-8 pt-8 text-center text-[#E6F4F1]">
          <p>
            &copy; {new Date().getFullYear()} Fresh & Clean. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
