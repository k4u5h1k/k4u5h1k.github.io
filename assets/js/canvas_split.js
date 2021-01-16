var canvas_split = document.getElementById('canvas_split');
var ctx = canvas_split.getContext('2d');

canvas_split.width = videoWidth;
canvas_split.height = videoHeight;


video.addEventListener('play', function () {
    var $this = this; //cache
    (function loop() {
        if (!$this.paused && !$this.ended) {

            ctx.save();
            if(videoFlip) {
                ctx.scale(-1, 1); // flip horizontal
                ctx.translate(-640, 0); // move the canvas_split over to compensate for the flip
            }

            ctx.drawImage($this, 0, videoCut);
            ctx.restore();

            setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
    })();
}, 0);


