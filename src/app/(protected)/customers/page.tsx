import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Users } from "lucide-react";
import { getLeads } from "@/lib/actions/lead-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

function formatCurrency(value: number | null | undefined) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

function formatDate(value: Date | string | null | undefined) {
    if (!value) return "Not scheduled";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not scheduled";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

/**
 * Initial customer directory.
 *
 * This page deliberately reads existing Lead records rather than introducing
 * a new Customer table. A lead/customer/order relationship audit is needed
 * before this becomes a canonical customer master.
 */
export default async function CustomersPage() {
    const leads = await getLeads();

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">CRM / Directory</p>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Browse existing customer enquiries and open a record to review its lead details and measurements.
                    </p>
                </div>
                <Link
                    href="/leads"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                    Open lead management
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible records</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.length}</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Existing lead records available to your account
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Directory status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-base font-semibold">Read-only first version</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            No new customer records or database changes are made by this page.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    {leads.length === 0 ? (
                        <div className="rounded-lg border border-dashed px-6 py-12 text-center">
                            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                            <h2 className="mt-3 font-semibold">No records to show</h2>
                            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                                No lead records are available for this account yet. Create or review enquiries from Lead Management.
                            </p>
                            <Link
                                href="/leads"
                                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                                Go to Lead Management
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-3 py-3 font-medium">Customer</th>
                                        <th className="px-3 py-3 font-medium">Location</th>
                                        <th className="px-3 py-3 font-medium">Enquiry type</th>
                                        <th className="px-3 py-3 text-right font-medium">Expected value</th>
                                        <th className="px-3 py-3 font-medium">Next follow-up</th>
                                        <th className="px-3 py-3 text-right font-medium">Record</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead: any) => (
                                        <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/40">
                                            <td className="px-3 py-4">
                                                <Link href={`/leads/${lead.id}`} className="font-medium hover:underline">
                                                    {lead.name || "Unnamed customer"}
                                                </Link>
                                                <a
                                                    href={`tel:${lead.phone || ""}`}
                                                    className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {lead.phone || "No phone recorded"}
                                                </a>
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {lead.city || "—"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                    {lead.type || "General"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-right font-medium tabular-nums">
                                                {formatCurrency(lead.expectedOrderValue)}
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground">
                                                {formatDate(lead.nextContactDate)}
                                            </td>
                                            <td className="px-3 py-4 text-right">
                                                <Link
                                                    href={`/leads/${lead.id}`}
                                                    aria-label={`Open ${lead.name || "customer"} record`}
                                                    className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted"
                                                >
                                                    Open
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
