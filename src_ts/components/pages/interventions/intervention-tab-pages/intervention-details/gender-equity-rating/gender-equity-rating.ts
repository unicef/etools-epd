import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-radio-group';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-input';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import cloneDeep from 'lodash-es/cloneDeep';
import {AnyObject} from '../../../../../../types/globals';
import PermissionsMixin from '../../common/mixins/permissions-mixins';
import {selectGenderEquityRating, selectGenderEquityRatingPermissions} from './genderEquityRating.selectors';
import {GenderEquityRating, GenderEquityRatingPermissions} from './genderEquityRating.models';
import {Permission} from '../../common/models/intervention-types';
import {validateRequiredFields} from '../../utils/validation-helper';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';

/**
 * @customElement
 */
@customElement('gender-equity-rating')
export class GenderEquityRatingElement extends connect(getStore())(PermissionsMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    if (!this.genderEquityRating || !this.ratings) {
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
        .pl-12 {
          padding-left: 12px !important;
        }
        .pb-20 {
          padding-bottom: 20px !important;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Gender, Equity & Sustainability">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditGenderEquity)}"
            @tap="${this.allowEdit}"
            icon="create"
          >
          </paper-icon-button>
        </div>

        <div class="row-padding-v pb-20">
          <div class="w100 pl-12">
            <label>Gender Rating</label>
          </div>
          <paper-radio-group
            selected="${this.genderEquityRating.gender_rating}"
            @selected-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('gender_rating', detail.value)}"
          >
            ${this._getRatingRadioButtonsTemplate(this.ratings, this.permissions.edit.gender)}
          </paper-radio-group>
          <div class="col col-6 pl-12">
            <paper-input
              label="Gender Narrative"
              always-float-label
              class="w100"
              .value="${this.genderEquityRating.gender_narrative}"
              ?required="${this.permissions.required.gender}"
              @value-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('sustainability_narrative', detail.value)}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.gender)}"
            >
            </paper-input>
          </div>
        </div>
        <div class="row-padding-v pb-20">
          <div class="w100 pl-12">
            <label>Sustainability Rating</label>
          </div>
          <paper-radio-group
            .selected="${this.genderEquityRating.sustainability_rating}"
            @selected-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('sustainability_rating', detail.value)}"
          >
            ${this._getRatingRadioButtonsTemplate(this.ratings, this.permissions.edit.sustainability)}
          </paper-radio-group>
          <div class="col col-6 pl-12">
            <paper-input
              label="Sustainability Narrative"
              always-float-label
              class="w100"
              .value="${this.genderEquityRating.sustainability_narrative}"
              ?required="${this.permissions.required.sustainability}"
              @value-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('sustainability_narrative', detail.value)}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.sustainability)}"
            >
            </paper-input>
          </div>
        </div>
        <div class="row-padding-v pb-20">
          <div class="w100 pl-12">
            <label>Equity Rating</label>
          </div>
          <paper-radio-group
            .selected="${this.genderEquityRating.equity_rating}"
            @selected-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('equity_rating', detail.value)}"
          >
            ${this._getRatingRadioButtonsTemplate(this.ratings, this.permissions.edit.equity)}
          </paper-radio-group>
          <div class="col col-6 pl-12">
            <paper-input
              label="Equity Narrative"
              always-float-label
              class="w100"
              .value="${this.genderEquityRating.equity_narrative}"
              ?required="${this.permissions.required.equity}"
              @value-changed="${({detail}: CustomEvent) =>
        this.genderEquityRating!.setObjProperty('equity_narrative', detail.value)}"
              ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.equity)}"
            >
            </paper-input>
          </div>
        </div>

        <div
          class="layout-horizontal right-align row-padding-v"
          ?hidden="${this.hideActionButtons(this.editMode, this.canEditGenderEquity)}"
        >
          <paper-button class="default" @tap="${this.cancelGenderEquity}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveGenderEquity}">
            Save
          </paper-button>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  canEditGenderEquity!: boolean;

  @property({type: Object})
  originalGenderEquityRating!: GenderEquityRating;

  @property({type: Object})
  genderEquityRating!: GenderEquityRating | undefined;

  @property({type: Object})
  permissions!: Permission<GenderEquityRatingPermissions>;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  ratings!: AnyObject[];

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (state.commonData.genderEquityRatings) {
      this.ratings = state.commonData.genderEquityRatings;
    }
    if (state.interventions.current) {
      this.genderEquityRating = selectGenderEquityRating(state);
      this.permissions = selectGenderEquityRatingPermissions(state);
      this.setCanEditGenderEquityRatings(this.permissions.edit);
      this.originalGenderEquityRating = cloneDeep(this.genderEquityRating);
    }
  }

  setCanEditGenderEquityRatings(editPermissions: GenderEquityRatingPermissions) {
    this.canEditGenderEquity = editPermissions.gender || editPermissions.equity || editPermissions.sustainability;
  }

  _getRatingRadioButtonsTemplate(ratings: AnyObject[], permission: boolean) {
    return ratings.map(
      (r: AnyObject) =>
        html`<paper-radio-button ?disabled="${this.isReadonly(this.editMode, permission)}" name="${r.value}">
          ${r.label}</paper-radio-button
        >`
    );
  }

  cancelGenderEquity() {
    // @@dci section data it's not updated unless I set the genderEquityRating to undefined first
    // TODO: investigate this
    this.genderEquityRating = undefined;
    setTimeout(() => {
      this.genderEquityRating = cloneDeep(this.originalGenderEquityRating);
      this.editMode = false;
    }, 200);
  }

  validate() {
    return validateRequiredFields(this);
  }

  saveGenderEquity() {
    if (!this.validate()) {
      return;
    }
    // this.showLoading = true;
    this.editMode = false;
  }
}
