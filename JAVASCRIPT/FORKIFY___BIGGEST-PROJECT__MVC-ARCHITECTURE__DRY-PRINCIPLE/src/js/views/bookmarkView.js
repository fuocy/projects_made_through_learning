import View from './View.js';
import icon from '../../img/icons.svg';
import previewView from './previewView.js';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Chose a nice recipe and bookmark it 😁';
  _message = '';

  addHandlerRenderBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join();
  }
}

export default new BookmarkView();
