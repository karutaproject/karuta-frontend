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
//var pagegNavbar_list = ["top","bottom"];
var number_of_folders = 0;
var loadedFolders = {};

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
	} else
		this.nb_folders = 0;
	if ($(node).attr('nb_children')!=undefined) {
		this.nb_children = $(node).attr('nb_children');
	} else
		this.nb_children = 0;
	this.loadedStruct = false;
	this.folders_list = [];
	this.loadedFolder = false;
	this.pageindex = '1';
	this.children_list = {};
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
UIFactory["Folder"].displayTree = function(dest,type,langcode,parentid)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	var list = [];
	if (parentid==undefined || parentid==null)
		list = folders_list;
	else list = folders_byid[parentid].folders_list;
	var html="";
	for (var i = 0; i < list.length; i++) {
		html += list[i].getTreeNodeView(type,langcode);
	}
	if (parentid=="0" && folders_byid[parentid].nb_children>0)
		html += folders_byid[parentid].getTreeNodeView(type,langcode);
	document.getElementById(dest).innerHTML = html;
	if (parentid=="0" && folders_byid[parentid].nb_children>0) {
		$("#label_0").html("<span><span id='toggle_folder_0' class='closeSign' onclick=\"javascript:loadAndDisplayFolderStruct('collapse_folder_0','0');\"></span><span>PROJETS</span><span class='number_of_folders badge' id='projects-nb'></span><button class='btn list-btn' onclick='UIFactory.Portfolio.createProject()'>"+karutaStr[LANG]['create_project']+"</button></span>");
		$("#label_0").attr("style","color:var(--list-title-color);");
	}

}

