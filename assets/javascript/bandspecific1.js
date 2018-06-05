
var searchTerm = sessionStorage.getItem("searchedTerm");
var localPageID;
var localToken;
var localSections;
// var elems = document.querySelectorAll('.modal');
// var instances = M.Modal.init(elems, onOpenStart(buildCollapsible()));//, options);

$(".info-container").on("click", ".modal-trigger", function(event){
    console.log("model-trigger");
    var elems = document.querySelectorAll('.modal');
    var options = {onOpenStart:buildCollapsible(localSections)};
    var instances = M.Modal.init(elems, options);
});


const clientID='fe8362d03fae494c914dbed629a6f9f8';
     let player,token;
     var accountUrl='https://accounts.spotify.com/authorize?client_id='+clientID+'&redirect_uri=http:%2F%2Fwww.touchcatdigital.ca&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-birthdate%20user-read-currently-playing&response_type=token&state=123';
     window.onSpotifyWebPlaybackSDKReady = () => {
     window.addEventListener("message", receiveMessage, false);
     var authWindow = window.open(accountUrl, '_blank');
    //  console.log(authWindow);
       if (authWindow) {
         authWindow.focus();
       }

       function receiveMessage(event){
        //  console.log(event);
         var msg=event.data;
         if(typeof msg==='string'){
           var parseArray=msg.split('&');
           token=parseArray[0].split('=')[1];
            authWindow.close();
             player = new Spotify.Player({
               name: 'Bandifier',
               getOAuthToken: cb => { cb(token); }
             });
             searchItUp();
            }



        }

 }
if (!searchTerm){
    console.log("No Search Term, setting default to Strokes");
    searchTerm="The Strokes";
}

// if (window.location.href.match('car-driving.html') != null) {
// searchItUp();
// }

$("#btnMain").on("click", function (event){
    event.preventDefault();
    searchTerm = $("#search-input").val();
    sessionStorage.setItem("searchedTerm", searchTerm);
    $("#search-input").val("");
    location.href='bandspecific1.html';
    // console.log('BUTTON MAIN CLICK');
    searchItUp();
})
$("#searchagain").on("submit", function(event){
    event.preventDefault();
    searchTerm = $("#search-input").val();
    sessionStorage.setItem("searchedTerm", searchTerm);
    $("#search-input").val("");
    $(".youtube-container").empty();
    $(".info-container").empty();
    $(".spotify-container").empty();
    searchItUp();
    console.log("SUBMISSION!");
})

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
        $(".lyrics").empty();
        $(".tracks-dropdown").empty();
        $('.dropdown-trigger').dropdown();
        trackTitle=$("<h5>");
        trackTitle.appendTo(".lyrics");
        lyricsText=$("<p>");
        lyricsText.appendTo(".lyrics");
        
        youtubeLink=$("<a>").attr({"target":"_blank","rel":"noreferrer noopener"});
        youtubePlay=$("<img>").attr("src","../Bandifier/assets/images/youtubePlay.png").css({"position":"absolute","height":"20%","width":"25%","left":"38%","top":"45%"});
        youtubeVideo=$("<img>").css("width","100%");
        youtubeLink.appendTo(".youtube-container");
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


function searchItUp (){
    setLyrics.setSpace();
    setLyrics.getArtist();
    setLyrics.getTracks();
    setLyrics.getLyrics();
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            list: 'search',
            srsearch: searchTerm,
            format: 'json',
            generator: 'search',
            //parameters for generator
            gsrsearch: searchTerm,
            gsrnamespace: 0,
            gsrlimit: 10,
            origin: "*",
            prop: 'extracts|pageimages',
            //parameters for extracts
            exchars: 1200,
            exlimit: 'max',
            exintro: true,

            //parameters for pageimages
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 200
        },
        dataType: 'jsonp',
        success: processResult
    }).then(function (resp) {
        
    });

    // const hash = window.location.hash
    // .substring(1)
    // .split('&')
    // .reduce(function (initial, item) {
    //     if (item) {
    //         var parts = item.split('=');
    //         initial[parts[0]] = decodeURIComponent(parts[1]);
    //     }
    //     return initial;
    //         }, {});
    //     window.location.hash = '';

    //     // Set token
    //     let _token = hash.access_token;
    //     localToken = _token;
    //     const authEndpoint = 'https://accounts.spotify.com/authorize';

    //     // Replace with your app's client ID, redirect URI and desired scopes
    //     const clientId = 'fe8362d03fae494c914dbed629a6f9f8';
    //     const redirectUri = 'https://rudenik.github.io/Bandifier/bandspecific1.html';
    //     const scopes = [
    //         // 'user-top-read'
    //     ];

    //     // If there is no token, redirect to Spotify authorization
    //     if (!_token) {
    //         window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
    //         localToken = _token;
    //     }
        searchTerm = encodeURI(searchTerm);
        console.log(searchTerm);
        $.ajax({
            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=artist&market=CA",
            type: "GET",
            headers:{
                "Authorization":'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                console.log(data)
                console.log(data.artists.items[0].id);
            
                if (window.location.href.match('bandspecific1.html') != null) {
                getTopTracks(data.artists.items[0].id);
                }
            }
        });
    }
    
