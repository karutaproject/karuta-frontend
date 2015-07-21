/* =======================================================
	Copyright 2015 - ePortfolium - Licensed under the
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

if( UIFactory === undefined )
{
  var UIFactory = {};
}

//==================================
UIFactory["Node"] = function( node )
//==================================
{
	try {
		this.id = $(node).attr('id');
		this.node = node;
		this.asmtype = $(node).prop("nodeName");
		this.code_node = $($("code",node)[0]);
		this.userrole = $(node).attr('role');
		if (this.userrole==undefined || this.userrole=='')
			this.userrole = "norole";
		//------------------------------
		this.label_node = [];
		for (var i=0; i<languages.length;i++){
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			if (this.label_node[i].length==0) {
				var newElement = createXmlElement("label");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			}
//			if (this.label_node[i].text()=="" && (this.asmtype=="asmRoot" || this.asmtype=="asmStructure" || this.asmtype=="asmUnit" ))
//				this.label_node[i].text("?");
		}
		//------------------------------
		var resource = null;
		this.resource_type = null;
		this.resource = null;
		if (this.asmtype=='asmContext') {
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",node);
			this.resource_type = $(resource).attr("xsi_type");
			this.resource = new UIFactory[this.resource_type](node);
		}
		//------------------------------
		this.context = $("asmResource[xsi_type='context']",node);
		this.context_text_node = [];
		//------------------------------
		for (var i=0; i<languages.length;i++){
			this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='context']",node)[0]);
			if (this.context_text_node[i].length==0) {
				var newElement = createXmlElement("text");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='context']",node)[0].appendChild(newElement);
				this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='context']",node)[0]);
			}
		}
		//------------------------------
		this.metadata = $("metadata",node);
		this.metadatawad = $("metadata-wad",node);
		this.metadataepm = $("metadata-epm",node);
		this.semantictag = $("metadata",node).attr('semantictag');
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
		//------------------------------
		this.display = {}; // to refresh after changes
		this.display_label = {}; // to refresh after changes
	}
	catch(err) {
		alert("UIFactory['Node']--"+err.message+"--"+this.id+"--"+this.resource_type);
	}
};

//==================================
UIFactory["Node"].prototype.getCode = function()
//==================================
{
	return this.code_node.text();
};

//==================================
UIFactory["Node"].prototype.getValue = function()
//==================================
{
	return this.value_node.text();
};

//==================================
UIFactory["Node"].prototype.getLabel = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'span';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null)
		this.display_label[dest]=type;
	//---------------------
	var html = "";
	var label = this.label_node[langcode].text();
//	if (label=='' && languages.length>1)
//		label = "?"; // for translation
	if (type=="div")
		html =   "<div>"+label+"</div>";
	if (type=="span")
		html =   "<span>"+label+"</span>";
	if (type=="none")
		html = label;
	return html;
};

//==================================
UIFactory["Node"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	var html = "";
	if (g_userrole=='designer' || USER.admin || $(this.metadatawad).attr('display')!='N') {
		if (type=="default")
			html += "<div class='title'";
		if (type=="span")
			html += "<span class='title'";
		//----------------------------
		var style ="";
		var metadataepm = $(this.metadataepm);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
		style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'othercss');
		if (style.length>0)
			html += " style='"+style+"' ";
		//----------------------------
		html += ">";
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userrole=='designer' || USER.admin)) {
			html += this.code_node.text()+" ";
		}
		var label = this.label_node[langcode].text();
		if (label == "")
			label="&nbsp;";
		html += label+"<span id='help_"+this.id+"' class='ihelp'></span>";
		if (type=="default")
			html += "</div>";
		if (type=="span")
			html += "</span>";
	}
	return html;
};

/// Editor
//==================================
UIFactory["Node"].updateLabel = function(input,itself,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-node')=='Y') ? true : false;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	$(itself.label_node[langcode]).text(label);
	itself.save();
	writeSaved(itself.id);
};

//==================================
UIFactory["Node"].update = function(input,itself,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-node')=='Y') ? true : false;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var code = $.trim($("#code_"+itself.id).val());
	$(itself.code_node).text(code);
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	$(itself.label_node[langcode]).text(label);
	itself.save();
	writeSaved(itself.id);
};

//==================================
UIFactory["Node"].prototype.getNodeLabelEditor = function(type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var self = this;
	var inputLabel = "<input id='label_"+this.id+"_"+langcode+"' type='text'  value=\""+this.label_node[langcode].text()+"\">";
	var objLabel = $(inputLabel);
	$(objLabel).change(function (){
		UIFactory["Node"].updateLabel(objLabel,self,langcode);
	});
	return objLabel;
};

//==================================
UIFactory["Node"].prototype.getEditor = function(type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var self = this;
	var div = $("<div></div>");
	$(div).append($("<br>"));
	//-----------------------------
	var editnoderoles = $(this.metadatawad).attr('editnoderoles');
	if (editnoderoles==undefined)
		editnoderoles="";
	if (g_userrole=='designer' || USER.admin || editnoderoles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1) {
		var htmlFormObj = $("<form class='form-horizontal'></form>");
		if (g_userrole=='designer' || USER.admin) {
			var htmlCodeGroupObj = $("<div class='form-group'></div>")
			var htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>Code</label>");
			var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
			var htmlCodeInputObj = $("<input id='code_"+this.id+"' type='text' class='form-control' name='input_code' value=\""+this.code_node.text()+"\">");
			$(htmlCodeInputObj).change(function (){
				UIFactory["Node"].update(htmlCodeInputObj,self,langcode);
			});
			$(htmlCodeDivObj).append($(htmlCodeInputObj));
			$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
			$(htmlCodeGroupObj).append($(htmlCodeDivObj));
			$(htmlFormObj).append($(htmlCodeGroupObj));
		}
		if (g_userrole=='designer' || USER.admin || editnoderoles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1) {
			var htmlLabelGroupObj = $("<div class='form-group'></div>")
			var htmlLabelLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
			var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
			var htmlLabelInputObj = $("<input id='label_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.label_node[langcode].text()+"\">");
			$(htmlLabelInputObj).change(function (){
				UIFactory["Node"].update(htmlLabelInputObj,self,langcode);
			});
			$(htmlLabelDivObj).append($(htmlLabelInputObj));
			$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
			$(htmlLabelGroupObj).append($(htmlLabelDivObj));
			$(htmlFormObj).append($(htmlLabelGroupObj));
		}
		//-----------------------------
		var resizeroles = $(this.metadatawad).attr('resizeroles');
		if (resizeroles==undefined)
			resizeroles="";
		if ((g_userrole=='designer' || USER.admin || resizeroles.indexOf(g_userrole)>-1 || resizeroles.indexOf(this.userrole)>-1) && this.resource!=undefined && this.resource.type=='Image') {
			var htmlSize = UIFactory["Node"].getMetadataEpmAttributeEditor(this.id,'width',$(this.metadataepm).attr('width'));
			$(htmlFormObj).append($(htmlSize));
		}
		$(div).append($(htmlFormObj));
	}
	//--------------- set editbox title --------------
	var title = "&nbsp;"; // karutaStr[LANG]['edit'];
	if (this.label_node[langcode].text()!='')
		title = this.label_node[langcode].text();
	var editboxtitle =$(this.metadatawad).attr('editboxtitle');
	if (editboxtitle!=undefined && editboxtitle!="")
		title = editboxtitle;
	$("#edit-window-title").html(title);
	//------------- write resource type on the upper right corner ----------------
	if (g_userrole=='designer' || USER.admin){
		if (this.asmtype=='asmContext')
			$("#edit-window-type").html(this.resource.type);
		else
			$("#edit-window-type").html(this.asmtype);
	} else {
		$("#edit-window-type").html("");
	}
	//-----------------------------
	return div;
};

//==================================
UIFactory["Node"].prototype.save = function()
//==================================
{
	UICom.UpdateNode(this.id);
	this.refresh();
};

//==================================
UIFactory["Node"].prototype.remove = function()
//==================================
{
	UIFactory["Node"].remove(this.id);
};

//==================================
UIFactory["Node"].remove = function(uuid,callback,param1,param2)
//==================================
{
	$("#"+uuid,g_portfolio_current).remove();
	UICom.DeleteNode(uuid,callback,param1,param2);
};

//==================================
UIFactory["Node"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.display_label) {
		$("#"+dest).html(this.getLabel(null,this.display_label[dest],null));
	};

};


//==================================
UIFactory["Node"].prototype.getButtons = function(dest,type,langcode,inline,depth,edit,menu)
//==================================
{
	return UIFactory["Node"].buttons(this,type,langcode,inline,depth,edit,menu);
};
//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

//===========================================
UIFactory["Node"].displaySidebar = function(root,destid,type,langcode,edit,parentid)
//===========================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	/// Traverse tree
	for( var i=0;i<root.children.length;i++ )
	{
		var child = UICom.structure["tree"][root.children[i]].node;
		var name = child.tagName;
		var uuid = $(child).attr("id");
		var text = UICom.structure["ui"][uuid].getLabel('sidebar_'+uuid,'div');
		var node = UICom.structure["ui"][uuid];
		var showroles = ($(node.metadatawad).attr('showroles')==undefined)?'none':$(node.metadatawad).attr('showroles');
		var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
		var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
		if ((display=='N' && (g_userrole=='designer' || USER.admin)) || (display=='Y' && ((showroles==g_userrole && privatevalue) || !privatevalue || g_userrole=='designer'))) {
			if(name == "asmUnit") // Click on Unit
			{
//				var link = "<div class='link-unit'><a id='sidebar_"+uuid+"' class='sidebar' href='#' onclick=\"$('.selected').removeClass('selected');$(this).parent().addClass('selected');displayPage('"+uuid+"',100,'"+type+"','"+langcode+"',"+g_edit+")\">"+text+"</div></a>";
//				$("#"+destid).append($(link));
				var html = "";
				html += "<div class='panel panel-group panel-default' id='parent-"+uuid+"' role='tablist'>";
				html += "<div class='panel-heading'role='tab'>";
				html += "  <a id='sidebar_"+uuid+"' class='sidebar-link' data-toggle='collapse' data-parent='#parent-"+parentid+"' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" href='#collapse"+uuid+"' aria-expanded='false' aria-controls='collapse"+uuid+"'>"+text+"</a>";
				html += "</div><!-- panel-heading -->";
				html += "<div id='collapse"+uuid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
				html += "<div id='panel-body"+uuid+"'></div><!-- panel-body -->";
				html += "</div><!-- panel-collapse -->";
				html += "</div><!-- panel -->";
				$("#"+destid).append($(html));
			}
			if(name == "asmStructure") // Click on Structure
			{
				var depth = 1;
				var html = "";
				html += "<div class='panel panel-group panel-default' id='parent-"+uuid+"' role='tablist'>";
				html += "<div class='panel-heading'role='tab'>";
				html += "  <a   id='sidebar_"+uuid+"' class='sidebar-link' data-toggle='collapse' data-parent='#parent-"+parentid+"' onclick=\"$('.selected').removeClass('selected');$(this).parent().addClass('selected');displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" href='#collapse"+uuid+"' aria-expanded='false' aria-controls='collapse"+uuid+"'>"+text+"</a>";
				html += "</div><!-- panel-heading -->";
				html += "<div id='collapse"+uuid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
				html += "<div id='panel-body"+uuid+"' class='panel-body'></div><!-- panel-body -->";
				html += "</div><!-- panel-collapse -->";
				html += "</div><!-- panel -->";
				$("#"+destid).append($(html));
				UIFactory["Node"].displaySidebar(UICom.structure["tree"][root.children[i]],'panel-body'+uuid,type,langcode,g_edit,uuid);
			}
		}
	}
};


//==================================================
UIFactory["Node"].displayStandard = function(root,dest,depth,langcode,edit,inline,backgroundParent)
//==================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
	var menu = true;
	//---------------------------------------
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");
//	var proxy_target = false;

	var node = UICom.structure["ui"][uuid];
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	var contentfreenode = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	//-------------------- test if visible
	if ( (display=='N' && (g_userrole=='designer'  || USER.admin)) || (display=='Y' && ( seenoderoles.indexOf(g_userrole)>-1 || (showtoroles.indexOf(g_userrole)>-1 && !privatevalue) || !privatevalue || g_userrole=='designer')) ) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.indexOf(g_userrole)>-1) || (g_userrole=='designer'  || USER.admin)) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userrole=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.indexOf(g_userrole)>-1 || (showtoroles.indexOf(g_userrole)>-1 && !privatevalue) || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var parent = proxies_parent[uuid];
					if (parent==dest.substring(8) || dest=='contenu') { // dest = content_{parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].indexOf(g_userrole)>-1 || g_userrole=='designer');
					}
			}
			//---------------------------------------------------------
			var html = "<div class='"+name+" "+semtag+" ";
			if(UICom.structure["ui"][uuid].resource!=null)
				html += UICom.structure["ui"][uuid].resource.type;
			html += "'";
			//-------------- css attribute -----------
			var metadataepm = $(node.metadataepm);
	//		if (proxy_target)
	//			metadataepm = UICom.structure["ui"][proxies_nodeid["proxy-"+semtag]].metadataepm;
			var style = "";
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
			if (style.length>0)
				html += " style='"+style+"' ";
			//----------------------------------
			html += ">";
			//----------------------------
			if (name == "asmContext"){
				html += "<div class='row'>";
				//-------------- node -----------------------------
				html += "<div class='col-md-9' style='padding-top:6px;" + backgroundParent + "'>";
				html += "<div class='row'>";
				html += "<div id='std_node_"+uuid+"' class='col-md-3' ";
				style = "style='";
				style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
				style +="'";
				html += style;
				html += ">";
				html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				html += "</div><!-- col-md-3 label of resource -->";
				//-------------- resource -------------------------
				if (g_designerrole) {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
				}
				if (g_userrole=='designer') {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (g_userrole=='designer')? true : false;
				}
				if (edit && inline && writenode && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL'){
					html += "<div id='std_resource_"+uuid+"' class='col-md-9'>";
					//-----------------------
					if(UICom.structure["ui"][uuid].resource!=null) {
						try {
							var test = UICom.structure["ui"][uuid].resource.getEditor();
							html += "<span id='get_editor_"+uuid+"'></span>";
						}
						catch(e) {
							html += "<span id='display_editor_"+uuid+"'></span>";
						}
					} else {
						html = UICom.structure["ui"][uuid].getEditor();
						$("#edit-window-body-node").html($(html));
					}
					html += "</div><!-- col-md-9 resource -->";
				} else {
						if (g_display_type=='standard') {
							html += "<div id='std_resource_"+uuid+"' class='col-md-9' ";
							style = "style='";
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-weight',false);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-text-align',false);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-size',true);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
							style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
							style +="'";
							html += style;
							html += ">";
						}
						if (g_display_type=='header')
							html += "<div id='std_resource_"+uuid+"' class='col-md-9'>";
						if (node.resource.type!='Dashboard' || g_userrole=='designer')
							html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
						html += "</div><!-- col-md-9 resource -->";
				}
				html += "</div><!-- inner row -->";
				//-------------- context -------------------------
				html += "<div class='row'><div class='col-md-3'></div><div class='col-md-9'><div id='comments_"+uuid+"' class='comments'></div><!-- comments --></div><!-- col-md-7 --><div class='col-md-2'></div></div><!-- row -->";

				//-------------- metainfo -------------------------
				if (g_edit && (g_userrole=='designer' || USER.admin)) {
					html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				}
				//--------------------------------------------------
				html += "</div><!-- col-md-9 -->";
				//-------------- buttons --------------------------
				html += "<div id='buttons-"+uuid+"' class='col-md-3'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
				html += "</div><!-- col-md-3 buttons -->";
				html += "</div><!-- outer row -->";
				//--------------------------------------------------
			}
			else { // other than asmContext
				//----------------------------
				if (name=='asmUnitStructure')
					depth=100;	
//				html += "<div ";
				style = "";
				if (depth>0) {
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
				} else {
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-size',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-weight',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-text-align',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-background-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-othercss',false);
				}
//				html +=" style='"+style+"'";
//				html += "><div class='row'>";
				html += "<div class='row'>";
	
				//-------------- node -----------------------------
				if (depth!=1 && depth<10 && name=='asmStructure') {
					if (g_display_type=='standard')
//						html += "<div id='prt_node_"+uuid+"' class='col-md-9'>";
						html += "<div id='prt_node_"+uuid+"' class='col-md-9' style='padding-top:10px;"+style+"'>";
					if (g_display_type=='header')
						html += "<div id='prt_node_"+uuid+"' class='col-md-9'>";
					html += "<a href='#' onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>";
					}
				else if (depth!=1 && depth<10 && name=='asmUnit') {
					if (g_display_type=='standard')
//						html += "<div id='prt_node_"+uuid+"' class='col-md-9'>";
						html += "<div id='prt_node_"+uuid+"' class='col-md-9' style='padding-top:6px;"+style+"'>";
					if (g_display_type=='header')
						html += "<div id='prt_node_"+uuid+"' class='col-md-9'>";
					html += "<a href='#' onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
					}
				else {
					if (g_display_type=='standard')
//						html += "<div id='std_node_"+uuid+"' class='col-md-9'>";
						html += "<div id='std_node_"+uuid+"' class='col-md-9' style='padding-top:6px;"+style+"'>";
					if (g_display_type=='header') {
						html += "<div id='std_node_"+uuid+"' class='col-md-9'";
						if (g_userrole!='designer' && semtag=='header')
							html += " style='display:none'";
						html += ">";
					}
					html += " "+UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				}				
				//-------------- context -------------------------
				html += "<div class='row'><div class='col-md-3'></div><div class='col-md-9'><div id='comments_"+uuid+"' class='comments'></div><!-- comments --></div><!-- col-md-7 --><div class='col-md-2'></div></div><!-- row -->";
				//-------------- metainfo -------------------------
				if (g_edit && (g_userrole=='designer' || USER.admin)) {
					html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				}
				html += "</div><!-- col-md-9 -->";
				//-------------- buttons --------------------------
				html += "<div id='buttons-"+uuid+"' class='col-md-3'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu)+"</div>";
				//--------------------------------------------------
				html += "</div><!-- row -->";
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					html += "<div id='content-"+uuid+"' ";
					style = "position:relative;";
//					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
					html +=" style='"+style+"'";
					html += "></div>";
				}
			}
			html += "</div><!-- name -->";
			//------------------------------------------
			$("#"+dest).append($(html));
			//--------------------set editor------------------------------------------
			if ($("#display_editor_"+uuid).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid);
			}
			if ($("#get_editor_"+uuid).length>0) {
				$("#get_editor_"+uuid).append(UICom.structure["ui"][uuid].resource.getEditor());
			}
			//----------- Comments -----------
			if (!inline)
				UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
			else
				UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				var attr_help = $($("metadata-wad",data)[0]).attr('help');
				var helps = attr_help.split("/"); // lang1/lang2/...
				var help_text = helps[langcode];  
				var help =  " <a href='javascript://'  data-toggle='popover' class='popinfo'><i class='icon-info-sign'></i></a> ";
				$("#help_"+uuid).html(help);
				$(".popinfo").popover({ 
				    placement : 'right',
				    container : 'body',
				    title:karutaStr[LANG]['help-label'],
				    html : true,
				    content: help_text
				    })
				    .click(function(e) {
				});
			}
			//---------- video ------------------
			if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			// -------------- display metainfo
			if (g_userrole=='designer' || USER.admin) {  
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
			//------------ Dashboard -----------------
			if (name == "asmContext" && node.resource.type=='Dashboard') {
				$("#"+dest).append($("<div id='dashboard_"+uuid+"' class='createreport'></div>"));
				var model_code = UICom.structure["ui"][uuid].resource.getView();
				if (g_dashboard_models[model_code]!=null && g_dashboard_models[model_code]!=undefined)
					processPortfolio(0,g_dashboard_models[model_code],"dashboard_"+uuid,g_portfolio_current,0);
				else
					g_dashboard_models[model_code] = getModelAndPortfolio(model_code,g_portfolio_current,"dashboard_"+uuid);
//				processPortfolio(0,data,,"dashboard_"+uuid,g_portfolio_current,0);
			}
			// ---------------------------- For each child ----------------------
			var backgroundParent = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);

			for( var i=0; i<root.children.length; ++i ) {
				// Recurse
				var child = UICom.structure["tree"][root.children[i]];
				var childnode = UICom.structure["ui"][root.children[i]];

				//-------------------
				var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
				if (contentfreenode == 'Y' || freenode == 'Y')
					UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
				else
					UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent);
			}
			//------------- javascript dashboard --------------------
			if (depth>1 && $($("metadata",data)[0]).attr('semantictag')!=undefined) {
				var semtag =  $($("metadata",data)[0]).attr('semantictag');
				if (semtag.indexOf('dashboard')>-1){
					var dashboard_function = $($("metadata",data)[0]).attr('semantictag').substring(10)+"(UICom.root.node,'content-'+uuid)";
					$("#"+dest).append(eval(dashboard_function));
					$(".popinfo").popover({ 
					    placement : 'bottom',
					    html : true
					});
				}
			}
			//----------------------------
			$('input[name="datepicker"]').datepicker({format: 'yyyy/mm/dd'});
			$('a[data-toggle=tooltip]').tooltip({html:true});
			//----------------------------
			var multilingual_resource = ($("metadata",data).attr('multilingual-resource')=='Y') ? true : false;
			if (!multilingual_resource)
				$("#embed"+uuid+NONMULTILANGCODE).oembed();
			else
				$("#embed"+uuid+langcode).oembed();
			//----------------------------
		}
	} //---- end of private
};


//==================================================
UIFactory["Node"].displayFree = function(root, dest, depth,langcode,edit,inline)
//==================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
	var menu = true;
	//---------------------------------------
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");
	var proxy_target = false;

	var node = UICom.structure["ui"][uuid];
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'':$(node.metadatawad).attr('delnoderoles');
	var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var graphicerroles = ($(node.metadatawad).attr('graphicerroles')==undefined)?'':$(node.metadatawad).attr('graphicerroles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	var contentfreenode = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	if ((display=='N' && g_userrole=='designer') || (display=='Y' && (((seenoderoles.indexOf(g_userrole)>-1 || showtoroles.indexOf(g_userrole)>-1) && privatevalue) || !privatevalue || g_userrole=='designer'))) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.indexOf(g_userrole)>-1) || g_userrole=='designer') {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userrole=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.indexOf(g_userrole)>-1 || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit["proxy-"+semtag]!=undefined) {
					var parent = proxies_parent["proxy-"+semtag];
					if (parent==dest.substring(8)) { // dest = content_{parentid}
						proxy_target = true;
						edit = menu = (proxies_edit["proxy-"+semtag].indexOf(g_userrole)>-1);
					}
			}
			//---------------------------------------------------------	//---------------------------------------------------------
			var html = "";
			html += "<div id='free_"+uuid+"' uuid='"+uuid+"' ";
			if (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || graphicerroles.indexOf(this.userrole)>-1) {
				html += "draggable='yes' ";
				html += "class='movable ";
			}
			else
				html += "class='";
			html += name+" "+semtag+"' ";
			//--------- style --------------
			var style ="position:absolute;";
			var metadataepm = $(node.metadataepm);
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'top',true);
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'left',true);
			html += " style='"+style+"' ";
			//------------------------
			html += ">";
			if (depth>0)
				style = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
			else
				style = UIFactory["Node"].displayMetadataEpm(metadataepm,'parent-background-color',false);
				
			if (name == "asmUnitStructure" || UICom.structure["ui"][uuid].resource_type=='TextField' || UICom.structure["ui"][uuid].resource_type=='Document' || UICom.structure["ui"][uuid].resource_type=='URL') {
				style += UIFactory["Node"].displayMetadataEpm(metadataepm,'width',true);
				style += UIFactory["Node"].displayMetadataEpm(metadataepm,'height',true);
				style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'othercss');
			}
			if (name == "asmContext" && node.resource.type!='Proxy') {
				if (proxy_target)
					metadataepm = UICom.structure["ui"][proxies_nodeid["proxy-"+semtag]].metadataepm;
			}
			//------------------- Toolbar and Buttons --------------------------
			if (edit && (!inline || g_userrole=='designer')) {
				html += "<div class='free-toolbar'>";
				html += "<button class='btn btn-xs free-toolbar-menu' id='free-toolbar-menu-"+uuid+"'><span class='glyphicon glyphicon-menu-hamburger'></span></button>";
				html += "<div id='toolbar-"+uuid+"' class='free-toolbar-buttons'>";
				html += "	<div id='buttons-"+uuid+"'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu)+"</div>";
				html += "</div>";
				html += "</div>";
			}
			html += "<div style='"+style+"'>";
			//-------------------------------------------------------------------
			if (name == "asmContext") {
				//-------------- resource -------------------------
				if (g_designerrole) {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
				}
				if (g_userrole=='designer') {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (g_userrole=='designer')? true : false;
				}
				if (edit && inline && writenode){
					html += "<div id='std_resource_"+uuid+"' ";
					if (g_userrole=='designer') {
						html += " style='border:1px dashed lightgrey' ";
						
					}
					html += ">";
					//-----------------------
					if(UICom.structure["ui"][uuid].resource!=null) {
						if (UICom.structure["ui"][uuid].getView()!='')
							html += UICom.structure["ui"][uuid].getLabel()+"&nbsp;";
						try {
							UICom.structure["ui"][uuid].resource.getEditor(); // test if getEditor() exists
							html += "<span id='get_editor_"+uuid+"'></span>";
						}
						catch(e) {
							html += "<span id='display_editor_"+uuid+"'></span>";
						}
					} else {
						html = UICom.structure["ui"][uuid].getEditor();
						$("#edit-window-body-node").html($(html));
					}
					html += "</div>";
				} else {
					html += "<div class='free-context'>";
					//----------node label ----------------------------
					if (UICom.structure["ui"][uuid].getLabel()!='<span></span>') {
						html += "<span ";
						style = "";
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
						style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
						style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'othercss');
						html += "style='"+style+"'";
						html+=">";
						//-----------------
						html += UICom.structure["ui"][uuid].getLabel()+"&nbsp;";
						//-----------------
						html+="</span>";
					}
					//--------------------------------------
//					if (UICom.structure["ui"][uuid].resource_type!='Audio' && UICom.structure["ui"][uuid].resource_type!='Video' && UICom.structure["ui"][uuid].resource.getView()=='') // resource is empty
//						html += "<span style='z-index:-5;color:lightgrey'>"+UICom.structure["ui"][uuid].resource_type+"</span>";
					//----------------- resource ---------------------
					html += "<div  id='std_resource_"+uuid+"' uuid='"+uuid+"' class='resource-"+node.resource.type+"' ";
					style = "";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-size',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-weight',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-text-align',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
					style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'node-othercss');
					html += "style='"+style+"'";
					html+=">";
					//-----------------
					var res_type = UICom.structure["ui"][uuid].resource.type;
					if (res_type=='Document' || res_type=='URL')
						html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid,'free-positioning');
					else
						html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
					//-----------------
					html+="</div>";
					//--------------------------------------
					html += "</div>";
					html += "</div>";
				}
			}
			else {
				//-------------- node -----------------------------
				html += "<div ";
				style = "";
				if (depth>0) {
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
				} else {
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-padding-top',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-size',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-weight',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-text-align',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-background-color',false);
					style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'inparent-othercss',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'width',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'height',true);
				}
				html +=" style='"+style+"'";
				html += ">";
				if (depth==0 && name=='asmStructure'){
					html += "<a id='std_node_"+uuid+"' href='#' onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\"";
					style = "";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-color',false);
					html +=" style='"+style+"' ";
					html += ">"+UICom.structure["ui"][uuid].getLabel('std_node_'+uuid,'span')+"</a>";
				} 
				else if (depth!=1 && depth<10 && name=='asmUnit')
					html += "<a id='std_node_"+uuid+"' href='#' onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getView('std_node_'+uuid)+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
				else
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				//-------------- metainfo -------------------------
				if (g_userrole=='designer' || USER.admin) {
					html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				}
				//----------------------------
				html += "</div>";
				html += "<div id='context-"+uuid+"'></div>";
				//--------------------------------------------------*/
				html += "<div id='content-"+uuid+"'></div>";
			}
			html += "<div id='context-"+uuid+"'></div>";
			html += "</div><!-- name -->";
			$("#"+dest).append(html);
			if ($("#display_editor_"+uuid).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid);
			}
			if ($("#get_editor_"+uuid).length>0) {
				$("#get_editor_"+uuid).append(UICom.structure["ui"][uuid].resource.getEditor());
			}
			//----------- Context -----------
			if (!inline)
				UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
			else
				UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				var attr_help = $($("metadata-wad",data)[0]).attr('help');
				var helps = attr_help.split("/"); // lang1/lang2/...
				var help_text = helps[langcode];  
				var help =  " <a href='#'  data-toggle='popover' class='popinfo'><i class='icon-info-sign'></i></a> ";
				$("#help_"+uuid).html(help);
				$(".popinfo").popover({ 
				    placement : 'right',
				    container : 'body',
				    title:karutaStr[LANG]['help-label'],
				    html : true,
				    content: help_text
				    })
				    .click(function(e) {
				});
			}
			//-----------------------------
			if (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || graphicerroles.indexOf(this.userrole)>-1) {
				//-------------------------------
				$("#free_"+uuid).draggable({
					stop: function(){UIFactory["Node"].updatePosition(this);}
				}
				);
				if (UICom.structure["ui"][uuid].resource_type=='Image')
					$("#std_resource_"+uuid).resizable({
						aspectRatio:true,
						stop: function(){UIFactory["Node"].updateSize(this);}
					}
					);
				if (UICom.structure["ui"][uuid].resource_type=='TextField' || UICom.structure["ui"][uuid].resource_type=='Document' || UICom.structure["ui"][uuid].resource_type=='URL')
					$("#std_resource_"+uuid).resizable({
						stop: function(){UIFactory["Node"].updateSize(this);}
					}
					);
				if (name!='asmContext')
					$("#free_"+uuid).resizable({
						stop: function(){UIFactory["Node"].updateSize(this);}
					}
					);
			}
			if (edit &&  (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || delnoderoles.indexOf(g_userrole)>-1 || editresroles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(g_userrole)>-1 || delnoderoles.indexOf(this.userrole)>-1 || editresroles.indexOf(this.userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1)) {
				//-------------------------------
				if (!inline) {
					if ($("#std_resource_"+uuid).attr('style')!=null && $("#std_resource_"+uuid).attr('style').indexOf('border')<0)
						if (name!='asmContext')
							$("#free_"+uuid).css('border','1px dashed lightgrey');
						else
							if (UICom.structure["ui"][uuid].resource_type=='Document' || UICom.structure["ui"][uuid].resource_type=='URL')
								$("#std_resource_"+uuid).css('border','1px solid lightgrey');
							else
								$("#std_resource_"+uuid).css('border','1px dashed lightgrey');
				}
				//-------------------------------
				$("#free-toolbar-menu-"+uuid).click(function(){
					if ($('#toolbar-'+uuid).css('visibility')=='hidden')
						$('#toolbar-'+uuid).css('visibility','visible');
					else
						$('#toolbar-'+uuid).css('visibility','hidden');
				});
			}
			//----------------------------
			if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			if (g_userrole=='designer' || USER.admin) {  //display metainfo
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
		
			/// For each child
			for( var i=0; i<root.children.length; ++i ) 
			{
				// Recurse
				var child = UICom.structure["tree"][root.children[i]];
				var childnode = UICom.structure["ui"][root.children[i]];
				var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
				if (contentfreenode == 'Y' || freenode == 'Y')
					UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
				else
					UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline);
			}
			//----------------------------
			$('input[name="datepicker"]').datepicker({format: 'yyyy/mm/dd'});
			$('a[data-toggle=tooltip]').tooltip({html:true});
			//----------------------------
			var multilingual_resource = ($("metadata",data).attr('multilingual-resource')=='Y') ? true : false;
			if (!multilingual_resource)
				$("#embed"+uuid+NONMULTILANGCODE).oembed();
			else
				$("#embed"+uuid+langcode).oembed();
			//----------------------------
		}
	} //---- end of private - no display
};

