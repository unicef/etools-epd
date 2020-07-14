import {LitElement, html, property, customElement} from 'lit-element';
import {Permission} from '../../common/models/intervention-types';
import {selectPartnerDetails, selectPartnerDetailsPermissions} from './partnerDetails.selectors';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-loading/etools-loading';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {PartnerDetails, PartnerDetailsPermissions} from './partnerDetails.models';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import CardComponentMixin from '../../common/mixins/card-component-mixin';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {SharedStylesLit} from '../../../../../styles/shared-styles-lit';

/**
 * @customElement
 */
@customElement('partner-details')
export class PartnerDetailsElement extends connect(getStore())(CardComponentMixin(LitElement)) {
  static get styles() {
    return [buttonsStyles, gridLayoutStylesLit];
  }
  render() {
    // language=HTML
    return html`
      ${SharedStylesLit}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel panel-title="Partner Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditAtLeastOneField)}
        </div>

        <div class="row-h">
          <paper-input
            class="col col-7"
            label="Partner Organization"
            .value="${this.originalData.partner}"
            required
            readonly
            always-float-label
          >
          </paper-input>

          <etools-dropdown
            class="col col-7"
            id="agreements"
            label="Agreements"
            .options="${this.partnerAgreements}"
            .selected="${this.originalData.agreement}"
            option-value="id"
            option-label="name"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) => this.selectedItemChanged(detail, 'agreement')}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.agreement)}"
            required
            auto-validate
          >
          </etools-dropdown>
        </div>
        <div class="row-h">
          <paper-input
            class="col col-7"
            label="Partner Vendor Number"
            .value="${this.originalData.partner_vendor}"
            required
            readonly
            always-float-label
          >
          </paper-input>
          <div class="col col-5 layout-vertical">
            <label for="agreementAuthOff" class="paper-label">Agreement Authorized Officers</label>
            <div id="agreementAuthOff">
              ${this.renderAgreementAuthorizedOfficers(this.agreementAuthorizedOfficers)}
            </div>
          </div>
        </div>
        <div class="row-h">
          <etools-dropdown-multi
            label="Partner Focal Point"
            class="col col-7"
            .selectedValues="${this.originalData.partner_focal_points}"
            .options="${this.partnerStaffMembers}"
            option-label="name"
            option-value="id"
            trigger-value-change-event
            @etools-selected-items-changed="${({detail}: CustomEvent) =>
              this.selectedItemsChanged(detail, 'partner_focal_points')}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.partner_focal_points)}"
          >
          </etools-dropdown-multi>
        </div>

        ${this.renderActions(this.editMode, this.canEditAtLeastOneField)}
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  originalData!: PartnerDetails;

  @property({type: Object})
  dataToSave: Partial<PartnerDetails> = {};

  @property({type: Object})
  permissions!: Permission<PartnerDetailsPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  partnerAgreements!: [];

  @property({type: Array})
  agreementAuthorizedOfficers!: [];

  @property({type: Array})
  partnerStaffMembers!: [];

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    this.originalData = selectPartnerDetails(state);
    this.permissions = selectPartnerDetailsPermissions(state);
    this.set_canEditAtLeastOneField(this.permissions.edit);
  }

  renderAgreementAuthorizedOfficers(authOfficers: []) {
    if (!authOfficers || authOfficers.length) {
      return html`—`;
    } else {
      return authOfficers.map((authOfficer) => {
        return html``;
      });
    }
  }

  cancel() {
    this.editMode = false;
  }

  save() {}
}
