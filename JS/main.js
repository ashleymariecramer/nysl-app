
$(function(){
	//goBack();
	setInitialPage();
	showNextPage();
});


/* function goBack(arr){
		$('#back_button').on('click', function(){
		var lastPage = window.history.back();
		$(".page").hide();
		$('lastPage').show();	
		
	});
} */

function loadMap(id){	
    $("#"+ id).append('<iframe src="https://www.google.com/maps/d/embed?mid=1q5qLNyhgmVQsisCQrJQKGSAgKzY&output=embed" width="100%" height="100%"></iframe>'); 
}

function setInitialPage(){
	$(".page").hide();
	//$("#home").show();
	$("#nextGames").show();
	loadMap("map3");
};

function showNextPage(){
		var allPages = ["home"];
		$("button").click(function(){	
			$(".page").hide();
			if (this.name != "back") {  // need to exclude back button as this should not go to '#back'
				var name = this.name;
				allPages.push(name);
				window.location.hash = name; // this adds the location hash to the url
				$('#' + name).show();
				if (name === "gameInfo") {
										loadMap("map1");
								}
				if (name === "locationInfo") {
										loadMap("map2");
								}
				if (name === "nextGames") {
										loadMap("map3");
								}
			} 
			else {
					var history = removeCurrentPageFromHistory(allPages);
				  var last = history.splice(-1);
					$('#' + last).show();
			}
		});
};


function removeCurrentPageFromHistory(allPages){
	var lastPage = '#' + allPages[allPages.length-1];
	var currentPage = window.location.hash;
	if (lastPage === currentPage){
		allPages.splice(-1);
	}
	var history = allPages;
	return history;
}

/*function goBack(history){
	var last = history.splice(-1)
	$('#' + last).show();
}
 */
