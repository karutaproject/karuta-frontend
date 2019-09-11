

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

//==================================
function callCAS()
//==================================
{
	var url = window.location.href;
	var serverURL = url.substring(0,url.lastIndexOf(appliname+"/")-1);
	var locationURL = cas_url+"/login?service="+serverURL+"/"+serverBCK_API.substring(9)+"/credential/login/cas?redir="+serverURL+"/"+appliname+"/application/htm/karuta.htm";
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
function loginPublic()
//==============================
{
	var data = "<credential><login>public</login><password>public</password></credential>";
	$.ajax({
		async:false,
		contentType: "application/xml",
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/login",
		data: data,
		success : function(data) {
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
	html += "<a id='newaccount-button' class='btn btn-account' href='createAccount.htm?lang="+LANG+"'>"+karutaStr[LANG]['sign-up']+"</a>";
	return html;
}

//==============================
function displayKarutaLogin()
//==============================
{
	loginPublic();
	setLoginConfigurationVariables();
	var html = "";
	html += "<div id='main-welcome'>";
	html += "<div id='navigation-bar'></div>";
	html += "<div id='main-container' class='container'>";
	html += "	<div id='form-signin' class='form-signin'>";
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
	loadLanguages(function(data) {
		getLanguage();
		$("#navigation-bar").html(getNavBar('login',null));
		$("#login").html(getLogin(encrypt_url,lang));
		$("#useridentifier").focus();
		if (typeof cas_url != 'undefined' &&cas_url!="")
			$("#connection-cas").show();
		applyNavbarConfiguration();
		applyLoginConfiguration();
		});
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
	$('#password').keypress(function(e) {
		var code= (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
			callSubmit();
	});
	//----------------------------------------------
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

//==============================
function applyLoginConfiguration()
//==============================
{
	//========================================
	$('body').css("background-image", g_configVar['login-background-image']);
	//========================================
	$('#welcome1').html(g_configVar['login-logo']);
	$("#welcome1").attr("style",g_configVar['login-logo_style']);
	//---------------------
	$('#welcome2').html(g_configVar['login-subtitle']);
	$("#welcome2").attr("style",g_configVar['login-subtitle-style']);
	//---------------------
	$('#welcome3').html(g_configVar['login-subtext']);
	$("#welcome3").attr("style",g_configVar['login-subtext-style']);
	//---------------------
	$('#form-signin').css("background-color",g_configVar['login-background-color']);
	$('#form-signin').css("color",g_configVar['login-text-color']);
	$('button.button-login').css("background-color",g_configVar['login-button-color']);
	$('button.button-login').css("color",g_configVar['login-button-text-color']);
	//========================================
	if (g_configVar['login-new-password-display']=="0")
		$('#newpassword').hide();
	else {
		$('#newpassword').css("background-color",g_configVar['login-new-password-background-color']);
		$('#newpassword').css("color",g_configVar['login-new-password-text-color']);
		$('#form-send').css("background-color",g_configVar['login-new-password-button-color']);
		$('#form-send').css("color",g_configVar['login-new-password-button-text-color']);
	}
	//========================================
	if (g_configVar['login-new-account-display']=="0")
		$('#newaccount').hide();
	else {
		$('#newaccount').css("background-color",g_configVar['login-new-account-background-color']);
		$('#newaccount').css("color",g_configVar['login-new-account-text-color']);
		$('#form-send').css("background-color",g_configVar['login-new-account-button-color']);
		$('#form-send').css("color",g_configVar['login-new-account-button-text-color']);
	}
}

//==============================
function setLoginConfigurationVariables()
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			//---------Languages--------------
			var language_nodes = $("metadata[semantictag='portfolio-language']",data);
			for (i=0;i<language_nodes.length;i++){
				languages[i] = $("code",$("asmResource[xsi_type='Get_Resource']",$(language_nodes[i]).parent())).text();
			}
			loadLanguages(function() {
				getLanguage();
			});
			NONMULTILANGCODE = 0;  // default language if non-multilingual
			LANGCODE = 0; //default value
			LANG = languages[LANGCODE]; //default value
			//---------Navigation Bar--------------
			g_configVar['navbar-brand-logo'] = getImg('config-navbar-brand-logo',data);
			g_configVar['navbar-brand-logo-style'] = getContentStyle('config-navbar-brand-logo',data);
			g_configVar['navbar-text-color'] = getText('config-navbar-text-color','Color','text',data);
			//---------- Login -------------
			g_configVar['login-background-image'] = getBackgroundURL('config-login-background-image',data);
			g_configVar['login-background-color'] = getText('config-login-background-color','Color','text',data);
			g_configVar['login-logo'] = getImg('config-login-logo',data);
			g_configVar['login_logo_style'] = getContentStyle('config-login-logo',data);
			g_configVar['login-subtitle'] = getText('config-login-subtitle','Field','text',data);
			g_configVar['login-subtitle-style'] = getContentStyle('config-login-subtitle',data);
			g_configVar['login-subtext'] = getText('config-login-subtext','Field','text',data);
			g_configVar['login-subtext-style'] = getContentStyle('config-login-subtext',data);
			g_configVar['login-text-color'] = getText('config-login-text-color','Color','text',data);
			g_configVar['login-button-color'] = getText('config-login-button-color','Color','text',data);
			g_configVar['login-button-text-color'] = getText('config-login-button-text-color','Color','text',data);
			//-----------New Password ----------
			g_configVar['login-new-password-display'] = getText('config-login-new-password-display','Get_Resource','value',data);
			g_configVar['login-new-password-background-color'] = getText('config-login-new-password-background-color','Color','text',data);
			g_configVar['login-new-password-text-color'] = getText('config-login-new-password-text-color','Color','text',data);
			g_configVar['login-new-password-button-color'] = getText('config-login-new-password-button-color','Color','text',data);
			g_configVar['login-new-password-button-text-color'] = getText('config-login-new-password-button-text-color','Color','text',data);
			//------------New Account ---------
			g_configVar['login-new-account-display'] = getText('config-login-new-account-display','Get_Resource','value',data);
			g_configVar['login-new-account-background-color'] = getText('config-login-new-account-background-color','Color','text',data);
			g_configVar['login-new-account-text-color'] = getText('config-login-new-account-text-color','Color','text',data);
			g_configVar['login-new-account-button-color'] = getText('config-login-new-account-button-color','Color','text',data);
			g_configVar['login-new-account-button-text-color'] = getText('config-login-new-account-button-text-color','Color','text',data);
		}
	});
}
