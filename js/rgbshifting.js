(function ( $ ) {

	$.fn.rgbshifting = function( _options ) {

		this.options = $.extend({
			// These are the defaults.
			image: false,
			mode: "horizontal",
			radius: '1.25%'
		}, _options );

		if(this.options.image == false)
			return this;

		if(typeof this.options.image == 'string')
		{
			this.imageObj = new Image();
			var _self = this;
			this.imageObj.onload = function() {
				_self.drawImage();
			};
			this.imageObj.src = this.options.image;
		}
		else
		{
			this.imageObj = this.options.image;
			this.drawImage();
		}

		this.drawImage = function(){
			var canvas = this.get(0);
			var context = canvas.getContext('2d');
			var imageX = 0;
			var imageY = 0;
			var imageWidth = this.imageObj.width;
			var imageHeight = this.imageObj.height;

			// check if radius is percentage and convert it to pixels
			if(typeof this.options.radius == 'string')
			{
				var radius_chars = this.options.radius.split('');
				if(radius_chars[radius_chars.length - 1] == '%')
				{
					this.options.radius = this.options.radius.replace('%','') / 1;
					if(this.options.mode == 'horizental')
						this.options.radius = parseInt(imageWidth * this.options.radius / 100);
					else
						this.options.radius = parseInt(imageHeight * this.options.radius / 100);
				}
			}

			canvas.setAttribute('width', imageWidth);
			canvas.setAttribute('height', imageHeight);

			context.drawImage(this.imageObj, imageX, imageY, this.imageObj.width, this.imageObj.height, 0 , 0, imageWidth, imageHeight);

			var Original 		= context.getImageData(imageX, imageY, imageWidth, imageHeight);
			var OriginalData 	= Original.data;
			var PlusData		= new Array();
			var MinusData		= new Array();

			for(var y = 0; y < imageHeight; y++) {
				for(var x = 0; x < imageWidth; x++) {
					var index 		= ((imageWidth * y) + x ) * 4;

					if(this.options.mode == 'horizontal')
					{
						var PlusIndex	= ((imageWidth * y) + (x + this.options.radius)) * 4;
						var MinusIndex	= ((imageWidth * y) + (x + this.options.radius * -1)) * 4;
					}
					else
					{
						var PlusIndex	= ((imageWidth * (y + this.options.radius)    ) + x) * 4;
						var MinusIndex	= ((imageWidth * (y+ this.options.radius * -1)) + x) * 4;
					}

					PlusData[PlusIndex]		= OriginalData[index];
					PlusData[PlusIndex + 1]	= OriginalData[index + 1];
					PlusData[PlusIndex + 2]	= OriginalData[index + 2];
					PlusData[PlusIndex + 3]	= OriginalData[index + 3];

					MinusData[MinusIndex]		= OriginalData[index];
					MinusData[MinusIndex + 1]	= OriginalData[index + 1];
					MinusData[MinusIndex + 2]	= OriginalData[index + 2];
					MinusData[MinusIndex + 3]	= OriginalData[index + 3];
				}
			}

			for(var i = 0, n = OriginalData.length; i < n; i += 4) {
				if(typeof PlusData[i] != 'undefined')
				{
					OriginalData[i] 	= PlusData[i];
					OriginalData[i + 1] = PlusData[i + 1] * 0.5 + OriginalData[i + 1] * 0.5;
					OriginalData[i + 2] = PlusData[i + 2];
				}

				if(typeof MinusData[i] != 'undefined')
				{
					OriginalData[i] 	= MinusData[i] * 0.5 + OriginalData[i] * 0.5;
					OriginalData[i + 1] = OriginalData[i + 1];
					OriginalData[i + 2] = MinusData[i + 2];
				}

				OriginalData[i + 3] = 255;
			}

			// draw the new image with the modified image data
			context.putImageData(Original, imageX, imageY);
			return true;
		};

		return this;

	};

}( jQuery ));
