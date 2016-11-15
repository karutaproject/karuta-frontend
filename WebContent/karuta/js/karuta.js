/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

//--------- for languages
var karutaStr = new Array();

var portfolioid = null;

// -------------------
var g_userrole = "";
var g_userroles = [];
var g_portfolioid = "";
var g_designerrole = false;
var g_rc4key = "";
var g_encrypted = false;
var g_display_type = "standard"; // default value
var g_edit = true;
var g_visible = 'hidden';
var g_welcome_edit = false;
var g_welcome_add = false;  // we don't display add a welcome page
var g_display_sidebar = true;
var g_free_toolbar_visibility = 'hidden';
//---- caches -----
var g_dashboard_models = {}; // cache for dashboard_models
var g_Get_Resource_caches = {};
//------------------
var g_wysihtml5_autosave = 60000; // 60 seconds
var g_block_height = 220; // block height in pixels
var g_portfolio_current = ""; // XML jQuery Object - must be set after loading xml
var g_portfolio_rootid = "";
var g_toggle_sidebar = [];
var g_current_page = "";
var g_nb_trees = 0;
var g_sum_trees = 0;
//-------------- used for designer-----
var redisplays = {};
// -------------------------------------


//==============================
function setDesignerRole(role)
//==============================
{
	USER.admin = false;
	if (role=='')
		role = 'designer';
	g_userroles[0] = role;
	fillEditBoxBody();
	$("#userrole").html(role);
	if (g_display_type=='standard'){
		var uuid = $("#page").attr('uuid');
		var html = "";
		html += "	<div id='main-row' class='row'>";
		if (g_display_sidebar) {
			html += "		<div class='col-md-3' id='sidebar'></div>";
			html += "		<div class='col-md-9' id='contenu'></div>";
		} else {
			html += "		<div class='col-md-3' id='sidebar' style='display:none'></div>";
			html += "		<div class='col-md-12' id='contenu'></div>";
		}
		html += "	</div>";
		$("#main-page").html(html);
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar','standard',LANGCODE,true,g_portfolio_rootid);
		$("#sidebar_"+uuid).click();
	};
	if (g_display_type=='model'){
		displayPage(UICom.rootid,1,"model",LANGCODE,g_edit);
	}
	if (g_display_type=='header'){
		if (g_userroles[0]!='designer')
			$("#rootnode").hide();
		else
			$("#rootnode").show();
		UIFactory["Portfolio"].displayNodes('header',UICom.root.node,'header',LANGCODE,g_edit);
		UIFactory["Portfolio"].displayMenu('menu','horizontal_menu',LANGCODE,g_edit,UICom.root.node);
		var uuid = $("#page").attr('uuid');
		$("#sidebar_"+uuid).click();
	};
}


//==============================
function getLanguageMenu(js)
//==============================
{
	var html = "";
	for (var i=0; i<languages.length;i++) {
		html += "			<li><a  id='lang-menu-"+languages[i]+"' onclick=\"setLanguage('"+languages[i]+"');if (elgg_installed) displaySocialNetwork();setWelcomeTitles();"+js+"\">";
		html += "<img width='20px;' src='"+karuta_url+"/karuta/img/flags/"+karutaStr[languages[i]]['flag-name']+".png'/>&nbsp;&nbsp;"+karutaStr[languages[i]]['language']+"</a></li>";
	}
	return html;
}


//==============================
function setLanguageMenu(js)
//==============================
{
	for (var i=0; i<languages.length;i++) {
		$("#lang-menu-"+languages[i]).attr("onclick","setLanguage('"+languages[i]+"');if (elgg_installed) displaySocialNetwork();setWelcomeTitles();"+js);
	}
}


