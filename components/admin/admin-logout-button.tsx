"use client";

import { LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  return (
    <SignOutButton redirectUrl="/admin/sign-in">
      <Button
        type="button"
        variant="outline"
        className="rounded-full px-4"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </SignOutButton>
  );
}