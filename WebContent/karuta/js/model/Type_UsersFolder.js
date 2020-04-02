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
	
var usersfolders_byid = {};
var usersfolders_list = [];
var bin_usersfolder_list = [];
var currentDisplayedUsersFolderId = null;
var root_usersfolder = '0';
var pagegNavbar_list = ["top","bottom"];
var number_of_usersfolders = 0;
var folder_last_drop = "";
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

/// Define our type
//==================================
UIFactory["UsersFolder"] = function(node)
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.code_node = $("code",node);
	this.code = this.code_node.text();
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
UIFactory["UsersFolder"].displayTree = function(dest,folderid,type)
//==================================
{
	var folder_list = [];
//	if (folderid==undefined || folderid==null)
//		folder_list = usersfolders_list;
//	else
		folder_list = usersfolders_byid[folderid].folders_list;
	$("#"+dest).html("");
	var html="";
	for (var i = 0; i < folder_list.length; i++) {
		html = folder_list[i].getTreeNodeView(dest,type);
		$("#"+dest).append(html);
		if (localStorage.getItem(type)==folder_list[i].id) {
			UIFactory.UsersFolder.loadAndDisplayContent(type+'-folder-users',folder_list[i].id,'true',type);
		}	
	}
	document.getElementById('nb_folders_'+usersfolders_byid[folderid].id).innerHTML = usersfolders_byid[folderid].nb_folders;
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
			UIFactory.UsersFolder.moveFolder(id,folderid);
		}
		if (type="user") {
			alert("USER moveto:"+id+" -> "+folderid);
			UIFactory.UsersFolder.moveUser(folderid,id);
		}
	}

}

//==================================
UIFactory["UsersFolder"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var html = "";
	if (type=='list2' || type=='list1' || type=='list-forusergroup') {
		html += "<div id='"+this.id+"' class='treeNode usersfolder'>";
		html += "	<div id='usersfolder_"+this.id+"' class='row-label folder-row usersfolder'  draggable='true' ondragstart='dragFolder(event)' ondrop='dropFolder(event)' ondragover='allowDropFolder(event)'>";
//		if (this.nb_folders>0){
//			html += "		<span id='toggle_usersfolder_"+this.id+"' class='closeSign";
//			html += " toggledNode";
//			html += "' onclick=\"UIFactory.UsersFolder.loadAndDisplayStruct('collapse_usersfolder_"+this.id+"','"+this.id+"',false,'"+type+"');\"></span>";
//		} else {
			html += "<span class='no-toggledNode'>&nbsp;</span>"
//		}
		html += "		<span id='treenode-usersfolderlabel_"+this.id+"' onclick=\"UIFactory.UsersFolder.loadAndDisplayContent('"+type+"-folder-users','"+this.id+"',false,'"+type+"');\" class='folder-label'>"+folder_label+"&nbsp;</span>";
//		html +=	"	<span class='badge number_of_folders' id='nb_folders_"+this.id+"'>"+this.nb_folders+"</span>";
		html += "	&nbsp;<span class='badge number_of_items' id='number_of_usersfolder_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_usersfolder_"+this.id+"' class='nested'></div>";
		html += "</div><!-- class='usersfolder'-->";
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
		html += "<div id='select-usersfolder_"+this.id+"' class='treeNode select-folder'>";
		html += "	<div class='row-label'>";
		html += "		<span id='toggle_select-usersfolder_"+this.id+"' class='closeSign";
		if (this.nb_folders>0){
			html += " toggledNode";
		}
		html += "' onclick=\"UIFactory.UsersFolder.loadAndDisplayStruct('collapse_select-usersfolder_"+this.id+"','"+this.id+"',false,'"+type+"');\"></span>";
		html += "		<span id='treenode-usersfolderlabel_"+this.id+"' onclick=\"UIFactory.UsersFolder.loadAndDisplayContent('select-folder-users','"+this.id+"',false,'"+type+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='select-number_of_usersfolders"+this.id+"'>"+this.nb_folders+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='select-number_of_usersfolder_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_select-usersfolder_"+this.id+"' class='nested'></div>";
		html += "</div><!-- id='select-usersfolder_...'-->";
	}
	return html;
}

