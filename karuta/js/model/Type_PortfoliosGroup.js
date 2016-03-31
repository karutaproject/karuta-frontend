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

var PortfoliosGroups_byid = {};
var PortfoliosGroups_list = [];

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["PortfoliosGroup"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.label = $("label",node).text();
	this.label_node = $("label",node);
//	this.type = $("type",node).text();
//	this.type_node = $("type",node);
	this.attributes = {};
	this.attributes["label"] = this.label_node;
//	this.attributes["type"] = this.type_node;
	this.display = {};
	this.membres = [];
};


/// Display

//==================================
UIFactory["PortfoliosGroup"].displayGroups = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
		var itemid = "portfoliosgroup_"+PortfoliosGroups_list[i].id;
		var html = "";
		html += "<div id='"+itemid+"' class='portfoliosgroup'></div><!-- class='portfoliosgroup'-->";
		$("#"+destid).append($(html));
		$("#"+itemid).html(PortfoliosGroups_list[i].displayView(destid,type,lang));
	}
	if (type=='list') {
		var group_type = "PortfoliosGroup";
		for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
			var gid = PortfoliosGroups_list[i].id;
			displayGroup[group_type][gid] = Cookies.get('dg_'+group_type+"-"+gid);
			if (displayGroup[group_type][gid]!=undefined && displayGroup[group_type][gid]=='open'){
				UIFactory["PortfoliosGroup"].displayPortfolios(gid,"content-"+group_type+"-"+gid,type,lang);				
			}
		}		
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.displayView = function(dest,type,lang)
//==================================
{
	var group_type = "PortfoliosGroup";
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
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button glyphicon glyphicon-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button glyphicon glyphicon-plus'></span></div>";
		html += "		<div class='portfoliosgroup-label col-md-5 col-sm-4 col-xs-5'>"+this.label_node.text()+"</div>";
		html += "		<div class='col-md-5 col-xs-5'>";
		//------------ buttons ---------------
		html += "			<div class='btn-group'>";
		if (USER.admin) {
			html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle'>&nbsp;<span class='caret'></span>&nbsp;</button>";
			html += "			<ul class='dropdown-menu  pull-right'>";
			html += "				<li><a onclick=\"UIFactory['PortfoliosGroup'].edit('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['PortfoliosGroup'].confirmRemove('"+this.id+"',null)\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['PortfoliosGroup'].callAddPortfolios('"+this.id+"')\" ><i class='fa fa-plus-square'></i> "+karutaStr[LANG]["add_portfolios"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['PortfoliosGroup'].callShareUsers('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-users"]+"</a></li>";
			html += "				<li><a onclick=\"UIFactory['PortfoliosGroup'].callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a></li>";
			html += "			</ul>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";
		}
		html += "			</div><!-- class='btn-group' -->";
		//---------------------------------------
		html += "		</div><!-- class='col-md-1' -->";
		html += "	</div>";
		if (displayGroup[group_type][this.id]!=undefined && displayGroup[group_type][this.id]=='open')
			html += "	<div class='portfoliosgroup-content' id='content-"+group_type+"-"+this.id+"' style='display:block'></div>";
		else
			html += "	<div class='portfoliosgroup-content' id='content-"+group_type+"-"+this.id+"' style='display:none'></div>";
	}
	return html;
};

//==================================
UIFactory["PortfoliosGroup"].displayPortfolios = function(gid,destid,type,lang)
//==================================
{
	if (type==null)
		type = 'list';
	var destid_group = "portfolios-group_"+gid;
	var html = "";
	html += "<div class='portfoliosgroup-items' id='"+destid_group+"'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h5>"+karutaStr[LANG]['loading']+"</h5>";
	html += "</div>";
	$("#"+destid).html(html);
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfoliogroups?group="+gid,
		data: "",
		success : function(data) {
			var portfolios_ids = parseList("portfolio",data);
			$("#"+destid_group).html("<div id='"+destid_group+"-list_items' class='portfoliosgroup-item'></div>");
			destid_group +="-list_items";
			for ( var i = 0; i < portfolios_ids.length; i++) {
				var itemid = destid_group+"_"+portfolios_ids[i];
				$("#"+destid_group).append($("<div class='row' id='"+itemid+"'></div>"));
				if (portfolios_byid[portfolios_ids[i]]!=null && portfolios_byid[portfolios_ids[i]]!=undefined) {
					$("#"+itemid).html(portfolios_byid[portfolios_ids[i]].getPortfolioView(itemid,type,null,null,null,gid));
				}
			}
			testGroup_Empty("portfolios-group_",gid);
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
	$.ajaxSetup({async: true});
};

//==================================
UIFactory["PortfoliosGroup"].update = function(gid,attribute,value)
//==================================
{
	PortfoliosGroups_byid[gid].attributes[attribute].text(value); // update attribute value
	var node = PortfoliosGroups_byid[gid].node;
	var data = xml2string(node);
	var url = "../../../"+serverBCK+"/portfoliogroups?group=" + gid +"&"+attribute+"="+value;
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
UIFactory["PortfoliosGroup"].getAttributeEditor = function(gid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control'";
	html += " type='text'";
	html += " onchange=\"javascript:UIFactory['PortfoliosGroup'].update('"+gid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getEditor = function(type,lang)
//==================================
{
	var html = "";
	html += "<form id='portfoliosgroup' class='form-horizontal'>";
	html += UIFactory["PortfoliosGroup"].getAttributeEditor(this.id,"label",this.label_node.text());
	html += "</form>";
	return html;
};

//==================================================
UIFactory["PortfoliosGroup"].getAttributeCreator = function(attribute,value,pwd)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control' id='portfoliosgroup_"+attribute+"'";
	if (pwd!=null && pwd)
		html += " type='password'";
	else
		html += " type='text'";
	html += " value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["PortfoliosGroup"].callCreate = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].create()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_group']);
	var html = "";
	html += "<form id='portfoliosgroup' class='form-horizontal'>";
	html += UIFactory["PortfoliosGroup"].getAttributeCreator("label","");
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getSelector = function(attr,value,name)
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
UIFactory["PortfoliosGroup"].edit = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['group']);
	var html = "";
	$("#edit-window-body").html(html);
	//--------------------------
	html = PortfoliosGroups_byid[gid].getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].parse = function(data) 
//==================================
{
	PortfoliosGroups_byid = {};
	PortfoliosGroups_list = [];
	var items = $("group",data);
	var inactive = active = 0;
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var gid = $(items[i]).attr('id');
		PortfoliosGroups_byid[gid] = new UIFactory["PortfoliosGroup"](items[i]);
		var label = PortfoliosGroups_byid[gid].label_node.text();
		tableau1[i] = [label,gid];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		PortfoliosGroups_list[i] = PortfoliosGroups_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["PortfoliosGroup"].confirmRemove = function(gid,uid) 
//==================================
{
	var str = karutaStr[LANG]["confirm-delete"];
	if (uid!=null && uid!='null') {
		str = karutaStr[LANG]["confirm-remove-item-group"];
	}
	document.getElementById('delete-window-body').innerHTML = str;
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"UIFactory.PortfoliosGroup.remove('"+gid+"','"+uid+"');$('#delete-window').modal('hide');\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].remove = function(gid,uid) 
//==================================
{
	var url = "../../../"+serverBCK+"/portfoliogroups?group=" + gid;
	if (uid!=null && uid!='null') {
		url += "&uuid="+uid;
	}
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			if (uid!=null && uid!='null') {
				$("#portfolios-group_"+gid+"-list_items_"+uid).remove();
				testGroup_Empty("portfolios-group_",gid);
			} else
				$("#refresh").click();
		}
	});
};

//==================================
UIFactory["PortfoliosGroup"].displaySelectMultiple = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
		var input = PortfoliosGroups_list[i].getSelector(null,null,'select_portfoliosgroups');
		$("#"+destid).append($(input));
		$("#"+destid).append($("<br>"));
	}
};

