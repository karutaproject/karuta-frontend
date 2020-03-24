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
	
var portfolios_byid = {};
var portfolios_list = [];
var searched_portfolios_list = [];
var searched_bin_portfolios_list = [];
var projects_list = [];
var bin_byid = {};
var bin_list = [];
var displayProject = {};
var number_of_projects = 0;
var number_of_projects_portfolios = 0;
var number_of_portfolios = 0;
var number_of_bins = 0;
var loadedProjects = {};
var currentDisplayedPrjectCode = "";
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

var nb_del_list = 0;

/// Define our type
//==================================
UIFactory["Portfolio"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.owner = $(node).attr('owner');
	this.ownerid = $(node).attr('ownerid');
	this.node = node;
	this.rootid = $("asmRoot",node).attr("id");
	var asmroot = node.querySelector("asmRoot");
	this.root = new UIFactory["Node"]( asmroot );
	if( UICom.structure["ui"] == null )
		UICom.structure["ui"] = {};
	UICom.structure["ui"][this.rootid] = this.root;
	this.code_node = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",node));
	this.date_modified = $(node).attr('modified');
	this.semantictag = $("metadata",node).attr('semantictag');
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.notvisible = ($("metadata",node).attr('list-novisible')=='Y') ? true : false;
	this.complex = ($("metadata",node).attr('complex')=='Y') ? true : false;
	if (this.complex==undefined)
		this.complex = false;
	//------------------------------
	this.export_pdf = UIFactory.Portfolio.getLogicalMetadataAttribute(node,"export-pdf");
	this.export_rtf = UIFactory.Portfolio.getLogicalMetadataAttribute(node,"export-rtf");
	this.export_htm = UIFactory.Portfolio.getLogicalMetadataAttribute(node,"export-htm");
	//------------------------------
	this.seerootnoderoles = $("metadata-wad",$("asmRoot",node)).attr('seenoderoles');
	this.commentnoderoles = $("metadata-wad",$("asmRoot",node)).attr('commentnoderoles');
	if (this.seerootnoderoles==undefined)
		this.seerootnoderoles = "all";
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
	this.groups = [];
	this.roles = [];
	if (this.semantictag.indexOf("karuta-project")>-1)
		this.rights = "";
	else
		this.rights = this.root.getRights(this.rootid);
};

//=======================================================================
function setConfigColor(data,root,configname) 
// =======================================================================
{
	var color = g_configVar[configname];
	if ($("asmContext:has(metadata[semantictag='"+configname+"'])",data).length>0) {
		color = getText(configname,'Color','text',data);
	}
	root.style.setProperty("--"+configname,color);
}

//==================================
function setCSSportfolio(data)
//==================================
{
	// ================================= CSS Portfolio ========================
	var root = document.documentElement;
	//-----------NAVBAR------------------------------------
	setConfigColor(data,root,'portfolio-navbar-background-color');
	setConfigColor(data,root,'portfolio-navbar-text-color');
	//-----------SIDEBAR------------------------------------
	setConfigColor(data,root,'portfolio-sidebar-background-color');
	setConfigColor(data,root,'portfolio-sidebar-text-color');
	setConfigColor(data,root,'portfolio-sidebar-selected-text-color');
	setConfigColor(data,root,'portfolio-sidebar-selected-border-color');
	setConfigColor(data,root,'portfolio-sidebar-separator-color');
	//-----------PORTFOLIO COLORS------------------------------------
	setConfigColor(data,root,'page-title-background-color');
	setConfigColor(data,root,'page-title-subline-color');
	setConfigColor(data,root,'portfolio-text-color');
	setConfigColor(data,root,'portfolio-section-separator-color');
	setConfigColor(data,root,'portfolio-buttons-background-color');
	setConfigColor(data,root,'portfolio-buttons-color');
	setConfigColor(data,root,'portfolio-link-color');
	setConfigColor(data,root,'portfolio-section-title-background-color');
	setConfigColor(data,root,'portfolio-resource-border-color');
	setConfigColor(data,root,'portfolio-menu-background-color');
	setConfigColor(data,root,'portfolio-menu-text-color');
	//-----------SVG------------------------------------
	setConfigColor(data,root,'svg-web0-color');
	setConfigColor(data,root,'svg-web1-color');
	setConfigColor(data,root,'svg-web2-color');
	setConfigColor(data,root,'svg-web3-color');
	setConfigColor(data,root,'svg-web4-color');
	setConfigColor(data,root,'svg-web5-color');
	setConfigColor(data,root,'svg-web6-color');
	setConfigColor(data,root,'svg-web7-color');
	setConfigColor(data,root,'svg-web8-color');
	setConfigColor(data,root,'svg-web9-color');
	// ========================================================================
}
//==================================
UIFactory["Portfolio"].getLogicalMetadataAttribute= function(node,attribute)
//==================================
{
	var val = ($("metadata",node).attr(attribute)=='Y') ? true : false;
	if (val==undefined)
		val = false;
	return val;
	}

/// Display

//==================================
UIFactory["Portfolio"].displayAll = function(dest,type,langcode)
//==================================
{
	loadedProjects = {};
	projects_list = [];
	number_of_projects = 0;
	number_of_portfolios = 0;
	number_of_bins = 0;
	g_sum_trees = 0;
	$("#"+dest).html($(""));
	$("#content-portfolios-not-in-project").html($(""));
	UIFactory.Portfolio.displayProject(0,dest,type,langcode,null);
	//--------------------------------------
	if (number_of_projects==0) {
		$("#projects-label").hide();
	} else {
		$("#projects-nb").html(number_of_projects);
	}
	//--------------------------------------
	if (!USER.creator)
		$("#portfolios-nb").hide();
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};

//==================================
function dragPortfolio(ev)
//==================================
{
	var portfolioid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	ev.dataTransfer.setData("text", portfolioid);
}

//==================================
function allowDropPortfolio(ev)
//==================================
{
	ev.preventDefault();
}

//==================================
function dropPortfolio(ev)
//==================================
{
	ev.preventDefault();
	var portfolioid = ev.dataTransfer.getData("text");
	var projectid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var portfoliocode = portfolios_byid[portfolioid].code_node.text();
	var projectcode = portfolios_byid[projectid].code_node.text();
	var newportfoliocode = projectcode + portfoliocode.substring(portfoliocode.indexOf('.'));
	UIFactory.Portfolio.renamePortfolio(portfolios_byid[portfolioid],newportfoliocode)
}

//==================================
UIFactory["Portfolio"].displayBinTree = function(nb,dest,type,langcode,parentcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (nb<bin_list.length) {
		if (bin_list[nb]==null) { // has been removed
			nb++;
			UIFactory["Portfolio"].displayBinTree(nb,dest,type,langcode,parentcode);
		} else {
			var portfolio = bin_list[nb];
			if (dest!=null) {
				portfolio.display[dest] = langcode;
			}
			//---------------------
			var html = "";
			var portfoliocode = portfolio.code_node.text();
			var owner = (Users_byid[portfolio.ownerid]==null) ? "??? "+portfolio.ownerid:Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
			if (portfolio.semantictag!= undefined && portfolio.semantictag.indexOf('karuta-project')>-1 && portfoliocode!='karuta.project'){
				var portfolio_label = portfolio.label_node[langcode].text();
				if (portfolio_label==undefined || portfolio_label=='')
					portfolio_label = '- no label in '+languages[langcode]+' -';
				//-------------------- PROJECT ----------------------
				displayProject[portfolio.id] = localStorage.getItem('dp'+portfolio.id);
//				displayProject[portfolio.id] = Cookies.get('dp'+portfolio.id);
				number_of_bins ++;
				html += "<div id='project_"+portfolio.id+"' class='project'>";
				html += "	<div class='row portfolio-label'>";
				if (displayProject[portfolio.id]!=undefined && displayProject[portfolio.id]=='open')
					html += "		<div onclick=\"javascript:toggleProject('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+portfolio.id+"' class='button fas fa-minus'></span></div>";
				else
					html += "		<div onclick=\"javascript:toggleProject('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+portfolio.id+"' class='button fas fa-plus'></span></div>";
				html += "		<div class='project-label col-md-3 col-sm-2 col-xs-3'>"+portfolio_label+"</div>";
				html += "		<div class='project-label col-md-2 col-sm-2 hidden-xs'>"+owner+"</div>";
				html += "		<div id='comments_"+portfolio.id+"' class='col-md-4 col-sm3 col-xs-4 comments'></div><!-- comments -->";
				html += "		<div class='col-md-1 col-xs-1'>";
				//------------ buttons ---------------
				html += "<div class='btn-group'>";
				html += "<button class='btn ' onclick=\"UIFactory.Portfolio.restoreProject('"+portfolio.id+"','"+portfolio.code_node.text()+"');searchPortfolio();\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
				html += "<i class='fas fa-trash-restore'></i>";
				html += "</button>";
				html += " <button class='btn ' onclick=\"confirmDelProject('"+portfolio.id+"','"+portfolio.code_node.text()+"')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
				html += "<i class='fa fa-times'></i>";
				html += "</button>";
				html += "</div><!-- class='btn-group' -->";
				//---------------------------------------
				html += "		</div><!-- class='col-md-1' -->";
				html += "	</div>";
				if (displayProject[portfolio.id]!=undefined && displayProject[portfolio.id]=='open')
					html += "	<div class='project-content' id='content-"+portfolio.id+"' style='display:block'></div>";
				else
					html += "	<div class='project-content' id='content-"+portfolio.id+"' style='display:none'></div>";
				html += "</div><!-- class='project'-->"
				$("#project-portfolios").append($(html));
				UIFactory["Portfolio"].displayComments('comments_'+portfolio.id,portfolio);
				nb++;
				UIFactory["Portfolio"].displayBinTree(nb,'content-'+portfolio.id,type,langcode,portfoliocode);
			} else {
				//-------------------- PORTFOLIO ----------------------
				var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (parentcode!= null && portfolio_parentcode==parentcode) {
					$("#"+dest).append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"'></div>"));
				}
				else {
					number_of_bins++;
					$("#project-portfolios").append($("<div class='row portfolio-row' id='portfolio_"+portfolio.id+"'></div>"));
				}
				$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,type,langcode,parentcode,owner));
				nb++;
				if (nb<bin_list.length)
					UIFactory["Portfolio"].displayBinTree(nb,dest,type,langcode,parentcode);
				else {
					if (number_of_bins==0)
						$("#bin-label").hide();
				}
			}
		}
	}
}
	