//==============================
function getNavBar(type,portfolioid,edit)
//==============================
{
	var html = "";
	html += "<nav class='navbar navbar-default'>";
	html += "<div class='navbar-inner'>";
	html += "	<div class='container-fluid'>";
	html += "	  <div class='nav-bar-header'>";
	html += "		<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#collapse-1'>";
	html += "			<span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span>";
	html += "		</button>";
	html += "		<div class='navbar-brand'>";
	if (typeof navbar_title != 'undefined')
		html += "			<a data-toggle='dropdown' class='brand dropdown-toggle' >"+navbar_title[LANG]+"</a>";
	else
		html += "			<a data-toggle='dropdown' class='brand dropdown-toggle' ><img style='margin-bottom:4px;' src='../../karuta/img/favicon.png'/> KARUTA </a>";
	html += "			<ul style='padding:5px;' class='dropdown-menu versions'>";
	html += "				<li><b>Versions</b></li>";
	html += "				<li>Application : "+application_version+" (" +application_date+")</li>";
	html += "				<li>Karuta-frontend : "+karuta_version+" (" +karuta_date+")</li>";
	html += "				<li>Karuta-backend : "+karuta_backend_version+" (" +karuta_backend_date+")</li>";
	html += "				<li>Karuta-fileserver : "+karuta_fileserver_version+" (" +karuta_fileserver_date+")</li>";
	html += "			</ul>";
	html += "		</div>";
	html += "	  </div>";
	//---------------------HOME - TECHNICAL SUPPORT-----------------------
	html += "		<div class='navbar-collapse collapse' id='collapse-1'>";
	html += "			<ul class='nav navbar-nav'>";
	html += "			<li><a  onclick='show_list_page()' class='navbar-icon'><span class='glyphicon glyphicon-home'></span></a></li>";
	html += "				<li><a href='mailto:"+technical_support+"' class='navbar-icon'><span class='glyphicon glyphicon-wrench' data-title='"+karutaStr[LANG]["technical_support"]+"' data-tooltip='true' data-placement='bottom'></span></a></li>";
	html += "			</ul>";
	//-------------------LANGUAGES---------------------------
	if (languages.length>1) 
		if(type=="create_account") {
			html += "			<ul class='nav navbar-nav'>";
			html += "				<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle navbar-icon' ><img id='flagimage' style='width:25px;margin-top:-5px;' src='"+karuta_url+"/karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png'/>&nbsp;&nbsp;<span class='glyphicon glyphicon-triangle-bottom'></span></a>";
			html += "					<ul class='dropdown-menu'>";
			for (var i=0; i<languages.length;i++) {
				html += "			<li><a  onclick=\"setLanguage('"+languages[i]+"');$('#login').html(getInputs());\"><img width='20px;' src='"+karuta_url+"./karuta/img/flags/"+karutaStr[languages[i]]['flag-name']+".png'/>&nbsp;&nbsp;"+karutaStr[languages[i]]['language']+"</a></li>";
			}
			html += "					</ul>";
			html += "				</li>";
			html += "			</ul>";
		} else
			if(type=="login") {
				html += "			<ul class='nav navbar-nav'>";
				html += "				<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle navbar-icon' ><img id='flagimage' style='width:25px;margin-top:-5px;' src='"+karuta_url+"/karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png'/>&nbsp;&nbsp;<span class='glyphicon glyphicon-triangle-bottom'></span></a>";
				html += "					<ul class='dropdown-menu'>";
				for (var i=0; i<languages.length;i++) {
					html += "			<li><a  onclick=\"setLanguage('"+languages[i]+"');displayKarutaLogin();\"><img width='20px;' src='"+karuta_url+"/karuta/img/flags/"+karutaStr[languages[i]]['flag-name']+".png'/>&nbsp;&nbsp;"+karutaStr[languages[i]]['language']+"</a></li>";
				}
				html += "					</ul>";
				html += "				</li>";
				html += "			</ul>";
			} else {
				html += "			<ul class='nav navbar-nav'>";
				html += "				<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle navbar-icon' ><img id='flagimage' style='width:25px;margin-top:-5px;' src='"+karuta_url+"/karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png'/>&nbsp;&nbsp;<span class='glyphicon glyphicon-triangle-bottom'></span></a>";
				html += "					<ul class='dropdown-menu'>";
//				html += getLanguageMenu("fill_list_page();fill_main_page();$('#search-div').html(getSearch());fill_list_users();fill_exec_batch();fill_exec_report();");
				html += getLanguageMenu("fill_list_page();$('#search-div').html(getSearch());");
				html += "					</ul>";
				html += "				</li>";
				html += "			</ul>";
			}		
	//-----------------ACTIONS-------------------------------
	if (type!='login' && USER!=undefined) {
		if (USER.admin) {
			html += "			<ul class='nav navbar-nav'>";
			html += "				<li>&nbsp;</li>";
			html += "				<li class='dropdown active'><a data-toggle='dropdown' class='dropdown-toggle' >Actions<span class='caret'></span></a>";
			html += "					<ul class='dropdown-menu'>";
			html += "						<li><a  onclick='show_list_page()'>"+karutaStr[LANG]['list_portfolios']+"</a></li>";
			if ($("#main-portfoliosgroup").length && $("#main-portfoliosgroup").html()!="")
				html += "						<li><a  onclick='show_list_portfoliosgroups()'>"+karutaStr[LANG]['list_portfoliosgroups']+"</a></li>";
			else
				html += "						<li><a  onclick='display_list_portfoliosgroups()'>"+karutaStr[LANG]['list_portfoliosgroups']+"</a></li>";
			if ($("#main-user").length && $("#main-user").html()!="")
				html += "						<li><a  onclick='show_list_users()'>"+karutaStr[LANG]['list_users']+"</a></li>";
			else
				html += "						<li><a  onclick='display_list_users()'>"+karutaStr[LANG]['list_users']+"</a></li>";
			if ($("#main-usersgroup").length && $("#main-usersgroup").html()!="")
				html += "						<li><a  onclick='show_list_usersgroups()'>"+karutaStr[LANG]['list_usersgroups']+"</a></li>";
			else
				html += "						<li><a  onclick='display_list_usersgroups()'>"+karutaStr[LANG]['list_usersgroups']+"</a></li>";
			html += "						<li><a  onclick='display_exec_batch()'>"+karutaStr[LANG]['batch']+"</a></li>";
			html += "						<li><a  onclick='display_exec_report()'>"+karutaStr[LANG]['report']+"</a></li>";
			html += "					</ul>";
			html += "				</li>";
			html += "			</ul>";
		}
		//-----------------LOGOUT-----------------------------------------
		html += "			<ul class='nav navbar-nav navbar-right'>";
		html += "						<li><a onclick='logout()' class='navbar-icon'><span class='glyphicon glyphicon-log-out'></span></a></li>";
		html += "			</ul>";
		//-----------------USERNAME-----------------------------------------
		html += "			<ul class='nav navbar-nav navbar-right'>";
		html += "				<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle navbar-icon' ><span class='glyphicon glyphicon-user'></span>&nbsp;&nbsp;"+USER.firstname_node.text()+" "+USER.lastname_node.text();
		html += " 					<span class='glyphicon glyphicon-triangle-bottom'></span></a>";
		html += "					<ul class='dropdown-menu pull-right'>";
		html += "						<li><a href=\"javascript:UIFactory['User'].callChangePassword()\">"+karutaStr[LANG]['change_password']+"</a></li>";
		if (USER.creator && !USER.admin)
			html += "						<li><a href=\"javascript:UIFactory['User'].callCreateTestUser()\">"+karutaStr[LANG]['create-test-user']+"</a></li>";
		html += "					</ul>";
		html += "				</li>";
		html += "			</ul>";
	}

	//----------------------------------------------------------
	html += "			</div><!--.nav-collapse -->";
	html += "	</div>";
	html += "</div>";
	html += "</div>";
	
	html += "</nav>";
	return html;
}


//==============================
function EditBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Edit box ==================== -->";
	html += "\n<div id='edit-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n		<div class='modal-content'>";
	html += "\n		<div id='edit-window-header' class='modal-header'>";
	html += "\n			<div id='edit-window-type' style='float:right'></div>";
	html += "\n			<h3 id='edit-window-title' ></h3>";
	html += "\n		</div>";
	html += "\n		<div id='edit-window-body' class='modal-body'></div>";
	html += "\n		<div class='modal-footer' id='edit-window-footer'></div>";
	html += "\n		</div>";
	html += "\n		</div>";
	html += "\n	</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}


