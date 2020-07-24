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

//------------------------------
var lang = getURLParameter('lang');
if (lang==null)
	lang = "" ;
//-------------------------------


//==============================
function loadCSS(url)
//==============================
{
	document.write("<link rel='stylesheet' type='text/css' href='"+url+"'></link>");
};

//==============================
function loadLESS(url)
//==============================
{
	document.write("<link rel='stylesheet/less' type='text/css' href='"+url+"'></link>");
};

//==============================
function loadJS(url)
//==============================
{
	document.write("<script src='"+url+"'></script>");
};

//==============================
function loadCreateAccountPage(url)
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
	loadJS(url+"/karuta/js/model/Type_Portfolio.js");
	loadJS(url+"/karuta/js/model/Type_Node.js");
	loadJS(url+"/karuta/js/model/Type_User.js");
	//--------------------------------------------------------------
	loadJS(url+"/other/js/js.cookie.js");
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/version.js");
	//--------------------------------------------------------------
}

//==============================
function callSubmit()
//==============================
{
	var ok = true;
	var useridentifier = $("#useridentifier").val();
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	var password = $("#password").val();
	if (useridentifier==""){
		alert("email is required");
		ok =false;
	}
	if (lastname==""){
		alert("lastname is required");
		ok =false;
	}
	if (firstname==""){
		alert("firstname is required");
		ok =false;
	}
	if (ok) {
		var xml = "";
		xml +="<?xml version='1.0' encoding='UTF-8'?>";
		xml +="<users>";
		xml +="<user>";
		xml +="	<username>"+useridentifier+"</username>";
		xml +="	<lastname>"+lastname+"</lastname>";
		xml +="	<firstname>"+firstname+"</firstname>";
		xml +="	<email>"+useridentifier+"</email>";
		xml +="	<other>xlimited</other>";
		xml +="</user>";
		xml +="</users>";
		var url = "../../../"+serverBCK+"/register";
		$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : xml,
			success : function(data) {
				alert(karutaStr[LANG]['password-sent']);
				window.location="login.htm";
			}
		});
	}
}
	
	//==============================
	function getInputs()
	//==============================
	{
		var html = "";
		html += "<input id='useridentifier' class='form-control' placeholder='"+karutaStr[LANG]['email']+"' type='text'>";
		html += "<input id='firstname' class='form-control' placeholder='"+karutaStr[LANG]['firstname']+"' type='text'>";
		html += "<input id='lastname' class='form-control' placeholder='"+karutaStr[LANG]['lastname']+"' type='text'>";
		html += "<br><button class='btn btn-large btn-primary' onclick='javascript:callSubmit()'>"+karutaStr[LANG]['create_account']+"</button>";
		return html;
	}

	//------------------------------
	var lang = getURLParameter('lang');
	if (lang!=null) {
		LANG = lang;
		for (var i=0; i<languages.length;i++){
			if (languages[i]==lang)
				LANGCODE = i;
		}
	}
	//------------------------------

//==============================
function displayKarutaCreateAccount()
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
	html += "		<div id='login'></div>";
	html += "	</div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	$('body').append(alertBox());

	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK+"/version",
		data: "",
		success : function(data) {		
			karuta_backend_version = $("number",$("#backend",data)).text();
			karuta_backend_date = $("date",$("#backend",data)).text();
			karuta_fileserver_version = $("number",$("#fileserver",data)).text();
			karuta_fileserver_date = $("date",$("#fileserver",data)).text();
			$("#navigation-bar").html(getNavBar('create_account',null));
			$("#login").html(getInputs());$("#welcome4").html(karutaStr[LANG]['create_account']);
			applyNavbarConfiguration();
			applyLoginConfiguration();
		}
	});
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
	if (g_configVar['login-subtitle']!=undefined) {
		$('#welcome2').html(g_configVar['login-subtitle']);
		$("#welcome2").attr("style",g_configVar['login-subtitle-style']);
	} else 
		$('#welcome2').html(welcome2[LANG]);
	//---------------------
	if (g_configVar['login-subtext']!=undefined) {
		$('#welcome3').html(g_configVar['login-subtext']);
		$("#welcome3").attr("style",g_configVar['login-subtext-style']);
	} else 
		$('#welcome3').html(welcome3[LANG]);
	//---------------------
	setConfigLoginColor(root,'login-background-color');
	setConfigLoginColor(root,'login-text-color');
	setConfigLoginColor(root,'login-button-background-color');
	setConfigLoginColor(root,'login-button-text-color');
}