//==================================
UIFactory["Folder"].prototype.getTreeNodeView = function(type,langcode)
//==================================
{
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var html = "";
	html += "<div id='folder_"+this.id+"' class='treeNode folder'>";
	html += "	<div id='label_"+this.id+"' class='row-label'>";
	if (this.nb_folders>0){
		html += "		<span id='toggle_folder_"+this.id+"' class='closeSign' onclick=\"javascript:loadAndDisplayFolderStruct('collapse_folder_"+this.id+"','"+this.id+"');\"></span>";
	}
	html += "		<span id='folderlabel_"+this.id+"' onclick=\"javascript:loadAndDisplayFolderContent('folder-portfolios','"+this.id+"','"+langcode+"','list');\" class='folder-label'>"+folder_label+"&nbsp;<span class='badge number_of_folders' id='number_of_folders_"+this.id+"'>"+this.nb_folders+"</span>";
	html += "&nbsp;<span class='badge number_of_items' id='number_of_folder_items_"+this.id+"'>"+this.nb_children+"</span></span>";
	html += "	</div>";
	if (this.nb_folders>0)
		html += "	<div id='collapse_folder_"+this.id+"' class='nested'></div>";
	html += "</div><!-- class='folder'-->";
	return html;
}
/*
//==================================
UIFactory["Folder"].XXXgetTreeNodeView = function(dest,type,langcode,id)
//==================================
{
	var folder = folders_byid[id];
	//---------------------	
	var folder_label = folder.label_node[langcode].text();
	var html = "";
	html += "<div id='folder_"+folder.id+"' class='treeNode folder'>";
	html += "	<div id='label_"+this.id+"' class='row-label'>";
	if (folder.nb_folders>0)
		html += "		<span id='toggle_folder_"+folder.id+"' class='closeSign' onclick=\"javascript:loadAndDisplayFolderStruct('collapse_folder_"+folder.id+"','"+folder.id+"');\"></span>";
//		html += "		<span id='toggle_folder_"+folder.id+"' class='closeSign' onclick=\"javascript:toggleElt('closeSign','openSign','folder_"+folder.id+"');loadAndDisplayFolderStruct('collapse_folder_"+folder.id+"','"+folder.id+"');\"></span>";
	html += "		<span id='folderlabel_"+folder.id+"' onclick=\"javascript:loadAndDisplayFolderContent('folder-portfolios','"+folder.id+"');selectElt('folder','folder_"+folder.id+"');selectElt('row-label','label_"+folder.id+"');\" class='folder-label'>"+folder_label+"&nbsp;<span class='number_of_folders badge' id='number_of_folders_"+folder.id+"'>"+folder.nb_folders+"</span></span>";
	html += "	</div>";
	if (folder.nb_folders>0)
		html += "	<div id='collapse_folder_"+folder.id+"' class='nested'>abcdef</div>";
	html += "</div><!-- class='folder'-->";
	return html;
}
*/
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
		html += "			<a class='dropdown-item' id='remove-"+folder.id+"' style='display:block' onclick=\"UIFactory['Portfolio'].removeProject('"+folder.id+"','"+folder.code+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
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
		html += "					<a class='dropdown-item' onclick=\"UIFactory['Folder'].createFolder('"+foldercode+"','karuta.folder')\" >"+karutaStr[LANG]['karuta.folder']+"</a>";
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
	var folders_list = this.folders_list;
	var children_list = this.children_list[this.pageindex];
	//---------------------
	var html = "";
	for (var i=0; i<folders_list.length;i++){
		var folder = folders_list[i];
		html += "<div class='row folder-row' id='item-folder_"+folder.id+"'>";
		html += folder.getView("#item-folder_"+folder.id,type,langcode);
		html += "</div>";
	}
	for (var i=0; i<children_list.length;i++){
		if(i==0)
			html += "<hr>";
		var portfolio = children_list[i];
		var owner = (Users_byid[portfolio.ownerid]==null) ? "":Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
		html += "<div class='row portfolio-row' id='item-portfolio_"+portfolio.id+"'>";
		html += portfolio.getPortfolioView("#item-portfolio_"+portfolio.id,type,langcode,portfolio.code_node.text(),owner);
		html += "</div>";
		}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_children)/nbItem_par_page);
	if (nb_index>1) {
		displayPagesNavbar(nb_index,this.id,langcode,parseInt(this.pageindex),index_class,'loadAndDisplayFolderContentPage',dest,"list");		
	}
	$(window).scrollTop(0);
}
/*
//==================================
UIFactory["Folder"].displayFolderXXXContentPage = function(dest,type,itself,langcode,index_class)
//==================================
{
	$("#"+dest).html("");
	if (langcode==null)
		langcode = LANGCODE;
	var folders_list = itself.folders_list;
	var children_list = itself.chidren_list[itself.pageindex];
	//---------------------
	var html = "";
	for (var i=0; i<folders_list.length;i++){
			html += "<div class='row folder-row' id='item-folder_"+item.id+"'>";
			html += item.getView("#item-folder_"+item.id,type,langcode);
			html += "</div>";
	}
	for (var i=0; i<children_list.length;i++){
			var owner = (Users_byid[item.ownerid]==null) ? "":Users_byid[item.ownerid].getView(null,'firstname-lastname',null);
			html += "<div class='row portfolio-row' id='item-portfolio_"+item.id+"'>";
			html += item.getPortfolioView("#item-portfolio_"+list[i].id,type,langcode,item.code_node.text(),owner);
			html += "</div>";
		}
	$("#"+dest).html($(html));
	$(window).scrollTop(0);
}
*/
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
			html += " <button class='btn' onclick=\"confirmDelFolder('"+this.id+"')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
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
			html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callRenameMove('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename-move"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Folder'].copy('"+self.id+"','"+self.code+"-copy',true)\" ><i class='fa fa-file-o'></i><i class='far fa-copy'></i> "+karutaStr[LANG]["button-duplicate"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.remove('"+self.id+"')\" ><i class='fas fa-trash'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+self.id+"?resources=true&files=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-with-files"]+"</a>";
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callChangeOwner('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
	} else {
		if (USER.admin){
			html += "<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.confirmRemove('"+gid+"','"+self.id+"')\" ><span class='fas fas-trash'></span> "+karutaStr[LANG]["button-remove-from-group"]+"</a>";
		}
	}
	html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callShareUsers('"+self.id+"')\" ><i class='fas fa-share-square'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
	html += "<a class='dropdown-item' onclick=\"UIFactory.Folder.callShareUsersGroups('"+self.id+"')\" ><i class='fas fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
	html += "</div><!-- class='dropdown-menu' -->";
	html += "</div><!-- class='dropdown' -->";
	return html;
}

