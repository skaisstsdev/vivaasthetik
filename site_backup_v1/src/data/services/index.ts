import { mesotherapie } from './mesotherapie';
import { biorevitalisierung } from './biorevitalisierung';
import { faltenunterspritzung } from './faltenunterspritzung';
import { botox } from './botox';
import { lipolyse } from './lipolyse';
import { lippenkorrektur } from './lippenkorrektur';
import { fadenlifting } from './fadenlifting';
import { vampirlifting } from './vampirlifting';
import { haarausfall } from './haarausfall';
import { intimlifting } from './intimlifting';
import { ServiceContent } from './types';

export const servicesData: ServiceContent[] = [
  mesotherapie,
  biorevitalisierung,
  faltenunterspritzung,
  botox,
  lipolyse,
  lippenkorrektur,
  fadenlifting,
  vampirlifting,
  haarausfall,
  intimlifting
];

export const getServiceBySlug = (slug: string): ServiceContent | undefined => {
  return servicesData.find(service => service.slug === slug);
};
