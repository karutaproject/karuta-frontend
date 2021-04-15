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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}



/// Define our type
//==================================
UIFactory["Get_Resource"] = function(node,condition)
//==================================
{
	this.clause = "xsi_type='Get_Resource'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Resource';
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node));
	//------- for log -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("user",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("user");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.user_node = $("user",$("asmResource[xsi_type='"+this.type+"']",node));
	//------- style -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("style",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("style");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.style_node = $("style",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource["+this.clause+"]",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource["+this.clause+"]",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
			}
		}
	}
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	if (this.clause=="xsi_type='Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
	this.displayLabel = {};
	this.multiple = "";
	this.simple = "";
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("uuid",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("uuid");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.uuid_node = $("uuid",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	//--------------------
	this.preview = ($("metadata",node).attr('preview')=='Y') ? true : false;
};

//==================================
UIFactory["Get_Resource"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['style'] = this.style_node.text();
		result['label'] = this.label_node[langcode].text();
		result['uuid'] = this.uuid_node.text();
	}
	return result;
}

/// Display

//==================================
UIFactory["Get_Resource"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest] = true;
	}
	return this.code_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest] = true;
	}
	return this.value_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getLabel = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'span';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null)
		this.displayLabel[dest]=type;
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
UIFactory["Get_Resource"].prototype.getView = function(dest,type,langcode,indashboard)
//==================================
{
	//---------------------
	if (indashboard==null)
		indashboard = false;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = "default";
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var text = this.text_node[langcode].text();
	if (this.encrypted)
		text = decrypt(text.substring(3),g_rc4key);
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	//--------------------------------------------------
	if (label.indexOf("resource:")>-1) {
		var elts = label.split("|");
		try {
			html += UICom.structure["ui"][elts[0].substring(9)].resource.getView(null,"span");
		}
		catch(e) {
			var semtag = elts[1].substring(7);
			// search for resource uuid
			var res_node = $("asmContext:has(metadata[semantictag='"+semtag+"']):has(code:contains('"+code+"'))",g_portfolio_current);
			if (res_node.length>0) {
				var resid = $($(res_node)[0]).attr('id');
				for (var i=0; i<languages.length;i++){
					this.label_node[i].text('resource:'+resid+'|semtag:'+semtag);
				}
				if (resid!=undefined) {
				//update get_resource
				this.save();
				html += UICom.structure["ui"][resid].resource.getView();
				}
			} else {
				if (indashboard)
					html += "<span class='"+cleanCode(code)+"' style='";
				else
					html += "<div class='"+cleanCode(code)+" view-div' style='";
				html += style;
				if (indashboard)
					html += "background-position:center;";
				html += "'>";
				if ((code.indexOf("#")>-1 && code.indexOf("##")<0) || (this.queryattr_value != undefined && this.queryattr_value.indexOf("CNAM")>-1))
					html += "<span name='code'>" + cleanCode(code) + "</span> ";
				if (code.indexOf("%")<0) {
						html += "<span name='label'>" + elts[2].substring(6) + "</span> ";
				}
				if (code.indexOf("&")>-1)
					html += " ["+$(this.value_node).text()+ "] ";
				if (indashboard)
					html += "</span>";
				else
					html += "</div>";
			}
		}
	//--------------------------------------------------
	} else  if (label.indexOf("nodelabel:")>-1) {
		var elts = label.split("|");
			var text = "";
			var label = "";
			var code = "";
			var style = "";
		try {
			var resid = elts[0].substring(10);
			var node = UICom.structure["ui"][resid];
			label = node.label_node[langcode].text();
			code = node.code_node.text();
			style = this.style_node.text();
		}
		catch(e) {
			var semtag = elts[1].substring(7);
			// search for resource uuid
			var res_node = $("*:has(>metadata[semantictag='"+semtag+"']):has(>code:contains('"+code+"'))",g_portfolio_current);
			if (res_node.length>0) {
				var resid = $($(res_node)[0]).attr('id');
				if (resid!=undefined) {
					//update get_resource
					var node = UICom.structure["ui"][resid];
					label = node.label_node[langcode].text();
					code = node.code_node.text();
					style = this.style_node.text();
					for (var i=0; i<languages.length;i++){
						this.label_node[i].text("nodelabel:"+resid+"|semtag:"+semtag+"|label:"+label);
					}
					this.save();
				}
			}
		}
		if (indashboard)
			html += "<span class='"+cleanCode(code)+"' style='";
		else
			html += "<div class='"+cleanCode(code)+" view-div' style='";
		html += style;
		if (indashboard)
			html += "background-position:center;";
		if (this.queryattr_value != undefined && this.queryattr_value.indexOf("CNAM")>-1)
			html += "font-weight:bold;"
		html += "'>";
		if ((code.indexOf("#")>-1 && code.indexOf("##")<0) || (this.queryattr_value != undefined && this.queryattr_value.indexOf("CNAM")>-1))
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("%")<0 && elts[2]!=undefined) {
				html += "<span name='label'>" + label + "</span> ";
		} else {
				html += "<span name='label'>undefined</span> ";
		}
		if (code.indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (this.preview)
			html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\"previewPage('"+resid+"',100,'standard') \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		if (indashboard)
			html += "</span>";
		else
			html += "</div>";
	//--------------------------------------------------
	} else {
		if (indashboard)
			html += "<span class='"+cleanCode(code)+"' style='";
		else
			html += "<div class='"+cleanCode(code)+" view-div' style='";
		html += style;
		if (indashboard)
			html += "background-position:center;";
		html += "'>";
		if (code.indexOf("#")>-1 && code.indexOf("##")<0) 
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("%")<0) {
			if (label.indexOf("fileid-")>-1)
				html += UICom.structure["ui"][label.substring(7)].resource.getView();
			else
				html += "<span name='label'>" + label + "</span> ";
			}
		if (code.indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (this.preview)
			html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\"previewPage('"+this.uuid_node.text()+"',100,'standard') \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		if (indashboard)
			html += "</span>";
		else
			html += "</div>";

	}
	//--------------------------------------------------
	return html;
};

