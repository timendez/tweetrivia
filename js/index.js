window.onload = function() {
    window.setInterval(getTime, 1000);
    window.setInterval(checkTime, 1000);
};

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
   }
}
function change(){

}
function restart(){
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
    document.getElementById("timer").innerHTML = 5;
}

function answer(str){
}