//==================================
UIFactory["Portfolio"].displayBin = function(dest,type,langcode)
//==================================
{
	var text2 = karutaStr[LANG]['bin'];
	var html = "<h3  class='bin-label'>"+text2+"&nbsp<button class='btn list-btn' onclick=\"confirmDelPortfolios_EmptyBin()\">"+karutaStr[LANG]["empty-bin"]+"</button></h3>";
	$("#"+dest).html($(html));
	UIFactory.Portfolio.displayBinTree(0,dest,type,langcode);
	if (bin_list.length==0 || number_of_bins==0)
		$("#bin-label").hide();
	else {
		$("#bin-label").show();
		$("#project-portfolios").show();
	}
};

//==================================
UIFactory["Portfolio"].prototype.getPortfolioView = function(dest,type,langcode,parentcode,owner,gid)
//==================================
{
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var tree_type = "";
	var semtag = "";
	if (this.semantictag!=undefined)
		semtag = this.semantictag;
	if (semtag.indexOf('karuta-components')>-1)
		tree_type='<span class="fa fa-wrench" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-model')>-1)
		tree_type='<span class="far fa-file" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-instance')>-1)
		tree_type='<span class="fas fa-file" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-report')>-1)
		tree_type='<span class="fas fa-chart-line" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-batch')>-1)
		tree_type='<span class="fas fa-cogs" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-project')>-1)
		tree_type='<span class="fas fa-folder" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-rubric')>-1)
		tree_type='<span class="fas fa-list" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-batch-form')>-1)
		tree_type='<span class="fab fa-wpforms" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-dashboard')>-1)
		tree_type='<span class="fa fa-line-chart" aria-hidden="true"></span>';
	//---------------------
	var roles = $("role",this.rights);
	var model = roles.length==0;
	if (!model)
		tree_type += '<span class="fas fa-file" aria-hidden="true"></span>';
	//---------------------
	var owner = (Users_byid[this.ownerid]==null) ? "":Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	//---------------------
	var portfolio_label = this.label_node[langcode].text();
	if (portfolio_label==undefined || portfolio_label=='' || portfolio_label=='&nbsp;')
		portfolio_label = '- no label in '+languages[langcode]+' -';
	//---------------------
	var html = "";
	if (type=='list') {
		html += "<div class='portfolio-label col-10 col-md-4' onclick=\"display_main_page('"+this.rootid+"')\" onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\""+this.code_node.text()+"\"><a class='portfolio-label' >"+portfolio_label+"</a> "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='portfolio-owner' >"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='portfolio-code' >"+this.code_node.text()+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block' onclick=\"display_main_page('"+this.rootid+"')\">"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y' && !USER.xlimited) || (USER.creator && !USER.limited)) {
			html += UIFactory.Portfolio.getAdminPortfolioMenu(gid,this,semtag);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='bin') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
			html += "<div class='col-md-3 col-sm-3 col-xs-9'><a class='portfolio-label' >"+portfolio_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs '><a class='portfolio-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs' >"+this.code_node.text()+"</a></div>";
			if (this.date_modified!=null)
				html += "<div class='col-md-2 col-sm-2 hidden-xs'>"+this.date_modified.substring(0,10)+"</div>";
			html += "<div class='col-md-2 col-sm-2 col-xs-3'>";
			html += "<div class='btn-group portfolio-menu'>";
			html += "<button class='btn' onclick=\"UIFactory.Portfolio.restore('"+this.id+"')\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
			html += "<i class='fas fa-trash-restore'></i>";
			html += "</button>";
			html += " <button class='btn' onclick=\"confirmDelPortfolio('"+this.id+"')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
			html += "<i class='fa fa-times'></i>";
			html += "</button>";
			html += "</div>";
			html += "</div><!-- class='col-md-2' -->";
		}
	}
	if (type=='select') {
//		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_portfolios',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='portfolio-label' >"+this.label_node[langcode].text()+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='portfolio-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code_node.text()+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
//		}
	}
	return html;
};

//======================
UIFactory["Portfolio"].getAdminPortfolioMenu = function(gid,self,semtag)
//======================
{	
	var html = "";
	html += "<div class='dropdown portfolio-menu'>";
	html += "<button id='dropdown"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
	html += "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown"+self.id+"'>";
	if (gid==null) {
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callRenameMove('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename-move"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].copy('"+self.id+"','"+self.code_node.text()+"-copy',true)\" ><i class='fa fa-file-o'></i><i class='far fa-copy'></i> "+karutaStr[LANG]["button-duplicate"]+"</a>";
		if (semtag.indexOf('karuta-model')>-1 || semtag.indexOf('karuta-batch-form')>-1)
			html += "<a class='dropdown-item' onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].instantiate('"+self.id+"','"+self.code_node.text()+"-instance',true)\" ><i class='fas fa-copy'></i> "+karutaStr[LANG]["button-instantiate"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.remove('"+self.id+"')\" ><i class='fas fa-trash'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+self.id+"?resources=true&export=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export"]+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+self.id+"?resources=true&files=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-with-files"]+"</a>";
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callChangeOwner('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
	} else {
		if (USER.admin){
			html += "<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.confirmRemove('"+gid+"','"+self.id+"')\" ><span class='fas fas-trash'></span> "+karutaStr[LANG]["button-remove-from-group"]+"</a>";
		}
	}
	html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callShareUsers('"+self.id+"')\" ><i class='fas fa-share-square'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
	html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callShareUsersGroups('"+self.id+"')\" ><i class='fas fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
	html += "</div><!-- class='dropdown-menu' -->";
	html += "</div><!-- class='dropdown' -->";
	return html;
}

//======================
UIFactory["Portfolio"].displayPortfolio = function(destid,type,langcode,edit)
//======================
{	var html = "";
	if (type==null || type==undefined)
		type = 'standard';
	g_display_type = type;
	//---------------------------------------
	if (type=='model'){
		html += "<div id='navigation_bar'></div>";
		html += "<div id='contenu' class='container-fluid'></div>";
		html += "<div id='footer'></div>";
		$("#"+destid).append($(html));
	}
	else if (type=='translate'){
		html += "	<div class='row'>";
		html += "		<div class='col-sm-3' id='sidebar'></div>";
		html += "		<div class='colsm-9' id='contenu'></div>";
		html += "	</div>";
		$("#"+destid).append($(html));
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
		var uuid = $("#page").attr('uuid');
		$("#sidebar_"+uuid).click();

	}
	else if (type=='standard' || type=='basic'){
		if (g_menu_type=='horizontal') {
			html += "<div id='menu_bar'></div>";
			html += "<div id='breadcrumb'></div>";
			html += "<div id='contenu' class='container-fluid'></div>";
			$("#"+destid).append($(html));
			UIFactory["Portfolio"].displayHorizontalMenu(UICom.root,'menu_bar',type,LANGCODE,edit,UICom.rootid);
		}
		else {
			html += "	<div id='main-row' class='row'>";
			html += "		<div class='col-sm-3' id='sidebar'></div>";
			html += "		<div class='col-sm-9' id='contenu'></div>";
			html += "	</div>";
			$("#"+destid).append($(html));
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
		}
	}
	else { // unknown type
		type = "standard";
		html += "	<div id='main-row' class='row'>";
		html += "		<div class='col-sm-3' id='sidebar'></div>";
		html += "		<div class='col-sm-9' id='contenu'></div>";
		html += "	</div>";
		$("#"+destid).append($(html));
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
	}

	//---------------------------------------
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};

//======================
UIFactory["Portfolio"].displaySidebar = function(root,destid,type,langcode,edit,rootid)
//======================
{	
	var html = "";
	if (type==null || type==undefined)
		type = 'standard';
	if (type=='standard' || type=='translate' || type=='model' || type=='basic'){
		html += "<div id='sidebar-content'><div  class='panel-group' id='parent-"+rootid+"' role='tablist'></div></div>";
		$("#"+destid).html($(html));
		UIFactory.Node.displaySidebar(root,'parent-'+UICom.rootid,type,langcode,edit,rootid);
	}
};

//======================
UIFactory["Portfolio"].displayHorizontalMenu = function(root,destid,type,langcode,edit,rootid)
//======================
{	
	var html = "";
	html += "<nav class='navbar navbar-expand-md navbar-light bg-lightfont'>";
	html += "	<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#collapse-3' aria-controls='collapse-3' aria-expanded='false' aria-label='Toggle navigation'>";
	html += "			<span class='navbar-toggler-icon'></span>";
	html += "	</button>";
	html += "	<div class='navbar-collapse collapse' id='collapse-3'>";
	html += "		<ul id='parent-"+rootid+"' class='navbar-nav'></ul>";
	html += "	</div>";
	html += "</nav>";
	$("#"+destid).html($(html));
	UIFactory.Node.displayHorizontalMenu(root,'parent-'+UICom.rootid,type,langcode,edit,rootid);
};

//======================
UIFactory["Portfolio"].displayMenu = function(destid,type,langcode,edit,tree)
//======================
{	
	var html = "";
	if (type==null || type==undefined)
		type = 'horizontal_menu';
	if (type=='horizontal_menu'){
		var nodes = $("*:has(metadata[semantictag='horizontal_menu'])",tree);
		html += "<ul class='nav nav-tabs header-menu' style='float:none'>";
		for (var i=0; i<nodes.length; i++){
			uuid = $(nodes[i]).attr('id');
			html += "<li><a  id='sidebar_"+uuid+"' class='sidebar'  data-toggle='tab' onclick=\"displayPage('"+uuid+"',99,'standard','"+langcode+"',"+edit+")\">"+UICom.structure["ui"][uuid].getLabel()+"</a></li>";
		}
		html += "</ul>";
		$("#"+destid).html(html);
	}
};

//======================
UIFactory["Portfolio"].displayNodes = function(destid,tree,semtag,langcode,edit)
//======================
{	
	$("#"+destid).html("");
	var rootnodeid = $("*:has(metadata[semantictag="+semtag+"])",tree).attr("id");
	var depth = 99;
	UIFactory['Node'].displayNode('standard',UICom.structure['tree'][rootnodeid],destid,depth,langcode,edit);
};


/// Editor
//==================================
UIFactory["Portfolio"].update = function(input,itself)
//==================================
{
	var value = $.trim($(input).val());
	$(itself.text_node).text(value);
	itself.save();
	itself.refresh();
	$("#"+itself.id+"_saved").html(" saved");
};

//==================================
UIFactory["Portfolio"].prototype.getEditor = function(type,lang)
//==================================
{
	var html = "";
	html += "<input type='text'  value=\""+$(this.text_node).text()+"\" onclick=\"document.getElementById('"+this.id+"_saved').innerHTML=''\">";
	html += "<span id='"+this.id+"_saved'></span>";  // to write 'saved'
	var obj = $(html);
	var self = this;
	$(obj).change(function (){
		UIFactory["Portfolio"].update(obj,self);
	});
	return obj;
};

//==================================
UIFactory["Portfolio"].prototype.setOwner = function(newuserid)
//==================================
{
	var uuid = this.id;
	var url = serverBCK_API+"/portfolios/portfolio/" + uuid + "/setOwner/"+newuserid;
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			fill_list_page();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};


//==================================
UIFactory["Portfolio"].load = function(portfolioid,level) 
//==================================
{
	var param = "";
	if (level==null)
		param="?resources=true";
	else
		param = "?level=" + level;
//	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + param,
		success : function(data) {
			UICom.parseStructure(data,true);
			UIFactory["Portfolio"].parse_add(data);
		}
	});
//	$.ajaxSetup({async: true});
};

//==================================
UIFactory["Portfolio"].reload = function(portfolioid) 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
		}
	});
};

