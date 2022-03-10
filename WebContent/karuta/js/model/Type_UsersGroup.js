/* =======================================================
	Copyright 2020 - ePortfolium - Licensed under the
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

//---------------------------------
var usergroups_byid = {};
var usergroups_list = [];
var usergroup_last_drop = "";

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

/// Define our type
//==================================
UIFactory["UsersGroup"] = function(node)
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
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------ DRAG AND DROP -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["UsersGroup"].ondragover = function (ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color-complement');
	event.target.style.outline = "3px solid "+bckcolor;
}

//==================================
UIFactory["UsersGroup"].ondragleave = function (ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	event.target.style.outline = "0px solid white";
}

//==================================
UIFactory["UsersGroup"].drop = function(ev)
//==================================
{
	ev.preventDefault();
	event.target.style.outline = "0px solid white";
	var userid = ev.dataTransfer.getData("id");
	var type = ev.dataTransfer.getData("type");
	var groupid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var current_drop = userid+"/"+groupid;
	if (current_drop!=usergroup_last_drop) {
		usergroup_last_drop = current_drop;
		if (type="user") {
			UIFactory.UsersGroup.add(groupid,userid);
		}
	}

}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ LOADERS -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["UsersGroup"].loadAndDisplayAll = function (type)
//==================================
{
	$("#wait-window").modal('show');
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups",
		data: "",
		success : function(data) {
			UIFactory.UsersGroup.parse(data);
			UIFactory.UsersGroup.displayAll(type);
			$("#wait-window").modal('hide');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET UIFactory.UsersGroup.loadAndDisplayGroups: "+textStatus);
			$("#wait-window").modal('hide');
		}
	});
}

//==================================
UIFactory["UsersGroup"].parse = function(data) 
//==================================
{
	usergroups_byid = {};
	usergroups_list = [];
	var items = $("group",data);
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var gid = $(items[i]).attr('id');
		usergroups_byid[gid] = new UIFactory["UsersGroup"](items[i]);
		var code = usergroups_byid[gid].code_node.text();
		tableau1[i] = [code,gid];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usergroups_list[i] = usergroups_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["UsersGroup"].prototype.toggleContent = function(type)
//==================================
{
	if ($("#tree_usergroup_label_"+this.id).hasClass('active')) {
		$(".usergroup-label").removeClass('active');
		$("#usergroup-rightside").html("");
	} else {
		if (this.loaded)
			this.displayContent(type);
		else
			this.loadAndDisplayContent(type);
		$(".usergroup-label").removeClass('active');
		$("#tree_usergroup-label_"+this.id).addClass('active');
	}
}

//==============================
UIFactory["UsersGroup"].prototype.loadNumberOfUsers = function (type)
//==============================
{
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+this.id,
		data: "",
		group : this, // passing group to success
		success : function(data) {
			var items = $("user",data);
			this.group.nbchildren = items.length;
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
}

//==============================
UIFactory["UsersGroup"].prototype.loadContent = function (type)
//==============================
{
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+this.id,
		data: "",
		group : this, // passing group to success
		success : function(data) {
			this.group.loaded = true;
			//-------------------------
			var tableau1 = new Array();
			var uuid = "";
			var items = $("user",data);
			for ( var i = 0; i < items.length; i++) {
				uuid = $(items[i]).attr('id');
				if (Users_byid[uuid]==undefined){
					$.ajax({
						async: false,
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/users/user/"+uuid,
						userid : uuid,
						groupid : this.group.id,
						success : function(data) {
							UIFactory.User.parse_add(data);
						},
						error : function() {
							if (confirm("The user "+this.userid+" does not exist anymore. Delete from the Usergroup ?"))
								UIFactory.UsersGroup.remove(this.groupid,this.userid)
						}
					});
				}
				if (Users_byid[uuid]!=undefined){
					var lastname = Users_byid[uuid].lastname;
					if (lastname=="")
						lastname = " ";
					var firstname = Users_byid[uuid].firstname;
						tableau1[tableau1.length] = [lastname,firstname,uuid];
				}
			}
			var newTableau1 = tableau1.sort(sortOn1_2);
			this.group.children = {};
			for (var i=0; i<newTableau1.length; i++){
				this.group.children[newTableau1[i][2]] = {'id':newTableau1[i][2]};
			}
			this.group.nbchildren = items.length;
		},
		error : function(jqxhr) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
}

//==============================
UIFactory["UsersGroup"].prototype.loadAndDisplayContent = function (type)
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
UIFactory["UsersGroup"].displayAll = function(type)
//==================================
{
	$("#"+type+"-leftside-content1").html("");
	for ( var i = 0; i < usergroups_list.length; i++) {
		usergroups_list[i].loadNumberOfUsers();
		usergroups_list[i].displayView(type+"-leftside-content1",type);
	}
};

//==================================
UIFactory["UsersGroup"].prototype.displayView = function(dest,type)
//==================================
{
	var html = "";
	//---------------------------------------------------------
	if (type=='header') {
		//---------------------
		if (dest!=null) {
			this.display[dest] = type;
		}
		//---------------------
		html += "<div id='usergroup_"+this.id+"' class='tree-elt' ondrop='UIFactory.UsersGroup.drop(event)' ondragover='UIFactory.UsersGroup.ondragover(event)' ondragleave='UIFactory.UsersGroup.ondragleave(event)'";
		html += "		<span class='UsersGroup-label'>"+this.code_node.text()+"</span>";
		//------------ buttons ---------------
		html += "		<div class='dropdown menu' style='float:right'>";
		if (USER.admin) {
			html += "		<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
			html += "		<div class='dropdown-menu  dropdown-menu-right'>";
			html += "			<a class='dropdown-item' onclick=\"usergroups_byid['"+this.id+"'].edit()\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.UsersGroup.confirmRemove('"+this.id+"')\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
			html += "		</div>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "		<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'></button>";
		}
		html += "		</div><!-- class='dropdown' -->";
		html += "</div>";
		//---------------------------------------
		$("#"+dest).html($(html));
	}
	//---------------------------------------------------------
	if (type=='usergroup') {
		//---------------------
		if (dest!=null) {
			this.displayLabel["usergrouplabel_"+this.id] = type;
		}
		//---------------------------------------
		var usergroup_code = this.code_node.text();
		var usergroup_label = this.label_node[LANGCODE].text();
		if (usergroup_label==undefined || usergroup_label=='' || usergroup_label=='&nbsp;')
			usergroup_label = '- no label in '+languages[LANGCODE]+' -';
		//-------------------------------------------------
		html += "<div id='usergroup_"+this.id+"' class='usergroup'>";
		html += "	<div id='tree_usergroup-label_"+this.id+"' class='tree-label usergroup-label'>";
		html += "		<span id='usergrouplabel_"+this.id+"' onclick=\"usergroups_byid['"+this.id+"'].toggleContent('"+type+"')\" class='project-label'>"+usergroup_code+"</span>";
		html += "		&nbsp;<span class='nbchildren badge' id='nbchildren_"+this.id+"' >"+this.nbchildren+"</span>";
		html += "	</div>";
		html += "</div>"
		$("#"+dest).append($(html));
		//-------------------------------------------------
	}
	//---------------------------------------------------------
};

//==================================
UIFactory["UsersGroup"].prototype.displayContent = function(type)
//==================================
{
	var code = this.code_node.text();
	//-------------------- header -------------------------------
	$("#"+type+"-rightside-header").html("");
	this.displayView(type+"-rightside-header",'header');
	//------------------ content ---------------------------
	$("#"+type+"-rightside-content2").html($("<div class='users-content' id='"+type+"-users-content'</div>"));
	for (uuid in this.children){
		var user = Users_byid[uuid];
		$("#"+type+"-users-content").append($("<div class='row user-row' id='usergroup_"+user.id+"'</div>"));
		$("#usergroup_"+user.id).html(user.getView("usergroup_"+user.id,'usergroup',null,this.id));
	}
	$("#nbchildren_"+this.id).html(this.nbchildren);
	$(window).scrollTop(0);
	$("#wait-window").modal('hide');
};

//==================================
UIFactory["UsersGroup"].prototype.refresh = function()
//==================================
{
	for (dest1 in this.displayLabel) {
		var group_label = this.code_node.text();
		$("#"+dest1).html(group_label);
	};
	for (dest2 in this.display) {
		$("#"+dest2).html("");
		$("#"+dest2).html(this.displayView(dest2,this.display[dest2]));
	};

};

//--------------------------------------------------------------
//--------------------------------------------------------------
//----------------- ADD / REMOVE / DELETE ----------------------
//--------------------------------------------------------------
//--------------------------------------------------------------


//==================================
UIFactory["UsersGroup"].add = function(groupid,userid) 
//==================================
{
	var url = serverBCK_API+"/usersgroups?group=" + groupid + "&user="+userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			usergroups_byid[groupid].loadAndDisplayContent('usergroup');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in UIFactory.UsersGroup.add : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersGroup"].confirmRemove = function(gid,uid) 
//==================================
{
	var str1 = karutaStr[LANG]["confirm-delete"];
	var str2 = karutaStr[LANG]["button-delete"];
	if (uid!=null && uid!='null') {
		str1 = karutaStr[LANG]["confirm-remove-item-group"];
		str2 = karutaStr[LANG]["button-remove"];
	}
	document.getElementById('delete-window-body').innerHTML = str1;
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"UIFactory.UsersGroup.remove('"+gid+"','"+uid+"');$('#delete-window').modal('hide');\">" + str2 + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].remove = function(gid,uid) 
//==================================
{
	var url = serverBCK_API+"/usersgroups?group=" + gid;
	if (uid!=null && uid!='null' && uid!='undefined') {
		url += "&user="+uid;
	}
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		gid : gid,
		uid : uid,
		success : function(data) {
			if (this.uid!=null && this.uid!='undefined') {
				usergroups_byid[this.gid].loadAndDisplayContent('usergroup');
			} else
				fill_list_usersgroups();
		}
	});
};



//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ CREATE ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["UsersGroup"].callCreateGroup = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_usersgroup']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codegroup").val();
		var label = $("#labelgroup").val();
		if (code!='' && label!='') {
			UIFactory.UsersGroup.create(code,label);
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
UIFactory["UsersGroup"].create = function(code,label)
//==================================
{
	var url = serverBCK_API+"/usersgroups?label="+code;
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$('#edit-window').modal('hide');
			fill_list_usersgroups('usergroup');
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
//------------------------ EDIT / UPDATE -----------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["UsersGroup"].prototype.update = function(attribute,value)
//==================================
{
	this.attributes[attribute].text(value); // update attribute value
	var node = this.node;
	var data = xml2string(node);
	var url = serverBCK_API+"/usersgroups?group=" + this.id +"&"+attribute+"="+value;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		group: this,
		success : function(data) {
			this.group.refresh();
		}
	});
};

//==================================================
UIFactory["UsersGroup"].prototype.getAttributeEditor = function(attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control'";
	html += " type='text'";
	html += " onchange=\"usergroups_byid['"+this.id+"'].update('"+attribute+"',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["UsersGroup"].prototype.getEditor = function()
//==================================
{
	var html = "";
	html += "<form class='form-horizontal'>";
	html += this.getAttributeEditor("label",this.code_node.text());
	html += "</form>";
	return html;
};

//==================================
UIFactory["UsersGroup"].prototype.edit = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['group']);
	var html = "";
	$("#edit-window-body").html(html);
	//--------------------------
	html = this.getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ FOR SHARING -------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------


//==================================
UIFactory["UsersGroup"].displaySelectMultipleWithUsersList = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < usergroups_list.length; i++) {
		if (!usergroups_list[i].loaded)
			usergroups_list[i].loadContent(type);
		var gid = usergroups_list[i].id;
		var label = usergroups_list[i].code_node.text();
		var html = "<input type='checkbox' name='select_usersgroups' value='"+gid+"'";
		html += " onchange=\"javascript:UIFactory['UsersGroup'].toggleUsersList('"+gid+"','"+destid+"-group-"+gid+"', this.checked)\" ";
		html += "> "+label+" </input>";
		html += "<br/><div class='usersgroup-users' id='"+destid+"-group-"+gid+"' style='display:none'></div>";
		$("#"+destid).append($(html));
	}
};

//==================================
UIFactory["UsersGroup"].hideUsersList = function(destid)
//==================================
{
	for ( var i = 0; i < usergroups_list.length; i++) {
		var gid = usergroups_list[i].id;
		$("#"+destid+gid).html("");
	}
};

//==================================
UIFactory["UsersGroup"].toggleUsersList = function(gid,destid,checked)
//==================================
{
	if (checked) {
		var html = "";
		$("#"+destid).html(html);
		$("#"+destid).show();
		//--------------------------
		if (!usergroups_byid[gid].loaded)
			usergroups_byid[gid].loadContent();
		for (uuid in usergroups_byid[gid].children){
			let user = Users_byid[uuid];
			if (user!=null && user!=undefined) {
				let itemid = destid+"_"+user.id;
				if (user.active_node.text()=='1')
					$("#"+destid).append($("<div class='item' id='"+itemid+"'></div>"));
				else
					$("#"+destid).append($("<div class='item inactive' id='"+itemid+"'></div>"));
				html = "<div>"+user.getSelector(null,null,"users-in-group",true,true)+"</div>";
				$("#"+itemid).html(html);
			}
		}
		var items = $("div[class='item']",$("#"+destid));
		if (items.length==0)
			$("#"+destid).html("<h5>"+karutaStr[LANG]['empty-group']+"</h5>");
	} else {
		$("#"+destid).html("");
		$("#"+destid).hide();
	}
};
