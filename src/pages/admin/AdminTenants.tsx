import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Search, 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Pause,
  Play,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock tenants data
const mockTenants = [
  { 
    id: "1", 
    name: "FastNet BD", 
    subdomain: "fastnet", 
    status: "active" as const, 
    customers: 1250, 
    mrr: 5000,
    createdAt: "2023-06-15",
    owner: "Rahim Khan",
    email: "rahim@fastnet.com"
  },
  { 
    id: "2", 
    name: "Speed Link", 
    subdomain: "speedlink", 
    status: "active" as const, 
    customers: 890, 
    mrr: 3500,
    createdAt: "2023-08-22",
    owner: "Kamal Hossain",
    email: "kamal@speedlink.net"
  },
  { 
    id: "3", 
    name: "NetZone", 
    subdomain: "netzone", 
    status: "trial" as const, 
    customers: 120, 
    mrr: 0,
    createdAt: "2024-01-10",
    owner: "Fatema Begum",
    email: "fatema@netzone.bd"
  },
  { 
    id: "4", 
    name: "CityBroadband", 
    subdomain: "citybb", 
    status: "active" as const, 
    customers: 2100, 
    mrr: 8000,
    createdAt: "2023-03-05",
    owner: "Jamal Uddin",
    email: "jamal@citybroadband.com"
  },
  { 
    id: "5", 
    name: "QuickNet", 
    subdomain: "quicknet", 
    status: "suspended" as const, 
    customers: 560, 
    mrr: 0,
    createdAt: "2023-09-18",
    owner: "Nasir Ahmed",
    email: "nasir@quicknet.bd"
  },
];

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: CheckCircle },
  trial: { label: "Trial", variant: "secondary" as const, icon: Clock },
  suspended: { label: "Suspended", variant: "destructive" as const, icon: AlertTriangle },
};

export default function AdminTenants() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    subdomain: "",
    ownerName: "",
    ownerEmail: "",
  });

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCreateTenant = () => {
    toast({
      title: "Tenant Created",
      description: `${newTenant.name} has been created successfully.`,
    });
    setIsCreateDialogOpen(false);
    setNewTenant({ name: "", subdomain: "", ownerName: "", ownerEmail: "" });
  };

  const handleSuspend = (tenant: typeof mockTenants[0]) => {
    toast({
      title: "Tenant Suspended",
      description: `${tenant.name} has been suspended.`,
    });
  };

  const handleActivate = (tenant: typeof mockTenants[0]) => {
    toast({
      title: "Tenant Activated",
      description: `${tenant.name} has been activated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage all ISP organizations on the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Add a new ISP organization to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="FastNet BD"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    placeholder="fastnet"
                    value={newTenant.subdomain}
                    onChange={(e) => setNewTenant({ ...newTenant, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">.ispmanager.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  placeholder="John Doe"
                  value={newTenant.ownerName}
                  onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={newTenant.ownerEmail}
                  onChange={(e) => setNewTenant({ ...newTenant, ownerEmail: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTenant}>Create Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTenants.filter(t => t.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTenants.filter(t => t.status === 'trial').length}</p>
                <p className="text-sm text-muted-foreground">Trial Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTenants.filter(t => t.status === 'suspended').length}</p>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Tenants
          </CardTitle>
          <CardDescription>
            View and manage all ISP organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => {
                  const StatusIcon = statusConfig[tenant.status].icon;
                  return (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground">{tenant.subdomain}.ispmanager.com</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tenant.owner}</p>
                          <p className="text-sm text-muted-foreground">{tenant.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{tenant.customers.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(tenant.mrr)}</TableCell>
                      <TableCell>{formatDate(tenant.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[tenant.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[tenant.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Tenant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {tenant.status === "active" || tenant.status === "trial" ? (
                              <DropdownMenuItem 
                                onClick={() => handleSuspend(tenant)}
                                className="text-destructive"
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivate(tenant)}>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Tenant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
