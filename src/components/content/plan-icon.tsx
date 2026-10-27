import { BookOpenTextIcon, CalendarDotsIcon, LightningIcon, TargetIcon } from "@phosphor-icons/react/ssr";

const icons = { calendar: CalendarDotsIcon, book: BookOpenTextIcon, target: TargetIcon, zap: LightningIcon };

export function PlanIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? CalendarDotsIcon;
  return <Icon size={size} weight="fill" />;
}
