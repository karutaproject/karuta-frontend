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
/*	
var PortfoliosGroups_byid = {};
var PortfoliosGroups_list = [];
var currentDisplayedPortfoliosGroupId = null;
var number_of_portfoliosgroups = 0;
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}
*/
/// Define our type
//==================================
UIFactory["PortfoliosGroup"] = function(node)
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
	if ($(node).attr('modified')!=undefined)
		this.date_modified = $(node).attr('modified');
	else
		this.date_modified = "";
	this.owner = $(node).attr('owner');
	if ($(node).attr('ownerid')!=undefined)
		this.ownerid = $(node).attr('ownerid');
	else
		this.ownerid = null;
	if ($(node).attr('count')!=undefined) {
		this.nb_groups = $(node).attr('count');		
	} else this.nb_groups = 0;
	if ($(node).attr('nb_children')!=undefined) {
		this.nb_children = $(node).attr('nb_children');
	} else this.nb_children = 0;
	this.loadedStruct = false;
	this.groups_list = [];
	this.loadedGroup = false;
	this.pageindex = '1';
	this.chidren_list = {};
	this.display = {};

	this.members = [];
	this.roles = [];
	this.rrg = {};
}

//==================================
UIFactory["PortfoliosGroup"].displayAll = function(dest,type,langcode)
//==================================
{
	$("#portfoliosgroups").html($(""));
	UIFactory["PortfoliosGroup"].displayTree(dest,type,langcode);
	number_of_portfoliosgroups = PortfoliosGroups_list.length;
	//--------------------------------------
	if (number_of_portfoliosgroups==0) {
		$("#portfoliosgroups-label").hide();
	} else {
		$("#portfoliosgroups-nb").html(number_of_portfoliosgroups);
	}
	//--------------------------------------
	//--------------------------------------
	if (!USER.admin)
		$("#users-nb").hide();
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};

//==================================
UIFactory["PortfoliosGroup"].displayTree = function(dest,type,langcode,parentid)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	var list = [];
	if (parentid==undefined || parentid==null)
		list = PortfoliosGroups_list;
	else list = PortfoliosGroups_byid[parentid].groups_list;
	var html="";
	for (var i = 0; i < list.length; i++) {
		html += list[i].getTreeNodeView(dest,type,langcode);
	}
	document.getElementById(dest).innerHTML = html;
	if (parentid!=undefined && parentid!=null)
		document.getElementById('number_of_portfoliosgroups'+PortfoliosGroups_byid[parentid].id).innerHTML = PortfoliosGroups_byid[parentid].nb_groups;
}

//==================================
UIFactory["PortfoliosGroup"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	//---------------------	
	var group_label = this.label_node[langcode].text();
	var html = "";
	if (type=='list') {
		html += "<div id='portfoliosgroup_"+this.id+"' class='treeNode portfoliosgroup'>";
		html += "	<div class='row-label group-row'>";
		html += "		<span id='toggle_portfoliosgroup_"+this.id+"' class='closeSign";
		if (this.nb_groups>0){
			html += " toggledNode";
		}
		html += "' onclick=\"javascript:loadAndDisplayPortfoliosGroupStruct('collapse_portfoliosgroup_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-portfoliosgrouplabel_"+this.id+"' onclick=\"javascript:loadAndDisplayPortfoliosGroupContent('group-portfolios','"+this.id+"');\" class='group-label'>"+group_label+"&nbsp;</span><span class='badge number_of_groups' id='number_of_portfoliosgroups"+this.id+"'>"+this.nb_groups+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='number_of_portfoliosgroup_items_"+this.id+"'>"+this.nb_children+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_portfoliosgroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- class='portfoliosgroup'-->";
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
		html += "<div id='select-portfoliosgroup_"+this.id+"' class='treeNode select-folder'>";
		html += "	<div class='row-label'>";
		html += "		<span id='toggle_select-portfoliosgroup_"+this.id+"' class='closeSign";
		if (this.nb_groups>0){
			html += " toggledNode";
		}
		html += "' onclick=\"javascript:loadAndDisplayPortfoliosGroupStruct('collapse_select-portfoliosgroup_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-portfoliosgrouplabel_"+this.id+"' onclick=\"javascript:loadAndDisplayPortfoliosGroupContent('select-group-portfolios','"+this.id+"');\" class='group-label'>"+group_label+"&nbsp;</span><span class='badge number_of_groups' id='select-number_of_portfoliosgroups"+this.id+"'>"+this.nb_groups+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='select-number_of_portfoliosgroup_items_"+this.id+"'>"+this.nb_children+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_select-portfoliosgroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- id='select-portfoliosgroup_...'-->";
	}
	return html;
}

