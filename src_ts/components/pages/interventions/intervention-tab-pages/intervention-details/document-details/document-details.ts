import {LitElement, html, customElement, property} from 'lit-element';
import {connect} from '../../utils/store-subscribe-mixin';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-loading/etools-loading';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import {buttonsStyles} from '../../common/styles/button-styles';
import {SharedStylesLit} from '../../../../../styles/shared-styles-lit';
import {gridLayoutStylesLit} from '../../../../../styles/grid-layout-styles-lit';

/**
 * @customElement
 */
@customElement('document-details')
export class PartnerDetailsElement extends connect(LitElement) {
  static get styles() {
    return [buttonsStyles];
  }

  render() {
    // language=HTML
    return html`
      ${gridLayoutStylesLit} ${SharedStylesLit}
      <style>
        /* CSS rules for your element */
        paper-textarea[readonly] {
          --paper-input-container-underline: {
            display: none;
          }
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Document Details">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button icon="create" @tap="${() => this._editMode()}"></paper-icon-button>
        </div>

        <div class="row-padding-v">
          <paper-input
            id="title"
            label="Title"
            value="Bacon ipsum dolor amet brisket shoulder ball tip bresaola chislic, prosciutto ham turducken"
            ?readonly="${!this.editMode}"
          >
          </paper-input>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="context"
            label="Context"
            type="text"
            value="${this.longMockText}"
            ?readonly="${!this.editMode}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="implementation-strategy"
            label="Implementation Strategy"
            value="${this.longMockText}"
            ?readonly="${!this.editMode}"
          >
          </paper-textarea>
        </div>

        <div class="row-padding-v">
          <paper-textarea
            id="partner-non-financial-contribution"
            label="Partner non-financial contribution"
            value="${this.longMockText}"
            ?readonly="${!this.editMode}"
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

  @property({type: Boolean})
  showLoading = false;

  @property({type: Boolean})
  editMode = false;

  @property({type: String})
  longMockText =
    'Bacon ipsum dolor amet brisket shoulder ball tip bresaola chislic, prosciutto ham turducken' +
    ' leberkas ham hock short loin tail. Sausage shoulder cupim burgdoggen doner. Chislic shoulder shankle andouille,' +
    ' hamburger frankfurter doner pork ribeye ball tip porchetta. Flank jerky shank, pork meatloaf filet mignon' +
    ' andouille pancetta bresaola frankfurter t-bone hamburger.';

  connectedCallback() {
    super.connectedCallback();
  }

  _editMode() {
    this.editMode = true;
  }

  cancelDocumentDetails() {
    this.editMode = false;
  }

  saveDocumentDetails() {
    this.editMode = false;
  }
}
