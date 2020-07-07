import './etools-user';
import {EtoolsUser} from './etools-user';
import {AnyObject} from '../../types/globals';

const userEl = document.createElement('etools-user') as EtoolsUser;

export const getCurrentUserData = (): AnyObject => {
  // TODO: find a better way of getting user data or continue with this
  return userEl.getUserData(); // should req data and polpuate redux state...
};

export const updateCurrentUserData = (profile: any) => {
  return userEl.updateUserData(profile);
};

export const changeCurrentUserCountry = (countryId: number) => {
  return userEl.changeCountry(countryId);
  // .then(() => {
  //   // refresh user data (no other way, country change req returns 204)
  //   getCurrentUserData();
  // });
};
