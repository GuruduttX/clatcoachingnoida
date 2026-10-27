"use client";

import {
  ArticleIcon,
  BankIcon,
  BookOpenTextIcon,
  CalendarDotsIcon,
  ChalkboardTeacherIcon,
  ClipboardTextIcon,
  FootprintsIcon,
  ImagesIcon,
  InfoIcon,
  LightbulbIcon,
  MapPinIcon,
  NewspaperIcon,
  PathIcon,
  QuestionIcon,
  SealPercentIcon,
  StackIcon,
  StarIcon,
  TimerIcon,
  TrophyIcon,
  type Icon,
  type IconWeight,
} from "@phosphor-icons/react";

const icons: Record<string, Icon> = {
  book: BookOpenTextIcon,
  calendar: CalendarDotsIcon,
  seal: SealPercentIcon,
  steps: FootprintsIcon,
  trophy: TrophyIcon,
  star: StarIcon,
  chalkboard: ChalkboardTeacherIcon,
  images: ImagesIcon,
  stack: StackIcon,
  article: ArticleIcon,
  newspaper: NewspaperIcon,
  path: PathIcon,
  lightbulb: LightbulbIcon,
  bank: BankIcon,
  clipboard: ClipboardTextIcon,
  question: QuestionIcon,
  info: InfoIcon,
  pin: MapPinIcon,
  timer: TimerIcon,
};

export function DestIcon({ name, size = 22, weight = "fill", className }: { name: string; size?: number; weight?: IconWeight; className?: string }) {
  const Component = icons[name] ?? InfoIcon;
  return <Component size={size} weight={weight} className={className} />;
}
