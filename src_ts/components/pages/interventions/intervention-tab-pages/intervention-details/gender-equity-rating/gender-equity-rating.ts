import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-button/paper-button';
import {PaperRadioGroupElement} from '@polymer/paper-radio-group';
import {PaperRadioButtonElement} from '@polymer/paper-radio-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-radio-group';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {connect} from '../../utils/store-subscribe-mixin';
import {AnyObject} from '../../../../../../types/globals';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import {selectPdUnicefDetails, selectPdUnicefDetailsPermissions} from './genderEquityRating.selectors';
import {PdUnicefDetails, PdUnicefDetailsPermissions} from './genderEquityRating.models';
import {Permission} from '../../common/models/intervention-types';
import {validateRequiredFields} from '../../utils/validation-helper';

/**
 * @customElement
 */
@customElement('gender-equity-rating')
export class GenderEquityRatingElement extends PermissionsMixin(connect(LitElement)) {
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
        .pl-12 {
          padding-left: 12px !important;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Gender, Equity & Sustainability">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditPdUnicefDetails)}"
            @tap="${this.allowEdit}"
            icon="create"
          >
          </paper-icon-button>
        </div>

        <div class="row-padding-v">
          <div class="w100 pl-12">
            <label>Gender Rating</label>
          </div>
          <paper-radio-group
            id="genderRating"
            @change="${(e: CustomEvent) => this._selectedRatingChanged(e.target as PaperRadioButtonElement)}"
          >
            ${this._getRatingRadioButtonsTemplate(this.ratings)}
          </paper-radio-group>
          <div class="col col-6 pl-12">
            <paper-input
              label="Rating Narrative"
              always-float-label
              class="w100"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.focal_points)}"
            >
            </paper-input>
          </div>
        </div>

        <div
          class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditPdUnicefDetails)}"
        >
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

  @property({type: Boolean})
  canEditPdUnicefDetails!: boolean;

  @property({type: Object})
  originalPdUnicefDetails!: PdUnicefDetails;

  @property({type: Object})
  pdUnicefDetails!: PdUnicefDetails;

  @property({type: Object})
  permissions!: Permission<PdUnicefDetailsPermissions>;

  @property({type: Boolean})
  isUnicefUser = false;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  ratings = [
    {value: '0', label: 'Principal'},
    {value: '1', label: 'Significant'},
    {value: '2', label: 'Marginal'},
    {value: '3', label: 'None'}
  ];

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

  stateChanged(state: any) {
    if (state.user && state.user.data) {
      this.isUnicefUser = state.user.data.is_unicef_user;
    }
    if (state.interventions.current) {
      this.pdUnicefDetails = selectPdUnicefDetails(state);
      this.permissions = selectPdUnicefDetailsPermissions(state);
      this.setCanEditPdUnicefDetails(this.permissions.edit);
      this.originalPdUnicefDetails = cloneDeep(this.pdUnicefDetails);
    }
    this.populateDropdownOptions(state);
  }

  populateDropdownOptions(state: any) {
    // @@dci need to refactor this when things got clear
    if (!this.isUnicefUser) {
      // if user is not Unicef user, this is opened in read-only mode and we just display already saved
      this.focal_point_list = [...this.pdUnicefDetails.focal_point_list];
      this.section_list = [...this.pdUnicefDetails.section_list];
      this.cluster_list = [...this.pdUnicefDetails.cluster_list];
      this.office_list = [...this.pdUnicefDetails.office_list];
      this.budget_owner_list = [...this.pdUnicefDetails.budget_owner_list];
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

  setCanEditPdUnicefDetails(editPermissions: PdUnicefDetailsPermissions) {
    this.canEditPdUnicefDetails =
      editPermissions.budget_owner ||
      editPermissions.focal_points ||
      editPermissions.sections ||
      editPermissions.unicef_office;
  }

  cancelPdDetails() {
    this.pdUnicefDetails = cloneDeep(this.originalPdUnicefDetails);
    this.editMode = false;
  }

  validate() {
    return validateRequiredFields(this);
  }

  setSelectedRating(rating: string) {
    console.log(rating);
  }

  savePdDetails() {
    if (!this.validate()) {
      return;
    }
    // this.showLoading = true;

    this.editMode = false;
  }

  _selectedRatingChanged(target: PaperRadioButtonElement) {
    if (target.checked) {
      // this.answer.rating = target.name!;
    }
  }

  _getRatingRadioButtonsTemplate(ratings: AnyObject[]) {
    return ratings.map(
      (r: AnyObject) =>
        html`<paper-radio-button
          ?disabled="${this.isReadonly(this.editMode, this.permissions.edit.unicef_office)}"
          name="${r.value}"
          >${r.label}</paper-radio-button
        >`
    );
  }
}