//==================================
UIFactory["UsersFolder"].displayFolderContentHeader = function(dest,id,type,langcode)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	//---------------------	
	$("#"+dest).show();
	$("#"+dest).html("");
	if (langcode==null)
		langcode = LANGCODE;
	var usersfolder = usersfolders_byid[id];
	//---------------------
	var html = "";
	var foldercode = usersfolder.code;
	if (type=='list1') {
		var owner = (Users_byid[usersfolder.ownerid]==null) ? "":Users_byid[usersfolder.ownerid].getView(null,'firstname-lastname',null);
	
		var folder_label = usersfolder.label_node[langcode].text();
		if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
			folder_label = '- no label in '+languages[langcode]+' -';
		html += "<div id='content-usersfolder_"+usersfolder.id+"' class='usersfolder-header'>";
		html += "	<div class='row row-label'>";
		html += "		<div class='col-4 folder-label' id='usersfolderlabel_"+usersfolder.id+"' >"+folder_label+"</div>";
		html += "		<div class='col-2 d-none d-md-block folder-label'>"+owner+"</div>";
		html += "		<div class='col-3 d-none d-sm-block comments' id='usersfolder-comments_"+usersfolder.date_modified.substring(0,10)+"'> </div><!-- comments -->";
		html += "		<div class='col-1'>";
		//------------ buttons ---------------
		if (usersfolder.code!="#system-user#")
			html += UIFactory.UsersFolder.getAdminMenu(usersfolder,false);
		//---------------------------------------
		html += "		</div><!-- class='col-1' -->";
		html += "		<div class='col-1'>";
		//------------------------ menu-burger
		if (usersfolder.code!="#system-user#" && (USER.admin || (USER.creator && !USER.limited) )) {
			html += "			<div class='dropdown folder-menu'>";
			html += "				<button  class='btn dropdown-toggle' data-toggle='dropdown'></button>";
			html += "				<ul class='dropdown-menu dropdown-menu-right' role='menu'>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['User'].callCreate();\" >"+karutaStr[LANG]['create_user']+"</a>";
//			html += "					<a class='dropdown-item' onclick=\"UIFactory['UsesFolder'].callCreate();\" >"+karutaStr[LANG]['create_folder']+"</a>";
			html += "				</ul>";
			html += "			</div>";
		}
		//------------------------end menu-burger
		html += "		</div><!-- class='col-1' -->";
		html += "	</div><!-- class='row' -->";
		html += "</div><!-- class='usersfolder'-->";
		//----------------------
	//	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
	//	html += "</div><!-- class='navbar-pages'-->";
		// ----------------------
	}
	if (type=='list2' || type=='list-forusergroup') {
		var owner = (Users_byid[usersfolder.ownerid]==null) ? "":Users_byid[usersfolder.ownerid].getView(null,'firstname-lastname',null);
	
		var folder_label = usersfolder.label_node[langcode].text();
		if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
			folder_label = '- no label in '+languages[langcode]+' -';
		html += "<div id='content-usersfolder_"+usersfolder.id+"' class='usersfolder-header'>";
		html += "	<div class='row row-label'>";
		html += "		<div class='col-10 folder-label' id='usersfolderlabel_"+usersfolder.id+"' >"+folder_label+"</div>";
		html += "		</div>";
		html += "	</div><!-- class='row' -->";
		html += "</div><!-- class='usersfolder'-->";
		//------------ buttons ---------------
	}
	html += "<div id='"+type+"-folder-users-pages' class='usersfolder-pages'>";
	html += "</div><!-- class='usersfolder-pages'-->";
	// ----------------------
	html += "<div id='navbar-pages' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
}

