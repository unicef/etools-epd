import {LitElement, html, property, customElement} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {buttonsStyles} from '../../common/styles/button-styles';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import isEmpty from 'lodash-es/isEmpty';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {validateRequiredFields} from '../../utils/validation-helper';
import {layoutCenterJustified, layoutVertical} from '../../common/styles/flex-layout-styles';
import {AnyObject} from '../../common/models/globals.types';

/**
 * @customElement
 */
@customElement('programmatic-visits')
export class ProgrammaticVisits extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [buttonsStyles, gridLayoutStylesLit];
  }

  render() {
    // if (!this.originalData) {
    //   return html` <style>${sharedStyles}</style>
    //     <etools-loading loading-text="Loading..." active></etools-loading>`;
    // }
    // language=HTML
    return html`
      <style>
        ${sharedStyles}
        :host {
          display: block;
          margin-bottom: 24px;
        }

        div.col-1 {
          min-width: 85px;
        }

        div.col-1.yearContainer {
          min-width: 100px;
        }

        .error-msg {
          color: var(--error-color);
          font-size: 12px;
          ${layoutVertical}
          ${layoutCenterJustified}
        }

        .padd-left-when-items {
          margin-left: 46px;
        }
      </style>

      <etools-content-panel show-expand-btn panel-title="Programmatic Visits">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div class="row-h extra-top-padd" ?hidden="${!this.editMode}">
          <paper-button
            .class="secondary-btn ${this._getAddBtnPadding(this.dataItems.length)}"
            @tap="_addNewPlannedVisit"
          >
            ADD YEAR
          </paper-button>
        </div>

        <div ?hidden="${isEmpty(this.dataItems)}" class="pv-container">
          ${this.renderVisitTemplate(this.dataItems)}
        </div>

        <div
          .class="row-h ${this._getNoPVMsgPadding(this.dataItems.length)}"
          ?hidden="${!this._emptyList(this.dataItems.length)}"
        >
          <p>There are no planned visits added.</p>
        </div>
      </etools-content-panel>
    `;
  }

  @property({type: Object})
  originalData!: any;

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  years: [] = [];

  @property({type: Number})
  interventionId!: number;

  @property({type: String})
  interventionStatus!: string;

  @property({type: Object})
  extraEndpointParams!: AnyObject;

  @property({type: Object})
  dataItems: AnyObject[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._createDeleteConfirmationDialog();
    // this.dataItems = [
    //   {id: 17, year: 2017, programmatic_q1: '0', programmatic_q2: '0', programmatic_q3: '0', programmatic_q4: '0'}
    // ];
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
  }

  _dataItemsChanged(dataItems: any) {
    if (!Array.isArray(dataItems)) {
      this.dataItems = [];
    }
  }

  renderVisitTemplate(dataItems) {
    return html`
      ${dataItems.map((item, index) => html`
          <div class="row-h item-container">
            <div class="item-actions-container">
              <div class="actions">
                <paper-icon-button
                  class="action delete"
                  @tap="${this._openDeleteConfirmation}"
                  data-args="${index}"
                  disabled="${!this._canBeRemoved(index, this.editMode)}"
                  icon="cancel"
                >
                </paper-icon-button>
              </div>
            </div>
            <div class="item-content">
              <div class="row-h">
                <div class="col col-1 yearContainer">
                  <etools-dropdown
                    .id="year_${index}"
                    class="year"
                    label="Year"
                    placeholder="&#8212;"
                    .selected="${item.year}"
                    .options="${this.years}"
                    required
                    error-message="Required"
                    trigger-value-change-event
                    @on-etools-selected-item-changed="${this._yearChanged}"
                    ?readonly="${!this.editMode}"
                    auto-validate
                  >
                  </etools-dropdown>
                </div>
                <div class="col col-1">
                  <paper-input
                    .id="visit_${index}_q1"
                    label="Quarter 1"
                    .value="${item.programmatic_q1}"
                    type="number"
                    min="0"
                    allowed-pattern="[0-9.]"
                    placeholder="&#8212;"
                    ?required="${item.year}"
                    error-message="Required"
                    auto-validate
                    ?readonly="${!this.editMode}"
                  >
                  </paper-input>
                </div>
                <div class="col col-1">
                  <paper-input
                    .id="visit_${index}_q2"
                    label="Quarter 2"
                    value="${item.programmatic_q2}"
                    type="number"
                    min="0"
                    allowed-pattern="[0-9.]"
                    placeholder="&#8212;"
                    ?required="${item.year}"
                    error-message="Required"
                    auto-validate
                    ?readonly="${!this.editMode}"
                  >
                  </paper-input>
                </div>
                <div class="col col-1">
                  <paper-input
                    .id="visit_${index}_q3"
                    label="Quarter 3"
                    .value="${item.programmatic_q3}"
                    type="number"
                    min="0"
                    allowed-pattern="[0-9.]"
                    placeholder="&#8212;"
                    ?required="${item.year}"
                    error-message="Required"
                    auto-validate
                    ?readonly="${!this.editMode}"
                  >
                  </paper-input>
                </div>
                <div class="col col-1">
                  <paper-input
                    .id="visit_${index}_q4"
                    label="Quarter 4"
                    .value="${item.programmatic_q4}"
                    type="number"
                    min="0"
                    allowed-pattern="[0-9.]"
                    placeholder="&#8212;"
                    ?required="${item.year}"
                    error-message="Required"
                    auto-validate
                    ?readonly="${!this.editMode}"
                  >
                  </paper-input>
                </div>
                <div class="col col-1">
                  <etools-form-element-wrapper label="TOTAL" class="row-second-bg" no-placeholder>
                    ${this._getTotal(
                      item.programmatic_q1,
                      item.programmatic_q2,
                      item.programmatic_q3,
                      item.programmatic_q4
                    )}
                  </etools-form-element-wrapper>
                </div>
                <div
                  class="col col-4"
                  ?hidden="${!this._showErrorMsg(
                    item.year,
                    item.programmatic_q1,
                    item.programmatic_q2,
                    item.programmatic_q3,
                    item.programmatic_q4
                  )}"
                >
                  <div class="error-msg">Total has to be greater than 0</div>
                </div>
              </div>
            </div>
          </div>
        `
      )}
    `;
  }

  /**
   * The planned visit row data can be removed only if (intervention status is new or draft) or (if it doesn't have
   * and id assigned(only if is not saved))
   */
  _canBeRemoved(index: number, editMode: boolean) {
    if (!editMode || !this.dataItems || !this.dataItems.length || !this.dataItems[index]) {
      return false;
    }
    const plannedVisit = this.dataItems[index];
    const plannedVisitId = parseInt(plannedVisit.id, 10);
    return this._isDraft() || !(plannedVisitId && isNaN(plannedVisitId) === false && plannedVisitId > 0);
  }

  _isDraft() {
    return this.interventionStatus === '' || this.interventionStatus === 'draft';
  }

  _yearChanged(event: CustomEvent) {
    const yearSelected = event.detail.selectedItem ? event.detail.selectedItem.value : null;
    const yearDropdown = this.shadowRoot!.querySelector('#year_' + event.model.index);

    if (this.isAlreadySelected(yearSelected, event.model.index, 'year')) {
      fireEvent(this, 'toast', {
        text: 'Year already selected on other planned visit item.',
        showCloseBtn: true
      });
      this._clearSelectedYear(yearDropdown, event);
    }
  }

  /**
   * Timeout because yearDropdown.selected is set after the execution of _yearChanged method
   */
  _clearSelectedYear(yearDropdown: any, event: CustomEvent) {
    setTimeout(() => {
      if (yearDropdown) {
        yearDropdown.selected = null;
      }
      this.set('dataItems.' + event.model.index + '.year', null);
    });
  }

  _getTotal(q1: string, q2: string, q3: string, q4: string) {
    return (Number(q1) || 0) + (Number(q2) || 0) + (Number(q3) || 0) + (Number(q4) || 0);
  }

  _showErrorMsg(year: string, q1: string, q2: string, q3: string, q4: string) {
    if (!year) {
      return false;
    }
    return !this._getTotal(q1, q2, q3, q4);
  }

  validate() {
    return validateRequiredFields(this);
  }

  /**
   * Validate last added planned visit and if is not empty add a new one
   */
  _addNewPlannedVisit() {
    if (!this.validate()) {
      fireEvent(this, 'toast', {
        text: 'Already added planned visit data is not valid yet',
        showCloseBtn: true
      });
      return;
    }
    this._addElement();
  }

  _getAddBtnPadding(itemsLength: number) {
    return (!itemsLength ? '' : 'padd-left-when-items') + ' planned-visits';
  }

  _getNoPVMsgPadding(itemsLength: number) {
    return !itemsLength && this.editMode ? 'no-top-padd' : '';
  }
}
