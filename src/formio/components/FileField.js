import {default as formioUrlStorage} from 'formiojs/providers/storage/url';
import FormioUtils from 'formiojs/utils';
import {Formio} from 'react-formio';

import {CSRFToken} from 'headers';

import {applyPrefix} from '../utils';

const addCSRFToken = xhr => {
  const csrfTokenValue = CSRFToken.getValue();
  if (csrfTokenValue != null && csrfTokenValue) {
    xhr.setRequestHeader(CSRFToken.headerName, csrfTokenValue);
  }
};

const CSRFEnabledUrl = formio => {
  const defaultUrlStorage = formioUrlStorage(formio);

  // Taken and modified from Formio's formiojs/providers/storage/url.js
  const xhrRequest = (url, name, query, data, options, progressCallback, abortCallback) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const json = typeof data === 'string';
      const fd = new FormData();

      if (typeof progressCallback === 'function') {
        xhr.upload.onprogress = progressCallback;
      }

      if (typeof abortCallback === 'function') {
        abortCallback(() => xhr.abort());
      }

      if (!json) {
        for (const key in data) {
          fd.append(key, data[key]);
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Need to test if xhr.response is decoded or not.
          let respData = {};
          try {
            respData = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : {};
            respData = respData && respData.data ? respData.data : respData;
          } catch (err) {
            respData = {};
          }

          // Get the url of the file.
          let respUrl = respData.hasOwnProperty('url')
            ? respData.url
            : `${xhr.responseURL}/${name}`;

          // If they provide relative url, then prepend the url.
          if (respUrl && respUrl[0] === '/') {
            respUrl = `${url}${respUrl}`;
          }
          resolve({url: respUrl, data: respData});
        } else {
          reject(xhr.response || 'Unable to upload file');
        }
      };

      xhr.onerror = () => reject(xhr);
      xhr.onabort = () => reject(xhr);

      let requestUrl = url + (url.indexOf('?') > -1 ? '&' : '?');
      for (const key in query) {
        requestUrl += `${key}=${query[key]}&`;
      }
      if (requestUrl[requestUrl.length - 1] === '&') {
        requestUrl = requestUrl.substr(0, requestUrl.length - 1);
      }

      xhr.open('POST', requestUrl);
      if (json) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      // Open Forms: removed formio JWT token - we don't use this

      // Open Forms: added CSRF token header
      addCSRFToken(xhr);

      //Overrides previous request props
      if (options) {
        const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        for (const prop in parsedOptions) {
          xhr[prop] = parsedOptions[prop];
        }
      }
      xhr.send(json ? data : fd);
    });
  };

  return {
    ...defaultUrlStorage,
    title: 'CSRFEnabledUrl',
    // Taken from Formio's formiojs/providers/storage/url.js to replace xhrRequest call
    uploadFile(
      file,
      name,
      dir,
      progressCallback,
      url,
      options,
      fileKey,
      groupPermissions,
      groupId,
      abortCallback
    ) {
      const uploadRequest = function (form) {
        return xhrRequest(
          url,
          name,
          {
            baseUrl: encodeURIComponent(formio.projectUrl),
            project: form ? form.project : '',
            form: form ? form._id : '',
          },
          {
            [fileKey]: file,
            name,
            dir,
          },
          options,
          progressCallback,
          abortCallback
        ).then(response => {
          // Store the project and form url along with the metadata.
          response.data = response.data || {};
          response.data.baseUrl = formio.projectUrl;
          response.data.project = form ? form.project : '';
          response.data.form = form ? form._id : '';
          return {
            storage: 'url',
            name,
            url: response.url,
            size: file.size,
            type: file.type,
            data: response.data,
          };
        });
      };
      if (file.private && formio.formId) {
        return formio.loadForm().then(form => uploadRequest(form));
      } else {
        return uploadRequest();
      }
    },
  };
};

CSRFEnabledUrl.title = 'CSRFEnabledUrl';

/**
 * Extend the default file field to modify it to our needs.
 */
class FileField extends Formio.Components.components.file {
  attach(element) {
    super.attach(element);

    this.refs.fileStatusRemove.forEach((fileStatusRemove, index) => {
      this.removeEventListener(fileStatusRemove, 'click');

      this.addEventListener(fileStatusRemove, 'click', event => {
        event.preventDefault();
        if (this.abortUpload) {
          this.abortUpload();
        }

        // Formiojs bug #4555 - After deleting a file, if the drag&drop area had been hidden, it
        // doesn't show after deleting.
        // OF issue #2912 - We cannot use the abortUpload method, because this gets overwritten
        // during successful upload of a file
        this.fileDropHidden = false;

        this.statuses.splice(index, 1);
        this.redraw();
      });
    });
  }