//==================================
UIFactory["Portfolio"].reloadparse = function(portfolioid) 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
			UIFactory["Portfolio"].parse_add(data);
			$("#sidebar").html("");
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.root);
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		}
	});
};


//==================================
UIFactory["Portfolio"].parse = function(data) 
//==================================
{
	portfolios_byid = {};
	portfolios_list = [];
	var tableau1 = new Array();
	var uuid = "";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			portfolios_byid[uuid] = new UIFactory["Portfolio"](items[i]);
			var code = portfolios_byid[uuid].code_node.text();
			if (code.indexOf(".")<0)
				code += ".";
			tableau1[i] = [code,uuid];
		} catch(e) {
			var del = alert("Erreur portfolio"+uuid+" - code:"+code);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		portfolios_list[i] = portfolios_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["Portfolio"].parse_add = function(data) 
//==================================
{
	var tableau1 = [];
	for ( var i = 0; i < portfolios_list.length; i++) {
		if (portfolios_list[i]!=null)
			tableau1[tableau1.length] = [portfolios_list[i].code_node.text(),portfolios_list[i].id];
	}	
	portfolios_list = [];
	var uuid = "";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			if (portfolios_byid[uuid]==undefined) {
				portfolios_byid[uuid] = new UIFactory["Portfolio"](items[i]);
				var code = portfolios_byid[uuid].code_node.text();
				if (code.indexOf(".")<0)
					code += ".";
				tableau1[tableau1.length] = [portfolios_byid[uuid].code_node.text(),uuid];
			}
		} catch(e) {
			alertHTML("Error UIFactory.Portfolio.parse:"+uuid+" - "+e.message);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		portfolios_list[i] = portfolios_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["Portfolio"].parse_search = function(data,type) 
//==================================
{
	if (type!=null && type=="bin")
		searched_bin_portfolios_list = [];
	else
		searched_portfolios_list = [];
	var tableau1 = [];
	var uuid = "";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			if (portfolios_byid[uuid]==undefined)
				portfolios_byid[uuid] = new UIFactory["Portfolio"](items[i]);
			var code = portfolios_byid[uuid].code_node.text();
			if (code.indexOf(".")<0)
				code += ".";
			tableau1[tableau1.length] = [portfolios_byid[uuid].code_node.text(),uuid];
		} catch(e) {
			alertHTML("Error UIFactory.Portfolio.parse:"+uuid+" - "+e.message);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		if (type!=null && type=="bin")
			searched_bin_portfolios_list[i] = portfolios_byid[newTableau1[i][1]];
		else
			searched_portfolios_list[i] = portfolios_byid[newTableau1[i][1]];
	}
};

//==================================
UIFactory["Portfolio"].parseBin = function(data) 
//==================================
{
	bin_list = [];
	var tableau1 = new Array();
	var uuid ="";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			bin_byid[uuid] = new UIFactory["Portfolio"](items[i]);
			tableau1[i] = [bin_byid[uuid].code_node.text(),uuid];			
		} catch(e) {
			alertHTML("Error UIFactory.Portfolio.parseBin:"+portfolioid+" - "+e.message);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		bin_list[i] = bin_byid[newTableau1[i][1]]
	}
};


//==================================
UIFactory["Portfolio"].create = function(parentcode)
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_portfolio']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codetree").val();
		var label = $("#labeltree").val();
		if (code!='') {
			var xml = "";
			xml +="<?xml version='1.0' encoding='UTF-8'?>";
			xml +="<portfolio code='"+code+"'>";
			xml +="	<asmRoot>";
			xml +="		<metadata semantictag='root' sharedNode='N' sharedResource='N' multilingual-node='Y' />";
			xml +="		<metadata-wad seenoderoles='all' />";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+parentcode+"."+code+"</code>";
			xml +="			<label lang='fr'>"+label+"</label>";
			xml +="			<label lang='en'>"+label+"</label>";
			xml +="		</asmResource>";
			xml +="		<asmResource xsi_type='context'></asmResource>";
			xml +="	</asmRoot>";
			xml +="</portfolio>";
			$.ajax({
				type : "POST",
				contentType: "application/xml",
				dataType : "xml",
				url : serverBCK_API+"/portfolios",
				data : xml,
				success : function(data) {
					window.location.reload();
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error : "+jqxhr.responseText);
				}
			});
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").append($(footer));
	//--------------------------
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
UIFactory["Portfolio"].createTree = function(parentcode,typecode)
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG][typecode]);
	$("#edit-window-type").html("");
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#codetree").val();
		var label = $("#labeltree").val();
		if (code!='' && label!='') {
			code = parentcode + "." + code;
			var uuid = UIFactory["Portfolio"].getid_bycode(typecode,false); 
			UIFactory["Portfolio"].copy_rename(uuid,code,true,label,'root');
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
UIFactory["Portfolio"].createProject = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_project']);
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
UIFactory["Portfolio"].getid_bycode = function(code,resources) 
//==================================
{
	var result = "";
	var url = serverBCK_API+"/portfolios/portfolio/code/" + code +( (resources)?"?resources=true":"");
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			var portfolio = $("portfolio", data);
			result = $(portfolio).attr('id');
		}
	});
	return result;
};


//==================================
UIFactory["Portfolio"].instantiate_bycode = function(sourcecode,targetcode,callback)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/instanciate/null?sourcecode="+sourcecode+"&targetcode="+targetcode+"&owner=true";
	$.ajaxSetup({async: false});
	$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
				$("#wait-window").hide();
				uuid = data;
				if (callback!=null)
					callback(data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in instantiate_bycode : "+jqxhr.responseText);
			}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].instantiate = function(templateid,targetcode,reload)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/instanciate/"+templateid+"?targetcode="+targetcode+"&owner=true";
	$.ajaxSetup({async: false});
	$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
				uuid = data;
				$("#wait-window").hide();
				if (reload!=null && reload)
					window.location.reload();
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in instantiate : "+jqxhr.responseText);
			}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].instantiate_rename = function(templateid,targetcode,reload,targetlabel,rootsemtag)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/instanciate/"+templateid+"?targetcode="+targetcode+"&owner=true";
	$.ajaxSetup({async: false});
	$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
				uuid = data;
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/nodes?portfoliocode=" + targetcode + "&semtag="+rootsemtag,
					success : function(data) {
						var nodeid = $("asmRoot",data).attr('id');
						var xml = "<asmResource xsi_type='nodeRes'>";
						xml += "<code>"+targetcode+"</code>";
						for (var lan=0; lan<languages.length;lan++)
							xml += "<label lang='"+languages[lan]+"'>"+targetlabel+"</label>";
						xml += "</asmResource>";
						$.ajax({
							async:false,
							type : "PUT",
							contentType: "application/xml",
							dataType : "text",
							data : xml,
							url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
							success : function(data) {
								$("#wait-window").hide();
								if (reload!=null && reload)
									window.location.reload();
							},
							error : function(jqxhr,textStatus) {
								alertHTML("Error in instantiate_rename : "+jqxhr.responseText);
							}
						});
					}
				});
			}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].copy_bycode = function(sourcecode,targetcode,reload)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/copy/null?sourcecode="+sourcecode+"&targetcode="+targetcode+"&owner=true";;
	$.ajaxSetup({async: false});
	$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
				$("#wait-window").hide();
				uuid = data;
				if (reload!=null && reload)
					window.location.reload();
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in copy_bycode : "+jqxhr.responseText);
			}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].copy = function(templateid,targetcode,reload)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/copy/"+templateid+"?targetcode="+targetcode+"&owner=true";;
	$.ajaxSetup({async: false});
	$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
				uuid = data;
				$("#wait-window").hide();
				if (reload!=null && reload)
					window.location.reload();
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in copy : "+jqxhr.responseText);
			}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].copy_rename = function(templateid,targetcode,reload,targetlabel,rootsemtag)
