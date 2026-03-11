import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  UserX, Search, FileSpreadsheet, FileText, Users, Eye, RotateCcw, CalendarIcon, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const demoData = [
  { id: "1", code: "C-1021", ip: "172.16.0.45", name: "Rafiq Hossain", mobile: "01712345678", zone: "Zone-A", connType: "Fiber", clientType: "Residential", package: "10 Mbps", speed: "10M", bill: 800, due: 1600, server: "MK-Main", bStatus: "Overdue", leftDate: "2025-12-15", recovered: true, recoveredBy: "Jamal" },
  { id: "2", code: "C-1034", ip: "172.16.0.78", name: "Sultana Begum", mobile: "01898765432", zone: "Zone-B", connType: "Cable", clientType: "Residential", package: "5 Mbps", speed: "5M", bill: 500, due: 500, server: "MK-Main", bStatus: "Due", leftDate: "2026-01-03", recovered: false, recoveredBy: null },
  { id: "3", code: "C-1050", ip: "172.16.1.12", name: "Kamal Uddin", mobile: "01611223344", zone: "Zone-C", connType: "Fiber", clientType: "Corporate", package: "50 Mbps", speed: "50M", bill: 5000, due: 0, server: "MK-Corp", bStatus: "Paid", leftDate: "2026-01-20", recovered: true, recoveredBy: "Shimul" },
  { id: "4", code: "C-1067", ip: "172.16.0.99", name: "Nusrat Jahan", mobile: "01555667788", zone: "Zone-A", connType: "Wireless", clientType: "Residential", package: "15 Mbps", speed: "15M", bill: 1000, due: 3000, server: "MK-Main", bStatus: "Overdue", leftDate: "2025-11-28", recovered: false, recoveredBy: null },
  { id: "5", code: "C-1082", ip: "172.16.2.5", name: "Mahbub Alam", mobile: "01922334455", zone: "Zone-D", connType: "Fiber", clientType: "SME", package: "30 Mbps", speed: "30M", bill: 2500, due: 2500, server: "MK-Sub1", bStatus: "Due", leftDate: "2026-02-10", recovered: true, recoveredBy: "Jamal" },
  { id: "6", code: "C-1095", ip: "172.16.0.130", name: "Fatema Khatun", mobile: "01744556677", zone: "Zone-B", connType: "Fiber", clientType: "Residential", package: "20 Mbps", speed: "20M", bill: 1200, due: 0, server: "MK-Main", bStatus: "Paid", leftDate: "2026-02-25", recovered: false, recoveredBy: null },
];

const LeftClientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zone, setZone] = useState("all");
  const [connType, setConnType] = useState("all");
  const [clientType, setClientType] = useState("all");
  const [pkg, setPkg] = useState("all");
  const [protocol, setProtocol] = useState("all");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [assignFor, setAssignFor] = useState("all");
  const [recoveryStatus, setRecoveryStatus] = useState("all");
  const [recoveredBy, setRecoveredBy] = useState("all");

  const filtered = demoData.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase()) && !c.mobile.includes(search)) return false;
    if (zone !== "all" && c.zone !== zone) return false;
    if (connType !== "all" && c.connType !== connType) return false;
    if (clientType !== "all" && c.clientType !== clientType) return false;
    if (pkg !== "all" && c.package !== pkg) return false;
    if (recoveryStatus === "recovered" && !c.recovered) return false;
    if (recoveryStatus === "not_recovered" && c.recovered) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : filtered.map((c) => c.id));
  };
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-t-lg">
      <Icon className="h-4 w-4" />
      <span className="font-semibold text-sm">{title}</span>
    </div>
  );

  const DatePickerField = ({ label, date, onSelect }: { label: string; date?: Date; onSelect: (d?: Date) => void }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-xs", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {date ? format(date, "dd/MM/yyyy") : "Select"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );

  const FilterSelect = ({ label, value, onValueChange, options }: { label: string; value: string; onValueChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <UserX className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Left Clients</h1>
            <p className="text-xs text-muted-foreground">Manage disconnected clients & recovery tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Assigning...", description: `${selectedIds.length} client(s) selected` })} disabled={selectedIds.length === 0}>
            <Users className="h-3.5 w-3.5 mr-1" /> Assign To Employee
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Generating Excel..." })}>
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1" /> Excel
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Generating PDF..." })}>
            <FileText className="h-3.5 w-3.5 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <SectionHeader icon={Filter} title="Filters" />
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FilterSelect label="Zone" value={zone} onValueChange={setZone} options={[{ value: "Zone-A", label: "Zone-A" }, { value: "Zone-B", label: "Zone-B" }, { value: "Zone-C", label: "Zone-C" }, { value: "Zone-D", label: "Zone-D" }]} />
            <FilterSelect label="Connection Type" value={connType} onValueChange={setConnType} options={[{ value: "Fiber", label: "Fiber" }, { value: "Cable", label: "Cable" }, { value: "Wireless", label: "Wireless" }]} />
            <FilterSelect label="Client Type" value={clientType} onValueChange={setClientType} options={[{ value: "Residential", label: "Residential" }, { value: "Corporate", label: "Corporate" }, { value: "SME", label: "SME" }]} />
            <FilterSelect label="Package" value={pkg} onValueChange={setPkg} options={[{ value: "5 Mbps", label: "5 Mbps" }, { value: "10 Mbps", label: "10 Mbps" }, { value: "15 Mbps", label: "15 Mbps" }, { value: "20 Mbps", label: "20 Mbps" }, { value: "30 Mbps", label: "30 Mbps" }, { value: "50 Mbps", label: "50 Mbps" }]} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FilterSelect label="Protocol Type" value={protocol} onValueChange={setProtocol} options={[{ value: "PPPoE", label: "PPPoE" }, { value: "Static", label: "Static" }, { value: "DHCP", label: "DHCP" }]} />
            <DatePickerField label="From Left Date" date={fromDate} onSelect={setFromDate} />
            <DatePickerField label="To Left Date" date={toDate} onSelect={setToDate} />
            <FilterSelect label="Assign Cus For" value={assignFor} onValueChange={setAssignFor} options={[{ value: "Jamal", label: "Jamal" }, { value: "Shimul", label: "Shimul" }]} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FilterSelect label="Recovery Status" value={recoveryStatus} onValueChange={setRecoveryStatus} options={[{ value: "recovered", label: "Recovered" }, { value: "not_recovered", label: "Not Recovered" }]} />
            <FilterSelect label="Recovered By" value={recoveredBy} onValueChange={setRecoveredBy} options={[{ value: "Jamal", label: "Jamal" }, { value: "Shimul", label: "Shimul" }]} />
          </div>
        </div>
      </div>

      {/* Search + Count */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, code, mobile..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} client(s) found</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="text-xs">C.Code</TableHead>
                <TableHead className="text-xs">ID / IP</TableHead>
                <TableHead className="text-xs">Client Name</TableHead>
                <TableHead className="text-xs">Mobile</TableHead>
                <TableHead className="text-xs">Zone</TableHead>
                <TableHead className="text-xs">Conn. Type</TableHead>
                <TableHead className="text-xs">Client Type</TableHead>
                <TableHead className="text-xs">Package/Speed</TableHead>
                <TableHead className="text-xs text-right">M.Bill</TableHead>
                <TableHead className="text-xs text-right">Due</TableHead>
                <TableHead className="text-xs">Server</TableHead>
                <TableHead className="text-xs">B.Status</TableHead>
                <TableHead className="text-xs">Left Date</TableHead>
                <TableHead className="text-xs text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="text-xs">
                  <TableCell><Checkbox checked={selectedIds.includes(c.id)} onCheckedChange={() => toggleOne(c.id)} /></TableCell>
                  <TableCell className="font-medium">{c.code}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{c.ip}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {c.recovered && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px] px-1.5 py-0">Recovered</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.zone}</TableCell>
                  <TableCell>{c.connType}</TableCell>
                  <TableCell>{c.clientType}</TableCell>
                  <TableCell>{c.package} / {c.speed}</TableCell>
                  <TableCell className="text-right font-medium">৳{c.bill}</TableCell>
                  <TableCell className={cn("text-right font-medium", c.due > 0 ? "text-destructive" : "text-emerald-600")}>৳{c.due}</TableCell>
                  <TableCell>{c.server}</TableCell>
                  <TableCell>
                    <Badge variant={c.bStatus === "Paid" ? "default" : c.bStatus === "Due" ? "secondary" : "destructive"} className="text-[10px]">{c.bStatus}</Badge>
                  </TableCell>
                  <TableCell>{c.leftDate}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="xs" variant="ghost" title="View"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="xs" variant="ghost" title="Recover" onClick={() => toast({ title: "Recovery initiated", description: c.name })}>
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={15} className="text-center py-8 text-muted-foreground">No left clients found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LeftClientsPage;
