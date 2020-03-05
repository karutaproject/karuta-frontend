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
	
var folders_byid = {};
var folders_list = [];
var currentDisplayedFolderId = null;
var rootfolder_userid = null;
var binfolder_userid = null;
var pagegNavbar_list = ["top","bottom"];
var number_of_folders = 0;
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

/// Define our type
//==================================
UIFactory["Folder"] = function(node)
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
			$(node).appendChild(newElement);
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
	if ($(node).attr('count')!=undefined) {
		this.nb_folders = $(node).attr('count');		
	} else this.nb_folders = 0;
	if ($(node).attr('nb_children')!=undefined) {
		this.nb_children = $(node).attr('nb_children');
	} else this.nb_children = 0;
	this.loadedStruct = false;
	this.folders_list = [];
	this.loadedFolder = false;
	this.pageindex = '1';
	this.chidren_list = {};
	this.display = {};
}

//==================================
UIFactory["Folder"].displayAll = function(dest,type,langcode)
//==================================
{
//	number_of_folders = 0;
	number_of_portfolios = 0;
	number_of_bins = 0;
	$("#folders").html($(""));
	UIFactory["Folder"].displayTree(dest,type,langcode);
	//--------------------------------------
	if (number_of_folders==0) {
		$("#folders-label").hide();
	} else {
		$("#folders-nb").html(number_of_folders);
	}
	//--------------------------------------
	//--------------------------------------
	if (!USER.creator)
		$("#portfolios-nb").hide();
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};

//==================================
UIFactory["Folder"].displayTree = function(dest,type,langcode,parentId)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	var list = [];
	if (parentId==undefined || parentId==null)
		list = folders_list;
	else list = folders_byid[parentId].folders_list;
	var html="";
	for (var i = 0; i < list.length; i++) {
		html += list[i].getTreeNodeView(dest,type,langcode);
	}
	document.getElementById(dest).innerHTML = html;
}

//==================================
UIFactory["Folder"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var html = "";
	html += "<div id='folder_"+this.id+"' class='treeNode folder'>";
	html += "	<div class='row-label'>";

	html += "		<span id='toggle_folder_"+this.id+"' class='closeSign";
	if (this.nb_folders>0){
//		html += "		<span id='toggle_folder_"+this.id+"' class='closeSign' onclick=\"javascript:loadAndDisplayFolderStruct('collapse_folder_"+this.id+"','"+this.id+"');\"></span>";
		html += " toggledNode";
	}
	html += "' onclick=\"javascript:loadAndDisplayFolderStruct('collapse_folder_"+this.id+"','"+this.id+"');\"></span>";

	html += "		<span id='treenode-folderlabel_"+this.id+"' onclick=\"javascript:loadAndDisplayFolderContent('folder-portfolios','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='number_of_folders_"+this.id+"'>"+this.nb_folders+"</span>";
	html += "&nbsp;<span class='badge number_of_items' id='number_of_folder_items_"+this.id+"'>"+this.nb_children+"</span>";
	html += "	</div>";
//	if (this.nb_folders>0)
		html += "	<div id='collapse_folder_"+this.id+"' class='nested'></div>";
	html += "</div><!-- class='folder'-->";
	return html;
}

