import { Formio } from '@formio/react';

/**
 * Extend the default file field to modify it to our needs.
 */
class FileField extends Formio.Components.components.file {

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
}


export default FileField;