//==============================
function fillEditBoxBody()
//==============================
{
	var html = "";
	if (g_userroles[0]=='designer' || USER.admin) {
		html += "\n			<div role='tabpanel'>";
		html += "\n				<ul class='nav nav-tabs' role='tablist'>";
		html += "\n					<li role='presentation' class='active'><a href='#edit-window-body-main' aria-controls='edit-window-body-main' role='tab' data-toggle='tab'>"+karutaStr[LANG]['resource']+"</a></li>";
		html += "\n					<li role='presentation'><a href='#edit-window-body-metadata' aria-controls='edit-window-body-metadata' role='tab' data-toggle='tab'>"+karutaStr[LANG]['metadata']+"</a></li>";
		html += "\n					<li role='presentation'><a href='#edit-window-body-metadata-epm' aria-controls='edit-window-body-metadata-epm' role='tab' data-toggle='tab'>"+karutaStr[LANG]['css-styles']+"</a></li>";
		html += "\n				</ul>";
		html += "\n				<div class='tab-content'>";
		html += "\n					<div role='tabpanel' class='tab-pane active' id='edit-window-body-main' style='margin-top:10px'>";
		html += "\n						<div id='edit-window-body-resource'></div>";
		html += "\n						<div id='edit-window-body-node'></div>";
		html += "\n						<div id='edit-window-body-context'></div>";
		html += "\n					</div>";
		html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-metadata'></div>";
		html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-metadata-epm'></div>";
		html += "\n				</div>";
		html += "\n			</div>";
	}
	else {
		html += "\n					<div id='edit-window-body-resource'></div>";
		html += "\n					<div id='edit-window-body-node'></div>";
		html += "\n					<div id='edit-window-body-context'></div>";
		html += "\n					<div id='edit-window-body-metadata'></div>";
		html += "\n					<div id='edit-window-body-metadata-epm'></div>";
	}
	$('#edit-window-body').html(html);
}

//==============================
function setMessageBox(html)
//==============================
{
	html = "<span>" + html + "</span>";
	$("#message-body").html($(html));
}

//==============================
function addMessageBox(html)
//==============================
{
	html = "<span>" + html + "</span>";
	$("#message-body").add($(html));
}

//==============================
function showMessageBox()
//==============================
{
	$("#message-window").show();
}

//==============================
function hideMessageBox()
//==============================
{
	$("#message-window").hide();
}


//==================================
function getEditBox(uuid,js2) {
//==================================
	fillEditBoxBody();
	var js1 = "javascript:$('#edit-window').modal('hide')";
	if (js2!=null)
		js1 += ";"+js2;
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	var html = "";
	//--------------------------
	if(UICom.structure["ui"][uuid].resource!=null) {
		try {
			html = UICom.structure["ui"][uuid].resource.getEditor();
			$("#edit-window-body-resource").html($(html));
			html = UICom.structure["ui"][uuid].getEditor();
			$("#edit-window-body-node").html($(html));
		}
		catch(e) {
			UICom.structure["ui"][uuid].resource.displayEditor("edit-window-body-resource");
			html = UICom.structure["ui"][uuid].getEditor();
			$("#edit-window-body-node").html($(html));
		}
	} else {
		if(UICom.structure["ui"][uuid].structured_resource!=null) {
			try {
				UICom.structure["ui"][uuid].structured_resource.displayEditor("edit-window-body-resource");
				html = UICom.structure["ui"][uuid].getEditor();
				$("#edit-window-body-node").html($(html));
			}
			catch(e) {
				html = UICom.structure["ui"][uuid].getEditor();
				$("#edit-window-body-node").html($(html));
			}
		} else {
			html = UICom.structure["ui"][uuid].getEditor();
			$("#edit-window-body-node").html($(html));
		}
	}
	// ------------admin and designer----------
	if (USER.admin || g_userroles[0]=='designer') {
		var editHtml = UIFactory["Node"].getMetadataAttributesEditor(UICom.structure["ui"][uuid]);
		$("#edit-window-body-metadata").html($(editHtml));
		UIFactory["Node"].displayMetadataTextsEditor(UICom.structure["ui"][uuid]);
	}
	// ------------ context -----------------
	UIFactory["Node"].displayCommentsEditor('edit-window-body-context',UICom.structure["ui"][uuid]);
	// ------------ graphicer -----------------
	var editHtml = UIFactory["Node"].getMetadataEpmAttributesEditor(UICom.structure["ui"][uuid]);
	$("#edit-window-body-metadata-epm").html($(editHtml));
	// ------------------------------
	$(".modal-dialog").css('width','600px');
	$(".pickcolor").colorpicker();
	// ------------------------------
	$('#edit-window-body').animate({ scrollTop: 0 }, 'slow');}


//==================================
function getEditBoxOnCallback(data,param2,param3,param4) {
//==================================
	var uuid = $("node",data).attr('id');//alertHTML(uuid);
	param2(param3,param4);
	getEditBox(uuid);
}


//==============================
function deleteButton(uuid,type,parentid,destid,callback,param1,param2)
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Delete Button ==================== -->";
	html += "<span id='del-"+uuid+"' class='button glyphicon glyphicon-remove' onclick=\"confirmDel('"+uuid+"','"+type+"','"+parentid+"','"+destid+"','"+callback+"','"+param1+"','"+param2+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' data-tooltip='true' data-placement='bottom'></span>";
	return html;
}

//==============================
function DeleteBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Delete box ==================== -->";
	html += "\n<div id='delete-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div class='modal-header'>";
	html += "\n					<div id='edit-window-type' style='float:right'></div>";
	html += "\n					<h3 id='edit-window-title' >Attention</h3>";
	html += "\n				</div>";
	html += "\n				<div id='delete-window-body' class='modal-body'>";
	html += "\n					<div id='delete-window-body-content'>";
	html += "\n					</div>";
	html += "\n				</div>";
	html += "\n				<div class='modal-footer' id='delete-window-footer'></div>";
	html += "\n			</div>";
	html += "\n		</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}


//==============================
function savedBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Saved box ==================== -->";
	html += "\n<div id='saved-window' class='modal hide'>";
	html += "\n	<div id='saved-window-body' class='modal-body' style='text-align:center'>Saved</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

//==============================
function alertBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Alert box ==================== -->";
	html += "\n<div id='alert-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div class='modal-header'>";
	html += "\n					<h3 id='alert-window-header' >Attention</h3>";
	html += "\n				</div>";
	html += "\n				<div id='alert-window-body' class='modal-body'>";
	html += "\n				</div>";
	html += "\n				<div id='alert-window-footer' class='modal-footer' >";
	html += "\n				</div>";
	html += "\n			</div>";
	html += "\n		</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

//==============================
function messageBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Message box ==================== -->";
	html += "\n<div id='message-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div id='message-window-body' class='modal-body'>";
	html += "\n				</div>";
	html += "\n				<div id='message-window-footer' class='modal-footer' >";
	html += "\n				</div>";
	html += "\n			</div>";
	html += "\n		</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

