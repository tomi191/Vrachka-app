"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert("Грешка при отваряне на портала");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="w-full px-4 py-2 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Зареждане...
        </>
      ) : (
        "Управлявай абонамента"
      )}
    </button>
  );
}