//==================================
UIFactory["Get_Resource"].prototype.displayView = function(dest,type,langcode)
//==================================
{
var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};


/// Editor
//==================================
UIFactory["Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	var uuid = $(selected_item).attr('uuid');
	var style = $(selected_item).attr('style');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node[0]).text(value);
	$(itself.code_node[0]).text(code);
	$(itself.uuid_node[0]).text(uuid);
	$(itself.style_node[0]).text(style.trim());
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i][0]).text(label);
	}
	//-------- if function js -------------
	if (UICom.structure["ui"][itself.id].js!="") {
		var elts = UICom.structure["ui"][itself.id].js.split("/");
		if (elts[0]=="update-resource")
			eval(elts[1]+"(itself.node,g_portfolioid)");
	}
	//---------------------
	itself.save();
};

//==================================
UIFactory["Get_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
//==================================
{
	var multiple_tags = "";
	if (cachable==undefined || cachable==null)
		cachable = true;
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (this.simple!=""){
		multiple_tags = this.simple.substring(this.simple.indexOf('/')+1);
		queryattr_value = this.simple.substring(0,this.simple.indexOf('/'));
		type = 'simple';
	}
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------------
		queryattr_value = r_replaceVariable(queryattr_value);
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag2 = "";
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		if (semtag.indexOf('+')>-1) {
			semtag2 = semtag.substring(semtag.indexOf('+')+1);
			semtag = semtag.substring(0,semtag.indexOf('+'));
		}
		var target = queryattr_value.substring(srce_indx+1); // label or text
		//------------
		var portfoliocode = cleanCode(r_replaceVariable(queryattr_value.substring(0,semtag_indx)));
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self') {
			portfoliocode = selfcode;
			cachable = false;
		}
		//------------
		var self = this;
		if (cachable && g_Get_Resource_caches[portfoliocode+semtag]!=undefined && g_Get_Resource_caches[portfoliocode+semtag]!="")
			UIFactory["Get_Resource"].parse(destid,type,langcode,g_Get_Resource_caches[portfoliocode+semtag],self,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
		else {
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag.replace("!",""),
				success : function(data) {
					if (cachable)
						g_Get_Resource_caches[portfoliocode+semtag] = data;
					UIFactory["Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
				}
			});
		}
		//------------
	}
};