//==============================
function imageBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== image box ==================== -->";
	html += "\n<div id='image-window' class='modal fade'>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div id='image-window-body' class='modal-body'>";
	html += "\n				</div>";
	html += "\n				<div id='image-window-footer' class='modal-footer' >";
	html += "\n				</div>";
	html += "\n			</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

//=======================================================================
function deleteandhidewindow(uuid,type,parentid,destid,callback,param1,param2) 
// =======================================================================
{
	$('#delete-window').modal('hide');
	$('#wait-window').modal('show');
	if (type!=null && (type=='asmStructure' || type=='asmUnit' || type=='asmUnitStructure' || type=='asmContext')) {
		UIFactory['Node'].remove(uuid,callback,param1,param2); //asm node
		if (parentid!=null) {
			parent = $("#"+parentid);
			$("#"+uuid,parent).remove();
		}
	}
	else
		if (type!=null)
			UIFactory[type].remove(uuid,parentid,destid,callback,param1,param2); // application defined type
	// ----------------------------------
	UICom.structure['tree'][uuid] = null;
	// ----------------------------------
}

//=======================================================================
function confirmSubmit(uuid) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-submit"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');submit('"+uuid+"')\">" + karutaStr[LANG]["button-submit"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDel(uuid,type,parentid,destid,callback,param1,param2) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:deleteandhidewindow('"+uuid+"','"+type+"','"+parentid+"','"+destid+"',"+callback+",'"+param1+"','"+param2+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelPortfolio(uuid) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelProject(uuid,projectcode) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.delProject('"+uuid+"','"+projectcode+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}
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
function displayPage(uuid,depth,type,langcode,edit) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (g_current_page!=uuid) {
		$(window).scrollTop(0);
		g_current_page = uuid;
	}
	$("#contenu").html("<div id='page' uuid='"+uuid+"'></div>");
	$('.selected').removeClass('selected');
	$("#sidebar_"+uuid).parent().addClass('selected');
	var name = $(UICom.structure['ui'][uuid].node).prop("nodeName");
	if (depth==null)
		depth=100;
	if (name=='asmRoot' || name=='asmStructure')
		depth = 1;
	if (UICom.structure['tree'][uuid]!=null) {
		if (type=='standard') {
			$("#welcome-edit").html("");
			if (UICom.structure["ui"][uuid].semantictag.indexOf('welcome-unit')>-1 && !g_welcome_edit)
				UIFactory['Node'].displayWelcomePage(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
			else
				UIFactory['Node'].displayStandard(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
		}
		if (type=='translate')
			UIFactory['Node'].displayTranslate(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
		if (type=='model')
			UIFactory['Node'].displayModel(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
	}
	$("#wait-window").modal('hide');			
}

//==================================
function displayControlGroup_getEditor(destid,label,controlsid,nodeid) {
//==================================
	$("#"+destid).append($("<div class='form-group'><label class='col-sm-3 control-label'>"+label+"</label><div id='"+controlsid+"' class='col-sm-9'></div></div>"));
	$("#"+controlsid).append(UICom.structure["ui"][nodeid].resource.getEditor());
}

//==================================
function displayControlGroup_displayEditor(destid,label,controlsid,nodeid,type,classitem,lang,resettable) {
//==================================
	if (classitem==null)
		classitem="";
	$("#"+destid).append($("<div class='control-group'><label class='control-label "+classitem+"'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	UICom.structure["ui"][nodeid].resource.displayEditor(controlsid,type,lang,null,null,resettable);
}

//==================================
function displayControlGroup_getView(destid,label,controlsid,nodeid,type,classitem,lang) {
//==================================
	$("#"+destid).append($("<div class='control-group'><label class='control-label "+classitem+"'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	$("#"+controlsid).append(UICom.structure["ui"][nodeid].resource.getView(null,type,lang));
}

//==================================
function displayControlGroup_displayView(destid,label,controlsid,nodeid,type,classitem) {
//==================================
	if (classitem==null)
		classitem="";
	$("#"+destid).append($("<div class='control-group'><label class='control-label "+classitem+"'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	$("#"+controlsid).append(UICom.structure["ui"][nodeid].resource.getView());
}

//=======================================================================
function writeSaved(uuid,data)
//=======================================================================
{
	$("#saved-window").show(1000);
	$("#saved-window").hide(1000);
}

//=======================================================================
function importBranch(destid,srcecode,srcetag,databack,callback,param2,param3,param4,param5,param6,param7,param8) 
//=======================================================================
{
	$("#wait-window").modal('show');
	//------------
	var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	if (srcecode.indexOf('.')<0 && srcecode!='self')  // There is no project, we add the project of the current portfolio
		srcecode = selfcode.substring(0,selfcode.indexOf('.')) + "." + srcecode;
	if (srcecode=='self')
		srcecode = selfcode;
	//------------
	var urlS = "../../../"+serverBCK+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	if (USER.admin || g_userroles[1]=='designer') {
		var rights = UIFactory["Node"].getRights(destid);
		var roles = $("role",rights);
		if (roles.length==0) // test if model (otherwise it is an instance and we import)
			urlS = "../../../"+serverBCK+"/nodes/node/copy/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	}
	$.ajax({
		type : "POST",
		dataType : "text",
		url : urlS,
		data : "",
		success : function(data) {
			if (data=='Inexistent selection'){
				alertHTML(karutaStr[languages[LANGCODE]]['inexistent-selection']);
			}
			if (callback!=null)
				if (databack)
					callback(data,param2,param3,param4,param5,param6,param7,param8);
				else
					callback(param2,param3,param4,param5,param6,param7,param8);
			$("#wait-window").modal('hide');			
		}
	});
}

//=======================================================================
function edit_displayEditor(uuid,type)
//=======================================================================
{
	$("#edit-window-body").remove();
	$("#edit-window-body").append($("<div id='edit-window-body'></div>"));
	UICom.structure["ui"][uuid].resource.displayEditor("edit-window-body",type);
}

//=======================================================================
function loadLanguages(callback)
//=======================================================================
{
	for (var i=0; i<languages.length; i++){
		if (i<languages.length-1) {
			if (elgg_installed) {
				$.ajax({
					type : "GET",
					dataType : "script",
					url : karuta_url+"/socialnetwork-elgg/js/languages/locale_"+languages[i]+".js"
				});
			}
			$.ajax({
				type : "GET",
				dataType : "script",
				url : karuta_url+"/karuta/js/languages/locale_"+languages[i]+".js"
			});
		}
		else { // last one so we callback
			if (elgg_installed) {
				$.ajax({
					type : "GET",
					dataType : "script",
					url : karuta_url+"/socialnetwork-elgg/js/languages/locale_"+languages[i]+".js"
				});
			}
			$.ajax({
				type : "GET",
				dataType : "script",
				url : karuta_url+"/karuta/js/languages/locale_"+languages[i]+".js",
				success : callback
			});
		}
	}
}

//=======================================================================
function sleep(milliseconds)
//=======================================================================
{
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//=======================================================================
function submit(uuid)
//=======================================================================
{
	var urlS = "../../../"+serverBCK+'/nodes/node/'+uuid+'/action/submit';
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		uuid : uuid,
		success : function (data){
			UIFactory.Node.reloadUnit();
		}
	});
}

//=======================================================================
function reset(uuid)
//=======================================================================
{
	var urlS = "../../../"+serverBCK+'/nodes/node/'+uuid+'/action/reset';
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		uuid : uuid,
		success : function (data){
			UIFactory.Node.reloadUnit();
		}
	});
}

//=======================================================================
function postAndDownload(url,data)
//=======================================================================
{
	var html = "<form id='form-data' action='"+url+"' method='post' enctype='multipart/form-data' ><input id='input-data' type='hidden' name='data'></form>";
	$("#post-form").html($(html));
	$("#input-data").val(data);
	$("#form-data").submit();
}


//=======================================================================
function show(uuid)
//=======================================================================
{
	var urlS = "../../../"+serverBCK+'/nodes/node/'+uuid+'/action/show';
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			UIFactory.Node.reloadUnit();
		}
	});
}

//=======================================================================
function hide(uuid)
//=======================================================================
{
	var urlS = "../../../"+serverBCK+'/nodes/node/'+uuid+'/action/hide';
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			UIFactory.Node.reloadUnit();
		}
	});
}


//=======================================================================
function Set()
//=======================================================================
{
	this.content = {};
}
Set.prototype.add = function(val) {
	this.content[val]=true;
};
Set.prototype.remove = function(val) {
	delete this.content[val];
};
Set.prototype.contains = function(val) {
	return (val in this.content);
};
Set.prototype.asArray = function() {
	var res = [];
	for (var val in this.content) res.push(val);
	return res;
};

//==================================
function encrypt(text,key){  
	//==================================
    var result = $.rc4EncryptStr(text,key);
	return result;
}  
//==================================
function decrypt(text,key){  
//==================================
	var result = "";
	try {
		result = $.rc4DecryptStr(text,key);
	}
	catch(err) {
		result = karutaStr[LANG]['error_rc4key'];
	}
		return result;
	}  

//==================================
function sortOn1(a,b)
//==================================
{
	a = a[0];
	b = b[0];
	return a == b ? 0 : (a > b ? 1 : -1);
}

//==================================
function sortOn1Desc(a,b)
//==================================
{
	a = a[0];
	b = b[0];
	return a == b ? 0 : (a < b ? 1 : -1);
}

//==================================
function sortOn1_2(a,b)
//==================================
{
	a = a[0]+a[1];
	b = b[0]+b[1];
	return a == b ? 0 : (a > b ? 1 : -1);
}

//==================================
function sortOn1_2_3(a,b)
//==================================
{
	a = a[0]+a[1]+a[2];
	b = b[0]+b[1]+b[2];
	return a == b ? 0 : (a > b ? 1 : -1);
}


//==================================
function getSendPublicURL(uuid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		var email = $("#email").val();
		var role = "all"
		if (email!='') {
			getPublicURL(uuid,email,role,langcode)
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='email' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
}

//==================================
function getSendSharingURL(uuid,sharewithrole,langcode,sharelevel,shareduration)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		var email = $("#email").val();
		var role = "all"
		if (email!='') {
			getPublicURL(uuid,email,sharewithrole,langcode,sharelevel,shareduration)
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='email' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
}


//==================================
function getPublicURL(uuid,email,role,langcode,level,duration) {
//==================================
	if (level==null)
		level = 4; //public
	if (duration==null)
		duration = 720;  //-- max 720h
	if (role==null)
		role = "all";
	var urlS = "../../../"+serverFIL+'/direct?uuid='+uuid+'&email='+email+'&role='+role+'&l='+level+'&d='+duration;
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		success : function (data){
			sendEmailPublicURL(data,email,langcode);
		}
	});
}

//==================================
function sendSharingURL(uuid,sharewithrole,email,sharetorole,langcode,level,duration) {
//==================================
	if (level==null)
		level = 0; //must be logged
	if (sharewithrole==null)
		sharewithrole = "all";
	if (duration==null)
		duration = "24";
	//---------------------
	if (email!=null && email!='') {
		var emails = email.split(" "); // email1 email2 ..
		for (var i=0;i<emails.length;i++) {
			if (emails[i].length>4) {
				var urlS = "../../../"+serverFIL+'/direct?uuid='+uuid+'&email='+emails[i]+'&role='+sharewithrole+'&l='+level+'&d='+duration;
				$.ajax({
					type : "POST",
					email : emails[i],
					dataType : "text",
					contentType: "application/xml",
					url : urlS,
					success : function (data){
						sendEmailPublicURL(data,this.email,langcode);
					}
				});
			}
		}
	}
	if (sharetorole!=null && sharetorole!='') {
		var roles = sharetorole.split(" "); // role1 role2 ..
		var groups = null;
		$.ajaxSetup({async: false});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in getEmail : "+jqxhr.responseText);
			}
		});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+g_portfolioid,
			success : function(data) {
				groups = $("rrg",data);
			}
		});
		$.ajaxSetup({async: true});
		for (var i=0;i<roles.length;i++) {
			if (roles[i].length>0) {
				if (groups.length>0) {
					for (var j=0; j<groups.length; j++) {
						var label = $("label",groups[j]).text();
						var users = $("user",groups[j]);
						if (label==roles[i] && users.length>0){
							for (var k=0; k<users.length; k++){
								var userid = $(users[k]).attr('id');
								if (Users_byid[userid]==undefined)
									alertHTML('error undefined userid:'+userid);
								else {
									var email = Users_byid[userid].getEmail();
									if (email.length>4) {
										var urlS = "../../../"+serverFIL+'/direct?uuid='+uuid+'&email='+email+'&role='+roles[i]+'&l='+level+'&d='+duration;
										$.ajax({
											type : "POST",
											email : email,
											dataType : "text",
											contentType: "application/xml",
											url : urlS,
											success : function (data){
												sendEmailPublicURL(data,this.email,langcode);
											}
										});
									}
								}

							}
						}
					}
				}
				//--------------------------
			}
		}
	}

}