//==================================================
UIFactory["Node"].displayTranslate = function(root,dest,depth)
//==================================================
{
	//---------------------
	// Base info
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");

	var node = UICom.structure["ui"][uuid];
	var multilingual_node = ($("metadata",data).attr('multilingual-node')=='Y') ? true : false;
	var multilingual_resource = ($("metadata",data).attr('multilingual-resource')=='Y') ? true : false;

	//----------------------------------
	if( depth < 0) return;
		//----------------------------------
		var html = "<div class='translate "+name+"'>";
		//----------------------------
		if (name == "asmContext"){
			html += "<div class='row'  style='padding-top:5px;padding-bottom:5px;border:1px dashed lightgrey'>";
			//-------------- node -----------------------------
			html += "<div id='trs_node_"+uuid+"' class='span4'>";
			if (multilingual_node)
				for (var lang=0; lang<languages.length;lang++) {
					html += "<div><label><span class='lang'>"+karutaStr[languages[lang]]['label']+"</span>&nbsp;";
					html += " <span id='get_nodeeditor_"+uuid+languages[lang]+"'></span> </label>";
					html += "</div>";
				}
			else {
				html += "<div><label><span class='lang'>"+karutaStr[LANG]['label']+"</span>&nbsp;";
				html += " <span id='get_nodeeditor_"+uuid+LANG+"'></span> </label>";
				html += "</div>";
			}
				
			html += "</div>";
			//-------------- resource -------------------------
			html += "<div id='trs_resource_"+uuid+"' class='span4' >";
			//-----------------------
			if(UICom.structure["ui"][uuid].resource!=null) {
				if (multilingual_resource)
					for (var lang=0; lang<languages.length;lang++) {
						html += "<div><span class='lang'>"+karutaStr[languages[lang]]['language']+"</span>";
						try {
							var test = UICom.structure["ui"][uuid].resource.getEditor(null,lang);
							html += " <span id='get_editor_"+uuid+languages[lang]+"'></span>";
						}
						catch(e) {
							html += " <span id='display_editor_"+uuid+languages[lang]+"'></span>";
						}
						html += "</div>";
					}
				else{
					try {
						var test = UICom.structure["ui"][uuid].resource.getEditor();
						html += " <span id='get_editor_"+uuid+LANG+"'></span>";
					}
					catch(e) {
						html += " <span id='display_editor_"+uuid+LANG+"'></span>";
					}
					html += "</div>";
				}
			}
			html += "</div>";
			html += "</div><!-- row -->";
		}
		else { // other than asmContext
			html += "<div class='row'  style='padding-top:5px;padding-bottom:5px;border:1px dashed lightgrey'>";
			//-------------- node -----------------------------
			if (depth!=1 && depth<10 && name=='asmStructure') {
				html += "<div id='trs_node_"+uuid+"' class='col-md-7'>";
				html += "<a href='#' onclick=\"displayPage('"+uuid+"',1,'translate','"+LANGCODE+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('trs_node_'+uuid,'span')+"</a>";
				html += "</div>";
			} else if (depth!=1 && depth<10 && name=='asmUnit') {
				html += "<div id='trs_node_"+uuid+"' class='col-md-7'>";
				html += "<a href='#' onclick=\"displayPage('"+uuid+"',100,'translate','"+LANGCODE+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('trs_node_'+uuid,'span')+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
				html += "</div>";
			} else {
				html += "<div id='trs_node_"+uuid+"' class='span4'>";
				if (multilingual_node)
					for (var lang=0; lang<languages.length;lang++) {
						html += "<div><label><span class='lang'>"+karutaStr[languages[lang]]['label']+"</span>&nbsp;";
						html += " <span id='get_nodeeditor_"+uuid+languages[lang]+"'></span> </label>";
						html += "</div>";
					}
				else {
					html += "<div><label><span class='lang'>"+karutaStr[LANG]['label']+"</span>&nbsp;";
					html += " <span id='get_nodeeditor_"+uuid+LANG+"'></span> </label>";
					html += "</div>";
				}
					
				html += "</div>";
			}
			//----------------------------
			html += "</div><!-- row -->";
			//--------------------------------------------------*/
			html += "<div id='content-"+uuid+"'style='position:relative'></div>";
		}
		html += "</div><!-- name -->";
		$("#"+dest).append(html);
		for (var lang=0; lang<languages.length;lang++) {
			if ($("#get_nodeeditor_"+uuid+languages[lang]).length>0) {
				$("#get_nodeeditor_"+uuid+languages[lang]).append(UICom.structure["ui"][uuid].getNodeLabelEditor(null,lang));
			}
			if ($("#display_editor_"+uuid+languages[lang]).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid+languages[lang],null,lang);
			}
			if ($("#get_editor_"+uuid+languages[lang]).length>0) {
				$("#get_editor_"+uuid+languages[lang]).append(UICom.structure["ui"][uuid].resource.getEditor(null,lang));
			}
		}
		//----------------------------
		if (name=='asmUnitStructure')
			depth=100;	
		// ---------------------------- For each child 
		for( var i=0; i<root.children.length; ++i ) {
			// Recurse
			var child = UICom.structure["tree"][root.children[i]];
			var childnode = UICom.structure["ui"][root.children[i]];
			UIFactory["Node"].displayTranslate(child, 'content-'+uuid, depth-1);
		}
		//----------------------------
		$('input[name="datepicker"]').datepicker({format: 'yyyy/mm/dd'});
		$('a[data-toggle=tooltip]').tooltip({html:true});
		$('a.popinfo').popover({ 
		    placement : 'right',
		    html : true
		    })
		    .click(function(e) {
		});
};

