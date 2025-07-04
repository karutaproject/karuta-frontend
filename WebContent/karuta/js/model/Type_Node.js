/* =======================================================
	Copyright 2021 - ePortfolium - Licensed under the
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
		this.xsi_type = $(node).attr('xsi_type');
		this.node = node;
		this.asmtype = $(node).prop("nodeName");
		if (this.asmtype=="node")
			this.asmtype = $(node).attr('xsi_type');
		this.code_node = $($("code",node)[0]);
		//--------------------
		this.logcode = ($(node.metadatawad).attr('logcode')==undefined)?'':$(node.metadatawad).attr('logcode');
		//--------------------
		var flag_error = 'a';
		//--------------------
		if ($("value",$("asmResource[xsi_type='nodeRes']",node)).length==0){  // for backward compatibility
			var newelement = createXmlElement("value");
			flag_error = 'b';
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newelement);
		}
		this.value_node = $("value",$("asmResource[xsi_type='nodeRes']",node)[0]);
		//------------------------------
		this.userrole = $(node).attr('role');
		if (this.userrole==undefined || this.userrole=='')
			this.userrole = "norole";
		//------------------------------
		this.label_node = [];
		for (var i=0; i<languages.length;i++){
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			if (this.label_node[i].length==0) {
				flag_error = 'c';
				var newElement = createXmlElement("label");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			}
			if (this.label_node[i].text()=="" && (this.asmtype=="asmRoot" || this.asmtype=="asmStructure" || this.asmtype=="asmUnit" ))
				this.label_node[i].text("&nbsp;"); // to be able to edit it
		}
		flag_error = 'd';
		//------------------------------
		var resource = null;
		this.resource_type = null;
		this.resource = null;
		if (this.asmtype=='asmContext') {
			flag_error = 'd1';
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",node);
			this.resource_type = $(resource).attr("xsi_type");
			var restype = this.resource_type;
			this.resource = new UIFactory[this.resource_type](node);
			flag_error = 'd2';
		}
		//------------------------------
		flag_error = 'e';
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
		flag_error = 'f';
		this.metadata = node.querySelector("metadata");
		this.metadatawad = node.querySelector("metadata-wad");
		this.metadataepm = node.querySelector("metadata-epm");
		this.semantictag = this.metadata.getAttribute('semantictag');
		if (this.semantictag==undefined) // for backward compatibility - node without semantictag attribute
			this.semantictag='';
		//--------------------
		flag_error = 'g';
		if ($("version",$("asmResource[xsi_type='nodeRes']",node)[0]).length==0){  // for backward compatibility
			var newelement = createXmlElement("version");
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newelement);
		}
		this.version_node = $("version",$("asmResource[xsi_type='nodeRes']",node)[0]);
		//--------------------
		flag_error = 'h';
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
		if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - if multilingual we set all languages
			this.version_node.text("3.0");
			var value1 = $(this.label_node[0]).text();
			var value2 = $(this.context_text_node[0]).text();
			for (var i=0; i<languages.length; i++) {
				$(this.label_node[i]).text(value1);
				$(this.context_text_node[i]).text(value2);
			}
			this.save();
		}
		//------------------------------
		flag_error = 'i';
		this.display = {}; // to refresh after changes
		this.display_label = {}; // to refresh after changes
		this.display_node = {}; // to refresh after changes (metadataepm)
		this.display_context = {}; // to refresh after changes (metadataepm)
		//------------------------------
		flag_error = 'j';
		this.structured_resource = null;
		if (this.xsi_type!="null" && this.xsi_type!=null && this.xsi_type!=undefined && this.xsi_type!='' && this.xsi_type != this.asmtype) { // structured resource
			this.structured_resource = new UIFactory[this.xsi_type](node);
		}
		//--------------------
		this.displaytest = this.metadata.getAttribute('displaytest');
		this.displayclick = this.metadata.getAttribute('displayclick');
		//--------------------
		if ($("lastmodified",$("asmResource[xsi_type='nodeRes']",node)).length==0){  // for backward compatibility
			var newelement = createXmlElement("lastmodified");
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newelement);
		}
		this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='nodeRes']",node)[0]);
		//--------------------
	}
	catch(err) {
		alertHTML("UIFactory.Node -- flag_error:"+flag_error+"--"+err.message+"--id:"+this.id+"--resource_type:"+this.resource_type+"--asmtype:"+this.asmtype+"--xsi_type:"+this.xsi_type);
	}
};



//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].prototype.displayNode = function(type,root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock,refresh)
//==============================================================================
//==============================================================================
//==============================================================================
{
	if (refresh==null)
		refresh = false;
	var uuid = this.id;
	this.display_node = {};
	this.display_node[dest] = {"type":type,"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":type,"parent":parent,"menu":menu,"inblock":inblock};
	this.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock);
	var alreadyDisplayed = false;
	//---------------------------------------
	if (this.visible && this.langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && testIfDisplay(uuid)) {
		var node = UICom.structure.ui[uuid];
		var structure_node =   node.resource==null 
							|| node.resource.type!='Proxy' 
							|| (node.resource.type=='Proxy' && this.writenode && this.editresroles.containsArrayElt(g_userroles)) 
							|| (g_userroles[0]=='designer' || USER.admin);
		if (structure_node) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)  // in designer mode depending the role played the node may be not readable
				readnode = (g_userroles[0]=='designer' 
							|| this.seenoderoles.indexOf(USER.username_node.text())>-1 || this.seenoderoles.indexOf(g_userroles[0])>-1 || (this.showtoroles.indexOf(g_userroles[0])>-1 && !this.privatevalue) || (this.showtoroles.indexOf(USER.username_node.text())>-1 && !this.privatevalue) || this.seenoderoles.indexOf('all')>-1)? true : false;
			//----------------------------------------------
			if( this.depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var proxy_parent = proxies_parent[uuid];
					if (proxy_parent==dest.substring(8) || dest=='contenu') { // dest = {parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer') && g_edit;
					}
			}
			//============================== ASMCONTEXT =============================
			if (this.nodetype == "asmContext" || (this.structured_resource != null && type!='raw' && this.semantictag!='EuropassL')){
				eltDisplayed(uuid);
				alreadyDisplayed = true;
				this.displayAsmContext(dest,type,langcode,edit,refresh,depth);
			}
			//============================== NODE ===================================
			else { // other than asmContext
				eltDisplayed(uuid);
				this.displayAsmNode(dest,type,langcode,edit,refresh,depth);
			}
			//----------- help ---------------------------------------------
			var data = this.node;
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				if (this.depth>0 || this.nodetype == "asmContext") {
					let help_text = "";
					let helplang = 0;
					let attr_help = $($("metadata-wad",data)[0]).attr('help');
					let help_items = attr_help.split(";"); // lang1/lang2,roles;lang1/lang2,roles
					for (let i=0; i<help_items.length; i++){
						let display_help = false;
						let helps = help_items[i];
						if (help_items[i].lastIndexOf(",")>help_items[i].lastIndexOf("@")) {
							let roles = help_items[i].substring(help_items[i].lastIndexOf(",")+1);
							if (roles.indexOf(this.userrole)>-1 || roles.indexOf(g_userroles[0])>-1 || USER.admin || g_userroles[0]=='designer')
							display_help = true;
							helps = help_items[i].substring(0,help_items[i].lastIndexOf(","));
						} else {
							display_help = true;
						}
						helps = help_items[i].split("/"); // lang1/lang2/...
						for (let j=0; j<helps.length; j++){
							if (helps[j].indexOf("@"+languages[langcode])>-1)
								helplang =j;
						}
						if (display_help){
							help_text += helps[helplang].substring(0,helps[helplang].indexOf("@"));
							let help = " <a class='popinfo'><span class='help fas fa-question-circle'></span></a> ";
							$("#help_"+uuid).html(help);
							$(".popinfo").popover({ 
								placement : 'right',
								container : 'body',
								title:karutaStr[LANG]['help-label'],
								html : true,
								trigger:'hover',
								delay: {'hide': 2000 },
								content: help_text
							});
						}
					}
				}
			}
			// ===========================================================================
			// ================================= For each child ==========================
			// ===========================================================================
			var backgroundParent = UIFactory.Node.getMetadataEpm(this.metadataepm,'node-background-color',false);
			//------------ EuropassL -----------------
			if (this.semantictag=="EuropassL"){
				alreadyDisplayed = true;
				if( node.structured_resource != null )
				{
					node.structured_resource.displayView('content-'+uuid,langcode,'detail',uuid,this.menu);
				}
			}
			//------------ Bubble Map -----------------
			if (this.semantictag.indexOf('bubble_level1')>-1) {
				alreadyDisplayed = true;
				if  (this.seeqrcoderoles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') {
					var map_info = UIFactory.Bubble.getLinkQRcode(uuid);
					$('#map-info_'+uuid).html(map_info);
					$('body').append(qrCodeBox());
					UIFactory.Bubble.getPublicURL(uuid,g_userroles[0]);
				}
			}
			//------------ Tabs SubSection -----------------
			if (this.semantictag.indexOf("tabs-section")>-1){
				alreadyDisplayed = true;
				let html_tabs = "<ul class='tabs-headers nav nav-tabs' role='tablist'>";
				let html_panels = "<div class='tabs-contents tab-content'>";
				for( let i=0; i<root.children.length; ++i ) {
					let childnode = UICom.structure.ui[root.children[i]];
					let childlabel = childnode.getLabel();
					var style = childnode.getLabelStyle();
					html_tabs += "<li class='nav-item'><a class='nav-link' style='"+style+"' href='#display-"+uuid+"-"+i+"' onclick=\"localStorage.setItem('#display-"+uuid+"','-"+i+"')\" role='tab' data-toggle='tab'>"+childlabel+"</a></li>";
					html_panels += "<div role='tabpanel' class='tab-pane' id='display-"+uuid+"-"+i+"'></div>";
				}
				html_tabs += "</ul>";
				html_panels +="</div>";
				$("#content-"+uuid).append (html_tabs);
				$("#content-"+uuid).append (html_panels);
				if (localStorage.getItem('#display-'+uuid)!=undefined){
					$("a[href=\"#display-"+uuid+localStorage.getItem('#display-'+uuid)+"\"]").click();
				} else {
					$("a[href='#display-"+uuid+"-0']").click();
					localStorage.setItem('#display-'+uuid,'-0');
				}
				for( let i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					let original_edit = edit;
					if (this.submitted=='Y' && this.submitall=='Y')
						edit = false;
					childnode.displayNode(type,child, 'display-'+uuid+'-'+i, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
					edit = original_edit;
				}

			}
			//------------ Default  -----------------
			if (!alreadyDisplayed) {
				for( var i=0; i<root.children.length; ++i ) {
					// Recurse
					let child = UICom.structure.tree[root.children[i]];
					let childnode = UICom.structure.ui[root.children[i]];
					let childsemtag = $(childnode.metadata).attr('semantictag');
					let original_edit = edit;
					if (this.submitted=='Y' && this.submitall=='Y')
						edit = false;
					childnode.displayNode(type,child, 'content-'+uuid, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
					edit = original_edit;
				}
			}
			//-------------------------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			$(".pickcolor").colorpicker();
			//----------------------------
		}
	} //---- end of visible
};

//==================================================
UIFactory["Node"].prototype.displayAsmContext = function (dest,type,langcode,edit,refresh)
//==================================================

{
	if (type==null)
		type = 'standard';
	var uuid = this.id;
	//---------if designer is playing roles we set rights-----------------------------
	if (g_designerrole) {
		this.writenode = (this.editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (this.editresroles.containsArrayElt(g_userroles))? true : false;
	}
	if (g_userroles[0]=='designer') {
		this.writenode = (this.editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (this.editresroles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode)
			this.writenode = (g_userroles[0]=='designer')? true : false;
	}
if (execJS(this,"display-if")) {
		//---------------- DISPLAY HTML -------------------------------
		var html = "";
		var displayview = "";
		var resourcetype = this.resource_type;
		if (this.displayview!='' & type!='raw') {
			var newtype = this.displayview;
			html = displayHTML[type+"-resource-"+newtype];
			displayview = type+"-resource-"+newtype;
			if (html==undefined) {
				html = displayHTML[type+"-resource-"+resourcetype+"-"+newtype];
				displayview = type+"-resource-"+resourcetype+"-"+newtype;
			}
			if (html==undefined) {
				alert("error: "+newtype+" does not exist");
				html = displayHTML[type+"-resource-default"];
				displayview = type+"-resource-default";
			}
		}
		else
			if (type=='raw') {
				html = displayHTML["raw-resource-default"];
				displayview = "raw-resource-default";
			} else {
				html = displayHTML[type+"-resource-default"];
				displayview = type+"-resource-default";
			}
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#resourcetype#/g,this.resource_type).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg);
		if (this.privatevalue)
		 html = html.replace(/#priv#/g,'private');
		//-------------------- display ----------------------
		if (!refresh) {
			$("#"+dest).append (html);
		} else {
			$("#node_"+this.id).replaceWith(html);
		}
		//-------------------- STYLES ---------------------------------------
		var style = "";
		//-------------------- node style -------------------
		style = replaceVariable(this.getNodeStyle(uuid));
		$("#node_"+uuid).attr("style",style);
		//-------------------- label style -------------------
		style = replaceVariable(this.getLabelStyle(uuid));
		$("*[name='res-lbl-div']","#node_"+uuid).attr("style",style);
		//-------------------- resource style -------------------
		style = replaceVariable(this.getContentStyle());
		$("*[name='res-div']","#node_"+uuid).attr("style",style);
		//---------------- display resource ---------------------------------
		if (this.edit && this.inline && this.writenode && this.editable_in_line)
			this.resource.displayEditor("resource_"+uuid,null,langcode,false,this.inline);
		else if (this.structured_resource != null && type!='raw') {
			this.structured_resource.displayView("resource_"+uuid,null,langcode);
		}
		else
			this.resource.displayView("resource_"+uuid);
		//---------------- display label ---------------------------------
		$("#label_node_"+uuid).html(this.getView('label_node_'+uuid));
		//----------- Buttons & Menus -----------
		const menus_color = this.getMenuStyle();
		if(edit) {
			var buttons = "";
			if (this.xsi_type!=undefined && this.xsi_type.indexOf("Block")>-1) {
				buttons += this.structured_resource.getButtons();
			}
			buttons += this.getButtons();
			//------------- print button -------------------
			if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				buttons += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			}
			if (buttons!="")
				buttons = "<div class='btn-group'>"+buttons+"</div><!-- class='btn-group' -->"
			$("#buttons-"+uuid).html(buttons);
	
			if (this.menu)
				this.displayMenus("#menus-"+uuid,langcode);
		} else {
			//------------- print button -------------------
			if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				var buttons = "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
				$("#buttons-"+uuid).html(buttons);
			}
		}
		//----------------delete control on proxy parent ------------
		if (edit && proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
			var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit","null","null","this");
			$("#buttons-"+uuid).html(html);
		}
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				html += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"javascript:printSection('#node_"+this.id+"')\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		//----------------------- if compact view -----------------------------
		if (displayview=='standard-resource-compact')
			showHideCompactEditElts(uuid);
		//----------------- hide lbl-div if empty ------------------------------------
		if (this.getLabel(null,'none',langcode)=="" && this.getButtons(langcode)=="" && this.getMenus(langcode)=="")
			if (this.displayview=='xwide' || this.displayview.indexOf("/12")>-1)
				$("div[name='res-lbl-div']","#node_"+uuid).hide();
		//----------- Comments -----------
		if (this.edit && this.inline && this.writenode && (
				g_userroles[0]=='designer'
				|| this.commentnoderoles.indexOf(g_userroles[0])>-1 
				|| this.commentnoderoles.indexOf($(USER.username_node).text())>-1
				))
			UIFactory.Node.displayCommentsEditor('comments_'+uuid,UICom.structure.ui[uuid]);
		else
			UIFactory.Node.displayComments('comments_'+uuid,UICom.structure.ui[uuid]);
		//--------------------Metadata Info------------------------------------------
		if (g_userroles[0]=='designer' || USER.admin) {  
			this.displayMetainfo("metainfo_"+uuid);
			this.displayMetaEpmInfo("cssinfo_"+uuid);
		}
		//-------------------------------------------------
	}

}

//==================================================
UIFactory["Node"].prototype.displayAsmNode = function(dest,type,langcode,edit,refresh,depth)
//==================================================
{
	var nodetype = this.asmtype;
	var uuid = this.id;
	var html = "";

	if (nodetype=='asmUnitStructure')
		this.depth=100;	
	var displayview = "";
	//---------------- DISPLAY ------------------------------- // .replace("#content-orgclass#","row row-cols-2");
	if (this.depth!=1 && this.depth<10 && nodetype=='asmStructure') {
		if (this.displayview!='' & type!='raw')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		$("#"+dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,1,type,langcode,g_edit)});
	} else if (this.depth!=1 && this.depth<10 && nodetype=='asmUnit') {
		if (this.displayview!='' & type!='raw')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		$("#"+dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,100,type,langcode,g_edit)});
	} else {
		if (this.displayview!='' & type!='raw')
				displayview = type+"-node-"+this.displayview;
		else
			if (type=='raw')
				displayview = "raw-node-default";
			else
				displayview = type+"-node-default";
		try {
			html = displayHTML[displayview];
			if (html==undefined || html==""){
				alert("error: "+this.displayview+" does not exist");
				displayview = type+"-node-default";
				html = displayHTML[displayview];
			}
		}
		catch (err) {
			alert("error: "+this.displayview+" does not exist");
			displayview = type+"-node-default";
			html = displayHTML[displayview];
		}
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		html = html.replace(/#node-orgclass#/g,this.displayitselforg)
		html = html.replace(/#content-orgclass#/g,this.displaychildorg)
		if (this.privatevalue)
		 html = html.replace(/#priv#/g,'private');
		if (nodetype=='asmUnit' || nodetype=='asmStructure')
			html = html.replace(/#first#/g,"first-node");
		if (!refresh) {
			$("#"+dest).append (html);
		} else {
			$("#node_"+this.id).replaceWith(html);
		}
	}
	//-------------------- node style -------------------
	var style = "";
	if (this.depth>0 && type!='raw') {
		style = replaceVariable(this.getNodeStyle(uuid));
		$("#node_"+uuid).attr("style",style);
	}
	const menus_color = this.getMenuStyle();
	//-------------------- label style -------------------
	if (this.depth>1) {
		style = UIFactory.Node.getLabelStyle(uuid);
	} else {
		style = UIFactory.Node.getInParentLabelStyle(uuid);
	}
	style = replaceVariable(style);
	if (type!='raw')
		$("div[name='lbl-div']","#node_"+uuid).attr("style",style);
	//-------------------- content style -------------------
	if (type!='model' && type!='raw') {
		style = replaceVariable(this.getContentStyle(uuid));
		$("div[name='cnt-div']","#node_"+uuid).attr("style",style);
	}
	//-------------------- collapsible -------------------
	if (this.collapsible=='Y') {
		$("#collapsible_"+uuid).show();
		$("#collapsible_"+uuid).html("<span id='toggleContent_"+uuid+"' class='button' style='"+menus_color+"'></span>");
		$("#collapsible_"+uuid).attr("onclick","javascript:toggleContent('"+uuid+"')");
		if (this.collapsed=='Y') {
			$("#toggleContent_"+uuid).attr("class","fas fa-plus");
			$("#content-"+uuid).hide();
		}
		else {
			$("#toggleContent_"+uuid).attr("class","fas fa-minus");
			$("#content-"+uuid).show();
		}
	} else
		$("#collapsible_"+uuid).hide();
	//-------------- label --------------------------
	var gotView = false;
	var label_html = ""
	if (this.semantictag.indexOf("bubble_level1")>-1){
		label_html += " "+UICom.structure.ui[uuid].getBubbleView('std_node_'+uuid);
		gotView = true;
	}
	if (!gotView)
		label_html += " "+ this.getView('std_node_'+uuid);
	$("#label_node_"+uuid).html(label_html);
	//--------- chckbox comment in report/batch--------------
	var html_chckbox = "<span class='chkbox-comments x"+this.semantictag+" '>&nbsp;<input ";
	if (this.semantictag.indexOf('comments')>-1)
		html_chckbox += "checked=true";
	html_chckbox += " type='checkbox' onchange=\"UIFactory.Node.toggleComment('"+uuid+"',this)\">&nbsp;"+karutaStr[LANG]['report-elt-disabled']+"<span>";
	$("div[class='title']","#label_node_"+uuid).append(html_chckbox);
	//-------------- buttons & menus --------------------------
	if (edit) {
		if (this.semantictag.indexOf("bubble_level1")>-1)
			this.menu = false;
		var buttons = this.getButtons(null,null,null,null,depth);  //getButtons = function(dest,type,langcode,inline,depth,edit,menu,inblock)
		if (nodetype == "BatchForm") {
			buttons += node.structured_resource.getButtons();
		}
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1 || this.printroles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
				buttons += "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (buttons!="")
			buttons = "<div class='btn-group'>"+buttons+"</div><!-- class='btn-group' -->"
		$("#buttons-"+uuid).html(buttons);
		//-------------- menus ---------------
		if (this.menu || USER.admin || g_userroles[0]=='administrator')
			this.displayMenus("#menus-"+uuid,langcode);
	} else {
		//------------- print button -------------------
		if ((this.printroles.containsArrayElt(g_userroles) || this.printroles.indexOf($(USER.username_node).text())>-1|| this.printroles.indexOf("all")>-1  || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
			var buttons = "<span class='button fas fa-print' style='"+menus_color+"' onclick=\"printSection('#node_"+this.id+"',"+g_report_edit+")\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			$("#buttons-"+uuid).html(buttons);
		}
	}
	//----------------delete control on proxy parent ------------
	if (edit && proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
		var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit","null","null","this");
		$("#buttons-"+uuid).html(html);
	}
	//----------- Comments -----------
	if (this.depth>0) {
		if (this.edit && this.inline && this.writenode)
			UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure.ui[uuid]);
		else
			UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure.ui[uuid]);
	}
	//--------------------Metadata Info------------------------------------------
	if (g_userroles[0]=='designer' || USER.admin) {  
		this.displayMetainfo("metainfo_"+uuid);
		this.displayMetaEpmInfo("cssinfo_"+uuid);
	}
	//--------------------Portfolio code------------------------------------------
	if ((g_userroles[0]=='reporter' || g_userroles[0]=='designer' || USER.admin) && nodetype=='asmRoot') {
		$("#portfoliocode_"+uuid).html(this.getCode());
	}
	//----------------- hide lbl-div if empty ------------------------------------
	if (this.getLabel(null,'none',langcode)=="" && this.getButtons()=="" && this.getMenus(langcode)=="")
		$("div[name='lbl-div']","#node_"+uuid).hide()
	//------------------------------------------------------------------------------
	execJS(this,"display-node-after");
}

//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].prototype.displayTranslateNode = function(type,root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock,refresh)
//==============================================================================
//==============================================================================
//==============================================================================
{
	if (depth<0)
		return;
	if (this.nodetype=='asmUnitStructure')
		depth = 100;	
	var uuid = this.id;
	this.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock);
	this.display_node[dest] = {"type":type,"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":type,"parent":parent,"menu":menu,"inblock":inblock};
	//============================== ASMCONTEXT =============================
	if (this.nodetype == "asmContext" || (this.structured_resource != null && type!='raw' && this.semantictag!='EuropassL')){
		var uuid = this.id;
		//---------------- DISPLAY HTML -------------------------------
		var html = "";
		var displayview = "translate-resource-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#resourcetype#/g,this.resource_type).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		//-------------------- display ----------------------
		if (!refresh) {
			$("#"+dest).append (html);
		} else {
			$("#node_"+this.id).replaceWith(html);
		}
		//---------------- display resource ---------------------------------
		try {
			if (this.structured_resource != null) {
				this.structured_resource.displayEditor("resource0_"+uuid,null,g_translate[0],false);
				if (this.multilingual)
					this.structured_resource.displayEditor("resource1_"+uuid,null,g_translate[1],false);
				else
					$("#resource1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
			} else {
			this.resource.displayEditor("resource0_"+uuid,null,g_translate[0],false);
			if (this.resource.multilingual)
				this.resource.displayEditor("resource1_"+uuid,null,g_translate[1],false);
			else
				$("#resource1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
			}
		} catch(e){
			$("#resource0_"+uuid).append(this.resource.getEditor("resource0_"+uuid,null,g_translate[0],false));
			if (this.resource.multilingual)
				$("#resource1_"+uuid).append(this.resource.getEditor("resource1_"+uuid,null,g_translate[1],false))
			else
				$("#resource1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
		}
		//---------------- display label ---------------------------------
		$("#label0_"+uuid).append(this.getNodeLabelEditor(null,g_translate[0]));
		if (this.multilingual)
			$("#label1_"+uuid).append(this.getNodeLabelEditor(null,g_translate[1]));
		else
			$("#label1_"+uuid).html(karutaStr[LANG]['label-not-multilingual']);
		//---------------- comments ---------------------------------
		UIFactory.Node.displayCommentsEditor('comments0_'+uuid,UICom.structure.ui[uuid],null,g_translate[0]);
		if (this.multilingual)
			UIFactory.Node.displayCommentsEditor('comments1_'+uuid,UICom.structure.ui[uuid],null,g_translate[1]);
		else
			$("#comments1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
	}
	//============================== NODE ===================================
	else { // other than asmContext
		var nodetype = this.asmtype;
		var uuid = this.id;
		var html = "";
		var displayview = "translate-node-default";
		//---------------- DISPLAY HTML -------------------------------
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semantictag).replace(/#cssclass#/g,this.cssclass);
		//-------------------- display ----------------------
		if (!refresh) {
			$("#"+dest).append (html);
		} else {
			$("#node_"+this.id).replaceWith(html);
		}
		//-------------- display structured resource or label --------------------------
		if (this.structured_resource != null) {
			this.structured_resource.displayEditor("resource0_"+uuid,null,g_translate[0],false);
			if (this.multilingual)
				this.structured_resource.displayEditor("resource1_"+uuid,null,g_translate[1],false);
			else
				$("#resource1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
		} else {
			$("#label0_"+uuid).append(this.getNodeLabelEditor(null,g_translate[0]));
			if (this.multilingual)
				$("#label1_"+uuid).append(this.getNodeLabelEditor(null,g_translate[1]));
			else
				$("#label1_"+uuid).html(karutaStr[LANG]['label-not-multilingual']);
		}
		//---------------- comments ---------------------------------
			UIFactory.Node.displayCommentsEditor('comments0_'+uuid,UICom.structure.ui[uuid],null,g_translate[0]);
		if (this.multilingual)
			UIFactory.Node.displayCommentsEditor('comments1_'+uuid,UICom.structure.ui[uuid],null,g_translate[1]);
		else
			$("#comments1_"+uuid).html(karutaStr[LANG]['resource-not-multilingual']);
		// ===========================================================================
		// ================================= For each child ==========================
		// ===========================================================================
		if (this.structured_resource == null)
			for( var i=0; i<root.children.length; ++i ) {
				// Recurse
				var child = UICom.structure.tree[root.children[i]];
				var childnode = UICom.structure.ui[root.children[i]];
				var childsemtag = $(childnode.metadata).attr('semantictag');
				childnode.displayTranslateNode(type,child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent,root,menu);
			}
		//-------------------------------------------------------
	}
};

//==================================
UIFactory["Node"].prototype.getUuid = function()
//==================================
{
	return this.id;
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
UIFactory["Node"].prototype.getContext = function(dest,type,langcode)
//==================================
{
	if (dest!=null) {
		this.display_context[dest] = true;
	}
	//---------------------
	if (type==null)
		type = 'span';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html = "";
	var text = this.context_text_node[langcode].text();
	if (type=="div")
		html =   "<div>"+text+"</div>";
	if (type=="span")
		html =   "<span>"+text+"</span>";
	if (type=="none")
		html = text;
	return html;
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
	if (dest!=null)
		this.display_label[dest]=type;
	//---------------------
	var html = "";
	var label = this.label_node[langcode].text();
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
	var html = "";
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	if(this.editcoderoles==undefined)
		this.setMetadata();

	//---------------------
	if (g_userroles[0]=='designer' || USER.admin || this.metadatawad.getAttribute('display')!='N') {
		//-----------------------------
		if (type=="default")
			html += "<div><div class='title'";
		if (type=="span")
			html += "<span class='title'";
		//----------------------------
		var style ="";
//		var metadataepm = this.metadataepm;
//		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-size',true);
//		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-weight',false);
//		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-style',false);
//		style += UIFactory.Node.getMetadataEpm(metadataepm,'color',false);
//		style += UIFactory.Node.getMetadataEpm(metadataepm,'text-align',false);
//		style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'othercss');
		if (style.length>0)
			html += " style='"+style+"' ";
		//----------------------------
		html += ">";
		//----- code -----
		var displayCodeValue = (this.editcoderoles.containsArrayElt(g_userroles) || this.editcoderoles.indexOf(this.userrole)>-1 || this.editcoderoles.indexOf($(USER.username_node).text())>-1) && this.nodenopencil=='N';
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userroles[0]=='designer' || USER.admin || displayCodeValue)) {
			html += "<span class='ncode'>"+this.code_node.text()+"</span> ";
		}
		//----- label -----
		var label = this.label_node[langcode].text();
		if (label == "")
			label="&nbsp;";
		html += "<span class='nlabel'>"+label+"</span><span id='help_"+this.id+"' class='ihelp'></span>";
		//----- value -----
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userroles[0]=='designer' || USER.admin || displayCodeValue)) {
			if (this.value_node.text()!='')
				html += "<span name='value'> ["+ this.value_node.text() + "] </span>";
		}
		//-----------------------------
		if (type=="default")
			html += "</div><div class='title-subline'></div></div>";
		if (type=="span")
			html += "</span>";
	}
	return html;
};

//==================================
UIFactory["Node"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Node"].prototype.updateLabel = function(langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var label = sanitizeText($.trim($("#label_"+this.id+"_"+langcode).val()));
	$(this.label_node[langcode]).text(label);
	$(UICom.structure.ui[this.id].label_node[LANGCODE]).text(label);
	$("label[lang='"+languages[langcode]+"']",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(label);// new
	//---------------------
	if (!this.multilingual) {
		for (var i=0; i<languages.length; i++) {
			$(this.label_node[i]).text(label);
			$(UICom.structure.ui[this.id].label_node[i]).text(label);
			$("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(label);// new
		}
	}
	//---------------------
	this.save();
	execJS(this,"update-node-after");
	writeSaved(this.id);
};

//==================================
UIFactory["Node"].prototype.update = function(langcode)
//==================================
{
	if (execJS(this,"update-node-if")) {
		execJS(this,"update-node-before");
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		//---------------------
		if ($("#code_"+this.id).length){
			var code = sanitizeText($.trim($("#code_"+this.id).val()));
			$(this.code_node).text(code);
			$(UICom.structure.ui[this.id].code_node).text(code);
			$("code",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(code); // new
		}
		//---------------------
		if ($("#value_"+this.id).length){
			var value = sanitizeText($.trim($("#value_"+this.id).val()));
			$(this.value_node).text(value);
			$(UICom.structure.ui[this.id].value_node).text(value);
			$("value",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(value); // new
		}
		//---------------------
		var label = sanitizeText($.trim($("#label_"+this.id+"_"+langcode).val()));
		$(this.label_node[langcode]).text(label);
		$(UICom.structure.ui[this.id].label_node[langcode]).text(label);
		$("label[lang='"+languages[langcode]+"']",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(label);// new
		//---------------------
		if (!this.multilingual) {
			for (var i=0; i<languages.length; langcode++) {
				$(this.label_node[i]).text(label);
				$(UICom.structure.ui[this.id].label_node[i]).text(label);
				$("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",$("#"+this.id,g_portfolio_current))[0]).text(label);// new
			}
		}
		//---------------------
		this.save();
		execJS(this,"update-node-after");
		writeSaved(this.id);
	}
};


//==================================
UIFactory["Node"].prototype.getNodeLabelEditor = function(type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var self = this;
	var inputLabel = "<input class='form-control' id='label_"+this.id+"_"+langcode+"' type='text'  value=\""+this.label_node[langcode].text()+"\">";
	var objLabel = $(inputLabel);
	$(objLabel).change(function (){
		self.updateLabel(langcode);
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
	var self = this;
	var div = $("<div></div>");
	$(div).append($("<br>"));
	//-----------------------------
	var editcoderoles = $(this.metadatawad).attr('editcoderoles');
	if (editcoderoles==undefined)
		editcoderoles="";
	var editnoderoles = $(this.metadatawad).attr('editnoderoles');
	if (editnoderoles==undefined)
		editnoderoles="";
	var seecalendarroles = $(this.metadatawad).attr('seecalendarroles');
	if (seecalendarroles==undefined)
		seecalendarroles="";
	if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
		var htmlFormObj = $("<form class='form-horizontal'></form>");
		var query = replaceVariable($(this.metadatawad).attr('query'));
		if (query==undefined || query=='' || this.asmtype=='asmContext' || g_display_type=='raw'){
			if (g_userroles[0]=='designer' || USER.admin || editcoderoles.containsArrayElt(g_userroles) || editcoderoles.indexOf(this.userrole)>-1 || editcoderoles.indexOf($(USER.username_node).text())>-1) {
				//---------------------- code ----------------------------
				var htmlCodeGroupObj = $("<div class='form-group ncode'></div>")
				var htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['code']+"</label>");
				var htmlCodeDivObj = $("<div class='node-code'></div>");
				var htmlCodeInputObj = $("<input id='code_"+this.id+"' type='text' class='form-control' name='input_code' value=\""+this.code_node.text()+"\">");
				$(htmlCodeInputObj).change(function (){
					self.update(langcode);
				});
				$(htmlCodeDivObj).append($(htmlCodeInputObj));
				$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
				$(htmlCodeGroupObj).append($(htmlCodeDivObj));
				$(htmlFormObj).append($(htmlCodeGroupObj));
				//---------------------- value ----------------------------
				var htmlValueGroupObj = $("<div class='form-group nvalue'></div>")
				var htmlValueLabelObj = $("<label for='value_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['value']+"</label>");
				var htmlValueDivObj = $("<div class='node-value'></div>");
				var htmlValueInputObj = $("<input id='value_"+this.id+"' type='text' class='form-control' name='input_value' value=\""+this.value_node.text()+"\">");
				$(htmlValueInputObj).change(function (){
					self.update(langcode);
				});
				$(htmlValueDivObj).append($(htmlValueInputObj));
				$(htmlValueGroupObj).append($(htmlValueLabelObj));
				$(htmlValueGroupObj).append($(htmlValueDivObj));
				$(htmlFormObj).append($(htmlValueGroupObj));
			}
			if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
				var htmlLabelGroupObj = $("<div class='form-group nlabel'></div>")
				var htmlLabelLabelObj = $("<label for='label_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
				var htmlLabelDivObj = $("<div class='node-label'></div>");
				var htmlLabelInputObj = $("<input id='label_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.label_node[langcode].text()+"\">");
				$(htmlLabelInputObj).change(function (){
					self.updateLabel(langcode);
				});
				$(htmlLabelDivObj).append($(htmlLabelInputObj));
				$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
				$(htmlLabelGroupObj).append($(htmlLabelDivObj));
				$(htmlFormObj).append($(htmlLabelGroupObj));
			}
		} else {
			var htmlGetResource = $("<div id='get-resource-node'></div>")
			if (query.indexOf('child')+query.indexOf('sibling')+query.indexOf('parent')+query.indexOf('#')+query.indexOf('itself')>-5) //  if not present give -1
				htmlGetResource = $("<div id='get-get-resource-node'></div>")
			$(htmlFormObj).append($(htmlGetResource));
		}

		$(div).append($(htmlFormObj));
		if (seecalendarroles.containsArrayElt(g_userroles) || seecalendarroles.indexOf(this.userrole)>-1 || seecalendarroles.indexOf($(USER.username_node).text())>-1) {
			$("#edit-window-body-other").append("<form id='form-other' class='metadata'></form>")
			this.displayMetadataDateAttributeEditor('form-other','seestart');
			this.displayMetadataDateAttributeEditor('form-other','seeend');
		}

	}
	//--------------- set editbox title --------------
	var title = "&nbsp;"; // karutaStr[LANG]['edit'];
	if (this.label_node[langcode].text()!='')
		title = this.label_node[langcode].text();
	var editboxtitle =$(this.metadatawad).attr('editboxtitle');
	if (editboxtitle!=undefined && editboxtitle!="") {
		var titles = [];
		try {
			titles = editboxtitle.split("/");
			if (editboxtitle.indexOf("@")>-1) { // lang@fr/lang@en/...
				for (var j=0; j<titles.length; j++){
					if (titles[j].indexOf("@"+languages[langcode])>-1)
						title = titles[j].substring(0,titles[j].indexOf("@"));
				}
			} else { // lang1/lang2/...
				title = editboxtitle;
			}
		} catch(e){
			title = editboxtitle;
		}
	}
	$("#edit-window-title").html(title);
	//------------- write resource type in the upper right corner ----------------
	if (g_userroles[0]=='designer' || USER.admin){
		if (this.asmtype=='asmContext')
			$("#edit-window-type").html(karutaStr[languages[LANGCODE]][this.resource_type]);
		else
			$("#edit-window-type").html(karutaStr[languages[LANGCODE]][this.asmtype]);
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
	$(this.lastmodified_node).text(new Date().getTime());
	//------------------------------
	UICom.UpdateNode(this.node);
	//-------- if function js -------------
	if (this.js==undefined)
		this.set
	if (this.js!=undefined && this.js!="") {
		var fcts = this.js.split(";");
		for (var i=0;i<fcts.length;i++) {
			var elts = fcts[i].split("/");
			if (elts[0]=="update-node") {
				if (elts[1].indexOf("(")<0)
					eval(elts[1]+"(this.id)");
				else
					eval(replaceVariable(elts[1],this.node));
			}
		}
	}
	//------------------------------------
	if (this.logcode!="")
		this.log();
	this.refresh();
};

//==================================
UIFactory["Node"].prototype.remove = function()
//==================================
{
	UIFactory.Node.remove(this.id);
};

//==================================
UIFactory["Node"].remove = function(uuid,callback,param1,param2,param3,param4)
//==================================
{
/*	
 	const itself = UICom.structure.ui[uuid];  // context node
	if (execJS(itself,"delete-if")) {
		//----
		execJS(itself,"delete-before");
		//----
		$("#"+uuid,g_portfolio_current).remove();
		UICom.DeleteNode(uuid,callback,param1,param2,param3,param4);
		//----
		execJS(itself,"delete-afterf")
		//----
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
		alertHTML(karutaStr[LANG]['error-delete'])
	}
*/
	let remove = true;
	//-------- if function js -------------
	if (UICom.structure.ui[uuid].js==undefined){
		var node = UICom.structure.ui[uuid];
		UICom.structure.ui[uuid].js = ($(node.metadatawad).attr('js')==undefined)?"":$(node.metadatawad).attr('js');
	}
	if (UICom.structure.ui[uuid].js!=undefined && UICom.structure.ui[uuid].js!="") {
		var fcts = UICom.structure.ui[uuid].js.split("|");
		for (var i=0;i<fcts.length;i++) {
			var elts = fcts[i].split("/");
			if (elts[0]=="delete" || elts[0]=="delete-before") {
				if (elts[1].indexOf("(")<0)
					eval(elts[1]+"(uuid)");
				else
					eval(replaceVariable(elts[1],UICom.structure.ui[uuid]));
			}
			if (elts[0]=="delete-if") {
				if (elts[1].indexOf("(")<0) 
					remove = eval(elts[1]+"(uuid)");
				else
					remove = eval(replaceVariable(elts[1],UICom.structure.ui[uuid]));
			}
		}
	}
	//------------------------------------
	if (remove) {
		$("#"+uuid,g_portfolio_current).remove();
		var fcts = UICom.structure.ui[uuid].js.split("|");
		UICom.DeleteNode(uuid,callback,param1,param2,param3,param4);
		var fcts = UICom.structure.ui[uuid].js.split("|");
		for (var i=0;i<fcts.length;i++) {
			var elts = fcts[i].split("/");
			if (elts[0]=="delete-after") {
				if (elts[1].indexOf("(")<0)
					eval(elts[1]+"(uuid)");
				else
					eval(replaceVariable(elts[1],UICom.structure.ui[uuid]));
			}
		}
	} else {
		$('#delete-window').modal('hide');
		$('#wait-window').modal('hide');
		alertHTML(karutaStr[LANG]['error-delete'])
	}
};

