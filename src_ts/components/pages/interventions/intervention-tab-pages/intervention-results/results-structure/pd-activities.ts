import {LitElement, html, TemplateResult, CSSResultArray, css, customElement, property} from 'lit-element';
import {ResultStructureStyles} from './results-structure.styles';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import '@polymer/iron-icons';
import {
  InterventionActivity
} from '../../common/models/intervention.types';

@customElement('pd-activities')
export class PdActivities extends LitElement {
  static get styles(): CSSResultArray {
    // language=CSS
    return [gridLayoutStylesLit, ResultStructureStyles, css`
      :host {
        --green-background: #C4D7C6;
        --green-background-dark: #B3C6B5;
        display: block;
        background: var(--green-background);
      }
      .details-container.full {
        width: 70%;
      }
    `]
  }

  @property({type: Array}) activities: InterventionActivity[] = [{
    created: '',
    modified: '',
    activity_name: 'Activity 1.1 Vaccinate Children',
    context_details: '',
    unicef_cash: 140090,
    cso_cash: 3500,
    unicef_suppies: 0,
    cso_supplies: 0,
    time_periods: [],
    intervention: 0,
    items: [],
  },{
    created: '',
    modified: '',
    activity_name: 'Activity 1.2 Do Other thigns',
    context_details: 'This activity is contingent on timely reception of necessary vaccines, extra attention should be paid to X',
    unicef_cash: 4000,
    cso_cash: 440,
    unicef_suppies: 0,
    cso_supplies: 0,
    time_periods: [],
    intervention: 0,
    items: [],
  }];

  protected render(): TemplateResult {
    // language=HTML
    return html`
      <style>
        etools-data-table-row {
          --list-row-collapse-wrapper: {
            padding: 0 !important;
            background-color: var(--green-background-dark);
            border-top: 1px solid var(--main-border-color);
          }
          --list-row-wrapper: {
            background-color: var(--green-background) !important;
            min-height: 55px;
            border: 1px solid var(--main-border-color) !important;
            border-bottom: none !important;
          }
        }
      </style>

      <div class="row-h align-items-center header">
        <div class="heading flex-auto">
           PD Activities
           <iron-icon icon="add-box"></iron-icon>
        </div>
        <div class="heading number-data flex-none">CSO Cache</div>
        <div class="heading number-data flex-none">UNICEF Cache</div>
        <div class="heading number-data flex-none">Total</div>
        <div class="heading number-data flex-none">%Partner</div>
      </div>

      ${this.activities.map((activity: InterventionActivity) => html`
        <etools-data-table-row>
          <div slot="row-data" class="layout-horizontal">
            <!--    PD Activity name    -->
            <div class="text flex-auto">
              ${activity.activity_name || '-'}
            </div>

            <!--    CSO Cache    -->
            <div class="text number-data flex-none">
              ${this.formatCurrency(activity.cso_cash || 0)}
            </div>

            <!--    UNICEF Cache    -->
           <div class="text number-data flex-none">
              ${this.formatCurrency(activity.unicef_cash || 0)}
           </div>

            <!--    Total    -->
           <div class="text number-data flex-none">
              ${this.formatCurrency(this.getTotal(activity.cso_cash , activity.unicef_cash))}
           </div>

            <!--    %Partner    -->
           <div class="text number-data flex-none">
              ${this.getPartnerPercent(activity.cso_cash, activity.unicef_cash)}
           </div>
         </div>

        <!--    Indicator row collapsible Details    -->
        <div slot="row-data-details" class="row-h">
          <!--    Locations    -->
          <div class="details-container">
            <div class="text details-heading">Time periods</div>
            <div class="details-text">
             <b>Q1, Q2, Q4</b>
            </div>
          </div>

          <!--    Section and Cluster    -->
          <div class="details-container full">
            <div class="text details-heading">Other comments</div>
            <div class="details-text">${activity.context_details || '-'}</div>
          </div>
        </div>
        </etools-data-table-row>
      `)}
    `;
  }

  formatCurrency(value: string | number): string {
    return String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  getTotal(partner: number, unicef: number): number {
    return (partner || 0) + (unicef || 0);
  }

  getPartnerPercent(partner: number, unicef: number): string {
    if (!partner) {
      return '%0';
    }
    const total: number = this.getTotal(partner, unicef);
    const percent: number = partner / (total / 100);
    return `%${Number(percent.toFixed(2))}`;
  }

}
