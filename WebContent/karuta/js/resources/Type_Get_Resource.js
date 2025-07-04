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
	if (this.clause=="xsi_type='Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.reloadpage = ($("metadata",node).attr('reloadpage')=='Y') ? true : false;
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
	this.previewsharing = ($("metadata",node).attr('previewsharing')==undefined)? '': $("metadata",node).attr('previewsharing');

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
	else if (type=="span")
		html =   "<span>"+label+"</span>";
	else if (type=="none")
		html = label;
	return html;
};

//==================================
UIFactory["Get_Resource"].prototype.getView = function(dest,type,langcode,indashboard)
//==================================
{
	//-------- if function js -------------
	if (UICom.structure.ui[this.id].js==undefined)
		UICom.structure.ui[this.id].setMetadata();
	if (UICom.structure.ui[this.id].js!="") {
		var fcts = UICom.structure.ui[this.id].js.split("|");
		for (let i=0;i<fcts.length;i++) {
			let elts = fcts[i].split("/");
			if (elts[0]=="display-resource-before") {
				fctjs = elts[1].split(";");
				for (let j=0;j<fctjs.length;j++) {
					eval(fctjs[j]+"(this.node,g_portfolioid)");
				}
			}
		}
	}
	//---------------------
	if (indashboard==null)
		indashboard = false;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	if (type==null)
		type = "default";
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var text = this.text_node[langcode].text();
	var label = this.label_node[langcode].text();
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	//--------------------------------------------------
	if (label.indexOf("resource:")>-1) {
		var elts = label.split("|");
		try {
			html += UICom.structure.ui[elts[0].substring(9)].resource.getView(null,"span");
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
				html += UICom.structure.ui[resid].resource.getView();
				}
			} else {
				if (indashboard)
					html += "<span class='"+cleanCode(code)+"' style='";
				else
					html += "<div class='"+cleanCode(code)+" view-div' style='";
				html += style;
				html += "'>";
				if ((code.indexOf("#")>-1 && code.indexOf("##")<0) || (this.queryattr_value != undefined && this.queryattr_value.indexOf("CNAM")>-1))
					html += "<span name='code'>" + cleanCode(code) + "</span> ";
				if (code.indexOf("*")>-1)
					html += "<span name='code'>" + cleanCode(code) + "</span> ";
				if (code.indexOf("%")<0) {
						html += "<span name='label'>" + elts[2].substring(6) + "</span> ";
				}
				if (code.indexOf("&")>-1)
					html += " ["+$(this.value_node).text()+ "] ";
				if (code.indexOf(":")>-1)
					html += $(this.value_node).text();
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
			var node = UICom.structure.ui[resid];
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
					var node = UICom.structure.ui[resid];
					label = node.label_node[langcode].text();
					code = node.code_node.text();
					style = this.style_node.text();
					for (var i=0; i<languages.length;i++){
						this.label_node[i].text("nodelabel:"+resid+"|semtag:"+semtag+"|label:"+label);
					}
					this.save();
				}
			} else {
				label = elts[2].substring(6);
			}
		}
		if (indashboard)
			html += "<span class='"+cleanCode(code)+"' style='";
		else
			html += "<div class='"+cleanCode(code)+" view-div' style='";
		html += style;
		html += "'>";
		if (code.indexOf("#")>-1 && code.indexOf("##")<0)
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("*")>-1)
			html += "<span name='code'>" + cleanCode(code) + "</span> ";
		if (code.indexOf("%")<0 && elts[2]!=undefined) {
				html += "<span name='label'>" + label + "</span> ";
		} else {
				html += "<span name='label'>undefined</span> ";
		}
		if (code.indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (code.indexOf(":")>-1)
			html += $(this.value_node).text();
		if (this.preview){
			let js = "previewPage('"+resid+"',100,'standard')";
			if (this.previewsharing!=""){
				options = this.previewsharing.split(",");
				if (options[3].indexOf(g_userroles[0])>-1){
					//-------------------------------------------sharerole,level,duration,role
					const previewURL = getPreviewSharedURL(this.uuid_node.text(),options[0],options[1],options[2],g_userroles[0])
					js = "previewPage('"+previewURL+"',100,'previewURL',null,true)";
				}
			}
			html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\" "+ js +" \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
		}
		if (indashboard)
			html += "</span>";
		else
			html += "</div>";
	//--------------------------------------------------
	} else {
		if (type!="batchform") {
			if (type=="checkbox") {
				html += "<input id='html_"+self.id+"' class='checkbox-div' type='checkbox' name='checkbox_"+self.id+"' style='' ";
				if (code.indexOf('1')>-1)
					html += " checked ";
				html +=" disabled='disabled' ";
					html += "&nbsp;"+label;
				html += "</span></input>";
			} else {
				if (indashboard)
					html += "<span class='"+cleanCode(code)+"' style='";
				else
					html += "<div class='"+cleanCode(code)+" view-div' style='";
				html += style;
				html += "'>";
				if (code.indexOf("#")>-1 && code.indexOf("##")<0) 
					html += "<span name='code'>" + cleanCode(code) + "</span> ";
				if (code.indexOf("*")>-1)
					html += "<span name='code'>" + cleanCode(code) + "</span> ";
				if (code.indexOf("%")<0) {
					if (label.indexOf("fileid-")>-1) {
						if (UICom.structure.ui[label.substring(7)]==undefined)
							$.ajax({
								async: false,
								type : "GET",
								dataType : "xml",
								url : serverBCK_API+"/nodes/node/" + label.substring(7),
								success : function(data) {
									UICom.parseStructure(data,false);
									html += UICom.structure.ui[label.substring(7)].resource.getView();
								},
								error : function() {
									html += "Error file not found:" + label.substring(7);
								}
							});
					} else {
						html += "<span name='label'>" + label + "</span> ";
					}
				}
				if (code.indexOf("&")>-1)
					html += " ["+$(this.value_node).text()+ "] ";
				if (code.indexOf(":")>-1)
					html += $(this.value_node).text();
				if (this.preview){
					let js = "previewPage('"+this.uuid_node.text()+"',100,'standard')";
					if (this.previewsharing!=""){
						options = this.previewsharing.split(",");
						if (options[3].indexOf(g_userroles[0])>-1){
							//-------------------------------------------sharerole,level,duration,role
							const previewURL = getPreviewSharedURL(this.uuid_node.text(),options[0],options[1],options[2],g_userroles[0])
							js = "previewPage('"+previewURL+"',100,'previewURL',null,true)";
						}
					}
					html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\" "+ js +" \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
				}
				if (indashboard)
					html += "</span>";
				else
					html += "</div>";
			}
		} else {	// type=='batchform'
			html = label;
		}
	}
	//------------------if function js-----------------
	const result1 = execJS(this,'display-resource-before');
	if (typeof result1 == 'string')
		html = result1 + html;
	const result2 = execJS(this,'display-resource-after');
	if (typeof result2 == 'string')
		html = html + result2;
	//------------------------------------------
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
	var self = this;
	
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------------
		queryattr_value = replaceVariable(queryattr_value);
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
		var portfoliocode = replaceVariable(queryattr_value.substring(0,semtag_indx));
		//---------------------------------------------
		if (queryattr_value.indexOf("#group.user.group")>-1  || queryattr_value.indexOf("#group.portfolio.group")>-1){
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				const url =  queryattr_value.indexOf("#group.user.group")>-1 ?  serverBCK_API+"/usersgroups" : serverBCK_API+"/portfoliogroups";
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : url,
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[queryattr_value] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else if (queryattr_value.indexOf("#users.user.first-last-name")>-1) {
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/users",
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[queryattr_value] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else if (queryattr_value.indexOf("#portfolios.")>-1) {
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					async: false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=1&search=" + semtag,
					success : function(data) {
							if (cachable)
								g_Get_Resource_caches[queryattr_value] = data;
							self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else {
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
			if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self'  && portfoliocode!='#self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self' || portfoliocode=='#self') {
				portfoliocode = selfcode;
				const semtag = $("metadata",$("asmRoot",g_portfolio_current)).attr('semantictag');
				if (semtag.indexOf('batch')>-1)
					cachable = true;
				else
					cachable = false;
			}
			//------------
			if (cachable && g_Get_Resource_caches[portfoliocode+semtag]!=undefined && g_Get_Resource_caches[portfoliocode+semtag]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[portfoliocode+semtag],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag.replace("!",""),
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[portfoliocode+semtag] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		}
		//--------------------------------------------------------------
	}
	if (this.get_type=="import_comp"){
//		let portfoliocode = cleanCode(replaceVariable(this.query_portfolio));
		let portfoliocode = replaceVariable(this.query_portfolio);
		let semtag = this.query_semtag;
		let semtag2 = "";
		if (semtag.indexOf('+')>-1) {
			semtag2 = semtag.substring(semtag.indexOf('+')+1);
			semtag = semtag.substring(0,semtag.indexOf('+'));
		}
		let srce = this.query_object;
		let target = this.query_object;
		type = 'multiple';
		queryattr_value = portfoliocode+"."+semtag+"."+target;
		//---------------------------------------------
		if (queryattr_value.indexOf("#group.user.group")>-1  || queryattr_value.indexOf("#group.portfolio.group")>-1){
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				const url =  queryattr_value.indexOf("#group.user.group")>-1 ?  serverBCK_API+"/usersgroups" : serverBCK_API+"/portfoliogroups";
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : url,
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[queryattr_value] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else if (queryattr_value.indexOf("#users.user.first-last-name")>-1) {
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/users",
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[queryattr_value] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else if (queryattr_value.indexOf("#portfolios.portfolio")>-1) {
			if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					async: false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=1&search=" + semtag,
					success : function(data) {
							if (cachable)
								g_Get_Resource_caches[queryattr_value] = data;
							self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		} else {
			let selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
			if (portfoliocode=='self' || portfoliocode=='#self') {
				portfoliocode = selfcode;
				cachable = false;
			}
			if (cachable && g_Get_Resource_caches[portfoliocode+semtag]!=undefined && g_Get_Resource_caches[portfoliocode+semtag]!="")
				self.parse(destid,type,langcode,g_Get_Resource_caches[portfoliocode+semtag],disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
			else {
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag.replace("!",""),
					success : function(data) {
						if (cachable)
							g_Get_Resource_caches[portfoliocode+semtag] = data;
						self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable);
					}
				});
			}
		}
		//--------------------------------------------------------------

/*		let selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",g_portfolio_current)).text();
		if (portfoliocode=='self' || portfoliocode=='#self') {
			portfoliocode = selfcode;
			cachable = false;
		}
		let semtag = this.query_semtag;
		let semtag2 = "";
		if (semtag.indexOf('+')>-1) {
			semtag2 = semtag.substring(semtag.indexOf('+')+1);
			semtag = semtag.substring(0,semtag.indexOf('+'));
		}
		let srce = this.query_object;
		let target = this.query_object;
		type = 'multiple';
		//------------
		var self = this;
		if (cachable && g_Get_Resource_caches[portfoliocode+semtag]!=undefined && g_Get_Resource_caches[portfoliocode+semtag]!="")
			self.parse(destid,type,langcode,g_Get_Resource_caches[portfoliocode+semtag],disabled,srce,resettable,target,semtag,null,portfoliocode,semtag2,cachable);
		else {
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag.replace("!",""),
				success : function(data) {
					if (cachable)
						g_Get_Resource_caches[portfoliocode+semtag] = data;
					self.parse(destid,type,langcode,data,disabled,srce,resettable,target,semtag,null,portfoliocode,semtag2,cachable);
				}
			});
		}*/
	}

	//-------- if function js -------------
	if (UICom.structure.ui[this.id].js!="") {
		var fcts = UICom.structure.ui[this.id].js.split("|");
		for (let i=0;i<fcts.length;i++) {
			let elts = fcts[i].split("/");
			if (elts[0]=="edit-resource") {
				fctjs = elts[1].split(";");
				for (let j=0;j<fctjs.length;j++) {
					eval(fctjs[j]+"(this.node,g_portfolioid)");
				}
			}
		}
	}
	//---------------------
};

//==================================
UIFactory["Get_Resource"].prototype.parse = function(destid,type,langcode,data,disabled,srce,resettable,target,semtag,multiple_tags,portfoliocode,semtag2,cachable) {
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
	let self = this;
	let self_code = $(this.code_node).text();
	let self_label = $(this.label_node[langcode]).text();
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
//-----Nodes ------------------------------------------------------------
	let nodes = $("node",data);
	if (nodes.length==0)
		nodes = $("group",data);
	if (nodes.length==0)
		nodes = $("user",data);
	if (nodes.length==0)
		nodes = $("portfolio",data);
//-----Node ordering-------------------------------------------------------
	let tableau1 = new Array();
	let tableau2 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		//--------------------------
		const langnotvisible = ($("metadata-wad",nodes[i]).attr('langnotvisible')==undefined)?'':$("metadata-wad",nodes[i]).attr('langnotvisible');
		const seestart = ($("metadata-wad",nodes[i]).attr('seestart')==undefined)?'':$("metadata-wad",nodes[i]).attr('seestart');
		const seeend = ($("metadata-wad",nodes[i]).attr('seeend')==undefined)?'':$("metadata-wad",nodes[i]).attr('seeend');
		const startUTC = new Date(seestart).getTime();
		const endUTC = new Date(seeend).getTime();
		const today = new Date().getTime();
		const display = (seestart=="") ? true : (startUTC < today && today < endUTC);
		if (langnotvisible!=karutaStr[languages[LANGCODE]]['language'] && display) {
			//----------------------------------------------------------
			let resource = null;
			let code = null;
			let libelle = null;
			if (target=="portfoliolabel") {
					code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",nodes[i])).text();
					libelle = $("label[lang='"+languages[langcode]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",nodes[i])[0]).text();
			} else {
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				if (resource.length>0) {
					code = $('code',resource).text();
					libelle = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				} else { // users, portfolios, usergroup or portfoliogroup
					if (target=="first-last-name") {
						code = $(nodes[i]).attr('id');
						libelle = $("firstname",nodes[i]).text()+ " "+$("lastname",nodes[i]).text();
					} else {
						code = $(nodes[i]).attr("id");
						libelle = $('label',nodes[i]).text();
					}
				}
			}
			if (code.indexOf("~")<0)   // si ~ on trie sur le libellé sinon sur le code
				tableau1[tableau1.length] = [code,nodes[i]];
			else
				tableau1[tableau1.length] = [libelle,nodes[i]]
			tableau2[tableau2.length] = {'code':code,'libelle':libelle};
			//----------------------------------------------------------
		}
	}
	let newTableau1 = tableau1.sort(sortOn1);
	var tabadded = [];
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
		if (target=="label" || target=="grouplabel" || target=="first-last-name" || target=="portfoliolabel") {
			for ( let i = 0; i < newTableau1.length; i++) {
				//------------------------------
				let uuid = $(newTableau1[i][1]).attr('id');
				let style = "";
				let resource = null;
				let value = "";
				let code = "";
				let label = "";
				if (target=='grouplabel' || target=="first-last-name" || target=="portfoliolabel") {
					code = "@" + tableau2[i].code;
					value = code;
					label = tableau2[i].libelle;
				} else {
					//------------------------------
					if ($("asmResource",newTableau1[i][1]).length==3) {
						style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
						resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
					} else {
						style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
						resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
					}
					value = $('value',resource).text();
					code = $('code',resource).text();
					label = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				}
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
				//------------------------------
				var select_item = null;
				if ($('code',resource).text().indexOf('----')>-1) {
					html = "<div class='dropdown-divider'></div>";
					select_item = $(html);
				} else {
					html = "<a class='dropdown-item "+code+"' uuid='"+uuid+"' value='"+value+"' code='"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+label+"\" ";
					}
					html += " style=\""+style+"\">";
					if (display_code)
						html += "<span class='li-code'>"+cleanCode(code)+"</span>";
					if (display_value)
						html += "<span class='li-value'>"+value+"</span>";
					if (display_label)
						html += "<span class='li-label'>"+label+"</span>";
					html += "</a>";
					select_item = $(html);
					$(select_item).click(function (ev){
						//--------------------------------
						let code = $(this).attr('code');
						let display_code = false;
						let display_value = false;
						let display_label = true;
						if (code.indexOf("%")>-1) 
							display_label = false;
						if (code.indexOf("#")>-1)
							display_code = true;
						if (code.indexOf(":")>-1)
							display_value = true;
						code = cleanCode(code);
						//--------------------------------
						let html = "";
						if (display_code)
							html += code+" ";
						if (display_value)
							html += value+" ";
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
				if (code!="" && self_code==code) {
						let display_code = false;
						let display_value = false;
						let display_label = true;
						if (code.indexOf("%")>-1) 
							display_label = false;
						if (code.indexOf("#")>-1)
							display_code = true;
						if (code.indexOf(":")>-1)
							display_value = true;
						//--------------------------------
						let html = "";
						if (display_code)
							html += code+" ";
						if (display_value)
							html += value+" ";
						if (display_label)
							html += label;
						$("#button_"+langcode+self.id).attr("style",style);
						$("#button_"+langcode+self.id).html(html);
						$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code).addClass(code);
				}
				$(select).append($(select_item));
			}
			if (newTableau1.length==0 || $("#button_"+langcode+self.id).html()=="&nbsp;") { // if no choice or not found but already setted
				//-------------- update button -----
				if (self_code!="" && self_label!="") {
					//------------------------------
					var display_code = false;
					var display_label = true;
					if (self_code.indexOf("$")>-1) 
						display_label = false;
					if (self_code.indexOf("@")<0) 
						display_code = true;
					self_code = cleanCode(self_code);
					//------------------------------
					var html = "";
					if (display_code)
						html += self_code+" ";
					if (display_value)
						html += value+" ";
					if (display_label)
						html += self_label;
					$("#button_"+langcode+self.id).attr("style",style);
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+self_code).addClass(code);
				}
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
				if ( (self_code!="" && self_code==$('code',resource).text()) || self_label==$(srce+"[lang='"+languages[langcode]+"']",resource).text() ) {
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
				var style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
				html += " style=\""+style+"\">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure.ui[uuid].resource.getView(null,'span');
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).html(UICom.structure.ui[$(this).attr("label_"+languages[langcode]).substring(7)].resource.getView());
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
						html += UICom.structure.ui[uuid].resource.getView(null,'span');
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
					html += "label_"+languages[j]+"=\"resource:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure.ui[uuid].resource.getLabel(null,'none')+"\" ";
				}
				html += " style=\""+style+"\">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure.ui[uuid].resource.getView(null,'span');
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
						html += UICom.structure.ui[uuid].resource.getView(null,'span');
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
				var style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
					html += "label_"+languages[j]+"=\"nodelabel:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure.ui[uuid].getLabel(null,'none')+"\" ";
				}
				html += " style=\""+style+"\">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure.ui[uuid].getView(null,'span');
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
						html += UICom.structure.ui[uuid].getView(null,'span');
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
			var resource = null;
			//------------------------------
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
			var original_code = code
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
					input += UICom.structure.ui[uuid].resource.getView(null,'span');
			}
			input += "</div></input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			// ---------------------- children ---------
			if (semtag2!="") {
				var semtag_parent = semtag.replace("!","");
				UIFactory.Get_Resource.getChildren(radio_obj,self,langcode,srce,target,portfoliocode,semtag2,semtag_parent,original_code,cachable,tabadded);
			}
			//------------------------------------------
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
			//------------------------------
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
		let html = "<div class='selectAll'><input type='checkbox' onchange='toggleCheckboxMultiple(this)'> "+karutaStr[LANG]['select-deselect']+"</div>";
		$("#"+destid).append(html);
		var inputs = "<div id='get_multiple' class='multiple "+semtag+"'></div>";
		var inputs_obj = $(inputs);
		//-----search for already added------------------
		if (this.unique!=undefined && this.unique!="" && this.unique!="false") {
			var targetid = this.targetid;
			if (targetid=="")
				targetid = this.parentid;
			var data = UICom.structure.ui[targetid].node;
			var searchsemtag = (this.unique=='true')?semtag.replace("!",""):this.unique;
			var allreadyadded = $("*:has(>metadata[semantictag*="+searchsemtag+"])",data);
			var tabadded = [];
			for ( var i = 0; i < allreadyadded.length; i++) {
				let resource = null;
				if ($("asmResource",allreadyadded[i]).length==3)
					resource = $(">asmResource[xsi_type!='nodeRes'][xsi_type!='context']",allreadyadded[i]); 
				else
					resource = $(">asmResource[xsi_type='nodeRes']",allreadyadded[i]);
				let code = $('code',resource).text();
				tabadded[i] = code;
			}
		}
		//----------remove allready added----------------
		var newTableau2 = [];
		var newTableau3 = [];
		if (this.unique!=undefined && this.unique!="" && this.unique!="false") {
			for ( var i = 0; i < newTableau1.length; ++i) {
				const indx = tabadded.indexOf(newTableau1[i][0]);
				if (indx==-1) {
					newTableau2.push(newTableau1[i]);
					newTableau3.push(tableau2[i]);
				}
			}
		} else {
			newTableau2 = newTableau1;
		}
		//-----------------------------------------------
		var previouscode = "";
		for ( var i = 0; i < newTableau2.length; ++i) {
			var uuid = $(newTableau2[i][1]).attr('id');
			var input = "";
			var style = "";
			var resource = null;
			let value = "";
			let code = "";
			let label = "";
			if (target=='grouplabel' || target=="first-last-name" || target=="portfoliolabel") {
				code = "@" + newTableau3[i].code;
				value = code;
				label = newTableau3[i].libelle;
			} else {
				//------------------------------
				if ($("asmResource",newTableau2[i][1]).length==3) {
					style = UIFactory.Node.getDataContentStyle(newTableau2[i][1].querySelector("metadata-epm"));
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau2[i][1]); 
				} else {
					style = UIFactory.Node.getDataLabelStyle(newTableau2[i][1].querySelector("metadata-epm"));
					resource = $("asmResource[xsi_type='nodeRes']",newTableau2[i][1]);
				}
				value = $('value',resource).text();
				code = $('code',resource).text();
				label = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
			}
			if (code=="" || code!=previouscode){
				previouscode = code
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
					input += "	<input type='checkbox' id='input-"+uuid+"' uuid='"+uuid+"' name='multiple_"+self.id+"' value='"+value+"' code='"+original_code+"' class='multiple-item'";
					for (var j=0; j<languages.length;j++){
						if (target=='fileid' || target=='resource') {
							if (target=='fileid')
								input += " label_"+languages[j] + "=\"" + target + "-" + uuid + "\" ";
							else
								input += " label_"+languages[j] + "=\"" + target + ":" + uuid + "|semtag:"+semtag+"|label:"+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
						} else if (target=='nodelabel') {
							input += " label_"+languages[j]+"=\"nodelabel:"+uuid + "|semtag:"+semtag+"|label:"+UICom.structure.ui[uuid].getLabel(null,'none')+"\" ";
						} else if (target=='portfoliolabel')
							input += " label_"+languages[j]+"=\""+label+"\" ";
						else 
							input += " label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					if (disabled)
						input += "disabled";
					input += "> ";
				}
				if (display_code)
					input += "<span class='input-code'>" + code + "</span> ";
				if (display_label) {
					if (srce=='resource' || srce=='nodelabel') {
						input += "<span class='input-label'>" + $("label[lang='"+languages[langcode]+"']",resource).text()+"</span>";
						} else if (target=='portfoliolabel' || target=='first-last-name')
							input += "<span class='input-label'>" + label +"</span>";
					else
						input += "<span class='input-label'>" + $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
				}
				input += "</div>";
				var input_obj = $(input);
				$(inputs_obj).append(input);
				if (target!='fileid' && target!='resource' && target!='nodelabel') // to avoid unescape if html tags in label 
					$("#input-"+uuid,inputs_obj).attr("label_"+languages[langcode],$(srce+"[lang='"+languages[langcode]+"']",resource).html());
				// ---------------------- children ---------
				if (semtag2!="") {
					var semtag_parent = semtag.replace("!","");
					UIFactory.Get_Resource.getChildren(inputs_obj,self,langcode,srce,target,portfoliocode,semtag2,semtag_parent,original_code,cachable,tabadded);
				}
				//------------------------------------------
			}
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
				$("#button_"+langcode+self.id).html(html);
				document.getElementById("button_"+langcode+self.id).value = "";
				document.getElementById("button_"+langcode+self.id).className = "btn btn-default select selected-label";
				UIFactory["Get_Resource"].update(this,self,langcode);
			});
			$(select).append($(select_item));
		}
		//---------------------
		if (target=="label" || target=="grouplabel" ) {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = "";
				var resource = null;
				let value = "";
				let code = "";
				let label = "";
				if (target=='grouplabel') {
					code = "@" + tableau2[i].code;
					value = code;
					label = tableau2[i].libelle;
				} else {
				//------------------------------
				if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				}
					value = $('value',resource).text();
					code = $('code',resource).text();
					label = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				}
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
					html = "<a class='dropdown-item "+code+"' uuid='"+uuid+"' value='"+value+"' code='"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+label+"\" ";
					}
					html += " style=\""+style+"\">";
					if (display_code)
						html += "<span class='li-code'>"+cleanCode(code)+"</span>";
					if (display_value)
						html += "<span class='li-value'>"+value+"</span>";
					if (display_label)
						html += "<span class='li-label'>"+label+"</span>";
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
//						$("#button_"+langcode+self.id).html(html);
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
				var style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
					$("#button_"+langcode+self.id).attr('value',$(this).attr("label_"+languages[langcode]));
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
				//------------------------------
				if ($("asmResource",newTableau1[i][1]).length==3) {
					style = UIFactory.Node.getDataContentStyle(newTableau1[i][1].querySelector("metadata-epm"));
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				} else {
					style = UIFactory.Node.getDataLabelStyle(newTableau1[i][1].querySelector("metadata-epm"));
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
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('checkbox')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var checkboxs = [];
		for ( var i = 0; i < 2; i++) {
			var resource = null;
			//------------------------------
			if ($("asmResource",newTableau1[i][1]).length==3) {
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			const code = $('code',resource).text();
			let label = [];
			for (var j=0; j<languages.length;j++){
				label[j] = $(srce+"[lang='"+languages[j]+"']",resource).text();
			}
			checkboxs.push({'code':code,'label':label});
		}
		//-----------------------------
		var checkbox_obj = $("<div class='get-checkbox'></div>");
		var input = "";
		input += "<input id='input_"+self.id+"' class='checkbox-div' type='checkbox' name='checkbox_"+self.id+"' style='' ";
		for (var j=0; j<languages.length;j++){		
		if (self_code==checkboxs[1].code)
			input += " label_"+languages[j]+"='"+checkboxs[0].label[j]+"'";
		else
			input += " label_"+languages[j]+"='"+checkboxs[1].label[j]+"'";
		}
		if (self_code==checkboxs[1].code)
			input += " code='"+checkboxs[0].code+"'";
		else
			input += " code='"+checkboxs[1].code+"'";
		if (disabled)
			input +=" disabled='disabled' ";
		if (self_code==checkboxs[1].code)
			input += " checked ";
		input += "><span id='label_"+self.id+"'>";
		if (self_code==checkboxs[1].code)
			input += "&nbsp;"+checkboxs[1].label[langcode];
		else
			input += "&nbsp;"+checkboxs[0].label[langcode];
		input += "</span></input>";
		var obj = $(input);
		$(obj).click(function (){
			UIFactory["Get_Resource"].update(this,self,langcode,type);
			if (this.checked) {
				$("#label_"+self.id).html("&nbsp;"+checkboxs[1].label[langcode]);
				$("#input_"+self.id).attr("code",checkboxs[0].code);
				for (var j=0; j<languages.length;j++){		
					$("#input_"+self.id).attr("label_"+languages[j],checkboxs[0].label[j]);
				}
			} else {
				$("#label_"+self.id).html("&nbsp;"+checkboxs[0].label[langcode]);
				$("#input_"+self.id).attr("code",checkboxs[1].code);
				for (var j=0; j<languages.length;j++){		
					$("#input_"+self.id).attr("label_"+languages[j],checkboxs[1].label[j]);
				}
			}
		});
		$(checkbox_obj).append(obj);
		$("#"+destid).append(checkbox_obj);
		//-----------------------------
	}
};

