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

var portfoliogroups_byid = {};
var portfoliogroups_list = [];
var portfoliogroup_last_drop = "";

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
	this.code = $("label",node).text();
	this.code_node = $("label",node);
	//------------------------------
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
		if (this.label_node[i].length==0) {
			var newElement = createXmlElement("label");
			$(newElement).attr('lang', languages[i]);
			$(newElement).text(karutaStr[languages[languages[i]],'new']);
			$(node)[0].appendChild(newElement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
		}
	}
	//------------------------------
	this.attributes = {};
	this.attributes["code"] = this.code_node;
	this.attributes["label"] = this.code_node;
	//------------------------------
	this.display = {};
	this.displayLabel = {};
	//------------------------------
	this.loaded = false;
	this.nbchildren = 0;
	this.children = {};
	//------------------------------
	this.roles = [];
	this.rrg = {};
	//------------------------------
	this.loadContent()
;};

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------ DRAG AND DROP -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
function ondragoverPortfolioGroup(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color-complement');
	event.target.style.outline = "3px solid "+bckcolor;
}

//==================================
function ondragleavePortfolioGroup(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	event.target.style.outline = "0px solid white";
}

//==================================
function dropPortfolioGroup(ev)
//==================================
{
	ev.preventDefault();
	event.target.style.outline = "0px solid white";
	//----------srce----------------------
	var srceid = ev.dataTransfer.getData("uuid").substring(ev.dataTransfer.getData("uuid").lastIndexOf('_')+1);
	var type = ev.dataTransfer.getData("type");
	//---------target------------------------
	var groupid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	//---------------------------------
	var current_drop = portfolioid+"/"+groupid;
	if (current_drop!=portfoliogroup_last_drop) {
		if (type=="portfolio") {
			portfoliogroups_byid[groupid].addPortfolio(srceid);
		}
		if (type=="folder") {
			var folder = folders_byid[srceid];
			if (!folder.loaded)
				folder.loadContent();
			for (uuid in folder.children){
				portfoliogroups_byid[groupid].addPortfolio(uuid);
			}
		}
	}
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ LOADERS -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfoliosGroup"].loadAndDisplayAll = function (type)
//==================================
{
	$("#wait-window").show();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory.PortfoliosGroup.parse(data);
			UIFactory.PortfoliosGroup.displayAll(type);
			$("#wait-window").hide();
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET UIFactory.PortfoliosGroup.loadAndDisplayGroups: "+textStatus);
			$("#wait-window").hide();
		}
	});
}

