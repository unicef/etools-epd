/* eslint-disable @typescript-eslint/no-empty-function */
import {LitElement} from 'lit-element';
import {getStore} from './redux-store-access';

export const connect = (baseElement: typeof LitElement) => {
  class StoreConnect extends baseElement {
    storeSubscribe() {
      this._storeUnsubscribe = getStore().subscribe(() => this.stateChanged(getStore().getState()));
      this.stateChanged(getStore().getState());
    }

    connectedCallback() {
      super.connectedCallback();
      if (!getStore()) {
        return;
      }

      this.storeSubscribe();
    }
    disconnectedCallback() {
      this._storeUnsubscribe();
      super.disconnectedCallback();
    }

    _storeUnsubscribe() {}
    /**
     * The `stateChanged(state)` method will be called when the state is updated.
     */
    stateChanged(_state: any) {}
  }
  return StoreConnect;
};
