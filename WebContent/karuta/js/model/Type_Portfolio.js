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
var projects_list = [];
var displayProject = {};
var number_of_projects = 0;
var number_of_projects_portfolios = 0;
var number_of_portfolios = 0;
var loadedProjects = {};
var list_view_type = localStorage.getItem('list_view_type');
if (list_view_type==null)
	list_view_type = "list";
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
	this.visible = ($("metadata",node).attr('list-novisible')=='Y') ? false : true;
	this.autoload = ($("metadata",node).attr('autoload')=='Y') ? true : false;
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
	this.displayLabel = {};
	this.groups = [];
	this.roles = [];
	if (this.semantictag.indexOf("karuta-project")>-1)
		this.rights = "";
	else
		this.rights = this.root.getRights(this.rootid);
	this.model = $("role",this.rights).length==0;
};

//==================================
UIFactory["Portfolio"].getLogicalMetadataAttribute= function(node,attribute)
//==================================
{
	var val = ($("metadata",node).attr(attribute)=='Y') ? true : false;
	if (val==undefined)
		val = false;
	return val;
	}

//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------ DRAG AND DROP -----------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
function dragPortfolio(ev)
//==================================
{
	var portfolioid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var parentid = ev.target.getAttribute('parentid');
	var index = ev.target.getAttribute('index');
	ev.dataTransfer.setData("uuid", portfolioid);
	ev.dataTransfer.setData("type", 'portfolio');
	ev.dataTransfer.setData("parentid", parentid);
	ev.dataTransfer.setData("index", index);
}


