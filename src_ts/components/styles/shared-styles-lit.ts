import {html} from 'lit';

export const SharedStylesLit = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      font-size: 16px;
    }

    *[hidden] {
      display: none !important;
    }

    h1,
    h2 {
      color: var(--primary-text-color);
      margin: 0;
      font-weight: normal;
    }

    h1 {
      text-transform: capitalize;
      font-size: 24px;
    }

    h2 {
      font-size: 20px;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
    }

    section {
      background-color: var(--primary-background-color);
    }

    .error {
      color: var(--error-color);
      font-size: 12px;
      align-self: center;
    }

    etools-dropdown[readonly],
    etools-dropdown-multi[readonly] {
      --esmm-select-cursor: text;
      --esmm-external-wrapper: {
        width: 100%;
      }
    }

    etools-dropdown,
    etools-dropdown-multi {
      --esmm-external-wrapper: {
        width: auto;
        max-width: 650px;
      }
    }

    etools-dropdown-multi[required]::part(esmm-label),
    etools-dropdown[required]::part(esmm-label) {
      @apply --required-star-style;
    }

    label[required] {
      @apply --required-star-style;
      background: url('./images/required.svg') no-repeat 87% 40%/6px;
    }

    .readonly {
      pointer-events: none;
    }
    .font-bold {
      font-weight: bold;
    }
  </style>
`;