//==================================
UIFactory["Get_Resource"].getChildren = function(dest,self,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,cachable,tabadded)
//==================================
{
	var semtag2 = "";
	if (semtag.indexOf('+')>-1) {
		semtag2 = semtag.substring(semtag.indexOf('+')+1);
		semtag = semtag.substring(0,semtag.indexOf('+'));
	}
	//------------
	if (cachable && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!=undefined && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!="")
		UIFactory.Get_Resource.parseChildren(dest,self,g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code],langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable,tabadded)
	else {
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code,
			success : function(data) {
				if (cachable)
					g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code] = data;
				UIFactory.Get_Resource.parseChildren(dest,self,data,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable,tabadded)
			}
		});
	}
	//------------
}
//==================================
UIFactory["Get_Resource"].parseChildren = function(dest,self,data,langcode,srce,target,portfoliocode,semtag,semtag_parent,code,semtag2,cachable,tabadded)
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
	//----------remove allready added----------------------------------------------------------
	var newTableau2 = [];
	if (tabadded.length>0) {
		for ( var i = 0; i < newTableau1.length; ++i) {
			const indx = tabadded.indexOf(newTableau1[i][0]);
			if (indx==-1)
				newTableau2.push(newTableau1[i]);
		}
	} else {
		newTableau2 = newTableau1;
	}
	//--------------------------------------------------------------------
	for ( var i = 0; i < newTableau2.length; ++i) {
		var uuid = $(newTableau2[i][1]).attr('id');
		//------------------------------
		var input = "";
		//------------------------------
		var resource = null;
		if ($("asmResource",newTableau2[i][1]).length==3)
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau2[i][1]); 
		else
			resource = $("asmResource[xsi_type='nodeRes']",newTableau2[i][1]);
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
		input += "<div id='"+code+"' class='subget_ressource'>";
		if (selectable) {
			input += "	<input type='checkbox' uuid='"+uuid+"' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
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
UIFactory["Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	try {
		if (execJS(itself,"update-resource-if")) {
			//-------- if function js -------------
			execJS(itself,"update-resource-before");
			//---------------------
			const value = $(selected_item).attr('value');
			const code = $(selected_item).attr('code');
			const uuid = $(selected_item).attr('uuid');
			const style = $(selected_item).attr('style');
			//---------------------
			if (itself.clause=="xsi_type='Get_Resource'") {
				$(UICom.structure.ui[itself.id].resource.value_node[0]).text(value);
				$(UICom.structure.ui[itself.id].resource.code_node[0]).text(code);
				$(UICom.structure.ui[itself.id].resource.uuid_node[0]).text(uuid);
				$(UICom.structure.ui[itself.id].resource.style_node[0]).text(style.trim());
				for (var i=0; i<languages.length;i++){
					let label = $(selected_item).attr('label_'+languages[i]);
					$(UICom.structure.ui[itself.id].resource.label_node[i][0]).text(label);
				}
			} else {
				$(UICom.structure.ui[itself.id].value_node[0]).text(value);
				$(UICom.structure.ui[itself.id].code_node[0]).text(code);
				for (var i=0; i<languages.length;i++){
					let label = $(selected_item).attr('label_'+languages[i]);
					$(UICom.structure.ui[itself.id].label_node[i][0]).text(label);
				}
			}
			itself.save();
			//-------- if function js -------------
			execJS(itself,'update-resource');
			execJS(itself,'update-resource-after');
		}
	}
	catch(e) {
		console.log(e);
		// do nothing
	}
};

