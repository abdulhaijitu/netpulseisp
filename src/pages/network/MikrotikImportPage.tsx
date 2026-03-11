import React, { useState, useMemo } from "react";
import { Monitor, FileSpreadsheet, Upload, Eye, EyeOff, UserPlus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface MikrotikClient {
  id: string;
  name: string;
  password: string;
  service: string;
  profile: string;
  callerId: string;
  serverName: string;
  logoutTime: string;
  userStatus: "active" | "inactive" | "disabled";
  branch: string;
  enabled: boolean;
}

const demoClients: MikrotikClient[] = [
  { id: "1", name: "pppoe-user001", password: "xK9#mL2p", service: "pppoe", profile: "10Mbps-Home", callerId: "", serverName: "pppoe-server1", logoutTime: "2026-03-10 14:32:00", userStatus: "active", branch: "Main", enabled: true },
  { id: "2", name: "pppoe-user002", password: "aB3$nQ7r", service: "pppoe", profile: "20Mbps-Business", callerId: "AA:BB:CC:DD:EE:01", serverName: "pppoe-server1", logoutTime: "2026-03-10 12:15:00", userStatus: "active", branch: "Main", enabled: true },
  { id: "3", name: "pppoe-user003", password: "zT5&wP4s", service: "pppoe", profile: "10Mbps-Home", callerId: "", serverName: "pppoe-server2", logoutTime: "2026-03-09 23:45:00", userStatus: "inactive", branch: "Branch-1", enabled: false },
  { id: "4", name: "pppoe-user004", password: "hJ8*kR1v", service: "pppoe", profile: "50Mbps-Premium", callerId: "AA:BB:CC:DD:EE:02", serverName: "pppoe-server1", logoutTime: "2026-03-10 16:00:00", userStatus: "active", branch: "Main", enabled: true },
  { id: "5", name: "pppoe-user005", password: "cD6!eF9u", service: "pppoe", profile: "10Mbps-Home", callerId: "", serverName: "pppoe-server2", logoutTime: "2026-03-08 09:20:00", userStatus: "disabled", branch: "Branch-2", enabled: false },
  { id: "6", name: "hotspot-user01", password: "mN2@pQ5x", service: "hotspot", profile: "5Mbps-Basic", callerId: "", serverName: "hotspot-server1", logoutTime: "2026-03-10 18:10:00", userStatus: "active", branch: "Main", enabled: true },
  { id: "7", name: "pppoe-user006", password: "gH4#jK8y", service: "pppoe", profile: "20Mbps-Business", callerId: "AA:BB:CC:DD:EE:03", serverName: "pppoe-server1", logoutTime: "2026-03-10 10:05:00", userStatus: "active", branch: "Branch-1", enabled: true },
  { id: "8", name: "pppoe-user007", password: "tR7$uV3z", service: "pppoe", profile: "10Mbps-Home", callerId: "", serverName: "pppoe-server2", logoutTime: "2026-03-09 20:30:00", userStatus: "inactive", branch: "Branch-2", enabled: false },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  inactive: "bg-warning/15 text-warning border-warning/30",
  disabled: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function MikrotikImportPage() {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [selectedExport, setSelectedExport] = useState<Set<string>>(new Set());

  // Filters
  const [serverFilter, setServerFilter] = useState("all");
  const [protocolFilter, setProtocolFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const servers = useMemo(() => [...new Set(demoClients.map(c => c.serverName))], []);
  const protocols = useMemo(() => [...new Set(demoClients.map(c => c.service))], []);
  const profiles = useMemo(() => [...new Set(demoClients.map(c => c.profile))], []);

  const filtered = useMemo(() => {
    let data = demoClients;
    if (filtersApplied) {
      if (serverFilter !== "all") data = data.filter(c => c.serverName === serverFilter);
      if (protocolFilter !== "all") data = data.filter(c => c.service === protocolFilter);
      if (profileFilter !== "all") data = data.filter(c => c.profile === profileFilter);
      if (userTypeFilter === "unique") {
        const seen = new Set<string>();
        data = data.filter(c => { if (seen.has(c.name)) return false; seen.add(c.name); return true; });
      }
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(q) || c.profile.toLowerCase().includes(q) || c.serverName.toLowerCase().includes(q));
    }
    return data;
  }, [search, filtersApplied, serverFilter, protocolFilter, profileFilter, userTypeFilter]);

  const perPage = parseInt(entriesPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleExport = (id: string) => {
    setSelectedExport(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAllExport = () => {
    if (selectedExport.size === paginated.length) setSelectedExport(new Set());
    else setSelectedExport(new Set(paginated.map(c => c.id)));
  };

  const clearFilters = () => {
    setServerFilter("all"); setProtocolFilter("all"); setProfileFilter("all"); setUserTypeFilter("all");
    setFiltersApplied(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Mikrotik Clients</h1>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary/80">Mikrotik Server</span>
              <span className="mx-1.5">›</span>
              <span>Mikrotik Client List</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Generating Excel...")}>
            <FileSpreadsheet className="mr-1.5 h-4 w-4" />
            Generate Excel
          </Button>
          <Button size="sm" onClick={() => toast.info("Exporting to MACReseller...")}>
            <Upload className="mr-1.5 h-4 w-4" />
            Export To MACReseller
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[150px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servers</label>
              <Select value={serverFilter} onValueChange={setServerFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All Servers" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Servers</SelectItem>
                  {servers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Protocol</label>
              <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {protocols.map(p => <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile</label>
              <Select value={profileFilter} onValueChange={setProfileFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {profiles.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[130px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Type</label>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unique">Unique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="mr-1 h-3.5 w-3.5" /> Clear
              </Button>
              <Button size="sm" onClick={() => { setFiltersApplied(true); setCurrentPage(1); }}>
                <Filter className="mr-1 h-3.5 w-3.5" /> Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Show</span>
          <Select value={entriesPerPage} onValueChange={v => { setEntriesPerPage(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["5", "10", "25", "50"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entries</span>
        </div>
        <Input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="h-8 w-full sm:w-56" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Caller ID</TableHead>
              <TableHead>Server Name</TableHead>
              <TableHead>Logout Time</TableHead>
              <TableHead>User Status</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="w-10 text-center">
                <Checkbox checked={selectedExport.size === paginated.length && paginated.length > 0} onCheckedChange={toggleAllExport} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center text-muted-foreground">
                  No data available in table
                </TableCell>
              </TableRow>
            ) : paginated.map((client, idx) => (
              <TableRow key={client.id}>
                <TableCell className="text-center font-medium text-muted-foreground">{(currentPage - 1) * perPage + idx + 1}</TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{visiblePasswords.has(client.id) ? client.password : "••••••••"}</span>
                    <button onClick={() => togglePassword(client.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {visiblePasswords.has(client.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="font-mono text-[10px] uppercase">{client.service}</Badge></TableCell>
                <TableCell className="text-sm">{client.profile}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{client.callerId || "—"}</TableCell>
                <TableCell className="text-sm">{client.serverName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{client.logoutTime}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[client.userStatus]}`}>{client.userStatus}</Badge>
                </TableCell>
                <TableCell className="text-sm">{client.branch}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch checked={client.enabled} className="scale-75" onCheckedChange={() => toast.info(`Toggled ${client.name}`)} />
                    <button onClick={() => toast.success(`Importing ${client.name}...`)} className="text-primary hover:text-primary/80 transition-colors">
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={selectedExport.has(client.id)} onCheckedChange={() => toggleExport(client.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