//--------------------------------------------------------------
//--------------------------------------------------------------
//------------------ DISPLAY -----------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["Portfolio"].prototype.displayOwner = function(dest)
//==================================
{
	if (Users_byid[this.ownerid]==null)
		UIFactory.User.loadUserAndDisplay(this.ownerid,dest,'(firstname-lastname)');
	else {
		var owner = Users_byid[this.ownerid].getView(null,'(firstname-lastname)',null);
		$("#"+dest).html(owner);
	}
}
//==================================
UIFactory["Portfolio"].prototype.getPortfolioView = function(dest,type,langcode,parentcode,owner,gid)
//==================================
{
	if (dest!=null) {
		this.display[dest] = type;
	}
	//---------------------
	if (this.date_modified!=null) {
		var msec = Date.parse(this.date_modified);
		var d = new Date(msec);
		var dmodified = d.toLocaleDateString();
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
		tree_type = '<span class="fas fa-file" aria-hidden="true"></span>';
	//---------------------
	var portfolio_label = this.label_node[langcode].text();
	if (portfolio_label==undefined || portfolio_label=='' || portfolio_label=='&nbsp;')
		portfolio_label = '- no label in '+languages[langcode]+' -';
	//---------------------
	var html = "";
	//--------------------------------------------------------------------------------------------
	if (type=='list' || type=='portfolio') {
		html += "<div class='portfolio-label col-10 col-md-5' onclick=\"display_main_page('"+this.id+"')\" ><a class='portfolio-label' >"+portfolio_label+"</a> "+tree_type+" <span id='owner_"+this.id+"' class='owner'/> </div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-4 d-none d-md-block'>";
			html += "<span id='pcode_"+this.id+"' class='portfolio-code'>"+this.code_node.text()+"</span>";
			html += " <span class='copy-button fas fa-clipboard' ";
			html += "   onclick=\"copyInclipboad('"+this.id+"')\" ";
			html += "   onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + karutaStr[LANG]['copy'] +" : "+this.code_node.text()+"\" ";
			html += "   onmouseout=\"outCopy('"+this.id+"')\">";
			html += "</span>";
			html += "</div>";
		}
		if (this.date_modified!=null) {
			html += "<div class='col-2 d-none d-md-block' onclick=\"display_main_page('"+this.id+"')\">"+dmodified+"</div>";
		}
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y' && !USER.xlimited) || (USER.creator && !USER.limited)) {
			html += UIFactory.Portfolio.getAdminPortfolioMenu(gid,this,semtag);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	//--------------------------------------------------------------------------------------------
	if (type=='portfoliogroup') {
		html += "	<div class='portfoliogroup-portfolio-label' >"+portfolio_label+" <span class='fas fa-trash' onclick=\"UIFactory.PortfoliosGroup.confirmRemove('"+gid+"','"+this.id+"')\"></span></div>";
	}
	//--------------------------------------------------------------------------------------------
	if (type=='portfoliogroup-portfolio') {
		html += "	<div class='portfoliogroup-portfolio-label' >"+portfolio_label+"</div>";
	}
	//--------------------------------------------------------------------------------------------
	if (type=='card') {
		html += "	<div class='card-header' >";
		html += portfolio_label;
		html += "	</div>";
		html += "	<div class='card-body' >";
		html += this.context_text_node[langcode].text();
		html += "	</div>";
		html += "	<div class='card-footer' >";
		if (this.date_modified!=null) {
			html += dmodified;
		}
		html += "	</div>";
	}
	//--------------------------------------------------------------------------------------------
	if (type=='card-admin') {
		html += "<div class='card-header' >";
		html += tree_type + " <a class='portfolio-label' onclick=\"display_main_page('"+this.id+"')\" >"+portfolio_label+"</a></div>"
		html += "	</div>";
		html += "<div class='card-body' >";
		if (this.context_text_node[langcode].text()!="")
			html += "<div class='comments' >"+this.context_text_node[langcode].text()+"</div>";
		html += "<div id='pcode_"+this.id+"' class='portfolio-code'>"+this.code_node.text();
		html += " <span class='copy-button fas fa-clipboard' ";
		html += "   onclick=\"copyInclipboad('"+this.id+"')\" ";
		html += "   onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\"" + karutaStr[LANG]['copy'] +" : "+this.code_node.text()+"\" ";
		html += "   onmouseout=\"outCopy('"+this.id+"')\">";
		html += "</span></div>";
		html += "	<div id='owner_"+this.id+"' class='owner'></div>";
		html += "</div>";
		html += "<div class='card-footer' >";
		if (this.date_modified!=null) {
			html += dmodified;
		}
		//------------ buttons ---------------
		html += "<div class='card-button'>";
		if (USER.admin || (this.owner=='Y' && !USER.xlimited) || (USER.creator && !USER.limited)) {
			html += UIFactory.Portfolio.getAdminPortfolioMenu(gid,this,semtag);
		}
		html += "</div>";
		//------------------------------------
		html += "</div>";
	}
	//--------------------------------------------------------------------------------------------
	if (type=='select') {
//		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_portfolios',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='portfolio-label' >"+this.label_node[langcode].text()+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='portfolio-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code_node.text()+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
//		}
	}
	//--------------------------------------------------------------------------------------------
	return html;
};

//======================
UIFactory["Portfolio"].getAdminPortfolioMenu = function(gid,self,semtag)
//======================
{	
	var html = "";
	html += "<div class='dropdown menu'>";
	html += "<button id='dropdown"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
	html += "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown"+self.id+"'>";
	if (gid==null) {
		if (USER.admin || (self.owner=='Y' && !USER.xlimited))
			html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callRenameMove('"+self.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename-move"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callRenameCopy('"+self.id+"')\" ><i class='fa fa-file-o'></i><i class='far fa-copy'></i> "+karutaStr[LANG]["button-duplicate"]+"</a>";
//		html += "<a class='dropdown-item' onclick=\"document.getElementById('wait-window').style.display='block';UIFactory.Portfolio.copy('"+self.id+"','"+self.code_node.text()+"-copy',true)\" ><i class='fa fa-file-o'></i><i class='far fa-copy'></i> "+karutaStr[LANG]["button-duplicate"]+"</a>";
		if (semtag.indexOf('karuta-model')>-1 || semtag.indexOf('karuta-batch-form')>-1)
			html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callRenameInstantiate('"+self.id+"')\" ><i class='fas fa-copy'></i> "+karutaStr[LANG]["button-instantiate"]+"</a>";
//			html += "<a class='dropdown-item' onclick=\"document.getElementById('wait-window').style.display='block';UIFactory.Portfolio.instantiate('"+self.id+"','"+self.code_node.text()+"-instance',true)\" ><i class='fas fa-copy'></i> "+karutaStr[LANG]["button-instantiate"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.confirmDelPortfolio('"+self.id+"')\" ><i class='fas fa-trash'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
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
UIFactory["Portfolio"].getTranslateMenu = function()
//======================
{
	var html = "";
	if (languages.length<3)
		html += "<a class='dropdown-item'  onclick=\"g_translate[0]=0;g_translate[1]=1;UIFactory.Portfolio.displayPortfolio('portfolio-container','translate');\">"+karutaStr[LANG]['translate']+" "+languages[0]+"-"+languages[1]+"</a>";
	else {
		for (var i=0;i<languages.length-1;i++){
			html += "<a class='dropdown-item'  onclick=\"g_translate[i]=0;g_translate[i+1]=1;UIFactory.Portfolio.displayPortfolio('portfolio-container','translate');\">"+karutaStr[LANG]['translate']+" "+languages[i]+"-"+languages[i+1]+"</a>";
		}
		html += "<a class='dropdown-item'  onclick=\"g_translate[0]=0;g_translate[languages.length-1]=1;UIFactory.Portfolio.displayPortfolio('portfolio-container','translate');\">"+karutaStr[LANG]['translate']+" "+languages[0]+"-"+languages[languages.length-1]+"</a>";
	}
	return html
}
//======================
UIFactory["Portfolio"].displayPortfolio = function(destid,type,langcode,edit)
//======================
{	var html = "";
	if (type==null || type==undefined)
		type = 'standard';
	g_display_type = type;
	var uuid = $("#page").attr('uuid');  // current page
	//---------------------------------------
	var rootid = UICom.rootid;
	html += "	<a class='navbar-brand' id='sidebar_"+rootid+"' onclick=\"displayPage('"+rootid+"',1,'"+type+"','"+langcode+"',"+g_edit+")\">";
	html += 		UICom.structure["ui"][rootid].getLabel('sidebar_'+rootid);
	html += "	</a>";
	$("#sidebar_"+rootid).replaceWith($(html));
	//---------------------------------------
	html = "";
	if (type=='model'){
		html += "<div id='navigation_bar'></div>";
		html += "<div id='contenu' class='container-fluid'></div>";
		html += "<div id='footer'></div>";
		$("#"+destid).html($(html));
	}
	else if (type=='translate'){
		if (g_bar_type.indexOf('horizontal')>-1) {
			html += "<div id='breadcrumb'></div>";
			html += "<div id='contenu' class='container-fluid'></div>";
			$("#"+destid).html($(html));
			$("#menu_bar").show();
			UIFactory["Portfolio"].displayHorizontalMenu(UICom.root,'menu_bar',type,LANGCODE,edit,UICom.rootid);
		}
		else {
			$("#menu_bar").hide();
			html += "	<div class='row'>";
			html += "		<div class='col-sm-3' id='sidebar'></div>";
			html += "		<div class='col-sm-9' id='contenu'></div>";
			html += "	</div>";
			$("#"+destid).html($(html));
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
		}
		$("#sidebar_"+uuid).click();
	}
	else if (type=='standard' || type=='raw'){
		if (g_bar_type.indexOf('horizontal')>-1) {
			html += "<div id='breadcrumb'></div>";
			html += "<div id='contenu' class='container-fluid'></div>";
			$("#"+destid).html($(html));
			$("#menu_bar").show();
			UIFactory["Portfolio"].displayHorizontalMenu(UICom.root,'menu_bar',type,LANGCODE,edit,UICom.rootid);
		}
		else {
			html += "	<div id='main-row' class='row'>";
			html += "		<div class='col-sm-3' id='sidebar'></div>";
			html += "		<div class='col-sm-9' id='contenu'></div>";
			html += "	</div>";
			$("#menu_bar").hide();
			$("#"+destid).html($(html));
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
		}
	}
	else { // unknown type
		type = "standard";
		html += "	<div id='main-row' class='row'>";
		html += "		<div class='col-sm-3' id='sidebar'></div>";
		html += "		<div class='col-sm-9' id='contenu'></div>";
		html += "	</div>";
		$("#"+destid).html($(html));
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
	}
	//---------------------------------------
	if (typeof checkIfSpecialApp == 'function') { 
		checkIfSpecialApp(UICom.structure["ui"][rootid].getCode());
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
	if (type=='standard' || type=='translate' || type=='model' || type=='raw'){
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
	if (g_configVar['portfolio-hmenu-logo']!="")
		html += "		<div id='portfolio-menu-logo' style=\""+g_configVar['portfolio-hmenu-logo-style']+"\">" + g_configVar['portfolio-hmenu-logo'] + "</div>";
	html += "	<div class='navbar-collapse collapse navbars";
	if (g_bar_type=='horizontal-right')
		html += " justify-content-end";
	html += "' id='portfolio-navbars'>";
	html += "		<ul id='parent-"+rootid+"' class='navbar-nav topbarmenu'></ul>";
	html += "	</div>";
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

//==============================
UIFactory["Portfolio"].getNavBar = function (type,langcode,edit,portfolioid)
//==============================
{
	var html = "";
	var rootid = $(UICom.root.node).attr('id');
	html += "<nav id='navbar1' class='navbar navbar-expand-md navbar-dark'>";
	html += "	<a  id='toggleSideBar' onclick='toggleSideBar()' class='nav-item button icon'><i class='fa fa-bars'></i></a>";
	html += "	<a class='navbar-brand' id='sidebar_"+rootid+"' onclick=\"displayPage('"+rootid+"',1,'"+type+"','"+langcode+"',"+g_edit+")\">";
	html += 		UICom.structure["ui"][rootid].getLabel('sidebar_'+rootid);
	html += "	</a>";
	html += "	</div>";
	html += "	<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='.navbars' aria-controls='portfolio-navbars' aria-expanded='false' aria-label='Toggle navigation'>";
	html += "			<span class='navbar-toggler-icon'></span>";
	html += "	</button>";
	html += "	<div class='navbar-collapse collapse navbars' id='portfolio-navbars'>";
	html += "		<ul class='ml-auto navbar-nav'>";
	//-------------------- SEARCH -----------
	html += "			<li class='input-group'>";
	html += "				<input type='text' id='"+type+"-search-text-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-portfolio-text']+"'>";
	html += "				<div class='input-group-append'>";
	html += "					<button type='button' onclick=\"UIFactory.Portfolio.search('"+type+"')\" class='btn'><i class='fas fa-search'></i></button>";
	html += "				</div><!-- /input-group-append -->";
	html += "			</li><!-- /input-group -->";
	//-------------------- WELCOME PAGE EDIT -----------
	html += "			<li id='welcome-edit'></li>";
	html += "			<li id='welcome-add' class='nav-item dropdown'></li>";
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
	if (g_userroles[0]=='designer' || USER.admin) {
		setDesignerRole('designer');
		html += "		<li class='nav-item dropdown'>";
		html += "			<a class='nav-link dropdown-toggle' href='#' id='actionsRoles' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
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
	if (USER.username.indexOf("karuser")<0) {
		html += "			<li id='toggle-mode' class='nav-item'>";
		var toggle_mode_class = (g_edit) ? "fas fa-toggle-on":"fas fa-toggle-off";
		html += "				<span>"+karutaStr[LANG]["write-mode"]+"</span>&nbsp;<a onclick='toggleMode()' data-title='"+karutaStr[LANG]["write-mode"]+"' data-toggle='tooltip' data-placement='bottom'><i id='toggle-mode-icon' class='"+toggle_mode_class+"'></i></a>";
		html += "			</li>";
	}
	//-------------------- REFRESH---------------
	html += "			<li class='nav-item icon'>";
	html += "				<a id='refresh-portfolio' onclick='fill_main_page()' class='nav-link fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-reload"]+"' data-toggle='tooltip' data-placement='bottom'></a>";
	html += "			</li>";
	//------------------------------------------------
	html += "		</ul>";
	html += "</nav>";
	html += "<nav id='menu_bar' class='navbar navbar-expand-md navbar-light bg-lightfont'>";
	html += "</nav>";
	return html;
}

/*
//======================
UIFactory["Portfolio"].displayNodes = function(destid,tree,semtag,langcode,edit)
//======================
{	
	$("#"+destid).html("");
	var rootnodeid = $("*:has(metadata[semantictag="+semtag+"])",tree).attr("id");
	var depth = 99;
	UIFactory['Node'].displayNode('standard',UICom.structure['tree'][rootnodeid],destid,depth,langcode,edit);
};
*/

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
UIFactory["Portfolio"].load = function(portfolioid,level) 
//==================================
{
	var param = "";
	if (level==null)
		param="?resources=true";
	else
		param = "?level=" + level;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + param,
		success : function(data) {
			UICom.parseStructure(data,true);
			UIFactory.Portfolio.parse_add(data);
		}
	});
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
			setVariables(data);
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
			setVariables(data);
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
UIFactory.Portfolio.parse_add = function(data) 
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
			alertHTML("Error UIFactory.Portfolio.parse_add:"+uuid+" - "+e.message);
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
		searched_portfolios_list[i] = portfolios_byid[newTableau1[i][1]];
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
UIFactory["Portfolio"].search_bycode = function(code) 
//==================================
{
	var result = "";
	var url = serverBCK_API+"/portfolios?active=1&search=" + code;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			result = $("portfolio", data);
		}
	});
	return result;
};

//==================================
UIFactory["Portfolio"].getLabel_bycode = function(code,langcode) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var result = "";
	var url = serverBCK_API+"/portfolios/portfolio/code/" + code;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			var portfolio = $("portfolio", data);
			result = $("label[lang='"+languages[langcode]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",portfolio)[0]).text();
		}
	});
	return result;
};