//==================================
UIFactory["Node"].prototype.refresh = function()
//==================================
{
//	for (dest1 in this.display) {
//		$("#"+dest1).html(this.getView(null,null,this.display[dest1]));
//	};
	for (dest2 in this.display_label) {
		$("#"+dest2).html(this.getLabel(null,this.display_label[dest2],null));
	};

	for (dest3 in this.display_node) {
		if (this.display_node[dest3].type=='translate')
			this.displayTranslateNode(this.display_node[dest3].type,this.display_node[dest3].root, this.display_node[dest3].dest, this.display_node[dest3].depth,this.display_node[dest3].langcode,this.display_node[dest3].edit,this.display_node[dest3].inline,this.display_node[dest3].backgroundParent,this.display_node[dest3].parent,this.display_node[dest3].menu,this.display_node[dest3].inblock,true);
		else
			this.displayNode(this.display_node[dest3].type,this.display_node[dest3].root, this.display_node[dest3].dest, this.display_node[dest3].depth,this.display_node[dest3].langcode,this.display_node[dest3].edit,this.display_node[dest3].inline,this.display_node[dest3].backgroundParent,this.display_node[dest3].parent,this.display_node[dest3].menu,this.display_node[dest3].inblock,true);
	};

	for (dest4 in this.display_context) {
		$("#"+dest4).html(this.getContext());
	};

};