//==================================================
UIFactory["Node"].displayModel = function(root,dest,depth,langcode,edit,inline)
//==================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
	//---------------------------------------
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");
//	var proxy_target = false;

	var node = UICom.structure["ui"][uuid];
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	//-------------------- test if visible
	if ((display=='N' && g_userrole=='designer') || (display=='Y' && (((seenoderoles.indexOf(g_userrole)>-1 || showtoroles.indexOf(g_userrole)>-1) && privatevalue) || !privatevalue || g_userrole=='designer'))) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.indexOf(g_userrole)>-1) || g_userrole=='designer') {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userrole=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.indexOf(g_userrole)>-1 || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//---------------------------------------------------------
			var html = "<div class='"+name+" "+semtag+" ";
			if(UICom.structure["ui"][uuid].resource!=null)
				html += UICom.structure["ui"][uuid].resource.type;
			html += "'";
			//-------------- css attribute -----------
			var metadataepm = $(node.metadataepm);
			var style = "";
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
			if (style.length>0)
				html += " style='"+style+"' ";
			//----------------------------------
			html += ">";
			//----------------------------
			if (name == "asmContext"){
				if (g_designerrole) {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
				}
				if (g_userrole=='designer' || USER.admin) {
					writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
					if (!writenode)
						writenode = (g_userrole=='designer')? true : false;
				}
				//---------------------------
				if (semtag=="ref" || semtag=="semtag" || semtag=="nodetype" || semtag=="todisplay" || semtag=="aggregatetype" || semtag=="aggregationselect") {
//					if (semtag=="nodetype" && $($("metadata",$(data).parent())[0]).attr('semantictag')=='for-each-node')
//						html += "<div class='row'>";						
					html += "<div id='std_resource_"+uuid+"' class='col-md-2'>";
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
					//-----------------------
					if(UICom.structure["ui"][uuid].resource!=null) {
						try {
							var test = UICom.structure["ui"][uuid].resource.getEditor();
							html += "<span id='get_editor_"+uuid+"'></span>";
						}
						catch(e) {
							html += "<span id='display_editor_"+uuid+"'></span>";
						}
					} else {
						html = UICom.structure["ui"][uuid].getEditor();
						$("#edit-window-body-node").html($(html));
					}
					html += "</div>";
				} else {
					html += "<div class='row'>";
					//-------------- node -----------------------------
					html += "<div id='std_node_"+uuid+"' class='col-md-1' ";
					style = "style='";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
					style +="'";
					html += style;
					html += ">";
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
					html += "</div>";
					//-------------- resource -------------------------
					if (edit && inline && writenode && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL'){
						html += "<div id='std_resource_"+uuid+"' class='col-md-5'>";
						//-----------------------
						if(UICom.structure["ui"][uuid].resource!=null) {
							try {
								var test = UICom.structure["ui"][uuid].resource.getEditor();
								html += "<span id='get_editor_"+uuid+"'></span>";
							}
							catch(e) {
								html += "<span id='display_editor_"+uuid+"'></span>";
							}
						} else {
							html = UICom.structure["ui"][uuid].getEditor();
							$("#edit-window-body-node").html($(html));
						}
						html += "</div>";
					} else {
								html += "<div id='std_resource_"+uuid+"' class='col-md-5' ";
								style = "style='";
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-weight',false);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-text-align',false);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-size',true);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
								style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
								style +="'";
								html += style;
								html += ">";
							html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
							html += "</div>";
					}
					//-------------- buttons --------------------------
					html += "<div id='buttons-"+uuid+"' class='col-md-2'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
					//--------------------------------------------------
					html += "</div><!-- row -->";
					//--------------------------------------------------
				}
			}
			else { // other than asmContext
				//----------------------------
				if (name=='asmUnitStructure')
					depth=100;	
				html += "<div>";
				html += "<div class='model_row'>";	
				//-------------- buttons --------------------------
				html += "<div id='buttons-"+uuid+"' class='model_button'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
				//-------------- node -----------------------------
				html += "<div id='std_node_"+uuid+"'  class='model_node'>";
				html += " "+UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				html += "</div>";
				//--------------------------------------------------
				html += "</div><!-- row -->";
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					if (semtag=="asmNop" || semtag=="node_resource" || semtag=="aggregate")
						html += "<div id='content-"+uuid+"' class='row'></div>";
					else
						html += "<div id='content-"+uuid+"' class='model-content'></div>";
				}
			}
			html += "</div><!-- name -->";
			//------------------------------------------
			$("#"+dest).append($(html));
			//--------------------set editor------------------------------------------
			if ($("#display_editor_"+uuid).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid);
			}
			if ($("#get_editor_"+uuid).length>0) {
				$("#get_editor_"+uuid).append(UICom.structure["ui"][uuid].resource.getEditor());
			}
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				var attr_help = $($("metadata-wad",data)[0]).attr('help');
				var helps = attr_help.split("/"); // lang1/lang2/...
				var help_text = helps[langcode];  
				var help =  " <a href='javascript://'  data-toggle='popover' class='popinfo'><i class='icon-info-sign'></i></a> ";
				$("#help_"+uuid).html(help);
				$(".popinfo").popover({ 
				    placement : 'right',
				    container : 'body',
				    title:karutaStr[LANG]['help-label'],
				    html : true,
				    content: help_text
				    })
				    .click(function(e) {
				});
			}
			
				for( var i=0; i<root.children.length; ++i ) {
					// Recurse
					var child = UICom.structure["tree"][root.children[i]];
					//-------------------
						UIFactory["Node"].displayModel(child, 'content-'+uuid, depth-1,langcode,edit,inline);
				}
			
			//----------------------------
			$('a[data-toggle=tooltip]').tooltip({html:true});
			//----------------------------
		}
	} //---- end of private
};

