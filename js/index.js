var timeI, checkI;

function getTime(){
   var x = document.getElementById("timer");
   var time = x.innerHTML
   var y = parseInt(time) - 1;
   if(y <=0){
      y = 0;
   }
   x.innerHTML = y.toString();
}

function checkTime(){
   var x = document.getElementById("timer").innerHTML;
   x = parseInt(x)
   if(x <= 0){
      $("#mask").removeClass("hide");
      $("#popup").removeClass("hide");
      clearInterval(timeI);
      clearInterval(checkI);
   }
}
function start(){
   $("#mask2").addClass("hide");
   $("#popup2").addClass("hide");
   document.getElementById("timer").innerHTML = 5;
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
}
function change(){
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
   $("#mask2").removeClass("hide");
   $("#popup2").removeClass("hide");
}
function restart(){
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
   document.getElementById("timer").innerHTML = 5;
   timeI = window.setInterval(getTime, 1000);
   checkI = window.setInterval(checkTime, 1000);
}

function answer(str){
}