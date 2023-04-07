import { EtoolsRouter } from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ROOT_PATH} from '../config/config';
import {RouteCallbackParams, RouteDetails} from '@unicef-polymer/etools-types';

const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter.init({
  baseUrl: ROOT_PATH,
  redirectPaths: {
    notFound: '/not-found',
    default: '/interventions/list'
  },
  redirectedPathsToSubpageLists: ['interventions']
});

EtoolsRouter.addRoute(new RegExp('^interventions/list$'), (params: RouteCallbackParams): RouteDetails => {
  return {
    routeName: 'interventions',
    subRouteName: 'list',
    path: params.matchDetails[0],
    queryParams: params.queryParams,
    params: null
  };
})
  .addRoute(
    new RegExp(`^interventions\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: RouteCallbackParams): RouteDetails => {
      return {
        routeName: 'interventions',
        subRouteName: params.matchDetails[2], // tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: {
          interventionId: params.matchDetails[1]
        }
      };
    }
  )
  .addRoute(
    new RegExp(`^interventions\\/${routeParamRegex}\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: RouteCallbackParams): RouteDetails => {
      return {
        routeName: 'interventions',
        subRouteName: params.matchDetails[2], // tab name
        subSubRouteName: params.matchDetails[3], // sub tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: {
          interventionId: params.matchDetails[1]
        }
      };
    }
  )
  .addRoute(new RegExp(`^not-found$`), (params: RouteCallbackParams): RouteDetails => {
    return {
      routeName: 'not-found',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      params: null
    };
  });