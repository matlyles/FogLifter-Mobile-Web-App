
$(window).load(function(){
	
	setTimeout( function() {
	  $('.startup').remove();
		$('.homescreen-container').remove();
	}, 3000);
	


});

var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
var myDown = isIOS ? "touchstart" : "mousedown";
var myUp = isIOS ? "touchend" : "mouseup";

$(document).ready(function () {
	
	// Setup Web App
	var myVideo = _V_("#thevideo");
	selectAllQueueStates();
	selectAllFavoriteStates();
	checkQueueCount();
	getVideoCount();
	// end of s3
	
	$('.section').hide();
	$('.section#thumbs').show();
	
	// header navigation controls
	$('a.app-control').live(myDown, function(e) { 
		myVideo.pause();
		$('a.app-control').removeClass('on');
		$(this).addClass('on');
		var newSection = $(this).attr('rel');
		
		$('.section').hide();
		$(".section[id='"+newSection+"']").show();
		
		if(newSection == 'thumbs') {
			$('.sub-header').html('<h2 class="section-title">Video Categories</h2>');
			selectAllQueueStates();
		} else if(newSection == 'queue') {
			loadQueue();
			$('.sub-header').html('<h2 class="section-title">Your Queue</h2>');
			selectAllQueueStates();
		} else if(newSection == 'fav') {
				loadFavorites();
				$('.sub-header').html('<h2 class="section-title">Your Favorites</h2>');
				selectAllQueueStates();
			}
		
	});
	
	$('a.prev-link').live(myDown, function(e) { 
		myVideo.pause();
		$('.section').hide();
		$('.video-info').empty();
		
		if($(this).hasClass('go-thumbs')) {
			$('.section.all-thumbs').show();
		
		} else if($(this).hasClass('go-queue')) {
			$('.section.my-queue').show();
		} else if($(this).hasClass('go-favs')) {
			$('.section.my-favs').show();
		}
		$('.sub-header').html('<h2 class="section-title">'+localStorage.getItem('prev')+'</h2>');
		
	});
	
	// Video tumbnail link
	$('a.video-link').live(myDown, function(e) { 
			localStorage.setItem('vidstate', '1');
			if($(this).attr('title') == 'categories') {
				localStorage.setItem('prev', 'Video Categories');
				localStorage.setItem('goto', 'go-thumbs');
				//alert('categories');
			} else if( $(this).attr('title') == 'queue') {
				localStorage.setItem('prev', 'Your Queue');
				localStorage.setItem('goto', 'go-queue');
				//alert('Queue');
			}
			 else if( $(this).attr('title') == 'fav') {
				localStorage.setItem('prev', 'Your Favorites');
				localStorage.setItem('goto', 'go-favs');
				//alert('Queue');
			}
			var vidID = $(this).attr('id');
			var catID = $(this).attr('rel');
			$('.section').hide();
			getVideo(vidID, catID);
	});
	
	// handle adding to favorites
	$('a.add-to-queue').live(myDown, function(e) { 
			var vid = $(this).attr('rel');
			var container = $(this).parent().parent().parent().parent();
			var removeObj = $(this).parent().parent();
			if ($(this).hasClass('action')) {
				$(this).html($(this).html() == '<span class="icon">K</span> IN QUEUE' ? '<span class="icon">K</span> ADD TO QUEUE' : '<span class="icon">I</span> IN QUEUE'); // <- HERE
			} else {
				$(this).html($(this).html() == '<span class="icon">I</span> IN QUEUE' ? '<span class="icon">I</span> ADD TO QUEUE' : '<span class="icon">I</span> IN QUEUE'); // <- HERE
			}
			 
				if($(this).hasClass('in-queue')) {
					$('a.add-to-queue[rel="'+vid+'"]').removeClass('in-queue').html('<span class="icon">I</span> ADD TO QUEUE');
					removeQueue(vid);
					if($(container).hasClass('queue-content-container')) {
						$(removeObj).addClass('remove-motion');
						setTimeout( function() {
							$(removeObj).remove();
						}, 200);
					}
					
				} else {
					$(this).addClass('in-queue');
					addQueue(vid);
				}
				return false;
	});
	
	$('a.add-to-favorites').live(myDown, function(e) { 
			var vid = $(this).attr('rel');
			 $(this).html($(this).html() == '<span class="icon">L</span> IN FAVORITES' ? '<span class="icon">L</span> ADD TO FAVORITES' : '<span class="icon">L</span> IN FAVORITES'); // <- HERE

				if($(this).hasClass('in-fav')) {
					$(this).removeClass('in-fav');
					removeFavorite(vid);
				} else {
					$(this).addClass('in-fav');
					addFavorite(vid);
				}
				return false;
	});
	
	$('a.share').live(myDown, function(e) {
		var thumb = $('img.vjs-poster').attr('src');
		var title = $('h1.video-title').text();
		var desc = $('.desc').text();
		var vid = $(this).attr("rel");
		//alert(thumb);
		$('body').prepend('<div class="share-overlay">\
			<div class="share-box">\
				<div class="title"><span class="icon">J</span> Share this Video <a class="cancel">Close</a></div>\
				<div class="share-info">\
					<img src="'+thumb+'" width="200">\
					<div class="info">\
						<h1>'+title+'</h1>\
						<p>'+desc+'</p>\
					</div>\
			</div>\
			<div class="share-tools">\
			<form class="email-share" id="contact-form" method="post">\
			<span class="error" style="display:none"> Please Enter Valid Data</span>\
			<span class="success" style="display:none"> Successfully Sent!</span>\
				<input type="text" id="fullname" placeholder="Your Full Name" />\
				<input type="text" id="email" placeholder="Recipeints Email" />\
				<a class="submit share-btn" rel="'+vid+'">Send Email</a>\
			</form>\
			<div class="social-icons">\
				<a class="facebook" href="http://www.facebook.com/sharer.php?u=www.mathewlyles.com/work/foglifter/ipadapp2/share.html?v='+vid+'&t='+title+'" class="facebook">Share on Facebook</a>\
				<a target="_blank" href="http://twitter.com/home?status=Check out FogLifter Video: '+title+', www.mathewlyles.com/work/foglifter/ipadapp2/share.html?v='+vid+'" class="twitter" title="Share on Twitter">Share on Twitter</a>\
			</div>\
			</div>\
		</div>');
		$('.share-overlay').addClass('start');
	});
	
	$('a.cancel').live(myDown, function(e) {
		$('.share-overlay').remove();
	});
	
	$("a.submit").live(myDown, function(e) { 
		
		var vtitle = $('h1.video-title').text();
		var desc = $('.desc').text();
		var vid = $(this).attr("rel");
		
		var from = $("#fullname").val();
		var email_to = $("#email").val();

		var dataString = 'from='+ from + '&email_to=' + email_to + '&vid=' + vid + '&vtitle=' + vtitle +'';

		if(from=='' || email_to=='' || vid=='' || vtitle=='')
		{
			$('.success').fadeOut(200).hide();
			$('.error').fadeOut(200).show();
		}
		else
		{
			$.ajax({
				type: "POST",
				url: "scripts/process-share.php",
				data: dataString,
				success: function(data){
					$('.success').fadeIn(200).show().text(data);
					$('.error').fadeOut(200).hide();
					$("#fullname").val('');
					$("#email").val('');
				}
			});
		}
		return false;
	});
	
});
	
