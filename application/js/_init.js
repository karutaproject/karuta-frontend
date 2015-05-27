//----------------------------------
var application_version = "1.x";
var application_date = "2015-04-11";
//----------------------------------
var appliname = 'karuta';
var bckname = 'karuta';
var demo = true;
//----------------------------------
var languages = [];
languages [0] = 'en';
languages [1] = 'fr';
//languages [2] = 'ja';
//----------------------------------
var navbar_title = {};
	navbar_title["fr"] = "<img style='margin-bottom:4px;' src='../../karuta/img/favicon.png'/> KARUTA Démo";
	navbar_title["en"] = "<img style='margin-bottom:4px;' src='../../karuta/img/favicon.png'/> KARUTA Demo";
	navbar_title["ja"] = "<img style='margin-bottom:4px;' src='../../karuta/img/favicon.png'/> KARUTA Demo";
var welcome1 = {};// Welcome title
	welcome1["fr"] = "<img style='margin-bottom:4px;margin-top:30px;' src='../../karuta/img/logofonbleu.jpg'/>";
	welcome1["en"] = "<img style='margin-bottom:4px;margin-top:30px;' src='../../karuta/img/logofonbleu.jpg'/>";
	welcome1["ja"] = "<img style='margin-bottom:4px;margin-top:30px;' src='../../karuta/img/logofonbleu.jpg'/>";
var welcome2 = {};       // Welcome sub-title
	welcome2["fr"] = "<span style='color:lightgrey'>Version 1.1.demo</span>";
	welcome2["en"] = "<span style='color:lightgrey'>Version 1.1.demo</span>";
	welcome2["ja"] = "<span style='color:lightgrey'>Version 1.1.demo</span>";
var welcome3 = {};       // Welcome paragraph
	welcome3["fr"] = "";
	welcome3["en"] = "";
	welcome3["ja"] = "";
//----------------------------------
var NONMULTILANGCODE = 0;  // default language if non-multilingual
var LANGCODE = 0; //default value
var LANG = languages[LANGCODE]; //default value
//----------------------------------
var serverBCK = bckname+"-backend/rest/api";
var serverFIL = bckname+"-backend";
var serverVER = bckname+"-backend";
//----------------------------------
var technical_support = "info.karuta@gmail.com";

