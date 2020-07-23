import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-content-panel';
import '@unicef-polymer/etools-data-table';
import '@unicef-polymer/etools-table/etools-table';
import {EtoolsTableChildRow, EtoolsTableColumn, EtoolsTableColumnType} from '@unicef-polymer/etools-table/etools-table';
import '@unicef-polymer/etools-currency-amount-input';
import './activity-dialog';
import {ActivityDialog} from './activity-dialog';
import {connect} from 'pwa-helpers/connect-mixin';
import {getStore} from '../../utils/redux-store-access';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {buttonsStyles} from '../../common/styles/button-styles';
import {sharedStyles} from '../../common/styles/shared-styles-lit';
import {elevationStyles} from '../../common/styles/elevation-styles';
import {pageIsNotCurrentlyActive} from '../../utils/common-methods';
import get from 'lodash-es/get';
import {isJsonStrMatch} from '../../utils/utils';
import {
  selectProgrammeManagement,
  selectProgrammeManagementActivityPermissions
} from './effectiveAndEfficientProgrammeManagement.selectors';
import ComponentBaseMixin from '../../common/mixins/component-base-mixin';
import {Permission} from '../../common/models/intervention.types';
import {ProgrammeManagementActivityPermissions} from './effectiveAndEfficientProgrammeManagement.models';

/**
 * @customElement
 */
@customElement('effective-and-efficient-programme-management')
export class EffectiveAndEfficientProgrammeManagement extends connect(getStore())(ComponentBaseMixin(LitElement)) {
  static get styles() {
    return [gridLayoutStylesLit, buttonsStyles, elevationStyles];
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

        etools-table {
          --child-item-padding: 2px 4px;
          --child-item-margin: 4px 8px;
          --child-item-cursor: pointer;
          --child-item-white-space: normal;
          --child-item-float: none;
          --child-row-inner-container-height: 30px;
        }
      </style>

      <etools-content-panel panel-title="Effective and efficient programme management">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>

        <div slot="panel-btns">
          Total: ${this.total_amount}
        </div>

        <etools-table
          .items="${this.activities}"
          .columns="${this.columns}"
          .extraCSS="${sharedStyles}"
          .getChildRowTemplateMethod="${this.getChildRowTemplate.bind(this)}"
        >
        </etools-table>
      </etools-content-panel>
    `;
  }

  @property({type: Boolean})
  showLoading = false;

  @property({type: Object})
  activities = [
    {
      title: 'Standard activity',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis metus et neque viverra ',
      unicef_cash: 3685,
      partner_contribution: 54789
    },
    {
      title: 'Standard activity',
      description:
        'There are many variations of passages available, but the majority have suffered alteration in some form',
      unicef_cash: 125,
      partner_contribution: 751
    },
    {
      title: 'Standard activity',
      description: 'It is a long established fact that a reader will be distracted by the readable content',
      unicef_cash: 652,
      partner_contribution: 441
    }
  ];

  @property({type: Array})
  columns: EtoolsTableColumn[] = [
    {
      label: 'Item (all prices in PD currency)',
      name: 'title',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Unicef Cash',
      name: 'unicef_cash',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Partner Contribution',
      name: 'partner_contribution',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Total',
      name: 'total',
      type: EtoolsTableColumnType.Custom,
      customMethod: (item: any) => {
        return item ? item.unicef_cash + item.partner_contribution : '0';
      }
    }
  ];

  private activityDialog!: ActivityDialog;

  @property({type: Number})
  total_amount: number = 0;

  @property({type: Object})
  permissions!: Permission<ProgrammeManagementActivityPermissions>;

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state: any) {
    if (!state.interventions.current) {
      return;
    }
    if (pageIsNotCurrentlyActive(get(state, 'app.routeDetails'), 'interventions', 'details')) {
      return;
    }

    const newActivities = selectProgrammeManagement(state);
    if (!isJsonStrMatch(this.originalData, newActivities)) {
      this.activities = newActivities;
      this.originalData = newActivities;
    }

    const newPermissions = selectProgrammeManagementActivityPermissions(state);
    if (!isJsonStrMatch(this.permissions, newPermissions)) {
      this.permissions = newPermissions;
    }
  }

  private openActivityDialog() {
    this.createDialog();
    this.activityDialog.permissions = this.permissions;
    (this.activityDialog as ActivityDialog).openDialog();
  }

  createDialog() {
    this.activityDialog = document.createElement('activity-dialog') as ActivityDialog;
    this.activityDialog.setAttribute('id', 'activityDialog');
    this.activityDialog.toastEventSource = this;
    document.querySelector('body')!.appendChild(this.activityDialog);
  }

  getChildRowTemplate(item: any): EtoolsTableChildRow {
    const childRow = {} as EtoolsTableChildRow;
    childRow.showExpanded = false;
    childRow.rowHTML = html`
      <td colspan="7">
        <div class="child-row-inner-container">
          <label class="label-input">Description</label><br />
          <label>${item.description}</label>
        </div>
      </td>
    `;
    return childRow;
  }
}
