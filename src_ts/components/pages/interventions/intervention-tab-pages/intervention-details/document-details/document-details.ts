import {LitElement, html, customElement, property} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-loading/etools-loading';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {selectDocumentDetails, selectDocumentDetailsPermissions} from './documentDetails.selectors';
import {Permission} from '../../common/models/intervention.types';
import {cloneDeep} from '../../../../../utils/utils';
import {DocumentDetailsPermissions, DocumentDetails} from './documentDetails.models';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import {validateRequiredFields} from '../../utils/validation-helper';
import {isJsonStrMatch} from '../../utils/utils';
import {patchIntervention} from '../../common/actions';

/**
 * @customElement
 */
@customElement('document-details')
export class PartnerDetailsElement extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles];
  }

  render() {
    if (!this.documentDetails) {
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
      </style>

      <etools-content-panel show-expand-btn panel-title="Document Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          ${this.renderEditBtn(this.editMode, this.canEditAtLeastOneField)}
        </div>

        <div class="row-padding-v">
          <paper-input
            id="title"
            label="Title"
            always-float-label
            placeholder="—"
            .value="${this.documentDetails.title}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.title)}"
            ?required="${this.permissions.required.title}"
          >
          </paper-input>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="context"
            label="Context"
            always-float-label
            type="text"
            placeholder="—"
            .value="${this.documentDetails.context}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.context)}"
            ?required="${this.permissions.required.context}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="implementation-strategy"
            label="Implementation Strategy"
            always-float-label
            placeholder="—"
            .value="${this.documentDetails.implementation_strategy}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.implementation_strategy)}"
            ?required="${this.permissions.required.implementation_strategy}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="ip_progr_contrib"
            label="Partner non-financial contribution"
            always-float-label
            placeholder="—"
            .value="${this.documentDetails.ip_progr_contrib}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.ip_progr_contrib)}"
            ?required="${this.permissions.required.ip_progr_contrib}"
          >
          </paper-textarea>
        </div>

        ${this.renderActions(this.editMode, this.canEditAtLeastOneField)}
      </etools-content-panel>
    `;
  }
  @property({type: Object})
  documentDetails!: DocumentDetails;

  @property({type: Object})
  permissions!: Permission<DocumentDetailsPermissions>;

  @property({type: Object})
  originalDocumentDetails = {};

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  canEditDocumentDetails!: boolean;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    this.documentDetails = selectDocumentDetails(state);
    this.originalDocumentDetails = cloneDeep(this.documentDetails);
    this.sePermissions(state);
  }

  private sePermissions(state: any) {
    const newPermissions = selectDocumentDetailsPermissions(state);
    if (!isJsonStrMatch(this.permissions, newPermissions)) {
      this.permissions = newPermissions;
      this.set_canEditAtLeastOneField(this.permissions.edit);
    }
  }

  cancel() {
    Object.assign(this.documentDetails, this.originalDocumentDetails);
    this.documentDetails = cloneDeep(this.originalDocumentDetails);
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
      .dispatch(patchIntervention(this.documentDetails))
      .then(() => {
        this.editMode = false;
      });
  }
}
