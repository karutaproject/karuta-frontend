/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

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
				var newElement = document.createElement("label");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			}
			if (this.label_node[i].text()=="" && (this.asmtype=="asmRoot" || this.asmtype=="asmStructure" || this.asmtype=="asmUnit" ))
				this.label_node[i].text("?");
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
				var newElement = document.createElement("text");
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

//==================================================
UIFactory["Node"].displayMetadataEpm = function(data,attribute,number)
//==================================================
{
	var html = "";
	if (data.attr(attribute)!=undefined && data.attr(attribute)!="") {
		var value = $(data).attr(attribute);
		html += attribute + ":" + value;
		if (number && value.indexOf('%')<0 && value.indexOf('px')<0)
			html += 'px';
		html += ';';
	}	return html;
};

//==================================
UIFactory["Node"].prototype.getLabel = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null)
		this.display_label[dest]=true;
	//---------------------
	var html = "";
	if (type=="default")
		html =   "<div class='title'>"+this.label_node[langcode].text()+"</div>";
	if (type=="span")
		html =   "<span class='title'>"+this.label_node[langcode].text()+"</span>";
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
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest]=true;
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
		if (style.length>0)
			html += " style='"+style+"' ";
		//----------------------------
		html += ">";
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userrole=='designer' || USER.admin)) {
			html += this.code_node.text()+" ";
		}
		html += this.label_node[langcode].text()+"<span id='help_"+this.id+"' class='ihelp'></span>";
		if (type=="default")
			html += "</div>";
		if (type=="span")
			html += "</span>";
	}
	return html;
};

/// Editor
//==================================
UIFactory["Node"].update = function(input,itself,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var code = $.trim($("#code_"+itself.id).val());
	$(itself.code_node).text(code);
	var label = $.trim($("#label_"+itself.id).val());
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
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var self = this;
	var inputLabel = "<input id='label_"+this.id+"' type='text'  value=\""+this.label_node[langcode].text()+"\">";
	var objLabel = $(inputLabel);
	$(objLabel).change(function (){
		UIFactory["Node"].update(objLabel,self,langcode);
	});
	return objLabel;
}
//==================================
UIFactory["Node"].prototype.getEditor = function(type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
	if (g_userrole=='designer' || USER.admin) {
		var htmlCode = $("<label>Code&nbsp; </label>");
		var inputCode = "<input id='code_"+this.id+"' type='text' name='input_code' value=\""+this.code_node.text()+"\">";
		var objCode = $(inputCode);
		$(objCode).change(function (){
			UIFactory["Node"].update(objCode,self,langcode);
		});
		$(htmlCode).append($(objCode));
		$(div).append($(htmlCode));
	}
	if (g_userrole=='designer' || USER.admin || editnoderoles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1) {
		var htmlLabel = $("<label>"+karutaStr[LANG]['label']+"&nbsp; </label>");
		var inputLabel = "<input id='label_"+this.id+"' type='text'  value=\""+this.label_node[langcode].text()+"\">";
		var objLabel = $(inputLabel);
		$(objLabel).change(function (){
			UIFactory["Node"].update(objLabel,self,langcode);
		});
		$(htmlLabel).append($(objLabel));
		$(div).append($(htmlLabel));
	}
	var resizeroles = $(this.metadatawad).attr('resizeroles');
	if (resizeroles==undefined)
		resizeroles="";
	if ((g_userrole=='designer' || USER.admin || resizeroles.indexOf(g_userrole)>-1 || resizeroles.indexOf(this.userrole)>-1) && this.resource!=undefined && this.resource.type=='Image') {
		//-----------------------------
		var htmlSize = UIFactory["Node"].getMetadataEpmAttributeEditor(this.id,'width',$(this.metadataepm).attr('width'));
		$(div).append($(htmlSize));
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
		$("#"+dest).html(this.getView());
	};
	for (dest in this.display_label) {
		$("#"+dest).html(this.getLabel());
	};

};


//==================================
UIFactory["Node"].prototype.getButtons = function(dest,type,langcode,inline,depth,edit)
//==================================
{
	return UIFactory["Node"].buttons(this,type,langcode,inline,depth,edit);
};
//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

