import {GenericObject, RouteDetails} from '@unicef-polymer/etools-types';

// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: GenericObject<string[]> = {
  interventions_list: ['components/pages/interventions/intervention-list.js'],
  interventions_metadata: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js'
  ],
  interventions_workplan: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js'
  ],
  interventions_timing: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js'
  ],
  interventions_strategy: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js'
  ],
  interventions_attachments: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
  ],
  interventions_review: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'
  ],
  interventions_progress: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js'
  ],
  'page-not-found': ['components/pages/page-not-found.js']
};

export const getFilePathsToImport = (routeDetails: RouteDetails): string[] | undefined => {
  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }
  const filesToImport: string[] = componentsLazyLoadConfig[routeImportsPathsKey];
  return filesToImport;
};
