"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { GlobeIcon } from "lucide-react";
import Cookies from 'js-cookie';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' }
];

export function LanguageSwitcher() {
  const currentLocale = useLocale();

  const handleLanguageChange = (locale: string) => {
    Cookies.set('NEXT_LOCALE', locale);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <GlobeIcon className="h-4 w-4" />
          {languages.find(lang => lang.code === currentLocale)?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLocale === language.code ? "bg-secondary" : ""}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}