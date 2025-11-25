import { motion } from "motion/react";
import { assets, footerLinks } from "../assets/assets";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-16 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500"
    >
      {/* Top Section */}
      <div className="flex flex-wrap justify-between gap-8 pb-6 border-b border-borderColor">
        <div>
          <img src={assets.logo} alt="logo" className="mb-4" />
          <p className="max-w-80 mt-3">
            Premium car rental service with a wide selection of luxury and everyday vehicles.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <a href="#">
              <img src={assets.facebook_logo} className="size-5" />
            </a>
            <a href="#">
              <img src={assets.instagram_logo} className="size-5" />
            </a>
            <a href="#">
              <img src={assets.twitter_logo} className="size-5" />
            </a>
            <a href="#">
              <img src={assets.gmail_logo} className="size-5" />
            </a>
          </div>
        </div>

        {/* Footer Columns – kept inline, not extracted */}
        <div className="flex flex-wrap justify-between w-1/2 gap-8">
          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">Quick Links</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {footerLinks.quick.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">Resources</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {footerLinks.resources.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase">Contact</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {footerLinks.contact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} SmartWheelz. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
