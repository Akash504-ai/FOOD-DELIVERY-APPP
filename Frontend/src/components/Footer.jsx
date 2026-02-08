import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0b] text-white pt-20 pb-10 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[#ff4d2d]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#ff4d2d] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4d2d]/20">
              <span className="text-white font-black text-xl">V</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter">
              Vingo<span className="text-[#ff4d2d]">.</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            Satisfying your cravings with the best flavors in town. Fast, reliable, and always fresh. Your favorite meals, just a click away.
          </p>
          <div className="flex items-center gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#ff4d2d] hover:border-[#ff4d2d] transition-all duration-300 group">
                <Icon size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            {['Browse Menu', 'Top Rated Shops', 'Current Offers', 'Track My Order'].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#ff4d2d] transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d2d] scale-0 group-hover:scale-100 transition-transform" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            {['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Contact Us'].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#ff4d2d] transition-colors duration-300 flex items-center gap-2 group">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d2d] scale-0 group-hover:scale-100 transition-transform" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold mb-6">Get in Touch</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <IoLocationOutline className="text-[#ff4d2d] mt-1" size={20} />
              <p className="text-gray-400 text-sm font-medium">123 Foodie Street, Sector V, Salt Lake, Kolkata</p>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlinePhone className="text-[#ff4d2d]" size={20} />
              <p className="text-gray-400 text-sm font-medium">+91 987 654 3210</p>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineMail className="text-[#ff4d2d]" size={20} />
              <p className="text-gray-400 text-sm font-medium">support@vingo.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 VINGO DELIVERY. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;