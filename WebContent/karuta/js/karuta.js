/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
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
//var karutaStr = new Array();

if( karutaStr === undefined )
{
  var karutaStr = {};
}

var portfolioid = null;

// ------ GLOBAL VARIABLES ------------
var g_userrole = "";
var g_userroles = [];
var g_portfolioid = "";
var g_model = "";
//var g_complex = false;
var g_designerrole = false;
var g_rc4key = "";
var g_encrypted = false;
var g_display_type = "standard"; // default value
var g_translate = [];
var g_bar_type = "vertical"; // default value
var g_edit = false;
var g_visible = 'hidden';
var g_display_sidebar = true;
var g_execbatch = false;
//---- caches -----
var g_dashboard_models = {}; // cache for dashboard_models
var g_report_models = {}; // cache for report_models
var g_Get_Resource_caches = {};
var g_Get_Portfolio_caches = {};
//------------------
var g_wysihtml5_autosave = 60000; // 60 seconds
var g_portfolio_current = ""; // XML jQuery Object - must be set after loading xml
var g_portfolio_rootid = "";
var g_toggle_sidebar = [];
var g_current_page = "";
var g_nb_trees = 0;
var g_sum_trees = 0;
var g_roles = []; // list of portfolio roles for designer
var g_variables = {}; // variables for substitution in Get_resource and menus
var g_importednodestack = [];
var g_backstack = [];

//-------------- used for designer-----
var redisplays = {};
// -------------backward compatibility------------------------
var g_welcome_edit = false;
var g_block_height = 220; // block height in pixels

//==============================
function setDesignerRole(role)
//==============================
{
	USER.admin = false;
	if (role=='')
		role = 'designer';
	if (role=='designer')
		USER.admin = USER.admin_original;
	g_userroles[0] = role;
	fillEditBoxBody();
	$("#userrole").html(role);
	if (g_display_type=='standard' || g_display_type=='raw'){
		var uuid = $("#page").attr('uuid');
		var html = "";
		if (g_bar_type.indexOf('horizontal')>-1) {
			UIFactory.Portfolio.displayPortfolio('portfolio-container',g_display_type,LANGCODE,g_edit);
			$("#portfolio-container").attr('role',role);
		}
		else {
			html += "	<div id='main-row' class='row'>";
			if (g_display_sidebar) {
				html += "		<div class='col-md-3' id='sidebar'></div>";
				html += "		<div class='col-md-9' id='contenu'></div>";
			} else {
				html += "		<div class='col-md-3' id='sidebar' style='display:none'></div>";
				html += "		<div class='col-md-12' id='contenu'></div>";
			}
			html += "	</div>";
			$("#portfolio-container").html(html);
			$("#portfolio-container").attr('role',role);
			$("#edit-window").attr('role',role);
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',g_display_type,LANGCODE,g_edit,g_portfolio_rootid);
		}
		$("#sidebar_"+uuid).click();
	};
	if (g_display_type=='model'){
		displayPage(UICom.rootid,1,g_display_type,LANGCODE,g_edit);
	}
}


//==============================
function getLanguageMenu(js)
//==============================
{
	var html = "";
	for (var i=0; i<languages.length;i++) {
		html += "<a class='dropdown-item' id='lang-menu-"+languages[i]+"' onclick=\"setLanguage('"+languages[i]+"');"+js+"\">";
//		html += "	<img width='20px;' src='../../karuta/img/flags/"+karutaStr[languages[i]]['flag-name']+".png'/>&nbsp;&nbsp;"+karutaStr[languages[i]]['language'];
		html += karutaStr[languages[i]]['langshort']
		html += "</a>"
	}
	return html;
}


//==============================
function setLanguageMenu(js)
//==============================
{
	for (var i=0; i<languages.length;i++) {
		$("#lang-menu-"+languages[i]).attr("onclick","setLanguage('"+languages[i]+"');$('#navigation-bar').html(getNavBar('list',null));applyNavbarConfiguration();setWelcomeTitles();"+js);
	}
}


