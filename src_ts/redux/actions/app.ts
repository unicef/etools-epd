/* eslint-disable max-len */
import {Action, ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../store';
import {ROOT_PATH} from '../../config/config';
import {DEFAULT_ROUTE, EtoolsRouter, ROUTE_404, updateAppLocation} from '../../routing/routes';
import {getFilePathsToImport} from '../../routing/component-lazy-load-config';
import {getRedirectToListPath} from '../../routing/subpage-redirect';
import {RouteDetails} from '@unicef-polymer/etools-types';

import {UPDATE_ROUTE_AND_RESET_INTERVENTION} from '../../components/pages/interventions/intervention-tab-pages/common/actions/actionsContants';

export const UPDATE_ROUTE_DETAILS = 'UPDATE_ROUTE_DETAILS';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';

export interface AppActionUpdateRouteDetails extends Action<'UPDATE_ROUTE_DETAILS'> {
  routeDetails: any;
}
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}

export type AppAction = AppActionUpdateRouteDetails | AppActionUpdateDrawerState | any;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updateStoreRouteDetails: ActionCreator<AppActionUpdateRouteDetails> = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE_DETAILS,
    routeDetails
  };
};

const updatRouteDetailsAndResetIntervention = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE_AND_RESET_INTERVENTION,
    routeDetails
  };
};

const loadPageComponents: ActionCreator<ThunkResult> = (routeDetails: RouteDetails) => (dispatch, getState) => {
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    updateAppLocation(ROUTE_404);
    return;
  }

  // const importBase = '../../'; // relative to current file
  // // start importing components (lazy loading)
  const filesToImport: string[] | undefined = getFilePathsToImport(routeDetails);
  if (!filesToImport) {
    console.log('No file imports configuration found (componentsLazyLoadConfig)!');
    updateAppLocation(ROUTE_404);
    return;
  }

  // filesToImport.forEach((filePath: string) => {
  //   import(importBase + filePath)
  //     .then(() => {
  //       // console.info(`component: ${filePath} has been loaded... yey!`);
  //     })
  //     .catch((importError: any) => {
  //       console.info('component import failed...', importError);
  //     });
  // });
  filesToImport.forEach((filePath: string) => {
    if (filePath.includes('intervention-list.js')) {
      import('../../components/pages/interventions/intervention-list.js');
    }
    if (filePath.includes('not-found.js')) {
      import('../../components/pages/not-found.js');
    }
    if (filePath.includes('intervention-metadata.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js'
      );
    }
    if (filePath.includes('intervention-workplan.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js'
      );
    }
    if (filePath.includes('intervention-timing.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import('../../components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js');
    }
    if (filePath.includes('intervention-strategy.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js'
      );
    }
    if (filePath.includes('intervention-attachments.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
      );
    }
    if (filePath.includes('intervention-review.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import('../../components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js');
    }
    if (filePath.includes('intervention-progress.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
      import(
        '../../components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js'
      );
    }
    if (filePath.includes('intervention-review.js')) {
      import('../../components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js');
    }
  });

  // add page details to redux store, to be used in other components
  const prevRouteDetails = getState().app?.routeDetails;
  if (commingFromPDDetailsToList(prevRouteDetails!, routeDetails)) {
    // Avoid multiple list requests after updating PD data that is displayed on the list and then going to the list
    dispatch(updatRouteDetailsAndResetIntervention(routeDetails));
  } else {
    dispatch(updateStoreRouteDetails(routeDetails));
  }
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
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

  const routeDetails: RouteDetails | null = EtoolsRouter.getRouteDetails(path);

  dispatch(loadPageComponents(routeDetails));
};

function commingFromPDDetailsToList(prevRouteDetails: RouteDetails, routeDetails: RouteDetails | null) {
  return (
    routeDetails &&
    prevRouteDetails &&
    prevRouteDetails.routeName === 'interventions' &&
    prevRouteDetails.subRouteName !== 'list' &&
    routeDetails?.subRouteName === 'list'
  );
}
