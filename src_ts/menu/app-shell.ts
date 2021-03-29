import {css, customElement, html, LitElement} from 'lit-element';
import {
  apdIcon,
  dashIcon,
  externalIcon,
  famIcon,
  fmIcon,
  pmpIcon,
  powerBiIcon,
  pseaIcon,
  tpmIcon,
  tripsIcon,
  unppIcon
} from './app-selector-icons.js';

@customElement('app-shell2')
export class AppShell2 extends LitElement {
  static get styles() {
    return [
      css`
        .header-container {
          padding: 16px;
          text-align: right;
        }
        .logo {
          text-align: center;
          padding: 40px 0;
        }
        .content-container {
          width: 100%;
          max-width: 450px;
        }
        .apps-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
        }

        .layout-h {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        .icon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .category {
          padding-top: 26px;
          padding-bottom: 16px;
        }
      `
    ];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <div class="header-container">
        <img src="./images/perm_identity-24px.svg" alt="etools Logo" />
      </div>
      <div class="logo">
        <img id="app-logo" class="logo" src="./images/etools-logo-color-white.svg" alt="eTools" />
      </div>
      <div class="layout-h">
        <div class="content-container">
          <div class="category">Programme Management</div>
          <div class="apps-container">
            <div class="icon-wrapper">
              ${unppIcon}
              UN Partner Portal
            </div>
            <div class="icon-wrapper">
              ${pmpIcon}
              Partnership Management
            </div>
          </div>
          <div class="category">Monitoring & Assurance</div>
          <div class="apps-container">
            <div class="icon-wrapper">
              ${tripsIcon}
              Trip Management
            </div>
            <div class="icon-wrapper">
              ${tpmIcon}
              Third Party Monitoring
            </div>
            <div class="icon-wrapper">
              ${famIcon}
              Financial Assurance
            </div>
            <div class="icon-wrapper">
              ${pseaIcon}
              PSEA Assurance
            </div>
            <div class="icon-wrapper">
              ${fmIcon}
              Field Monitoring
            </div>
          </div>
          <div class="category">Dashborads & Analytics</div>
          <div class="apps-container">
          <div class="icon-wrapper">${apdIcon} Action Points</div>
          <div class="icon-wrapper">${dashIcon} Dashboards</div>
          <div class="icon-wrapper">${powerBiIcon} <div>Implementation Intelligence (I<sup>2</sup>)</div></div>
          <div class="icon-wrapper">${externalIcon} Datamart</div>
        </div>
      </div>
    `;
  }
}
