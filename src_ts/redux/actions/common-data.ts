import {Action, ActionCreator} from 'redux';
import {AnyObject} from '../../types/globals';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';

export const SET_ALL_STATIC_DATA = 'SET_ALL_STATIC_DATA';
export const UPDATE_ENV_FLAGS = 'UPDATE_ENV_FLAGS';

export interface CommonDataActionSetAllStaticData extends Action<'SET_ALL_STATIC_DATA'> {
  genderEquityRatings: AnyObject[];
}

export interface CommonDataActionUpdateEnvFlags extends Action<'UPDATE_ENV_FLAGS'> {
  envFlags: AnyObject;
}

export type CommonDataAction = CommonDataActionSetAllStaticData | CommonDataActionUpdateEnvFlags;

export const getPartners = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.partners.url!}
  });
};

export const getCpOutputs = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.dropdownsData.url!}
  }).then((resp: any) => {
    return resp.cp_outputs || [];
  });
};

export const getLocations = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.locations.url!}
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

export const getStaticData = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.static.url!}
  });
};

export const updateEnvFlags: ActionCreator<CommonDataActionUpdateEnvFlags> = (envFlags: AnyObject) => {
  return {
    type: UPDATE_ENV_FLAGS,
    envFlags
  };
};