//==============================
function getNavBar(type,portfolioid,edit)
//==============================
{
	var html = "";
	html += "<nav class='navbar navbar-expand-md navbar-light bg-lightfont'>";
	html += "	<div class='dropdown'>";
	html += "		<a id='navbar-brand-logo' href='#' class='navbar-brand' data-toggle='dropdown'>";
	html += (typeof navbar_title != 'undefined') ? navbar_title[LANG] : "<img style='margin-bottom:4px;' src='../../karuta/img/logofonblanc.jpg'/>";
	html += "		</a>";
	if (type!='login') {
		html += "	<div class='dropdown-menu versions' aria-labelledby='navbar-brand-logo'>";
		html += "		<a class='dropdown-item'><b>Versions</b></a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item'>Karuta-frontend : "+karuta_version+" (" +karuta_date+")</a>";
		html += "		<a class='dropdown-item'>Karuta-backend : "+karuta_backend_version+" (" +karuta_backend_date+")</a>";
		html += "		<a class='dropdown-item'>Karuta-fileserver : "+karuta_fileserver_version+" (" +karuta_fileserver_date+")</a>";
		html += "	</div>";
	}
	html += "	</div>";
	html += "		<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#collapse-1' aria-controls='collapse-1' aria-expanded='false' aria-label='Toggle navigation'>";
	html += "			<span class='navbar-toggler-icon'></span>";
	html += "		</button>";
	html += "		<div class='navbar-collapse collapse' id='collapse-1'>";
	html += "			<ul class='mr-auto navbar-nav'>";
	//---------------------HOME - TECHNICAL SUPPORT-----------------------
	if (type=='login' || type=="create_account") {
		html += "			<li id='navbar-mailto' class='nav-item icon'><a class='nav-link' href='mailto:"+g_configVar['technical-support']+"?subject="+karutaStr[LANG]['technical_support']+" ("+appliname+")' data-title='"+karutaStr[LANG]["button-technical-support"]+"' data-toggle='tooltip' data-placement='bottom'><i class='fas fa-envelope' data-title='"+karutaStr[LANG]["technical_support"]+"' data-toggle='tooltip' data-placement='bottom'></i></a></li>";
	} else if (USER.username.indexOf("karuser")<0) {
		html += "			<li id='navbar-home' class='nav-item icon'><a class='nav-link' onclick='show_list_page()' data-title='"+karutaStr[LANG]["home"]+"' data-toggle='tooltip' data-placement='bottom'><i class='fas fa-home'></i></a></li>";
		html += "			<li id='navbar-mailto' class='nav-item icon'><a class='nav-link' href='javascript:displayTechSupportForm()' data-title='"+karutaStr[LANG]["technical_support"]+"' data-toggle='tooltip' data-placement='bottom'><i class='fas fa-envelope'></i></a></li>";
	}
	//-------------------LANGUAGES---------------------------displayTechSupportForm(langcode)
	if (languages.length>1) {
		html += "	<li id='navbar-language' class='nav-item dropdown'>";
		html += "		<a class='nav-link dropdown-toggle' href='#' id='languageDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
//		html += "			<img id='flagimage' style='width:25px;margin-top:-5px;' src='../../karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png'/>";
		html += karutaStr[LANG]['langshort'];
		html += "		</a>";
		html += "		<div class='dropdown-menu' aria-labelledby='languageDropdown'>";
		if(type=="login")
			html += getLanguageMenu("displayKarutaLogin();");
		else if(type=="create_account")
			html += getLanguageMenu("displayKarutaCreateAccount();");
		else
			html += getLanguageMenu("setWelcomeTitles();fill_list_page();$('#navigation-bar').html(getNavBar('list',null));applyNavbarConfiguration();$('#search-portfolio-div').html(getSearch());$('#search-user-div').html(getSearchUser());");
		html += "		</div>";
		html += "	</li>";
	}
	//-----------------ACTIONS-------------------------------
	if (type!='login' && type!='create_account' &&USER!=undefined) {
		if (USER.admin || (USER.creator && !USER.limited) ) {
			html += "		<li id='navbar-actions' class='nav-item dropdown'>";
			html += "			<a class='nav-link dropdown-toggle' href='#' id='actionsDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
			html += "				Actions";
			html += "			</a>";
			html += "			<div class='dropdown-menu'>";
			html += "				<a class='dropdown-item' onclick='show_list_page()'>"+karutaStr[LANG]['list_portfolios']+"</a>";
			//-----------------
			if (USER.admin) {
				if ($("#main-user").length && $("#main-user").html()!="")
					html += "		<a class='dropdown-item' onclick='show_list_users()'>"+karutaStr[LANG]['list_users']+"</a>";
				else
					html += "		<a class='dropdown-item' onclick='display_list_users()'>"+karutaStr[LANG]['list_users']+"</a>";
				//-----------------
				if ($("#main-portfoliosgroup").length && $("#main-portfoliosgroup").html()!="")
					html += "		<a class='dropdown-item' onclick='show_list_portfoliosgroups()'>"+karutaStr[LANG]['list_portfoliosgroups']+"</a>";
				else
					html += "		<a class='dropdown-item' onclick='display_list_portfoliosgroups()'>"+karutaStr[LANG]['list_portfoliosgroups']+"</a>";
				//-----------------
				if ($("#main-usersgroup").length && $("#main-usersgroup").html()!="")
					html += "		<a class='dropdown-item' onclick='show_list_usersgroups()'>"+karutaStr[LANG]['list_usersgroups']+"</a>";
				else
					html += "		<a class='dropdown-item' onclick='display_list_usersgroups()'>"+karutaStr[LANG]['list_usersgroups']+"</a>";
				//-----------------
				if (typeof specificmenus!='undefined' &&  specificmenus)
					html += specificmenushtml();
			}
			//-----------------
			html += "				<a class='dropdown-item' onclick='display_exec_batch()'>"+karutaStr[LANG]['batch']+"</a>";
			html += "				<a class='dropdown-item' onclick='display_exec_report()'>"+karutaStr[LANG]['report']+"</a>";
			html += "			</div>";
			html += "		</li>";
		}
		//-----------------NEW WINDOW-----------------------------------------
		if (type!='login' && type!='create_account' && USER!=undefined) {
			if (USER.admin || (USER.creator && !USER.limited) ) {
				html += "	<li class='nav-item icon'>";
				html += "		<a class='nav-link' href='"+window.location+"' target='_blank' data-title='"+karutaStr[LANG]["button-new-window"]+"' data-toggle='tooltip' data-placement='bottom'><i class='far fa-clone'></i></a>";
				html += "	</li>";
			}
		} 
		html += "			</ul>";
		html += "<ul class='navbar-nav'>";
		html += "	<li class='nav-item icon'>";
		html += "		<a class='nav-link' onclick='increaseFontSize()' style='cursor: zoom-in;' data-title='"+karutaStr[LANG]["button-increase"]+"' data-toggle='tooltip' data-placement='bottom' style='padding-top:.21rem;'><i style='font-size:120%' class='fa fa-font'></i></a>";
		html += "	</li>";
		html += "	<li class='nav-item icon'>";
		html += "		<a class='nav-link' onclick='decreaseFontSize()' style='cursor: zoom-out;' data-title='"+karutaStr[LANG]["button-decrease"]+"' data-toggle='tooltip' data-placement='bottom'><i style='font-size:80%' class='fa fa-font'></i></a>";
		html += "	</li>";
		if (USER.username.indexOf("karuser")<0) {
			//-----------------USERNAME-----------------------------------------
			if (cas_url=="") {
				html += "	<li class='nav-item dropdown'>";
				html += "		<a class='nav-link dropdown-toggle' href='#' id='userDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'  data-title='"+karutaStr[LANG]["button-change-password"]+"' data-toggle='tooltip' data-placement='bottom'>";
				html += "			<i class='fas fa-user'></i>&nbsp;&nbsp;"+USER.firstname+" "+USER.lastname;
				html += " 		</a>";
				html += "		<div class='dropdown-menu dropdown-menu-right' aria-labelledby='userDropdown'>";
				html += "				<a class='dropdown-item' href=\"javascript:UIFactory['User'].callChangePassword()\">"+karutaStr[LANG]['change_password']+"</a>";
				if ((USER.creator && !USER.limited)  && !USER.admin)
					html += "			<a class='dropdown-item' href=\"javascript:UIFactory['User'].callCreateTestUser()\">"+karutaStr[LANG]['create-test-user']+"</a>";
				html += "		</div>";
				html += "	</li>";
			} else {
				html += "	<li class='nav-item dropdown'>";
				html += "		<i class='fas fa-user'></i>&nbsp;&nbsp;"+USER.firstname+" "+USER.lastname;
				html += "	</li>";
			}
			//-----------------LOGOUT-----------------------------------------
			html += "	<li class='nav-item icon'>";
			html += "				<a class='nav-link' onclick='logout()' data-title='"+karutaStr[LANG]["button-disconnect"]+"' data-toggle='tooltip' data-placement='bottom'><i class='fas fa-sign-out-alt'></i></a>";
			html += "	</li>";
		}
		html += "</ul>";
	}
	//----------------------------------------------------------
	html += "		</div><!--.nav-collapse -->";
	html += "	</div>";
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
//		html += "\n			<div role='tabpanel'>";
		html += "\n				<ul class='nav nav-tabs' role='tablist'>";
		html += "\n					<li class='nav-item'><a class='nav-link active' href='#edit-window-body-main' aria-controls='edit-window-body-main' role='tab' data-toggle='tab'>"+karutaStr[LANG]['resource']+"</a></li>";
		html += "\n					<li class='nav-item'><a class='nav-link' href='#edit-window-body-metadata' aria-controls='edit-window-body-metadata' role='tab' data-toggle='tab'>"+karutaStr[LANG]['metadata']+"</a></li>";
		html += "\n					<li class='nav-item'><a class='nav-link' href='#edit-window-body-metadata-epm' aria-controls='edit-window-body-metadata-epm' role='tab' data-toggle='tab'>"+karutaStr[LANG]['css-styles']+"</a></li>";
		html += "\n					<li id='edit-window-body-menu-item' style='display:none' class='nav-item'><a class='nav-link' href='#edit-window-body-menu' aria-controls='edit-window-body-metadata-epm' role='tab' data-toggle='tab'>"+karutaStr[LANG]['menu']+"</a></li>";
		html += "\n				</ul>";
		html += "\n				<div class='tab-content'>";
		html += "\n					<div role='tabpanel' class='tab-pane active' id='edit-window-body-main' style='margin-top:10px'>";
		html += "\n						<div id='edit-window-body-resource'></div>";
		html += "\n						<div id='edit-window-body-node'></div>";
		html += "\n						<div id='edit-window-body-context'></div>";
		html += "\n					</div>";
		html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-metadata'></div>";
		html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-metadata-epm'></div>";
		html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-menu'></div>";
		html += "\n				</div>";
//		html += "\n			</div>";
	}
	else {
		html += "\n					<div id='edit-window-body-resource'></div>";
		html += "\n					<div id='edit-window-body-node'></div>";
		html += "\n					<div id='edit-window-body-context'></div>";
		html += "\n					<div id='edit-window-body-metadata'></div>";
		html += "\n					<div id='edit-window-body-metadata-epm'></div>";
		html += "\n					<div id='edit-window-body-menu'></div>";
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
	$("#edit-window").removeClass("Block");
	$("#edit-window").attr("role",g_userroles[0]);
	fillEditBoxBody();
	var js1 = "javascript:$('#edit-window').modal('hide')";
	if (js2!=null) {
		j2 = replaceVariable(js2);
		if (j2.indexOf("(")<0)
			js2 = js2+"('"+uuid+"')";
		js1 += ";"+js2;
	}
	var footer = "<span id='footer-before-close'></span><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	var html = "";
	//--------------------------
	if (UICom.structure["ui"][uuid].editresroles==undefined)
		UICom.structure["ui"][uuid].setMetadata();
	//--------------------------
	if (UICom.structure['tree'][uuid]==null || UICom.structure['tree'][uuid]==undefined) {  // if resource is in report and not loaded (report on server)
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
			success : function(data) {
				UICom.parseStructure(data);
				UICom.structure["ui"][uuid].resource.display["dashboard_node_resource"+uuid] = LANGCODE;
			},
			error : function() {
				var html = "";
				html += "<div>" + karutaStr[languages[LANGCODE]]['error-notfound'] + "</div>";
				$("#preview-window-body").html(html);
				$("#preview-window").modal('show');
			}
		});		
	}
	if(UICom.structure["ui"][uuid].resource!=null && (UICom.structure["ui"][uuid].editresroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer')) {
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
		if(UICom.structure["ui"][uuid].structured_resource!=null && g_display_type!='raw') {
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
			if ($("#get-resource-node").length && g_display_type!='raw'){
				var getResource = new UIFactory["Get_Resource"](UICom.structure["ui"][uuid].node,"xsi_type='nodeRes'");
				getResource.displayEditor("get-resource-node","completion");
			}
			if ($("#get-get-resource-node").length && g_display_type!='raw'){
				var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure["ui"][uuid].node,"xsi_type='nodeRes'");
				getgetResource.displayEditor("get-get-resource-node");
			}
		}
	}
	// ------------ context -----------------
	UIFactory.Node.displayCommentsEditor('edit-window-body-context',UICom.structure["ui"][uuid]);
	// ------------ graphicer -----------------
	UICom.structure.ui[uuid].displayMetadataEpmAttributesEditor('edit-window-body-metadata-epm');
	// ------------admin and designer----------
	if (USER.admin || g_userroles[0]=='designer') {
		UICom.structure.ui[uuid].displayMetadataAttributesEditor("edit-window-body-metadata");
		$("#edit-window-body-menu-item").show();
		UICom.structure.ui[uuid].displayMenuEditor("edit-window-body-menu");
	}
	$('#edit-window').modal('toggle');
	// ------------------------------
	$('#edit-window').animate({ scrollTop: 0 }, 'slow');
	// ------------------------------
//	$('#edit-window').show();
	$(".pickcolor").colorpicker();
}


//==================================
function getEditBoxOnCallback(data,param2,param3,param4) {
//==================================
	var uuid = $("node",data).attr('id');//alertHTML(uuid);
	param2(param3,param4);
	getEditBox(uuid);
}


