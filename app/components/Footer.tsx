"use client";
import { useState } from "react";
import { Clock, MapPin, PhoneCall, Sparkles, FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigation } from "@/app/context/NavigationContext";

export const Footer = () => {
  const { navigateToSection } = useNavigation();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <footer className="bg-[#264E46] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="ml-2 text-lg font-bold">Helping Crew</span>
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
                <span>(+61) 426459726</span>
              </div>
              <Dialog
                open={isTermsModalOpen}
                onOpenChange={setIsTermsModalOpen}
              >
                <DialogTrigger asChild>
                  <button
                    className="flex items-center hover:text-[#D8F3A3] transition-colors duration-300"
                    onClick={() => setIsTermsModalOpen(true)}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    <span>Terms & Conditions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Terms and Conditions</span>
                      {/* <button
                        onClick={() => setIsTermsModalOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </button> */}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 h-[60vh] overflow-hidden">
                    <iframe
                      src="https://docs.google.com/document/d/e/2PACX-1vQ9TBEizZ0oE2DlmYrcM3OBo-yU4kutd5sJbG1snA86Mwn7aDld5v5t5exjdAN2rSI-hFOZy3uosiXv/pub?embedded=true"
                      className="w-full h-full border-0"
                      title="Terms and Conditions"
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
            &copy; {new Date().getFullYear()} Helping Crew. All rights reserved.
            Developed by{" "}
            <a
              href="https://portfolio-ivan-litt.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D8F3A3] hover:text-white transition-colors duration-300 underline"
            >
              Studio88
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
