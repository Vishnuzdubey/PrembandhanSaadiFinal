import { Quote, Star } from "lucide-react";

const SuccessStories = (props: React.HTMLAttributes<HTMLElement>) => {
  const stories = [
    {
      names: "Rohit & Meera",
      location: "Gorakhpur",
      story: "We found each other through PremBandhanShaadi and couldn't be happier. The platform made it so easy to connect with like-minded people. Thank you for helping us find our perfect match!",
      image1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      image2: "https://images.unsplash.com/photo-1494790108755-2616b95fb2c5?w=150&h=150&fit=crop&crop=face",
      weddingDate: "December 2023"
    },
    {
      names: "Priya & Arjun",
      location: "Gorakhpur",
      story: "The verification process gave us confidence in the profiles we were viewing. We connected instantly and knew we were meant for each other. Grateful for this wonderful platform!",
      image1: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      image2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      weddingDate: "March 2024"
    },
    {
      names: "Kavya & Vikram",
      location: "Gorakhpur",
      story: "From the first conversation to walking down the aisle, our journey has been beautiful. PremBandhanShaadi helped us find not just a life partner, but our best friend.",
      image1: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      image2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      weddingDate: "January 2024"
    }
  ];

  return (
    <section id={props.id} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real couples who found their perfect match through our platform. 
            Your love story could be next!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <div key={index} className="group bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-rose/30" />
              </div>

              {/* Story */}
              <p className="text-muted-foreground text-center mb-6 italic">
                "{story.story}"
              </p>

              {/* Couple Images */}
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="relative">
                  <img 
                    src={story.image1} 
                    alt="Partner 1"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-soft"
                  />
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-rose text-white rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="relative">
                  <img 
                    src={story.image2} 
                    alt="Partner 2"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-soft"
                  />
                </div>
              </div>

              {/* Names and Details */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {story.names}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {story.location}
                </p>
                <p className="text-xs text-rose font-medium">
                  Married in {story.weddingDate}
                </p>
              </div>
            </div>
          ))}
        </div>

        
         <div className="text-center bg-gradient-to-r from-rose/10 via-coral/5 to-gold/10 rounded-2xl p-8">
   
  
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;