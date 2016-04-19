/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
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
var projects_list = [];
var bin_list = [];
var displayProject = {};
var number_of_projects = 0;
var number_of_portfolios = 0;
var number_of_bins = 0;

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
	this.root = new UIFactory["Node"]( $("asmRoot",node));
	if( UICom.structure["ui"] == null )
		UICom.structure["ui"] = {};
	UICom.structure["ui"][this.rootid] = this.root;
	this.code_node = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",node));
	this.date_modified = $(node).attr('modified');
	this.semantictag = $("metadata",node).attr('semantictag');
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
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
};


/// Display

//==================================
UIFactory["Portfolio"].displayAll = function(dest,type,langcode)
//==================================
{
	$("#projects").html($(""));
	$("#portfolios").html($(""));
	UIFactory["Portfolio"].displayTree(0,null,type,langcode);
	if (number_of_portfolios==0)
		$("#portfolios-label").hide();
};

//==================================
UIFactory["Portfolio"].displayTree = function(nb,dest,type,langcode,parentcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (nb<portfolios_list.length) {
		if (portfolios_list[nb]==null) { // has been removed
			nb++;
			UIFactory["Portfolio"].displayTree(nb,dest,type,langcode,parentcode);
		} else {
			var portfolio = portfolios_list[nb];
			if (dest!=null) {
				portfolio.display[dest] = langcode;
			}
			//---------------------
			var html = "";
			var portfoliocode = portfolio.code_node.text();
			var owner = (Users_byid[portfolio.ownerid]==null) ? "??? "+portfolio.ownerid:Users_byid[portfolio.ownerid].getView(null,'firstname-lastname',null);
			if (portfolio.semantictag=='karuta-project' && portfoliocode!='karuta.project'){
				if (number_of_projects>0)
					$("#export-"+projects_list[number_of_projects-1].uuid).attr("href","../../../"+serverBCK+"/portfolios/zip?portfolios="+projects_list[number_of_projects-1].portfolios);
				//-------------------- PROJECT ----------------------
				projects_list[number_of_projects] = {"uuid":portfolio.id,"portfoliocode":portfoliocode,"portfoliolabel":portfolio.label_node[langcode].text(),"portfolios":""};
				displayProject[portfolio.id] = Cookies.get('dp'+portfolio.id);
				number_of_projects ++;
				html += "<div id='project_"+portfolio.id+"' class='project'>";
				html += "	<div class='row row-label'>";
				if (displayProject[portfolio.id]!=undefined && displayProject[portfolio.id]=='open')
					html += "		<div onclick=\"javascript:toggleProject('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+portfolio.id+"' class='button glyphicon glyphicon-minus'></span></div>";
				else
					html += "		<div onclick=\"javascript:toggleProject('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent_"+portfolio.id+"' class='button glyphicon glyphicon-plus'></span></div>";
				html += "		<div class='project-label col-md-3 col-sm-2 col-xs-3'>"+portfolio.label_node[langcode].text()+"</div>";
				html += "		<div class='project-label col-md-2 col-sm-2 hidden-xs'>"+owner+"</div>";
				html += "		<div id='comments_"+portfolio.id+"' class='col-md-4 col-sm3 col-xs-4 comments'></div><!-- comments -->";
				html += "		<div class='col-md-1 col-xs-1'>";
				//------------ buttons ---------------
				html += "			<div class='btn-group'>";
				if (USER.admin || portfolio.owner=='Y') {
					html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle'>&nbsp;<span class='caret'></span>&nbsp;</button>";
					html += "			<ul class='dropdown-menu  pull-right'>";
					html += "				<li><a onclick=\"UIFactory['Portfolio'].callRename('"+portfolio.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["button-edit"]+"</a></li>";
					html += "				<li><a onclick=\"UIFactory['Portfolio'].remove('"+portfolio.id+"')\" ><i class='fa fa-trash-o'></i> "+karutaStr[LANG]["button-delete"]+"</a></li>";
//					html += "				<li><a onclick=\"UIFactory['Portfolio'].callShare('"+portfolio.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare"]+"</a></li>";
//					html += "				<li><a onclick=\"UIFactory['Portfolio'].callUnShare('"+portfolio.id+"')\" ><i class='fa fa-times'></i><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["unshare"]+"</a></li>";
					html += "				<li><a onclick=\"UIFactory['Portfolio'].callShareUsers('"+portfolio.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-users"]+"</a></li>";
					html += "				<li><a onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+portfolio.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a></li>";
					html += "				<li><a id='export-"+portfolio.id+"' href=''><i class='fa fa-download'></i> "+karutaStr[LANG]["export-project"]+"</a></li>";
					html += "			</ul>";
				} else { // pour que toutes les lignes aient la même hauteur : bouton avec visibility hidden
					html += "			<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";
				}
				html += "			</div><!-- class='btn-group' -->";
				//---------------------------------------
				html += "		</div><!-- class='col-md-1' -->";
				html += "		<div class='col-md-1 col-xs-1'>";
				html += "			<div class='btn-group project-menu'>";
				html += "				<button  class='btn btn-xs dropdown-toggle' data-toggle='dropdown'><span class='glyphicon glyphicon-menu-hamburger'>&nbsp;</button>";
				html += "				<ul class='dropdown-menu dropdown-menu-right' role='menu'>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.model')\" >"+karutaStr[LANG]['karuta.model']+"</a></li>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.rubrics')\" >"+karutaStr[LANG]['karuta.rubrics']+"</a></li>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.parts')\" >"+karutaStr[LANG]['karuta.parts']+"</a></li>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.batch')\" >"+karutaStr[LANG]['karuta.batch']+"</a></li>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].createTree('"+portfoliocode+"','karuta.report')\" >"+karutaStr[LANG]['karuta.report']+"</a></li>";
				html += "					<li><a onclick=\"UIFactory['Portfolio'].create('"+portfoliocode+"')\" >"+karutaStr[LANG]['create_tree']+"</a></li>";
				if (elgg_installed)
					html += getProjectNetworkMenu(portfoliocode,portfolio.id);
				html += "				</ul>";
				html += "			</div>";
				html += "		</div>";
				html += "	</div>";
				if (displayProject[portfolio.id]!=undefined && displayProject[portfolio.id]=='open')
					html += "	<div class='project-content' id='content-"+portfolio.id+"' style='display:block'></div>";
				else
					html += "	<div class='project-content' id='content-"+portfolio.id+"' style='display:none'></div>";
				html += "</div><!-- class='project'-->"
				$("#projects").append($(html));
				UIFactory["Portfolio"].displayComments('comments_'+portfolio.id,portfolio);
				nb++;
				UIFactory["Portfolio"].displayTree(nb,'content-'+portfolio.id,type,langcode,portfoliocode);
			} else {
				//-------------------- PORTFOLIO ----------------------
				var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (parentcode!= null && portfolio_parentcode==parentcode) {
					if (projects_list[number_of_projects-1].portfolios!="")
						projects_list[number_of_projects-1].portfolios += ","+portfolio.id;
					else
						projects_list[number_of_projects-1].portfolios += portfolio.id;
					$("#"+dest).append($("<div class='row'   id='portfolio_"+portfolio.id+"'></div>"));
				}
				else {
					number_of_portfolios++;
					$("#portfolios").append($("<div class='row' id='portfolio_"+portfolio.id+"'></div>"));
				}
				$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,type,langcode,parentcode,owner));
				nb++;
				if (nb<portfolios_list.length)
					UIFactory["Portfolio"].displayTree(nb,dest,type,langcode,parentcode);
				else {
					$("#export-"+projects_list[number_of_projects-1].uuid).attr("href","../../../"+serverBCK+"/portfolios/zip?portfolios="+projects_list[number_of_projects-1].portfolios);
					if (number_of_portfolios==0)
						$("#portfolios-label").hide();
				}
			}
		}
	}
}