//===========================================
UIFactory["Node"].displaySidebar = function(root,destid,type,langcode,edit)
//===========================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	/// Traverse tree
	for( var i=0;i<root.childs.length;i++ )
	{
		var child = UICom.structure["tree"][root.childs[i]].node;
		var name = child.tagName;
		var uuid = $(child).attr("id");
		var text = UICom.structure["ui"][uuid].getLabel('sidebar_'+uuid);
		if(name == "asmUnit") // Click on Unit
		{
			var link = "<a id='sidebar_"+uuid+"' href='#' onclick=\"displayPage('"+uuid+"',100,'"+type+"','"+langcode+"',"+g_edit+")\">"+text+"</a>";
			$("#"+destid).append($(link));
		}
		if(name == "asmStructure") // Click on Structure
		{
			var depth = 1;
			var html = "";
			html += "<div class='accordion-group'>";
			html += "<div class='accordion-heading'>";
			html += "  <a id='sidebar_"+uuid+"' class='accordion-toggle' data-toggle='collapse' data-parent='#accordion' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" href='#collapse"+uuid+"'>"+text+"</a>";
			html += "</div><!-- panel-heading -->";
			html += "<div id='collapse"+uuid+"' class='accordion-body collapse'>";
			html += "<div id='panel-body"+uuid+"' class='accordion-inner'></div><!-- panel-body -->";
			html += "</div><!-- panel-collapse -->";
			html += "</div><!-- panel -->";
			$("#"+destid).append($(html));
			UIFactory["Node"].displaySidebar(UICom.structure["tree"][root.childs[i]],'panel-body'+uuid,type,langcode,g_edit);
		}
	}
};


//==================================================
UIFactory["Node"].displayStandard = function(root,dest,depth,langcode,edit,inline)
//==================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
// Base info
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");