//==================================
UIFactory["Portfolio"].getRootid_bycode = function(code) 
//==================================
{
	var result = "";
	var url = serverBCK_API+"/portfolios/portfolio/code/" + code;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			result = $("asmRoot",data).attr("id");
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
UIFactory["Portfolio"].callRenameInstantiate = function(portfolioid,langcode,project)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (project==null)
		project = false;
	//---------------------
	var js1 = "document.getElementById('wait-window').style.display='block';UIFactory.Portfolio.instantiate_rename('"+portfolioid+"',$('#code_"+portfolioid+"').val(),true,$('#label_"+portfolioid+"_"+langcode+"').val(),'root')";
	var js2 = "javascript:$('#edit-window').modal('hide')";
	var footer = "";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['button-instantiate']+"</button>";
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = portfolios_byid[portfolioid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['button-instantiate']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code <a href='javascript://' id='code_help'><span style='font-size:12px' class='fas fa-question-circle'></span></a></label>");
		var htmlCodeDivObj = $("<div></div>");
		var htmlCodeInputObj = $("<input id='code_"+portfolioid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
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
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	$('#edit-window').modal('show');
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
							$("#wait-window").hide();
							alertHTML("Error in instantiate_rename : "+jqxhr.responseText);
						}
					});
				}
			});
		},
		error : function(jqxhr,textStatus) {
			$("#wait-window").hide();
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
UIFactory["Portfolio"].callRenameCopy = function(portfolioid,langcode,project)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (project==null)
		project = false;
	//---------------------
	var js1 = "document.getElementById('wait-window').style.display='block';UIFactory.Portfolio.copy_rename('"+portfolioid+"',$('#code_"+portfolioid+"').val(),true,$('#label_"+portfolioid+"_"+langcode+"').val(),'root')";
	var js2 = "javascript:$('#edit-window').modal('hide')";
	var footer = "";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['button-duplicate']+"</button>";
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = portfolios_byid[portfolioid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['button-duplicate']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((USER.creator && !USER.limited)  || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code <a href='javascript://' id='code_help'><span style='font-size:12px' class='fas fa-question-circle'></span></a></label>");
		var htmlCodeDivObj = $("<div></div>");
		var htmlCodeInputObj = $("<input id='code_"+portfolioid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
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
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	$('#edit-window').modal('show');
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
							if (rootsemtag=="karuta-project") // folder creation - we open the new folder
								localStorage.setItem('currentDisplayedportfolioCode',targetcode);
							fill_list_page();
						},
						error : function(jqxhr,textStatus) {
							$("#wait-window").hide();
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
			$("#wait-window").hide();
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
UIFactory["Portfolio"].toggleElt = function(eltid)
//==================================
{
	var elt = document.getElementById("import-toggle_"+eltid);
	elt.classList.toggle('openSign');
	elt = document.getElementById("import-"+eltid);
	elt.classList.toggle('open');
}

//==================================
UIFactory["Portfolio"].import = function(zip,instance,foldercode)
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
	if (zip)
		url += "/zip";
	//--------------------------
	if (foldercode==null || foldercode=="") {
		html +="<div class='dropdown'>";
		html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
		html +="    Select a project ";
		html +="    <span class='caret'></span>";
		html +="  </button>";
		html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
		html +="    <a class='dropdown-item' href='#'>&nbsp;</a>";
		for (var i=0;i<folders_list.length;i++) {
			html += folders_list[i].getView('import',instance);
/*			var js = "";
			if (instance) 
				js = "$('#project').attr('value','"+folders_list[i].code_node.text()+"');$('#instance').attr('value','true')";
			else
				js = "$('#project').attr('value','"+folders_list[i].code_node.text()+"');$('#instance').attr('value','false')";
			js += ";$('#dropdownMenu1').html('"+folders_list[i].label_node[LANGCODE].text()+"')";
			if (folders_list[i].nbfolders>0) {
				html += "<div class='dropdown-submenu'>";
				html += "<a class='dropdown-item'><span class='closeSign'/>"+folders_list[i].label_node[LANGCODE].text()+"</a>";
				html += "<div class='dropdown-menu'>";
				for (uuid in folders_list[i].folders) {
					if (instance) 
						js = "$('#project').attr('value','"+folders_byid[uuid].code_node.text()+"');$('#instance').attr('value','true')";
					else
						js = "$('#project').attr('value','"+folders_byid[uuid].code_node.text()+"');$('#instance').attr('value','false')";
					js += ";$('#dropdownMenu1').html('"+folders_byid[uuid].label_node[LANGCODE].text()+"')";
					html += "<a class='dropdown-item' onclick=\""+js+"\">"+folders_byid[uuid].label_node[LANGCODE].text()+"</a>";
				}
				html += "</div>";
				html += "</div>";
			} else {
				html += "<a class='dropdown-item' onclick=\""+js+"\">"+folders_list[i].label_node[LANGCODE].text()+"</a>";
			}
*/
		}
		html +="  </ul>";
		html +="</div><br>";
		html +=" <form id='fileupload' action='"+url+"'>";
		html += " <input type='hidden' id='project' name='project' value=''>";
		html += " <input type='hidden' id='instance' name='instance' value='false'>";
		html += " <input id='uploadfile' type='file' name='uploadfile'>";
		html += "</form>";
		html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	} else {
		html +=" <form id='fileupload' action='"+url+"'>";
		html += " <input type='hidden' id='project' name='project' value='"+foldercode+"'>";
		if (instance) 
			html += " <input type='hidden' id='instance' name='instance' value='true'>";
		else
			html += " <input type='hidden' id='instance' name='instance' value='false'>";
		html += " <input id='uploadfile' type='file' name='uploadfile'>";
		html += "</form>";
		html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	}
	//--------------------------
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
			if (jqxhr.status != 200)
				alertHTML("Error : "+jqxhr.responseText);
			else
				window.location.reload();
		}
	});
	//--------------------------
	$('#edit-window').modal('show');
};
/*
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
	if (foldercode==null || foldercode=="") {
		html +="<div class='dropdown'>";
		html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
		html +="    Select a project ";
		html +="    <span class='caret'></span>";
		html +="  </button>";
		html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
		html +="    <a class='dropdown-item' href='#'>&nbsp;</a>";
		for (var i=0;i<folders_list.length;i++) {
			var js = "";
			if (instance) 
				js = "$('#project').attr('value','"+folders_list[i].code_node.text()+"');$('#instance').attr('value','true')";
			else
				js = "$('#project').attr('value','"+folders_list[i].code_node.text()+"');$('#instance').attr('value','false')";
			js += ";$('#dropdownMenu1').html('"+folders_list[i].label_node[LANGCODE].text()+"')";
			if (folders_list[i].nbfolders>0)
				html += "<a class='dropdown-item' onclick=\""+js+"\" onmouseover=\"UIFactory.Portfolio.toggleElt('"+folders_list[i].id+"')\" ><span id='import-toggle_"+folders_list[i].id+"' class='closeSign' ></span>"+folders_list[i].label_node[LANGCODE].text()+"</a>";
			else
				html += "<a class='dropdown-item' onclick=\""+js+"\">"+folders_list[i].label_node[LANGCODE].text()+"</a>";
			if (folders_list[i].nbfolders>0) {
				html += "<div id='import-"+folders_list[i].id+"' class='nested' onmouseleave=\"UIFactory.Portfolio.toggleElt('"+folders_list[i].id+"')\">";
				for (uuid in folders_list[i].folders){
					if (instance) 
						js = "$('#project').attr('value','"+folders_byid[uuid].code_node.text()+"');$('#instance').attr('value','true')";
					else
						js = "$('#project').attr('value','"+folders_byid[uuid].code_node.text()+"');$('#instance').attr('value','false')";
					js += ";$('#dropdownMenu1').html('"+folders_byid[uuid].label_node[LANGCODE].text()+"')";
					html += "<a class='dropdown-item' onclick=\""+js+"\">"+folders_byid[uuid].label_node[LANGCODE].text()+"</a>";
				}
				html += "</div>";
			}
		}
		html +="  </ul>";
		html +="</div><br>";
		html +=" <form id='fileupload' action='"+url+"'>";
		html += " <input type='hidden' id='project' name='project' value=''>";
		html += " <input type='hidden' id='instance' name='instance' value='false'>";
		html += " <input id='uploadfile' type='file' name='uploadfile'>";
		html += "</form>";
		html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	} else {
		html +=" <form id='fileupload' action='"+url+"'>";
		html += " <input type='hidden' id='project' name='project' value='"+foldercode+"'>";
		if (instance) 
			html += " <input type='hidden' id='instance' name='instance' value='true'>";
		else
			html += " <input type='hidden' id='instance' name='instance' value='false'>";
		html += " <input id='uploadfile' type='file' name='uploadfile'>";
		html += "</form>";
		html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
		
	}
	//--------------------------
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
*/
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
			fill_list_page();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].prototype.del = function() 
