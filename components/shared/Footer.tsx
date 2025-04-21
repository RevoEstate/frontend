"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FiArrowUp } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";

const Footer = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const socialLinks = [
    { icon: <FaFacebook className="text-xl" />, url: "#", name: "Facebook" },
    { icon: <FaTwitter className="text-xl" />, url: "#", name: "Twitter" },
    { icon: <FaInstagram className="text-xl" />, url: "#", name: "Instagram" },
    { icon: <FaLinkedin className="text-xl" />, url: "#", name: "LinkedIn" },
    { icon: <FaWhatsapp className="text-xl" />, url: "#", name: "WhatsApp" }
  ];

  const footerLinks = [
    { title: "Discover", links: [
      { name: "Featured Properties", path: "#" },
      { name: "New Developments", path: "#" },
      { name: "Commercial Spaces", path: "#" },
      { name: "Luxury Homes", path: "#" }
    ]},
    { title: "Company", links: [
      { name: "About Us", path: "#" },
      { name: "Our Team", path: "#" },
      { name: "Careers", path: "#" },
      { name: "Blog", path: "#" }
    ]},
    { title: "Support", links: [
      { name: "Contact Us", path: "#" },
      { name: "FAQs", path: "#" },
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" }
    ]}
  ];

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-gradient-to-br from-sky-900 via-sky-800 to-sky-800 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-700 opacity-10 mix-blend-screen"></div>
        <div className="absolute -left-10 -bottom-10 w-80 h-80 rounded-full bg-sky-600 opacity-10 mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-200">
                RevoEstate
              </span>
            </motion.div>
            <motion.p className="text-blue-100 leading-relaxed">
              Revolutionizing real estate in Ethiopia with innovative technology and exceptional service.
            </motion.p>
            <motion.div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  aria-label={social.name}
                  className="text-blue-200 hover:text-white p-2 rounded-full bg-blue-800/30 hover:bg-blue-700/50 transition-all"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Dynamic Links Columns */}
          {footerLinks.map((section, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="space-y-5"
            >
              <motion.h3 
                className="text-lg font-semibold text-white flex items-center"
                whileHover={{ x: 5 }}
              >
                <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                {section.title}
              </motion.h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={link.path}
                      className="text-blue-100 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Column */}
          <motion.div variants={itemVariants} className="space-y-5">
            <motion.h3 
              className="text-lg font-semibold text-white flex items-center"
              whileHover={{ x: 5 }}
            >
              <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
              Get In Touch
            </motion.h3>
            <motion.div className="space-y-4 text-blue-100">
              <motion.div 
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <MdLocationOn className="text-xl mt-1 mr-3 flex-shrink-0 text-sky-300" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </motion.div>
              <motion.a 
                href="mailto:info@revoestate.com"
                className="flex items-start hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <MdEmail className="text-xl mt-1 mr-3 flex-shrink-0 text-sky-300" />
                <span>info@revoestate.com</span>
              </motion.a>
              <motion.a
                href="tel:+251912345678"
                className="flex items-start hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <MdPhone className="text-xl mt-1 mr-3 flex-shrink-0 text-sky-300" />
                <span>+251 912 345 678</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider with animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent my-8"
        />

        {/* Bottom section */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <motion.p 
            variants={itemVariants}
            className="text-blue-100 text-sm text-center md:text-left mb-4 md:mb-0"
          >
            &copy; {currentYear} RevoEstate. All rights reserved.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Sitemap
            </a>
          </motion.div>
        </motion.div>
      </div>

     
    </motion.footer>
  );
};

export default Footer;