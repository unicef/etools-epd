import {sendRequest, EtoolsRequestConfig} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {FMMsalAuth} from '../auth/jwt/msal-authentication';
import {store} from '../../redux/store';
import {showToast} from '../../redux/actions/app';
import {formatServerErrorAsText} from '@unicef-polymer/etools-ajax/ajax-error-parser';

export const _sendRequest = (etoolsReqConfig: EtoolsRequestConfig, _requestKey?: string, _checkProgress?: boolean) => {
  return sendRequest(etoolsReqConfig, _requestKey, _checkProgress)
    .then((response: any) => response)
    .catch((error: any) => {
      if (error.status === 401) {
        // TODO
      }
      throw error;
    });
};
