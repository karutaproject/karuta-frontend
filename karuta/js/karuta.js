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

//--------- for langugges
var karutaStr = new Array();
var portfolioid = null;


// -------------------
var g_userrole = "";
var g_designerrole = false;
var g_rc4key = "";
var g_encrypted = false;
var g_display_type = "";
var g_edit = false;
var g_visible = 'visible';
var g_visible = 'visible';
var g_free_toolbar_visibility = 'hidden';
var g_dashboard_models = {}; // cache for dashboard_models
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
	g_userrole = role;
	fillEditBoxBody();
	$("#userrole").html(" ("+role+")");
	if (g_display_type=='standard'){
		var uuid = $("#page").attr('uuid');
		var html = "";
		html += "	<div class='row'>";
		html += "		<div class='col-md-3' id='sidebar'></div>";
		html += "		<div class='col-md-9' id='contenu'></div>";
		html += "	</div>";
		$("#main-container").html(html);
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar','standard',LANGCODE,true,UICom.rootid);
		$("#sidebar_"+uuid).click();
	};
	if (g_display_type=='model'){
		displayPage(UICom.rootid,1,"model",LANGCODE,g_edit);
	}
	if (g_display_type=='header'){
		if (g_userrole!='designer')
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
function getNavBar(type,portfolioid,edit)
//==============================
{
	var html = "";
	html += "<nav class='navbar navbar-default navbar-fixed-top'>";
	html += "<div class='navbar-inner'>";
	html += "	<div class='container'>";
	html += "	  <div class='nav-bar-header'>";
	html += "		<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#collapse-1'>";
	html += "			<span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span>";
	html += "		</button>";
	html += "		<div class='navbar-brand'>";
	if (typeof navbar_title != 'undefined')
		html += "			<a data-toggle='dropdown' class='brand dropdown-toggle' href='#'>"+navbar_title[LANG]+"</a>";
	else
		html += "			<a data-toggle='dropdown' class='brand dropdown-toggle' href='#'><img style='margin-bottom:4px;' src='../../karuta/img/favicon.png'/> KARUTA beta</a>";
	html += "			<ul style='padding:5px;' class='dropdown-menu versions'>";
	html += "				<li><b>Versions</b></li>";
	html += "				<li>Application : "+application_version+" (" +application_date+")</li>";
	html += "				<li>Karuta-frontend : "+karuta_version+" (" +karuta_date+")</li>";
	html += "				<li>Karuta-backend : "+karuta_backend_version+" (" +karuta_backend_date+")</li>";
	html += "				<li>Karuta-fileserver : "+karuta_fileserver_version+" (" +karuta_fileserver_date+")</li>";
	html += "			</ul>";
	html += "		</div>";
	html += "	  </div>";
	//-----------------------------------------------------------
	html += "		<div class='navbar-collapse collapse' id='collapse-1'>";
	html += "			<ul class='nav navbar-nav'>";
	if (type=='main'){
		html += "				<li><a href='list.htm?lang="+LANG+"'>"+karutaStr[LANG]['home']+"</a></li>";
	}
	html += "				<li><a href='mailto:"+technical_support+"'>"+karutaStr[LANG]['technical_support']+"</a></li>";
	html += "			</ul>";
	//----------------------------------------------------------
	if (languages.length>1) {
		html += "			<ul class='nav navbar-nav'>";
	html += "				<li class='dropdown active'><a data-toggle='dropdown' class='dropdown-toggle' href='#'>"+karutaStr[LANG]['language']+"<span class='caret'></span></a>";
	html += "					<ul class='dropdown-menu'>";
	for (var i=0; i<languages.length;i++) {
		var url = "list.htm?lang="+languages[i];
		if (type=='main')
			url = "main.htm?id="+portfolioid+"&amp;lang="+languages[i]+"&amp;edit="+edit;
		if (type=='users')
			url = "listUsers.htm?lang="+languages[i];
		if (type=='login')
			url = "login.htm?lang="+languages[i];
		if (type=='create_account')
			url = "createAccount.htm?lang="+languages[i];
		if (type=='batch')
			url = "createBatchAccounts.htm?lang="+languages[i];
		html += "			<li><a href='"+url+"'>"+karutaStr[languages[i]]['language']+"</a></li>";
	}
	html += "					</ul>";
	html += "				</li>";
	}
	//----------------------------------------------------------
	if ((type!='login' && type!='create_account' && type!='list') || (type=='list' && USER.admin)) {
		html += "				<li>&nbsp;</li>";
		html += "				<li class='dropdown active'><a data-toggle='dropdown' class='dropdown-toggle' href='#'>Actions<span class='caret'></span></a>";
		html += "					<ul class='dropdown-menu'>";
	}
	//----------------------------------------------------------
	if (type!='login' && type!='create_account') {
		if (USER.admin){
			html += "						<li><a href='../../karuta/htm/list.htm?lang="+LANG+"'>"+karutaStr[LANG]['list_portfolios']+"</a></li>";
			html += "						<li><a href='../../karuta/htm/listUsers.htm?lang="+LANG+"'>"+karutaStr[LANG]['list_users']+"</a></li>";
			html += "						<li><a href='../../karuta/htm/createBatch.htm?lang="+LANG+"'>"+karutaStr[LANG]['batch']+"</a></li>";
			html += "						<li><a href='../../karuta/htm/createReport.htm?lang="+LANG+"'>"+karutaStr[LANG]['report']+"</a></li>";
	//		html += "						<li><a href='../../karuta/htm/listRoles.htm'>"+karutaStr[LANG]['list_roles']+"</a></li>";
	//		html += "						<li><a href='../../karuta/htm/listGroups.htm'>"+karutaStr[LANG]['list_groups']+"</a></li>";
		}
		if (USER.admin && type=='main'){
			html += "<hr>";
		}
		if (type=='main'){
			html += UIFactory["Portfolio"].getActions(portfolioid);
		}
		html += "					</ul>";
		html += "				</li>";
		html += "			</ul>";
		//----------------------------------------------------------
		html += "			<ul class='nav navbar-nav pull-right'>";
		html += "				<li class='dropdown active'><a data-toggle='dropdown' class='dropdown-toggle' href='#'>"+USER.firstname_node.text()+" "+USER.lastname_node.text();
		if (g_userrole=='designer') 
			html += " <span id='userrole'>(designer)</span><span class='caret'></span></a>";
		else
			html += " <span id='userrole'></span><span class='caret'></span></a>";
		html += "					<ul class='dropdown-menu pull-right'>";
		html += "						<li><a href=\"javascript:UIFactory['User'].callChangePassword()\">"+karutaStr[LANG]['change_password']+"</a></li>";
		if (g_userrole=='designer') {
			html += "						<li class='divider'></li>";
			html += "	<li><a href='#' onclick=\"setDesignerRole('designer')\">designer</a></li>";
			for (role in UICom.roles) {
				if (role!="designer")
					html += "	<li><a href='#' onclick=\"setDesignerRole('"+role+"')\">"+role+"</a></li>";
			}
		}
		html += "						<li class='divider'></li><li><a href='login.htm?lang="+LANG+"''>Logout</a></li>";
		html += "					</ul>";
		html += "				</li>";
		html += "			</ul>";
	}
	//----------------------------------------------------------
	html += "			</div><!--/.nav-collapse -->";
	html += "	</div>";
	html += "</div>";
	html += "</div>";
	
	html += "</nav>";
	return html;
}

//==============================
function LangueBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Edit box ==================== -->";
	html += "\n<div id='langue-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n		<div class='modal-content'>";
	html += "\n		<div id='langue-window-header' class='modal-header'>";
	html += "\n		</div>";
	html += "\n		<div id='langue-window-body' class='modal-body'></div>";
	html += "\n		<div class='modal-footer' id='langue-window-footer'></div>";
	html += "\n		</div>";
	html += "\n		</div>";
	html += "\n	</div>";
	html += "\n<!-- ============================================== -->";
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
	if (g_userrole=='designer' || USER.admin) {
		html += "\n			<div role='tabpanel'>";
		html += "\n				<ul class='nav nav-tabs' role='tablist'>";
		html += "\n					<li role='presentation' class='active'><a href='#edit-window-body-main' aria-controls='edit-window-body-main' role='tab' data-toggle='tab'>"+karutaStr[LANG]['resource']+"</a></li>";
		html += "\n					<li role='presentation'><a href='#edit-window-body-metadata' aria-controls='edit-window-body-metadata' role='tab' data-toggle='tab'>Metadata</a></li>";
		html += "\n					<li role='presentation'><a href='#edit-window-body-metadata-epm' aria-controls='edit-window-body-metadata-epm' role='tab' data-toggle='tab'>CSS Styles</a></li>";
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
function MessageBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== MessageBox ==================== -->";
	html += "\n<div id='message-window' class='modal' style='padding:10px;width:200px;margin-left:0px;background-color:lightgrey;position:fixed;top:65px;left:40%;'>";
	html += "\n	<div id='message-body' class='message-body'></div>";
	html += "\n</div>";
	html += "\n<!-- ============================================== -->";
	return html;
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
		html = UICom.structure["ui"][uuid].getEditor();
		$("#edit-window-body-node").html($(html));
	}
	// ------------admin and designer----------
	if (USER.admin || g_userrole=='designer') {
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
	$(".pickcolor").colorpicker();
	// ------------------------------
	$('#edit-window-body').animate({ scrollTop: 0 }, 'slow');}


//==================================
function getEditBoxOnCallback(data,param2,param3,param4) {
//==================================
	var uuid = $("node",data).attr('id');//alert(uuid);
	param2(param3,param4);
	getEditBox(uuid);
}


//==============================
function deleteButton(uuid,type,parentid,destid,callback,param1,param2)
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Delete Button ==================== -->";
	html += "<button id='del-"+uuid+"' class='btn btn-xs' onclick=\"confirmDel('"+uuid+"','"+type+"','"+parentid+"','"+destid+"','"+callback+"','"+param1+"','"+param2+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
	html += "<span class='glyphicon glyphicon-remove'></span>";
	html += "</button>";
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
	html += "\n		<div class='modal-content'>";
	html += "\n	<div class='modal-header'>";
	html += "\n		<div id='edit-window-type' style='float:right'></div>";
	html += "\n		<h3 id='edit-window-title' >Attention</h3>";
	html += "\n	</div>";
	html += "\n	<div id='delete-window-body' class='modal-body'>";
	html += "\n		<div id='delete-window-body-content'>";
	html += "\n		</div>";
	html += "\n	</div>";
	html += "\n	<div class='modal-footer' id='delete-window-footer'></div>";
	html += "\n</div>";
	html += "\n</div>";
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
function waitBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Wait box ==================== -->";
	html += "\n<div id='wait-window' class='modal hide'>";
	html += "\n	<div id='wait-window-body' class='modal-body' style='text-align:center'><img src='../../karuta/img/ajax-loader.gif'></div>";
	html += "\n</div>";
	html += "\n<!-- ================================================== -->";
	return html;
}

