import React, { useState } from "react";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import "../styles/resellers.css";

const PARTNER_TYPES = [
  {
    id: "tour_op",
    icon: "🗺",
    name: "Tour operator",
    sub: "Day trips and packages",
  },
  {
    id: "corporate",
    icon: "🏢",
    name: "Corporate",
    sub: "Retreats and gifting",
  },
  {
    id: "hotel",
    icon: "🏨",
    name: "Hotel or villa",
    sub: "Guest amenity",
  },
  {
    id: "vendor",
    icon: "🤝",
    name: "Vendor partner",
    sub: "Referral sales",
  },
  {
    id: "activity",
    icon: "🏄",
    name: "Activity provider",
    sub: "Surf, yoga and more",
  },
  {
    id: "other",
    icon: "✦",
    name: "Other",
    sub: "Something else",
  },
];

const STEPS = [
  {
    heading: "Partner type",
    sub: "Select the option that best describes you.",
    fields: [
      {
        id: "partnerType",
        label: "What kind of partner are you?",
        type: "type-grid",
        required: true,
      },
    ],
  },
  {
    heading: "Your details",
    sub: "Tell us who you are and what you run.",
    fields: [
      {
        id: "name",
        label: "Your full name",
        type: "text",
        placeholder: "e.g. Priya Mendis",
        required: true,
      },
      {
        id: "business",
        label: "Business or organisation name",
        type: "text",
        placeholder: "e.g. Surf Lanka Tours",
        required: true,
      },
    ],
  },
  {
    heading: "Your reach",
    sub: "Help us understand your sales potential.",
    fields: [
      {
        id: "location",
        label: "Where are you based?",
        type: "text",
        placeholder: "e.g. Ahangama, Galle, Colombo",
        required: true,
      },
      {
        id: "volume",
        label: "Estimated passes you could sell per month",
        type: "select",
        required: true,
        options: ["1-5", "6-15", "16-40", "41-100", "100+", "Not sure yet"],
      },
    ],
  },
  {
    heading: "Contact info",
    sub: "How we'll reach you with next steps.",
    fields: [
      {
        id: "email",
        label: "Email address",
        type: "email",
        placeholder: "you@yourbusiness.com",
        required: true,
      },
      {
        id: "phone",
        label: "WhatsApp or phone number",
        type: "tel",
        placeholder: "+94 77 000 0000",
        required: true,
      },
    ],
  },
  {
    heading: "Quick pitch",
    sub: "One last thing. Tell us why this is a good fit.",
    fields: [
      {
        id: "channel",
        label: "How would you reach pass buyers?",
        type: "select",
        required: true,
        options: [
          "Through guests or clients directly",
          "Social media and online",
          "Walk-in or physical location",
          "Wholesale to other businesses",
          "Mix of the above",
          "Other",
        ],
      },
      {
        id: "motivation",
        label: "Why do you want to offer the Ahangama Pass?",
        type: "textarea",
        placeholder:
          "Tell us briefly what makes this a good fit for your business and your guests.",
        required: true,
      },
    ],
  },
  {
    heading: "Terms and conditions",
    sub: "Almost done. Please read and confirm below.",
    fields: [
      {
        id: "termsAgreed",
        type: "checkbox",
        required: true,
      },
    ],
  },
];

const INITIAL_DATA = {
  partnerType: "",
  name: "",
  business: "",
  location: "",
  volume: "",
  email: "",
  phone: "",
  channel: "",
  motivation: "",
  termsAgreed: false,
};

function validateStep(stepIndex, data) {
  const step = STEPS[stepIndex];
  const errors = {};

  step.fields.forEach((field) => {
    const value = data[field.id];

    if (field.type === "checkbox") {
      if (!value) {
        errors[field.id] =
          "You must agree to the terms to submit your application.";
      }
      return;
    }

    if (field.required && !String(value || "").trim()) {
      errors[field.id] =
        field.type === "type-grid"
          ? "Please select a partner type."
          : "This field is required.";
      return;
    }

    if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
    ) {
      errors[field.id] = "Please enter a valid email address.";
    }
  });

  return errors;
}

function SuccessState({ name, email }) {
  const firstName = name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="reseller-success-box">
      <div className="reseller-success-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#005f6b" strokeWidth="1.5" />
          <path
            d="M8 12.5l3.5 3.5 5.5-7"
            stroke="#005f6b"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>Application received</h3>
      <p>
        Thanks, <strong>{firstName}</strong>.
        <br />
        We'll review your application and be in touch within 2-3 business days
        at
        <strong> {email}</strong>.
      </p>
    </div>
  );
}

