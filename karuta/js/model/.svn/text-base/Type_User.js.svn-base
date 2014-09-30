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

var USER = null; // global variable: current user object

var Users_byid = {};
var UsersActive_list = [];
var UsersInactive_list = [];

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["User"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.username_node = $("username",node);
	this.firstname_node = $("firstname",node);
	this.lastname_node = $("lastname",node);
	this.email_node = $("email",node);
	this.password_node = $("password",node);
	this.designer_node = $("designer",node);
	this.admin_node = $("admin",node);
	this.active_node = $("active",node);
	this.attributes = {};
	this.attributes["username"] = this.username_node;
	this.attributes["firstname"] = this.firstname_node;
	this.attributes["lastname"] = this.lastname_node;
	this.attributes["email"] = this.email_node;
	this.attributes["password"] = this.email_node;
	this.attributes["admin"] = this.admin_node;
	this.attributes["designer"] = this.designer_node;
	this.attributes["active"] = this.active_node;
	this.admin = this.admin_node.text()=='1';
	this.creator = this.designer_node.text()=='1' || this.admin_node.text()=='1';
	this.display = {};
};


/// Display

//==================================
UIFactory["User"].displayActive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("<table id='table_users' class='tablesorter'><thead><th>Firstname</th><th>Lastname</th><th>Username</th><th></th></thead><tbody id='list_users'></tbody></table>");
	$("#list_users").append($("<tr><td></td><td></td><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
	for ( var i = 0; i < UsersActive_list.length; i++) {
		var itemid = destid+"_"+UsersActive_list[i].id;
		$("#list_users").append($("<tr class='item' id='"+itemid+"'></tr>"));
		$("#"+itemid).html(UsersActive_list[i].getView(destid,type,lang));
	}
};

//==================================
UIFactory["User"].displayInactive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("<table id='table_unusers' class='tablesorter'><thead><th>Firstname</th><th>Lastname</th><th>Username</th><th></th></thead><tbody id='list_unusers'></tbody></table>");
	$("#list_unusers").append($("<tr><td></td><td></td><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
	for ( var i = 0; i < UsersInactive_list.length; i++) {
		var itemid = destid+"_"+UsersInactive_list[i].id;
		$("#list_unusers").append($("<tr class='item' id='"+itemid+"'></tr>"));
		$("#"+itemid).html(UsersInactive_list[i].getView(destid,type,lang));
	}
};

//==================================
UIFactory["User"].prototype.getView = function(dest,type,lang)
//==================================
{
	if (dest!=null) {
		this.display[dest]=true;
	}
	if (lang==null)
		lang = LANG;
	var html = "<td>"+this.firstname_node.text() + "</td><td>" + this.lastname_node.text()+ "</td><td> (" + this.username_node.text() + ")</td>";
	if (type=='list') {
		if (USER.admin){
			html += " <td><a class='btn btn-mini pull-right' onclick=\"UIFactory['User'].confirmRemove('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
			html += "<i class='icon-remove'></i>";
			html += "</a>";
			html += " <a class='btn btn-mini pull-right' onclick=\"UIFactory['User'].edit('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' relx='tooltip'>";
			html += "<i class='icon-edit'></i>";
			html += "</a></td>";
		}
	}
	return html;
};


//==================================
UIFactory["User"].update = function(userid,attribute,value)
//==================================
{
	Users_byid[userid].attributes[attribute].text(value); // update attribute value
	var node = Users_byid[userid].node;
	var data = xml2string(node);
	var url = "../../../"+serverBCK+"/users/user/" + userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : data,
		success : function(data) {
			alert("saved");
			window.location.reload();
		}
	});

};

