import icon from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received data
   * @param {Object | Object[]} data This data will be rendered to the DOM
   * @param {boolean} [render=true] If false, return a string instead of rendering
   * @returns {undefined | string} returns string markup when render is set to false
   * @this {Object} View instances
   * @author Huu Phuoc
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data) return;

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newEls = Array.from(newDom.querySelectorAll('*'));
    const curEls = Array.from(this._parentElement.querySelectorAll('*'));

    newEls.forEach((newEl, i) => {
      const curEl = curEls[i];

      // Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        const attributes = Array.from(newEl.attributes);
        attributes.forEach(newAttr => {
          curEl.setAttribute(newAttr.name, newAttr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icon}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icon}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icon}#icon-loader"></use>
      </svg>
    </div>;`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
