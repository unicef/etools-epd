import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {ResultStructureStyles} from './results-structure.styles';
import {gridLayoutStylesLit} from '../../common/styles/grid-layout-styles-lit';
import {ExpectedResult} from '../../common/models/intervention-types';
import '@unicef-polymer/etools-data-table';
import '@polymer/iron-icons';

@customElement('cp-output-level')
export class CpOutputLevel extends LitElement {
  static get styles(): CSSResultArray {
    // language=CSS
    return [gridLayoutStylesLit, ResultStructureStyles, css`
      :host {
        display: block;
      }
      :host([show-cpo-level]) {
        border-top: 1px solid var(--main-border-color);
        margin: 0 7px;
      }
      :host(:first-child) {
        border-top: none;
      }
      .alert {
        color: var(--error-color);
      }
    `];
  }

  @property() resultLink!: ExpectedResult;
  @property({type: Boolean, reflect: true, attribute: 'show-cpo-level'}) showCPOLevel: boolean = false;

  protected render(): TemplateResult {
    return html`
        <style>
          etools-data-table-row {
            overflow: hidden;
            --list-row-collapse-wrapper: {
              padding: 0 !important;
              margin-bottom: 10px;
              background-color: transparent !important;
              border: 1px solid var(--main-border-color) !important;
              border-bottom: 1px solid var(--main-border-color) !important;
            };
            --list-row-wrapper: {
              background-color: var(--primary-background-color) !important;
              border-bottom: none !important;
              padding: 5px 4px;
            };
          }
        </style>
        ${this.showCPOLevel && this.resultLink ? html`
          <etools-data-table-row>
            <div slot="row-data" class="layout-horizontal">
              <!--      If PD is associated with CP Output      -->
              ${this.resultLink.cp_output ? html`
                <div class="flex-1 flex-fix">
                  <div class="heading">Country Program output</div>  
                  <div class="data">${this.resultLink.cp_output_name}</div>
                </div>
              
                <div class="flex-1 flex-fix">
                  <div class="heading">Ram Indicators</div>  
                  <div class="data">
                    ${this.resultLink.ram_indicator_names.map(
                      (name: string) => html`<div class="truncate">${name}</div>`
                    )}
                  </div>
                </div>
             
                <div class="flex-none">
                  <div class="heading">Total Cache budget</div>  
                  <div class="data">TTT 1231.144</div>
                </div>
              ` : html`
              <!--      If PD is unassociated with CP Output      -->
              <div class="flex-1 flex-fix data alert">
                Unassociated to CP Output! Please associate before moving forward
              </div>
            `}

           </div>
           
           <div slot="row-data-details">
            <slot></slot>
            
            <div class="add-pd row-h align-items-center" ?hidden="${!this.resultLink.cp_output}">
              <iron-icon icon="add-box"></iron-icon>Add PD Output
            </div>
          </div>
          </etools-data-table-row>
        ` : html`<slot></slot>`}
    `;
  }
}
