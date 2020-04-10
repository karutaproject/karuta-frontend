/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
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
	this.members = [];
	this.roles = [];
	this.rrg = {};
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
			displayGroup[group_type][gid] = localStorage.getItem('dg_'+group_type+"-"+gid);
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
		displayGroup[group_type][this.id] = localStorage.getItem('dg_'+group_type+"-"+this.id);
//		displayGroup[group_type][this.id] = Cookies.get('dg_'+group_type+"-"+this.id);
		html += "	<div class='row row-label'>";
		if (displayGroup[group_type][this.id]!=undefined && displayGroup[group_type][this.id]=='open')
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button fas fa-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleGroup('"+group_type+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-1'><span id='toggleContent_"+group_type+"-"+this.id+"' class='button fas fa-plus'></span></div>";
		html += "		<div class='portfoliosgroup-label col-5'>"+this.label_node.text()+"</div>";
		html += "		<div class='col-5'>";
		//------------ buttons ---------------
		html += "			<div class='dropdown'>";
		if (USER.admin) {
			html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
			html += "			<div class='dropdown-menu  dropdown-menu-right'>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].edit('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].confirmRemove('"+this.id+"',null)\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callAddPortfolios('"+this.id+"','"+this.label_node.text()+"')\" ><i class='fa fa-plus-square'></i> "+karutaStr[LANG]["add_portfolios"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callShareUsers('"+this.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
			html += "			</div>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'></button>";
		}
		html += "			</div><!-- class='dropdown' -->";
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
	//--------------------------
	if (PortfoliosGroups_byid[gid].members.length==0) { // to load members of portfolios groups
		var destid_group = "portfolios-group_"+gid;
		var html = "";
		html += "<div class='portfoliosgroup-items' id='"+destid_group+"'>";
		html += "</div>";
		$("#"+destid).html(html);
		//--------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfoliogroups?group="+gid,
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
					} else { // we load portfolio information
						UIFactory.Portfolio.load(portfolios_ids[i],"1");
						if (portfolios_byid[portfolios_ids[i]]!=null && portfolios_byid[portfolios_ids[i]]!=undefined) {
							$("#"+itemid).html(portfolios_byid[portfolios_ids[i]].getPortfolioView(itemid,type,null,null,null,gid));
						}					}
				}
				PortfoliosGroups_byid[gid].members = portfolios_ids;
				testGroup_Empty("portfolios-group_",gid);
				PortfoliosGroups_byid[gid].roles = [];
				//----------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
	}
};

//==================================
UIFactory["PortfoliosGroup"].update = function(gid,attribute,value)
//==================================
{
	PortfoliosGroups_byid[gid].attributes[attribute].text(value); // update attribute value
	var node = PortfoliosGroups_byid[gid].node;
	var data = xml2string(node);
	var url = serverBCK_API+"/portfoliogroups?group=" + gid +"&"+attribute+"="+value;
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
	$("#edit-window-title").html(karutaStr[LANG]['create_portfoliosgroup']);
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
	buttons += "<button class='btn btn-danger' onclick=\"UIFactory.PortfoliosGroup.remove('"+gid+"','"+uid+"');$('#delete-window').modal('hide');\">" + karutaStr[LANG]["button-remove"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].remove = function(gid,uid) 
//==================================
{
	var url = serverBCK_API+"/portfoliogroups?group=" + gid;
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
				PortfoliosGroups_byid[gid].members = [];
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
	var url = serverBCK_API+"/portfoliogroups?type=portfolio&label="+label;
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
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$('#edit-window').modal('show');

//	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?uuid="+uuid,
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
					url : serverBCK_API+"/portfoliogroups",
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
UIFactory["PortfoliosGroup"].callAddPortfolios = function(gid,portfolioLabel)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].addPortfolios('"+gid+"');$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['add_portfolios']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(portfolioLabel);
	var html = "";
	html += "<div id='adding_portfolios' class='div_scroll'>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?group="+gid,
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
	var url = serverBCK_API+"/portfoliogroups?group="+gid+"&uuid=";
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
				PortfoliosGroups_byid[gid].members = [];
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.fillSharingRoles = function()
//==================================
{
	this.rrg = {};
	var rrg = this.rrg;
	var roles = this.roles;
	$.ajaxSetup({async: false});
	for ( var i = 0; i < this.members.length; i++) {
		var id = this.members[i];
		//------------------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups?portfolio="+id,
			success : function(data) {
				var groups = $("rolerightsgroup",data);
				if (groups.length>0) {
					for (var i=0; i<groups.length; i++) {
						var groupid = $(groups[i]).attr('id');
						var label = $("label",groups[i]).text();
						if (label!="user") {
							if (rrg[label]===undefined)
								rrg[label]=[];
							rrg[label].push(groupid);
						}
					}
				}
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in fillRoles : "+jqxhr.responseText);
			}
		});
	}
	$.ajaxSetup({async: true});
	for (var e in this.rrg) {
		this.roles[this.roles.length]=e;
	}
	this.roles.sort();
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getSharingRoleEditor = function(destid,callFunction)
//==================================
{
	if (this.roles.length==0) {
		this.fillSharingRoles();
	}
	//--------------------------
	if (this.roles.length>0) {
		var js = "";
		if (callFunction!=null) {
			js += callFunction+";";
		}
		js += "$('input:checkbox').prop('checked', false);";
		var first = true;
		for (var i=0; i<this.roles.length; i++) {
			if (this.roles[i]!="user") {
				var input = "<input type='radio' name='radio_group' value='"+this.roles[i]+"'";
				input += "onclick=\""+js+"\" ";
				input +="> "+this.roles[i]+" </input><br/>";
				$("#"+destid).append($(input));
			}
		}
	} else {
		$("#"+destid).html(karutaStr[LANG]['nogroup']);
	}
};