//==================================
{
	$.ajax({
		async: false,
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + this.id,
		data : "",
		success : function(data) {
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
	var urlS = serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+appliname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:fr;pers:mimi&format=application/pdf";
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
//	if (portfolios_byid[portfolioid].export_pdf)
//		html += "<a class='dropdown-item' href='../../../"+serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+appliname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/pdf'>"+karutaStr[LANG]['getPDF']+"</a>";
//	if (portfolios_byid[portfolioid].export_rtf)
//		html += "<a class='dropdown-item' href='../../../"+serverBCK+"/xsl?portfolioids="+portfolioid+"&xsl="+appliname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/rtf'>"+karutaStr[LANG]['getRTF']+"</a>";
//	if (portfolios_byid[portfolioid].export_htm)
//		html += "<a class='dropdown-item'  onclick='export_html()'>"+karutaStr[LANG]['getWebsite']+"</a>";
//	html += "<a class='dropdown-item'  onclick=\"toggleButton('hidden')\">"+karutaStr[LANG]['hide-button']+"</a>";
//	html += "<a class='dropdown-item'  onclick=\"toggleButton('visible')\">"+karutaStr[LANG]['show-button']+"</a>";
	if ( (USER.admin || portfolios_byid[portfolioid].owner=='Y') && !USER.xlimited) {
		html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callShareUsers('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-users"]+"</a>";
		html += "<a class='dropdown-item' onclick=\"UIFactory.Portfolio.callShareUsersGroups('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
	}
	if ( (USER.admin || g_userroles[0]=='designer') && !USER.xlimited) {
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+portfolioid+"?resources=true&export=true'>"+karutaStr[LANG]['export']+"</a>";
		html += "<a class='dropdown-item' href='../../../"+serverBCK_API+"/portfolios/portfolio/"+portfolioid+"?resources=true&amp;files=true'>"+karutaStr[LANG]['export-with-files']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"toggleMetadata('hidden')\">"+karutaStr[LANG]['hide-metainfo']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"toggleMetadata('visible')\">"+karutaStr[LANG]['show-metainfo']+"</a>";
		html += "<a class='dropdown-item'  onclick=\"$('#contenu').html('');UICom.structure.ui['"+g_portfolio_rootid+"'].displaySemanticTags('contenu')\">"+karutaStr[LANG]['list-semtags']+"</a>";
		if (UIFactory.URL2Unit.testIfURL2Unit(g_portfolio_current))
			html += "<a class='dropdown-item'  onclick=\"$('#wait-window').show();UIFactory.URL2Unit.bringUpToDate('"+portfolioid+"');$('#wait-window').hide();\">"+karutaStr[LANG]['refresh-url2unit']+"</a>";
		if (UIFactory.URL2Portfolio.testIfURL2Portfolio(g_portfolio_current))
			html += "<a class='dropdown-item'  onclick=\"$('#wait-window').show();UIFactory.URL2Portfolio.bringUpToDate('"+portfolioid+"');$('#wait-window').hide();\">"+karutaStr[LANG]['refresh-url2portfolio']+"</a>";
		if(languages.length>1) {
			html += UIFactory.Portfolio.getTranslateMenu();
		}
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
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code <a href='javascript://' id='code_help'><span style='font-size:12px' class='fas fa-question-circle'></span></a></label>");
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
		var callback = function () {itself.refresh()};
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',callback,"text",strippeddata);
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+itself.id).val(oldprojectcode);
	}
};

//==================================
UIFactory["Portfolio"].prototype.renamePortfolioCode = function(code)
//==================================
{
	//---------------------
	var oldcode = $(this.code_node).text();
	//---------- test if new code already exists
	var exist = false;
	if (oldcode!=code) {
		for (var i=0;i<portfolios_list.length;i++) {
			if (portfolios_list[i]!=null && code==portfolios_list[i].code_node.text())
				exist = true;
		}
	}
	//-----------------------
	if (!exist) {
		$(this.code_node).text(code);
		var xml = "";
		xml +="<asmResource xsi_type='nodeRes'><code>"+code+"</code>";
		for (var i=0; i<languages.length;i++){
			xml +="<label lang='"+languages[i]+"'>"+$(this.label_node[i]).text()+"</label>";	
		}
		xml +="</asmResource>";
		strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		var callback = null;
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+this.rootid+'/noderesource',callback,"text",strippeddata);
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
	}
};


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
		var js = "";
		if (callFunction!=null) {
			js += callFunction+";";
		}
		js += "$('input:checkbox').prop('checked', false);";
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
					if (Users_byid[userid]!=undefined) {
						html += "<div>"+Users_byid[userid].getSelector('group',groupid,'select_users2unshare',null,unshare_disabled)+"</div>";
					} else {
						UIFactory.User.load(userid);
						html += "<div>"+Users_byid[userid].getSelector('group',groupid,'select_users2unshare',null,unshare_disabled)+"</div>";
					}
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
	html += "<div class='col-md-3'>";
	html += karutaStr[LANG]['select_users'];
	html += "	<div>"+karutaStr[LANG]['active_users'];
	html += "		<button id='list-menu' class='btn' onclick=\"UIFactory.User.displaySelectMultipleActive('sharing-user-rightside-users-content1');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "	</div>";
	html += "</div>";
	html += "<div class='col-md-9'>";
	html += "<div id='sharing-user-search'></div>";
	html += "<div id='sharing-user-rightside-users-content1'></div>";
	html += "</div>";
	html += "</div><!--row-->";
	html += "</div><!--sharing-->";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	UIFactory.User.displaySearch("sharing-user-search",false,'sharing-user');
	//----------------------------------------------------------------
	if (!UsersLoaded)
		UIFactory.User.loadAll();
	if (UsersActive_list.length<200)
		UIFactory.User.displaySelectMultipleActive('sharing-user-rightside-users-content1');
	else {
		$("#sharing-user-rightside-users-content1").html(karutaStr[LANG]['too-much-users']);
	}
	//----------------------------------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
		success : function(data) {
			UIFactory.Portfolio.displayUnSharing('shared',data);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in callShareUsers 1 : "+jqxhr.responseText);
		}
	});
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
	if (usergroups_list.length>0) { // users groups loaded
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
//------------------------ CHANGE OWNER --------------------------------------------
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


//==================================================
UIFactory["Portfolio"].displayComments = function(destid,node,type,langcode)
//==================================================
{
	var html = "";
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
		tree_type='<span class="fas fa-cog" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-project')>-1)
		tree_type='<span class="fa fa-folder-o" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-rubric')>-1)
		tree_type='<span class="fas fa-list" aria-hidden="true"></span>';
	if (semtag.indexOf('karuta-dashboard')>-1)