//==================================
UIFactory["UsersFolder"].prototype.displayFolderContentPage = function(dest,type,langcode)
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
			var destid = dest+"_item-usersfolder_"+item.id;
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
			html += item.getView(destid,type,langcode);
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_users)/g_configVar['maxuserlist']);
	if (nb_index>1) {
		UIFactory.UsersFolder.displayPagesNavbar(dest,nb_index,this.id,parseInt(this.pageindex),type);
		$(".navbar-pages").show();
	} else {
		$(".navbar-pages").hide();
	}
	$(window).scrollTop(0);
}

//==================================
UIFactory["UsersFolder"].prototype.getView = function(dest,type,langcode)
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
	if (type=='list1') {
		html += "<div class='folder-label col-10 col-md-4' title=\""+this.code+"\" class='folder-label' >"+folder_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='usersfolder-owner' >"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='usersfolder-code' >"+this.code+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y') || (USER.creator && !USER.limited)) {
			html += UIFactory.UsersFolder.getAdminMenu(this,true);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='list2' || type=='list-forusergroup') {
		html += "<div class='folder-label col-10 col-md-4' title=\""+this.code+"\" class='folder-label' >"+folder_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-3 d-none d-md-block'><span class='usersfolder-code' >"+this.code+"</span></div>";
		}
	}
	if (type=='bin') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
			html += "<div class='col-md-3 col-sm-3 col-xs-9'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs '><a class='usersfolder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			if (this.date_modified!=null)
				html += "<div class='col-md-2 col-sm-2 hidden-xs'>"+this.date_modified.substring(0,10)+"</div>";
			html += "<div class='col-md-2 col-sm-2 col-xs-3'>";
			html += "<div class='btn-group folder-menu'>";
			html += "<button class='btn' onclick=\"UIFactory['UsersFolder'].restore('"+this.id+"')\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
			html += "<i class='fas fa-trash-restore'></i>";
			html += "</button>";
			html += " <button class='btn' onclick=\"confirmDelObject('"+this.id+"','UsersFolder')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
			html += "<i class='fa fa-times'></i>";
			html += "</button>";
			html += "</div>";
			html += "</div><!-- class='col-md-2' -->";
		}
	}
	if (type=='select') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_folders',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='usersfolder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
		}
	}
	return html;
}

//======================
UIFactory["UsersFolder"].getAdminMenu = function(self,list)
//======================
{	
	var html = "";
	html += "<div class='dropdown folder-menu'>";
	if (USER.admin) {
		html += "	<button id='dropdown-usersfolder"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown-usersfolder"+self.id+"'>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory.UsersFolder.callRename('"+self.id+"',null,"+list+")\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
//		html += "		<a class='dropdown-item' onclick=\"UIFactory['UsersFolder'].callMove('"+self.id+"')\" ><i class='button fas fa-random'></i> "+karutaStr[LANG]['move']+"</a>";
		html += "		<a class='dropdown-item' id='remove-"+self.id+"' style='display:block' onclick=\"UIFactory['UsersFolder'].remove('"+self.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "	</div>";
	} else {
		html += "	<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";		
	}
	html += "			</div><!-- class='btn-group' -->";
	return html;
}

//==================================
UIFactory["UsersFolder"].prototype.getSelector = function(attr,value,name,checkbox)
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
UIFactory["UsersFolder"].moveFolder = function(folderid,newparentid) 
//==================================
{
	var url = serverBCK_API+"/folder/usersfolder/" + folderid + "?newparentid="+newparentid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory["UsersFolder"].displayAll('usersfolders','list');
			UIFactory["UsersFolder"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in moveFolder : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersFolder"].moveUser = function(folderid,userid) 
//==================================
{
	var url = serverBCK_API+"/folder/usersfolder/" + folderid + "?adduser="+userid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory.UsersFolder.loadAndDisplayStruct('usersfolder_active','active',true);  // active users
			UIFactory.UsersFolder.loadAndDisplayStruct('usersfolder_inactive','inactive',true);  // inactive users
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in moveUser : "+jqxhr.responseText);
		}
	});
};


