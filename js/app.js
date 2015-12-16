var HTML_FILE_NAME = '';

function handleFileContent(fileOnLoadEvent) {
  var html = fileOnLoadEvent.target.result;
  var id = HashID.generate();

  Storage.set(id, html);
  Storage.get(id);
  window.history.pushState('', '', '/#' + id);
}

var Storage = (function () {
  var firebaseReference = new Firebase('https://publish-html.firebaseio.com/');

  function set(id, html) {
    firebaseReference.child(id).set({
      id: id,
      html: html,
      dateCreated: new Date()
    });
  }

  function get(id) {
    firebaseReference.child(id).once('value', function(snapshot) {
      var jsonDocument = snapshot.val();

      if (jsonDocument) {
        document.querySelector('html').innerHTML = jsonDocument.html;
      } else {
        hideLoadingView();
        showDocumentNotFound();
      }
    });
  }

  return {
    set: set,
    get: get
  };
})();

function showDocumentNotFound() {
  document.querySelector('[data-not-found]').classList.remove('hide');;
}

function handleFileSelect(dropEvent) {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();

  var files = dropEvent.dataTransfer.files; // FileList object.
  var firstFile = files[0];

  HTML_FILE_NAME = firstFile.name.replace('.html', '');

  var fileReader = new FileReader();
  fileReader.onload = handleFileContent;
  fileReader.readAsText(firstFile);
}

function handleDragOver(dragOverEvent) {
  dragOverEvent.stopPropagation();
  dragOverEvent.preventDefault();
  dragOverEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function showLandingView() {
  document.querySelector('[data-landing]').classList.remove('hide');
}

function showLoadingView() {
  document.querySelector('[data-loading]').classList.remove('hide');
}

function hideLoadingView() {
  document.querySelector('[data-loading]').classList.add('hide');
}

function getHashId() {
  return window.location.hash.replace('#', '');
}

document.addEventListener('DOMContentLoaded', function handleDOMContentLoaded() {
  var dropZoneElement = document.querySelector('html');
  dropZoneElement.addEventListener('dragover', handleDragOver, false);
  dropZoneElement.addEventListener('drop', handleFileSelect, false);

  var hash = getHashId();

  if (hash) {
    showLoadingView();
    Storage.get(hash);
  } else {
    showLandingView();
  }
});
