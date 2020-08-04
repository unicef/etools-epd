import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-radio-group';
import '@polymer/paper-checkbox';
import '@unicef-polymer/etools-loading/etools-loading';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import cloneDeep from 'lodash-es/cloneDeep';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {
  selectGenderEquityRating,
  selectGenderEquityRatingPermissions
} from '../../intervention-details/gender-equity-rating/genderEquityRating.selectors';
import {
  GenderEquityRating,
  GenderEquityRatingPermissions
} from '../../intervention-details/gender-equity-rating/genderEquityRating.models';
import {Permission} from '../../common/models/intervention.types';
import {validateRequiredFields} from '../../utils/validation-helper';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import {AnyObject} from '../../common/models/globals.types';

/**
 * @customElement
 */
@customElement('financial-component')
export class FinancialComponent extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }
  render() {
    if (!this.genderEquityRating || !this.ratings) {
      return html`<style>
          ${sharedStyles}
        </style>
        <etools-loading loading-text="Loading..." active></etools-loading>`;
    }
    // language=HTML
    return html`
      <style>
        ${sharedStyles} :host {
          display: block;
          margin-bottom: 24px;
        }
        .pl-none {
          padding-left: 0px !important;
        }
        paper-radio-button:first-child {
          padding-left: 0px !important;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Financial">
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
          <div class="w100">
            <label class="paper-label">Cash Transfer modality(ies)</label>
          </div>
          <div class="col col-3">
            <paper-checkbox checked="{{partnersSelected}}" ?disabled="${!this.editMode}">
              Direct Cash Transfer
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox ?disabled="${!this.editMode}">
              Direct Payment
            </paper-checkbox>
          </div>
          <div class="col col-3">
            <paper-checkbox ?disabled="${!this.editMode}">
              Reimbrsement
            </paper-checkbox>
          </div>
        </div>

        <div class="row-padding-v pb-20">
          <div class="w100">
            <label class="paper-label">Headquarters contribution (automatic 7% for INGO)</label>
          </div>
          <div class="col col-3">
            <paper-checkbox checked="{{partnersSelected}}" ?disabled="${!this.editMode}">
              Direct Cash Transfer
            </paper-checkbox>
          </div>
        </div>

        <div class="row-padding-v pb-20">
          <div class="w100">
            <label class="paper-label">Document currency</label>
          </div>
          <div class="col col-3">
            ${this.intervention.document_type}
          </div>
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

  @property({type: String})
  documentType!: string;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (state.commonData.genderEquityRatings) {
      this.ratings = state.commonData.genderEquityRatings;
    }
    if (state.interventions.current) {
      this.documentType = selectGenderEquityRating(state);
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
        html`<paper-radio-button
          class="${this.isReadonly(this.editMode, permission) ? 'readonly' : ''}"
          name="${r.value}"
        >
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
