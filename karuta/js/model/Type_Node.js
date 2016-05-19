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
		this.xsi_type = $(node).attr('xsi_type');
		this.node = node;
		this.asmtype = $(node).prop("nodeName");
		this.code_node = $($("code",node)[0]);
		//--------------------
		if ($("value",$("asmResource[xsi_type='nodeRes']",node)).length==0){  // for backward compatibility
			var newelement = createXmlElement("value");
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newelement);
		}
		this.value_node = $("value",$("asmResource[xsi_type='nodeRes']",node));
		//------------------------------
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
			if (this.label_node[i].text()=="" && (this.asmtype=="asmRoot" || this.asmtype=="asmStructure" || this.asmtype=="asmUnit" ))
				this.label_node[i].text("&nbsp;"); // to be able to edit it
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
		this.display_node = {}; // to refresh after changes (metadataepm)
		//------------------------------
		this.structured_resource = null;
		if (this.xsi_type!=undefined && this.xsi_type!='' && this.xsi_type != this.asmtype) { // structured resource
			this.structured_resource = new UIFactory[this.xsi_type](node);
		}
	}
	catch(err) {
		alertHTML("UIFactory['Node']--"+err.message+"--"+this.id+"--"+this.resource_type);
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
		if (g_userroles[0]=='designer' || USER.admin) {
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
		if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
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
		if ((g_userroles[0]=='designer' || USER.admin || resizeroles.containsArrayElt(g_userroles) || resizeroles.indexOf(this.userrole)>-1) && this.resource!=undefined && this.resource.type=='Image') {
			var htmlHeight = UIFactory["Node"].getMetadataEpmAttributeEditor(this.id,'height',$(this.metadataepm).attr('height'));
			$(htmlFormObj).append($(htmlHeight));
			var htmlWidth = UIFactory["Node"].getMetadataEpmAttributeEditor(this.id,'width',$(this.metadataepm).attr('width'));
			$(htmlFormObj).append($(htmlWidth));
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
	for (dest1 in this.display) {
		$("#"+dest1).html(this.getView(null,null,this.display[dest1]));
	};
	for (dest2 in this.display_label) {
		$("#"+dest2).html(this.getLabel(null,this.display_label[dest2],null));
	};
	for (dest3 in this.display_node) {
		if (this.display_node[dest3].display=="free"){
			$("#free_"+this.display_node[dest3].uuid).remove();
			UIFactory["Node"].displayFree(this.display_node[dest3].root, this.display_node[dest3].dest, this.display_node[dest3].depth,this.display_node[dest3].langcode,this.display_node[dest3].edit,this.display_node[dest3].inline);
		}
		if (this.display_node[dest3].display=="standard"){
			UIFactory["Node"].displayStandard(this.display_node[dest3].root, this.display_node[dest3].dest, this.display_node[dest3].depth,this.display_node[dest3].langcode,this.display_node[dest3].edit,this.display_node[dest3].inline,this.display_node[dest3].backgroundParent);
		}
		if (this.display_node[dest3].display=="block"){
			UIFactory["Node"].displayBlock(this.display_node[dest3].root, this.display_node[dest3].dest, this.display_node[dest3].depth,this.display_node[dest3].langcode,this.display_node[dest3].edit,this.display_node[dest3].inline,this.display_node[dest3].backgroundParent);
		}
	};
};

//==================================
UIFactory["Node"].duplicate = function(uuid,callback,databack,param2,param3,param4,param5,param6,param7,param8)
//==================================
{
	var destid = $($(UICom.structure["ui"][uuid].node).parent()).attr('id');
	$("#wait-window").modal('show');
	var urlS = "../../../"+serverBCK+"/nodes/node/import/"+destid+"?uuid="+uuid;  // instance by default
	if (USER.admin || g_userrole=='designer') {
		var rights = UIFactory["Node"].getRights(destid);
		var roles = $("role",rights);
		if (roles.length==0) // test if model (otherwise it is an instance and we import)
			urlS = "../../../"+serverBCK+"/nodes/node/copy/"+destid+"?uuid="+uuid;
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
				url : "../../../"+serverBCK+"/nodes/node/"+uuid,
				success : function(data) {
					//------------------------------
					var code = $($("code",data)[0]).text();
					var label = [];
					for (var i=0; i<languages.length;i++){
						label[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",data)[0]).text();
						var lastspace_indx = label[i].lastIndexOf(' ');
						var nb = label[i].substring(lastspace_indx);
						if ($.isNumeric(nb)) {
							nb++;
							label[i] = label[i].substring(0,lastspace_indx)+' '+nb;
						}
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
						url : "../../../"+serverBCK+"/nodes/node/" + uuid + "/noderesource",
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
	if (type=='standard' || type=='translate') {
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
			if ((display=='N' && (g_userroles[0]=='designer' || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer'))) {
				if(name == "asmUnit") // Click on Unit
				{
					var html = "";
					var depth = 99;
					html += "<div class='sidebar-item' id='parent-"+uuid+"' role='tablist'>";
					html += "  <a style='cursor:pointer' id='sidebar_"+uuid+"' class='sidebar-link' onclick=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" >"+text+"</a>";
					html += "</div><!-- panel -->";
					$("#"+destid).append($(html));
				}
				if(name == "asmStructure") // Click on Structure
				{
					var depth = 1;
					var html = "";
					html += "<div class='sidebar-item' id='parent-"+uuid+"' role='tablist'>";
					html += "  <div  class='sidebar-link' style='cursor:pointer' data-toggle='collapse' data-parent='#parent-"+parentid+"' href='#collapse"+uuid+"' redisplay=\"displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\" onclick=\"toggleSidebarPlusMinus('"+uuid+"');displayPage('"+uuid+"',"+depth+",'"+type+"','"+langcode+"',"+g_edit+")\">";
					if (g_toggle_sidebar[uuid]!=undefined && g_toggle_sidebar[uuid]=='open')
						html += "  <small ><span  id='toggle_"+uuid+"' class='glyphicon glyphicon-minus' style='float:right;margin-right:5px;'></span></small>";
					else
						html += "  <small ><span  id='toggle_"+uuid+"' class='glyphicon glyphicon-plus' style='float:right;margin-right:5px;'></span></small>";
					html += "  <a id='sidebar_"+uuid+"'>"+text+"</a>";
					html += "  </div>"
					if (g_toggle_sidebar[uuid]!=undefined && g_toggle_sidebar[uuid]=='open')
						html += "<div id='collapse"+uuid+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='sidebar_"+uuid+"'>";
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
	html += "<div id='welcome-image' style=\"background: url('../../../"+serverFIL+"/resources/resource/file/"+imageid+"?lang="+languages[langcode]+"')\">";
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
			UIFactory["Node"].displayStandard(child,'welcome-blocks',depth,langcode,edit,inline,backgroundParent,1,menu);
		}
	}
	//---------------------------------------
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	if ( (g_userroles[0]=='designer' && semtag.indexOf('welcome-unit')>-1) || (semtag.indexOf('welcome-unit')>-1 && semtag.indexOf('-editable')>-1 && semtag.containsArrayElt(g_userroles)) ) {
		html = "<a  class='glyphicon glyphicon-edit' onclick=\"if(!g_welcome_edit){g_welcome_edit=true;} else {g_welcome_edit=false;};$('#contenu').html('');displayPage('"+uuid+"',100,'standard','"+langcode+"',true)\" data-title='"+karutaStr[LANG]["button-welcome-edit"]+"' data-tooltip='true' data-placement='bottom'></a>";
		$("#welcome-edit").html(html);
	}
	$('[data-tooltip="true"]').tooltip();
}

//==================================================
UIFactory["Node"].getLabelStyle = function(uuid)
//==================================================
{
	var node = UICom.structure["ui"][uuid];
	metadataepm = $(node.metadataepm);
	var style = "";
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'width',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'height',true);
	style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'othercss');
	return style;
}

//==================================================
UIFactory["Node"].getContentStyle = function(uuid)
//==================================================
{
	var node = UICom.structure["ui"][uuid];
	metadataepm = $(node.metadataepm);
	var style = "";
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-size',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-weight',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-text-align',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-width',true);
	style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-height',true);
	style += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'node-othercss');
	return style;
}


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

//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].displayStandard = function(root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock)
//==============================================================================
//==============================================================================
//==============================================================================
{
	if (edit==null || edit==undefined)
		edit = false;
	if (inline==null || inline==undefined)
		inline = false;
	if (menu==null || menu==undefined)
		menu = true;
	if (inblock==null || inblock==undefined)
		inblock = false;
	//---------------------------------------
	var data = root.node;
	var nodetype = $(data).prop("nodeName"); // name of the xml tag
	var uuid = $(data).attr("id");
	var node = UICom.structure["ui"][uuid];
	// ---- store info to redisplay after change ---
	node.display_node[dest] = {"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":"standard"};
	//------------------metadata----------------------------
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var semtag =  ($("metadata",data)[0]==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	var collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
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
	//-------------------- test if visible
	if ( (display=='N' && (g_userroles[0]=='designer'  || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || g_userroles[0]=='designer')) ) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.containsArrayElt(g_userroles)) || (g_userroles[0]=='designer'  || USER.admin)) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var proxy_parent = proxies_parent[uuid];
					if (proxy_parent==dest.substring(8) || dest=='contenu') { // dest = content_{parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer');
					}
			}
			//================================================================================================
			var html = "<div id='node_"+uuid+"' class='standard asmnode "+nodetype+" "+semtag+" ";
			if(UICom.structure["ui"][uuid].resource!=null)
				html += UICom.structure["ui"][uuid].resource.type;
			html += "'";
			//-------------- css attribute -----------
			var metadataepm = $(node.metadataepm);
	//		if (proxy_target)
	//			metadataepm = UICom.structure["ui"][proxies_nodeid["proxy-"+semtag]].metadataepm;
			var style = "";
//			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
			if (style.length>0 && depth>0)
				html += " style='"+style+"' ";
			//----------------------------------
			html += ">";
			//============================== ASMCONTEXT =============================
			if (nodetype == "asmContext"){
				html += "<div class='row row-resource'>";
				var parent_semtag = "";
				if (parent!=null)
					parent_semtag = $($("metadata",parent.node)[0]).attr('semantictag');
				//-------------- node -----------------------------
				html += "<div id='std_node_"+uuid+"' class='";
				if (parent_semtag.indexOf('asm-block')<0)
					html += "col-md-offset-1 ";
				html += "col-md-2 node-label inside-full-height'>";
				style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
				html += "<div class='inside-full-height' style='"+style+"'>";
				html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				html += "</div><!-- inside-full-height -->";
				html += "</div><!-- col-md-2 -->";
				if (parent_semtag.indexOf('asm-block')<0)
					html += "<div class='col-md-8' >";
				else
					html += "<div class='col-md-10' >";
				html += "<table><tr>";
				//-------------- resource -------------------------
				if (g_designerrole) {
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
				}
				if (g_userroles[0]=='designer') {
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (g_userroles[0]=='designer')? true : false;
				}
				if (edit && inline && writenode && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL'){
					//------ edit inline ----------------
					style = UIFactory["Node"].getContentStyle(uuid);
					html += "<td  width='80%' class='resource";
					html += "' ";
					html += " style='"+style+"' ";
					html += ">";
					html += "<div id='std_resource_"+uuid+"' class='inside-full-height ";
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
					html += "</div><!-- inside-full-height -->";
					html += "</td>";
				} else {
					//--------- display ------------
					if (g_display_type=='standard') {
						style = UIFactory["Node"].getContentStyle(uuid);
						html += "<td  width='80%' class='resource";
						html += "' ";
						html += " style='"+style+"' ";
						html += ">";
					}
					html += "<div id='std_resource_"+uuid+"' class='inside-full-height ";
					if (node.resource_type!=null)
						html+= "resource-"+node.resource_type;
					html+= "' >";
					html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
					html += "</div><!-- inside-full-height -->";
					//-------------- context -------------------------
					html += "<div id='comments_"+uuid+"' class='comments'></div><!-- comments -->";
					html += "</td>";
				}

				//-------------- buttons --------------------------
				html += "<td id='buttons-"+uuid+"' class='buttons same-height'>";
				html += "<div class='inside-full-height'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
				html += "</td>";
				//--------------------------------------------------
				html += "</tr></table>";
				html += "</div><!-- col-md-8  -->";
				if (parent_semtag.indexOf('asm-block')<0)
					html += "<div class='col-md-1'>&nbsp;</div><!-- col-md-1  -->";
				html += "</div><!-- inner row -->";
				//-------------- metainfo -------------------------
				if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
					html += "<div class='row'><div id='metainfo_"+uuid+"' class='col-md-offset-1 col-md-10 metainfo'></div><!-- metainfo --></div>";
				}
			}
			//============================== NODE ===================================
			else { // other than asmContext
				if (nodetype=='asmUnitStructure')
					depth=100;	
				style = "";
				if (depth>0) {
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
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
				html += "<div class='row row-node row-node-"+nodetype+"'  style='"+style+"'>";
				//-------------------- collapsible -------------------
				if (collapsible=='Y')
					html += "<div onclick=\"javascript:toggleContent('"+uuid+"')\" class='col-md-1 collapsible'><span id='toggleContent_"+uuid+"' class='button glyphicon glyphicon-expand'></span></div>";
				else
					html += "<div class='col-md-1'>&nbsp;</div>";
	
				//-------------- node -----------------------------
				if (depth!=1 && depth<10 && nodetype=='asmStructure') {
					if (g_display_type=='standard')
						html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7 same-height'>";
					if (g_display_type=='header')
						html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7 same-height'>";
						html += "<a  onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>";
					}
				else if (depth!=1 && depth<10 && nodetype=='asmUnit') {
					if (g_display_type=='standard')
						html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7 same-height' style='"+style+"'>";
					if (g_display_type=='header')
						html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7'>";
						html += "<a  onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
					}
				else {
					if (g_display_type=='standard')
						html += "<div id='std_node_"+uuid+"' class='node-label col-md-7  same-height'";
//					if (nodetype=='asmUnitStructure' && collapsible=='Y')
//						html += " onclick=\"javascript:toggleContent('"+uuid+"')\" style='"+style+";cursor:pointer'> ";
//					else
						html += " style='"+style+"'>";
					if (g_display_type=='header') {
						html += "<div id='std_node_"+uuid+"' class='node-label col-md-offset-1 col-md-7  same-height'";
						if (g_userroles[0]!='designer' && semtag=='header')
							html += " style='visibility:hidden'";
						if (semtag!='header')
							html += " style='"+style+"'";
						html += ">";
					}
					//-------------------------------------------------
					var gotView = false;
					if (semtag=='bubble_level1'){
						html += " "+UICom.structure["ui"][uuid].getBubbleView('std_node_'+uuid);
						gotView = true;
					}
					if (!gotView)
						html += " "+UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				}
				//------------------------------------------------
				html += "<div class='separator-line'></div>"
				//-------------- context -------------------------
				html += "<div id='comments_"+uuid+"' class='comments'></div><!-- comments -->";
				//-------------- metainfo -------------------------
				html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				//-----------------------------------------------
				html += "</div><!-- col-md-8 -->";
				//-------------- buttons --------------------------
				if (semtag.indexOf("bubble_level1")>-1)
					menu = false;
				html += "<div id='buttons-"+uuid+"' class='col-md-4 buttons'>";
				html += UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu);
				html += "</div><!-- col-md-3  -->";
				html += "</div><!-- row -->";
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					html += "<div id='content-"+uuid+"' class='content' ";
					style = "position:relative;";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
					html +=" style='"+style+"'";
					html += ">";
					//-----------------------------------------
					var graphicers = $("metadata-wad[graphicerroles*="+g_userroles[0]+"]",data);
					if (contentfreenode=='Y' && (graphicers.length>0 || g_userroles[0]=='designer'))
						html += "<button class='btn btn-xs free-toolbar-menu' id='free-toolbar-menu_"+uuid+"' data-toggle='tooltip' data-placement='right' title='"+karutaStr[languages[langcode]]["free-toolbar-menu-tooltip"]+"'><span class='glyphicon glyphicon-menu-hamburger'></span></button>";
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
			//---------------------------- BUTTONS AND BACKGROUND COLOR ---------------------------------------------
			var buttons_color = eval($(".button").css("color"));
			var buttons_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
			if (buttons_background_style!="") {
				var buttons_background_color = buttons_background_style.substring(buttons_background_style.indexOf(":")+1,buttons_background_style.indexOf(";"))
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			var buttons_node_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
			if (buttons_node_background_style!="") {
				var buttons_node_background_color = buttons_node_background_style.substring(buttons_node_background_style.indexOf(":")+1,buttons_node_background_style.indexOf(";"))
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			//-----------------------------------------------------------------------
			if (nodetype == "asmContext" && node.resource.type=='Image') {
				$("#image_"+uuid).click(function(){
					imageHTML("<img class='img-responsive' style='margin-left:auto;margin-right:auto' uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+uuid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"'>");
				});
			}
			//--------------------collapsed------------------------------------------
			if (collapsible=='Y') {
				if (collapsed=='Y') {
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-plus collapsible");
					$("#content-"+uuid).hide();
				}
				else {
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-minus collapsible");
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
				if (depth>0 || nodetype == "asmContext") {
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
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-info-sign'></span></a> ";
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
			//---------- video ------------------
			if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			// -------------- display metainfo
			if (g_userroles[0]=='designer' || USER.admin) {  
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
			//------------ Dashboard -----------------
			if (nodetype == "asmContext" && node.resource.type=='Dashboard') {
				$("#"+dest).append($("<div class='row'><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div><div id='csv_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='pdf_button_"+uuid+"' class='col-md-1 btn-group'></div></div>"));
				var root_node = g_portfolio_current;
				var model_code = UICom.structure["ui"][uuid].resource.getView();
				if (model_code.indexOf("@local")>-1){
					root_node = parent.node;
					model_code = model_code.substring(0,model_code.indexOf("@local"))+model_code.substring(model_code.indexOf("@local")+6);
				}
				var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
				if (model_code.indexOf('.')<0 && model_code!='self' && model_code!='')  // There is no project, we add the project of the current portfolio
					model_code = selfcode.substring(0,selfcode.indexOf('.')) + "." + model_code;
				try {
					if (g_dashboard_models[model_code]!=null && g_dashboard_models[model_code]!=undefined)
						processPortfolio(0,g_dashboard_models[model_code],"dashboard_"+uuid,root_node,0);
					else
						report_getModelAndPortfolio(model_code,root_node,"dashboard_"+uuid,g_dashboard_models);
				}
				catch(err) {
					alertHTML("Error in Dashboard : " + err.message);
				}
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
				//---------- display csv or pdf -------
				var html_csv_pdf = ""
				var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
				if (csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
					$("#csv_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
				}
				var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
				if (pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
					$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div>"));				
				}
				$("#wait-window").show(1000,function(){sleep(1000);$("#wait-window").hide(1000)});					
			}
			// ================================= For each child ==========================
			var backgroundParent = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
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
						UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
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
						UIFactory["Node"].displayBlock(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root,menu);
					else {
						if (childnode.structured_resource!=null) {
							var html = "<div id='structured_resource_"+blockid+"'>"+childnode.structured_resource.getView('structured_resource_'+blockid,null,langcode)+"</div>";
							var menu = false;
							html += UICom.structure["ui"][blockid].getButtons(null,null,null,inline,depth,edit,menu);
							//-------------- metainfo -------------------------
							if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
								html += "<div id='metainfo_"+blockid+"' class='metainfo'></div><!-- metainfo -->";
							}
							$('#column_'+blockid).append($(html));
							if (g_userroles[0]=='designer' || USER.admin) {  
								UIFactory["Node"].displayMetainfo("metainfo_"+blockid,childnode.node);
							}
							//-----------------------------------------------------------------------------
							if (childnode.structured_resource.type="ImageBlock") {
								$("#image_"+blockid).click(function(){
									imageHTML("<img class='img-responsive' style='margin-left:auto;margin-right:auto' src='../../../"+serverFIL+"/resources/resource/file/"+childnode.structured_resource.image_nodeid+"?lang="+languages[langcode]+"'>");
								});
							}
					} else
							UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root,menu,true);
					}
				}
				//---------------------------------------
			} else {
				var gotDisplay = false;
				if (semtag=="EuropassL"){
					gotDisplay = true;
					UIFactory["EuropassL"].displayView('content-'+uuid,langcode,'detail',uuid);
				}
				if (!gotDisplay && semtag!='bubble_level1') {
					for( var i=0; i<root.children.length; ++i ) {
						// Recurse
						var child = UICom.structure["tree"][root.children[i]];
						var childnode = UICom.structure["ui"][root.children[i]];
						var childsemtag = $(childnode.metadata).attr('semantictag');
						var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
						if (contentfreenode == 'Y' || freenode == 'Y')
							UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
						else
							UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent,root,menu);
					}
				}
			}
			// ==============================================================================
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
			//-------------------------------------------------------
//			$('input[name="datepicker"]').datepicker({format: 'yyyy/mm/dd'});
			$('a[data-toggle=tooltip]').tooltip({html:true});
			$('[data-tooltip="true"]').tooltip();
			$(".pickcolor").colorpicker();
			//----------------------------
			var multilingual_resource = ($("metadata",data).attr('multilingual-resource')=='Y') ? true : false;
			if (!multilingual_resource)
				$("#embed"+uuid+NONMULTILANGCODE).oembed();
			else
				$("#embed"+uuid+langcode).oembed();
			//----------------------------
		}
		if ( (g_userroles[0]=='designer' && semtag.indexOf('welcome-unit')>-1) || (semtag.indexOf('welcome-unit')>-1 && semtag.indexOf('-editable')>-1 && semtag.containsArrayElt(g_userroles)) ) {
			html = "<a  class='glyphicon glyphicon-edit' onclick=\"if(!g_welcome_edit){g_welcome_edit=true;} else {g_welcome_edit=false;};$('#contenu').html('');displayPage('"+uuid+"',100,'standard','0',true)\" data-title='"+karutaStr[LANG]["button-welcome-edit"]+"' data-tooltip='true' data-placement='bottom'></a>";
			$("#welcome-edit").html(html);
		}
		$('[data-tooltip="true"]').tooltip();
	} //---- end of private
};

//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].displayBlock = function(root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu)
//==============================================================================
//==============================================================================
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
	var collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
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
	var metadataepm = $(node.metadataepm);
	//-------------------- test if visible
	if ( (display=='N' && (g_userroles[0]=='designer'  || USER.admin)) || (display=='Y' && (seenoderoles.indexOf("all")>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || g_userroles[0]=='designer')) ) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.containsArrayElt(g_userroles)) || (g_userroles[0]=='designer'  || USER.admin)) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.containsArrayElt(g_userroles) || (showtoroles.containsArrayElt(g_userroles) && !privatevalue) || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var parent = proxies_parent[uuid];
					if (parent==dest.substring(8) || dest=='contenu') { // dest = content_{parentid}
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
					style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
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
					html += "	</div><!-- buttons -->";
					//--------------------------------------------------*/
					html += "</div><!-- row -->";
				}
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					html += "<div id='content-"+uuid+"' class='content' ";
					style = "position:relative;";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
					html +=" style='"+style+"'";
					html += ">";
					//-----------------------------------------
					var graphicers = $("metadata-wad[graphicerroles*="+g_userroles[0]+"]",data);
					if (contentfreenode=='Y' && (graphicers.length>0 || g_userroles[0]=='designer'))
						html += "<button class='btn btn-xs free-toolbar-menu' id='free-toolbar-menu_"+uuid+"' data-toggle='tooltip' data-placement='right' title='"+karutaStr[languages[langcode]]["free-toolbar-menu-tooltip"]+"'><span class='glyphicon glyphicon-menu-hamburger'></span></button>";
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
				$("#std_resource_"+uuid).parent().append($("<div id='plus_"+uuid+"' style='text-align:right;cursor:pointer'>&nbsp;&nbsp; ... &nbsp;&nbsp;</div>"));
				$("#std_resource_"+uuid).click(function(){
					messageHTML(UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid));
				});
			}
			//-----------------------------------------------------------------------------
			if (nodetype == "asmContext" && node.resource.type=='Image') {
				$("#image_"+uuid).click(function(){
					imageHTML("<img class='img-responsive' style='margin-left:auto;margin-right:auto' uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+uuid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"'>");
				});
			}
			//---------------------------- BUTTONS AND BACKGROUND COLOR ---------------------------------------------
			var buttons_color = eval($(".button").css("color"));
			var buttons_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
			if (buttons_background_style!="") {
				var buttons_background_color = buttons_background_style.substring(buttons_background_style.indexOf(":")+1,buttons_background_style.indexOf(";"))
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			var buttons_node_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
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
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-plus");
					$("#content-"+uuid).hide();
				}
				else {
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-minus");
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
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-info-sign'></span></a> ";
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
			//---------- video ------------------
			if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			// -------------- display metainfo
			if (g_userroles[0]=='designer' || USER.admin) {  
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
			//------------ Dashboard -----------------
			if (nodetype == "asmContext" && node.resource.type=='Dashboard') {
				$("#"+dest).append($("<div class='row'><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div></div>"));
				var root_node = g_portfolio_current;
				var model_code = UICom.structure["ui"][uuid].resource.getView();
				if (model_code.indexOf("@local")>-1){
					root_node = parent.node;
					model_code = model_code.substring(0,model_code.indexOf("@local"))+model_code.substring(model_code.indexOf("@local")+6);
				}
				var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
				if (model_code.indexOf('.')<0 && model_code!='self' && model_code!='')  // There is no project, we add the project of the current portfolio
					model_code = selfcode.substring(0,selfcode.indexOf('.')) + "." + model_code;
				try {
					if (g_dashboard_models[model_code]!=null && g_dashboard_models[model_code]!=undefined)
						processPortfolio(0,g_dashboard_models[model_code],"dashboard_"+uuid,root_node,0);
					else
						report_getModelAndPortfolio(model_code,root_node,"dashboard_"+uuid,g_dashboard_models);
				}
				catch(err) {
					alertHTML("Error in Dashboard : " + err.message);
				}
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
			}
			// ================================= For each child ==========================
			var backgroundParent = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
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
						UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
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
							UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
					}
				}
				//---------------------------------------
			} else {
				var gotDisplay = false;
				if (semtag=="EuropassL"){
					gotDisplay = true;
					UIFactory["EuropassL"].displayView('content-'+uuid,langcode,'detail',uuid);
				}
				if (!gotDisplay && semtag!='bubble_level1') {
					for( var i=0; i<root.children.length; ++i ) {
						// Recurse
						var child = UICom.structure["tree"][root.children[i]];
						var childnode = UICom.structure["ui"][root.children[i]];
						var childsemtag = $(childnode.metadata).attr('semantictag');
						var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
						if (contentfreenode == 'Y' || freenode == 'Y')
							UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
						else
							UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent,root);
					}
				}
			}
			// ==============================================================================
			$('a[data-toggle=tooltip]').tooltip({html:true});
			$('[data-tooltip="true"]').tooltip();
			$(".pickcolor").colorpicker();
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
//========================================================
UIFactory["Node"].updateIpadPosition = function (obj,top,left)
//========================================================
{
	var nodeid = obj.getAttribute("uuid");
    var offset = $(obj).offset();
//    alertHTML(top+"-"+left+"/"+offset.top+"-"+offset.left);
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


//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].displayFree = function(root, dest, depth,langcode,edit,inline)
//==============================================================================
//==============================================================================
//==============================================================================
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
	// ---- store info to redisplay after change ---
	node.display_node[dest] = {"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"display":"free"};
	//----------------------------------------------
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
	if ((display=='N' && g_userroles[0]=='designer') || (display=='Y' && (((seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles)) && privatevalue) || !privatevalue || g_userroles[0]=='designer'))) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.containsArrayElt(g_userroles)) || g_userroles[0]=='designer') {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.containsArrayElt(g_userroles) || seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var parent = proxies_parent[uuid];
					if (parent==dest.substring(8) || dest=='contenu') { // dest = content_{parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer');
					}
			}
			//---------------------------------------------------------
			var metadataepm = $(node.metadataepm);
			var style_position ="position:absolute;";
			style_position += UIFactory["Node"].displayMetadataEpm(metadataepm,'top',true);
			style_position += UIFactory["Node"].displayMetadataEpm(metadataepm,'left',true);
			var style_background = "";
			if (depth>0)
				style_background += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
			else
				style_background += UIFactory["Node"].displayMetadataEpm(metadataepm,'parent-background-color',false);
			var style_size = "";
			if (name == "asmUnitStructure" || UICom.structure["ui"][uuid].resource_type=='TextField' || UICom.structure["ui"][uuid].resource_type=='Document' || UICom.structure["ui"][uuid].resource_type=='URL') {
				style_size += UIFactory["Node"].displayMetadataEpm(metadataepm,'width',true);
				style_size += UIFactory["Node"].displayMetadataEpm(metadataepm,'height',true);
				style_size += UIFactory["Node"].getOtherMetadataEpm(metadataepm,'othercss');
			}
			//---------------------------------------------------------
			var html = "";
			html += "<div id='free_"+uuid+"' uuid='"+uuid+"' ";
			if (name != "asmContext") 
				html += "style='"+style_position+style_size+style_background+"' ";
			 else 
				html += "style='"+style_position+"' ";
				html += "class='free-node "+name+" ";
			if (USER.admin || g_userroles[0]=='designer' || graphicerroles.containsArrayElt(g_userroles) || graphicerroles.indexOf(this.userrole)>-1) {
				html += "movable ";
			}
			html += semtag+"' ";
			//------------------------
			html += ">";
