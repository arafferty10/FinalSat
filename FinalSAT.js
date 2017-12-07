
////////////////////////////////
//Aidan Rafferty
//Studio Space
//Fall 2017
//360 Degree Satellite Projection HTML
//Professor: Matt Bethancourt
//Partner: Kristof Klipfel and Carolyn Castanon
/////////////////////////////////

//Satellite Objects are made here
var sats = [];
var allSats = [];
var cursors = [];

//Arrays for the information for each sat
var satName = [];
var satCountry = [];
var satPurp = [];
var satOrb = [];
var satMass = [];
var satDate = [];
var satVehicle = [];
var satUser = []; 
var userRandSat = [];

var numSats = 1458;       //Is 1459 but we start from zero 

var showCountry = "all";    //Used to be able to show only certain aspects of the data
// var showPurpose = "all";
// var showUser = "all";
// var showOrb = "all";

//Window dimensions to pass to the create canvas function 
var wW = window.innerWidth;
var wH = window.innerHeight;

console.log(wW + " pixels");        //1334
console.log(wH + " pixels");        //758

var table;

var clientID = -1;

var curTime  = 0;
var lastTime = 0;
var timeDiff;

var cursX = 100;
var currentSat = 100;
var cursY = 100;

var running = false;

var socket = io();

function preload()
{
  loadJSON("satDATAFinal.json", logOut);
}

function logOut(data)
{
  for(var i=0; i<data.length; i++)
  {
    //Pushes data into a sat name array 
    satName.push(data[i].Name);
    satCountry.push(data[i].Country);
    satPurp.push(data[i].Purpose);
    satOrb.push(data[i].Orbit);
    satMass.push(data[i].Mass);
    satDate.push(data[i].Date);
    satVehicle.push(data[i].launchVehicle);
    satUser.push(data[i].Users);
    // console.log(satName[i]);
    // console.log(i);
  }
}

function setup()
{
  var currentSat = 100;
  //create canvas

  createCanvas(wW, wH);
  clientID = getID();
  //Creates objects for the number of satellites there are given the satNum above
  //This is the important one, the x and y values here are passed to the new SATS!!!

  var start;
  var end;
  
  switch(clientID){
    case 1: 
      start = 0;
      end = 364;
      break;

    case 2:
      start = 365;
      end = 729;
      break;

    case 3:
      start = 730;
      end = 1094;
      break;

    case 4:
      start = 1095;
      end = 1458;
      break;
  }

  for(var i=start; i<end; i++)
  {
    var x = random(width);
    var y = random(height);
    
    var nm = satName[i];
    var ct = satCountry[i];
    var pr = satPurp[i];
    var ob = satOrb[i];
    var ma = satMass[i];
    var dt = satDate[i];
    var vh = satVehicle[i];
    var ur = satUser[i];
    var username = "";

    var count = i;    //Using this to pass along the i value with the data to keep it all in lineeeee

    sats.push(new SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count, username));
  }


  for(var i=0; i<1458; i++)
  {
    var x = random(width);
    var y = random(height);
    
    var nm = satName[i];
    var ct = satCountry[i];
    var pr = satPurp[i];
    var ob = satOrb[i];
    var ma = satMass[i];
    var dt = satDate[i];
    var vh = satVehicle[i];
    var ur = satUser[i];
    var username = "";
    

    var count = i;    //Using this to pass along the i value with the data to keep it all in lineeeee

    allSats.push(new SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count, username));
  }

  var posX = 0;
  var posY = 0;
  var wid = 30;
  var hei = 30;
  var show = false;

  cursors.push(new drawCursor(posX, posY, wid, hei, show));

  curTime = millis();

  socket.emit("ready");
  socket.emit('sats', allSats);
  console.log(sats);

}


//Drawing the background and the satellites in it
//JUST DRAWS
var status = false;

// function randSat(){
//   currentSat = random(numSats);
// }
// randSat();
function draw()
{
  background(0);
 lastTime = curTime; 
  
  curTime = millis();

  timeDiff = curTime - lastTime;

  if(running)
  {

    for(var k=0; k<cursors.length; k++)
    {
      if(status == true)
      {
        cursors[k].display;
      }
    }

      // if(cursors[k].update())
    

    for(var i=0; i<sats.length; i++)
    {
      //This if statement takes in the showCountry value and displays either all or the filtered Country
        sats[i].display();
        // console.log(sats[i].count)

      // else if(showPurpose == "all" || sats[i].purpose == showPurpose)
      // {
      //  sats[i].display();
      // }

      if (sats[i].update()) {
        sats.splice(i,1);
        i--;
      }

      // sats[i].update();
    }
  }


}


function drawCursor(posX, posY, wid, hei, show)
{
  this.x = posX;
  this.y = posY;
  this.wid = wid;
  this.hei = hei;
  this.show = show;

  this.display = function() 
  {
    // push();
    fill(0,0,0,0);
    stroke(127,63,120);
    strokeWeight(4);
    translate(this.x-(this.wid/2),this.y-(this.hei/2));
    rect(0,0,this.wid,this.hei);
    // pop();

  }
}

