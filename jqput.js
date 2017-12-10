/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var jq = window.jQuery;

  function logEvent(evt) { console.log('event:', evt.type, evt); }

  function saneFn(fn) {
    return (fn.match(/[A-Za-z0-9\-\.]+/g) || []).join('_'
      ).replace(/[_\.]*(\.)[_\.]*/g, '$1'
      ).replace(/^[_\.]+/, '').replace(/[_\.]+$/, '');
  }

  function makeDestFn(fileMeta) {
    var isoNow = (new Date()).toISOString().replace(/\D/g, '').substr(2, 12);
    return (isoNow.slice(0, 6) + '-' + isoNow.slice(-6) + '.' +
      Math.random().toString(36).replace(/^0?\./, '').slice(-8) + '.' +
      saneFn(String(fileMeta.name).toLowerCase()));
  }

  function xhrUpload(cfgStr, destUrl, payload, whenDone, whenUploadProgress) {
    var xhr = new XMLHttpRequest();
    (function openXhr() {
      var useAsyncXhr = true, un = cfgStr('dest_user'),
        pw = cfgStr('dest_pass');
      if ((un + pw) === '') { un = pw = null; }
      xhr.open('PUT', destUrl, useAsyncXhr, un, pw);
    }());
    cfgStr('dest_headers').split(/\n/).forEach(function (v) {
      var n = /^\s*(\S+):\s*/.exec(v);
      if (!n) { return; }
      xhr.setRequestHeader(n[1], v.slice(n[0].length));
    });
    xhr.overrideMimeType('application/octet-stream');
    // ^-- Browser should not even try to parse the response as anything.
    xhr.upload.onprogress = (whenUploadProgress && function (evt) {
      logEvent(evt);
      if (!evt.lengthComputable) { return; }
      whenUploadProgress((+evt.loaded || 0), xhr, evt);
    });
    xhr.onload = xhr.onerror = (whenDone
      && function (evt) { whenDone(xhr, evt); });
    xhr.send(payload);
    return xhr;
  }

  function nqFile(form, fileBlob) {
    console.log('fileBlob:', fileBlob);
    form.latestFile = fileBlob;
    if (!fileBlob) { return; }
    var fileSize = (+fileBlob.size || 0), li, jqLi;
    function hid(n) { return String((form.elements[n] || false).value || ''); }
    jqLi = jq('<li class="file wip">' +
      '<span class="status"><progress min="0" max="' + fileSize +
        '" value="0"></progress></span>' +
      ' <span class="orig-fn"></span>' +
      ' &rarr; <a class="dest-fn" target="_blank"></a>' +
      '</li>');
    li = jqLi[0];
    li.status = jqLi.find('.status');
    li.progressBar = jqLi.find('progress')[0];
    li.fileBlob = fileBlob;
    jqLi.find('.orig-fn').text(fileBlob.name);
    li.destFn = (form.makeDestFn || makeDestFn)(fileBlob);
    li.destLink = jqLi.find('.dest-fn').text(li.destFn)[0];
    li.destLink.href = hid('dest_prefix') + li.destFn;
    jqLi.prependTo(form.uploadsList || jq(form).find('.uploads').first());

    function onProgress(bytes) {
      var pb = li.progressBar;
      pb.value = bytes;
      pb.innerHTML = ((100 * bytes) / fileSize).toFixed(2) + '%';
    }

    function onXhrDone(xhr, evt) {
      var httpStatus = (+xhr.status || 0),
        success = ((httpStatus >= 200) && (httpStatus < 300));
      logEvent(evt);
      li.status.text(httpStatus + ' ' + xhr.statusText);
      jqLi.removeClass('wip').addClass(success ? 'sxs' : 'err');
    }

    li.xhr = xhrUpload(hid, li.destLink.href, fileBlob, onXhrDone, onProgress);
  }

  function upgradeForm(form) {
    var jqForm = jq(form), blobF = form.elements.file_blob;
    jq(blobF).on('change', function () {
      nqFile(form, blobF.files[0]);
      form.reset();
    });
    jqForm.on('dragenter dragover drop submit', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    });
    jqForm.on('drop', function (evt) {
      logEvent(evt);
      var dt = (evt.dataTransfer || evt.originalEvent.dataTransfer);
      if (!dt.files) { return; }
      nqFile(form, dt.files[0]);
    });
    jqForm.addClass('dropzone');
  }
  jq('form.easydav-jqput').each(function (i, f) { upgradeForm(f, i); });


































}());