//==================================
UIFactory["PortfoliosGroup"].displayGroupContent = function(dest,id,langcode,index_class)
//==================================
{
	$("#"+dest).show();
	localStorage.setItem('currentDisplayedPortfoliosGroup',id);
	$("#"+dest).html("");
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	var portfoliosgroup = PortfoliosGroups_byid[id];
	//---------------------
	var html = "";
	var groupcode = portfoliosgroup.code;
	var owner = (Users_byid[portfoliosgroup.ownerid]==null) ? "":Users_byid[portfoliosgroup.ownerid].getView(null,'firstname-lastname',null);

	var group_label = portfoliosgroup.label_node[langcode].text();
	if (group_label==undefined || group_label=='' || group_label=='&nbsp;')
		group_label = '- no label in '+languages[langcode]+' -';
	html += "<div id='content-portfoliosgroup_"+portfoliosgroup.id+"' class='portfoliosgroup'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-1'/>";
	html += "		<div class='col-4 group-label' id='portfoliosgrouplabel_"+portfoliosgroup.id+"'>"+group_label+"</div>";
	html += "		<div class='col-2 d-none d-md-block group-label'>"+owner+"</div>";
	html += "		<div class='col-3 d-none d-sm-block comments' id='portfoliosgroup-comments_"+portfoliosgroup.date_modified.substring(0,10)+"'> </div><!-- comments -->";
	html += "		<div class='col-1'>";
	//------------ buttons ---------------
	html += UIFactory.PortfoliosGroup.getAdminMenu(portfoliosgroup,false);
	//---------------------------------------
	html += "		</div><!-- class='col-1' -->";
	html += "	</div><!-- class='row' -->";
	html += "</div><!-- class='portfoliosgroup'-->";
	//----------------------
	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	// ----------------------
	html += "<div id='group-portfolios-pages' class='portfoliosgroup-pages'>";
	html += "</div><!-- class='portfoliosgroup-pages'-->";
	// ----------------------
	html += "<div id='"+index_class+pagegNavbar_list[1]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
}

//==================================
UIFactory["PortfoliosGroup"].prototype.displayGroupContentPage = function(dest,type,langcode,index_class)
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
		if("GROUP"==list[i]['type']) {
			var destid = dest+"_item-portfoliosgroup_"+item.id;
			html += "<div class='row item item-group' id='"+destid+"'>";
			html += item.getView(destid,type,langcode);
			html += "</div>";
		} else {
			var destid = dest+"_item-portfolio_"+item.id;
			html += "<div class='row item item-portfolio' id='"+destid+"'>";
			if (item!=null && item!=undefined) {
				html += item.getPortfolioView(destid,type,null,null,null,this.id);
			} else { // we load portfolio information
				UIFactory.Portfolio.load(item,"1");
				if (item!=null && item!=undefined) {
					html += item.getPortfolioView(destid,type,null,null,null,this.id);
				}
			}
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_children)/nbItem_par_page);
	if (nb_index>1) {
		displayPagesNavbar(nb_index,this.id,langcode,parseInt(this.pageindex),index_class,'loadAndDisplayPortfoliosGroupContentPage',dest,"list");		
	}
	$(window).scrollTop(0);
}

//==================================
UIFactory["PortfoliosGroup"].prototype.getView = function(dest,type,langcode)
//==================================
{
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------	
	var group_label = this.label_node[langcode].text();
	var owner = (Users_byid[this.ownerid]==null) ? "":Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	var tree_type='<span class="fa fa-folder" aria-hidden="true"></span>';
	var html = "";
	if (type=='list') {
		html += "<div class='group-label col-10 col-md-4' title=\""+this.code+"\" class='group-label'>"+group_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='portfoliosgroup-owner'>"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='portfoliosgroup-code'>"+this.code+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y') || (USER.creator && !USER.limited)) {
			html += UIFactory.PortfoliosGroup.getAdminMenu(this,true);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='select') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_folders',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='group-label'>"+group_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs'><a class='portfoliosgroup-owner'>"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs'>"+this.code+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
		}
	}
	return html;
}

//======================
UIFactory["PortfoliosGroup"].getAdminMenu = function(self,list)
//======================
{	
	var html = "";
	html += "<div class='dropdown group-menu'>";
	if (USER.admin) {
		html += "	<button id='dropdown-portfoliosgroup"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown-portfoliosgroup"+self.id+"'>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory.PortfoliosGroup.callRename('"+self.id+"',null,"+list+")\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callMove('"+self.id+"')\" ><i class='button fas fa-random'></i> "+karutaStr[LANG]['move']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callAddPortfolios('"+self.id+"','"+self.code+"')\" ><i class='fa fa-plus-square'></i> "+karutaStr[LANG]["add_portfolios"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callShareUsers('"+self.id+"')\" ><i class='fas fa-share-alt'></i> "+karutaStr[LANG]["addshare-users"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['PortfoliosGroup'].callShareUsersGroups('"+self.id+"')\" ><i class='fa fa-share-alt-square'></i> "+karutaStr[LANG]["addshare-usersgroups"]+"</a>";
		html += "		<a class='dropdown-item' id='remove-"+self.id+"' style='display:block' onclick=\"confirmDelObject('"+self.id+"','PortfoliosGroup')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "	</div>";
	} else {
		html += "	<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";		
	}
	html += "			</div><!-- class='btn-group' -->";
	return html;
}

