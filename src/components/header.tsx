"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SplitIcon } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";

export function Header() {
  const pathname = usePathname();
  const shouldShowCreateGroupButton = !pathname.includes("/groups/");
  const t = useTranslations("common");

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <SplitIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">{t("appName")}</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <LanguageSwitcher />
          {shouldShowCreateGroupButton && (
            <Link href="/groups/new">
              <Button>{t("buttons.createGroup")}</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
