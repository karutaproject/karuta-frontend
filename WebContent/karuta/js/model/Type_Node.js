/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
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
		this.code_node = $($("code",node)[0]);
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
			flag_error = 'e';
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",node);
			this.resource_type = $(resource).attr("xsi_type");
			this.resource = new UIFactory[this.resource_type](node);
			flag_error = 'f';
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
		this.metadata = node.querySelector("metadata");
		this.metadatawad = node.querySelector("metadata-wad");
		this.metadataepm = node.querySelector("metadata-epm");
		this.semantictag = this.metadata.getAttribute('semantictag');
		if (this.semantictag==undefined) // for backward compatibility - node without semantictag attribute
			this.semantictag='';
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
		//------------------------------
		this.display = {}; // to refresh after changes
		this.display_label = {}; // to refresh after changes
		this.display_node = {}; // to refresh after changes (metadataepm)
		this.display_context = {}; // to refresh after changes (metadataepm)
		//------------------------------
		this.structured_resource = null;
		if (this.xsi_type!=undefined && this.xsi_type!='' && this.xsi_type != this.asmtype) { // structured resource
			this.structured_resource = new UIFactory[this.xsi_type](node);
		}
		//------------------------------
		this.loaded = !(g_complex); // if not complex all nodes are loaded
	}
	catch(err) {
		alertHTML("UIFactory['Node']--flag_error:"+flag_error+"--"+err.message+"--id:"+this.id+"--resource_type:"+this.resource_type+"--asmtype:"+this.asmtype);
	}
};


