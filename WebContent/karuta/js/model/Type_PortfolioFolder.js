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
var folders_list = {};

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
	this.children = [];
	this.folders = [];
	this.display = {};
	var url = serverBCK_API+"/portfolios?active=1&count=true&project="+$(this.code_node).text();
	this.nbfolders = 0;
	this.nbchildren = 0;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		folder:this,
		success : function(data) {
			this.folder.nbchildren = parseInt($('portfolios',data).attr('count'))-1;
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
}

//==================================
function ondragoverPortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color-complement');
	event.target.style.backgroundColor = bckcolor;
}

//==================================
function ondragleavePortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color');
	event.target.style.backgroundColor = bckcolor;
}

//==================================
function dropPortfolioFolder(ev)
//==================================
{
	ev.preventDefault();
	var root = document.documentElement;
	var bckcolor = root.style.getPropertyValue('--list-element-background-color');
	event.target.style.backgroundColor = bckcolor;
	var portfolioid = ev.dataTransfer.getData("uuid");
	var folderid = ev.target.id.substring(ev.target.id.lastIndexOf('_')+1);
	var portfolio_code = portfolios_byid[portfolioid].code_node.text();
	var folder_code = folders_byid[folderid].code_node.text();
	var newportfolio_code = folder_code + portfolio_code.substring(portfolio_code.indexOf('.'));
	UIFactory.Portfolio.renamePortfolioCode(portfolios_byid[portfolioid],newportfolio_code);
}


//==================================
UIFactory["PortfolioFolder"].loadAndDisplayFolders = function (dest,type)
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=true",
		success : function(data) {
			nb_projects = parseInt($('portfolios',data).attr('count'))-1;
			UIFactory["Portfolio"].parse(data);
			UIFactory["PortfolioFolder"].parse(data);
			UIFactory["PortfolioFolder"].displayFolders(dest,type);
			//--------------------------------------
			if (number_of_projects==0 && !USER.admin && !USER.creator) {
				$("#projects-label").hide();
			} else {
				$("#projects-nb").html(number_of_projects);
			}
			//--------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			if ($("#project-portfolios").html()=="")
				$("#project-portfolios").hide();
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
		if (folder_code.indexOf('/')<0)
			folders_list.push(folders_byid[newTableau1[i][1]]);
		else {
			var code = folder_code.substring(0,folder_code.indexOf('/'))+".";
			for (var j=0;j<i;j++) {
				if (code==newTableau1[j][0]) {
					var uuid = newTableau1[j][1];
					folders_byid[uuid].folders.push(folders_byid[newTableau1[i][1]]);
					folders_byid[uuid].nbfolders++;
				}
			}
		}
	}
	//------------------------------------
};


//==================================
UIFactory["PortfolioFolder"].displayFolders = function(dest,type)
//==================================
{
	loadedProjects = {};
	projects_list = [];
	number_of_projects = 0;
	number_of_portfolios = 0;
//	g_sum_trees = 0;
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
		for (var i=0;i<this.folders.length;i++){
			this.folders[i].displayFolder(type+'treecontent_'+this.id,type);
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
UIFactory["PortfolioFolder"].prototype.toggleFolderContent = function(dest,type)
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
			this.loadAndDisplayFolderContent(dest,type);
		$(".row-label").removeClass('active');
		$("#tree_label_"+this.id).addClass('active');
		localStorage.setItem('currentDisplayedFolderCode',this.code_node.text());
	}
}

