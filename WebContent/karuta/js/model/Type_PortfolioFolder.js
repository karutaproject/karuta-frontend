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
	this.context = $("asmRoot>asmResource[xsi_type='context']",node)[0];
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
	var parentid = ev.target.getAttribute('parentid');
	ev.dataTransfer.setData("uuid", portfolioid);
	ev.dataTransfer.setData("type", 'folder');
	ev.dataTransfer.setData("parentid",parentid);
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
	//---------target------------------------
	var folderid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var portfolio_code = portfolios_byid[portfolioid].code_node.text();
	var folder_code = (folderid=='folders-label') ? "" : folders_byid[folderid].code_node.text()+"/";
	var current_drop = portfolioid+"/"+folderid;
	//---------------------------------
	if (current_drop!=folder_last_drop && portfolioid!=folderid) {  // to avoid firing two times and avoid move in itself
		folder_last_drop = current_drop;
		if (type=="folder") {
			var parent_code = (parentid=="") ? "" : folders_byid[parentid].code_node.text();
			var newportfolio_code ="";
			if (parent_code=="")
				newportfolio_code = folder_code + portfolio_code;
			else
				newportfolio_code = folder_code + portfolio_code.substring(portfolio_code.indexOf(parent_code)+parent_code.length+1);
			folders_byid[portfolioid].renameFolderCode(newportfolio_code);
		}
		if (type=="portfolio") {
			var newportfolio_code = folder_code.substring(0,folder_code.lastIndexOf('/')) + portfolio_code.substring(portfolio_code.indexOf('.'));
			portfolios_byid[portfolioid].renamePortfolioCode(newportfolio_code);
			if (parentid!="") {
				folders_byid[parentid].loaded = false;
				folders_byid[parentid].loadContent();
			}
			UIFactory.PortfolioFolder.displayAll('portfolio');
			folders_byid[folderid].loadAndDisplayContent('portfolio',parentid);
		}
	}
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ LOADERS -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["PortfolioFolder"].loadAndDisplayAll = function (type)
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
			UIFactory["PortfolioFolder"].displayAll(type);
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
UIFactory["PortfolioFolder"].prototype.toggleContent = function(type,parentid)
//==================================
{
	if ($("#"+type+"-tree-label_"+this.id).hasClass('active')) {
		cleanList();
		localStorage.setItem('currentDisplayed'+type+'Code','none');
	} else {
		cleanList();
		if (this.loaded)
			this.displayContent(type,parentid);
		else
			this.loadAndDisplayContent(type,parentid);
		$("."+type+"-label").removeClass('active');
		$("#"+type+"-tree-label_"+this.id).addClass('active');
		localStorage.setItem('currentDisplayed'+type+'Code',this.code_node.text());
	}
}

