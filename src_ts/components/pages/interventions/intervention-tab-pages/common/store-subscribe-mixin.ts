/* eslint-disable @typescript-eslint/no-empty-function */
import {LitElement, property} from 'lit-element';
import {AnyObject} from '../../../../../types/globals';

export const connect = (baseElement: typeof LitElement) => {
  class StoreConnect extends baseElement {
    @property({type: Object})
    store!: AnyObject;

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => {
        this._storeUnsubscribe = this.store.subscribe(() => this.stateChanged(this.store.getState()));
        this.stateChanged(this.store.getState());
      });
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
