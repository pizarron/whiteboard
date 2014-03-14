var pizarrita = ( function () {
    
    "use strict";

    var canvas,
    canvasDiv = document.getElementById('canvasDiv'),
    context,
    canvasWidth = 700,
    canvasHeight = 400,
    clickX = new Array(),
    clickY = new Array(),
    clickColor = new Array(),
    clickDrag = new Array(),
    clickRadius = new Array(),
    paint,
    selectedColor = '#ffffff',
    selectedRadius = 8,
    backgroundColor = '#356444',
    erasingOn = false,
    //board socket
    currentRoom = 'room002',
    joined = false,
    // Clears the Canvas.
    clearCanvas = function () {
        saveImage();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.lineJoin = "round";
        paint = false;
        clickX = [];
        clickY = [];
        clickColor = [];
        clickDrag = [];
        clickRadius = [];
    },
    saveImage = function() {
        var image = context.canvas.toDataURL("image/png");
        image = image.replace('data:image/png;base64,', '');
        var data = {
            data : image
        };
        $.post('/courseclass/uploadimage', data).done(function(res){
            console.log("Image saved");
        });
    },
    // Redraws the Canvas.
    redraw = function () {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.lineJoin = "round";

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();

            if (clickColor[i].localeCompare('background') == 0) {
                context.strokeStyle = backgroundColor;
            } else {
                context.strokeStyle = clickColor[i];
            }

            context.lineWidth = clickRadius[i];
            context.stroke();
        }
    },

    // Adds a point to the drawing arrays.
    addClick = function (x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickRadius.push(selectedRadius);
        if (erasingOn) {
            clickColor.push('background');   
        } else {
            clickColor.push(selectedColor);
        }
        if (joined) {
            sentData(x, y, dragging);
        }
    },

    // User events.
    createUserEvents = function () {
        var $canvas = $('#canvas');

        $canvas.mousedown(function (e) {
            var mouseX = e.pageX - this.offsetLeft,
		    mouseY = e.pageY - this.offsetTop;

            paint = true;
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            redraw();
        });

        $canvas.mousemove(function (e) {
            if (paint) {
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                redraw();
            }
        });

        $canvas.mouseup(function (e) {
            paint = false;
        });

        $canvas.mouseleave(function (e) {
            paint = false;
        });

        $('#toolsClearBtn').click(function () {
            clearCanvas();
            sentData(-10, -10, false, true);
        });

        $('.changeColor').click(function () {
            selectedColor = $(this).data('color');
            $('.changeColor').css('border', '');
            $(this).css('border', 'solid 3px black');
        });

        $('.changePencilSize').click(function () {
            selectedRadius = $(this).data('pencil-size');
            $('.changePencilSize').css('border', '');
            $(this).css('border', 'solid 3px black');
        });

        $('#eraserTool').click(function () {
            if (erasingOn) {
                $(this).css('border', '');
                $('.changeColor').removeClass('disabled');
                erasingOn = false;
            } else {
                $(this).css('border', 'solid 3px black');
                $('.changeColor').addClass('disabled');
                erasingOn = true;
            }
        });
        $('.changeBlackboardColor').click(function () {
            $('#canvasDiv').css('background-color', $(this).data('blackboard-color'));
            backgroundColor = $(this).data('blackboard-color');
            redraw();
            $('.changeBlackboardColor').css('border', '');
            $(this).css('border', 'solid 3px black');
            sentData(-10, -10, false);
        });
        
        //join current room
        $('#joinRoom').click(function () {
            joinRoom();
        })
        $('#endClass').click(function () {
            endClass();
        })
    },
    joinRoom = function () {
        if (!joined) {
            currentRoom = $('#room').val();
            //alert(currentRoom);
            socketBoard.emit('join_room', { room: currentRoom, role: 'teacher' });
            joined = true;
        }
    },
    endClass = function () {
        if(joined)
        {
            // Necessary to finish class on the server
            var data = {
                courseClassId: parseInt($('#room').val())
            };
            $.post('/courseclass/finish', data).done(function (res) {
                alert('Class Finished');

                // Say real-time server that class has finished
                socketBoard.emit('leave_room', currentRoom);
                joined = false;

                // Go to teacher's dashboard
                window.location = '/dashboard'
            });
        }
    },
    //only teacher can send data
    sentData = function (x, y, dragging,clear) {
        var color = selectedColor;
        if (erasingOn) {
            color = 'background';
        }
        socketBoard.emit('send_data', {
            room: currentRoom,
            clear: clear,
            data: {
                x: x,
                y: y,
                radius: selectedRadius,
                color: color,
                dragging: dragging,
                background: backgroundColor,
            }
        });
    },
    // Init.
    init = function () {
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
	    canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	createUserEvents();
    };
    return {
        init: init,
        joinRoom: joinRoom
    };
}());
    
pizarrita.init();
$('.section-container').hide();

$('#chatSelector').click( function () {
	$('#myNotesSection').hide();
	$('#bestNotesSection').hide();
	$('#professorNotesSection').hide();
	$('#chatSection').toggle();
});

$('#myNotesSelector').click( function () {
	$('#chatSection').hide();
	$('#bestNotesSection').hide();
	$('#professorNotesSection').hide();
	$('#myNotesSection').toggle();
});

$('#bestNotesSelector').click( function () {
	$('#chatSection').hide();
	$('#myNotesSection').hide();
	$('#professorNotesSection').hide();
	$('#bestNotesSection').toggle();
});

$('#professorNotesSelector').click( function () {
	$('#chatSection').hide();
	$('#myNotesSection').hide();
	$('#bestNotesSection').hide();
	$('#professorNotesSection').toggle();
});

// Send message to CourseClass chat.
$('#chat-textarea').keyup( function (e) {
	if(e.keyCode == 13) {
		var message = {"message": $(this).val(), "user": "me"};
		socketChat.emit("message_to_server", message);
		$('#chat-textarea').val('');
	}
});
//my IP
var host="http://192.168.137.1"

/* Call socket chat */
var socketChat = io.connect(host+":9090/chat"); // Socket Chat
socketChat.on("message", function(message) {
	$('.chat-section-messages').append('<div class="talk-bubble tri-right left-top round"><span class="msg-sender">' + message.user + '</span><div class="talktext"><p>' + message.message + '</p></div></div>');
	$('#chat-textarea').val('');
});

socketChat.on("message_to_client", function(message) {
	$('.chat-section-messages').append('<div class="talk-bubble tri-left right-top response-bubble round"><span class="msg-sender">' + message.user +'</span><div class="talktext"><p>' + message.message + '</p></div></div>');
});

/* send pizarrita */
var socketBoard = io.connect(host + ":9090/wboard");