//==================================
UIFactory["Get_Resource"].prototype.save = function()
//==================================
{
	//------------------------------
	if (UICom.structure.ui[this.id].semantictag.indexOf("g-select-variable")>-1)
		updateVariable(this.node);
	//------------------------------
	var log = (UICom.structure.ui[this.id]!=undefined && UICom.structure.ui[this.id].logcode!=undefined && UICom.structure.ui[this.id].logcode!="");
	if (log)
		$(this.user_node).text(USER.firstname+" "+USER.lastname);
	//------------------------------
	$(this.lastmodified_node).text(new Date().getTime());
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
	if (this.reloadpage)
		UIFactory.Node.reloadUnit();
		
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

//==================================================================================
//==================================================================================
//==================================================================================
//==================================================================================

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
	$('#edit-window').modal('hide');
};

//==================================
UIFactory["Get_Resource"].addMultiple = function(parentid,targetid,multiple_tags,updated_semtag,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	else if (targetid=="")
		targetid = parentid;
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
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4,param5,param6);
		if (fctjs!="")
			eval(fctjs);
	}
};

//==================================
UIFactory["Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last,parentid,fct)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	var uuid = $(selected_item).attr('uuid');
	if (fct=="addParentCode") {
		code = UICom.structure.ui[parentid].getCode() + "*" + code;
	}
	var xml = "<asmResource xsi_type='Get_Resource'>";
	xml += "<code>"+code+"</code>";
	xml += "<value>"+value+"</value>";
	xml += "<uuid>"+uuid+"</uuid>";
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
			if( "asmContext" == tagname) {
				const resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']", $(nodes[0])[0]);
				const xsi_type = $(resource).attr("xsi_type");
				xml = xml.replace("Get_Get_Resource",xsi_type);
			} else {
				xml = xml.replace("Get_Get_Resource","nodeRes");
				url_resource = serverBCK_API+"/nodes/node/" + nodeid + "/noderesource";
				
			}
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : xml,
				last : this.last,
				url : url_resource,
				tagname : tagname,
				success : function(data) {
					if (this.last) {
						$('#edit-window').modal('hide');
						if (this.tagname=='asmUnit' || this.tagname=='asmStructure')
							UIFactory.Node.reloadStruct();
						else
							UIFactory.Node.reloadUnit();
					}
				}
			});
		}
	});

}

