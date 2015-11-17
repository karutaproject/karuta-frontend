//----------------------------------
var application_version = "2.alpha";
var application_date = "2015-11-12";
//----------------------------------
var appliname = 'karuta';
var bckname = '';
//var appliname = 'karuta-ux';
//var bckname = '-ux';
var serverBCK = "karuta-backend"+bckname+"/rest/api";
var serverFIL = "karuta-backend"+bckname;
var serverVER = "karuta-backend"+bckname;
//----------------------------------
var elgg_url_base = 'elgg112/';
var elgg_url_absolute = '';
var elgg_installed = false;
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
var technical_support = "info.karuta@gmail.com";
var demo = false;
//----------------------------------
var navbar_icon_color = "#09bbd9";
var navbar_title = {};
navbar_title["fr"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
navbar_title["en"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
navbar_title["ja"] = "<img style='margin-top:-4px;' src='../../karuta/img/karuta-navbar.jpg'/>";
//----------------------------------
var welcome1 = {};// Welcome title
	welcome1["fr"] = "<img class='img-responsive' src='../../karuta/img/logofonbleu.jpg'/>";
	welcome1["en"] = "<img class='img-responsive' src='../../karuta/img/logofonbleu.jpg'/>";
var welcome2 = {};       // Welcome sub-title
	welcome2["fr"] = "<div style='color:black;text-align:center;font-size:14px;margin-bottom:15px;'>Version 2</div>";
	welcome2["en"] = "<div style='color:black;text-align:center;font-size:14px;margin-bottom:15px;'>Version 2</div>";
var welcome3 = {};       // Welcome paragraph
	welcome3["fr"] = "";
	welcome3["en"] = "";
	
var listinfo = {};       // Welcome paragraph
	listinfo["fr"]  = "";
	listinfo["fr"] += "Pour <b>débuter</b> cliquer sur le bouton <b>Menu</b><br/><br/>";
	listinfo["fr"] += "<p>Vous pouvez créer</p>";
	listinfo["fr"] += "<ul>";
	listinfo["fr"] += "<li>des portfolios</li>";
	listinfo["fr"] += "<li>des modèles de rapports ou de job en batch</li>";
	listinfo["fr"] += "</ul>";
	listinfo["fr"] += "<p>Vous pouvez importer</p>";
	listinfo["fr"] += "<ul>";
	listinfo["fr"] += "<li>des modèles de portfolio à partir de fichiers</li>";
	listinfo["fr"] += "<li>des intances de portfolios à partir de fichiers</li>";
	listinfo["fr"] += "</ul>";
	listinfo["fr"] += "<p>Vous pouvez aussi importer</p>";
	listinfo["fr"] += "<ul>";
	listinfo["fr"] += "<li>la documentation de Karuta</li>";
	listinfo["fr"] += "<li>les portfolios démos des vidéos YouTube</li>";
	listinfo["fr"] += "<li>les portfolios démos AACU</li>";
	listinfo["fr"] += "<li>les portfolio démos eCommerce</li>";
	listinfo["fr"] += "</ul>";
	listinfo["en"]  = "";
	listinfo["en"] += "To <b>start</b> click the <b>Menu</b> button<br/><br/>";
	listinfo["en"] += "<p>You can create</p>";
	listinfo["en"] += "<ul>";
	listinfo["en"] += "<li>portfolios</li>";
	listinfo["en"] += "<li>batch and report models</li>";
	listinfo["en"] += "</ul>";
	listinfo["en"] += "<p>You can import</p>";
	listinfo["en"] += "<ul>";
	listinfo["en"] += "<li>portfolios models from files</li>";
	listinfo["en"] += "<li>portfolios instances from files</li>";
	listinfo["en"] += "</ul>";
	listinfo["en"] += "<p>You can also import</p>";
	listinfo["en"] += "<ul>";
	listinfo["en"] += "<li>Karuta Documentation</li>";
	listinfo["en"] += "<li>Demo Portfolios from the YouTube Videos</li>";
	listinfo["en"] += "<li>AACU Demo Portfolios</li>";
	listinfo["en"] += "<li>eCommerce Demo Portfolios</li>";
	listinfo["en"] += "</ul>";
	listinfo["ja"] = "";
	listinfo["ja"] += "To <b>start</b> click the <b>Menu</b> button<br/><br/>";
	listinfo["ja"] += "<p>You can create</p>";
	listinfo["ja"] += "<ul>";
	listinfo["ja"] += "<li>portfolios</li>";
	listinfo["ja"] += "<li>batch and report models</li>";
	listinfo["ja"] += "</ul>";
	listinfo["ja"] += "<p>You can import</p>";
	listinfo["ja"] += "<ul>";
	listinfo["ja"] += "<li>portfolios models from files</li>";
	listinfo["ja"] += "<li>portfolios instances from files</li>";
	listinfo["ja"] += "</ul>";
	listinfo["ja"] += "<p>You can also import</p>";
	listinfo["ja"] += "<ul>";
	listinfo["ja"] += "<li>Karuta Documentation</li>";
	listinfo["ja"] += "<li>Demo Portfolios from the YouTube Videos</li>";
	listinfo["ja"] += "<li>AACU Demo Portfolios</li>";
	listinfo["ja"] += "<li>eCommerce Demo Portfolios</li>";
	listinfo["ja"] += "</ul>";

	//----------------------------------
	var welcome4 = {};			// List Page Welcome title
		welcome4["fr"] = "Bienvenue dans Karuta";
		welcome4["en"] = "Welcome in Karuta";
	var welcome5 = {}; 			// List Page Welcome sub-title
		welcome5["fr"] = "OPEN SOURCE PORTFOLIO";
		welcome5["en"] = "OPEN SOURCE PORTFOLIO";