//			if (name == "asmContext" && node.resource.type!='Proxy') {
//				if (proxy_target)
//					metadataepm = UICom.structure["ui"][proxies_nodeid["proxy-"+semtag]].metadataepm;
//			}
			//------------------- Toolbar and Buttons --------------------------
			if (edit && (!inline || g_userroles[0]=='designer')) {
				html += "<div class='free-toolbar' style='visibility:"+g_free_toolbar_visibility+"'>";
				var freeButtons = UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu);
				if (freeButtons.length > 100) {
					html += "<div id='toolbar-"+uuid+"' class='free-toolbar-buttons'>";
					html += "	<div id='buttons-"+uuid+"'>"+ freeButtons +"</div><!-- #buttons-uuid -->";
					html += "</div><!-- #toolbar--uuid -->";
				}
				html += "</div><!-- class='free-toolbar' -->";
			}
			else {
				html += "<div class='free-toolbar'>";
				html += "</div><!-- class='free-toolbar' -->";				
			}
			//-------------------------------------------------------------------
			if (name == "asmContext") {
				html += "<div id='free-content_"+uuid+"' uuid='"+uuid+"' style='"+style_size+style_background+"'>";
				//-------------- resource -------------------------
				if (g_designerrole) {
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
				}
				if (g_userroles[0]=='designer') {
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (g_userroles[0]=='designer')? true : false;
				}
				if (edit && inline && writenode){
					html += "<div id='std_resource_"+uuid+"' ";
					if (g_userroles[0]=='designer') {
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
/*					if (UICom.structure["ui"][uuid].getLabel()!='<span></span>') {
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
					} */
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
					html+="</div><!-- div #std_resource_uuid -->";
					//--------------------------------------
					html += "</div>";
					html += "</div>";
				}
				html += "<div id='context-"+uuid+"'></div><!-- div #context-uuid -->";
				html += "</div><!-- div #free-content_uuid -->";
			}
			else { // other than asmContext
				html += "<div id='free-content_"+uuid+"' uuid='"+uuid+"'>";
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
					html += "<a id='std_node_"+uuid+"'  onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\"";
					style = "";
					style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-color',false);
					html +=" style='"+style+"' ";
					html += ">"+UICom.structure["ui"][uuid].getLabel('std_node_'+uuid,'span')+"</a>";
				} 
				else if (depth!=1 && depth<10 && name=='asmUnit')
					html += "<a id='std_node_"+uuid+"'  onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getView('std_node_'+uuid)+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
				else
					html += "<span id='title_"+uuid+"'>"+UICom.structure["ui"][uuid].getView('title_'+uuid)+"</span>";
				//-------------- metainfo -------------------------
//				if (g_userroles[0]=='designer' || USER.admin) {
//					html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
//				}
				//----------------------------
				html += "</div><!-- div for metadata epm-->";
				html += "<div id='context-"+uuid+"'></div><!-- div #context-uuid -->";
				//--------------------------------------------------*/
				html += "<div id='content-"+uuid+"'></div><!-- div #content-uuid -->";
				html += "</div><!-- div #free-content_uuid -->";
			}
			//--------------------------------------------------
			html += "</div><!-- div #free_uuid -->";
			//---------------------
			$("#"+dest).append($(html));
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
				if (depth>0 || nodetype == "asmContext") {
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
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-info-sign'></span></a> ";
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
			//-----------------------------
			if (USER.admin || g_userroles[0]=='designer' || graphicerroles.containsArrayElt(g_userroles) || graphicerroles.indexOf(this.userrole)>-1) {
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
					$("#free-content_"+uuid).resizable({
						stop: function(){UIFactory["Node"].updateSize(this);}
					}
					);
				if (name!='asmContext')
					$("#free_"+uuid).resizable({
						stop: function(){UIFactory["Node"].updateSize(this);}
					}
					);
			}
			if (edit &&  (USER.admin || g_userroles[0]=='designer' || graphicerroles.containsArrayElt(g_userroles) || delnoderoles.containsArrayElt(g_userroles) || editresroles.containsArrayElt(g_userroles) || editnoderoles.containsArrayElt(g_userroles) || delnoderoles.indexOf(this.userrole)>-1 || editresroles.indexOf(this.userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1)) {
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
			}
			//----------------------------
			if (UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			if (g_userroles[0]=='designer' || USER.admin) {  //display metainfo
				UIFactory["Node"].displayMetainfo("metainfo_"+uuid,data);
			}
			//==================================
			// For each child
			for( var i=0; i<root.children.length; ++i ) {
				// Recurse
				var child = UICom.structure["tree"][root.children[i]];
				var childnode = UICom.structure["ui"][root.children[i]];
				var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
				if (contentfreenode == 'Y' || freenode == 'Y')
					UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
				else
					UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline);
			}
			//==================================
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

//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].displayTranslate = function(root,dest,depth)
//==============================================================================
//==============================================================================
//==============================================================================
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
			html += "<div class='row'  style='margin-left:5px;margin-top:5px;padding-top:5px;padding-bottom:5px;border-top:3px solid black'>";
			if (multilingual_node) {
				for (var lang=0; lang<languages.length;lang++) {
					var lgcolumn = Math.floor(12/languages.length);
					html += "<div id='trs_node_"+uuid+"' class='col-md-"+lgcolumn+"'>";
					//-------------- node -----------------------------
					html += "<div class='lang'>"+languages[lang]+" - "+karutaStr[languages[lang]]['label']+"</div>";
					html += "<div id='get_nodeeditor_"+uuid+languages[lang]+"'></div>";
					//-------------- resource -------------------------
					if(UICom.structure["ui"][uuid].resource!=null) {
						html += "<hr>";
						if (multilingual_resource) {
							try {
								var test = UICom.structure["ui"][uuid].resource.getEditor(null,lang);
								html += " <div id='get_editor_"+uuid+languages[lang]+"'></div>";
							}
							catch(e) {
								html += " <div id='display_editor_"+uuid+languages[lang]+"'></div>";
							}
						} else {
							try {
								var test = UICom.structure["ui"][uuid].resource.getEditor();
								html += " <div id='get_editor_"+uuid+LANG+"'></div>";
							}
							catch(e) {
								html += " <div id='display_editor_"+uuid+LANG+"'></div>";
							}
						}
					}
					html += "</div>";
					//-------------------------------------------------
				}
			} else {
				html += "<div class='lang'>"+karutaStr[LANG]['label']+"</div>";
				html += "<div id='get_nodeeditor_"+uuid+LANG+"'></div>";
			}
			html += "</div><!-- row -->";
		}
		else { // other than asmContext
			//-------------- node -----------------------------
			if (depth!=1 && depth<10 && name=='asmStructure') {
				html += "<div id='trs_node_"+uuid+"' class='col-md-7'>";
				html += "<a  onclick=\"displayPage('"+uuid+"',1,'translate','"+LANGCODE+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('trs_node_'+uuid,'span')+"</a>";
				html += "</div>";
			} else if (depth!=1 && depth<10 && name=='asmUnit') {
				html += "<div id='trs_node_"+uuid+"' class='col-md-7'>";
				html += "<a  onclick=\"displayPage('"+uuid+"',100,'translate','"+LANGCODE+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('trs_node_'+uuid,'span')+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
				html += "</div>";
			} else {
				html += "<div class='row'  style='margin-left:5px;margin-top:5px;padding-top:5px;padding-bottom:5px;border-top:3px solid black'>";
				if (multilingual_node) {
					for (var lang=0; lang<languages.length;lang++) {
						var lgcolumn = Math.floor(12/languages.length);
						html += "<div id='trs_node_"+uuid+"' class='col-md-"+lgcolumn+"'>";
						//-------------- node -----------------------------
						html += "<div class='lang'>"+languages[lang]+" - "+karutaStr[languages[lang]]['label']+"</div>";
						html += "<div id='get_nodeeditor_"+uuid+languages[lang]+"'></div>";
						html += "</div>";
						//-------------------------------------------------
					}
				} else {
					html += "<div class='lang'>"+languages[lang]+" - "+karutaStr[LANG]['label']+"</div>";
					html += "<div id='get_nodeeditor_"+uuid+LANG+"'></div>";
				}
				html += "</div><!-- row -->";
			}
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

//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].displayModel = function(root,dest,depth,langcode,edit,inline)
//==============================================================================
//==============================================================================
//==============================================================================
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
	if ((display=='N' && g_userroles[0]=='designer') || (display=='Y' && (((seenoderoles.containsArrayElt(g_userroles) || showtoroles.containsArrayElt(g_userroles)) && privatevalue) || !privatevalue || g_userroles[0]=='designer'))) {
		if (node.resource==null || node.resource.type!='Proxy' || (node.resource.type=='Proxy' && writenode && editresroles.containsArrayElt(g_userroles)) || g_userroles[0]=='designer') {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || seenoderoles.indexOf(USER.username_node.text())>-1 || seenoderoles.containsArrayElt(g_userroles) || seenoderoles.indexOf('all')>-1)? true : false;
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
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
				}
				if (g_userroles[0]=='designer' || USER.admin) {
					writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
					if (!writenode)
						writenode = (g_userroles[0]=='designer')? true : false;
				}
				//---------------------------
				if (semtag=="ref" || semtag=="semtag" || semtag=="text-value" || semtag=="nodetype" || semtag=="todisplay" || semtag=="aggregatetype" || semtag=="aggregationselect" || semtag=="test") {
					if (semtag=="test")
						html += "<div id='std_resource_"+uuid+"' class='col-md-4'>";
					else if (semtag=="text-value")
						html += "<div id='std_resource_"+uuid+"' class='col-md-5'>";						
					else
						html += "<div id='std_resource_"+uuid+"' class='col-md-3'>";
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
					//-----------------------
					if(UICom.structure["ui"][uuid].resource!=null) {
						try {
							var xxx = UICom.structure["ui"][uuid].resource.getEditor();
							html += "<div id='get_editor_"+uuid+"'></div>";
						}
						catch(e) {
							html += "<div id='display_editor_"+uuid+"'></div>";
						}
					} else {
						html = UICom.structure["ui"][uuid].getEditor();
						$("#edit-window-body-node").html($(html));
					}
					html += "</div>";
				} else {
					html += "<div class='row row-resource'>";
					//-------------- node -----------------------------
					html += "<div id='std_node_"+uuid+"' class='col-md-offset-1 col-md-2 node-label same-height'>";
					style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
					html += "<div class='inside-full-height' style='"+style+"'>";
					html += UICom.structure["ui"][uuid].getView('std_node_'+uuid);
					html += "</div><!-- inside-full-height -->";
					html += "</div><!-- col-md-2 -->";
					html += "<div class='col-md-8' >";
					html += "<table><tr>";
					//-------------- resource -------------------------
					if (g_designerrole) {
						writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
						if (!writenode)
							writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
					}
					if (g_userroles[0]=='designer') {
						writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
						if (!writenode)
							writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
						if (!writenode)
							writenode = (g_userroles[0]=='designer')? true : false;
					}
					if (edit && inline && writenode && node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL'){
						//------ edit inline ----------------
						style = UIFactory["Node"].getContentStyle(uuid);
						html += "<td  width='80%' class='resource";
						html += "' ";
						html += " style='"+style+"' ";
						html += ">";
						html += "<div id='std_resource_"+uuid+"' class='inside-full-height ";
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
						html += "</div><!-- inside-full-height -->";
						html += "</td>";
					} else {
						//--------- display ------------
						style = UIFactory["Node"].getContentStyle(uuid);
						html += "<td  width='80%' class='resource";
						html += "' ";
						html += " style='"+style+"' ";
						html += ">";
						html += "<div id='std_resource_"+uuid+"' class='inside-full-height ";
						if (node.resource_type!=null)
							html+= "resource-"+node.resource_type;
						html+= "' >";
						if (node.resource.type!='Dashboard' || g_userroles[0]=='designer')
							html += UICom.structure["ui"][uuid].resource.getView('std_resource_'+uuid);
						html += "</div><!-- inside-full-height -->";
						html += "</td>";
					}
					//-------------- buttons --------------------------
					html += "<td id='buttons-"+uuid+"' class='buttons same-height'>";
					html += "<div class='inside-full-height'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
					html += "</td>";
					//--------------------------------------------------
					html += "</tr></table>";
					html += "</div><!-- col-md-8  -->";
					html += "<div class='col-md-1'>&nbsp;</div><!-- col-md-1  -->";
					html += "</div><!-- inner row -->";
				}
			}
			else { // other than asmContext
				//----------------------------
				if (name=='asmUnitStructure')
					depth=100;	
				html += "<div>";
				html += "<div class='model_row'>";	
				//-------------- buttons --------------------------
				html += "<div id='buttons-"+uuid+"' class='model_button  visible-lg visible-md'>"+ UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit)+"</div>";
				//-------------- node -----------------------------
				html += "<div id='std_node_"+uuid+"'  class='model_node'>";
				html += " "+UICom.structure["ui"][uuid].getView('std_node_'+uuid);
				html += "</div>";
				//--------------------------------------------------
				html += "</div><!-- row -->";
				//-------------- metainfo -------------------------
				html += "<div id='metaepm_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
				//--------------------------------------------------*/
				if (root.children.length>0 && depth>0) {
					if (semtag=="asmNop" || semtag=="node_resource" || semtag=="text" || semtag=="aggregate" || semtag=="url2unit")
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
			// -------------- display metainfo
			if (g_userroles[0]=='designer' || USER.admin) {  
				UIFactory["Node"].displayMetaEpmInfos("metaepm_"+uuid,data);
			}
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				if (depth>0 || nodetype == "asmContext") {
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
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-info-sign'></span></a> ";
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
	if (seenoderoles!="" && (seenoderoles.indexOf("all")>-1 || USER.admin || g_userroles[0]=='designer' || seenoderoles.containsArrayElt(g_userroles) || seenoderoles.indexOf(this.userrole)>-1)) {
		//---------------------
		if (langcode==null)
			langcode = LANGCODE;
		var multilingual = ($(node.metadata).attr('multilingual-node')=='Y') ? true : false;
		if (!multilingual)
			langcode = NONMULTILANGCODE;
		//---------------------
		var uuid = node.id;
		var text = $(UICom.structure['ui'][uuid].context_text_node[langcode]).text();
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
	if (commentnoderoles!="" && (USER.admin || (USER.creator && commentnoderoles=='designer') || g_userroles[0]=='designer' || commentnoderoles.containsArrayElt(g_userroles) || commentnoderoles.indexOf(this.userrole)>-1)) {
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
		$("#"+uuid+"_edit_comment").wysihtml5({toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false},"uuid":uuid,"locale":LANG,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].updateComments();},'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},'blur': function(){clearInterval(currentTexfieldInterval);}}});
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
			alertHTML("Move "+textStatus+" : "+jqxhr.responseText);
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
//-------------------- BUTTONS AND MENUS -------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].getItemMenu = function(parentid,srce,tag,title,databack,callback,param2,param3,param4,freenode)
//==================================================
{	// note: #xxx is to avoid to scroll to the top of the page
//	if (freenode)
//		tag += '_free';
	if (srce=="self")
		srce = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();

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
	var semantictag = $(node.metadata).attr('semantictag');
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
	var submitteddate = ($(node.metadatawad).attr('submitteddate')==undefined)?'none':$(node.metadatawad).attr('submitteddate');
	var menuroles = ($(node.metadatawad).attr('menuroles')==undefined)?'none':$(node.metadatawad).attr('menuroles');
	var showroles = ($(node.metadatawad).attr('showroles')==undefined)?'none':$(node.metadatawad).attr('showroles');
	var moveroles = ($(node.metadatawad).attr('moveroles')==undefined)?'none':$(node.metadatawad).attr('moveroles');
	var privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';	var shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	var duplicateroles = ($(node.metadatawad).attr('duplicateroles')==undefined)?'none':$(node.metadatawad).attr('duplicateroles');
	var incrementroles = ($(node.metadatawad).attr('incrementroles')==undefined)?'none':$(node.metadatawad).attr('incrementroles');
	var shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	if (g_designerrole) {
		deletenode = (delnoderoles.containsArrayElt(g_userroles))? true : false;
		writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!writenode)
			writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
	}
	//-----------------------------------
	var html = "<div class='btn-group'>";
	//-----------------------------------
	if (edit) {
		//------------ edit button ---------------------
		if ((!inline && ( (writenode && !incrementroles.containsArrayElt(g_userroles)) || USER.admin || g_userroles[0]=='designer' )) || (inline && ((USER.admin || g_userroles[0]=='designer') && (!editnoderoles.containsArrayElt(g_userroles) && !editresroles.containsArrayElt(g_userroles))))) {
			html += "<span class='button glyphicon glyphicon-pencil' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+node.id+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' data-tooltip='true' data-placement='bottom'></span>";
		}
		//------------ delete button ---------------------
		if ((deletenode || USER.admin || g_userroles[0]=='designer') && node.asmtype != 'asmRoot') {
			if (node.asmtype == 'asmStructure' || node.asmtype == 'asmUnit') {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadStruct",g_portfolioid,null);
			} else {
				html += deleteButton(node.id,node.asmtype,undefined,undefined,"UIFactory.Node.reloadUnit",g_portfolioid,null);
			}
		}
		//------------- move node buttons ---------------
		if ((moveroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') && node.asmtype != 'asmRoot') {
			html+= "<span class='button glyphicon glyphicon-arrow-up' onclick=\"javascript:UIFactory.Node.upNode('"+node.id+"')\" data-title='"+karutaStr[LANG]["button-up"]+"' data-tooltip='true' data-placement='bottom'></span>";
			if (USER.admin || g_userroles[0]=='designer')
			html+= "<span class='button glyphicon glyphicon-random' onclick=\"javascript:UIFactory.Node.selectNode('"+node.id+"',UICom.root)\" data-title='"+karutaStr[LANG]["move"]+"' data-tooltip='true' data-placement='bottom'></span>";
		}
		//------------- duplicate node buttons ---------------
		if ( duplicateroles!='none'  && duplicateroles!='' && node.asmtype != 'asmRoot' && ((duplicateroles.containsArrayElt(g_userroles) && !"designer".containsArrayElt(g_userroles)) || USER.admin || g_userroles[0]=='designer')) {
			html+= "<span class='button glyphicon glyphicon-duplicate' onclick=\"javascript:UIFactory.Node.duplicate('"+node.id+"','UIFactory.Node.reloadUnit')\" data-title='"+karutaStr[LANG]["button-duplicate"]+"' data-tooltip='true' data-placement='bottom'></span>";
		}
	}
	//------------- private button -------------------
	if ((showroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') && showroles!='none' && showroles!='') {
		if (privatevalue) {
			html += "<span class='button glyphicon glyphicon-eye-close' onclick=\"javascript:show('"+node.id+"')\"></span>";
		} else {
			html += "<span class='button glyphicon glyphicon-eye-open' onclick=\"javascript:hide('"+node.id+"')\"></span>";
		}
	}
	//------------- node menus button ---------------
	if (menu) {
		if ((USER.admin || g_userroles[0]=='designer') && (node.asmtype != 'asmContext' && (depth>0 || node.asmtype == 'asmUnitStructure'))) {
			html += "<span class='dropdown dropdown-button'>";
			html += "<span  data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false' id='add_"+node.id+"'>";
			html += " <span class='button text-button'>"+karutaStr[languages[langcode]]['Add']+"<span class='caret'></span> </span>";
			html += "</span>";
			html += "<ul class='dropdown-menu dropdown-menu-right' aria-labelledby='add_"+node.id+"'>";
			if (node.asmtype == 'asmRoot' || node.asmtype == 'asmStructure') {
				var databack = false;
				var callback = "UIFactory['Node'].reloadStruct";
				var param2 = "'"+g_portfolioid+"'";
				var param3 = null;
				var param4 = null;
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmStructure','Section',databack,callback,param2,param3,param4);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmUnit','Page',databack,callback,param2,param3,param4);
			}
			var databack = false;
			var callback = "UIFactory['Node'].reloadUnit";
			var param2 = "'"+g_portfolioid+"'";
			var param3 = null;
			var param4 = null;
			var freenodevalue = ($(node.metadatawad).attr('freenode')==undefined)?'':$(node.metadatawad).attr('freenode');
			var contentfreenodevalue = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
			var freenode = ((freenodevalue=='Y')?true:false) || ((contentfreenodevalue=='Y')?true:false);
			if (semantictag.indexOf("asmColumns")>-1)
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmColumn','asmColumn',databack,callback,param2,param3,param4,freenode);
			else {
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmUnitStructure','Subsection',databack,callback,param2,param3,param4,freenode);
				html += "<hr>";
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','TextField','TextField',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Field','Field',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Document','Document',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','URL','URL',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Calendar','Calendar',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Image','Image',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Video','Video',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Audio','Audio',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Oembed','Oembed',databack,callback,param2,param3,param4,freenode);
				html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Color','Color',databack,callback,param2,param3,param4,freenode);
				if (!freenode) {
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','URL2Unit','URL2Unit',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Comments','Comments',databack,callback,param2,param3,param4,freenode);
					html += "<hr>";
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','SendEmail','SendEmail',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Dashboard','Dashboard',databack,callback,param2,param3,param4,freenode);
					if (semantictag.indexOf("asm-block")>-1) {
						html += "<hr>";
						html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','DocumentBlock','DocumentBlock',databack,callback,param2,param3,param4,freenode);
						html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','URLBlock','URLBlock',databack,callback,param2,param3,param4,freenode);
						html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','ImageBlock','ImageBlock',databack,callback,param2,param3,param4,freenode);
//						html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','ProxyBlock','ProxyBlock',databack,callback,param2,param3,param4,freenode);
					}
					if (semantictag.indexOf("bubbleContainer")>-1) {
//						var interval = setInterval(function(){alert(node.id)},30000);
						html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-bubbles','bubble_level1','Bubble Map',databack,callback,param2,param3,param4,freenode);
					}
					html += "<hr>";
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Item','Item',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Resource','GetResource',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Get_Resource','GetGetResource',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Double_Resource','GetDoubleResource',databack,callback,param2,param3,param4,freenode);
					html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Proxy','Proxy',databack,callback,param2,param3,param4,freenode);
		//			html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Action','Action',databack,callback,param2,param3,param4,freenode);
		//			html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Proxy','Get_Proxy',databack,callback,param2,param3,param4,freenode);
				}
			}
			html += "</ul>"; // class='dropdown-menu'
			html += "</span><!-- class='dropdown -->";
		}
	}
	//------------- specific menu button ---------------
	if (menu) {
		try {
			if ((depth>0 || node.asmtype == 'asmUnitStructure') && menuroles != undefined && menuroles.length>10 && (menuroles.indexOf(userrole)>-1 || (menuroles.containsArrayElt(g_userroles) && menuroles.indexOf("designer")<0) || USER.admin || g_userroles[0]=='designer') ){
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
					if (menus[i][3].indexOf(userrole)>-1 || (menus[i][3].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
						displayMenu = true;  // userrole may be included in semantictag
				}
				if (displayMenu) {
					var databack = false;
					var callback = "UIFactory['Node'].reloadUnit";
					if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' )
						callback = "UIFactory['Node'].reloadStruct";
					var param2 = "'"+g_portfolioid+"'";
					var param3 = null;
					var param4 = null;
					html += "<span class='dropdown dropdown-menu-left dropdown-button'>";
					//-----------------------
					html += "<span class='dropdown-toggle'  data-toggle='dropdown' id='specific_"+node.id+"'> ";
					html += " <span class='button text-button'>"+karutaStr[languages[langcode]]['menu']+"<span class='caret'></span> </span>";
					html += "</span>";
					//-----------------------
					html += "<ul class='dropdown-menu dropdown-menu-right specific-menu' aria-labelledby='specific_"+node.id+"'>";
					for (var i=0; i<menus.length; i++){
						if (menus[i][0]=="#line") {
							html += "<hr>";
						} else {
							var titles = [];
							var title = "";
							try {
								titles = menus[i][2].split("/");
								if (menus[i][2].indexOf("@")>-1) { // lang@fr/lang@en/...
									for (var j=0; j<titles.length; j++){
										if (titles[j].indexOf(languages[langcode])>-1)
											title = titles[j].substring(0,titles[j].indexOf("@"));
									}
								} else { // lang1/lang2/...
									title = titles[langcode];  // lang1/lang2/...
								}
							} catch(e){
								title = menus[i][2];
							}
							if (menus[i][3].indexOf(userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
								html += UIFactory["Node"].getItemMenu(node.id,menus[i][0],menus[i][1],title,databack,callback,param2,param3,param4);
						}
					}
					html += "</ul>"; // class='dropdown-menu'
					html += "</span><!-- class='dropdown -->";
				}
			}
		} catch(e){
			alertHTML('Menu Error: check the format: '+e);
		}
	}
	//------------- submit  -------------------
	if (submitroles!='none' && submitroles!='') {
		if ( submitted!='Y' && ((submitnode && ( submitroles.containsArrayElt(g_userroles) || submitroles.indexOf($(USER.username_node).text())>-1)) || USER.admin || g_userroles[0]=='designer' || submitroles.indexOf(userrole)>-1)) {
			html += "<span id='submit-"+node.id+"' class='button text-button' onclick=\"javascript:submit('"+node.id+"')\" ";
			html += " >"+karutaStr[languages[langcode]]['button-submit']+"</span>";
		} else {
			if (submitted=='Y') {
				if (USER.admin || g_userroles[0]=='administrator') {
					html += "<span id='submit-"+node.id+"' class='button text-button' onclick=\"javascript:reset('"+node.id+"')\" ";
					html += " >"+karutaStr[languages[langcode]]['button-unsubmit']+"</span>";
				}
				html += "<div class='alert alert-success'>"+karutaStr[languages[langcode]]['submitted']+submitteddate+"</div>";
			} 
			else {
				html += "<div class='alert alert-danger'>"+karutaStr[languages[langcode]]['notsubmitted']+"</div>";			
			}
		}
	}
	//------------- share node button ---------------
	if (shareroles!='none' && shareroles!='') {
		try {
			var shares = [];
			var displayShare = [];
			var items = shareroles.split(";");
			for (var i=0; i<items.length; i++){
				var subitems = items[i].split(",");
				shares[i] = [];
				shares[i][0] = subitems[0]; // sharing role
				if (subitems.length>1) {
					shares[i][1] = subitems[1]; // recepient role
					shares[i][2] = subitems[2]; // roles or emails
					shares[i][3] = subitems[3]; // level
					shares[i][4] = subitems[4]; // duration
					shares[i][5] = subitems[5]; // labels
				} else {
					shares[i][1] = ""; // recepient role
					shares[i][2] = ""; // roles or emails
					shares[i][3] = ""; // level
					shares[i][4] = ""; // duration
					shares[i][5] = ""; // labels
				}
				if (subitems.length>6)
					shares[i][6] = subitems[6]; // condition
				if (shares[i][0].indexOf(userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
					displayShare[i] = true;
				else
					displayShare[i] = false;
			}
			for (var i=0; i<shares.length; i++){
				if (displayShare[i]) {
					var html_toadd = "";
					var sharewithrole = shares[i][1];
					var shareto = shares[i][2];
					var sharelevel = shares[i][3];
					var shareduration = shares[i][4];
					var sharelabel = shares[i][5];
					if (shareto!='') {
						var sharetoemail = "";
						var sharetoroles = "";
						var sharetos = shareto.split(" ");
						for (var k=0;k<sharetos.length;k++) {
							if (sharetos[k].indexOf("@")>0)
								sharetoemail += sharetos[k]+" ";
							else
								sharetoroles += sharetos[k]+" ";
						}
						if (sharelabel!='') {
							var label = "";
							var labels = sharelabel.split("/");
							for (var j=0; j<labels.length; j++){
								if (labels[j].indexOf(languages[langcode])>-1)
									label = labels[j].substring(0,labels[j].indexOf("@"));
							}
							var js = "sendSharingURL('"+node.id+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"')";
							html_toadd = " <span class='button sharing-button' onclick=\""+js+"\"> "+label+"</span>";
						} else {
							html_toadd = " <span class='button sharing-button' onclick=\""+js+"\">"+karutaStr[languages[langcode]]['send']+"</span>";
						}
					} else {
						html_toadd = "<span class='button glyphicon glyphicon-share' data-toggle='modal' data-target='#edit-window' onclick=\"getSendPublicURL('"+node.id+"')\" data-title='"+karutaStr[LANG]["button-share"]+"' data-tooltip='true' data-placement='bottom'></span>";
					}
					if (shares[i].length==6 || (shares[i].length>6 && eval(shares[i][6])))
						html += html_toadd;
				}
			}
		} catch(e){
			alertHTML('Share Error: check the format: '+e);
		}
	}
	//--------------------------------------------------
	html += "</div><!-- class='btn-group' -->";
	if (html!="")
		html = "<div class='buttons-menus' id='btn-"+node.id+"'>" + html + "</div><!-- #btn-+node.id -->";
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
		url : "../../../"+serverBCK+"/nodes/node/" + uuid,
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
			$('#wait-window').modal('hide');
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
UIFactory["Node"].getRights = function(uuid)
//==================================
{
	var rights = null;
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes/node/"+uuid+"/rights",
		success : function(data) {
			rights = data;
		}
	});
	$.ajaxSetup({async: true});
	return rights;
}


//==================================
UIFactory["Node"].displayRights = function(uuid)
//==================================
{
	var html = "";
	roles_by_role = {};
	var rights = UIFactory["Node"].getRights(uuid);
	var roles = $("role",rights);
	html += "<table id='rights'>";
	html+= "<tr><td></td><td> Read </td><td> Write </td><td> Delete </td><td> Submit </td>";
	for (var i=0;i<roles.length;i++){
		var rolename = $(roles[i]).attr("name");
		roles_by_role[rolename] = new RoleRights(roles[i],uuid);
	}
	for (role in roles_by_role) {
		html += roles_by_role[role].getEditor();
	}
	html += "<table>";
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
	html += UIFactory["Node"].displayMetadataWad(data,'seenoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'editresroles');
	html += UIFactory["Node"].displayMetadataWad(data,'delnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'commentnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'submitroles');
	html += UIFactory["Node"].displayMetadataWad(data,'editnoderoles');
	html += UIFactory["Node"].displayMetadataWad(data,'duplicateroles');
	html += UIFactory["Node"].displayMetadataWad(data,'incrementroles');
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
	if (type==null)
		type = 'default';
	if (langcode==null)
		langcode = LANGCODE;
	var name = node.asmtype;
	var semtag =  ($("metadata",node.node)[0]==undefined)?'': $($("metadata",node.node)[0]).attr('semantictag');
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
	if ((name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') && semtag.indexOf('node_resource')<0 && node.structured_resource==null)	{
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editresroles',$(node.metadatawad).attr('editresroles'),false,true);
	}
	else
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editresroles',$(node.metadatawad).attr('editresroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'commentnoderoles',$(node.metadatawad).attr('commentnoderoles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'submitroles',$(node.metadatawad).attr('submitroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editnoderoles',$(node.metadatawad).attr('editnoderoles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'duplicateroles',$(node.metadatawad).attr('duplicateroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'incrementroles',$(node.metadatawad).attr('incrementroles'));
	if (node.resource_type=='Proxy')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'edittargetroles',$(node.metadatawad).attr('edittargetroles'));
	if (name=='asmContext' && node.resource.type=='Image')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'resizeroles',$(node.metadatawad).attr('resizeroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'graphicerroles',$(node.metadatawad).attr('graphicerroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'moveroles',$(node.metadatawad).attr('moveroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showroles',$(node.metadatawad).attr('showroles'));
//	if ($(node.metadatawad).attr('showroles')!='')
//		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'private',$(node.metadatawad).attr('private'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'showtoroles',$(node.metadatawad).attr('showtoroles'));
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'editboxtitle',$(node.metadatawad).attr('editboxtitle'));
	//------------------------------------
/*
	var shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	if (shareroles=='none' || shareroles=='') {
		html += "<div style='font-weight:bold' class='collapsible' onclick=\"javascript:toggleSharing('"+node.id+"')\"><span class='glyphicon glyphicon-plus collapsible' id='toggleSharing_"+node.id+"'></span> "+karutaStr[languages[langcode]]['share']+"</div>";
		html += "<div id='sharing-content-"+node.id+"' style='display:none'>";
	} else {
		html += "<div style='font-weight:bold' class='collapsible' onclick=\"javascript:toggleSharing('"+node.id+"')\"><span class='glyphicon glyphicon-minus collapsible' id='toggleSharing_"+node.id+"'></span> "+karutaStr[languages[langcode]]['share']+"</div>";
		html += "<div id='sharing-content-"+node.id+"' style='display:block'>";
	}
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'shareroles',$(node.metadatawad).attr('shareroles'));
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'sharewithrole',$(node.metadatawad).attr('sharewithrole'));	
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'sharetoroles',$(node.metadatawad).attr('sharetoroles'));	
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'sharetoemail',$(node.metadatawad).attr('sharetoemail'));	
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'sharelabel',$(node.metadatawad).attr('sharelabel'));	
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'sharelevel',$(node.metadatawad).attr('sharelevel'));	
	html += UIFactory['Node'].getMetadataWadAttributeEditor(node.id,'shareduration',$(node.metadatawad).attr('shareduration'));	
	html += "</div>";
	html += "<hr/>";
*/
	//------------------------------------
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'contentfreenode',$(node.metadatawad).attr('contentfreenode'),true);
	if (name!='asmRoot')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'freenode',$(node.metadatawad).attr('freenode'),true);
	html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'display',$(node.metadatawad).attr('display'),true);
	if (name=='asmUnitStructure')
		html += UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'collapsible',$(node.metadatawad).attr('collapsible'),true);
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
UIFactory["Node"].displayMetadataEpmInfo = function(data,attribute)
//==================================================
{
	var html = "";
	if ($("metadata-epm",data).attr(attribute)!=undefined && $("metadata-epm",data).attr(attribute)!="")
		html += "<span>"+attribute+":"+$("metadata-epm",data).attr(attribute)+"| </span>";
	return html;
};

//==================================================
UIFactory["Node"].displayMetaEpmInfos = function(destid,data)
//==================================================
{
	var html = "";
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-font-weight');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-font-style');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-text-align');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-font-size');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-font-weight');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-color');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-padding-top');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-background-color');
	html += UIFactory["Node"].displayMetadataEpmInfo(data,'node-othercss');
	$("#"+destid).html(html);
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
	if (USER.admin || g_userroles[0]=='designer' || graphicerroles.containsArrayElt(g_userroles) || graphicerroles.indexOf(userrole)>-1) {
//		html += "<hr><h4>CSS - Styles</h4>";
		html += "<form id='metadata' class='form-horizontal'>";
		//----------------------------------
		if (USER.admin || g_userroles[0]=='designer' || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(userrole)>-1) {
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
	if (g_userroles[0]=='designer' || USER.admin) {  
		UIFactory["Node"].displayMetainfo("metainfo_"+nodeid,node);
	}
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
	if (g_userroles[0]=='designer' || USER.admin) {  
		UIFactory["Node"].displayMetainfo("metainfo_"+nodeid,node);
	}
};

//==================================================
UIFactory["Node"].updateMetadataEpmAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata-epm",node)[0]).attr(attribute,value);
	var refresh = true;
	if (attribute=="top" || attribute=="left")
		refresh = false;
	UICom.UpdateMetaEpm(nodeid,refresh);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UIFactory["Node"].displayMetaEpmInfos("metaepm_"+nodeid,node);
	}

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
	if (g_userroles[0]=='designer' || USER.admin) {  
		UIFactory["Node"].displayMetainfo("metainfo_"+nodeid,node);
	}
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
		html += "  <div class='col-sm-9'><input type='text' class='form-control'  onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value=\""+value+"\"";
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
		$("#"+nodeid+"_"+attribute).wysihtml5({toolbar:{"size":"xs","font-styles": false,"html": true,"blockquote": false,"image": false},'uuid':nodeid,locale:languages[LANG],'events': {'change': function(){UIFactory['Node'].updateMetadatawWadTextAttribute(nodeid,attribute);} }});
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
	if (resource_type=='Get_Resource' || resource_type=='Get_Double_Resource' || resource_type=='Get_Get_Resource' || resource_type=='Proxy' || resource_type=='Action' || resource_type=='URL2Unit') {
		html  = "<hr><label>"+karutaStr[languages[langcode]]['query'+resource_type]+"</label>";
		$("#metadata_texts").append($(html));
		UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'query',$(node.metadatawad).attr('query'));
	}
	if (resource_type=='Get_Resource' || resource_type=='Get_Get_Resource' || resource_type=='Get_Double_Resource') {
		html = UIFactory["Node"].getMetadataWadAttributeEditor(node.id,'seltype',$(node.metadatawad).attr('seltype'));
		$("#metadata_texts").append($(html));
	}
	//----------------------Share----------------------------
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') {
		html  = "<hr><label>"+karutaStr[languages[langcode]]['shareroles'];
		if (languages.length>1){
			var first = true;
			for (var i=0; i<languages.length;i++){
				if (!first)
					html += "/";
				html += karutaStr[languages[i]]['shareroles2'];
				first = false;
			}
		} else {
			html += karutaStr[languages[langcode]]['shareroles2'];
		}
		html += karutaStr[languages[langcode]]['shareroles3']+"</label>";
		$("#metadata_texts").append($(html));
		UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'shareroles',$(node.metadatawad).attr('shareroles'));
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
	UIFactory["Node"].displayMetadatawWadTextAttributeEditor('metadata_texts',node.id,'help',$(node.metadatawad).attr('help'),'x100');
};

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
	html += "<iframe id='bubble_iframe_"+this.id+"' class='bubble_iframe' src='bubble.html?uuid="+this.id+"' height='500' width='100%'></iframe>";
	html += "<div id='bubble_display_"+this.id+"' class='bubble_display'></div>";
	return html;
};
