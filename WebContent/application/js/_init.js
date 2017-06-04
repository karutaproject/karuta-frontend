//----------------------------------
var application_version = "1.0";
var application_date = "2016-04-29";
//----------------------------------
var appliname = 'karuta';
var karutaname = 'karuta'; // to share the same karuta-core with multiple front-end
var karuta_url = '../../../' + karutaname;
var bckname = '';
var serverBCK = "karuta-backend"+bckname+"/rest/api";
var serverFIL = "karuta-backend"+bckname;
var serverVER = "karuta-backend"+bckname;
var serverREG = "karuta-backend"+bckname;
var serverCONF = "";
var serverREP = "";
//------ ELGG SOCIAL NETWORK ----------------------------
var elgg_url_base = 'elgg/';
var elgg_installed = false;
var elgg_refreshing = 240000; // 240 seconds
//-------- LANGUAGES------------
var languages = [];
languages [0] = 'en';
languages [1] = 'fr';
languages [2] = 'es';
languages [3] = 'es_VA';
//----------------------------------
var NONMULTILANGCODE = 0;  // default language if non-multilingual
var LANGCODE = 0; //default value
var LANG = languages[LANGCODE]; //default value
//----------------------------------
var audiovideohtml5 = false;
//----------------------------------
var technical_support = "technical-support@yourinstitution.com"; // email of technical support
var demo = false;
var karuta_create_account = true;
//--------- NAVBAR BRAND ------------------
var navbar_title = {};
navbar_title["fr"] = "<img style='margin-top:-4px;' src='"+karuta_url+"/karuta/img/karuta-navbar.jpg'/>";
navbar_title["en"] = "<img style='margin-top:-4px;' src='"+karuta_url+"/karuta/img/karuta-navbar.jpg'/>";
navbar_title["ja"] = "<img style='margin-top:-4px;' src='"+karuta_url+"/karuta/img/karuta-navbar.jpg'/>";
//-----------LOGIN PAGE -----------------------
var welcome1 = {};// Welcome title
	welcome1["fr"] = "<img class='img-responsive' src='"+karuta_url+"/karuta/img/logofonbleu.jpg'/>";
	welcome1["en"] = "<img class='img-responsive' src='"+karuta_url+"/karuta/img/logofonbleu.jpg'/>";
var welcome2 = {};       // Welcome sub-title
	welcome2["fr"] = "";
	welcome2["en"] = "";
var welcome3 = {};       // Welcome paragraph
	welcome3["fr"] = "";
	welcome3["en"] = "";
//---------MAIN PAGE-------------------------
var welcome4 = {};			//  Welcome title
	welcome4["fr"] = "BIENVENUE DANS KARUTA 2.2";
	welcome4["en"] = "WELCOME TO KARUTA 2.2";
var welcome5 = {}; 			//  Welcome sub-title
	welcome5["fr"] = "PORTFOLIO OPEN SOURCE";
	welcome5["en"] = "OPEN SOURCE PORTFOLIO";
	var listinfo = {};       // Welcome text
	listinfo["fr"] = "";
	listinfo["en"] = "";
//-----------PUBLIC PAGE -----------------------
var welcome = {};// Welcome title
	welcome["fr"] = "<img class='img-responsive' src='"+karuta_url+"/karuta/img/logofonbleu.jpg'/>";
	welcome["en"] = "<img class='img-responsive' src='"+karuta_url+"/karuta/img/logofonbleu.jpg'/>";
//--------- PUBLIC EMAIL LOGO - MESSAGE -------
var url = window.location.href;
var serverURL = url.substring(0,url.indexOf(appliname)-1);
var g_sendEmailPublicURL_logo = serverURL+"/karuta/karuta/img/logofonbleu.jpg";
var g_sendEmailPublicURL_message ="&lt;img src='"+g_sendEmailPublicURL_logo+"' style='width:300px;margin-bottom:4px;margin-top:30px;'&gt;";
g_sendEmailPublicURL_message +=  "&lt;div style='margin:30px;border-radius:4px;padding:10px;border: 1px solid lightGrey;box-shadow: 3px 3px 3px #CCC'&gt;";
g_sendEmailPublicURL_message += "&lt;br/&gt;#firstname# #lastname# #want-sharing#";
g_sendEmailPublicURL_message += "&lt;div style='font-weight:bold;font-size:14pt;margin:30px;width:150px;'&gt;";
g_sendEmailPublicURL_message +="&lt;a href='#do not edit this#' style='text-decoration: none;color:black;padding:10px;padding-left:40px;padding-right:40px;border-radius:4px;background-color:lightgrey'&gt;";
g_sendEmailPublicURL_message += "#see#";
g_sendEmailPublicURL_message +="&lt;/a&gt;";
g_sendEmailPublicURL_message +="&lt;/div&gt;";
g_sendEmailPublicURL_message += "Karuta Team";
g_sendEmailPublicURL_message +="&lt;/div&gt;";
//----------------------------------------------
var specificmenus = false;


//==============================
function loadJS(url)
//==============================
{
	document.write("<script src='"+url+"'></script>");
};
