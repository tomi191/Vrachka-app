"use client";

import { useState, useEffect } from "react";
import { Crown, Gift, Search } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  full_name: string;
  zodiac_sign?: string;
}

export function GrantPremiumWithUserSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [selectedDays, setSelectedDays] = useState<string>("30");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, zodiac_sign")
      .order("full_name", { ascending: true });

    if (!error && data) {
      setUsers(data);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleGrantPremium = async () => {
    if (!selectedUserId) {
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
          userId: selectedUserId,
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
        description: `${selectedUser?.full_name} получи ${selectedPlan} план за ${selectedDays} дни`,
        className: "bg-green-900/30 border-green-500/50 text-green-100",
      });

      setIsOpen(false);
      setSelectedUserId("");
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
          className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-0 shadow-lg hover:shadow-accent-500/50 transition-all duration-300"
        >
          <Gift className="w-4 h-4 mr-2" />
          Дай Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent-400" />
            Дай Premium Абонамент
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Изберете потребител, план и продължителност
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Изберете потребител
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Търси потребител..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Изберете потребител" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      {user.full_name} {user.zodiac_sign ? `(${user.zodiac_sign})` : ""}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-zinc-500 text-sm">
                    Няма намерени потребители
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

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
          {selectedUser && (
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs text-zinc-500 mb-2">Преглед:</p>
              <p className="text-sm text-zinc-300">
                Потребител: <span className="font-semibold text-zinc-100">{selectedUser.full_name}</span>
              </p>
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
          )}
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
            disabled={isLoading || !selectedUserId}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Зареждане..." : "Дай Premium"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
