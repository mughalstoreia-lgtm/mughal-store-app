"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-success-soft text-accent-success">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-content-main mb-2">Order Placed!</h1>
      <p className="text-content-sub mb-2 max-w-md">
        Thank you for your purchase. We will process your order shortly.
      </p>
      {id && (
        <p className="text-sm text-content-muted mb-8">
          Order ID: <span className="font-mono text-content-main">{id}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {id && (
          <Link href={`/account/orders/${id}`}>
            <Button variant="primary">View Order</Button>
          </Link>
        )}
        <Link href="/shop">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
