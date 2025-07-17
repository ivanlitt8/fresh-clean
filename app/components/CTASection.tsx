import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const CTASection = ({
  title = "Start your cleaning service with our help!",
  description = "Contact Fresh & Clean Cleaning Services today to find out how we can transform your space into a spotless haven, no matter where you are in Sydney.",
  buttonText = "Contact us",
  onButtonClick,
}: CTASectionProps) => {
  return (
    <section className="py-20 bg-[#E6F4F1]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#4BA585] to-[#3d8a70] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-16 sm:px-12 md:py-20 lg:py-24 relative">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                {title}
              </h2>
              <p className="text-lg text-[#E6F4F1] mb-8">{description}</p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#4BA585] hover:bg-[#E6F4F1] hover:text-[#264E46] transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onButtonClick}
              >
                {buttonText}
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('/bubbles-pattern.svg')] opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
