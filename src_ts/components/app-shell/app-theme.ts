import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {
        --primary-color: #0099ff;
        --primary-background-color: #FFFFFF;
        --secondary-background-color: #eeeeee;
        --medium-theme-background-color: #eeeeee;
        --light-theme-background-color: var(--paper-grey-50);

        --primary-text-color: #212121;
        --secondary-text-color: #757575;

        --header-color: #ffffff;
        --header-bg-color: #233944;
        --header-icon-color: #e1c3c5;
        --nonprod-header-color: #a94442;
        --nonprod-text-warn-color: #e6e600;

        --main-border-color: #c1c1c1;
        --light-divider-color: #e0e0e0;
        --light-hex-divider-color: #b8b8b8;
        --dark-divider-color: #999999;
        --darker-divider-color: #9D9D9D;

        --dark-icon-color: #595959;
        --light-icon-color: rgba(255, 255, 255, 1);

        --side-bar-scrolling: visible;

        --success-color: #72c300;
        --error-color: #ea4022;

        --add-button-color: var(--success-color);
        --icon-delete-color: var(--error-color);

        --primary-shade-of-green: #1A9251;
        --primary-shade-of-red: #E32526;
        --primary-shade-of-orange: orange;
        --light-hex-divider-color: #b8b8b8;

        --info-color: #cebc06;
        --light-info-color: #fff176;
        --lightest-info-color: #fef9cd;
        --warning-background-color: #fff3cd;
        --warning-color: #856404;
        --warning-border-color: #ffeeba;

        --error-box-heading-color: var(--error-color);
        --error-box-bg-color: #f2dede;
        --error-box-border-color: #ebccd1;
        --error-box-text-color: var(--error-color);

        --epc-header: {
          background-color: var(--primary-background-color);
          border-bottom: 1px groove var(--dark-divider-color);
        }
        --epc-header-color: var(--primary-text-color);
        --ecp-header-title: {
          padding: 0 24px 0 0;
          text-align: left;
          font-size: 18px;
          font-weight: 500;
        }

        --etools-dialog-primary-color: #FFFFFF;
        --etools-dialog-contrast-text-color: var(--primary-text-color);
        --etools-dialog-title: {
          border-bottom: solid 1px var(--dark-divider-color);
        }

        --paper-input-container-label: {
          color: var(--secondary-text-color, #737373);
        }
        --paper-input-container-label-floating: {
          color: var(--secondary-text-color, #737373);
        }
        --paper-input-prefix: {
          color: var(--secondary-text-color, #737373);
          margin-right: 10px;
        };
        --esmm-external-wrapper: {
          width: 100%;
          margin: 0;
        };
        --paper-checkbox-checked-color: var(--primary-color);
        --paper-checkbox-unchecked-color: var(--secondary-text-color);
        --paper-radio-button-checked-color: var(--primary-color);
        --paper-radio-button-unchecked-color: var(--secondary-text-color);
        --basic-btn-style: {
          width: auto;
          margin: 0;
          color: var(--primary-color);
          padding: 0 5px 0 0;
          font-size: 14px;
          font-weight: bold;
        };

        --paper-item: {
          cursor: pointer;
        };
      }
    </style>
  </custom-style>`;

document.head.appendChild(documentContainer.content);
