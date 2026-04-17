'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface QuoteFormModalProps {
  open: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultPackage?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  transferType: string;
  vehiclePreference: string;
  date: string;
  specialRequests: string;
}

const transferTypes = [
  { value: 'airport-transfer', label: 'Airport Transfer' },
  { value: 'city-tour', label: 'City Tour' },
  { value: 'coastal-drive', label: 'Coastal Drive' },
  { value: 'mountain-adventure', label: 'Mountain Adventure' },
  { value: 'private-charter', label: 'Private Charter' },
  { value: 'other', label: 'Other' },
];

const vehiclePreferences = [
  { value: 'executive', label: 'Executive' },
  { value: 'prestige', label: 'Prestige' },
  { value: 'grand', label: 'Grand' },
  { value: 'flexible', label: 'Flexible' },
];

export default function QuoteFormModal({
  open,
  onClose,
  defaultCategory,
  defaultPackage,
}: QuoteFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    transferType: defaultCategory || '',
    vehiclePreference: 'flexible',
    date: '',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [open, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically send the data to your backend
      console.log('Form submitted:', {
        ...formData,
        package: defaultPackage,
      });

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          transferType: defaultCategory || '',
          vehiclePreference: 'flexible',
          date: '',
          specialRequests: '',
        });
        setSubmitSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl bg-white">
          {/* Header */}
          <div className="sticky top-0 bg-deep-emerald text-white px-6 py-6 flex items-center justify-between border-b border-antique-gold/20">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Request a Quote
              </h2>
              <p className="text-white/70 text-sm font-nav mt-1">
                {defaultPackage
                  ? `For: ${defaultPackage}`
                  : 'Get your personalized transfer quote'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-emerald/10 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-antique-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-deep-emerald mb-2">
                  Quote Request Submitted
                </h3>
                <p className="text-deep-emerald/70 font-nav text-sm">
                  Thank you! We'll be in touch shortly with your personalized
                  transfer quote.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald placeholder-deep-emerald/40 focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald placeholder-deep-emerald/40 focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald placeholder-deep-emerald/40 focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300"
                    placeholder="+94 (0) 123 456 789"
                  />
                </div>

                {/* Transfer Type */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Transfer Type
                  </label>
                  <select
                    name="transferType"
                    value={formData.transferType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select a transfer type</option>
                    {transferTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Preference */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Vehicle Preference
                  </label>
                  <select
                    name="vehiclePreference"
                    value={formData.vehiclePreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300 appearance-none bg-white cursor-pointer"
                  >
                    {vehiclePreferences.map((pref) => (
                      <option key={pref.value} value={pref.value}>
                        {pref.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-nav font-semibold text-deep-emerald mb-2 uppercase tracking-wide">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-deep-emerald/20 rounded-lg font-nav text-deep-emerald placeholder-deep-emerald/40 focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/20 transition-all duration-300 resize-none"
                    placeholder="Any special requirements or preferences..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 px-6 py-3 bg-deep-emerald text-white font-nav font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-deep-emerald/90 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Request Quote'
                  )}
                </button>

                {/* Note */}
                <p className="text-xs text-deep-emerald/60 font-nav text-center pt-2">
                  We'll respond within 24 hours with a personalized quote
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
