import {LitElement, html, property, customElement} from 'lit-element';
import {PolymerElement} from '@polymer/polymer/polymer-element';
import {PdUnicefDetails, PdUnicefDetailsPermissions} from '../../common/intervention-types';
import {selectPdUnicefDetails} from './selectors';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStylesLit} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import PermissionsMixin from '../../mixins/permissions-mixins';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {connect} from '../../utils/store-subscribe-mixin';
import {AnyObject} from '../../../../../../types/globals';
import handleItemsNoLongerAssignedToCurrentCountry from '../../utils/common-methods';

/**
 * @customElement
 */
@customElement('unicef-details')
export class UnicefDetailsElement extends PermissionsMixin(connect(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    // language=HTML
    return html`
    ${sharedStylesLit}
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
            ?hidden="${this.hideEditIcon(this.isNew, this.editMode, this.canEditPdUnicefDetails)}"
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
              .options="${this.office_list}"
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
              .options="${this.section_list}"
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
              .options="${this.cluster_list}"
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
              .options="${this.focal_point_list}"
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
              .options="${this.budget_owner_list}"
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
          ?hidden="${this.hideActionButtons(this.isNew, this.editMode, this.canEditPdUnicefDetails)}">
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
  isNew = false;

  @property({type: Boolean})
  editMode = false;

  @property({type: Boolean})
  canEditPdUnicefDetails!: boolean;

  @property({type: Object})
  originalPdUnicefDetails!: PdUnicefDetails['details'];

  @property({type: Object})
  pdUnicefDetails!: PdUnicefDetails;

  @property({type: Boolean})
  isUnicefUser = false;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  focal_point_list!: AnyObject[];

  @property({type: Array})
  office_list!: AnyObject[];

  @property({type: Array})
  section_list!: AnyObject[];

  @property({type: Array})
  cluster_list!: AnyObject[];

  @property({type: Array})
  budget_owner_list!: AnyObject[];

  connectedCallback() {
    super.connectedCallback();
  }

  _allowEdit() {
    this.editMode = true;
  }

  stateChanged(state: any) {
    if (state.user && state.user.data) {
      this.isUnicefUser = state.user.data.is_unicef_user;
    }
    if (state.interventions.current) {
      this.pdUnicefDetails = selectPdUnicefDetails(state);
      this.setPdUnicefDetailsPermissions(this.pdUnicefDetails.permissions.edit);
      this.originalPdUnicefDetails = cloneDeep(this.pdUnicefDetails.details);
    }
    this.populateDropdownOptions(state);
  }

  populateDropdownOptions(state: any) {
    // @@dci need to refactor this when things got clear
    if (!this.isUnicefUser) {
      // if user is not Unicef user, this is opened in read-only mode and we just display already saved
      this.focal_point_list = [...this.pdUnicefDetails.details.focal_point_list];
      this.section_list = [...this.pdUnicefDetails.details.section_list];
      this.cluster_list = [...this.pdUnicefDetails.details.cluster_list];
      this.office_list = [...this.pdUnicefDetails.details.office_list];
      this.budget_owner_list = [...this.pdUnicefDetails.details.budget_owner_list];
    } else {
      if (get(state, 'commonData.unicefUsers.length')) {
        this.focal_point_list = [...state.commonData!.unicefUsers];
      }
      if (get(state, 'commonData.section_list.length')) {
        this.section_list = [...state.commonData!.section_list];
      }
      if (get(state, 'commonData.cluster_list.length')) {
        this.cluster_list = [...state.commonData!.cluster_list];
      }
      if (get(state, 'commonData.office_list.length')) {
        this.office_list = [...state.commonData!.office_list];
      }
      if (get(state, 'commonData.budget_owner_list.length')) {
        this.budget_owner_list = [...state.commonData!.budget_owner_list];
        // TO DO
        // check if already saved records exists on loaded data, if not they will be added
        // (they might be missing if changed country)
        // handleItemsNoLongerAssignedToCurrentCountry(
        //   this.focal_point_list,
        //   this.pdUnicefDetails.details.unicef_focal_points
        // );
        // this.focal_point_list = [...this.focal_point_list];
      }
    }
  }

  setPdUnicefDetailsPermissions(permissions: PdUnicefDetailsPermissions) {
    this.canEditPdUnicefDetails =
      permissions.budget_owner || permissions.focal_points || permissions.sections || permissions.unicef_office;
  }

  cancelPdDetails() {
    this.pdUnicefDetails.details = cloneDeep(this.originalPdUnicefDetails);
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
