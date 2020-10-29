import {GenericObject, RouteDetails} from '@unicef-polymer/etools-types';

// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: GenericObject<string[]> = {
  interventions_list: ['components/pages/interventions/intervention-list.js'],
  interventions_overview: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-overview/intervention-overview.js'
  ],
  interventions_details: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-details/intervention-details.js'
  ],
  interventions_results: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-results/intervention-results.js'
  ],
  interventions_timing: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js'
  ],
  interventions_management: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-management/intervention-management.js'
  ],
  interventions_attachments: [
    'components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
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
