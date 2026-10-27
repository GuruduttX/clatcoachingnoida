"use client";

import {
  BankIcon,
  CalendarDotsIcon,
  ArticleIcon,
  NewspaperIcon,
  PathIcon,
  QuestionIcon,
  SquaresFourIcon,
  StarIcon,
  TrayIcon,
  TrophyIcon,
  type Icon,
  type IconWeight,
} from "@phosphor-icons/react";

const icons: Record<string, Icon> = {
  dashboard: SquaresFourIcon,
  inbox: TrayIcon,
  blogs: ArticleIcon,
  "current-affairs": NewspaperIcon,
  "nlu-profiles": BankIcon,
  "toppers-strategy": TrophyIcon,
  "study-plans": PathIcon,
  faqs: QuestionIcon,
  reviews: StarIcon,
  batches: CalendarDotsIcon,
};

export function AdminIcon({ name, size = 20, weight = "regular", className }: { name: string; size?: number; weight?: IconWeight; className?: string }) {
  const Component = icons[name] ?? SquaresFourIcon;
  return <Component size={size} weight={weight} className={className} />;
}
