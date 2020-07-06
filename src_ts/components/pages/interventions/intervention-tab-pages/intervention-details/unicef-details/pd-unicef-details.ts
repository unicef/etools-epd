import {LitElement, html, property, customElement} from 'lit-element';
import {PolymerElement} from '@polymer/polymer/polymer-element';
import {PdUnicefDetails, PdUnicefDetailsPermissions} from '../../common/models/intervention-types';
import {selectPdUnicefDetails} from './partnerDetails.selectors';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import {connect} from '../../utils/store-subscribe-mixin';

/**
 * @customElement
 */
@customElement('pd-unicef-details')
export class PdUnicefDetailsElement extends PermissionsMixin(connect(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    // language=HTML
    return html`
    ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Unicef Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditPdUnicefDetails)}"
            @tap="${this._allowEdit}"
            icon="create">
          </paper-icon-button>
        </div>

        <div class="row-padding-v">
          <div class="col col-4">
            <paper-input
              label="Document Type"
              .value="${this.pdUnicefDetails.details.document_type}"
              class="row-padding-v"
              readonly>
            </paper-input>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-4">
            <etools-dropdown-multi
              id="officeInput"
              label="Unicef Office"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.details.offices}"
              ?readonly="${this.isReadonly(this.editMode, this.pdUnicefDetails.permissions.edit.unicef_office)}"
              ?required="${this.pdUnicefDetails.permissions.required.unicef_office}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown-multi
              id="sectionInput"
              label="Unicef Sections"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.details.sections}"
              ?readonly="${this.isReadonly(this.editMode, this.pdUnicefDetails.permissions.edit.sections)}"
              ?required="${this.pdUnicefDetails.permissions.required.sections}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown-multi
              label="Clusters"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.details.clusters}"
              readonly
              trigger-value-change-event>
          </div>
        </div>
        <div class="layout-horizontal row-padding-v">
          <div class="col col-4">
            <etools-dropdown-multi
              id="focalPointInput"
              label="Unicef Focal Points"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selectedValues="${this.pdUnicefDetails.details.unicef_focal_points}"
              ?readonly="${this.isReadonly(this.editMode, this.pdUnicefDetails.permissions.edit.focal_points)}"
              ?required="${this.pdUnicefDetails.permissions.required.focal_points}"
              trigger-value-change-event>
            </etools-dropdown-multi>
          </div>
          <div class="col col-4">
            <etools-dropdown
              id="budgetOwnerInput"
              label="Unicef Budget Owner"
              class="row-padding-v"
              option-label="name"
              option-value="id"
              .selected="${this.pdUnicefDetails.details.unicef_budget_owner}"
              ?readonly="${this.isReadonly(this.editMode, this.pdUnicefDetails.permissions.edit.budget_owner)}"
              ?required="${this.pdUnicefDetails.permissions.required.budget_owner}"
              trigger-value-change-event>
            </etools-dropdown>
          </div>
        </div>

        <div class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditPdUnicefDetails)}">
          <paper-button class="default" @tap="${this.cancelPdDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.savePdDetails}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  private validationSelectors: string[] = ['#officeInput', '#sectionInput', '#focalPointInput', '#budgetOwnerInput'];

  @property({type: Boolean})
  editMode = false;

  @property({type: Boolean})
  canEditPdUnicefDetails!: boolean;

  @property({type: Object})
  originalPdUnicefDetails = {};

  @property({type: Object})
  pdUnicefDetails!: PdUnicefDetails;

  @property({type: Boolean})
  showLoading = false;

  connectedCallback() {
    super.connectedCallback();
  }

  _allowEdit() {
    this.editMode = true;
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }

    this.pdUnicefDetails = selectPdUnicefDetails(state);
    this.setPdUnicefDetailsPermissions(this.pdUnicefDetails.permissions.edit);
    Object.assign(this.originalPdUnicefDetails, this.pdUnicefDetails.details);
  }

  setPdUnicefDetailsPermissions(permissions: PdUnicefDetailsPermissions) {
    this.canEditPdUnicefDetails =
      permissions.budget_owner || permissions.focal_points || permissions.sections || permissions.unicef_office;
  }

  cancelPdDetails() {
    Object.assign(this.pdUnicefDetails.details, this.originalPdUnicefDetails);
    this.editMode = false;
  }

  validate() {
    let isValid = true;
    this.validationSelectors.forEach((selector: string) => {
      const el = this.shadowRoot!.querySelector(selector) as PolymerElement & {validate(): boolean};
      if (el && !el.validate()) {
        isValid = false;
      }
    });
    return isValid;
  }

  savePdDetails() {
    if (!this.validate()) {
      return;
    }
    // this.showLoading = true;

    this.editMode = false;
  }
}