//		tree_type='<span class="fa fa-dashboard" aria-hidden="true"></span>';
		tree_type='<span class="fa fa-line-chart" aria-hidden="true"></span>';
	return tree_type;
};

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
UIFactory["Portfolio"].getListPortfolios = function(userid,firstname,lastname) 
//==================================
{

	var url0 = serverBCK_API+"/portfolios?active=1&userid="+userid;
	var list = [];
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url0,
		userid : userid,
		firstname :firstname,
		lastname :lastname,
		success : function(data) {
			UIFactory.Portfolio.parse_add(data);
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				try {
					uuid = $(items[i]).attr('id');
					list[list.length] = uuid;
				} catch(e) {
					alertHTML("Error UIFactory.Portfolio.parse:"+uuid+" - "+e.message);
				}
			}
			UIFactory.Portfolio.displayListPortfolios(list,this.userid,this.firstname,this.lastname);
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1: "+textStatus);
		}
	});
}

//==================================
UIFactory.Portfolio.displayListPortfolios = function(list,userid,firstname,lastname,langcode)
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
	for (var i=0;i<list.length;i++)
		{
		var portfolio = portfolios_byid[list[i]];
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
UIFactory["Portfolio"].confirmDelPortfolio = function (uuid) 
// =======================================================================
{
	var portfolio = portfolios_byid[uuid];
	var portfoliocode = portfolio.code_node.text();
	var portfolio_label = portfolio.label_node[LANGCODE].text();

	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"] + "<br>" + karutaStr[LANG]["code"]+ " : " + portfoliocode + "<br>" + karutaStr[LANG]["label"]+ " : " +portfolio_label;
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory.Portfolio.del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}

//==================================
UIFactory["Portfolio"].prototype.refresh = function()
//==================================
{
	for (dest1 in this.displayLabel) {
		var portfolio_label = this.label_node[LANGCODE].text();
		$("#"+dest1).html(portfolio_label);
	};
	for (dest2 in this.display) {
		$("#"+dest2).html(this.getPortfolioView(null,this.display[dest2],null));
	};

};
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------- SEARCH IN PORTFOLIO --------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------

//==================================
UIFactory["Portfolio"].search = function(type)
//==================================
{
	var value = $("#"+type+"-search-text-input").val();
	var nodes = $("asmUnit:has(asmResource:has(label[lang='"+LANG+"']:contains(\""+value+"\"),text[lang='"+LANG+"']:contains(\""+value+"\")))",g_portfolio_current);
	var html="";
	html += "<div class='result-title'>"+karutaStr[LANG]["result-title"]+value+"</div>";
	html += "<div class='result-subtitle'>"+karutaStr[LANG]["result-subtitle"]+"</div>";
	html += "<div class='result-nb'>"+karutaStr[LANG]["result-nb"] + nodes.length + "</div>";
	for (var i=0; i<nodes.length;i++){
		var nodeid = $(nodes[i]).attr('id');
		var node_label = UICom.structure.ui[nodeid].getLabel();
		html += "<div class='result-page' onclick=\"displayPage('"+nodeid+"',99,'standard','0',false)\">"+node_label+"</div>";
	}
	$("#contenu").html(html);
}

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//---------------------------------- COLOR CONFIGURATION ----------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------


//=======================================================================
function setConfigColor(root,configname) 
// =======================================================================
{
	root.style.setProperty("--"+configname,g_configVar[configname]);
}

//==================================
function setCSSportfolio(data,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var root = document.documentElement;
	//-----------NAVBAR------------------------------------
	setConfigColor(root,'portfolio-navbar-background-color');
	setConfigColor(root,'portfolio-navbar-text-color');
	//-----------SIDEBAR------------------------------------
	setConfigColor(root,'portfolio-sidebar-background-color');
	setConfigColor(root,'portfolio-sidebar-text-color');
	setConfigColor(root,'portfolio-sidebar-selected-text-color');
	setConfigColor(root,'portfolio-sidebar-selected-border-color');
	setConfigColor(root,'portfolio-sidebar-separator-color');
	//-----------PORTFOLIO COLORS------------------------------------
	setConfigColor(root,'page-title-background-color');
	setConfigColor(root,'page-title-subline-color');
	setConfigColor(root,'portfolio-background-color');
	setConfigColor(root,'portfolio-text-color');
	setConfigColor(root,'portfolio-buttons-background-color');
	setConfigColor(root,'portfolio-buttons-color');
	setConfigColor(root,'portfolio-link-color');
	setConfigColor(root,'portfolio-resource-border-color');
	setConfigColor(root,'portfolio-menu-background-color');
	setConfigColor(root,'portfolio-menu-text-color');
	//-----------SVG------------------------------------
	setConfigColor(root,'svg-web0-color');
	setConfigColor(root,'svg-web1-color');
	setConfigColor(root,'svg-web2-color');
	setConfigColor(root,'svg-web3-color');
	setConfigColor(root,'svg-web4-color');
	setConfigColor(root,'svg-web5-color');
	setConfigColor(root,'svg-web6-color');
	setConfigColor(root,'svg-web7-color');
	setConfigColor(root,'svg-web8-color');
	setConfigColor(root,'svg-web9-color');
	// --------CSS Text------------------
	var csstextlangcode = LANGCODE;
	var csstext = $("text[lang='"+languages[csstextlangcode]+"']",$("asmResource[xsi_type='TextField']",$("asmContext:has(metadata[semantictag='config-portfolio-css'])",data))).text();
	csstext = csstext.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/g,"").replace(/&gt;/g,">");
	$("#csstext").remove();
	if (csstext!=undefined && csstext!=''){
		console.log("Portfolio CSS added")
		$("<style id='csstext'>"+csstext+"</style>").appendTo('head');
	}
	//----- Load CSS Files ------------------
	$("*[name='portfolio-config-css-file']").remove();
	var jsfile_nodes = [];
	jsfile_nodes = $("asmContext:has(metadata[semantictag='config-file-css'])",data);
	for (var i=0; i<jsfile_nodes.length; i++){
		var fileid = $(jsfile_nodes[i]).attr("id");
		var url = "../../../"+serverBCK+"/resources/resource/file/"+fileid;
		$.ajax({
			url: url,
			dataType: "text",
			success:function(data){
				console.log("CSS file loaded")
				$("head").append("<style name='portfolio-config-css-file'>" + data + "</style>");
			}
		});
	}
	// --------Bar Type------------------
	g_bar_type = $("code",$("asmResource[xsi_type='Get_Resource']",$("asmContext:has(metadata[semantictag='config-bar-type'])",data))).text();
	if (g_bar_type=="" || g_bar_type==null || g_bar_type==undefined)
		g_bar_type = 'vertical';
	// --------Breadcrumb------------------
	g_breadcrumb = $("code",$("asmResource[xsi_type='Get_Resource']",$("asmContext:has(metadata[semantictag='config-breadcrumb'])",data))).text();
	if (g_breadcrumb=="" || g_breadcrumb==null || g_breadcrumb==undefined)
		g_breadcrumb = '@1';
	//-----------------------------------
}

