import View from './View.js';
import icon from '../../img/icons.svg';
import previewView from './previewView.js';
z;

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We cannot load your result 😭';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join();
  }
}

export default new ResultView();
