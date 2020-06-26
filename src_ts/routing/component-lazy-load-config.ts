import {RouteDetails} from './router';

export interface RoutesLazyLoadComponentsPath {
  [key: string]: string[];
}
// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: RoutesLazyLoadComponentsPath = {
  interventions_list: ['components/pages/interventions/intervention-list.js'],
  interventions_details: [
    'components/pages/interventions/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-details.js'
  ],
  interventions_questionnaires: [
    'components/pages/interventions/intervention-tabs.js',
    'components/pages/interventions/intervention-tab-pages/intervention-questionnaires.js'
  ],
  'page-not-found': ['components/pages/page-not-found.js'],
  'page-two': ['components/pages/page-two.js']
};

export const getFilePathsToImport = (routeDetails: RouteDetails): string[] => {
  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }

  const filesToImport: string[] = componentsLazyLoadConfig[routeImportsPathsKey];
  if (!filesToImport || filesToImport.length === 0) {
    throw new Error('No file imports configuration found (componentsLazyLoadConfig)!');
  }
  return filesToImport;
};
