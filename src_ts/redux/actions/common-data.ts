import {getDummyData} from '../../components/pages/interventions/list/list-dummy-data';
import {Action, ActionCreator} from 'redux';
import {AnyObject} from '../../types/globals';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';

const LOGS_PREFIX = 'Redux common-data actions';

export const SET_UNICEF_USERS_DATA = 'SET_UNICEF_USERS_DATA';
export const SET_PARTNERS = 'SET_PARTNERS';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_LOCATION_TYPES = 'SET_LOCATION_TYPES';
export const SET_DOCUMENT_TYPES = 'SET_DOCUMENT_TYPES';

export interface CommonDataActionSetUnicefUsersData extends Action<'SET_UNICEF_USERS_DATA'> {
  unicefUsersData: AnyObject[];
}

export interface CommonDataActionSetLocations extends Action<'SET_LOCATIONS'> {
  locations: AnyObject[];
}

export interface CommonDataActionSetLocationTypes extends Action<'SET_LOCATION_TYPES'> {
  locationTypes: AnyObject[];
}

export interface CommonDataActionSetDocumentTypes extends Action<'SET_DOCUMENT_TYPES'> {
  documentTypes: AnyObject[];
}

export type CommonDataAction =
  | CommonDataActionSetUnicefUsersData
  | CommonDataActionSetLocations
  | CommonDataActionSetLocationTypes
  | CommonDataActionSetDocumentTypes;

export const setUnicefUsers: ActionCreator<CommonDataActionSetUnicefUsersData> = (unicefUsersData: AnyObject[]) => {
  return {
    type: SET_UNICEF_USERS_DATA,
    unicefUsersData
  };
};

export const setPartners = (partners: AnyObject[]) => {
  return {
    type: SET_PARTNERS,
    partners
  };
};

export const setLocations = (locations: AnyObject[]) => {
  return {
    type: SET_LOCATIONS,
    locations
  };
};

export const setLocationTypes = (locationTypes: AnyObject[]) => {
  return {
    type: SET_LOCATION_TYPES,
    locationTypes
  };
};

export const setDocumentTypes = (documentTypes: AnyObject[]) => {
  return {
    type: SET_DOCUMENT_TYPES,
    documentTypes
  };
};

export const loadPartners = () => (dispatch: any) => {
  // here will make request to endpoint to load data
  dispatch(setPartners(getDummyData('Partner')));
};

export const loadLocations = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.locations.url!}
  })
    .then((resp: any) => dispatch(setLocations(resp)))
    .catch((error: AnyObject) => {
      logError('loadLocations req error...', LOGS_PREFIX, error);
    });
};

const handleStaticData = (staticData: AnyObject) => (dispatch: any) => {
  if (staticData) {
    if (staticData.location_types) {
      dispatch(setLocationTypes(staticData.location_types));
    }
    if (staticData.intervention_doc_type) {
      dispatch(setDocumentTypes(staticData.intervention_doc_type));
    }
  }
};

export const loadStaticData = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.static.url!}
  })
    .then((resp: any) => dispatch(handleStaticData(resp)))
    .catch((error: AnyObject) => {
      logError('loadStaticData req error...', LOGS_PREFIX, error);
    });
};
