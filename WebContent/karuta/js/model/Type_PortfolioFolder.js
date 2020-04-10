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
var nb_folders = 0;
var portfoliosnotinproject = [];
var folder_last_drop = "";
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

//==================================
UIFactory["PortfolioFolder"] = function(node)
//==================================
{
	this.id = $(node).attr('id');
	this.owner = $(node).attr('owner');
	this.ownerid = $(node).attr('ownerid');
	this.rootid = $("asmRoot",node).attr("id");
	this.node = node;
	this.code_node = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",node));
	this.semantictag = $("metadata",node).attr('semantictag');
	//------------------------------
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",node)[0]);
		if (this.label_node[i].length==0) {
			var newElement = createXmlElement("label");
			$(newElement).attr('lang', languages[i]);
			$(newElement).text(karutaStr[languages[languages[i]],'new']);
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newElement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",node)[0]);
		}
	}
	//------------------------------
	this.context = $("asmRoot>asmResource[xsi_type='context']",node);
	this.context_text_node = [];
	//------------------------------
	for (var i=0; i<languages.length;i++){
		this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmRoot>asmResource[xsi_type='context']",node)[0]);
		if (this.context_text_node[i].length==0) {
			var newElement = createXmlElement("text");
			$(newElement).attr('lang', languages[i]);
			$("asmResource[xsi_type='context']",node)[0].appendChild(newElement);
			this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmRoot>vasmResource[xsi_type='context']",node)[0]);
		}
	}
	//------------------------------
	this.display = {};
	this.displayLabel = {};
	//------------------------------
	this.loaded = false;
	this.pageindex = '1';
	this.children = {};
	this.folders = {};
	this.display = {};
	var url = 
	this.nbfolders = 0;
	this.nbchildren = 0;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&count=true&project="+$(this.code_node).text()+".",
		folder:this,
		success : function(data) {
			this.folder.nbchildren = parseInt($('portfolios',data).attr('count'));
		}
	});
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------ DRAG AND DROP -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
function dragPortfolioFolder(ev)
//==================================
{
	var portfolioid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	ev.dataTransfer.setData("uuid", portfolioid);
	ev.dataTransfer.setData("type", 'folder');
}

//==================================
function ondragoverPortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color-complement');
	event.target.style.outline = "3px solid "+bckcolor;
}

//==================================
function ondragleavePortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	event.target.style.outline = "0px solid white";
}

//==================================
function dropPortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	event.target.style.outline = "0px solid white";
	//----------srce----------------------
	var portfolioid = ev.dataTransfer.getData("uuid");
	var type = ev.dataTransfer.getData("type");
	var parentid = ev.dataTransfer.getData("parentid");
	var index = ev.dataTransfer.getData("index");
	//---------target------------------------
	var folderid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var portfolio_code = portfolios_byid[portfolioid].code_node.text();
	var folder_code = folders_byid[folderid].code_node.text();
	var current_drop = portfolioid+"/"+folderid;
	//---------------------------------
	if (current_drop!=folder_last_drop) {
		folder_last_drop = current_drop;
		if (type="folder"&& current_drop!=folder_last_drop) {
			
			alert("moveFolder:"+id+" -> "+folderid);
			UIFactory.UsersGroup.moveFolder(id,folderid);
		}
		if (type="portfolio") {
			var newportfolio_code = folder_code + portfolio_code.substring(portfolio_code.indexOf('.'));
			UIFactory.Portfolio.renamePortfolioCode(portfolios_byid[portfolioid],newportfolio_code);
			folders_byid[parentid].loaded = false;
			folders_byid[folderid].loadFolderContent(index);
			UIFactory.PortfolioFolder.displayFolders();
			folders_byid[parentid].loadAndDisplayFolderContent('','list',"0");
		}
	}
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ LOADERS -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].loadAndDisplayFolders = function (dest,type)
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=true",
		success : function(data) {
			nb_folders = parseInt($('portfolios',data).attr('count'));
			UIFactory["Portfolio"].parse(data);
			UIFactory["PortfolioFolder"].parse(data);
			UIFactory["PortfolioFolder"].displayFolders(dest,type);
			//--------------------------------------
			if (nb_folders==0 && !USER.admin && !USER.creator) {
				$("#folders-label").hide();
			} else {
				$("#nb_folders_active").html(nb_folders);
			}
			//--------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET UIFactory.PortfolioFolder.loadAndDisplayFolders: "+textStatus);
			$("#wait-window").hide();
		}
	});
}

