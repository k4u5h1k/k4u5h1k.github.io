console.log("Here!");
document.ready( function () {

    var video = document.getElementById('video');
    let videoWidth = 640;
    let videoHeight = 360;
    let loop_val = false;
    // canvas config 
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // canvas split config 
    var canvas_split = document.getElementById('canvas_split');
    var ctx_split = canvas_split.getContext('2d');
    canvas_split.width = videoWidth;
    canvas_split.height = videoHeight;

    // animation config 
    let videoCut = 0;
    let videoFlip = false;

    video.addEventListener('play', function () {
        var $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.save();
                ctx_split.save();

                if(videoFlip) {
                    ctx.scale(-1, 1); // flip horizontal
                    ctx.translate(-640, 0); // move the canvas over to compensate for the flip

                    ctx_split.scale(-1, 1); // flip horizontal
                    ctx_split.translate(-640, 0); // move the canvas over to compensate for the flip
                }
                ctx.drawImage($this, 0, videoCut);
                ctx.restore();

                ctx_split.drawImage($this, 0, videoCut);
                ctx_split.restore();

                let current_time=moment.utc($this.currentTime*1000).format('mm:ss')
                let duration=moment.utc($this.duration*1000).format('mm:ss')
                $('#video_time').text(current_time+' / '+ duration)

                slider.noUiSlider.set($this.currentTime/$this.duration*100);


                if(loop_val){
                    let current_in_percentage = $this.currentTime/$this.duration*100;

                    if(loop_slider.noUiSlider.get()[1] <= current_in_percentage){
                        video.currentTime = (loop_slider.noUiSlider.get()[0]) ? loop_slider.noUiSlider.get()[0]/100 * $this.duration :0;
                    }

                    let loop_start = (loop_slider.noUiSlider.get()[0]) ? moment.utc(loop_slider.noUiSlider.get()[0]/100 * $this.duration*1000).format('mm:ss') : 0;
                    let loop_end= (loop_slider.noUiSlider.get()[1]) ? moment.utc(loop_slider.noUiSlider.get()[1]/100 * $this.duration*1000).format('mm:ss') : 0;

                    $('#loop_duration').text('(loop start: '+loop_start+' / loop end: '+loop_end+')')
                }else{
                    loop_slider.noUiSlider.set([$this.currentTime/$this.duration*100, 100]);
                    $('#loop_duration').text('')

                }

                setTimeout(loop, 1000 / 30); // drawing at 30fps
            }


        })();
    }, 0);

    // video controls 
    $('#playPause').on('click', function () {
        playPause()
    });

    $('#view').on('change', function () {
        changeView($(this).val())
    });

    $('#mirror').on('switchChange.bootstrapSwitch', function(event, state) {
        videoFlip = state;

    });

    $('#camera').on('switchChange.bootstrapSwitch', function(event, state) {
        $('#canvas').hide()
        $('#split_view').hide()
        if(state){
            $('#split_view').show()
            split.position('80%')
        }else{
            $('#canvas').show()
        }
    });


    $('#loop-control').on('switchChange.bootstrapSwitch', function(event, state) {
        $('#timer').hide();
        $('#loop').hide();
        if(state)
        {
            $('#loop').show();
        }else{
            $('#timer').show();

        }
        loop_val = state;
    });

    $('#loop').hide();


    $('.volume-slider').on('change', function (e) {
        video.volume = $(this).val()
    });

    $('#split_view').hide()
    function playPause() {
        if (video.paused)
            video.play();
        else
            video.pause();
    }

    function changeView(value) {
        if (value==='1'){
            videoCut = 0;
        }
        else{
            videoCut = -videoHeight;
        }
    }

    video.muted = false


    // video split 
    let split = $('#split_view').split({
        orientation: 'vertical',
        percent: true,
        position:'25%',
        limit: 250,
    });
    

    var webcam = document.querySelector("#webcam");

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                webcam.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }
    
    var slider = document.getElementById('timer');

    noUiSlider.create(slider, {
        start: 0,
        connect: 'lower',
        behaviour: 'tap',
        tooltips: [false],
        range: {
            'min': 0,
            'max': 100
        }
    });

    slider.noUiSlider.on('start.one', function () {
        if(video.play)
            video.pause();
    });

    slider.noUiSlider.on('slide.one', function () {
        video.currentTime = slider.noUiSlider.get()/100 * video.duration;
    });

    slider.noUiSlider.on('end.one', function () {
        if(video.pause)
            video.play()
    });


    var loop_slider = document.getElementById('loop');

    noUiSlider.create(loop_slider, {
        start: [0,100],
        behaviour: 'drag-tap',
        connect: true,
        range: {
            'min': 0,
            'max': 100
        }
    });

    loop_slider.noUiSlider.on('start.one', function () {
        if(video.play)
            video.pause();
    });

    loop_slider.noUiSlider.on('slide.one', function () {
        video.currentTime = loop_slider.noUiSlider.get()[0]/100 * video.duration;
    });

    loop_slider.noUiSlider.on('end.one', function () {
        if(video.pause)
            video.play()
    });

    $("#mirror").bootstrapSwitch({});
    $("#camera").bootstrapSwitch({});
    $("#loop-control").bootstrapSwitch({});

    });