  upload(files) {
    if (this.component.multiple && this.component.maxNumberOfFiles) {
      // this.data.file contains files that may have already been uploaded, while the argument 'files' gives the
      // files that are being uploaded in this call
      if (
        files.length > this.component.maxNumberOfFiles ||
        this.data?.file?.length >= this.component.maxNumberOfFiles
      ) {
        const messages = [
          {
            message: this.t(
              'Too many files added. The maximum allowed number of files is {{ maxNumber }}.',
              {maxNumber: this.component.maxNumberOfFiles}
            ),
            level: 'error',
          },
        ];

        this.setComponentValidity(messages, true, false);
        return;
      }
    }

    this.on('fileUploadingStart', () => {
      this.loading = true;
    });

    this.on('fileUploadingEnd', () => {
      this.loading = false;
    });

    let hasTypeErrors = false;
    let statuses = [];

    // Issue #3040 - Overwriting code from the super, in order to update the error message for wrong
    // file types, so that it doesn't show the (escaped) MIME type to the user.
    Array.prototype.forEach.call(files, file => {
      const fileUpload = {
        originalName: file.name,
        name: FormioUtils.uniqueName(
          file.name,
          this.component.fileNameTemplate,
          this.evalContext()
        ),
        size: file.size,
        status: 'info',
        message: this.t('Processing file. Please wait...'),
      };

      if (this.component.filePattern && !this.validatePattern(file, this.component.filePattern)) {
        fileUpload.status = 'error';
        fileUpload.message = this.t(
          'The uploaded file is not of an allowed type. It must be: {{ pattern }}.',
          {
            pattern: this.formatAllowedTypesLabels(
              this.component.file.allowedTypesLabels,
              this.component.filePattern
            ),
          }
        );
        hasTypeErrors = true;
      }

      statuses.push(fileUpload);
    });

    if (hasTypeErrors) {
      this.statuses = this.statuses.concat(statuses);
      this.redraw();
      return;
    }

    super.upload(files);
  }

  formatAllowedTypesLabels(allowedTypesLabels, filePattern) {
    if (!allowedTypesLabels) return filePattern;

    const numberOfAllowedTypes = allowedTypesLabels.length;
    if (numberOfAllowedTypes > 1) {
      return this.t('{{ labels }} or {{ lastLabel }}', {
        labels: allowedTypesLabels.slice(0, numberOfAllowedTypes - 1).join(', '),
        lastLabel: allowedTypesLabels[numberOfAllowedTypes - 1],
      });
    }

    return allowedTypesLabels[0];
  }

  browseFiles(attrs = {}) {
    // provide class name for hiding element, override style to avoid triggering CSP
    attrs = {...attrs, class: applyPrefix('file-upload-input'), style: ''};
    return super.browseFiles(attrs);
  }

  validatePattern(file, val) {
    // file type not recognized; get file extension and specify mime type manually
    if (file.type === '') {
      let ext = file.name.split('.').pop();
      if (ext === 'msg') {
        file = file.slice(0, file.size, 'application/vnd.ms-outlook');
      }
    }
    //gh-2911 let the backend figure heic out. super is not that super
    if (file.type === 'image/heif') return true;

    return super.validatePattern(file, val);
  }

  checkComponentValidity(data, dirty, row, options = {}) {
    if (this.loading) {
      // This prevents the FormStep from being submitted before the file upload is finished.
      // Once the upload is finished, the logic check will be performed and will re-enable the submit button
      const messages = [
        {
          message: this.t('Please wait for the file(s) upload to finish before continuing.'),
          level: 'error',
        },
      ];

      this.setComponentValidity(messages, true, false);
      return false;
    }

    return super.checkComponentValidity(data, dirty, row, options);
  }

  deleteFile(fileInfo) {
    // Regression #1539 because of 77e99358a625a9f242f09aa6368a8b7b2c816e88 - failing
    // to pass the `url` prop/option to the Formio WebForm constructor leads to
    // `webform.setUrl` not being called, which leads to this.root.formio not being
    // defined. This codepath leaves vanilla Formio clueless about sending the
    // DELETE request, even though it can just use the global formio object...
    // Instead of polluting our global configuration with a nonsense URL (which also
    // 'enables' saving drafts, for example), we opt to handle the delete call ourselves
    // in those cases.
    const formio = this.options.formio || (this.root && this.root.formio);
    if (formio) {
      return super.deleteFile(fileInfo);
    }
    // manual handling, replicated from the super class deleteFile
    Formio.makeRequest(null, '', fileInfo.url, 'delete');
  }
}

export {CSRFEnabledUrl};
export default FileField;
