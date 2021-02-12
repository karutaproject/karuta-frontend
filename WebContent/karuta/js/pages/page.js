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
var pageid = getURLParameter('i');
//------------------------------
var type = getURLParameter('type');
if (type==null)
	type = "standard" ;
//------------------------------
var lang = getURLParameter('lang');
//-------------------------------

//==============================
function displayOnePage()
//==============================
{
	var html = "";
	html += "<div id='main-container' class='container-fluid public-container'>";
	html += "<div class='row public-row'>";
	html += "	<div class='col-md-3'>";
	html += "		<div id='welcome'></div>";
	html += "		<div id='sidebar'></div>";
	html += "	</div>";
	html += "	<div class='col-md-9' id='contenu'></div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());
	$('body').append(previewBox());

	//---------------------------
	$("#welcome").html(welcome[LANG]);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
			if (!USER.admin) {
				$.ajax({ // get group-role for the user
					Accept: "application/xml",
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/credential/group/" + pageid,
					success : function(data) {
						var usergroups = $("group",data);
						for (var i=0;i<usergroups.length;i++) {
//							g_userroles[i+1] = $("role",usergroups[i]).text();
							g_userroles[i+1] = $("rolename",usergroups[i]).text();
						}
						g_userroles[0] = g_userroles[1]; // g_userroles[0] played role by designer
						if (g_userroles[1]=='designer')
							g_designerrole = true;
					}
				});
			}
			loadLanguages(function() {
				if (lang==null)
					getLanguage(false);
				else
					setLanguage(lang);
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/nodes/node/" + pageid + "?resources=true",
					success : function(data) {
						UICom.parseStructure(data);
						if (type=='standard')
							UICom.structure['ui'][pageid].displayNode('standard',UICom.structure['tree'][pageid],'contenu',100,LANGCODE,g_edit);
						if (type=='translate')
							UIFactory['Node'].displayTranslate(UICom.structure['tree'][pageid],'contenu',100,LANGCODE,g_edit);
						if (type=='model'){
							UIFactory['Node'].displayModel(UICom.structure['tree'][pageid],'contenu',100,LANGCODE,g_edit);
						}
						$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

						//---------------------------
						if (g_display_type=="standard")
							loadLanguages();
						if (g_encrypted)
							g_rc4key = window.prompt(karutaStr[LANG]['get_rc4key']);
						$("#wait-window").hide();
					}
				});
			});
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$(document).click(function(e) {
	    if (!$(e.target).is('.tooltip')) {
	        $('.tooltip').hide();
	    }
	});
	$.ajaxSetup({async: true});
}