//==================================
UIFactory["PortfoliosGroup"].parse = function(data) 
//==================================
{
	portfoliogroups_byid = {};
	portfoliogroups_list = [];
	var items = $("group",data);
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var gid = $(items[i]).attr('id');
		portfoliogroups_byid[gid] = new UIFactory["PortfoliosGroup"](items[i]);
		var code = portfoliogroups_byid[gid].code_node.text();
		tableau1[i] = [code,gid];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		portfoliogroups_list[i] = portfoliogroups_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.toggleContent = function(type)
//==================================
{
	if ($("#tree_portfoliogroup_label_"+this.id).hasClass('active')) {
		localStorage.setItem('currentDisplayedPortfolioGroupCode','none');
	} else {
		if (this.loaded)
			this.displayContent(type);
		else
			this.loadAndDisplayContent(type);
		$(".portfoliogroup-label").removeClass('active');
		$("#tree_portfoliogroup-label_"+this.id).addClass('active');
		localStorage.setItem('currentDisplayedPortfolioGroupCode',this.code_node.text());
	}
}

//==============================
UIFactory["PortfoliosGroup"].prototype.loadContent = function ()
//==============================
{
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?group="+this.id,
		data: "",
		group : this, // passing group to success
		success : function(data) {
			this.group.loaded = true;
			//-------------------------
			var tableau1 = new Array();
			var uuid = "";
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				uuid = $(items[i]).attr('id');
				if (portfolios_byid[uuid]==undefined){
					UIFactory.Portfolio.load(uuid,"1");
				}
				var code = portfolios_byid[uuid].code_node.text();
				tableau1[tableau1.length] = [code,uuid];
			}
			var newTableau1 = tableau1.sort(sortOn1);
			this.group.children = {};
			for (var i=0; i<newTableau1.length; i++){
				this.group.children[newTableau1[i][1]] = {'id':newTableau1[i][1]};
			}
			this.group.nbchildren = items.length;
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
}

//==============================
UIFactory["PortfoliosGroup"].prototype.loadAndDisplayContent = function (type)
//==============================
{
	this.loadContent();
	this.displayContent(type);
}


//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ DISPLAY -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------


//==================================
UIFactory["PortfoliosGroup"].displayAll = function(type)
//==================================
{
	$("#"+type+"-leftside-content1").html("");
	for ( var i = 0; i < portfoliogroups_list.length; i++) {
		portfoliogroups_list[i].displayView(type+"-leftside-content1",'list',type);
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getLabel = function(langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var label = this.label_node[langcode].text();
	if (label=="")
		label = this.code_node.text(); // for backward compatibility
	return label;
}

//==================================
UIFactory["PortfoliosGroup"].prototype.displayView = function(dest,viewtype,type)
//==================================
{
	var group_type = "PortfoliosGroup";
	if (dest!=null) {
		this.display[dest]=true;
	}
	if (viewtype==null)
		viewtype = 'list';
	var html = "";
	if (viewtype=='list-old') {
		displayGroup[group_viewtype][this.id] = localStorage.getItem('dg_'+group_viewtype+"-"+this.id);
		html += "	<div class='row row-label'>";
		if (displayGroup[group_viewtype][this.id]!=undefined && displayGroup[group_viewtype][this.id]=='open')
			html += "		<div onclick=\"javascript:toggleGroup('"+group_viewtype+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-1'><span id='toggleContent_"+group_viewtype+"-"+this.id+"' class='button fas fa-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleGroup('"+group_viewtype+"','"+this.id+"','UIFactory.PortfoliosGroup.displayPortfolios','list','"+lang+"')\" class='col-1'><span id='toggleContent_"+group_viewtype+"-"+this.id+"' class='button fas fa-plus'></span></div>";
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
		if (displayGroup[group_viewtype][this.id]!=undefined && displayGroup[group_viewtype][this.id]=='open')
			html += "	<div class='portfoliosgroup-content' id='content-"+group_viewtype+"-"+this.id+"' style='display:block'></div>";
		else
			html += "	<div class='portfoliosgroup-content' id='content-"+group_viewtype+"-"+this.id+"' style='display:none'></div>";
		$("#"+dest).append($(html));
	}
	if (viewtype=='header') {
		html += "<div id='portfoliogroup_"+this.id+"' class='tree-elt' ondrop='dropPortfolioGroup(event)' ondragover='ondragoverPortfolioGroup(event)' ondragleave='ondragleavePortfolioGroup(event)'";
		html += "		<span class='portfoliosgroup-label'>"+this.code_node.text()+"</span>";
		//------------ buttons ---------------
		html += "		<div class='dropdown menu' style='float:right'>";
		if (USER.admin) {
			html += "		<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
			html += "		<div class='dropdown-menu  dropdown-menu-right'>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.edit('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.confirmRemove('"+this.id+"',null)\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
//			html += "			<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.callAddPortfolios('"+this.id+"','"+this.label_node.text()+"')\" ><i class='fa fa-plus-square'></i> "+karutaStr[LANG]["add_portfolios"]+"</a>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.callShareUsers('"+this.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
			html += "		</div>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "		<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'></button>";
		}
		html += "		</div><!-- class='dropdown' -->";
		html += "</div>";
		//---------------------------------------
		$("#"+dest).append($(html));
	}

	if (viewtype=='list') {
		//---------------------
		if (dest!=null) {
			this.displayLabel["portfoliogrouplabel_"+this.id] = viewtype;
		}
		//---------------------
		var html = "";
		var portfoliogroup_code = this.code_node.text();
		//-------------------------------------------------
		var portfoliogroup_label = this.label_node[LANGCODE].text();
		if (portfoliogroup_label==undefined || portfoliogroup_label=='' || portfoliogroup_label=='&nbsp;')
			portfoliogroup_label = '- no label in '+languages[LANGCODE]+' -';
		//-------------------------------------------------
		html += "<div id='portfoliogroup_"+this.id+"' class='portfoliogroup' ondrop='dropPortfolioGroupFolder(event)' ondragover='ondragoverPortfolioGroupFolder(event)' ondragleave='ondragleavePortfolioGroupFolder(event)'>";
		html += "	<div id='tree_portfoliogroup-label_"+this.id+"' class='tree-label portfoliogroup-label'>";
		html += "		<span id='portfoliogrouplabel_"+this.id+"' onclick=\"portfoliogroups_byid['"+this.id+"'].toggleContent('"+type+"')\" class='project-label'>"+portfoliogroup_code+"</span>";
		html += "		&nbsp;<span class='nbchildren badge' id='nbchildren_"+this.id+"'>"+this.nbchildren+"</span>";
		html += "	</div>";
		html += "</div>"
		$("#"+dest).append($(html));
		//-------------------------------------------------
		if (!this.loaded && localStorage.getItem('currentDisplayedPortfolioGroupCode')==portfoliogroup_code) {
			this.loadAndDisplayContent(type);
			$(".portfoliogroup-label").removeClass('active');
			$("#tree_portfoliogroup-label_"+this.id).addClass('active');
		}
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.displayContent = function(type)
//==================================
{
	var code = this.code_node.text();
	//-------------------- header -------------------------------
	$("#"+type+"-rightside-header").html("");
	this.displayView(type+"-rightside-header",'header',type);
	//------------------ content ---------------------------
	$("#"+type+"-rightside-content2").html($("<div class='portfolios-content' id='"+type+"-portfolios-content'</div>"));
	for (uuid in this.children){
		var portfolio = portfolios_byid[uuid];
		var portfoliocode = portfolio.code_node.text();
		$("#"+type+"-portfolios-content").append($("<div class='row portfolio-row' id='portfoliogroup_"+portfolio.id+"'</div>"));
		$("#portfoliogroup_"+portfolio.id).html(portfolio.getPortfolioView("portfoliogroup_"+portfolio.id,'portfoliogroup',null,null,null,this.id));
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
};

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ CREATE ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfoliosGroup"].callCreateGroup = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_portfoliosgroup']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codegroup").val();
		var label = $("#labelgroup").val();
		if (code!='' && label!='') {
			UIFactory.PortfoliosGroup.create(code,label);
		} else {
			if (code=='')
				alertHTML(karutaStr[LANG]['code-not-null']);
			if (label=='')
				alertHTML(karutaStr[LANG]['label-not-null']);
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='codegroup' class='col-sm-3 control-label'>Code</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='codegroup' type='text' class='form-control' value=''>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group' style='display:none'>";
	html += "		<label for='labelgroup' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='labelgroup' type='text' class='form-control' value=' '>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].create = function(code,label)
//==================================
{
	var url = serverBCK_API+"/portfoliogroups?type=portfolio&label="+code;
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			fill_list_portfoliosgroups();
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

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ADD \ DELETE -------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfoliosGroup"].prototype.addPortfolio = function(portfolioid)
//==================================
{
	var url = serverBCK_API+"/portfoliogroups?group="+this.id+"&uuid="+portfolioid;
	$.ajax({
		type : 'PUT',
		dataType : "text",
		url : url,
		data : "",
		groupid : this.id,
		success : function(data) {
			portfoliogroups_byid[this.groupid].loadAndDisplayContent('portfoliogroup');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
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
		gid : gid,
		uid : uid,
		success : function(data) {
			if (this.uid!=null) {
				portfoliogroups_byid[this.gid].loadAndDisplayContent('portfoliogroup');
			} else
				fill_list_portfoliosgroups();
		}
	});
};

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ EDIT / UPDATE -----------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfoliosGroup"].update = function(gid,attribute,value)
//==================================
{
	portfoliogroups_byid[gid].attributes[attribute].text(value); // update attribute value
	var node = portfoliogroups_byid[gid].node;
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
			$("#portfoliogroup-refresh").click();
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
	html += UIFactory["PortfoliosGroup"].getAttributeEditor(this.id,"label",this.code_node.text());
	html += "</form>";
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
	html = portfoliogroups_byid[gid].getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};


//--------------------------------------------------------------
//--------------------------------------------------------------
//---------------------- SHARING -------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------



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
UIFactory["PortfoliosGroup"].prototype.fillSharingRoles = function()
//==================================
{
	this.rrg = {};
	var rrg = this.rrg;
	var roles = this.roles;
	for ( uuid in this.children) {
		//------------------------------------
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups?portfolio="+uuid,
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
	if (!portfoliogroups_byid[gid].loaded)
		portfoliogroups_byid[gid].loadContent();
	portfoliogroups_byid[gid].getSharingRoleEditor(destid,callFunction);
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
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+portfoliogroups_byid[gid].getLabel());
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
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+portfoliogroups_byid[gid].getLabel());
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
	if (usergroups_byid.length>0) { // users groups loaded
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
		for (var i=0; i<portfoliogroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = portfoliogroups_byid[gid].rrg[grouplabel][i];
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
		for (var i=0; i<portfoliogroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = portfoliogroups_byid[gid].rrg[grouplabel][i];
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