//==============================
function deleteButton(uuid,type,parentid,destid,callback,param1,param2,param3,param4)
//==============================
{
	var menus_style = UICom.structure.ui[uuid].getMenuStyle();
	var html = "";
	html += "\n<!-- ==================== Delete Button ==================== -->";
	html += "<i id='del-"+uuid+"' style='"+menus_style+"' class='button fas fa-trash-alt' onclick=\"confirmDel('"+uuid+"','"+type+"','"+parentid+"','"+destid+"','"+callback+"','"+param1+"','"+param2+"','"+param3+"','"+param4+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' data-toggle='tooltip' data-placement='bottom'></i>";
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
	html += "\n<div id='saved-window'>";
	html += "\n	<div id='saved-window-body' style='text-align:center'></div>";
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
function previewBox(id)
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Preview box ==================== -->";
	html += "\n<div id='preview-window-"+id+"'>";
	html += "\n		<div class=''>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div id='preview-window-body-"+id+"' class=''>";
	html += "\n				</div>";
	html += "\n				<div id='preview-window-footer-"+id+"' class='modal-footer' >";
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
	html += "\n<div id='image-window' class='modal'>";
	html += "\n			<div class='modal-content'>";
	html += "\n				<div id='image-window-header' class='modal-header' ></div>";
	html += "\n				<div id='image-window-body' class='modal-body'></div>";
	html += "\n				<div id='image-window-footer' class='modal-footer' ></div>";
	html += "\n			</div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}

//=======================================================================
function deleteandhidewindow(uuid,type,parentid,destid,callback,param1,param2,param3,param4) 
// =======================================================================
{
	$('#delete-window').modal('hide');
	$('#wait-window').modal('show');
	if (type!=null && (type=='asmStructure' || type=='asmUnit' || type=='asmUnitStructure' || type=='asmContext')) {
		UIFactory['Node'].remove(uuid,callback,param1,param2,param3,param4); //asm node
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
function confirmSubmit(uuid,submitall,js) 
// =======================================================================
{
	if (js==null || js==undefined)
		js = "";
	if (js!="" && js.indexOf('(')<0)
		js = js + "('" + uuid + "')";
	else 
		js = replaceVariable(js);
	var href = "";
	var type = "";
	try {
		type = UICom.structure.ui[uuid].resource.type;
		href = document.getElementById('file_'+uuid).href;
	}
	catch(err) {
		href = "";
	}
	if (href=="" && type!="" && type=="Document")
		alertHTML(karutaStr[LANG]["document-required"]);
	else
	{
		document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-submit"];
		var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
		buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');submit('"+uuid+"',"+submitall+");"+js+"\">" + karutaStr[LANG]["button-submit"] + "</button>";
		document.getElementById('delete-window-footer').innerHTML = buttons;
		$('#delete-window').modal('show');
    }
}

//=======================================================================
function confirmDel(uuid,type,parentid,destid,callback,param1,param2,param3,param4) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:deleteandhidewindow('"+uuid+"','"+type+"','"+parentid+"','"+destid+"',"+callback+",'"+param1+"','"+param2+"','"+param3+"','"+param4+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelObject(id,type) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"$('#delete-window').modal('hide');UIFactory."+type+".del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelete(js) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\""+js+";$('#delete-window').modal('hide')\">" + karutaStr[LANG]["button-delete"] + "</button>";
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
function displayPage(uuid,depth,type,langcode,nodepth) {
//==================================
	if (g_backstack[g_backstack.length]!=uuid)
		g_backstack.push(uuid);
	//---------------------
	if (uuid==null)
		uuid = localStorage.getItem('currentDisplayedPage');
	localStorage.setItem('currentDisplayedPage',uuid);
	//---------------------
	if (type==null)
		type = "standard";
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
	var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	if (g_current_page!=uuid) {
		$(window).scrollTop(0);
		scrollTop = 0;
		scrollLeft = 0;
		g_current_page = uuid;
	}
	
	//---------------------
	$("#contenu").html("<div id='page' uuid='"+uuid+"'></div>");
	$('.selected').removeClass('selected');
	if (g_bar_type.indexOf("horizontal")>-1){  // update breadcrumb
		$("#sidebar_"+uuid).addClass('selected');
		if (g_breadcrumb=="@1") {
			var nodeid = uuid;
			var breadcrumb = "/" + UICom.structure.ui[nodeid].getLabel(null,'none');
			while($(UICom.structure.ui[nodeid].node)!=undefined && $(UICom.structure.ui[nodeid].node).parent().parent().parent().length!=0) {
				nodeid = $(UICom.structure.ui[nodeid].node).parent().attr("id");
				breadcrumb = "/" + UICom.structure.ui[nodeid].getLabel(null,'none') + breadcrumb;
			}
			breadcrumb = breadcrumb.substring(breadcrumb.indexOf("/")+1);
			$("#breadcrumb").html(breadcrumb.substring(breadcrumb.indexOf("/")+1));
		}
	} else {
		$("#sidebar_"+uuid).parent().addClass('selected');
		var nodeid = uuid;
		while($(UICom.structure.ui[nodeid].node)!=undefined && $(UICom.structure.ui[nodeid].node).parent().parent().parent().length!=0) {
			nodeid = $(UICom.structure.ui[nodeid].node).parent().attr("id");
			toggleSidebarPlus(nodeid);
		}
	}
	var name = $(UICom.structure['ui'][uuid].node).prop("nodeName");
	if (depth==null)
		depth=100;
	if ( (name=='asmRoot' || name=='asmStructure') && nodepth==null)
		depth = 1;
	if (UICom.structure['tree'][uuid]!=null) {
		if (type=='standard') {
			var node = UICom.structure['ui'][uuid].node;
			var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
			$("#welcome-edit").html("");
			UICom.structure["ui"][uuid].displayNode('standard',UICom.structure['tree'][uuid],'contenu',depth,langcode,g_edit);
		}
		if (type=='translate')
			UICom.structure["ui"][uuid].displayTranslateNode(type,UICom.structure['tree'][uuid],'contenu',depth,langcode,g_edit);
		if (type=='raw' || type=='model') {
			UICom.structure["ui"][uuid].displayNode(type,UICom.structure.tree[uuid],'contenu',depth,langcode,g_edit);
		}
	}
	var semtag = UICom.structure.ui[uuid].semantictag;
	if ( (g_userroles[0]=='designer' && semtag.indexOf('welcome-unit')>-1) || (semtag.indexOf('welcome-unit')>-1 && semtag.indexOf('-editable')>-1 && semtag.containsArrayElt(g_userroles)) ) {
		html = "<a  class='fas fa-edit' onclick=\"if(!g_welcome_edit){g_welcome_edit=true;} else {g_welcome_edit=false;};$('#contenu').html('');displayPage('"+uuid+"',100,'standard','"+langcode+"',true)\" data-title='"+karutaStr[LANG]["button-welcome-edit"]+"' data-toggle='tooltip' data-placement='bottom'></a>";
		$("#welcome-edit").html(html);
		var rootid = $(UICom.root.node).attr('id');
		var databack = false;
		var callback = "UIFactory.Node.reloadStruct";
		var param2 = "'"+g_portfolio_rootid+"'";
		var param3 = null;
		var param4 = null;
		html = "			<a class='nav-link dropdown-toggle' href='#' id='actionsDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		html += karutaStr[LANG]['Add'];
		html += "			</a>";
		html += "			<div class='dropdown-menu'>";
		html += "				<a class='dropdown-item' onclick=\"importBranch('"+rootid+"','karuta.model','configuration-unit',"+databack+","+callback+","+param2+","+param3+","+param4+");\">"+karutaStr[LANG]['add-configpage']+"</a>";
		html += "				<a class='dropdown-item' onclick=\"importBranch('"+rootid+"','karuta.model','WELCOME',"+databack+","+callback+","+param2+","+param3+","+param4+");\">"+karutaStr[LANG]['add-newwelcomepage']+"</a>";
		html += "			</div>";
		$("#welcome-add").html(html);
	}
	$("#wait-window").modal('hide');
	if ($("#standard-search-text-input").val()!=undefined && $("#standard-search-text-input").val()!="") {
		var searched_text = $("#standard-search-text-input").val();
		var  html = document.getElementById("contenu").innerHTML;
		var regex = new RegExp(searched_text, 'g');
		var newhtml  = html.replace(regex,"<span class='highlight'>"+searched_text+"</span>");
		document.getElementById("contenu").innerHTML = newhtml;
	}
	window.scrollTo(scrollLeft, scrollTop);
	$('[data-toggle="tooltip"]').tooltip({html: true, trigger: 'hover'});
}

//==================================
function previewPage(uuid,depth,type,langcode) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var previewbackdrop = document.createElement("DIV");
	previewbackdrop.setAttribute("class", "preview-backdrop");
	previewbackdrop.setAttribute("id", "previewbackdrop-"+uuid);
	$('body').append(previewbackdrop);

	var previewwindow = document.createElement("DIV");
	previewwindow.setAttribute("class", "preview-window");
	previewwindow.innerHTML =  previewBox(uuid);
	$('body').append(previewwindow);
	var footer = "<button class='btn' onclick=\"$('#preview-window-"+uuid+"').remove();$('#previewbackdrop-"+uuid+"').remove();\">"+karutaStr[LANG]['Close']+"</button>";
	$("#preview-window-footer-"+uuid).html(footer);
	$("#preview-window-body-"+uuid).html("");
	if (UICom.structure['tree'][uuid]!=null) {
		g_report_edit = false;
		UICom.structure["ui"][uuid].displayNode('standard',UICom.structure['tree'][uuid],"preview-window-body-"+uuid,depth,langcode,false);
		g_report_edit = g_edit;
		$("#previewbackdrop-"+uuid).show();
		$("#preview-window-"+uuid).show();
		window.scrollTo(0,0);
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
			success : function(data) {
				UICom.parseStructure(data);
				g_report_edit = false;
				UICom.structure["ui"][uuid].displayNode('standard',UICom.structure['tree'][uuid],"preview-window-body-"+uuid,depth,langcode,false);
				g_report_edit = g_edit;
				$("#preview-window-"+uuid).show();
				$("#previewbackdrop-"+uuid).show();
				window.scrollTo(0,0);
			},
			error : function() {
				var html = "";
				html += "<div>" + karutaStr[languages[langcode]]['error-notfound'] + "</div>";
				$("#preview-window-body-"+uuid).html(html);
				$("#previewbackdrop-"+uuid).show();
				$("#preview-window-"+uuid).show();
				window.scrollTo(0,0);
			}
		});
	}
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
	$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
}

//==================================
function importComponent(parentid,targetid,srce,part_semtag,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
	$.ajaxSetup({async: false});
	var databack = false;
	var callback = UIFactory.Node.reloadUnit;
	//------------------------------
	if (targetid!='##lastimported##')
		if (UICom.structure.ui[targetid]==undefined && targetid!="")
			targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	var semtags = part_semtag.split("+");
	for (var i=0;i<semtags.length;i++){
		if (semtags[i].length>0)
			importBranch(parentid,replaceVariable(srce),semtags[i],databack,callback);
			if (fctjs!="")
				eval(fctjs);
	}
};

//=======================================================================
function importBranch(destid,srcecode,srcetag,databack,callback,param2,param3,param4,param5,param6,param7,param8) 
//=======================================================================
// if srcetag does not exist as semantictag search as code
{
	var result = "";
	//------------
	if (destid=='##lastimported##')
		destid = g_importednodestack.pop();
	//------------
	srcecode = cleanCode(replaceVariable(srcecode));
	var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	if (srcecode.indexOf('.')<0 && srcecode!='self')  // There is no project, we add the project of the current portfolio
		srcecode = selfcode.substring(0,selfcode.indexOf('.')) + "." + srcecode;
	if (srcecode=='self')
		srcecode = selfcode;
	//------------
	var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	if (USER.admin || g_userroles[1]=='designer') {
		var rights = UICom.structure["ui"][destid].getRights();
		var roles = $("role",rights);
		if (roles.length==0) // test if model (otherwise it is an instance and we import)
			urlS = serverBCK_API+"/nodes/node/copy/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	}
	$.ajax({
		async: false,
		type : "POST",
		dataType : "text",
		url : urlS,
		data : "",
		success : function(data) {
			if (data=='Inexistent selection'){
				alertHTML(karutaStr[languages[LANGCODE]]['inexistent-selection']);
			} else {
				g_importednodestack.push(data);
			}
			result = data;
			if (callback!=null)
				if (databack)
					callback(data,param2,param3,param4,param5,param6,param7,param8);
				else
					callback(param2,param3,param4,param5,param6,param7,param8);
		},
		error : function(jqxhr,textStatus) {
			alertHTML(karutaStr[languages[LANGCODE]]['inexistent-selection']);
		}
	});
	return result;
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
		$.ajax({
			async:false,
			type : "GET",
			dataType : "script",
			url : "../../karuta/js/languages/locale_"+languages[i]+".js"
		});
	}
	callback();
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
function submit(uuid,submitall)
//=======================================================================
{
	var urlS = serverBCK_API+'/nodes/node/'+uuid+'/action/submit';
	if (submitall!=null && submitall)
		urlS += 'all';
	$.ajax({
		async:false,
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		uuid : uuid,
		success : function (data){
			if ($("#submit-"+uuid).parent().hasClass("submit-inreport")) {
				var parent = $("#submit-"+uuid).parent();
				while (!$(parent).hasClass("submit-tohide") && $(parent).prop("nodeName")!="table")
					parent = $(parent).parent();
				if ($(parent).hasClass("submit-tohide"))
					$(parent).hide();
				if (UICom.structure.ui[$("#submit-"+uuid).parent().attr('dashboardid')].startday_node!=null)
					register_report($("#submit-"+uuid).parent().attr('dashboardid'));
			} else
				UIFactory.Node.reloadUnit();
		}
	}); 
}

//=======================================================================
function reset(uuid)
//=======================================================================
{
	var urlS = serverBCK_API+'/nodes/node/'+uuid+'/action/reset';
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
	var urlS = serverBCK_API+'/nodes/node/'+uuid+'/action/show';
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
	var urlS = serverBCK_API+'/nodes/node/'+uuid+'/action/hide';
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
function getSendPublicURL(uuid,shareroles)
//==================================
{
	//---------------------
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		var email = $("#email").val();
		if (email!='') {
			getPublicURL(uuid,email,shareroles)
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
function getSendSharingURL(nodeid,uuid,sharewithrole,sharetoemail,sharetoroles,langcode,sharelevel,shareduration,sharerole,shareoptions)
//==================================
{
	var emailsarray = [];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var sharetomessage = "";
	var sharetoobj = "";
	$("#edit-window-footer").html("");
	fillEditBoxBody();
	$("#edit-window-title").html(karutaStr[LANG]['share-URL']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		if (sharetoemail.indexOf('?')>-1) {
			sharetoemail = $("#email").val();
		}
		if (shareoptions.indexOf('mess')>-1) {
			sharetomessage = $("#message").val();
			sharetomessage = $('<div/>').text(sharetomessage).html();  // encode html
		}
		if (shareoptions.indexOf('obj')>-1) {
			sharetoobj = $("#object").val();
		}
		if (shareduration=='?') {
			shareduration = $("#duration").val();
		}
		if (sharetoemail!='' && shareduration!='') {
			getPublicURL(uuid,sharetoemail,sharerole,sharewithrole,sharelevel,shareduration,langcode,sharetomessage,sharetoobj);
		}
		if (shareoptions.indexOf('function:')>-1) {
			var functionelts = shareoptions.substring(9).split('/');
			var functionstring = functionelts[0] + "(";
			for (var i=1; i<functionelts.length; i++) {
				functionstring += functionelts[i];
				if (i<functionelts.length-1)
					functionstring += ",";
			}
			functionstring += ")";
			eval (functionstring);
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	if (sharetoemail=='?') {
		html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input autocomplete='off' id='email' type='text' class='form-control'>";
		html += "		</div>";
	}
	if (shareoptions.indexOf('obj')>-1) {
		html += "		<label for='object' class='col-sm-3 control-label'>"+karutaStr[LANG]['subject']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input id='object' type='text' class='form-control'>";
		html += "		</div>";
	}
	if (shareoptions.indexOf('mess')>-1) {
		html += "		<label for='message' class='col-sm-3 control-label'>"+karutaStr[LANG]['message']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "<textarea id='message' class='form-control' expand='false' style='height:300px'></textarea>";
		html += "		</div>";
	}
	if (shareduration=='?') {
		html += "		<label for='email' class='col-sm-3 control-label'>"+karutaStr[LANG]['shareduration']+"</label>";
		html += "		<div class='col-sm-9'>";
		html += "			<input id='duration' type='text' class='form-control'>";
		html += "		</div>";
	}
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#message").wysihtml5(
			{
				toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false,"link": false},
				"uuid":uuid,
				"locale":LANG
			}
		);
	if (shareoptions.indexOf('emailautocomplete')>-1) {
		for ( var i = 0; i < UsersActive_list.length; i++) {
			emailsarray[emailsarray.length] = {'libelle': UsersActive_list[i].email_node.text()};
		}
		addautocomplete(document.getElementById('email'), emailsarray);
	}
	//--------------------------
}


//==================================
function getPublicURL(uuid,email,sharerole,role,level,duration,langcode) {
//==================================
	if (role==null)
		role = "all";
	if (level==null)
		level = 4; //public
	if (duration==null)
		duration = 'unlimited'; 
	var urlS = serverBCK+'/direct?type=email&uuid='+uuid+'&email='+email+'&role='+role+'&l='+level+'&d='+duration+'&sharerole='+sharerole;
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
function sendSharingURL(uuid,sharewithrole,email,sharetorole,langcode,level,duration,sharerole) {
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
				var urlS = serverBCK+'/direct?uuid='+uuid+'&email='+emails[i]+'&role='+sharewithrole+'&l='+level+'&d='+duration+'&sharerole='+sharerole+'&type=email';
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
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+g_portfolioid,
			success : function(data) {
				groups = $("rrg",data);
				for (var i=0;i<roles.length;i++) {
					if (roles[i].length>0) {
						if (groups.length>0) {
							for (var j=0; j<groups.length; j++) {
								var label = $("label",groups[j]).text();
								var users = $("user",groups[j]);
								if (label==roles[i] && users.length>0){
									for (var k=0; k<users.length; k++){
											var email = $("email",$(users[k])).text();
											if (email.length>4) {
												var urlS = serverBCK+'/direct?uuid='+uuid+'&email='+email+'&role='+sharewithrole+'&l='+level+'&d='+duration+'&sharerole='+sharerole+'&type=showtorole&showtorole='+roles[i];
												$.ajax({
													type : "POST",
													email : email,
													dataType : "text",
													contentType: "application/xml",
													url : urlS,
													success : function (data){
														sendEmailPublicURL(data,this.email,langcode);
													},
													error : function(jqxhr,textStatus) {
														alertHTML("Error in direct : "+jqxhr.responseText);
													}
												});
											} else {
												alert("email undefined:"+email);
											}
									}
								}
							}
						}
					}
				}
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in rolerightsgroups : "+jqxhr.responseText);
			}
		});
	}
}

//==================================
function getEmail(role,emails) {
//==================================
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
			//--------------------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+g_portfolioid,
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
	var serverURL = url.substring(0,url.indexOf("/application/htm"));
	if (url.indexOf("/application/htm")<0)
		serverURL = url.substring(0,url.indexOf("/karuta/htm"));
	url = serverURL+"/karuta/htm/public.htm?i="+encodeddata+"&amp;lang="+languages[langcode];
	//------------------------------
	var message = "";
//	message = g_sendEmailPublicURL_message.replace("##firstname##",USER.firstname);
//	message = message.replace("##lastname##",USER.lastname);
//	message = message.replace("#want-sharing#",karutaStr[LANG]['want-sharing']);
//	message = message.replace("#see#",karutaStr[LANG]['see']);
//	message = message.replace("#do not edit this#",url);
	//------------------------------

	message = g_configVar['send-email-logo'] + "<br>" + g_configVar['send-email-message'];
	message = message.replace("##firstname##",USER.firstname);
	message = message.replace("##lastname##",USER.lastname);
	const urlhtml = g_configVar['send-email-url']==""?g_configVar['send-email-image']:g_configVar['send-email-url']
	message = message.replace("##click-here##","<a href='"+url+"' style='"+g_configVar['send-email-url-style']+"'>"+urlhtml+"</a>");
	var elt = document.createElement("p");
	elt.textContent = message;
	message = elt.innerHTML;
	message = message.replace(/..\/..\/..\/..\/..\/../g, window.location.protocol+"//"+window.location.host);

	//------------------------------
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+karutaStr[LANG]['want-sharing']+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
	xml +="</node>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverBCK+"/mail",
		data: xml,
		success : function(data) {
			$('#edit-window').modal('hide');
			alertHTML(karutaStr[LANG]['email-sent']);
		}
	});
}


//==================================
function getLanguage() {
//==================================
	var cookielang = localStorage.getItem('karuta-language');
	if (cookielang == null)
		cookielang = g_configVar['default-language']
	if (cookielang == "" || cookielang == undefined)
		cookielang = languages[0];
	for (var i=0; i<languages.length;i++){
		if (languages[i]==cookielang) {
			LANGCODE = i;
			LANG = cookielang;
		}
	}
	setLanguage(LANG);
}

//==================================
function setLanguage(lang,caller) {
//==================================
	if (caller==null)
		caller="";
	localStorage.setItem('karuta-language',lang);
	LANG = lang;
	console.log("LANG: "+LANG);
	$("#flagimage").attr("src","../../karuta/img/flags/"+karutaStr[LANG]['flag-name']+".png");
	for (var i=0; i<languages.length;i++){
		if (languages[i]==lang)
			LANGCODE = i;
	}
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
	if ($("#toggleContent_"+uuid).hasClass("fa-plus")) {
		if (g_designerrole)
			UIFactory["Node"].updateMetadataAttribute(uuid,'collapsed','N');
		else
			sessionStorage.setItem("collapsed"+uuid,"N");
		$("#toggleContent_"+uuid).removeClass("fa-plus")
		$("#toggleContent_"+uuid).addClass("fa-minus")
		$("#content-"+uuid).show();
	} else {
		if (g_designerrole)
			UIFactory["Node"].updateMetadataAttribute(uuid,'collapsed','Y');
		else
			sessionStorage.setItem("collapsed"+uuid,"Y");
		$("#toggleContent_"+uuid).removeClass("fa-minus")
		$("#toggleContent_"+uuid).addClass("fa-plus")
		$("#content-"+uuid).hide();
	}
}

//==================================
function toggleSharing(uuid) {
//==================================
	if ($("#toggleSharing_"+uuid).hasClass("fa-minus")) {
		$("#toggleSharing_"+uuid).removeClass("fa-minus")
		$("#toggleSharing_"+uuid).addClass("fa-minus")
		$("#sharing-content-"+uuid).show();
	} else {
		$("#toggleSharing_"+uuid).removeClass("fa-minus")
		$("#toggleSharing_"+uuid).addClass("fa-minus")
		$("#sharing-content-"+uuid).hide();
	}
}

//==================================
function toggleMetadata(state) {
//==================================
	if (state=='hidden') {
		changeCss(".metainfo", "display:none;");
		changeCss(".cssinfo", "display:none;");
		g_visible = 'hidden';
	} else {
		changeCss(".metainfo", "display:block;");
		changeCss(".cssinfo", "display:block;");
		g_visible = 'visible';
	}
	localStorage.setItem('metadata',g_visible);
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
		localStorage.setItem('sidebar-'+g_portfolioid,'hidden');
		$("#sidebar").hide();
		g_display_sidebar = false;
		$("#contenu").removeClass().addClass('col-md-12').addClass('col-sm-12');
	} else {
		localStorage.setItem('sidebar-'+g_portfolioid,'visible');
		$("#contenu").removeClass().addClass('col-md-9').addClass('col-sm-9');
		$("#sidebar").show();
		g_display_sidebar = true;
	}
	UIFactory['Node'].reloadUnit();
}

