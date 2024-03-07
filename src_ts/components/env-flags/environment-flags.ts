import {sendRequest, RequestEndpoint} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {store} from '../../redux/store';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {updateEnvFlags} from '../../redux/actions/common-data';
import {EnvFlags} from '@unicef-polymer/etools-types';

/**
 * @customElement
 */
class EnvironmentFlags extends connect(store)(LitElement) {
  @property({type: Object})
  envFlagsDefaultValue: EnvFlags = {
    prp_mode_off: true,
    prp_server_on: false
  };

  protected _processAndSetEnvFlags(envFlags: EnvFlags) {
    const activeflags = envFlags.active_flags;

    const flagObject: any = {
      prp_mode_off: false
    };

    if (activeflags) {
      activeflags.forEach((flag) => {
        flagObject[flag] = true;
      });
    }

    return flagObject;
  }

  private _loadEnvFlagsData() {
    sendRequest({
      endpoint: etoolsEndpoints.environmentFlags as RequestEndpoint
    })
      .then((response: any) => {
        if (response) {
          store.dispatch(updateEnvFlags(this._processAndSetEnvFlags(response)));
        } else {
          store.dispatch(updateEnvFlags(this.envFlagsDefaultValue));
        }
      })
      .catch((error: any) => {
        EtoolsLogger.error('Env flags request failed', null, error);
        store.dispatch(updateEnvFlags(this.envFlagsDefaultValue));
      });
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEnvFlagsData();
  }
}

window.customElements.define('environment-flags', EnvironmentFlags);