//	var readnode = ($(data).attr('read')=='Y')? true:false;
	var node = UICom.structure["ui"][uuid];
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	var contentfreenode = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
	var showroles = ($(node.metadatawad).attr('showroles')==undefined)?'none':$(node.metadatawad).attr('showroles');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	if ((showroles==g_userrole && privatevalue) || !privatevalue || g_userrole=='designer') {
		var readnode = true;
		//----------------------------------
		if (g_userrole=='designer') {
			readnode = (g_userrole=='designer' || seenoderoles.indexOf(g_userrole)>-1 || seenoderoles.indexOf('all')>-1)? true : false;
		}
		//----------------------------------
		if( depth < 0 || !readnode) return;
		//----------------edit control on proxy target ------------
		if (g_userrole!='designer' && !USER.admin && proxies_edit["proxy-"+semtag]!=undefined) {
				edit = (proxies_edit["proxy-"+semtag].indexOf(g_userrole)>-1);
		}
		//----------------------------------
		var html = "<div class='"+name+" "+semtag+"'>";
	//	html += "<hr/>";
		if (name == "asmContext"){
			html += "<div class='row'";
			//-------------- test if proxy resource -----------
			if (UICom.structure["ui"][uuid].resource_type=='Proxy' && g_userrole!='designer' && !USER.admin)
				html += " style='display:none' ";
			html += ">";
			//-------------- node -----------------------------
			html += "<div id='std_node_"+uuid+"' class='span2'>";
			html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
			//----------- help -----------
	//		if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
	//			html += "<span id='help_"+uuid+"' class='ihelp'></span> ";
	//		}
			html += "</div>";
			//-------------- resource -------------------------
			if (g_userrole=='designer') {
				writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
				if (!writenode)
					writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
				if (!writenode)
					writenode = (g_userrole=='designer')? true : false;
			}
			if (edit && inline && writenode){
				html += "<div id='std_resource_"+uuid+"' class='span5'>";
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
					$("#edit-window-body-content").html($(html));
				}
				html += "</div>";
			}
			else {
				if (g_display_type=='standard')
					html += "<div id='std_resource_"+uuid+"' class='span5'>";
				if (g_display_type=='header')
					html += "<div id='std_resource_"+uuid+"' class='span7'>";
				html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
				html += "</div>";
			}
			//-------------- buttons --------------------------
			html += "<div id='buttons-"+uuid+"' class='span2'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
			//--------------------------------------------------
			html += "</div><!-- row -->";
			//-------------- context -------------------------
			html += "<div class='row'><div class='span2'></div><div class='span7'><div id='comments_"+uuid+"' class='comments'></div><!-- comments --></div><!-- span7 --><div class='span2'></div></div><!-- row -->";
			//-------------- metainfo -------------------------
			if (g_edit && (g_userrole=='designer' || USER.admin)) {
				html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
			}
			//--------------------------------------------------
		}
		else { // other than asmContext
			html += "<div class='row'>";
			//-------------- node -----------------------------
			if (g_display_type=='standard')
				html += "<div id='std_node_"+uuid+"' class='span7'>";
			if (g_display_type=='header')
				html += "<div id='std_node_"+uuid+"' class='span9'>";
			if (depth!=1 && depth<10 && name=='asmStructure')
				html += "<a href='#' onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('std_node_'+uuid)+"</a>";
			else if (depth!=1 && depth<10 && name=='asmUnit')
				html += "<a href='#' onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('std_node_'+uuid)+"</a>";
			else
				html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
			//----------------------------
			html += "</div>";
			//-------------- buttons --------------------------
			html += "<div id='buttons-"+uuid+"' class='span2'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
			//--------------------------------------------------
			html += "</div><!-- row -->";
			//-------------- context -------------------------
			html += "<div class='row'><div class='span2'></div><div class='span7'><div id='comments_"+uuid+"' class='comments'></div><!-- comments --></div><!-- span7 --><div class='span2'></div></div><!-- row -->";
			//-------------- metainfo -------------------------
			if (g_edit && (g_userrole=='designer' || USER.admin)) {
				html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
			}
			//--------------------------------------------------*/
			html += "<div id='content-"+uuid+"'style='position:relative'></div>";
		}
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
			        e.preventDefault();
			});
	
		}
		//----------------------------
		$('input[name="datepicker"]').datepicker({format: 'yyyy/mm/dd',language: LANG});
		$('a[data-toggle=tooltip]').tooltip({html:true});
		$("a.embed").oembed();
		//---------- video ------------------
		if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
			UICom.structure["ui"][uuid].resource.setParameter();
		// -------------- display metainfo
		if (g_userrole=='designer' || USER.admin) {  
			UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
		}
		//----------------------------
		if (name=='asmUnitStructure')
			depth=100;	
		// ---------------------------- For each child 
		for( var i=0; i<root.childs.length; ++i ) {
			// Recurse
			var child = UICom.structure["tree"][root.childs[i]];
			var childnode = UICom.structure["ui"][root.childs[i]];
			//-------------------
			var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
			if (contentfreenode == 'Y' || freenode == 'Y')
				UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
			else
				UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline);
		}
		//------------- dashboard --------------------
		if (depth>1&& $($("metadata",data)[0]).attr('semantictag')!=undefined) {
			var semtag =  $($("metadata",data)[0]).attr('semantictag');
			if (semtag.indexOf('dashboard')>-1){
				var dashboard_function = $($("metadata",data)[0]).attr('semantictag').substring(10)+"(UICom.root.node)";
				$("#"+dest).append(eval(dashboard_function));
			}
		}
		//----------------------------
	} //---- end of private
};