//==================================
{
	var uuid = null;
	var url = serverBCK_API+"/portfolios/copy/"+templateid+"?targetcode="+targetcode+"&owner=true";
	$.ajaxSetup({async: false});
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			uuid = data;
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + targetcode + "&semtag="+rootsemtag,
				success : function(data) {
					var nodeid = $("asmRoot",data).attr('id');
					var xml = "<asmResource xsi_type='nodeRes'>";
					xml += "<code>"+targetcode+"</code>";
					for (var lan=0; lan<languages.length;lan++)
						xml += "<label lang='"+languages[lan]+"'>"+targetlabel+"</label>";
					xml += "</asmResource>";
					$.ajax({
						async:false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
						success : function(data) {
							$("#wait-window").hide();
							$('#edit-window').modal('hide');
							fill_list_page();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Error : "+jqxhr.responseText);
						}
					});
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error : "+jqxhr.responseText);
				}
			});
		},
		error : function(jqxhr,textStatus) {
			if (jqxhr.responseText.indexOf('code exist')>-1)
				alertHTML(karutaStr[LANG]['error-existing-code']);
			else
				alertHTML("Error : "+jqxhr.responseText);
		}
	});
	$.ajaxSetup({async: true});
	return uuid;
};

//==================================
UIFactory["Portfolio"].importFile = function(instance)
//==================================
{
	$("#edit-window-body").attr("type","list-menu");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	$("#edit-window-title").html("Import");
	var html = "";
	$("#edit-window-body").html($(html));
	//--------------------------
	var url = serverBCK_API+"/portfolios";
	//--------------------------
	var project = "";
	html +="<div class='dropdown'>";
	html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
	html +="    Select a project ";
	html +="    <span class='caret'></span>";
	html +="  </button>";
	html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
	html +="    <a class='dropdown-item' href='#'>&nbsp;</a>";
	for (var i=0;i<projects_list.length;i++) {
		var js = "";
		if (instance) 
			js = "$('#project').attr('value','"+projects_list[i].portfoliocode+"');$('#instance').attr('value','true')";
		else
			js = "$('#project').attr('value','"+projects_list[i].portfoliocode+"');$('#instance').attr('value','false')";
		js += ";$('#dropdownMenu1').html('"+projects_list[i].portfoliolabel+"')";
		html += "<a class='dropdown-item' onclick=\""+js+"\">"+projects_list[i].portfoliolabel+"</a>";
	}
	html +="  </ul>";
	html +="</div><br>";
	//--------------------------
	html +=" <form id='fileupload' action='"+url+"'>";
	html += " <input type='hidden' id='project' name='project' value=''>";
	html += " <input type='hidden' id='instance' name='instance' value='false'>";
	html += " <input id='uploadfile' type='file' name='uploadfile'>";
	html += "</form>";
	html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#edit-window-body").append($(html));
	$("#loading").hide();
	$("#fileupload").fileupload({
		progressall: function (e, data) {
			$("#progress").css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').css('width',progress + '%');
			$("#uploadfile").hide();
			$("#wait-window").show();
		},
		success : function(data) {
			$("#wait-window").hide();
			window.location.reload();
		},
		error : function(jqxhr,textStatus) {
			$("#wait-window").hide();
			alertHTML("Error : "+jqxhr.responseText);
		}
    });
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Portfolio"].importZip = function(instance,project)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	$("#edit-window-title").html("Import Zip");
	var html = "";
	$("#edit-window-body").html($(html));
	//--------------------------
	var url = serverBCK_API+"/portfolios/zip";
	//--------------------------
	var project = "";
	html +="<div class='dropdown'>";
	html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
	html +="    Select a project ";
	html +="    <span class='caret'></span>";
	html +="  </button>";
	html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
	html +="    <a class='dropdown-item' href='#'>&nbsp;</a>";
	for (var i=0;i<projects_list.length;i++) {
		var js = "";
		if (instance) 
			js = "$('#project').attr('value','"+projects_list[i].portfoliocode+"');$('#instance').attr('value','true')";
		else
			js = "$('#project').attr('value','"+projects_list[i].portfoliocode+"');$('#instance').attr('value','false')";
		js += ";$('#dropdownMenu1').html('"+projects_list[i].portfoliolabel+"')";
		html += "<a class='dropdown-item' onclick=\""+js+"\">"+projects_list[i].portfoliolabel+"</a>";
	}
	html +="  </ul>";
	html +="</div><br>";
	//--------------------------
	html +=" <form id='fileupload' action='"+url+"'>";
	html += " <input type='hidden' id='project' name='project' value=''>";
	if (instance) 
		html += " <input type='hidden' id='instance' name='instance' value='true'>";
	else
		html += " <input type='hidden' id='instance' name='instance' value='false'>";
	html += " <input type='file' id='uploadfile' name='uploadfile'>";
	html += "</form>";
	html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#edit-window-body").append($(html));
	$("#fileupload").fileupload({
		progressall: function (e, data) {
			$("#progress").css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').css('width',progress + '%');
			$("#uploadfile").hide();
			$("#wait-window").show();
		},
		success : function(data) {
			$("#wait-window").hide();
			window.location.reload();
		},
		error : function(jqxhr,textStatus) {
			$("#wait-window").hide();
			alertHTML("Error : "+jqxhr.responseText);
		}
    });
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Portfolio"].remove = function(portfolioid) 
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
			UIFactory["Portfolio"].displayAll('portfolios','list');
			UIFactory["Portfolio"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in remove : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].restoreXXX = function(portfolioid) 
//==================================
{
	var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?active=true";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<bin_list.length;i++){
				if (bin_list[i]!=null && bin_list[i].id==portfolioid) {
					portfolios_list[portfolios_list.length] = bin_list[i];
					portfolios_byid[portfolioid] = bin_list[i];
					bin_list[i] = null;
					//---- sort portfolios_list ---
					var tableau1 = new Array();
					for (var k=0; k<portfolios_list.length; k++){
						if (portfolios_list[k]!=null){
						tableau1[tableau1.length] = [portfolios_list[k].code_node.text(),portfolios_list[k].id];
						}
					}
					var newTableau1 = tableau1.sort(sortOn1);
					portfolios_list = [];
					for (var l=0; l<newTableau1.length; l++){
						portfolios_list[l] = portfolios_byid[newTableau1[l][1]]
					}
					//-----------------------------
					break;
				}
			}
			UIFactory["Portfolio"].displayBin('bin','bin');
			UIFactory["Portfolio"].displayAll('portfolios','list');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].restore = function(portfolioid)
//==================================
{
	var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?active=true";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			searchPortfolio();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].removeProject = function(projectid,projectcode) 
//==================================
{
	//----------------
	$.ajaxSetup({async: false});
	for (var i=0;i<portfolios_list.length;i++){
		var portfoliocode = portfolios_list[i].code_node.text();
		var prefix = (portfoliocode.indexOf('.')<0) ? "" : portfoliocode.substring(0,portfoliocode.indexOf('.'));
		if (projectcode==prefix || projectcode==portfoliocode) {
			var uuid = portfolios_list[i].id;
			var url = serverBCK_API+"/portfolios/portfolio/" + uuid + "?active=false";
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				url : url,
				data : "",
				success : function(data) {
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in restore : "+jqxhr.responseText);
				}
			});
		}
	}
	fill_list_page();
	$.ajaxSetup({async: true});


	//----------------
}

//==================================
UIFactory["Portfolio"].restoreProject = function(projectid,projectcode) 
//==================================
{
	$.ajaxSetup({async: false});
	//----------------
	for (var i=0;i<bin_list.length;i++){
		var portfoliocode = bin_list[i].code_node.text();
		var prefix = (portfoliocode.indexOf('.')<0) ? "" : portfoliocode.substring(0,portfoliocode.indexOf('.'));
		if (projectcode==prefix || projectcode==portfoliocode) {
			var uuid = bin_list[i].id;
			var url = serverBCK_API+"/portfolios/portfolio/" + uuid + "?active=true";
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				url : url,
				data : "",
				success : function(data) {
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in restore : "+jqxhr.responseText);
				}
			});
		}
	}
	fill_list_page();
	$.ajaxSetup({async: true});
	//----------------

}

//==================================
UIFactory["Portfolio"].delProject = function(projectid,projectcode) 
//==================================
{
	$.ajaxSetup({async: false});
	//----------------
	for (var i=0;i<bin_list.length;i++){
		var portfoliocode = bin_list[i].code_node.text();
		var prefix = (portfoliocode.indexOf('.')<0) ? "" : portfoliocode.substring(0,portfoliocode.indexOf('.'));
		if (projectcode==prefix || projectcode==portfoliocode) {
			var uuid = bin_list[i].id;
			var url = serverBCK_API+"/portfolios/portfolio/" + uuid;
			$.ajax({
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in del : "+jqxhr.responseText);
				}
			});
		}
	}
	//----------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1",
		success : function(data) {
			var destid = $("div[id='portfolios']");
			UIFactory["Portfolio"].parse(data);
			UIFactory["Portfolio"].displayAll('portfolios','list');
			if ($("#projects").html()=="") {
				$("#projects-label").hide();
				$("#portfolios-label").html(karutaStr[LANG]['portfolios-without-project']);
			}
		},		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=false",
		success : function(data) {
			var destid = $("div[id='bin']");
			UIFactory["Portfolio"].parseBin(data);
			UIFactory["Portfolio"].displayBin('bin','bin');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET bin: "+textStatus);
		}
	});
	//----------------
	$.ajaxSetup({async: true});
}