//==================================
UIFactory["Folder"].displayFolderContent = function(dest,id,langcode,index_class)
//==================================
{
	$("#"+dest).show();
	localStorage.setItem('currentDisplayedFolder',id);
	$("#"+dest).html("");
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	var folder = folders_byid[id];
	//---------------------
	var html = "";
	var foldercode = folder.code;
	var owner = (Users_byid[folder.ownerid]==null) ? "":Users_byid[folder.ownerid].getView(null,'firstname-lastname',null);

	var folder_label = folder.label_node[langcode].text();
	if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
		folder_label = '- no label in '+languages[langcode]+' -';
	html += "<div id='content-folder_"+folder.id+"' class='folder'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-1'/>";
	html += "		<div class='col-4 folder-label' id='folderlabel_"+folder.id+"' >"+folder_label+"</div>";
	html += "		<div class='col-2 d-none d-md-block folder-label'>"+owner+"</div>";
	html += "		<div class='col-3 d-none d-sm-block comments' id='folder-comments_"+folder.date_modified.substring(0,10)+"'> </div><!-- comments -->";
	html += "		<div class='col-1'>";
	//------------ buttons ---------------
	html += "			<div class='dropdown folder-menu'>";
	if (USER.admin || (folder.owner=='Y' && !USER.xlimited)) {
		html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "			<div class='dropdown-menu  dropdown-menu-right'>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['Folder'].callRename('"+folder.id+"',null,true)\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['Folder'].callMove('"+folder.id+"')\" >"+karutaStr[LANG]['move']+"</a>";
		html += "				<a class='dropdown-item' id='remove-"+folder.id+"' style='display:block' onclick=\"UIFactory['Folder'].remove('"+folder.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['Folder'].callChangeOwner('"+folder.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['Folder'].callShareUsers('"+folder.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['Folder'].callShareUsersGroups('"+folder.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
		html += "			<a class='dropdown-item' id='export-"+folder.id+"' href='' style='display:block'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-project"]+"</a>";
		html += "			<a class='dropdown-item' onclick=\"UIFactory.Folder.callArchive('"+foldercode+"')\" ><i class='fa fa-download'></i> "+karutaStr[LANG]["archive-project"]+"</a>";
		html += "			</div>";
	} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
		html += "			<button  data-toggle='dropdown' class='btn   dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";
	}
	html += "			</div><!-- class='btn-group' -->";
	//---------------------------------------
	html += "		</div><!-- class='col-1' -->";
	html += "		<div class='col-1'>";
	//------------------------ menu-burger
	if (USER.admin || (USER.creator && !USER.limited) ) {
		html += "			<div class='dropdown portfolio-menu'>";
		html += "				<button  class='btn dropdown-toggle' data-toggle='dropdown'></button>";
		html += "				<ul class='dropdown-menu dropdown-menu-right' role='menu'>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.model')\" >"+karutaStr[LANG]['karuta.model']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.rubrics')\" >"+karutaStr[LANG]['karuta.rubrics']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.parts')\" >"+karutaStr[LANG]['karuta.parts']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.report')\" >"+karutaStr[LANG]['karuta.report']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.batch')\" >"+karutaStr[LANG]['karuta.batch']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+foldercode+"','karuta.batch-form')\" >"+karutaStr[LANG]['karuta.batch-form']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].create('"+foldercode+"')\" >"+karutaStr[LANG]['create_tree']+"</a>";
		html += "				</ul>";
		html += "			</div>";
	}
	//------------------------end menu-burger
	html += "		</div><!-- class='col-1' -->";
	html += "	</div><!-- class='row' -->";
	html += "</div><!-- class='folder'-->";
	//----------------------
	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	// ----------------------
	html += "<div id='folder-portfolios-pages' class='folder-pages'>";
	html += "</div><!-- class='folder-pages'-->";
	// ----------------------
	html += "<div id='"+index_class+pagegNavbar_list[1]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
	//----------------------
	var portfolio_list = "";
	if (portfolio_list.length>0)
		portfolio_list = portfolio_list.substring(1);
	$("#export-"+folder.id).attr("href",serverBCK_API+"/folders/zip?portfolios="+portfolio_list);
}

//==================================
UIFactory["Folder"].prototype.displayFolderContentPage = function(dest,type,langcode,index_class)
//==================================
{
	$("#"+dest).html("");
	if (langcode==null)
		langcode = LANGCODE;
	if (type==undefined || type==null)
		type = 'list';

	var list = this.chidren_list[this.pageindex];
	//---------------------
	var html = "";
	for (var i=0; i<list.length;i++){
		var item = list[i]['obj'];
		if("FOLDER"==list[i]['type']) {
			html += "<div class='row folder-row' id='item-folder_"+item.id+"'>";
			html += item.getView("#item-folder_"+item.id,type,langcode);
			html += "</div>";
		} else {
			var owner = (Users_byid[list[i].ownerid]==null) ? "":Users_byid[list[i].ownerid].getView(null,'firstname-lastname',null);
			html += "<div class='row portfolio-row' id='item-portfolio_"+item.id+"'>";
			html += item.getPortfolioView("#item-portfolio_"+item.id,type,langcode,item.code_node.text(),owner);
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_children)/nbItem_par_page);
	if (nb_index>1) {
		displayPagesNavbar(nb_index,this.id,langcode,parseInt(this.pageindex),index_class,'loadAndDisplayFolderContentPage',dest,"list");		
	}
	$(window).scrollTop(0);
}

//==================================
UIFactory["Folder"].prototype.getView = function(dest,type,langcode)
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
//		html += "<div class='col-1 d-none d-md-block'></div>";
		html += "<div class='folder-label col-10 col-md-4' title=\""+this.code+"\" class='folder-label' >"+folder_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='folder-owner' >"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='folder-code' >"+this.code+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y' && !USER.xlimited) || (USER.creator && !USER.limited)) {
			html += UIFactory.Folder.getAdminFolderMenu(this);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='bin') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
			html += "<div class='col-md-3 col-sm-3 col-xs-9'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs '><a class='folder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			if (this.date_modified!=null)
				html += "<div class='col-md-2 col-sm-2 hidden-xs'>"+this.date_modified.substring(0,10)+"</div>";
			html += "<div class='col-md-2 col-sm-2 col-xs-3'>";
			html += "<div class='btn-group folder-menu'>";
			html += "<button class='btn' onclick=\"UIFactory['Folder'].restore('"+this.id+"')\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
			html += "<i class='fas fa-trash-restore'></i>";
			html += "</button>";
			html += " <button class='btn' onclick=\"confirmDelObject('"+this.id+"','Folder')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
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
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='folder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
		}
	}
	return html;
}