//==================================
UIFactory["Portfolio"].removeSelection = function()
//==================================
{
	var removes = $("input[name=delete-remove]:checked");
	for (var i=0; i<removes.length;i++)
		UIFactory["Portfolio"].remove($(removes[i]).val());
};

//==================================
UIFactory["Portfolio"].deleteSelection = function()
//==================================
{
	var removes = $("input[name=delete-remove]:checked");
	for (var i=0; i<removes.length;i++)
		UIFactory["Portfolio"].del($(removes[i]).val());
	UIFactory["Portfolio"].displayAll('portfolios','list');
};

//==================================
UIFactory["Portfolio"].toggleDelBin = function(destid,self)
//==================================
{
	if ($(self).prop("checked"))
		$('input:checkbox',$("#"+destid)).attr('checked',true);
	else
		$('input:checkbox',$("#"+destid)).attr('checked',false);
};
	
//==================================
UIFactory["Portfolio"].displayBin = function(destid,type,lang)
//==================================
{
	var html = "<div id='list_bin'></div>";
	$("#"+destid).html(html);
	for ( var i = 0; i < bin_list.length; i++) {
		if (bin_list[i]!=null) { // not delete
			var itemid = destid+"_"+bin_list[i].id;
			$("#list_bin").append($("<div class='row' id='"+itemid+"'></div>"));
			$("#"+itemid).html(bin_list[i].getPortfolioView(destid,type,lang));
		}
	}
	if (bin_list.length==0)
		$("#bin-label").hide();
	else
		$("#bin-label").show();
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
	//---------------------
	var owner = (Users_byid[this.ownerid]==null) ? "??? "+this.ownerid:Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	//---------------------
	var html = "";
	if (type=='list') {

		html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
		html += "<div class='col-md-3 col-sm-3 col-xs-9' onclick=\"display_main_page('"+this.id+"')\" onmouseover=\"$(this).tooltip('show')\" data-html='true' data-toggle='tooltip' data-placement='top' title=\""+this.code_node.text()+"\"><a class='portfolio-label' >"+this.label_node[langcode].text()+"</a> "+tree_type+"</div>";
		if (USER.creator) {
			html += "<div class='col-md-2 col-sm-2 hidden-xs'><a class='portfolio-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs'><a class='portfolio-code' >"+this.code_node.text()+"</a></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-md-2 col-sm-2 hidden-xs' onclick=\"display_main_page('"+this.id+"')\">"+this.date_modified.substring(0,10)+"</div>";
		html += "<div class='col-md-1 col-sm-1 col-xs-1'>";
		html += "<div class='btn-group'>";
		//------------ buttons ---------------
		if (USER.admin || this.owner=='Y') {
			html += "<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle'>&nbsp;<span class='caret'></span>&nbsp;</button>";
			html += "<ul class='dropdown-menu  pull-right'>";
			if (gid==null) {
				html += "<li><a onclick=\"UIFactory['Portfolio'].callRename('"+this.id+"')\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a></li>";
				html += "<li><a onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].copy('"+this.id+"','"+this.code_node.text()+"-copy',true)\" ><i class='fa fa-file-o'></i><i class='fa fa-file-o'></i> "+karutaStr[LANG]["button-duplicate"]+"</a></li>";
				if (semtag.indexOf('karuta-model')>-1)
					html += "<li><a onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].instantiate('"+this.id+"','"+this.code_node.text()+"-instance',true)\" ><i class='fa fa-file-o'></i><i class='fa fa-file'></i> "+karutaStr[LANG]["button-instantiate"]+"</a></li>";
				html += "<li><a onclick=\"UIFactory['Portfolio'].remove('"+this.id+"')\" ><i class='fa fa-trash-o'></i> "+karutaStr[LANG]["button-delete"]+"</a></li>";
//				html += "<li><a onclick=\"UIFactory['Portfolio'].callShare('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare"]+"</a></li>";
//				html += "<li><a onclick=\"UIFactory['Portfolio'].callUnShare('"+this.id+"')\" ><i class='fa fa-times'></i><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["unshare"]+"</a></li>";
				html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+this.id+"?resources=true&export=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export"]+"</a></li>";
				html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+this.id+"?resources=true&files=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-with-files"]+"</a></li>";
			} else {
				if (USER.admin){
					html += "<li><a onclick=\"UIFactory['PortfoliosGroup'].confirmRemove('"+gid+"','"+this.id+"')\" ><span class='glyphicon glyphicon-remove'></span> "+karutaStr[LANG]["button-delete"]+"</a></li>";
				}
			}
			if (USER.admin){
				html += "<li><a onclick=\"UIFactory['PortfoliosGroup'].editGroupsByUuid('"+this.id+"')\" > "+karutaStr[LANG]["select_groups"]+"</a></li>";
			}
			html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsers('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-users"]+"</a></li>";
			html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a></li>";
			html += "</ul>";
		} else if (USER.creator){
			html += "<button  data-toggle='dropdown' class='btn  btn-xs dropdown-toggle'>&nbsp;<span class='caret'></span>&nbsp;</button>";
			html += "<ul class='dropdown-menu  pull-right'>";
			if (gid==null) {
				html += "<li><a onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].copy('"+this.id+"','"+this.code_node.text()+"-copy',true)\" ><i class='fa fa-file-o'></i><i class='fa fa-file-o'></i> "+karutaStr[LANG]["button-duplicate"]+"</a></li>";
				if (semtag.indexOf('karuta-model')>-1)
					html += "<li><a onclick=\"document.getElementById('wait-window').style.display='block';UIFactory['Portfolio'].instantiate('"+this.id+"','"+this.code_node.text()+"-instance',true)\" ><i class='fa fa-file-o'></i><i class='fa fa-file'></i> "+karutaStr[LANG]["button-instantiate"]+"</a></li>";
				html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+this.id+"?resources=true&export=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export"]+"</a></li>";
				html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+this.id+"?resources=true&files=true'><i class='fa fa-download'></i> "+karutaStr[LANG]["export-with-files"]+"</a></li>";
			} else {
//				html += "<li><a onclick=\"UIFactory['PortfoliosGroup'].confirmRemove('"+gid+"','"+this.id+"')\" ><span class='glyphicon glyphicon-remove'></span> "+karutaStr[LANG]["button-delete"]+"</a></li>";
			}
//			html += "<li><a onclick=\"UIFactory['PortfoliosGroup'].editGroupsByUuid('"+this.id+"')\" > "+karutaStr[LANG]["select_groups"]+"</a></li>";
			html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsers('"+this.id+"')\" ><i class='fa fa-share-square-o'></i> "+karutaStr[LANG]["addshare-users"]+"</a></li>";
			html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+this.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a></li>";
			html += "</ul>";			
		}
		html += "</div><!-- class='btn-group' -->";
		html += "</div><!-- class='col-md-1' -->";
		html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
	}
	if (type=='bin') {
		if (USER.admin || USER.creator){
			html += "<div class='col-md-1 col-xs-1'></div>";
			html += "<div class='col-md-4 col-sm-5 col-xs-7'><a class='portfolio-label' >"+this.label_node[langcode].text()+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-2 hidden-sm hidden-xs '><a class='portfolio-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs' >"+this.code_node.text()+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
			html += "<div class='col-md-2 col-xs-2'>";
			html += "<div class='btn-group'>";
			html += "<button class='btn btn-xs' onclick=\"UIFactory['Portfolio'].restore('"+this.id+"')\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
			html += "<span class='glyphicon glyphicon-arrow-up'></span>";
			html += "</button>";
			html += " <button class='btn btn-xs' onclick=\"confirmDelPortfolio('"+this.id+"')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
			html += "<i class='fa fa-times'></i>";
			html += "</button>";
			html += "</div>";
			html += "</div><!-- class='col-md-2' -->";
		}
	}
	if (type=='select') {
//		if (USER.admin || USER.creator){
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
UIFactory["Portfolio"].displayPortfolio = function(destid,type,langcode,edit)
//======================
{	var html = "";
	if (type==null || type==undefined)
		type = 'standard';
	g_display_type = type;
	//---------------------------------------
	if (type=='standard'){
		html += "	<div id='main-row' class='row'>";
		html += "		<div class='col-md-3' id='sidebar'></div>";
		html += "		<div class='col-md-9' id='contenu'></div>";
		html += "	</div>";
		$("#"+destid).append($(html));
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
	}
	//---------------------------------------
	if (type=='model'){
		html += "<div id='navigation_bar'></div>";
		html += "<div id='main-container' class='container-fluid'>";
		html += "	<div id='contenu'>";
		html += "	</div>";
		html += "</div>";
		html += "<div id='footer'></div>";
		$("#"+destid).append($(html));
	}
	//---------------------------------------
	if (type=='translate'){
		html += "	<div class='row'>";
		html += "		<div class='col-md-3' id='sidebar'></div>";
		html += "		<div class='col-md-9' id='contenu'></div>";
		html += "	</div>";
		$("#"+destid).append($(html));
		UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',type,LANGCODE,edit,UICom.rootid);
	}
	if (type=='header'){
		if ($("*:has(metadata[semantictag=header])",UICom.root.node).length==0)
			alertHTML("Error: header semantic tag is missing");
		if (g_userroles[0]=='designer') {
			html += "   <div id='rootnode' style='position:absolute;top:70px;left:10px;'>";
			html += "<button class='btn btn-xs' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+UICom.rootid+"')\"><div class='btn-text'>Root</div></button>";
			html += "</div>";
		}
		html += "<div id='navigation_bar'></div>";
		html += "<div id='main-header' class='container navbar navbar-fixed-top'>";
		html += "   <div id='header'></div>";
		html += "   <div id='menu'></div>";
		html += "</div>";
		html += "<div id='contenu' class='container header-container'></div>";
		html += "<div id='footer'></div>";
		$("#"+destid).append($(html));
		UIFactory["Portfolio"].displayNodes('header',UICom.root.node,'header',LANGCODE,edit);
		UIFactory["Portfolio"].displayMenu('menu','horizontal_menu',LANGCODE,edit,UICom.root.node);
	}
	//---------------------------------------
	$('a[data-toggle=tooltip]').tooltip({html:true});
};

//======================
UIFactory["Portfolio"].displaySidebar = function(root,destid,type,langcode,edit,rootid)
//======================
{	
	var html = "";
	if (type==null || type==undefined)
		type = 'standard';
	if (type=='standard' || type=='translate' || type=='model'){
		html += "<div id='sidebar-content'><div  class='panel-group' id='parent-"+rootid+"' role='tablist'></div></div>";
		$("#"+destid).html($(html));
		UIFactory["Node"].displaySidebar(root,'parent-'+UICom.rootid,type,langcode,edit,rootid);
	}
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
	UIFactory['Node'].displayStandard(UICom.structure['tree'][rootnodeid],destid,depth,langcode,edit);
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
UIFactory["Portfolio"].reload = function(portfolioid) 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?resources=true",
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
		url : "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
			UIFactory["Portfolio"].parse(data);
			$("#sidebar").html("");
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.root);
			$('a[data-toggle=tooltip]').tooltip({html:true});
		}
	});
};


