/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

var UsersGroups_byid = {};
var UsersGroups_list = [];
var displayGroup = {};
displayGroup['UsersGroup'] = {};
displayGroup['PortfoliosGroup'] = {};

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["UsersGroup"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.label = $("label",node).text();
	this.label_node = $("label",node);
	this.attributes = {};
	this.attributes["label"] = this.label_node;
	this.display = {};
	this.membres = [];
};


/// Display

//==================================
UIFactory["UsersGroup"].displayGroups = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersGroups_list.length; i++) {
		var itemid = "usersgroup_"+UsersGroups_list[i].id;
		var html = "";
		html += "<div id='"+itemid+"' class='usersgroup'></div><!-- class='usersgroup'-->";
		$("#"+destid).append($(html));
		$("#"+itemid).html(UsersGroups_list[i].displayView(destid,type,lang));
	}
	if (type=='list') {
		var group_type = "UsersGroup";
		for ( var i = 0; i < UsersGroups_list.length; i++) {
			var gid = UsersGroups_list[i].id;
			displayGroup[group_type][gid] = Cookies.get('dg_'+group_type+"-"+gid);
			if (displayGroup[group_type][gid]!=undefined && displayGroup[group_type][gid]=='open'){
				UIFactory["UsersGroup"].displayUsers(gid,"content-"+group_type+"-"+gid,type,lang);				
			}
		}		
	}
};

//==================================
UIFactory["UsersGroup"].prototype.displayView = function(dest,type,lang)
//==================================
{
	var group_type = "UsersGroup";
	if (dest!=null) {
		this.display[dest]=true;
	}
	if (lang==null)
		lang = LANG;
	if (type==null)
		type = 'list';
	var html = "";
	if (type=='list') {
		displayGroup[group_type][this.id] = Cookies.get('dg_'+group_type+"-"+this.id);
		html += "	<div class='row row-label'>";
		if (displayGroup[group_type][this.id]!=undefined && displayGroup[group_type][this.id]=='open')
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.UsersGroup.displayUsers','list','"+lang+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button glyphicon glyphicon-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.UsersGroup.displayUsers','list','"+lang+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button glyphicon glyphicon-plus'></span></div>";
		html += "		<div class='usersgroup-label col-md-5 col-sm-4 col-xs-5'>"+this.label_node.text()+"</div>";
		html += "		<div class='col-md-5 col-xs-5'>";
		//------------ buttons ---------------
		html += "			<div class='btn-group'>";
		if (USER.admin) {
			html += " <button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].edit('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' relx='tooltip'>";
			html += "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
			html += "</button>";
			html += "<button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].confirmRemove('"+this.id+"',null)\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
			html += "<span class='glyphicon glyphicon-remove'></span>";
			html += "</button>";
			html += "<button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].callSharePortfoliosGroups('"+this.id+"')\" data-title='"+karutaStr[LANG]["addshare-portfoliosgroups"]+"' relx='tooltip'>";
			html += "<i class='fa fa-share-square-o'></i>";
			html += "</button>";
			/*
			html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle'>&nbsp;<span class='caret'></span>&nbsp;</button>";
			html += "			<ul class='dropdown-menu  pull-right'>";
			html += "				<li><a onclick=\"UIFactory['UsersGroup'].edit('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['UsersGroup'].confirmRemove('"+this.id+"',null)\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a></li>";
//			html += "				<li><a onclick=\"UIFactory['UsersGroup'].callSharePortfolios('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-portfolios"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['UsersGroup'].callSharePortfoliosGroups('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-portfoliosgroups"]+"</a></li>";
			html += "			</ul>";
			*/
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
//			html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";
		}
		html += "			</div><!-- class='btn-group' -->";
		//---------------------------------------
		html += "		</div><!-- class='col-md-1' -->";
		html += "	</div>";
		if (displayGroup[group_type][this.id]!=undefined && displayGroup[group_type][this.id]=='open')
			html += "	<div class='usersgroup-content' id='content-"+group_type+"-"+this.id+"' style='display:block'></div>";
		else
			html += "	<div class='usersgroup-content' id='content-"+group_type+"-"+this.id+"' style='display:none'></div>";
	}
	return html;
};

