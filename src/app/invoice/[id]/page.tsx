import { InvoiceView } from "./InvoiceView";

export default function InvoicePage({ params }: { params: { id: string } }) {
  return <InvoiceView id={params.id} />;
}
