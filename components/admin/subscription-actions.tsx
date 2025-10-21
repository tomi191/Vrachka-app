"use client";

import { useState } from "react";
import { Crown, Trash2, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface GrantPremiumProps {
  userId?: string;
  userName?: string;
}

interface CancelSubscriptionProps {
  userId: string;
  userName: string;
  currentPlan: string;
}

export function GrantPremiumButton({ userId, userName }: GrantPremiumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [selectedDays, setSelectedDays] = useState<string>("30");
  const router = useRouter();
  const { toast } = useToast();

  const handleGrantPremium = async () => {
    if (!userId) {
      toast({
        title: "Грешка",
        description: "Моля, изберете потребител",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/subscriptions/create-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          planType: selectedPlan,
          durationDays: parseInt(selectedDays),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to grant premium");
      }

      toast({
        title: "Успешно!",
        description: `${userName ? `${userName} получи` : "Даден"} ${selectedPlan} план за ${selectedDays} дни`,
        className: "bg-green-900/30 border-green-500/50 text-green-100",
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно даване на премиум",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-0 shadow-lg hover:shadow-accent-500/50 transition-all duration-300"
        >
          <Gift className="w-4 h-4 mr-2" />
          Дай Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent-400" />
            Дай Premium Абонамент
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {userName ? `Давай на ${userName}` : "Изберете план и продължителност"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Изберете план
            </label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Изберете план" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="basic" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-blue-400" />
                    <span>Basic Plan</span>
                  </div>
                </SelectItem>
                <SelectItem value="ultimate" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-accent-400" />
                    <span>Ultimate Plan</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Продължителност
            </label>
            <Select value={selectedDays} onValueChange={setSelectedDays}>
              <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Изберете дни" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="7" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  7 дни (седмица)
                </SelectItem>
                <SelectItem value="30" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  30 дни (месец)
                </SelectItem>
                <SelectItem value="90" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  90 дни (3 месеца)
                </SelectItem>
                <SelectItem value="365" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  365 дни (година)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Преглед:</p>
            <p className="text-sm text-zinc-300">
              План: <span className="font-semibold text-accent-400">{selectedPlan.toUpperCase()}</span>
            </p>
            <p className="text-sm text-zinc-300">
              Период: <span className="font-semibold text-blue-400">{selectedDays} дни</span>
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Изтича на: {new Date(Date.now() + parseInt(selectedDays) * 24 * 60 * 60 * 1000).toLocaleDateString("bg-BG")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
          >
            Откажи
          </Button>
          <Button
            onClick={handleGrantPremium}
            disabled={isLoading}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-0"
          >
            {isLoading ? "Зареждане..." : "Дай Premium"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CancelSubscriptionButton({
  userId,
  userName,
  currentPlan,
}: CancelSubscriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          reason: "Admin canceled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast({
        title: "Успешно!",
        description: `Абонаментът на ${userName} е отказан`,
        className: "bg-orange-900/30 border-orange-500/50 text-orange-100",
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешен отказ на абонамент",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPlan === "free") {
    return null; // Don't show cancel button for free users
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-900/20 border-red-800/50 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Откажи
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            Откажи абонамент
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Наистина ли искате да откажете абонамента?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg">
            <p className="text-sm text-zinc-300 mb-2">
              Потребител: <span className="font-semibold text-zinc-100">{userName}</span>
            </p>
            <p className="text-sm text-zinc-300">
              Текущ план: <span className="font-semibold text-accent-400">{currentPlan.toUpperCase()}</span>
            </p>
            <p className="text-xs text-red-400 mt-3">
              Това ще отмени абонамента и ще го върне на FREE план веднага.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
          >
            Не, запази
          </Button>
          <Button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="bg-red-900/50 hover:bg-red-900/70 text-red-100 border-0"
          >
            {isLoading ? "Зареждане..." : "Да, откажи"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
