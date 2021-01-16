function toggleCamera(){
    var wcam = document.getElementById('my_camera');
    if(wcam.style.display == 'none')
    {
        wcam.style.display = null;
        Webcam.attach(wcam);
        Webcam.set('flip_horiz', true);
    }
    else
    {
        wcam.style.display = 'none';
        Webcam.reset();
    }
}

    function toggleFront(id){
        var iframes = document.querySelectorAll('iframe');
        console.log(iframes)
        var players = [];
        for(var i=0;i<2;i++){
            players.push(new Vimeo.Player(iframes[i]));

            players[i].on('play', function() {
                console.log('played the video!');
            });

        players[i].getVideoTitle().then(function(title) {
            console.log('title:', title);
        });
    }
        if(iframes[1].style.display == 'none'){
            players[0].pause()
            players[0].getCurrentTime().then(function(seconds) {
                players[1].setCurrentTime(seconds).then(function() {
                    return players[1].play();
                })
            })
            iframes[1].style.display = null;
        }
        else{
            players[1].pause();
            players[1].getCurrentTime().then(function(seconds) {
                players[0].setCurrentTime(seconds).then(function() {
                    return players[0].play();
                })
            })

            iframes[1].style.display = 'none';
            iframes[0].style.display = null;
        }
    }