// functions
function showHomescreenPanel() {
	setTimeout( function() {
		$('.homescreen-container').addClass('homescreen-in');
	}, 2000);
	setTimeout( function() {
		$('.homescreen-container').addClass('homescreen-out');
	}, 8000);
}

function getVideo(vidID, catID) {
	$('.video-info').empty();
	$.ajax({
		type: "GET",
		   url: "videos.xml",
		   dataType: "xml",
		   success: function(xml){
			$("ul.video-cat").hide();
			// show thumbs
			$("ul.video-cat[id='"+catID+"']").show();

				$(xml).find("video[id='"+vidID+"']").each(function() {
					
					var vID = $(this).attr("id");
					$('.vjs-poster').attr('src', 'video-thumbs/posters/'+$(this).attr("poster"));
					
					$('.vjs-tech').attr('src', $(this).attr("url"));
					
					$('.sub-header').html('<a class="prev-link '+localStorage.getItem('goto')+'">'+localStorage.getItem('prev')+'</a> <h2 class="section-title"> / '+$(this).attr("title")+'</h2>')
					$('.section#video-page').show();
				
					var info = '\
								<h1 class="video-title">'+$(this).attr("title")+'</h1>\
									<div class="desc">'+$(this).attr("desc")+'</div>\
									<ul class="video-actions">\
										<li class=""><a class="action queue add-to-queue" rel="'+$(this).attr("id")+'"><span class="icon">I</span> ADD TO QUEUE</a></li>\
										<li><a class="action favorites add-to-favorites" rel="'+$(this).attr("id")+'"><span class="icon">L</span> ADD TO FAVORITES</a></li>\
										<li class=""><a class="action share" rel="'+$(this).attr("id")+'"><span class="icon">J</span> SHARE THIS VIDEO</a></li>\
									</ul>';				
					
								$('.video-info').prepend(info);
								localStorage.setItem('currentSection', 'video');
								
								setTimeout( function() {
									selectAllQueueStates();
									selectAllFavoriteStates();
								}, 100);
								//var state = localStorage.getItem('vidstate');
								
								// ADD LATER
									// <ul class="ratings">\
									// 									<li class=""><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating" rel="1">F</a></li>\
									// 								</ul>\
								
				}); // end xml for each function
				
			}
	});	// end ajax call function
	
}

