//----------------------------------
var application_version = "1.0";
var application_date = "2016-04-29";
//----------------------------------
var appliname = 'karuta-ux';
var bckname = '-ux';
var serverBCK = "karuta-backend"+bckname+"/rest/api";
var serverFIL = "karuta-backend"+bckname;
var serverVER = "karuta-backend"+bckname;
var serverREG = "karuta-backend"+bckname;
//----------------------------------
var elgg_url_base = 'elgg/';
var elgg_installed = true;
var elgg_refreshing = 240000; // 240 seconds
//----------------------------------
var languages = [];
languages [0] = 'en';
languages [1] = 'fr';
//languages [2] = 'ja';
//----------------------------------
var NONMULTILANGCODE = 0;  // default language if non-multilingual
var LANGCODE = 0; //default value
var LANG = languages[LANGCODE]; //default value
//----------------------------------
var technical_support = ""; // email of technical support
var demo = false;
//------ Default colors -----------------
var navbar_icon_color = "#848484";
//--------- Navbar content ------------------
var navbar_title = {};
navbar_title["fr"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
navbar_title["en"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
navbar_title["ja"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
//----------------------------------
var welcome1 = {};// Welcome title
	welcome1["fr"] = "<img class='img-responsive' src='../../karuta/img/logofonbleu.jpg'/>";
	welcome1["en"] = "<img class='img-responsive' src='../../karuta/img/logofonbleu.jpg'/>";
var welcome2 = {};       // Welcome sub-title
	welcome2["fr"] = "";
	welcome2["en"] = "";
var welcome3 = {};       // Welcome paragraph
	welcome3["fr"] = "";
	welcome3["en"] = "";
	
var listinfo = {};       // Welcome paragraph
	listinfo["fr"] = "";
	listinfo["en"] = "";
	listinfo["ja"] = "";

	//----------------------------------
	var welcome4 = {};			// List Page Welcome title
		welcome4["fr"] = "BIENVENUE DANS KARUTA 2.0";
		welcome4["en"] = "WELCOME TO KARUTA 2.0";
	var welcome5 = {}; 			// List Page Welcome sub-title
		welcome5["fr"] = "PORTFOLIO OPEN SOURCE";
		welcome5["en"] = "OPEN SOURCE PORTFOLIO";

