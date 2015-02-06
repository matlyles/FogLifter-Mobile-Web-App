// DATABASE FUNCTIONS //
try {
    if (!window.openDatabase) {
        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
    } else {
        var shortName = 'fogLifterApp';
        var version = '1.0';
        var displayName = 'fogLifterApp';
        var maxSize = 1000000; // in bytes
        hashTaggerApp = openDatabase(shortName, version, displayName, maxSize);
		// create tables
		createFavoritesTable();
		createQueueTable();
    }
} catch(e) {
    if (e == 2) {
        // Version mismatch.
        console.log("Invalid database version.");
    } else {
        console.log("Unknown error "+ e +".");
    }
 
}
/*######################################################################
################### Setup App Tables #################################*/

function createFavoritesTable() {
	hashTaggerApp.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS favorites(id INTEGER NOT NULL PRIMARY KEY, vid TEXT NOT NULL);', [], nullDataHandler, errorHandler);        
		}
    );
}

function createQueueTable() {
	hashTaggerApp.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS queue(id INTEGER NOT NULL PRIMARY KEY, vid TEXT NOT NULL);', [], nullDataHandler, errorHandler);        
		}
    );
}


/*#########################################################################################
################### Handle Favorites: Add, Fetch, Delete #################################*/

function addFavorite(id){
	hashTaggerApp.transaction(
	    function (transaction) {	
			transaction.executeSql("INSERT INTO favorites(vid) VALUES (?)", [id]);

	    }
	);
}

function selectAllFavorites(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM favorites;", [], populateFavorites, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function populateFavorites(transaction, results){
	$('#favoriteslist').empty();
	//alert(results.rows.length);
    for (var i=0; i<results.rows.length; i++) {
        //alert(i);
    	var row = results.rows.item(i);
 		var favorite = new Object();
    	
    	favorite.id   = row['vid'];
        //alert(favorite.id)
		
		}// end for loop

}

function removeFavorite(id){
	hashTaggerApp.transaction(
	    function (transaction) {
			transaction.executeSql("DELETE FROM favorites WHERE vid=?", [id]);
			 selectAllFavoriteStates();
			var favCount = $('.favorites-content-container ul.thumbs li').length -1;
			//alert(favCount);
			if(favCount == 0) {
				$('.favorites-content-container').html('\
				<div class="placer icon">C</div>\
				<h1>You don\'t have any favorites.</h1>\
				');
			}
	    }
	);
}

function selectAllFavoriteStates(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM favorites;", [], populateFavoriteStates, errorHandler);
				//alert('selected favorites');
	    }
	);	
}



function populateFavoriteStates(transaction, results){

    for (var i=0; i<results.rows.length; i++) {
        //alert(i);
    	var row = results.rows.item(i);
 		var favorite = new Object();
    	
    	favorite.id   = row['vid'];
		$('a.add-to-favorites[rel="'+favorite.id+'"]').addClass('in-fav').html('<span class="icon">L</span> IN FAVORITES');
        //alert(favorite.id)
		
    }// end for loop
}

/*#########################################################################################
################### Handle Queue: Add, Fetch, Delete #################################*/

function addQueue(id){
	hashTaggerApp.transaction(
	    function (transaction) {	
			transaction.executeSql("INSERT INTO queue(vid) VALUES (?)", [id]);
		checkQueueCount();

	    }
	);
}

function selectAllQueue(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM queue;", [], populateQueue, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function populateQueueStates(transaction, results){
	$('').empty();
	//alert(results.rows.length);
    for (var i=0; i<results.rows.length; i++) {
        //alert(i);
    	var row = results.rows.item(i);
 		var favorite = new Object();
    	
    	favorite.id   = row['vid'];
    }
}

function loadQueue(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM queue;", [], populateQueueList, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function populateQueueList(transaction, results){
	if (results.rows.length != 0) {
		$('.queue-content-container').empty();
		$('.queue-content-container').html('\
					<ul class="thumbs slide inqueue">\
					</ul>');
		
		for (var i=0; i<results.rows.length; i++) {
	        //alert(i);
	    	var row = results.rows.item(i);
	 		var queue = new Object();

	    	queue.id   = row['vid'];
		
	        appendQueue(queue.id);

	    }// end for loop
	}

}
function loadFavorites(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM favorites;", [], populateFavoritesList, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function populateFavoritesList(transaction, results){
	if (results.rows.length != 0) {
		$('.favorites-content-container').empty();
		$('.favorites-content-container').html('\
					<ul class="thumbs slide infavs">\
					</ul>');
		
		for (var i=0; i<results.rows.length; i++) {
	        //alert(i);
	    	var row = results.rows.item(i);
	 		var favorite = new Object();

	    	favorite.id   = row['vid'];
		
	        appendFavorites(favorite.id);

	    }// end for loop
	}
}

function checkQueueCount(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM queue;", [], createQueueConter, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function createQueueConter(transaction, results){

	var count = results.rows.length;
	if(count != 0) {
		$('span.counter').html('<strong>'+count+'</strong>').show();
	} else if(count == 0) {
		$('span.counter').html('').hide();
		$('a.add-to-queue').removeClass('in-queue').html('<span class="icon">I</span> ADD TO QUEUE');
		$('.queue-content-container').html('\
			<div class="placer icon">B</div>\
			<h1>You don\'t have any videos in your queue.</h1>\
		');
	}

}

function removeQueue(id){
	hashTaggerApp.transaction(
	    function (transaction) {
			transaction.executeSql("DELETE FROM queue WHERE vid=?", [id]);
			checkQueueCount();
			selectAllQueueStates();
	    }
	);
}


function selectAllQueueStates(){ 
	hashTaggerApp.transaction(
	    function (transaction) {
				transaction.executeSql("SELECT * FROM queue;", [], populateQueueStates, errorHandler);
				//alert('selected favorites');
	    }
	);	
}

function populateQueueStates(transaction, results){

    for (var i=0; i<results.rows.length; i++) {
        //alert(i);
    	var row = results.rows.item(i);
 		var favorite = new Object();
    	
    	favorite.id   = row['vid'];
		$('a.add-to-queue[rel="'+favorite.id+'"]').addClass('in-queue').html('<span class="icon">I</span> IN QUEUE');
        //alert(favorite.id)
		
    }// end for loop
}


//// default stuff ////
function nullDataHandler(){
	//console.log("SQL Query Succeeded");
}

function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}