//==================================================
UIFactory["User"].getAttributeEditor = function(userid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='controls'><input";
	html += " type='text'";
	html += " onchange=\"javascript:UIFactory['User'].update('"+userid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["User"].getAttributeCheckEditor = function(userid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='controls'><input";
	html += " type='checkbox'";
	if (value=='1')
		html += " checked='true' ";
	html += " onchange=\"javascript:UIFactory['User'].update('"+userid+"','"+attribute+"',this.value)\" value='1' ></div>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["User"].getAttributeRadioEditor = function(userid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='control-group'>";
	html += "	<label class='control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "	<div class='controls'>";
	html += "		<input type='radio' name='"+attribute+"'";
	if (value=='1')
		html += " checked='true' ";
	html += "			onchange=\"javascript:UIFactory['User'].update('"+userid+"','"+attribute+"',this.value)\" value='1' /> oui ";
	html += "		<input type='radio' name='"+attribute+"'";
	if (value=='0')
		html += " checked='true' ";
	html += "			onchange=\"javascript:UIFactory['User'].update('"+userid+"','"+attribute+"',this.value)\" value='0' /> non ";
	html += "	</div>";
	html += "</div>";
	return html;
};


//==================================
UIFactory["User"].prototype.getEditor = function(type,lang)
//==================================
{
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getAttributeEditor(this.id,"username",this.username_node.text());
	html += UIFactory["User"].getAttributeEditor(this.id,"lastname",this.lastname_node.text());
	html += UIFactory["User"].getAttributeEditor(this.id,"firstname",this.firstname_node.text());
	html += UIFactory["User"].getAttributeEditor(this.id,"email",this.email_node.text());
	html += UIFactory["User"].getAttributeRadioEditor(this.id,"designer",this.designer_node.text());
	html += UIFactory["User"].getAttributeRadioEditor(this.id,"admin",this.admin_node.text());
	html += UIFactory["User"].getAttributeRadioEditor(this.id,"active",this.active_node.text());
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[LANG]['new_password']+"</label>";
	html += "  <div class='controls'><input";
	html += " type='password'";
	html += " onchange=\"javascript:UIFactory['User'].changePassword('"+this.id+"',this.value)\" value='' ></div>";
	html += "</div>";
	html += "</form>";
	return html;
};

//==================================
UIFactory["User"].prototype.getSelector = function(attr,value,name)
//==================================
{
	var userid = this.id;
	if (userid==1)
		return "";
	var firstname = this.firstname_node.text();
	var lastname = this.lastname_node.text();
	var username = this.username_node.text();
	var html = "<input type='checkbox' name='"+name+"' value='"+userid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	html += "> "+firstname+" "+lastname+" ("+username+") </input>";
	return html;
};

//==================================
UIFactory["User"].edit = function(userid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<span class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</span>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['user']);
	var html = "";
	$("#edit-window-body-content").html(html);
	//--------------------------
	html = Users_byid[userid].getEditor();
	$("#edit-window-body-content").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["User"].parse = function(data) 
//==================================
{
	var items = $("user",data);
	var inactive = active = 0;
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var userid = $(items[i]).attr('id');
		Users_byid[userid] = new UIFactory["User"](items[i]);
		var lastname = Users_byid[userid].lastname_node.text();
		if ($("active",$(items[i])).text() == "1") {  // active user
			tableau1[active] = [lastname,userid];
//			UsersActive_list[active] = Users_byid[userid];
			active++;
		}
		else { // inactive user
			tableau2[inactive] = [lastname,userid];
//			UsersInactive_list[inactive] = Users_byid[userid];
			inactive++;
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		UsersActive_list[i] = Users_byid[newTableau1[i][1]];
	}
	var newTableau2 = tableau2.sort(sortOn1);
	for (var i=0; i<newTableau2.length; i++){
		UsersInactive_list[i] = Users_byid[newTableau2[i][1]];
	}
};

//==================================
UIFactory["User"].confirmRemove = function(userid) 
//==================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<span class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</span>";
	buttons += "<span class='btn btn-danger' onclick=\"javascript:UIFactory['User'].remove('"+userid+"');$('#delete-window').modal('hide');\">" + karutaStr[LANG]["button-delete"] + "</span>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["User"].remove = function(userid) 
//==================================
{
	var url = "../../../"+serverBCK+"/users/user/" + userid;
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			window.location.reload();
		}
	});
};

//==================================
UIFactory["User"].displaySelectMultipleActive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersActive_list.length; i++) {
		var input = UsersActive_list[i].getSelector(null,null,'select_users');
		$("#"+destid).append($(input));
		$("#"+destid).append($("<br>"));
	}
};

//==================================
UIFactory["User"].displaySelectMultipleActiveDesigner = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersActive_list.length; i++) {
		if (UsersActive_list[i].designer){
			var input = UsersActive_list[i].getSelector(null,null,'select_designers');
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));
		}
	}
};


//==================================================
UIFactory["User"].getAttributeCreator = function(attribute,value,pwd)
//==================================================
{
	var html = "";
	html += "<div class='control-group'>";
	html += "<label class='control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "<div class='controls'><input id='user_"+attribute+"'";
	if (pwd!=null && pwd)
		html += " type='password'";
	else
		html += " type='text'";
	html += " value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["User"].callCreate = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['User'].create()";
	var footer = "<span class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</span><span class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</span>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_user']);
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getAttributeCreator("username","");
	html += UIFactory["User"].getAttributeCreator("lastname","");
	html += UIFactory["User"].getAttributeCreator("firstname","");
	html += UIFactory["User"].getAttributeCreator("email","");
	html += UIFactory["User"].getAttributeCreator("password","",true);
	html += UIFactory["User"].getAttributeCreator("designer","0");
	html += UIFactory["User"].getAttributeCreator("admin","0");
	html += UIFactory["User"].getAttributeCreator("active","1");
	html += "</form>";
	$("#edit-window-body-content").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["User"].create = function()
//==================================
{

	var xml = "";
	xml +="<?xml version='1.0' encoding='UTF-8'?>";
	xml +="<users>";
	xml +="<user>";
	xml +="	<username>"+$("#user_username").val()+"</username>";
	xml +="	<lastname>"+$("#user_lastname").val()+"</lastname>";
	xml +="	<firstname>"+$("#user_firstname").val()+"</firstname>";
	xml +="	<email>"+$("#user_email").val()+"</email>";
	xml +="	<password>"+$("#user_password").val()+"</password>";
	xml +="	<active>"+$("#user_active").val()+"</active>";
	xml +="	<admin>"+$("#user_admin").val()+"</admin>";
	xml +="	<designer>"+$("#user_designer").val()+"</designer>";
	xml +="</user>";
	xml +="</users>";
	var url = "../../../"+serverBCK+"/users";
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : xml,
		success : function(data) {
			window.location.reload();
		}
	});
};

//==================================
UIFactory["User"].changePassword = function(userid,value)
//==================================
{
	if (userid==null)
		userid = USER.id;
	if (value==null)
		value = $("#user_password").val();
	var xml = "";
	xml +="<?xml version='1.0' encoding='UTF-8'?>";
	xml +="<user>";
	xml +="	<password>"+value+"</password>";
	xml +="</user>";
	var url = "../../../"+serverBCK+"/users/user/" + userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : xml,
		success : function(data) {
			alert("saved");
			window.location.reload();
		}
	});

};
//==================================
UIFactory["User"].callChangePassword = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['User'].changePassword()";
	var footer = "<span class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Change']+"</span><span class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</span>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['change_password']);
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getAttributeCreator("password","",true);
	html += "</form>";
	$("#edit-window-body-content").html(html);
	//--------------------------
	$('#edit-window').modal('show');

}