//==================================
function getEmail(role,emails) {
//==================================
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
			//--------------------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+g_portfolioid,
				success : function(data) {
					var groups = $("rrg",data);
					if (groups.length>0) {
						for (var i=0; i<groups.length; i++) {
							var label = $("label",groups[i]).text();
							var users = $("user",groups[i]);
							if (label==role && users.length>0){
								for (var j=0; j<users.length; j++){
									var userid = $(users[j]).attr('id');
									if (Users_byid[userid]==undefined)
										alertHTML('error undefined userid:'+userid);
									else
										emails[j] = Users_byid[userid].getEmail();
								}
							}
						}
					}
					return emails;
				},
				error : function(jqxhr,textStatus) {
					return emails;
				}
			});
			//--------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in getEmail : "+jqxhr.responseText);
		}
	});
}

//==================================
function sendEmailPublicURL(encodeddata,email,langcode) {
//==================================
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	url = serverURL+"/"+appliname+"/application/htm/public.htm?i="+encodeddata+"&amp;lang="+languages[langcode];
	//------------------------------
	var message = "";
	message = g_sendEmailPublicURL_message.replace("#firstname#",USER.firstname);
	message = message.replace("#lastname#",USER.lastname);
	message = message.replace("#want-sharing#",karutaStr[LANG]['want-sharing']);
	message = message.replace("#see#",karutaStr[LANG]['see']);
	message = message.replace("#do not edit this#",url);
	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+karutaStr[LANG]['want-sharing']+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="</node>";
	$.ajax({
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverREG+"/mail",
		data: xml,
		success : function(data) {
			$('#edit-window').modal('hide');
			alertHTML(karutaStr[LANG]['email-sent']);
		}
	});
}


