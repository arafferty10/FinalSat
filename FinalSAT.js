
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

//Arrays for the information for each sat
var satName = [];
var satCountry = [];
var satPurp = [];
var satOrb = [];
var satMass = [];
var satDate = [];
var satVehicle = [];
var satUser = []; 

var numSats = 1458;				//Is 1459 but we start from zero 

var showCountry = "all";		//Used to be able to show only certain aspects of the data
// var showPurpose = "all";
// var showUser = "all";
// var showOrb = "all";

//Window dimensions to pass to the create canvas function 
var wW = window.innerWidth;
var wH = window.innerHeight;

console.log(wW + " pixels");				//1334
console.log(wH + " pixels");				//758

var table;


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
	//create canvas

	createCanvas(wW, wH);

	//Creates objects for the number of satellites there are given the satNum above
	//This is the important one, the x and y values here are passed to the new SATS!!!
	
	for(var i=0; i<numSats; i++)
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

		var count = i;		//Using this to pass along the i value with the data to keep it all in lineeeee

		sats.push(new SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count));
	}

}


//Drawing the background and the satellites in it
//JUST DRAWS

function draw()
{
	background(0);	
	
	for(var i=0; i<numSats; i++)
	{
		//This if statement takes in the showCountry value and displays either all or the filtered Country
		if(showCountry == "all" ||  sats[i].country == showCountry)
		{
			sats[i].display();
		}
		// else if(showPurpose == "all" || sats[i].purpose == showPurpose)
		// {
		// 	sats[i].display();
		// }

		sats[i].update();
	}
	/////////////////////////////////////////////////////////////////////
	//show the info for satellites if they are hovered over by the mouse
	/////////////////////////////////////////////////////////////////////

	for(var i=0; i<numSats; i++)
	{
		var d = dist(mouseX, mouseY, sats[i].x, sats[i].y);
		
		if(d < sats[i].radius/2)
		{
			sats[i].showInfo();
		} 
		else 
		{
			sats[i].hideInfo();
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function that does just about everything lol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SaT(x, y, nm, ct, pr, ob, ma, dt, vh, ur, count) 
{
  this.x = x;
  this.y = y;

  this.yDir = Math.floor(random(0,2))*2 - 1;

  this.name = nm;
  this.country = ct;
  this.purpose = pr;
  this.orbit = ob;
  this.mass = ma;
  this.date = dt;
  this.vehicle = vh;
  this.user = ur;

  this.count = count;				//Still passing the i variable from the draw through the rest of the code 

  this.selected = false;			//used to identify if an object is selected or not in update function, also used in display

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

  // if(this.mass <  10)
  // {
  // 	this.radius = 4;
  // }
  // else if(this.mass > 10 && this.mass < 100)
  // {
  // 	this.radius = random(5,8);
  // }
  // else if(this.mass > 100 && this.mass < 1000)
  // {
  // 	this.radius = random(9,13);
  // }
  // else if(this.mass > 1000 && this.mass < 4999)
  // {
  // 	this.radius = random(14,20)
  // }
  // else if(this.mass > 5000)
  // {
  // 	this.radius = 25;
  // }
  // else
  // {
  // 	this.radius = random(8,10);
  // }

  //this.radius = random(5, 15);
 
   /////////Drawing the sats on the display////////////////

  this.display = function() 
  {
    noStroke();			//No outline around objects

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
  	if(this.selected == false)				//movement for when the object is not hovered over
  	{
  		this.x += 0.5;
  		this.y += random(-0.1,0.5) * this.yDir;
  	}

  	//This bit down here wraps the canvas around and sends the elements to the oppostie side
  	//Notice the smoothness added by doing wW + this.radius

  	if(this.x > wW + this.radius)
  	{
  		// this.x = 0;
  		this.x = this.radius * -1;
  	}

  	//Elimtinates the objects leaving the screen on the top and bottom

  	if(this.y > wH + this.radius)
  	{
  		this.yDir = -1;
  	}

  	if(this.y < 0 - this.radius)
  	{
  		this.yDir = 1;
  	}

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

	// //Rewriting the information in for the infobox
	// name.innerHTML = satName[j];
	// country.innerHTML = satCountry[j];
	// purpose.innerHTML = satPurp[j];
	// user.innerHTML = satUser[j];
	// orbit.innerHTML = satOrb[j];
	// lmass.innerHTML = satMass[j];
	// lDate.innerHTML = satDate[j];
	// lVehicle.innerHTML = satVehicle[j]; 
}

//Shows the dropdown menu

function dropDown()
{
	document.getElementById("dropDown").classList.toggle("show");
}

///////////////////////////////////////////////////////////////////
//Used for the Organize tab to show only certain data aspects
///////////////////////////////////////////////////////////////////
function showAll()
{
	if(showCountry != "all")
	{
		showCountry = "all";
	}
}


function showUSA()
{
	if(showCountry == "all")
	{
		showCountry = "USA";
	}
	else if(showCountry == "USA")
	{
		showCountry = "USA";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "USA";
	}
	else if(showCountry == "China")
	{
		showCountry = "USA";
	}
	else if(showCountry == "Japan")
	{
		showCountry = "USA";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "USA";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "USA";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "USA";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "USA";
	}
}


function showRussia()
{
	if(showCountry == "all")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "USA")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "China")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "Japan")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "Russia";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "Russia";
	}
}


function showChina()
{
	if(showCountry == "all")
	{
		showCountry = "China";
	}
	else if(showCountry == "China")
	{
		showCountry = "China";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "China";
	}
	else if(showCountry == "USA")
	{
		showCountry = "China";
	} 
	else if(showCountry == "Japan")
	{
		showCountry = "China";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "China";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "China";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "China";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "China";
	}
}


function showJapan()
{
	if(showCountry == "all")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "Japan")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "USA")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "China")
	{
		showCountry = "Japan";
	} 
	else if(showCountry == "Multinational")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "Japan";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "Japan";
	}
}


function showMulti()
{
	if(showCountry == "all")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "USA")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "China")
	{
		showCountry = "Multinational";
	} 
	else if(showCountry == "Japan")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "Multinational";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "Multinational";
	}
}


function showUK()
{
	if(showCountry == "all")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "USA")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "China")
	{
		showCountry = "United Kingdom";
	} 
	else if(showCountry == "Japan")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "United Kingdom";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "United Kingdom";
	}
}


function showCanada()
{
	if(showCountry == "all")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "USA")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "China")
	{
		showCountry = "Canada";
	} 
	else if(showCountry == "Japan")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "Canada";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "Canada";
	}
}


function showESA()
{
	if(showCountry == "all")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "ESA")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "Russia")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "USA")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "China")
	{
		showCountry = "ESA";
	} 
	else if(showCountry == "Japan")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "Multinational")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "United Kingdom")
	{
		showCountry = "ESA";
	}
	else if(showCountry == "Canada")
	{
		showCountry = "ESA";
	}
}

