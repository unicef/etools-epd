import {appLanguages} from '../../config/app-constants';
import {RouteDetails} from '@unicef-polymer/etools-types';

// export const isJsonStrMatch = (a: any, b: any) => {
//   return JSON.stringify(a) === JSON.stringify(b);
// };

// export const cloneDeep = (obj: any) => {
//   return JSON.parse(JSON.stringify(obj));
// };

// export const getFileNameFromURL = (url: string) => {
//   if (!url) {
//     return '';
//   }
//   // @ts-ignore
//   return url.split('?').shift().split('/').pop();
// };

// export function capitalizeFirstLetter(str: string) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

export const languageIsAvailableInApp = (lngCode: string) => {
  return appLanguages.some((lng) => lng.value === lngCode);
};

export const commingFromPDDetailsToList = (prevRouteDetails: RouteDetails, routeDetails: RouteDetails | null) => {
  return (
    routeDetails &&
    prevRouteDetails &&
    prevRouteDetails.routeName === 'interventions' &&
    prevRouteDetails.subRouteName !== 'list' &&
    routeDetails?.subRouteName === 'list'
  );
};