//==================================
function toggleSidebarPlusMinus(uuid) { // click on PlusMinus
//==================================
	if ($("#toggle_"+uuid).hasClass("fa-plus"))
	{
//		g_toggle_sidebar [uuid] = 'open';
		localStorage.setItem('sidebar'+uuid,'open');
		$("#toggle_"+uuid).removeClass("fa-plus")
		$("#toggle_"+uuid).addClass("fa-minus")
		$("#collapse"+uuid).collapse("show")
	} else {
//		g_toggle_sidebar [uuid] = 'closed';
		localStorage.setItem('sidebar'+uuid,'closed');
		$("#toggle_"+uuid).removeClass("fa-minus")
		$("#toggle_"+uuid).addClass("fa-plus")
		$("#collapse"+uuid).collapse("hide")
	}
}

//==================================
function toggleSidebarPlus(uuid) { // click on label
//==================================
	if ($("#toggle_"+uuid).hasClass("fa-plus"))
	{
//		g_toggle_sidebar [uuid] = 'open';
		localStorage.setItem('sidebar'+uuid,'open');
		$("#toggle_"+uuid).removeClass("fa-plus")
		$("#toggle_"+uuid).addClass("fa-minus")
		$("#collapse"+uuid).collapse("show");
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
	document.getElementById('image-window-header').innerHTML = buttons;
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
function toggleGroup(group_type,uuid,callback,type,lang) {
//==================================
	if ($("#toggleContent_"+group_type+"-"+uuid).hasClass("fa-plus")) {
		$("#toggleContent_"+group_type+"-"+uuid).removeClass("fa-plus");
		$("#toggleContent_"+group_type+"-"+uuid).addClass("fa-minus");
		if (callback!=null){
			if (jQuery.isFunction(callback))
				callback(uuid,"content-"+group_type+"-"+uuid,type,lang);
			else
				eval(callback+"('"+uuid+"','content-"+group_type+"-"+uuid+"','"+type+"','"+lang+"')");
		}
		$("#content-"+group_type+"-"+uuid).show();
		displayGroup[group_type][uuid] = 'open';
		localStorage.setItem('dg_'+group_type+"-"+uuid,'open');
	} else {
		$("#toggleContent_"+group_type+"-"+uuid).removeClass("fa-minus");
		$("#toggleContent_"+group_type+"-"+uuid).addClass("fa-plus");
		$("#content-"+group_type+"-"+uuid).hide();
		displayGroup[group_type][uuid] = 'closed';
		localStorage.setItem('dg_'+group_type+"-"+uuid,'closed');
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
	if ($("#toggleContent2Select_"+uuid).hasClass("fa-minus")) {
		$("#toggleContent2Select_"+uuid).removeClass("fa-minus")
		$("#toggleContent2Select_"+uuid).addClass("fa-minus")
		$("#selectform-content-"+uuid).show();
	} else {
		$("#toggleContent2Select_"+uuid).removeClass("fa-minus")
		$("#toggleContent2Select_"+uuid).addClass("fa-minus")
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
function setVariables(data)
//==================================
{
	//--------------------------
	g_variables["USER.login"] = USER.username;
	g_variables["USER.lastname"] = USER.lastname;
	g_variables["USER.firstname"] = USER.firstname;
	g_variables["USER.email"] = USER.email;
	//--------------------------
	var variable_nodes = $("asmContext:has(metadata[semantictag*='g-variable'])",data);
	for (var i=0;i<variable_nodes.length;i++) {
		var var_name = $("name",$("asmResource[xsi_type='Variable']",variable_nodes[i])).text()
		var var_value = $("value",$("asmResource[xsi_type='Variable']",variable_nodes[i])).text()
		g_variables[var_name] = var_value;
	}
	try {
		var select_variable_nodes = $("asmContext:has(metadata[semantictag*='g-select-variable'])",data);
		for (var i=0;i<select_variable_nodes.length;i++) {
			var value = UICom.structure.ui[$(select_variable_nodes[i]).attr("id")].resource.getAttributes().value;
			var code = UICom.structure.ui[$(select_variable_nodes[i]).attr("id")].resource.getAttributes().code;
			var variable_value = (value=="") ? code : value;
			g_variables[UICom.structure.ui[$(select_variable_nodes[i]).attr("id")].getCode()] = cleanCode(variable_value,true);
		}
	} catch(e){}
}

//==================================
function updateVariable(node)
//==================================
{
	var value = UICom.structure.ui[$(node).attr("id")].resource.getAttributes().value;
	var code = UICom.structure.ui[$(node).attr("id")].resource.getAttributes().code;
	var variable_value = (value=="") ? code : value;
	g_variables[UICom.structure.ui[$(node).attr("id")].getCode()] = cleanCode(variable_value,true);
}


//==============================
function logout()
//==============================
{
	$.ajax({
		type: "GET",
		dataType: "text",
		url: serverBCK_API+"/credential/logout",
		data: "",
		success: function(data) {
		window.location="login.htm?lang="+LANG;
		},
		error: function(data) {
		window.location="login.htm?lang="+LANG;
		}
	});
}

//==============================
function hideAllPages()
//==============================
{
	$("#main-list").hide();
	$("#main-portfoliosgroup").hide();
	$("#main-portfolio").hide();
	$("#main-user").hide();
	$("#main-usersgroup").hide();
	$("#main-exec-report").hide();
	$("#main-exec-batch").hide();
}


//==============================
function removeStr(str1,str2)
//==============================
{
	return str1.replace(str2,"");
}

//==============================
function cleanCode(code,variable)
//==============================
{
	code = removeStr(code,"@");
	if (!variable)
		code = removeStr(code,"#");
	code = removeStr(code,"%");
	code = removeStr(code,"*");
	code = removeStr(code,"$");
	code = removeStr(code,"&");
	code = removeStr(code,"!");
	code = removeStr(code,"?");
	code = removeStr(code,"----");
	return code;
}

//==================================
function displayTechSupportForm(langcode)
//==================================
{
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var application_server = serverURL+"/"+appliname;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#edit-window-footer").html("");
	$("#edit-window-title").html(karutaStr[LANG]['technical-support']);
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var send_button = "<button id='send_button' class='btn'>"+karutaStr[LANG]['button-send']+"</button>";
	var obj = $(send_button);
	$(obj).click(function (){
		var user_name = $("#user-name").val();
		var user_email = $("#user-email").val();
		var message = $("#email-message").val();
		var subject = application_server+" - "+karutaStr[LANG]['sent-by']+" "+user_name + " ("+user_email+")";
		//---------------------
		var xml ="<node>";
		xml +="<recipient>"+g_configVar['technical-support']+"</recipient>";
		xml +="<subject>"+subject+"</subject>";
		xml +="<message>"+message+"</message>";
		xml +="<sender>"+user_email+"</sender>";
		xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
		xml +="</node>";
		$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : serverBCK+"/mail",
			data: xml,
			success : function() {
				alertHTML(karutaStr[LANG]['email-sent']);
				$("#edit-window").modal("hide");
			},
			error : function(jqxhr,textStatus) {
				alert("Error in send mail : "+jqxhr.responseText);
			}
		});

	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='application-server' class='col-sm-3 control-label'>"+karutaStr[LANG]['application-server']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='application-server' disabled='true' type='text' value='"+application_server+"' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='user-name' class='col-sm-3 control-label'>"+karutaStr[LANG]['user-name']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='user-name' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='user-email' class='col-sm-3 control-label'>"+karutaStr[LANG]['user-email']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='user-email' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='email-message' class='col-sm-3 control-label'>"+karutaStr[LANG]['email-message']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<textarea rows='5' id='email-message' class='form-control'></textarea>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	if (USER!=null) {
		$("#user-name").val(USER.firstname+" "+USER.lastname);
		$("#user-name").attr('disabled','true');
		$("#user-email").val($(USER.email_node).text());
		if ($(USER.email_node).text()!="")
			$("#user-email").attr('disabled','true');
	}
	$('#edit-window').modal('show')
	//--------------------------
}

//==================================
function convertDot2Dash(text) 
//==================================
{
	return text.replace(/\./g, '-'); 
}




//==============================
function toggleMode()
//==============================
{
	if (g_edit) {
		g_report_edit = g_edit = false;
		$("#toggle-mode-icon").removeClass('fas fa-toggle-on').addClass('fas fa-toggle-off');
	} else {
		g_report_edit = g_edit = true;
		$("#toggle-mode-icon").removeClass('fas fa-toggle-off').addClass('fas fa-toggle-on');
	}
//	UIFactory.Portfolio.displaySidebar(UICom.root,'sidebar','standard',LANGCODE,g_edit,g_portfolio_rootid);
	var uuid = $("#page").attr('uuid');
	$("#sidebar_"+uuid).click();
}

//==============================
String.prototype.toNoAccents = function()
//==============================
{
	var accent = [
		/[\300-\306]/g, /[\340-\346]/g, // A, a
		/[\310-\313]/g, /[\350-\353]/g, // E, e
		/[\314-\317]/g, /[\354-\357]/g, // I, i
		/[\322-\330]/g, /[\362-\370]/g, // O, o
		/[\331-\334]/g, /[\371-\374]/g, // U, u
		/[\321]/g, /[\361]/g, // N, n
		/[\307]/g, /[\347]/g, // C, c
	];
	var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
	var str = this;
	for(var i = 0; i < accent.length; i++){
		str = str.replace(accent[i], noaccent[i]);
	}
	return str;
}

//==============================
function applyNavbarConfiguration()
//==============================
{
//	if (g_configVar['navbar-brand-logo']!="")
		$('#navbar-brand-logo').html(g_configVar['navbar-brand-logo']);
//	if (g_configVar['navbar-brand-logo-style']!="")
		$("#navbar-brand-logo").attr("style",g_configVar['navbar-brand-logo-style']);
	if (g_configVar['navbar-display-mailto']=='0')
		$("#navbar-mailto").hide();
	if (g_configVar['navbar-display-language']=='0')
		$("#navbar-language").hide();
	var root = document.documentElement;
	if (g_configVar['navbar-background-color']!=undefined)
		root.style.setProperty('--navbar-background-color', g_configVar['navbar-background-color']);
	if (g_configVar['navbar-text-color']!=undefined)
		root.style.setProperty('--navbar-text-color', g_configVar['navbar-text-color']);
}

//==============================
function applyKarutaConfiguration()
//==============================
{
	var root = document.documentElement;
	if (g_configVar['font-standard']!=undefined && g_configVar['font-standard']!="")
		root.style.setProperty('--font-family',g_configVar['font-standard'] + ", Helvetica, Arial, sans-serif");
	if (g_configVar['font-size-coeff']!=undefined && g_configVar['font-size-coeff']!="") 
		root.style.setProperty('--font-size-coeff',g_configVar['font-size-coeff']);
	if (g_configVar['font-google']!=undefined && g_configVar['font-google']!="") {
		$("#font-family").attr("href","https://fonts.googleapis.com/css?family="+g_configVar['font-google']);
		root.style.setProperty('--font-family',g_configVar['font-google'] + ", Helvetica, Arial, sans-serif");
	}
}

//==============================
function getNodeid(semtag,data)
//==============================
{
	return $("metadata[semantictag='"+semtag+"']",data).parent().attr("id")
}

//==============================
function doNotDisplayEdit()
//==============================
{
	localStorage.setItem('display-edition-'+g_portfolioid,'no');
}

//------------------------------------------------------
//---------- config function ---------------------------
//------------------------------------------------------

//==============================
function getImg(semtag,data,langcode,fluid)
//==============================
{
	var result = "";
	if ($("filename[lang='"+languages[langcode]+"']",$("asmResource[xsi_type='Image']",$("metadata[semantictag='"+semtag+"']",data).parent())).text()!="") {
		if (langcode==null)
			langcode = LANGCODE;
		if (fluid==null)
			fluid = true;
		var width = getText(semtag,'Image','width',data,langcode);
		var height =  getText(semtag,'Image','height',data,langcode);
		var result = "";
		result += "<img ";
		if (fluid)
			result += "class='img-fluid' ";
		result += "style='display:inline"+(width!=""?';width:'+width:"")+""+(height!=""?';height:'+height:"")+"' src='../../../"+serverBCK+"/resources/resource/file/"+getNodeid(semtag,data)+"?lang="+languages[langcode]+"'/>";
	}
	return result;
}


//==============================
function getBackgroundURL(semtag,data,langcode)
//==============================
{
	var result = "";
	if ($("metadata[semantictag='"+semtag+"']",data).length>0) {
		if (langcode==null)
			langcode = LANGCODE;
		result =  "url('../../../"+serverBCK+"/resources/resource/file/"+getNodeid(semtag,data)+"?lang="+languages[langcode]+"')";
	}
	return result;
}

//==============================
function getContentStyle(semtag,data)
//==============================
{
	var result = "";
	if ($("metadata[semantictag='"+semtag+"']",data).length>0) {
		result = UIFactory.Node.getDataContentStyle($("metadata-epm",$("metadata[semantictag='"+semtag+"']",data).parent())[0]);
	}
	return result;
}

//==============================
function getText(semtag,objtype,elttype,data,langcode)
//==============================
{
	var result = "";
	if ($("metadata[semantictag='"+semtag+"']",data).length>0) {
		//---------------------
		if (elttype=='value' || elttype=='code') // not language dependent
			result = $(elttype,$("asmResource[xsi_type='"+objtype+"']",$("metadata[semantictag='"+semtag+"']",data).parent())).text();
		else
			result = $(elttype+"[lang="+languages[langcode]+"]",$("asmResource[xsi_type='"+objtype+"']",$("metadata[semantictag='"+semtag+"']",data).parent())).text();
	}
	return result;
}

//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------

//==============================
function printSection(eltid)
//==============================
{
	var node_type = UICom.structure.ui[eltid.substring(6)].asmtype;
	if (node_type=='asmUnit' || node_type=='asmStructure' || node_type=='asmRoot')
		window.print();
	else {
		$("#wait-window").modal('show');
		$("#print-window").html("");
		var divcontent = $(eltid).clone();
		var ids = $("*[id]", divcontent);
		$(ids).removeAttr("id");
		var content = $(divcontent).html();
		$("#print-window").html(content);
		$("#main-body").addClass("section2hide");
		$("#print-window").addClass("section2print");
		$("#wait-window").modal('hide');
		
		window.print();
		$("#print-window").removeClass("section2print");
		$("#main-body").removeClass("section2hide");
		$("#print-window").css("display", "none");
	}
}

//==================================
function autocomplete(input,arrayOfValues,onupdate,self,langcode) {
//==================================
	if (input!=null) {
		var currentFocus;
		//execute a function when someone writes in the text field:
		input.addEventListener("input", function(e) {
			var a, b, i, val = this.value;
			closeAllLists();
			if (!val) { return false;}
		 	currentFocus = -1;
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(a);
			for (i = 0; i < arrayOfValues.length; i++) {
				var indexval = arrayOfValues[i].libelle.toUpperCase().indexOf(val.toUpperCase());
				if (indexval>-1) {
					b = document.createElement("DIV");
					b.innerHTML = arrayOfValues[i].libelle.substr(0, indexval);
					b.innerHTML += "<strong>" + arrayOfValues[i].libelle.substr(indexval,val.length) + "</strong>";
					b.innerHTML += arrayOfValues[i].libelle.substr(indexval+val.length);
					var value = "";
					if (arrayOfValues[i].value!==undefined)
						value = arrayOfValues[i].value;
					b.innerHTML += "<input type='hidden' code='"+arrayOfValues[i].code+"' label=\""+arrayOfValues[i].libelle+"\" value=\""+value+"\" >";
					b.addEventListener("click", function(e) {
						$(input).attr("label_"+languages[langcode],$("input",this).attr('label'));
						$(input).attr('code',$("input",this).attr('code'));
						$(input).attr('value',$("input",this).attr('value'));
						input.value = $("input",this).attr('label');
						eval(onupdate);
						closeAllLists();
					});
					a.appendChild(b);
				}
			}
		});
		//execute a function presses a key on the keyboard:
		input.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
			//If the arrow DOWN key is pressed, increase the currentFocus variable:
				currentFocus++;
				//and and make the current item more visible:
			addActive(x);
			} else if (e.keyCode == 38) { //up
				//If the arrow UP key is pressed, decrease the currentFocus variable:
				currentFocus--;
				//and and make the current item more visible:
				addActive(x);
			} else if (e.keyCode == 13) {
				//If the ENTER key is pressed, prevent the form from being submitted,
				e.preventDefault();
				if (currentFocus > -1) {
					//and simulate a click on the "active" item:
					if (x) x[currentFocus].click();
				}
			}
		});
		function addActive(x) {
			//a function to classify an item as "active":
			if (!x) return false;
			//start by removing the "active" class on all items:
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (x.length - 1);
			//add class "autocomplete-active":
			x[currentFocus].classList.add("autocomplete-active");
		}
		function removeActive(x) {
			//a function to remove the "active" class from all autocomplete items:
			for (var i = 0; i < x.length; i++) {
				x[i].classList.remove("autocomplete-active");
			}
		}
		function closeAllLists(elmnt) {
			//close all autocomplete lists in the document, except the one passed as an argument:
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != input) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		}
		//execute a function when someone clicks in the document:
		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});
	}
}