//==================================
UIFactory["UsersGroup"].displayUsers = function(gid,destid,type,lang)
//==================================
{
	if (type==null)
		type = 'list';
	var destid_group = "users-group_"+gid;
	var html = "";
	html += "<div class='usersgroup-users' id='"+destid_group+"'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h5>"+karutaStr[LANG]['loading']+"</h5>";
	html += "</div>";
	$("#"+destid).html(html);
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/usersgroups?group="+gid,
		data: "",
		success : function(data) {
			var users_ids = parseList("user",data);
			if (!($("#main-user").length && $("#main-user").html()!="")) {
				fill_list_users();
			}
			$("#"+destid_group).html("<table id='"+destid_group+"-table_users' class='tablesorter'><thead><th>"+karutaStr[LANG]["firstname"]+"</th><th>"+karutaStr[LANG]["lastname"]+"</th><th>"+karutaStr[LANG]["username"]+"</th><th></th></thead><tbody id='"+destid_group+"-list_users'></tbody></table>");
			destid_group +="-list_users";
			$("#"+destid_group).append($("<tr><td></td><td></td><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
			for ( var i = 0; i < users_ids.length; i++) {
				var itemid = destid_group+"_"+users_ids[i];
				$("#"+destid_group).append($("<tr class='item' id='"+itemid+"'></tr>"));
				if (Users_byid[users_ids[i]]!=null && Users_byid[users_ids[i]]!=undefined) {
					$("#"+itemid).html(Users_byid[users_ids[i]].getView(itemid,type,lang,gid));
				}
			}
			var items = $("tr[class='item']",$("#"+destid_group));
			if (items.length==0)
				$("#users-group_"+gid).html("<h5>"+karutaStr[LANG]['empty-group']+"</h5>");
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
	$.ajaxSetup({async: true});
};

//==================================
UIFactory["UsersGroup"].update = function(gid,attribute,value)
//==================================
{
	UsersGroups_byid[gid].attributes[attribute].text(value); // update attribute value
	var node = UsersGroups_byid[gid].node;
	var data = xml2string(node);
	var url = "../../../"+serverBCK+"/usersgroups?group=" + gid +"&"+attribute+"="+value;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
//			alertHTML("saved");
//			window.location.reload();
			$("#refresh").click();
		}
	});

};

//==================================================
UIFactory["UsersGroup"].getAttributeEditor = function(gid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control'";
	html += " type='text'";
	html += " onchange=\"javascript:UIFactory['UsersGroup'].update('"+gid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["UsersGroup"].prototype.getEditor = function(type,lang)
//==================================
{
	var html = "";
	html += "<form id='usersgroup' class='form-horizontal'>";
	html += UIFactory["UsersGroup"].getAttributeEditor(this.id,"label",this.label_node.text());
	html += "</form>";
	return html;
};

//==================================================
UIFactory["UsersGroup"].getAttributeCreator = function(attribute,value,pwd)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control' id='usersgroup_"+attribute+"'";
	if (pwd!=null && pwd)
		html += " type='password'";
	else
		html += " type='text'";
	html += " value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["UsersGroup"].callCreate = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['UsersGroup'].create()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_group']);
	var html = "";
	html += "<form id='usersgroup' class='form-horizontal'>";
	html += UIFactory["UsersGroup"].getAttributeCreator("label","");
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].prototype.getSelector = function(attr,value,name)
//==================================
{
	var gid = this.id;
	var label = this.label_node.text();
	var html = "<input type='checkbox' name='"+name+"' value='"+gid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	html += "> "+label+" </input>";
	return html;
};

//==================================
UIFactory["UsersGroup"].edit = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['group']);
	var html = "";
	$("#edit-window-body").html(html);
	//--------------------------
	html = UsersGroups_byid[gid].getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].parse = function(data) 
