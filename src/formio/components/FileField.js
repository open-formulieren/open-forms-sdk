import {default as formioUrlStorage} from 'formiojs/providers/storage/url';
import {Formio} from 'react-formio';

import {CSRFToken} from 'headers';

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

    super.upload(files);
  }

  validatePattern(file, val) {
    // file type not recognized; get file extension and specify mime type manually
    if (file.type === '') {
      let ext = file.name.split('.').pop();
      if (ext === 'msg') {
        file = file.slice(0, file.size, 'application/vnd.ms-outlook');
      }
    }

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

  abortUpload() {
    // Formiojs bug #4555 - After deleting a file, if the drag&drop area had been hidden, it
    // doesn't show after deleting.
    this.fileDropHidden = false;
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
