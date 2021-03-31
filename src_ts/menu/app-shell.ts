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
import appTheme from './app-theme.js';

@customElement('app-shell2')
export class AppShell2 extends LitElement {
  static get styles() {
    return [
      css`
        .header-container {
          padding: 16px 16px 0px;
          text-align: right;
        }
        .logo {
          text-align: center;
          padding-top: 8px;
          padding-bottom: 16px;
        }

        .content-container {
          width: 100%;
          max-width: 500px;
          padding: 0 8px;
        }
        .apps-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          font-size: 12px;
        }

        .layout-h {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        .app-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 6px;
        }
        .svg-wrapper {
          height: 55px;
          width: 55px;
          display: flex;
          flex-direction: column;
          background-color: lightgray;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
        }
        .category {
          color: var(--secondary-text-color);
          font-weight: bold;
          font-size: 16px;
        }
        .app-name {
          margin-top: 12px;
          width: 95px;
          text-align: center;
        }
        .footer {
          height: 100px;
        }
        fieldset {
          margin-bottom: 20px;
          border-width: 1px;
          border-style: solid;
          border-radius: 8px;
        }
        img#profile {
          background-color: rgba(211, 211, 211, 0.4);
          border-radius: 50%;
          padding: 6px;
          width: 20px;
          height: 20px;
        }
      `
    ];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${appTheme}
      <div class="header-container">
        <img id="profile" src="./images/perm_identity-24px.svg" alt="etools Logo" />
      </div>
      <div class="logo">
        <img id="app-logo" class="logo" src="./images/etools-logo-color-white.svg" alt="eTools" />
      </div>
      <div class="layout-h">
        <div class="content-container">
        <fieldset>
          <legend class="category">Programme Management</legend>
          <div class="apps-container">
            <div class="app-wrapper">
              <div class="svg-wrapper">${unppIcon}</div>
              <div class="app-name">UN Partner Portal</div>
            </div>
            <div class="app-wrapper">
              <div class="svg-wrapper">${pmpIcon}</div>
              <div class="app-name">Partnership Management</div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend class="category">Monitoring & Assurance</legend>
          <div class="apps-container">
            <div class="app-wrapper">
              <div class="svg-wrapper">${tripsIcon}</div>
              <div class="app-name">Trip Management</div>
            </div>
            <div class="app-wrapper">
              <div class="svg-wrapper">${tpmIcon}</div>
              <div class="app-name">Third Party Monitoring</div>
            </div>
            <div class="app-wrapper">
              <div class="svg-wrapper">${famIcon}</div>
              <div class="app-name">Financial Assurance</div>
            </div>
            <div class="app-wrapper">
            <div class="svg-wrapper">${pseaIcon}</div>
              <div class="app-name">PSEA Assurance</div>
            </div>
            <div class="app-wrapper">
              <div class="svg-wrapper">${fmIcon}</div>
              <div class="app-name">Field Monitoring</div>
            </div>
          </div>
        </fieldset>

          
        <fieldset>
          <legend class="category">Dashborads & Analytics</legend>
          <div class="apps-container">
            <div class="app-wrapper">
              <div class="svg-wrapper">${apdIcon}</div>
              <div class="app-name">Action Points</div>
             </div>
            <div class="app-wrapper"><div class="svg-wrapper">${dashIcon}</div> <div class="app-name">Dashboards</div></div>
            <div class="app-wrapper"><div class="svg-wrapper">${powerBiIcon}</div> <div class="app-name">Implementation Intelligence (I<sup>2</sup>)</div></div>
            <div class="app-wrapper"><div class="svg-wrapper">${externalIcon}</div> <div class="app-name">Datamart</div></div>
          </div>
        </fieldset>

        <div class="footer"></div>
      </div>
    `;
  }
}