//==================================
UIFactory["Folder"].prototype.update = function(node)
//==================================
{
	var current_node = this.node;
	if ($("code",node)!=undefined){
		this.code_node = $("code",node);
		this.code = $(this.code_node).text();
		$("code",current_node).replaceWith( $("code",node));
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
			$("label[lang='"+languages[i]+"']",current_node).replaceWith( $("label[lang='"+languages[i]+"']",node));
		}
	}
	this.node = current_node;
}

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
UIFactory["Folder"].parseChildren = function(data,parentId,index_class) 
//==================================
{
	var items = $("portfolio",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (portfolios_byid[id]==undefined)
			portfolios_byid[id] = new UIFactory["Portfolio"](items[i]);
		var code = portfolios_byid[id].code_node.text();
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	folders_byid[parentId].children_list[index_class] = [];
	for (var i=0; i<newTableau1.length; i++){
			folders_byid[parentId].children_list[index_class][i] = portfolios_byid[newTableau1[i][1]];
	}
	folders_byid[parentId].loadedChildren = true;
//	folders_byid[parentId].nb_children = folders_byid[parentId].children_list[index_class].length;
};

//==================================
UIFactory["Folder"].parseChildren2 = function(data,parentId) 
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

//==================================
function loadAndDisplayFolderStruct(dest,folderid,langcode) {
//==================================
	$("#wait-window").show();
	if (folderid!="0" || dest!='list')
		toggleElt('closeSign','openSign','folder_'+folderid);
	if (folderid=="0" && dest!='list') {
		//-------------------For backward compatibility--------------------------
		var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : url1,
			success : function(data) {
				g_nb_trees = parseInt($('portfolios',data).attr('count'));
				//---------------------------------------------------
				if (g_nb_trees==null || g_nb_trees<100) {
					//--------we load all the portfolios-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1",
						success : function(data) {
							UIFactory["Portfolio"].parse(data);
							UIFactory["Portfolio"].displayAll('portfolios','list');
							if ($("#content-portfolios-not-in-project").html()=="" && $("#portfolios-nb").html()=="")
								$("#portfolios-div").hide();
							if ($("#project-portfolios").html()=="")
								$("#project-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1: "+textStatus);
						}
					});
					//---------------------------------------------------
				} else {
					//--------we load the projects-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=true",
						success : function(data) {
							var nb_projects = parseInt($('portfolios',data).attr('count'))-1;
							UIFactory["Portfolio"].parse(data);
							UIFactory["Portfolio"].displayAll(dest,'list');
							if ($("#project-portfolios").html()=="")
								$("#project-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1&project=true: "+textStatus);
							$("#wait-window").hide();
						}
					});
					//--------we count how many portfolios are outside projects-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=false&count=true",
						success : function(data) {
							var nb_portfolios = parseInt($('portfolios',data).attr('count'));
							if (nb_portfolios==0)
								$("#portfolios-div").hide();
							else
								$("#portfolios-nb").html(nb_portfolios);
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1&project=false: "+textStatus);
							$("#wait-window").hide();
						}
					});
				}
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Server Error GET active-count: "+textStatus);
				$("#wait-window").hide();
			}
		});
	} else 
		if (!folders_byid[folderid].loadedStruct) {
			loadFolderStruct(dest,folderid,langcode);
		} else {
			UIFactory.Folder.displayTree(dest,'list',langcode,folderid);
		}

	$("#wait-window").hide();
}

//==============================
function loadFolder(dest,folderid)
//==============================
{
	var url = serverBCK_API+"/folders?folderid="+folderid;
	if (folderid=="0") {
		url = serverBCK_API+"/folders?foldercode="+USER.username;
	}
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			UIFactory.Folder.parse(data);
			loadFolderStruct(dest,folderid);
		},
		error : function(jqxhr,textStatus) {
//			alertHTML("Server Error GET active: "+textStatus);
			var data = "";
			if (folderid=="0")
				data =	"<folders><folder id='0' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>ROOT</label><label lang='fr'>ROOT</label></folder></folders>";
			UIFactory.Folder.parse(data);
			loadFolderStruct(dest,folderid);
		}
	});
}

//==============================
function loadFolderStruct(dest,folderid,langcode)
//==============================
{
	var url = serverBCK_API+"/folders?folderid="+folderid;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			UIFactory["Folder"].parseStructure(data,folderid); 
			UIFactory.Folder.displayTree(dest,'list',langcode,folderid);
		},
		error : function(jqxhr,textStatus) {
//			alertHTML("Server Error GET active: "+textStatus);
			var data = "";
			if (folderid=="0")
				data =	"<folders>"
						+"<folder id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></folder>"
						+"<folder id='2' count='3' nb_children='4' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></folder>"
						+"<folder id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></folder>"
						+"</folders>";
			if (folderid=="1")
				data =	"<folders>"
						+"<folder id='1.1' count='0' nb_children='0' modified='2019-12-02 12:19:02.0' ownerid='20'><code>folder1.1</code><label lang='en'>Folder 1.1</label><label lang='fr'>Dossier 1.1</label></folder>";
						+"</folders>";

			if (folderid=="2")
				data ="<folders>"
						+"<folder id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></folder>"
						+"<folder id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></folder>"
						+"<folder id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></folder>"
						+"</folders>";
			UIFactory["Folder"].parseStructure(data,folderid); 
			UIFactory.Folder.displayTree(dest,'list',langcode,folderid);
			if (folderid=="0") {
				var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : url1,
					success : function(data) {
						g_nb_trees = parseInt($('portfolios',data).attr('count'));
						folders_byid[folderid].nb_children = g_nb_trees;
						UIFactory.Folder.displayTree(dest,'list',langcode,folderid);
					}
				});
			}
		}
	});
}

