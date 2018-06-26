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
	// For compatibility
  var xml=0;
  if( node.selector != null )
  { xml = node[0].outerHTML; }
  else
  { xml = node; }

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xml,"text/xml");
  var p = xmlDoc.querySelector("user");
  this.id = p.getAttribute("id");
  this.node = xmlDoc;
  this.attributes = {};
  this.display = {};
  var cds = p.children;
  for( var i=0; i<cds.length; i++ )
  {
    var c = cds[i];
    var nn = c.nodeName;
    var nc = c.textContent;
    this[nn] = nc;
    // For compatibility
    this[nn+"_node"] = c;
    this.attributes[nn] = c;
  }
  // setting flags
  this.admin = this.admin == "1";
  this.creator = this.designer == "1" || this.admin;
  this.limited = this.other.indexOf('limited')>-1;
  
	/*
  this.id = $(node).attr('id');
	this.node = node;
	this.firstname = $("firstname",node).text();
	this.lastname = $("lastname",node).text();
	this.username = $("username",node).text();
	this.username_node = $("username",node);
	this.firstname_node = $("firstname",node);
	this.lastname_node = $("lastname",node);
	this.email_node = $("email",node);
	this.password_node = $("password",node);
	this.designer_node = $("designer",node);
	this.admin_node = $("admin",node);
	this.active_node = $("active",node);
	this.substitute_node = $("substitute",node);
	this.other_node = $("other",node);
	if (this.other_node.length==0) { // for backward compatibility
		var newelement = createXmlElement("other");
		$(node)[0].appendChild(newelement);
		this.other_node = $("other",node);
	}
	//-----------------------------------
	this.attributes["username"] = this.username_node;
	this.attributes["firstname"] = this.firstname_node;
	this.attributes["lastname"] = this.lastname_node;
	this.attributes["email"] = this.email_node;
	this.attributes["password"] = this.email_node;
	this.attributes["admin"] = this.admin_node;
	this.attributes["designer"] = this.designer_node;
	this.attributes["active"] = this.active_node;
	this.attributes["substitute"] = this.substitute_node;
	this.attributes["other"] = this.other_node;
	//-----------------------------------
	this.admin = this.admin_node.text()=='1';
	this.creator = this.designer_node.text()=='1' || this.admin_node.text()=='1';
	this.limited = this.other_node.text().indexOf('limited')>-1;
	//-----------------------------------
	//*/
};


/// Display

//==================================
UIFactory["User"].displayActive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("<table id='table_users' class='tablesorter'><thead><th>"+karutaStr[LANG]["firstname"]+"</th><th>"+karutaStr[LANG]["lastname"]+"</th><th>"+karutaStr[LANG]["username"]+"</th><th></th></thead><tbody id='list_users'></tbody></table>");
	$("#temporary").html("<table id='temp_users'></table>");
	$("#list_users").append($("<tr><td></td><td></td><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
	for ( var i = 0; i < UsersActive_list.length; i++) {
		var itemid = destid+"_"+UsersActive_list[i].id;
		var login = UsersActive_list[i].username_node.text();
		if (login.length<80){ //not a temporary user
			$("#list_users").append($("<tr class='item' id='"+itemid+"'></tr>"));
			$("#"+itemid).html(UsersActive_list[i].getView(destid,type,lang));
		} else {
			$('#temporary-users').show();
			$("#temp_users").append($("<tr id='"+itemid+"'></tr>"));
			$("#"+itemid).html(UsersActive_list[i].getView(destid,'temporary',lang));
		}
	}
};

//==================================
UIFactory["User"].displayInactive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("<table id='table_unusers' class='tablesorter'><thead><th>"+karutaStr[LANG]["firstname"]+"</th><th>"+karutaStr[LANG]["lastname"]+"</th><th>"+karutaStr[LANG]["username"]+"</th><th></th></thead><tbody id='list_unusers'></tbody></table>");
	$("#list_unusers").append($("<tr><td></td><td></td><td></td><td></td></tr>")); // to avoid js error: table.config.parsers[c] is undefined
	for ( var i = 0; i < UsersInactive_list.length; i++) {
		$('#inactive-users').show();
		$('#inactive').show();
		var itemid = destid+"_"+UsersInactive_list[i].id;
		$("#list_unusers").append($("<tr class='item' id='"+itemid+"'></tr>"));
		$("#"+itemid).html(UsersInactive_list[i].getView(destid,type,lang));
	}
};

