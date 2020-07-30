import {LitElement, customElement, html, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import './fund-reservations-display/fund-reservations-display';
import {gridLayoutStylesLit} from '../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../common/styles/shared-styles-lit';
import {Intervention} from '../common/models/intervention.types';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../utils/redux-store-access';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';

/**
 * @customElement
 */
@customElement('intervention-overview')
export class InterventionOverview extends connect(getStore())(LitElement) {
  static get styles() {
    return [gridLayoutStylesLit];
  }
  render() {
    // language=HTML
    return html`
      <style>
        ${sharedStyles} :host {
          @apply --layout-vertical;
          width: 100%;
          --ecp-content-padding: 0px;
        }
        .block {
          display: block;
        }
        .content {
          margin-top: 8px;
        }
        iron-label {
          color: var(--dark-secondary-text-color);
        }
        .secondary {
          color: var(--dark-secondary-text-color);
        }
        .blue {
          color: var(--paper-blue-500);
        }
        .sector-label {
          display: inline-block;
          white-space: nowrap;
          height: 19px;
          text-align: center;
          padding: 7px 10px;
          background-color: var(--warning-color);
          text-transform: capitalize;
          font-weight: bold;
          color: var(--light-primary-text-color, #ffffff);
        }
        #top-container {
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel id="fund-reservation-display" class="content-section" panel-title="Implementation Status">
        <fund-reservations-display
          .intervention="${this.intervention}"
          .frsDetails="${this.intervention.frs_details}"
        ></fund-reservations-display>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  intervention = {} as Intervention;

  stateChanged(state: any) {
    if (!get(state, 'interventions.current')) {
      return;
    }
    const currentIntervention = get(state, 'interventions.current');
    this.intervention = cloneDeep(currentIntervention);
  }
}