//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].prototype.setMetadata = function(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock)
//==============================================================================
//==============================================================================
//==============================================================================
{
	this.depth = depth;
	if (edit==null || edit==undefined)
		this.edit = false;
	else
		this.edit = edit;
	if (inline==null || inline==undefined)
		this.inline = false;
	else
		this.inline = inline
	if (menu==null || menu==undefined)
		this.menu = true;
	else
		this.menu = menu;
	if (inblock==null || inblock==undefined)
		this.inblock = false;
	else
		this.inblock = inblock;
	this.parent = parent;
	//-----------------------------
	var data = this.node;
	var uuid = this.id;
	var node = UICom.structure["ui"][uuid];
	// ---- store info to redisplay after change ---
	//------------------metadata----------------------------
	this.nodetype = $(data).prop("nodeName"); // name of the xml tag
	this.writenode = ($(node.node).attr('write')=='Y')? true:false;
	this.semtag =  ($("metadata",data)[0]==undefined || $($("metadata",data)[0]).attr('semantictag')==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	this.collapsed = 'N';
	if (!g_designerrole)
		this.collapsed = (sessionStorage.getItem('collapsed'+uuid)==undefined)?'N':sessionStorage.getItem('collapsed'+uuid);
	else
		this.collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
	this.displayed = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	this.collapsible = ($(node.metadatawad).attr('collapsible')==undefined)?'N':$(node.metadatawad).attr('collapsible');
	this.resnopencil = ($(node.metadatawad).attr('resnopencil')==undefined)?'N':$(node.metadatawad).attr('resnopencil');
	this.nodenopencil = ($(node.metadatawad).attr('nodenopencil')==undefined)?'N':$(node.metadatawad).attr('nodenopencil');
	this.editcoderoles = ($(node.metadatawad).attr('editcoderoles')==undefined)?'':$(node.metadatawad).attr('editcoderoles');
	this.editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	this.delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'':$(node.metadatawad).attr('delnoderoles');
	this.commentnoderoles = ($(node.metadatawad).attr('commentnoderoles')==undefined)?'':$(node.metadatawad).attr('commentnoderoles');
	this.showroles = ($(node.metadatawad).attr('showroles')==undefined)?'':$(node.metadatawad).attr('showroles');
	this.showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	this.editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	this.inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (this.inline_metadata=='Y')
		this.inline = true;
	this.seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	this.shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	this.seeqrcoderoles = ($(node.metadatawad).attr('seeqrcoderoles')==undefined)?'':$(node.metadatawad).attr('seeqrcoderoles');
	this.moveroles = ($(node.metadatawad).attr('moveroles')==undefined)?'':$(node.metadatawad).attr('moveroles');
	this.moveinroles = ($(node.metadatawad).attr('moveinroles')==undefined)?'none':$(node.metadatawad).attr('moveinroles');
	this.printroles = ($(node.metadatawad).attr('printroles')==undefined)?'':$(node.metadatawad).attr('printroles');
	this.privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	this.submitted = ($(node.metadatawad).attr('submitted')==undefined)?'none':$(node.metadatawad).attr('submitted');
	this.logcode = ($(node.metadatawad).attr('logcode')==undefined)?'':$(node.metadatawad).attr('logcode');
	if (this.submitted=='Y') {
		this.menu = false;
	}
	this.cssclass = ($(node.metadataepm).attr('cssclass')==undefined)?'':$(node.metadataepm).attr('cssclass');
	this.displayview = ($(node.metadataepm).attr('displayview')==undefined)?'':$(node.metadataepm).attr('displayview');
	//-------------------- test if visible
	this.visible =  ( this.displayed=='N' && (g_userroles[0]=='designer'  || USER.admin)
				|| ( this.displayed=='Y' && ( this.seenoderoles.indexOf(USER.username)>-1 
									|| this.seenoderoles.indexOf("all")>-1 
									|| this.seenoderoles.containsArrayElt(g_userroles) 
									|| (this.showtoroles.indexOf("all")>-1 && !this.privatevalue) 
									|| (this.showtoroles.containsArrayElt(g_userroles) && !this.privatevalue) 
									|| g_userroles[0]=='designer')
					)
				);
	this.submitroles = ($(node.metadatawad).attr('submitroles')==undefined)?'none':$(node.metadatawad).attr('submitroles');
	this.submitall = ($(node.metadatawad).attr('submitall')==undefined)?'none':$(node.metadatawad).attr('submitall');
	this.submitted = ($(node.metadatawad).attr('submitted')==undefined)?'N':$(node.metadatawad).attr('submitted');
	this.submitteddate = ($(node.metadatawad).attr('submitteddate')==undefined)?'none':$(node.metadatawad).attr('submitteddate');
	this.duplicateroles = ($(node.metadatawad).attr('duplicateroles')==undefined)?'none':$(node.metadatawad).attr('duplicateroles');
	this.incrementroles = ($(node.metadatawad).attr('incrementroles')==undefined)?'none':$(node.metadatawad).attr('incrementroles');
	this.menuroles = ($(node.metadatawad).attr('menuroles')==undefined)?'none':$(node.metadatawad).attr('menuroles');
	this.menulabels = ($(node.metadatawad).attr('menulabels')==undefined)?'none':$(node.metadatawad).attr('menulabels');
	if (this.resource!=undefined || this.resource!=null)
		this.editable_in_line = this.resource.type!='Proxy' && this.resource.type!='Audio' && this.resource.type!='Video' && this.resource.type!='Document' && this.resource.type!='Image' && this.resource.type!='URL';
}

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
	this.display_node[dest] = {"type":type,"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":type,"parent":parent,"menu":menu,"inblock":inblock};
	this.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock);
	var alreadyDisplayed = false;
	//---------------------------------------
	if (this.visible) {
		var node = UICom.structure["ui"][uuid];
		var structure_node =   node.resource==null 
							|| node.resource.type!='Proxy' 
							|| (node.resource.type=='Proxy' && this.writenode && this.editresroles.containsArrayElt(g_userroles)) 
							|| (g_userroles[0]=='designer' || USER.admin);
		if (structure_node) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)  // in designer mode depending the role played the node may be not readable
				readnode = (g_userroles[0]=='designer' || this.seenoderoles.indexOf(USER.username_node.text())>-1 || this.seenoderoles.containsArrayElt(g_userroles) || (this.showtoroles.containsArrayElt(g_userroles) && !this.privatevalue) || this.seenoderoles.indexOf('all')>-1)? true : false;
			//----------------------------------------------
			if( this.depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var proxy_parent = proxies_parent[uuid];
					if (proxy_parent==dest.substring(8) || dest=='contenu') { // dest = {parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer');
					}
			}
			//============================== ASMCONTEXT =============================
			if (this.nodetype == "asmContext" || (this.structured_resource != null && type!='basic' && this.semtag!='EuropassL')){
				this.displayAsmContext(dest,type,langcode,edit,refresh);
			}
			//============================== NODE ===================================
			else { // other than asmContext
				this.displayAsmNode(dest,type,langcode,edit,refresh);
			}
			//---------------------------- BUTTONS AND BACKGROUND COLOR -----------------------------------------------------------------
			// ---------- if by error button color == background color we set button color to white or black to be able to see them -----
			var buttons_color = eval($(".button").css("color"));
			var buttons_background_style = UIFactory.Node.getMetadataEpm(this.metadataepm,'background-color',false);
			if (buttons_background_style!="") {
				var buttons_background_color = buttons_background_style.substring(buttons_background_style.indexOf(":")+1,buttons_background_style.indexOf(";"));
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			var buttons_node_background_style = UIFactory.Node.getMetadataEpm(this.metadataepm,'node-background-color',false);
			if (buttons_node_background_style!="") {
				var buttons_node_background_color = buttons_node_background_style.substring(buttons_node_background_style.indexOf(":")+1,buttons_node_background_style.indexOf(";"));
				if (buttons_node_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			//----------- help ---------------------------------------------
			var data = this.node;
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				if (this.depth>0 || this.nodetype == "asmContext") {
					var help_text = "";
					var attr_help = $($("metadata-wad",data)[0]).attr('help');
					var helps = attr_help.split("/"); // lang1/lang2/...
					if (attr_help.indexOf("@")>-1) { // lang@fr/lang@en/...
						for (var j=0; j<helps.length; j++){
							if (helps[j].indexOf("@"+languages[langcode])>-1)
								help_text = helps[j].substring(0,helps[j].indexOf("@"));
						}
					} else { // lang1/lang2/...
						help_text = helps[langcode];  // lang1/lang2/...
					}
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='fas fa-question-circle'></span></a> ";
					$("#help_"+uuid).html(help);
					$(".popinfo").popover({ 
					    placement : 'right',
					    container : 'body',
					    title:karutaStr[LANG]['help-label'],
					    html : true,
					    trigger:'click hover',
					    content: help_text
					});
				}
			}
			// ===========================================================================
			// ================================= For each child ==========================
			// ===========================================================================
			var backgroundParent = UIFactory.Node.getMetadataEpm(this.metadataepm,'node-background-color',false);
			
			if (this.semtag.indexOf('asmColumns')>-1 && type!='basic') {
				//-------------- for backward compatibility -----------
				UIFactory["Node"].displayColumns(type,root,dest,depth,langcode,edit,this.inline,this.backgroundParent,this.parent,this.menu);
			} else if (this.semtag.indexOf('asm-block')>-1 && type!='basic') {
				//-------------- for backward compatibility -----------
				UIFactory["Node"].displayBlocks(root,dest,depth,langcode,edit,this.inline,this.backgroundParent,this.parent,this.menu);
			} else {
				if (this.semtag=="EuropassL"){
					alreadyDisplayed = true;
					if( node.structured_resource != null )
					{
						node.structured_resource.displayView('content-'+uuid,langcode,'detail',uuid,this.menu);
					}
				}
				//------------ Bubble Map -----------------
				if (this.semtag=='bubble_level1' && (this.seeqrcoderoles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')){
					alreadyDisplayed = true;
					var map_info = UIFactory.Bubble.getLinkQRcode(uuid);
					$('#map-info_'+uuid).html(map_info);
					$('body').append(qrCodeBox());
					UIFactory.Bubble.getPublicURL(uuid,g_userroles[0]);
				}
				if (!alreadyDisplayed) {
					for( var i=0; i<root.children.length; ++i ) {
						// Recurse
						var child = UICom.structure["tree"][root.children[i]];
						var childnode = UICom.structure["ui"][root.children[i]];
						var childsemtag = $(childnode.metadata).attr('semantictag');
						childnode.displayNode(type,child, 'content-'+uuid, this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
					}
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
	//---------------- DISPLAY HTML -------------------------------
	var html = "";
	var displayview = "";
	var resourcetype = this.resource_type;
	if (this.displayview!='' & type!='basic') {
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
		if (type=='basic') {
			html = displayHTML["basic-resource-default"];
			displayview = "basic-resource-default";
		} else {
			html = displayHTML[type+"-resource-default"];
			displayview = type+"-resource-default";
		}
	html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semtag).replace(/#cssclass#/g,this.cssclass);
	//-------------------- display ----------------------
	if (!refresh) {
		$("#"+dest).append (html);
	} else {
		$("#node_"+this.id).replaceWith(html);
	}
	//-------------------- STYLES ---------------------------------------
	var style = "";
	//-------------------- node style -------------------
	style = this.getNodeStyle(uuid);
	$("#node_"+uuid).attr("style",style);
	//-------------------- label style -------------------
	style = this.getLabelStyle(uuid);
	$("*[name='lbl-div']","#node_"+uuid).attr("style",style);
	//-------------------- resource style -------------------
	style = this.getContentStyle();
	$("*[name='res-div']","#node_"+uuid).attr("style",style);
	//---------------- display resource ---------------------------------
	if (this.edit && this.inline && this.writenode && this.editable_in_line)
		this.resource.displayEditor("resource_"+uuid,null,langcode,false,this.inline);
	else if (this.structured_resource != null && type!='basic') {
		this.structured_resource.displayView("resource_"+uuid,null,langcode);
	}
	else
		this.resource.displayView("resource_"+uuid);
	//---------------- display label ---------------------------------
	$("#label_node_"+uuid).html(this.getView('label_node_'+uuid));
	//----------- Buttons & Menus -----------
	if(edit) {
		$("#buttons-"+uuid).html(this.getButtons(langcode));
		if (this.menu)
			this.displayMenus("#menus-"+uuid,langcode);
	}
	//----------------delete control on proxy parent ------------
	if (proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
		var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit",g_portfolioid,null);
		$("#buttons-"+uuid).html(html);
	}
	//----------------- hide lbl-div if empty ------------------------------------
//	if (this.getLabel(null,'none',langcode)=="" && this.getButtons(langcode)=="" && this.getMenus(langcode)=="")
//		$("div[name='lbl-div']","#node_"+uuid).hide();
	//----------- Comments -----------
	if (this.edit && this.inline && this.writenode)
		UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
	else
		UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
	//--------------------Metadata Info------------------------------------------
	if (g_userroles[0]=='designer' || USER.admin) {  
		this.displayMetainfo("metainfo_"+uuid);
	}
	this.displayMetaEpmInfo("cssinfo_"+uuid);
	//-------------------------------------------------
}

//==================================================
UIFactory["Node"].prototype.displayAsmNode = function(dest,type,langcode,edit,refresh)
//==================================================
{
	var nodetype = this.asmtype;
	var uuid = this.id;
	var html = "";

	if (nodetype=='asmUnitStructure')
		this.depth=100;	
	var displayview = "";
	//---------------- DISPLAY -------------------------------
	if (this.depth!=1 && this.depth<10 && nodetype=='asmStructure') {
		if (this.displayview!='' & type!='basic')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semtag).replace(/#cssclass#/g,this.cssclass);
		$("#"+dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,1,type,langcode,g_edit)});
	} else if (this.depth!=1 && this.depth<10 && nodetype=='asmUnit') {
		if (this.displayview!='' & type!='basic')
			displayview = type+"-node-"+this.displayview;
		else
			displayview = type+"-struct-default";
		html = displayHTML[displayview];
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semtag).replace(/#cssclass#/g,this.cssclass);
		$("#"+dest).append (html);
		$("#label_node_"+uuid).click(function() {displayPage(uuid,100,type,langcode,g_edit)});
	} else {
		if (this.displayview!='' & type!='basic')
				displayview = type+"-node-"+this.displayview;
		else
			if (type=='basic')
				displayview = "basic-node-default";
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
		html = html.replace(/#displayview#/g,displayview).replace(/#displaytype#/g,type).replace(/#uuid#/g,uuid).replace(/#nodetype#/g,this.nodetype).replace(/#semtag#/g,this.semtag).replace(/#cssclass#/g,this.cssclass);
		if (nodetype=='asmUnit')
			html = html.replace(/#first#/g,"first-node");
		if (!refresh) {
			$("#"+dest).append (html);
		} else {
			$("#node_"+this.id).replaceWith(html);
		}
	}
	//-------------------- node style -------------------
	var style = "";
	if (this.depth>0) {
		style = UIFactory["Node"].getLabelStyle(uuid);
	} else {
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-font-size',true);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-font-weight',false);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-font-style',false);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-color',false);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-text-align',false);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-background-color',false);
		style += UIFactory.Node.getMetadataEpm(this.metadataepm,'inparent-othercss',false);
	}
	$("div[name='lbl-div']","#node_"+uuid).attr("style",style);
	//-------------------- content style -------------------
	if (type!='model') {
		style = this.getContentStyle(uuid);
		$("div[name='cnt-div']","#node_"+uuid).attr("style",style);
	}
	//-------------------- collapsible -------------------
	if (this.collapsible=='Y') {
		$("#collapsible_"+uuid).html("<span id='toggleContent_"+uuid+"' class='button'></span>");
		$("#collapsible_"+uuid).attr("onclick","javascript:toggleContent('"+uuid+"')");
		if (this.collapsed=='Y') {
			$("#toggleContent_"+uuid).attr("class","fas fa-plus collapsible");
			$("#content-"+uuid).hide();
		}
		else {
			$("#toggleContent_"+uuid).attr("class","fas fa-minus collapsible");
			$("#content-"+uuid).show();
		}
	}
	//-------------- label --------------------------
	var gotView = false;
	var label_html = ""
	if (this.semtag=='bubble_level1'){
		label_html += " "+UICom.structure["ui"][uuid].getBubbleView('std_node_'+uuid);
		gotView = true;
	}
	if (!gotView)
		label_html += " "+ this.getView('std_node_'+uuid);
	$("#label_node_"+uuid).html(label_html);
	//-------------- buttons --------------------------
	if (edit) {
		if (this.semtag.indexOf("bubble_level1")>-1)
			this.menu = false;
		var buttons = this.getButtons(langcode);
		if (nodetype == "BatchForm") {
			buttons += node.structured_resource.getButtons();
		}
		$("#buttons-"+uuid).html(buttons);
		if (this.menu)
			this.displayMenus("#menus-"+uuid,langcode);
	}
	//----------------delete control on proxy parent ------------
	if (proxies_delete[uuid]!=undefined && proxies_delete[uuid].containsArrayElt(g_userroles)) {
		var html = deleteButton(proxies_nodeid[uuid],"asmContext",undefined,undefined,"UIFactory.Node.reloadUnit",g_portfolioid,null);
		$("#buttons-"+uuid).html(html);
	}
	//----------- Comments -----------
	if (this.depth>0) {
		if (this.edit && this.inline && this.writenode)
			UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
		else
			UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
	}
	//--------------------Metadata Info------------------------------------------
	if (g_userroles[0]=='designer' || USER.admin) {  
		this.displayMetainfo("metainfo_"+uuid);
	}
	this.displayMetaEpmInfo("cssinfo_"+uuid);
	//--------------------Portfolio code------------------------------------------
	if ((g_userroles[0]=='reporter' || g_userroles[0]=='designer' || USER.admin) && nodetype=='asmRoot') {
		$("#portfoliocode_"+uuid).html(this.getCode());
	}
	//----------------- hide lbl-div if empty ------------------------------------
	if (this.getLabel(null,'none',langcode)=="" && this.getButtons(langcode)=="" && this.getMenus(langcode)=="")
		$("div[name='lbl-div']","#node_"+uuid).hide();
}

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
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
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
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
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
	this.multilingual = (this.metadata.getAttribute('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (g_userroles[0]=='designer' || USER.admin || this.metadatawad.getAttribute('display')!='N') {
		if (type=="default")
			html += "<div><div class='title'";
		if (type=="span")
			html += "<span class='title'";
		//----------------------------
		var style ="";
		var metadataepm = this.metadataepm;
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-size',true);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-weight',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-style',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'color',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'text-align',false);
		style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'othercss');
//		if (style.length>0)
//			html += " style='"+style+"' ";
		//----------------------------
		html += ">";
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userroles[0]=='designer' || USER.admin)) {
			html += this.code_node.text()+" ";
		}
		var label = this.label_node[langcode].text();
		if (label == "")
			label="&nbsp;";
		html += label+"<span id='help_"+this.id+"' class='ihelp'></span>";
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
	var html = "";
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
	if (g_userroles[0]=='designer' || USER.admin || $(this.metadatawad).attr('display')!='N') {
		if (type=="default")
			html += "<div><div class='title'";
		if (type=="span")
			html += "<span class='title'";
		//----------------------------
		var style ="";
		var metadataepm = $(this.metadataepm);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-size',true);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-weight',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'font-style',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'color',false);
		style += UIFactory.Node.getMetadataEpm(metadataepm,'text-align',false);
		style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'othercss');
		if (style.length>0)
			html += " style='"+style+"' ";
		//----------------------------
		html += ">";
		if (this.asmtype!='asmRoot' && this.code_node.text()!='' && (g_userroles[0]=='designer' || USER.admin)) {
			html += this.code_node.text()+" ";
		}
		var label = this.label_node[langcode].text();
		if (label == "")
			label="&nbsp;";
		html += label+"<span id='help_"+this.id+"' class='ihelp'></span>";
		if (type=="default")
			html += "</div><div class='title-subline'></div></div>";
		if (type=="span")
			html += "</span>";
	}
	$("#"+dest).html(html);
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
	if ($("#code_"+itself.id).length){
		var code = $.trim($("#code_"+itself.id).val());
		$(itself.code_node).text(code);
	}
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
	var inputLabel = "<input class='form-control' id='label_"+this.id+"_"+langcode+"' type='text'  value=\""+this.label_node[langcode].text()+"\">";
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
	if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
		var htmlFormObj = $("<form class='form-horizontal'></form>");
		var query = $(this.metadatawad).attr('query');
		if (query==undefined || query=='' || this.asmtype=='asmContext'){
			if (g_userroles[0]=='designer' || USER.admin) {
				var htmlCodeGroupObj = $("<div class='form-group'></div>")
				var htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>Code</label>");
				var htmlCodeDivObj = $("<div class='node-code'></div>");
				var htmlCodeInputObj = $("<input id='code_"+this.id+"' type='text' class='form-control' name='input_code' value=\""+this.code_node.text()+"\">");
				$(htmlCodeInputObj).change(function (){
					UIFactory["Node"].update(htmlCodeInputObj,self,langcode);
				});
				$(htmlCodeDivObj).append($(htmlCodeInputObj));
				$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
				$(htmlCodeGroupObj).append($(htmlCodeDivObj));
				$(htmlFormObj).append($(htmlCodeGroupObj));
			}
			if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
				var htmlLabelGroupObj = $("<div class='form-group'></div>")
				var htmlLabelLabelObj = $("<label for='label_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
				var htmlLabelDivObj = $("<div class='node-label'></div>");
				var htmlLabelInputObj = $("<input id='label_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.label_node[langcode].text()+"\">");
				$(htmlLabelInputObj).change(function (){
					UIFactory["Node"].updateLabel(htmlLabelInputObj,self,langcode);
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
					if (titles[j].indexOf(languages[langcode])>-1)
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
	UICom.UpdateNode(this.id);
	if (this.logcode!="")
		this.log();
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
//	for (dest1 in this.display) {
//		$("#"+dest1).html(this.getView(null,null,this.display[dest1]));
//	};
	for (dest2 in this.display_label) {
		$("#"+dest2).html(this.getLabel(null,this.display_label[dest2],null));
	};

	for (dest3 in this.display_node) {
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
	var destid = $($(UICom.structure["ui"][uuid].node).parent()).attr('id');
	$("#wait-window").modal('show');
	var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?uuid="+uuid;  // instance by default
	if (USER.admin || g_userrole=='designer') {
//		var rights = UIFactory["Node"].getRights(destid);
		var rights = UICom.structure["ui"][uuid].getRights();
		var roles = $("role",rights);
		if (roles.length==0) // test if model (otherwise it is an instance and we import)
			urlS = serverBCK_API+"/nodes/node/copy/"+destid+"?uuid="+uuid;
	}
	$.ajax({
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
				success : function(data) {
					//------------------------------
					var code = $($("code",data)[0]).text();
					var label = [];
					for (var i=0; i<languages.length;i++){
						label[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",data)[0]).text();
						var nb = label[i].match(/\d+$/);
						if ($.isNumeric(nb)) {
							nb++;
							label[i] = label[i].replace(/\d+$/,nb);
						}
					}
					var nbcode = code.match(/\d+$/);
					if ($.isNumeric(nbcode)) {
						nbcode++;
						code = code.replace(/\d+$/,nbcode);
					}
					var xml = "<asmResource xsi_type='nodeRes'>";
					xml += "<code>"+code+"</code>";
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
							$("#wait-window").modal('hide');			
							UIFactory.Node.reloadUnit();
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
//----------------------- SIDEBAR --------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//===========================================
UIFactory["Node"].displaySidebar = function(root,destid,type,langcode,edit,parentid)
//===========================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type=='standard' || type=='translate' || type=='basic') {
		for( var i=0;i<root.children.length;i++ )
		{
			var child = UICom.structure["tree"][root.children[i]].node;
			var name = child.tagName;
			var uuid = $(child).attr("id");
			var text = UICom.structure["ui"][uuid].getLabel('sidebar_'+uuid,'span');
			var node = UICom.structure["ui"][uuid];
			var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
			var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)? 'none' : $(node.metadatawad).attr('showtoroles');
			var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
			var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
			if ((display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || showtoroles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer'))) {
				if(name == "asmUnit") // Click on Unit
				{
					var html = "";
					var depth = 99;
					html += "<div class='sidebar-item ";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tablist'>";
					html += "  <a style='cursor:pointer' id='sidebar_"+uuid+"' href='#' class='sidebar-link' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" >"+text+"</a>";
					html += "</div><!-- panel -->";
					$("#"+destid).append($(html));
				}
				if(name == "asmStructure") // Click on Structure
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
					html += "  <a class='sidebar-link' href='#' onclick=\"toggleSidebarPlus('"+uuid+"');displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
					html += "  </div>"
					if (localStorage.getItem('sidebar'+uuid)!=undefined && localStorage.getItem('sidebar'+uuid)=='open')
						html += "<div id='collapse"+uuid+"' class='panel-collapse collapse show' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
					else
						html += "<div id='collapse"+uuid+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
					html += "<div id='panel-body"+uuid+"' class='panel-body'></div><!-- panel-body -->";
					html += "</div><!-- panel-collapse -->";
					html += "</div><!-- panel -->";
					$("#"+destid).append($(html));
					UIFactory["Node"].displaySidebar(UICom.structure["tree"][root.children[i]],'panel-body'+uuid,type,langcode,g_edit,uuid);
				}
			}
		}
	}};

	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------- HORIZONTAL MENU ------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------

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
		//---------------------
		for( var i=0;i<root.children.length;i++ )
		{
			var child = UICom.structure["tree"][root.children[i]].node;
			var name = child.tagName;
			var uuid = $(child).attr("id");
			var text = UICom.structure["ui"][uuid].getLabel('sidebar_'+uuid,'span');
			var node = UICom.structure["ui"][uuid];
			var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
			var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)? 'none' : $(node.metadatawad).attr('showtoroles');
			var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
			var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
			if ((display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || showtoroles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer'))) {
				if(name == "asmUnit" && level==0) // Click on Unit
				{
					var html = "";
					var depth = 99;
					html += "<a style='cursor:pointer' id='sidebar_"+uuid+"' href='#' class='nav-item";
					if (privatevalue)
						html+= " private";
					html += "' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" >"+text+"</a>";
					$("#"+destid).append($(html));
				}
				if(name == "asmUnit" && level==1) // Click on Unit
				{
					var html = "";
					var depth = 99;
					html += "<a class='dropdown-item' href='#' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
					$("#"+destid).append($(html));
				}
				if(name == "asmStructure" && level==0) // Click on Structure
				{
					var depth = 1;
					var html = "";
					html += "<li class='nav-item dropdown";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tablist'>";
					html += "<a class='dropdown-toggle' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"+text+"</a>";
					html += "<div id='dropdown"+uuid+"' class='dropdown-menu' aria-labelledby='sidebar_"+uuid+"'>";
					html += "<a class='dropdown-item' href='#' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
					html += "</div><!-- panel-collapse -->";
					html += "</li>";
					$("#"+destid).append($(html));
					UIFactory["Node"].displayHorizontalMenu(UICom.structure["tree"][root.children[i]],'dropdown'+uuid,type,langcode,g_edit,uuid,1);
				}
				if(name == "asmStructure" && level==1) // Click on Structure
				{
					var depth = 1;
					var html = "";
					html += "<li class='dropdown-submenu";
					if (privatevalue)
						html+= "private"
					html += "' id='parent-"+uuid+"' role='tablist'>";
					html += "<a class='dropdown-item' href='#'>"+text+"</a>";
					html += "<div id='dropdown"+uuid+"' class='dropdown-menu' aria-labelledby='sidebar_"+uuid+"'>";
					html += "<a class='dropdown-item' href='#' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" id='sidebar_"+uuid+"'>"+text+"</a>";
					html += "</div><!-- panel-collapse -->";
					html += "</li>";
					$("#"+destid).append($(html));
					UIFactory["Node"].displayHorizontalMenu(UICom.structure["tree"][root.children[i]],'dropdown'+uuid,type,langcode,g_edit,uuid,1);
				}
			}
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
	var seenoderoles = $(node.metadatawad).attr('seenoderoles');
	if (seenoderoles==undefined)
		seenoderoles = "all";
	if (seenoderoles!="" && (seenoderoles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer' || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || seenoderoles.indexOf(this.userrole)>-1)) {
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		var multilingual = ($(node.metadata).attr('multilingual-node')=='Y') ? true : false;
		if (!multilingual)
			langcode = NONMULTILANGCODE;
		//---------------------
		var uuid = node.id;
		var text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).text();
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
			)
		) {
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
		$("#"+uuid+"_edit_comment").wysihtml5({toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false,"link": false},"uuid":uuid,"locale":LANG,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].updateComments();},'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},'blur': function(){clearInterval(currentTexfieldInterval);}}});
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
	this.multilingual = ($("metadata",this.node).attr('multilingual-node')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var value = $.trim($("#"+this.id+"_edit_comment").val());
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
UIFactory['Node'].upNode = function(nodeid)
//==================================================
{
	$.ajax({
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/nodes/node/" + nodeid + "/moveup",
		success : function(data) {
			UIFactory.Node.reloadUnit();
			$("#edit-window").modal('hide');	
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Move "+textStatus+" : "+jqxhr.responseText);
		}
	});
};

//==================================
function moveTO(nodeid,title,destsemtag,srcesemtag) 
//==================================
{
	$('#wait-window').modal('show');
	var parentid = null;
	// change menu
	var node = UICom.structure["ui"][nodeid];
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
UIFactory["Node"].selectNode = function(nodeid,node)
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
		$("#edit-window-type").html(karutaStr[languages[LANGCODE]][UICom.structure.ui[nodeid].resource.type]);
	else
		$("#edit-window-type").html(karutaStr[languages[LANGCODE]][UICom.structure.ui[nodeid].asmtype]);
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
		var semantictag = UICom.structure["ui"][uuid].semantictag;
		if (semantictag!="welcome-navbar" && semantictag!="welcome-sidebar" && semantictag!="welcome-colors") {
			var label = UICom.structure["ui"][uuid].label_node[langcode].text();
			var name = UICom.structure["ui"][uuid].asmtype;
			if (name!='asmContext' && (typemoved != "asmUnit" || name != "asmUnit") && (uuid !=idmoved)){
				if (semantictag.indexOf("welcome-unit")<0)
					html += "<option uuid = '"+uuid+"'>"+label+"</option>";
				html += UIFactory["Node"].getSubNodes(UICom.structure["tree"][uuid], idmoved, typemoved);
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
	//-----------------------------------
	var html = "";
	//-----------------------------------
	if (this.edit) {
		//------------ edit button ---------------------
		if (
					(!this.inline && ( 	(this.writenode && !this.incrementroles!='Y' && this.resnopencil!='Y' && this.nodenopencil!='Y' && (this.editnoderoles.containsArrayElt(g_userroles) || this.editresroles.containsArrayElt(g_userroles)))
									|| USER.admin
									|| g_userroles[0]=='designer' 
								)
					)
				|| 	(this.inline && (	(USER.admin || g_userroles[0]=='designer'|| this.editnoderoles.containsArrayElt(g_userroles) || this.editnoderoles.indexOf(userrole)>-1) ))
			)
		{
			html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
		}
		//------------ delete button ---------------------
		if (( (this.deletenode && this.delnoderoles.containsArrayElt(g_userroles) ) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			if (this.asmtype == 'asmStructure' || this.asmtype == 'asmUnit') {
				html += deleteButton(this.id,this.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",g_portfolio_rootid,null);
			} else {
				html += deleteButton(this.id,this.asmtype,undefined,undefined,"UIFactory.Node.reloadUnit",g_portfolioid,null);
			}
		}
		//------------- move node buttons ---------------
		if (((this.writenode && this.moveroles.containsArrayElt(g_userroles)) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			html+= "<span class='button fas fa-arrow-up' onclick=\"javascript:UIFactory.Node.upNode('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-up"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			if (USER.admin || g_userroles[0]=='designer' || g_userroles[0]=='batcher' || g_userroles[0]=='reporter')
			html+= "<span class='button fas fa-random' onclick=\"javascript:UIFactory.Node.selectNode('"+this.id+"',UICom.root)\" data-title='"+karutaStr[LANG]["move"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (((this.writenode && this.moveinroles.containsArrayElt(g_userroles)) || USER.admin || g_userroles[0]=='designer') && this.asmtype != 'asmRoot') {
			var movein = ($(this.metadatawad).attr('movein')==undefined)?'':$(this.metadatawad).attr('movein');
			if (movein=='')
				html+= "<span class='button glyphicon glyphicon-random' onclick=\"javascript:UIFactory.Node.selectNode('"+this.id+"',UICom.root)\" data-title='"+karutaStr[LANG]["move"]+"' data-tooltip='true' data-placement='bottom'></span>";
			else
				html+= "<span class='button glyphicon glyphicon-random' onclick=\"javascript:UIFactory.Node.selectNode('"+this.id+"',UICom.structure.tree[$('#page').attr('uuid')],'"+movein+"')\" data-title='"+karutaStr[LANG]["move"]+"' data-tooltip='true' data-placement='bottom'></span>";
		}
		//------------- duplicate node buttons ---------------
		if ( (g_userroles[0]=='designer' && this.asmtype != 'asmRoot') // always duplicate for designer
			 || (this.duplicateroles!='none'  
				 	&& this.duplicateroles!='' 
				 	&& this.asmtype != 'asmRoot' 
				 	&& ( this.duplicateroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer' )
			 	 )
			)
		{
			html+= "<span class='button fas fa-clone' onclick=\"javascript:UIFactory.Node.duplicate('"+this.id+"','UIFactory.Node.reloadUnit')\" data-title='"+karutaStr[LANG]["button-duplicate"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
	}
	//------------- private button -------------------
	if ((this.showroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') && this.showroles!='none' && this.showroles!='') {
		if (this.privatevalue) {
			html += "<span class='button fas fa-eye-slash' onclick=\"javascript:show('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-show"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		} else {
			html += "<span class='button fas fa-eye' onclick=\"javascript:hide('"+this.id+"')\" data-title='"+karutaStr[LANG]["button-hide"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
	}
	//------------- print button -------------------
	if ((this.printroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') && this.printroles!='none' && this.printroles!='') {
			html += "<span class='button fas fa-print' onclick=\"javascript:printSection('#node_"+this.id+"')\" data-title='"+karutaStr[LANG]["button-print"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
	}
	//-------------------------------------------------
	if (html!="")
		html = "<div class='btn-group'>"+html+"</div><!-- class='btn-group' -->"
	return html;
}

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
		url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data,true);
			g_portfolio_current = data;
			$("#sidebar").html("");
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.rootid);
			var uuid = $("#page").attr('uuid');
			if (g_display_type=='model')
				displayPage(UICom.rootid,1,g_display_type,LANGCODE,g_edit);
			else
				displayPage(uuid,1,g_display_type,LANGCODE,g_edit);
			$('#wait-window').modal('hide');
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
		url : serverBCK_API+"/nodes/node/" + uuid,
		success : function(data) {
			UICom.parseStructure(data,false,parentid);
			$("#"+uuid,g_portfolio_current).replaceWith($(":root",data));
			if (g_display_type=='model')
				displayPage(UICom.rootid,1,g_display_type,LANGCODE,g_edit);
			else
				displayPage(uuid,1,g_display_type,LANGCODE,g_edit);
			if ($("#window-page").length>0) {
				var window_uuid = $("#window-page").attr('uuid');
				eval(redisplays[window_uuid]);
			}
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.rootid);
			$('#wait-window').modal('hide');
		}
	});
	$.ajaxSetup({async: true});
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
	var parentid = $($(UICom.structure["ui"][uuid].node).parent()).attr('id');
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/" + uuid + "?resources=true",
		uuid : uuid,
		success : function(data) {
			UICom.parseStructure(data,false,parentid);
			$("#"+this.uuid,g_portfolio_current).replaceWith($(":root",data));
			if (UICom.structure.ui[this.uuid].asmtype=='asmUnit')
				UICom.structure.ui[this.uuid].loaded = true;
		}
	});
	$.ajaxSetup({async: true});
};

//==================================================
UIFactory['Node'].loadStructure = function(uuid)
//==================================================
{
	var parentid = $($(UICom.structure["ui"][uuid].node).parent()).attr('id');
	$.ajaxSetup({async: false});
	$.ajax({
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
			UIFactory["Portfolio"].displaySidebar(UICom.root,'sidebar',null,null,g_edit,UICom.rootid);
			UICom.structure.ui[this.uuid].loaded = true;
		}
	});
	$.ajaxSetup({async: true});
};


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
	html += "<iframe id='bubble_iframe' class='bubble_iframe' src='"+karuta_url+"/karuta/htm/bubble.html?uuid="+this.id+"' height='500' width='100%'></iframe>";
	html += "<div id='map-info_"+this.id+"'></div>";
	html += "<div id='bubble_display_"+this.id+"' class='bubble_display'></div>";
	return html;
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------- displaySemanticTags ----------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================
UIFactory["Node"].prototype.displaySemanticTags = function(destid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var semtag = this.semantictag; //		this.semantictag = $("metadata",node).attr('semantictag');
	var label = this.getLabel(null,'none',langcode);
	var html ="";
	html += "<div class='semtag-line'>";
	html += "	<div class='semtag-line-header'>";
	html += "		<span class='semtag-label'>"+label+"</span>";
	html += "		<span class='badge semtag-value'>"+semtag+"</span>";
	html += "	</div>";
	html += "	<div id='content-"+this.id+"' class='semtag-line-content'></div>";
	html += "</div>";
	$('#'+destid).append($(html));
	var children = $(this.node).children();
	for (var i=0;i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="asmStructure" || tagname=="asmUnit" || tagname=="asmUnitStructure" || tagname=="asmContext")
			UICom.structure.ui[$(children[i]).attr('id')].displaySemanticTags("content-"+this.id,langcode);
	}
};



//=======================================================================================================================================
//=======================================================================================================================================
//======================================= for backward compatibility 2.4 ================================================================
//=======================================================================================================================================
//=======================================================================================================================================

//==============================================================================
UIFactory["Node"].displayColumns = function(type,root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu)
//==============================================================================
{
	
	//----------------- COLUMNS ------------------------
	var uuid = $(root.node).attr("id");
	style = UIFactory["Node"].getContentStyle(uuid);
	html = "<div class='row asmColumn' style='"+style+"'>";
	var blocks = $(root.node).children("asmUnitStructure:has(metadata[semantictag*='asmColumn'])");
	var lgcolumn = Math.floor(12/blocks.length);
	for (var i=0; i<blocks.length; i++) {
		var blockid = $(blocks[i]).attr("id");
		html += "<div id='column_"+blockid+"' class='col-md-"+lgcolumn+"' style='height:100%;"+style+"'>";
		html += "</div><!-- class='col-md' -->";
	}
	html += "</div><!-- class='row' -->";
	$("#content-"+uuid).append(html);
	for (var i=0; i<blocks.length; i++) {
		var blockid = $(blocks[i]).attr("id");
		var child = UICom.structure["tree"][blockid];
		var childnode = UICom.structure["ui"][blockid];
		childnode.displayNode(type,child,'column_'+blockid,this.depth-1,langcode,edit,inline,backgroundParent,root);
	}
}

//==============================================================================
UIFactory["Node"].displayBlocks = function(root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu)
//==============================================================================
{
	//----------------- BLOCKS ------------------------
	var uuid = $(root.node).attr("id");
	var semtag =  ($("metadata",root.node)[0]==undefined)?'': $($("metadata",root.node)[0]).attr('semantictag');
	var max = semtag.substring(semtag.indexOf('asm-block')+10,semtag.indexOf('asm-block')+12);
	if (max>12)
		max=12;
	var lgcolumn = Math.floor(12/max);
	var blocks = $(root.node).children("asmUnitStructure,asmContext");
	html = "<div class='row asmBlockContainer'>";
	for (var i=0; i<blocks.length; i++) {
		if (i!=0 && i%max==0) {
			html += "</div><!-- class='row' -->";
			html += "<div class='row asmBlockContainer'>";
		}
		var blockid = $(blocks[i]).attr("id");
		var blockstyle = UIFactory["Node"].getContentStyle(blockid);
		html += "<div class='col-md-"+lgcolumn+" col-sm-"+lgcolumn+"'>";
		html += "<div id='column_"+blockid+"' class='block' style='"+blockstyle+"'>";
		html += "</div><!-- class='block' -->";
		html += "</div><!-- class='col-md' -->";
	}
	html += "</div><!-- class='row' -->";
	$("#content-"+uuid).append(html);
	for (var i=0; i<blocks.length; i++) {
		var blockid = $(blocks[i]).attr("id");
		var child = UICom.structure["tree"][blockid];
		var nodename = $(child.node).prop("nodeName"); // name of the xml tag
		var childnode = UICom.structure["ui"][blockid];
		var childsemtag = $(childnode.metadata).attr('semantictag');
		var block = false;
		if (nodename == "asmContext" || childsemtag.indexOf('no-title')>-1) {
			childnode.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu);
			UIFactory["Node"].displayBlock(child,'column_'+blockid,this.depth-1,langcode,edit,inline,backgroundParent,root,menu);
		} else {
			if (childnode.structured_resource!=null) {
				childnode.setMetadata(dest,depth,langcode,edit,inline,backgroundParent,parent,menu);
				var html = "<div id='structured_resource_"+blockid+"'>"+childnode.structured_resource.getView('structured_resource_'+blockid,null,langcode)+"</div>";
				var block = true;
				html += childnode.getButtons(langcode);
				//-------------- metainfo -------------------------
				if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
					html += "<div id='metainfo_"+blockid+"' class='metainfo'></div><!-- metainfo -->";
				}
				$('#column_'+blockid).append($(html));
				if (g_userroles[0]=='designer' || USER.admin) {  
					UIFactory.Node.displayMetainfo("metainfo_"+blockid,childnode.node);
					UIFactory.Node.displayMetaEpmInfos("cssinfo_"+blockid,childnode.node);
				}
				//-----------------------------------------------------------------------------
				if (childnode.structured_resource.type="ImageBlock") {
					$("#image_"+blockid).click(function(){
						imageHTML("<img class='img-fluid' style='margin-left:auto;margin-right:auto' src='../../../"+serverBCK+"/resources/resource/file/"+childnode.structured_resource.image_nodeid+"?lang="+languages[langcode]+"'>");
					});
				}
		} else
				UIFactory["Node"].displayNode(type,child,'column_'+blockid,this.depth-1,langcode,edit,inline,backgroundParent,root,menu,true);
		}
	}
}

//==============================================================================
UIFactory["Node"].displayBlock = function(root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu)
//==============================================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
	var menu = true;
	//---------------------------------------
	var data = root.node;
	var nodetype = $(data).prop("nodeName"); // name of the xml tag
	var uuid = $(data).attr("id");
	var node = UICom.structure["ui"][uuid];
	// ---- store info to redisplay after change ---
	node.display_node[dest] = {"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":"block"};
	//------------------metadata----------------------------
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var collapsed = 'N';
	if (!g_designerrole)
		collapsed = (sessionStorage.getItem('collapsed'+uuid)==undefined)?'N':sessionStorage.getItem('collapsed'+uuid);
	else
		collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
	var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	var collapsible = ($(node.metadatawad).attr('collapsible')==undefined)?'N':$(node.metadatawad).attr('collapsible');
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	var seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	var contentfreenode = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	var metadataepm = $(node.metadataepm)[0];
	//-------------------- test if visible
	if ( (display=='N' && (g_userroles[0]=='designer'  || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.indexOf("all")>-1 && !privatevalue) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || g_userroles[0]=='designer')) ) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.containsArrayElt(g_userroles)) || (g_userroles[0]=='designer'  || USER.admin)) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var parent = proxies_parent[uuid];
					if (parent==dest.substring(8) || dest=='contenu') { // dest = {parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer');
					}
			}
			//================================================================================================
			var html = "<div id='node_"+uuid+"' class='asmnode "+nodetype+" "+semtag+" ";
			if(UICom.structure["ui"][uuid].resource!=null)
				html += UICom.structure["ui"][uuid].resource.type;
			html += "'>";
			//============================== ASMCONTEXT =============================
			if (nodetype == "asmContext"){
				if (UICom.structure["ui"][uuid].getLabel(null,'none')!=""){ // test if not empty label
					style = UIFactory.Node.getMetadataEpm(metadataepm,'background-color',false);
					html += "<div  id='title_"+uuid+"' style='"+style+"'>";
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid,null,langcode);
					html += "</div>";
				}
				if (edit && inline && writenode && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL'){
					//------ edit inline ----------------
					style = UIFactory["Node"].getContentStyle(uuid);
					html += "<div id='std_resource_"+uuid+"' class='";
					if (node.resource_type!=null)
						html+= "resource-"+node.resource_type;
					html+= "' >";
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
					//--------- display ------------
					if (g_display_type=='standard') {
						style = UIFactory["Node"].getContentStyle(uuid);
					}
					html += "<div class='block-resource'>";
					html += "<div id='std_resource_"+uuid+"' class='";
					if (node.resource_type!=null)
						html+= "resource-"+node.resource_type;
					html+= "' >";
					html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid,'block');
					html += "</div>";
					html += "</div>";
					//-------------- context -------------------------
					html += "<div id='comments_"+uuid+"' class='comments'></div><!-- comments -->";
				}
				//-------------- buttons --------------------------
				html += UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu);
				//--------------------------------------------------
				//-------------- metainfo -------------------------
				if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
					html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				}
			}
			//============================== NODE ===================================
			else { // other than asmContext
				if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
					html += "<div class='row row-node'>";
					//-------------- buttons --------------------------
					html += "	<div id='buttons-"+uuid+"' class='buttons'>";
					html += UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu);
					if (node.xsi_type == "BatchForm") {
						html += node.structured_resource.getButtons();
					}
					html += "	</div><!-- buttons -->";
					//--------------------------------------------------*/
					html += "</div><!-- row -->";
				}
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					html += "<div id='content-"+uuid+"' class='content' ";
					style = "position:relative;";
					style += UIFactory.Node.getMetadataEpm(metadataepm,'node-background-color',false);
					style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-style',false);
					style += UIFactory.Node.getMetadataEpm(metadataepm,'node-color',false);
					style += UIFactory.Node.getMetadataEpm(metadataepm,'node-padding-top',true);
					style += UIFactory.Node.getMetadataEpm(metadataepm,'node-othercss',false);
					html +=" style='"+style+"'";
					html += ">";
					//-----------------------------------------
					var graphicers = $("metadata-wad[graphicerroles*="+g_userroles[0]+"]",data);
					if (contentfreenode=='Y' && (graphicers.length>0 || g_userroles[0]=='designer'))
						html += "<button class='btn  free-toolbar-menu' id='free-toolbar-menu_"+uuid+"' data-toggle='tooltip' data-placement='right' title='"+karutaStr[languages[langcode]]["free-toolbar-menu-tooltip"]+"'><span class='glyphicon glyphicon-menu-hamburger'></span></button>";
					//-----------------------------------------
					html += "</div>";
				}
				
			}
			html += "</div><!-- nodetype -->";
			//==============================fin NODE ===================================
			if ( $("#node_"+uuid).length>0 )
				$("#node_"+uuid).replaceWith($(html));
			else
				$("#"+dest).append($(html));
			//-------Calcul taille TextField ------------------
			if ($("#title_"+uuid).outerHeight()>0)
				$("#std_resource_"+uuid).outerHeight(g_block_height-$("#title_"+uuid).outerHeight()); 
			var h1 = $("#std_resource_"+uuid)[0].scrollHeight;
			if (h1>g_block_height-$("#title_"+uuid).outerHeight()){
				$("#std_resource_"+uuid).outerHeight(g_block_height-$("#title_"+uuid).outerHeight()-20);
				$("#std_resource_"+uuid).parent().append($("<div class='thereismore' id='plus_"+uuid+"' style='text-align:right;cursor:pointer'>&nbsp;&nbsp; ... &nbsp;&nbsp;</div>"));
				$("#std_resource_"+uuid).click(function(){
					messageHTML(UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid));
				});
			}
			//-----------------------------------------------------------------------------
			if (nodetype == "asmContext" && node.resource.type=='Image') {
				$("#image_"+uuid).click(function(){
					imageHTML("<img class='img-fluid' style='margin-left:auto;margin-right:auto' uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+uuid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"'>");
				});
			}
			//---------------------------- BUTTONS AND BACKGROUND COLOR ---------------------------------------------
			var buttons_color = eval($(".button").css("color"));
			var buttons_background_style = UIFactory.Node.getMetadataEpm(metadataepm,'background-color',false);
			if (buttons_background_style!="") {
				var buttons_background_color = buttons_background_style.substring(buttons_background_style.indexOf(":")+1,buttons_background_style.indexOf(";"))
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			var buttons_node_background_style = UIFactory.Node.getMetadataEpm(metadataepm,'node-background-color',false);
			if (buttons_node_background_style!="") {
				var buttons_node_background_color = buttons_node_background_style.substring(buttons_node_background_style.indexOf(":")+1,buttons_node_background_style.indexOf(";"))
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			//--------------------collapsed------------------------------------------
			if (collapsible=='Y') {
				if (collapsed=='Y') {
					$("#toggleContent_"+uuid).attr("class","fas fa-plus");
					$("#content-"+uuid).hide();
				}
				else {
					$("#toggleContent_"+uuid).attr("class","fas fa-minus");
					$("#content-"+uuid).show();
				}
			}
			//--------------------set editor------------------------------------------
			if ($("#display_editor_"+uuid).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid);
			}
			if ($("#get_editor_"+uuid).length>0) {
				$("#get_editor_"+uuid).append(UICom.structure["ui"][uuid].resource.getEditor());
			}
			//----------- Comments -----------
			if (edit && inline && writenode)
				UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
			else
				UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				if (depth>0) {
					var attr_help = $($("metadata-wad",data)[0]).attr('help');
					var helps = attr_help.split("/"); // lang1/lang2/...
					if (attr_help.indexOf("@")>-1) { // lang@fr/lang@en/...
						for (var j=0; j<helps.length; j++){
							if (helps[j].indexOf("@"+languages[langcode])>-1)
								help_text = helps[j].substring(0,helps[j].indexOf("@"));
						}
					} else { // lang1/lang2/...
						help_text = helps[langcode];  // lang1/lang2/...
					}
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-question-sign'></span></a> ";
					$("#help_"+uuid).html(help);
					$(".popinfo").popover({ 
					    placement : 'right',
					    container : 'body',
					    title:karutaStr[LANG]['help-label'],
					    html : true,
					    trigger:'click hover',
					    content: help_text
					});
				}
			}
			//----------------------------------------------
			$("#free-toolbar-menu_"+uuid).click(function(){
				if ($(".free-toolbar",$("#content-"+uuid)).css('visibility')=='hidden') {
					$(".free-toolbar",$("#content-"+uuid)).css('visibility','visible');
					g_free_toolbar_visibility = 'visible';
				}
				else {
					$(".free-toolbar",$("#content-"+uuid)).css('visibility','hidden');
					g_free_toolbar_visibility = 'hidden';
				}
			});
			// -------------- display metainfo
			if (g_userroles[0]=='designer' || USER.admin) {  
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
			//------------ Dashboard -----------------
			if (nodetype == "asmContext" && node.resource.type=='Dashboard') {
				$("#"+dest).append($("<div class='row'><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div></div>"));
				var root_node = g_portfolio_current;
				genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
			}
			//------------ Report -----------------
			if (nodetype == "asmContext" && node.resource.type=='Report') {
				$("#"+dest).append($("<div class='row'><div id='exec_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div><div id='csv_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='pdf_button_"+uuid+"' class='col-md-1 btn-group'></div></div>"));
				var model_code = UICom.structure["ui"][uuid].resource.getView();
				if (model_code!='') {
					$.ajax({
						type : "GET",
						url : serverBCK_REP+"/"+uuid+".html",
						dataType: 'html',
						headers: {
		                    'Access-Control-Allow-Origin': '*'
		                },
						crossDomain: true,
						success : function(data) {
							var content_report =  $(data).find("#dashboard_"+uuid).html();
							$("#dashboard_"+uuid).html(content_report);
						},
						error : function(jqxhr,textStatus) {
							var root_node = g_portfolio_current;
							genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);
						}
					});
					$("#exec_button_"+uuid).html($("<div class='exec-button button'>"+karutaStr[LANG]['exec']+"</div>"));
					$("#exec_button_"+uuid).click(function(){$("#dashboard_"+uuid).html('');genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);});
					//---------- display csv or pdf -------
					var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
					if (csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
					}
					var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
					if (pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div><div class='pdf-button button' onclick=\"javascript:xml2RTF('dashboard_"+uuid+"')\">RTF/Word</div>"));				
					}
					var img_roles = $(UICom.structure["ui"][uuid].resource.img_node).text();
					if (img_roles.containsArrayElt(g_userroles) || (img_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:html2IMG('dashboard_"+uuid+"')\">PNG</div>"));
					}
				}
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
			}
			// ================================= For each child ==========================
			var backgroundParent = UIFactory.Node.getMetadataEpm(metadataepm,'node-background-color',false);
			if (semtag.indexOf('asmColumns')>-1) {
					//----------------- COLUMNS ------------------------
					var blockid = $(root.node).attr("id");
					style = UIFactory["Node"].getContentStyle(blockid);
					html = "<div class='row asmColumn' style='"+style+"'>";
					var blocks = $(root.node).children("asmUnitStructure:has(metadata[semantictag*='asmColumn'])");
					var lgcolumn = Math.floor(12/blocks.length);
					for (var i=0; i<blocks.length; i++) {
						var blockid = $(blocks[i]).attr("id");
						html += "<div id='column_"+blockid+"' class='col-md-"+lgcolumn+"' style='height:100%;"+style+"'>";
						html += "</div><!-- class='col-md' -->";
					}
					html += "</div><!-- class='row' -->";
					$("#content-"+uuid).append(html);
					for (var i=0; i<blocks.length; i++) {
						var blockid = $(blocks[i]).attr("id");
						var child = UICom.structure["tree"][blockid];
						UIFactory["Node"].displayNode(type,child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
					}
					//---------------------------------------
			} else if (semtag.indexOf('asm-block')>-1) {
				//----------------- BLOCKS ------------------------
				var blockid = $(root.node).attr("id");
				var max = semtag.substring(semtag.indexOf('asm-block')+10,semtag.indexOf('asm-block')+12);
				if (max>12)
					max=12;
				var lgcolumn = Math.floor(12/max);
				var blocks = $(root.node).children("asmUnitStructure,asmContext");
				html = "<div class='row asmBlockContainer'>";
				for (var i=0; i<blocks.length; i++) {
					var blockid = $(blocks[i]).attr("id");
					if (i!=0 && i%max==0) {
						html += "</div><!-- class='row' -->";
						html += "<div class='row asmBlockContainer'>";
					}
					var blockid = $(blocks[i]).attr("id");
					var blockstyle = UIFactory["Node"].getContentStyle(blockid);
					html += "<div class='col-md-"+lgcolumn+" col-sm-"+lgcolumn+"'>";
					html += "<div id='column_"+blockid+"' class='block' style='"+blockstyle+"'>";
					html += "</div><!-- class='block' -->";
					html += "</div><!-- class='col-md' -->";
				}
				html += "</div><!-- class='row' -->";
				$("#content-"+uuid).append(html);
				for (var i=0; i<blocks.length; i++) {
					var blockid = $(blocks[i]).attr("id");
					var child = UICom.structure["tree"][blockid];
					var nodename = $(child.node).prop("nodeName"); // name of the xml tag
					var childnode = UICom.structure["ui"][blockid];
					var childsemtag = $(childnode.metadata).attr('semantictag');
					var block = false;
					if (nodename == "asmContext" || childsemtag.indexOf('no-title')>-1)
						UIFactory["Node"].displayBlock(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
					else {
						if (childnode.structured_resource!=null) {
							var html = childnode.structured_resource.getView(dest,null,langcode);
							$('column_'+blockid).append($(html));
						} else
							UIFactory["Node"].displayNode(type,child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
					}
				}
				//---------------------------------------
			} else {
				var alreadyDisplayed = false;
				if (typeof europass_installed != 'undefined' && europass_installed && semtag=="EuropassL"){
					alreadyDisplayed = true;
					if( node.structured_resource != null )
					{
						node.structured_resource.displayView('content-'+uuid,langcode,'detail',uuid,menu);
					}
					else
					{
						alert('EUROPASS not installed');
					}
				}
				if (!alreadyDisplayed && semtag!='bubble_level1') {
					for( var i=0; i<root.children.length; ++i ) {
						// Recurse
						var child = UICom.structure["tree"][root.children[i]];
						var childnode = UICom.structure["ui"][root.children[i]];
						var childsemtag = $(childnode.metadata).attr('semantictag');
						var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
						if (contentfreenode == 'Y' || freenode == 'Y')
							UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
						else
							UIFactory["Node"].displayNode(type,child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent,root);
					}
				}
			}
			// ==============================================================================
$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

			$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
			$(".pickcolor").colorpicker();
			//----------------------------
		}
	} //---- end of private
};

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
		html += UICom.structure["ui"][titleid].resource.getView('welcome-title','span')
		html += "</div>";
		html += "<div class='welcome-line'/>";
		var texts = $("asmContext:has(metadata[semantictag='welcome-baseline'])",data);
		var textid = $(texts[0]).attr("id");
		html += "<div class='welcome-baseline' id='welcome-baseline' style='"+UIFactory["Node"].getContentStyle(textid)+"'>";
		html += UICom.structure["ui"][textid].resource.getView('welcome-baseline');
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
			var child = UICom.structure["tree"][$(welcome_blocks[i]).attr("id")];
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
	$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
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
	html += UICom.structure["ui"][welcome_blockid].getView('welcome-title_'+welcome_blockid,'span');
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
		html += UICom.structure["ui"][nodeid].resource.getView('welcome_resource_'+nodeid);
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