//==================================
UIFactory["UsersFolder"].remove = function(id) 
//==================================
{
	var url = serverBCK_API+"/usersfolders/usersfolder/" + id + "?active=0";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory.UsersFolder.loadAndDisplayStruct('usersfolder_active','active',true);  // active users
			UIFactory.UsersFolder.loadAndDisplayStruct('usersfolder_inactive','inactive',true);  // inactive users
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in remove : "+jqxhr.responseText);
		}
	});
};


//==================================
UIFactory["UsersFolder"].callRename = function(id,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = usersfolders_byid[id];
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
			UIFactory["UsersFolder"].rename(self,langcode,list);
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
			UIFactory["UsersFolder"].rename(self,langcode,list);
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
UIFactory["UsersFolder"].rename = function(itself,langcode,list)
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
	xml +="<usersfolder><code>"+code+"</code>";
	for (var i=0; i<languages.length;i++){
		xml +="<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
	}
	xml +="</usersfolder>";
	strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
	var callback = function () {
		$("#treenode-usersfolderlabel_"+itself.id).html($(label));
		if (list)
			$("#item-usersfolder_"+itself.id).html($(itself.getView('item-usersfolder_'+itself.id,'list')));
		else {
			$("#usersfolderlabel_"+itself.id).html($(label));
		}
	};
	UICom.query("PUT",serverBCK_API+'/folder/usersfolder/'+itself.id+'',callback,"text",strippeddata);
};