//==================================
UIFactory["User"].prototype.getEmail = function()
//==================================
{
	return this.email_node.text();
}

//==================================
UIFactory["User"].prototype.getView = function(dest,type,lang,gid)
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
		html = "<td style='padding-left:4px;padding-right:4px'>"+this.firstname_node.text() + "</td><td style='padding-left:4px;padding-right:4px'>" + this.lastname_node.text()+ "</td><td style='padding-left:4px;padding-right:4px'> (" + this.username_node.text() + ")</td>";
		if (USER.admin){
			html += "<td><div class='btn-group'>";
			if (gid==null) {
				html += " <button class='btn btn-xs' onclick=\"UIFactory['User'].edit('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' relx='tooltip'>";
				html += "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
				html += "</button>";
				if (this.username_node.text()!='root' && this.username_node.text()!='public' && this.username_node.text()!='sys_public') {
					html += "<button class='btn btn-xs' onclick=\"UIFactory['User'].confirmRemove('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
					html += "<i class='fa fa-trash-o'></i>";
					html += "</button>";
				} else {
					html += "<button class='btn btn-xs' disabled='true'>";
					html += "<i class='fa fa-trash-o'></i>";
					html += "</button>";
				}
			} else {
				html += "<button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].confirmRemove('"+gid+"','"+this.id+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
				html += "<span class='glyphicon glyphicon-remove'></span>";
				html += "</button>";				
			}
			html += "<button class='btn btn-xs' onclick=\"UIFactory['UsersGroup'].editGroupsByUser('"+this.id+"')\"";
			if (this.username_node.text()!='root' && this.username_node.text()!='public') {
				html += ">";
			} else {
				html += " disabled='true'>";
			}
			html += "<i class='fa fa-users fa-lg' ></i>";
			html += "</button>";
			html += "</div></td>";
		}
	}
	if (type=='firstname-lastname') {
		html = this.firstname_node.text() + " " + this.lastname_node.text();
	}
	if (type=='firstname-lastname-username') {
		html = this.firstname_node.text() + " " + this.lastname_node.text()+ " (" + this.username_node.text()+")";
	}
	if (type=='email') {
		html = this.email_node.text();
	}
	if (type=='temporary' && USER.admin) {
		html = "<td style='padding-left:4px;padding-right:4px'>"+this.username_node.text() +"</td>";
		html += "<td><div class='btn-group'>";
		html += "<button class='btn btn-xs' onclick=\"UIFactory['User'].confirmRemove('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-delete"]+"' relx='tooltip'>";
		html += "<i class='fa fa-trash-o'></i>";
		html += "</button>";
		html += "</div></td>";
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
	var url = serverBCK_API+"/users/user/" + userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : data,
		success : function(data) {
			alertHTML(karutaStr[LANG]['saved']);
//			$("#refresh").click();
//			window.location.reload();
			fill_list_users();
		}
	});

};

