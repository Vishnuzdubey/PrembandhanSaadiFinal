import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-rose">Contact Us</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose focus:ring focus:ring-rose/20" required />
            </div>
            <button type="submit" className="w-full bg-rose text-white py-2 rounded-md font-semibold hover:bg-rose/90 transition">Send Message</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
