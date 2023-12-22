var speed = 4;
var msn = 0;
var distance;
var joy = document.getElementById("joy");
const {width, height} = joy.getBoundingClientRect();
joy.width = width;
joy.height = height;
joy.addEventListener("touchstart", down);
joy.addEventListener("touchmove", move);
joy.addEventListener("touchend", up);
joy.addEventListener("mousedown", down);
joy.addEventListener("mousemove", move);
joy.addEventListener("mouseup", up);
window.addEventListener("resize", rs);
joy.addEventListener("dblclick", car_sound);
joy.addEventListener("mouseout", rs);
$("#joy").on('doubleTap', function(event){
    send("c", speed);
});

var ctx = joy.getContext("2d");
ctx.lineWidth = 5;
clearBackground();
drawCircle(joy.width/2, joy.height/2, joy.width*0.225, "rgb(255,000,051)");
var startX, startY, moveX, moveY;
var joyPos = joy.getBoundingClientRect();
var onTouch = false;
async function down(event) {
  try {
    startX = Math.round(event.touches[0].clientX - joyPos.left);
    startY = Math.round(event.touches[0].clientY - joyPos.top);
  } catch{
    startX = Math.round(event.clientX - joyPos.left);
    startY = Math.round(event.clientY - joyPos.top);
  }
  onTouch = true;
}

var msgPrev = "x";
var msg = "x";
async function move(event) {
  if (onTouch) {
    try {
      moveX = Math.round(event.touches[0].clientX - joyPos.left) - startX;
      moveY = Math.round(event.touches[0].clientY - joyPos.top) - startY;
    } catch{
      moveX = Math.round(event.clientX - joyPos.left) - startX;
      moveY = Math.round(event.clientY - joyPos.top) - startY;
    }
    var moveMax = joy.width*0.45 - joy.width*0.225;
    if (moveX > moveMax) moveX = moveMax;
    else if (moveX < -moveMax) moveX = -moveMax;
    if (moveY > moveMax) moveY = moveMax;
    else if (moveY < -moveMax) moveY = -moveMax;

    clearBackground();
    drawCircle(joy.width/2 + moveX, joy.height/2 + moveY, joy.width*0.225, "rgb(255,000,051)");

    if (moveX >= moveMax) msg = "d";
    else if (moveX <= -moveMax) msg = "a";
    else if (moveY <= -moveMax) msg = "w";
    else if (moveY >= moveMax) msg = "s";
    else msg = "x";

    if(msg != msgPrev){
      send(msg, speed);
      msgPrev = msg;
    }else{
      if(msg == "s") send2("s", speed);
      else send2("p", speed);
    }
  }

}
async function send(direction, speed) {
  var data = {
    'direction':direction, 'speed':speed
  }
  $.ajax({
      type: 'POST',
      url: '/ajax',
      data: JSON.stringify(data),
      dataType : 'JSON',
      contentType: "application/json",
      success: function(data){
        distance = data.result2;

        if(distance > 20){
          $('#st').removeClass('st_red');
          $('#st').addClass('st_gr');
        }else{
          $('#st').removeClass('st_gr');
          $('#st').addClass('st_red');
        }
      },
      error: function(request, status, error){
        console.log(error);
      }
    });
}

async function send2(p, speed) {
  var data = {
    'p': p,
    'speed' : speed
  }
  $.ajax({
      type: 'POST',
      url: '/ajax2',
      data: JSON.stringify(data),
      dataType : 'JSON',
      contentType: "application/json",
      success: function(data){
        distance = data.result2;

        if(distance > 20){
          $('#st').removeClass('st_red');
          $('#st').addClass('st_gr');
        }else{
          $('#st').removeClass('st_gr');
          $('#st').addClass('st_red');
        }
      },
      error: function(request, status, error){
        console.log(error);
      }
    });
}


async function up() {
  clearBackground();
  drawCircle(joy.width/2, joy.height/2, joy.width*0.225, "rgb(255,000,051)");
  msg = "x";
  msgPrev = "x";
  onTouch = false;
  send(msg, speed);
}

async function clearBackground() {
    ctx.clearRect(0, 0, joy.width, joy.height);
    ctx.beginPath();
    ctx.strokeStyle = "rgb(153,000,051)";
    ctx.arc(joy.width/2, joy.height/2, joy.width*0.45, 0, 2 * Math.PI);
    ctx.stroke();
}