function startThis(){
  running = true;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function that does just about everything lol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function userSat(username, randSat){
//   this.username = username;
//   this.randSat = randSat;
// }
function SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count, username) 
{
  this.x = x;
  this.y = y;

  this.name = nm;
  this.country = ct;
  this.purpose = pr;
  this.orbit = ob;
  this.mass = ma;
  this.date = dt;
  this.vehicle = vh;
  this.user = ur;
  this.username = username;

  this.count = count;       //Still passing the i variable from the draw through the rest of the code 

  this.selected = false;      //used to identify if an object is selected or not in update function, also used in display

  ////////////////////////////////////////////////////////////////////
  //Defining the color based on the country of origin
  ////////////////////////////////////////////////////////////////////

  if(this.country == "USA")
  {
    this.col = color('rgb(0,0,255)');
  }
  else if(this.country == "Russia")
  {
    this.col = color('rgb(255,0,0)');
  }
  else if(this.country == "China")
  {
    this.col = color('rgb(247, 247, 12)');
  }
  else if(this.country == "Japan")
  {
    this.col = color('rgb(247, 164, 0)');
  }
  else if(this.country == "Multinational")
  {
    this.col = color('rgb(7, 249, 245)');
  }
  else if(this.country == "United Kingdom")
  {
    this.col = color('rgb(152, 0, 255)');
  }
  else if(this.country == "Canada")
  {
    this.col = color('rgb(255, 0, 246)');
  }
  else if(this.country == "ESA")
  {
    this.col = color('rgb(84, 91, 102)');
  }
  else
  {
    this.col = color(255);
  }

  ////////////////////////////////////////////////////////////////////
  //Defining the size of the object based on the lMass
  ////////////////////////////////////////////////////////////////////

  this.radius = (this.mass * 0.005) + 10;
 
   /////////Drawing the sats on the display////////////////

  this.display = function() 
  {
    noStroke();     //No outline around objects

    //If statement checks to see if the object is hovered over by the user

    if(this.selected) // Implies true if no statement
    {
      strokeWeight(4);
      stroke(61, 247, 51);
    }

    fill(this.col);
    ellipse(this.x, this.y, this.radius, this.radius);
  }

  ////////Changing the Info Box and the Highlight Stroke/////////////////
  
  this.showInfo = function() 
  {
     var j = this.count;
   // this.col = color(0, 0, 255);
   stroke(61,247,51);
   infoManip(j);
   this.selected = true;

  }
  
  this.hideInfo = function() 
  {
   // this.col = color(255);
   // stroke(255);
   noStroke();
   this.selected = false;
  }


  //////////Movement of the objects/////////

  this.update = function()

  {

    if(this.selected == false)        //movement for when the object is not hovered over

    {

      this.x += 0.5*timeDiff/24;

      this.y += random(-0.1,0.5)*timeDiff/24;

    }



    //This bit down here wraps the canvas around and sends the elements to the oppostie side

    //Notice the smoothness added by doing wW + this.radius



    if(this.x > wW + this.radius)

    {

      // this.x = 0;

      this.x = this.radius * -1;

      socket.emit('message',{"x":this.x,"y":this.y,"nm":this.name,ct:this.country,"pr":this.purpose,"ob":this.orbit,"ma":this.mass,"dt":this.data,"vh":this.vehicle,"ur":this.user, "count":this.count, "username": this.username, "clientNum": (clientID%4)+1}); /**clientID we want the object to send to the next client. */

      return true;

    }



    if(this.y > wH + this.radius)

    {

      this.y = this.radius * -1;

    }



    return false;

  }
  

}
//End of this bad boy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Changes the info in the infobox using DOM manipulator

function infoManip(j)
{
  //Making JS elements for the HTML DOM manipulator part
  // var name = document.getElementById("name");
  // var country = document.getElementById("countryName");
  // var purpose = document.getElementById("purpose");;
  // var user = document.getElementById("users");
  // var orbit = document.getElementById("orbClass");
  // var lmass = document.getElementById("mass");
  // var lDate = document.getElementById("date");
  // var lVehicle = document.getElementById("vehicle");

  //Rewriting the information in for the infobox
  // name.innerHTML = satName[j];
  // country.innerHTML = satCountry[j];
  // purpose.innerHTML = satPurp[j];
  // user.innerHTML = satUser[j];
  // orbit.innerHTML = satOrb[j];
  // lmass.innerHTML = satMass[j];
  // lDate.innerHTML = satDate[j];
  // lVehicle.innerHTML = satVehicle[j]; 
}

/*New object from server**/
function newObject(data){
  // console.log("object to "+ data.clientNum);
  if (data.clientNum == clientID){
    sats.push(new SaT(data.x, data.y, data.nm, data.ct, data.pr, data.ob, data.ma, data.dt, data.vh, data.ur, data.count, data.username));
   // console.log("read from server");
  }

}