//==================================
function addautocomplete(input,arrayOfValues,onupdate,self,langcode)
//==================================
{	
	if (input!=null) {
		var currentFocus;
		input.addEventListener("input", function(e) {
			var a, b, i, val = this.value.substring(this.value.lastIndexOf(" ")+1);
			closeAllLists();
			if (!val) {
				if (this.value=="" && onupdate!=null)
					eval(onupdate)
				return false;
			}
		 	currentFocus = -1;
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(a);
			for (i = 0; i < arrayOfValues.length; i++) {
				var indexval = arrayOfValues[i].libelle.toUpperCase().indexOf(val.toUpperCase());
				if (indexval>-1) {
					b = document.createElement("DIV");
					b.innerHTML = arrayOfValues[i].libelle.substr(0, indexval);
					b.innerHTML += "<strong>" + arrayOfValues[i].libelle.substr(indexval,val.length) + "</strong>";
					b.innerHTML += arrayOfValues[i].libelle.substr(indexval+val.length);
					b.innerHTML += "<input type='hidden' label=\""+arrayOfValues[i].libelle+"\" >";
					b.addEventListener("click", function(e) {
						if (input.value.lastIndexOf(" "))
							input.value = input.value.substring(0,input.value.lastIndexOf(" ")+1) + $("input",this).attr('label');
						else
							input.value = $("input",this).attr('label');
						if (onupdate!=null)
							eval(onupdate);
						else
							$(input).change();
						closeAllLists();
					});
					a.appendChild(b);
				}
			}
		});
		input.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
				currentFocus++;
			addActive(x);
			} else if (e.keyCode == 38) { //up
				currentFocus--;
				addActive(x);
			} else if (e.keyCode == 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (x) x[currentFocus].click();
				}
			}
		});
		function addActive(x) {
			if (!x) return false;
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (x.length - 1);
			x[currentFocus].classList.add("autocomplete-active");
		}
		function removeActive(x) {
			for (var i = 0; i < x.length; i++) {
				x[i].classList.remove("autocomplete-active");
			}
		}
		function closeAllLists(elmnt) {
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != input) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		}
		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});
	}
}