//======================
UIFactory["Folder"].getAdminFolderMenu = function(self)
//======================
{	
	var html = "";
	html += "<div class='dropdown portfolio-menu'>";
	html += "<button id='dropdown"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
	html += "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown"+self.id+"'>";
	if (USER.admin || (self.owner=='Y' && !USER.xlimited)) {
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callRename('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.remove('"+self.id+"')\" ><i class='fas fa-trash'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+self.id+"?resources=true&files=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-with-files"]+"</a>";
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callChangeOwner('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
	}
	html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callShareUsers('"+self.id+"')\" ><i class='fas fa-share-square'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
	html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callShareUsersGroups('"+self.id+"')\" ><i class='fas fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
	html += "</div><!-- class='dropdown-menu' -->";
	html += "</div><!-- class='dropdown' -->";
	return html;
}

//==================================
UIFactory["Folder"].prototype.getSelector = function(attr,value,name)
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
UIFactory["Folder"].remove = function(id) 
//==================================
{
	var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?active=false";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<portfolios_list.length;i++){
				if (portfolios_list[i]!=null && portfolios_list[i].id==portfolioid) {
					bin_list[bin_list.length] = portfolios_list[i];
					portfolios_list[i] = null;
					break;
				}
			}
			UIFactory["Folder"].displayAll('portfolios','list');
			UIFactory["Folder"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in remove : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Folder"].restore = function(id) 
//==================================
{
	var url = serverBCK_API+"/folders/folder/" + id + "?active=true";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<bin_list.length;i++){
				if (bin_list[i]!=null && bin_list[i].id==id) {
					folders_list[folders_list.length] = bin_list[i];
					folders_byid[id] = bin_list[i];
					bin_list[i] = null;
					//---- sort portfolios_list ---
					var tableau1 = new Array();
					for (var k=0; k<folders_list.length; k++){
						if (folders_list[k]!=null){
						tableau1[tableau1.length] = [folders_list[k].code_node.text(),folders_list[k].id];
						}
					}
					var newTableau1 = tableau1.sort(sortOn1);
					folders_list = [];
					for (var l=0; l<newTableau1.length; l++){
						folders_list[l] = folders_byid[newTableau1[l][1]]
					}
					//-----------------------------
					break;
				}
			}
			UIFactory["Folder"].displayBin('bin','bin');
			UIFactory["Folder"].displayAll('portfolios','list');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Folder"].callRename = function(id,langcode,project)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (project==null)
		project = false;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = folders_byid[id];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited) || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+id+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+id+"' type='text' class='form-control' name='input_code' value=\""+self.code+"\">");
		$(htmlCodeInputObj).change(function (){
			UIFactory["Folder"].rename(self,langcode,project);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((this.owner=='Y') || (USER.creator && !USER.limited) || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			UIFactory["Folder"].renameProject(self,langcode);
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
UIFactory["Folder"].rename = function(itself,langcode,project)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var oldcode = $(itself.code);
	var code = $.trim($("#code_"+itself.id).val());
	//---------- test if new code already exists
	$(itself.code_node).text(code);
	itself.code = code;
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	$(itself.label_node[langcode]).text(label);
	var xml = "";
	xml +="		<folder>";
	xml +="			<code>"+code+"</code>";
	for (var i=0; i<languages.length;i++){
		xml +="			<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
	}
	xml +="		</folder>";
	strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
	var callback = function () {
		$("#treenode-folderlabel_"+itself.id).html($(label));
		if (project)
			$("#folderlabel_"+itself.id).html($(label));
		else 
			$("#item-folder_"+itself.id).html($(itself.getView('item-folder_'+itself.id,'list')));
	};
	UICom.query("PUT",serverBCK_API+'/folders/folder/'+itself.id+'',callback,"text",strippeddata);
};

//==================================
UIFactory["Folder"].prototype.update = function(node)
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
				$(node).appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
			}			
			$("label[lang='"+languages[i]+"']",current_node).text(this.label_node[i].text());
		}
	}
	this.node = current_node;
}

//==================================
UIFactory["Folder"].createFolder = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_folder']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codetree").val();
		var label = $("#labeltree").val();
		if (code!='' && label!='') {
			var uuid = UIFactory["Portfolio"].getid_bycode("karuta.project",false); 
			UIFactory["Portfolio"].copy_rename(uuid,code,true,label,'karuta-project');
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
	html += "		<label for='codetree' class='col-sm-3 control-label'>Code</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='codetree' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='labeltree' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='labeltree' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Folder"].parse = function(data) 
