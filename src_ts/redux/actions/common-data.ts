import {Action, ActionCreator} from 'redux';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {AnyObject} from '@unicef-polymer/etools-types';

export const SET_ALL_STATIC_DATA = 'SET_ALL_STATIC_DATA';
export const UPDATE_STATIC_DATA = 'UPDATE_STATIC_DATA';
export const UPDATE_ENV_FLAGS = 'UPDATE_ENV_FLAGS';
export const UPDATE_PRP_COUNTRIES = 'UPDATE_PRP_COUNTRIES';

export interface CommonDataActionSetAllStaticData extends Action<'SET_ALL_STATIC_DATA'> {
  genderEquityRatings: AnyObject[];
}

export interface CommonDataActionUpdateStaticData extends Action<'UPDATE_STATIC_DATA'> {
  genderEquityRatings: AnyObject[];
}

export interface CommonDataActionUpdateEnvFlags extends Action<'UPDATE_ENV_FLAGS'> {
  envFlags: AnyObject;
}

export interface CommonDataActionUpdatePrpCountries extends Action<'UPDATE_PRP_COUNTRIES'> {
  PRPCountryData: AnyObject[];
}

export type CommonDataAction =
  | CommonDataActionSetAllStaticData
  | CommonDataActionUpdateStaticData
  | CommonDataActionUpdateEnvFlags
  | CommonDataActionUpdatePrpCountries;

export const getPartners = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.partners.url!}
  });
};

export const getDropdownsData = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.dropdownsData.url!}
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

export const getDisaggregations = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.disaggregations.url!}
  });
};

export const getCountryProgrammes = (isUnicefUser: boolean) => {
  if (!isUnicefUser) {
    /**
     * Partner users can not see country programmes
     */
    return Promise.resolve([]);
  }
  return sendRequest({
    endpoint: {url: etoolsEndpoints.countryProgrammes.url!}
  });
};

export const updateEnvFlags: ActionCreator<CommonDataActionUpdateEnvFlags> = (envFlags: AnyObject) => {
  return {
    type: UPDATE_ENV_FLAGS,
    envFlags
  };
};