//=======================================================================
function deleteandhidewindow(uuid,type,parentid,destid,callback,param1,param2) 
// =======================================================================
{
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
	$('#delete-window').modal('hide');
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
	$("#contenu").html("<div id='page' uuid='"+uuid+"'></div>");
	$('.selected').removeClass('selected');
	$("#sidebar_"+uuid).parent().addClass('selected');
	var name = $(UICom.structure['ui'][uuid].node).prop("nodeName");
	if (depth==null)
		depth=100;
	if (name=='asmRoot' || name=='asmStructure')
		depth = 1;
	if (UICom.structure['tree'][uuid]!=null) {
		if (type=='standard')
			UIFactory['Node'].displayStandard(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
		if (type=='translate')
			UIFactory['Node'].displayTranslate(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
		if (type=='model')
			UIFactory['Node'].displayModel(UICom.structure['tree'][uuid],'contenu',depth,langcode,edit);
	}
	$('.metainfo').css('visibility',g_visible);
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
function displayControlGroup_getEditor(destid,label,controlsid,nodeid) {
//==================================
	$("#"+destid).append($("<div class='control-group'><label class='control-label'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	$("#"+controlsid).append(UICom.structure["ui"][nodeid].resource.getEditor());
}

//==================================
function displayControlGroup_displayEditor(destid,label,controlsid,nodeid,type,classitem) {
//==================================
	if (classitem==null)
		classitem="";
	$("#"+destid).append($("<div class='control-group'><label class='control-label "+classitem+"'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	UICom.structure["ui"][nodeid].resource.displayEditor(controlsid,type);
}

//==================================
function displayControlGroup_getView(destid,label,controlsid,nodeid) {
//==================================
	$("#"+destid).append($("<div class='control-group'><label class='control-label'>"+label+"</label><div id='"+controlsid+"' class='controls'></div></div>"));
	$("#"+controlsid).append(UICom.structure["ui"][nodeid].resource.getView());
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
	var urlS = "../../../"+serverBCK+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	if (USER.admin || g_userrole=='designer')
		urlS = "../../../"+serverBCK+"/nodes/node/copy/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	$.ajax({
		type : "POST",
		dataType : "text",
		url : urlS,
		data : "",
		success : function(data) {
			if (callback!=null)
				if (databack)
					callback(data,param2,param3,param4,param5,param6,param7,param8);
				else
					callback(param2,param3,param4,param5,param6,param7,param8);
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
		if (i<languages.length-1)
			$.ajax({
				type : "GET",
				dataType : "script",
				url : "../../karuta/js/languages/locale_"+languages[i]+".js"
			});
		else
			$.ajax({
				type : "GET",
				dataType : "script",
				url : "../../karuta/js/languages/locale_"+languages[i]+".js",
				success : callback
			});
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
	$("body").append($(html));
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
	$('#edit-window').modal('show');
}

//==================================
function getPublicURL(uuid,email,role,langcode) {
//==================================
	//post /directlink?uuid=&user=&role=
	role = "all";
	var urlS = "../../../"+serverFIL+'/direct?uuid='+uuid+'&email='+email+'&role='+role;
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
function sendEmailPublicURL(encodeddata,email,langcode) {
//==================================
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	url = serverURL+"/"+appliname+"/karuta/htm/public.htm?i="+encodeddata+"&amp;lang="+languages[langcode];
	var message ="&lt;img src='"+serverURL+"/"+appliname+"/karuta/img/logofonbleu.jpg' style='width:300px;margin-bottom:4px;margin-top:30px;'&gt;";
	message +=  "&lt;div style='margin:30px;border-radius:4px;padding:10px;border: 1px solid lightGrey;box-shadow: 3px 3px 3px #CCC'&gt;";
	message += "&lt;br/&gt;"+USER.firstname+" "+USER.lastname+karutaStr[LANG]['want-sharing'];
	message += "&lt;div style='font-weight:bold;font-size:14pt;margin:30px;width:150px;'&gt;";
	message +="&lt;a href='"+url+"' style='text-decoration: none;color:black;padding:10px;padding-left:40px;padding-right:40px;border-radius:4px;background-color:lightgrey'&gt;";
	message += karutaStr[LANG]['see'];
	message +="&lt;/a&gt;";
	message +="&lt;/div&gt;";
	message += "Karuta Team";
	message +="&lt;/div&gt;";
	var xml ="<node>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient>"+email+"</recipient>";
	xml +="<subject>"+USER.firstname+" "+USER.lastname+" "+karutaStr[LANG]['want-sharing']+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="</node>";
	$.ajax({
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverFIL+"/mail",
		data: xml,
		success : function(data) {
			alert(karutaStr[LANG]['email-sent']);
		}
	});
}