//==================================
function replaceVariable(text,node,withquote)
//==================================
{
	if (withquote==null)
		withquote = true;
	if (text!=undefined && text.indexOf('lastimported')>-1) {
		text = text.replaceAll('##lastimported-1##',"g_importednodestack[g_importednodestack.length-2]");
		text = text.replaceAll('##lastimported-2##',"g_importednodestack[g_importednodestack.length-3]");
		text = text.replaceAll('##lastimported##',"g_importednodestack[g_importednodestack.length-1]");
	}
	if (node!=null && node!=undefined && withquote && text.indexOf('##currentnode##')>-1)
		text = text.replaceAll('##currentnode##',"'"+node.id+"'");
	if (node!=null && node!=undefined && withquote && text.indexOf('##currentcode##')>-1)
		text = text.replaceAll('##currentcode##',node.getCode());
	if (node!=null && node!=undefined && !withquote && text.indexOf('##currentnode##')>-1)
		text = text.replaceAll('##currentnode##',node.id);
	if (node!=null && node!=undefined && !withquote && text.indexOf('##currentcode##')>-1)
		text = text.replaceAll('##currentcode##',node.getCode());
	var n=0;
	while (text!=undefined && text.indexOf("{##")>-1 && n<100) {
		var test_string = text.substring(text.indexOf("{##")+3); // test_string = abcd{##variable##}efgh.....
		var variable_name = test_string.substring(0,test_string.indexOf("##}"));
		if (g_variables[variable_name]!=undefined)
			text = text.replace("{##"+variable_name+"##}", g_variables[variable_name]);
		n++; // to avoid infinite loop
	}
	while (text!=undefined && text.indexOf("##")>-1 && n<100) {
		var test_string = text.substring(text.indexOf("##")+2); // test_string = abcd##variable##efgh.....
		var variable_name = test_string.substring(0,test_string.indexOf("##"));
		if (g_variables[variable_name]!=undefined)
			text = text.replace("##"+variable_name+"##", g_variables[variable_name]);
		if (text.indexOf("[")>-1) {
			var variable_value = variable_name.substring(0,variable_name.indexOf("["))
			var i = text.substring(text.indexOf("[")+1,text.indexOf("]"));
			i = replaceVariable(i);
			if (g_variables[variable_value]!=undefined && g_variables[variable_value].length>=i)
				text = g_variables[variable_value][i];
			}
		n++; // to avoid infinite loop
	}
	return text;
}