//==================================
{
	folders_byid = {};
	folders_list = [];		
	var items = $("folder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		folders_byid[id] = new UIFactory["Folder"](items[i]);
		var code = folders_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		folders_list[i] = folders_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["Folder"].parseStructure = function(data,parentId) 
//==================================
{
	var items = $("folder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (folders_byid[id]==undefined){
			folders_byid[id] = new UIFactory["Folder"](items[i]);
		} else
			folders_byid[id].update(items[i]);			
		var code = folders_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (folders_byid[parentId]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			folders_byid[parentId].folders_list[i] = folders_byid[newTableau1[i][1]]
		}
		folders_byid[parentId].loadedStruct = true;
		folders_byid[parentId].nb_folders = folders_byid[parentId].folders_list.length;
	}
};

//==================================
UIFactory["Folder"].parseChildren = function(data,parentId) 
//==================================
{
	var children = $(data).children();

	var list = [];
	for( var i=0; i<children.length; ++i ) {
		var child = children[i];
		var tagname = $(child)[0].tagName;
		if("FOLDER"==tagname || "PORTFOLIO"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("FOLDER"==tagname) {
				if (folders_byid[id]==undefined)
					folders_byid[id] = new UIFactory["Folder"](child);
				else folders_byid[id].update(child);
				list[i]['obj'] = folders_byid[id];
			} else {
				if (portfolios_byid[id]==undefined)
					portfolios_byid[id] = new UIFactory["Portfolio"](child);
				//else portfolios_byid[id].update(child);
				list[i]['obj'] = portfolios_byid[id];
			}
		}
	}
	folders_byid[parentId].chidren_list[folders_byid[parentId].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-------------------------- SHARING - UNSHARING -----------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------


//==================================
UIFactory["Folder"].displaySharingRoleEditor = function(destid,portfolioid,data,callFunction,instance)
//==================================
{
	var groups = $("rolerightsgroup",data);
	if (groups.length>0) {
		//--------------------------
		$("#"+destid).append("<div id='special-roles'></div>")
		$("#"+destid).append("<div id='other-roles' style='margin-top:5px;'></div>")
		//--------------------------
		var group_labels = [];
		for (var i=0; i<groups.length; i++) {
			group_labels[i] = [$("label",groups[i]).text(),$(groups[i]).attr('id')];
		}
		var sorted_groups = group_labels.sort(sortOn1);
		//--------------------------
		var js = "javascript:";
		if (callFunction!=null) {
			js += callFunction+";";
		}
		js += "$('input:checkbox').removeAttr('checked')";
		var first = true;
		var dest = "";
		for (var i=0; i<sorted_groups.length; i++) {
			var label = sorted_groups[i][0];
			var groupid = sorted_groups[i][1];
			if (label=='all' || label=='designer' || label=='administrator')
				dest = "#special-roles";
			else
				dest = "#other-roles";
			if ((label!="user" && instance && label!="") || (!instance && (label=="designer" || label=='all'))) {
				if (!first)
					$(dest).append($("<br>"));
				first = false;
				var input = "<input type='radio' name='radio_group' value='"+groupid+"'";
				input += "onclick=\""+js+"\" ";
				input +="> "+label+" </input>";
				$(dest).append($(input));
			}
		}
	} else {
		$("#"+destid).html(karutaStr[LANG]['nogroup']);
	}
};

//==================================
UIFactory["Folder"].shareUsers = function(portfolioid)
//==================================
{
	var users = $("input[name='select_users']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var groupid = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		groupid = $(group).attr('value');
	}
	var url = null;
	if (groupid!=null) {
		url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
		var xml = "<users>";
		for (var i=0; i<users.length; i++){
			var userid = $(users[i]).attr('value');
			xml += "<user id='"+userid+"'/>";
		}
		xml += "</users>";
		if (xml.length>20) {
			$.ajax({
				type : "POST",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : xml,
				success : function(data) {
					//--------------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
						success : function(data) {
							UIFactory["Folder"].displayUnSharing('shared',data);
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Error in share : "+jqxhr.responseText);
						}
					});
					//--------------------------
				}
			});
		}
	}
	//------------------------------------------------------------
};

//==================================
UIFactory["Folder"].callShareUsers = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['Portfolio'].unshareUsers('"+portfolioid+"')";
	var js3 = "javascript:UIFactory['Portfolio'].shareUsers('"+portfolioid+"')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+portfolios_byid[portfolioid].label_node[langcode].text());
	var html = "";
	html += "<div class='row'>";
	html += "<div class='col-md-9'>";
	html += "<h4>"+karutaStr[LANG]['shared']+"</h4>";
	html += "</div>";
	html += "<div class='col-md-3'>";
	html += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['unshare']+"</button>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<div id='shared'></div>";
	//-------------------------------------
	html += "<div id='sharing' style='display:none'>";
	html += "<hr/>";
	html += "<div class='row'>";
	html += "<div class='col-md-9'>";
	html += "<h4>"+karutaStr[LANG]['sharing']+"</h4>";
	html += "</div>";
	html += "<div class='col-md-3'>";
	html += "<button class='btn' onclick=\""+js3+";\">"+karutaStr[LANG]['addshare']+"</button>";
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
	if (Users_byid.length>0) { // users loaded
		UIFactory["User"].displaySelectMultipleActive('sharing_users');
		//--------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				UIFactory["Folder"].displayUnSharing('shared',data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callShareUsers 1 : "+jqxhr.responseText);
			}
		});
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
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						UIFactory["Folder"].displayUnSharing('shared',data);
					}
				});		
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callShareUsers 2 : "+jqxhr.responseText);
			}
		});
	}
	//----------------------------------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + portfolios_byid[portfolioid].rootid+"/rights",
		success : function(data) {
			var instance = $("role",data).length;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid,
				success : function(data) {
					UIFactory["Folder"].displaySharingRoleEditor('sharing_roles',portfolioid,data,null,instance);
					$("#sharing").show();
					$("#sharing_designer").show();
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in callShareUsers 3 : "+jqxhr.responseText);
				}
			});
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in callShareUsers 3 : "+jqxhr.responseText);
		}
	});
	
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Folder"].callShareUsersGroups = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['Portfolio'].shareGroups('"+portfolioid+"','unshare')";
	var js3 = "javascript:UIFactory['Portfolio'].shareGroups('"+portfolioid+"','share')";
	var js4 = "javascript:UIFactory['Portfolio'].unshareUsers('"+portfolioid+"')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+portfolios_byid[portfolioid].label_node[langcode].text());
	var html = "";
	html += "<div class='row'>";
	html += "<div class='col-md-9'>";
	html += "<h4>"+karutaStr[LANG]['shared']+"</h4>";
	html += "</div>";
	html += "<div class='col-md-3'>";
	html += "<button class='btn' onclick=\""+js4+";\">"+karutaStr[LANG]['unshare']+"</button>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "<div id='shared'></div>";
	html += "<div id='sharing' style='display:none'>";
	html += "<hr/>";
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
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				UIFactory["Folder"].displayUnSharing('shared',data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callShareUsersGroups 1 : "+jqxhr.responseText);
			}
		});
		//--------------------------		
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						UIFactory["Folder"].displayUnSharing('shared',data);
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Error in callShareUsersGroups 1 : "+jqxhr.responseText);
					}
				});
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in Portfolio.callShareUsersGroups 1 : "+jqxhr.responseText);
			}
		});
	}
	//----------------------------------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + portfolios_byid[portfolioid].rootid+"/rights",
		success : function(data) {
			var instance = $("role",data).length;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid,
				success : function(data) {
					UIFactory["Folder"].displaySharingRoleEditor('sharing_roles',portfolioid,data,"UIFactory['UsersGroup'].hideUsersList('sharing_usersgroups-group-')",instance);
					$("#sharing").show();
					$("#sharing_designer").show();
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in Portfolio.callShareUsersGroups 2 : "+jqxhr.responseText);
				}
			});
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in callShareUsers 3 : "+jqxhr.responseText);
		}
	});
		
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Folder"].shareGroups = function(portfolioid,type)
//==================================
{
	var usersgroups = $("input[name='select_usersgroups']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var groupid = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		groupid = $(group).attr('value');
		var xml = get_usersxml_from_groups(usersgroups);
		var users = $("user",xml);
		updateRRGroup_Users(groupid,users,xml,type,'id',portfolioid);
	}
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
UIFactory["Folder"].callChangeOwner = function(id,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory.Folder.changeOwner('"+id+"')";
	var footer = ""
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Save']+"</button>";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";

	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['changeOwner']+' '+folders_byid[id].label_node[langcode].text());
	var html = "";
	html += "<div class='row'>";
	html += "<div class='col-md-3'><br>";
	html += karutaStr[LANG]['select_user'];
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='select_user'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (Users_byid.length>0) { // users loaded
		UIFactory["User"].displaySelectActive('select_user');
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
				UIFactory["User"].displaySelectActive('select_user');
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callChangeOwner : "+jqxhr.responseText);
			}
		});
	}
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Folder"].changeOwner = function(id,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var user = $("input[name='select_user']").filter(':checked');
	var userid = $(user).val();
	$.ajax({
		type : "PUT",
		dataType : "text",
		url : serverBCK_API+"/folders/folder/"+id+"/setOwner/"+userid,
		success : function(data) {
			$('#edit-window').modal('hide')
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in ChangeOwner : "+jqxhr.responseText);
		}
	});
	
}

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------- ARCHIVE --------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
UIFactory["Folder"].callArchive = function(id,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory.Folder.archive('"+id+"')";
	var footer = ""
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Save']+"</button>";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";

	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['archive-project']+' '+folders_byid[id].label_node[langcode].text()+'('+folders_byid[id].code+')');
	var html = "";
	html += "<div>";
	html += karutaStr[LANG]['nbeltsperarchive'];
	html += " : <input name='nbeltsperarchive' type='text'>"
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Folder"].archive = function(id,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var nbeltsperarchive = $("input[name='nbeltsperarchive']").val();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+projectcode,
		success : function(data) {
			UIFactory["Folder"].parse(data);
			for (var i=1;i<portfolios_list.length+1;i=i+parseInt(nbeltsperarchive)){
				var uuids = "";
				for (var j=0;j<nbeltsperarchive;j++){
					if (j>0)
						uuids += ",";
					uuids += portfolios_list[i+j].id;
				}
				$.ajax({
					async : false,
					type : "GET",
					dataType : "text",
					url : serverBCK_API+"/portfolios/zip?portfolios="+uuids+"&archive=y",
					success : function(data) {
						var html = "<div>"+data+"</div>";
						$("#edit-window-body").append($(html));
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Server Error GET archive: "+textStatus);
					}
				});
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error active=1&search: "+textStatus);
		}
	});
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================
function loadAndDisplayFolderStruct(dest,id,langcode) {
//==================================
	$("#wait-window").show();
	toggleElt('closeSign','openSign','folder_'+id);
	if (!folders_byid[id].loadedStruct)
		loadFolderStruct(dest,id,langcode);
	else {
//		UIFactory.Folder.displayTree(dest,'list',langcode,id);
	}
	$("#wait-window").hide();
}