//==================================
UIFactory["Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (disabled==null)
		disabled = false;
	//---------------------
	if (resettable==null)
		resettable = true;
	//---------------------
	var self_code = $(self.code_node).text();
	if (self.encrypted)
		self_code = decrypt(self_code.substring(3),g_rc4key);
	var self_label = $(self.label_node[langcode]).text();
	if (self.encrypted)
		self_label = decrypt(self_label.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//-----Node ordering-------------------------------------------------------
	var nodes = $("node",data);
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		var resource = null;
		if ($("asmResource",nodes[i]).length==3)
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
		else
			resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
		var code = $('code',resource).text();
		var libelle = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
		tableau1[i] = [code,nodes[i]];
		tableau2[i] = {'code':code,'libelle':libelle};
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type=='select') {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var html = "";
		html += "<div class='btn-group select-label select-"+semtag+"'>";		
		html += "	<button type='button' class='btn select selected-label' id='button_"+langcode+self.id+"'>&nbsp;</button>";
		html += "	<button type='button' class='btn dropdown-toggle dropdown-toggle-split select' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		//----------------- null value to erase
		if (resettable) {
			html = "<a class='dropdown-item' value='' code='' uuid='' style='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
			var select_item = $(html);
			$(select_item).click(function (ev){
				$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
				$("#button_"+langcode+self.id).attr('class', 'btn btn-default select selected-label');
				UIFactory["Get_Resource"].update(this,self,langcode);
			});
			$(select).append($(select_item));
		}
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = "";
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getContentStyle(uuid);
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getLabelStyle(uuid);
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				}
				//------------------------------
				var value = $('value',resource).text();
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				var display_value = false;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				if (code.indexOf("?")>-1) {
					display_value = true;
				}
				code = cleanCode(code);
				//------------------------------
				var select_item = null;
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<div class='dropdown-divider'></div>";
					select_item = $(html);
				} else {
					html = "<a class='dropdown-item "+code+"' uuid='"+uuid+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					html += " style=\""+style+"\">";
					if (display_code)
						html += "<span class='li-code'>"+code+"</span>";
					if (display_value)
						html += "<span class='li-value'>"+value+"</span>";
					if (display_label)
						html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
					html += "</a>";
					select_item = $(html);
					$(select_item).click(function (ev){
						//--------------------------------
						var code = $(this).attr('code');
						var display_code = false;
						var display_label = true;
						if (code.indexOf("$")>-1) 
							display_label = false;
						if (code.indexOf("@")<0) {
							display_code = true;
						}
						code = cleanCode(code);
						//--------------------------------
						var html = "";
						if (display_code)
							html += code+" ";
						if (display_label)
							html += $(this).attr("label_"+languages[langcode]);
						$("#button_"+langcode+self.id).attr("style",style);
						$("#button_"+langcode+self.id).html(html);
						$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
						UIFactory["Get_Resource"].update(this,self,langcode);
						//--------------------------------
					});
				}
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code).addClass(code);
				}
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = UIFactory.Node.getContentStyle(uuid);
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				html = "<a class='dropdown-item' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += " style=\""+style+"\">";
				
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item = $(html);
				$(select_item).click(function (ev){
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code).addClass(code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				//-------------- update button -----
				if ((code!="" && self_code==$('code',resource).text()) || (self_label==$(srce+"[lang='"+languages[langcode]+"']",resource).text())) {
					var html = "";
					html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code).addClass(code);
				}
				$(select_item).append($(select_item))
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='fileid') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]);
				//------------------------------
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				code = cleanCode(code);
				//------------------------------
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<div class='dropdown-divider'></div>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				html = "<a  value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\"fileid-"+uuid+"\" ";
				}
				html += ">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure["ui"][uuid].resource.getView(null,'span');
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).html(UICom.structure["ui"][$(this).attr("label_"+languages[langcode]).substring(7)].resource.getView());
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code).addClass(code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += UICom.structure["ui"][uuid].resource.getView(null,'span');
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn  select selected-label').addClass("sel"+code).addClass(code);
				}
			}
		}
		//---------------------
		if (target=='resource') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]);
				//------------------------------
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				code = cleanCode(code);
				//------------------------------
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<li class='divider'></li><li></li>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				html = "<a  value='"+semtag+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\"resource:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure["ui"][uuid].resource.getLabel(null,'none')+"\" ";
				}
				html += " style=\""+style+"\">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure["ui"][uuid].resource.getView(null,'span');
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]).substring($(this).attr("label_"+languages[langcode]).indexOf('|label:')+7));
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += UICom.structure["ui"][uuid].resource.getView(null,'span');
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
				}
			}
		}
		//---------------------
		if (target=='nodelabel') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				var style = UIFactory.Node.getLabelStyle(uuid);
				//------------------------------
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				code = cleanCode(code);
				//------------------------------
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<li class='divider'></li><li></li>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				html = "<a  value='"+semtag+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\"nodelabel:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure["ui"][uuid].getLabel(null,'none')+"\" ";
				}
				html += " style=\""+style+"\">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure["ui"][uuid].getView(null,'span');
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]).substring($(this).attr("label_"+languages[langcode]).indexOf('|label:')+7));
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += UICom.structure["ui"][uuid].getView(null,'span');
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
				}
			}
		}
		//---------------------
		$(btn_group).append($(select));
	}
	
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('radio')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		//----------------- null value to erase
		if (resettable) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			input += "<input type='radio' class='radio-div'  name='radio_"+self.id+"' value='' code='' uuid='' style='' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;'";
			}
			if (self_code=='')
				input += " checked ";
			input += ">&nbsp;&nbsp;";
			input += "</input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
		//-------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var style = "";
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<input class='radio-div' type='radio' name='radio_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				if (target=='fileid')
					input += "label_"+languages[j]+"=\"fileid-"+uuid+"\" ";
				else
					input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (code!="" && self_code==$('code',resource).text())
				input += " checked ";
			input += " style=\""+style+"\">";
			input += "<div  class='sel"+code+" radio-label' style=\""+style+"\">";

			if (display_code)
				input += "<span class='li-code'>"+code+"</span> ";
			if (display_label){
				if (target=='label')
					input += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
				if (target=='fileid')
					input += UICom.structure["ui"][uuid].resource.getView(null,'span');
			}
			input += "</div></input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		if (resettable){
			var input = "";
			input += "<div name='click_"+self.id+"' value='' code='' uuid='' style='' class='click-item";
			if (self_code=="")
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;' ";
			}
			input += "> ";
			input +="<span  class=''>&nbsp;</span></div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
		}
		//-----------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var input = "";
			var style = "";
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div name='click_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='click-item";
			if (self_code==$('code',resource).text())
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += " style=\""+style+"\">";
			input += "<span  class='"+code+"'>"
			if (display_code)
				input += "<span class='li-code'>"+code+"</span> ";
			if (display_label)
					input += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
			input += "</span></div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
		}
		$("#"+destid).append(inputs_obj);
		//---------------------
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var inputs = "<div id='get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var input = "";
			var style = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getContentStyle(uuid);
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getLabelStyle(uuid);
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				}
				//------------------------------
			var code = $('code',resource).text();
			var selectable = true;
			var disabled = false;
			var display_code = false;
			var display_label = true;
			//------------------------
			if (code.indexOf("$")>-1){ 
				display_label = false;
			}
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			if (code.indexOf("?")>-1) {
				disabled = true;
			}
			if (code.indexOf("!")>-1 || semtag.indexOf("!")>-1) {
				selectable = false;
			}
			var original_code = code
			code = cleanCode(code);
			//------------------------------
			input += "<div id='"+code+"' style=\""+style+"\">";
			if (selectable) {
				input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
				input += "' ";
				for (var j=0; j<languages.length;j++){
					if (target=='fileid' || target=='resource') {
						if (target=='fileid')
							input += "label_"+languages[j] + "=\"" + target + "-" + uuid + "\" ";
						else
							input += "label_"+languages[j] + "=\"" + target + ":" + uuid + "|semtag:"+semtag+"|label:"+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
					} else if (target=='nodelabel')
						input += "label_"+languages[j]+"=\"nodelabel:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure["ui"][uuid].getLabel(null,'none')+"\" ";
					else 
						input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (disabled)
					input += "disabled";
				input += "> ";
			}
			if (display_code)
				input += code + " ";
			if (display_label) {
				if (srce=='resource' || srce=='nodelabel')
					input += $("label[lang='"+languages[langcode]+"']",resource).text()+"</div>";
				else
					input += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</div>";
			}

//			input +="<span  class='"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
			var input_obj = $(input);
			$(inputs_obj).append(input_obj);
			// ---------------------- children ---------
			if (semtag2!="") {
				var semtag_parent = semtag.replace("!","");
				UIFactory.Get_Resource.getChildren(inputs_obj,self,langcode,srce,target,portfoliocode,semtag2,semtag_parent,original_code,cachable);
			}
			//------------------------------------------
		}
		//------------------------------
		$("#"+destid).append(inputs_obj);
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type=='completion') {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice select-"+semtag+"'>";
		html += "<input id='button_"+langcode+self.id+"' type='text' class='btn btn-default select' code= '' value=''/>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		//---------------------------------------------------
		
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		//----------------- null value to erase
		if (resettable) {
			html = "<a class='dropdown-item' value='' code='' uuid='' style='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
			var select_item = $(html);
			$(select_item).click(function (ev){
				document.getElementById("button_"+langcode+self.id).defaultValue = "";
				document.getElementById("button_"+langcode+self.id).className = "btn btn-default select selected-label";
				UIFactory["Get_Resource"].update(this,self,langcode);
			});
			$(select).append($(select_item));
		}
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = "";
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getContentStyle(uuid);
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getLabelStyle(uuid);
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				}
				//------------------------------
				var value = $('value',resource).text();
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				var display_value = false;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				if (code.indexOf("?")>-1) {
					display_value = true;
				}
				code = cleanCode(code);
				//------------------------------
				var select_item = null;
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<div class='dropdown-divider'></div>";
					select_item = $(html);
				} else {
					html = "<a class='dropdown-item' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					html += " style=\""+style+"\">";
					if (display_code)
						html += "<span class='li-code'>"+code+"</span>";
					if (display_value)
						html += "<span class='li-value'>"+value+"</span>";
					if (display_label)
						html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
					html += "</a>";
					select_item = $(html);
					$(select_item).click(function (ev){
						//--------------------------------
						var code = $(this).attr('code');
						var display_code = false;
						var display_label = true;
						if (code.indexOf("$")>-1) 
							display_label = false;
						if (code.indexOf("@")<0) {
							display_code = true;
						}
						code = cleanCode(code);
						//--------------------------------
						var html = "";
						if (display_code)
							html += code+" ";
						if (display_label)
							html += $(this).attr("label_"+languages[langcode]);
						$("#button_"+langcode+self.id).attr("style",style);
						$("#button_"+langcode+self.id).html(html);
						$("#button_"+langcode+self.id).attr("value",html);
						$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
						UIFactory["Get_Resource"].update(this,self,langcode);
						//--------------------------------
					});
				}
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr("value",html);
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = UIFactory.Node.getContentStyle(uuid);
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				html = "<li></li>";
				var select_item = $(html);
				html = "<a  value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += " style=\""+style+"\">";
				
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		var onupdate = "UIFactory.Get_Resource.update(input,self)";
		autocomplete(document.getElementById("button_"+langcode+self.id), tableau2,onupdate,self,langcode);
	}
	
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type=='simple') {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='input-group select-"+semtag+"'>";
		html += "<input id='button_"+langcode+self.id+"' type='text' class='form-control' code= '' value=''/>";
		html += "</div>";
		var input_group = $(html);
		$(form).append($(input_group));
		html = "";
		html += "<div class='input-group-append'>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(input_group).append($(btn_group));
		$("#"+destid).append(form);
		//---------------------------------------------------
		
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = "";
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getContentStyle(uuid);
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getLabelStyle(uuid);
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				}
				//------------------------------
				var code = $('code',resource).text();
				var display_code = false;
				var display_label = true;
				if (code.indexOf("$")>-1) 
					display_label = false;
				if (code.indexOf("@")<0) {
					display_code = true;
				}
				code = cleanCode(code);
				//------------------------------
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<div class='dropdown-divider'></div>";
					select_item = $(html);
				} else {
					html = "<a class='dropdown-item' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					html += ">";
					if (display_code)
						html += "<span class='li-code'>"+code+"</span>";
					if (display_value)
						html += "<span class='li-value'>"+value+"</span>";
					if (display_label)
						html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
					html += "</a>";
					select_item = $(html);
				}
				$(select_item).click(function (ev){
					//--------------------------------
					var code = $(this).attr('code');
					var display_code = false;
					var display_label = true;
					if (code.indexOf("$")>-1) 
						display_label = false;
					if (code.indexOf("@")<0) {
						display_code = true;
					}
					code = cleanCode(code);
					//--------------------------------
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += $(this).attr("label_"+languages[langcode]);
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr("code",$(this).attr("code"));
					$("#button_"+langcode+self.id).attr("value",html);
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					for (var j=0; j<languages.length;j++){
						$("#button_"+langcode+self.id).attr("label_"+languages[j],$(this).attr("label_"+languages[j]));
					}
					//--------------------------------
				});
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		autocomplete(document.getElementById("button_"+langcode+self.id), tableau2,onupdate,self,langcode);
	}
};