//==================================
UIFactory["PortfolioFolder"].parse = function(data) 
//==================================
{
	folders_byid = {};
	folders_list = [];
	var tableau1 = new Array();
	var uuid = "";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			folders_byid[uuid] = new UIFactory["PortfolioFolder"](items[i]);
			var code = folders_byid[uuid].code_node.text();
			if (code.indexOf(".")<0)
				code += ".";
			tableau1[i] = [code,uuid];
		} catch(e) {
			var del = alert("Erreur folder"+uuid+" - code:"+code);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//-----------------------------------
//	for (var i=0; i<newTableau1.length; i++){
//		folders_list[i] = folders_byid[newTableau1[i][1]]
//	}
	//------------------------------------
	for (var i=0; i<newTableau1.length; i++){
		var folder_code = newTableau1[i][0];
		var folder_id = newTableau1[i][1]
		if (folder_code.indexOf('/')<0)
			folders_list.push(folders_byid[folder_id]);
		else
			UIFactory.PortfolioFolder.addFolder(newTableau1,folder_code,folder_id);
	}
	//------------------------------------
};

//==================================
UIFactory["PortfolioFolder"].addFolder = function(newTableau1,code,folder_id)
//==================================
{
	var code = code.substring(0,code.lastIndexOf('/'))+".";
	var found = false;
	for (var j=0;j<newTableau1.length;j++) {
		if (code==newTableau1[j][0]) {
			var uuid = newTableau1[j][1];
			folders_byid[uuid].folders[folder_id] = {'id':uuid};
			folders_byid[uuid].nbfolders++;
			found = true;
			break;
		}
	}
	if (!found && code!=".")
		UIFactory.PortfolioFolder.addFolder(newTableau1,code,folder_id);
	else if (code=='.')
			folders_list.push(folders_byid[folder_id]);
}

//==================================
UIFactory["PortfolioFolder"].prototype.toggleFolderContent = function(dest,type,index)
//==================================
{
	if ($("#tree_label_"+this.id).hasClass('active')) {
		cleanList();
		localStorage.setItem('currentDisplayedFolderCode','none');
	} else {
		cleanList();
		if (this.loaded)
			this.displayFolderContent();
		else
			this.loadAndDisplayFolderContent(dest,type,index);
		$(".row-label").removeClass('active');
		$("#tree_label_"+this.id).addClass('active');
		localStorage.setItem('currentDisplayedFolderCode',this.code_node.text());
	}
}

