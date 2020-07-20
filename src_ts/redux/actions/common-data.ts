import {Action, ActionCreator} from 'redux';
import {AnyObject, Disaggregation, LocationObject, Section} from '../../types/globals';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';
import {getGenderEquityRatingsDummy} from '../../components/pages/interventions/list/list-dummy-data';

const LOGS_PREFIX = 'Redux common-data actions';

export const SET_UNICEF_USERS_DATA = 'SET_UNICEF_USERS_DATA';
export const SET_PARTNERS = 'SET_PARTNERS';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_SECTIONS = 'SET_SECTIONS';
export const SET_LOCATION_TYPES = 'SET_LOCATION_TYPES';
export const SET_DISAGGREGATIONS = 'SET_DISAGGREGATIONS';
export const SET_DOCUMENT_TYPES = 'SET_DOCUMENT_TYPES';
export const SET_GENDER_EQUITY_RATINGS = 'SET_GENDER_EQUITY_RATINGS';

export interface CommonDataActionSetUnicefUsersData extends Action<'SET_UNICEF_USERS_DATA'> {
  unicefUsersData: AnyObject[];
}

export interface CommonDataActionSetLocations extends Action<'SET_LOCATIONS'> {
  locations: LocationObject[];
}

export interface CommonDataActionSetSections extends Action<'SET_SECTIONS'> {
  sections: Section[];
}

export interface CommonDataActionSetDisaggregations extends Action<'SET_DISAGGREGATIONS'> {
  disaggregations: Disaggregation[];
}

export interface CommonDataActionSetLocationTypes extends Action<'SET_LOCATION_TYPES'> {
  locationTypes: AnyObject[];
}

export interface CommonDataActionSetDocumentTypes extends Action<'SET_DOCUMENT_TYPES'> {
  documentTypes: AnyObject[];
}

export interface CommonDataActionSetGenderEquityRatings extends Action<'SET_GENDER_EQUITY_RATINGS'> {
  genderEquityRatings: AnyObject[];
}

export type CommonDataAction =
  | CommonDataActionSetUnicefUsersData
  | CommonDataActionSetLocations
  | CommonDataActionSetLocationTypes
  | CommonDataActionSetDocumentTypes
  | CommonDataActionSetGenderEquityRatings
  | CommonDataActionSetSections
  | CommonDataActionSetDisaggregations;

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

export const setSections = (sections: Section[]) => {
  return {
    type: SET_SECTIONS,
    sections
  };
};

export const setDisaggregations = (disaggregations: Disaggregation[]) => {
  return {
    type: SET_DISAGGREGATIONS,
    disaggregations
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

export const setGenderEquityRatings = (genderEquityRatings: AnyObject[]) => {
  return {
    type: SET_GENDER_EQUITY_RATINGS,
    genderEquityRatings
  };
};

export const loadPartners = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.partners.url!}
  })
    .then((resp: any) => dispatch(setPartners(resp)))
    .catch((error: AnyObject) => {
      logError('loadPartners req error...', LOGS_PREFIX, error);
    });
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

export const loadSections = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.sections.url!}
  })
    .then((resp: Section[]) => dispatch(setSections(resp)))
    .catch((error: AnyObject) => {
      logError('loadSections req error...', LOGS_PREFIX, error);
    });
};

export const loadDisaggregations = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.disaggregations.url!}
  })
    .then((resp: Disaggregation[]) => dispatch(setDisaggregations(resp)))
    .catch((error: AnyObject) => {
      logError('loadDisaggregations req error...', LOGS_PREFIX, error);
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
    if (staticData.genderEquityRatings) {
      dispatch(setGenderEquityRatings(staticData.genderEquityRatings));
    } else {
      dispatch(setGenderEquityRatings(getGenderEquityRatingsDummy()));
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