//==================================
UIFactory["Get_Resource"].importMultiple = function(parentid,targetid,srce,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
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
	var reloadid = $(parent).attr("id");
	if ($(parent).prop("nodeName") == "asmUnit"){
		callback = UIFactory.Node.reloadUnit;
		param2 = reloadid;
		if ($("#page").attr('uuid')!=reloadid)
			param3 = false;
	}
	else {
		callback = UIFactory.Node.reloadStruct;
		param2 = g_portfolio_rootid;
		if ($("#page").attr('uuid')!=reloadid)
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
		srce = srce.replaceAll('##selectedcode##',code);
		importBranch(parentid,srce,encodeURIComponent(code),databack,callback,param2,param3);
		if (fctjs!="")
			eval(fctjs);
	}
	$('#edit-window').modal('hide');
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
	var js2 = "UIFactory.Get_Resource.addSimple('"+parentid+"','"+targetid+"','"+replaceVariable(partcode)+","+get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
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
	var js2 = "UIFactory.Get_Resource.addMultiple('"+parentid+"','"+targetid+"','"+replaceVariable(partcode)+","+get_resource_semtag+","+fct+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getResource.multiple = query+"/"+partcode+","+get_resource_semtag+","+fct;
	getResource.parentid = parentid;
	getResource.targetid = targetid;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');
}