function getSharedVideo(vidID, catID) {
	$('.video-info').empty();
	$.ajax({
		type: "GET",
		   url: "videos.xml",
		   dataType: "xml",
		   success: function(xml){
			$("ul.video-cat").hide();
			// show thumbs
			$("ul.video-cat[id='"+catID+"']").show();

				$(xml).find("video[id='"+vidID+"']").each(function() {
					
					var vID = $(this).attr("id");
					$('.vjs-poster').attr('src', 'video-thumbs/posters/'+$(this).attr("poster"));
					
					$('.vjs-tech').attr('src', $(this).attr("url"));
					
					//$('.sub-header').html('<a class="prev-link '+localStorage.getItem('goto')+'">'+localStorage.getItem('prev')+'</a> <h2 class="section-title"> / '+$(this).attr("title")+'</h2>')
					$('.section#video-page').show();
				
					var info = '\
								<h1 class="video-title">'+$(this).attr("title")+'</h1>\
									<div class="desc">'+$(this).attr("desc")+'</div>';				
					
								$('.video-info').prepend(info);
								localStorage.setItem('currentSection', 'video');
								
								setTimeout( function() {
									selectAllQueueStates();
									selectAllFavoriteStates();
								}, 100);
								//var state = localStorage.getItem('vidstate');
								
								// ADD LATER
									// <ul class="ratings">\
									// 									<li class=""><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating full" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating" rel="1">F</a></li>\
									// 									<li><a href="" class="icon rating" rel="1">F</a></li>\
									// 								</ul>\
								
				}); // end xml for each function
				
			}
	});	// end ajax call function
	
}

function appendQueue(vid) {
	$.ajax({
		type: "GET",
		   url: "videos.xml",
		   dataType: "xml",
		   success: function(xml){
				
				$(xml).find("video[id='"+vid+"']").each(function() {
					
					var vID = $(this).attr("id");
					var catID = $(this).attr("catid");

					var video = '\
									<li>\
										<a id="'+$(this).attr("id")+'" rel="'+catID+'" class="video-link queue" title="queue">\
											<div class="title">'+$(this).attr("title")+'</div>\
											<img src="video-thumbs/thumbs/'+$(this).attr("thumb")+'" alt="01" class="thumb-img" />\
										</a>\
											<div class="mini-actions">\
												<a class="add-to-queue" rel="'+$(this).attr("id")+'"><span class="icon">I</span> ADD TO QUEUE</a>\
											</div>\
									</li>';
													
							$('ul.thumbs.inqueue').prepend(video);
				});
				selectAllQueueStates();
				
			}
	});
}


function appendFavorites(vid) {
	$.ajax({
		type: "GET",
		   url: "videos.xml",
		   dataType: "xml",
		   success: function(xml){
				
				$(xml).find("video[id='"+vid+"']").each(function() {
					
					var vID = $(this).attr("id");
					var catID = $(this).attr("catid");

					var video = '\
									<li>\
										<a id="'+$(this).attr("id")+'" rel="'+catID+'" class="video-link queue" title="fav">\
											<div class="title">'+$(this).attr("title")+'</div>\
											<img src="video-thumbs/thumbs/'+$(this).attr("thumb")+'" alt="01" class="thumb-img" />\
										</a>\
											<div class="mini-actions">\
												<a class="add-to-queue" rel="'+$(this).attr("id")+'"><span class="icon">I</span> ADD TO QUEUE</a>\
											</div>\
									</li>';
													
							$('ul.thumbs.infavs').prepend(video);
				});
				selectAllQueueStates();
				
			}
	});
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getVideoCount() {
	
	$('#thelist > li').each(function() {
		var count = $('.thumbs-slider ul.slide li',this).length;
		$(this).find('.videos-label').html(count+' VIDEOS <span class="icon">G</span>');
		//$(this).parent().find('.videos-label').text('home');
	});
}
