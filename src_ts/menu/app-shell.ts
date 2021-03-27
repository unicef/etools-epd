import {css, customElement, html, LitElement} from 'lit-element';

@customElement('app-shell')
export class AppShell extends LitElement {
  static get styles() {
    return [
      css`
        .header-container {
          padding: 16px;
          text-align: right;
        }
        .logo {
          text-align: center;
        }
        .content-container {
        }
        .apps-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
        }
      `
    ];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <div class="header-container">
        <img src="./images/perm_identity-24px.svg" />
      </div>
      <div class="logo">
        <img id="app-logo" class="logo" src="./images/etools-logo-color-white.svg" alt="eTools" />
      </div>
      <div class="content-container">
        <div class="apps-container">

        </div>
      </div>
    `;
  }
}