//==================================================
UIFactory["Node"].displayFree = function(root, destid, depth,langcode,edit,inline)
//==================================================
{
	// Base info
	var data = root.node;
	var name = $(data).prop("nodeName");
	var uuid = $(data).attr("id");

	var readnode = true;
	var node = UICom.structure["ui"][uuid];
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)?'':$(node.metadatawad).attr('seenoderoles');
	var graphicerroles = ($(node.metadatawad).attr('graphicerroles')==undefined)?'':$(node.metadatawad).attr('graphicerroles');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'':$(node.metadatawad).attr('delnoderoles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	if (g_userrole=='designer') {
		readnode = (seenoderoles.indexOf(g_userrole)>-1 || seenoderoles.indexOf('all')>-1)? true : false;
		writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
		if (!writenode)
			writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
	}
	if( depth < 0 || !readnode) return;
	
	var html = "";
	html += "<div class='"+name+" "+semtag+"' id='free_"+uuid+"' uuid='"+uuid+"' draggable='yes' ";
	//-----------------------
	var style ="position:absolute;";
	var metadataepm = $(node.metadataepm);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'top',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'left',true);
	if (name == "asmUnitStructure" || UICom.structure["ui"][uuid].resource_type=='TextField') {
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'width',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'height',true);
	}
	//----------------------------
	if (name == "asmContext"){
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
	}
	//----------------------------
	html += " style='"+style+"' ";
	//------------------------
	html += ">";
	//------------------------------------------
	if (name == "asmContext"){
		//-------------- resource -------------------------
		if (g_userrole=='designer') {
			writenode = (editnoderoles.indexOf(g_userrole)>-1)? true : false;
			if (!writenode)
				writenode = (editresroles.indexOf(g_userrole)>-1)? true : false;
			if (!writenode)
				writenode = (g_userrole=='designer')? true : false;
		}
		if (inline && writenode){
			html += "<div id='std_resource_"+uuid+"'>";
			//-----------------------
			if(UICom.structure["ui"][uuid].resource!=null) {
				try {
					UICom.structure["ui"][uuid].resource.getEditor(); // test if getEditor() exists
					html += "<span id='get_editor_"+uuid+"'></span>";
				}
				catch(e) {
					html += "<span id='display_editor_"+uuid+"'></span>";
				}
			} else {
				html = UICom.structure["ui"][uuid].getEditor();
				$("#edit-window-body-content").html($(html));
			}
			html += "</div>";
		}
		else {
			html += "<div id='std_resource_"+uuid+"' uuid='"+uuid+"'>";
			if (UICom.structure["ui"][uuid].resource_type!='Video' && UICom.structure["ui"][uuid].resource.getView()=='')
				html += "<span style='z-index:-5;color:lightgrey'>"+UICom.structure["ui"][uuid].resource_type+"</span>";
			html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
			html += "</div>";
		}
	}
	else {
		//-------------- node -----------------------------
		html += "<div id='std_node_"+uuid+"'>";
		html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
		//----------- help -----------
		if ($("metadata-wad",data).attr('help')!=undefined && $("metadata-wad",data).attr('help')!=""){
			html += "<span id='help_"+uuid+"' class='ihelp'></span>";
		}
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
	if (!inline || g_userrole=='designer') {
		html += "<div id='toolbar-"+uuid+"' style='visibility:hidden;z-index:10;'>";
		//-------------- buttons --------------------------
		html += "	<div id='buttons-"+uuid+"'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
		//------------------------------------------
		html += "</div>";
		//--------------------------------------------------
	}
	html += "<div id='context-"+uuid+"'></div>";
	html += "</div><!-- name -->";
	$("#"+destid).append(html);
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
	if ($("metadata-wad",data).attr('help')!=undefined && $("metadata-wad",data).attr('help')!=""){
		var help =  "<a title='' href='#' data-placement='right' data-toggle='tooltip'><i class='icon-info-sign'></i></a>";
		var obj = $(help);
		$(obj).attr("data-original-title",$("metadata-wad",data).attr('help'));
		$("#help_"+uuid).append(obj);
	}
	$('a[data-toggle=tooltip]').tooltip({html:true});
	//-----------------------------
	if (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || graphicerroles.indexOf(this.userrole)>-1) {
		//-------------------------------
		$("#free_"+uuid).draggable({
			stop: function(){UIFactory["Node"].updatePosition(this);}
		}
		);
		//-------------------------------
		if (UICom.structure["ui"][uuid].resource_type=='Image')
			$("#std_resource_"+uuid).resizable({
				aspectRatio:true,
				stop: function(){UIFactory["Node"].updateSize(this);}
			}
			);
		if (UICom.structure["ui"][uuid].resource_type=='TextField')
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
	if (!inline &&  (USER.admin || g_userrole=='designer' || delnoderoles.indexOf(g_userrole)>-1 || editresroles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(g_userrole)>-1 || delnoderoles.indexOf(this.userrole)>-1 || editresroles.indexOf(this.userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1)) {
		//-------------------------------
		if (name!='asmContext')
			$("#free_"+uuid).css('border','1px dashed lightgrey');
		else
			$("#std_resource_"+uuid).css('border','1px dashed lightgrey');
		//-------------------------------
		$("#free_"+uuid).mouseover(function(){
			$('#toolbar-'+uuid).css('visibility','visible');
		}
		);
		//-------------------------------
		$("#free_"+uuid).mouseout(function(){
//			$(this).css('border','0px dashed lightgrey');
			$('#toolbar-'+uuid).css('visibility','hidden');
		}
		);
	}
	//----------------------------
	if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
		UICom.structure["ui"][uuid].resource.setParameter();
	if (g_userrole=='designer' || USER.admin) {  //display metainfo
		UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
	}

	/// For each child
	for( var i=0; i<root.childs.length; ++i ) 
	{
		// Recurse
		var child = UICom.structure["tree"][root.childs[i]];
		var childnode = UICom.structure["ui"][root.childs[i]];
		var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
		if (freenode == 'Y')
			UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit);
		else
			UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit);
	}
};