function getTopTracks(artistID){
    
$.ajax({
    url: "https://api.spotify.com/v1/artists/"+artistID+"/top-tracks?country=CA&limit=5",
    type: "GET",
    headers:{
        "Authorization":'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    success: function(response){
        console.log(response);
        if (response.tracks.length > 7){
            for (i=0; i<10; i++){ //Here's where to specify how many tracks to put up
                var sURI = "https://embed.spotify.com/?uri="+response.tracks[i].uri;
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", sURI);
                    trackiFrame.appendTo(trackDiv);
                    trackDiv.appendTo(".spotify-container");
            }
        }else{
        for (track in response.tracks){
                    var sURI = "https://embed.spotify.com/?uri="+response.tracks[track].uri;
                    var trackDiv = $("<div>");
                    trackDiv.addClass("spotify-embed");
                    var trackiFrame = $("<iframe>");
                    trackiFrame.attr("src", sURI);
                    trackiFrame.appendTo(trackDiv);
                    trackDiv.appendTo(".spotify-container");
                }
            }
    }
});
};

function processResult(apiResult) {    
    console.log(apiResult);
    localPageID = apiResult.query.search[0].title;
    console.log(localPageID);
    grabSections(localPageID);
        try{
        
        $('.info-container').html('<p>' + apiResult.query.pages[apiResult.query.search[0].pageid].extract + '</p>');
        $('.info-container').prepend('<img src='+apiResult.query.pages[apiResult.query.search[0].pageid].thumbnail.source+'>');
        $('#bandinfocard').text(decodeURI(searchTerm));
        var moreButton = $("<a class='waves-effect waves-light btn modal-trigger' href='#modal1'>More?</a>");
        moreButton.appendTo('.info-container');

    }catch(error){
        if (error instanceof TypeError){
        console.log(error);
        searchTerm = searchTerm+" band";
        searchTerm = encodeURI(searchTerm);
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: {
                action: 'query',
                list: 'search',
                srsearch: searchTerm,
                format: 'json',
                generator: 'search',
                //parameters for generator
                gsrsearch: searchTerm,
                gsrnamespace: 0,
                gsrlimit: 10,
                origin: "*",
                prop: 'extracts|pageimages',
                //parameters for extracts
                exchars: 1200,
                exlimit: 'max',
                exintro: true,
    
                //parameters for pageimages
                piprop: 'thumbnail',
                pilimit: 'max',
                pithumbsize: 200
            },
            dataType: 'jsonp',
            success: processResult
        }).then(function (resp) {
            console.log(resp);
        });

        }
    
    // $('#display-result').append('<p>' + apiResult.query.search[i].snippet + '</p>');
    }
}

function grabSections(pageID) {
    // /w/api.php?action=parse&format=json&origin=*&page=The%20Strokes&redirects=1&prop=sections%7Cwikitext&wrapoutputclass=mw-parser-output&contentmodel=wikitext&utf8=1&formatversion=2
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'parse',
            format: 'json',
            origin: '*',
            redirects: '1',
            prop: 'sections|text',
            page: pageID,

        },
        dataType: 'json'
    }).then(function (gsresp) {
        console.log(gsresp);
        var prettyString = JSON.stringify(gsresp.parse.text).replace(/\\n/g, "")
            .replace(/\\'/g, "")
            .replace(/\\"/g, '')
            .replace(/\\&/g, "")
            .replace(/\\r/g, "")
            .replace(/\\t/g, "")
            .replace(/\\b/g, "")
            .replace(/\\f/g, "");
        // buildCollapsible(gsresp.parse.sections);
        localSections=gsresp.parse.sections;
    })
}

function buildCollapsible(sectionsArray) {
    // console.log(sectionsArray);
    var collapse = $("<ul class='collapsible' id='returnedsections'>");
    var promises = sectionsArray.map(function (section) {
        return new Promise(function (resolve) {
            $.ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                data: {
                    action: 'parse',
                    format: 'json',
                    origin: '*',
                    redirects: '1',
                    prop: 'sections|text',
                    page: localPageID,
                    section: section.index,
                },
                dataType: 'json',
            }).then(function (returnValue) {
                resolve(returnValue);
            })
        })
    })
    Promise.all(promises).then(function (promiseResults) {
        for (elements in sectionsArray) {
            var litem = $("<li>");
            var divHeader = $("<div class='collapsible-header'>");
            divHeader.html(sectionsArray[elements].line.replace(/<i>/gi, "").replace(/<\/i>/gi, ""));
            var headerBadge = $("<span class='badge material-icons '>expand_more</span>");
            headerBadge.appendTo(divHeader);
            var divBody = $("<div class='collapsible-body'>");
            divBody.attr("style", "background-color: white;");
            var bodySpan = $("<span>");
            bodySpan.attr("id", "section" + elements);
            var prettyString = JSON.stringify(promiseResults[elements].parse.text['*']).replace(/\\n/g, "")
                .replace(/\\'/g, "")
                .replace(/\\"/g, '')
                .replace(/\\&/g, "")
                .replace(/\\r/g, "")
                .replace(/\\t/g, "")
                .replace(/\\b/g, "")
                .replace(/\\f/g, "");
            bodySpan.html(prettyString);
            bodySpan.appendTo(divBody);
            divHeader.appendTo(litem);
            divBody.appendTo(litem);
            litem.appendTo(collapse);
        }
    });
    $("#modal-body").empty();
    collapse.appendTo($("#modal-body"));
    $("#modal-header").text(decodeURI(searchTerm));
    var lements = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(lements);
}
$(".active").on("click", ".badge", function(event){
    console.log("clicked badge");
    this.text("-");
});







