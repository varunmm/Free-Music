$(".footer").hide();

$("#main").click(function() {
    $("#main").animate({
      marginLeft: "-20px"
    }, {
      duration: 1000,
      specialEasing: {
        width: "linear",
        height: "easeOutBounce"
      },
      complete: function() {
        $("#main").animate({
          marginLeft: "40px"
        },1000);
    }
  });
});



var storedValues = localStorage.getItem("genres");

var arrayOfGenre;

if(storedValues == null){
  arrayOfGenre = ["Rock", "Pop", "Classic", "Metal", "Jazz"];
  localStorage.setItem("genres",arrayOfGenre);
} else {
  arrayOfGenre = storedValues.split(",");
}

function deleteThisItem(item){
  var retVal = confirm("Are you sure you want to Delete - "+arrayOfGenre[item]);
  if(retVal == true){
    arrayOfGenre.splice(item,1);
    localStorage.setItem("genres",arrayOfGenre);
    updateUI();
    return true;
  } else {
    return false;
  }
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function addItem(){
  var playlistName = $("#playListName").val();
  if(containsObject(playlistName, arrayOfGenre)){
    alert("Playlist Already exists");
  } else {
    arrayOfGenre.push(playlistName);
    localStorage.setItem("genres",arrayOfGenre);
    updateUI();
    $("#addPlaylist").modal("hide");
  }
  
}

function addNewPlaylist(){
  $("#addPlaylist").modal();
}

updateUI();

function updateUI(){
  var html = "";
  $.each(arrayOfGenre, function( index, value ) {
  	html += '<li class="list-group-item">'+value+' <span class="btn-group pull-right"><button class="btn btn-success btn-sm edgeUp audioGenre" data-song-genre="'+value+'" >PLAY</button> <button class="btn btn-danger btn-sm edgeUp" onclick="deleteThisItem('+index+')">DELETE</button></span></li>';
  });

  $("#playList").html(html);

$(".audioGenre").click(function(){
    var genre = $(this).attr("data-song-genre");
    $.getJSON( "https://itunes.apple.com/search?term="+genre, function( data ) {
      var playing = 0;
      var allSongs = shuffle(data.results);
      displaySong(data.results[playing]);
        $(".footer").show();

        $('#my_audio').on('ended', function() {
          playing++;
          displaySong(data.results[playing]);
      });
    });
  });

}



function displaySong(song){
	$("#artist_song").html(song.trackName+"<br>"+song.artistName);
	
	var html = '<source src="'+song.previewUrl+'" type="audio/mp4">';
	$("#my_audio").html(html);
	$("#my_audio")[0].load();
	$("#my_audio")[0].play();

	
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}