//==================================
function getLanguage(setElggLocale) {
//==================================
	if (setElggLocale==null)
		setElggLocale = true;
	var lang = Cookies.get('karuta-language');
//	alertHTML(lang);
	if (lang == null || lang==undefined || lang=='undefined') {
		lang = languages[0];
		setLanguage(lang);
	} else {
		LANG = lang;
		for (var i=0; i<languages.length;i++){
			if (languages[i]==lang)
				LANGCODE = i;
		}
		if (setElggLocale && USER!=undefined && elgg_installed && $(USER.username_node).text()!="public") // not public Account
			moment.locale(lang);  // for elgg
	}
}

//==================================
function setLanguage(lang,caller) {
//==================================
	if (caller==null)
		caller="";
	Cookies.set('karuta-language',lang,{ expires: 60 });
	LANG = lang;
	$("#flagimage").attr("src",karuta_url+"/karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png");
	for (var i=0; i<languages.length;i++){
		if (languages[i]==lang)
			LANGCODE = i;
	}
	if (caller=="" && elgg_installed && USER!=undefined && $(USER.username_node).text()!="public") // not public Account
		moment.locale(lang);
}


//==================================
function toggleZoom(uuid) {
//==================================
	var classname = $("#zoom_"+uuid).attr("class");
	if (classname=="fa fa-search-plus")
		$("#zoom_"+uuid).attr("class","fa fa-search-minus");
	else
		$("#zoom_"+uuid).attr("class","fa fa-search-plus");
}

//==================================
function toggleContent(uuid) {
//==================================
	if ($("#toggleContent_"+uuid).hasClass("glyphicon-plus")) {
		UIFactory["Node"].updateMetadataAttribute(uuid,'collapsed','N');
		$("#toggleContent_"+uuid).removeClass("glyphicon-plus")
		$("#toggleContent_"+uuid).addClass("glyphicon-minus")
		$("#content-"+uuid).show();
	} else {
		UIFactory["Node"].updateMetadataAttribute(uuid,'collapsed','Y');
		$("#toggleContent_"+uuid).removeClass("glyphicon-minus")
		$("#toggleContent_"+uuid).addClass("glyphicon-plus")
		$("#content-"+uuid).hide();
	}
}

//==================================
function toggleSharing(uuid) {
//==================================
	if ($("#toggleSharing_"+uuid).hasClass("glyphicon-plus")) {
		$("#toggleSharing_"+uuid).removeClass("glyphicon-plus")
		$("#toggleSharing_"+uuid).addClass("glyphicon-minus")
		$("#sharing-content-"+uuid).show();
	} else {
		$("#toggleSharing_"+uuid).removeClass("glyphicon-minus")
		$("#toggleSharing_"+uuid).addClass("glyphicon-plus")
		$("#sharing-content-"+uuid).hide();
	}
}

//==================================
function toggleMetadata(state) {
//==================================
	if (state=='hidden') {
		changeCss(".metainfo", "display:none;");
		g_visible = 'hidden';
	} else {
		changeCss(".metainfo", "display:block;");
		g_visible = 'visible';
	}
	Cookies.set('metadata',g_visible,{ expires: 60 });
}

//==================================
function toggleButton(state) {
//==================================
	if (state=='hidden') {
		changeCss(".btn-group", "visibility:hidden;");
	} else {
		changeCss(".btn-group", "visibility:visible;");
	}
}


//==================================
function toggleSideBar() {
//==================================
	if ($("#sidebar").is(":visible"))
	{
		$("#sidebar").hide();
		g_display_sidebar = false;
		$("#contenu").removeClass().addClass('col-md-12');
	} else {
		$("#contenu").removeClass().addClass('col-md-9');
		$("#sidebar").show();
		g_display_sidebar = true;
	}
	UIFactory['Node'].reloadUnit();
}

//==================================
function toggleSocialNetwork() {
//==================================
	if ($("#socialnetwork").is(":visible"))
	{
		$("#socialnetwork").hide();
		$("#toggleSocialNetwork").removeClass('fa-arrow-left').addClass('fa-arrow-right');
		$("#main-content").removeClass().addClass('col-md-12');
		Cookies.set('socialnetwork','hidden',{ expires: 60 });
	} else {
		$("#toggleSocialNetwork").removeClass('fa-arrow-right').addClass('fa-arrow-left');
		$("#main-content").removeClass().addClass('col-md-8 col-md-push-4');
		$("#socialnetwork").show();
		Cookies.set('socialnetwork','shown',{ expires: 60 });
	}
}