//========================================================
UIFactory["Node"].updateIpadPosition = function (obj,top,left)
//========================================================
{
	var nodeid = obj.getAttribute("uuid");
    var offset = $(obj).offset();
    alert(top+"-"+left+"/"+offset.top+"-"+offset.left);
	UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'top',top);
	UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'left',left);
};

//========================================================
UIFactory["Node"].updatePosition = function (obj)
//========================================================
{
	var nodeid = obj.getAttribute("uuid");
    var pos = $(obj).position();
    var top = pos.top;
    var left = pos.left;
	UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'top',top);
	UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'left',left);
};

//========================================================
UIFactory["Node"].updateSize = function (obj)
//========================================================
{
	var nodeid = obj.getAttribute("uuid");
	if (nodeid==undefined)
		nodeid = obj.parentNode.parentNode.getAttribute("uuid");
	var width = obj.style.width;
	var height = obj.style.height;
	if (UICom.structure["ui"][nodeid].resource_type=='Image'){
		UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'width',width);
		UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'height',height);
		UICom.structure["ui"][nodeid].resource.refresh();
		$("#std_resource_"+nodeid).resizable({
			stop: function(){UIFactory["Node"].updateSize(obj);}
		}
		);
	}
	else {
		UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'width',width);
		UIFactory["Node"].updateMetadataEpmAttribute(nodeid,'height',height);
	}
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- COMMENTS -------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].displayComments = function(destid,node,type,langcode)
//==================================================
{
	var html = "";
	var seenoderoles = $(node.metadatawad).attr('seenoderoles');
	if (seenoderoles==undefined)
		seenoderoles = "all";
	if (seenoderoles!="" && (seenoderoles.indexOf("all")>-1 || USER.admin || g_userrole=='designer' || seenoderoles.indexOf(g_userrole)>-1 || seenoderoles.indexOf(this.userrole)>-1)) {
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		var multilingual = ($(node.metadata).attr('multilingual-node')=='Y') ? true : false;
		if (!multilingual)
			langcode = NONMULTILANGCODE;
		//---------------------
		var uuid = node.id;
		var text = "";
		if (type==null)
			type = 'default';
		text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).text();
		html += "<div>"+text+"</div>";
		$("#"+destid).append($(html));
	}
};