//==============================
function loadFolderStruct(dest,id,langcode)
//==============================
{
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Folder"].parse_add(data);
			UIFactory["Folder"].displayTree(dest,'list',langcode,id);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
		
		//===== test data
		var test_dataFolders= "<folders count='3'>"
				+"<folder id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></folder>"
				+"<folder id='2' count='3' nb_children='52' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></folder>"
				+"<folder id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></folder>"
				+"</folders>";
		var test_dataFoldersStruct_byid = {};
		test_dataFoldersStruct_byid['1']= "<folder id='1.1' count='0' nb_children='0' modified='2019-12-02 12:19:02.0' ownerid='20'>"
				+"<code>folder1.1</code>"
				+"<label lang='en'>Folder 1.1</label>"
				+"<label lang='fr'>Dossier 1.1</label>"
				+"</folder>";
		test_dataFoldersStruct_byid['2']= "<folders>"
				+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
				+"<folder id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
				+"<folder id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></folder>"
				+"</folders>";
		test_dataFoldersStruct_byid['2.1']= "<folders>"
			+"<folder id='2.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.1</code><label lang='en'>Folder 2.1.1</label><label lang='fr'>Dossier 2.1.1</label></folder>"
			+"<folder id='2.1.2' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.2</code><label lang='en'>Folder 2.1.2</label><label lang='fr'>Dossier 2.1.2</label></folder>"
			+"</folders>";
		test_dataFoldersStruct_byid['2.1.1']= "<folders></folders>";
		test_dataFoldersStruct_byid['2.3']= "<folders>"
			+"<folder id='2.3.1' count='1' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></folder>"
			+"</folders>";
		test_dataFoldersStruct_byid['2.3.1']= "<folders>"
			+"<folder id='2.3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3.1.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></folder>"
			+"</folders>";
		test_dataFoldersStruct_byid['2.1.2']= "<folders>"
			+"<folder id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></folder>"
			+"</folders>";
		test_dataFoldersStruct_byid['2.1.2.1']= "<folders></folders>";
		test_dataFoldersStruct_byid['2.1.2.1']= "<folders>"
			+"</folders>";
		test_dataFoldersStruct_byid['3']= "<folders>"
				+"<folder id='3.1' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></folder>"
				+"<folder id='3.2' count='0' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></folder>"
				+"</folders>";
		test_dataFoldersStruct_byid['3.1']= "<folders>"
			+"<folder id='3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1.1</code><label lang='en'>Folder 3.1.1</label><label lang='fr'>Dossier 3.1.1</label></folder>"
			+"<folder id='3.1.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1.2</code><label lang='en'>Folder 3.1.2</label><label lang='fr'>Dossier 3.1.2</label></folder>"
			+"</folders>";
		test_dataFoldersStruct_byid['3.2']= "<folders></folders>";
		test_dataFoldersStruct_byid['3.1.1']= "<folders></folders>";
		test_dataFoldersStruct_byid['3.1.2']= "<folders></folders>";
		//==================================
	var data = null;
	number_of_folders = 3;
	if (id==undefined||id==null) {
		data=test_dataFolders;
		UIFactory["Folder"].parse(data);
		UIFactory["Folder"].displayAll('folders','list');
	}
	else {
		data = test_dataFoldersStruct_byid[id];
		UIFactory["Folder"].parseStructure(data,id); 
		UIFactory["Folder"].displayTree(dest,'list',langcode,id);		
	}
}

