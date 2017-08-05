var socket;
var entities = [];
var players = [];
x = 0;
y = 0;
zoom = 0;

function setup() {
    createCanvas(500, 500);
    socket = io.connect('http://localhost:3000');
    socket.on('start',
        function(data) {
            entities = data[0];
            players = data[1];
            for(var i = entities.length - 1; i >= 0; i--) {
                var id = entities[i].id;
                if(id.substring(2, id.length) !== socket.id) {
                    draw();
                    translate(entities[i].x, entities[i].y)
                }
            }
        });

    socket.on('tick',
        function(data) {
            entities = data[0];
            players = data[1];
        });
}

function draw() {
    if(keyIsDown(LEFT_ARROW)) {x+=5;}
    if(keyIsDown(RIGHT_ARROW)) {x-=5;}
    if(keyIsDown(UP_ARROW)) {y+=5;}
    if(keyIsDown(DOWN_ARROW)) {y-=5;}
    if(keyIsDown(90)) {zoom+=.1;}
    if(keyIsDown(88)) {zoom-=.1;}
    if(zoom <= 0) {zoom += .1;}
    translate(x, y);
    scale(zoom)
    background(200);

    ellipse(0, 0, 10, 10);
    fill(0);

    var id
    for (var i = entities.length - 1; i >= 0; i--) {
        var id = entities[i].id;
        if (id.substring(2, id.length) !== socket.id) {
            fill(0, 0, 255);
            ellipse(entities[i].x, entities[i].y, entities[i].health / 5, entities[i].health / 5);
            fill(255);
            textAlign(CENTER);
            textSize(1);
            text(entities[i].owner, entities[i].x, entities[i].y + entities[i].health / 5);
        } else {
            fill(0, 0, 200);
            coords = game_to_screen_coords(entities[i].x, entities[i].y, x, y);
            ellipse(coords[0], coords[0], entities[i].health / 500, entities[i].health / 500);
            fill(255);
            textAlign(CENTER);
            textSize(1);
            text("Yours", coords[0], coords[1] + entities[i].health / 500);
        }
    }
}

function game_to_screen_coords(gameX, gameY, screenX, screenY) {
    newX = gameX - screenX;
    newY = gameY - screenY;
    newY *= -1;
    return [newX, newY];
}

function screen_to_game_coords(screenX, screenY, pointX, pointY) {
    pointY *= -1;
    newX = screenX + pointX;
    newY = screenY + pointY;
    return [newX, newY];
}

function mouseClicked() {
    coords = screen_to_game_coords(x, y);
    socket.emit('spawn',{'x': coords[0], 'y': coords[1]});
    console.log(coords[0] + ' ' + coords[1]);
}
