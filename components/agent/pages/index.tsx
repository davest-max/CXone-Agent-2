import { ContactHistoryPage } from "./contact-history-page";
import { SearchPage } from "./search-page";
import { QueuePage } from "./queue-page";
import { DirectoryPage } from "./directory-page";
import { SchedulePage } from "./schedule-page";
import { WemPage } from "./wem-page";
import { SettingsPage } from "./settings-page";
import { ReportingPage } from "./reporting-page";

const PAGE_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  history:   ContactHistoryPage,
  search:    SearchPage,
  queue:     QueuePage,
  directory: DirectoryPage,
  schedule:  SchedulePage,
  wem:       WemPage,
  settings:  SettingsPage,
  reporting: ReportingPage,
};

export function NavRouter({ navId, className }: { navId: string; className?: string }) {
  const Page = PAGE_MAP[navId];
  if (!Page) return null;
  return <Page className={className} />;
}
