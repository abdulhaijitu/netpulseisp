import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Wifi,
  Calendar,
  Save,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock customer data
const customerData = {
  name: "Md. Karim Uddin",
  email: "karim@example.com",
  phone: "+880 1712-345678",
  address: "House 12, Road 5, Dhanmondi, Dhaka",
  connectionId: "CONN-2024-001",
  packageName: "Premium 50 Mbps",
  joinDate: "2022-06-15",
  status: "active" as const,
};

export default function PortalProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View and update your account information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <Separator />
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Connection Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wifi className="h-5 w-5" />
                Connection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Wifi className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-medium">{customerData.packageName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Connection ID</p>
                    <p className="font-medium">{customerData.connectionId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{formatDate(customerData.joinDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Contact your ISP for support or to request changes to your package.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@isp.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