//==================================
UIFactory["Get_Resource"].getChildren = function(dest,self,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,cachable)
//==================================
{
	var semtag2 = "";
	if (semtag.indexOf('+')>-1) {
		semtag2 = semtag.substring(semtag.indexOf('+')+1);
		semtag = semtag.substring(0,semtag.indexOf('+'));
	}
	//------------
	if (cachable && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!=undefined && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!="")
		UIFactory.Get_Resource.parseChildren(dest,self,g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code],langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
	else {
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code,
			success : function(data) {
				if (cachable)
					g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code] = data;
				UIFactory.Get_Resource.parseChildren(dest,self,data,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
			}
		});
	}
	//------------
}
//==================================
UIFactory["Get_Resource"].parseChildren = function(dest,self,data,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
//==================================
{
	//-----Node ordering-------------------------------------------------------
	var nodes = $("node",data);
	var tableau1 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		var resource = null;
		if ($("asmResource",nodes[i]).length==3)
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
		else
			resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
		var code = $('code',resource).text();
		tableau1[i] = [code,nodes[i]];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//--------------------------------------------------------------------
	for ( var i = 0; i < newTableau1.length; ++i) {
		var uuid = $(newTableau1[i][1]).attr('id');
		//------------------------------
		var input = "";
		//------------------------------
		var resource = null;
		if ($("asmResource",newTableau1[i][1]).length==3)
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
		else
			resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
		//------------------------------
		var code = $('code',resource).text();
		var selectable = true;
		var disabled = false;
		var display_code = false;
		var display_label = true;
		//------------------------
		if (code.indexOf("$")>-1){ 
			display_label = false;
		}
		if (code.indexOf("@")<0) {
			display_code = true;
		}
		if (code.indexOf("?")>-1) {
			disabled = true;
		}
		if (code.indexOf("!")>-1 || semtag.indexOf("!")>-1 ) {
			selectable = false;
		}
		code = cleanCode(code);
		//------------------------------
		input += "<div id='"+code+"'>";
		if (selectable) {
			input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				if (target=='fileid' || target=='resource') {
					if (target=='fileid')
						input += "label_"+languages[j] + "=\"" + target + "-" + uuid + "\" ";
					else
						input += "label_"+languages[j] + "=\"" + target + ":" + uuid + "|semtag:"+semtag+"\" ";
				} else 
					input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (disabled)
				input += "disabled";
			input += "> ";
		}
		if (display_code)
			input += code + " ";
		input +="<span  class='"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
		var input_obj = $(input);
		$(dest).append(input_obj);
		if (semtag2!="") {
			var semtag_parent = semtag.replace("!","");
			UIFactory.Get_Resource.getChildren(dest,self,langcode,srce,target,portfoliocode,semtag2,semtag_parent,code,cachable);
		}
	}
}

//==================================
UIFactory["Get_Resource"].prototype.save = function()
//==================================
{
	if (UICom.structure.ui[this.id].semantictag.indexOf("g-select-variable")>-1)
		updateVariable(this.node);
	//------------------------------
	var log = (UICom.structure.ui[this.id]!=undefined && UICom.structure.ui[this.id].logcode!=undefined && UICom.structure.ui[this.id].logcode!="");
	if (log)
		$(this.user_node).text(USER.firstname+" "+USER.lastname);
	//------------------------------
	$(this.lastmodified_node).text(new Date().toLocaleString());
	//------------------------------
	if (this.clause=="xsi_type='Get_Resource'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			if (this.blockparent!=null)
				this.blockparent.refresh();
			else
				this.refresh();
	}
	else {// Node - Get_Resource {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}
	//--------- log -------------
	if (log) {
		UICom.structure.ui[this.id].log();
	}
	//---------------------------
};

//==================================
UIFactory["Get_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
	for (dest in this.displayLabel) {
		$("#"+dest).html(this.getLabel(null,this.displayLabel[dest]));
	};
};

//==================================
UIFactory["Get_Resource"].addSimple = function(parentid,targetid,multiple_tags)
//==================================
{
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	$.ajaxSetup({async: false});
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var input = $("#button_"+LANGCODE+parentid);
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Resource.updateaddedpart;
	var param2 = get_resource_semtag;
	var param3 = input;
	var param4 = true;
	importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4);
};

//==================================
UIFactory["Get_Resource"].addMultiple = function(parentid,targetid,multiple_tags)
//==================================
{
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	$.ajaxSetup({async: false});
	var elts = multiple_tags.split(",");
	var part_code = elts[0];
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = elts[1];
	var fct = elts[2];
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Resource.updateaddedpart;
	var param2 = get_resource_semtag;
	var param4 = false;
	var param5 = parentid;
	var param6 = fct;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4,param5,param6);
	}
};

