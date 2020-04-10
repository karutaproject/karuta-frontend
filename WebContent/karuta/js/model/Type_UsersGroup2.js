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
	
var UsersGroups_byid = {};
var usersgroups_list = [];
var currentDisplayedUsersGroupId = null;
var number_of_usersgroups = 0;
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
}

//==================================
UIFactory["UsersGroup"].displayAll = function(dest,type,langcode)
//==================================
{
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

//==================================
UIFactory["UsersGroup"].displayTree = function(dest,type,langcode,parentid)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	var list = [];
	if (parentid==undefined || parentid==null)
		list = usersgroups_list;
	else list = UsersGroups_byid[parentid].groups_list;
	var html="";
	for (var i = 0; i < list.length; i++) {
		html += list[i].getTreeNodeView(dest,type,langcode);
	}
	document.getElementById(dest).innerHTML = html;
	if (parentid!=undefined && parentid!=null)
		document.getElementById('number_of_usersgroups'+UsersGroups_byid[parentid].id).innerHTML = UsersGroups_byid[parentid].nb_groups;
}

//==================================
UIFactory["UsersGroup"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	//---------------------	
	var group_label = this.label_node[langcode].text();
	var html = "";
	if (type=='list') {
		html += "<div id='usersgroup_"+this.id+"' class='treeNode usersgroup'>";
		html += "	<div class='row-label group-row'>";
		html += "		<span id='toggle_usersgroup_"+this.id+"' class='closeSign";
		if (this.nb_groups>0){
			html += " toggledNode";
		}
		html += "' onclick=\"javascript:loadAndDisplayUsersGroupStruct('collapse_usersgroup_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-usersgrouplabel_"+this.id+"' onclick=\"javascript:loadAndDisplayUsersGroupContent('group-users','"+this.id+"');\" class='group-label'>"+group_label+"&nbsp;</span><span class='badge number_of_groups' id='number_of_usersgroups"+this.id+"'>"+this.nb_groups+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='number_of_usersgroup_items_"+this.id+"'>"+this.nb_children+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_usersgroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- class='usersgroup'-->";
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
		html += "<div id='select-usersgroup_"+this.id+"' class='treeNode select-folder'>";
		html += "	<div class='row-label'>";
		html += "		<span id='toggle_select-usersgroup_"+this.id+"' class='closeSign";
		if (this.nb_groups>0){
			html += " toggledNode";
		}
		html += "' onclick=\"javascript:loadAndDisplayUsersGroupStruct('collapse_select-usersgroup_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-usersgrouplabel_"+this.id+"' onclick=\"javascript:loadAndDisplayUsersGroupContent('select-group-users','"+this.id+"');\" class='group-label'>"+group_label+"&nbsp;</span><span class='badge number_of_groups' id='select-number_of_usersgroups"+this.id+"'>"+this.nb_groups+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='select-number_of_usersgroup_items_"+this.id+"'>"+this.nb_children+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_select-usersgroup_"+this.id+"' class='nested'></div>";
		html += "</div><!-- id='select-usersgroup_...'-->";
	}
	return html;
}

//==================================
UIFactory["UsersGroup"].displayGroupContent = function(dest,id,langcode,index_class)
//==================================
{
	$("#"+dest).show();
	localStorage.setItem('currentDisplayedUsersGroup',id);
	$("#"+dest).html("");
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	var usersgroup = UsersGroups_byid[id];
	//---------------------
	var html = "";
	var groupcode = usersgroup.code;
	var owner = (Users_byid[usersgroup.ownerid]==null) ? "":Users_byid[usersgroup.ownerid].getView(null,'firstname-lastname',null);

	var group_label = usersgroup.label_node[langcode].text();
	if (group_label==undefined || group_label=='' || group_label=='&nbsp;')
		group_label = '- no label in '+languages[langcode]+' -';
	html += "<div id='content-usersgroup_"+usersgroup.id+"' class='usersgroup'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-1'/>";
	html += "		<div class='col-4 group-label' id='usersgrouplabel_"+usersgroup.id+"'>"+group_label+"</div>";
	html += "		<div class='col-2 d-none d-md-block group-label'>"+owner+"</div>";
	html += "		<div class='col-3 d-none d-sm-block comments' id='usersgroup-comments_"+usersgroup.date_modified.substring(0,10)+"'> </div><!-- comments -->";
	html += "		<div class='col-1'>";
	//------------ buttons ---------------
	html += UIFactory.UsersGroup.getAdminMenu(usersgroup,false);
	//---------------------------------------
	html += "		</div><!-- class='col-1' -->";
	html += "	</div><!-- class='row' -->";
	html += "</div><!-- class='usersgroup'-->";
	//----------------------
	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	// ----------------------
	html += "<div id='group-users-pages' class='usersgroup-pages'>";
	html += "</div><!-- class='usersgroup-pages'-->";
	// ----------------------
	html += "<div id='"+index_class+pagegNavbar_list[1]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
}

