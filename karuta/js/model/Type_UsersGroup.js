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
	$("#"+destid).html("<table id='table_usersgroups' class='tablesorter'><thead><th>"+karutaStr[LANG]["label"]+"</th><th></th></thead><tbody id='list_usersgroups'></tbody></table>");
	$("#list_usersgroups").append($("<tr><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
	for ( var i = 0; i < UsersGroups_list.length; i++) {
		var itemid = destid+"_"+UsersGroups_list[i].id;
		$("#list_usersgroups").append($("<tr class='item' id='"+itemid+"'></tr>"));
		$("#"+itemid).html(UsersGroups_list[i].getView(destid,type,lang));
	}
};

//==================================
UIFactory["UsersGroup"].prototype.getView = function(dest,type,lang)
//==================================
{
	if (dest!=null) {
		this.display[dest]=true;
	}
	if (lang==null)
		lang = LANG;
	if (type==null)
		type = 'list';
	var html = "";
	if (type=='list') {
		html = "<td style='padding-left:4px;padding-right:4px'>"+this.label_node.text() + "</td>";
		if (USER.admin){
			html += "<td><div class='btn-group'>";
			html += " <button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].edit('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' relx='tooltip'>";
			html += "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
			html += "</button>";
			html += "<button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].confirmRemove('"+this.id+"',null)\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
			html += "<span class='glyphicon glyphicon-remove'></span>";
			html += "</button>";
			html += "</div></td>";
		}
	}
	return html;
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
			alertHTML("saved");
			window.location.reload();
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
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
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
