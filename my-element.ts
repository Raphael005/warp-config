import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      color: var(--my-element-text-color, #000);
    }
  `;

  @property({ type: String })
  name = 'World';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