//==================================
{
	UsersGroups_byid = {};
	UsersGroups_list = [];
	var items = $("group",data);
	var inactive = active = 0;
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var gid = $(items[i]).attr('id');
		UsersGroups_byid[gid] = new UIFactory["UsersGroup"](items[i]);
		var label = UsersGroups_byid[gid].label_node.text();
		tableau1[i] = [label,gid];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		UsersGroups_list[i] = UsersGroups_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["UsersGroup"].confirmRemove = function(gid,uid) 
//==================================
{
	var str = karutaStr[LANG]["confirm-delete"];
	if (uid!=null && uid!='null') {
		str = karutaStr[LANG]["confirm-remove-user-group"];
	}
	document.getElementById('delete-window-body').innerHTML = str;
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"UIFactory.UsersGroup.remove('"+gid+"','"+uid+"');$('#delete-window').modal('hide');\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].remove = function(gid,uid) 
//==================================
{
	var url = "../../../"+serverBCK+"/usersgroups?group=" + gid;
	if (uid!=null && uid!='null') {
		url += "&user="+uid;
	}
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			if (uid!=null && uid!='null') {
				$("#users-group_"+gid+"-list_users_"+uid).remove();
				var items = $("tr[class='item']",$("#users-group_"+gid+"-list_users"));
				if (items.length==0)
					$("#users-group_"+gid).html("<h5>"+karutaStr[LANG]['empty-group']+"</h5>");
			} else
				$("#refresh").click();
		}
	});
};

//==================================
UIFactory["UsersGroup"].displaySelectMultiple = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersGroups_list.length; i++) {
		var input = UsersGroups_list[i].getSelector(null,null,'select_usersgroups');
		$("#"+destid).append($(input));
		$("#"+destid).append($("<br>"));
	}
};

//==================================
UIFactory["UsersGroup"].create = function()
//==================================
{

	var label = $("#usersgroup_label").val();
	var url = "../../../"+serverBCK+"/usersgroups?label="+label;
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$("#refresh").click();
			//--------------------------
			$('#edit-window').modal('hide');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
			//--------------------------
			$('#edit-window').modal('hide');
		}
	});
};

//==================================
UIFactory["UsersGroup"].editGroupsByUser = function(userid)
//==================================
{
	var nameinput = "user_"+userid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_usersgroups('"+nameinput+"');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['list_groups']);
	var html = "<input type='hidden' name='"+nameinput+"' id='"+nameinput+"' value='0'>";
	html += "<div id='user_list_groups'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h5>"+karutaStr[LANG]['loading']+"</h5>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');

	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/usersgroups?user="+userid,
		data: "",
		success : function(data) {
			var user_groupids = parseList("group",data);
			if (!($("#main-usersgroup").length && $("#main-usersgroup").html()!="")) {
				fill_list_usersgroups();
			}
			UIFactory["UsersGroup"].displayManageMultipleGroups('user_list_groups','user',userid,user_groupids,'updateGroup_User');
			//----------------
		}
	});
	$.ajaxSetup({async: true});

};

//==================================
UIFactory["UsersGroup"].parseList = function(data) 
//==================================
{
	var groupids = [];
	var items = $("group",data);
	for ( var i = 0; i < items.length; i++) {
		groupids[i] = $(items[i]).attr('id');
	}
	return groupids;
};

//==================================
UIFactory["UsersGroup"].displayManageMultipleGroups = function(destid,attr,value,selectedlist,callFunction) 
//==================================
{
	$("#"+destid).html("");
	if (UsersGroups_list.length>0){
		for ( var i = 0; i < UsersGroups_list.length; i++) {
			var checked = selectedlist.contains(UsersGroups_list[i].id);
			var input = UsersGroups_list[i].getSelectorWithFunction(attr,value,'select_usersgroups_'+i,checked,callFunction);
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));
		}		
	} else {
		$("#"+destid).append($(karutaStr[LANG]['no_group']));		
	}
};

//==================================
UIFactory["UsersGroup"].prototype.getSelectorWithFunction = function(attr,value,name,checked,callFunction)
//==================================
{
	var gid = this.id;
	var label = this.label_node.text();
	var html = "<input type='checkbox' name='"+name+"' value='"+gid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if (checked)
		html += " checked='true' ";
	html += " onchange=\"javascript:"+callFunction+"(this)\" ";
	html += "> "+label+" </input>";
	return html;
};

