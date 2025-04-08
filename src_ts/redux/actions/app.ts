/* eslint-disable max-len */
import {Action, ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../store';
import {RouteDetails} from '@unicef-polymer/etools-types';
import {UPDATE_ROUTE} from '../../components/pages/interventions/intervention-tab-pages/common/actions/actionsContants';
import {enableCommentMode} from '../../components/pages/interventions/intervention-tab-pages/common/components/comments/comments.actions';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}

export type AppAction = AppActionUpdateDrawerState | any;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updateRouteDetails = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE,
    routeDetails
  };
};

const loadPageComponents: ActionCreator<ThunkResult> = (routeDetails: RouteDetails) => async (dispatch, _getState) => {
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
    return;
  }

  const page = routeDetails.routeName;
  const subpage = routeDetails.subRouteName;
  const tab = routeDetails.params?.tab; // Used only to check if the route is used for tabs, but tab = subpage
  try {
    if (!subpage) {
      await import(`../../components/pages/${page}/${page}.ts`);
    } else {
      if (tab) {
        await import(`../../components/pages/${page}/intervention-tab-pages/intervention-tabs.ts`);
        await import(
          `../../components/pages/${page}/intervention-tab-pages/intervention-${subpage}/intervention-${subpage}.ts`
        );
      } else {
        await import(`../../components/pages/${page}/intervention-${subpage}.ts`);
      }
    }
  } catch {
    console.log(`No file imports configuration found: ${page}!`);
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
  }

  // if (routeDetails.routeName === 'not-found') {
  //   import('../../components/pages/not-found.js');
  // } else {
  //   switch (routeDetails.subRouteName) {
  //     case 'list':
  //       import('../../components/pages/interventions/intervention-list.js');
  //       break;
  //     case 'metadata':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js'
  //       );
  //       break;
  //     case 'workplan':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js'
  //       );
  //       break;
  //     case 'workplan-editor':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-workplan-editor/intervention-workplan-editor.js'
  //       );
  //       break;
  //     case 'timing':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js'
  //       );
  //       break;
  //     case 'strategy':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js'
  //       );
  //       break;
  //     case 'attachments':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
  //       );
  //       break;
  //     case 'review':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'
  //       );
  //       break;
  //     case 'progress':
  //       import('../../components/pages/interventions/intervention-tab-pages/intervention-tabs.js');
  //       import(
  //         '../../components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js'
  //       );
  //       break;

  //     default:
  //       console.log('No file imports configuration found (componentsLazyLoadConfig)!');
  //       EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
  //       break;
  //   }
  // }

  // const prevRouteDetails = getState().app?.routeDetails;
  // if (commingFromPDDetailsToList(prevRouteDetails!, routeDetails)) {
  // Avoid multiple list requests after updating PD data that is displayed on the list and then going to the list

  // add page details to redux store, to be used in other components
  dispatch(updateRouteDetails(routeDetails));
  dispatch(enableCommentMode(Boolean(routeDetails?.queryParams?.comment_mode)));
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  // @ts-ignore
  if (
    path === Environment.basePath &&
    Environment.basePath !== EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT)
  ) {
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined = EtoolsRouter.getRedirectToListPath(path);
  if (redirectPath) {
    EtoolsRouter.updateAppLocation(redirectPath);
    return;
  }

  const routeDetails: EtoolsRouteDetails | null = EtoolsRouter.getRouteDetails(path);

  dispatch(loadPageComponents(routeDetails));
};
