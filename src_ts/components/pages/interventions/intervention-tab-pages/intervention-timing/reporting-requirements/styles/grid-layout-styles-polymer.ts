import {html} from '@polymer/polymer/polymer-element.js';
import {gridLayoutStylesContent} from '../../../common/styles/grid-layout-styles-lit';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

// language=HTML
export const gridLayoutStylesPolymer = html`<style>
  ${unsafeHTML(gridLayoutStylesContent)}
</style>`;