//==================================
function toggleSidebarPlusMinus(uuid) {
//==================================
	if ($("#toggle_"+uuid).hasClass("glyphicon-plus"))
	{
		g_toggle_sidebar [uuid] = 'open';
		$("#toggle_"+uuid).removeClass("glyphicon-plus")
		$("#toggle_"+uuid).addClass("glyphicon-minus")
		$("#collapse"+uuid).collapse("show")
	} else {
		g_toggle_sidebar [uuid] = 'closed';
		$("#toggle_"+uuid).removeClass("glyphicon-minus")
		$("#toggle_"+uuid).addClass("glyphicon-plus")
		$("#collapse"+uuid).collapse("hide")
	}
}

//==================================
function changeCss(className, classValue)
//==================================
{
    var cssMainContainer = $('#css-modifier-container');

    if (cssMainContainer.length == 0) {
        var cssMainContainer = $('<style id="css-modifier-container"></style>');
        cssMainContainer.appendTo($('head'));
    }

    cssMainContainer.append(className + " {" + classValue + "}\n");
}

//================================== not used
function equalize_column_height(uuid)
//==================================
{
	var heights = $("#node_"+uuid).find(".same-height").map(function() {
		if (UICom.structure["ui"][uuid].resource!=undefined && UICom.structure["ui"][uuid].resource.type == 'image')
			return $("#image_uuid").height();
		else
			return $(this).height();
	});
	var maxHeight = Math.max.apply(null, heights);
	$("#node_"+uuid).find(".same-height").height(maxHeight);
}