//==================================
UIFactory["PortfoliosGroup"].create = function()
//==================================
{

	var label = $("#portfoliosgroup_label").val();
	var url = "../../../"+serverBCK+"/portfoliogroups?type=portfolio&label="+label;
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
UIFactory["PortfoliosGroup"].editGroupsByUuid = function(uuid)
//==================================
{
	var nameinput = "uuid_"+uuid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_page('"+nameinput+"','fill_list_portfoliosgroups');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['list_groups']);
	var html = "<input type='hidden' name='"+nameinput+"' id='"+nameinput+"' value='0'>";
	html += "<div id='portfolio_list_groups'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h5>"+karutaStr[LANG]['loading']+"</h5>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');

//	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfoliogroups?uuid="+uuid,
		data: "",
		success : function(data) {
			var uuid_groupids = parseList("group",data);
			if (PortfoliosGroups_byid.length>0) { // portfolios groups loaded
				UIFactory["PortfoliosGroup"].displayManageMultipleGroups('portfolio_list_groups','uuid',uuid,uuid_groupids,'updateGroup_Portfolio');
				//--------------------------		
			} else {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : "../../../"+serverBCK+"/portfoliogroups",
					success : function(data) {
						UIFactory["PortfoliosGroup"].parse(data);
						UIFactory["PortfoliosGroup"].displayManageMultipleGroups('portfolio_list_groups','uuid',uuid,uuid_groupids,'updateGroup_Portfolio');
						//--------------------------
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Error in editGroupsByUuid 1 : "+jqxhr.responseText);
					}
				});
			}
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in editGroupsByUuid 2 : "+jqxhr.responseText);
		}
	
	});
