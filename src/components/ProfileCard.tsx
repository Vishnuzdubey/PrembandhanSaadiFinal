import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, GraduationCap, Briefcase, Star, Eye } from "lucide-react";

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
  profileId?: number;
  onLike?: (profileId: number, profileName: string) => void;
  onViewProfile?: (profileId: number) => void;
  isLiked?: boolean;
  isLiking?: boolean;
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
  isNew = false,
  profileId,
  onLike,
  onViewProfile,
  isLiked = false,
  isLiking = false
}: ProfileCardProps) => {

  const handleLike = () => {
    if (onLike && profileId) {
      onLike(profileId, name);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile && profileId) {
      onViewProfile(profileId);
    }
  };
  return (
    <div className="group relative bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1 w-full max-w-sm mx-auto">
      {/* Badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-col gap-1">
        {isFeatured && (
          <Badge className="bg-gold text-foreground font-semibold text-xs">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {isVerified && (
          <Badge className="bg-rose text-white text-xs">
            Verified
          </Badge>
        )}
        {isNew && (
          <Badge variant="secondary" className="text-xs">
            New
          </Badge>
        )}
      </div>

      {/* Heart Icon */}
      <button
        onClick={handleLike}
        disabled={isLiking || !onLike}
        className={`absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full transition-colors ${isLiked
            ? 'bg-rose text-white'
            : 'bg-white/80 hover:bg-white'
          } ${!onLike ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${isLiked
            ? 'text-white fill-current'
            : 'text-muted-foreground hover:text-rose hover:fill-rose'
          }`} />
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
      <div className="p-3 sm:p-4">
        <div className="mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 line-clamp-1">{name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{age} years, {height}</p>
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-rose flex-shrink-0" />
            <span className="truncate">{city}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-rose flex-shrink-0" />
            <span className="truncate">{education}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-rose flex-shrink-0" />
            <span className="truncate">{occupation}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 sm:mb-4 truncate">
          {religion} • {caste}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
            onClick={handleViewProfile}
            disabled={!onViewProfile}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Profile
          </Button>
          <Button
            variant="premium"
            size="sm"
            className={`flex-1 text-xs sm:text-sm h-8 sm:h-9 ${isLiked ? 'bg-rose-600 text-white' : ''
              }`}
            onClick={handleLike}
            disabled={isLiking || isLiked || !onLike}
          >
            <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;