//==================================
UIFactory["Portfolio"].del = function(portfolioid) 
//==================================
{
	var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<bin_list.length;i++){
				if (bin_list[i]!=null && bin_list[i].id==portfolioid) {
					bin_list[i] = null;
					break;
				}
			}
			if ($("#bin").length>0) { // not a batch call
				UIFactory["Portfolio"].displayBin('bin','bin');
				$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
};

//=======================================================================
UIFactory["Portfolio"].getPDF = function(portfolioid) 
//=======================================================================
{
	var urlS = serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+karutaname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:fr;pers:mimi&format=application/pdf";
	$.ajax({
		type : "GET",
		headers: {
	        Accept : "application/pdf; charset=utf-8",
	        "Content-Type": "application/pdf; charset=utf-8"
	    },
		url : urlS
	 });
};

//==================================
UIFactory["Portfolio"].getActions = function(portfolioid) 
//==================================
{
	var html ="";
	if (portfolios_byid[portfolioid].export_pdf)
		html += "<a class='dropdown-item' href='../../../"+serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+karutaname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/pdf'>"+karutaStr[LANG]['getPDF']+"</a>";
	if (portfolios_byid[portfolioid].export_rtf)
		html += "<a class='dropdown-item' href='../../../"+serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+karutaname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/rtf'>"+karutaStr[LANG]['getRTF']+"</a>";
	if (portfolios_byid[portfolioid].export_htm)
		html += "<a class='dropdown-item'  onclick='export_html()'>"+karutaStr[LANG]['getWebsite']+"</a>";
//	html += "<a class='dropdown-item'  onclick=\"toggleButton('hidden')\">"+karutaStr[LANG]['hide-button']+"</a>";
//	html += "<a class='dropdown-item'  onclick=\"toggleButton('visible')\">"+karutaStr[LANG]['show-button']+"</a>";
	if (USER.admin || portfolios_byid[portfolioid].owner=='Y') {
		html += "<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsers('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-users"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
	}
	if (USER.admin || g_userroles[0]=='designer') {
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+portfolioid+"?resources=true&export=true'>"+karutaStr[LANG]['export']+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+portfolioid+"?resources=true&amp;files=true'>"+karutaStr[LANG]['export-with-files']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"toggleMetadata('hidden')\">"+karutaStr[LANG]['hide-metainfo']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"toggleMetadata('visible')\">"+karutaStr[LANG]['show-metainfo']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"$('#contenu').html('');UICom.structure.ui['"+g_portfolio_rootid+"'].displaySemanticTags('contenu')\">"+karutaStr[LANG]['list-semtags']+"</a>";
		if(languages.length>1)
			html += "<a class='dropdown-item'  onclick=\"$('#welcome-bar').hide();$('#sub-bar').html(UIFactory.Portfolio.getNavBar('translate',LANGCODE,g_edit,g_portfolioid))$('#sub-bar').show();;UIFactory.Portfolio.displayPortfolio('main-container','translate');\">"+karutaStr[LANG]['translate']+"</a>";
	}
	return html;
};

//==================================
UIFactory["Portfolio"].callRenameMove = function(portfolioid,langcode,project)
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
	var self = portfolios_byid[portfolioid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename-move']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code <a href='javascript://' id='code_help'><span style='font-size:12px' class='glyphicon glyphicon-question-sign'></span></a></label>");
		var htmlCodeDivObj = $("<div></div>");
		var htmlCodeInputObj = $("<input id='code_"+portfolioid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
		if (project)
			$(htmlCodeInputObj).change(function (){
					UIFactory["Portfolio"].renameProject(self,langcode);
			});
		else
			$(htmlCodeInputObj).change(function (){
					UIFactory["Portfolio"].rename(self,langcode);
			});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		if (project)
			$(htmlLabelInputObj).change(function (){
					UIFactory["Portfolio"].renameProject(self,langcode);
			});
		else
			$(htmlLabelInputObj).change(function (){
					UIFactory["Portfolio"].rename(self,langcode);
			});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	var html = "";
	html += "<div id='edit_comments_"+$(portfolios_byid[portfolioid].root).attr("id")+"'></div>";
	$("#edit-window-body").append($(html));
	
	UIFactory["Node"].displayCommentsEditor('edit_comments_'+$(portfolios_byid[portfolioid].root).attr("id"),portfolios_byid[portfolioid].root);

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
UIFactory["Portfolio"].callRename = function(portfolioid,langcode,project)
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
	var self = portfolios_byid[portfolioid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+portfolioid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
		if (project)
			$(htmlCodeInputObj).change(function (){
					UIFactory["Portfolio"].renameProject(self,langcode);
			});
		else
			$(htmlCodeInputObj).change(function (){
					UIFactory["Portfolio"].rename(self,langcode);
			});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		if (project)
			$(htmlLabelInputObj).change(function (){
					UIFactory["Portfolio"].renameProject(self,langcode);
			});
		else
			$(htmlLabelInputObj).change(function (){
					UIFactory["Portfolio"].rename(self,langcode);
			});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	var html = "";
	html += "<div id='edit_comments_"+$(portfolios_byid[portfolioid].root).attr("id")+"'></div>";
	$("#edit-window-body").append($(html));
	
	UIFactory["Node"].displayCommentsEditor('edit_comments_'+$(portfolios_byid[portfolioid].root).attr("id"),portfolios_byid[portfolioid].root);

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
UIFactory["Portfolio"].rename = function(itself,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var oldprojectcode = $(itself.code_node).text();
	var code = $.trim($("#code_"+itself.id).val());
	//---------- test if new code already exists
	var exist = false;
	if (oldprojectcode!=code) {
		for (var i=0;i<portfolios_list.length;i++) {
			if (portfolios_list[i]!=null && code==portfolios_list[i].code_node.text())
				exist = true;
		}
		for (var i=0;i<bin_list.length;i++) {
			if (bin_list[i]!=null && code==bin_list[i].code_node.text())
				exist = true;
		}
	}
	//-----------------------
	if (!exist) {
		$(itself.code_node).text(code);
		var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
		$(itself.label_node[langcode]).text(label);
		var xml = "";
		xml +="		<asmResource xsi_type='nodeRes'>";
		xml +="			<code>"+code+"</code>";
		for (var i=0; i<languages.length;i++){
			xml +="			<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
		}
		xml +="		</asmResource>";
		strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		var callback = function () {$("#portfolio_"+itself.id).html($(itself.getPortfolioView('portfolio_'+itself.id,'list')));};
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',callback,"text",strippeddata);
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+itself.id).val(oldprojectcode);
	}
};

//==================================
UIFactory["Portfolio"].renamePortfolio = function(itself,code,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var oldcode = $(itself.code_node).text();
	//---------- test if new code already exists
	var exist = false;
	if (oldcode!=code) {
		for (var i=0;i<portfolios_list.length;i++) {
			if (portfolios_list[i]!=null && code==portfolios_list[i].code_node.text())
				exist = true;
		}
		for (var i=0;i<bin_list.length;i++) {
			if (bin_list[i]!=null && code==bin_list[i].code_node.text())
				exist = true;
		}
	}
	//-----------------------
	if (!exist) {
		$(itself.code_node).text(code);
		var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
		$(itself.label_node[langcode]).text(label);
		var xml = "";
		xml +="<asmResource xsi_type='nodeRes'><code>"+code+"</code>";
		for (var i=0; i<languages.length;i++){
			xml +="<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
		}
		xml +="</asmResource>";
		strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		var callback = fill_list_page;
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',callback,"text",strippeddata);
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
	}
};

//==================================
UIFactory["Portfolio"].renameProject = function(itself,langcode) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var oldprojectcode = $(itself.code_node).text();
	var newprojectcode = $.trim($("#code_"+itself.id).val());
	//---------- test if new code already exists
	var exist = false;
	for (var i=0;i<portfolios_list.length;i++) {
		if (oldprojectcode!=newprojectcode && newprojectcode==portfolios_list[i].code_node.text())
			exist = true;
	}
	//-----------------------
	if (!exist) {
		var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
		$(itself.label_node[langcode]).text(label);
		if (newprojectcode!=oldprojectcode) {
			for (var i=0;i<portfolios_list.length;i++){
				var newportfoliocode = "";
				var portfoliocode = portfolios_list[i].code_node.text();
				var prefix = (portfoliocode.indexOf('.')<0) ? "" : portfoliocode.substring(0,portfoliocode.indexOf('.'));
				if (oldprojectcode==prefix || oldprojectcode==portfoliocode) {
					if (prefix=="" || oldprojectcode==portfoliocode)
						newportfoliocode = newprojectcode;
					else
						newportfoliocode = newprojectcode + portfoliocode.substring(portfoliocode.indexOf('.'));
					portfolios_list[i].code_node.text(newportfoliocode); // update local code
					var xml = "";
					xml +="		<asmResource xsi_type='nodeRes'>";
					xml +="			<code>"+newportfoliocode+"</code>";
					if (prefix=="")
						for (var j=0; j<languages.length;j++){
							xml +="			<label lang='"+languages[j]+"'>"+$(itself.label_node[j]).text()+"</label>";	
						}
					else // label not changed
						for (var j=0; j<languages.length;j++){
							xml +="			<label lang='"+languages[j]+"'>"+$(portfolios_list[i].label_node[j]).text()+"</label>";	
						}
					xml +="		</asmResource>";
					strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
					$("#portfolio_"+portfolios_list[i].id).html($(portfolios_list[i].getPortfolioView('portfolio_'+portfolios_list[i].id,'list')));
					UICom.query("PUT",serverBCK_API+'/nodes/node/'+portfolios_list[i].rootid+'/noderesource',null,"text",strippeddata);
				}
			}
		} else {
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+oldprojectcode+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(itself.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			$("#portfoliolabel_"+itself.id).html($(itself.label_node[langcode]).text());
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',null,"text",strippeddata);
		}
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+itself.id).val(oldprojectcode);
	}
}

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-------------------------- SHARING - UNSHARING -----------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------


//==================================
UIFactory["Portfolio"].displaySharingRoleEditor = function(destid,portfolioid,data,callFunction,instance)
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
UIFactory["Portfolio"].displayUnSharing = function(destid,data,unshare_disabled)
//==================================
{
	var html = "";
	$("#"+destid).html(html);
	var groups = $("rrg",data);
	if (groups.length>0) {
		//--------------------------
		$("#"+destid).append("<div id='unshare-special-roles'></div>")
		$("#"+destid).append("<div id='unshare-other-roles' style='margin-top:5px;'></div>")
		//--------------------------
		var group_labels = [];
		for (var i=0; i<groups.length; i++) {
			group_labels[i] = [$("label",groups[i]).text(),$(groups[i]).attr('id'),$("user",groups[i])];
		}
		var sorted_groups = group_labels.sort(sortOn1);
		//--------------------------
		for (var i=0; i<sorted_groups.length; i++) {
			var label = sorted_groups[i][0];
			var groupid = sorted_groups[i][1];
			var users = sorted_groups[i][2];
			if (users.length>0){
				if (label=='all' || label=='designer' || label=='administrator')
					dest = "#unshare-special-roles";
				else
					dest = "#unshare-other-roles";
				if (unshare_disabled) // display in report
					dest = "#"+destid;
				html = "<div class='row'><div class='col-md-3'>"+label+"</div><div class='col-md-9'>";
				for (var j=0; j<users.length; j++){
					var userid = $(users[j]).attr('id');
					if (Users_byid[userid]!=undefined)
						html += "<div>"+Users_byid[userid].getSelector('group',groupid,'select_users2unshare',null,unshare_disabled)+"</div>";
				}
				html += "</div></div>";
				$(dest).append($(html));
			}
		}
	} else {
		$("#"+destid).append($(karutaStr[LANG]['noshared']));
	}
};

//==================================
UIFactory["Portfolio"].unshareUsers = function(portfolioid,destid,unshare_disabled)
//==================================
{
	if (destid==null)
		destid = 'shared'
	var users = $("input[name='select_users2unshare']").filter(':checked');
	for (var i=0; i<users.length; i++){
		var userid = $(users[i]).attr('value');
		var groupid = $(users[i]).attr('group');
		var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
		$.ajax({
			type : "DELETE",
			contentType: "application/xml",
			dataType : "xml",
			url : url,
			data : "",
			success : function(data) {
				//--------------------------
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						UIFactory["Portfolio"].displayUnSharing(destid,data,unshare_disabled);
					}
				});
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in unshare : "+jqxhr.responseText);
			}
		});
	}
};


