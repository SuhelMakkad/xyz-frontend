import { ChartAreaInteractive } from './components/chart-area-interactive';
import { SalesTable } from './components/data-table';
import { SectionCards } from './components/section-cards';
import data from './data.json';

export default function Page() {
  return (
    <>
      <SectionCards />

      <ChartAreaInteractive />

      <SalesTable data={data} />
    </>
  );
}