//==================================
UIFactory["Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last,parentid,fct)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	if (fct=="addParentCode") {
		code = UICom.structure.ui[parentid].getCode() + "*" + code;
	}
	var xml = "<asmResource xsi_type='Get_Resource'>";
	xml += "<code>"+code+"</code>";
	xml += "<value>"+value+"</value>";
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		xml += "<label lang='"+languages[i]+"'>"+label+"</label>";
	}
	xml += "</asmResource>";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+partid,
		last : last,
		success : function(data) {
			var nodes = $("*:has(>metadata[semantictag*='"+get_resource_semtag+"'])",data);
			if (nodes.length==0)
				nodes = $( ":root",data ); //node itself
			var nodeid = $(nodes[0]).attr('id'); 
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $(nodes[0])[0].nodeName;
			if( "asmRoot" == tagname || "asmStructure" == tagname || "asmUnit" == tagname || "asmUnitStructure" == tagname) {
				xml = xml.replace("Get_Resource","nodeRes");
				url_resource = serverBCK_API+"/nodes/node/" + nodeid + "/noderesource";
			}
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : xml,
				last : this.last,
				url : url_resource,
				success : function(data) {
					if (this.last) {
						$('#edit-window').modal('hide');
						UIFactory.Node.reloadUnit();
					}
				}
			});
		}
	});

}

