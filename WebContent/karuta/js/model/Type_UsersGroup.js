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

var displayGroup = {};
displayGroup['UsersGroup'] = {};
displayGroup['PortfoliosGroup'] = {};
//---------------------------------
var usersgroups_byid = {};
var usersgroups_list = [];
var bin_UsersGroup_list = [];
var currentDisplayedUsersGroupId = null;
var root_UsersGroup = '0';
var pagegNavbar_list = ["top","bottom"];
var number_of_usersgroups = 0;
var folder_last_drop = "";
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
	this.code_node = $("code",node);
	this.code = this.code_node.text();
	//--------- V2 ---------------------
	this.label = $("label",node).text();
	this.label_nodeV2 = $("label",node);
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
	this.attributes["label"] = this.label_node;
	this.attributes["labelV2"] = this.label_nodeV2;
	//------------------------------
	this.date_modified = $(node).attr('modified');
	this.owner = $(node).attr('owner');
	if ($(node).attr('ownerid')!=undefined)
		this.ownerid = $(node).attr('ownerid');
	else
		this.ownerid = null;
	if ($(node).attr('nb_folders')!=undefined) {
		this.nb_folders = $(node).attr('nb_folders');		
	} else this.nb_folders = 0;
	if ($(node).attr('nb_users')!=undefined) {
		this.nb_users = $(node).attr('nb_users');
	} else this.nb_users = 0;
	this.loadedStruct = false;
	this.folders_list = [];
	this.loadedFolder = false;
	this.pageindex = '1';
	this.chidren_list = {};
	this.display = {};
}


//==================================
UIFactory["UsersGroup"].displayTree = function(dest,folderid,type)
//==================================
{
	var folder_list = [];
//	if (folderid==undefined || folderid==null)
//		folder_list = usersgroups_list;
//	else
		folder_list = usersgroups_byid[folderid].folders_list;
	var html="";
	for (var i = 0; i < folder_list.length; i++) {
		html += folder_list[i].getTreeNodeView(dest,type);
	}
	document.getElementById(dest).innerHTML = html;
//	document.getElementById('nb_folders_'+usersgroups_byid[folderid].id).innerHTML = usersgroups_byid[folderid].nb_folders;
}

//==================================
function dragFolder(ev)
//==================================
{
	ev.dataTransfer.setData("id", ev.target.id.substring(ev.target.id.lastIndexOf('_')+1));
	ev.dataTransfer.setData("type", "folder");
}

//==================================
function allowDropFolder(ev)
//==================================
{
	ev.preventDefault();
}

//==================================
function dropFolder(ev)
//==================================
{
	ev.preventDefault();
	var id = ev.dataTransfer.getData("id");
	var type = ev.dataTransfer.getData("type");
	var folderid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var current_drop = id+"/"+folderid;
	if (current_drop!=folder_last_drop) {
		folder_last_drop = current_drop;
		if (type="folder"&& current_drop!=folder_last_drop) {
			
			alert("moveFolder:"+id+" -> "+folderid);
			UIFactory.UsersGroup.moveFolder(id,folderid);
		}
		if (type="user") {
			alert("USER moveto:"+id+" -> "+folderid);
			UIFactory.UsersGroup.moveUser(folderid,id);
		}
	}

}

//==================================
UIFactory["UsersGroup"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var html = "";
	if (type=='list') {
		html += "<div id='"+this.id+"' class='treeNode UsersGroup'>";
		html += "	<div id='UsersGroup_"+this.id+"' class='row-label folder-row'  draggable='true' ondragstart='dragFolder(event)' ondrop='dropFolder(event)' ondragover='allowDropFolder(event)'>";
		if (this.nb_folders>0){
			html += "		<span id='toggle_UsersGroup_"+this.id+"' class='closeSign";
			html += " toggledNode";
			html += "' onclick=\"UIFactory.UsersGroup.loadAndDisplayStruct('collapse_UsersGroup_"+this.id+"','"+this.id+"');\"></span>";
		} else {
			html += "<span class='no-toggledNode'>&nbsp;</span>"
		}
		html += "		<span id='treenode-UsersGrouplabel_"+this.id+"' onclick=\"UIFactory.UsersGroup.loadAndDisplayContent('group-users','"+this.id+"','"+type+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='nb_folders_"+this.id+"'>"+this.nb_folders+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='number_of_UsersGroup_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_UsersGroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- class='UsersGroup'-->";
	}
	if (type=='select1' || type=='select') {
		var html = "<input name='"+name+"' value='"+gid+"' type=";
		if (type=='select')
			html += "'checkbox'";
		else
			html += "'radio'";
		if (attr!=null && value!=null)
			html += " "+attr+"='"+value+"'";
		html += "> "+label+" </input>";
		html += "<div id='select-UsersGroup_"+this.id+"' class='treeNode select-folder'>";
		html += "	<div class='row-label'>";
		html += "		<span id='toggle_select-UsersGroup_"+this.id+"' class='closeSign";
		if (this.nb_folders>0){
			html += " toggledNode";
		}
		html += "' onclick=\"UIFactory.UsersGroup.loadAndDisplayStruct('collapse_select-UsersGroup_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-UsersGrouplabel_"+this.id+"' onclick=\"UIFactory.UsersGroup.loadAndDisplayContent('select-folder-users','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='select-number_of_usersgroups"+this.id+"'>"+this.nb_folders+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='select-number_of_UsersGroup_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_select-UsersGroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- id='select-UsersGroup_...'-->";
	}
	return html;
}