//==================================
function addParentCode (parentid) {
//==================================
	var parentCode = UICom.structure.ui[parentid].getCode();
	var parentcode_parts = parentCode.split("*");
	var nodes = $("asmUnitStructure:has(code:not(:empty))",UICom.structure.ui[parentid].node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		var newcode = nodecode =  UICom.structure.ui[nodeid].getCode();
		if (nodecode.indexOf(parentCode)<0) {
			//-------test if parent last = node first------------
			var nodecode_parts = nodecode.split("*");
			if (parentcode_parts[parentcode_parts.length-1]==nodecode_parts[0]) {
				newcode = "";
				for (var j=1;j<nodecode_parts.length;j++) 
					newcode += nodecode_parts[j] + ((j==nodecode_parts.length-1)?"" : "*");
			}
			//-------------------
			var newnodecode = parentCode + "*" + newcode;
			//-------------------
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
			$("code",resource).text(newnodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
		}
	}
	UIFactory.Node.reloadUnit();
}

//==================================
function updateParentCode (node) {
//==================================
	var uuid = $(node).attr("id");
	var parentcode = UICom.structure.ui[uuid].getCode();
	var nodes = $("> asmUnitStructure:has(code:not(:empty))",UICom.structure.ui[uuid].node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		var nodecode =  UICom.structure.ui[nodeid].getCode();
		if (nodecode.indexOf("*")>-1) {
			var newnodecode = parentcode + nodecode.substring(nodecode.indexOf("*"));
			//-------------------
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
			$("code",resource).text(newnodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
		}
	}
	UIFactory.Node.reloadUnit;
}

//==================================
function getNodeIdBySemtag(semtag)
//==================================
{
	var nodeid = "";
	var nodes = $("*:has(>metadata[semantictag='"+semtag+"'])",g_portfolio_current);
	if (nodes.length>0)
		nodeid = $(nodes[0]).attr("id");
	return nodeid;
}
//=====================================================================================================
//=====================================================================================================
//============================== TREE MANAGEMENT ====================================================
//=====================================================================================================
//=====================================================================================================

//==================================
function toggleElt(closeSign,openSign,eltid,type)
//==================================
{ // click on open/closeSign
	var elt = document.getElementById(type+"-toggle_"+eltid);
	elt.classList.toggle(openSign);
	elt = document.getElementById(type+"-treecontent_"+eltid);
	elt.classList.toggle('open');
	if ($("#"+type+"-toggle_"+eltid).hasClass(openSign))
		localStorage.setItem(type+"-toggle_"+eltid,'open');
	else
		localStorage.setItem(type+"-toggle_"+eltid,'closed');
}

//==================================
function toggleOpenElt(closeSign,openSign,eltid)
//==================================
{ // click on label
	var cookie = localStorage.getItem('sidebar'+eltid);
	if (cookie == "closed") {
		localStorage.setItem('sidebar'+eltid,'open');
		document.getElementById("toggle_"+eltid).classList.add('openSign');
		document.getElementById("collapse_"+eltid).classList.add('open');
	}
}

//==================================
function selectElt(type,uuid)
//==================================
{ // click on label
	$('.'+type).removeClass('active');
	$('#'+uuid).addClass('active');
//	document.getElementById(uuid).classList.add('active');
}

//==================================
function selectElts(type,list)
//==================================
{ // click on label
	$('.'+type).removeClass('active');
	for (var i=0;i<list.length;i++) {
		$('#'+list[i]).addClass('active');
	}
}

//=====================================================================================================
//=====================================================================================================
//============================== COPY CLIPBOARD =======================================================
//=====================================================================================================
//=====================================================================================================

//==================================
function copyInclipboad(id) 
//==================================
{
	var element = document.getElementById("pcode_"+id);
	var textArea = document.createElement("textarea");
	textArea.value = element.textContent;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("Copy");
	textArea.remove();
	$(element).tooltip('hide');
	$(element).attr('title', karutaStr[LANG]['copied'] +" : "+element.textContent);
	$(element).tooltip('show');
}

//==================================
function outCopy(id)
//==================================
{
	var element = document.getElementById("pcode_"+id);
	$(element).tooltip('hide');
	$(element).attr('title', karutaStr[LANG]['copy'] +" : "+element.textContent);
}




//==================================
function callmajcodenum (nodeid) {
//==================================
	majcodenum(UICom.structure.ui[nodeid].node);
}

//=====================================================================================================
//=====================================================================================================
//============================== UTILITIES =======================================================
//=====================================================================================================
//=====================================================================================================

//==================================
function updatelabel (uuid) {
//==================================
	var label = UICom.structure.ui[uuid].getLabel(null,'none');
	var nodes = $("*:has(>metadata[semantictag*='updatelabel'])",UICom.structure.ui[uuid].node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
		$("label[lang='"+LANG+"']",resource).text(label);
		var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
			success : function(data) {
			},
			error : function(data) {
			}
		});
		//-------------------
	}
	//-------------------------------------------------------------------------
	if (UICom.structure.ui[uuid].asmtype=='asmStructure')
		UIFactory.Node.reloadStruct();
	else
		UIFactory.Node.reloadUnit();
}

//==================================
function updatecodenum (uuid) {
//==================================
	var code = UICom.structure.ui[uuid].getCode();
	if (code.indexOf("*")>-1)
		code = code.substring(0,code.indexOf("*"));
	var nodes = $("*:has(>metadata[semantictag*='updatecode'])",UICom.structure.ui[uuid].node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
		var nodecode =  UICom.structure.ui[nodeid].getCode();
		var newnodecode = nodecode;
		if (nodecode.indexOf("*")>-1) {
			var oldpartcode = nodecode.substring(nodecode.indexOf("*"));
			newnodecode = code+oldpartcode;
		}
		$("code",resource).text(newnodecode);
		var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
			success : function(data) {
			},
			error : function(data) {
			}
		});
		//-------------------
	}
	//-----Node ordering-------------------------------------------------------
	var nodes = $("*:has(>metadata[semantictag*='updatenum'])",UICom.structure.ui[uuid].node);
	var tableau1 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
		var code = $('code',resource).text();
		tableau1[i] = [code.substring(0,code.indexOf("*")+2),nodes[i]];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//-------------------------------------------------------------------------
	var num = 0;
	var currentletter = "";
	for ( var i = 0; i < newTableau1.length; i++) {
		var oldcode = newTableau1[i][0];
		var starindex = oldcode.indexOf("*");
		var letter = oldcode.substring(starindex+1,starindex+2);
		if (letter!=currentletter) {
			num = 0;
			currentletter = letter;
		}
		num++;
		var newcode = oldcode.substring(0,starindex+1)+currentletter+(num>9?"":"0")+num.toString();
		//--------------- maj resource --------------
		var nodeid = $(newTableau1[i][1]).attr('id');
		var resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1])[0];
		$("code",resource).text(newcode);
		var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
			success : function(data) {
			},
			error : function(data) {
			}
		});
		//-------------------
	}
	//-------------------------------------------------------------------------
	if (UICom.structure.ui[uuid].asmtype=='asmStructure')
		UIFactory.Node.reloadStruct();
	else
		UIFactory.Node.reloadUnit();
}

//==================================
function callmajcodenum (nodeid) {
//==================================
	majcodenum(UICom.structure.ui[nodeid].node);
}

//==================================
function majcodenum (node) {
//==================================
	var uuid = $(node).attr("id");
	var code = UICom.structure.ui[uuid].getCode();
	if (code.indexOf("*")>-1)
		code = code.substring(0,code.indexOf("*"));
	var nodes = $("*:has(>metadata[semantictag*='majcode'])",node);
	for (var i=0;i<nodes.length;i++) {
		var nodeid = $(nodes[i]).attr("id");
		if (UICom.structure.ui[nodeid].semantictag.indexOf('majcode')>-1) {
			var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
			var nodecode =  UICom.structure.ui[nodeid].getCode();
			var newnodecode = nodecode;
			if (nodecode.indexOf("*")>-1) {
				var oldpartcode = nodecode.substring(nodecode.indexOf("*"));
				newnodecode = code+oldpartcode;
			}
			$("code",resource).text(newnodecode);
			var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//-------------------
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
				success : function(data) {
				},
				error : function(data) {
				}
			});
			//-------------------
		}
	}
	//-----Node ordering-------------------------------------------------------
	var nodes = $("*:has(>metadata[semantictag*='majnum'])",node);
	var tableau1 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		var resource = $("asmResource[xsi_type='nodeRes']",nodes[i])[0];
		var code = $('code',resource).text();
		tableau1[i] = [code.substring(0,code.indexOf("*")+2),nodes[i]];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//-------------------------------------------------------------------------
	var num = 0;
	var currentletter = "";
	for ( var i = 0; i < newTableau1.length; i++) {
		var oldcode = newTableau1[i][0];
		var starindex = oldcode.indexOf("*");
		var letter = oldcode.substring(starindex+1,starindex+2);
		if (letter!=currentletter) {
			num = 0;
			currentletter = letter;
		}
		num++;
		var newcode = oldcode.substring(0,starindex+1)+currentletter+(num>9?"":"0")+num.toString();
		//--------------- maj resource --------------
		var nodeid = $(newTableau1[i][1]).attr('id');
		var resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1])[0];
		$("code",resource).text(newcode);
		var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
			success : function(data) {
			},
			error : function(data) {
			}
		});
		//-------------------
	}
	//-------------------------------------------------------------------------
	if (UICom.structure.ui[uuid].asmtype=='asmStructure')
		UIFactory.Node.reloadStruct();
	else
		UIFactory.Node.reloadUnit();
}

//==================================
function sortTable (tableid)
//==================================
{
	// adapted from Pierre Giraud - www.pierre-giraud.com
	const compare = function(ids, asc){
		return function(row1, row2){
			const tdValue = function(row, ids){
				return row.children[ids].textContent;
			}
			const tri = function(v1, v2){
				if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)){
					return v1 - v2;
				} else {
					return v1.toString().localeCompare(v2);
				}
				return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
			};
			return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
		}
	}

	var table = document.getElementById(tableid);
	var ths = table.querySelectorAll(".sort-th");
	var trs = table.querySelectorAll(".sort-tr");
	ths.forEach(function(th){
		th.addEventListener('click', function(){
			let classe = Array.from(trs).sort(compare(Array.from(ths).indexOf(th), this.asc = !this.asc));
			classe.forEach(function(tr){
				table.appendChild(tr)
			});
		});
	});
}

