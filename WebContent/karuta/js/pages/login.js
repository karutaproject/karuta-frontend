

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
	localStorage.setItem('pwd',document.getElementById("password").value);
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
	html += "<div id='connection-cas'>";
	html += "<h5>"+karutaStr[LANG]['connection-cas1']+"</h5>";
	html += "<button class='button-login' onclick='javascript:callCAS()'>"+karutaStr[LANG]['login']+"</button>";
	html += "<h5>"+karutaStr[LANG]['connection-cas2']+"</h5>";
	html += "</div>";

	html += "<input id='useridentifier' class='form-control' placeholder=\""+karutaStr[LANG]['username']+"\" type='text'>";
	html += "<input id='password' class='form-control' placeholder=\""+karutaStr[LANG]['password']+"\" type='password'>";
	html += "<button class='button-login' onclick=\"javascript:callSubmit('"+encrypt_url+"','"+lang+"')\">"+karutaStr[LANG]['login']+"</button>";
	return html;
}

//==============================
function getNewPassword()
//==============================
{
	var html = "";
	html += "<a onclick=\"$('#show-newpassword').show()\" style='cursor:pointer'>"+karutaStr[LANG]['newpassword']+"</a>";
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
	setLoginTechnicalVariables();
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
	html += "		<div id='maintenance' style='display:none'></div>";
	html += "		<div id='login'></div>";
	html += "	</div>";
	html += "	<div class='form-newpassword' id='newpassword'></div>";
	html += "	<div class='form-newaccount' id='newaccount'></div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	$('body').append(alertBox());
	$('body').append(EditBox());
	$("#navigation-bar").html(getNavBar('login',null));
	$("#login").html($(getLogin(encrypt_url,lang)));
	$("#connection-cas").hide();
	$("#useridentifier").focus();
	if (typeof cas_url != 'undefined' && cas_url!="")
		$("#connection-cas").show();
	applyNavbarConfiguration();
	applyLoginConfiguration();
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
	var root = document.documentElement;
	//========================================
	$('body').css("background-image", g_configVar['login-background-image']);
	//========================================
	$('#welcome1').html(g_configVar['login-logo']);
	$("#welcome1").attr("style",g_configVar['login-logo_style']);
	//---------------------
	if (g_configVar['login-subtitle']!=undefined && g_configVar['login-subtitle']!="") {
		$('#welcome2').html(g_configVar['login-subtitle']);
		$("#welcome2").attr("style",g_configVar['login-subtitle-style']);
	} else 
		$('#welcome2').html(welcome2[LANG]);
	//---------------------
	if (g_configVar['login-subtext']!=undefined && g_configVar['login-subtext']!="") {
		$('#welcome3').html(g_configVar['login-subtext']);
		$("#welcome3").attr("style",g_configVar['login-subtext-style']);
	} else 
		$('#welcome3').html(welcome3[LANG]);
	//---------------------
	setConfigLoginColor(root,'list-menu-background-color');
	setConfigLoginColor(root,'list-menu-text-color');
	//---------------------
	setConfigLoginColor(root,'login-background-color');
	setConfigLoginColor(root,'login-text-color');
	setConfigLoginColor(root,'login-button-background-color');
	setConfigLoginColor(root,'login-button-text-color');
	//========================================
	if (g_configVar['login-new-password-display']=="1") {
		$('#newpassword').html(getNewPassword());
		setConfigLoginColor(root,'login-new-password-background-color');
		setConfigLoginColor(root,'login-new-password-text-color');
		setConfigLoginColor(root,'login-new-password-button-background-color');
		setConfigLoginColor(root,'login-new-password-button-text-color');
	} else
		$('#newpassword').hide();
	//========================================
	if (g_configVar['login-new-account-display']=="1") {
		$('#newaccount').html(getNewAccount());
		setConfigLoginColor(root,'login-new-account-background-color');
		setConfigLoginColor(root,'login-new-account-text-color');
		setConfigLoginColor(root,'login-new-account-button-background-color');
		setConfigLoginColor(root,'login-new-account-button-text-color');
	} else
		$('#newaccount').hide();
	//========================================
	if (g_configVar['maintenance-display']=="1") {
		$('#welcome2').hide();
		$('#welcome3').hide();
		$('#login').hide();
		$('#maintenance').show();
		$('#maintenance').html(g_configVar['maintenance-text']);
		$("#maintenance").attr("style",g_configVar['maintenance-text-style']);
		$("#welcome1").attr("onclick","$('#login').show()");
	} else
		$('#maintenance').hide();
}

