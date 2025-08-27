import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, GraduationCap, Briefcase, Star } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  height: string;
  religion: string;
  caste: string;
  city: string;
  education: string;
  occupation: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
}

const ProfileCard = ({ 
  name, 
  age, 
  height, 
  religion, 
  caste, 
  city, 
  education, 
  occupation, 
  image,
  isVerified = false,
  isFeatured = false,
  isNew = false
}: ProfileCardProps) => {
  return (
    <div className="group relative bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isFeatured && (
          <Badge className="bg-gold text-foreground font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {isVerified && (
          <Badge className="bg-rose text-white">
            Verified
          </Badge>
        )}
        {isNew && (
          <Badge variant="secondary">
            New
          </Badge>
        )}
      </div>

      {/* Heart Icon */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
        <Heart className="w-4 h-4 text-muted-foreground hover:text-rose hover:fill-rose transition-colors" />
      </button>

      {/* Profile Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={image} 
          alt={`${name}'s profile`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{age} years, {height}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-rose" />
            {city}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 mr-2 text-rose" />
            {education}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2 text-rose" />
            {occupation}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          {religion} • {caste}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Send Enquiry
          </Button>
          <Button variant="premium" size="sm" className="flex-1">
            View Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;