//==================================
UIFactory["PortfoliosGroup"].prototype.getSelector = function(attr,value,name,checkbox)
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
UIFactory["PortfoliosGroup"].callRename = function(id,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = PortfoliosGroups_byid[id];
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
			UIFactory["PortfoliosGroup"].rename(self,langcode,list);
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
			UIFactory["PortfoliosGroup"].rename(self,langcode,list);
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
UIFactory["PortfoliosGroup"].rename = function(itself,langcode,list)
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
	xml +="		<group>";
	xml +="			<code>"+code+"</code>";
	for (var i=0; i<languages.length;i++){
		xml +="			<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
	}
	xml +="		</group>";
	strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
	var callback = function () {
		$("#treenode-portfoliosgrouplabel_"+itself.id).html($(label));
		if (list)
			$("#item-portfoliosgroup_"+itself.id).html($(itself.getView('item-portfoliosgroup_'+itself.id,'list')));
		else {
			$("#portfoliosgrouplabel_"+itself.id).html($(label));
		}
	};
	UICom.query("PUT",serverBCK_API+'/portfoliosgroups/portfoliosgroup/'+itself.id+'',callback,"text",strippeddata);
};

//==================================
UIFactory["PortfoliosGroup"].prototype.update = function(node)
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
UIFactory["PortfoliosGroup"].create = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_group']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#code").val();
		var label = $("#label").val();
		if (code!='' && label!='') {
			var url = serverBCK_API+"/portfoliosgroups";
			var data = "<group<code>"+code+"</code><label lang='"+LANG+"'>"+label+"</label></group>";
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
UIFactory["PortfoliosGroup"].del = function(id) 
//==================================
{
	var url = serverBCK_API+"/portfoliosgroups/portfoliosgroup/" + id;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<group_list.length;i++){
				if (portfoliosgroup_list[i]!=null && portfoliosgroup_list[i].id==id) {
					portfoliosgroup_list[i] = null;
					break;
				}
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
UIFactory["PortfoliosGroup"].parse = function(data) 
//==================================
{
	PortfoliosGroups_byid = {};
	PortfoliosGroups_list = [];		
	var items = $("group",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		PortfoliosGroups_byid[id] = new UIFactory["PortfoliosGroup"](items[i]);
		var code = PortfoliosGroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		PortfoliosGroups_list[i] = PortfoliosGroups_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["PortfoliosGroup"].parseStructure = function(data,parentid) 
//==================================
{
	var items = $("group",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (PortfoliosGroups_byid[id]==undefined){
			PortfoliosGroups_byid[id] = new UIFactory["PortfoliosGroup"](items[i]);
		} else
			PortfoliosGroups_byid[id].update(items[i]);			
		var code = PortfoliosGroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (PortfoliosGroups_byid[parentid]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			PortfoliosGroups_byid[parentid].groups_list[i] = PortfoliosGroups_byid[newTableau1[i][1]]
		}
		PortfoliosGroups_byid[parentid].loadedStruct = true;
		PortfoliosGroups_byid[parentid].nb_groups = PortfoliosGroups_byid[parentid].groups_list.length;
	}
};

//==================================
UIFactory["PortfoliosGroup"].parseChildren = function(data,parentid) 
//==================================
{
	var children = $(data).children();

	var list = [];
	for( var i=0; i<children.length; ++i ) {
		var child = children[i];
		var tagname = $(child)[0].tagName;
		if("GROUP"==tagname || "PORTFOLIO"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("GROUP"==tagname) {
				if (PortfoliosGroups_byid[id]==undefined)
					PortfoliosGroups_byid[id] = new UIFactory["PortfoliosGroup"](child);
				else PortfoliosGroups_byid[id].update(child);
				list[i]['obj'] = PortfoliosGroups_byid[id];
			} else {
				if (portfolios_byid[id]==undefined)
					portfolios_byid[id] = new UIFactory["Portfolio"](child);
				//else Users_byid[id].update(child);
				list[i]['obj'] = portfolios_byid[id];
			}
		}
	}
	PortfoliosGroups_byid[parentid].chidren_list[PortfoliosGroups_byid[parentid].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
function loadAndDisplayPortfoliosGroupStruct(dest,id,langcode) {
//==================================
	$("#wait-window").show();
	toggleElt('closeSign','openSign','portfoliosgroup_'+id);
	if (!PortfoliosGroups_byid[id].loadedStruct)
		loadPortfoliosGroupStruct(dest,id,langcode);
	else {
//		UIFactory.Folder.displayTree(dest,'list',langcode,id);
	}
	$("#wait-window").hide();
}

//==============================
function loadPortfoliosGroupStruct(dest,id,langcode)
//==============================
{
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliosgroups/portfoliosgroup/"+id+"/children?type=FOLDER&count=true",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse_add(data);
			UIFactory["PortfoliosGroup"].displayTree(dest,'list',langcode,id);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
		
		//===== test data
		var test_dataFolders= "<groups count='3'>"
				+"<group id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></group>"
				+"<group id='2' count='3' nb_children='52' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></group>"
				+"<group id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></group>"
				+"</groups>";
		var test_dataFoldersStruct_byid = {};
		test_dataFoldersStruct_byid['root']= "<groups count='3'>"
			+"<group id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></group>"
			+"<group id='2' count='3' nb_children='52' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></group>"
			+"<group id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['bin']= "<groups count='3'>"
			+"<group id='4' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group4</code><label lang='en'>Folder 4</label><label lang='fr'>Dossier 4</label></group>"
			+"<group id='5' count='3' nb_children='52' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group5</code><label lang='en'>Folder 5</label><label lang='fr'>Dossier 5</label></group>"
			+"<group id='6' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group6</code><label lang='en'>Folder 6</label><label lang='fr'>Dossier 6</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['1']= "<group id='1.1' count='0' nb_children='0' modified='2019-12-02 12:19:02.0' ownerid='20'>"
				+"<code>group1.1</code>"
				+"<label lang='en'>Folder 1.1</label>"
				+"<label lang='fr'>Dossier 1.1</label>"
				+"</group>";
		test_dataFoldersStruct_byid['2']= "<groups>"
				+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
				+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
				+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
				+"</groups>";
		test_dataFoldersStruct_byid['2.1']= "<groups>"
			+"<group id='2.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.1</code><label lang='en'>Folder 2.1.1</label><label lang='fr'>Dossier 2.1.1</label></group>"
			+"<group id='2.1.2' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.2</code><label lang='en'>Folder 2.1.2</label><label lang='fr'>Dossier 2.1.2</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['2.1.1']= "<groups></groups>";
		test_dataFoldersStruct_byid['2.3']= "<groups>"
			+"<group id='2.3.1' count='1' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.3.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['2.3.1']= "<groups>"
			+"<group id='2.3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.3.1.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['2.1.2']= "<groups>"
			+"<group id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['2.1.2.1']= "<groups></groups>";
		test_dataFoldersStruct_byid['2.1.2.1']= "<groups>"
			+"</groups>";
		test_dataFoldersStruct_byid['3']= "<groups>"
				+"<group id='3.1' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></group>"
				+"<group id='3.2' count='0' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></group>"
				+"</groups>";
		test_dataFoldersStruct_byid['3.1']= "<groups>"
			+"<group id='3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1.1</code><label lang='en'>Folder 3.1.1</label><label lang='fr'>Dossier 3.1.1</label></group>"
			+"<group id='3.1.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1.2</code><label lang='en'>Folder 3.1.2</label><label lang='fr'>Dossier 3.1.2</label></group>"
			+"</groups>";
		test_dataFoldersStruct_byid['3.2']= "<groups></groups>";
		test_dataFoldersStruct_byid['3.1.1']= "<groups></groups>";
		test_dataFoldersStruct_byid['3.1.2']= "<groups></groups>";
		//==================================
	var data = null;
	number_of_portfoliosgroups = 3;
	if (id==undefined||id==null) {
		data=test_dataFolders;
		UIFactory["PortfoliosGroup"].parse(data);
		UIFactory["PortfoliosGroup"].displayAll('portfoliosgroups','list');
	}
	else {
		data = test_dataFoldersStruct_byid[id];
		UIFactory["PortfoliosGroup"].parseStructure(data,id); 
		UIFactory["PortfoliosGroup"].displayTree(dest,'list',langcode,id);		
	}
}

//==================================
function loadAndDisplayPortfoliosGroupContent(dest,id,langcode,type) {
//==================================
	$("#wait-window").show();
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (PortfoliosGroups_byid[id].nb_groups > 0){
		loadAndDisplayPortfoliosGroupStruct('collapse_portfoliosgroup_'+id,id,langcode)
	}
	toggleOpenElt('closeSign','openSign','portfoliosgroup_'+id);
	var index_class = "groupspageindex";
	UIFactory["PortfoliosGroup"].displayGroupContent(dest,id,langcode,index_class);
	selectElt('portfoliosgroup','portfoliosgroup_'+id);
	var dest_page = dest + '-pages';
	var list = PortfoliosGroups_byid[id].chidren_list[PortfoliosGroups_byid[id].pageindex];
	if (list==undefined||list==null){
		loadPortfoliosGroupContent(dest_page,id,langcode,type,index_class);		
	}
	else {
		PortfoliosGroups_byid[id].displayGroupContentPage(dest_page,type,langcode,index_class);		
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
function loadAndDisplayPortfoliosGroupContentPage(dest,type,id,langcode,pageindex,index_class) {
//==================================
	$("#wait-window").show();
	PortfoliosGroups_byid[id].pageindex = ""+pageindex;
	var list = PortfoliosGroups_byid[id].chidren_list[PortfoliosGroups_byid[id].pageindex];
	if (list==undefined||list==null)
		loadPortfoliosGroupContent(dest,id,langcode,type,index_class);
	else {
		PortfoliosGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
	}
	$("#wait-window").hide();
}

//==============================
function loadPortfoliosGroupContent(dest,id,langcode,type,index_class)
//==============================
{
	var pageindex = PortfoliosGroups_byid[id].pageindex;
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliosgroups/portfoliosgroup/"+id+"/children?r="+pageindex+"&limit=100&count=true",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parseChildren(data,id); 
			PortfoliosGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
	
	//===== test data
	var test_dataGroups= "<group id='0' count='3' nb_children='3' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'>"
		+"<code>userid</code>"
		+"<label lang='en'>Folder userid</label>"
		+"<label lang='fr'>Dossier userid</label>"
			+"<groups count='3'>"
			+"<group id='1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group1</code><label lang='en'>Folder 1</label><label lang='fr'>Dossier 1</label></group>"
			+"<group id='2' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></group>"
			+"<group id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></group>"
			+"</groups>"
			+"</group>";
	var test_dataGroups_byid = {};
	test_dataGroups_byid['1']= {};
	test_dataGroups_byid['2']= {};
	test_dataGroups_byid['3']= {};
	test_dataGroups_byid['2.1']= {};
	test_dataGroups_byid['2.2']= {};
	test_dataGroups_byid['2.1.1']= {};
	test_dataGroups_byid['2.1.2']= {};
	test_dataGroups_byid['2.3']= {};
	test_dataGroups_byid['2.3.1']= {};
	test_dataGroups_byid['2.3.1.1']= {};
	test_dataGroups_byid['3.1']= {};
	test_dataGroups_byid['3.2']= {};
	test_dataGroups_byid['3.1.1']= {};
	test_dataGroups_byid['3.1.2']= {};
	
	test_dataGroups_byid['1']['1']= "<children pageindex='1' count='4'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
		+"</children>";
	test_dataGroups_byid['2']['1']= "<children pageindex='1' count='7'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
		+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['2']= "<children pageindex='2' count='5'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['3']= "<children pageindex='3' count='2'>"
		+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
		+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['4']= "<children pageindex='4' count='5'>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['5']= "<children pageindex='5' count='2'>"
		+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
		+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
		+"</children>";
	test_dataGroups_byid['2']["6"]= "<children pageindex='6' count='5'>"
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"</children>";
	test_dataGroups_byid['2.1']['1']= "<groups pageindex='1' count='2'>"
		+"<group id='2.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.1</code><label lang='en'>Folder 2.1.1</label><label lang='fr'>Dossier 2.1.1</label></group>"
		+"<group id='2.1.2' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.2</code><label lang='en'>Folder 2.1.2</label><label lang='fr'>Dossier 2.1.2</label></group>"
		+"</groups>";
	test_dataGroups_byid['2.1.1']['1']= "<children>"
		+	"<portfolio id='6c2dcd99-5831-45eb-82b4-3f68812bbe54' root_node_id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-10 14:21:34.0'><asmRoot id='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model-instance</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='8cd5e087-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model-instance</code><label lang='fr'>Instance de Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='8cd4a925-4c3a-11ea-b2a2-fa163ebfbd00' contextid='8cd1122b-4c3a-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='1666805d-e770-4721-bb56-aa43c139dac4' root_node_id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-19 00:50:22.0'><asmRoot id='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' export-htm='Y' export-pdf='Y' export-rtf='Y' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.Model</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='a28f40aa-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.Model</code><label lang='fr'>Modèle</label><label lang='en'>Modèle</label></asmResource><asmResource id='a28e7f2d-46b3-11ea-b2a2-fa163ebfbd00' contextid='a28b65ec-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='0ff0f973-8686-4d8a-a0e9-7fbfb75f6f5c' root_node_id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-02-14 16:30:44.0'><asmRoot id='1a2a928c-519d-11ea-b5a9-fa163ebfbd00'><metadata-wad csstext='' menuroles='' seenoderoles='all' /><metadata-epm displayview='' /><metadata display-type='standard' menu-type='vertical' multilingual-node='Y' semantictag='root karuta-model' sharedNode='N' sharedResource='N' /><code>LA-test.model2</code><label/><description/><semanticTag>root karuta-model</semanticTag><asmResource id='1a2ca031-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test.model2</code><label lang='fr'>Modèle 2</label><label lang='en'>Modèle 2</label></asmResource><asmResource id='1a2c139b-519d-11ea-b5a9-fa163ebfbd00' contextid='1a2a928c-519d-11ea-b5a9-fa163ebfbd00' xsi_type='context'><text lang='fr'/><text lang='en'/></asmResource></asmRoot></portfolio><portfolio id='b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c' root_node_id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' owner='Y'  ownerid='20' modified='2020-01-23 15:28:56.0'><asmRoot id='92052dd8-46b3-11ea-b2a2-fa163ebfbd00'><metadata-wad commentnoderoles='designer' seenoderoles='all' /><metadata-epm/><metadata multilingual-node='Y' semantictag='root karuta-project' sharedNode='N' sharedResource='N' /><code>LA-test</code><label/><description/><semanticTag>root karuta-project</semanticTag><asmResource id='92067ab9-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='nodeRes'><code>LA-test</code><label lang='fr'>LA-test</label><label lang='en'>LA-test</label></asmResource><asmResource id='92061c43-46b3-11ea-b2a2-fa163ebfbd00' contextid='92052dd8-46b3-11ea-b2a2-fa163ebfbd00' xsi_type='context'><text lang='en'/><text lang='fr'/></asmResource></asmRoot></portfolio>"+
		+"</children>";
	test_dataGroups_byid['2.1.2']['1']= "<groups pageindex='1' count='1'>"
		+"<group id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></group>"
		+"</groups>";
	test_dataGroups_byid['2.3']['1']= "<groups pageindex='1' count='1'>"
		+"<group id='2.3.1' count='1' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.3.1</code><label lang='en'>Folder 2.3.1</label><label lang='fr'>Dossier 2.3.1</label></group>"
		+"</groups>";
	test_dataGroups_byid['2.3.1']['1']= "<groups pageindex='1' count='1'>"
		+"<group id='2.3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.3.1.1</code><label lang='en'>Folder 2.3.1.1</label><label lang='fr'>Dossier 2.3.1</label></group>"
		+"</groups>";
	test_dataGroups_byid['2.1.2']['1']= "<groups pageindex='1' count='1'>"
		+"<group id='2.1.2.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1.2.1</code><label lang='en'>Folder 2.1.2.1</label><label lang='fr'>Dossier 2.1.2.1</label></group>"
		+"</groups>";
	test_dataGroups_byid['3']['1']= "<group id='3' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2020-01-12 12:19:02.0'>"
			+"<code>group3</code>"
			+"<label lang='en'>Folder 3</label>"
			+"<label lang='fr'>Dossier 3</label>"
			+"<groups>"
			+"<group id='3.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></group>"
			+"<group id='3.2' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></group>"
			+"</groups>"
			+"</group>";
	test_dataGroups_byid['3']['1']= "<children pageindex='1' count='2'>"
		+"<group id='3.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group3.1</code><label lang='en'>Folder 3.1</label><label lang='fr'>Dossier 3.1</label></group>"
		+"<group id='3.2' count='2' nb_children='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.2</code><label lang='en'>Folder 3.2</label><label lang='fr'>Dossier 3.2</label></group>"
		+"</children>";
	test_dataGroups_byid['3.1']['1']= "<groups pageindex='1' count='2'>"
		+"<group id='3.1.1' count='0' nb_children='0' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1.1</code><label lang='en'>Folder 3.1.1</label><label lang='fr'>Dossier 3.1.1</label></group>"
		+"<group id='3.1.2' count='0' nb_children='4' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group3.1.2</code><label lang='en'>Folder 3.1.2</label><label lang='fr'>Dossier 3.1.2</label></group>"
		+"</groups>";
	test_dataGroups_byid['3.1.1']['1']= "<children>"
		+"</children>";
	test_dataGroups_byid['3.1.2']['1']= "<children pageindex='1' count='4'>"
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
		+"</children>";
	var data = null;
	data = test_dataGroups_byid[id][""+pageindex];
	UIFactory["PortfoliosGroup"].parseChildren(data,id); 
	PortfoliosGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
}

/*=======================================*/
/*========		À DÉPLACER		=========*/
/*=======================================*/

//*** à déplacer pour remplacer dans portfoliosgroups.js
//==============================
function fill_list_portfoliosgroups()
//==============================
{
	setLanguageMenu("fill_list_portfoliosgroups()");
	var html = "";
	html += "<span id='portfoliosgroup-create' class='btn' onclick=\"UIFactory['PortfoliosGroup'].callCreate()\" >"+karutaStr[LANG]['create_portfoliosgroup']+"</span>";
	html += "<h3 id='portfoliosgroups-label'>"+karutaStr[LANG]['list_portfoliosgroups']+"</h3>";
	html += "<div class='warning-list'>"+karutaStr[LANG]['note-list_usergroups']+ "</div>";
	html += "<div id='gutter'></div>";
	html += "<div id='portfoliosgroupslist-rightside'>";
	//-----------------------------------------------------------
	html += "<div id='group-portfolios'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='portfoliosgroupslist-rightside'-->";

	html += "<div id='portfoliosgroupslist-leftside'>";
	//--------------------GROUPS---------------------------------------
	html += "<div id='portfoliosgroups' class='tree user'></div>";	
	//-----------------------------------------------------------
	html += "</div><!--div id='portfoliosgroupslist-leftside'-->";

	$("#main-portfoliosgroup").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
//		url : serverBCK_API+"/portfoliosgroups",
		url : serverBCK_API+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse(data);
			UIFactory["PortfoliosGroup"].displayAll('portfoliosgroups','list');
			//----------------
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});
}

/////***********************

//==================================
UIFactory["PortfoliosGroup"].displaySelectMultiple = function(destid,type,lang)
//==================================
{
	$("#"+destid).html("");
	for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
		var input = PortfoliosGroups_list[i].getSelector(null,null,'select_portfoliosgroups');
		$("#"+destid).append($(input));
		$("#"+destid).append($("<br>"));
	}
};

//==================================
UIFactory["PortfoliosGroup"].create = function()
//==================================
{

	var label = $("#portfoliosgroup_label").val();
	var url = serverBCK_API+"/portfoliogroups?type=portfolio&label="+label;
	$.ajax({
		type : "POST",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
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
};

//==================================
UIFactory["PortfoliosGroup"].editGroupsByUuid = function(uuid)
//==================================
{
	var nameinput = "uuid_"+uuid+"-list_groups-form-update";
	var js1 = "javascript:updateDisplay_page('"+nameinput+"','fill_list_portfoliosgroups');$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['list_groups']);
	var html = "<input type='hidden' name='"+nameinput+"' id='"+nameinput+"' value='0'>";
	html += "<div id='portfolio_list_groups'>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$('#edit-window').modal('show');

//	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?uuid="+uuid,
		data: "",
		success : function(data) {
			var uuid_groupids = parseList("group",data);
			if (PortfoliosGroups_byid.length>0) { // portfolios groups loaded
				UIFactory["PortfoliosGroup"].displayManageMultipleGroups('portfolio_list_groups','uuid',uuid,uuid_groupids,'updateGroup_Portfolio');
				//--------------------------		
			} else {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfoliogroups",
					success : function(data) {
						UIFactory["PortfoliosGroup"].parse(data);
						UIFactory["PortfoliosGroup"].displayManageMultipleGroups('portfolio_list_groups','uuid',uuid,uuid_groupids,'updateGroup_Portfolio');
						//--------------------------
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Error in editGroupsByUuid 1 : "+jqxhr.responseText);
					}
				});
			}
			//----------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in editGroupsByUuid 2 : "+jqxhr.responseText);
		}
	
	});
//	$.ajaxSetup({async: true});

};

//==================================
UIFactory["PortfoliosGroup"].displayManageMultipleGroups = function(destid,attr,value,selectedlist,callFunction) 
//==================================
{
	$("#"+destid).html("");
	if (PortfoliosGroups_list.length>0){
		for ( var i = 0; i < PortfoliosGroups_list.length; i++) {
			var checked = selectedlist.contains(PortfoliosGroups_list[i].id);
			var input = PortfoliosGroups_list[i].getSelectorWithFunction(attr,value,'select_portfoliosgroups_'+i,checked,callFunction);
			$("#"+destid).append($(input));
			$("#"+destid).append($("<br>"));
		}		
	} else {
		$("#"+destid).append($(karutaStr[LANG]['no_group']));		
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getSelectorWithFunction = function(attr,value,name,checked,callFunction)
//==================================
{
	var gid = this.id;
	var label = this.label_node.text();
	var html = "<input type='checkbox' name='"+name+"' value='"+gid+"'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	if (checked)
		html += " checked='true' ";
	html += " onchange=\"javascript:"+callFunction+"(this)\" ";
	html += "> "+label+" </input>";
	return html;
};

//==================================
UIFactory["PortfoliosGroup"].callAddPortfolios = function(gid,portfolioLabel)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].addPortfolios('"+gid+"');$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['add_portfolios']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(portfolioLabel);
	var html = "";
	html += "<div id='adding_portfolios' class='div_scroll'>";
	html += "</div>";
	$("#edit-window-body").html(html);
	$("#edit-window-type").html("");
	//--------------------------
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?group="+gid,
		data: "",
		success : function(data) {
			var items = parseList("portfolio",data);
			if (!($("#list-menu").length && $("#list-menu").html()!="")) {
				fill_list_page();
			}
			UIFactory["Portfolio"].displaySelectPortfolios(items,'adding_portfolios');
			//----------------
		}
	});
	$.ajaxSetup({async: true});
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].addPortfolios = function(gid)
//==================================
{
	var items = $("input[name='select_portfolios']:not(:disabled)").filter(':checked');
	var url = serverBCK_API+"/portfoliogroups?group="+gid+"&uuid=";
	for (var i=0; i<items.length; i++){
		var itemid = $(items[i]).attr('value');
		var url2 = url+itemid;
		$.ajax({
			type : 'PUT',
			dataType : "text",
			url : url2,
			data : "",
			success : function(data) {
				var group_type = "PortfoliosGroup";
				toggleGroup(group_type,gid,'UIFactory.PortfoliosGroup.displayPortfolios','list',null);
				PortfoliosGroups_byid[gid].members = [];
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
	}
};

//==================================
UIFactory["PortfoliosGroup"].prototype.fillSharingRoles = function()
//==================================
{
	this.rrg = {};
	var rrg = this.rrg;
	var roles = this.roles;
	$.ajaxSetup({async: false});
	for ( var i = 0; i < this.members.length; i++) {
		var id = this.members[i];
		//------------------------------------
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/rolerightsgroups?portfolio="+id,
			success : function(data) {
				var groups = $("rolerightsgroup",data);
				if (groups.length>0) {
					for (var i=0; i<groups.length; i++) {
						var groupid = $(groups[i]).attr('id');
						var label = $("label",groups[i]).text();
						if (label!="user") {
							if (rrg[label]===undefined)
								rrg[label]=[];
							rrg[label].push(groupid);
						}
					}
				}
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in fillRoles : "+jqxhr.responseText);
			}
		});
	}
	$.ajaxSetup({async: true});
	for (var e in this.rrg) {
		this.roles[this.roles.length]=e;
	}
	this.roles.sort();
};

//==================================
UIFactory["PortfoliosGroup"].prototype.getSharingRoleEditor = function(destid,callFunction)
//==================================
{
	if (this.roles.length==0) {
		this.fillSharingRoles();
	}
	//--------------------------
	if (this.roles.length>0) {
		var js = "";
		if (callFunction!=null) {
			js += callFunction+";";
		}
		js += "$('input:checkbox').prop('checked', false);";
		var first = true;
		for (var i=0; i<this.roles.length; i++) {
			if (this.roles[i]!="user") {
				var input = "<input type='radio' name='radio_group' value='"+this.roles[i]+"'";
				input += "onclick=\""+js+"\" ";
				input +="> "+this.roles[i]+" </input><br/>";
				$("#"+destid).append($(input));
			}
		}
	} else {
		$("#"+destid).html(karutaStr[LANG]['nogroup']);
	}
};

//==================================
UIFactory["PortfoliosGroup"].displaySharingRoleEditor = function(destid,gid,callFunction)
//==================================
{
	if (PortfoliosGroups_byid[gid].members.length==0) { // to load members of portfolios groups
		$.ajaxSetup({async: false});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfoliogroups?group="+gid,
			data: "",
			success : function(data) {
				PortfoliosGroups_byid[gid].members = parseList("portfolio",data);
				PortfoliosGroups_byid[gid].roles = [];
				PortfoliosGroups_byid[gid].getSharingRoleEditor(destid,callFunction);
				//----------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error : "+jqxhr.responseText);
			}
		});
		$.ajaxSetup({async: true});
	} else {
		PortfoliosGroups_byid[gid].getSharingRoleEditor(destid,callFunction);
	}
};