//==================================
function rgb(red, green, blue)
//==================================
{
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

//==================================
function alertHTML(message,header,footer)
//==================================
{
	if (header!=null) {
		document.getElementById('alert-window-header').innerHTML = header;
	}
	if (footer!=null) {
		document.getElementById('alert-window-footer').innerHTML = footer;
	} else {
		var buttons = "<button class='btn' onclick=\"javascript:$('#alert-window').modal('hide');\">" + karutaStr[LANG]["Close"] + "</button>";
		document.getElementById('alert-window-footer').innerHTML = buttons;
	}
	$('#alert-window-body').html(message);
	$('#alert-window').modal('show');

}

//==================================
function messageHTML(message)
//==================================
{
	var buttons = "<button class='btn' onclick=\"javascript:$('#message-window').modal('hide');\">" + karutaStr[LANG]["Close"] + "</button>";
	document.getElementById('message-window-footer').innerHTML = buttons;
	$('#message-window-body').html(message);
	$('#message-window').modal('show');
}

//==================================
function imageHTML(image)
//==================================
{
	var buttons = "<button class='btn' onclick=\"javascript:$('#image-window').modal('hide');\">" + karutaStr[LANG]["Close"] + "</button>";
	document.getElementById('image-window-footer').innerHTML = buttons;
	$('#image-window-body').html(image);
	$('#image-window').modal('show');

}


//==================================
String.prototype.containsArrayElt = function (rolesarray) 
//==================================
	// usage : if (editnoderoles.containsArrayElt(g_userroles)) 
{
	var result = false;
	for (var i=0;i<rolesarray.length;i++){
		if (this.indexOf(rolesarray[i])>-1){
			result = true;
			i = rolesarray.length;
		}
	}
	return result;
}

//==================================
Array.prototype.contains = function(elt)
//==================================
	// usage : if (arr.contains(elt)) 
{
	for (var i in this){
		if (this[i] == elt) return true;
	}
	return false;
}

//==================================
function toggleGroup(group_type,uuid,callback,type,lang) {
//==================================
	if ($("#toggleContent_"+group_type+"-"+uuid).hasClass("glyphicon-plus")) {
		$("#toggleContent_"+group_type+"-"+uuid).removeClass("glyphicon-plus");
		$("#toggleContent_"+group_type+"-"+uuid).addClass("glyphicon-minus");
		if (callback!=null){
			if (jQuery.isFunction(callback))
				callback(uuid,"content-"+group_type+"-"+uuid,type,lang);
			else
				eval(callback+"('"+uuid+"','content-"+group_type+"-"+uuid+"','"+type+"','"+lang+"')");
		}
		$("#content-"+group_type+"-"+uuid).show();
		displayGroup[group_type][uuid] = 'open';
		Cookies.set('dg_'+group_type+"-"+uuid,'open',{ expires: 60 });
	} else {
		$("#toggleContent_"+group_type+"-"+uuid).removeClass("glyphicon-minus");
		$("#toggleContent_"+group_type+"-"+uuid).addClass("glyphicon-plus");
		$("#content-"+group_type+"-"+uuid).hide();
		displayGroup[group_type][uuid] = 'closed';
		Cookies.set('dg_'+group_type+"-"+uuid,'closed',{ expires: 60 });
	}
}

//==================================
function parseList(tag,xml) {
//==================================
	var ids = [];
	var items = $(tag,xml);
	for ( var i = 0; i < items.length; i++) {
		ids[i] = $(items[i]).attr('id');
	}
	return ids;
}

//==============================
function updateDisplay_page(elt,callback)
//==============================
{
	var val = $("#"+elt).attr("value");
	if (val=='1') {
		if (callback!=null){
			if (jQuery.isFunction(callback))
				callback();
			else
				eval(callback+"()");
		}
	}
}

//==================================
function toggleProject2Select(uuid) {
//==================================
	if ($("#toggleContent2Select_"+uuid).hasClass("glyphicon-plus")) {
		$("#toggleContent2Select_"+uuid).removeClass("glyphicon-plus")
		$("#toggleContent2Select_"+uuid).addClass("glyphicon-minus")
		$("#selectform-content-"+uuid).show();
	} else {
		$("#toggleContent2Select_"+uuid).removeClass("glyphicon-minus")
		$("#toggleContent2Select_"+uuid).addClass("glyphicon-plus")
		$("#selectform-content-"+uuid).hide();
	}
}

//==================================
function countWords(html) {
//==================================
	var text = html.replace(/(<([^>]+)>)/ig," ").replace(/(&lt;([^&gt;]+)&gt;)/ig," ").replace( /[^\w ]/g, "" );
	return text.trim().split( /\s+/ ).length;
}

//==================================
function getFirstWords(html,nb) {
//==================================
	var text = html.replace(/(<([^>]+)>)/ig," ").replace(/(&lt;([^&gt;]+)&gt;)/ig," ").replace( /[^\w ]/g, "" );
	var tableOfWords = text.trim().split( /\s+/ ).slice(0,nb);
	var tableIndex = [];
	var end = 0;
	for (var i=0;i<tableOfWords.length;i++){
		end += html.substring(end).indexOf(tableOfWords[i])+tableOfWords[tableOfWords.length-1].length;
		tableIndex[tableIndex.length] = {'s':tableOfWords[i], 'end':end};
	}
	return html.substring(0,tableIndex[tableOfWords.length-1].end);
}

//==================================
function setCSSportfolio(data)
//==================================
{
	// ================================= CSS Portfolio ========================
	if ($("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).length>0) {
		var portfolio_navbar_id = $("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).attr("id");
		var portfolio_navbar_color = UICom.structure["ui"][portfolio_navbar_id].resource.getValue();
		changeCss("#sub-bar .navbar-default", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
		changeCss("#sub-bar .dropdown-menu", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
		changeCss("#sub-bar .open > a", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
	}
	//--------------
	if ($("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).length>0) {
		var portfolio_navbar_link_id = $("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).attr("id");
		var portfolio_navbar_link_color = UICom.structure["ui"][portfolio_navbar_link_id].resource.getValue();
		changeCss("#sub-bar a", "color:"+portfolio_navbar_link_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).length>0) {
		var portfolio_sidebar_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).attr("id");
		var portfolio_sidebar_color = UICom.structure["ui"][portfolio_sidebar_id].resource.getValue();
		changeCss("#sidebar", "background-color:"+portfolio_sidebar_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).length>0) {
		var portfolio_sidebar_link_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).attr("id");
		var portfolio_sidebar_link_color = UICom.structure["ui"][portfolio_sidebar_link_id].resource.getValue();
		changeCss(".sidebar-link", "color:"+portfolio_sidebar_link_color+";padding-right:9px;");
		changeCss(".sidebar-link a", "color:"+portfolio_sidebar_link_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).length>0) {
		var portfolio_sidebar_link_selected_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).attr("id");
		var portfolio_sidebar_link_selected_color = UICom.structure["ui"][portfolio_sidebar_link_selected_id].resource.getValue();								
		changeCss(".selected a", "color:"+portfolio_sidebar_link_selected_color+";font-weight:bold;");
		changeCss(".sidebar-link a:hover", "color:"+portfolio_sidebar_link_selected_color+";");
		changeCss("a.sidebar-link:hover", "color:"+portfolio_sidebar_link_selected_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).length>0) {
		var portfolio_sidebar_selected_border_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).attr("id");
		portfolio_sidebar_selected_border_color = UICom.structure["ui"][portfolio_sidebar_selected_border_id].resource.getValue();
		changeCss("#sidebar .selected", "border-right:4px solid "+portfolio_sidebar_selected_border_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).length>0) {
		var portfolio_sidebar_separator_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).attr("id");
		var portfolio_sidebar_separator_color = UICom.structure["ui"][portfolio_sidebar_separator_id].resource.getValue();								
		changeCss(".sidebar-item", "border-bottom:1px solid "+portfolio_sidebar_separator_color+";");
		changeCss(".sidebar-item .sidebar-item", "border-bottom:0px solid "+portfolio_sidebar_separator_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='welcome-title-color'])",data).length>0) {
		var welcome_title_color_id = $("asmContext:has(metadata[semantictag='welcome-title-color'])",data).attr("id");
		var welcome_title_color = UICom.structure["ui"][welcome_title_color_id].resource.getValue();
		changeCss(".page-welcome .welcome-title", "color:"+welcome_title_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='welcome-line-color'])",data).length>0) {
		var welcome_line_color_id = $("asmContext:has(metadata[semantictag='welcome-line-color'])",data).attr("id");
		var welcome_line_color = UICom.structure["ui"][welcome_line_color_id].resource.getValue();
		changeCss(".welcome-line", "border-bottom:1px solid "+welcome_line_color+";width:25%;margin-left:auto;margin-right:auto;");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='page-title-background-color'])",data).length>0) {
		var page_title_background_color_id = $("asmContext:has(metadata[semantictag='page-title-background-color'])",data).attr("id");
		var page_title_background_color = UICom.structure["ui"][page_title_background_color_id].resource.getValue();
		changeCss(".welcome-line,.row-node-asmRoot,.row-node-asmStructure,.row-node-asmUnit", "background-color:"+page_title_background_color+";");
		changeCss(".row-node", "border-top:1px solid "+page_title_background_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).length>0) {
		var page_title_subline_color_id = $("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).attr("id");
		var page_title_subline_color = UICom.structure["ui"][page_title_subline_color_id].resource.getValue();
		changeCss(".row-node-asmRoot .title-subline,.row-node-asmStructure .title-subline,.row-node-asmUnit .title-subline", "border-bottom:1px solid "+page_title_subline_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).length>0) {
		var portfolio_buttons_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).attr("id");
		var portfolio_buttons_color = UICom.structure["ui"][portfolio_buttons_color_id].resource.getValue();
	//	changeCss(".asmnode .dropdown-button, .submit-button", "border:1px solid "+portfolio_buttons_color+";");
		changeCss(".collapsible .glyphicon,.btn-group .button", "color:"+portfolio_buttons_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).length>0) {
		var portfolio_buttons_background_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).attr("id");
		var portfolio_buttons_background_color = UICom.structure["ui"][portfolio_buttons_background_color_id].resource.getValue();
		changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "border:1px solid "+portfolio_buttons_background_color+";");
		changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "background:"+portfolio_buttons_background_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).length>0) {
		var portfolio_link_color_id = $("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).attr("id");
		var portfolio_link_color = UICom.structure["ui"][portfolio_link_color_id].resource.getValue();
		changeCss("a", "color:"+portfolio_link_color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-section-title-background-color'])",data).length>0) {
		var portfolio_section_title_background_color_id = $("asmContext:has(metadata[semantictag='portfolio-section-title-background-color'])",data).attr("id");
		var portfolio_section_title_background_color = UICom.structure["ui"][portfolio_section_title_background_color_id].resource.getValue();
		changeCss(".row-node-asmUnitStructure", "background:"+portfolio_section_title_background_color+";");
	}
	// ========================================================================
}


//==============================
function logout()
//==============================
{
	$.ajax({
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverBCK+"/credential/logout",
		data: ""
	});
	window.location="login.htm?lang="+LANG;
}
