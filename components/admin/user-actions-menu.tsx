"use client";

import { useState } from "react";
import { MoreVertical, UserCog, Crown, Shield, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UserActionsMenuProps {
  userId: string;
  userName: string;
  currentPlan: string;
  isAdmin: boolean;
}

export function UserActionsMenu({
  userId,
  userName,
  currentPlan,
  isAdmin,
}: UserActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const changePlan = async (newPlan: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPlan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change plan");
      }

      toast({
        title: "Успешно!",
        description: `Плана на ${userName} е сменен на ${newPlan}`,
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешна промяна на план",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users/toggle-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: !isAdmin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle admin status");
      }

      toast({
        title: "Успешно!",
        description: `${userName} ${!isAdmin ? "е admin" : "не е admin вече"}`,
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешна промяна",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
        <DropdownMenuLabel className="text-zinc-300">Действия</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />

        {/* Change Plan */}
        <DropdownMenuLabel className="text-xs text-zinc-500 px-2 py-1">
          <UserCog className="w-3 h-3 inline mr-1" />
          Смени план
        </DropdownMenuLabel>
        {currentPlan !== "free" && (
          <DropdownMenuItem
            onClick={() => changePlan("free")}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Free
          </DropdownMenuItem>
        )}
        {currentPlan !== "basic" && (
          <DropdownMenuItem
            onClick={() => changePlan("basic")}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Crown className="w-4 h-4 mr-2 text-blue-400" />
            Basic
          </DropdownMenuItem>
        )}
        {currentPlan !== "ultimate" && (
          <DropdownMenuItem
            onClick={() => changePlan("ultimate")}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Crown className="w-4 h-4 mr-2 text-accent-400" />
            Ultimate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-zinc-800" />

        {/* Toggle Admin */}
        <DropdownMenuItem
          onClick={toggleAdmin}
          className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <Shield className="w-4 h-4 mr-2" />
          {isAdmin ? "Махни admin" : "Направи admin"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
