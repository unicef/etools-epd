import {updateUserData} from '../../redux/actions/user';
import {setLanguage} from '../../redux/actions/active-language';
import {getEndpoint} from '../../endpoints/endpoints';
import {store} from '../../redux/store';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';
import {appLanguages} from '../../config/app-constants';

export function getCurrentUser() {
  return sendRequest({
    endpoint: {url: getEndpoint(etoolsEndpoints.userProfile).url}
  })
    .then((response: EtoolsUser) => {
      if (redirectToPMPIfNeccessary(response)) {
        return;
      }
      store.dispatch(updateUserData(response));

      setCurrentLanguage(response.preferences?.language);

      return response;
    })
    .catch((error: AnyObject) => {
      if ([403, 401].includes(error.status)) {
        window.location.href = window.location.origin + '/login';
      }
      throw error;
    });
}

function setCurrentLanguage(lngCode: string) {
  if (lngCode) {
    lngCode = lngCode.substring(0, 2);
    // set store activeLanguage only if profile language exists in app
    if (appLanguages.some((lng) => lng.value === lngCode)) {
      store.dispatch(setLanguage(lngCode));
    } else {
      console.log(`User profile language ${lngCode} missing`);
    }
  }
}

function redirectToPMPIfNeccessary(user: EtoolsUser) {
  if (!user.is_superuser) {
    if (user.is_unicef_user) {
      window.location.href = window.location.href.replace('epd', 'pmp');
      return true;
    }
  }
  return false;
}

export function updateCurrentUser(profile: AnyObject) {
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

export function changeCurrentUserCountry(countryId: number) {
  return sendRequest({
    method: 'POST',
    endpoint: {url: getEndpoint(etoolsEndpoints.changeCountry).url},
    body: {country: countryId}
  }).catch((error: AnyObject) => {
    console.error('[EtoolsUser]: changeCountry req error ', error);
    throw error;
  });
}