export default function Resellers() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentStep = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const updateField = (fieldId, value) => {
    setData((current) => ({ ...current, [fieldId]: value }));
    setErrors((current) => {
      if (!current[fieldId]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldId];
      return nextErrors;
    });
  };

  const handleNext = () => {
    const nextErrors = validateStep(step, data);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStep((current) => current + 1);
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (isFirst) {
      return;
    }

    setStep((current) => current - 1);
    setErrors({});
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const nextErrors = validateStep(step, data);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/.netlify/functions/send-reseller-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.error || "Could not send your application right now.",
        );
      }

      setIsSuccess(true);
      setStep(STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting reseller application:", error);
      setSubmitError(
        "Could not submit your application. Please try again or contact hello@ahangama.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const error = errors[field.id];
    const className = `reseller-field${error ? " has-error" : ""}`;

    if (field.type === "type-grid") {
      return (
        <div key={field.id} className={className}>
          <label className="reseller-label">{field.label}</label>
          <div className="reseller-type-grid">
            {PARTNER_TYPES.map((option) => {
              const selected = data.partnerType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`reseller-type-card${selected ? " selected" : ""}`}
                  onClick={() => updateField("partnerType", option.id)}
                >
                  <span className="reseller-type-icon" aria-hidden="true">
                    {option.icon}
                  </span>
                  <span className="reseller-type-name">{option.name}</span>
                  <span className="reseller-type-sub">{option.sub}</span>
                </button>
              );
            })}
          </div>
          {error ? <div className="reseller-error-msg">{error}</div> : null}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div key={field.id} className="reseller-field">
          <label
            className={`reseller-checkbox-wrap${data.termsAgreed ? " checked" : ""}${
              error ? " error" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(data.termsAgreed)}
              onChange={(event) =>
                updateField("termsAgreed", event.target.checked)
              }
            />
            <span className="reseller-custom-check" aria-hidden="true">
              {data.termsAgreed ? (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path
                    d="M1 4.5L4.5 8L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
            <span className="reseller-check-label">
              I confirm that I have read and agree to the
              <strong>
                {" "}
                Ahangama Pass Reseller Partner Terms and Conditions
              </strong>
              , and that all information submitted in this application is
              accurate.
            </span>
          </label>
          {error ? <div className="reseller-error-msg">{error}</div> : null}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.id} className={className}>
          <label className="reseller-label" htmlFor={field.id}>
            {field.label}
          </label>
          <select
            id={field.id}
            value={data[field.id]}
            onChange={(event) => updateField(field.id, event.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error ? <div className="reseller-error-msg">{error}</div> : null}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.id} className={className}>
          <label className="reseller-label" htmlFor={field.id}>
            {field.label}
          </label>
          <textarea
            id={field.id}
            value={data[field.id]}
            placeholder={field.placeholder}
            onChange={(event) => updateField(field.id, event.target.value)}
          />
          {error ? <div className="reseller-error-msg">{error}</div> : null}
        </div>
      );
    }

    return (
      <div key={field.id} className={className}>
        <label className="reseller-label" htmlFor={field.id}>
          {field.label}
        </label>
        <input
          id={field.id}
          type={field.type}
          value={data[field.id]}
          placeholder={field.placeholder}
          onChange={(event) => updateField(field.id, event.target.value)}
        />
        {error ? <div className="reseller-error-msg">{error}</div> : null}
      </div>
    );
  };

  return (
    <SiteLayout>
      <Seo
        title="Reseller Partner Application - Ahangama Pass"
        description="Apply to resell the Ahangama Pass. Submit your business details, sales reach, and contact information for review."
        canonical={absUrl("/resellers")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Ahangama Pass Reseller Partner Application",
          url: absUrl("/resellers"),
          description:
            "Application form for travel, hospitality, and activity partners who want to resell the Ahangama Pass.",
        }}
      />

      <div className="reseller-page">
        <div className="reseller-shell">
          <div className="reseller-logo-bar">
            <p className="reseller-eyebrow">Ahangama Pass</p>
            <h1>Reseller Partner Application</h1>
            <p className="reseller-intro">
              A short review flow for hotels, operators, and local businesses
              who want to sell the pass directly to their guests and clients.
            </p>
          </div>

          <section className="reseller-card">
            <div className="reseller-step-bar" aria-hidden="true">
              {STEPS.map((_, index) => {
                const dotClass =
                  index < step
                    ? "reseller-step-dot done"
                    : index === step
                      ? "reseller-step-dot active"
                      : "reseller-step-dot";
                return <div key={`dot-${index + 1}`} className={dotClass} />;
              })}
            </div>

            {submitError ? (
              <div className="reseller-error-banner">{submitError}</div>
            ) : null}

            {isSuccess ? (
              <SuccessState name={data.name} email={data.email} />
            ) : (
              <>
                <header className="reseller-step-header">
                  <div className="reseller-step-heading">
                    {currentStep.heading}
                  </div>
                  <div className="reseller-step-sub">{currentStep.sub}</div>
                </header>

                <div className="reseller-fields">
                  {currentStep.fields.map(renderField)}
                </div>

                <div className="reseller-actions">
                  <button
                    type="button"
                    className="reseller-btn"
                    onClick={handleBack}
                    disabled={isFirst}
                  >
                    Back
                  </button>
                  <span className="reseller-progress-label">
                    Step {step + 1} of {STEPS.length}
                  </span>
                  <button
                    type="button"
                    className="reseller-btn primary"
                    onClick={isLast ? handleSubmit : handleNext}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : isLast
                        ? "Submit application"
                        : "Continue"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