//==================================
UIFactory["Portfolio"].shareUsers = function(portfolioid)
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
							UIFactory["Portfolio"].displayUnSharing('shared',data);
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
UIFactory["Portfolio"].callShareUsers = function(portfolioid,langcode)
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
//	UIFactory.UsersGroup.displaySelectMultiple('sharing_users');
		if (Users_byid.length>0) { // users loaded
		UIFactory["User"].displaySelectMultipleActive('sharing_users');
		//--------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				UIFactory["Portfolio"].displayUnSharing('shared',data);
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
						UIFactory["Portfolio"].displayUnSharing('shared',data);
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
					UIFactory["Portfolio"].displaySharingRoleEditor('sharing_roles',portfolioid,data,null,instance);
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
UIFactory["Portfolio"].callShareUsersGroups = function(portfolioid,langcode)
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
	if (usersgroups_list.length>0) { // users groups loaded
		UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				UIFactory["Portfolio"].displayUnSharing('shared',data);
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
						UIFactory["Portfolio"].displayUnSharing('shared',data);
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
					UIFactory["Portfolio"].displaySharingRoleEditor('sharing_roles',portfolioid,data,"UIFactory['UsersGroup'].hideUsersList('sharing_usersgroups-group-')",instance);
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
UIFactory["Portfolio"].shareGroups = function(portfolioid,type)
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

//==================================
UIFactory["Portfolio"].callChangeOwner = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory.Portfolio.changeOwner('"+portfolioid+"')";
	var footer = ""
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Save']+"</button>";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";

	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['changeOwner']+' '+portfolios_byid[portfolioid].label_node[langcode].text());
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
UIFactory["Portfolio"].changeOwner = function(portfolioid,langcode)
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
		url : serverBCK_API+"/portfolios/portfolio/"+portfolioid+"/setOwner/"+userid,
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
UIFactory["Portfolio"].callArchive = function(projectcode,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory.Portfolio.archive('"+projectcode+"')";
	var footer = ""
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Save']+"</button>";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";

	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['archive-project']+' '+projectcode);
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
UIFactory["Portfolio"].archive = function(projectcode,langcode)
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
			UIFactory["Portfolio"].parse(data);
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
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==============================
UIFactory["Portfolio"].getNavBar = function (type,langcode,edit,portfolioid)
//==============================
{
	var html = "";
	var rootid = $(UICom.root.node).attr('id');
	html += "<nav class='navbar navbar-expand-md navbar-dark'>";
	html += "	<div>";
	html += "	<a  onclick='toggleSideBar()' class='nav-item button icon'><i class='fa fa-bars'></i></a>";
	html += "	<a class='navbar-brand' id='sidebar_"+rootid+"' onclick=\"displayPage('"+rootid+"',1,'"+type+"','"+langcode+"',"+g_edit+")\">";
	html += 		UICom.structure["ui"][rootid].getLabel('sidebar_'+rootid);
	html += "	</a>";
	html += "	</div>";
	html += "	<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#collapse-2' aria-controls='collapse-1' aria-expanded='false' aria-label='Toggle navigation'>";
	html += "			<span class='navbar-toggler-icon'></span>";
	html += "	</button>";
	html += "	<div class='navbar-collapse collapse' id='collapse-2'>";
	html += "		<ul class='ml-auto navbar-nav'>";
	//-------------------- WELCOME PAGE EDIT -----------
	html += "		<li id='welcome-edit'></li>";
	html += "		<li id='welcome-add' class='nav-item dropdown'></li>";
	//-------------------- ACTIONS----------------------
	var actions = UIFactory.Portfolio.getActions(portfolioid);
	if (actions!='') {
		html += "		<li class='nav-item dropdown'>";
		html += "			<a class='nav-link dropdown-toggle' href='#' id='actionsDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		html += "				Actions";
		html += "			</a>";
		html += "			<div class='dropdown-menu'>";
		html += actions;
		html += "			</div>";
		html += "		</li>";
	}
	//-------------------- ROLES-------------------------
	if (g_userroles[0]=='designer') {
		html += "		<li class='nav-item dropdown'>";
		html += "			<a class='nav-link dropdown-toggle' href='#' id='actionsDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		html += 				karutaStr[LANG]['role']+" : <span id='userrole'>designer</span>";
		html += "			</a>";
		html += "			<div class='dropdown-menu'>";
		html += "				<a class='dropdown-item' onclick=\"setDesignerRole('designer')\">designer</a>";
		for (role in UICom.roles) {
			if (role!="designer")
				html += "		<a class='dropdown-item' onclick=\"setDesignerRole('"+role+"')\">"+role+"</a>";
		}
		html += "			</div>";
		html += "		</li>";
	}
	//-------------------- MODE READ/EDIT---------------
	html += "			<li id='toggle-mode' class='nav-item'>";
	var toggle_mode_class = (g_edit) ? "fas fa-toggle-on":"fas fa-toggle-off";
	html += "				<span>"+karutaStr[LANG]["write-mode"]+"</span>&nbsp;<a onclick='toggleMode()' data-title='"+karutaStr[LANG]["write-mode"]+"' data-toggle='tooltip' data-placement='bottom'><i id='toggle-mode-icon' class='"+toggle_mode_class+"'></i></a>";
	html += "			</li>";
	//-------------------- REFRESH---------------
	html += "			<li class='nav-item icon'>";
	html += "				<a id='refresh-portfolio' onclick='fill_main_page()' class='nav-link fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-reload"]+"' data-toggle='tooltip' data-placement='bottom'></a>";
	html += "			</li>";
	//------------------------------------------------
	html += "		</ul>";
	html += "	</div><!-- class='container-fluid' -->";
	html += "</nav>";
	return html;
}

//==================================================
UIFactory["Portfolio"].displayComments = function(destid,node,type,langcode)
//==================================================
{
	var html = "";
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	var multilingual = $(node.multilingual)
	if (!multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var text = $(node.context_text_node[langcode]).text();
	html += "<div>"+text+"</div>";
	$("#"+destid).append($(html));	
};

//==================================
UIFactory["Portfolio"].displaySelectMultiple = function(selectedlist,destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < portfolios_list.length; i++) {
		var checked = selectedlist.includes(portfolios_list[i].id);
		if (!checked) {
			var input = portfolios_list[i].getSelector(null,null,'select_portfolios',false);
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));			
		}
	}
};