//========================================================
UIFactory["Node"].updatePosition = function (obj)
//========================================================
{
	var nodeid = obj.getAttribute("uuid");
	var top = obj.style.top;
	var left = obj.style.left;
	if (parseInt(top)<20)
		top = "20px";
	if (parseInt(left)<20)
		left = "20px";
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
		text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).html();
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
		text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).html();
		html += "<h4>"+karutaStr[LANG]['comments']+"</h4>";
		html += "<div id='div_"+uuid+"'><textarea id='"+uuid+"_edit_comment' style='height:200px'>"+text+"</textarea></div>";
		$("#"+destid).append($(html));
		$("#"+uuid+"_edit_comment").wysihtml5({size:'mini','image': false,'font-styles': false,'uuid':uuid,locale:lang,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].updateComments();},'focus': function(){currentTexfieldUuid=uuid;} }});
	}
};

//==================================
UIFactory["Node"].prototype.updateComments = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
	var option = $("select",$("#edit-window-body-content")).find("option:selected");
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
	$("#edit-window-body-content").html("");
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
	footer += "<span class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['move']+"</span>";
	footer += "<span class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</span>";
	$("#edit-window-footer").html($(footer));
	// ------------------------------
	/// Traverse tree
	var html = "<select>";
	var uuid = $(node.node).attr("id");
	var label = UICom.structure["ui"][uuid].label_node[langcode].text();
	html += "<option uuid = '"+uuid+"'>"+label+"</option>";
	html += UIFactory["Node"].getSubNodes(node, nodeid, UICom.structure.ui[nodeid].asmtype);
	html += "</select>";
	// ------------------------------
	$("#edit-window-body-content").html($(html));
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
	for( var i=0;i<root.childs.length;++i )
	{
		var uuid = root.childs[i];
//		var uuid = $(child.node).attr("id");
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
{	// note: #xxx to avoid to scroll to the top of the page
	if (freenode)
		tag += '_free';
	var html = "<li><a href='#xxx' onclick=\"javascript:importBranch('"+parentid+"','"+srce+"','"+tag+"',"+databack+","+callback+","+param2+","+param3+","+param4+")\">";
	html += title;
	html += "</a></li>";
	return html;
};


//==================================================
UIFactory["Node"].buttons = function(node,type,langcode,inline,depth,edit)
//==================================================
{
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
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
	var menuroles = ($(node.metadatawad).attr('menuroles')==undefined)?'none':$(node.metadatawad).attr('menuroles');
	var showroles = ($(node.metadatawad).attr('showroles')==undefined)?'none':$(node.metadatawad).attr('showroles');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
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
//		if ((!inline && (writenode || USER.admin || g_userrole=='designer' )) || (inline && (USER.admin || g_userrole=='designer' || editnoderoles.indexOf(g_userrole)>-1 || editresroles.indexOf(g_userrole)>-1 || editnoderoles.indexOf($(node).attr('role'))>-1 ))) {
		if ((!inline && (writenode || USER.admin || g_userrole=='designer' )) || (inline && ((USER.admin || g_userrole=='designer') && (editnoderoles.indexOf(g_userrole)<0 && editresroles.indexOf(g_userrole)<0)))) {
			html += "<a class='btn btn-mini' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+node.id+"')\" data-title='Éditer' rel='tooltip'>";
			html += "<i class='icon-pencil'></i>";
			html += "</a>";
		}
		//------------ delete button ---------------------
		if ((deletenode || USER.admin || g_userrole=='designer') && node.asmtype != 'asmRoot') {
			if (node.asmtype == 'asmStructure' || node.asmtype == 'asmUnit') {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",portfolioid,null);
			} else {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadUnit",portfolioid,null);
			}
		}
		//------------- submit button -------------------
		if ((submitnode || USER.admin || g_userrole=='designer') && submitroles!='none' && submitroles!='') {
			html += "<a id='submit-"+node.id+"' class='btn btn-mini'onclick=\"javascript:submit('"+node.id+"')\" >submit</a>";
		}
		//------------- private button -------------------
		if ((showroles==g_userrole || USER.admin || g_userrole=='designer') && showroles!='none' && showroles!='') {
			if (privatevalue) {
				html += "<a class='btn btn-mini'>";
				html += "<i id='icon-"+node.id+"' class='icon-eye-close' onclick=\"javascript:show('"+node.id+"')\"></i>";
				html += "</a>";
			} else {
				html += "<a class='btn btn-mini'>";
				html += "<i id='icon-"+node.id+"' class='icon-eye-open' onclick=\"javascript:hide('"+node.id+"')\"></i>";
				html += "</a>";				
			}
		}
	}
	//------------- move node buttons ---------------
	if ((USER.admin || g_userrole=='designer') && node.asmtype != 'asmRoot') {
		html+= "<a class='btn btn-mini' onclick=\"javascript:UIFactory.Node.upNode('"+node.id+"')\" href='#'><i class='icon-arrow-up'></i></a>";
		html+= "<a class='btn btn-mini' onclick=\"javascript:UIFactory.Node.selectNode('"+node.id+"',UICom.root)\" href='#'><i class='icon-random'></i></a>";
	}
	//------------- node menus button ---------------
	if ((USER.admin || g_userrole=='designer') && (node.asmtype != 'asmContext' && (depth>0 || node.asmtype == 'asmUnitStructure'))) {
		html += "<a class='btn btn-mini dropdown-toggle'  data-toggle='dropdown' href='#'>"+karutaStr[languages[langcode]]['Add']+" <b class='caret'></b></a>";
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
		html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Oembed','Oembed',databack,callback,param2,param3,param4,freenode);
		if (!freenode) {
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Comments','Comments',databack,callback,param2,param3,param4,freenode);
			html += "<hr>";
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Item','Item',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Resource','Get_Resource',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Get_Resource','Get_Get_Resource',databack,callback,param2,param3,param4,freenode);
			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Proxy','Proxy',databack,callback,param2,param3,param4,freenode);
//			html += UIFactory["Node"].getItemMenu(node.id,'_zc_resources_','Person','Person',databack,callback,param2,param3,param4,freenode);
//			html += UIFactory["Node"].getItemMenu(node.id,'_karuta_resources_','Get_Proxy','Get_Proxy',databack,callback,param2,param3,param4,freenode);
		}
		html += "</ul>"; // class='dropdown-menu'
	}
	html += "</div>"; // class='btn-group'
	//------------- specific menu button ---------------
	try {
		if (depth>0 && menuroles != undefined && menuroles.length>10 && (menuroles.indexOf(userrole)>-1 || menuroles.indexOf(g_userrole)>-1 || USER.admin || g_userrole=='designer') ){
			var menus = [];
			var displayMenu = false;
			var items = menuroles.split(";");
			for (var i=0; i<items.length; i++){
				var subitems = items[i].split(",");
				menus[i] = [];
				menus[i][0] = subitems[0]; // portfolio code
				menus[i][1] = subitems[1]; // semantic tag
				menus[i][2] = subitems[2]; // label
				menus[i][3] = subitems[3]; // roles
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
				html += "<a class='btn btn-mini dropdown-toggle'  data-toggle='dropdown' href='#'>Menu <b class='caret'></b></a>";
				html += "<ul class='dropdown-menu pull-right'>";
				for (var i=0; i<menus.length; i++){
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
				html += "</ul>"; // class='dropdown-menu'
				html += "</div>"; // class='btn-group'
			}
		}
	} catch(e){
		alert('Menu Error : check the format: '+e);
	}
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
			UICom.parseStructure(data);
			$("#sidebar").html("");
			UIFactory["Portfolio"].displaySidebar('sidebar',null,null,g_edit);
			var uuid = $("#page").attr('uuid');
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
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes/node/" + uuid,
		success : function(data) {
			UICom.parseStructure(data);
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
//-------------------- METADATA ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

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
	html += UIFactory["Node"].displayMetadata(data,'public');
	html += UIFactory["Node"].displayMetadataWad(data,'seenoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'editresroles');
	html += UIFactory["Node"].displayMetadataWad(data,'delnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'commentnoderoles');
//	html += UIFactory["Node"].displayMetadataWad(data,'submitroles');
	html += UIFactory["Node"].displayMetadataWad(data,'editnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'query');
	html += UIFactory["Node"].displayMetadataWad(data,'display');
	html += UIFactory["Node"].displayMetadataWad(data,'menuroles');
	html += UIFactory["Node"].displayMetadataWad(data,'notifyroles');
	html += UIFactory["Node"].displayMetadataWad(data,'graphicerroles');
	html += UIFactory["Node"].displayMetadataWad(data,'resizeroles');
	html += UIFactory["Node"].displayMetadataWad(data,'edittargetroles');
//	html += UIFactory["Node"].displayMetadataWad(data,'showroles');
//	html += UIFactory["Node"].displayMetadataWad(data,'showtoroles');
	html += UIFactory["Node"].displayMetadataWad(data,'inline');
	$("#"+destid).html(html);
};

//==================================================
UIFactory["Node"].getMetadataAttributesEditor = function(node,type,langcode)
//==================================================
{
	var name = node.asmtype;
	var html = "<hr>";
	html += "<form id='metadata' class='form-horizontal'>";
	if (name=='asmContext' && node.resource.type=='Proxy')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'semantictag',$(node.metadata).attr('semantictag'),false,true);
	else
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'semantictag',$(node.metadata).attr('semantictag'));
	html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'sharedNodeResource',$(node.metadata).attr('sharedNodeResource'),true);
	if (languages.length>1) { // multilingual application
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'multilingual-node',$(node.metadata).attr('multilingual-node'),true);
		if (name=='asmContext') {
			html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'multilingual-resource',$(node.metadata).attr('multilingual-resource'),true);
		}
	}
	if (name=='asmContext')
		html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'sharedResource',$(node.metadata).attr('sharedResource'),true);
	html += "<hr><h4>Metadata</h4>";
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
//	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showroles',$(node.metadatawad).attr('showroles'));
//	if ($(node.metadatawad).attr('showroles')!='')
//		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'private',$(node.metadatawad).attr('private'),true);
//	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showtoroles',$(node.metadatawad).attr('showtoroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editboxtitle',$(node.metadatawad).attr('editboxtitle'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'contentfreenode',$(node.metadatawad).attr('contentfreenode'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'freenode',$(node.metadatawad).attr('freenode'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'display',$(node.metadatawad).attr('display'),true);
	html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'public',$(node.metadata).attr('public'),true);
	html += UIFactory["Node"].getMetadataAttributeEditor(node.id,'inline',$(node.metadata).attr('inline'),true);