//==================================
UIFactory["UsersGroup"].displayFolderContentHeader = function(dest,id,langcode)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	//---------------------	
	$("#"+dest).show();
	localStorage.setItem('currentDisplayedUsersGroup',id);
	$("#"+dest).html("");
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	var UsersGroup = usersgroups_byid[id];
	//---------------------
	var html = "";

	var folder_label = UsersGroup.label_node[langcode].text();
	if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
		folder_label = '- no label in '+languages[langcode]+' -';
	html += "<div id='content-UsersGroup_"+UsersGroup.id+"' class='usersgroup-header'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-10 folder-label' id='UsersGrouplabel_"+UsersGroup.id+"' >"+folder_label+"</div>";
	html += "		<div class='col-1'>";
	//------------------------ menu-burger
	if (UsersGroup.code!="#system-user#" && (USER.admin || (USER.creator && !USER.limited) )) {
		html += "			<div class='dropdown folder-menu'>";
		html += "				<button  class='btn dropdown-toggle' data-toggle='dropdown'></button>";
		html += "				<ul class='dropdown-menu dropdown-menu-right' role='menu'>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['UsesFolder'].callCreate();\" >"+karutaStr[LANG]['create_usergroup']+"</a>";
		html += "				</ul>";
		html += "			</div>";
	}
	//------------------------end menu-burger
	html += "		</div><!-- class='col-1' -->";
	html += "	</div><!-- class='row' -->";
	html += "</div><!-- class='UsersGroup'-->";
	//----------------------
//	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
//	html += "</div><!-- class='navbar-pages'-->";
	// ----------------------
	html += "<div id='group-users-pages' class='UsersGroup-pages'>";
	html += "</div><!-- class='UsersGroup-pages'-->";
	// ----------------------
	html += "<div id='group-navbar-pages' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
}

//==================================
UIFactory["UsersGroup"].prototype.displayFolderContentPage = function(dest,type,langcode)
//==================================
{
	$("#"+dest).html("");
	if (langcode==null)
		langcode = LANGCODE;
	if (type==undefined || type==null)
		type = 'list';
	var html = "";

	var list = this.folders_list;
	if (list!=undefined) {
		for (var i=0; i<list.length;i++){
			var item = list[i];
			var destid = dest+"_item-UsersGroup_"+item.id;
			html += "<div class='row item item-folder' id='"+destid+"'>";
			html += item.getView(destid+item.id,type,langcode);
			html += "</div>";
		}
	}
	var list = this.chidren_list[this.pageindex];
	if (list!=undefined) {
	for (var i=0; i<list.length;i++){
			var item = list[i]['obj'];
			var destid = dest+"_item-user_"+item.id;
			html += "<div class='row item item-user' id='"+destid+"' draggable='true' ondragstart='dragUser(event)'>";
			html += item.getView(destid,'list3',langcode);
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_users)/g_configVar['maxuserlist']);
	if (nb_index>1) {
		UIFactory.UsersGroup.displayPagesNavbar(dest,nb_index,this.id,parseInt(this.pageindex));
		$("#group-navbar-pages").show();
	} else {
		$("#group-navbar-pages").hide();
	}
	$(window).scrollTop(0);
}

//==================================
UIFactory["UsersGroup"].prototype.getView = function(dest,type,langcode)
//==================================
{
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var owner = (Users_byid[this.ownerid]==null) ? "":Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	var tree_type='<span class="fa fa-folder" aria-hidden="true"></span>';
	var html = "";
	if (type=='list') {
		html += "<div class='folder-label col-8' title=\""+this.code+"\" class='folder-label' >"+folder_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-3'><span class='UsersGroup-code' >"+this.code+"</span></div>";
		}
	}
	if (type=='select') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_folders',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='UsersGroup-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
		}
	}
	return html;
}

//======================
UIFactory["UsersGroup"].getAdminMenu = function(self,list)
//======================
{	
	var html = "";
	html += "<div class='dropdown folder-menu'>";
	if (USER.admin) {
		html += "	<button id='dropdown-UsersGroup"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown-UsersGroup"+self.id+"'>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory.UsersGroup.callRename('"+self.id+"',null,"+list+")\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].callMove('"+self.id+"')\" ><i class='button fas fa-random'></i> "+karutaStr[LANG]['move']+"</a>";
		html += "		<a class='dropdown-item' id='remove-"+self.id+"' style='display:block' onclick=\"UIFactory['UsersGroup'].remove('"+self.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "	</div>";
	} else {
		html += "	<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";		
	}
	html += "			</div><!-- class='btn-group' -->";
	return html;
}