//==================================================
UIFactory["Node"].displayCommentsEditor = function(destid,node,type,langcode)
//==================================================
{
	var html = "";
	var commentnoderoles = $(node.metadatawad).attr('commentnoderoles');
	if (commentnoderoles==undefined)
		commentnoderoles = "";
	if (commentnoderoles!="" && (USER.admin || g_userrole=='designer' || commentnoderoles.indexOf(g_userrole)>-1 || commentnoderoles.indexOf(this.userrole)>-1)) {
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		var multilingual = ($(node.metadata).attr('multilingual-node')=='Y') ? true : false;
		if (!multilingual)
			langcode = NONMULTILANGCODE;
		//---------------------
		var uuid = node.id;
		var text = "";
		if (type==null)
			type = 'default';
		text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).text();
		html += "<h4>"+karutaStr[LANG]['comments']+"</h4>";
		html += "<div id='div_"+uuid+"'><textarea id='"+uuid+"_edit_comment' class='form-control' style='height:200px'>"+text+"</textarea></div>";
		$("#"+destid).append($(html));
		$("#"+uuid+"_edit_comment").wysihtml5({toolbar:{"size":"xs","font-styles": false,"html": true,"blockquote": false,"image": false},'uuid':uuid,locale:lang,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].updateComments();},'focus': function(){currentTexfieldUuid=uuid;} }});
	}
};

//==================================
UIFactory["Node"].prototype.updateComments = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var value = $.trim($("#"+this.id+"_edit_comment").val());
	$(this.context_text_node[langcode]).html($.parseHTML(value));
	this.save();
	writeSaved(this.id);
};


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- MOVE NODES -----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory['Node'].upNode = function(nodeid)
//==================================================
{
	$.ajax({
		type : "POST",
		dataType : "text",
		url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/moveup",
		success : function(data) {
			UIFactory.Node.reloadUnit();
			$("#edit-window").modal('hide');	
		},
		error : function(jqxhr,textStatus) {
			alert("Move "+textStatus+" : "+jqxhr.responseText);
		}
	});
};

//==================================================
UIFactory['Node'].moveNode = function(nodeid)
//==================================================
{
	var option = $("select",$("#edit-window-body")).find("option:selected");
	var parentid = $(option).attr('uuid');
	if (parent !=undefined)
		$.ajax({
			type : "POST",
			dataType : "text",
			url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/parentof/"+parentid,
			success : function(data) {
				UIFactory.Node.reloadUnit();
				$("#edit-window").modal('hide');	
			},
			error : function(jqxhr,textStatus) {
				alert("Move "+textStatus+" : "+jqxhr.responseText);
			}
		});
};

//===========================================
UIFactory["Node"].selectNode = function(nodeid,node)
//===========================================
{
	//---------------------
	var langcode = LANGCODE;
	//---------------------
	$("#edit-window-body-node").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	$("#edit-window-title").html("&nbsp;");
	//-----------------------------
	if (UICom.structure.ui[nodeid].asmtype=='asmContext')
		$("#edit-window-type").html(UICom.structure.ui[nodeid].resource.type);
	else
		$("#edit-window-type").html(UICom.structure.ui[nodeid].asmtype);
	//-----------------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:UIFactory.Node.moveNode('"+nodeid+"')";
	var footer = "";
	footer += "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['move']+"</button>";
	footer += "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	// ------------------------------
	/// Traverse tree
	var html = "<select class='form-control'>";
	var uuid = $(node.node).attr("id");
	var label = UICom.structure["ui"][uuid].label_node[langcode].text();
	html += "<option uuid = '"+uuid+"'>"+label+"</option>";
	html += UIFactory["Node"].getSubNodes(node, nodeid, UICom.structure.ui[nodeid].asmtype);
	html += "</select>";
	// ------------------------------
	$("#edit-window-body").html($(html));
	// ------------------------------
	$("#edit-window").modal('show');	

};

//===========================================
UIFactory["Node"].getSubNodes = function(root, idmoved, typemoved)
//===========================================
{
	//---------------------
	var langcode = LANGCODE;
	//---------------------
	/// Traverse tree
	var html = "";
	for( var i=0;i<root.children.length;++i )
	{
		var uuid = root.children[i];
		var label = UICom.structure["ui"][uuid].label_node[langcode].text();
		var name = UICom.structure["ui"][uuid].asmtype;
		if (name!='asmContext' && (typemoved != "asmUnit" || name != "asmUnit") && (uuid !=idmoved)){
			html += "<option uuid = '"+uuid+"'>"+label+"</option>";
			html += UIFactory["Node"].getSubNodes(UICom.structure["tree"][uuid], idmoved, typemoved);
		}
	}
	return html;
};





//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------- BUTTONS AND MENUS -------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].getItemMenu = function(parentid,srce,tag,title,databack,callback,param2,param3,param4,freenode)
//==================================================
{	// note: #xxx is to avoid to scroll to the top of the page
//	if (freenode)
//		tag += '_free';
	var html = "<li><a href='#xxx' onclick=\"javascript:importBranch('"+parentid+"','"+srce+"','"+tag+"',"+databack+","+callback+","+param2+","+param3+","+param4+")\">";
	html += title;
	html += "</a></li>";
	return html;
};


