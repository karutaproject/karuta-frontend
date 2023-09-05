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
var iid = getURLParameter('i');
var nid = getURLParameter('n');
//------------------------------
var lang = getURLParameter('lang');
if (lang==null)
	lang = LANG ;
//-------------------------------


//==============================
function displayKarutaPublic()
//==============================
{
	var html = "";
	html += "<div id='main-container'>";
	html += "<div id='main-portfolio' class='container-fluid public-container'>";
	html += "<div id='portfolio-container'>";
	html += "<div class='main-row row'>";
	html += "	<div class='col-sm-3'>";
//	html += "		<div id='welcome'></div>";
	html += "		<div id='sidebar'><div id='sidebar-content'><div  class='panel-group' id='sidebar-parent' role='tablist'></div></div></div>";
	html += "	</div>";
	html += "	<div class='col-sm-9' id='contenu'></div>";
	html += "</div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());

	//---------------------------
	$("#welcome").html(welcome[LANG]);
	//----------------
	getLanguage();
	loadLanguages(function() {
//				getLanguage();
	});
	$.ajax({
		async:false,
		type : "GET",
		url : serverBCK+"/direct?i=" + iid,
		success : function(data) {
			g_uuid = data;
			//----------------
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/credential",
				success : function(data) {
					USER = new UIFactory["User"]($("user",data));
				},
				error : function( jqXHR, textStatus, errorThrown ) {
					if (jqXHR.status=="401") {
						window.location = "login.htm?i="+iid+"&lang="+lang;
					}						
				}
			});
			setConfigurationTechVariables(LANGCODE);
			setConfigurationUIVariables(LANGCODE);
			applyKarutaConfiguration();
			url : serverBCK_API+"/nodes/node/" + g_uuid,
			
			//----------------
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes/node/" + g_uuid,
				success : function(data) {
					let nodeid = (nid!=undefined)? nid : g_uuid;
					g_edit = true; //no edit button
					g_portfolio_current = data;
					UICom.parseStructure(data);
					var depth = 99;
					var rootnode = UICom.structure['ui'][nodeid];
					if (rootnode.asmtype=='asmRoot' || rootnode.asmtype=='asmStructure')
						depth = 1;
					// --------------------------
					var role = $(":root",data).attr("role");
					if (role!="") {
						g_userroles[0] = g_userroles[1] = role;
					} else {
						g_userroles[0] = g_userroles[1] ='designer';
						g_designerrole = true;
						g_visible = localStorage.getItem('metadata');
						toggleMetadata(g_visible);
					}
					setCSSportfolio(data);
					setLanguage(lang,'publichtm');
					if (rootnode.asmtype=='asmRoot' || rootnode.asmtype=='asmStructure') {
						UIFactory.Node.displaySidebarItem(nodeid,'sidebar-parent','standard',LANGCODE,false,nodeid);
//						UIFactory["Node"].displaySidebar(UICom.structure['tree'][nodeid],'sidebar','standard',LANGCODE,false,nodeid);
					}
					$("#contenu").html("<div id='page' uuid='"+nodeid+"'></div>");
					var semtag =  ($("metadata",rootnode.node)[0]==undefined || $($("metadata",rootnode.node)[0]).attr('semantictag')==undefined)?'': $($("metadata",rootnode.node)[0]).attr('semantictag');
					if (semtag == 'bubble_level1') {
						$("#main-container").html("");
						UICom.structure["ui"][nodeid].displayNode('standard',UICom.structure['tree'][nodeid],'main-container',depth,LANGCODE,true);
					}
					else
						UICom.structure["ui"][nodeid].displayNode('standard',UICom.structure['tree'][nodeid],'contenu',depth,LANGCODE,true);
					var welcomes = $("asmUnit:has(metadata[semantictag*='WELCOME'])",data);
					if (welcomes.length==0) // for backward compatibility
						welcomes = $("asmUnit:has(metadata[semantictag*='welcome-unit'])",data);
					if (welcomes.length>0){
						var welcomeid = $(welcomes[0]).attr('id');
						$("#sidebar_"+welcomeid).click();
					} else {
						var root = $("asmRoot",data);
						var rootid = $(root[0]).attr('id');
						$("#sidebar_"+rootid).click();
					}
				},		
				error : function( jqXHR, textStatus, errorThrown ) {
					alert("Fermer votre browser et rouvrir le lien pour accéder au portfolio.");
				}
			});
		},
		error : function( jqXHR, textStatus, errorThrown ) {
			alert("Get portfolio: "+jqXHR.status + " "+errorThrown)
		}
	});
	$(document).click(function(e) {
		if (!$(e.target).is('.tooltip')) {
			$('.tooltip').hide();
		}
	});
}


