import {LitElement, customElement, html} from 'lit-element';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {elevationStyles} from '../../../common/styles/elevation-styles';
import {sharedStyles} from '../../../common/styles/shared-styles-lit';

/**
 * @customElement
 */
@customElement('eface-details')
export class EfaceDetails extends LitElement {
  static get styles() {
    return [elevationStyles, sharedStyles, pageLayoutStyles];
  }
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: block;
        }
        .row {
          display: grid;
          grid-template-columns: 25% 10% 35% 30%;
          column-gap: 5px;
        }

        .row.h > div {
          border: 3px solid #616161;
          font-weight: 500;
        }

        .row.totals > div {
          font-weight: 500;
          border-left: 3px solid #616161;
          border-bottom: 3px solid #616161;
          border-right: 3px solid #616161;
          border-top: 1px solid #616161;
        }

        .currency {
          grid-column-start: 1;
          grid-column-end: 3;
        }
        .double-border {
          border: 4px double #616161;
        }
        .bold {
          font-weight: bold;
        }
        .reporting-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .requests-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .reporting-grid > div:not(:last-child),
        .requests-grid > div:not(:last-of-type) {
          border-inline-end: 1px solid #616161;
        }
        .reporting-grid > div,
        .requests-grid > div {
          text-align: right;
          padding-right: 2px;
        }
        .center {
          text-align: center;
        }
        .space-between {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .h > div {
          text-align: center;
        }
        .b-spacing {
          margin-bottom: 5px;
        }
        .item {
          border-left: 1px solid #616161;
          border-right: 1px solid #616161;
          border-bottom: 1px solid #616161;
        }
      </style>
      <section class="elevation page-content" elevation="1">
        <div class="row b-spacing center">
          <div class="currency">Currency: US</div>
          <div class="double-border center bold">REPORTING</div>
          <div class="double-border center bold">REQUESTS / AUTHORIZATIONS</div>
        </div>
        <div class="row h">
          <div>Activity description from AWP with Duration</div>
          <div>Coding for UNDP, UNFPA and WFP</div>
          <div class="reporting-grid">
            <div class="space-between h">
              <div>Authorized Amount</div>
              <div>Jul -Sept 2020</div>
              <div class="center">A</div>
            </div>
            <div class="space-between h">
              <div>Actual Project Expenditure</div>
              <div class="center">B</div>
            </div>
            <div class="space-between h">
              <div>Expenditures accepted by</div>
              <div class="center">C</div>
            </div>
            <div class="space-between h">
              <div>Balance</div>
              <div class="center">D = A - C</div>
            </div>
          </div>
          <div class="requests-grid">
            <div class="space-between h">
              <div>New Request Perios & Amount</div>
              <div>Oct -Jan 2021</div>
              <div class="center">E</div>
            </div>

            <div class="space-between h">
              <div>Authorized Amount</div>
              <div>F</div>
            </div>
            <div class="space-between h">
              <div>Outstanding Authorized Amount</div>
              <div>G = D + F</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="item">1.1 Organize training of 500 health workers in community nutrition in 10 districts</div>
          <div class="item"></div>
          <div class="item reporting-grid">
            <div>11.10</div>
            <div>11.10</div>
            <div>11.10</div>
            <div>11.10</div>
          </div>
          <div class="item requests-grid">
            <div>12.00</div>
            <div>12.00</div>
            <div>12.00</div>
          </div>
        </div>
        <div class="row">
          <div class="item">1.1 Organize training of 500 health workers in community nutrition in 10 districts</div>
          <div class="item"></div>
          <div class="item reporting-grid">
            <div>42.90</div>
            <div>42.90</div>
            <div>42.90</div>
            <div>42.90</div>
          </div>
          <div class="item requests-grid">
            <div>52.11</div>
            <div>52.11</div>
            <div>52.11</div>
          </div>
        </div>
        <div class="row totals">
          <div style="padding: 6px;">Total</div>
          <div></div>
          <div class="reporting-grid">
            <div>10.00</div>
            <div>10.00</div>
            <div>10.00</div>
            <div>10.00</div>
          </div>
          <div class="requests-grid">
            <div>22.30</div>
            <div>10.00</div>
            <div>10.00</div>
          </div>
        </div>
      </section>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    // fireEvent(this, 'global-loading', {
    //   active: false,
    //   loadingSource: 'interv-page'
    // });
  }
}
