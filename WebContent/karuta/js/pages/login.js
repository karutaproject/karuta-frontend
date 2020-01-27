//==================================
function getURLParameter(sParam) {
//==================================
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for ( var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

//==============================
function loadCSS(url)
//==============================
{
//	document.write("<link rel='stylesheet' type='text/css' href='"+url+"'></link>");
	var link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(link);
}

//==============================
function loadLESS(url)
//==============================
{
//	document.write("<link rel='stylesheet/less' type='text/css' href='"+url+"'></link>");
	var link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet/less';
	document.getElementsByTagName('head')[0].appendChild(link);
}

//==============================
function loadJS(url)
//==============================
{
	document.write("<script src='"+url+"'></script>");
}

//==============================
function loadLoginPage(url)
//==============================
{
	//--------------------------------------------------------------
	loadCSS(url+"/other/bootstrap/css/bootstrap.min.css");
	loadCSS(url+"/other/css/jquery-ui.css");
	loadCSS(url+"/other/css/font-awesome/css/font-awesome.min.css");
	//--------------------------------------------------------------
	var karuta_config = "../../../"+appliname+"/application/css/color.less";
	less = {
		    globalVars: {
		    	'KARUTA-CONFIG': "'"+karuta_config+"'"
		    }
		  };
	loadLESS(url+"/karuta/css/welcome.less");
	loadJS(url+"/other/js/less.min.js")
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/karuta.js");
	loadJS(url+"/karuta/js/UICom.js");
	//--------------------------------------------------------------
	loadJS(url+"/other/js/jquery-1.10.2.js");
	loadJS(url+"/other/js/jquery-ui-1.10.3.custom.min.js");
	loadJS(url+"/other/bootstrap/js/bootstrap.min.js");
	loadJS(url+"/other/js/jquery.ui.touch-punch.min.js");
	//--------------------------------------------------------------
	if (elgg_installed) {
		loadJS(url+"/socialnetwork-elgg/js/socialnetwork.js");
		loadJS(url+"/socialnetwork-elgg/js/moment-with-locales.min.js");		
	}
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/model/Type_Portfolio.js");
	loadJS(url+"/karuta/js/model/Type_Node.js");
	loadJS(url+"/karuta/js/model/Type_User.js");
	//--------------------------------------------------------------
	loadJS(url+"/other/js/js.cookie.js");
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/version.js");
	//--------------------------------------------------------------
}

//==================================
function callCAS()
//==================================
{
	var url = window.location.href;
	var serverURL = url.substring(0,url.lastIndexOf(appliname+"/")-1);
	var locationURL = cas_url+"/login?service="+serverURL+"/"+serverBCK_API.substring(9)+"/credential/login/cas?redir="+serverURL+"/"+appliname+"/application/htm/karuta.htm";
	window.location = locationURL;
}

//==================================
function callOpenid()
//==================================
{
	var url = window.location.href;
	var serverURL = url.substring(0,url.lastIndexOf(appliname+"/")-1);
	var locationURL = openid_url+"?client_id=";
	window.location = locationURL;
}

//==============================
function callSubmit(encrypt_url,lang)
//==============================
{
	var data = "<credential><login>"+document.getElementById("useridentifier").value+"</login><password>"+document.getElementById("password").value+"</password></credential>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/login",
		data: data,
		i : encrypt_url,
		lang :lang,
		success : function(data) {
			if (elgg_installed!=undefined && elgg_installed)
				if (self.encrypt_url=="")
					loginElgg(document.getElementById("useridentifier").value,document.getElementById("password").value,function (){window.location="karuta.htm";});
				else
					loginElgg(document.getElementById("useridentifier").value,document.getElementById("password").value,function (){window.location="public.htm?i="+self.encrypt_url+"&lang="+self.lang;});
			else 
				if (self.encrypt_url=="")
					window.location="karuta.htm";
				else
					window.location="public.htm?i="+self.encrypt_url+"&lang="+self.lang
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+jqxhr.responseText);
		}
	});
}

//==============================
function callSend()
//==============================
{
	var data = "<credential><login>"+document.getElementById("useridentifier_new").value+"</login></credential>";
	$.ajaxSetup({
		Accept: "application/xml",
		contentType: "application/xml"
		});
	$.ajax({
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/forgot",
		data: data,
		success : function(data) {
			alertHTML(karutaStr[LANG]['password-sent']);
			window.location="login.htm?lang="+LANG;
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+karutaStr[LANG]['inexistent-user']);
		}
	});
}