//==================================
UIFactory["Portfolio"].displaySelectPortfolios = function(selectedlist,destid)
//==================================
{
	var html = "";
	var text1 = karutaStr[LANG]['projects'];
	var text2 = karutaStr[LANG]['portfolios'];
	html += "<h4 id='selectform-projects-label'>"+text1+"</h4>";
	html += "<div id='selectform-projects'></div>";
	html += "<h4 id='selectform-portfolios-label'>"+text2+"</h4>";
	html += "<div id='selectform-portfolios'></div>";
	$("#"+destid).html(html);
	$("#selectform-projects").html($(""));
	$("#selectform-portfolios").html($(""));
	UIFactory["Portfolio"].displayTreeSelectMultiple(selectedlist,0,null);
	if (number_of_portfolios==0)
		$("#selectform-portfolios-label").hide();
//	if (number_of_projects==0)
//		$("#selectform-projects-label").hide();
	
};

//==================================
UIFactory["Portfolio"].prototype.getSelector = function(attr,value,name,no_text)
//==================================
{
	var id = this.id;
	var html = "<input type='checkbox' name='"+name+"' value='"+id+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if (no_text)
		html += "> </input>";
	else {
		var label = this.label_node[LANGCODE].text();
		var code = this.code_node.text();
		var owner = (Users_byid[this.ownerid]==null) ? "??? "+this.ownerid:Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
		html += "> "+label+" // "+code+" ("+owner+") </input>";		
	}
	return html;
};

//==================================
UIFactory["Portfolio"].displayTreeSelectMultiple = function(selectedlist,nb,dest,langcode,parentcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (nb<portfolios_list.length) {
		if (portfolios_list[nb]==null) { // has been removed
			nb++;
			UIFactory["Portfolio"].displayTreeSelectMultiple(selectedlist,nb,dest,langcode,parentcode);
		} else {
			var portfolio = portfolios_list[nb];
			if (dest!=null) {
				portfolio.display[dest] = langcode;
			}
			//---------------------
			var html = "";
			var portfoliocode = portfolio.code_node.text();
			var owner = (Users_byid[portfolio.ownerid]==null) ? "??? "+portfolio.ownerid:Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
			if (portfolio.semantictag.indexOf('karuta-project')>-1 && portfoliocode!='karuta.project'){
				//-------------------- PROJECT ----------------------
				html += "<div id='selectform-project_"+portfolio.id+"' class='project'>";
				html += "	<div class='row row-label'>";
				html += "		<div onclick=\"javascript:toggleProject2Select('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent2Select_"+portfolio.id+"' class='button fas fa-plus'></span></div>";
				html += "		<div class='project-label col-md-4 col-sm-4 col-xs-3'>"+portfolio.label_node[langcode].text()+"</div>";
				html += "		<div class='project-label col-md-3 col-sm-3 hidden-xs'>"+owner+"</div>";
				html += "		<div id='selectform-comments_"+portfolio.id+"' class='col-md-4 col-sm4 col-xs-4 comments'></div><!-- comments -->";
				html += "	</div>";
				html += "	<div class='project-content' id='selectform-content-"+portfolio.id+"' style='display:none'></div>";
				html += "</div><!-- class='project'-->"
				$("#selectform-projects").append($(html));
				UIFactory["Portfolio"].displayComments('selectform-comments_'+portfolio.id,portfolio);
				nb++;
				UIFactory["Portfolio"].displayTreeSelectMultiple(selectedlist,nb,'selectform-content-'+portfolio.id,langcode,portfoliocode);
			} else {
				//-------------------- PORTFOLIO ----------------------
				var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (parentcode!= null && portfolio_parentcode==parentcode)
					$("#"+dest).append($("<div class='row' id='selectform-portfolio_"+portfolio.id+"' onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\""+portfolio.code_node.text()+"<br>"+owner+"\"></div>"));
				else {
					$("#selectform-portfolios").append($("<div class='row' id='selectform-portfolio_"+portfolio.id+"'  onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\""+portfolio.code_node.text()+"<br>"+owner+"\"></div>"));
				}
				var checked = selectedlist.includes(portfolio.id);
				$("#selectform-portfolio_"+portfolio.id).html(portfolio.getPortfolioSelector(null,null,'select_portfolios',checked,"#selectform-portfolio_"+portfolio.id,langcode,parentcode,owner));
/*
				if (!checked) {
//					$("#selectform-portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#selectform-portfolio_"+portfolio.id,'select',langcode,parentcode,owner));
					$("#selectform-portfolio_"+portfolio.id).html(portfolio.getPortfolioSelector(null,null,'select_portfolios',"#selectform-portfolio_"+portfolio.id,langcode,parentcode,owner));
				}
				*/
				nb++;
				if (nb<portfolios_list.length)
					UIFactory["Portfolio"].displayTreeSelectMultiple(selectedlist,nb,dest,langcode,parentcode);
			}
		}
	}
};

//==================================
UIFactory["Portfolio"].prototype.getPortfolioSelector = function(attr,value,name,checked,dest,langcode,parentcode,owner)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var tree_type = this.getTreeType();
	//---------------------
	var owner = (Users_byid[this.ownerid]==null) ? "??? "+this.ownerid:Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	//---------------------
	var id = this.id;
	var html = "";
	html += "<div class='col-md-1 col-xs-1'>";
	html += "<input type='checkbox' name='"+name+"' value='"+id+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if (checked) {
		html += " checked='true' disabled='true'> </input>";
	} else {
		html += "> </input>";
	}
	html += "</div>";
	html += "<div class='col-md-5 col-sm-5 col-xs-10'><span class='portfolio-label' >"+this.label_node[langcode].text()+"</span> "+tree_type+"</div>";
	html += "<div class='col-md-6 col-sm-6 hidden-xs' >"+this.code_node.text()+"</a></div>";
	return html;
};

//==================================
UIFactory["Portfolio"].prototype.getTreeType = function()
//==================================
{
	var tree_type = "";
	var semtag = "";
	if (this.semantictag!=undefined)
		semtag = this.semantictag;
	if (semtag.indexOf('karuta-components')>-1)
		tree_type='<span class="fa fa-wrench" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-model')>-1)
		tree_type='<span class="fa fa-file-o" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-instance')>-1)
		tree_type='<span class="fa fa-file" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-report')>-1)
		tree_type='<span class="fa fa-line-chart" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-batch')>-1)
		tree_type='<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-project')>-1)
		tree_type='<span class="fa fa-folder-o" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-rubric')>-1)
		tree_type='<span class="glyphicon glyphicon-list" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-dashboard')>-1)
//		tree_type='<span class="fa fa-dashboard" aria-hidden="true"></span>';
		tree_type='<span class="fa fa-line-chart" aria-hidden="true"></span>';
	return tree_type;
};

//==================================
UIFactory["Portfolio"].removePortfolios = function() 
//==================================
{
	$("#wait-window").show();
	//----------------
	$.ajaxSetup({async: false});
	for (var i=0;i<portfolios_list.length;i++){
		var uuid = portfolios_list[i].id;
		var url = serverBCK_API+"/portfolios/portfolio/" + uuid + "?active=false";
		$.ajax({
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in removePortfolios : "+jqxhr.responseText);
			}
		});
	}
	searchPortfolio();
	$("#wait-window").hide();
	$.ajaxSetup({async: true});
	//----------------
}

//==================================
UIFactory["Portfolio"].removeSearchedPortfolios = function() 
//==================================
{
	$("#wait-window").show();
	//----------------
	$.ajaxSetup({async: false});
	for (var i=0;i<searched_portfolios_list.length;i++){
		var uuid = searched_portfolios_list[i].id;
		var url = serverBCK_API+"/portfolios/portfolio/" + uuid + "?active=false";
		$.ajax({
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			data : "",
			success : function(data) {
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in removePortfolios : "+jqxhr.responseText);
			}
		});
	}
	searchPortfolio();
	$("#wait-window").hide();
	$.ajaxSetup({async: true});
	//----------------
}

//==================================
UIFactory["Portfolio"].emptyBin = function() 
//==================================
{
	$("#wait-window").show();
	//----------------
	$.ajaxSetup({async: false});
	for (var i=0;i<bin_list.length;i++){
		if (bin_list[i]!=null) {
			UIFactory.Portfolio.del(bin_list[i].id);
		}
	}
	searchPortfolio();
	$("#wait-window").hide();
	$.ajaxSetup({async: true});
	//----------------
}

//==================================
UIFactory["Portfolio"].getListPortfolios = function(userid,firstname,lastname) 
//==================================
{

	var url0 = serverBCK_API+"/portfolios?active=1&userid="+userid;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url0,
		userid : userid,
		firstname :firstname,
		lastname :lastname,
		success : function(data) {
			UIFactory["Portfolio"].parse(data);
			UIFactory["Portfolio"].displayListPortfolios(this.userid,this.firstname,this.lastname);
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1: "+textStatus);
		}
	});
}

//==================================
UIFactory["Portfolio"].displayListPortfolios = function(userid,firstname,lastname,langcode)
//==================================
{
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var application_server = serverURL+"/"+appliname;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#edit-window-footer").html("");
	$("#edit-window-title").html(karutaStr[LANG]['list_user_portfolio']+" " + firstname + " " +lastname);
	var js1 = "javascript:$('#edit-window').modal('hide')";

	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<table id='displayListPortfolios' class='zebra-table'>";
	html += "<tr class='head'><td>"+karutaStr[LANG]['label']+"</td><td>"+karutaStr[LANG]['role']+"</td><td>"+karutaStr[LANG]['code']+"</td></tr>"
	for (var i=0;i<portfolios_list.length;i++)
		{
		var portfolio = portfolios_list[i];
		var portfolioid = portfolio.id;
		var portfoliocode = portfolio.code_node.text();
		var portfolio_label = portfolio.label_node[langcode].text();

		html += "<tr><td class='portfolio_label'>"+portfolio_label+"</td><td class='role' id='role_"+portfolioid+"'>&nbsp;</td><td class='portfoliocode'>"+portfoliocode+"</td><td id='role_"+portfolioid+"'></td></tr>";
		$.ajax({ // get group-role for the user
			Accept: "application/xml",
			type : "GET",
			dataType : "xml",
// https://www.eportfolium.com/karuta-backend2.3/rest/api/rolerightsgroups/all/users?portfolio=19d287ad-8d5f-41c8-8df8-3d54db51daa1
			url : serverBCK_API+"/rolerightsgroups/all/users?portfolio=" + portfolioid,
			userid : userid,
			portfolioid : portfolioid,
			success : function(data) {
				var userrole = $("user[id='"+this.userid+"']",data).parent().parent().find('label').text();
				$("#role_"+this.portfolioid).html(userrole);
			}
		});

		}
	html += "</table>";
	$("#edit-window-body").html(html);
	$('#edit-window').modal('show')
	//--------------------------
}

