//----------------------------------
var application_version = "2.0";
var application_date = "2017-10-30";
//----------------------------------
var appliname = 'karuta3.0';
var bckname = '3.0';
var serverBCK = "../../../karuta-backend"+bckname; // fileserver backend
var serverBCK_API = "../../../karuta-backend"+bckname+"/rest/api";
var cas_url = "";
var new_bck = false;
//-------- LANGUAGES------------
var languages = [];
languages [0] = 'fr';
languages [1] = 'en';
//----------------------------------
var NONMULTILANGCODE = 0;  // default language if non-multilingual
var LANGCODE = 0; //default value
var LANG = languages[LANGCODE]; //default value
//----------------------------------
var audiovideohtml5 = true;
var g_configVar = {}; //list of configuration variables
g_configVar['maxfilesizeupload'] = '32';
g_configVar['maxuserlist'] = '4';
//----------------------------------
var technical_support = ""; // email of technical support
var demo = false;
g_configVar['login-new-password-display'] = "0";
g_configVar['login-new-account-display'] = "0";
//--------- NAVBAR BRAND ------------------ logo 126 x 34
g_configVar['navbar-brand-logo'] = "<img src='../../karuta/img/logofonblanc.jpg'/>";
//-----------LOGIN PAGE -----------------------
g_configVar['login-logo'] = "<img class='img-fluid' src='../../karuta/img/logofonbleu.jpg'/>";
var welcome2 = {};			//  Welcome title
welcome2["fr"] = "BIENVENUE DANS KARUTA 3.0";
welcome2["en"] = "WELCOME TO KARUTA 3.0";
var welcome3 = {}; 			//  Welcome sub-title
welcome3["fr"] = "PORTFOLIO OPEN SOURCE";
welcome3["en"] = "OPEN SOURCE PORTFOLIO";
//---------MAIN PAGE-------------------------
var welcome4 = {};			//  Welcome title
	welcome4["fr"] = "BIENVENUE DANS KARUTA 3.0";
	welcome4["en"] = "WELCOME TO KARUTA 3.0";
var welcome5 = {}; 			//  Welcome sub-title
	welcome5["fr"] = "PORTFOLIO OPEN SOURCE";
	welcome5["en"] = "OPEN SOURCE PORTFOLIO";
//-----------PUBLIC PAGE -----------------------
var welcome = {};// Welcome title
	welcome["fr"] = "<img class='img-fluid' src='../../karuta/img/logofonbleu.jpg'/>";
	welcome["en"] = "<img class='img-fluid' src='../../karuta/img/logofonbleu.jpg'/>";
//--------- PUBLIC EMAIL LOGO - MESSAGE -------
var url = window.location.href;
var serverURL = url.substring(0,url.indexOf("/application/htm"));
if (url.indexOf("/application/htm")<0)
	serverURL = url.substring(0,url.indexOf("/karuta/htm"));
var g_sendEmailPublicURL_logo = serverURL+"/karuta/img/logofonbleu.jpg";
var g_sendEmailPublicURL_message ="&lt;img src='"+g_sendEmailPublicURL_logo+"' style='width:300px;margin-bottom:4px;margin-top:30px;'&gt;";
g_sendEmailPublicURL_message +=  "&lt;div style='margin:30px;border-radius:4px;padding:10px;border: 1px solid lightGrey;box-shadow: 3px 3px 3px #CCC'&gt;";
g_sendEmailPublicURL_message += "&lt;br/&gt;##firstname## ##lastname## #want-sharing#";
g_sendEmailPublicURL_message += "&lt;div style='font-weight:bold;font-size:14pt;margin:30px;width:150px;'&gt;";
g_sendEmailPublicURL_message +="&lt;a href='#do not edit this#' style='text-decoration: none;color:black;padding:10px;padding-left:40px;padding-right:40px;border-radius:4px;background-color:lightgrey'&gt;";
g_sendEmailPublicURL_message += "#see#";
g_sendEmailPublicURL_message +="&lt;/a&gt;";
g_sendEmailPublicURL_message +="&lt;/div&gt;";
g_sendEmailPublicURL_message += "Karuta Team";
g_sendEmailPublicURL_message +="&lt;/div&gt;";
//----------------------------------------------
var specificmenus = false;
var csvseparator = ";";
