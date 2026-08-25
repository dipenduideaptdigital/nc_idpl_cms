import { lazy } from 'react';
import { config as landingBasicConfig } from '../landing-basic/config';
import { config as landingRipplesConfig } from '../landing-ripples/config';

export const templateRegistry = {
  "landing-basic": {
    component: lazy(() => import('../landing-basic/index')),
    config: landingBasicConfig
  },
  "landing-ripples": {
    component: lazy(() => import('../landing-ripples/index')),
    config: landingRipplesConfig
  }
};