//==================================================
UIFactory["User"].getAttributeEditor = function(userid,attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control'";
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
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input";
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
	html += "<div class='form-group'>";
	html += "	<label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "	<div class='col-sm-9'>";
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
	html += UIFactory["User"].getAttributeEditor(this.id,"lastname",this.lastname_node.text());
	html += UIFactory["User"].getAttributeEditor(this.id,"firstname",this.firstname_node.text());
	html += UIFactory["User"].getAttributeEditor(this.id,"email",this.email_node.text());
	html +="<hr/>";
	html += UIFactory["User"].getAttributeEditor(this.id,"username",this.username_node.text());
	if (this.id>3){
		html += "<div class='form-group'>";
		html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG]['new_password']+"</label>";
		html += "  <div class='col-sm-9'>";
		html += "    <input class='form-control passwordbyroot' onkeypress=\"this.style.color='transparent'\" type='text' autocomplete='off' value='' onchange=\"javascript:UIFactory['User'].setPassword('"+this.id+"',this.value)\" >";
		html += "  </div>";
		html += "</div>";
	}
	html +="<hr/>";
	if (this.id>3){
		html += UIFactory["User"].getAttributeRadioEditor(this.id,"designer",this.designer_node.text());
		html += UIFactory["User"].getAttributeRadioEditor(this.id,"admin",this.admin_node.text());
		html += UIFactory["User"].getAttributeEditor(this.id,"other",this.other_node.text());
	}
	if (this.id<2 || this.id>3){
		html += UIFactory["User"].getAttributeRadioEditor(this.id,"substitute",this.substitute_node.text());
	}
	if (this.id>3){
		html += UIFactory["User"].getAttributeRadioEditor(this.id,"active",this.active_node.text());
	}
	html += "</form>";
	return html;
};

//==================================================
UIFactory["User"].getAttributeCreator = function(attribute,value,pwd)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control' id='user_"+attribute+"'";
	if (pwd!=null && pwd)
		html += " type='password'";
	else
		html += " type='text'";
	html += " value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["User"].getAttributeRadioCreator = function(attribute,value)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "	<label class='col-sm-3 control-label'>"+karutaStr[LANG][attribute]+"</label>";
	html += "	<div class='col-sm-9'>";
	html += "		<input type='radio' name='user_"+attribute+"'";
	if (value=='1')
		html += " checked='true' ";
	html += "	 value='1' /> oui ";
	html += "		<input type='radio' name='user_"+attribute+"'";
	if (value=='0')
		html += " checked='true' ";
	html += "	 value='0' /> non ";
	html += "	</div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["User"].callCreate = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['User'].create()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_user']);
	$("#edit-window-type").html("");
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getAttributeCreator("lastname","");
	html += UIFactory["User"].getAttributeCreator("firstname","");
	html += UIFactory["User"].getAttributeCreator("email","");
	html +="<hr/>";
	html += UIFactory["User"].getAttributeCreator("username","");
	html += UIFactory["User"].getAttributeCreator("password","",true);
	html +="<hr/>";
	html += UIFactory["User"].getAttributeRadioCreator("designer","0");
	html += UIFactory["User"].getAttributeRadioCreator("admin","0");
	html += UIFactory["User"].getAttributeCreator("other","");
	html += UIFactory["User"].getAttributeRadioCreator("substitute","0");
	html += UIFactory["User"].getAttributeRadioCreator("active","1");
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["User"].prototype.getSelector = function(attr,value,name,checked,disabled)
//==================================
{
	var userid = this.id;
	var firstname = this.firstname_node.text();
	var lastname = this.lastname_node.text();
	var username = this.username_node.text();
	var html = "<input type='checkbox' name='"+name+"' username='"+username+"' value='"+userid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if (disabled)
		html+= " disabled='disabled' ";			
	html += "> "+firstname+" "+lastname+" ("+username+") </input>";
	return html;
};

//==================================
UIFactory["User"].prototype.getRadio = function(attr,value,name,checked,disabled)
//==================================
{
	var userid = this.id;
	var firstname = this.firstname_node.text();
	var lastname = this.lastname_node.text();
	var username = this.username_node.text();
	var html = "<input type='radio' name='"+name+"' username='"+username+"' value='"+userid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if ((userid==1)||disabled)
		html+= " disabled='disabled' ";			
	if (checked)
		html += " checked='true' ";
	html += "> "+firstname+" "+lastname+" ("+username+") </input>";
	return html;
};


//==================================
UIFactory["User"].edit = function(userid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['user']);
	$("#edit-window-type").html("");
	var html = "";
	$("#edit-window-body").html(html);
	//--------------------------
	html = Users_byid[userid].getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["User"].parse = function(data) 
