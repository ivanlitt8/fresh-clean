"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FormData } from "@/app/book/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Upload } from "lucide-react";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";
import { calculateTotalRooms } from "@/app/lib/pricing-config";

interface BookingFormProps {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  steps: { id: number; title: string }[];
  onConfirm: () => void;
}

const services = [
  "Airbnb Cleaning",
  "Builders/Construction",
  "End of Lease Cleaning",
  "Deep Cleaning",
  "Carpet Cleaning",
  "Commercial Cleaning",
  "Office Cleaning",
  "Residential Cleaning",
  "Strata Cleaning",
];

const frequencies = ["One time", "Weekly", "Bi-weekly", "Monthly"];

const roomCounts = ["0", "1", "2", "3", "4", "5+"];

// Funciones de validación por paso
const validateStep1 = (formData: FormData): boolean => {
  return Boolean(formData.service && formData.frequency);
};

const validateStep2 = (formData: FormData): boolean => {
  // Al menos debe tener un ambiente seleccionado (mayor a 0)
  const hasRooms =
    parseInt(formData.bedrooms) > 0 ||
    parseInt(formData.bathrooms) > 0 ||
    parseInt(formData.kitchens) > 0 ||
    parseInt(formData.livingRooms) > 0 ||
    parseInt(formData.otherSpaces) > 0;
  return hasRooms;
};

const validateStep3 = (formData: FormData): boolean => {
  return Boolean(formData.date && formData.time);
};

const validateStep4 = (formData: FormData): boolean => {
  return Boolean(
    formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.email?.trim() &&
      formData.phone?.trim() &&
      formData.address?.trim() &&
      formData.postalCode?.trim() &&
      formData.acceptTerms
  );
};

export default function BookingForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  steps,
  onConfirm,
}: BookingFormProps) {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Función para validar el paso actual
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1(formData);
      case 2:
        return validateStep2(formData);
      case 3:
        return validateStep3(formData);
      case 4:
        return validateStep4(formData);
      case 5:
        return true; // El paso 5 es solo resumen
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderServiceSelection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          Service Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.service}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, service: value }))
          }
        >
          <SelectTrigger className={!formData.service ? "border-red-200" : ""}>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Frequency <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, frequency: value }))
          }
        >
          <SelectTrigger
            className={!formData.frequency ? "border-red-200" : ""}
          >
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((frequency) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPropertyDetails = () => {
    const totalRooms = calculateTotalRooms(
      formData.bedrooms,
      formData.bathrooms,
      formData.kitchens,
      formData.livingRooms,
      formData.otherSpaces
    );

    return (
      <div className="space-y-4">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Total rooms:</strong> {totalRooms} rooms
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Select the quantity of each room type. At least one must be greater
            than 0.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select
              value={formData.bedrooms}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bedrooms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roomCounts.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Select
              value={formData.bathrooms}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bathrooms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roomCounts.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kitchens</Label>
            <Select
              value={formData.kitchens}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, kitchens: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roomCounts.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Living Rooms</Label>
            <Select
              value={formData.livingRooms}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, livingRooms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roomCounts.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Other Spaces</Label>
            <Select
              value={formData.otherSpaces}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, otherSpaces: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {roomCounts.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Images (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData((prev) => ({ ...prev, images: files }));
              }}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-1" />
              <span className="text-gray-600 text-sm">
                Drag your images here or click to upload
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                Maximum size: 5MB
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderDateAndTime = () => (
    <DateTimeSelector formData={formData} setFormData={setFormData} />
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="Your first name"
            className={!formData.firstName?.trim() ? "border-red-200" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Your last name"
            className={!formData.lastName?.trim() ? "border-red-200" : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="your@email.com"
          className={!formData.email?.trim() ? "border-red-200" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="+1 234 567 8900"
          className={!formData.phone?.trim() ? "border-red-200" : ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>
            Service Address <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Enter the complete address where the service will be performed"
            className={!formData.address?.trim() ? "border-red-200" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Postal Code <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.postalCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, postalCode: e.target.value }))
            }
            placeholder="12345"
            className={!formData.postalCode?.trim() ? "border-red-200" : ""}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              acceptTerms: checked as boolean,
            }))
          }
          className={!formData.acceptTerms ? "border-red-200" : ""}
        />
        <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
          <DialogTrigger asChild>
            <label
              htmlFor="terms"
              className={`text-sm underline leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-600 ${
                !formData.acceptTerms ? "text-red-500" : "text-gray-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsTermsModalOpen(true);
              }}
            >
              I accept the terms and conditions{" "}
              <span className="text-red-500">*</span>
            </label>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between"></DialogTitle>
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
      </div>
    </div>
  );

  const renderSummary = () => {
    const totalRooms = calculateTotalRooms(
      formData.bedrooms,
      formData.bathrooms,
      formData.kitchens,
      formData.livingRooms,
      formData.otherSpaces
    );

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Booking Summary</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Service:</span>
              <p className="font-medium">{formData.service}</p>
            </div>
            <div>
              <span className="text-gray-600">Frequency:</span>
              <p className="font-medium">{formData.frequency}</p>
            </div>
            <div>
              <span className="text-gray-600">Total Rooms:</span>
              <p className="font-medium">{totalRooms} rooms</p>
            </div>
            <div>
              <span className="text-gray-600">Breakdown:</span>
              <p className="font-medium text-xs">
                {formData.bedrooms}B • {formData.bathrooms}Ba •{" "}
                {formData.kitchens}K • {formData.livingRooms}L •{" "}
                {formData.otherSpaces}O
              </p>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">
                {formData.date &&
                  format(formData.date, "PPP", { locale: enUS })}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <p className="font-medium">{formData.time}</p>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{`${formData.firstName} ${formData.lastName}`}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{formData.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">Postal Code:</span>
              <p className="font-medium">{formData.postalCode}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Address:</span>
              <p className="font-medium">{formData.address}</p>
            </div>
          </div>

          {formData.additionalNotes && (
            <div className="col-span-2">
              <span className="text-gray-600">Additional Notes:</span>
              <p className="font-medium">{formData.additionalNotes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderPropertyDetails();
      case 3:
        return renderDateAndTime();
      case 4:
        return renderPersonalInfo();
      case 5:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">{renderStepContent()}</div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep === steps.length ? (
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={onConfirm}
            disabled={!isCurrentStepValid()}
          >
            Confirm Booking
          </Button>
        ) : (
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
          >
            {isCurrentStepValid() ? (
              "Next"
            ) : (
              <span className="text-sm">Next</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