//==================================================
UIFactory["Node"].buttons = function(node,type,langcode,inline,depth,edit,menu)
//==================================================
{
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
	if (menu==null)
		menu = true;
	var deletenode = ($(node.node).attr('delete')=='Y')? true:false;
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var submitnode = ($(node.node).attr('submit')=='Y')? true:false;
	var userrole = $(node.node).attr('role');
	if (userrole==undefined || userrole=='')
		userrole = "norole";
	//------------------------
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'none':$(node.metadatawad).attr('editnoderoles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'none':$(node.metadatawad).attr('editresroles');
	var delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'none':$(node.metadatawad).attr('delnoderoles');
	var submitroles = ($(node.metadatawad).attr('submitroles')==undefined)?'none':$(node.metadatawad).attr('submitroles');
	var submitted = ($(node.metadatawad).attr('submitted')==undefined)?'none':$(node.metadatawad).attr('submitted');
	var menuroles = ($(node.metadatawad).attr('menuroles')==undefined)?'none':$(node.metadatawad).attr('menuroles');
	var showroles = ($(node.metadatawad).attr('showroles')==undefined)?'none':$(node.metadatawad).attr('showroles');
	var moveroles = ($(node.metadatawad).attr('moveroles')==undefined)?'none':$(node.metadatawad).attr('moveroles');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	var shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	if (g_designerrole) {
		deletenode = (delnoderoles.indexOf(g_userrole)>-1)? true : false;
		writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
		if (!writenode)
			writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
	}
	//-----------------------------------
	var html = "<div class='btn-group'>";
	//-----------------------------------
	if (edit) {
		//------------ edit button ---------------------
		if ((!inline && (writenode || USER.admin || g_userrole=='designer' )) || (inline && ((USER.admin || g_userrole=='designer') && (editnoderoles.indexOf(g_userrole)<0 && editresroles.indexOf(g_userrole)<0)))) {
			html += "<button class='btn btn-xs' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+node.id+"')\" data-title='Éditer' rel='tooltip'>";
			html += "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>";
			html += "</button>";
		}
		//------------ delete button ---------------------
		if ((deletenode || USER.admin || g_userrole=='designer') && node.asmtype != 'asmRoot') {
			if (node.asmtype == 'asmStructure' || node.asmtype == 'asmUnit') {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",portfolioid,null);
			} else {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadUnit",portfolioid,null);
			}
		}
		//------------- move node buttons ---------------
		if ((moveroles.indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer') && node.asmtype != 'asmRoot') {
			html+= "<button class='btn btn-xs' onclick=\"javascript:UIFactory.Node.upNode('"+node.id+"')\" href='#'><span class='glyphicon glyphicon-arrow-up'></span></button>";
			html+= "<button class='btn btn-xs' onclick=\"javascript:UIFactory.Node.selectNode('"+node.id+"',UICom.root)\" href='#'><span class='glyphicon glyphicon-random'></span></button>";
		}
	}
	//------------- node menus button ---------------
	if (menu) {
		if ((USER.admin || g_userrole=='designer') && (node.asmtype != 'asmContext' && (depth>0 || node.asmtype == 'asmUnitStructure'))) {
			html += "<button class='btn btn-xs menu-xs' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false' ";
/*			if (navigator.userAgent.indexOf('Firefox')>-1)
				html += "style='height:23px;' ";
			if (navigator.userAgent.indexOf('Chrome')>-1 || navigator.userAgent.indexOf('Safari')>-1)
				html += "style='height:24px;' ";
*/			html += "><div class='btn-text'>"+karutaStr[languages[langcode]]['Add']+" <span class='caret'></span></div></button>";
			html += "<ul class='dropdown-menu pull-right'>";
			if (node.asmtype == 'asmRoot' || node.asmtype == 'asmStructure') {
				var databack = false;
				var callback = "UIFactory['Node'].reloadStruct";
				var param2 = "'"+portfolioid+"'";
				var param3 = null;
				var param4 = null;
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','asmStructure','asmStructure',databack,callback,param2,param3,param4);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','asmUnit','asmUnit',databack,callback,param2,param3,param4);
			}
			var databack = false;
			var callback = "UIFactory['Node'].reloadUnit";
			var param2 = "'"+portfolioid+"'";
			var param3 = null;
			var param4 = null;
			var freenodevalue = ($(node.metadatawad).attr('freenode')==undefined)?'':$(node.metadatawad).attr('freenode');
			var contentfreenodevalue = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
			var freenode = ((freenodevalue=='Y')?true:false) || ((contentfreenodevalue=='Y')?true:false);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','asmUnitStructure','asmUnitStructure',databack,callback,param2,param3,param4,freenode);
			html += "<hr>";
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','TextField','TextField',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Field','Field',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Document','Document',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','URL','URL',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Calendar','Calendar',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Image','Image',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Video','Video',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Audio','Audio',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Oembed','Oembed',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Color','Color',databack,callback,param2,param3,param4,freenode);
			if (!freenode) {
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','URL2Unit','URL2Unit',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','SendEmail','SendEmail',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Comments','Comments',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Dashboard','Dashboard',databack,callback,param2,param3,param4,freenode);
				html += "<hr>";
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Item','Item',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Resource','Get_Resource',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Get_Resource','Get_Get_Resource',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Double_Resource','Get_Double_Resource',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Proxy','Proxy',databack,callback,param2,param3,param4,freenode);
				if (appliname=='zonecours')
					html += UIFactory["Node"].getItemMenu(node.id,'_zc_resources_','Person','Person',databack,callback,param2,param3,param4,freenode);
	//			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Proxy','Get_Proxy',databack,callback,param2,param3,param4,freenode);
			}
			html += "</ul>"; // class='dropdown-menu'
		}
	}
	//------------- submit  -------------------
	if (submitroles!='none' && submitroles!='') {
		if ( (submitnode && submitroles.indexOf(g_userrole)>-1) || USER.admin || g_userrole=='designer') {
			html += "<button id='submit-"+node.id+"' class='btn btn-xs menu-xs' onclick=\"javascript:submit('"+node.id+"')\" ";
			html += " ><div class='btn-text'>"+karutaStr[languages[langcode]]['submit']+"</div></button>";
		} else {
			if (submitted=='Y')
	//		html += "<div class='btn-text'>"+karutaStr[languages[langcode]]['submitted']+"</div>";
				html += "<div class='alert alert-success'><strong>"+karutaStr[languages[langcode]]['submitted']+"</strong></div>";
	//			html += "<button class='btn btn-xs menu-xs disabled'><div class='btn-text'>"+karutaStr[languages[langcode]]['submitted']+"</div></button>";
			else
	//			html += "<div class='btn-text'>"+karutaStr[languages[langcode]]['notsubmitted']+"</div>";			
				html += "<div class='alert alert-danger'><strong>"+karutaStr[languages[langcode]]['notsubmitted']+"</strong></div>";			
	//			html += "<button class='btn btn-xs menu-xs disabled'><div class='btn-text'>"+karutaStr[languages[langcode]]['notsubmitted']+"</div></button>";			
		}
	}
	//------------- private button -------------------
	if ((showroles==g_userrole || USER.admin || g_userrole=='designer') && showroles!='none' && showroles!='') {
		if (privatevalue) {
			html += "<button class='btn btn-xs' onclick=\"javascript:show('"+node.id+"')\">";
			html += "<span class='glyphicon glyphicon-eye-close'></span>";
			html += "</button>";
		} else {
			html += "<button class='btn btn-xs' onclick=\"javascript:hide('"+node.id+"')\">";
			html += "<span class='glyphicon glyphicon-eye-open'></span>";
			html += "</button>";				
		}
	}
	//------------- specific menu button ---------------
	if (menu) {
		try {
			if ((depth>0 || node.asmtype == 'asmUnitStructure') && menuroles != undefined && menuroles.length>10 && (menuroles.indexOf(userrole)>-1 || menuroles.indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer') ){
				var menus = [];
				var displayMenu = false;
				var items = menuroles.split(";");
				for (var i=0; i<items.length; i++){
					var subitems = items[i].split(",");
					menus[i] = [];
					if (subitems[0]=="#line") {
						menus[i][0] = subitems[0]; // portfolio code
						menus[i][1] = ""; // semantic tag
						menus[i][2] = ""; // label
						menus[i][3] = ""; // roles
						
					} else {
						menus[i][0] = subitems[0]; // portfolio code
						menus[i][1] = subitems[1]; // semantic tag
						menus[i][2] = subitems[2]; // label
						menus[i][3] = subitems[3]; // roles
					}
					if (menus[i][3].indexOf(userrole)>-1 || menus[i][3].indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer')
						displayMenu = true;  // userrole may be included in semantictag
				}
				if (displayMenu) {
					var databack = false;
					var callback = "UIFactory['Node'].reloadUnit";
					if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' )
						callback = "UIFactory['Node'].reloadStruct";
					var param2 = "'"+portfolioid+"'";
					var param3 = null;
					var param4 = null;
					html += "<div class='btn-group'>";
					//-----------------------
					html += "<button class='btn btn-xs menu-xs dropdown-toggle'  data-toggle='dropdown' href='#' ";
					html += "><div class='btn-text'>Menu <span class='caret'></span></div></button>";
					//-----------------------
					html += "<ul class='dropdown-menu pull-right'>";
					for (var i=0; i<menus.length; i++){
						if (menus[i][0]=="#line") {
							html += "<hr>";
						} else {
							var titles = [];
							var title = "";
							try {
								titles = menus[i][2].split("/");
								title = titles[langcode];  // lang1/lang2/...
							} catch(e){
								title = menus[i][2];
							}
							if (menus[i][3].indexOf(userrole)>-1 || menus[i][3].indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer')
								html += UIFactory["Node"].getItemMenu(node.id,menus[i][0],menus[i][1],title,databack,callback,param2,param3,param4);
						}
					}
					html += "</ul>"; // class='dropdown-menu'
					html += "</div>"; // class='btn-group'
				}
			}
		} catch(e){
			alert('Menu Error: check the format: '+e);
		}
	}
	//------------- share node button ---------------
	if ((shareroles.indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer') && shareroles!='none' && shareroles!='') {
			html+= "<button class='btn btn-xs' onclick=\"javascript:getSendPublicURL('"+node.id+"')\" href='#'><span class='glyphicon glyphicon-share'></span></button>";
	}
	html += "</div>"; // class='btn-group'
	//--------------------------------------------------
	if (html!="")
		html = "<div id='btn-"+node.id+"'>" + html + "</div>";
	return html;
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//---------------------- RELOAD ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory['Node'].reloadStruct = function(uuid)
//==================================================
{
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/" + uuid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
//			$("#"+uuid,g_portfolio_current).replaceWith($(":root",data));
			$("#sidebar").html("");
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.rootid);
			var uuid = $("#page").attr('uuid');
			if (g_display_type=='model')
				displayPage(UICom.rootid,1,"model",LANGCODE,g_edit);
			else
				$("#sidebar_"+uuid).click();
		}
	});
	$.ajaxSetup({async: true});
};

//==================================================
UIFactory['Node'].reloadUnit = function()
//==================================================
{
	var uuid = $("#page").attr('uuid');
	var parentid = $($(UICom.structure["ui"][uuid].node).parent()).attr('id');
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes/node/" + uuid,
		success : function(data) {
			UICom.parseStructure(data,false,parentid);
			$("#"+uuid,g_portfolio_current).replaceWith($(":root",data));
			if (g_display_type=='model')
				displayPage(UICom.rootid,1,"model",LANGCODE,g_edit);
			else
				$("#sidebar_"+uuid).click();
			if ($("#window-page").length>0) {
				var window_uuid = $("#window-page").attr('uuid');
				eval(redisplays[window_uuid]);
			}
		}
	});
	$.ajaxSetup({async: true});
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------- RIGHTS ------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

var roles_by_role = {};

//==================================
var RoleRights = function(node,uuid)
//==================================
{
	this.node = node;
	this.uuid = uuid;
	this.name = $(node).attr('name');
	this.rights = {};
	this.rights['RD'] = $("right",node).attr("RD");
	this.rights['WR'] = $("right",node).attr("WR");
	this.rights['DL'] = $("right",node).attr("DL");
	this.rights['SB'] = $("right",node).attr("SB");
};

//==================================
RoleRights.update = function(rolename,attribute,value,checked)
//==================================
{
	var role = roles_by_role[rolename];
	if (checked!=undefined && !checked)
		value = "N";
	role.rights[attribute] = value;
	RoleRights.save(rolename);
};

//==================================
RoleRights.save = function(rolename)
//==================================
{
	var role = roles_by_role[rolename];
	var xml = "";
	xml += "<node>";
	xml += "<role name='"+role.name+"'>";
	xml += "<right RD='"+role.rights['RD']+"' WR='"+role.rights['WR']+"' DL='"+role.rights['DL']+"' SB='"+role.rights['SB']+"' />";
	xml += "</role>";
	xml += "</node>";
	$.ajax({
		type : "POST",
		dataType : "xml",
		contentType: "application/xml",
		data:xml,
		url : "../../../"+serverBCK+"/nodes/node/"+role.uuid+"/rights"
	});
};


