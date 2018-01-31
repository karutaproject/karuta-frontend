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
	var html = "";
	html += "<div id='navigation_bar'></div>";
	html += "<div id='main-container' class='container'>";
	html += "	<div class='row-fluid'>";
	html += "		<div class='col-md-5'>";
	html += "			<div id='welcome1'></div>";
	html += "			<div id='welcome2'></div>";
	html += "			<div id='welcome3'></div>";
	html += "			<h2 id='welcome4' style='font-size:250%;margin-top:20px;'></h2>";
	html += "		</div>";
	html += "		<div class='col-md-7'>";
	html += "			<div class='form-signin' id='login'></div>";
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$('body').html(html);
	$('body').append(alertBox());

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
		$("#navigation_bar").html(getNavBar('create_account',null));
		$("#login").html(getInputs());$("#welcome4").html(karutaStr[LANG]['create_account']);
	});
	if (typeof welcome1 != 'undefined') {
		$("#welcome1").html(welcome1[LANG]);
		$("#welcome2").html(welcome2[LANG]);
		$("#welcome3").html(welcome3[LANG]);
	}
}