//==================================
UIFactory["UsersGroup"].prototype.getSelector = function(attr,value,name,checkbox)
//==================================
{
	var gid = this.id;
	var label = this.label_node.text();
	var html = "<input name='"+name+"' value='"+gid+"' type=";
	if (checkbox)
		html += "'checkbox'";
	else
		html += "'radio'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	html += "> "+label+" </input>";
	return html;
};

//==================================
UIFactory["UsersGroup"].moveFolder = function(folderid,newparentid) 
//==================================
{
	var url = serverBCK_API+"/folder/UsersGroup/" + folderid + "?newparentid="+newparentid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory["UsersGroup"].displayAll('usersgroups','list');
			UIFactory["UsersGroup"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in moveFolder : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersGroup"].moveUser = function(folderid,userid) 
//==================================
{
	var url = serverBCK_API+"/folder/UsersGroup/" + folderid + "?adduser="+userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory.UsersGroup.loadAndDisplayStruct('usergroups_active','active',true);  // active users
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in moveUser : "+jqxhr.responseText);
		}
	});
};



//==================================
UIFactory["UsersGroup"].callRename = function(id,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = usersgroups_byid[id];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((self.owner=='Y' && !USER.xlimited) || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+id+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+id+"' type='text' class='form-control' name='input_code' value=\""+self.code+"\">");
		$(htmlCodeInputObj).change(function (){
			UIFactory["UsersGroup"].rename(self,langcode,list);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((self.owner=='Y') || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			UIFactory["UsersGroup"].rename(self,langcode,list);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	$("#code_help").popover({ 
	    placement : 'right',
	    container : 'body',
	    title:karutaStr[LANG]['help-label'],
	    html : true,
	    trigger:'click hover',
	    content: karutaStr[LANG]['help_text_rename']
	});

	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].rename = function(itself,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var code = $.trim($("#code_"+itself.id).val());
	$(itself.code_node).text(code);
	itself.code = code;
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	$(itself.label_node[langcode]).text(label);
	var xml = "";
	xml +="<UsersGroup><code>"+code+"</code>";
	for (var i=0; i<languages.length;i++){
		xml +="<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
	}
	xml +="</UsersGroup>";
	strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
	var callback = function () {
		$("#treenode-UsersGrouplabel_"+itself.id).html($(label));
		if (list)
			$("#item-UsersGroup_"+itself.id).html($(itself.getView('item-UsersGroup_'+itself.id,'list')));
		else {
			$("#UsersGrouplabel_"+itself.id).html($(label));
		}
	};
	UICom.query("PUT",serverBCK_API+'/folder/UsersGroup/'+itself.id+'',callback,"text",strippeddata);
};


//==================================
UIFactory["UsersGroup"].prototype.update = function(node)
//==================================
{
	var current_node = this.node;
	if ($("code",node)!=undefined){
		this.code_node = $("code",node);
		this.code = $(this.code_node).text();
//		$("code",current_node).replaceWith( $("code",node));
		$("code",current_node).text( $("code",node));
	}
	if ($(node).attr('modified')!=undefined) {
		this.date_modified = $(node).attr('modified');
		$("code",current_node).replaceWith( $("code",node));
	}
	//------------------------------
	for (var i=0; i<languages.length;i++){
		if ($("label[lang='"+languages[i]+"']",node)!=undefined){
			this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
			if (this.label_node[i].length==0) {
				var newElement = createXmlElement("label");
				$(newElement).attr('lang', languages[i]);
				$(newElement).text(karutaStr[languages[languages[i]],'new']);
				$(node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
			}			
			$("label[lang='"+languages[i]+"']",current_node).text(this.label_node[i].text());
		}
	}
	this.node = current_node;
}


//==================================
UIFactory["UsersGroup"].callCreateFolder = function(parentid)
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_folder']);
	$("#edit-window-footer").html("");
	var js1 = "$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#code").val();
		var label = $("#label").val();
		if (code!='' && label!='') {
			UIFactory.UsersGroup.createFolder(parentid,code,label);
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
	html += "		<label for='code' class='col-sm-3 control-label'>Code</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='code' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='label' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='label' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].createFolder = function(parentid,code,label)
//==================================
{
	if (code!='' && label!='') {
		var url = serverBCK_API+"/folder/usersgroups/"+parentid;
		var data = "<UsersGroup><code>"+code+"</code><label lang='fr'>"+label+"</label><label lang='en'>"+label+"</label></UsersGroup>";
		$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "xml/text",
			url : url,
			data : data,
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
	} else {
		if (code=='')
			alertHTML(karutaStr[LANG]['code-not-null']);
		if (label=='')
			alertHTML(karutaStr[LANG]['label-not-null']);
	}
};

//==================================
UIFactory["UsersGroup"].del = function(id) 
//==================================
{
	var url = serverBCK_API+"/folder/UsersGroup/" + id;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			var pos_item = 0;
			for (var i=0;i<bin_UsersGroup_list.length;i++){
				if (bin_UsersGroup_list[i]!=null && bin_UsersGroup_list[i].id==id) {
					bin_UsersGroup_list[i] = null;
					pos_item = i;
					break;
				}
			}
			var new_length = bin_UsersGroup_list.length-1;
			for (var i=pos_item;i<new_length;i++){
				bin_UsersGroup_list[i] = bin_UsersGroup_list[i+1];
			}
			if ($("#bin").length>0) { // not a batch call
				UIFactory["UsersGroup"].displayBin('bin','bin');
				$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersGroup"].parse = function(data) 
//==================================
{
	usersgroups_byid = {};
	usersgroups_list = [];		
	var items = $("UsersGroup",data);
	if (items.length==0) // -- V2--
		items = $("group",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		usersgroups_byid[id] = new UIFactory["UsersGroup"](items[i]);
		var code = usersgroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usersgroups_list[i] = usersgroups_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["UsersGroup"].parseStructure = function(data,parentid) 
//==================================
{
	var items = $("UsersGroup",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (usersgroups_byid[id]==undefined){
			usersgroups_byid[id] = new UIFactory["UsersGroup"](items[i]);
		} else
			usersgroups_byid[id].update(items[i]);			
		var code = usersgroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (usersgroups_byid[parentid]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			usersgroups_byid[parentid].folders_list[i] = usersgroups_byid[newTableau1[i][1]]
		}
		usersgroups_byid[parentid].loadedStruct = true;
		usersgroups_byid[parentid].nb_folders = usersgroups_byid[parentid].folders_list.length;
	}
};

//==================================
UIFactory["UsersGroup"].parseChildren = function(data,parentid) 
//==================================
{
	var children = $(data).children();

	var list = [];
	for( var i=0; i<children.length; ++i ) {
		var child = children[i];
		var tagname = $(child)[0].tagName;
		if("UsersGroup"==tagname || "USER"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("UsersGroup"==tagname) {
				if (usersgroups_byid[id]==undefined)
					usersgroups_byid[id] = new UIFactory["UsersGroup"](child);
				else usersgroups_byid[id].update(child);
				list[i]['obj'] = usersgroups_byid[id];
			} else {
				if (Users_byid[id]==undefined)
					Users_byid[id] = new UIFactory["User"](child);
				//else Users_byid[id].update(child);
				list[i]['obj'] = Users_byid[id];
			}
		}
	}
	usersgroups_byid[parentid].chidren_list[usersgroups_byid[parentid].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
UIFactory.UsersGroup.loadAndDisplayStruct = function(dest,folderid,reload,type)
//==================================
 {
	$("#wait-window").show();
	if (type==null)
		type= 'list1';
	if (reload==null)
		reload = false;
	if (folderid!="grouproot")
		toggleElt('closeSign','openSign','UsersGroup_'+folderid);
	if (!usersgroups_byid[folderid].loadedStruct || reload) {
		UIFactory.UsersGroup.loadStruct(dest,folderid);
		UIFactory.UsersGroup.displayTree(dest,folderid,type);
	}
	else {
		UIFactory.UsersGroup.displayTree(dest,folderid,type);
	}
	$("#wait-window").hide();
}

//==============================
UIFactory.UsersGroup.loadStruct = function (dest,id)
//==============================
{
	/*
	$.ajax({
		id : id,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folder/UsersGroup/"+id+"?type=structure",
		success : function(data) {
			UIFactory.UsersGroup.parseStructure(data,id);
		},
		error : function(jqxhr,textStatus) {
		}
	});
	 */
	//-------- Simulation ---------
	if (id=="grouproot") { //root folder
		var data = "<usersgroups id='active' nb_folders='3' nb_users='0'>"
			+"<usersgroup id='1' nb_folders='0' nb_users='3' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>Enseignants</label><label lang='fr'>Enseignants</label></usersgroup>"
			+"<usersgroup id='2' nb_folders='1' nb_users='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Étudiants</label><label lang='fr'>Étudiants</label></usersgroup>"
			+"</userfolders>";
		
	}
	if (id=="2") { 
		var data = "<usersgroups id='2' nb_folders='3' nb_users='0'>"
			+"<UsersGroup id='2.1' nb_folders='0' nb_users='7' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>2020</label><label lang='fr'>Cohorte 2020</label></UsersGroup>"
			+"</userfolders>";
		
	}
	UIFactory.UsersGroup.parseStructure(data,id);
}

//==================================
UIFactory.UsersGroup.loadAndDisplayContent = function (dest,folderid) {
//==================================
	$("#wait-window").show();
	//---------------------
	if (folderid=="0" && usersgroups_byid[folderid]==undefined) {
		$("#folder-users").html("<div id='folder-users-active'></div>");
		fill_list_usersOLD();
	} else if (folderid=="1" && usersgroups_byid[folderid]==undefined) {
		$("#folder-users").html("<div id='folder-users-inactive'></div>");
		fill_list_usersOLD();
	} else {
		//--------Folders------------------
		if (usersgroups_byid[folderid].nb_folders > 0){
			UIFactory.UsersGroup.loadAndDisplayStruct('collapse_UsersGroup_'+folderid,folderid)
		}
		toggleOpenElt('closeSign','openSign','UsersGroup_'+folderid);
		UIFactory.UsersGroup.displayFolderContentHeader(dest,folderid);
		selectElt('UsersGroup','UsersGroup_'+folderid);
		//--------Portfolios-------------------
		var dest_page = dest + '-pages';
		var list = usersgroups_byid[folderid].chidren_list[usersgroups_byid[folderid].pageindex];
		if (list==undefined||list==null){
			UIFactory.UsersGroup.loadContent(dest_page,folderid);
			usersgroups_byid[folderid].displayFolderContentPage(dest_page,'list');
		}
		else {
			usersgroups_byid[folderid].displayFolderContentPage(dest_page,'list');
		}
		//-------------------------------
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
UIFactory.UsersGroup.loadAndDisplayContentPage = function (dest,folderid,type,pageindex) {
//==================================
	$("#wait-window").show();
	usersgroups_byid[folderid].pageindex = ""+pageindex;
	var list = usersgroups_byid[folderid].chidren_list[usersgroups_byid[folderid].pageindex];
	if (list==undefined||list==null) {
		UIFactory.UsersGroup.loadContent(dest,folderid);
		usersgroups_byid[folderid].displayFolderContentPage(dest,type);
	} else {
		usersgroups_byid[folderid].displayFolderContentPage(dest,type);
	}
	$("#wait-window").hide();
}

//==============================
UIFactory.UsersGroup.loadContent = function (dest,folderid)
//==============================
{
	var pageindex = usersgroups_byid[folderid].pageindex;
	/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folder/UsersGroup/"+id+"?type=children&r="+pageindex+"&limit="+g_configVar['maxuserlist'],
		success : function(data) {
			UIFactory.UsersGroup.parseChildren(data,id); 
			usersgroups_byid[id].displayFolderContentPage(dest,type,langcode,index_class);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	
	 */
	//---------Simulation---------------
	var data = "";
	if (folderid=='1' && pageindex==1) {
		data =  "<usersgroup id='1' nb_folders='0' nb_users='3'>";
		data += "<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "</usersgroup>";
	}
	if (folderid=='2' && pageindex==1) {
		data =  "<usersgroup id='1' nb_folders='1' nb_users='0'>";
		data += "</usersgroup>";
	}
	if (folderid=='2.1') {
		if (pageindex==1) {
		data =  "<usersgroup id='2.1' nb_folders='0' nb_users='7'>";
		data += "<user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "</UsersGroup>";
		}
		if (pageindex==2) {
			data =  "<usersgroup id='2.1' nb_folders='0' nb_users='7'>";
			data += "<user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "</UsersGroup>";
		}
	}
	UIFactory.UsersGroup.parseChildren(data,folderid);
}

/*=======================================*/
/*========		À DÉPLACER		=========*/
/*=======================================*/

//*** à déplacer dans karuta.js
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


//*** à déplacer pour remplacer dans users.js

//==============================
function getUsersList2()
//==============================
{
	var html = "";
//	var text0 = karutaStr[LANG]['users-folders'];
	var text0 = karutaStr[LANG]['folders'];
	var text1 = karutaStr[LANG]['users-in-rootfolder'];
	html += "<div id='gutter'></div>";
	html += "<div id='userslist-rightside'>";
	//-----------------------------------------------------------
		html += "<div id='folder-users'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-rightside'-->";

	html += "<div id='userslist-leftside'>";
	//--------------------FOLDERS---------------------------------------
	html += "<h3><i class='far fa-address-book fa-lg' ></i><span id='usersgroups-label'>"+text0+"</span>&nbsp<span class='folders-nb badge' id='usersgroups-nb'></span>";
	html +="	<button class='btn list-btn' onclick='UIFactory.UsersGroup.createFolder()'>"+karutaStr[LANG]['create_folder']+"</button>";
	html += "</h3>";
	html += "<div id='usersgroups' class='tree user'></div>";

	//--------------------USERS--------------------------------------
	html += "<h3 id='users-in-rootfolder'>";
	html += "	<span id='users-label'>"+text1+"</span>&nbsp<span class='users-nb badge' id='users-nb'></span>";
	html += "	<button class='btn list-btn' onclick=\"UIFactory.UsersGroup.loadAndDisplayContent('folder-users','0');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see"] + "</button>";
	html += "</h3>";

	if (USER.admin) {
		//---------------------BIN-------------------------------------
		var text2 = karutaStr[LANG]['bin']+" - "+karutaStr[LANG]['inactive_users'];
		html += "<h3 id='bin-usersgroups-label'>"+text2+"&nbsp<span class='bin-nb badge' id='bin-usersgroups-nb'></span>";
		html += "<button class='btn list-btn' onclick=\"UIFactory.UsersGroup.displayBin('folder-users','bin');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see-bin"] + "</button>";
		html += "</h3>";
	}
	//-----------------------------------------------------------
	var text3 = karutaStr[LANG]['temporary_users'];
	html += "	<h3 id='temporary-users' style='display:none'>"+text3;
	html += "		&nbsp<button class='btn list-btn' onclick=\"confirmDelTemporaryUsers()\">";
	html += 		karutaStr[LANG]["delete-temporary-users"];
	html += "		</button>";
	html += "	</h3>";
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-leftside'-->";
	return html;
}



//==============================
function initusersgroups()
//==============================
{
	var data = "<UsersGroup id='grouproot' nb_folder='0' nb_user='0' owner='Y'  ownerid='1'><code>1</code><label lang='en'>"+karutaStr['en']['list_usersgroups']+"</label><label lang='fr'>"+karutaStr['fr']['list_usersgroups']+"</label></UsersGroup>";
	usersgroups_byid['grouproot'] = new UIFactory["UsersGroup"](data);
}


//==================================
UIFactory.UsersGroup.displayPagesNavbar = function (dest,nb_index,folderid,pageindex)
//==================================
{
	var html = "";
	for (var i=1;i<=nb_index;i++) {
		html += "<span class='badge";
		if (i==pageindex)
			html += " active";
		html += "' onclick=\"UIFactory.UsersGroup.loadAndDisplayContentPage('"+dest+"','"+folderid+"','list','"+i+"')\">"+i+"</span>";
	}
	$("#group-navbar-pages").html(html);
	
	/* javascript:loadAndDisplayUsersGroupContentPage('folder-users-pages','list','2.1',0,2,'1');
	var html = [];
	for (var i=0;i<pagegNavbar_list.length;i++) {
		html[i] = "";
		$("#"+index_class+pagegNavbar_list[i]).html($(""));
	}
	var min_prev = Math.max((pageindex-nbPagesIndexStep), 1);
	var max_next = Math.min((pageindex+nbPagesIndexStep), nb_index);
	var str1, srt2;
	if (1 < min_prev) {
		str1 = "<span class='"+index_class+" badge' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+(pageindex-1)+",'"+index_class+"');\" id='"+index_class+i+"_";
		str2 = "'>"+karutaStr[LANG]["prev"]+"</span><span class='"+index_class+"0'>...</span>";
		for (var j=0;j<pagegNavbar_list.length;j++) {
			html[j] += str1+pagegNavbar_list[j]+str2;
		}
	}
	for (var i=min_prev;i<=max_next;i++) {
		str1 = "<span class='"+index_class+" badge' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+i+",'"+index_class+"');\" id='"+index_class+i+"_";
		str2 = "'>"+i+"</span>";
		for (var j=0;j<pagegNavbar_list.length;j++) {
			html[j] += str1+pagegNavbar_list[j]+str2;
		}
	}
	if (max_next < nb_index) {
		str1 = "<span class='"+index_class+"0 badge'>...</span><span class='"+index_class+"' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+(pageindex+1)+",'"+index_class+"');\" id='"+index_class+i+"_";
		str2 = "'>"+karutaStr[LANG]["next"]+"</span>";
		for (var j=0;j<pagegNavbar_list.length;j++) {
			html[j] += str1+pagegNavbar_list[j]+str2;
		}
	}
	for (var i=0;i<pagegNavbar_list.length;i++) {
		$("#"+index_class+pagegNavbar_list[i]).html($(html[i]));
	}
	var selected_list = [];
	for (var i=0;i<pagegNavbar_list.length;i++) {
		selected_list[i] = index_class+pageindex+"_"+pagegNavbar_list[i];
	}
	selectElts(index_class,selected_list);
	*/
}

//==================================
UIFactory["UsersGroup"].displaySelectMultiple = function(dest)
//==================================
{
	initusersgroups();
	UIFactory.UsersGroup.loadAndDisplayStruct(dest,'grouproot');
};

//=====================================================================================================
//=====================================================================================================
//=====================================================================================================
//============================== BACKEND V2 ===========================================================
//=====================================================================================================
//=====================================================================================================
//=====================================================================================================

//==================================
function dragUserGroup(ev)
//==================================
{
	ev.dataTransfer.setData("id", ev.target.id.substring(ev.target.id.lastIndexOf('_')+1));
	ev.dataTransfer.setData("type", "usergroup");
}

//==================================
function allowDropUserGroup(ev)
//==================================
{
	ev.preventDefault();
}

//==================================
function dropUserGroup(ev)
//==================================
{
	ev.preventDefault();
	var id = ev.dataTransfer.getData("id");
	var type = ev.dataTransfer.getData("type");
	var groupid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var current_drop = id+"/"+groupid;
	if (current_drop!=usergroup_last_drop) {
		usergroup_last_drop = current_drop;
			alert("addUserGroup:"+id+" -> "+groupid);
			UIFactory.UsersGroup.addUser(groupid,id)
	}

}
//==================================
UIFactory["UsersGroup"].parseV2 = function(data) 
//==================================
{
	usersgroups_byid = {};
	usersgroups_list = [];
	var items = $("group",data);
	var tableau1 = new Array();
	for ( var i = 0; i < items.length; i++) {
		var gid = $(items[i]).attr('id');
		usersgroups_byid[gid] = new UIFactory["UsersGroup"](items[i]);
		var label = usersgroups_byid[gid].label;
		tableau1[i] = [label,gid];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usersgroups_list[i] = usersgroups_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["UsersGroup"].displayGroups = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	if (type=='list1') {
		for ( var i = 0; i < usersgroups_list.length; i++) {
			var groupid = usersgroups_list[i].id;
			var itemid = "usersgroup_"+groupid;
			var html = "";
			html += "<div id='"+itemid+"' class='usersgroup'></div><!-- class='usersgroup'-->";
			$("#"+destid).append($(html));
			usersgroups_list[i].displayView(itemid,type,lang);
			if (localStorage.getItem('currentDisplayedUserGroup')==groupid) {
				UIFactory.UsersGroup.displayUsersGroup(groupid,'group-users','list-usergroup',lang);
			}
		}
	}
	if (type=='list') {
		var group_type = "UsersGroup";
		for ( var i = 0; i < usersgroups_list.length; i++) {
			var gid = usersgroups_list[i].id;
			displayGroup[group_type][gid] = localStorage.getItem('dg_'+group_type+"-"+gid);
//			displayGroup[group_type][gid] = Cookies.get('dg_'+group_type+"-"+gid);
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
	if (type=='list-header') {
		html += "	<div class='usersgroup-header'>";
		html += "		<span class='usersgroup-label'>"+this.label+"</span>";
		//------------ buttons ---------------
		if (USER.admin) {
			html += "			<button data-toggle='dropdown' class='btn dropdown-toggle' aria-expanded='false' style='float:right'></button>";
			html += "			<div class='dropdown-menu  dropdown-menu-right'>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].edit('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].confirmRemove('"+this.id+"',null)\" ><i class='fa fa-times'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].callAddUsers('"+this.id+"')\" ><i class='fa fa-user-plus'></i> "+karutaStr[LANG]["add_users"]+"</a>";
			html += "			</div>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "			<button data-toggle='dropdown' class='btn dropdown-toggle' aria-expanded='false' style='visibility:hidden'></button>";
		}
		//---------------------------------------
	}
	if (type=='list1') {
		displayGroup[group_type][this.id] = localStorage.getItem('dg_'+group_type+"-"+this.id);
		html += "	<div class='usersgroup-label' onclick=\"UIFactory.UsersGroup.displayUsersGroup('"+this.id+"','group-users','list-usergroup','"+lang+"')\" >";
		html += 	this.label;
		html += "	</div>";
	}
	$("#"+dest).html(html);
};

//==================================
UIFactory["UsersGroup"].displayUsersGroup = function(gid,destid,type,lang)
//==================================
{
	localStorage.setItem('currentDisplayedUserGroup',gid);
	selectElt('usersgroup','usersgroup_'+gid);
	var html = "";
	html += "<div id='group-users-header_"+gid+"'></div>";
	html += "<div id='group-users-content_"+gid+"' ondrop='dropUserGroup(event)' ondragover='allowDropUserGroup(event)'></div>";
	$("#"+destid).html(html);
	//--------------------------
	usersgroups_byid[gid].displayView('group-users-header_'+gid,'list-header',lang);
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+gid,
		data: "",
		success : function(data) {
			var users_ids = parseList("user",data);
			for ( var i = 0; i < users_ids.length; i++) {
				var destid = "item-user_"+users_ids[i];
				html += "<div class='row item item-user' id='"+destid+"'>";
				html += Users_byid[users_ids[i]].getView(destid,type,lang,gid);
				html += "</div>";
			}
			$("#group-users-content_"+gid).html(html);
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
	$.ajaxSetup({async: true});
};

//==================================
UIFactory["UsersGroup"].editGroupsByUser = function(userid)
//==================================
{
	var nameinput = "user_"+userid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_page('"+nameinput+"','fill_list_usersgroups');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['list_groups']);
	var html = "<input type='hidden' name='"+nameinput+"' id='"+nameinput+"' value='0'>";
	html += "<div id='user_list_groups'>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$('#edit-window').modal('show');

	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?user="+userid,
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
UIFactory["UsersGroup"].displayManageMultipleGroups = function(destid,attr,value,selectedlist,callFunction) 
//==================================
{
	$("#"+destid).html("");
	if (usersgroups_list.length>0){
		for ( var i = 0; i < usersgroups_list.length; i++) {
			var checked = selectedlist.includes(usersgroups_list[i].id);
			var input = usersgroups_list[i].getSelectorWithFunction(attr,value,'select_usersgroups_'+i,checked,callFunction);
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

//==================================
UIFactory["UsersGroup"].callAddUsers = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['UsersGroup'].addUsers('"+gid+"');$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['add_users']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['select_users']);
	var html = "";
	html += "<div id='adding_users' class='div_scroll'>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+gid,
		data: "",
		success : function(data) {
			var users = parseList("user",data);
			if (!($("#main-user").length && $("#main-user").html()!="")) {
				fill_list_users();
			}
			UIFactory["User"].displaySelectMultipleActive2(users,'adding_users');
			//----------------
		}
	});
	$.ajaxSetup({async: true});
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].addUser = function(gid,userid)
//==================================
{
	var url = serverBCK_API+"/usersgroups?group=" + gid + "&user="+userid;
	$.ajax({
		type : 'PUT',
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			display_list_usersgroups();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersGroup"].addUsers = function(gid)
//==================================
{
	var users = $("input[name='select_users']").filter(':checked');
	var url = serverBCK_API+"/usersgroups?group=" + gid + "&user=";
	for (var i=0; i<users.length; i++){
		var userid = $(users[i]).attr('value');
		var url2 = url+userid;
		$.ajax({
			type : 'PUT',
			dataType : "text",
			url : url2,
			data : "",
			success : function(data) {
				display_list_usersgroups();
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
	}
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
	html = usersgroups_byid[gid].getEditor();
	$("#edit-window-body").append(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersGroup"].prototype.getEditor = function(type,lang)
//==================================
{
	var html = "";
	html += "<form id='usersgroup' class='form-horizontal'>";
	html += UIFactory["UsersGroup"].getAttributeEditor(this.id,"label",this.label_nodeV2.text());
	html += "</form>";
	return html;
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
	html += " onchange=\"javascript:UIFactory['UsersGroup'].update('"+gid+"','labelV2',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================
UIFactory["UsersGroup"].update = function(gid,attribute,value)
//==================================
{
	usersgroups_byid[gid].attributes[attribute].text(value); // update attribute value
	var node = usersgroups_byid[gid].node;
	var data = xml2string(node);
	var url = serverBCK_API+"/usersgroups?group=" + gid +"&label="+value;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$("#refresh").click();
		}
	});

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
	var url = serverBCK_API+"/usersgroups?group=" + gid;
	if (uid!=null && uid!='null') {
		url += "&user="+uid;
	}
	$.ajax({
		type : "DELETE",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			display_list_usersgroups();
		}
	});
};

//==================================
UIFactory["UsersGroup"].callCreate = function()
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['UsersGroup'].create()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Create']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_usersgroup']);
	var html = "";
	html += "<form id='usersgroup' class='form-horizontal'>";
	html += UIFactory["UsersGroup"].getAttributeCreator("label","");
	html += "</form>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
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
UIFactory["UsersGroup"].create = function()
//==================================
{
	var label = $("#usersgroup_label").val();
	var url = serverBCK_API+"/usersgroups?label="+label;
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
UIFactory["UsersGroup"].displaySelectMultipleWithUsersList = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < usersgroups_list.length; i++) {
		var gid = usersgroups_list[i].id;
		var label = usersgroups_list[i].label_nodeV2.text();
		var html = "<input type='checkbox' name='select_usersgroups' value='"+gid+"'";
		html += " onchange=\"javascript:UIFactory['UsersGroup'].toggleUsersList('"+gid+"','"+destid+"-group-"+gid+"', this.checked)\" ";
		html += "> "+label+" </input>";
		html += "<br/><div class='usersgroup-users' id='"+destid+"-group-"+gid+"' style='display:none'></div>";
		$("#"+destid).append($(html));
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
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups?group="+gid,
			data: "",
			success : function(data) {
				$("#"+destid).html("");
				var users_ids = parseList("user",data);
				for ( var i = 0; i < users_ids.length; i++) {
					if (Users_byid[users_ids[i]]!=null && Users_byid[users_ids[i]]!=undefined) {
						var itemid = destid+"_"+users_ids[i];
						if (Users_byid[users_ids[i]].active_node.text()=='1') {
							$("#"+destid).append($("<div class='item' id='"+itemid+"'></div>"));
						} else
							$("#"+destid).append($("<div class='item inactive' id='"+itemid+"'></div>"));
//						html = "<div>"+Users_byid[users_ids[i]].getView(null,"firstname-lastname-username")+"</div>";
						html = "<div>"+Users_byid[users_ids[i]].getSelector(null,null,"users-in-group",true,true)+"</div>";
						$("#"+itemid).html(html);
					}
				}
				var items = $("div[class='item']",$("#"+destid));
				if (items.length==0)
					$("#"+destid).html("<h5>"+karutaStr[LANG]['empty-group']+"</h5>");
				//----------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});		
	} else {
		$("#"+destid).html("");
		$("#"+destid).hide();
	}
};

//==================================
UIFactory["UsersGroup"].hideUsersList = function(destid)
//==================================
{
	for ( var i = 0; i < usersgroups_list.length; i++) {
		var gid = usersgroups_list[i].id;
		$("#"+destid+gid).html("");
	}
};
