"use client";

import Link from "next/link";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const products = [
  { id: "LP-001", name: "Education Loan", interest: 12, term: 24, status: "Active" },
  { id: "LP-002", name: "Business Loan", interest: 15, term: 36, status: "Active" },
  { id: "LP-003", name: "Emergency Loan", interest: 18, term: 12, status: "Suspended" },
];

export default function LoanProductsPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Products</h1>
          <p className="mt-1 text-sm text-slate-500">View all loan products across the platform.</p>
        </div>

        <Link href="/system-admin/loan-products/create" className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
          Create Product
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Interest</TableCell>
            <TableCell>Term (months)</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium text-slate-800">{product.id}</TableCell>
              <TableCell className="text-slate-700">{product.name}</TableCell>
              <TableCell className="text-slate-600">{product.interest}%</TableCell>
              <TableCell className="text-slate-600">{product.term}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {product.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
