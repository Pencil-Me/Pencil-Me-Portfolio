import type { CUSTOMER } from '@app/state/knowledge/knowledge.models';
import {
  mapCustomersToLogos,
  normalizeCustomerName,
  resolveCustomerLogo,
} from './customer-logos.mapper';

describe('customer-logos.mapper', () => {
  it('should normalize HTML entities in customer names', () => {
    expect(normalizeCustomerName('D&amp;D Bildungsagentur GmbH')).toBe('D&D Bildungsagentur GmbH');
  });

  it('should resolve logos by partial name match', () => {
    expect(resolveCustomerLogo('arvato Bertelsmann')?.url).toBe('./assets/logos/arvato.png');
    expect(resolveCustomerLogo('DERMALOG Identification Systems GmbH')?.alt).toBe('Dermalog');
    expect(resolveCustomerLogo('Unknown Corp')).toBeNull();
  });

  it('should map API customers to logos sorted by last_used_date', () => {
    const customers: CUSTOMER[] = [
      {
        name: 'DERMALOG Identification Systems GmbH',
        location: 'Hamburg',
        last_used_date: new Date('2020-01-01'),
      },
      {
        name: 'arvato Bertelsmann',
        location: 'Gütersloh',
        last_used_date: new Date('2023-06-01'),
      },
      {
        name: 'OneStep GmbH',
        location: 'Berlin',
        last_used_date: new Date('2024-01-01'),
      },
    ];

    const logos = mapCustomersToLogos(customers);

    expect(logos.length).toBe(2);
    expect(logos[0].alt).toBe('arvato Bertelsmann');
    expect(logos[1].alt).toBe('Dermalog');
  });

  it('should deduplicate logos that share the same asset', () => {
    const customers: CUSTOMER[] = [
      { name: 'PKW1.de GmbH', location: 'Berlin', last_used_date: new Date('2023-01-01') },
      { name: 'carmudi.com', location: 'Berlin', last_used_date: new Date('2022-01-01') },
    ];

    expect(mapCustomersToLogos(customers).length).toBe(1);
  });
});
