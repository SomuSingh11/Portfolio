"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  Mail,
  Send,
  Github,
  Linkedin,
  X as XIcon,
  Phone,
  Download,
} from "lucide-react";
import { PERSONAL_INFO, SOCIAL_LINKS, API_CONFIG } from "@/config/constants";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadResume = useCallback(() => {
    const link = document.createElement("a");
    link.href = PERSONAL_INFO.resumePath;
    link.download = "SomuSingh_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resume downloaded!");
  }, []);

  const quickActions = [
    { icon: Download, label: "Download Resume", action: handleDownloadResume },
    {
      icon: Phone,
      label: "Schedule Call",
      action: () => window.open(SOCIAL_LINKS.calendly, "_blank"),
    },
    {
      icon: Mail,
      label: "Email Directly",
      action: () => window.open(`mailto:${PERSONAL_INFO.email}`),
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: SOCIAL_LINKS.github,
      label: "GitHub",
      color: "text-gray-400",
    },
    {
      icon: Linkedin,
      href: SOCIAL_LINKS.linkedin,
      label: "LinkedIn",
      color: "text-blue-400",
    },
    {
      icon: XIcon,
      href: SOCIAL_LINKS.x,
      label: "X / Twitter",
      color: "text-sky-400",
    },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!API_CONFIG.web3forms.accessKey) {
        toast.error("Contact form not configured.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch(API_CONFIG.web3forms.submitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            access_key: API_CONFIG.web3forms.accessKey,
          }),
        }).then((r) => r.json());

        if (res.success) {
          toast.success("Message sent! I'll get back to you soon.");
          setFormData(INITIAL_FORM);
        } else {
          throw new Error(res.message ?? "Submission failed");
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-gray-800 border border-gray-700 text-white",
        }}
      />

      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">Get In Touch</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Quick actions + socials + details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <h3 className="text-base font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left text-sm"
                  >
                    <action.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <h3 className="text-base font-semibold mb-3">Connect Online</h3>
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group text-sm"
                  >
                    <link.icon
                      className={`w-4 h-4 ${link.color} flex-shrink-0`}
                    />
                    <span className="flex-1">{link.label}</span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <h3 className="text-base font-semibold mb-3">Details</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🕐</span>
                  <span>{PERSONAL_INFO.timezone}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Message form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-5"
          >
            <h2 className="text-base font-semibold mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
