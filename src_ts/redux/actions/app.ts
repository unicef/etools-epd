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

export const updateRouteDetails = (routeDetails: any) => {
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