//==================================
UIFactory["PortfoliosGroup"].displaySharingRoleEditor = function(destid,gid,callFunction)
//==================================
{
	if (PortfoliosGroups_byid[gid].members.length==0) { // to load members of portfolios groups
		$.ajaxSetup({async: false});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfoliogroups?group="+gid,
			data: "",
			success : function(data) {
				PortfoliosGroups_byid[gid].members = parseList("portfolio",data);
				PortfoliosGroups_byid[gid].roles = [];
				PortfoliosGroups_byid[gid].getSharingRoleEditor(destid,callFunction);
				//----------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
		$.ajaxSetup({async: true});
	} else {
		PortfoliosGroups_byid[gid].getSharingRoleEditor(destid,callFunction);
	}
};

//==================================
UIFactory["PortfoliosGroup"].callShareUsers = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].shareUsers('"+gid+"','unshare')";
	var js3 = "javascript:UIFactory['PortfoliosGroup'].shareUsers('"+gid+"','share')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+PortfoliosGroups_byid[gid].label);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='sharing' style='display:none'>";
	html += "<div class='row'>";
	html += "<div class='col-md-7'>";
	html += "<h4>"+karutaStr[LANG]['sharing']+"</h4>";
	html += "</div>";
	html += "<div class='col-md-2'>";
	html += "<button class='btn' onclick=\""+js3+";\">"+karutaStr[LANG]['addshare']+"</button>";
	html += "</div>";
	html += "<div class='col-md-2'>";
	html += " <button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['unshare']+"</button>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<div class='row'>";
	html += "<div class='col-md-3'>";
	html += karutaStr[LANG]['select_role'];
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='sharing_roles'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<br><div class='row'>";
	html += "<div class='col-md-3'><br>";
	html += karutaStr[LANG]['select_users'];
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='sharing_users'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "</div><!--sharing-->";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (Users_byid.length>0) { // users groups loaded
		UIFactory["User"].displaySelectMultipleActive('sharing_users');
		//--------------------------		
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
				UIFactory["User"].displaySelectMultipleActive('sharing_users');
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in PortfoliosGroup.callShareUsers : "+jqxhr.responseText);
			}
		});
	}
	UIFactory["PortfoliosGroup"].displaySharingRoleEditor('sharing_roles',gid);
	$("#sharing").show();
	
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].callShareUsersGroups = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].shareGroups('"+gid+"','unshare')";
	var js3 = "javascript:UIFactory['PortfoliosGroup'].shareGroups('"+gid+"','share')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+PortfoliosGroups_byid[gid].label);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='sharing' style='display:none'>";
	html += "<div class='row'>";
	html += "<div class='col-md-7'>";
	html += "<h4>"+karutaStr[LANG]['sharing']+"</h4>";
	html += "</div>";
	html += "<div class='col-md-2'>";
	html += "<button class='btn' onclick=\""+js3+";\">"+karutaStr[LANG]['addshare']+"</button>";
	html += "</div>";
	html += "<div class='col-md-2'>";
	html += " <button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['unshare']+"</button>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<div class='row'>";
	html += "<div class='col-md-3'>";
	html += karutaStr[LANG]['select_role'];
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='sharing_roles'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<br><div class='row'>";
	html += "<div class='col-md-3'><br>";
	html += karutaStr[LANG]['select_usersgroups'];
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='sharing_usersgroups'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "</div><!--sharing-->";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (UsersGroups_byid.length>0) { // users groups loaded
		UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
		//--------------------------		
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in PortfoliosGroup.callShareUsersGroups 1 : "+jqxhr.responseText);
			}
		});
	}
	UIFactory["PortfoliosGroup"].displaySharingRoleEditor('sharing_roles',gid,"UIFactory['UsersGroup'].hideUsersList('sharing_usersgroups-group-')");
	$("#sharing").show();
	
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].shareGroups = function(gid,type)
//==================================
{
	var usersgroups = $("input[name='select_usersgroups']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var grouplabel = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		grouplabel = $(group).attr('value');
	}
	if (grouplabel!=null) {
		var xml = get_usersxml_from_groups(usersgroups);
		var users = $("user",xml);
		for (var i=0; i<PortfoliosGroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = PortfoliosGroups_byid[gid].rrg[grouplabel][i];
			updateRRGroup_Users(groupid,users,xml,type,'id');
		}
		//-----------------------------
		var html = "";
		for (var i=0; i<usersgroups.length; i++){
			var usergroupid = $(usersgroups[i]).attr('value');
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/usersgroups?group="+usergroupid,
				data: "",
				success : function(data) {
					var users_ids = parseList("user",data);
					for ( var i = 0; i < users_ids.length; i++) {
						if (Users_byid[users_ids[i]]!=null && Users_byid[users_ids[i]]!=undefined) {
							if (Users_byid[users_ids[i]].active_node.text()=='1') {
								html += "<div class='item' >"+Users_byid[users_ids[i]].getView(null,"firstname-lastname-username")+"</div>";
							} else
								$("#"+destid).append($("<div class='item inactive'>"+Users_byid[users_ids[i]].getView(null,"firstname-lastname-username")+"</div>"));
						}
					}
					if (html.length==0)
						html += "<h5>"+karutaStr[LANG]['empty-group']+"</h5>";
					//----------------
					var header = "";
					if (type=="share")
						header = karutaStr[LANG]['shared'];
					else
						header = karutaStr[LANG]['unshared'];
					alertHTML("<h5>"+karutaStr[LANG]['role']+": "+grouplabel+"</h5><h5>"+karutaStr[LANG]['users']+": </h5>"+html,header);
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error : "+jqxhr.responseText);
				}
			});	
		}
		//-----------------------------
	}
};

