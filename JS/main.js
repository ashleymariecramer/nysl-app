// Grouped functions 

$(function(){
	setInitialPage();
	showNextPage();
	//showLoggedOutViews();
	showLoggedInViews();
	
	
});


// Individual functions


function loadMap(id){	
    $("#"+ id).html('<iframe src="https://www.google.com/maps/d/embed?mid=1q5qLNyhgmVQsisCQrJQKGSAgKzY&output=embed" width="100%" height="100%"></iframe>'); 
}

function setInitialPage(){
	$(".page").hide();
	$("#home").show();
};

function showNextPage(){
		var allPages = ["home"];
		var name = "home";
		$("button").click(function(){	
			$(".page").hide();
			if (this.name != "back") {  // need to exclude back button as this should not go to '#back'
				var name = this.name;
				allPages.unshift(name);
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
			else {  //if no last page in history show the home page
					if (allPages[0] === "home") {
							$("#home").show();
					} 
					else{
						if (allPages[0] = window.location.hash){ //remove current page from allPages
							allPages.splice(0,1);
							}
						$('#' + allPages[0]).show(); //show last page
						allPages.splice(0,1); // remove last page
				}
			}
		});
};




function showLoggedInViews(){
		$('.loggedOut').hide();
		$('.loggedIn').show();
}

function showLoggedOutViews(){
		$('.loggedIn').hide();
		$('.loggedOut').show();
}


/* OLD CODE
// back buttom for multiple page websites
function goBack(arr){
		$('#back_button').on('click', function(){
		var lastPage = window.history.back();
		$(".page").hide();
		$('lastPage').show();	
		
	});
} 


/*function goBack(history){
	var last = history.splice(-1)
	$('#' + last).show();
}

*/
