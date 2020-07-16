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
import get from 'lodash-es/get';
import cloneDeep from 'lodash-es/cloneDeep';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {validateRequiredFields} from '../../utils/validation-helper';
import {patchIntervention} from '../../common/actions';
import {sendRequest} from '@unicef-polymer/etools-ajax';
import {getEndpoint} from '../../utils/endpoint-helper';
import {interventionEndpoints} from '../../utils/intervention-endpoints';
import {pageIsNotCurrentlyActive} from '../../utils/common-methods';
import {isJsonStrMatch} from '../../utils/utils';
import {isUnicefUSer} from '../../common/selectors';

/**
 * @customElement
 */
@customElement('partner-details')
export class PartnerDetailsElement extends connect(getStore())(CardComponentMixin(LitElement)) {
  static get styles() {
    return [buttonsStyles, gridLayoutStylesLit];
  }
  render() {
    if (!this.originalData) {
      return html` ${sharedStyles}
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Partner Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditAtLeastOneField)}
        </div>

        <div class="row-padding-v layout-horizontal">
          <div class="col col-7">
            <paper-input
              class="w100"
              label="Partner Organization"
              .value="${this.originalData.partner}"
              required
              readonly
              always-float-label
            >
            </paper-input>
          </div>
          <div class="col col-5">
            <etools-dropdown
              id="agreements"
              label="Agreements"
              .options="${this.partnerAgreements}"
              .selected="${this.originalData.agreement}"
              option-value="id"
              option-label="name"
              trigger-value-change-event
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.selectedItemChanged(detail, 'agreement')}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.agreement)}"
              required
              auto-validate
            >
            </etools-dropdown>
          </div>
        </div>
        <div class="row-padding-v layout-horizontal">
          <div class="col col-7">
            <paper-input
              class="w100"
              label="Partner Vendor Number"
              .value="${this.originalData.partner_vendor}"
              required
              readonly
              always-float-label
            >
            </paper-input>
          </div>
          <div class="col col-5 layout-vertical">
            <label for="agreementAuthOff" class="paper-label">Agreement Authorized Officers</label>
            <div id="agreementAuthOff">
              ${this.renderAgreementAuthorizedOfficers(this.agreementAuthorizedOfficers)}
            </div>
          </div>
        </div>
        <div class="row-padding-v">
          <div class="col col-7">
            <etools-dropdown-multi
              label="Partner Focal Point"
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
  partnerAgreements!: any[];

  @property({type: Array})
  agreementAuthorizedOfficers!: [];

  @property({type: Array})
  partnerStaffMembers!: [];

  connectedCallback() {
    super.connectedCallback();
  }

  async stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    if (pageIsNotCurrentlyActive(get(state, 'app.routeDetails'), 'interventions', 'details')) {
      return;
    }

    const newPartnerDetails = selectPartnerDetails(state);
    if (!isJsonStrMatch(this.originalData, newPartnerDetails)) {
      if (this.partnerIdHasChanged(newPartnerDetails)) {
        await this.populateDropdowns(state, newPartnerDetails.partner_id!);
      }
      this.originalData = newPartnerDetails;
    }

    this.permissions = selectPartnerDetailsPermissions(state);
    this.set_canEditAtLeastOneField(this.permissions.edit);
  }

  async populateDropdowns(state: any, partnerId: number) {
    this.partnerStaffMembers = await this.getAllPartnerStaffMembers(partnerId!);

    // if (isUnicefUSer(state)) {
    //   this.filterAgreementsByPartner(get(state, 'agreements.list'), partnerId);
    // } else {
    this.partnerAgreements = await this.getPartnerAgreements(partnerId!);
    // }
  }

  filterAgreementsByPartner(agreements: [], partnerId: number) {
    this.partnerAgreements = agreements.filter((a: any) => a.partner === partnerId);
  }

  partnerIdHasChanged(newPartnerDetails: PartnerDetails) {
    return get(this.originalData, 'partner_id') !== newPartnerDetails.partner_id;
  }

  getAllPartnerStaffMembers(partnerId: number) {
    return sendRequest({
      endpoint: getEndpoint(interventionEndpoints.partnerStaffMembers, {id: partnerId})
    }).then((resp) => {
      resp.forEach((staff: any) => {
        staff.name = staff.first_name + ' ' + staff.last_name;
      });
      return resp;
    });
  }

  getPartnerAgreements(partnerId: number) {
    return sendRequest({
      endpoint: getEndpoint(interventionEndpoints.partnerStaffMembers, {id: partnerId})
    }).then((resp) => {
      return resp;
    });
  }

  renderAgreementAuthorizedOfficers(authOfficers: []) {
    if (!authOfficers || authOfficers.length) {
      return html`—`;
    } else {
      return authOfficers.map((authOfficer: any) => {
        return html`${authOfficer.first_name} ${authOfficer.last_name} (${authOfficer.phone}, ${authOfficer.email})`;
      });
    }
  }

  cancel() {
    this.originalData = cloneDeep(this.originalData);
    this.editMode = false;
  }

  validate() {
    return validateRequiredFields(this);
  }

  save() {
    if (!this.validate()) {
      return;
    }
    getStore()
      .dispatch(patchIntervention(this.dataToSave))
      .then(() => {
        this.editMode = false;
        this.dataToSave = {};
      });
  }
}
