"use client";

import type React from "react";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const services = [
  {
    id: "general",
    name: "General Cleaning",
    duration: "2-3 horas",
    description: "Complete cleaning of all areas",
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    duration: "4-6 horas",
    description: "Detailed cleaning including hard-to-reach areas",
  },
  {
    id: "post-construction",
    name: "Post-Construction Cleaning",
    duration: "6-8 horas",
    description: "Specialized cleaning after construction",
  },
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

type OccupiedSlotsType = { [key: string]: string[] };

const occupiedSlots: OccupiedSlotsType = {
  "2024-12-20": ["10:00", "14:00"],
  "2024-12-21": ["09:00", "15:00", "16:00"],
};

type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    title: "Service Details",
    description: "Select your service and preferred date",
  },
  {
    title: "Your Information",
    description: "Fill in your contact details",
  },
  {
    title: "Confirm Booking",
    description: "Review and confirm your appointment",
  },
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    comments: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fechas bloqueadas (fines de semana y fechas pasadas)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Bloquear fechas pasadas y fines de semana
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  // Obtener horarios disponibles para la fecha seleccionada
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const occupied = occupiedSlots[dateKey] || [];

    return timeSlots.filter((slot) => !occupied.includes(slot));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!selectedService) newErrors.service = "Select a service";
        if (!selectedDate) newErrors.date = "Select a date";
        if (!selectedTime) newErrors.time = "Select a time";
        break;
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Invalid email";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone is required";
        } else if (!/^\d{8,}$/.test(formData.phone.replace(/\s/g, ""))) {
          newErrors.phone = "Invalid phone (minimum 8 digits)";
        }
        break;
      case 2:
        if (!acceptTerms)
          newErrors.terms = "You must accept the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Reserva enviada:", {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        ...formData,
        acceptTerms,
      });
      alert("Booking confirmed! We will contact you soon.");
      // Reset form
      setCurrentStep(0);
      setSelectedService("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setFormData({ fullName: "", email: "", phone: "", comments: "" });
      setAcceptTerms(false);
    } catch (error) {
      alert("Error processing booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                "flex flex-col items-center space-y-2",
                currentStep === index ? "text-primary" : "text-gray-500"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  currentStep === index
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300",
                  currentStep > index
                    ? "bg-primary border-primary text-white"
                    : ""
                )}
              >
                {currentStep > index ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 0 && (
              <>
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Service
                  </Label>
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger
                      className={errors.service ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-xs text-gray-500">
                              {service.duration} • {service.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-xs text-red-500">{errors.service}</p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Booking Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP", { locale: enUS })
                          : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        disabled={isDateDisabled}
                        initialFocus
                        locale={enUS}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-xs text-red-500">{errors.date}</p>
                  )}
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available Time
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getAvailableTimeSlots().map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="h-10"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-xs text-red-500">{errors.time}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+1 234 567 8900"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comments">
                    Additional Comments (Optional)
                  </Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        comments: e.target.value,
                      }))
                    }
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Service:</span>{" "}
                      {services.find((s) => s.id === selectedService)?.name}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {selectedDate
                        ? format(selectedDate, "PPP", { locale: enUS })
                        : ""}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {selectedTime}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {formData.phone}
                    </p>
                    {formData.comments && (
                      <p>
                        <span className="font-medium">Comments:</span>{" "}
                        {formData.comments}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      }
                      className={errors.terms ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none"
                      >
                        I accept the terms and conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                        >
                          View terms and conditions
                        </button>
                      </p>
                    </div>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-red-500">{errors.terms}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