//==============================
UIFactory["PortfolioFolder"].prototype.loadAndDisplayContent = function (type,parentid)
//==============================
{
	$.ajax({
		parentid : parentid,
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
			this.folder.children = {};
			for (var i=0; i<newTableau1.length; i++){
				this.folder.children[newTableau1[i][1]] = {'id':newTableau1[i][1]};
			}
			//-------------------------
			this.folder.displayContent(type,this.parentid);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==============================
UIFactory["PortfolioFolder"].prototype.loadContent = function ()
//==============================
{
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
			this.folder.children = {};
			for (var i=0; i<newTableau1.length; i++){
				this.folder.children[newTableau1[i][1]] = {'id':newTableau1[i][1]};
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
UIFactory["PortfolioFolder"].displayAll = function(type)
//==================================
{
	number_of_projects = 0;
	number_of_portfolios = 0;
	$("#"+type+"-leftside-content1").html($(""));
	for (var i=0;i<folders_list.length;i++) {
		folders_list[i].displayFolder(type);
	}
};

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolder = function(type,dest,parentid)
//==================================
{
	if (dest==null)
		dest = type+"-leftside-content1";
	//---------------------
	if (parentid==null)
		parentid = "";
	//---------------------
	this.displayLabel["folder_label_"+this.id] = type;
	//---------------------
	var html = "";
	var folder_code = this.code_node.text();
	if (this.semantictag!= undefined && this.semantictag.indexOf('karuta-project')>-1 && folder_code!='karuta.project'){
		//-------------------------------------------------
		var folder_label = this.label_node[LANGCODE].text();
		if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
			folder_label = '- no label in '+languages[LANGCODE]+' -';
		//-------------------------------------------------
		html += "<div id='folder_"+this.id+"' class='tree-elt' parentid='"+parentid+"' draggable='true' ondragstart='dragPortfolioFolder(event)' ondrop='dropPortfolioFolder(event)' ondragover='ondragoverPortfolioFolder(event)' ondragleave='ondragleavePortfolioFolder(event)'";
		html += "  data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + folder_code+"\" >";
		html += "	<div id='"+type+"-tree-label_"+this.id+"' class='"+type+"-label tree-label'>";
		if (this.nbfolders>0)
			html += "<span id='"+type+"-toggle_"+this.id+"' class='closeSign' onclick=\"toggleElt('closeSign','openSign','"+this.id+"','"+type+"');\"></span>";
		html += "		<span id='projectlabel_"+this.id+"' onclick=\"folders_byid['"+this.id+"'].toggleContent('"+type+"','"+parentid+"')\" class='project-label'>"+folder_label+"</span>";
		html += "		&nbsp;<span class='nbfolders badge' id='nbfolders_"+this.id+"'></span>";
		html += "		&nbsp;<span class='nbchildren badge' id='nbchildren_"+this.id+"'>"+this.nbchildren+"</span>";
		html += "	</div>";
		html += "<div id='"+type+"-treecontent_"+this.id+"' class='nested' ></div>";
		html += "</div>"
		$("#"+dest).append($(html));
		//-------------------------------------------------
		for (uuid in this.folders){
			folders_byid[uuid].displayFolder(type,type+'-treecontent_'+this.id,this.id);
		}
		if (this.nbfolders>0) {
			$("#nbfolders_"+this.id).html(this.nbfolders)
			if (localStorage.getItem(type+"-toggle_"+this.id) == 'open')
				toggleElt('closeSign','openSign',this.id,type);
		}
		//-------------------------------------------------
		if (localStorage.getItem('currentDisplayed'+type+'Code')==folder_code) {
			if (!this.loaded)
				this.loadContent(type);
			this.displayContent(type,parentid);
			$("."+type+"-label").removeClass('active');
			$("#"+type+"-tree-label_"+this.id).addClass('active');
		}
	}
}

//==================================
UIFactory["PortfolioFolder"].prototype.getView = function(type,instance)
//==================================
{
	var html = "";
	//--------------------------------------------------------------------------------------------	
	if (type=='import') {
		var js = "";
		if (instance) 
			js = "$('#project').attr('value','"+this.code_node.text()+"');$('#instance').attr('value','true')";
		else
			js = "$('#project').attr('value','"+this.code_node.text()+"');$('#instance').attr('value','false')";
		js += ";$('#dropdownMenu1').html('"+this.label_node[LANGCODE].text()+"')";
		if (this.nbfolders>0) {
			html += "<div class='dropdown-submenu'>";
			html += "<a class='dropdown-item'><span class='closeSign'/>"+this.label_node[LANGCODE].text()+"</a>";
			html += "<div class='dropdown-menu'>";
			for (uuid in this.folders) {
				html += folders_byid[uuid].getView (type,instance)
			}
			html += "</div>";
			html += "</div>";
		} else {
			html += "<a class='dropdown-item' onclick=\""+js+"\">"+this.label_node[LANGCODE].text()+"</a>";
		}
	}
	//--------------------------------------------------------------------------------------------
	return html;
};

//==================================
UIFactory["PortfolioFolder"].prototype.displayContent = function(type,parentid,viewtype)
//==================================
{
	$("#"+type+"-rightside-content1").html("");
	$("#"+type+"-rightside-content2").html("");
	if (viewtype==null && type!='portfolio')
		viewtype = type;
	else
		viewtype = list_view_type;
	var folder_code = this.code_node.text();
	//--------------------
	this.displayFolderDetail(type,parentid,type);
	//------------------ folders ---------------------------
	if (this.nbfolders>0) {
		$("#"+type+"-rightside-content1").html("<div class='portfolios-content' id='"+type+"-folders-content'></div>");
		for (uuid in this.folders){
			var folder = folders_byid[uuid];
			folder.displayFolderDetail(type,parentid,'list');
		}
	}
	//------------------ portfolios -------------------------
	if (viewtype=='card' || viewtype=='card-admin') {
		$("#"+type+"-rightside-content2").html("<div class='card-deck' id='"+type+"-porfolios-deck'></div>");
	}
	else {
		$("#"+type+"-rightside-content2").html("<div class='portfolios-content' id='"+type+"-portfolios-content'></div>");
	}
	for (uuid in this.children){
		var portfolio = portfolios_byid[uuid];
		var portfoliocode = portfolio.code_node.text();
			//-------------------- PORTFOLIO ----------------------
			var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (portfolio.visible || (USER.creator && !USER.limited) ) {
					if (viewtype=='card')
						$("#"+type+"-porfolios-deck").append($("<div class='card portfolio-card' id='"+type+"_"+portfolio.id+"' onclick=\"display_main_page('"+portfolio.rootid+"')\" parentid='"+this.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					else if (viewtype=='card-admin')
						$("#"+type+"-porfolios-deck").append($("<div class='card portfolio-card' id='"+type+"_"+portfolio.id+"' parentid='"+this.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					else
						$("#"+type+"-portfolios-content").append($("<div class='row portfolio-row' id='"+type+"_"+portfolio.id+"' parentid='"+this.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					$("#"+type+"_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,viewtype));
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
UIFactory["PortfolioFolder"].prototype.displayFolderDetail = function(type,parentid,viewtype)
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
	//--------------------------------------------------------------------------------------------------
	if (viewtype == 'portfolio') {
		html += "<div id='folderheader_"+this.id+"' parentid='"+parentid+"' class='folder-header' draggable='true' ondragstart='dragPortfolioFolder(event)'>";
		html += "	<div class='row row-label'>";
		html += "		<div class='col-3 folder-label' id='folderlabel_"+this.id+"' >"+folder_label+"</div>";
		html += "		<div id='owner_"+this.id+"' class='col-2 d-none d-md-block project-label'></div>";
		html += "		<div class='col-3 d-none d-sm-block comments' id='folder-comments_"+this.id+"'> </div><!-- comments -->";
		html += "		<div class='col-2'>";
		//---------------------------------------
		html += "<span class='fa fa-th' style='cursor:pointer;font-size:130%;margin-top:4px' onclick=\"list_view_type='card-admin';folders_byid['"+this.id+"'].displayContent('"+type+"','"+parentid+"');localStorage.setItem('list_view_type','card-admin');\"></span>&nbsp;";
		html += "<span class='fa fa-list' style='cursor:pointer;font-size:130%' onclick=\"list_view_type='list';folders_byid['"+this.id+"'].displayContent('"+type+"','"+parentid+"');localStorage.setItem('list_view_type','list')\"></span>";
		html += "		</div>";
		html += "		<div class='col-1'>";
		//------------ buttons ---------------
		html += "			<div class='dropdown menu'>";
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
			html += "				<a class='dropdown-item' id='export-"+this.id+"' href='' style='display:block'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-project"]+"</a>";
			html += "				<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callArchive('"+folder_code+"')\" ><i class='fa fa-download'></i> "+karutaStr[LANG]["archive-project"]+"</a>";
			html += "				<div class='dropdown-submenu pull-left'>";
			html += "				<a class='dropdown-item'><i class='fa fa-upload'></i> "+karutaStr[LANG]["import"]+"</a>";
			html += "				<div class='dropdown-menu'>";
			html += "					<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(false,false,'"+folder_code+"')\" ><i class='fa fa-upload'></i> "+karutaStr[LANG]['import_portfolio']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(true,false,'"+folder_code+"')\" ><i class='fa fa-upload'></i> "+karutaStr[LANG]['import_zip']+"</a>";
			html += "					<div class='dropdown-divider'></div>";
			html += "					<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(false,true,'"+folder_code+"')\" ><i class='fa fa-upload'></i> "+karutaStr[LANG]['import_instance']+"</a>";
			html += "					<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(true,true,'"+folder_code+"')\" ><i class='fa fa-upload'></i> "+karutaStr[LANG]['import_zip_instance']+"</a>";
			html += "				</div>";
			html += "			</div>";
			html += "		</div>";
		} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
			html += "			<button  data-toggle='dropdown' class='btn   dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";
		}
		html += "			</div><!-- class='btn-group' -->";
		//---------------------------------------
		html += "		</div><!-- class='col-1' -->";
		html += "		<div class='col-1'>";
		//------------------------ menu-burger
		if (USER.admin || (USER.creator && !USER.limited) ) {
			html += "			<div class='dropdown menu'>";
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
		$("#"+type+"-rightside-header").html($(html));
		var portfolio_list = "";
		for (uuid in this.children){
			portfolio_list += "," + uuid;
		}
		if (portfolio_list.length>0)
			portfolio_list = portfolio_list.substring(1);
		$("#export-"+this.id).attr("href",serverBCK_API+"/portfolios/zip?portfolios="+portfolio_list);
		//---------------------
		this.displayOwner('owner_'+this.id);
		//---------------------
		UIFactory.Portfolio.displayComments('folder-comments_'+this.id,this);
		//----------------------
	}
	//--------------------------------------------------------------------------------------------------
	if (viewtype == 'list') {
		var tree_type='<span class="fas fa-folder" aria-hidden="true"></span>';
		html += "<div class='row portfolio-row'>";
		html += "<div class='folder-label col-5' id='portfolio_list_"+this.id+"' draggable='true' ondragstart='dragPortfolioFolder(event)'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div id='owner_"+this.id+"' class='col-2 d-none d-md-block'></div>";
			html += "<div class='col-5'>";
			html += "<span id='pcode_"+this.id+"' class='portfolio-code'>"+this.code_node.text()+"</span>";
			html += " <span class='copy-button fas fa-clipboard' ";
			html += "   onclick=\"copyInclipboad('"+this.id+"')\" ";
			html += "   onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + karutaStr[LANG]['copy'] +" : "+this.code_node.text()+"\" ";
			html += "   onmouseout=\"outCopy('"+this.id+"')\">";
			html += "</span>";
			html += "</div>";
		}
		$("#"+type+"-folders-content").append($(html));
		//---------------------
		this.displayOwner('owner_'+this.id);
		//---------------------
		UIFactory.Portfolio.displayComments('folder-comments_'+this.d,this);
		//----------------------
	}
	//--------------------------------------------------------------------------------------------------
	if (viewtype == 'portfoliogroup-portfolio') {
		html += "<div class='folder-label' id='portfoliogroup-portfolio-header_"+this.id+"' draggable='true' ondragstart='dragPortfolioFolder(event)'>"+folder_label+"</div>";
		$("#"+type+"-rightside-header").html($(html));
	}
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
		var htmlLabelLabelObj = $("<label for='label_"+folderid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
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
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	itself.rename(oldfolder_code,newfolder_code,label);
}

//==================================
UIFactory["PortfolioFolder"].prototype.renameFolderCode = function(newfolder_code)
//==================================
{
	var oldfolder_code = $(this.code_node).text();
	this.rename(oldfolder_code,newfolder_code);
};

//==================================
UIFactory["PortfolioFolder"].prototype.rename = function(oldfolder_code,newfolder_code,label) 
//==================================
{
	//---------------------
	var	langcode = LANGCODE;
	//---------- test if new code already exists
	var exist = false;
	for (var i=0;i<portfolios_list.length;i++) {
		if (oldfolder_code!=newfolder_code && newfolder_code==portfolios_list[i].code_node.text())
			exist = true;
	}
	//-----------------------
	if (!exist) {
		if (label!=null)
			$(this.label_node[langcode]).text(label);
		if (newfolder_code!=oldfolder_code) {
			$.ajax({
				async: false,
				folder : this,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1&project="+this.code_node.text(),
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
			this.code_node.text(newfolder_code); // update local code
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+newfolder_code+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(this.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+this.rootid+'/noderesource',fill_list_page,"text",strippeddata);
			//------------------------------------------
		} else {
			//------------------------------------------
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+oldfolder_code+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(this.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+this.rootid+'/noderesource',fill_list_page,"text",strippeddata);

			//------------------------------------------
		}
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+this.id).val(oldprojectcode);
	}
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
	$("#portfolio-rightside-header").html("<div class='folder-header'>"+karutaStr[LANG]['portfolios']+"</div>");
	var langcode = LANGCODE;
	if (type=='card' || type=='card-admin')
		$("#portfolio-rightside-content2").html("<div class='card-deck' id='porfolios-deck'></div>");
	else
		$("#portfolio-rightside-content2").html("<div class='portfolios-content' id='portfolios-content'></div>");
	for (var j=0; j<items.length;j++){
		var portfolioid = $(items[j]).attr('id');
		var portfolio = portfolios_byid[portfolioid];
		var portfoliocode = portfolio.code_node.text();
		//-------------------- PORTFOLIO ----------------------
		var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
//		if ( (parentcode!= null && portfolio_parentcode==parentcode) || (parentcode=='false' && projects_list.length==0) || (parentcode=='false' && portfolio_parentcode=="" && portfolio.semantictag.indexOf('karuta-project')<0))
			if (portfolio.visible || (USER.creator && !USER.limited) ) {
				if (type=='card')
					$("#porfolios-deck").append($("<div class='card portfolio-card' parentid id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolio.rootid+"')\"></div>"));
				else if (type=='card-admin')
					$("#porfolios-deck").append($("<div class='card portfolio-card' parentid id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
				else
					$("#portfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
				$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,type,langcode,parentcode));
				portfolio.displayOwner('owner_'+portfolio.id);
			}
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------------ SEARCH ------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==============================
UIFactory["PortfolioFolder"].displayPortfolioSearch = function(type,searchOnly)
//==============================
{
	if (searchOnly==null)
		searchOnly = false;
	var html = "";
	html += "<div class='input-group'>";
	html += "	<input id='"+type+"-search-portfolio-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"'>";
	html += "	<div class='input-group-append'>";
	html +="		<button id='search-button' type='button' onclick=\"UIFactory.PortfolioFolder.searchPortfolio('"+type+"')\" class='btn'><i class='fas fa-search'></i></button>";
	if (!searchOnly) {
		html +="		<a id='archive-button' href='' disabled='true' class='btn'><i class='fas fa-download'></i></a>";
		html +="		<button id='remove-button' type='button' disabled='true' onclick='UIFactory.Portfolio.removeSearchedPortfolios()' class='btn'><i class='fas fa-trash'></i></button>";
	}
	html += "	</div>";
	html += "</div>";
	$("#"+type+"-search").html(html);
	$("#"+type+"-search-portfolio-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			UIFactory.PortfolioFolder.searchPortfolio(type);
	});
}

//==================================
UIFactory["PortfolioFolder"].searchPortfolio = function(type)
//==================================
{
	cleanList();
	var code = $("#"+type+"-search-portfolio-input").val();
	if (code!="")
		UIFactory.PortfolioFolder.displaySearchedPortfolios(code,type);
}

//==============================
UIFactory["PortfolioFolder"].displaySearchedPortfolios = function(code,type)
//==============================
{
	searched_portfolios_list = [];
	
	$("#"+type+"-rightside-header").html("");
	$("#"+type+"-rightside-content1").html("");
	$("#"+type+"-rightside-content2").html("");
	$("#wait-window").show();
	$("#menu").html("");
	cleanList();
	//----------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+code,
		code : code,
		success : function(data) {
			var nb = parseInt($('portfolios',data).attr('count'));
			UIFactory["Portfolio"].parse_search(data);
			$("#"+type+"-rightside-content2").html($("<div id='"+type+"-searched-portfolios-content' class='portfolios-content'></div>"));
			$("#"+type+"-rightside-content1").html($("<div id='"+type+"-searched-folders-content' class='portfolios-content'></div>"));
			//-------------------------------
			for (var i=0;i<searched_portfolios_list.length;i++){
				var portfolio = searched_portfolios_list[i];
				if (portfolio.visible || (USER.creator && !USER.limited) ) {
					if (portfolio.semantictag.indexOf('karuta-project')>-1)
						$("#"+type+"-searched-folders-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolioFolder(event)'></div>"));
					else
						$("#"+type+"-searched-portfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,type));
				}
			}
			var archive_href = serverBCK_API+"/portfolios/zip?portfolios=";
			for (var i = 0; i < searched_portfolios_list.length; i++) {
				if (i>0)
					archive_href += ","
				archive_href += searched_portfolios_list[i].id;
			}
			$("#archive-button").removeAttr("disabled");
			$("#archive-button").attr("href",archive_href);
			$("#remove-button").prop("disabled",false);
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	//---------------------------------------------------
}