//=======================================================================
function confirmDelPortfolio(uuid) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelProject(uuid,projectcode) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.delProject('"+uuid+"','"+projectcode+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//=======================================================================
function confirmDelPortfolios_EmptyBin() 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.emptyBin()\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------


//==================================
UIFactory["Portfolio"].displayProject = function(nb,dest,type,langcode,parentcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (nb<portfolios_list.length) {
		if (portfolios_list[nb]==null) { // has been removed
			nb++;
			UIFactory["Portfolio"].displayProject(nb,dest,type,langcode,parentcode);
		} else {
			var portfolio = portfolios_list[nb];
			if (dest!=null) {
				portfolio.display[dest] = langcode;
			}
			//---------------------
			var html = "";
			var portfoliocode = portfolio.code_node.text();
			var owner = (Users_byid[portfolio.ownerid]==null) ? "":Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
			if (portfolio.semantictag!= undefined && portfolio.semantictag.indexOf('karuta-project')>-1 && portfoliocode!='karuta.project'){
					if (number_of_projects>0) {
						$("#export-"+projects_list[number_of_projects-1].uuid).attr("href",serverBCK_API+"/portfolios/zip?portfolios="+projects_list[number_of_projects-1].portfolios);
					}
					var portfolio_label = portfolio.label_node[langcode].text();
					if (portfolio_label==undefined || portfolio_label=='' || portfolio_label=='&nbsp;')
						portfolio_label = '- no label in '+languages[langcode]+' -';
					//-------------------- PROJECT ----------------------
					projects_list[number_of_projects] = {"uuid":portfolio.id,"portfoliocode":portfoliocode,"portfoliolabel":portfolio_label,"portfolios":""};
					projects_list[number_of_projects].portfolios += portfolio.id;
					number_of_projects_portfolios = 0;
					html += "<div id='project_"+portfolio.id+"' class='project folder' ondrop='dropPortfolio(event)' ondragover='allowDropPortfolio(event)'>";
					html += "	<div id='label_"+portfolio.id+"' class='row-label'>";
					html += "		<div id='portfoliolabel_"+portfolio.id+"' onclick=\"toggleProjectContent('"+portfolio.id+"','"+portfoliocode+"')\" class='project-label'>"+portfolio_label+"&nbsp;<span class='number_of_projects_portfolios badge' id='number_of_projects_portfolios_"+portfolio.id+"'></span></div>";
					html += "		</div>";
					html += "	</div>";
					html += "</div><!-- class='project'-->"
					$("#"+dest).append($(html));
					if (!loadedProjects[portfoliocode] && localStorage.getItem('currentDisplayedProjectCode')==portfoliocode) {
						loadProjectContent('project-portfolios',portfoliocode);
						$(".row-label").removeClass('active');
						$("#label_"+portfolio.id).addClass('active');
					}
					countProjectPortfolios(projects_list[number_of_projects].uuid);
					number_of_projects ++;
					nb++;
					if (nb<portfolios_list.length)
						UIFactory["Portfolio"].displayProject(nb,dest,type,langcode,portfoliocode);
			} else {
				nb++;
				if (nb<portfolios_list.length)
					UIFactory["Portfolio"].displayProject(nb,dest,type,langcode,portfoliocode);
			}

		}
	}
}

//==================================
toggleProjectContent = function(portfolioid,portfoliocode)
//==================================
{
	if ($("#label_"+portfolioid).hasClass('active')) {
		cleanList();
		localStorage.setItem('currentDisplayedProjectCode','none');
	} else {
		cleanList();
		loadAnddisplayProjectContent('project-portfolios',portfoliocode);
		$(".row-label").removeClass('active');
		$("#label_"+portfolioid).addClass('active');
		localStorage.setItem('currentDisplayedProjectCode',portfoliocode);
	}
}

//==================================
loadAnddisplayProjectContent = function(dest,parentcode,langcode)
//==================================
{
	$("#wait-window").show();
	if (!loadedProjects[parentcode])
		loadProjectContent('project-portfolios',parentcode);
	else
		UIFactory.Portfolio.displayProjectContent(dest,parentcode,langcode);
}

//==================================
UIFactory["Portfolio"].displayProjectContent = function(dest,parentcode,langcode)
//==================================
{
	$("#project-portfolios").show();
	loadedProjects[parentcode] = true;
	$("#"+dest).html("");
	var html = "";
	if (parentcode=='false') {
		var text2 = karutaStr[LANG]['portfolios-not-in-project'];
		html = "<h3  class='bin-label'>"+text2+"</h3>";
	}
	$("#"+dest).html($(html));
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	for (var i=0; i<portfolios_list.length;i++){
		var portfolio = portfolios_list[i];
		//---------------------
		var html = "";
		var portfoliocode = portfolio.code_node.text();
		var owner = (Users_byid[portfolio.ownerid]==null) ? "":Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
		if (portfoliocode==parentcode){
			//-------------------- PROJECT ----------------------
			var portfolio_label = portfolio.label_node[langcode].text();
			if (portfolio_label==undefined || portfolio_label=='' || portfolio_label=='&nbsp;')
				portfolio_label = '- no label in '+languages[langcode]+' -';
			html += "<div id='projectcontent_"+portfolio.id+"' class='project-header'>";
			html += "	<div class='row row-label'>";
			html += "		<div class='col-4 project-label' id='portfoliolabel_"+portfolio.id+"' >"+portfolio_label+"</div>";
			html += "		<div class='col-2 d-none d-md-block project-label'>"+owner+"</div>";
			html += "		<div class='col-4 d-none d-sm-block comments' id='project-comments_"+$(portfolios_byid[portfolio.id].root).attr("id")+"'> </div><!-- comments -->";
			html += "		<div class='col-1'>";
			//------------ buttons ---------------
			html += "			<div class='dropdown portfolio-menu'>";
			if (USER.admin || (portfolio.owner=='Y' && !USER.xlimited)) {
				html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
				html += "			<div class='dropdown-menu  dropdown-menu-right'>";
				html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callRename('"+portfolio.id+"',null,true)\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
				html += "			<a class='dropdown-item' id='remove-"+portfolio.id+"' style='display:block' onclick=\"UIFactory['Portfolio'].removeProject('"+portfolio.id+"','"+portfolio.code_node.text()+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
				html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callChangeOwner('"+portfolio.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["changeOwner"]+"</a>";
				html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsers('"+portfolio.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
				html += "				<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+portfolio.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
				html += "			<a class='dropdown-item' id='export-"+portfolio.id+"' href='' style='display:block'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-project"]+"</a>";
				html += "			<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callArchive('"+portfoliocode+"')\" ><i class='fa fa-download'></i> "+karutaStr[LANG]["archive-project"]+"</a>";
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
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.model')\" >"+karutaStr[LANG]['karuta.model']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.rubrics')\" >"+karutaStr[LANG]['karuta.rubrics']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.parts')\" >"+karutaStr[LANG]['karuta.parts']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.report')\" >"+karutaStr[LANG]['karuta.report']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.batch')\" >"+karutaStr[LANG]['karuta.batch']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.batch-form')\" >"+karutaStr[LANG]['karuta.batch-form']+"</a>";
				html += "					<a class='dropdown-item' onclick=\"UIFactory['Portfolio'].create('"+portfoliocode+"')\" >"+karutaStr[LANG]['create_tree']+"</a>";
				html += "				</ul>";
				html += "			</div>";
			}
			//------------------------end menu-burger
			html += "		</div><!-- class='col-1' -->";
			html += "	</div><!-- class='row' -->";
			html += "</div><!-- class='project'-->"
			$("#"+dest).append($(html));
			//----------------------
			UIFactory["Portfolio"].displayComments('project-comments_'+$(portfolios_byid[portfolio.id].root).attr("id"),portfolio);
			var portfolio_list = "";
			for (var j=0; j<portfolios_list.length;j++){
				var portfolio1 = portfolios_list[j];
				var portfoliocode1 = portfolio1.code_node.text();
				var portfolio_parentcode1 = portfoliocode1.substring(0,portfoliocode1.indexOf("."));
				if ((parentcode!= null && portfolio_parentcode1==parentcode) || portfoliocode1==parentcode) {
					portfolio_list += "," + portfolio1.id;
				}
			}
			if (portfolio_list.length>0)
				portfolio_list = portfolio_list.substring(1);
			$("#export-"+portfolio.id).attr("href",serverBCK_API+"/portfolios/zip?portfolios="+portfolio_list);
			//----------------------
		} else {
			//-------------------- PORTFOLIO ----------------------
			var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
			if ((parentcode!= null && portfolio_parentcode==parentcode) || (parentcode=='false' && portfolio.semantictag.indexOf('karuta-project')<0)) {
				$("#"+dest).append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
				if (!portfolio.notvisible || (USER.creator && !USER.limited) )
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,type,langcode,parentcode,owner));
			}
		}
		$(window).scrollTop(0);
		$("#wait-window").hide();
	}
}