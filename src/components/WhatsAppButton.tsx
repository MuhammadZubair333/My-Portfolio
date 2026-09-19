"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa6";
import { profile } from "@/data/profile";

/** Floating WhatsApp shortcut, shown once the visitor scrolls past the hero. */
export function WhatsAppButton() {
  const [show, setShow] = useState(false);

  // Hidden over the hero and while the Contact section (which has its own WhatsApp button) is on screen.
  useEffect(() => {
    let pastHero = false;
    let contactVisible = false;
    const update = () => setShow(pastHero && !contactVisible);
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.6;
      update();
    };
    const contact = document.getElementById("contact");
    const observer = new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      update();
    });
    if (contact) observer.observe(contact);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={profile.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp (opens in a new tab)"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-[padding] duration-300 sm:bottom-6 sm:right-6 sm:hover:pr-5"
        >
          <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.4s]" />
          <FaWhatsapp aria-hidden className="size-6" />
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width] duration-300 sm:inline sm:group-hover:max-w-40">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