//==================================
UIFactory["UsersFolder"].prototype.update = function(node)
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
UIFactory["UsersFolder"].callCreateFolder = function(parentid)
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
			UIFactory.UsersFolder.createFolder(parentid,code,label);
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
UIFactory["UsersFolder"].createFolder = function(parentid,code,label)
//==================================
{
	if (code!='' && label!='') {
		var url = serverBCK_API+"/folder/usersfolders/"+parentid;
		var data = "<usersfolder><code>"+code+"</code><label lang='fr'>"+label+"</label><label lang='en'>"+label+"</label></usersfolder>";
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
UIFactory["UsersFolder"].del = function(id) 
//==================================
{
	var url = serverBCK_API+"/folder/usersfolder/" + id;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			var pos_item = 0;
			for (var i=0;i<bin_usersfolder_list.length;i++){
				if (bin_usersfolder_list[i]!=null && bin_usersfolder_list[i].id==id) {
					bin_usersfolder_list[i] = null;
					pos_item = i;
					break;
				}
			}
			var new_length = bin_usersfolder_list.length-1;
			for (var i=pos_item;i<new_length;i++){
				bin_usersfolder_list[i] = bin_usersfolder_list[i+1];
			}
			if ($("#bin").length>0) { // not a batch call
				UIFactory["UsersFolder"].displayBin('bin','bin');
				$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersFolder"].parse = function(data) 
//==================================
{
	usersfolders_byid = {};
	usersfolders_list = [];		
	var items = $("usersfolder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		usersfolders_byid[id] = new UIFactory["UsersFolder"](items[i]);
		var code = usersfolders_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usersfolders_list[i] = usersfolders_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["UsersFolder"].parseStructure = function(data,parentid) 
//==================================
{
	var items = $("usersfolder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (usersfolders_byid[id]==undefined){
			usersfolders_byid[id] = new UIFactory["UsersFolder"](items[i]);
		} else
			usersfolders_byid[id].update(items[i]);			
		var code = usersfolders_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (usersfolders_byid[parentid]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			usersfolders_byid[parentid].folders_list[i] = usersfolders_byid[newTableau1[i][1]]
		}
		usersfolders_byid[parentid].loadedStruct = true;
		usersfolders_byid[parentid].nb_folders = usersfolders_byid[parentid].folders_list.length;
	}
};

//==================================
UIFactory["UsersFolder"].parseChildren = function(data,parentid) 
//==================================
{
	var children = $(data).children();

	var list = [];
	for( var i=0; i<children.length; ++i ) {
		var child = children[i];
		var tagname = $(child)[0].tagName;
		if("USERSFOLDER"==tagname || "USER"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("USERSFOLDER"==tagname) {
				if (usersfolders_byid[id]==undefined)
					usersfolders_byid[id] = new UIFactory["UsersFolder"](child);
				else usersfolders_byid[id].update(child);
				list[i]['obj'] = usersfolders_byid[id];
			} else {
				if (Users_byid[id]==undefined)
					Users_byid[id] = new UIFactory["User"](child);
				//else Users_byid[id].update(child);
				list[i]['obj'] = Users_byid[id];
			}
		}
	}
	usersfolders_byid[parentid].chidren_list[usersfolders_byid[parentid].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
UIFactory.UsersFolder.loadAndDisplayStruct = function (dest,folderid,reload,type) {
//==================================
	$("#wait-window").show();
	if (type==null)
		type = 'list2';
	if (reload==null)
		reload = false;
//	if (folderid!="active" && folderid!="inactive")
//		toggleElt('closeSign','openSign','usersfolder_'+folderid);
	if (!usersfolders_byid[folderid].loadedStruct || reload) {
		UIFactory.UsersFolder.loadStruct(dest,folderid);
		UIFactory.UsersFolder.displayTree(dest,folderid,type);
	}
	else {
		UIFactory.UsersFolder.displayTree(dest,folderid,type)
	}
	$("#wait-window").hide();
}

//==============================
UIFactory.UsersFolder.loadStruct = function (dest,id)
//==============================
{
	/*
	$.ajax({
		id : id,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folder/usersfolder/"+id+"?type=structure",
		success : function(data) {
				UIFactory["UsersFolder"].parseStructure(data,id);
				UIFactory["UsersFolder"].displayTree(dest,'list',langcode,id);
		},
		error : function(jqxhr,textStatus) {
		}
	});
	 */
	//-------- Simulation ---------
	if (id=="active") { //root folder
		var data = "<usersfolders id='active' nb_folders='2' nb_users='0'>"
			+"<usersfolder id='1' nb_folders='0' nb_users='3' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>#system-user#</code><label lang='en'>System Users</label><label lang='fr'>Usagers Système</label></usersfolder>"
			+"<usersfolder id='2' nb_folders='0' nb_users='7' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Usagers</label></usersfolder>"
			+"</userfolders>";
		
	}
	if (id=="2") { 
		var data = "<usersfolders id='2' nb_folders='3' nb_users='0'>"
			+"<usersfolder id='2.1' nb_folders='0' nb_users='7' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>System Users</label><label lang='fr'>dossier2.1</label></usersfolder>"
			+"</userfolders>";
		
	}
	if (id=="inactive") { //bin folder
		var data = "<usersfolders d='inactive' nb_folders='0' nb_users='0'>"
				+"</userfolders>";
		
	}
	UIFactory["UsersFolder"].parseStructure(data,id);
}

//==================================
UIFactory.UsersFolder.loadAndDisplayContent = function (dest,folderid,reload,type) {
//==================================
	$("#wait-window").show();
	//---------------------
	localStorage.setItem(type,folderid);
		//--------Folders------------------
		if (usersfolders_byid[folderid].nb_folders > 0){
			UIFactory.UsersFolder.loadAndDisplayStruct('collapse_usersfolder_'+folderid,folderid,reload,type)
		}
//		toggleOpenElt('closeSign','openSign','usersfolder_'+folderid);
		UIFactory.UsersFolder.displayFolderContentHeader(dest,folderid,type);
		selectElt('usersfolder','usersfolder_'+folderid);
		//--------Portfolios-------------------
		var dest_page = dest + '-pages';
		var list = usersfolders_byid[folderid].chidren_list[usersfolders_byid[folderid].pageindex];
		if (list==undefined||list==null){
			UIFactory.UsersFolder.loadContent(dest_page,folderid);
			usersfolders_byid[folderid].displayFolderContentPage(dest_page,type);
		}
		else {
			usersfolders_byid[folderid].displayFolderContentPage(dest_page,type);
		}
		//-------------------------------
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
UIFactory.UsersFolder.loadAndDisplayContentPage = function (dest,folderid,type,pageindex) {
//==================================
	$("#wait-window").show();
	usersfolders_byid[folderid].pageindex = ""+pageindex;
	var list = usersfolders_byid[folderid].chidren_list[usersfolders_byid[folderid].pageindex];
	if (list==undefined||list==null) {
		UIFactory.UsersFolder.loadContent(dest,folderid);
		usersfolders_byid[folderid].displayFolderContentPage(dest,type);
	} else {
		usersfolders_byid[folderid].displayFolderContentPage(dest,type);
	}
	$("#wait-window").hide();
}

//==============================
UIFactory.UsersFolder.loadContent = function (dest,folderid)
//==============================
{
	var pageindex = usersfolders_byid[folderid].pageindex;
	/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folder/usersfolder/"+id+"?type=children&r="+pageindex+"&limit="+g_configVar['maxuserlist'],
		success : function(data) {
			UIFactory.UsersFolder.parseChildren(data,id); 
			usersfolders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	
	 */
	//---------Simulation---------------
	var data = "";
	if (folderid=='1' && pageindex==1) {
		data =  "<usersfolder id='1' nb_folders='0' nb_users='3'>";
		data += "<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "</usersfolder>";
	}
	if (folderid=='2') {
		if (pageindex==1) {
			data =  "<usersfolder id='2.1' nb_folders='0' nb_users='7'>";
			data += "<user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "</usersfolder>";
			}
			if (pageindex==2) {
				data =  "<usersfolder id='2.1' nb_folders='0' nb_users='7'>";
				data += "<user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
				data += "<user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
				data += "<user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
				data += "</usersfolder>";
			}
	}
	UIFactory.UsersFolder.parseChildren(data,folderid);
}


//==============================
function initUsersFolders()
//==============================
{
	var data = "<usersfolder id='active' nb_folder='0' nb_user='0' owner='Y'  ownerid='1'><code>1</code><label lang='en'>"+karutaStr['en']['folders']+"</label><label lang='fr'>"+karutaStr['fr']['folders']+"</label></usersfolder>";
	usersfolders_byid['active'] = new UIFactory["UsersFolder"](data);
	data = "<usersfolder id='temporary' nb_folders='0' nb_users='0' owner='Y'  ownerid='1'><code>temporary</code><label lang='en'>"+karutaStr['en']['temporary_users']+"</label><label lang='fr'>"+karutaStr['fr']['temporary']+"</label></usersfolder>";
	usersfolders_byid['temporary'] = new UIFactory["UsersFolder"](data);
	data = "<usersfolder id='inactive' nb_folders='0' nb_users='0' owner='Y'  ownerid='1'><code>1</code><label lang='en'>"+karutaStr['en']['bin']+" - "+karutaStr['en']['inactive_users']+"</label><label lang='fr'>"+karutaStr['fr']['bin']+" - "+karutaStr['fr']['inactive_users']+"</label></usersfolder>";
	usersfolders_byid['inactive'] = new UIFactory["UsersFolder"](data);
}


//==================================
UIFactory.UsersFolder.displayPagesNavbar = function (dest,nb_index,folderid,pageindex,type)
//==================================
{
	var html = "";
	for (var i=1;i<=nb_index;i++) {
		html += "<span class='badge";
		if (i==pageindex)
			html += " active";
		html += "' onclick=\"UIFactory.UsersFolder.loadAndDisplayContentPage('"+dest+"','"+folderid+"','"+type+"','"+i+"')\">"+i+"</span>";
	}
	$("#navbar-pages").html(html);
	/* javascript:loadAndDisplayUsersFolderContentPage('folder-users-pages','list','2.1',0,2,'1');
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