//==================================
function loadAndDisplayFolderContent(dest,id,langcode,type)
//==================================
{
	$("#wait-window").show();
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (folders_byid[id].nb_folders > 0){
		loadAndDisplayFolderStruct('collapse_folder_'+id,id,langcode)
	}
	toggleOpenElt('closeSign','openSign','folder_'+id);
	var index_class = folders_byid[id].pageindex;
	UIFactory["Folder"].displayFolderContent(dest,id,langcode,index_class);
	selectElt('folder','folder_'+id);
	selectElt('row-label','label_'+id);
	var dest_page = dest + '-pages';
	if (jQuery.isEmptyObject(folders_byid[id].children_list))
		loadFolderContent(dest_page,id,langcode,type,index_class);
	else
		folders_byid[id].displayFolderContentPage(dest_page,type,langcode,index_class);		
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
function loadAndDisplayFolderContentPage(dest,type,id,langcode,pageindex,index_class)
//==================================
{	$("#wait-window").show();
	folders_byid[id].pageindex = ""+pageindex;
	var list = folders_byid[id].chidren_list[folders_byid[id].pageindex];
	if (list==undefined||list==null)
		loadFolderContent(dest,id,langcode,type,index_class);
	else
		folders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);
	$("#wait-window").hide();
}

//==============================
function loadFolderContent(dest,folderid,langcode,type,index_class)
//==============================
{
	if (folderid=="0") {
		//	data =	"<portfolios></portfolios>";
		//-------------------For backward compatibility--------------------------
		var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : url1,
			success : function(data) {
				g_nb_trees = parseInt($('portfolios',data).attr('count'));
				//---------------------------------------------------
				if (g_nb_trees==null || g_nb_trees<100) {
					//--------we load all the portfolios-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1",
						success : function(data) {
	//						UIFactory["Portfolio"].parse(data);
	//						UIFactory["Portfolio"].displayAll('portfolios','list');
							UIFactory.Folder.parseChildren(data,folderid,index_class);
							folders_byid[folderid].displayFolderContentPage(dest,type,langcode,index_class);
							if ($("#content-portfolios-not-in-project").html()=="" && $("#portfolios-nb").html()=="")
								$("#portfolios-div").hide();
							if ($("#project-portfolios").html()=="")
								$("#project-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1: "+textStatus);
						}
					});
					//---------------------------------------------------
				} else {
					//--------we load the projects-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=true",
						success : function(data) {
							var nb_projects = parseInt($('portfolios',data).attr('count'))-1;
	//						UIFactory["Portfolio"].parse(data);
	//						UIFactory["Portfolio"].displayAll('portfolios','list');
							UIFactory.Folder.parseChildren(data,folderid,index_class);
							folders_byid[folderid].displayFolderContentPage(dest,type,langcode,index_class);
							if ($("#project-portfolios").html()=="")
								$("#project-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1&project=true: "+textStatus);
							$("#wait-window").hide();
						}
					});
					//--------we count how many portfolios are outside projects-----------------------
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=false&count=true",
						success : function(data) {
							var nb_portfolios = parseInt($('portfolios',data).attr('count'));
							if (nb_portfolios==0)
								$("#portfolios-div").hide();
							else
								$("#portfolios-nb").html(nb_portfolios);
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1&project=false: "+textStatus);
							$("#wait-window").hide();
						}
					});
				}
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Server Error GET active-count: "+textStatus);
				$("#wait-window").hide();
			}
		});
	}
	if (folders_byid[folderid].nb_children<50)
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfoliosXXX?active=1&folder="+folderid,
			success : function(data) {
				UIFactory["Folder"].parse_add(data);
				UIFactory["Folder"].displayFolderContent(dest,id);
			},
			error : function(jqxhr,textStatus) {
//				alertHTML("Server Error GET active: "+textStatus);

				if (folderid=="1")
					data =	"<portfolios></portfolios>";
	
				if (folderid=="2")
					data =	"<portfolios>"
							+"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
							"</portfolios>";
	
				UIFactory.Folder.parseChildren(data,folderid,index_class);
				folders_byid[folderid].displayFolderContentPage(dest,type,langcode,index_class);
			}
		});
	else {
		
	}
	/*
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
	*/
}