//==============================
UIFactory["PortfolioFolder"].prototype.loadAndDisplayFolderContent = function (dest,type,index)
//==============================
{
	if (index==null)
		index = "0";
	$.ajax({
		folder : this,
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+this.code_node.text()+".",
		success : function(data) {
			this.folder.nbchildren = parseInt($('portfolios',data).attr('count'));
			$("#nbchildren_"+this.folder.id).html(this.folder.nbchildren)
			UIFactory["Portfolio"].parse_add(data);
			this.folder.loaded = true;
			//-------------------------
			var tableau1 = new Array();
			var uuid = "";
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				uuid = $(items[i]).attr('id');
				var code = portfolios_byid[uuid].code_node.text();
				tableau1[tableau1.length] = [code,uuid];
			}
			var newTableau1 = tableau1.sort(sortOn1);
			this.folder.children[index] = {};
			for (var i=0; i<newTableau1.length; i++){
				this.folder.children[index][newTableau1[i][1]] = {'id':newTableau1[i][1]};
			}
			//-------------------------
			this.folder.displayFolderContent(dest,type);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==============================
UIFactory["PortfolioFolder"].prototype.loadFolderContent = function (index)
//==============================
{
	if (index==null)
		index = "0";
	$.ajax({
		async: false,
		folder : this,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+this.code_node.text()+".",
		success : function(data) {
			this.folder.nbchildren = parseInt($('portfolios',data).attr('count'));
			$("#nbchildren_"+this.folder.id).html(this.folder.nbchildren)
			UIFactory["Portfolio"].parse_add(data);
			this.folder.loaded = true;
			//-------------------------
			var tableau1 = new Array();
			var uuid = "";
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				uuid = $(items[i]).attr('id');
				var code = portfolios_byid[uuid].code_node.text();
				tableau1[tableau1.length] = [code,uuid];
			}
			var newTableau1 = tableau1.sort(sortOn1);
			this.folder.children[index] = {};
			for (var i=0; i<newTableau1.length; i++){
				this.folder.children[index][newTableau1[i][1]] = {'id':newTableau1[i][1]};
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ DISPLAY -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].displayFolders = function(dest,type)
//==================================
{
	number_of_projects = 0;
	number_of_portfolios = 0;
	$("#"+dest).html($(""));
	$("#content-portfolios-not-in-project").html($(""));
	for (var i=0;i<folders_list.length;i++) {
		folders_list[i].displayFolder(dest,type);
	}
};

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolder = function(dest,type)
//==================================
{
	//---------------------
	if (dest!=null) {
		this.displayLabel["folder_label_"+this.id] = type;
	}
	//---------------------
	var html = "";
	var folder_code = this.code_node.text();
	if (this.semantictag!= undefined && this.semantictag.indexOf('karuta-project')>-1 && folder_code!='karuta.project'){
		//-------------------------------------------------
		var folder_label = this.label_node[LANGCODE].text();
		if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
			folder_label = '- no label in '+languages[LANGCODE]+' -';
		//-------------------------------------------------
		projects_list[number_of_projects] = {"uuid":this.id,"folder_code":folder_code,"folderlabel":folder_label,"folders":""};
		projects_list[number_of_projects].folders += this.id;
		number_of_projects_portfolios = 0;
		html += "<div id='folder_"+this.id+"' class='project folder' ondrop='dropPortfolioFolder(event)' ondragover='ondragoverPortfolioFolder(event)' ondragleave='ondragleavePortfolioFolder(event)'";
		html += "  data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + folder_code+"\" >";
		html += "	<div id='tree_label_"+this.id+"' class='row-label'>";
		if (this.nbfolders>0)
			html += "<span id='"+type+"-toggle_"+this.id+"' class='closeSign' onclick=\"toggleElt('closeSign','openSign','"+this.id+"','"+type+"');\"></span>";
		html += "		<span id='projectlabel_"+this.id+"' onclick=\"folders_byid['"+this.id+"'].toggleFolderContent()\" class='project-label'>"+folder_label+"</span>";
		html += "		&nbsp;<span class='nbfolders badge' id='nbfolders_"+this.id+"'></span>";
		html += "		&nbsp;<span class='nbchildren badge' id='nbchildren_"+this.id+"'>"+this.nbchildren+"</span>";
		html += "	</div>";
		html += "<div id='"+type+"treecontent_"+this.id+"' class='nested' ></div>";
		html += "</div>"
		$("#"+dest).append($(html));
		//-------------------------------------------------
		for (uuid in this.folders){
			folders_byid[uuid].displayFolder(type+'treecontent_'+this.id,type);
		}
		if (this.nbfolders>0) {
			$("#nbfolders_"+this.id).html(this.nbfolders)
			if (localStorage.getItem(type+"-toggle_"+this.id) == 'open')
				toggleElt('closeSign','openSign',this.id,type);
		}
		//-------------------------------------------------
		if (!this.loaded && localStorage.getItem('currentDisplayedFolderCode')==folder_code) {
			this.loadAndDisplayFolderContent(dest,type);
			$(".row-label").removeClass('active');
			$("#tree_label_"+this.id).addClass('active');
		}
	}
}

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolderContent = function(dest,type,index)
//==================================
{
	if (index==null)
		index = "0";
	$("#portfolio-content1-rightside").html("");
	$("#portfolio-content2-rightside").html("");
	if (type==null)
		if (list_view_type==null)
			type = 'list';
		else
			type = list_view_type;
	var folder_code = this.code_node.text();
	//--------------------
	this.displayFolderDetail('portfolio-header-rightside',type,'header');
	//------------------ folders ---------------------------
	$("#portfolio-content1-rightside").html("<div class='porfolios-content' id='folders-content'></div>");
	for (uuid in this.folders){
		var folder = folders_byid[uuid];
		folder.displayFolderDetail('folders-content',type,'list');
	}
	//------------------ portfolios -------------------------
	if (type=='card' || type=='card-admin') {
		$("#portfolio-content2-rightside").html("<div class='card-deck' id='porfolios-deck'></div>");
	}
	else {
		$("#portfolio-content2-rightside").html("<div class='porfolios-content' id='porfolios-content'></div>");
	}
	for (uuid in this.children[index]){
		var portfolio = portfolios_byid[uuid];
		var portfoliocode = portfolio.code_node.text();
			//-------------------- PORTFOLIO ----------------------
			var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (portfolio.visible || (USER.creator && !USER.limited) ) {
					if (type=='card')
						$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolio.rootid+"')\" parentid='"+this.id+"' index='"+index+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					else if (type=='card-admin')
						$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' parentid='"+this.id+"' index='"+index+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					else
						$("#porfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' parentid='"+this.id+"' index='"+index+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,type));
					portfolio.displayOwner('owner_'+portfolio.id);
				}
		$(window).scrollTop(0);
		$("#wait-window").hide();
	}
	
}

//==================================
UIFactory["PortfolioFolder"].prototype.displayOwner = function(dest)
//==================================
{
	if (Users_byid[this.ownerid]==null)
		UIFactory.User.loadUserAndDisplay(this.ownerid,dest,'firstname-lastname');
	else {
		var owner = Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
		$("#"+dest).html(owner);
	}
}

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolderDetail = function(dest,type,viewtype)
//==================================
{
	if (viewtype == null)
		viewtype = 'header';
	var html = "";
	var owner = "";
	//-------------------- FOLDER ----------------------
	var folder_code = this.code_node.text();
	var folder_label = this.label_node[LANGCODE].text();
	if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
		folder_label = '- no label in '+languages[LANGCODE]+' -';
	if (viewtype == 'header') {
		html += "<div id='folderheader_"+this.id+"' class='folder-header'>";
		html += "	<div class='row row-label'>";
		html += "		<div class='col-3 folder-label' id='folderlabel_"+this.id+"' >"+folder_label+"</div>";
		html += "		<div id='owner_"+this.id+"' class='col-2 d-none d-md-block project-label'></div>";
		html += "		<div class='col-3 d-none d-sm-block comments' id='project-comments_"+$(this.root).attr("id")+"'> </div><!-- comments -->";
		html += "		<div class='col-2'>";
		//---------------------------------------
		html += "<span class='fa fa-th' style='cursor:pointer;font-size:130%;margin-top:4px' onclick=\"list_view_type='card-admin';folders_byid['"+this.id+"'].displayFolderContent('','card-admin');localStorage.setItem('list_view_type','card-admin');\"></span>&nbsp;";
		html += "<span class='fa fa-list' style='cursor:pointer;font-size:130%' onclick=\"list_view_type='list';folders_byid['"+this.id+"'].displayFolderContent('','list');localStorage.setItem('list_view_type','list')\"></span>";
		html += "		</div>";
		html += "		<div class='col-1'>";
		//------------ buttons ---------------
		html += "			<div class='dropdown portfolio-menu'>";
		if (USER.admin || (this.owner=='Y' && !USER.xlimited)) {
			html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
			html += "			<div class='dropdown-menu  dropdown-menu-right'>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfolioFolder'].callRename('"+this.id+"',null,true)\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory.PortfolioFolder.createFolder('"+folder_code+"/')\" ><i class='fas fa-folder'></i> "+karutaStr[LANG]["create_subfolder"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory.PortfolioFolder.confirmDelFolderContent('"+this.id+"')\" ><i class='fa fa-trash'></i> "+karutaStr[LANG]["button-delete-content"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory.PortfolioFolder.confirmDelFolder('"+this.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callChangeOwner('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsers('"+this.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
			html += "			<a class='dropdown-item' id='export-"+this.id+"' href='' style='display:block'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-project"]+"</a>";
			html += "			<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callArchive('"+folder_code+"')\" ><i class='fa fa-download'></i> "+karutaStr[LANG]["archive-project"]+"</a>";
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
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.model')\" >"+karutaStr[LANG]['karuta.model']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.rubrics')\" >"+karutaStr[LANG]['karuta.rubrics']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.parts')\" >"+karutaStr[LANG]['karuta.parts']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.report')\" >"+karutaStr[LANG]['karuta.report']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.batch')\" >"+karutaStr[LANG]['karuta.batch']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+folder_code+"','karuta.batch-form')\" >"+karutaStr[LANG]['karuta.batch-form']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].create('"+folder_code+"')\" >"+karutaStr[LANG]['create_tree']+"</a>";
			html += "				</ul>";
			html += "			</div>";
		}
		//------------------------end menu-burger
		html += "		</div><!-- class='col-1' -->";
		html += "	</div><!-- class='row' -->";
		html += "</div><!-- class='project'-->";
		//---------------------
		$("#"+dest).html($(html));
		var portfolio_list = "";
		for (var j=0; j<this.children.length;j++){
			portfolio_list += "," + this.children[j].id;
		}
		if (portfolio_list.length>0)
			portfolio_list = portfolio_list.substring(1);
		$("#export-"+this.id).attr("href",serverBCK_API+"/portfolios/zip?portfolios="+portfolio_list);
	}
	if (viewtype == 'list') {
		var tree_type='<span class="fas fa-folder" aria-hidden="true"></span>';
		html += "<div class='row portfolio-row'>";
		html += "<div class='folder-label col-10 col-md-4'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div id='owner_"+this.id+"' class='col-2 d-none d-md-block'></div>";
			html += "<div class='col-3 d-none d-md-block'>";
			html += "<span id='pcode_"+this.id+"' class='portfolio-code'>"+this.code_node.text()+"</span>";
			html += " <span class='copy-button fas fa-clipboard' ";
			html += "   onclick=\"copyInclipboad('"+this.id+"')\" ";
			html += "   onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + karutaStr[LANG]['copy'] +" : "+this.code_node.text()+"\" ";
			html += "   onmouseout=\"outCopy('"+this.id+"')\">";
			html += "</span>";
			html += "</div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		$("#"+dest).append($(html));
	}
	//---------------------
	this.displayOwner('owner_'+this.id);
	//---------------------
	UIFactory["Portfolio"].displayComments('project-comments_'+$(this.root).attr("id"),this);
	//----------------------
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ CREATE ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].createFolder = function(code)
//==================================
{
	if (code==null)
		code = "";
	$("#edit-window-title").html(karutaStr[LANG]['create_folder']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codetree").val();
		var label = $("#labeltree").val();
		if (code!='' && label!='') {
			var uuid = UIFactory.Portfolio.getid_bycode("karuta.project",false); 
			UIFactory.Portfolio.copy_rename(uuid,code,true,label,'karuta-project');
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
	html += "			<input id='codetree' type='text' class='form-control' value='"+code+"'>";
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

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ DELETE ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//=======================================================================
UIFactory["PortfolioFolder"].confirmDelFolder = function (uuid) 
// =======================================================================
{
	var folder= folders_byid[uuid];
	var folder_code = folder.code_node.text();
	var folder_label = folder.label_node[LANGCODE].text();
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"] + "<br>" + karutaStr[LANG]["code"]+ " : " + folder_code + "<br>" + karutaStr[LANG]["label"]+ " : " +folder_label + "<br>" + karutaStr[LANG]["and-content"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.PortfolioFolder.delFolder('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
UIFactory["PortfolioFolder"].confirmDelFolderContent = function (uuid) 
// =======================================================================
{
	var folder= folders_byid[uuid];
	var folder_code = folder.code_node.text();
	var folder_label = folder.label_node[LANGCODE].text();
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"] + "<br>" + karutaStr[LANG]["code"]+ " : " + folder_code + "<br>" + karutaStr[LANG]["label"]+ " : " +folder_label + "<br>" + karutaStr[LANG]["and-content"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.PortfolioFolder.delFolderContent('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}


//==================================
UIFactory["PortfolioFolder"].delFolder = function(uuid) 
//==================================
{
	//----------------
	var folder= folders_byid[uuid];
	//----------------
	for (var i=0;i<folder.children.length;i++){
		$.ajax({
			async: false,
			type : "DELETE",
			contentType: "application/xml",
			dataType : "xml",
			url : serverBCK_API+"/portfolios/portfolio/" + folder.children[i].id,
			data : "",
			success : function(data) {
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in del : "+jqxhr.responseText);
			}
		});
	}
	//----------------
	$.ajax({
		async: false,
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + uuid,
		data : "",
		success : function(data) {
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
	fill_list_page();
}

//==================================
UIFactory["PortfolioFolder"].delFolderContent = function(uuid) 
//==================================
{
	//----------------
	var folder= folders_byid[uuid];
	//----------------
	for (var i=0;i<folder.children.length;i++){
		$.ajax({
			async: false,
			type : "DELETE",
			contentType: "application/xml",
			dataType : "xml",
			url : serverBCK_API+"/portfolios/portfolio/" + folder.children[i].id,
			data : "",
			success : function(data) {
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in del : "+jqxhr.responseText);
			}
		});
	}
	fill_list_page();
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ RENAME ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].callRename = function(folderid)
//==================================
{
	//---------------------
	var	langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = folders_byid[folderid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+folderid+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+folderid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
		$(htmlCodeInputObj).change(function (){
				UIFactory.PortfolioFolder.renameFolder(self);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+folderid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+folderid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			UIFactory.PortfolioFolder.renameFolder(self);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	var html = "";
	html += "<div id='edit_comments_"+$(portfolios_byid[folderid].root).attr("id")+"'></div>";
	$("#edit-window-body").append($(html));
	
	UIFactory["Node"].displayCommentsEditor('edit_comments_'+$(portfolios_byid[folderid].root).attr("id"),portfolios_byid[folderid].root);

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
UIFactory["PortfolioFolder"].renameFolder = function(itself) 
//==================================
{
	//---------------------
	var	langcode = LANGCODE;
	//---------------------
	var oldfolder_code = $(itself.code_node).text();
	var newfolder_code = $.trim($("#code_"+itself.id).val());
	//---------- test if new code already exists
	var exist = false;
	for (var i=0;i<portfolios_list.length;i++) {
		if (oldfolder_code!=newfolder_code && newfolder_code==portfolios_list[i].code_node.text())
			exist = true;
	}
	//-----------------------
	if (!exist) {
		var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
		$(itself.label_node[langcode]).text(label);
		if (newfolder_code!=oldfolder_code) {
			$.ajax({
				async: false,
				folder : this,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1&project="+itself.code_node.text(),
				success : function(data) {
					var items = $("portfolio",data);
					for ( var i = 0; i < items.length; i++) {
						var portfolioid = $(items[i]).attr('id');
						var portfolio_rootid = $("asmRoot",items[i]).attr("id");
						var portfolio_code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
						var newportfolio_code = portfolio_code.replace(oldfolder_code,newfolder_code);
						var xml = "";
						xml +="<asmResource xsi_type='nodeRes'>";
						xml +="<code>"+newportfolio_code+"</code>";
						for (var j=0; j<languages.length;j++){
							xml +="<label lang='"+languages[j]+"'>"+ $("label[lang='"+languages[j]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])[0]).text()+"</label>";	
						}
						xml +="</asmResource>";
						strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
						UICom.query("PUT",serverBCK_API+'/nodes/node/'+portfolio_rootid+'/noderesource',null,"text",strippeddata);
					}
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Server Error GET active: "+textStatus);
				}
			});
			//------------------------------------------
			itself.code_node.text(newfolder_code); // update local code
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+newfolder_code+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(itself.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',fill_list_page,"text",strippeddata);
			//------------------------------------------
		} else {
			//------------------------------------------
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+oldfolder_code+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(itself.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',fill_list_page,"text",strippeddata);

			//------------------------------------------
		}
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+itself.id).val(oldprojectcode);
	}
	//fill_list_page();
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ PORFOLIOS ---------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].checkPortfolios = function() 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=false&count=true",
		success : function(data) {
			var nb_portfolios = parseInt($('portfolios',data).attr('count'));
			if (nb_portfolios==0)
				$("#portfolios-label").hide();
			else {
				$("#portfolios-nb").html(nb_portfolios);
				if (nb_folders==0)
					UIFactory.PortfolioFolder.loadAndDisplayPortfolios('portfolio-content2-rightside','list');
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1&project=false: "+textStatus);
			$("#wait-window").hide();
		}
	});
}

//==================================
UIFactory["PortfolioFolder"].loadAndDisplayPortfolios = function(dest,type) 
//==================================
{
	$("#"+dest).html("");
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=false",
		success : function(data) {
			var items = $("portfolio",data);
			UIFactory["Portfolio"].parse_add(data);
			var nb_visibleportfolios = 0;
			var visibleid = "";
			for (var i=0;i<portfolios_list.length;i++){
				if (portfolios_list[i].visible) {
					nb_visibleportfolios++;
					visibleid = portfolios_list[i].id;
				}
			}
			if (nb_visibleportfolios>0)
				if (USER.admin || USER.creator)
					UIFactory.PortfolioFolder.displayPortfolios('project-portfolios','false','card-admin',items);
				else
					if (nb_visibleportfolios>9)
						UIFactory.PortfolioFolder.displayPortfolios('project-portfolios','false','list',items);
					else if (nb_visibleportfolios>1)
						UIFactory.PortfolioFolder.displayPortfolios('card-deck-portfolios','false','card',items);
					else
						display_main_page(portfolios_byid[visibleid].rootid);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}


//==================================
UIFactory["PortfolioFolder"].displayPortfolios = function(dest,parentcode,type,items)
//==================================
{
	$("#"+dest).html("");
	$('.active').removeClass('active');
	if (type==null)
		if (list_view_type==null)
			type = 'list';
		else
			type = list_view_type;
	$("#"+dest).show();
	$("#portfolio-header-rightside").html("<div class='folder-header'>"+karutaStr[LANG]['portfolios']+"</div>");
	var langcode = LANGCODE;
	if (type=='card' || type=='card-admin')
		$("#portfolio-content1-rightside").html("<div class='card-deck' id='porfolios-deck'></div>");
	else
		$("#portfolio-content1-rightside").html("<div class='porfolios-content' id='porfolios-content'></div>");
	for (var j=0; j<items.length;j++){
		var portfolioid = $(items[j]).attr('id');
		var portfolio = portfolios_byid[portfolioid];
		var portfoliocode = portfolio.code_node.text();
		//-------------------- PORTFOLIO ----------------------
		var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
//		if ( (parentcode!= null && portfolio_parentcode==parentcode) || (parentcode=='false' && projects_list.length==0) || (parentcode=='false' && portfolio_parentcode=="" && portfolio.semantictag.indexOf('karuta-project')<0))
			if (portfolio.visible || (USER.creator && !USER.limited) ) {
				if (type=='card')
					$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolio.rootid+"')\"></div>"));
				else if (type=='card-admin')
					$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
				else
					$("#porfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
				$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,type,langcode,parentcode));
				portfolio.displayOwner('owner_'+portfolio.id);
			}
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}
