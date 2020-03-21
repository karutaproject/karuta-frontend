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
	
var usersgroups_byid = {};
var usersgroups_list = [];
var bin_UsersGroup_list = [];
var currentDisplayedUsersGroupId = null;
var root_UsersGroup = '0';
var pagegNavbar_list = ["top","bottom"];
var number_of_usersgroups = 0;
var folder_last_drop = "";
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

/*
//==================================
UIFactory["UsersGroup"].displayAll = function(dest,type,langcode)
//==================================
{
	number_of_bins = 0;
	$("#usersgroups").html($(""));
	UIFactory["UsersGroup"].displayTree(dest,type,langcode);
	number_of_usersgroups = usersgroups_list.length;
	//--------------------------------------
	if (number_of_usersgroups==0) {
		$("#usersgroups-label").hide();
	} else {
		$("#usersgroups-nb").html(number_of_usersgroups);
	}
	//--------------------------------------
	//--------------------------------------
	if (!USER.admin)
		$("#users-nb").hide();
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};
*/

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
		html += "		<span id='treenode-UsersGrouplabel_"+this.id+"' onclick=\"loadAndDisplayUsersGroupContent('group-users','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='nb_folders_"+this.id+"'>"+this.nb_folders+"</span>";
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
		html += "		<span id='treenode-UsersGrouplabel_"+this.id+"' onclick=\"loadAndDisplayUsersGroupContent('select-folder-users','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='select-number_of_usersgroups"+this.id+"'>"+this.nb_folders+"</span>";
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
		displayGroupPagesNavbar(dest,nb_index,this.id,parseInt(this.pageindex));
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
UIFactory["UsersGroup"].loadAndDisplayStruct = function(dest,folderid,reload)
//==================================
 {
	$("#wait-window").show();
	if (reload==null)
		reload = false;
	if (folderid!="grouproot")
		toggleElt('closeSign','openSign','UsersGroup_'+folderid);
	if (!usersgroups_byid[folderid].loadedStruct || reload) {
		loadUsersGroupStruct(dest,folderid);
		UIFactory.UsersGroup.displayTree(dest,folderid,'list');
	}
	else {
		UIFactory.UsersGroup.displayTree(dest,folderid,'list')
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersGroupStruct(dest,id)
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
function loadAndDisplayUsersGroupContent(dest,folderid) {
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
			loadUsersGroupContent(dest_page,folderid);
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
function loadAndDisplayUsersGroupContentPage(dest,folderid,type,pageindex) {
//==================================
	$("#wait-window").show();
	usersgroups_byid[folderid].pageindex = ""+pageindex;
	var list = usersgroups_byid[folderid].chidren_list[usersgroups_byid[folderid].pageindex];
	if (list==undefined||list==null) {
		loadUsersGroupContent(dest,folderid);
		usersgroups_byid[folderid].displayFolderContentPage(dest,type);
	} else {
		usersgroups_byid[folderid].displayFolderContentPage(dest,type);
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersGroupContent(dest,folderid)
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
	html += "	<button class='btn list-btn' onclick=\"loadAndDisplayUsersGroupContent('folder-users','0');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see"] + "</button>";
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

//=====================================================================================================
//=====================================================================================================
//=====================================================================================================
//============================== FOLDER MANAGEMENT ====================================================
//=====================================================================================================
//=====================================================================================================
//=====================================================================================================

//==================================
function displayGroupPagesNavbar(dest,nb_index,folderid,pageindex)
//==================================
{
	var html = "";
	for (var i=1;i<=nb_index;i++) {
		html += "<span class='badge";
		if (i==pageindex)
			html += " active";
		html += "' onclick=\"loadAndDisplayUsersGroupContentPage('"+dest+"','"+folderid+"','list','"+i+"')\">"+i+"</span>";
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

