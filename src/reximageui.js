import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import { isImageType, findOptimalInsertionPosition } from '@ckeditor/ckeditor5-image/src/imageupload/utils';

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

        // Setup `imageUpload` button.
        editor.ui.componentFactory.add( 'rexImage', locale => {
            const button = new ButtonView( locale );

            button.set( {
                label: 'Media image' ,
                icon: imageIcon,
                tooltip: true
            } );

            button.on( 'execute', () => {
                const insertAt = findOptimalInsertionPosition( editor.model.document.selection );
                var mediaPool = openREXMedia('cke5_medialink', '&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg');

                $(mediaPool).on('rex:selectMedia', function (event, filename) {
                    event.preventDefault();
                    mediaPool.close();

                    editor.model.change(writer => {

                        const imageElement = new ModelElement( 'image', {
                            src: "/media/" + filename
                        } );

                        let insertAtSelection;

                        if ( insertAt ) {
                            insertAtSelection = new ModelSelection( [ new ModelRange( insertAt ) ] );
                        } else {
                            insertAtSelection = doc.selection;
                        }

                        editor.model.insertContent( imageElement, insertAtSelection );

                        // Inserting an image might've failed due to schema regulations.
                        if ( imageElement.parent ) {
                            writer.setSelection( ModelRange.createOn( imageElement ) );
                        }
                    } );

                });

            } );

            return button;

        } );
    }
}