async function drawCircle(x, y, r, c) {
  ctx.beginPath();
  ctx.fillStyle = c;
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

async function rs(){
  const {width, height} = joy.getBoundingClientRect();
  joy.width = width;
  joy.height = height;

  ctx.lineWidth = 5;
  clearBackground();
  drawCircle(joy.width/2, joy.height/2, joy.width*0.225, "rgb(255,000,051)");

  $('.btn-' + speed).find('span').css({top:0, left:0});
}

async function car_sound(){
    send("c", speed);
}

$(function() {  
  $('.btn-1')
    .on('mouseenter', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('click', function(e){
      $('.btn-2>span').removeAttr('id', 'back_col');
      $('.btn-2').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-2').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-2').find('span').css({top:relY, left:relX});
      $('.btn-3>span').removeAttr('id', 'back_col');
      $('.btn-3').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-3').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-3').find('span').css({top:relY, left:relX});
      $('.btn-4>span').removeAttr('id', 'back_col');
      $('.btn-4').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-4').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-4').find('span').css({top:relY, left:relX});

      $('.btn-1>span').attr('id', 'back_col');
      $('.btn-1').attr('id', 'bt_col');
      speed = 1;
      send(msg, speed);
    })
    .on('tap', function(e){
      $(this).off("mouseenter");
      $(this).off("mouseout");
    });

  $('.btn-2')
    .on('mouseenter', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('click', function(e){
      $('.btn-1>span').removeAttr('id', 'back_col');
      $('.btn-1').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-1').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-1').find('span').css({top:relY, left:relX});
      $('.btn-3>span').removeAttr('id', 'back_col');
      $('.btn-3').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-3').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-3').find('span').css({top:relY, left:relX});
      $('.btn-4>span').removeAttr('id', 'back_col');
      $('.btn-4').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-4').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-4').find('span').css({top:relY, left:relX});

      $('.btn-2>span').attr('id', 'back_col');
      $('.btn-2').attr('id', 'bt_col');
      speed = 2;
      send(msg, speed);
    })
    .on('tap', function(e){
      $(this).off("mouseenter");
      $(this).off("mouseout");
    });

  $('.btn-3')
    .on('mouseenter', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('click', function(e){
      $('.btn-1>span').removeAttr('id', 'back_col');
      $('.btn-1').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-1').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-1').find('span').css({top:relY, left:relX});
      $('.btn-2>span').removeAttr('id', 'back_col');
      $('.btn-2').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-2').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-2').find('span').css({top:relY, left:relX});
      $('.btn-4>span').removeAttr('id', 'back_col');
      $('.btn-4').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-4').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-4').find('span').css({top:relY, left:relX});

      $('.btn-3>span').attr('id', 'back_col');
      $('.btn-3').attr('id', 'bt_col');
      speed = 3;
      send(msg, speed);
    })
    .on('tap', function(e){
      $(this).off("mouseenter");
      $(this).off("mouseout");
    });

  $('.btn-4')
    .on('mouseenter', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('click', function(e){
      $('.btn-1>span').removeAttr('id', 'back_col');
      $('.btn-1').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-1').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-1').find('span').css({top:relY, left:relX});
      $('.btn-2>span').removeAttr('id', 'back_col');
      $('.btn-2').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-2').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-2').find('span').css({top:relY, left:relX});
      $('.btn-3>span').removeAttr('id', 'back_col');
      $('.btn-3').removeAttr('id', 'bt_col');
      var parentOffset = $('.btn-3').offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $('.btn-3').find('span').css({top:relY, left:relX});

      $('.btn-4>span').attr('id', 'back_col');
      $('.btn-4').attr('id', 'bt_col');
      speed = 4;
      send(msg, speed);
    })
    .on('tap', function(e){
      $(this).off("mouseenter");
      $(this).off("mouseout");
    });
});

carmeraleft=document.getElementById("left");
carmeraright=document.getElementById("right");

carmeraleft.addEventListener("touchstart", leftdown);
carmeraleft.addEventListener("touchend", leftup);
carmeraleft.addEventListener("mousedown", leftdown);
carmeraleft.addEventListener("mouseup", leftup);

carmeraright.addEventListener("touchstart", rightdown);
carmeraright.addEventListener("touchend", rightup);
carmeraright.addEventListener("mousedown", rightdown);
carmeraright.addEventListener("mouseup", rightup);

function leftdown(){
  send(msg, 5);
}

function leftup(){
  send(msg, 7);
}

function rightdown(){
  send(msg, 6);
}

function rightup(){
  send(msg, 8);
}


window.addEventListener("keydown", keybord);
window.addEventListener("keyup", kup);

function keybord(e){
  if(e.key == "w" || e.key == "W") msg = "w"
  else if(e.key == "a" || e.key == "A") msg = "a"
  else if(e.key == "s" || e.key == "S") msg = "s"
  else if(e.key == "d" || e.key == "D") msg = "d"
  else if(e.key == "ArrowUp"){
    if(speed > 1){
      $('.btn-' + speed +'>span').removeAttr('id', 'back_col');
      $('.btn-' + speed).removeAttr('id', 'bt_col');
      speed = speed - 1;
      $('.btn-' + speed).find('span').css({top:0, left:0});
      $('.btn-' + speed +'>span').attr('id', 'back_col');
      $('.btn-' + speed).attr('id', 'bt_col');
      send(msg,speed);
      return 0;
    }
  }else if(e.key == "ArrowDown"){
    if(speed < 4){
      $('.btn-' + speed +'>span').removeAttr('id', 'back_col');
      $('.btn-' + speed).removeAttr('id', 'bt_col');
      speed = speed + 1;
      $('.btn-' + speed).find('span').css({top:0, left:0});
      $('.btn-' + speed +'>span').attr('id', 'back_col');
      $('.btn-' + speed).attr('id', 'bt_col');
      send(msg,speed);
      return 0;
    }
  }else if(e.key == "ArrowLeft"){
    if(msn != 5){
      send(msg, 5);
      msn = 5;
    }else{
      send2("p", speed);
    }
    return 0;
  }else if(e.key == "ArrowRight"){
    if(msn != 6){
      send(msg, 6);
      msn = 6;
    }else{
      send2("p", speed);
    }
    return 0;
  }else if(e.key == " "){
    msg = "c";
  }else{
    msg = "x";
  }
  
  if(msg != msgPrev){
      send(msg, speed);
      msgPrev = msg;
  }else{
      if(msg == "s") send2("s", speed);
      else send2("p", speed);
  }
}

function kup(e){
  msgPrev = "x";
  msg = "x";
  msn = 0;
  if(e.key == "ArrowLeft") send(msg, 7);
  else if(e.key == "ArrowRight") send(msg, 8);
  else send(msg, speed);
}

const fullscreen = element => {
  if (element.requestFullscreen) return element.requestFullscreen();
  if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
  if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
  if (element.msRequestFullscreen) return element.msRequestFullscreen();
}

async function start(){
  $('#start').fadeOut();
  fullscreen(document.querySelector('body'));
  window.screen.orientation.lock('landscape-primary');
}