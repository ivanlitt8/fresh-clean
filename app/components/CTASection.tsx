import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const CTASection = ({
  title = "¡Comienza tu servicio de limpieza con nuestra ayuda!",
  description = "Contacta a No Sweat Cleaning Services hoy para descubrir cómo podemos transformar tu espacio en un refugio impecable, sin importar dónde te encuentres en Sydney.",
  buttonText = "CONTÁCTANOS",
  onButtonClick,
}: CTASectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-16 sm:px-12 md:py-20 lg:py-24 relative">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {title}
              </h2>
              <p className="text-lg text-blue-100 mb-8">{description}</p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
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