//==================================
UIFactory["Get_Resource"].importMultiple = function(parentid,targetid,srce)
//==================================
{
	$.ajaxSetup({async: false});
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one import a part
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	var callback = "";
	var databack = false;
	var param2 = "";
	var param3 = null;
	var parent = UICom.structure.ui[parentid].node;
	while ($(parent).prop("nodeName")!="asmUnit" && $(parent).prop("nodeName")!="asmStructure" && $(parent).prop("nodeName")!="asmRoot") {
		parent = $(parent).parent();
	}
	var parentid = $(parent).attr("id");
	if ($(parent).prop("nodeName") == "asmUnit"){
		callback = UIFactory.Node.reloadUnit;
		param2 = parentid;
		if ($("#page").attr('uuid')!=parentid)
			param3 = false;
	}
	else {
		callback = UIFactory.Node.reloadStruct;
		param2 = g_portfolio_rootid;
		if ($("#page").attr('uuid')!=parentid)
			param3 = false;
	}
	for (var j=0; j<inputs.length;j++){
		var code = $(inputs[j]).attr('code');
		if (srce.indexOf("?")>-1){
			var newcode = srce.substring(srce.indexOf(".")+1);
			srce = code;
			if (srce.indexOf("@")>-1) {
				srce =srce.substring(0,srce.indexOf("@"))+srce.substring(srce.indexOf("@")+1);
			}
			if (srce.indexOf("#")>-1) {
				srce = srce.substring(0,srce.indexOf("#"))+srce.substring(srce.indexOf("#")+1);
			}
			if (srce.indexOf("%")>-1) {
				srce = srce.substring(0,srce.indexOf("%"))+srce.substring(srce.indexOf("%")+1);
			}
			if (code.indexOf("$")>-1) {
				display_label = false;
				code = code.substring(0,code.indexOf("$"))+code.substring(code.indexOf("$")+1);
			}
			if (code.indexOf("&")>-1) {
				display_label = false;
				code = code.substring(0,code.indexOf("$"))+code.substring(code.indexOf("&")+1);
			}
			code = newcode;
		}
		importBranch(parentid,srce,encodeURIComponent(code),databack,callback,param2,param3);
	}
};

//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//----------------------------------Menu Functions--------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//==================================
function get_simple(parentid,targetid,title,query,partcode,get_resource_semtag)
//==================================
{
	// targetid not used with get_simple
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.addSimple('"+parentid+"','"+targetid+"','"+r_replaceVariable(partcode)+","+get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getResource.simple = query+"/"+partcode+","+get_resource_semtag;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');
}
//==================================
function get_multiple(parentid,targetid,title,query,partcode,get_resource_semtag,fct)
//==================================
{
	// targetid not used with get_multiple
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.addMultiple('"+parentid+"','"+targetid+"','"+r_replaceVariable(partcode)+","+get_resource_semtag+","+fct+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getResource.multiple = query+"/"+partcode+","+get_resource_semtag+","+fct;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');
}

//==================================
function import_multiple(parentid,targetid,title,query,partcode,get_resource_semtag)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.importMultiple('"+parentid+"','"+targetid+"','"+r_replaceVariable(partcode)+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getResource.multiple = query+"/"+partcode+","+get_resource_semtag;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');

}