//==================================
function setCSSportfolioOLD(data)
//==================================
{
	var root = document.documentElement;
	//-----------NAVBAR------------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).length>0) {
		var portfolio_navbar_id = $("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_navbar_id].resource.getValue();
		root.style.setProperty("--portfolio-navbar-background-color",color);
	}
	//--------------
	if ($("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).length>0) {
		var portfolio_navbar_link_id = $("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_navbar_link_id].resource.getValue();
		root.style.setProperty("--portfolio-navbar-text-color",color);
	}
	//-----------SIDEBAR------------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).length>0) {
		var portfolio_sidebar_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_sidebar_id].resource.getValue();
		root.style.setProperty("--portfolio-sidebar-background-color",color);
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).length>0) {
		var portfolio_sidebar_link_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_sidebar_link_id].resource.getValue();
		root.style.setProperty("--portfolio-sidebar-text-color",color);
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).length>0) {
		var portfolio_sidebar_link_selected_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_sidebar_link_selected_id].resource.getValue();								
		root.style.setProperty("--portfolio-sidebar-selected-text-color",color);
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).length>0) {
		var portfolio_sidebar_selected_border_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).attr("id");
		color = UICom.structure["ui"][portfolio_sidebar_selected_border_id].resource.getValue();
		root.style.setProperty("--portfolio-sidebar-selected-border-color",color);
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).length>0) {
		var portfolio_sidebar_separator_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).attr("id");
		var portfolio_sidebar_separator_color = UICom.structure["ui"][portfolio_sidebar_separator_id].resource.getValue();								
		root.style.setProperty("--portfolio-sidebar-separator-color",color);
	}
	//-----------PORTFOLIO COLORS------------------------------------
	if ($("asmContext:has(metadata[semantictag='welcome-title-color'])",data).length>0) {
		var welcome_title_color_id = $("asmContext:has(metadata[semantictag='welcome-title-color'])",data).attr("id");
		var color = UICom.structure["ui"][welcome_title_color_id].resource.getValue();
		changeCss(".page-welcome .welcome-title", "color:"+color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='welcome-line-color'])",data).length>0) {
		var welcome_line_color_id = $("asmContext:has(metadata[semantictag='welcome-line-color'])",data).attr("id");
		var color = UICom.structure["ui"][welcome_line_color_id].resource.getValue();
		root.style.setProperty("--list-welcome-subline-color",color);
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='page-title-background-color'])",data).length>0) {
		var page_title_background_color_id = $("asmContext:has(metadata[semantictag='page-title-background-color'])",data).attr("id");
		var color = UICom.structure["ui"][page_title_background_color_id].resource.getValue();
		changeCss(".welcome-line,.row-node-asmRoot,.row-node-asmStructure,.row-node-asmUnit", "background-color:"+color+";");
		changeCss(".row-node", "border-top:1px solid "+color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).length>0) {
		var page_title_subline_color_id = $("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).attr("id");
		var color = UICom.structure["ui"][page_title_subline_color_id].resource.getValue();
		root.style.setProperty("--page-title-subline-color",color);
		changeCss(".row-node-asmRoot .title-subline,.row-node-asmStructure .title-subline,.row-node-asmUnit .title-subline", "border-bottom:1px solid "+color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).length>0) {
		var portfolio_buttons_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).attr("id");
		var portfolio_buttons_color = UICom.structure["ui"][portfolio_buttons_color_id].resource.getValue();
		changeCss(".collapsible .glyphicon, .createreport .button,.btn-group .button", "color:"+color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).length>0) {
		var portfolio_buttons_background_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_buttons_background_color_id].resource.getValue();
		changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "border:1px solid "+color+";");
		changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "background:"+color+";");
	}
	//--------------------------------
	if ($("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).length>0) {
		var portfolio_link_color_id = $("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).attr("id");
		var color = UICom.structure["ui"][portfolio_link_color_id].resource.getValue();
		changeCss("a", "color:"+color+";");
	}
	// ========================================================================
}