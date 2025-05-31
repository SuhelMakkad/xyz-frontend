import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Translate } from '@/components/translate';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define the data structure for the cards
const cardData = [
  {
    id: 'revenue',
    description: 'dashboard.cards.revenue.description',
    value: '$1,250.00',
    trend: '+12.5%',
    trendDirection: 'up',
    status: 'dashboard.cards.revenue.status',
    subtext: 'dashboard.cards.revenue.subtext',
  },
  {
    id: 'customers',
    description: 'dashboard.cards.customers.description',
    value: '1,234',
    trend: '-20%',
    trendDirection: 'down',
    status: 'dashboard.cards.customers.status',
    subtext: 'dashboard.cards.customers.subtext',
  },
  {
    id: 'accounts',
    description: 'dashboard.cards.accounts.description',
    value: '45,678',
    trend: '+12.5%',
    trendDirection: 'up',
    status: 'dashboard.cards.accounts.status',
    subtext: 'dashboard.cards.accounts.subtext',
  },
  {
    id: 'growth',
    description: 'dashboard.cards.growth.description',
    value: '4.5%',
    trend: '+4.5%',
    trendDirection: 'up',
    status: 'dashboard.cards.growth.status',
    subtext: 'dashboard.cards.growth.subtext',
  },
] as const;

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.id} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Translate tKey={card.description} />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trendDirection === 'up' ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.trend}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Translate tKey={card.status} />{' '}
              {card.trendDirection === 'up' ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              <Translate tKey={card.subtext} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
