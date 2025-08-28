import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CreateProfile from "./CreateProfile";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Page = 'auth' | 'createProfile' | 'login';

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleClose = () => {
    setCurrentPage('auth');
    setPhone('');
    setDateOfBirth('');
    setIsLoading(false);
    onClose();
  };

  const handleLogin = async () => {
    if (!phone || !dateOfBirth) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://pb-app-lac.vercel.app/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          dateOfBirth,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('prembandhanToken', data.token);
        toast({
          title: "Success",
          description: "Login successful!",
        });
        handleClose();
        // Refresh the page to update the header with user info
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPage === 'createProfile') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateProfile onNavigate={handleNavigate} />
        </DialogContent>
      </Dialog>
    );
  }

  if (currentPage === 'login') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Login to PremBandhan<span className="text-rose">Shaadi</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              variant="hero"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => handleNavigate('auth')}
                className="text-sm text-rose"
              >
                Back to options
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Welcome to PremBandhan<span className="text-rose">Shaadi</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="text-center text-gray-600 mb-6">
            Choose an option to get started
          </div>

          <Button
            variant="premium"
            size="lg"
            className="w-full"
            onClick={() => handleNavigate('createProfile')}
          >
            Create New Profile
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleNavigate('login')}
          >
            Login to Existing Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;