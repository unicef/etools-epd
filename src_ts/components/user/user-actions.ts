import './etools-user';
import {AnyObject} from '../../types/globals';
import {updateUserData} from '../../redux/actions/user';
import {getEndpoint} from '../../endpoints/endpoints';
import {store} from '../../redux/store';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';

export const getCurrentUserData = (): AnyObject => {
  return getUserData();
};

export const updateCurrentUserData = (profile: any) => {
  return setUserData(profile);
};

export const changeCurrentUserCountry = (countryId: number) => {
  return changeCountry(countryId);
};

export function getUserData() {
  return sendRequest({
    endpoint: {url: getEndpoint(etoolsEndpoints.userProfile).url}
  })
    .then((response: AnyObject) => {
      store.dispatch(updateUserData(response));
      return response;
    })
    .catch((error: AnyObject) => {
      console.error('[EtoolsUser]: getUserData req error...', error);
      throw error;
    });
}

export function setUserData(profile: AnyObject) {
  return sendRequest({
    method: 'PATCH',
    endpoint: {url: getEndpoint(etoolsEndpoints.userProfile).url},
    body: profile
  })
    .then((response: AnyObject) => {
      store.dispatch(updateUserData(response));
    })
    .catch((error: AnyObject) => {
      console.error('[EtoolsUser]: updateUserData req error ', error);
      throw error;
    });
}

export function changeCountry(countryId: number) {
  return sendRequest({
    method: 'POST',
    endpoint: {url: getEndpoint(etoolsEndpoints.changeCountry).url},
    body: {country: countryId}
  }).catch((error: AnyObject) => {
    console.error('[EtoolsUser]: changeCountry req error ', error);
    throw error;
  });
}