//==================================
UIFactory["PortfoliosGroup"].callShareUsers = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].shareUsers('"+gid+"','unshare')";
	var js3 = "javascript:UIFactory['PortfoliosGroup'].shareUsers('"+gid+"','share')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+PortfoliosGroups_byid[gid].label);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='sharing' style='display:none'>";
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
	if (Users_byid.length>0) { // users groups loaded
		UIFactory["User"].displaySelectMultipleActive('sharing_users');
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
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in PortfoliosGroup.callShareUsers : "+jqxhr.responseText);
			}
		});
	}
	UIFactory["PortfoliosGroup"].displaySharingRoleEditor('sharing_roles',gid);
	$("#sharing").show();
	
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].callShareUsersGroups = function(gid)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory['PortfoliosGroup'].shareGroups('"+gid+"','unshare')";
	var js3 = "javascript:UIFactory['PortfoliosGroup'].shareGroups('"+gid+"','share')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['addshare']+'/'+karutaStr[LANG]['unshare']+' '+PortfoliosGroups_byid[gid].label);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='sharing' style='display:none'>";
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
		//--------------------------		
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displaySelectMultipleWithUsersList('sharing_usersgroups');
				//--------------------------
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in PortfoliosGroup.callShareUsersGroups 1 : "+jqxhr.responseText);
			}
		});
	}
	UIFactory["PortfoliosGroup"].displaySharingRoleEditor('sharing_roles',gid,"UIFactory['UsersGroup'].hideUsersList('sharing_usersgroups-group-')");
	$("#sharing").show();
	
	//----------------------------------------------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["PortfoliosGroup"].shareGroups = function(gid,type)