//==================================
UIFactory["PortfoliosGroup"].shareUsers = function(gid,type)
//==================================
{
	var users = $("input[name='select_users']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var grouplabel = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		grouplabel = $(group).attr('value');
	}
	if (grouplabel!=null) {
		var xml = "<users>";
		for (var i=0; i<users.length; i++){
			var userid = $(users[i]).attr('value');
			xml += "<user id='"+userid+"'/>";
		}
		xml += "</users>";
		for (var i=0; i<PortfoliosGroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = PortfoliosGroups_byid[gid].rrg[grouplabel][i];
			updateRRGroup_Users(groupid,users,xml,type,'value');
		}
		var html = "";
		//-----------------------------
		for ( var i = 0; i < users.length; i++) {
			var userid = $(users[i]).attr('value');
			if (Users_byid[userid]!=null && Users_byid[userid]!=undefined) {
				if (Users_byid[userid].active_node.text()=='1') {
					html += "<div class='item' >"+Users_byid[userid].getView(null,"firstname-lastname-username")+"</div>";
				} else
					$("#"+destid).append($("<div class='item inactive'>"+Users_byid[userid].getView(null,"firstname-lastname-username")+"</div>"));
			}
		}
		var header = "";
		if (type=="share")
			header = karutaStr[LANG]['shared'];
		else
			header = karutaStr[LANG]['unshared'];
		alertHTML("<h5>"+karutaStr[LANG]['role']+": "+grouplabel+"</h5><h5>"+karutaStr[LANG]['users']+": </h5>"+html,header);
		//-----------------------------
	}
};
