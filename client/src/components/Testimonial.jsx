import { motion } from "motion/react";
import { assets } from "../assets/assets";
import Title from "./Title";

export default function Testimonial() {
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Chennai, TamilNadu",
      image: assets.testimonial_image_1,
      review:
        "The team at SmartWheelz exceeded my expectations. They were professional and efficient, and delivered exactly what I needed. I highly recommend them!",
    },
    {
      name: "John Smith",
      location: "Mumbai, Maharashtra",
      image: assets.testimonial_image_2,
      review:
        "I had a great experience with SmartWheelz. The booking process was easy, and the car was well-maintained. I would definitely use them again in the future.",
    },
    {
      name: "Sophia Lee",
      location: "Bangalore, Karnataka",
      image: assets.testimonial_image_1,
      review:
        "I highly recommend SmartWheelz. They provided excellent customer service and delivered the car on time. It was a pleasure to rent a luxury car from them.",
    },
  ];
  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose SmartWheelz for their luxury accomodations around the world"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img src={assets.star_icon} alt="star" key={index} />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.review}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
