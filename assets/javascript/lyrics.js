$('.dropdown-trigger').dropdown();

var setLyrics = {
    trackID: "",
    track:"",
    APIkey: "003b119f7901034749c7fd78d8ea9bfc",
    artist: sessionStorage.getItem("searchedTerm"),//"the strokes",
    getArtist: function () {
        if(sessionStorage.getItem("searchedTerm")){
        setLyrics.artist = sessionStorage.getItem("searchedTerm");
        setLyrics.artist = setLyrics.artist.replace(/ /g, "%20");
        }
        else{
            setLyrics.artist="justin timberlake";
        }
    },
    setSpace: function () {
        $(".youtube-container").css("position","relative");
        trackTitle=$("<h5>");
        trackTitle.appendTo(".lyrics");
        lyricsText=$("<p>");
        lyricsText.appendTo(".lyrics");
        youtubeLink=$("<a>").attr({"target":"_blank","rel":"noreferrer noopener"});
        youtubePlay=$("<img>").attr("src","../Bandifier/assets/images/youtubePlay.png").css({"position":"absolute","height":"20%","width":"25%","left":"38%","top":"45%"});
        youtubeVideo=$("<img>").css("width","100%");
        youtubeLink.appendTo(".youtube-container")
        youtubeVideo.appendTo(youtubeLink);
    },
    getTracks: function () {
        $.ajax({
            url: "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&page_size=40&q_artist=" + setLyrics.artist + "&apikey=" + setLyrics.APIkey,
            dataType: "jsonp",
            method: "GET",
        })
            .then(function (response) {
                var arr = response.message.body.track_list;
                console.log(arr);
                for (i = 0; i < arr.length; i++) {
                    if(arr[i].track.has_lyrics!=0){
                    var s = $("<span>").addClass("track");
                    var t = $("<li>");
                    s.appendTo(t);
                    t.appendTo(".tracks-dropdown");
                    s.text(arr[i].track.track_name).appendTo(s);
                    };
                }
            })
    },
    getLyrics: function () {

        $(".tracks-dropdown").on("click", "span", function () {
            var track = $(this).text();
            setLyrics.track=track;
            // track = track.replace(/ /g, "%20");
            track = encodeURI(track)
            console.log(track);
            var trackUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=" + track + "&quorum_factor=1&apikey=" + setLyrics.APIkey;
            $.ajax({
                url: trackUrl,
                dataType: "jsonp",
                method: "GET",

            })
                .then(function (response) {

                    setLyrics.trackID = response.message.body.track_list[0].track.track_id;
                })
                .then(function () {
                    url2 = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=" + setLyrics.trackID + "&apikey=" + setLyrics.APIkey;

                    $.ajax({
                        url: url2,
                        method: "GET",
                        dataType: "jsonp"
                    })
                        .then(function (response) {
                            var str = response.message.body.lyrics.lyrics_body;
                            if(str){
                            str = str.substring(0, str.length - "******* This Lyrics is NOT for Commercial use ******* (1409617737497)".length)
                            trackTitle.text(decodeURI(track));
                            lyricsText.text(str);
                            }
                            else{
                                lyricsText.text("Protected by Copyright");
                            }
                        })
                })
                .then(function(){
                    var query=setLyrics.track;
                    var APIkey="AIzaSyB5lIeHvKSoj0JCXpVRpfwrz0WKP0vYhKc";
                    queryURL="https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&q="+encodeURI(query+" "+setLyrics.artist)+"&videoSyndicated=true&key="+APIkey;
                    console.log(query+" "+setLyrics.artist);
                    $.ajax({
                        method:"GET",
                        url:queryURL,
                    }).then(function(response){
                        console.log(response);
                        console.log(response.items[0].snippet.thumbnails.default.url);
                        youtubeVideo.attr("src",response.items[0].snippet.thumbnails.default.url);
                        youtubeLink.attr("href","https://www.youtube.com/watch?v="+response.items[0].id.videoId+"&feature=player_embedded");
                        youtubePlay.appendTo(youtubeLink);
                    });

                })
        });
    }
}

//run function
setLyrics.setSpace();
setLyrics.getArtist();
setLyrics.getTracks();
setLyrics.getLyrics();
