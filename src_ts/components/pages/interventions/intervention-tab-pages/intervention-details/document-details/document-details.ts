import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
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
import {Permission} from '../../common/models/intervention-types';
import {cloneDeep} from '../../../../../utils/utils';
import {DocumentDetailsPermissions, DocumentDetails} from './documentDetails.models';
import PermissionsMixin from '../../common/mixins/permissions-mixins';

/**
 * @customElement
 */
@customElement('document-details')
export class PartnerDetailsElement extends PermissionsMixin(connect(LitElement)) {
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

      <etools-content-panel show-expand-btn panel-title="Document Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button
            icon="create"
            @tap="${this.allowEdit}"
            ?hidden="${this.hideEditIcon(this.editMode, this.canEditDocumentDetails)}"
          ></paper-icon-button>
        </div>

        <div class="row-padding-v">
          <paper-input
            id="title"
            label="Title"
            .value="${this.documentDetails.title}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.title)}"
          >
          </paper-input>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="context"
            label="Context"
            type="text"
            .value="${this.documentDetails.context}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.context)}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="implementation-strategy"
            label="Implementation Strategy"
            .value="${this.documentDetails.implementation_strategy}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.implementation_strategy)}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="ip_progr_contrib"
            label="Partner non-financial contribution"
            .value="${this.documentDetails.ip_progr_contrib}"
            ?readonly="${this.isReadonly(this.editMode, this.permissions.edit.ip_progr_contrib)}"
          >
          </paper-textarea>
        </div>

        <div class="layout-horizontal right-align row-padding-v">
          <paper-button class="default" @tap="${this.cancelDocumentDetails}">
            Cancel
          </paper-button>
          <paper-button class="primary" @tap="${this.saveDocumentDetails}">
            Save
          </paper-button>
        </div>
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
    this.permissions = selectDocumentDetailsPermissions(state);
    this.setCanEditDocumentDetails(this.permissions.edit);
    this.originalDocumentDetails = cloneDeep(this.documentDetails);
  }

  setCanEditDocumentDetails(_editPermissions: DocumentDetailsPermissions) {
    this.canEditDocumentDetails = true; // TODO
  }

  cancelDocumentDetails() {
    Object.assign(this.documentDetails, this.originalDocumentDetails);
    this.documentDetails = cloneDeep(this.originalDocumentDetails);
    this.editMode = false;
  }

  saveDocumentDetails() {
    this.editMode = false;
  }
}