//==================================
UIFactory["Portfolio"].parse = function(data) 
//==================================
{
	var tableau1 = new Array();
	var uuid = "";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			uuid = $(items[i]).attr('id');
			portfolios_byid[uuid] = new UIFactory["Portfolio"](items[i]);
			tableau1[i] = [portfolios_byid[uuid].code_node.text(),uuid];
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
UIFactory["Portfolio"].parseBin = function(data) 
//==================================
{
	bin_list = [];
	var portfolioid ="";
	var items = $("portfolio",data);
	for ( var i = 0; i < items.length; i++) {
		try {
			portfolioid = $(items[i]).attr('id');
			bin_list[i] = new UIFactory["Portfolio"](items[i]);
		} catch(e) {
			alertHTML("Error UIFactory.Portfolio.parseBin:"+portfolioid+" - "+e.message);
		}
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
				url : "../../../"+serverBCK+"/portfolios",
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
	var url = "../../../"+serverBCK+"/portfolios/portfolio/code/" + code +( (resources)?"?resources=true":"");
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			var portfolio = $("portfolio", data);
			result = $(portfolio).attr('id');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in getid_bycode : "+jqxhr.responseText);
		}
	});
	$.ajaxSetup({async: true});
	return result;
};


//==================================
UIFactory["Portfolio"].instantiate_bycode = function(sourcecode,targetcode,callback)
//==================================
{
	var uuid = null;
	var url = "../../../"+serverBCK+"/portfolios/instanciate/null?sourcecode="+sourcecode+"&targetcode="+targetcode+"&owner=true";
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
	var url = "../../../"+serverBCK+"/portfolios/instanciate/"+templateid+"?targetcode="+targetcode+"&owner=true";
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
	var url = "../../../"+serverBCK+"/portfolios/instanciate/"+templateid+"?targetcode="+targetcode+"&owner=true";
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
					url : "../../../"+serverBCK+"/nodes?portfoliocode=" + targetcode + "&semtag="+rootsemtag,
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
							url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
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
	var url = "../../../"+serverBCK+"/portfolios/copy/null?sourcecode="+sourcecode+"&targetcode="+targetcode+"&owner=true";;
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
	var url = "../../../"+serverBCK+"/portfolios/copy/"+templateid+"?targetcode="+targetcode+"&owner=true";;
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
	var url = "../../../"+serverBCK+"/portfolios/copy/"+templateid+"?targetcode="+targetcode+"&owner=true";
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
					url : "../../../"+serverBCK+"/nodes?portfoliocode=" + targetcode + "&semtag="+rootsemtag,
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
							url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
							success : function(data) {
								$("#wait-window").hide();
								$('#edit-window').modal('hide');
								fill_list_page();
							},
							error : function(jqxhr,textStatus) {
								alertHTML("Error in copy_rename : "+jqxhr.responseText);
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
UIFactory["Portfolio"].importFile = function(instance)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	$("#edit-window-title").html("Import");
	var html = "";
	$("#edit-window-body").html($(html));
	//--------------------------
	var url = "../../../"+serverBCK+"/portfolios";
	//--------------------------
	var project = "";
	html +="<div class='dropdown'>";
	html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
	html +="    Select a project ";
	html +="    <span class='caret'></span>";
	html +="  </button>";
	html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
	html +="    <li><a href='#'>&nbsp;</a></li>";
	for (var i=0;i<projects_list.length;i++) {
		var js = "";
		if (instance)
			js = "$('#fileupload').attr('data-url','"+url+"?instance=true&project="+projects_list[i].portfoliocode+"')";
		else
			js = "$('#fileupload').attr('data-url','"+url+"?project="+projects_list[i].portfoliocode+"')";
		js += ";$('#dropdownMenu1').html('"+projects_list[i].portfoliolabel+"')";
		html += "<li><a onclick=\""+js+"\">"+projects_list[i].portfoliolabel+"</a></li>";
	}
	html +="  </ul>";
	html +="</div><br>";
	//--------------------------
	html +=" <div id='divfileupload'>";
	html +=" <input id='fileupload' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#edit-window-body").append($(html));
	$("#loading").hide();
	$("#fileupload").fileupload({
		progressall: function (e, data) {
			$("#progress").css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').css('width',progress + '%');
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
	var url = "../../../"+serverBCK+"/portfolios/zip";
	//--------------------------
	var url = "../../../"+serverBCK+"/portfolios";
	//--------------------------
	var project = "";
	html +="<div class='dropdown'>";
	html +="  <button class='btn btn-default dropdown-toggle' type='button' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
	html +="    Select a project ";
	html +="    <span class='caret'></span>";
	html +="  </button>";
	html +="  <ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>";
	html +="    <li><a href='#'>&nbsp;</a></li>";
	for (var i=0;i<projects_list.length;i++) {
		var js = "";
		if (instance)
			js = "$('#fileupload').attr('data-url','"+url+"?instance=true&project="+projects_list[i].portfoliocode+"')";
		else
			js = "$('#fileupload').attr('data-url','"+url+"?project="+projects_list[i].portfoliocode+"')";
		js += ";$('#dropdownMenu1').html('"+projects_list[i].portfoliolabel+"')";
		html += "<li><a onclick=\""+js+"\">"+projects_list[i].portfoliolabel+"</a></li>";
	}
	html +="  </ul>";
	html +="</div><br>";
	//--------------------------
	html +=" <div id='divfileupload'>";
	html +=" <input id='fileupload' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#edit-window-body").append($(html));
	$("#fileupload").fileupload({
		progressall: function (e, data) {
			$("#progress").css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').css('width',progress + '%');
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
	var url = "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?active=false";
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
			$('[data-toggle=tooltip]').tooltip();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in remove : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].restore = function(portfolioid) 
//==================================
{
	var url = "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?active=true";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<bin_list.length;i++){
				if (bin_list[i]!=null && bin_list[i].id==portfolioid) {
					portfolios_list[bin_list.length] = bin_list[i];
					bin_list[i] = null;
					break;
				}
			}
			UIFactory["Portfolio"].displayAll('portfolios','list');
			UIFactory["Portfolio"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].del = function(portfolioid) 
//==================================
{
	var url = "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid;
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
				$('[data-toggle=tooltip]').tooltip();
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
	var urlS = "../../../"+serverFIL+"/xsl?portfolioids="+portfolioid+"&xsl="+appliname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:fr;pers:mimi&format=application/pdf";
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
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var html ="";
	html += "<li><a href='../../../"+serverFIL+"/xsl?portfolioids="+portfolioid+"&xsl="+appliname+"/karuta/xsl/xmlportfolio2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverFIL+";url-appli:"+serverURL+"/"+bckname+"&format=application/pdf'>"+karutaStr[LANG]['getPDF']+"</a></li>";
	html += "<li><a  onclick=\"toggleButton('hidden')\">"+karutaStr[LANG]['hide-button']+"</a></li>";
	html += "<li><a  onclick=\"toggleButton('visible')\">"+karutaStr[LANG]['show-button']+"</a></li>";
	if (USER.admin || portfolios_byid[portfolioid].owner=='Y') {
//		html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].callShare('"+portfolioid+"')\" >"+karutaStr[LANG]['addshare']+"</a></li>";
//		html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].callUnShare('"+portfolioid+"')\" >"+karutaStr[LANG]['unshare']+"</a></li>";
		html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsers('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-users"]+"</a></li>";
		html += "<li><a onclick=\"UIFactory['Portfolio'].callShareUsersGroups('"+portfolioid+"')\" >"+karutaStr[LANG]["addshare-usersgroups"]+"</a></li>";
	}
	html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+portfolioid+"?resources=true&export=true'>"+karutaStr[LANG]['export']+"</a></li>";
	if (USER.admin || g_userroles[0]=='designer') {
		html += "<li><a href='../../../"+serverBCK+"/portfolios/portfolio/"+portfolioid+"?resources=true&amp;files=true'>"+karutaStr[LANG]['export-with-files']+"</a></li>";
		html += "<li><a  onclick=\"toggleMetadata('hidden')\">"+karutaStr[LANG]['hide-metainfo']+"</a></li>";
		html += "<li><a  onclick=\"toggleMetadata('visible')\">"+karutaStr[LANG]['show-metainfo']+"</a></li>";
		if(languages.length>1)
			html += "<li><a  onclick=\"UIFactory.Portfolio.displayPortfolio('main-container','translate')\">"+karutaStr[LANG]['translate']+"</a></li>";
	}
	return html;
};


//==================================
UIFactory["Portfolio"].callRename = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = portfolios_byid[portfolioid];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if (USER.creator || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+portfolioid+"' type='text' class='form-control' name='input_code' value=\""+self.code_node.text()+"\">");
		$(htmlCodeInputObj).change(function (){
			UIFactory["Portfolio"].rename(self,langcode);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if (USER.creator || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
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
	html += "<div id='edit_comments_"+portfolioid+"'></div>";
	$("#edit-window-body").append($(html));
	
	UIFactory["Node"].displayCommentsEditor('edit_comments_'+portfolioid,portfolios_byid[portfolioid].root);

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
	var code = $.trim($("#code_"+itself.id).val());
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
	UICom.query("PUT","../../../"+serverBCK+'/nodes/node/'+itself.rootid+'/noderesource',callback,"text",strippeddata);
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//-------------------------- SHARING - UNSHARING -----------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
UIFactory["Portfolio"].callShare = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['Portfolio'].share('"+portfolioid+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['addshare']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+' '+portfolios_byid[portfolioid].label_node[langcode].text());
	var html = "";
	html += "<h4>"+karutaStr[LANG]['shared']+"</h4>";
	html += "<div id='shared'></div>";
	//-------------------------------------
	html += "<div id='sharing' style='display:none'>";
	html += "<h4>"+karutaStr[LANG]['sharing']+"</h4>";
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
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//-------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
			UIFactory["User"].displaySelectMultipleActive('sharing_users');
			//--------------------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
				success : function(data) {
					UIFactory["Portfolio"].displayShared('shared',data);
				}
			});
			//--------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in callShare 1 : "+jqxhr.responseText);
		}
	});
	//------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/rolerightsgroups?portfolio="+portfolioid,
		success : function(data) {
			UIFactory["Portfolio"].displaySharingRoleEditor('sharing_roles',portfolioid,data);
			$("#sharing").show();
			$("#sharing_designer").show();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in callShare 2 : "+jqxhr.responseText);
		}
	});

	
	//--------------------------	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Portfolio"].displaySharingRoleEditor = function(destid,portfolioid,data,callFunction)
//==================================
{
	var groups = $("rolerightsgroup",data);
	if (groups.length>0) {
		//--------------------------
		$("#"+destid).append("<div id='special-roles'></div>")
		$("#"+destid).append("<div id='other-roles' style='margin-top:5px;'></div>")
		//--------------------------
		var js = "javascript:";
		if (callFunction!=null) {
			js += callFunction+";";
		}
		js += "$('input:checkbox').removeAttr('checked')";
		var first = true;
		var dest = "";
		for (var i=0; i<groups.length; i++) {
			var groupid = $(groups[i]).attr('id');
			var label = $("label",groups[i]).text();
			if (label=='all' || label=='designer' || label=='administrator')
				dest = "#special-roles";
			else
				dest = "#other-roles";
			if (label!="user") {
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
UIFactory["Portfolio"].displayShared = function(destid,data)
//==================================
{
	var html = "";
	$("#"+destid).html(html);
	var groups = $("rrg",data);
	if (groups.length>0) {
		for (var i=0; i<groups.length; i++) {
			var label = $("label",groups[i]).text();
			var users = $("user",groups[i]);
			if (users.length>0){
				html += "<div class='row'><div class='col-md-3'>"+label+"</div><div class='col-md-9'>";
				for (var j=0; j<users.length; j++){
					var userid = $(users[j]).attr('id');
					if (Users_byid[userid]==undefined)
						alertHTML('error userid:'+userid);
					else
						html += "<div>"+Users_byid[userid].getView(null,"firstname-lastname-username")+"</div>";
				}
				html += "</div></div>";
			}
		}
		$("#"+destid).append($(html));
	} else {
		$("#"+destid).html(karutaStr[LANG]['noshared']);
	}
	$('#edit-window-body').animate({ scrollTop: 0 }, 'slow');
//	$('#edit-window-body').scrollTop(0);
};

//==================================
UIFactory["Portfolio"].share = function(portfolioid)
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
		url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
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
						url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
						success : function(data) {
							UIFactory["Portfolio"].displayShared('shared',data);
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
UIFactory["Portfolio"].shareUser = function(portfolioid,userid,role)
//==================================
{
	var groupid = "";
	//--------select group--------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/rolerightsgroups?portfolio="+portfolioid,
		success : function(data) {
			var groups = $("rolerightsgroup",data);
			for (var i=0; i<groups.length; i++) {
				var id = $(groups[i]).attr('id');
				var label = $("label",groups[i]).text();
				if (label==role)
					groupid = id;
			}
			//---------share--------------
			if (groupid!=""){
				var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
				var xml = "<users><user id='"+userid+"'/></users>";
				$.ajax({
					type : "POST",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : xml
				});
			} else
				alertHTML("Error in shareUser");
			//-----------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in shareUser : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].unshareUser = function(portfolioid,userid,role)
//==================================
{
	var groupid = "";
	//--------select group--------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/rolerightsgroups?portfolio="+portfolioid,
		success : function(data) {
			var groups = $("rolerightsgroup",data);
			for (var i=0; i<groups.length; i++) {
				var id = $(groups[i]).attr('id');
				var label = $("label",groups[i]).text();
				if (label==role)
					groupid = id;
			}
			//---------unshare--------------
			if (groupid!=""){
				var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
				var xml = "<users><user id='"+userid+"'/></users>";
				$.ajax({
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : xml
				});
			} else
				alertHTML("Error in shareUser");
			//-----------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in unshareUser : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Portfolio"].callUnShare = function(portfolioid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['Portfolio'].unshareUsers('"+portfolioid+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['unshare']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['unshare']+' '+portfolios_byid[portfolioid].label_node[langcode].text());
	var html = "";
	html += "<h4>"+karutaStr[LANG]['shared']+"</h4>";
	html += "<div id='shared'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (Users_byid.length>0) { // users loaded
		//--------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
			success : function(data) {
				UIFactory["Portfolio"].displayUnSharing('shared',data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callUnshare 1 : "+jqxhr.responseText);
			}
		});
		//--------------------------		
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
				//--------------------------
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						UIFactory["Portfolio"].displayUnSharing('shared',data);
					}
				});				//--------------------------		
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in callunsShare 2 : "+jqxhr.responseText);
			}
		});
	}
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["Portfolio"].displayUnSharing = function(destid,data)
//==================================
{
	var html = "";
	$("#"+destid).html(html);
	var groups = $("rrg",data);
	if (groups.length>0) {
	for (var i=0; i<groups.length; i++) {
		var groupid = $(groups[i]).attr('id');
		var label = $("label",groups[i]).text();
			var users = $("user",groups[i]);
			if (users.length>0){
				html += "<div class='row'><div class='col-md-3'>"+label+"</div><div class='col-md-9'>";
				for (var j=0; j<users.length; j++){
					var userid = $(users[j]).attr('id');
					if (Users_byid[userid]==undefined)
						alertHTML('error userid:'+userid);
					else
						html += "<div>"+Users_byid[userid].getSelector('group',groupid,'select_users2unshare')+"</div>";
				}
				html += "</div></div>";
			}
		}
		$("#"+destid).append($(html));
	} else {
		$("#"+destid).append($(karutaStr[LANG]['noshared']));
	}
};

//==================================
UIFactory["Portfolio"].unshareUsers = function(portfolioid)
//==================================
{
	var users = $("input[name='select_users2unshare']").filter(':checked');
	for (var i=0; i<users.length; i++){
		var userid = $(users[i]).attr('value');
		var groupid = $(users[i]).attr('group');
		var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
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
					url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
					success : function(data) {
						UIFactory["Portfolio"].displayUnSharing('shared',data);
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
	html += "<nav class='navbar navbar-default'>";
	html += "<div class='container-fluid'>";
	html += "<div class='navbar-inner'>";
	html += "	<div class='nav-bar-header'>";
	html += "		<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#collapse-2'>";
	html += "			<span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span>";
	html += "		</button>";
	html += "		<div class='navbar-brand' >";
	html += "			<a id='sidebar_"+rootid+"' class='sidebar'  onclick=\"displayPage('"+rootid+"',1,'"+type+"','"+langcode+"',"+edit+")\">";
	html += UICom.structure["ui"][rootid].getLabel('sidebar_'+rootid);
	html += "</a>";
	if (type=='standard')
		html += "		 	<a  onclick='toggleSideBar()' class='btn-lg'><span class='glyphicon glyphicon-menu-hamburger'></span></a>";
	html += "		</div><!-- class='navbar-brand' -->";
	html += "	</div><!-- class='nav-bar-header' -->";
	html += "</div><!-- class='navbar-inner' -->";
	html += "<div class='collapse navbar-collapse' id='collapse-2'>";
	html += "	<ul class='nav navbar-nav navbar-right'>";
	//-------------------- WELCOME PAGE EDIT -----------
	html += "		<li id='welcome-edit'></li>";
	if (g_welcome_add){
		html += "	<li id='welcome-add'>";
		var databack = false;
		var callback = "UIFactory['Node'].reloadStruct";
		var param2 = "'"+g_portfolioid+"'";
		var param3 = null;
		var param4 = null;
		html += "		<a href='#xxx' onclick=\"javascript:importBranch('"+rootid+"','karuta.model','welcome-unit',"+databack+","+callback+","+param2+","+param3+","+param4+");alertHTML('"+karutaStr[LANG]['welcome-added']+"')\">";
		html += karutaStr[LANG]['welcome-add'];
		html += "		</a>";
		html += "	</li>";
	}
	//-------------------- ACTIONS----------------------
	html += "		<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle' >Actions<span class='caret'></span></a>";
	html += "			<ul class='dropdown-menu'>";
	html += UIFactory["Portfolio"].getActions(portfolioid);
	html += "			</ul>";
	html += "		</li>";
	//-------------------- ROLES-------------------------
	if (g_userroles[0]=='designer') {
		html += "	<li class='dropdown'><a data-toggle='dropdown' class='dropdown-toggle' >Role : <span id='userrole'>designer</span><span class='caret'></span></a>";
		html += "		<ul class='dropdown-menu pull-right'>";
		html += "			<li><a  onclick=\"setDesignerRole('designer')\">designer</a></li>";
		for (role in UICom.roles) {
			if (role!="designer")
				html += "	<li><a  onclick=\"setDesignerRole('"+role+"')\">"+role+"</a></li>";
		}
		html += "		</ul><!-- class='nav navbar-nav navbar-right' -->";
	}
//	else
//		html += " Role : <span id='userrole'></span><span class='caret'></span></a>";

	html += "	</li>";
	html += "	<li><a id='refresh-portfolio' onclick='fill_main_page()' class='glyphicon glyphicon-refresh'></a></li>";
	//------------------------------------------------
	html += "</div><!-- class='collapse navbar-collapse' -->";
	html += "</div><!-- class='container-fluid' -->";
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
		var checked = selectedlist.contains(portfolios_list[i].id);
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
			if (portfolio.semantictag=='karuta-project' && portfoliocode!='karuta.project'){
				//-------------------- PROJECT ----------------------
				html += "<div id='selectform-project_"+portfolio.id+"' class='project'>";
				html += "	<div class='row row-label'>";
				html += "		<div onclick=\"javascript:toggleProject2Select('"+portfolio.id+"')\" class='col-md-1 col-xs-1'><span id='toggleContent2Select_"+portfolio.id+"' class='button glyphicon glyphicon-plus'></span></div>";
				html += "		<div class='project-label col-md-3 col-sm-2 col-xs-3'>"+portfolio.label_node[langcode].text()+"</div>";
				html += "		<div class='project-label col-md-2 col-sm-2 hidden-xs'>"+owner+"</div>";
				html += "		<div id='selectform-comments_"+portfolio.id+"' class='col-md-4 col-sm3 col-xs-4 comments'></div><!-- comments -->";
				html += "		<div class='col-md-1 col-xs-1'>";
				html += "		</div><!-- class='col-md-1' -->";
				html += "		<div class='col-md-1 col-xs-1'>";
				html += "		</div>";
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
				var checked = selectedlist.contains(portfolio.id);
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
	html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='portfolio-label' >"+this.label_node[langcode].text()+"</a> "+tree_type+"</div>";
	html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='portfolio-owner' >"+owner+"</a></div>";
	html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code_node.text()+"</a></div>";
	html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
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
		url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
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
						url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
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
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (Users_byid.length>0) { // users loaded
		UIFactory["User"].displaySelectMultipleActive('sharing_users');
		//--------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
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
			url : "../../../"+serverBCK+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
				UIFactory["User"].displaySelectMultipleActive('sharing_users');
				//--------------------------
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
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
		url : "../../../"+serverBCK+"/rolerightsgroups?portfolio="+portfolioid,
		success : function(data) {
			UIFactory["Portfolio"].displaySharingRoleEditor('sharing_roles',portfolioid,data);
			$("#sharing").show();
			$("#sharing_designer").show();
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
	html += "<div class='col-md-8'>";
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
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	//----------------------------------------------------------------
	if (UsersGroups_byid.length>0) { // users groups loaded
		UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
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
			url : "../../../"+serverBCK+"/usersgroups",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : "../../../"+serverBCK+"/rolerightsgroups/all/users?portfolio="+portfolioid,
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
		url : "../../../"+serverBCK+"/rolerightsgroups?portfolio="+portfolioid,
		success : function(data) {
			UIFactory["Portfolio"].displaySharingRoleEditor('sharing_roles',portfolioid,data,"UIFactory['UsersGroup'].hideUsersList('sharing_usersgroups-group-')");
			$("#sharing").show();
			$("#sharing_designer").show();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in Portfolio.callShareUsersGroups 2 : "+jqxhr.responseText);
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

