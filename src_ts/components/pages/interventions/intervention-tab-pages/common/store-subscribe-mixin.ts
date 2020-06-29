/* eslint-disable @typescript-eslint/no-empty-function */
import {LitElement} from 'lit-element';

export const connect = (baseElement: typeof LitElement) =>
  class extends baseElement {
    store: any;
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._storeUnsubscribe = this.store.subscribe(() => this.stateChanged(this.store.getState()));
      this.stateChanged(this.store.getState());
    }
    disconnectedCallback() {
      this._storeUnsubscribe();
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    _storeUnsubscribe() {}
    /**
     * The `stateChanged(state)` method will be called when the state is updated.
     */
    stateChanged(_state: any) {}
  };
