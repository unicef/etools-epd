import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {RouteCallbackParams, RouteDetails} from '@unicef-polymer/etools-types';

const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter.init({
  baseUrl: Environment.basePath,
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
          tab: params.matchDetails[2],
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
          tab: params.matchDetails[2],
          subtab: params.matchDetails[3],
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
