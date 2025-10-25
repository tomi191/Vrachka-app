"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  priceId: string;
  currency?: 'bgn' | 'eur';
  className?: string;
}

export function CheckoutButton({ priceId, currency = 'bgn', className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData to send priceId and currency
      const formData = new FormData();
      formData.append("priceId", priceId);
      formData.append("currency", currency);

      // Call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Нещо се обърка");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? "Зареждане..." : "Абонирай се"}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">Грешка: {error}</p>
      )}
    </div>
  );
}
