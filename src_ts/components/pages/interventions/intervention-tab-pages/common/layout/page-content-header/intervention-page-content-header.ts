import {LitElement, html, property, customElement} from 'lit-element';
import {
  layoutVertical,
  layoutStartJustified,
  layoutFlex,
  layoutHorizontal,
  layoutCenter,
  _layoutStart
} from '../../styles/flex-layout-styles';

/**
 * @LitElement
 * @customElement
 */
@customElement('intervention-page-content-header')
export class InterventionPageContentHeader extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        *[hidden] {
          display: none !important;
        }

        :host {
          ${layoutVertical}
          ${layoutStartJustified}
          ${layoutFlex}

          background-color: var(--primary-background-color);
          padding: 0 24px;
          min-height: 85px;
          border-bottom: 1px solid var(--dark-divider-color);

          --page-title: {
            margin: 0;
            font-weight: normal;
            text-transform: capitalize;
            font-size: 24px;
            line-height: 1.3;
            min-height: 31px;
            max-width: 300px;
          }
        }

        :host([with-tabs-visible]) {
          min-height: 114px;
        }

        .content-header-row {
          ${layoutHorizontal}
          ${layoutStartJustified}
        }

        .title-row {
          ${layoutCenter}
          margin: 30px 0 0;
          padding: 0 24px;
        }

        .title-row h1 {
          ${layoutFlex}
          @apply --page-title;
        }

        .tabs {
          margin-top: 5px;
        }

        @media print {
          :host {
            padding: 0;
            border-bottom: none;
            min-height: 0 !important;
            margin-bottom: 16px;
          }

          .title-row h1 {
            font-size: 18px;
          }
        }

        @media (max-width: 576px) {
          :host {
            padding: 0 5px;
          }
          .title-row {
            padding: 0 5px 5px 5px;
          }
        }
        .modeContainer {
          ${layoutHorizontal}
          ${layoutStartJustified}
          /*min-width: 200px;*/
        }
        .statusContainer {
          ${layoutHorizontal}
          ${layoutStartJustified}
          /*min-width: 200px;*/
        }
        .vb {
          border-left: 2px solid gray;
          height: 50px;
          padding: 0 20px;
        }
      </style>

      <div class="content-header-row title-row">
        <h1>
          <slot name="page-title"></slot>
        </h1>
        <div class="vb"></div>
        <div class="modeContainer">
          <slot name="mode"></slot>
        </div>
        <div class="statusContainer">
          <slot name="statusFlag"></slot>
        </div>
        <slot name="title-row-actions"></slot>
      </div>

      <div class="content-header-row tabs" ?hidden="${this.withTabsVisible}">
        <slot name="tabs"></slot>
      </div>
    `;
  }

  @property({type: Boolean, reflect: true})
  withTabsVisible = false;
}