//==================================
UIFactory["Node"].duplicate = function(uuid,callback,databack,param2,param3,param4,param5,param6,param7,param8)
//==================================
{
	var destid = $($(UICom.structure.ui[uuid].node).parent()).attr('id');
	$("#wait-window").modal('show');
	var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?uuid="+uuid;  // instance by default
	if (USER.admin || g_userrole=='designer') {
		var rights = UICom.structure.ui[uuid].getRights();
		var roles = $("role",rights);
		if (roles.length==0) // test if model (otherwise it is an instance and we import)
			urlS = serverBCK_API+"/nodes/node/copy/"+destid+"?uuid="+uuid;
	}
	$.ajax({
		async:false,
		type : "POST",
		dataType : "text",
		url : urlS,
		data : "",
		success : function(data) {
			uuid = data;
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes/node/"+uuid,
				success : function(node_data) {
					//------------------------------------------
					var code = $($("code",node_data)[0]).text();
					var value = $($("value",node_data)[0]).text();
					var label = [];
					for (var i=0; i<languages.length;i++){
						label[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node_data)[0]).text();
						var nb = label[i].match(/\d+$/);
						if (nb!=null)
							nb = nb[0];
						if ($.isNumeric(nb)) {
							nb++;
							label[i] = label[i].replace(/\d+$/,nb);
						}
					}
					var nbcode = code.match(/\d+$/);
					if (nbcode!=null)
						nbcode = nbcode[0];
					if ($.isNumeric(nbcode)) {
						nbcode++;
						code = code.replace(/\d+$/,nbcode);
					}
					var nbvalue = value.match(/\d+$/);
					if (nbvalue!=null)
						nbvalue = nbvalue[0];
					if ($.isNumeric(nbvalue)) {
						nbvalue++;
						value = value.replace(/\d+$/,nbvalue);
						$("value",resource).text(value);
						tobesaved = true;
					}
					var xml = "<asmResource xsi_type='nodeRes'>";
					xml += "<code>"+code+"</code>";
					xml += "<value>"+value+"</value>";
					for (var i=0; i<languages.length;i++)
						xml += "<label lang='"+languages[i]+"'>"+label[i]+"</label>";
					xml += "</asmResource>";
					$.ajax({
						async:false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						url : serverBCK_API+"/nodes/node/" + uuid + "/noderesource",
						success : function(data) {
							//------------------------------------------
							if ($(":root",node_data)[0]!=undefined && $(":root",node_data)[0].tagName=='asmContext') {
								var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",node_data);
								if ($(resource).attr("xsi_type")=="Item") {
									var tobesaved = false;
									//-----------------------------
									var code = $('code',resource).text();
									var nbcode = code.match(/\d+$/);
									if (nbcode!=null)
										nbcode = nbcode[0];
									if ($.isNumeric(nbcode)) {
										nbcode++;
										code = code.replace(/\d+$/,nbcode);
										$("code",resource).text(code);
										tobesaved = true;
									}
									//-----------------------------
									var value = $('value',resource).text();
									var nbvalue = value.match(/\d+$/);
									if (nbvalue!=null)
										nbvalue = nbvalue[0];
									if ($.isNumeric(nbvalue)) {
										nbvalue++;
										value = value.replace(/\d+$/,nbvalue);
										$("value",resource).text(value);
										tobesaved = true;
									}
									//-----------------------------
									for (var i=0; i<languages.length;i++){
										label[i] = $("label[lang='"+languages[i]+"']",resource).text();
										var nblabel = label[i].match(/\d+$/);
										if (nblabel!=null)
											nblabel = nblabel[0];
										if ($.isNumeric(nblabel)) {
											nblabel++;
											label[i] = label[i].replace(/\d+$/,nblabel);
											$("label[lang='"+languages[i]+"']",resource).text(label[i]);
											tobesaved = true;
										}
									}
									//-----------------------------
									if (tobesaved) {
										var data = xml2string($(resource)[0]);
										var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
										var urlS = serverBCK_API+'/resources/resource/'+uuid;
										$.ajax({
											async:false,
											type : "PUT",
											dataType : "text",
											contentType: "application/xml",
											url : urlS,
											data : strippeddata,
											success : function (data){
												$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
												$("#wait-window").modal('hide');			
												if (UICom.structure.ui[destid].asmtype=='asmContext')
													UIFactory.Node.reloadUnit();
												else
													UIFactory.Node.reloadStruct();
											},
											error : function(jqxhr,textStatus) {
												alert("Error in duplicate rename : "+jqxhr.responseText);
											}
										});
									}
								}
								$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
								$("#wait-window").modal('hide');
								if (UICom.structure.ui[destid].asmtype=='asmContext')
									UIFactory.Node.reloadUnit();
								else
									UIFactory.Node.reloadStruct();
							} else {
								$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
								$("#wait-window").modal('hide');
								if (UICom.structure.ui[destid].asmtype=='asmContext')
									UIFactory.Node.reloadUnit();
								else
									UIFactory.Node.reloadStruct();
							}
							//------------------------------------------
						},
						error : function(jqxhr,textStatus) {
							alert("Error in duplicate rename : "+jqxhr.responseText);
						}
					});
				}
			});
		},
		error : function(jqxhr,textStatus) {
			$("#wait-window").modal('hide');			
			alert("Error in Node.duplicate "+textStatus+" : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["Node"].prototype.log = function()
//==================================
{
	var srceid = this.id;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/"+this.logcode,
		success : function(data) {
			var destid = $("asmRoot",data).attr("id");
			var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?uuid="+srceid;
			$.ajax({
				type : "POST",
				dataType : "text",
				url : urlS,
				data : "",
				success :{
				},
				error : function(jqxhr,textStatus) {
					alert("Error in Node.log "+textStatus+" : "+jqxhr.responseText);
				}
			});
		}					
	});
}

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- PORTFOLIO MENU ------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//===========================================
UIFactory["Node"].displayPortfolioMenuItem = function(uuid,destid,type,langcode)
//===========================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	const portfolioid = UICom.structure.ui[uuid].resource.uuid_node.text();
	if (portfolioid!="") {
		let html = "";
		html += "<div style='cursor:pointer' class='sidebar-item ";
		if (g_portfolioid==portfolioid)
			html += "portfolio-selected";
		html += "' id='parent-"+uuid+"' role='tablist'>";
		if (g_portfolioid==portfolioid) {
			const rootid = UICom.rootid;
			$("#sidebar_"+rootid).hide();
			html += "	<a id='sidebar_"+rootid+"' onclick=\"displayPage('"+rootid+"',1,'"+type+"','"+langcode+"',"+g_edit+")\">";
			if (UICom.structure.ui[uuid].resource.getAttributes().local_label!='')
				html += UICom.structure.ui[uuid].resource.getAttributes().local_label;
			else
				html += UICom.structure.ui[rootid].getLabel('sidebar_'+rootid);
			html += "	</a>";
		} else {
			html += UICom.structure.ui[uuid].resource.getView();
			html += "</div><!-- panel -->";
		}
		$("#"+destid).append($(html));
	}
}

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- SIDEBAR --------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//===========================================
UIFactory["Node"].displaySidebar = function(root,destid,type,langcode,edit,parentid,open)
//===========================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type=='standard' || type=='translate' || type=='raw') {
		let i = 0;
		while (i<root.children.length)
		{
			let uuid = root.children[i];
			let name = UICom.structure.tree[uuid].node.tagName;
			let resource_type = UICom.structure.ui[uuid].resource_type;
			if (i==0 && resource_type!=null && resource_type == "URL2Portfolio") {
				while (i<root.children.length && resource_type == "URL2Portfolio" ) {
					UIFactory.Node.displayPortfolioMenuItem(uuid,'portfolio_bar',type,langcode,edit,parentid);
					i++;
					uuid = root.children[i];
					resource_type = UICom.structure.ui[uuid].resource_type;
				}
				if ($(".sidebar-item","#portfolio_bar").length<2) {
					$("#portfolio_bar").hide();
					$("#sidebar_"+UICom.rootid).show();
				}
			} else if (name == "asmStructure" || name == "asmRoot" || name == "asmUnit" || (resource_type!=null && resource_type == "URL2Portfolio")) {
				UIFactory.Node.displaySidebarItem(root.children[i],destid,type,langcode,edit,parentid,open);
			}
			i++;
			if ($(".sidebar-item","#portfolio_bar").length<2) {
				$("#portfolio_bar").hide();
				$("#sidebar_"+UICom.rootid).show();
			}
		}
	}};

	//===========================================
	UIFactory["Node"].displaySidebarItem = function(itemid,destid,type,langcode,edit,parentid,open)
	//===========================================
	{
		if (open == undefined)
			open = false;
		var child = UICom.structure.tree[itemid].node;
		var name = child.tagName;
		var uuid = $(child).attr("id");
		var text = UICom.structure.ui[uuid].getLabel('sidebar_'+uuid,'span');
		var node = UICom.structure.ui[uuid];
		var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
		var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)? 'none' : $(node.metadatawad).attr('showtoroles');
		var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
		var langnotvisible = ($(node.metadatawad).attr('langnotvisible')==undefined)?'':$(node.metadatawad).attr('langnotvisible');
		var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
		const resource_type = UICom.structure.ui[uuid].resource_type;
		if (testIfDisplay(uuid) && (langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && (display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || showtoroles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer')))) {
			if(name == "asmUnit")
			{
				var html = "";
				var depth = 99;
				html += "<div class='sidebar-item ";
				if (privatevalue)
					html+= "private"
				html += "' id='parent-"+uuid+"' role='tablist'>";
				html += "  <a style='cursor:pointer' id='sidebar_"+uuid+"' ";
				if (window.innerWidth<700)
					html +="href='#node_"+uuid+"' ";
				else
					html +="href='#' ";
				html +=" class='sidebar-link' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+");pageClick ('"+uuid+"')\" >"+text+"</a>";
				html += "</div><!-- panel -->";
				$("#"+destid).append($(html));
			}
			if(name == "asmStructure" || name == "asmRoot")
			{
				var depth = 1;
				var html = "";
				html += "<div class='sidebar-item ";
				if (privatevalue)
					html+= "private"
				html += "' id='parent-"+uuid+"' role='tablist'>";
				html += "  <div  class='sidebar-link' style='cursor:pointer' redisplay=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" >";
				if (localStorage.getItem('sidebar'+uuid)!=undefined && localStorage.getItem('sidebar'+uuid)=='open')
					html += "  <small ><span onclick=\"toggleSidebarPlusMinus('"+uuid+"')\" id='toggle_"+uuid+"' class='fas fa-minus' style='float:right;padding-left:5px;margin-right:5px;'></span></small>";
				else
					html += "  <small ><span onclick=\"toggleSidebarPlusMinus('"+uuid+"')\" id='toggle_"+uuid+"' class='fas fa-plus' style='float:right;padding-left:5px;margin-right:5px;'></span></small>";
				html += "  <a class='sidebar-link'";
				if (window.innerWidth<700)
					html +="href='#node_"+uuid+"' ";
				else
					html +="href='#' ";
				html += "onclick=\"toggleSidebarPlus('"+uuid+"');displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
				html += "  </div>"
				if (localStorage.getItem('sidebar'+uuid)!=undefined && localStorage.getItem('sidebar'+uuid)=='open' || open)
					html += "<div id='collapse"+uuid+"' class='panel-collapse collapse show' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
				else
					html += "<div id='collapse"+uuid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
				html += "<div id='panel-body"+uuid+"' class='panel-body'></div><!-- panel-body -->";
				html += "</div><!-- panel-collapse -->";
				html += "</div><!-- panel -->";
				$("#"+destid).append($(html));
				UIFactory["Node"].displaySidebar(UICom.structure.tree[itemid],'panel-body'+uuid,type,langcode,g_edit,uuid,open);
			}
			if (name=='asmContext' && resource_type == "URL2Portfolio") {
				var html = "";
				html = "<div class='sidebar-item ";
				if (privatevalue)
					html+= "private"
				html += "' id='parent-"+uuid+"' role='tablist' style='cursor:pointer'>";
				html += UICom.structure.ui[uuid].resource.getView();
				html += "</div><!-- panel -->";
				$("#"+destid).append($(html));
			}
		}

	}


	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------- HORIZONTAL MENU -----------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------
	
	function displaySubMenu(uuid) {
		let html = "<nav id='pagemenu-"+uuid+"' class='menu_bar navbar navbar-expand-md navbar-light bg-lightfont'>";
		html += "	<div class='navbar-collapse collapse navbars";
		if (g_bar_type=='horizontal-right')
			html += " justify-content-end";
		html += "''>";
		html += "<ul id='parentmenu-"+uuid+"' class='navbar-nav'></ul>";
		html += "	</div>";
		html += "	</nav>";
		$("#sub-bar").append($(html));
		const root = UICom.structure.tree[uuid];
		UIFactory.Node.displayHorizontalMenu(root,'parentmenu-'+uuid,'standard',LANGCODE,g_edit,uuid);
	}

	//===========================================
	UIFactory["Node"].displayHorizontalMenu = function(root,destid,type,langcode,edit,parentid,level)
	//===========================================
	{
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		//---------------------
		if (level==null)
			level = 0;
		const welcomeid = $("asmUnit:has(metadata[semantictag*='WELCOME'])",UICom.structure.ui[UICom.rootid].node).attr('id');
		let i = 0;
		while (i<root.children.length)
		{
			let child = UICom.structure.tree[root.children[i]].node;
			let uuid = $(child).attr("id");
			let name = child.tagName;
			let text = UICom.structure.ui[uuid].getLabel('sidebar_'+uuid,'span');
			let node = UICom.structure.ui[uuid];
			let seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
			let showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)? 'none' : $(node.metadatawad).attr('showtoroles');
			let display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
			let langnotvisible = ($(node.metadatawad).attr('langnotvisible')==undefined)?'':$(node.metadatawad).attr('langnotvisible');
			let privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
			let resource_type = UICom.structure.ui[uuid].resource_type;
			const semantictag = UICom.structure.ui[uuid].semantictag;
			const hm = (semantictag.indexOf('sub-menu')>-1);
			const onelevel = (semantictag.indexOf('one-level-menu')>-1);
			



			//--------------------------------------------------
			if (i==0 && resource_type!=null && resource_type == "URL2Portfolio") {
				$("#portfolio_bar").show();
				while (i<root.children.length && resource_type == "URL2Portfolio" ) {
					if (testIfDisplay(uuid))
						UIFactory.Node.displayPortfolioMenuItem(uuid,'portfolio_bar',type,langcode,edit,parentid);
					i++;
					uuid = root.children[i];
					resource_type = UICom.structure.ui[uuid].resource_type;
				}
				i--;
				if ($(".sidebar-item","#portfolio_bar").length<2) {
					$("#portfolio_bar").hide();
					$("#sidebar_"+UICom.rootid).show();
				}
			//--------------------------------------------------
			} else if (testIfDisplay(uuid) && langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && ( (display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || showtoroles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer')))) {
				if(name == "asmUnit" && level==0) // first level
				{
					$("#"+destid).removeClass("nodisplay");
					var html = "";
					var depth = 99;
					html += "<div class='dropdown-submenu";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tabdivst' name='"+semantictag+"'>";
					html += "<div class='dropdown-item' style='cursor:pointer ";
					if (g_configVar['portfolio-hmenu-logo']!="" && uuid==welcomeid)
						html += ";display:none";
					let js = "";
					js += "$(this).parent().parent().parent().parent().nextAll().remove();";
					html += "' onclick=\""+js+"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+");pageClick ('"+uuid+"')\" id='sidebar_"+uuid+"'>"+text+"</div>";
					$("#"+destid).append($(html));
				}
				if(name == "asmUnit" && level==1) // in a dropdown
				{
					$("#"+destid).removeClass("nodisplay");
					var html = "";
					var depth = 99;
					html += "<div class='dropdown-item' style='cursor:pointer' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+");pageClick ('"+uuid+"')\" id='sidebar_"+uuid+"'>"+text+"</div>";
					$("#"+destid).append($(html));
				}
				if(name == "asmStructure") // Click on Structure
				{
					$("#"+destid).removeClass("nodisplay");
					var depth = 1;
					var html = "";
					html += "<div class='dropdown-submenu";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tabdivst' name='"+semantictag+"'>";
					let js = "";
					js += "$(this).parent().parent().parent().parent().nextAll().remove();";
					if (hm) {
						js += "displaySubMenu('"+uuid+"');";
					}
					html += "<div class='dropdown-item' style='cursor:pointer' onclick=\""+js+"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</div>";
					if (!hm && !onelevel)
						html += "<div id='dropdown"+uuid+"' class='dropdown-menu dropdown-menu-right nodisplay' aria-labelledby='sidebar_"+uuid+"'></div>";
					html += "</div>";
					$("#"+destid).append($(html));
					if (!hm && !onelevel)
						UIFactory["Node"].displayHorizontalMenu(UICom.structure.tree[root.children[i]],'dropdown'+uuid,type,langcode,g_edit,uuid,1);
				}
				if (name=='asmContext' && resource_type == "URL2Portfolio") {
					var html = "";
					html = "<div style='cursor:pointer' class=' ";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tablist'>";
					html += UICom.structure.ui[uuid].resource.getView(null,'horizontal-menu');
					html += "</div><!-- panel -->";
					$("#"+destid).append($(html));					
				}
			}
			//--------------------------------------------------
			i++;
		}
	};

	//===========================================
	UIFactory["Node"].displayHorizontalMenu2 = function(root,destid,type,langcode,edit,parentid,level)
	//===========================================
	{
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		//---------------------
		if (level==null)
			level = 0;
		//---------------------
		let i = 0;
		while (i<root.children.length)
		{
			var child = UICom.structure.tree[root.children[i]].node;
			var name = child.tagName;
			var uuid = $(child).attr("id");
			var text = UICom.structure.ui[uuid].getLabel('sidebar_'+uuid,'span');
			var node = UICom.structure.ui[uuid];
			var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
			var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)? 'none' : $(node.metadatawad).attr('showtoroles');
			var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
			var langnotvisible = ($(node.metadatawad).attr('langnotvisible')==undefined)?'':$(node.metadatawad).attr('langnotvisible');
			var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
			const resource_type = UICom.structure.ui[uuid].resource_type;
			//--------------------------------------------------
			if (i==0 && resource_type!=null && resource_type == "URL2Portfolio") {
				$("#portfolio_bar").show();
				while (i<root.children.length && resource_type == "URL2Portfolio" ) {
					if (testIfDisplay(uuid))
						UIFactory.Node.displayPortfolioMenuItem(uuid,'portfolio_bar',type,langcode,edit,parentid);
					i++;
					uuid = root.children[i];
					resource_type = UICom.structure.ui[uuid].resource_type;
				}
				i--;
				if ($(".sidebar-item","#portfolio_bar").length<2) {
					$("#portfolio_bar").hide();
					$("#sidebar_"+UICom.rootid).show();
				}
			//--------------------------------------------------
			} else if (testIfDisplay(uuid) && langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && ( (display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || showtoroles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer')))) {
				if(name == "asmUnit" && level==0) // first level
				{
					$("#"+destid).removeClass("nodisplay");
					var html = "";
					var depth = 99;
					html += "<a onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+");pageClick ('"+uuid+"')\" id='sidebar_"+uuid+"'>"+text+"</a>";
					$("#"+destid).append($(html));
				}
				if(name == "asmUnit" && level==1) // in a dropdown
				{
					$("#"+destid).removeClass("nodisplay");
					var html = "";
					var depth = 99;
					html += "<a onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+");pageClick ('"+uuid+"')\" id='sidebar_"+uuid+"'>"+text+"</a>";
					$("#"+destid).append($(html));
				}
				if(name == "asmStructure") // Click on Structure
				{
					$("#"+destid).removeClass("nodisplay");
					var depth = 1;
					var html = "";
					html += "<div class='subnav";
					if (privatevalue)
						html+= "private"
					if (g_bar_type=='horizontal-right')
						html += " justify-content-end";
					html += "' id='parent-"+uuid+"' role='tabdivst'>";
					html += "<a onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
					html += "<div id='dropdown"+uuid+"' class='subnav-content' aria-labelledby='sidebar_"+uuid+"'></div>";
					html += "</div>";
					$("#"+destid).append($(html));
					UIFactory["Node"].displayHorizontalMenu2(UICom.structure.tree[root.children[i]],'dropdown'+uuid,type,langcode,g_edit,uuid,1);
				}
				if (name=='asmContext' && resource_type == "URL2Portfolio") {
					var html = "";
					html = "<div style='cursor:pointer' class='sidebar-item ";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tablist'>";
					html += UICom.structure.ui[uuid].resource.getView(null,'horizontal-menu');
					html += "</div><!-- panel -->";
					$("#"+destid).append($(html));					
				}
			}
			//--------------------------------------------------
			i++;
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
	var showtoroles = $(node.metadatawad).attr('showtoroles');
	if (showtoroles==undefined)
		showtoroles = "";
	var seecommentnoderoles = $(node.metadatawad).attr('seecommentnoderoles');
	if (seecommentnoderoles==undefined)
		seecommentnoderoles = "all";
	if (seecommentnoderoles!="" && (seecommentnoderoles.indexOf("all")>-1
									|| USER.admin
									|| g_userroles[0]=='designer'
									|| seecommentnoderoles.containsArrayElt(g_userroles)
									|| (showtoroles.containsArrayElt(g_userroles) && seecommentnoderoles.containsArrayElt(g_userroles))
									|| seecommentnoderoles.indexOf(this.userrole)>-1
								   )
		)
	{
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		//---------------------
		var uuid = node.id;
		var text = $(UICom.structure.ui[uuid].context_text_node[langcode]).text();
		var style = UIFactory.Node.getCommentStyle(uuid);
		html += "<div style='"+style+"'>"+text+"</div>";
		if (text.length)
			$("#"+destid).append($(html));
		else
			$("#"+destid).hide();
	} else {
		$("#"+destid).hide();
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
	if (commentnoderoles!="" 
		&& (USER.admin 
			|| g_userroles[0]=='designer'
			|| commentnoderoles.indexOf(g_userroles[0])>-1 
			|| commentnoderoles.indexOf($(USER.username_node).text())>-1
			)
		) {
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		//---------------------
		var uuid = node.id;
		var text = "";
		if (type==null)
			type = 'default';
		text = $(UICom.structure.ui[uuid].context_text_node[langcode]).text();
		html += "<h4>"+karutaStr[languages[LANGCODE]]['comments']+"</h4>";
		html += "<div id='div_"+uuid+langcode+"'><textarea id='"+uuid+langcode+"_edit_comment' class='form-control' style='height:200px'>"+text+"</textarea></div>";
		$("#"+destid).append($(html));
		$("#"+uuid+langcode+"_edit_comment").wysihtml5(
			{
				toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false,"link": false},
				"uuid":uuid,
				"locale":LANG,
				'events': {
					'change': function(){UICom.structure.ui[currentTexfieldUuid].updateComments(langcode);},
					'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure.ui[currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},
					'blur': function(){clearInterval(currentTexfieldInterval);}
				}
			}
		);
	} else {
		$("#"+destid).hide();
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
	var value = $.trim($("#"+this.id+langcode+"_edit_comment").val());
	$(this.context_text_node[langcode]).text(value);
	this.save();
	//----------------
	if ($("#project-comments_"+this.id)) {
		$("#project-comments_"+this.id).html(value);
	}
	//----------------
	writeSaved(this.id);
};


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- MOVE NODES -----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory['Node'].upNode = function(nodeid,reload)
//==================================================
{
	if (reload==null)
		reload = true;
	$.ajax({
		uuid:nodeid,
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/nodes/node/" + nodeid + "/moveup",
		success : function(data) {
			if (reload)
				if (UICom.structure.ui[this.uuid].asmtype=='asmContext')
					UIFactory.Node.reloadUnit();
				else
					UIFactory.Node.reloadStruct();
			$("#edit-window").modal('hide');	
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Move "+textStatus+" : "+jqxhr.responseText);
		}
	});
};

//==================================
function moveTO(nodeid,targetid,title,destsemtag,srcesemtag,fct) 
//==================================
{
	$('#wait-window').modal('show');
	var parentid = null;
	// change menu
	var node = UICom.structure.ui[nodeid];
	var menusroles = $(node.metadatawad).attr('menuroles');
	var newmenusroles = menusroles.substring(0,menusroles.indexOf(destsemtag)) + srcesemtag + '/' + destsemtag + menusroles.substring(menusroles.indexOf(srcesemtag)+srcesemtag.length);
	UIFactory.Node.updateMetadataWadAttribute(nodeid,'menuroles',newmenusroles);
	// search for destination
	var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes?portfoliocode=" + selfcode + "&semtag="+destsemtag,
		success : function(data) {
			var nodes = $("node",data);
			parentid = $(nodes[0]).attr('id');
			// move node
			UIFactory.Node.moveTo(nodeid,parentid);
			// reload destination
			UIFactory.Node.loadNode(parentid);
			if (fct!=null)
				eval(fct+"()");
		}
	});
}

