import {LitElement, html, property, customElement} from 'lit-element';
import {Permission} from '../../common/models/intervention-types';
import {selectPartnerDetails, selectPartnerDetailsPermissions} from './partnerDetails.selectors';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-loading/etools-loading';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {connect} from '../../utils/store-subscribe-mixin';
import {PartnerDetails, PartnerDetailsPermissions} from './partnerDetails.models';

/**
 * @customElement
 */
@customElement('partner-details')
export class PartnerDetailsElement extends connect(LitElement) {
  static get styles() {
    return [buttonsStyles];
  }
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel panel-title="Partner Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button icon="create"> </paper-icon-button>
        </div>

        <div class="row-padding-v">

        </div>

        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelPartnerDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.savePartnerDetails}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  partnerDetails!: PartnerDetails;

  @property({type: Object})
  permissions!: Permission<PartnerDetailsPermissions>;

  @property({type: Boolean})
  showLoading = false;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    this.partnerDetails = selectPartnerDetails(state);
    this.permissions = selectPartnerDetailsPermissions(state);
  }

  cancelPartnerDetails() {}

  savePartnerDetails() {}
}
