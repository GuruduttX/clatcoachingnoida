import type { Metadata } from "next";
import { EnquiriesScreen } from "@/components/admin/enquiries";

export const metadata: Metadata = { title: "Enquiries" };

export default function EnquiriesPage() {
  return <EnquiriesScreen />;
}
