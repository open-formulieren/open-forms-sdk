import { Formio } from 'react-formio';

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

  get browseOptions() {
    // This code is copied from https://github.com/formio/formio.js/blob/v4.13.0/src/components/file/File.js#L281-L304
    // Since we are using FormIO v4.12.7 only image based files are supported
    // If are are using v4.13.x or higher this can probably be deleted

    const options = {};

    if (this.component.multiple) {
      options.multiple = true;
    }
    //use "accept" attribute only for desktop devices because of its limited support by mobile browsers
    if (!this.isMobile.any) {
      const filePattern = this.component.filePattern.trim() || '';
      const imagesPattern = 'image/*';

      if (this.imageUpload && (!filePattern || filePattern === '*')) {
        options.accept = imagesPattern;
      } else if (this.imageUpload && !filePattern.includes(imagesPattern)) {
        options.accept = `${imagesPattern},${filePattern}`;
      } else {
        options.accept = filePattern;
      }
    }

    return options;
  }

  upload(files) {
    if (this.component.multiple && this.component.maxNumberOfFiles) {
      // this.data.file contains files that may have already been uploaded, while the argument 'files' gives the
      // files that are being uploaded in this call
      if (files.length > this.component.maxNumberOfFiles || this.data?.file?.length >= this.component.maxNumberOfFiles) {
        const messages = [
          {
            message: this.t(
              'Too many files added. The maximum allowed number of files is {{ maxNumber }}.',
              { maxNumber: this.component.maxNumberOfFiles }
            ),
            level: 'error',
          }
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

  checkComponentValidity(data, dirty, row, options = {}){
    if (this.loading) {
      // This prevents the FormStep from being submitted before the file upload is finished.
      // Once the upload is finished, the logic check will be performed and will re-enable the submit button
      const messages = [
          {
            message: this.t(
              'Please wait for the file(s) upload to finish before continuing.',
            ),
            level: 'error',
          }
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
    // Instead of polluting our global configuratio with a non-sense URL (which also
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


export default FileField;