//==================================
{
	var usersgroups = $("input[name='select_usersgroups']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var grouplabel = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		grouplabel = $(group).attr('value');
	}
	if (grouplabel!=null) {
		var xml = get_usersxml_from_groups(usersgroups);
		var users = $("user",xml);
		for (var i=0; i<PortfoliosGroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = PortfoliosGroups_byid[gid].rrg[grouplabel][i];
			updateRRGroup_Users(groupid,users,xml,type,'id');
		}
		//-----------------------------
		var html = "";
		for (var i=0; i<usersgroups.length; i++){
			var usergroupid = $(usersgroups[i]).attr('value');
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/usersgroups?group="+usergroupid,
				data: "",
				success : function(data) {
					var users_ids = parseList("user",data);
					for ( var i = 0; i < users_ids.length; i++) {
						if (Users_byid[users_ids[i]]!=null && Users_byid[users_ids[i]]!=undefined) {
							if (Users_byid[users_ids[i]].active_node.text()=='1') {
								html += "<div class='item' >"+Users_byid[users_ids[i]].getView(null,"firstname-lastname-username")+"</div>";
							} else
								$("#"+destid).append($("<div class='item inactive'>"+Users_byid[users_ids[i]].getView(null,"firstname-lastname-username")+"</div>"));
						}
					}
					if (html.length==0)
						html += "<h5>"+karutaStr[LANG]['empty-group']+"</h5>";
					//----------------
					var header = "";
					if (type=="share")
						header = karutaStr[LANG]['shared'];
					else
						header = karutaStr[LANG]['unshared'];
					alertHTML("<h5>"+karutaStr[LANG]['role']+": "+grouplabel+"</h5><h5>"+karutaStr[LANG]['users']+": </h5>"+html,header);
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error : "+jqxhr.responseText);
				}
			});	
		}
		//-----------------------------
	}
};

