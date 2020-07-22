import {Action, ActionCreator} from 'redux';
import {AnyObject, Disaggregation, LocationObject, Section, CpOutput} from '../../types/globals';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';
import {getGenderEquityRatingsDummy} from '../../components/pages/interventions/list/list-dummy-data';

const LOGS_PREFIX = 'Redux common-data actions';

export const SET_UNICEF_USERS = 'SET_UNICEF_USERS';
export const SET_PARTNERS = 'SET_PARTNERS';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_SECTIONS = 'SET_SECTIONS';
export const SET_LOCATION_TYPES = 'SET_LOCATION_TYPES';
export const SET_DISAGGREGATIONS = 'SET_DISAGGREGATIONS';
export const SET_DOCUMENT_TYPES = 'SET_DOCUMENT_TYPES';
export const SET_GENDER_EQUITY_RATINGS = 'SET_GENDER_EQUITY_RATINGS';
export const SET_OFFICES = 'SET_OFFICES';
export const SET_STATIC_DATA = 'SET_STATIC_DATA';
export const SET_ALL_STATIC_DATA = 'SET_ALL_STATIC_DATA';
export const SET_CP_OUTPUTS = 'SET_CP_OUTPUTS';

export interface CommonDataActionSetUnicefUsers extends Action<'SET_UNICEF_USERS'> {
  unicefUsers: AnyObject[];
}

export interface CommonDataActionSetCpOutputsData extends Action<'SET_CP_OUTPUTS'> {
  cpOutputs: CpOutput[];
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

export interface CommonDataActionSetOffices extends Action<'SET_GENDER_EQUITY_RATINGS'> {
  genderEquityRatings: AnyObject[];
}

export interface CommonDataActionSetGenderEquityRatings extends Action<'SET_OFFICES'> {
  offices: AnyObject[];
}

export type CommonDataAction =
  | CommonDataActionSetCpOutputsData
  | CommonDataActionSetUnicefUsers
  | CommonDataActionSetLocations
  | CommonDataActionSetLocationTypes
  | CommonDataActionSetDocumentTypes
  | CommonDataActionSetGenderEquityRatings
  | CommonDataActionSetSections
  | CommonDataActionSetDisaggregations
  | CommonDataActionSetOffices;

export const setUnicefUsers: ActionCreator<CommonDataActionSetUnicefUsers> = (unicefUsers: AnyObject[]) => {
  return {
    type: SET_UNICEF_USERS,
    unicefUsers
  };
};

export const setCpOutputs: ActionCreator<CommonDataActionSetCpOutputsData> = (cpOutputs: CpOutput[]) => {
  return {
    type: SET_CP_OUTPUTS,
    cpOutputs
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

export const setOfices = (offices: AnyObject[]) => {
  return {
    type: SET_OFFICES,
    offices
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

export const getPartners = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.partners.url!}
  });
};

export const loadDropdownsData = () => (dispatch: any) => {
  sendRequest({
    endpoint: {url: etoolsEndpoints.dropdownsData.url!}
  })
    .then((resp: any) => {
      if (resp.cp_outputs) {
        return dispatch(setCpOutputs(resp.cp_outputs));
      }
    })
    .catch((error: AnyObject) => {
      logError('loadDropdownsData req error...', LOGS_PREFIX, error);
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

export const getLocations = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.locations.url!}
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

export const getSections = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.sections.url!}
  });
};

export const getOffices = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.offices.url!}
  });
};

export const getUnicefUsers = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.unicefUsers.url!}
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

export const getDisaggregations = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.disaggregations.url!}
  });
};

const handleStaticData = (staticData: AnyObject) => (dispatch: any) => {
  if (staticData) {
    const data = {
      location_types: staticData.location_types,
      intervention_doc_type: staticData.intervention_doc_type,
      genderEquityRatings: staticData.genderEquityRatings
        ? staticData.genderEquityRatings
        : getGenderEquityRatingsDummy()
    };
    dispatch({
      type: SET_STATIC_DATA,
      staticData: data
    });
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

export const getStaticData = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.static.url!}
  });
};