//==================================
UIFactory["UsersGroup"].prototype.displayGroupContentPage = function(dest,type,langcode,index_class)
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
			var destid = dest+"_item-usersgroup_"+item.id;
			html += "<div class='row item item-group' id='"+destid+"'>";
			html += item.getView(destid,type,langcode);
			html += "</div>";
		} else {
			var destid = dest+"_item-user_"+item.id;
			html += "<div class='row item item-user' id='"+destid+"'>";
			html += item.getView(destid,type,langcode,this.id);
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_children)/nbItem_par_page);
	if (nb_index>1) {
		displayPagesNavbar(nb_index,this.id,langcode,parseInt(this.pageindex),index_class,'loadAndDisplayUsersGroupContentPage',dest,"list");		
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
	var group_label = this.label_node[langcode].text();
	var owner = (Users_byid[this.ownerid]==null) ? "":Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	var tree_type='<span class="fa fa-folder" aria-hidden="true"></span>';
	var html = "";
	if (type=='list') {
		html += "<div class='group-label col-10 col-md-4' title=\""+this.code+"\" class='group-label'>"+group_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='usersgroup-owner'>"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='usersgroup-code'>"+this.code+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y') || (USER.creator && !USER.limited)) {
			html += UIFactory.UsersGroup.getAdminMenu(this,true);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='select') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_folders',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='group-label'>"+group_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs'><a class='usersgroup-owner'>"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs'>"+this.code+"</a></div>";
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
	html += "<div class='dropdown group-menu'>";
	if (USER.admin) {
		html += "	<button id='dropdown-usersgroup"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown-usersgroup"+self.id+"'>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].callAddUsers('"+self.id+"')\" ><i class='fa fa-user-plus'></i> "+karutaStr[LANG]["add_users"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory.UsersGroup.callRename('"+self.id+"',null,"+list+")\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['UsersGroup'].callMove('"+self.id+"')\" ><i class='button fas fa-random'></i> "+karutaStr[LANG]['move']+"</a>";
		html += "		<a class='dropdown-item' id='remove-"+self.id+"' style='display:block' onclick=\"confirmDelObject('"+self.id+"','UsersGroup')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
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
UIFactory["UsersGroup"].callRename = function(id,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = UsersGroups_byid[id];
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
		$("#treenode-usersgrouplabel_"+itself.id).html($(label));
		if (list)
			$("#item-usersgroup_"+itself.id).html($(itself.getView('item-usersgroup_'+itself.id,'list')));
		else {
			$("#usersgrouplabel_"+itself.id).html($(label));
		}
	};
	UICom.query("PUT",serverBCK_API+'/usersgroups/usersgroup/'+itself.id+'',callback,"text",strippeddata);
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
UIFactory["UsersGroup"].create = function()
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
			var url = serverBCK_API+"/usersgroups";
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
UIFactory["UsersGroup"].del = function(id) 
//==================================
{
	var url = serverBCK_API+"/usersgroups/usersgroup/" + id;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<group_list.length;i++){
				if (usersgroup_list[i]!=null && usersgroup_list[i].id==id) {
					usersgroup_list[i] = null;
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
UIFactory["UsersGroup"].parse = function(data) 
//==================================
{
	UsersGroups_byid = {};
	usersgroups_list = [];		
	var items = $("group",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		UsersGroups_byid[id] = new UIFactory["UsersGroup"](items[i]);
		var code = UsersGroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usersgroups_list[i] = UsersGroups_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["UsersGroup"].parseStructure = function(data,parentid) 
//==================================
{
	var items = $("group",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (UsersGroups_byid[id]==undefined){
			UsersGroups_byid[id] = new UIFactory["UsersGroup"](items[i]);
		} else
			UsersGroups_byid[id].update(items[i]);			
		var code = UsersGroups_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (UsersGroups_byid[parentid]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			UsersGroups_byid[parentid].groups_list[i] = UsersGroups_byid[newTableau1[i][1]]
		}
		UsersGroups_byid[parentid].loadedStruct = true;
		UsersGroups_byid[parentid].nb_groups = UsersGroups_byid[parentid].groups_list.length;
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
		if("GROUP"==tagname || "USER"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("GROUP"==tagname) {
				if (UsersGroups_byid[id]==undefined)
					UsersGroups_byid[id] = new UIFactory["UsersGroup"](child);
				else UsersGroups_byid[id].update(child);
				list[i]['obj'] = UsersGroups_byid[id];
			} else {
				if (Users_byid[id]==undefined)
					Users_byid[id] = new UIFactory["User"](child);
				//else Users_byid[id].update(child);
				list[i]['obj'] = Users_byid[id];
			}
		}
	}
	UsersGroups_byid[parentid].chidren_list[UsersGroups_byid[parentid].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
function loadAndDisplayUsersGroupStruct(dest,id,langcode) {
//==================================
	$("#wait-window").show();
	toggleElt('closeSign','openSign','usersgroup_'+id);
	if (!UsersGroups_byid[id].loadedStruct)
		loadUsersGroupStruct(dest,id,langcode);
	else {
//		UIFactory.Folder.displayTree(dest,'list',langcode,id);
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersGroupStruct(dest,id,langcode)
//==============================
{
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups/usersgroup/"+id+"/children?type=FOLDER&count=true",
		success : function(data) {
			UIFactory["UsersGroup"].parse_add(data);
			UIFactory["UsersGroup"].displayTree(dest,'list',langcode,id);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
		
		//===== test data
		var test_dataGroups= "<groups count='3'>"
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
	number_of_usersgroups = 3;
	if (id==undefined||id==null) {
		data=test_dataFolders;
		UIFactory["UsersGroup"].parse(data);
		UIFactory["UsersGroup"].displayAll('usersgroups','list');
	}
	else {
		data = test_dataFoldersStruct_byid[id];
		UIFactory["UsersGroup"].parseStructure(data,id); 
		UIFactory["UsersGroup"].displayTree(dest,'list',langcode,id);		
	}
}

//==================================
function loadAndDisplayUsersGroupContent(dest,id,langcode,type) {
//==================================
	$("#wait-window").show();
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (UsersGroups_byid[id].nb_groups > 0){
		loadAndDisplayUsersGroupStruct('collapse_usersgroup_'+id,id,langcode)
	}
	toggleOpenElt('closeSign','openSign','usersgroup_'+id);
	var index_class = "groupspageindex";
	UIFactory["UsersGroup"].displayGroupContent(dest,id,langcode,index_class);
	selectElt('usersgroup','usersgroup_'+id);
	var dest_page = dest + '-pages';
	var list = UsersGroups_byid[id].chidren_list[UsersGroups_byid[id].pageindex];
	if (list==undefined||list==null){
		loadUsersGroupContent(dest_page,id,langcode,type,index_class);		
	}
	else {
		UsersGroups_byid[id].displayGroupContentPage(dest_page,type,langcode,index_class);		
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
function loadAndDisplayUsersGroupContentPage(dest,type,id,langcode,pageindex,index_class) {
//==================================
	$("#wait-window").show();
	UsersGroups_byid[id].pageindex = ""+pageindex;
	var list = UsersGroups_byid[id].chidren_list[UsersGroups_byid[id].pageindex];
	if (list==undefined||list==null)
		loadUsersGroupContent(dest,id,langcode,type,index_class);
	else {
		UsersGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersGroupContent(dest,id,langcode,type,index_class)
//==============================
{
	var pageindex = UsersGroups_byid[id].pageindex;
/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups/usersgroup/"+id+"/children?r="+pageindex+"&limit=100&count=true",
		success : function(data) {
			UIFactory["UsersGroup"].parseChildren(data,id); 
			UsersGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	*/
	
	//===== test data
	var test_dataFolders= "<group id='0' count='3' nb_children='3' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'>"
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
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
		+"</children>";
	test_dataGroups_byid['2']['1']= "<children pageindex='1' count='7'>"
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
		+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['2']= "<children pageindex='2' count='5'>"
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
		+"<group id='2.1' count='2' nb_children='6' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>group2.1</code><label lang='en'>Folder 2.1</label><label lang='fr'>Dossier 2.1</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['3']= "<children pageindex='3' count='2'>"
		+"<group id='2.2' count='0' nb_children='1' owner='Y'  ownerid='20' modified='2020-02-02 12:19:02.0'><code>group2.2</code><label lang='en'>Folder 2.2</label><label lang='fr'>Dossier 2.2</label></group>"
		+"<group id='2.3' count='1' nb_children='1' owner='Y'  ownerid='20' modified='2020-01-02 12:19:02.0'><code>group2.3</code><label lang='en'>Folder 2.3</label><label lang='fr'>Dossier 2.3</label></group>"
		+"</children>";
	test_dataGroups_byid['2']['4']= "<children pageindex='4' count='5'>"
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user><user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='11'><username>dumas@litterature.fr</username><firstname>Alexandre</firstname><lastname>Dumas</lastname><admin>0</admin><designer>0</designer><email>dumas@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='12'><username>crush@bulles.ca</username><firstname>Crush</firstname><lastname>LaTortue</lastname><admin>0</admin><designer>0</designer><email>crush@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='13'><username>nemo@bulles.ca</username><firstname>Némo</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>nemo@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='14'><username>adm-ateliers</username><firstname>Administrateur</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='16'><username>ens-ateliers</username><firstname>Enseignant</firstname><lastname>Promising</lastname><admin>0</admin><designer>1</designer><email>ens@courriel.ca</email><active>1</active><substitute>0</substitute><other>xlimited</other></user><user id='17'><username>doris@bulles.ca</username><firstname>Doris</firstname><lastname>LePoisson</lastname><admin>0</admin><designer>0</designer><email>doris@bulles.ca</email><active>1</active><substitute>0</substitute><other></other></user><user id='18'><username>eric.giraudin@gmail.com</username><firstname>Eric</firstname><lastname>Giraudin</lastname><admin>0</admin><designer>1</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='19'><username>eric.duquenoy@univ-littoral.fr</username><firstname>Éric</firstname><lastname>Duquenoy</lastname><admin>0</admin><designer>1</designer><email>eric.duquenoy@univ-littoral.fr</email><active>1</active><substitute>0</substitute><other></other></user><user id='20'><username>la</username><firstname>Lan Anh</firstname><lastname>Dinh</lastname><admin>0</admin><designer>1</designer><email>tlanh.dinh@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user><user id='22'><username>nobry</username><firstname>Nobry</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email></email><active>1</active><substitute>0</substitute><other></other></user><user id='38'><username>01-etudiant</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='39'><username>01-tuteur</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>0</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='40'><username>01-designer</username><firstname>lili</firstname><lastname>Marlene</lastname><admin>0</admin><designer>1</designer><email>iei</email><active>1</active><substitute>0</substitute><other></other></user><user id='41'><username>cecilekaya</username><firstname>Cécile</firstname><lastname>KAYA</lastname><admin>0</admin><designer>0</designer><email>eric.giraudin@gmail.com</email><active>1</active><substitute>0</substitute><other>undefined</other></user><user id='42'><username>prototype</username><firstname></firstname><lastname>prototype</lastname><admin>0</admin><designer>1</designer><email></email><active>1</active><substitute>0</substitute><other></other></user>"
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
		+"<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>"
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
	UIFactory["UsersGroup"].parseChildren(data,id); 
	UsersGroups_byid[id].displayGroupContentPage(dest,type,langcode,index_class);		
}

/*=======================================*/
/*========		À DÉPLACER		=========*/
/*=======================================*/

//*** à déplacer pour remplacer dans usersgroups.js
//==============================
function fill_list_usersgroups()
//==============================
{
	setLanguageMenu("fill_list_usersgroups()");
	var html = "";
	html += "<span id='usersgroup-create' class='btn' onclick=\"UIFactory['UsersGroup'].callCreate()\" >"+karutaStr[LANG]['create_usersgroup']+"</span>";
	html += "<h3 id='usersgroups-label'>"+karutaStr[LANG]['list_usersgroups']+"</h3>";
	html += "<div class='warning-list'>"+karutaStr[LANG]['note-list_usergroups']+ "</div>";
	html += "<div id='gutter'></div>";
	html += "<div id='usersgroupslist-rightside'>";
	//-----------------------------------------------------------
	html += "<div id='group-users'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='usersgroupslist-rightside'-->";

	html += "<div id='usersgroupslist-leftside'>";
	//--------------------GROUPS---------------------------------------
	html += "<div id='usersgroups' class='tree user'></div>";	
	//-----------------------------------------------------------
	html += "</div><!--div id='usersgroupslist-leftside'-->";

	$("#main-usersgroup").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups",
		data: "",
		success : function(data) {
			UIFactory["UsersGroup"].parse(data);
			UIFactory["UsersGroup"].displayAll('usersgroups','list');
			//----------------
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});
}