//==================================================
UIFactory['Node'].moveNode = function(nodeid)
//==================================================
{
	var option = $("select",$("#edit-window-body")).find("option:selected");
	var parentid = $(option).attr('uuid');
	UIFactory['Node'].moveTo(nodeid,parentid);
};

//==================================================
UIFactory['Node'].moveTo = function(nodeid,parentid)
//==================================================
{
	if (parent !=undefined && parent!=null)
		$.ajax({
			async:false,
			type : "POST",
			dataType : "text",
			url : serverBCK_API+"/nodes/node/" + nodeid + "/parentof/"+parentid,
			success : function(data) {
				UIFactory.Node.reloadUnit();
				$("#edit-window").modal('hide');	
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Move "+textStatus+" : "+jqxhr.responseText);
			}
		});
};

//===========================================
UIFactory["Node"].selectNode = function(nodeid,node,semtag)
//===========================================
{
	//---------------------
	var langcode = LANGCODE;
	//---------------------
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
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
	var label = UICom.structure.ui[uuid].label_node[langcode].text();
	if (semtag=='')
		html += "<option uuid = '"+uuid+"'>"+label+"</option>";
	html += UIFactory["Node"].getSubNodes(node, nodeid, UICom.structure.ui[nodeid].asmtype,semtag);
	html += "</select>";
	// ------------------------------
	$("#edit-window-body").html($(html));
	// ------------------------------
	$("#edit-window").modal('show');
};

