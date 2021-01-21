import {Action, ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../store';
import {ROOT_PATH} from '../../config/config';
import {DEFAULT_ROUTE, EtoolsRouter, ROUTE_404, updateAppLocation} from '../../routing/routes';
import {getFilePathsToImport} from '../../routing/component-lazy-load-config';
import {getRedirectToListPath} from '../../routing/subpage-redirect';
import {RouteDetails} from '@unicef-polymer/etools-types';

export const UPDATE_ROUTE_DETAILS = 'UPDATE_ROUTE_DETAILS';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';

export interface AppActionUpdateRouteDetails extends Action<'UPDATE_ROUTE_DETAILS'> {
  routeDetails: any;
}
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}

export type AppAction = AppActionUpdateRouteDetails | AppActionUpdateDrawerState;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updateStoreRouteDetails: ActionCreator<AppActionUpdateRouteDetails> = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE_DETAILS,
    routeDetails
  };
};

const loadPageComponents = (routeDetails: RouteDetails | null) => {
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    updateAppLocation(ROUTE_404);
    return;
  }

  const importBase = '../../'; // relative to current file
  // start importing components (lazy loading)
  const filesToImport: string[] | undefined = getFilePathsToImport(routeDetails);
  if (!filesToImport) {
    console.log('No file imports configuration found (componentsLazyLoadConfig)!');
    updateAppLocation(ROUTE_404);
    return;
  }

  filesToImport.forEach((filePath: string) => {
    if (filePath.includes('intervention-list.js')) {
      import('../../components/pages/interventions/intervention-list.js');
    }
    if (filePath.includes('page-not-found.js')) {
      import('../../components/pages/page-not-found.js');
    }
    if (filePath.includes('intervention-tabs.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
    }
    if (filePath.includes('intervention-details.js')) {
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-details/intervention-details.js'
      );
    }
    if (filePath.includes('intervention-overview.js')) {
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-overview/intervention-overview.js'
      );
    }
    if (filePath.includes('intervention-results.js')) {
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-results/intervention-results.js'
      );
    }
    if (filePath.includes('intervention-timing.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js');
    }
    if (filePath.includes('intervention-management.js')) {
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-management/intervention-management.js'
      );
    }
    if (filePath.includes('intervention-attachments.js')) {
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
      );
    }
    if (filePath.includes('intervention-review.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js');
    }
    // import(importBase + filePath)
    //   .then(() => {
    //     // console.info(`component: ${filePath} has been loaded... yey!`);
    //   })
    //   .catch((importError: any) => {
    //     console.info('component import failed...', importError);
    //   });
  });
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  const routeDetails: RouteDetails | null = EtoolsRouter.getRouteDetails(path);
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  // @ts-ignore
  if (path === ROOT_PATH && ROOT_PATH !== DEFAULT_ROUTE) {
    updateAppLocation(DEFAULT_ROUTE);
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined = getRedirectToListPath(path);
  if (redirectPath) {
    updateAppLocation(redirectPath);
    return;
  }

  loadPageComponents(routeDetails);

  // add page details to redux store, to be used in other components
  dispatch(updateStoreRouteDetails(routeDetails));
};