//==================================
function import_multiple(parentid,targetid,title,query,partcode,get_resource_semtag)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.importMultiple('"+parentid+"','"+targetid+"','"+replaceVariable(partcode)+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getResource.multiple = query+"/"+partcode+","+get_resource_semtag;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');

}

//==================================
function import_get_multiple(parentid,targetid,title,query_portfolio,query_semtag,query_object,actns,unique)
//==================================
{
	if (unique==null)
		unique = '';
	$.ajaxSetup({async: false});
	const acts = actns.split(';');
	let actions = [];
	for (let i=0;i<acts.length-1;i++) {
		//actions.push(JSON.parse(acts[i].replaceAll("|","\"").replaceAll("<<","(").replaceAll(">>",")")));
		actions.push(JSON.parse(acts[i].replaceAll("|","\"")));
	}
	let js1 = "$('#edit-window').modal('hide')";
	let js2 = "";
	for (let i=0;i<actions.length;i++) {
		//-----------------
		let fctjs = "";
		let fcts = actions[i].fcts.split(',');
		for (let j=0;j<fcts.length;j++) {
			fctjs += fcts[j]+";";
		}		
		fctjs = encode(fctjs);
		//------------------
		if (actions[i].type=="import_component") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Resource.addMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode+"."+actions[i].semtag)+"','"+actions[i].updatedtag+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import_proxy") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Proxy.addMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode+"."+actions[i].semtag)+"','"+actions[i].updatedtag+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import_elts") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Resource.importMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode+"','"+actions[i].semtag)+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import_elts-from") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Resource.importMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode)+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import-component-w-today-date") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++){
				if (targetid=="")
					targetid = targets[j];
				js2 += "importAndSetDateToday('"+actions[i].parentid+"','"+targets[j]+"','','"+replaceVariable(actions[i].foliocode+"','"+actions[i].semtag)+"','"+actions[i].updatedtag+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++){
				if (targetid=="")
					targetid = targets[j];
				js2 += "importComponent('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode+"','"+actions[i].semtag)+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import-today-date") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++){
				if (targetid=="")
					targetid = targets[j];
				js2 += "importAndSetDateToday('"+actions[i].parentid+"','"+targets[j]+"','','karuta.karuta-resources','Calendar','Calendar','"+fctjs+"');";
			}
		}
	}
	var footer = "<button class='btn' onclick=\"$('#wait-window').modal('show');"+js1+"\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\"$('#edit-window').off('hidden');"+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title.replaceAll("##apos##","'"));
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getResource.get_type = "import_comp";
	getResource.query_portfolio = query_portfolio;
	getResource.query_semtag = query_semtag;
	getResource.query_object = query_object;
	getResource.targetid = targetid;
	getResource.unique = unique;
	getResource.displayEditor("get-resource-node",null,null,false,false);
	$('#edit-window').modal('show');
	//--------------------------------------
	$('#edit-window').on('hidden.bs.modal', function (e) {
		eval(js2);$('#wait-window').modal('hide');
		$('#edit-window').off('hidden');
	})
	//--------------------------------------
}

//======================================================================================

