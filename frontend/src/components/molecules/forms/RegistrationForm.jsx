import React, { useState } from "react";
import apiClient from "../../../hooks/apiClient";
import {
  CircleAlert,
  User,
  Mail,
  Phone,
  ChevronDown,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const RegistrationForm = ({ eventId, participantRoles }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: participantRoles[0] || "Umum",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await apiClient.post(`/api/events/${eventId}/register`, formData);
      setMessage({
        type: "success",
        text: t("detail_pages.registration_success_message"),
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: participantRoles[0] || "Umum",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t("detail_pages.registration_error");
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Input fields reuse the existing translation strings as accessible names,
  // because a placeholder alone is not a label for a screen reader. The leading
  // icon sits 16px in and the text starts at 48px, which is the same inset the
  // search fields use across the public pages.
  const fieldClass = [
    "w-full bg-brand-800 border border-border rounded-inputs p-3 pl-12 text-cream",
    "placeholder:text-cream/60",
    "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-400 focus:border-brand-400",
  ].join(" ");

  const fieldIconClass =
    "absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-cream/70 pointer-events-none";

  const fieldTrailingIconClass =
    "absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-cream/70 pointer-events-none";

  if (message.type === "success") {
    return (
      <div
        role="status"
        className="bg-brand-700 border border-brand-400 text-cream p-4 rounded-cards text-center"
      >
        <p className="font-medium uppercase tracking-wide text-sm">
          {t("detail_pages.registration_success")}
        </p>
        <p className="text-sm text-cream/80 mt-1">{message.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.type === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 bg-brand-700 border border-brand-400 text-cream p-3 rounded-cards text-sm"
        >
          <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="relative">
        <User className={fieldIconClass} aria-hidden="true" />
        <input
          type="text"
          name="name"
          aria-label={t("detail_pages.full_name_placeholder")}
          placeholder={t("detail_pages.full_name_placeholder")}
          value={formData.name}
          onChange={handleChange}
          required
          className={fieldClass}
        />
      </div>

      <div className="relative">
        <Mail className={fieldIconClass} aria-hidden="true" />
        <input
          type="email"
          name="email"
          aria-label={t("detail_pages.email_placeholder")}
          placeholder={t("detail_pages.email_placeholder")}
          value={formData.email}
          onChange={handleChange}
          required
          className={fieldClass}
        />
      </div>

      <div className="relative">
        <Phone className={fieldIconClass} aria-hidden="true" />
        <input
          type="tel"
          name="phone"
          aria-label={t("detail_pages.phone_placeholder")}
          placeholder={t("detail_pages.phone_placeholder")}
          value={formData.phone}
          onChange={handleChange}
          required
          className={fieldClass}
        />
      </div>

      <div className="relative">
        <Users className={fieldIconClass} aria-hidden="true" />
        <select
          name="role"
          aria-label={t("detail_pages.participants")}
          value={formData.role}
          onChange={handleChange}
          required
          className={`${fieldClass} pr-12 appearance-none cursor-pointer`}
        >
          {participantRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <ChevronDown className={fieldTrailingIconClass} aria-hidden="true" />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-11 bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide py-3 rounded-buttons-pill transition-colors disabled:bg-brand-800 disabled:text-cream/60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        {isLoading
          ? t("detail_pages.sending")
          : t("detail_pages.register_button")}
      </button>
    </form>
  );
};

export default RegistrationForm;
