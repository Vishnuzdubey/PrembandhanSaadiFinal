import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left: Form */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4 text-rose">Contact Us</h1>
              <p className="text-sm text-gray-600 mb-6">
                Have a question or need help? Send us a message and we'll get back to you within 24 hours.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" id="phone" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
                </div>
                <div className="flex items-center space-x-3">
                  <button type="submit" className="flex-1 bg-rose text-white py-2 rounded-md font-semibold hover:bg-rose/90 transition">Send Message</button>
                  <button type="reset" className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Reset</button>
                </div>
              </form>

              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
                <p className="text-sm text-gray-600">Mon - Sat: 09:00 AM - 06:00 PM</p>
                <p className="text-sm text-gray-600">Sun: Closed</p>
              </div>
            </div>

            {/* Right: Map + Details */}
            <div className="md:w-1/2 p-6 bg-slate-50">
              <h2 className="text-xl font-semibold mb-4">Our Location</h2>

              {/* Responsive embedded Google Map centered on Gorakhnath Temple, Gorakhpur */}
              <div className="w-full aspect-[4/3] rounded-md overflow-hidden shadow-sm mb-4">
                <iframe
                  title="Gorakhnath, Gorakhpur Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.423250018756!2d83.37793197450104!3d26.761757083198745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4f0c1b6e6f45%3A0x2d0c1b1b0b4c2f70!2sGorakhnath%20Temple!5e0!3m2!1sen!2sin!4v1693110000000!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-sm text-gray-600">Gorakhnath Temple, Gorakhpur, Uttar Pradesh, India</p>
                </div>

                <div>
                  <h3 className="font-semibold">Phone</h3>
                    <p className="text-sm text-gray-600">+91 93691 67302</p>
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-gray-600">support@prembandhansaadi.com</p>
                </div>

                <div>
                  <h3 className="font-semibold">Landmarks</h3>
                  <p className="text-sm text-gray-600">Near Gorakhnath Temple, Shastri Nagar</p>
                </div>

                <div className="pt-3">
                  <h3 className="font-semibold">Follow Us</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <a href="#" aria-label="facebook" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.95v-7.05H7.9v-2.9h2.56V9.41c0-2.54 1.5-3.95 3.79-3.95 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.8l-.45 2.9h-2.35V22C18.34 21.25 22 17.09 22 12.07z"/></svg>
                    </a>
                    <a href="#" aria-label="instagram" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.58 0 4.84.07 1.17.07 1.8.24 2.22.41.54.22.93.48 1.34.9.41.41.68.8.9 1.34.17.42.34 1.05.41 2.22.07 1.26.07 1.64.07 4.84s0 3.58-.07 4.84c-.07 1.17-.24 1.8-.41 2.22-.22.54-.48.93-.9 1.34-.41.41-.8.68-1.34.9-.42.17-1.05.34-2.22.41-1.26.07-1.64.07-4.84.07s-3.58 0-4.84-.07c-1.17-.07-1.8-.24-2.22-.41-.54-.22-.93-.48-1.34-.9-.41-.41-.68-.8-.9-1.34-.17-.42-.34-1.05-.41-2.22C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.84c.07-1.17.24-1.8.41-2.22.22-.54.48-.93.9-1.34.41-.41.8-.68 1.34-.9.42-.17 1.05-.34 2.22-.41C8.42 2.2 8.8 2.2 12 2.2zm0 2.1c-3 0-3.33 0-4.5.06-1 .05-1.56.23-1.92.38-.5.21-.85.46-1.22.83-.37.37-.62.72-.83 1.22-.15.36-.33.92-.38 1.92-.06 1.17-.06 1.5-.06 4.5s0 3.33.06 4.5c.05 1 .23 1.56.38 1.92.21.5.46.85.83 1.22.37.37.72.62 1.22.83.36.15.92.33 1.92.38 1.17.06 1.5.06 4.5.06s3.33 0 4.5-.06c1-.05 1.56-.23 1.92-.38.5-.21.85-.46 1.22-.83.37-.37.62-.72.83-1.22.15-.36.33-.92.38-1.92.06-1.17.06-1.5.06-4.5s0-3.33-.06-4.5c-.05-1-.23-1.56-.38-1.92-.21-.5-.46-.85-.83-1.22-.37-.37-.72-.62-1.22-.83-.36-.15-.92-.33-1.92-.38C15.33 4.3 15 4.3 12 4.3zM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2.1a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.95-2.55a1.08 1.08 0 1 1 0 2.16 1.08 1.08 0 0 1 0-2.16z"/></svg>
                    </a>
                    <a href="#" aria-label="linkedin" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.95 5.5S0.92 4.6.92 3.5 1.84 1.5 2.95 1.5 4.98 2.4 4.98 3.5zM.96 8.98H4.9V23H.96zM8.76 8.98h3.73v1.96h.05c.52-.99 1.79-2.03 3.69-2.03 3.95 0 4.68 2.6 4.68 5.98V23h-3.95v-6.26c0-1.5-.03-3.43-2.09-3.43-2.09 0-2.41 1.64-2.41 3.33V23H8.76z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
