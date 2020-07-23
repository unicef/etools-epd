import {LitElement, html, property, customElement} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@unicef-polymer/etools-table/etools-table';
import {getStore} from '../../utils/redux-store-access';
import {connect} from 'pwa-helpers/connect-mixin';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import '@unicef-polymer/etools-loading';
import {AnyObject} from '../../../../../../types/globals';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {getSupplyItems} from '../../../list/list-dummy-data';
import {EtoolsTableColumn, EtoolsTableColumnType, EtoolsTableChildRow} from '@unicef-polymer/etools-table/etools-table';
import './supply-agreement-dialog';
import {SupplyAgreementDialog} from './supply-agreement-dialog';
import {InterventionSupplyItem} from '../../common/models/intervention.types';

@customElement('supply-agreements')
export class FollowUpPage extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  render() {
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
          --ecp-content-padding: 0;
        }
      </style>
      <etools-content-panel panel-title="Supply Agreement">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          <paper-icon-button @tap="${() => this.addSupplyItem()}" icon="add"> </paper-icon-button>
        </div>

        <etools-table
          .columns="${this.columns}"
          .items="${this.dataItems}"
          @edit-item="${this.editSupplyItem}"
          @delete-item="${this.deleteSupplyItem}"
          .getChildRowTemplateMethod="${this.getChildRowTemplate.bind(this)}"
          .extraCSS="${sharedStyles}"
          showEdit
          showDelete
        >
        </etools-table>
      </etools-content-panel>
    `;
  }

  private supplyItemDialog!: SupplyAgreementDialog;

  @property({type: Array})
  dataItems: AnyObject[] = [];

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  columns: EtoolsTableColumn[] = [
    {
      label: 'Item (all prices in PD Currency)',
      name: 'title',
      type: EtoolsTableColumnType.Text,
      css: 'item-col'
    },
    {
      label: 'Number of Units',
      name: 'unit_number',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Price / Unit',
      name: 'unit_price',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Total Price',
      name: 'total_price',
      type: EtoolsTableColumnType.Text
    }
  ];

  @property({type: String})
  assessmentId: string | number | null = null;

  @property({type: Object})
  assessment!: AnyObject;

  async stateChanged(_state: any) {
    this.dataItems = getSupplyItems();
  }

  getChildRowTemplate(item: any): EtoolsTableChildRow {
    const childRow = {} as EtoolsTableChildRow;
    childRow.showExpanded = false;
    childRow.rowHTML = html`
      <td></td>
      <td class="ptb-0">
        <div class="child-row-inner-container">
          <label class="label-input">Cp Outputs</label><br />
          ${item.outputs.map((output: string) => html`<label>${output}</label><br />`)}
        </div>
      </td>
      <td colspan="4" class="ptb-0">
        <div class="child-row-inner-container">
          <label class="label-input">Other Mentions</label><br />
          <label>${item.other_mentions}</label>
          </paper-input>
        </div>
      </td>
    `;
    return childRow;
  }

  private openSupplyDialog(item: InterventionSupplyItem) {
    this.createDialog();
    this.supplyItemDialog.supplyItem = item;
    this.supplyItemDialog.openDialog();
  }

  createDialog() {
    if (!this.supplyItemDialog) {
      this.supplyItemDialog = document.createElement('supply-agreement-dialog') as SupplyAgreementDialog;
      document.querySelector('body')!.appendChild(this.supplyItemDialog);
    }
  }

  editSupplyItem(e: CustomEvent) {
    this.openSupplyDialog(e.detail);
  }

  addSupplyItem() {
    this.openSupplyDialog(new InterventionSupplyItem());
  }

  deleteSupplyItem(event: CustomEvent) {
    console.log(event);
  }
}
