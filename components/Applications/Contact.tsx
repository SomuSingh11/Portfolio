"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast"; // NEW: For notifications
import {
  Mail,
  Send,
  Github,
  Linkedin,
  X as XIcon,
  Phone,
  Download,
} from "lucide-react";

const contactConfig = {
  web3formsAccessKey: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  email: "somusingh0110@gmail.com",
  location: "Indore, MP, India",
  timezone: "IST (UTC+5:30)",
  resumePath: "/SomuSingh_Resume.pdf",
  calendlyLink: "https://calendly.com/your-username",
  socials: {
    github: "https://github.com/SomuSingh11",
    linkedin: "https://www.linkedin.com/in/somusingh11/",
    x: "https://x.com/SomuSingh_",
  },
};
// ------------------------------------

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinks = [
    {
      icon: Github,
      href: contactConfig.socials.github,
      label: "GitHub",
      color: "text-gray-400",
    },
    {
      icon: Linkedin,
      href: contactConfig.socials.linkedin,
      label: "LinkedIn",
      color: "text-blue-400",
    },
    {
      icon: XIcon,
      href: contactConfig.socials.x,
      label: "X",
      color: "text-sky-400",
    },
  ];

  // --- UPDATED: Functional Quick Actions ---
  const quickActions = [
    {
      icon: Download,
      label: "Download Resume",
      action: () => {
        const link = document.createElement("a");
        link.href = contactConfig.resumePath;
        link.setAttribute(
          "download",
          contactConfig.resumePath.split("/").pop() || "resume.pdf"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Resume downloaded!");
      },
    },
    {
      icon: Phone,
      label: "Schedule Call",
      action: () => window.open(contactConfig.calendlyLink, "_blank"),
    },
    {
      icon: Mail,
      label: "Email Directly",
      action: () => window.open(`mailto:${contactConfig.email}`),
    },
  ];
  // -----------------------------------------

  // --- NEW: Handle form submission with Web3Forms ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalData = {
      ...formData,
      access_key: contactConfig.web3formsAccessKey,
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(finalData),
    }).then((res) => res.json());

    if (res.success) {
      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      console.log("Error", res);
      toast.error(res.message || "Something went wrong.");
    }
    setIsSubmitting(false);
  };
  // ------------------------------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:cursor-pointer hover:bg-gray-600 rounded transition-colors text-left"
                  >
                    <action.icon className="w-5 h-5 text-blue-400" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Connect Online</h3>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors group"
                  >
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                    <span className="flex-1">{link.label}</span>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open in new tab
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{contactConfig.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 text-center">📍</span>
                  <span>{contactConfig.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 text-center">🕐</span>
                  <span>{contactConfig.timezone}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form inputs remain the same */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