//==============================
UIFactory["PortfolioFolder"].prototype.loadAndDisplayFolderContent = function (dest,type)
//==============================
{
	$.ajax({
		folder : this,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+this.code_node.text()+".",
		success : function(data) {
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
			for (var i=0; i<newTableau1.length; i++){
				this.folder.children[i] = portfolios_byid[newTableau1[i][1]]
			}
			//-------------------------
			this.folder.displayFolderContent(dest,type);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolderContent = function(dest,type)
//==================================
{
	$("#portfolio-content1-rightside").html("");
	$("#portfolio-content2-rightside").html("");
	if (type==null)
		if (list_view_type==null)
			type = 'list';
		else
			type = list_view_type;
	var html = "";
	if (this.code_node.text()=='false' && type!='card') {
		var text2 = karutaStr[LANG]['portfolios-not-in-project'];
		html = "<h3  class='projectcontent-label'>"+text2+"</h3>";
	}
	$("#portfolio-title-rightside").html($(html));
	//--------------------
	this.displayFolderDetail('portfolio-header-rightside',type,langcode);
	//--------------------
	var langcode = LANGCODE;
	if (type=='card' || type=='card-admin')
		$("#portfolio-content2-rightside").html("<div class='card-deck' id='porfolios-deck'></div>");
	else
		$("#portfolio-content2-rightside").html("<div class='porfolios-content' id='porfolios-content'></div>");

	for (var j=0; j<this.children.length;j++){
		var portfolio = this.children[j];
		var portfoliocode = portfolio.code_node.text();
			//-------------------- PORTFOLIO ----------------------
			var portfolio_parentcode = portfoliocode.substring(0,portfoliocode.indexOf("."));
				if (portfolio.visible || (USER.creator && !USER.limited) ) {
					if (type=='card')
						$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' onclick=\"display_main_page('"+portfolio.rootid+"')\"></div>"));
					else if (type=='card-admin')
						$("#porfolios-deck").append($("<div class='card portfolio-card' id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					else
						$("#porfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"' draggable='true' ondragstart='dragPortfolio(event)'></div>"));
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("portfolio_"+portfolio.id,type));
					portfolio.displayOwner('owner_'+portfolio.id);
				}
		$(window).scrollTop(0);
		$("#wait-window").hide();
	}
	
}

//==================================
UIFactory["PortfolioFolder"].prototype.displayFolderDetail = function(dest,type,langcode)
//==================================
{
	var html = "";
	var owner = "";
	var portfolio = portfolios_byid[this.id];
	//-------------------- PROJECT ----------------------
	var portfoliocode = portfolio.code_node.text();
	var portfolio_label = portfolio.label_node[LANGCODE].text();
	if (portfolio_label==undefined || portfolio_label=='' || portfolio_label=='&nbsp;')
		portfolio_label = '- no label in '+languages[LANGCODE]+' -';
	html += "<div id='projectheader_"+portfolio.id+"' class='project-header'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-3 project-label' id='portfoliolabel_"+portfolio.id+"' >"+portfolio_label+"</div>";
	html += "		<div id='owner_"+portfolio.id+"' class='col-2 d-none d-md-block project-label'></div>";
	html += "		<div class='col-3 d-none d-sm-block comments' id='project-comments_"+$(portfolios_byid[portfolio.id].root).attr("id")+"'> </div><!-- comments -->";
	html += "		<div class='col-2'>";
	//---------------------------------------
	html += "<span class='fa fa-th' style='cursor:pointer;font-size:130%;margin-top:4px' onclick=\"list_view_type='card-admin';folders_byid['"+this.id+"'].displayFolderContent('portfolio-content2-rightside','card-admin');localStorage.setItem('list_view_type','card-admin');\"></span>&nbsp;";
	html += "<span class='fa fa-list' style='cursor:pointer;font-size:130%' onclick=\"list_view_type='list';folders_byid['"+this.id+"'].displayFolderContent('portfolio-content2-rightside','list');localStorage.setItem('list_view_type','list')\"></span>";
	html += "		</div>";
	html += "		<div class='col-1'>";
	//------------ buttons ---------------
	html += "			<div class='dropdown portfolio-menu'>";
	if (USER.admin || (portfolio.owner=='Y' && !USER.xlimited)) {
		html += "			<button  data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "			<div class='dropdown-menu  dropdown-menu-right'>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory['PortfolioFolder'].callRename('"+portfolio.id+"',null,true)\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory.PortfolioFolder.confirmDelFolder('"+portfolio.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "				<a class='dropdown-item' onclick=\"UIFactory.PortfolioFolder.confirmDelFolderContent('"+portfolio.id+"')\" ><i class='fa fa-trash'></i> "+karutaStr[LANG]["button-delete-content"]+"</a>";
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
	html += "</div><!-- class='project'-->";
	//---------------------
	$("#portfolio-header-rightside").html($(html));
	var portfolio_list = "";
	for (var j=0; j<this.children.length;j++){
		portfolio_list += "," + this.children[j].id;
	}
	if (portfolio_list.length>0)
		portfolio_list = portfolio_list.substring(1);
	$("#export-"+portfolio.id).attr("href",serverBCK_API+"/portfolios/zip?portfolios="+portfolio_list);
	//---------------------
	portfolio.displayOwner('owner_'+portfolio.id);
	//---------------------
	UIFactory["Portfolio"].displayComments('project-comments_'+$(portfolios_byid[portfolio.id].root).attr("id"),portfolio);
	//----------------------
}

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
			//------------------------------------------
			for (var i=0;i<itself.children.length;i++){
				var portfolioid = itself.children[i].id;
				var portfolio_code = portfolios_byid[portfolioid].code_node.text();
				var newportfolio_code = newfolder_code + portfolio_code.substring(portfolio_code.indexOf('.'));
				portfolios_byid[portfolioid].code_node.text(newportfolio_code); // update local code
				var xml = "";
				xml +="		<asmResource xsi_type='nodeRes'>";
				xml +="			<code>"+newportfolio_code+"</code>";
				for (var j=0; j<languages.length;j++){
					xml +="			<label lang='"+languages[j]+"'>"+$(portfolios_byid[portfolioid].label_node[j]).text()+"</label>";	
				}
				xml +="		</asmResource>";
				strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
				UICom.query("PUT",serverBCK_API+'/nodes/node/'+portfolios_byid[portfolioid].rootid+'/noderesource',null,"text",strippeddata);
			}
			//------------------------------------------
			itself.code_node.text(newportfolio_code); // update local code
			var xml = "";
			xml +="		<asmResource xsi_type='nodeRes'>";
			xml +="			<code>"+newfolder_code+"</code>";
			for (var j=0; j<languages.length;j++){
				xml +="			<label lang='"+languages[j]+"'>"+$(itself.label_node[j]).text()+"</label>";	
			}
			xml +="		</asmResource>";
			strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',null,"text",strippeddata);
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
			UICom.query("PUT",serverBCK_API+'/nodes/node/'+itself.rootid+'/noderesource',null,"text",strippeddata);
			//------------------------------------------
		}
	} else {
		alertHTML(karutaStr[LANG]['existing-code']);
		$("#code_"+itself.id).val(oldprojectcode);
	}
	fill_list_page();
}

//==================================
UIFactory["PortfolioFolder"].loadPortfolios = function() 
//==================================
{

	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=false&count=true",
		success : function(data) {
			nb_portfolios = parseInt($('portfolios',data).attr('count'));
			if (nb_portfolios==0)
				$("#portfolios-div").hide();
			else {
				$("#portfolios-nb").html(nb_portfolios);
				if (number_of_projects == 0) {
					$("#see-portfolios").hide();
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=false",
						success : function(data) {
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
									loadAndDisplayProjectContent('project-portfolios','false','card-admin');
								else
									if (nb_visibleportfolios>9)
										loadAndDisplayProjectContent('project-portfolios','false','list');
									else if (nb_visibleportfolios>1)
										loadAndDisplayProjectContent('card-deck-portfolios','false','card');
									else
										display_main_page(portfolios_byid[visibleid].rootid);
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active: "+textStatus);
						}
					});
				}
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1&project=false: "+textStatus);
			$("#wait-window").hide();
		}
	});
}