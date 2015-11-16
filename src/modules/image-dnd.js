import Quill from '../quill';
import extend from 'extend';

let Range = Quill.import('range');

class ImageDND  {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = extend({}, options);
    this.initListeners();
  }

  initListeners() {
    this.quill.root.addEventListener('drop', this._handleDrop.bind(this), false);
  }

  _handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    this._readFiles(files, (dataUri) => {
      this._insertImageAtPoint(dataUri, evt.clientX, evt.clientY)
    });
  }

  _readFiles(files, cb) {
    [...files].forEach((file, index) => {
      var reader = new FileReader();
      if (file.type.match('image.*')) {
        reader.onload = (e) => {
          var dataUri = e.target.result;
          cb(dataUri);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  _insertImageAtPoint(url, clientX, clientY) {
    let range = this.quill.setSelectionFromPoint(clientX, clientY, Quill.sources.USER);
    if (range != null) {
      this.quill.insertEmbed(range.start, 'image', { url: url }, Quill.sources.USER);
      this.quill.setSelection(range.start + 1, range.start + 1, Quill.sources.SILENT);
    }
  }
};

Quill.registerModule('image-dnd', ImageDND);

export { ImageDND as default };