//	$.ajaxSetup({async: true});

};

//==================================
UIFactory["PortfoliosGroup"].displayManageMultipleGroups = function(destid,attr,value,selectedlist,callFunction) 
//==================================
{
	$("#"+destid).html("");
	if (PortfoliosGroups_list.length>0){
		for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
			var checked = selectedlist.contains(PortfoliosGroups_list[i].id);
			var input = PortfoliosGroups_list[i].getSelectorWithFunction(attr,value,'select_portfoliosgroups_'+i,checked,callFunction);
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));
		}		
	} else {
		$("#"+destid).append($(karutaStr[LANG]['no_group']));		
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getSelectorWithFunction = function(attr,value,name,checked,callFunction)
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

//==================================
UIFactory["PortfoliosGroup"].callAddPortfolios = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].addPortfolios('"+gid+"');$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['add_portfolios']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['list_portfolios']);
	var html = "";
	html += "<div id='adding_portfolios' class='div_scroll'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h5>"+karutaStr[LANG]['loading']+"</h5>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfoliogroups?group="+gid,
		data: "",
		success : function(data) {
			var items = parseList("portfolio",data);
			if (!($("#list-menu").length && $("#list-menu").html()!="")) {
				fill_list_page();
			}
			UIFactory["Portfolio"].displaySelectPortfolios(items,'adding_portfolios');
			//----------------
		}
	});
	$.ajaxSetup({async: true});
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].addPortfolios = function(gid)
//==================================
{
	var items = $("input[name='select_portfolios']:not(:disabled)").filter(':checked');
	var url = "../../../"+serverBCK+"/portfoliogroups?group=" + gid + "&uuid=";
	for (var i=0; i<items.length; i++){
		var itemid = $(items[i]).attr('value');
		var url2 = url+itemid;
		$.ajax({
			type : 'PUT',
			dataType : "text",
			url : url2,
			data : "",
			success : function(data) {
				var group_type = "PortfoliosGroup";
				toggleGroup(group_type,gid,'UIFactory.PortfoliosGroup.displayPortfolios','list',null);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
	}
};

//==================================
UIFactory["PortfoliosGroup"].callSharePortfolios = function(gid)
//==================================
{
	var nameinput = "user_"+userid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_page('"+nameinput+"','fill_list_usersgroups');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
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
			UIFactory["PortfoliosGroup"].displayManageMultipleGroups('user_list_groups','user',userid,user_groupids,'updateGroup_User');
			//----------------
		}
	});
	$.ajaxSetup({async: true});
};

//==================================
UIFactory["PortfoliosGroup"].callSharePortfoliosGroups = function(gid)
//==================================
{
	var nameinput = "user_"+userid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_page('"+nameinput+"','fill_list_usersgroups');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
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

