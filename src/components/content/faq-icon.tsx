import { BankIcon, BookOpenTextIcon, ChartBarIcon, ClipboardTextIcon, MapPinIcon, QuestionIcon, TargetIcon } from "@phosphor-icons/react/ssr";

const icons = {
  "clat-basics": QuestionIcon,
  "exam-pattern": ChartBarIcon,
  "eligibility-registration": ClipboardTextIcon,
  "nlus-counselling": BankIcon,
  preparation: TargetIcon,
  "noida-centre": MapPinIcon,
};

export function FaqIcon({ category, size = 22 }: { category: string; size?: number }) {
  const Icon = icons[category as keyof typeof icons] ?? BookOpenTextIcon;
  return <Icon size={size} weight="fill" />;
}
