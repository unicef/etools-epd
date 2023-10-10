import {html} from 'lit';

// language=HTML
export const countriesDropdownStyles = html`
  <style>
    *[hidden] {
      display: none !important;
    }

    :host {
      display: block;
    }

    :host(:hover) {
      cursor: pointer;
    }

    etools-dropdown {
      --auto-size-available-height: 600px;
    }

    organizations-dropdown {
      width: 165px;
    }

    countries-dropdown {
      width: 160px;
    }

    #languageSelector {
      width: 120px;
    }

    .w100 {
      width: 100%;
    }

    organizations-dropdown {
      width: 165px;
    }

    countries-dropdown {
      width: 160px;
    }

    #languageSelector {
      width: 120px;
    }

    .w100 {
      width: 100%;
    }

    etools-dropdown::part(display-input) {
      text-align: right;
    }

    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
    }

    @media (max-width: 768px) {
      etools-dropdown {
        min-width: 130px;
        width: 130px;
      }
    }
  </style>
`;