//	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'veriffunction',$(node.metadatawad).attr('veriffunction'));
	html += "<div id='metadata_texts'></div>";
	html += "</form>";
	return html;
};

//==================================================
UIFactory["Node"].getMetadataEpmAttributesEditor = function(node,type,langcode)
//==================================================
{
	var html = "";
	var userrole = $(node.node).attr('role');
	if (userrole==undefined || userrole=='')
		userrole = "norole";
	var graphicerroles = $(node.metadatawad).attr('graphicerroles');
	if (graphicerroles==undefined)
		graphicerroles = "";
	if (USER.admin || g_userrole=='designer' || graphicerroles.indexOf(g_userrole)>-1 || graphicerroles.indexOf(userrole)>-1) {
		html += "<hr><h4>CSS - Styles</h4>";
		html += "<form id='metadata' class='form-horizontal'>";
		html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-size',$(node.metadataepm).attr('font-size'));
		html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-weight',$(node.metadataepm).attr('font-weight'));
		html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'font-style',$(node.metadataepm).attr('font-style'));
		html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'color',$(node.metadataepm).attr('color'));
		html += UIFactory["Node"].getMetadataEpmAttributeEditor(node.id,'text-align',$(node.metadataepm).attr('text-align'));
		if ($(node.metadatawad).attr('freenode')=='Y'){
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
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
	if (yes_no!=null && yes_no) {
		html += "  <div class='controls'><input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+nodeid+"','"+attribute+"',this.value,this.checked)\" value='Y'";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else {
		html += "  <div class='controls'><input type='text' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"'";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html += "></div>";
	}
	html += "</div>";
	return html;
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
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
	if (yes_no!=null && yes_no) {
		html += "  <div class='controls'><input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value,this.checked)\" value='Y'";		
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else {
		html += "  <div class='controls'><input type='text' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"'";
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
	html += "<div class='control-group'>";
	html += "  <label class='control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
	if (attribute=='font-weight'){
		html += "  <div class='controls'>";
		html += "    <input type='radio' name='font-weight' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='normal' ";
		if (value=='normal' || value=='')
			html +=" checked";
		html +="> Normal";
		html += "    <input type='radio' name='font-weight' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='bold'";
		if (value=='bold')
			html +=" checked";
		html +="> Bold";
		html += "</div>";
	}
	else if (attribute=='font-style'){
		html += "  <div class='controls'>";
		html += "    <input type='radio' name='font-style' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='normal' ";
		if (value=='normal' || value=='')
			html +=" checked";
		html +="> Normal";
		html += "    <input type='radio' name='font-style' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='italic'";
		if (value=='italic')
			html +=" checked";
		html +="> Italic";
		html += "</div>";
	}
	else if (attribute=='text-align'){
		html += "  <div class='controls'>";
		html += "    <input type='radio' name='text-align' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='left' ";
		if (value=='left' || value=='')
			html +=" checked";
		html +="> Left";
		html += "    <input type='radio' name='text-align' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='right'";
		if (value=='right')
			html +=" checked";
		html +="> Right";
		html += "    <input type='radio' name='text-align' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='center'";
		if (value=='center')
			html +=" checked";
		html +="> Center";
		html += "    <input type='radio' name='text-align' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='justify'";
		if (value=='justify')
			html +=" checked";
		html +="> Justify";
		html += "</div>";
	}
	else
		html += "  <div class='controls'><input type='text' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+value+"' ></div>";
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
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' style='height:50px'>"+text+"</textarea></div>";
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' style='height:"+height+"px'>"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	//---------------------------
	if (attribute=='help')
		$("#"+nodeid+"_"+attribute).wysihtml5({size:'mini','image': false,'font-styles': false,'uuid':nodeid,locale:languages[lang],'events': {'change': function(){UIFactory['Node'].updateMetadatawWadTextAttribute(nodeid,attribute);} }});
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
	//--------------------------------------------------
	html  = "<hr><label>"+karutaStr[languages[langcode]]['query']+"</label>";
	$("#metadata_texts").append($(html));
	UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'query',$(node.metadatawad).attr('query'));
	//--------------------------------------------------
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
	//--------------------------------------------------
	$("#metadata_texts").append($(html));
	UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'menuroles',$(node.metadatawad).attr('menuroles'));
	html = "<hr><label>"+karutaStr[languages[langcode]]['help'];
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
