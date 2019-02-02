import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

/**
 * @extends module:core/plugin~Plugin
 */
export default class RexImageUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const doc = editor.document;
        const t = editor.t;
        const media_type = editor.config.get('rexImage.media_type');
        const media_path = editor.config.get('rexImage.media_path');

        // Setup `imageUpload` button.
        editor.ui.componentFactory.add('rexImage', locale => {
            const button = new ButtonView(locale);

            button.set({
                label: 'Media image',
                icon: imageIcon,
                tooltip: true
            });

            button.on('execute', () => {
                let mediaPool = openREXMedia('cke5_medialink', '&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg'),
                    mediaPath = 'index.php?rex_media_type=' + media_type + '&rex_media_file=';

                if (typeof media_type === 'undefined') {
                    if (typeof media_path === 'undefined') {
                        mediaPath = '../media/';
                    } else {
                        mediaPath = media_path;
                    }
                }

                const mediaSrcPath = (!typeof media_type === 'undefined') ? mediaManagerPath : mediaPath;

                $(mediaPool).on('rex:selectMedia', function (event, filename) {
                    event.preventDefault();
                    mediaPool.close();

                    editor.model.change(writer => {
                        const imageElement = writer.createElement('image', {
                            src: mediaSrcPath + filename
                        });

                        editor.model.insertContent(imageElement);

                        const paragraph = writer.createElement('paragraph');
                        const insertPosition = writer.createPositionAfter(imageElement);
                        writer.insert(paragraph, insertPosition);
                    });

                });

            });

            return button;

        });
    }
}