//==================================
RoleRights.prototype.getEditor = function()
//==================================
{
	var html = "";
	html+= "<tr>";
	html+= "<td>"+this.name+"</td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','RD',this.value,this.checked)\" value='Y'";
	if (this.rights['RD']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','WR',this.value,this.checked)\" value='Y'";
	if (this.rights['WR']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','DL',this.value,this.checked)\" value='Y'";
	if (this.rights['DL']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','SB',this.value,this.checked)\" value='Y'";
	if (this.rights['SB']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "</tr>";
	return html;
};

//==================================
UIFactory["Node"].displayRights = function(uuid)
//==================================
{
	var html = "";
	roles_by_role = {};
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes/node/"+uuid+"/rights",
		success : function(data) {
			html += "<table id='rights'>";
			html+= "<tr><td></td><td> Read </td><td> Write </td><td> Delete </td><td> Submit </td>";
			var roles = $("role",data);
			for (var i=0;i<roles.length;i++){
				var rolename = $(roles[i]).attr("name");
				roles_by_role[rolename] = new RoleRights(roles[i],uuid);
			}
			for (role in roles_by_role)
				html += roles_by_role[role].getEditor();
			html += "<table>";
		}
	});
	$.ajaxSetup({async: true});
	return html;
}


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------- METADATA ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].displayMetadataEpm = function(data,attribute,number)
//==================================================
{
	var html = "";
	if (data.attr(attribute)!=undefined && data.attr(attribute)!="") {
		var value = $(data).attr(attribute);
		if (attribute.indexOf("inparent-othercss")>-1)
			html += attribute.substring(17) + value;
		else if (attribute.indexOf("node-othercss")>-1)
			html += attribute.substring(13) + value;
		else if (attribute.indexOf("node-")>-1)
			html += attribute.substring(5) + ":" + value;
		else if (attribute.indexOf("inparent-")>-1)
			html += attribute.substring(9) + ":" + value;
		else
			html += attribute + ":" + value;
		if (attribute.indexOf("font-size")>-1 && number && value.indexOf('%')<0 && value.indexOf('px')<0 && value.indexOf('pt')<0)
			html += 'px';			
		else if (number && value.indexOf('%')<0 && value.indexOf('px')<0 && value.indexOf('pt')<0)
			html += 'px';
		html += ';';
	}	return html;
};

//==================================================
UIFactory["Node"].getOtherMetadataEpm = function(data,attribute)
//==================================================
{
	var html = "";
	if (data.attr(attribute)!=undefined && data.attr(attribute)!="") {
		var value = $(data).attr(attribute);
		html += value;
	}	return html;
};

//==================================================
UIFactory["Node"].getMetadataWadAttribute = function(data,attribute)
//==================================================
{
	return $("metadata-wad",data).attr(attribute);
	
};

//==================================================
UIFactory["Node"].displayMetadataWad = function(data,attribute)
//==================================================
{
	var html = "";
	if ($("metadata-wad",data).attr(attribute)!=undefined && $("metadata-wad",data).attr(attribute)!="")
		html += "<span>"+attribute+":"+$("metadata-wad",data).attr(attribute)+"| </span>";
	return html;
};

//==================================================
UIFactory["Node"].displayMetadata = function(data,attribute)
//==================================================
{
	var html = "";
	if ($("metadata",data).attr(attribute)!=undefined && $("metadata",data).attr(attribute)!="")
		html += "<span>"+attribute+":"+$("metadata",data).attr(attribute)+"| </span>";
	return html;
};

//==================================================
UIFactory["Node"].displayMetainfo = function(destid,data)
//==================================================
{
	var html = "";
	var name = $(data).prop("nodeName");
	if (name=='asmContext') {
		var asmResources = $("asmResource",data);
		name = $(asmResources[2]).attr('xsi_type');
	}
	html += "<span>"+name+" - </span>";
	if ($("metadata",data).attr('semantictag')!=undefined && $("metadata",data).attr('semantictag')!="")
		html += "<span>semantictag:"+$("metadata",data).attr('semantictag')+"| </span>";
//	html += UIFactory["Node"].displayMetadata(data,'public');
	html += UIFactory["Node"].displayMetadataWad(data,'seenoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'editresroles');
	html += UIFactory["Node"].displayMetadataWad(data,'delnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'commentnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'submitroles');
	html += UIFactory["Node"].displayMetadataWad(data,'editnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'query');
	html += UIFactory["Node"].displayMetadataWad(data,'display');
	html += UIFactory["Node"].displayMetadataWad(data,'menuroles');
	html += UIFactory["Node"].displayMetadataWad(data,'notifyroles');
	html += UIFactory["Node"].displayMetadataWad(data,'graphicerroles');
	html += UIFactory["Node"].displayMetadataWad(data,'resizeroles');
	html += UIFactory["Node"].displayMetadataWad(data,'edittargetroles');
	html += UIFactory["Node"].displayMetadataWad(data,'showroles');
	html += UIFactory["Node"].displayMetadataWad(data,'showtoroles');
	html += UIFactory["Node"].displayMetadataWad(data,'moveroles');
	html += UIFactory["Node"].displayMetadataWad(data,'inline');
	$("#"+destid).html(html);
};

//==================================================
UIFactory["Node"].getMetadataAttributesEditor = function(node,type,langcode)
//==================================================
{
	var name = node.asmtype;
	var html = "<div><br>";
	html += "<form id='metadata' class='form-horizontal'>";
	if (name=='asmContext' && node.resource.type=='Proxy')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'semantictag',$(node.metadata).attr('semantictag'),false,true);
	else
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'semantictag',$(node.metadata).attr('semantictag'));
	if (languages.length>1) { // multilingual application
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'multilingual-node',$(node.metadata).attr('multilingual-node'),true);
		if (name=='asmContext') {
			html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'multilingual-resource',$(node.metadata).attr('multilingual-resource'),true);
		}
	}
	if (name=='asmContext') {
		if (node.resource.type=='Field' || node.resource.type=='TextField' || node.resource.type=='Get_Resource' || node.resource.type=='Get_Get_Resource' || node.resource.type=='Get_Double_Resource')
			html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'encrypted',$(node.metadata).attr('encrypted'),true);
	}
	html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'sharedNodeResource',$(node.metadata).attr('sharedNodeResource'),true);
	if (name=='asmContext')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'sharedResource',$(node.metadata).attr('sharedResource'),true);
	if (name=='asmRoot') {
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'cssfile',$(node.metadata).attr('cssfile'));
		html += UIFactory["Node"].getMetadataDisplayTypeAttributeEditor(node.id,'display-type',$(node.metadata).attr('display-type'));
	}
	html += "<hr><h4>Metadata</h4>";
	if (USER.admin)
		html += UIFactory["Node"].displayRights(node.id);
	html += "<hr>";
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'seenoderoles',$(node.metadatawad).attr('seenoderoles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'delnoderoles',$(node.metadatawad).attr('delnoderoles'));
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure')	{
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editresroles',$(node.metadatawad).attr('editresroles'),false,true);
	}
	else
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editresroles',$(node.metadatawad).attr('editresroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'commentnoderoles',$(node.metadatawad).attr('commentnoderoles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'submitroles',$(node.metadatawad).attr('submitroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editnoderoles',$(node.metadatawad).attr('editnoderoles'));
	if (node.resource_type=='Proxy')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'edittargetroles',$(node.metadatawad).attr('edittargetroles'));
	if (name=='asmContext' && node.resource.type=='Image')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'resizeroles',$(node.metadatawad).attr('resizeroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'graphicerroles',$(node.metadatawad).attr('graphicerroles'));
//	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'moveroles',$(node.metadatawad).attr('moveroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showroles',$(node.metadatawad).attr('showroles'));
//	if ($(node.metadatawad).attr('showroles')!='')
//		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'private',$(node.metadatawad).attr('private'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showtoroles',$(node.metadatawad).attr('showtoroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'shareroles',$(node.metadatawad).attr('shareroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editboxtitle',$(node.metadatawad).attr('editboxtitle'));
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'contentfreenode',$(node.metadatawad).attr('contentfreenode'),true);
	if (name!='asmRoot')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'freenode',$(node.metadatawad).attr('freenode'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'display',$(node.metadatawad).attr('display'),true);
	if (name=='asmRoot')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'public',$(node.metadata).attr('public'),true);
	if (name=='asmContext' && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL' && node.resource.type!='Oembed')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'inline',$(node.metadata).attr('inline'),true);
//	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'veriffunction',$(node.metadatawad).attr('veriffunction'));
	html += "<div id='metadata_texts'></div>";
	html += "</form>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].getMetadataEpmAttributesEditor = function(node,type,langcode)
//==================================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var name = node.asmtype;
	var html = "";
	var userrole = $(node.node).attr('role');
	if (userrole==undefined || userrole=='')
		userrole = "norole";
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'none':$(node.metadatawad).attr('editnoderoles');
	var graphicerroles = ($(node.metadatawad).attr('graphicerroles')==undefined)?'none':$(node.metadatawad).attr('graphicerroles');
	if (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || graphicerroles.indexOf(userrole)>-1) {
//		html += "<hr><h4>CSS - Styles</h4>";
		html += "<form id='metadata' class='form-horizontal'>";
		//----------------------------------
		if (USER.admin || g_userrole=='designer' || editnoderoles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(userrole)>-1) {
			html += "<h4>"+karutaStr[languages[langcode]]['label']+"</h4>";
//			html += "<h5>"+karutaStr[languages[langcode]]['label']+"</h5>";
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-weight',$(node.metadataepm).attr('font-weight'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-style',$(node.metadataepm).attr('font-style'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'text-align',$(node.metadataepm).attr('text-align'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-size',$(node.metadataepm).attr('font-size'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'color',$(node.metadataepm).attr('color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'padding-top',$(node.metadataepm).attr('padding-top'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'background-color',$(node.metadataepm).attr('background-color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'othercss',$(node.metadataepm).attr('othercss'));
		}
		//----------------------------------
		if (name=='asmContext') 
			html += "<hr><h4>"+karutaStr[languages[langcode]]['resource']+"</h4>";
//			html += "<h5>"+karutaStr[languages[langcode]]['resource']+"</h5>";
		else
			html += "<hr><h4>"+karutaStr[languages[langcode]]['node']+"</h4>";
//			html += "<h5>"+karutaStr[languages[langcode]]['node']+"</h5>";
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-font-weight',$(node.metadataepm).attr('node-font-weight'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-font-style',$(node.metadataepm).attr('node-font-style'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-text-align',$(node.metadataepm).attr('node-text-align'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-font-size',$(node.metadataepm).attr('node-font-size'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-color',$(node.metadataepm).attr('node-color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-padding-top',$(node.metadataepm).attr('node-padding-top'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-background-color',$(node.metadataepm).attr('node-background-color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'node-othercss',$(node.metadataepm).attr('node-othercss'));
		//----------------------------------
		if (name=='asmStructure' || name=='asmUnit') {
			html += "<hr><h4>"+karutaStr[languages[langcode]]['inparent']+"</h4>";
//			html += "<h5>"+karutaStr[languages[langcode]]['inparent']+"</h5>";
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-font-weight',$(node.metadataepm).attr('inparent-font-weight'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-font-style',$(node.metadataepm).attr('inparent-font-style'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-text-align',$(node.metadataepm).attr('inparent-text-align'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-font-size',$(node.metadataepm).attr('inparent-font-size'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-color',$(node.metadataepm).attr('inparent-color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-padding-top',$(node.metadataepm).attr('inparent-padding-top'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-background-color',$(node.metadataepm).attr('inparent-background-color'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'inparent-othercss',$(node.metadataepm).attr('inparent-othercss'));
		}
		//----------------------------------
		var parent = $(node.node).parent();
		if ($(node.metadatawad).attr('freenode')=='Y' || $("metadata-wad",$(parent)).attr('contentfreenode')=='Y'){
			html += "<hr>";
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'top',$(node.metadataepm).attr('top'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'left',$(node.metadataepm).attr('left'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'width',$(node.metadataepm).attr('width'));
			html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'height',$(node.metadataepm).attr('height'));
		}
		html += "</form>";
	}
	return html;
};

//==================================================
UIFactory["Node"].updateMetadataAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata",node)[0]).attr(attribute,value);
	UICom.UpdateMetadata(nodeid);
	UIFactory["Node"].displayMetainfo('metainfo_'+nodeid,node);
};

//==================================================
UIFactory["Node"].updateMetadataWadAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata-wad",node)[0]).attr(attribute,value);
	//-----------------------------------
	if (attribute=='showtoroles')
		if (value!='')
			$($("metadata-wad",node)[0]).attr('private','Y');
		else
			$($("metadata-wad",node)[0]).attr('private','N');
	//-----------------------------------
	UICom.UpdateMetaWad(nodeid);
	UIFactory["Node"].displayMetainfo('metainfo_'+nodeid,node);
};

//==================================================
UIFactory["Node"].updateMetadataEpmAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata-epm",node)[0]).attr(attribute,value);
	UICom.UpdateMetaEpm(nodeid);
};

//==================================================
UIFactory["Node"].getMetadataAttributeEditor = function(nodeid,attribute,value,yes_no,disabled)
//==================================================
{
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
	if (yes_no!=null && yes_no) {
		html += "  <div class='col-sm-9'><input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+nodeid+"','"+attribute+"',this.value,this.checked)\" value='Y'";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else {
		html += "  <div class='col-sm-9'><input type='text' class='form-control' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"'";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html += "></div>";
	}
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].getMetadataDisplayTypeAttributeEditor = function(nodeid,attribute,value,yes_no,disabled)
//==================================================
{
	
	var display_types = ['standard','header','model'];
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
		html += "  <div class='col-sm-9'><select class='form-control' onchange=\"javascript:UIFactory['Node'].updateMetadataDisplayTypeAttribute('"+nodeid+"','"+attribute+"',this)\"";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html+= ">";
		for (var i=0; i<display_types.length; i++) {
			html += "<option value='"+display_types[i]+"'";
			if (value==display_types[i])
				html += " selected ";
			html += ">"+display_types[i]+"</option>";
		}
		html+= "</select>";
		html+= "</div>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].updateMetadataDisplayTypeAttribute = function(nodeid,attribute,select)
//==================================================
{
	var option = $(select).find("option:selected");
	var value = $(option).attr('value');
	var node = UICom.structure["ui"][nodeid].node;
	$($("metadata",node)[0]).attr(attribute,value);
	UICom.UpdateMetadata(nodeid);
//	UIFactory["Node"].displayMetainfo('metainfo_'+nodeid,node);
};


//==================================================
UIFactory["Node"].getMetadataWadAttributeEditor = function(nodeid,attribute,value,yes_no,disabled)
//==================================================
{
	var langcode = LANGCODE;
	if ((value==null || value==undefined || value=='undefined') && attribute=='display')
		value = "Y";
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
	if (yes_no!=null && yes_no) {
		html += "  <div class='col-sm-9'><input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value,this.checked)\" value='Y'";		
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else if (attribute.indexOf('seltype')>-1){
		html += "  <div class='col-sm-9'>";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='select' ";
		if (value=='select' || value=='')
			html +=" checked";
		html +="> Select";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='radio'";
		if (value=='radio')
			html +=" checked";
		html +="> Radio";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='click'";
		if (value=='click')
			html +=" checked";
		html +="> Click";
		html += "</div>";
	} else {
		html += "  <div class='col-sm-9'><input type='text' class='form-control'  onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"'";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html += "></div>";
	}
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].getMetadataEpmAttributeEditor = function(nodeid,attribute,value)
//==================================================
{
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group'>";
	var attribute_label = attribute;
	if (attribute.indexOf('node-')>-1)
		attribute_label = attribute.substring(5);
	if (attribute.indexOf('inparent-')>-1)
		attribute_label = attribute.substring(9);
	html += "  <label class='col-sm-3 control-label'>"+karutaStr[languages[langcode]][attribute_label]+"</label>";
	if (attribute.indexOf('font-weight')>-1){
		html += "  <div class='col-sm-9'>";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='normal' ";
		if (value=='normal' || value=='')
			html +=" checked";
		html +="> Normal";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='bold'";
		if (value=='bold')
			html +=" checked";
		html +="> Bold";
		html += "</div>";
	}
	else if (attribute=='css_in_parent'){
		html += "  <div class='col-sm-9'>";
		html += "    <input type='radio' name='css_in_parent' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='N' ";
		if (value=='N' || value=='')
			html +=" checked";
		html +="> "+karutaStr[languages[langcode]]['no'];
		html += "    <input type='radio' name='css_in_parent' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='Y'";
		if (value=='Y')
			html +=" checked";
		html +="> "+karutaStr[languages[langcode]]['yes'];
		html += "</div>";
	}
	else if (attribute.indexOf('font-style')>-1){
		html += "  <div class='col-sm-9'>";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='normal' ";
		if (value=='normal' || value=='')
			html +=" checked";
		html +="> Normal";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='italic'";
		if (value=='italic')
			html +=" checked";
		html +="> Italic";
		html += "</div>";
	}
	else if (attribute.indexOf('color')>-1){
		html += "  <div class='col-sm-9'><input type='text' class='form-control pickcolor' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
	}
	else if (attribute.indexOf('text-align')>-1){
		html += "  <div class='col-sm-9'>";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='left' ";
		if (value=='left' || value=='')
			html +=" checked";
		html +="> Left";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='right'";
		if (value=='right')
			html +=" checked";
		html +="> Right";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='center'";
		if (value=='center')
			html +=" checked";
		html +="> Center";
		html += "    <input type='radio' name='"+attribute+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='justify'";
		if (value=='justify')
			html +=" checked";
		html +="> Justify";
		html += "</div>";
	}
	else
		html += "  <div class='col-sm-9'><input type='text' class='form-control' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].updateMetadatawWadTextAttribute = function(nodeid,attribute)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	var value = $.trim($("#"+nodeid+"_"+attribute).val());
	if (attribute=='query' && UICom.structure["ui"][nodeid].resource.type=='Proxy' && value!=undefined && value!='') {
		var p1 = value.indexOf('.');
		var p2 = value.indexOf('.',p1+1);
		var semtag = value.substring(p1+1,p2);
		$($("metadata",node)[0]).attr('semantictag','proxy-'+semtag);
		UICom.UpdateMetadata(nodeid);
	}
	$($("metadata-wad",node)[0]).attr(attribute,value);
	UICom.UpdateMetaWad(nodeid);
};


//==================================
UIFactory["Node"].displayMetadatawWadTextAttributeEditor = function(destid,nodeid,attribute,text,type)
//==================================
{
	if (type==null)
		type = 'default';
	if (text==undefined || text=='undefined')
		text="";
	if (type=='default')
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' class='form-control' style='height:50px'>"+text+"</textarea></div>";
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' class='form-control' style='height:"+height+"px'>"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	//---------------------------
	if (attribute=='help')
		$("#"+nodeid+"_"+attribute).wysihtml5({toolbar:{"size":"xs","font-styles": false,"html": true,"blockquote": false,"image": false},'uuid':nodeid,locale:languages[lang],'events': {'change': function(){UIFactory['Node'].updateMetadatawWadTextAttribute(nodeid,attribute);} }});
	else
		$("#"+nodeid+"_"+attribute).change(function(){UIFactory['Node'].updateMetadatawWadTextAttribute(nodeid,attribute);});
	//---------------------------
};

//==================================================
UIFactory["Node"].displayMetadataTextsEditor = function(node,type,langcode)
//==================================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var html ="";
	var name = node.asmtype;
	var resource_type = "";
	if (node.resource!=null)
		resource_type = node.resource.type;
	//----------------------Search----------------------------
	if (resource_type=='Get_Resource' || resource_type=='Get_Double_Resource' || resource_type=='Get_Get_Resource' || resource_type=='Proxy' || resource_type=='URL2Unit') {
		html  = "<hr><label>"+karutaStr[languages[langcode]]['query'+resource_type]+"</label>";
		$("#metadata_texts").append($(html));
		UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'query',$(node.metadatawad).attr('query'));
	}
	if (resource_type=='Get_Resource' || resource_type=='Get_Get_Resource' || resource_type=='Get_Double_Resource') {
		html = UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'seltype',$(node.metadatawad).attr('seltype'));
		$("#metadata_texts").append($(html));
	}
	//----------------------Menu----------------------------
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') {
		html  = "<hr><label>"+karutaStr[languages[langcode]]['menuroles'];
		if (languages.length>1){
			var first = true;
			for (var i=0; i<languages.length;i++){
				if (!first)
					html += "/";
				html += karutaStr[languages[i]]['menuroles2'];
				first = false;
			}
		} else {
			html += karutaStr[languages[langcode]]['menuroles2'];
		}
		html += karutaStr[languages[langcode]]['menuroles3']+"</label>";
		$("#metadata_texts").append($(html));
		UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'menuroles',$(node.metadatawad).attr('menuroles'));
	}
	//--------------------------------------------------
	html = "<br><hr><label>"+karutaStr[languages[langcode]]['help'];
	if (languages.length>1){
		var first = true;
		for (var i=0; i<languages.length;i++){
			if (!first)
				html += "/";
			html += karutaStr[languages[i]]['help2'];
			first = false;
		}
	}
	html += karutaStr[languages[langcode]]['help3']+"</label>";
	$("#metadata_texts").append($(html));
	UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'help',$(node.metadatawad).attr('help'));
};