//==============================
function setLoginConfigurationVariables()
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration-ui?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			//---------Navigation Bar--------------
			g_configVar['navbar-text-color'] = getText('config-navbar-text-color','Color','text',data,LANGCODE);
			g_configVar['navbar-background-color'] = getText('config-navbar-background-color','Color','text',data,LANGCODE);
			//---------- Login -------------
			g_configVar['login-background-image'] = getBackgroundURL('config-login-background-image',data,LANGCODE);
			g_configVar['login-background-color'] = getText('config-login-background-color','Color','text',data,LANGCODE);
			g_configVar['login-text-color'] = getText('config-login-text-color','Color','text',data,LANGCODE);
			g_configVar['login-button-background-color'] = getText('config-login-button-background-color','Color','text',data,LANGCODE);
			g_configVar['login-button-text-color'] = getText('config-login-button-text-color','Color','text',data,LANGCODE);
			//-----------New Password ----------
			g_configVar['login-new-password-background-color'] = getText('config-login-new-password-background-color','Color','text',data,LANGCODE);
			g_configVar['login-new-password-text-color'] = getText('config-login-new-password-text-color','Color','text',data,LANGCODE);
			g_configVar['login-new-password-button-background-color'] = getText('config-login-new-password-button-background-color','Color','text',data,LANGCODE);
			g_configVar['login-new-password-button-text-color'] = getText('config-login-new-password-button-text-color','Color','text',data,LANGCODE);
			//------------New Account ---------
			g_configVar['login-new-account-background-color'] = getText('config-login-new-account-background-color','Color','text',data,LANGCODE);
			g_configVar['login-new-account-text-color'] = getText('config-login-new-account-text-color','Color','text',data,LANGCODE);
			g_configVar['login-new-account-button-background-color'] = getText('config-login-new-account-button-background-color','Color','text',data,LANGCODE);
			g_configVar['login-new-account-button-text-color'] = getText('config-login-new-account-button-text-color','Color','text',data,LANGCODE);
			//------------Menu ---------
			g_configVar['list-menu-background-color'] = getText('config-list-menu-background-color','Color','text',data,LANGCODE);
			g_configVar['list-menu-text-color'] = getText('config-list-menu-text-color','Color','text',data,LANGCODE);
		}
	});
}

//==============================
function setLoginTechnicalVariables()
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration-tech?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			//---------Languages--------------
			g_configVar['default-language'] = getText('default-language','Get_Resource','code',data,0);
			var language_nodes = $("metadata[semantictag='portfolio-language']",data);
			for (i=0;i<language_nodes.length;i++){
				languages[i] = $("code",$("asmResource[xsi_type='Get_Resource']",$(language_nodes[i]).parent())).text();
			}
			loadLanguages(function() {
				getLanguage();
			});
			//---------Navigation Bar--------------
			g_configVar['navbar-brand-logo'] = getImg('config-navbar-brand-logo',data,LANGCODE);
			g_configVar['navbar-brand-logo-style'] = getContentStyle('config-navbar-brand-logo',data);
			//---------- Login -------------
			g_configVar['login-logo'] = getImg('config-login-logo',data,LANGCODE);
			g_configVar['login_logo_style'] = getContentStyle('config-login-logo',data);
			g_configVar['login-subtitle'] = getText('config-login-subtitle','Field','text',data,LANGCODE);
			g_configVar['login-subtitle-style'] = getContentStyle('config-login-subtitle',data);
			g_configVar['login-subtext'] = getText('config-login-subtext','Field','text',data,LANGCODE);
			g_configVar['login-subtext-style'] = getContentStyle('config-login-subtext',data);
			//-----------New Password ----------
			g_configVar['login-new-password-display'] = getText('config-login-new-password-display','Get_Resource','value',data);
			//------------New Account ---------
			g_configVar['login-new-account-display'] = getText('config-login-new-account-display','Get_Resource','value',data);
			//------------Maintenance ---------
			g_configVar['maintenance-display'] = getText('config-maintenance-display','Get_Resource','value',data);
			g_configVar['maintenance-text'] = getText('config-maintenance-text','TextField','text',data,LANGCODE);
			g_configVar['maintenance-text-style'] = getContentStyle('config-maintenance-text',data);
		},
		error : function() {
			loadLanguages(function() {
				getLanguage();
			});
		}
	});
}


//=======================================================================
function setConfigLoginColor(root,configname) 
// =======================================================================
{
	var color = g_configVar[configname];
	if (color!=undefined)
		root.style.setProperty("--"+configname,color);
}