//==================================
{
	Users_byid = {};
	UsersActive_list = [];
	UsersInactive_list = [];
	var items = $("user",data);
	var inactive = active = 0;
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var userid = $(items[i]).attr('id');
		Users_byid[userid] = new UIFactory["User"](items[i]);
		var lastname = Users_byid[userid].lastname;
		if (lastname=="")
			lastname = " ";
		var firstname = Users_byid[userid].firstname;
		if ($("active",$(items[i])).text() == "1") {  // active user
			tableau1[active] = [lastname,firstname,userid];
			active++;
		}
		else { // inactive user
			tableau2[inactive] = [lastname,firstname,userid];
			inactive++;
		}
	}
	var newTableau1 = tableau1.sort(sortOn1_2);
	for (var i=0; i<newTableau1.length; i++){
		UsersActive_list[i] = Users_byid[newTableau1[i][2]];
	}
	var newTableau2 = tableau2.sort(sortOn1);
	for (var i=0; i<newTableau2.length; i++){
		UsersInactive_list[i] = Users_byid[newTableau2[i][2]];
	}
};

//==================================
UIFactory["User"].confirmRemove = function(userid,from_page) 
//==================================
{
	var js_remove = "UIFactory.User.remove('"+userid+"')";
	if (from_page!=null)
		js_remove = "UIFactory.User.remove('"+userid+"','"+from_page+"')";	
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:"+js_remove+";$('#delete-window').modal('hide');\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
};

//==================================
UIFactory["User"].remove = function(userid,from_page) 
//==================================
{
	var url = serverBCK_API+"/users/user/" + userid;
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			if (from_page==null){
				$("#refresh").click();
				fill_list_usersgroups();
			}
			else if (from_page=="UsersGroup"){
				fill_list_users();
				$("#refresh").click();
			}
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
UIFactory["User"].displaySelectMultipleActive2 = function(selectedlist,destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersActive_list.length; i++) {
		var checked = selectedlist.includes(UsersActive_list[i].id);
		if (!checked) {
			var input = UsersActive_list[i].getSelector(null,null,'select_users');
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));			
		}
	}
};

//==================================
UIFactory["User"].displaySelectActive = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < UsersActive_list.length; i++) {
		var input = UsersActive_list[i].getRadio(null,null,destid);
		$("#"+destid).append($(input));
		$("#"+destid).append($("<br>"));
	}
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
	xml +="	<other>"+$("#user_other").val()+"</other>";
	xml +="	<password>"+$("#user_password").val()+"</password>";
	xml +="	<active>"+$("input[name=user_active]:checked").val()+"</active>";
	xml +="	<admin>"+$("input[name=user_admin]:checked").val()+"</admin>";
	xml +="	<designer>"+$("input[name=user_designer]:checked").val()+"</designer>";
	xml +="	<substitute>"+$("input[name=user_substitute]:checked").val()+"</substitute>";
	xml +="</user>";
	xml +="</users>";
	var url = serverBCK_API+"/users";
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : xml,
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
	if (elgg_installed)
		user_register($("#user_firstname").val()+" "+$("#user_lastname").val(), $("#user_email").val(), $("#user_username").val(), $("#user_password").val());
};

