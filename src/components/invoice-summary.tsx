import { formatCurrency, formatInteger } from "@/lib/format";
import type { Invoice } from "@/lib/types";

interface InvoiceSummaryProps {
  invoice: Invoice | null;
}

const statusTone: Record<Invoice["status"], string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function InvoiceSummary({ invoice }: InvoiceSummaryProps) {
  if (!invoice) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500">
        No invoices yet.
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">Latest invoice</h2>
        <span className="text-sm text-gray-500">{invoice.invoiceNumber}</span>
      </header>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Period</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {invoice.periodStart} → {invoice.periodEnd}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Covers billed</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatInteger(invoice.coversBilled)}
            <span className="ml-1 text-gray-500">
              (−{formatInteger(invoice.noShowsNotCharged)} no-shows)
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total due</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(invoice.totalDue, invoice.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
          <p className="mt-1">
            <span
              className={
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset " +
                statusTone[invoice.status]
              }
            >
              {invoice.status}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