//==================================
UIFactory["PortfoliosGroup"].shareUsers = function(gid,type)
//==================================
{
	var users = $("input[name='select_users']").filter(':checked');
	var groups = $("input[name='radio_group']");
	var grouplabel = null;
	if (groups.length>0){
		var group = $("input[name='radio_group']").filter(':checked');
		grouplabel = $(group).attr('value');
	}
	if (grouplabel!=null) {
		var xml = "<users>";
		for (var i=0; i<users.length; i++){
			var userid = $(users[i]).attr('value');
			xml += "<user id='"+userid+"'/>";
		}
		xml += "</users>";
		for (var i=0; i<PortfoliosGroups_byid[gid].rrg[grouplabel].length; i++) {
			var groupid = PortfoliosGroups_byid[gid].rrg[grouplabel][i];
			updateRRGroup_Users(groupid,users,xml,type,'value');
		}
		var html = "";
		//-----------------------------
		for ( var i = 0; i < users.length; i++) {
			var userid = $(users[i]).attr('value');
			if (Users_byid[userid]!=null && Users_byid[userid]!=undefined) {
				if (Users_byid[userid].active_node.text()=='1') {
					html += "<div class='item' >"+Users_byid[userid].getView(null,"firstname-lastname-username")+"</div>";
				} else
					$("#"+destid).append($("<div class='item inactive'>"+Users_byid[userid].getView(null,"firstname-lastname-username")+"</div>"));
			}
		}
		var header = "";
		if (type=="share")
			header = karutaStr[LANG]['shared'];
		else
			header = karutaStr[LANG]['unshared'];
		alertHTML("<h5>"+karutaStr[LANG]['role']+": "+grouplabel+"</h5><h5>"+karutaStr[LANG]['users']+": </h5>"+html,header);
		//-----------------------------
	}
};