//==================================
UIFactory["User"].callCreateTestUser = function()
//==================================
{
	var js1 = "$('#edit-window').modal('hide')";
	var js2 = "UIFactory['User'].createTestUser()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create-test-user']);
	$("#edit-window-type").html("");
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getAttributeCreator("lastname","");
	html += UIFactory["User"].getAttributeCreator("firstname","");
	html +="<hr/>";
	html += UIFactory["User"].getAttributeCreator("username","");
	html += UIFactory["User"].getAttributeCreator("password","",true);
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["User"].createTestUser = function()
//==================================
{

	var xml = "";
	xml +="<?xml version='1.0' encoding='UTF-8'?>";
	xml +="<users>";
	xml +="<user>";
	xml +="	<username>"+$("#user_username").val()+"</username>";
	xml +="	<lastname>"+$("#user_lastname").val()+"</lastname>";
	xml +="	<firstname>"+$("#user_firstname").val()+"</firstname>";
	xml +="	<other>"+$("#user_other").val()+"</other>";
	xml +="	<email>"+USER.email_node.text()+"</email>";
	xml +="	<password>"+$("#user_password").val()+"</password>";
	xml +="	<active>1</active>";
	xml +="	<admin>0</admin>";
	xml +="	<designer>0</designer>";
	xml +="	<substitute>0</substitute>";
	xml +="</user>";
	xml +="</users>";
	var url = serverBCK_API+"/users";
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : xml,
		success : function(data) {
			$("#edit-window").modal('hide');
		},
		error : function(jqxhr,textStatus) {
			if (jqxhr.responseText.indexOf('Existing user or invalid input')>-1)
				alertHTML(karutaStr[LANG]['error-existing-login']);
			else
				alertHTML("Error : "+jqxhr.responseText);
		}
	});
	if (elgg_installed)
		user_register($("#user_firstname").val()+" "+$("#user_lastname").val(), USER.email_node.text(), $("#user_username").val(), $("#user_password").val());
};

//==================================
UIFactory["User"].setPassword = function(userid,value)
//==================================
{
	var username = "";
	if (userid==null) {
		userid = USER.id;
		username = USER.username_node.text();
	} else {
		username = Users_byid[userid].username_node.text();
	}
	var xml = "";
	xml +="<?xml version='1.0' encoding='UTF-8'?>";
	xml +="<user>";
	xml +="	<password>"+value+"</password>";
	xml +="</user>";
	var url = serverBCK_API+"/users/user/" + userid;
	if (elgg_installed)
		user_change_password(value, username);
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : xml,
		success : function(data) {
			alertHTML(karutaStr[LANG]['saved']);
			$('#edit-window').modal('hide');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["User"].changePassword = function(userid,value)
//==================================
{
	var password_old = $("#user_password-old").val();
	var data = "<credential><login>"+USER.username+"</login><password>"+password_old+"</password></credential>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/login",
		data: data,
		success : function(data) {
			//----------------------------
			var value2 = null;
			var username = "";
			if (userid==null) {
				userid = USER.id;
				username = USER.username_node.text();
			} else {
				username = Users_byid[userid].username_node.text();
			}
			if (value==null){
				value = $("#user_password-new").val();
				value2 = $("#user_confirm-password").val();
			}
			if (value2 == null || (value2 != null && value2 == value)) {
				var xml = "";
				xml +="<?xml version='1.0' encoding='UTF-8'?>";
				xml +="<user>";
				xml +="	<prevpass>"+password_old+"</prevpass>";
				xml +="	<password>"+value+"</password>";
				xml +="</user>";
				var url = serverBCK_API+"/users/user/" + userid;
				if (elgg_installed)
					user_change_password(value, username);
				$.ajax({
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					url : url,
					data : xml,
					success : function(data) {
						alertHTML(karutaStr[LANG]['saved']);
						$('#edit-window').modal('hide');
					}
				});
			} else {
				alertHTML(karutaStr[LANG]['password-mismatch']);
				UIFactory["User"].callChangePassword();
			}
			//----------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["User"].callChangePassword = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['User'].changePassword()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Change']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['change_password']);
	$("#edit-window-type").html("");
	var html = "";
	html += "<form id='metadata' class='form-horizontal'>";
	html += UIFactory["User"].getPasswordCreator();
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');

}

//==================================================
UIFactory["User"].getPasswordCreator = function()
//==================================================
{
	var html = "";
	html += UIFactory["User"].getAttributeCreator("password-old","",true);
	html += UIFactory["User"].getAttributeCreator("password-new","",true);
	html += UIFactory["User"].getAttributeCreator("confirm-password","",true);
	return html;
};