//==================================
function getTarget (knode,position_semtag)
//==================================
{
	var node = knode.node;
	var target = "";
	if (position_semtag.indexOf("child.")>-1) {
		var semtag = position_semtag.substring("child.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",node);
	} else	if (position_semtag.indexOf("sibling.")>-1) {
		var semtag = position_semtag.substring("sibling.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent());
	} else if (position_semtag.indexOf("parent.parent.parent.parent.parent.")>-1) {
		var semtag = position_semtag.substring("parent.parent.parent.parent.parent.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent().parent().parent().parent().parent()).addBack("*:has(>metadata[semantictag*='"+semtag+"'])");
	} else if (position_semtag.indexOf("parent.parent.parent.parent")>-1) {
		var semtag = position_semtag.substring("parent.parent.parent.parent.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent().parent().parent().parent()).addBack("*:has(>metadata[semantictag*='"+semtag+"'])");
	} else if (position_semtag.indexOf("parent.parent.parent")>-1) {
		var semtag = position_semtag.substring("parent.parent.parent.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent().parent().parent()).addBack("*:has(>metadata[semantictag*='"+semtag+"'])");
	} else if (position_semtag.indexOf("parent.parent")>-1) {
		var semtag = position_semtag.substring("parent.parent.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent().parent()).addBack("*:has(>metadata[semantictag*='"+semtag+"'])");
	} else if (position_semtag.indexOf("parent.")>-1) {
		var semtag = position_semtag.substring("parent.".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",$(node).parent()).addBack("*:has(>metadata[semantictag*='"+semtag+"'])");
	} else if (position_semtag.indexOf(".")==0) {  // position is empty
		var semtag = position_semtag.substring(".".length);
		target = $("*:has(>metadata[semantictag*='"+semtag+"'])",g_portfolio_current);
	} else {
		target = $("*:has(>metadata[semantictag*='"+position_semtag+"'])",g_portfolio_current);
		if (target.length==0) {
			position_semtag = position_semtag.replace(".","|")
			position_semtag = replaceVariable(position_semtag,knode,false);
			const code = position_semtag.substring(0,position_semtag.indexOf("|"));
			const semtag = position_semtag.substring(position_semtag.indexOf("|")+1);
			target = $("*:has(>metadata[semantictag*='"+semtag+"']):has(code:contains('"+code+"'))",g_portfolio_current);
		}
	}
	return target;
}

//==================================
function toggleDraft (nodeid)
//==================================
{
	const node = UICom.structure.ui[nodeid];
	let semtag = node.metadata.getAttribute('semantictag');
	if (semtag.indexOf("@draft@")>-1) {
		semtag = semtag.replace("@draft@","").replace("draft-node","");
		$($("metadata",node.node)[0]).attr('semantictag',semtag);
		UICom.UpdateMetadata(node.id);
		node.semantictag = semtag;
		node.refresh();
		if (g_userroles[0]=='designer' || USER.admin) {  
			node.displayMetainfo("metainfo_"+node.id);
		}
	} else {
		semtag = semtag.substring(0,1)+"@draft@"+semtag.substring(1)+" draft-node";
		$($("metadata",node.node)[0]).attr('semantictag',semtag);
		UICom.UpdateMetadata(node.id);
		node.semantictag = semtag;
		node.refresh();
		if (g_userroles[0]=='designer' || USER.admin) {  
			node.displayMetainfo("metainfo_"+node.id);
		}
	}
}

//==================================
function notExistChild (nodeid,semtag)
//==================================
{
	const node = UICom.structure.ui[nodeid].node;
	if ( $("*:has(>metadata[semantictag*='"+semtag+"'])",node).length==0 )
		return true;
	else
		return false;
}

//==================================
function displayRoot (destid)
//==================================
{
	
}

//=========================================================
//==================API Vector Functions===================
//=========================================================

//==================================
function saveVector(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)
//==================================
{
	var xml = "<vector><a1>"+((a1==undefined)?"":a1)+"</a1><a2>"+((a2==undefined)?"":a2)+"</a2><a3>"+((a3==undefined)?"":a3)+"</a3><a4>"+((a4==undefined)?"":a4)+"</a4><a5>"+((a5==undefined)?"":a5)+"</a5><a6>"+((a6==undefined)?"":a6)+"</a6><a7>"+((a7==undefined)?"":a7)+"</a7><a8>"+((a8==undefined)?"":a8)+"</a8><a9>"+((a9==undefined)?"":a9)+"</a9><a10>"+((a10==undefined)?"":a10)+"</a10></vector>";
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK+"/vector",
		data : xml,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

//==================================
function deleteVector(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)
//==================================
{
	let url = serverBCK+"/vector?";
	if (a1!=null)
		url += "a1="+a1;
	if (a2!=null)
		if (url=="")
			url += "a2="+a2;
		else
			url += "&a2="+a2;
	if (a3!=null)
		if (url=="")
			url += "a3="+a3;
		else
			url += "&a3="+a3;
	if (a4!=null)
		if (url=="")
			url += "a4="+a4;
		else
			url += "&a4="+a4;
	if (a5!=null)
		if (url=="")
			url += "a5="+a5;
		else
			url += "&a5="+a5;
	if (a6!=null)
		if (url=="")
			url += "a6="+a6;
		else
			url += "&a6="+a6;
	if (a7!=null)
		if (url=="")
			url += "a7="+a7;
		else
			url += "&a7="+a7;
	if (a8!=null)
		if (url=="")
			url += "a8="+a8;
		else
			url += "&a8="+a8;
	if (a9!=null)
		if (url=="")
			url += "a9="+a9;
		else
			url += "&a9="+a9;
	if (a10!=null)
		if (url=="")
			url += "a10="+a10;
		else
			url += "&a10="+a10;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
}

//==================================
function searchVector(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)
//==================================
{
	let result = [];
	let query = "";
	if (a1!=null)
		query += "a1="+a1;
	if (a2!=null)
		if (query=="")
			query += "a2="+a2;
		else
			query += "&a2="+a2;
	if (a3!=null)
		if (query=="")
			query += "a3="+a3;
		else
			query += "&a3="+a3;
	if (a4!=null)
		if (query=="")
			query += "a4="+a4;
		else
			query += "&a4="+a4;
	if (a5!=null)
		if (query=="")
			query += "a5="+a5;
		else
			query += "&a5="+a5;
	if (a6!=null)
		if (query=="")
			query += "a6="+a6;
		else
			query += "&a6="+a6;
	if (a7!=null)
		if (query=="")
			query += "a7="+a7;
		else
			query += "&a7="+a7;
	if (a8!=null)
		if (query=="")
			query += "a8="+a8;
		else
			query += "&a8="+a8;
	if (a9!=null)
		if (query=="")
			query += "a9="+a9;
		else
			query += "&a9="+a9;
	if (a10!=null)
		if (query=="")
			query += "a10="+a10;
		else
			query += "&a10="+a10;
	$.ajax({
		async:false,
		type : "GET",
		contentType: "application/xml",
		url : serverBCK+"/vector?"+query,
		success : function(data) {
			result = data;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});
	return result;
}

function deleteAllVectors(nodeid){
	const date = UICom.structure.ui[nodeid].resource.getView();
	let url = serverBCK+"/vector?";
	if (date!=null)
		url += "date="+date;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		success : function(data) {
			return true;
		},
		error : function(jqxhr,textStatus) {
			return false;
		}
	});

}

function confirmDeleteAllVectors(nodeid){
	let js = "deleteAllVectors('"+nodeid+"')";
	confirmDelete(js);
}

//=========================================================
//=========================================================

function setNodeCode(nodeid, code, visible){
	if (visible==null)
		visible = false;
	if (!visible)
		code +="@";
	if(UICom.structure.ui[nodeid].node_code==undefined) // in case of access before node ndisplay
		UICom.structure.ui[nodeid].setMetadata();
	$(UICom.structure.ui[nodeid].code_node).text(code);
	UICom.structure.ui[nodeid].save();
}

//=========================================================
function setNodeCodeLabel(nodeid,targetid){
	if (nodeid!=targetid) {
		if(UICom.structure.ui[nodeid].node_code==undefined) // in case of access before node ndisplay
			UICom.structure.ui[nodeid].setMetadata();
		if(UICom.structure.ui[targetid].node_code==undefined) // in case of access before node ndisplay
			UICom.structure.ui[nodeid].setMetadata();
		//-----------------------
		$(UICom.structure.ui[targetid].code_node).text($(UICom.structure.ui[nodeid].code_node).text());
		$(UICom.structure.ui[targetid].label_node[LANGCODE]).text($(UICom.structure.ui[nodeid].label_node[LANGCODE]).text());
		UICom.structure.ui[targetid].save();
	}
}
//=========================================================
//=========================================================


function encode(s) {
	var result = ('' + s)
		.replace(/,/g, '%2C')
		.replace(/'/g, '%27')
		.replace(/"/g, '%22')
		.replace(/</g, '%3C')
		.replace(/>/g, '%3E');
	return result
}

function decode(s) {
	var result = ('' + s)
		.replace(/%3E/g, '>')
		.replace(/%3C/g, '<')
		.replace(/%22/g, '"')
		.replace(/%27/g, "'")
		.replace(/%2C/g, ",")
	return result
}

//=========================================================
// Test Functions for Menus
//=========================================================

function testSubmitted(uuid) {
	if (UICom.structure.ui[uuid].submitted==undefined)
		UICom.structure.ui[uuid].setMetadata();
	return UICom.structure.ui[uuid].submitted=="Y";
}

function testNotSubmitted(uuid) {
	if (UICom.structure.ui[uuid].submitted==undefined)
		UICom.structure.ui[uuid].setMetadata();
	return UICom.structure.ui[uuid].submitted!="Y";
}

function testExist(semtag,uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const nodes = $("*:has(>metadata[semantictag*="+semtag+"])",UICom.structure.ui[uuid].node);
	return (nodes.length>0);
}

function testNotExist(semtag,uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const nodes = $("*:has(>metadata[semantictag*="+semtag+"])",UICom.structure.ui[uuid].node);
	return (nodes.length==0);
}

function testCodeNotEmpty(semtag,uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const nodes = $("*:has(>metadata[semantictag*="+semtag+"])",UICom.structure.ui[uuid].node);
	if ($("asmResource",nodes[0]).length==3) {
		resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[0]); 
	} else {
		resource = $("asmResource[xsi_type='nodeRes']",nodes[0]);
	}
	return($("code",resource).text()!="");
}

function testCodeEmpty(semtag,uuid) {
	if (uuid == null)
		uuid = $("#page").attr('uuid');
	const nodes = $("*:has(>metadata[semantictag*="+semtag+"])",UICom.structure.ui[uuid].node);
	if ($("asmResource",nodes[0]).length==3) {
		resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[0]); 
	} else {
		resource = $("asmResource[xsi_type='nodeRes']",nodes[0]);
	}
	return($("code",resource).text()=="");
}

function deleteSameCode(uuid,targetsemtag,srcesemtag){
	const code = UICom.structure.ui[uuid].getCode();
	const target = getTarget (UICom.structure.ui[uuid].node,targetsemtag);
	if (target.length>0) {
		targetid = $(target[0]).attr("id");
		const compnode = $("*:has(>metadata[semantictag*="+srcesemtag+"])",UICom.structure.ui[targetid].node);
		for (let i=0;i<compnode.length;i++){
			const nodeid = $(compnode[i]).attr("id");
			const nodecode = UICom.structure.ui[nodeid].getCode();
			if (nodecode==code)
				UIFactory.Node.remove(nodeid);
		}
		UIFactory.Node.reloadStruct();
	}
}

//================================================

