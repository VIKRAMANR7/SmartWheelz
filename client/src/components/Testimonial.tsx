import { motion } from "motion/react";
import Title from "../components/Title";
import { testimonials, assets } from "../assets/assets";

export default function Testimonial() {
  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose SmartWheelz for their luxury accommodations around the world"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-full" src={t.image} alt={t.name} />
              <div>
                <p className="text-xl">{t.name}</p>
                <p className="text-gray-500">{t.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star" />
                ))}
            </div>

            <p className="text-gray-500 max-w-90 mt-4 font-light">"{t.review}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