//==================================
function loadAndDisplayFolderContent(dest,id,langcode,type) {
//==================================
	$("#wait-window").show();
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (folders_byid[id].nb_folders > 0){
		loadAndDisplayFolderStruct('collapse_folder_'+id,id,langcode)
	}
	toggleOpenElt('closeSign','openSign','folder_'+id);
	var index_class = "pageindex";
	UIFactory["Folder"].displayFolderContent(dest,id,langcode,index_class);
	selectElt('folder','folder_'+id);
	var dest_page = dest + '-pages';
	var list = folders_byid[id].chidren_list[folders_byid[id].pageindex];
	if (list==undefined||list==null){
		loadFolderContent(dest_page,id,langcode,type,index_class);		
	}
	else {
		folders_byid[id].displayFolderContentPage(dest_page,type,langcode,index_class);		
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
function loadAndDisplayFolderContentPage(dest,type,id,langcode,pageindex,index_class) {
//==================================
	$("#wait-window").show();
	folders_byid[id].pageindex = ""+pageindex;
	var list = folders_byid[id].chidren_list[folders_byid[id].pageindex];
	if (list==undefined||list==null)
		loadFolderContent(dest,id,langcode,type,index_class);
	else {
		folders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);		
	}
	$("#wait-window").hide();
}

//==============================
function loadFolderContent(dest,id,langcode,type,index_class)
//==============================
{
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folders?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Folder"].parse_add(data);
			UIFactory["Folder"].displayFolderContent(dest,id);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
	//===== test data
	var test_dataFolders= "<folder id='0' count='3' nb_children='3' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'>"
		+"<code>userid</code>"
		+"<label lang='en'>Folder userid</label>"
		+"<label lang='fr'>Dossier userid</label>"
			+"<folders count='3'>"
			+"<folder id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></folder>"
			+"<folder id='2' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></folder>"
			+"<folder id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></folder>"
			+"</folders>"
			+"</folder>";
	var test_dataFolders_byid = {};
	test_dataFolders_byid['1']= {};
	test_dataFolders_byid['2']= {};
	test_dataFolders_byid['3']= {};
	test_dataFolders_byid['2.1']= {};
	test_dataFolders_byid['2.2']= {};
	test_dataFolders_byid['2.1.1']= {};
	test_dataFolders_byid['2.1.2']= {};
	test_dataFolders_byid['2.3']= {};
	test_dataFolders_byid['2.3.1']= {};
	test_dataFolders_byid['2.3.1.1']= {};
	test_dataFolders_byid['3.1']= {};
	test_dataFolders_byid['3.2']= {};
	test_dataFolders_byid['3.1.1']= {};
	test_dataFolders_byid['3.1.2']= {};
	
	test_dataFolders_byid['1']['1']= "<folder id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'>"
			+"<code>folder1</code>"
			+"<label lang='en'>Folder 1</label>"
			+"<label lang='fr'>Dossier 1</label>"
			+"</folder>";
	test_dataFolders_byid['1']['1']= "<children pageindex='1' count='4'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"</children>";
	test_dataFolders_byid['2']= {};
	test_dataFolders_byid['2']['1']= "<folder id='2' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-10-02 12:19:02.0'>"
			+"<code>folder2</code>"
			+"<label lang='en'>Folder 2</label>"
			+"<label lang='fr'>Dossier 2</label>"
			+"<portfolios>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
			"</portfolios>"
			+"<folders>"
			+"<folder id='2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
			+"<folder id='2.2' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
			+"</folders>"
			+"</folder>";
	test_dataFolders_byid['2']['1']= "<children pageindex='1' count='7'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
		+"<folder id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
		+"<folder id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>folder2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></folder>"
		+"</children>";
	test_dataFolders_byid['2']['1']= "<children pageindex='1' count='5'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
		+"</children>";
	test_dataFolders_byid['2']['2']= "<children pageindex='2' count='2'>"
		+"<folder id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
		+"<folder id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>folder2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></folder>"
		+"</children>";
	test_dataFolders_byid['2']['3']= "<children pageindex='3' count='5'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
		+"</children>";
	test_dataFolders_byid['2']['4']= "<children pageindex='2' count='2'>"
		+"<folder id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
		+"<folder id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>folder2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></folder>"
		+"</children>";
	test_dataFolders_byid['2']["5"]= "<children pageindex='3' count='5'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
		+"</children>";
	test_dataFolders_byid['2.1']= "<folders pageindex='1' count='2'>"
		+"<folder id='2.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.1</code><label lang='en'>Folder 2.1.1</label><label lang='fr'>Dossier 2.1.1</label></folder>"
		+"<folder id='2.1.2' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.2</code><label lang='en'>Folder 2.1.2</label><label lang='fr'>Dossier 2.1.2</label></folder>"
		+"</folders>";
	test_dataFolders_byid['2.1.1']['1']= "<children>"
		+"</children>";
	test_dataFolders_byid['2.1.2']['1']= "<folders pageindex='1' count='1'>"
		+"<folder id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></folder>"
		+"</folders>";
	test_dataFolders_byid['2.3']['1']= "<folders pageindex='1' count='1'>"
		+"<folder id='2.3.1' count='1' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></folder>"
		+"</folders>";
	test_dataFolders_byid['2.3.1']['1']= "<folders pageindex='1' count='1'>"
		+"<folder id='2.3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3.1.1</code><label lang='en'>Folder 2.3.1.1</label><label lang='fr'>Dossier 2.3.1</label></folder>"
		+"</folders>";
	test_dataFolders_byid['2.1.2']['1']= "<folders pageindex='1' count='1'>"
		+"<folder id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></folder>"
		+"</folders>";
	test_dataFolders_byid['3']['1']= "<folder id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2020-01-12 12:19:02.0'>"
			+"<code>folder3</code>"
			+"<label lang='en'>Folder 3</label>"
			+"<label lang='fr'>Dossier 3</label>"
			+"<folders>"
			+"<folder id='3.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></folder>"
			+"<folder id='3.2' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></folder>"
			+"</folders>"
			+"</folder>";
	test_dataFolders_byid['3']['1']= "<children pageindex='1' count='2'>"
		+"<folder id='3.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>folder3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></folder>"
		+"<folder id='3.2' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></folder>"
		+"</children>";
	test_dataFolders_byid['3.1']['1']= "<folders pageindex='1' count='2'>"
		+"<folder id='3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1.1</code><label lang='en'>Folder 3.1.1</label><label lang='fr'>Dossier 3.1.1</label></folder>"
		+"<folder id='3.1.2' count='0' nb_children='4' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3.1.2</code><label lang='en'>Folder 3.1.2</label><label lang='fr'>Dossier 3.1.2</label></folder>"
		+"</folders>";
	test_dataFolders_byid['3.1.1']['1']= "<children>"
		+"</children>";
	test_dataFolders_byid['3.1.2']['1']= "<children pageindex='1' count='4'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"		
		+"</children>";
	var data = null;
	var pageindex = folders_byid[id].pageindex;
	data = test_dataFolders_byid[id][""+pageindex];
	UIFactory["Folder"].parseChildren(data,id); 
	folders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);		
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
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory."+type+".del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//==================================
function toggleElt(closeSign,openSign,eltid) { // click on open/closeSign
//==================================
	var elt = document.getElementById("toggle_"+eltid);
	elt.classList.toggle(openSign);
	elt = document.getElementById("collapse_"+eltid);
	elt.classList.toggle('active');
	if ($("#toggle_"+eltid).hasClass(openSign))
	{
		localStorage.setItem('sidebar'+eltid,'open');
	} else {
		localStorage.setItem('sidebar'+eltid,'closed');
	}
}

//==================================
function toggleOpenElt(closeSign,openSign,eltid)
{ // click on label
//==================================
	var cookie = localStorage.getItem('sidebar'+eltid);
	if (cookie == "closed") {
		localStorage.setItem('sidebar'+eltid,'open');
		document.getElementById("toggle_"+eltid).classList.add('openSign');
		document.getElementById("collapse_"+eltid).classList.add('active');
	}
}

//==================================
function selectElt(type,uuid)
{ // click on label
//==================================
	$('.'+type).removeClass('active');
//	$('#'+uuid).addClass('active');
	document.getElementById(uuid).classList.add('active');
}

//==================================
function selectElts(type,list)
{ // click on label
//==================================
	$('.'+type).removeClass('active');
	for (var i=0;i<list.length;i++) {
		$('#'+list[i]).addClass('active');
	}
}
//==================================
function displayPagesNavbar(nb_index,id,langcode,pageindex,index_class,callback,param1,param2)
{
//==================================
	var html = [];
	for (var i=0;i<pagegNavbar_list.length;i++) {
		html[i] = "";
		$("#"+index_class+pagegNavbar_list[i]).html($(""));
	}
	var min_prev = Math.max((pageindex-nbPagesIndexStep), 1);
	var max_next = Math.min((pageindex+nbPagesIndexStep), nb_index);
	var str1, srt2;
	if (1 < min_prev) {
		str1 = "<span class='"+index_class+"' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+(pageindex-1)+",'"+index_class+"');\" id='"+index_class+i+"_";
		str2 = "'>"+karutaStr[LANG]["prev"]+"</span><span class='"+index_class+"0'>...</span>";
		for (var j=0;j<pagegNavbar_list.length;j++) {
			html[j] += str1+pagegNavbar_list[j]+str2;
		}
	}
	for (var i=min_prev;i<=max_next;i++) {
		str1 = "<span class='"+index_class+"' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+i+",'"+index_class+"');\" id='"+index_class+i+"_";
		str2 = "'>"+i+"</span>";
		for (var j=0;j<pagegNavbar_list.length;j++) {
			html[j] += str1+pagegNavbar_list[j]+str2;
		}
	}
	if (max_next < nb_index) {
		str1 = "<span class='"+index_class+"0'>...</span><span class='"+index_class+"' onclick=\"javascript:"+callback+"('"+param1+"','"+param2+"','"+id+"',"+langcode+","+(pageindex+1)+",'"+index_class+"');\" id='"+index_class+i+"_";
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
}

//*** à déplacer dans langguages *.js
karutaStr['fr']['next']="Suivant >";
karutaStr['fr']['prev']="< Précédent";
karutaStr['fr']['karuta.folder']="Créer un dossier de portfolios";
//---------------
karutaStr['en']['next']="Next >";
karutaStr['en']['prev']="< Prev";
karutaStr['en']['karuta.folder']="Create a portfolio folder";
karutaStr['en']['karuta.folder']="Create a portfolio folder";