//==============================
function getLogin(encrypt_url,lang)
//==============================
{
	var html = "";
	html += "<div id='connection-cas' style='display:none'>";
	html += "<h5>Connexion avec un compte universitaire (CAS)</h5>";
	html += "<button class='button-login' onclick='javascript:callCAS()'>"+karutaStr[LANG]['login']+"</button>";
	html += "<h5>Connexion hors compte universitaire</h5>";
	html += "</div>";

	html += "<div id='connection-openid' style='display:none'>";
	html += "<img width='200px' src='../../karuta/img/microsoft-logo.png'/>"
	html += "<h5>Vous avez un compte Microsoft</h5>";
	html += "<button class='button-login' onclick='javascript:callOpenid()'>"+karutaStr[LANG]['login']+"</button>";
	html += "<h5>Connexion hors compte universitaire</h5>";
	html += "</div>";

	html += "<input id='useridentifier' class='form-control' placeholder=\""+karutaStr[LANG]['username']+"\" type='text'>";
	html += "<input id='password' class='form-control' placeholder=\""+karutaStr[LANG]['password']+"\" type='password'>";
	html += "<button class='button-login' onclick=\"javascript:callSubmit('"+encrypt_url+"','"+lang+"')\">"+karutaStr[LANG]['login']+"</button>";
	return html;
}

//==============================
function getNew()
//==============================
{
	var html = "";
	html += "<a onclick=\"$('#show-newpassword').show()\">"+karutaStr[LANG]['newpassword']+"</a>";
	html +="<div id='show-newpassword' style='display:none'>"
	html += "<input id='useridentifier_new' class='form-control' placeholder=\""+karutaStr[LANG]['username']+"\" type='text'/>";
	html += "<button id='form-send' onclick='javascript:callSend()'>"+karutaStr[LANG]['button-send']+"</button>";
	html += "<p><br/>"+karutaStr[LANG]['tipnewpassword']+"</p>";
	html += "</div>"
	return html;
}

//==============================
function getNewAccount()
//==============================
{
	var html = "";
	html += "<p>"+karutaStr[LANG]['new-account']+"</p>";
	html += "<a class='btn btn-account' href='createAccount.htm?lang="+LANG+"'>"+karutaStr[LANG]['sign-up']+"</a>";
	return html;
}

//==============================
function displayKarutaLogin()
//==============================
{
	var html = "";
	html += "<div id='main-welcome'>";
	html += "<div id='navigation_bar'></div>";
	html += "<div id='main-container' class='container'>";
	html += "	<div class='form-signin'>";
	html += "		<div id='welcome1'></div>";
	html += "		<div id='welcome-version'></div>";
	html += "		<div id='welcome2'></div>";
	html += "		<div id='welcome3'></div>";
	html += "		<div id='login'></div>";
	html += "	</div>";
	html += "	<div class='form-newpassword' id='newpassword'></div>";
	html += "	<div class='form-newaccount' id='newaccount'></div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	$('body').append(alertBox());
	$('body').append(EditBox());

	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK+"/version",
		data: "",
		success : function(data) {		
			karuta_backend_version = $("number",$("#backend",data)).text();
			karuta_backend_date = $("date",$("#backend",data)).text();
			karuta_fileserver_version = $("number",$("#fileserver",data)).text();
			karuta_fileserver_date = $("date",$("#fileserver",data)).text();
		}
	});
	loadLanguages(function(data) {
		getLanguage();
		$("#navigation_bar").html(getNavBar('login',null));
		$("#login").html(getLogin(encrypt_url,lang));
		$("#useridentifier").focus();
		if (typeof myVar != 'undefined' && karuta_forgot_password)
			$("#newpassword").html(getNew());
		if(karuta_create_account)
			$("#newaccount").html(getNewAccount());
		if (typeof cas_url != 'undefined' &&cas_url!="")
			$("#connection-cas").show();
		if (typeof openid_url != 'undefined' &&openid_url!="")
			$("#connection-openid").show();
	});
	$('#password').keypress(function(e) {
		var code= (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
			callSubmit();
	});
	if (typeof welcome1 != 'undefined') {
		$("#welcome1").html(welcome1[LANG]);
		var version_html = "<div style='color:black;text-align:center;font-size:14px;margin-bottom:15px;'>Version "+karuta_version+"</div>";
	//	$("#welcome-version").html(version_html);
		$("#welcome2").html(welcome2[LANG]);
		$("#welcome3").html(welcome3[LANG]);
	}
	$.ajaxSetup({async: true});
}

//------------------------------
//------------------------------
//------------------------------
var encrypt_url = getURLParameter('i');
if (encrypt_url==null)
	encrypt_url = "" ;
//------------------------------
var lang = getURLParameter('lang');
if (lang==null)
	lang = "" ;
//-------------------------------

