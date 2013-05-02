var GifBabble = {
	gifs: null,
	meta: null,

	gifsElementId: '#animated-gifs',
	featuredGifElementId: '#featured-animated-gif',
	
	apiUrl: 'http://www.gifbabble.com/api/gif/item/',
	apiAuthHeader: {'key': 'AGIF_KEY', 'value': 'grevory:796a05cf85db65c97ab854d1487a1cb976be1325'},

	getGifsFromApi: function(){
		$.ajax({
			type: "GET",
			url: GifBabble.apiUrl,
			beforeSend: function (xhr) { if (!!GifBabble.apiAuthHeader) xhr.setRequestHeader (GifBabble.apiAuthHeader.key, GifBabble.apiAuthHeader.value); }
		})
		.success(function (data){
			GifBabble.gifs = data.objects;
			GifBabble.meta = data.meta;
			
			GifBabble.addGifsToDom();
			GifBabble.addListenersToGifs();
		});
	},

	getGifById: function(id){
		var gifObj = null;
		if (!!GifBabble.gifs) {
			$.each(GifBabble.gifs, function(i,gif){
				if (gif.id == id) {
					gifObj = gif;
					return false;
				}
			});
		}
		return gifObj;
	},

	addGifsToDom: function(){
		if (!!GifBabble.gifs) {
			$.each(GifBabble.gifs, function(i,gif){
				if (i<12) {
					$(GifBabble.gifsElementId).append('<img src="'+gif.thumb+'" data-id="'+gif.id+'" alt="'+gif.caption+'">');
				}
			});
		}
	},

	addListenersToGifs: function(){
		$(GifBabble.gifsElementId+' img').hover(
			function (){
				// On hover show the animation (first we need to find it)
				var gifId = $(this).attr('data-id');
				var gif = GifBabble.getGifById(gifId);
				if (!!gif) {
					$(this).attr('src',gif.link);
				}
			},
			function (){
				// Mouseout revent back to static thumbnail
				var gifId = $(this).attr('data-id');
				var gif = GifBabble.getGifById(gifId);
				if (!!gif) {
					$(this).attr('src',gif.thumb);
				}
			}
		);

		$(GifBabble.gifsElementId+' img').click(function(){
			GifBabble.showFeaturedImage($(this).attr('data-id'));
		});
	},

	showFeaturedImage: function(id){
		if (!id) return;
		
		var gif = GifBabble.getGifById(id);
		console.log(gif.link, gif.caption);
		$(GifBabble.featuredGifElementId+' img').attr('src',gif.link).attr('alt',gif.caption);
		$(GifBabble.featuredGifElementId+' figcaption').text(gif.caption);
		$(GifBabble.featuredGifElementId+' input').val(gif.link);
		GifBabble.highlightText('featured-gif-url');

		$(GifBabble.gifsElementId).slideUp();
		$(GifBabble.featuredGifElementId).slideDown();
	}, 

	// Scored from http://stackoverflow.com/a/987376
	highlightText: function(element){
		var text = document.getElementById(element);
		var selection = window.getSelection();
		selection.setBaseAndExtent(text, 0, text, 1);
	}
};

GifBabble.getGifsFromApi();
