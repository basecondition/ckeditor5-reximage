/**
 * @module RexImage/RexImage
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import type ImageUtils from '@ckeditor/ckeditor5-image/src/imageutils';

export default class RexImage extends Plugin {
	public static get pluginName(): 'RexImage' {
		return 'RexImage';
	}

	public init(): void {
		let mediaTypes = 'jpg,jpeg,png,gif,bmp,tiff,svg,webp,heic,heif';
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const configMediaManagerType: string = this.editor.config.get( 'image.rexmedia_manager_type' );
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const configMediaCategory: string = this.editor.config.get( 'image.rexmedia_category' );
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const configMediaTypes: string = this.editor.config.get( 'image.rexmedia_types' );
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const configMediaPath: string = this.editor.config.get( 'image.rexmedia_path' );
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const imageUtils: ImageUtils = this.editor.plugins.get( 'ImageUtils' );

		// Setup `media` button
		this.editor.ui.componentFactory.add( 'rexImage', locale => {
			const button = new ButtonView( locale );

			button.set( {
				label: 'Media image',
				icon: imageIcon,
				tooltip: true
			} );

			button.on( 'execute', () => {
				let query = '&args[types]=' + mediaTypes;

				if ( typeof configMediaTypes !== 'undefined' ) {
					query = '&args[types]=' + configMediaTypes;
				}
				if ( typeof configMediaCategory !== 'undefined' ) {
					query = query + '&rex_file_category=' + configMediaCategory;
				}

				console.log(query);

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const mediaPool = openREXMedia( 'cke5_medialink', query );
				let mediaPath = '/index.php?rex_media_type=' + configMediaManagerType + '&rex_media_file=';

				if ( typeof configMediaManagerType === 'undefined' ) {
					if ( typeof configMediaPath === 'undefined' ) {
						mediaPath = '/media/';
					} else {
						mediaPath = configMediaPath;
					}
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$( mediaPool ).on( 'rex:selectMedia', ( event: any, filename: string ) => {
					event.preventDefault();
					mediaPool.close();

					const selectedElement = this.editor.model.document.selection.getSelectedElement()!;

					if ( imageUtils.isImage( selectedElement ) ) {
						this.editor.execute( 'replaceImageSource', { source: mediaPath + filename } );
					} else {
						this.editor.execute( 'insertImage', { source: mediaPath + filename } );
					}
				} );
			} );

			return button;
		} );
	}
}