//===========================================
UIFactory["Node"].getSubNodes = function(root, idmoved, typemoved,semtag)
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
		var semantictag = UICom.structure.ui[uuid].semantictag;
		if (semantictag!="welcome-navbar" && semantictag!="welcome-sidebar" && semantictag!="welcome-colors") {
			var label = UICom.structure.ui[uuid].label_node[langcode].text();
			var name = UICom.structure.ui[uuid].asmtype;
			if (name!='asmContext' && (typemoved != "asmUnit" || name != "asmUnit") && (uuid !=idmoved)){
				if (semantictag.indexOf("welcome-unit")<0 && (semtag=='' || (semtag!='' && semantictag.indexOf(semtag)>-1)))
					html += "<option uuid = '"+uuid+"'>"+label+"</option>";
				html += UIFactory["Node"].getSubNodes(UICom.structure.tree[uuid], idmoved, typemoved,semtag);
			}
		}
	}
	return html;
};


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------------------- BUTTONS -----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].prototype.getButtons = function(dest,type,langcode,inline,depth,edit,menu,inblock)
//==================================================
{
	if (this.edit==undefined)
		this.setMetadata(dest,depth,langcode,edit,inline,null,null,menu,inblock);
	if (g_designerrole) {
		this.deletenode = (this.delnoderoles.containsArrayElt(g_userroles))? true : false;
		if (this.deletenode)
			this.deletenode = this.menu; //if submitted menu==false
		this.writenode = (this.editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!this.writenode) {
			this.writenode = (this.editresroles.containsArrayElt(g_userroles))? true : false;
			if (this.writenode)
				this.writenode = this.menu; //if submitted menu==false
		}
	}
	if (depth==null)
		depth = 99;
	//-----------------------------------
	var html = "";
	var menus_color = this.getMenuStyle();
	//-----------------------------------
	if (this.edit && this.id.indexOf('temp-')==-1) {
		//------------ edit button ---------------------
		if ( 
					(!this.inline && ( 	(this.writenode && !this.incrementroles!='Y' && this.resnopencil!='Y' && this.nodenopencil!='Y' && !this.nodenopencilroles.containsArrayElt(g_userroles) && (this.editnoderoles.containsArrayElt(g_userroles) || this.editresroles.containsArrayElt(g_userroles) || this.editnoderoles.indexOf($(USER.username_node).text())>-1 || this.editresroles.indexOf($(USER.username_node).text())>-1))
									|| USER.admin
									|| g_userroles[0]=='designer' 
								)
					)
				|| 	(this.inline && (	(USER.admin || g_userroles[0]=='designer'|| this.editnoderoles.containsArrayElt(g_userroles) || this.editnoderoles.indexOf(this.userrole)>-1) ))
			)
		{
			html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' style='"+menus_color+"' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
		}
		//------------ delete button ---------------------
		if (( (this.deletenode && (this.delnoderoles.containsArrayElt(g_userroles) || this.delnoderoles.indexOf($(USER.username_node).text())>-1) ) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			if (this.asmtype == 'asmStructure' || this.asmtype == 'asmUnit') {
				if ($("#page").attr('uuid')!=this.id) {
					html += deleteButton(this.id,this.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",g_portfolio_rootid,null,null);
				} else {
					var parent = $(this.node).parent();
					if ($(parent).prop("nodeName")=="asmStructure") {
						html += deleteButton(this.id,this.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",g_portfolio_rootid,null,$(parent).attr('id'));
					} else {
						html += deleteButton(this.id,this.asmtype,undefined,undefined,"fill_main_page",g_portfolioid,null,null);
					}
				}
			} else {
				html += deleteButton(this.id,this.asmtype,undefined,undefined,"UIFactory.Node.reloadUnit","null","null",this.id);
			}
		}
		//------------- move node buttons ---------------
		if (((this.writenode && (this.moveroles.containsArrayElt(g_userroles)  || this.moveroles.indexOf($(USER.username_node).text())>-1)) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			if ((this.asmtype!='asmUnit' && this.asmtype!='asmStructure') || depth<1)
				html+= "<span class='button fas fa-arrow-up' style='"+menus_color+"' onclick=\"javascript:UIFactory.Node.upNode('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-up"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (((this.writenode && (this.moveinroles.containsArrayElt(g_userroles)  || this.moveinroles.indexOf($(USER.username_node).text())>-1)) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			var movein = ($(this.metadatawad).attr('movein')==undefined)?'':$(this.metadatawad).attr('movein');
			var target = null;
			if (movein.indexOf('parent.parent.parent.parent.parent')>-1) {
				target = $(this.node).parent().parent().parent().parent().parent().attr('id');
			} else if (movein.indexOf('parent.parent.parent.parent')>-1) {
				target = $(this.node).parent().parent().parent().parent().attr('id');
			} else if (movein.indexOf('parent.parent.parent')>-1) {
				target = $(this.node).parent().parent().parent().attr('id');
			} else	if (movein.indexOf('parent.parent')>-1) {
				target = $(this.node).parent().parent().attr('id');
			} else if (movein.indexOf('parent')>-1) {
				target = $(this.node).parent().attr('id');
			}
			if (movein.indexOf('.')<0)
				html+= "<span class='button fas fa-random' style='"+menus_color+"' onclick=\"javascript:UIFactory.Node.selectNode('"+this.id+"',UICom.root,'"+movein+"')\" data-title='"+karutaStr[LANG]["move"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			else
				html+= "<span class='button fas fa-random' style='"+menus_color+"' onclick=\"javascript:UIFactory.Node.selectNode('"+this.id+"',UICom.structure.tree['"+target+"'],'"+movein.substring(movein.lastIndexOf('.')+1)+"')\" data-title='"+karutaStr[LANG]["move"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		//------------- duplicate node buttons ---------------
		if ( (g_userroles[0]=='designer' && this.asmtype != 'asmRoot') // always duplicate for designer
			 || (this.duplicateroles!='none'  
				 	&& this.duplicateroles!='' 
				 	&& this.asmtype != 'asmRoot' 
				 	&& ( this.duplicateroles.containsArrayElt(g_userroles) || this.duplicateroles.indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer' )
			 	 )
			)
		{
			html+= "<span class='button fas fa-clone' style='"+menus_color+"' onclick=\"javascript:UIFactory.Node.duplicate('"+this.id+"','UIFactory.Node.reloadUnit')\" data-title='"+karutaStr[LANG]["button-duplicate"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
	}
	//------------- private button -------------------
	if (/*this.writenode && */(this.showroles.containsArrayElt(g_userroles) || this.showroles.indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer') && this.showroles!='none' && this.showroles!='') {
		if (this.privatevalue) {
			html += "<span class='button fas fa-eye-slash' style='"+menus_color+"' onclick=\"javascript:show('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-show"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		} else {
			html += "<span class='button fas fa-eye' style='"+menus_color+"' onclick=\"javascript:hide('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-hide"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
	}
	//-----------------------------------------------
	return html;
}

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//---------------------- RELOAD ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory['Node'].reloadStruct = function(uuid,redisplay,redisplay_uuid)
//==================================================
{
	if (redisplay == null || redisplay == 'null')
		redisplay = true;
	if (uuid == null || uuid == 'null')
		uuid = g_portfolio_rootid;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
			setVariables(data);
			g_portfolio_current = data;
			if (g_bar_type.indexOf('horizontal')>-1) {
				$("#portfolio_bar").html("");
				$("#menu_bar").html("");
				$("#menu_bar").show();
				UIFactory.Portfolio.displayHorizontalMenu(UICom.root,'menu_bar',null,null,g_edit,UICom.rootid);
			} else {
				$("#portfolio_bar").html("");
				$("#sidebar").html("");
				$("#menu_bar").hide();
				UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.rootid);
			}
			if (redisplay) {
				var uuid = (redisplay_uuid==null || redisplay_uuid=="null")?$("#page").attr('uuid'):redisplay_uuid;
				if (g_display_type=='model')
					displayPage(UICom.rootid,1,g_display_type,LANGCODE,g_edit);
				else
					displayPage(uuid,1,g_display_type,LANGCODE,g_edit);
				$('#wait-window').modal('hide');
			}
		}
	});
};

//==================================================
UIFactory['Node'].reloadUnit = function(uuid,redisplay,nodeid,userrole)
//==================================================
{
	let previewuuid =null;
	let node = null
	if (nodeid!=null) {
		node = document.getElementById("node_"+nodeid);
		while (node!=null && node.parentNode!=null && node.getAttribute("preview-uuid")==null)
			node = node.parentNode;
		previewuuid = $(node).attr("preview-uuid");
	}
	if (previewuuid!=null && node!=null) {
		reloadPreviewBox(node)
		$('#wait-window').modal('hide');
	} else {
		if (redisplay == null)
			redisplay = true;
		if (uuid=="" || uuid==null || redisplay)
			uuid = $("#page").attr('uuid');
		var parentid = "";
		if (uuid==g_portfolio_rootid)
			parentid = g_portfolio_rootid;
		else
			parentid = $($(UICom.structure.ui[uuid].node).parent()).attr('id');
		if (uuid.indexOf("_")>-1)
			uuid = uuid.substring(0,uuid.indexOf("_"));
		//-------------------------------------------
		if (userrole==undefined)
			userrole = g_userrole;
		if (userrole==undefined)
			userrole = g_userroles[0];
		if (userrole==undefined)
			userrole = "";
		//-------------------------------------------
		$.ajax({
			async: false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes/node/" + uuid + "?userrole="+userrole,
			parentid : parentid,
			success : function(data) {
				UICom.parseStructure(data,false,this.parentid);
				setVariables(data);
				$("#"+uuid,g_portfolio_current).replaceWith($(":root",data));
				if (g_bar_type.indexOf('horizontal')>-1) {
					$("#portfolio_bar").html("");
					$("#menu_bar").html("");
					$("#menu_bar").show();
					UIFactory.Portfolio.displayHorizontalMenu(UICom.root,'menu_bar',g_display_type,null,g_edit,UICom.rootid);
				} else {
					$("#portfolio_bar").html("");
					$("#sidebar").html("");
					$("#menu_bar").hide();
					UIFactory.Portfolio.displaySidebar(UICom.root,'sidebar',g_display_type,null,g_edit,UICom.rootid);
				}
				if (redisplay) {
					if (g_display_type=='model')
						displayPage(UICom.rootid,1,g_display_type,LANGCODE,g_edit);
					else
						displayPage(uuid,99,g_display_type,LANGCODE,g_edit);
				}
				$('#wait-window').modal('hide');
			}
		});
	}
};


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//------------------------ LOAD ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory['Node'].loadNode = function(uuid)
//==================================================
{
	var parentid = $($(UICom.structure.ui[uuid].node).parent()).attr('id');
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
		uuid : uuid,
		success : function(data) {
			UICom.parseStructure(data,false,parentid);
			$("#"+this.uuid,g_portfolio_current).replaceWith($(":root",data));
			if (UICom.structure.ui[this.uuid].asmtype=='asmUnit') {
				UICom.structure.ui[this.uuid].loaded = true;
			}
			if (g_bar_type.indexOf('horizontal')>-1) {
				$("#portfolio_bar").html("");
				$("#menu_bar").html("");
				$("#menu_bar").show();
				UIFactory.Portfolio.displayHorizontalMenu(UICom.root,'menu_bar',g_display_type,null,g_edit,UICom.rootid);
			} else {
				$("#portfolio_bar").html("");
				$("#sidebar").html("");
				$("#menu_bar").hide();
				UIFactory.Portfolio.displaySidebar(UICom.root,'sidebar',g_display_type,null,g_edit,UICom.rootid);
			}
		}
	});
};

//==================================================
UIFactory['Node'].loadStructure = function(uuid)
//==================================================
{
	var parentid = $($(UICom.structure.ui[uuid].node).parent()).attr('id');
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + uuid + "?level=2",
		uuid : uuid,
		success : function(data) {
			UICom.parseStructure(data,false,parentid);
			var unitStructures = $("asmUnitStructure",data);
			for (var i=0;i<unitStructures.length;i++){
				var nodeid = $(unitStructures[i]).attr('id');
				UIFactory.Node.loadNode(nodeid);
			}
			$("#"+uuid,g_portfolio_current).replaceWith($(":root",data));
			if (g_bar_type.indexOf('horizontal')>-1) {
				$("#portfolio_bar").html("");
				$("#menu_bar").html("");
				$("#menu_bar").show();
				UIFactory.Portfolio.displayHorizontalMenu(UICom.root,'menu_bar',g_display_type,null,g_edit,UICom.rootid);
			} else {
				$("#portfolio_bar").html("");
				$("#sidebar").html("");
				$("#menu_bar").hide();
				UIFactory.Portfolio.displaySidebar(UICom.root,'sidebar',g_display_type,null,g_edit,UICom.rootid);
			}
			UICom.structure.ui[this.uuid].loaded = true;
		}
	});
};

//==================================================
UIFactory['Node'].toggleComment = function(uuid,input)
//==================================================
{
	var semantictag = UICom.structure.ui[uuid].semantictag;
	if (input.checked) {
		semantictag += ' comments';
		UICom.structure.ui[uuid].semantictag = semantictag;
		$("#node_"+uuid).addClass('comments');
	}
	else {
		semantictag = semantictag.substring(0,semantictag.indexOf('comments')-1)
		UICom.structure.ui[uuid].semantictag = semantictag;
		$("#node_"+uuid).removeClass('comments');
	}
	UIFactory["Node"].updateMetadataAttribute(UICom.structure.ui[uuid].id,'semantictag',semantictag);

}
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//------------------------ getBubbleView -------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------


//==================================
UIFactory["Node"].prototype.getBubbleView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (dest!=null) {
		this.display[dest]=langcode;
	}
	if (type==null)
		type='default';
	var html ="";
	UIFactory["Bubble"].parse(this.node);  // this.node
	html += "<iframe id='bubble_iframe' class='bubble_iframe' src='../../karuta/htm/bubble.html?uuid="+this.id+"' height='500' width='100%'></iframe>";
	html += "<div id='map-info_"+this.id+"'></div>";
	html += "<div id='bubble_display_"+this.id+"' class='bubble_display'></div>";
	return html;
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------- exportNode -------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

function exportNode(uuid,destcode) {
	UICom.structure.ui[uuid].exportNode(destcode);
}

//==================================
UIFactory["Node"].prototype.exportNode = function(destcode)
//==================================
{
	var srceid = this.id;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/"+destcode,
		success : function(data) {
			var destid = $("asmRoot",data).attr("id");
			var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?uuid="+srceid;
			$.ajax({
				type : "POST",
				dataType : "text",
				url : urlS,
				data : "",
				success : function () {
					alert("Exported");
				},
				error : function(jqxhr,textStatus) {
					alert("Error in exportNode "+textStatus+" : "+jqxhr.responseText);
				}
			});
		}					
	});

};

//=======================================================================================================================================
//=======================================================================================================================================
//======================================= for backward compatibility 2.4 ================================================================
//=======================================================================================================================================
//=======================================================================================================================================


//==================================================
UIFactory["Node"].displayWelcomePage = function(root,dest,depth,langcode,edit,inline,backgroundParent)
//==================================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var style = null;
	var metadataepm = null;
	var node = null;
	var data = root.node;
	var uuid = $(data).attr("id");
	var images = $("asmContext:has(metadata[semantictag='welcome-main-image'])",data);
	var imageid = $(images[0]).attr("id");
	var titles = $("asmContext:has(metadata[semantictag='welcome-title'])",data);
	var titleid = $(titles[0]).attr("id");
	var html = "";
	html += "<div class='page-welcome'>";
	html += "<div id='welcome-image' style=\"background: url('../../../"+serverBCK+"/resources/resource/file/"+imageid+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"') no-repeat\">";
	if (titles.length>0) {
		html += "<div class='welcome-box'>";
		html += "<div class='welcome-subbox'>";
		html += "<div class='welcome-title' id='welcome-title'>";
		html += UICom.structure.ui[titleid].resource.getView('welcome-title','span')
		html += "</div>";
		html += "<div class='welcome-line'/>";
		var texts = $("asmContext:has(metadata[semantictag='welcome-baseline'])",data);
		var textid = $(texts[0]).attr("id");
		html += "<div class='welcome-baseline' id='welcome-baseline' style='"+UIFactory["Node"].getContentStyle(textid)+"'>";
		html += UICom.structure.ui[textid].resource.getView('welcome-baseline');
		html += "</div><!-- id='welcome-baseline' -->";
		html += "</div><!--  class='welcome-subbox' -->";
		html += "</div><!--  class='welcome-box' -->";
	}
	html += "</div><!-- id='welcome-image' -->";
	html += "<div id='welcome-blocks'>";
	html += "</div><!-- id='welcome-blocks' -->";
	html += "</div><!-- id='welcome-page' -->";
	$("#"+dest).append(html);
	//----------------- WELCOME BLOCKS ------------------------
	var welcome_blocks = $(data).find("asmUnitStructure:has(metadata[semantictag='welcome-page'])").children("asmUnitStructure:has(metadata[semantictag='welcome-block']),asmUnitStructure:has(metadata[semantictag*='asm-block'])");
	for (var i=0; i<welcome_blocks.length; i++) {
		var semtag = $($("metadata",welcome_blocks[i])[0]).attr('semantictag');
		if (semtag=='welcome-block')
			UIFactory["Node"].displayWelcomeBlock(welcome_blocks[i],'welcome-blocks',depth,langcode,edit,inline,backgroundParent,1);
		else {
			var child = UICom.structure.tree[$(welcome_blocks[i]).attr("id")];
			edit = false;
			var menu = false;
			UIFactory["Node"].displayNode(type,child,'welcome-blocks',depth,langcode,edit,inline,backgroundParent,1,menu);
		}
	}
	//---------------------------------------
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	if ( (g_userroles[0]=='designer' && semtag.indexOf('welcome-unit')>-1) || (semtag.indexOf('welcome-unit')>-1 && semtag.indexOf('-editable')>-1 && semtag.containsArrayElt(g_userroles)) ) {
		html = "<a  class='fas fa-edit' onclick=\"if(!g_welcome_edit){g_welcome_edit=true;} else {g_welcome_edit=false;};$('#contenu').html('');displayPage('"+uuid+"',100,'standard','"+langcode+"',true)\" data-title='"+karutaStr[LANG]["button-welcome-edit"]+"' data-toggle='tooltip' data-placement='bottom'></a>";
		$("#welcome-edit").html(html);
	}
	$('[data-toggle="tooltip"]').tooltip({html: true, trigger: 'hover'});
}


//==================================================
UIFactory["Node"].buttons = function(node,type,langcode,inline,depth,edit,menu,block)
//==================================================
{
};



//==================================================
UIFactory["Node"].displayWelcomeBlock = function(root,dest,depth,langcode,edit,inline,backgroundParent)
//==================================================
{
	var html = "";
	var style = "";
	//---------------------------
	var welcome_blockid = $(root).attr("id");
	style = UIFactory["Node"].getLabelStyle(welcome_blockid);
	html += "<div id='welcome_"+welcome_blockid+"' class='row welcome-block'>";
	html += "  <div id='welcome-title_"+welcome_blockid+"' class='col-md-12' style='"+style+"'>";
	html += UICom.structure.ui[welcome_blockid].getView('welcome-title_'+welcome_blockid,'span');
	html += "  </div>";	
	html += "</div><!-- class='row' -->";
	//----------------- WELCOME RESOURCES ------------------------
	style = UIFactory["Node"].getContentStyle(welcome_blockid);
	html += "<div class='row welcome-resources' style='"+style+"'>";
	var resources = $(root).children("asmContext:has(metadata[semantictag*='welcome'])");
	for (var i=0; i<resources.length; i++) {
		var nodeid = $(resources[i]).attr("id");
		style = UIFactory["Node"].getContentStyle(nodeid);
		html += "<div id='welcome_resource_"+nodeid+"' class='col-md-12' style='"+style+"'>";
		UICom.structure.ui[nodeid].setMetadata();
		html += UICom.structure.ui[nodeid].resource.getView('welcome_resource_'+nodeid);
		html += "</div><!-- class='col-md-12' -->";
	}
	html += "</div><!-- class='welcome-resources' -->";
	//----------------- WELCOME BLOCKS ------------------------
	style = UIFactory["Node"].getContentStyle(welcome_blockid);
	html += "<div class='row welcome-block' style='"+style+"'>";
	var welcome_blocks = $(root).children("asmUnitStructure:has(metadata[semantictag='welcome-block'])");
	var lgcolumn = Math.floor(12/welcome_blocks.length);
	for (var i=0; i<welcome_blocks.length; i++) {
		var welcome_blockid = $(welcome_blocks[i]).attr("id");
		html += "<div id='welcome_sub"+welcome_blockid+"' class='col-md-"+lgcolumn+"' style='"+style+"'>";
		html += "</div><!-- class='col-md' -->";
	}
	html += "</div><!-- class='row' -->";
	//---------------------------------------
	$("#"+dest).append(html);
	for (var i=0; i<welcome_blocks.length; i++) {
		var welcome_blockid = $(welcome_blocks[i]).attr("id");
		UIFactory["Node"].displayWelcomeBlock(welcome_blocks[i],'welcome_sub'+welcome_blockid,depth,langcode,edit,inline,backgroundParent);
	}
	//-------------------------------------------------------
}

