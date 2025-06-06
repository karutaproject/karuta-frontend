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
UIFactory["Get_Get_Resource"] = function( node,condition)
//==================================
{
	this.clause = "xsi_type='Get_Get_Resource'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.type = 'Get_Get_Resource';
	//--------------------
	if ($("lastmodified",$("asmResource["+this.clause+"]",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Get_Resource']",node));
	//------- style -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("style",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("style");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.style_node = $("style",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.parentid = $(node).parent().attr("id");
	this.node = node;
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.portfoliocode_node = $("portfoliocode",$("asmResource["+this.clause+"]",node));
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
	if (this.clause=="xsi_type='Get_Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.reloadpage = ($("metadata",node).attr('reloadpage')=='Y') ? true : false;
	this.display = {};
	this.displayValue = {};
	this.displayCode = {};
	this.multiple = "";
	//--------------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("uuid",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("uuid");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.uuid_node = $("uuid",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.preview = ($("metadata",node).attr('preview')=='Y') ? true : false;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['portfoliocode'] = this.portfoliocode_node.text();
		result['label'] = this.label_node[langcode].text();
		result['type'] = this.type;
	}
	return result;
}

//==================================
UIFactory["Get_Get_Resource"].prototype.getType = function()
//==================================
{
	return this.type;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest]=true;
	}
	var code = $(this.code_node).text();
	return code;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest]=true;
	}
	var value = $(this.value_node).text();
	return value;
};

/// Display
//==================================
UIFactory["Get_Get_Resource"].prototype.getView = function(dest,type,langcode)
//==================================
{
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
	var label = this.label_node[langcode].text();
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div' style=\""+style+"\">";
		if (($(this.code_node).text()).indexOf("#")>-1 && ($(this.code_node).text()).indexOf("##")<0)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (($(this.code_node).text()).indexOf(":")>-1)
			html += $(this.value_node).text();
		html += "</div>";
	}
	if (type=='none'){
		if (($(this.code_node).text()).indexOf("#")>-1 && ($(this.code_node).text()).indexOf("##")<0)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		if (($(this.code_node).text()).indexOf(":")>-1)
			html += $(this.value_node).text();
		html = "<span class='"+ cleanCode(code) + "'>" + html + "</span>";
	}
	if (type=='batchform'){
		html = label;
	}
	if (this.preview)
		html+= "&nbsp;<span class='button preview-button fas fa-binoculars' onclick=\"previewPage('"+this.uuid_node.text()+"',100,'standard') \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
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
UIFactory["Get_Get_Resource"].prototype.displayView = function(dest,type,langcode)
//==================================
{
var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};



/// Editor
//==================================
UIFactory["Get_Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	try {
		if (execJS(itself,"update-resource-if")) {
			execJS(itself,'update-resource-before');
			//-----------------------
			var value = $(selected_item).attr('value');
			var code = $(selected_item).attr('code');
			var uuid = $(selected_item).attr('uuid');
			var style = $(selected_item).attr('style');
			$(UICom.structure.ui[itself.id].resource.value_node[0]).text(value);
			$(UICom.structure.ui[itself.id].resource.code_node[0]).text(code);
			$(UICom.structure.ui[itself.id].resource.uuid_node[0]).text(uuid);
			$(UICom.structure.ui[itself.id].resource.style_node[0]).text(style);
			for (var i=0; i<languages.length;i++){
				var label = $(selected_item).attr('label_'+languages[i]);
				$(UICom.structure.ui[itself.id].resource.label_node[i][0]).text(label);
			}
			$(UICom.structure.ui[itself.id].resource.lastmodified_node).text(new Date().getTime());
			itself.save();
			//-----------------------
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
UIFactory["Get_Get_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = replaceVariable($("metadata-wad",this.node).attr('query'));
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (this.get_type!="import_comp" && queryattr_value!=undefined && queryattr_value!='') {
//		queryattr_value = replaceVariable(queryattr_value);
//		if (type=='multiple')
//			queryattr_value = cleanCode(queryattr_value);  // portfoliocode may be from a get_ressource with spécial characters
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce2 = ";"
			var srce = queryattr_value.substring(srce_indx+1);
			if (srce.indexOf('+')>-1) {
				srce2 = srce.substring(srce.indexOf('+')+1);
				srce = srce.substring(0,srce.indexOf('+'));
			}
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag2 = "";
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			if (semtag.indexOf('+')>-1) {
				semtag2 = semtag.substring(semtag.indexOf('+')+1);
				semtag = semtag.substring(0,semtag.indexOf('+'));
			}
			var target = queryattr_value.substring(srce_indx+1);  // label or text or userlabel or grouplabel
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode_end_indx = queryattr_value.indexOf('child')+queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+queryattr_value.indexOf('itself')+3; //  if not present give -1
			var portfoliocode = replaceVariable(queryattr_value.substring(0,portfoliocode_end_indx));
			//------------
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self' && portfoliocode!='#self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self' || portfoliocode=='#self')
				portfoliocode = selfcode;
			//------------
//			portfoliocode = cleanCode(portfoliocode); // portfoliocode may be from a get_ressource with spécial characters
			//------------
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			var code_parent = "";
			var value_parent = "";
			//-------------------------------
			var removestar = -1;
			if (semtag_parent.indexOf('*')>-1 ) {
				var elts = semtag_parent.split("*");
				for (var i=0;i<elts.length;i++) {
					if (elts[i]!="")
						removestar = i;
				}
				semtag_parent = elts[removestar];
			}
			// ------- search for parent ----
			if (query.indexOf('itselfcode')>-1 || query.indexOf('itself')>-1) {
				code_parent = $($("code",$(this.node)[0])[0]).text();
				value_parent = $($("value",$(this.node)[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parent.parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent()[0])[0]).text();
			} else {
				if (query.indexOf('child')>-1) {
					parent = this.node;
				}
				if (query.indexOf('sibling')>-1) {
					parent = $(this.node).parent();
				}
				if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent();
				} else	if (query.indexOf('parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent();
				} else if (query.indexOf('parent')>-1) {
					parent = $(this.node).parent().parent();
				}
				if (queryattr_value.indexOf('#')>0)
					code_parent = semtag_parent;
				else {
					//-----------
					var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
					var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
					if (child.length==0 && itself.length>0){
						code_parent = $($("code",itself)[0]).text();
						value_parent = $($("value",itself)[0]).text();
					} else {
						var nodetype = $(child).prop("nodeName"); // name of the xml tag
						if (nodetype=='asmContext') {
							code_parent = $($("code",child)[1]).text();
							value_parent = $($("value",child)[1]).text();
						 } else {
							code_parent = $($("code",child)[0]).text();
							value_parent = $($("value",child)[0]).text();
						}
	
					}
				}
			}
			//----------------------
			if (removestar>-1) {
				var elts = code_parent.split("*");
				code_parent = elts[removestar];
			}
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent)).text();
			if (portfoliocode_parent.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode_parent!='self' && portfoliocode_parent!='#self')  // There is no project, we add the project of the current portfolio
				portfoliocode_parent = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode_parent;
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
			//----------------------
			var url ="";
			if (portfoliocode.indexOf('value?')>-1) {
				code_parent = replaceVariable(code_parent);
				value_parent = replaceVariable(value_parent);
				portfoliocode = portfoliocode_parent = value_parent;
				$(this.portfoliocode_node).text(portfoliocode_parent);
				$(this.value_node).text(portfoliocode_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
			} else if (portfoliocode.indexOf('parent?')>-1){
				if (portfoliocode_parent.indexOf("@")>-1) {
					display_portfoliocode_parent = false;
					portfoliocode_parent =portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("@"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("@")+1);
				}
				if (portfoliocode_parent.indexOf("#")>-1) {
					portfoliocode_parent = portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("#"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("#")+1);
				}
				$(this.portfoliocode_node).text(portfoliocode_parent);
				portfoliocode = portfoliocode_parent;
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
			} else if (portfoliocode.indexOf('?')>-1 || portfoliocode.indexOf('code?')>-1){
				code_parent = replaceVariable(code_parent);
				code_parent = cleanCode(code_parent);
				$(this.portfoliocode_node).text(code_parent);
				portfoliocode = code_parent;
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","");
			} else {
				$(this.portfoliocode_node).text(portfoliocode);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;
			}
			//----------------------
			if (code_parent!="") {
				let self = this;
				if  (portfoliocode.indexOf("#portfoliogroup")>-1) {
					$.ajax({
						async: false,
						type : "GET",
						dataType : "xml",
						portfoliocode:portfoliocode,
						url : serverBCK_API+"/portfoliogroups?group="+cleanCode(code_parent),
						success : function(data) {
							self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
						},
						error : function(jqxhr,textStatus) {
							$("#"+destid).html("No result");
						}
					});
				} else if  (portfoliocode.indexOf("#usergroup")>-1) {
					$.ajax({
						async: false,
						type : "GET",
						dataType : "xml",
						portfoliocode:portfoliocode,
						url : serverBCK_API+"/usersgroups?group="+cleanCode(code_parent),
						success : function(data) {
							self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
						},
						error : function(jqxhr,textStatus) {
							$("#"+destid).html("No result");
						}
					});
				} else {
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : url,
						portfoliocode:portfoliocode,
						semtag2:semtag2,
						success : function(data) {
							self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
						},
						error : function(jqxhr,textStatus) {
							$("#"+destid).html("No result");
							self.parse(destid,type,langcode,null,disabled,srce,srce2,this.portfoliocod,target,semtag,semtag2,cachable);
						}
					});
				}
			} else {
				//----------- ERROR Parent not selected ---------------------------------------------
				var data = this.node;
				if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('error')!=undefined && $($("metadata-wad",data)[0]).attr('error')!=""){
					var error_text = "";
					var errorlang = 0;
					var display_error = false;
					var attr_error = $($("metadata-wad",data)[0]).attr('error');
					var errors = attr_error.split("/"); // lang1/lang2/...
					for (var j=0; j<errors.length; j++){
						if (errors[j].indexOf("@"+languages[langcode])>-1)
							errorlang =j;
					}
					error_text = errors[errorlang].substring(0,errors[errorlang].indexOf("@"));
					if (errors[errorlang].indexOf(",")>-1) {
						var roles = errors[errorlang].substring(errors[errorlang].indexOf(","));
						if (roles.indexOf(this.userrole)>-1 || (roles.containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
						display_error = true;
					} else {
						display_error = true;
					}
					if (display_error){
						alertHTML(error_text);
					}
				} else { // we execute anyway
					var self = this;
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : url,
						portfoliocode:portfoliocode,
						semtag2:semtag2,
						success : function(data) {
							self.parse(destid,type,langcode,data,disabled,srce,this.portfoliocode,target,semtag,semtag2,cachable);
						},
						error : function(jqxhr,textStatus) {
							$("#"+destid).html("No result");
							self.parse(destid,type,langcode,null,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
						}
					});
				}
			}
			//----------------------
		} catch(e) {
			alertHTML("1-"+e);
			// do nothing - error in the search attribute
		}
	}
	//----------------------------- NEW MENUS ----------------------------------
	if (this.get_type=="import_comp"){
		try {
			type = "multiple";
			srce = this.query_object;
			//------------------------------
			var semtag = this.query_semtag;
			var semtag2 = "";
			if (semtag.indexOf('+')>-1) {
				semtag2 = semtag.substring(semtag.indexOf('+')+1);
				semtag = semtag.substring(0,semtag.indexOf('+'));
			}
			var semtag_parent = this.parent_semtag;
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode = this.query_portfolio;
			var query_parent_semtag = this.query_parent_semtag;
			srce = this.query_object;
			//------------
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
//			if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
//				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self' || portfoliocode=='#self')
				portfoliocode = selfcode;
			//------------
//			portfoliocode = cleanCode(portfoliocode); // portfoliocode may be from a get_ressource with spécial characters
			//------------
			var query = this.parent_position+"."+this.parent_semtag;
			var parent = null;
			var ref = null;
			var code_parent = "";
			var value_parent = "";
			var pcode_parent = "";
			//-------------------------------
			var removestar = -1;
			if (semtag_parent.indexOf('*')>-1 ) {
				var elts = semtag_parent.split("*");
				for (var i=0;i<elts.length;i++) {
					if (elts[i]!="")
						removestar = i;
				}
				semtag_parent = elts[removestar];
			}
			// ------- search for parent ----
			if (query.indexOf('code')>-1){
				if (query.indexOf('itselfrescode')>-1) {
					code_parent = $($("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",this.node))).text();
					value_parent = $($("value",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",this.node))).text();
				} else if (query.indexOf('itselfcode')>-1) {
					code_parent = $($("code",$(this.node)[0])[0]).text();
					value_parent = $($("value",$(this.node)[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node)[0])[0]).text();
				} else if (query.indexOf('parent.parent.parent.parent.parentcode')>-1) {
					code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
					value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
				} else if (query.indexOf('parent.parent.parent.parentcode')>-1) {
					code_parent = $($("code",$(this.node).parent().parent().parent().parent()[0])[0]).text();
					value_parent = $($("value",$(this.node).parent().parent().parent().parent()[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node).parent().parent().parent().parent()[0])[0]).text();
				} else if (query.indexOf('parent.parent.parentcode')>-1) {
					code_parent = $($("code",$(this.node).parent().parent().parent()[0])[0]).text();
					value_parent = $($("value",$(this.node).parent().parent().parent()[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node).parent().parent().parent()[0])[0]).text();
				} else if (query.indexOf('parent.parentcode')>-1) {
					code_parent = $($("code",$(this.node).parent().parent()[0])[0]).text();
					value_parent = $($("value",$(this.node).parent().parent()[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node).parent().parent()[0])[0]).text();
				} else if (query.indexOf('parentcode')>-1) {
					code_parent = $($("code",$(this.node).parent()[0])[0]).text();
					value_parent = $($("value",$(this.node).parent()[0])[0]).text();
					pcode_parent = $($("portfoliocode",$(this.node).parent()[0])[0]).text();
				}
			} else {
				if (this.parent_position=='') {
					parent = UICom.root.node;
				} else if (query.indexOf('child')>-1) {
					parent = this.node;
				} else if (query.indexOf('sibling')>-1) {
					parent = $(this.node).parent();
				} else if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent();
				} else	if (query.indexOf('parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent();
				} else if (query.indexOf('parent')>-1) {
					parent = $(this.node).parent().parent();
				}
				//-----------
				var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
				var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
				if (child.length==0 && itself.length>0){
					code_parent = $($("code",itself)[0]).text();
					value_parent = $($("value",itself)[0]).text();
					pcode_parent = $($("portfoliocode",itself)[0]).text();
				} else {
					var nodetype = $(child).prop("nodeName"); // name of the xml tag
					if (nodetype=='asmContext') {
						code_parent = $($("code",child)[1]).text();
						value_parent = $($("value",child)[1]).text();
						pcode_parent = $($("portfoliocode",child)[0]).text();
					 } else {
						code_parent = $($("code",child)[0]).text();
						value_parent = $($("value",child)[0]).text();
						pcode_parent = $($("portfoliocode",child)[0]).text();
					}
				}
			}
			//----------------------
			if (removestar>-1) {
				var elts = code_parent.split("*");
				code_parent = elts[removestar];
			}
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent)).text();
			if (portfoliocode_parent.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode_parent!='self' && portfoliocode_parent!='#self')  // There is no project, we add the project of the current portfolio
				portfoliocode_parent = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode_parent;
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
			//----------------------
			var url ="";
			code_parent = replaceVariable(code_parent);
			if (portfoliocode=="##parentcode##") {
				portfoliocode = cleanCode(code_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","");
			} else if (portfoliocode.indexOf("##parentcode##")>-1) {
				let js2 = $("#js2").attr("js");
				js2 = js2.replaceAll("##parentcode##",cleanCode(code_parent));
				$("#js2").attr("js",js2);
				portfoliocode = portfoliocode.replaceAll("##parentcode##",cleanCode(code_parent));
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","");
			} else if (portfoliocode.indexOf("##parentvalue##")>-1){
				portfoliocode = value_parent;
				let js2 = $("#js2").attr("js");
				js2 = js2.replaceAll("##parentvalue##",value_parent);
				$("#js2").attr("js",js2);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+this.query_parent_semtag+ "&code_parent="+code_parent;
			} else if (portfoliocode.indexOf("##parentportfoliocode##")>-1){
				portfoliocode = pcode_parent;
				let js2 = $("#js2").attr("js");
				js2 = js2.replaceAll("##parentportfoliocode##",pcode_parent);
				$("#js2").attr("js",js2);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+this.query_parent_semtag+ "&code_parent="+code_parent;
			} else {
				let js2 = $("#js2").attr("js");
				$("#js2").attr("js",js2);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+this.query_parent_semtag+ "&code_parent="+code_parent;
			}
			$(this.portfoliocode_node).text(portfoliocode);
			//----------------------
			var self = this;
			portfoliocode = replaceVariable(portfoliocode);
			url = replaceVariable(url);
			if (code_parent!="") {
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : url,
					portfoliocode:portfoliocode,
					semtag2:semtag2,
					success : function(data) {
						self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
					},
					error : function(jqxhr,textStatus) {
						$("#"+destid).html("No result");
						self.parse(destid,type,langcode,null,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
					}
				});
			} else {
				//----------- ERROR Parent not selected ---------------------------------------------
				var data = this.node;
				if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('error')!=undefined && $($("metadata-wad",data)[0]).attr('error')!=""){
					var error_text = "";
					var errorlang = 0;
					var display_error = false;
					var attr_error = $($("metadata-wad",data)[0]).attr('error');
					var errors = attr_error.split("/"); // lang1/lang2/...
					for (var j=0; j<errors.length; j++){
						if (errors[j].indexOf("@"+languages[langcode])>-1)
							errorlang =j;
					}
					error_text = errors[errorlang].substring(0,errors[errorlang].indexOf("@"));
					if (errors[errorlang].indexOf(",")>-1) {
						var roles = errors[errorlang].substring(errors[errorlang].indexOf(","));
						if (roles.indexOf(this.userrole)>-1 || (roles.containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
						display_error = true;
					} else {
						display_error = true;
					}
					if (display_error){
						alertHTML(error_text);
					}
				} else { // we execute anyway
					var self = this;
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : url,
						portfoliocode:portfoliocode,
						semtag:semtag,
						semtag2:semtag2,
						success : function(data) {
							self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,this.semtag,this.semtag2,cachable);
						},
						error : function(jqxhr,textStatus) {
							$("#"+destid).html("No result");
							self.parse(destid,type,langcode,null,disabled,srce,srce2,this.portfoliocode,target,this.semtag,this.semtag2,cachable);
						}
					});
				}
			}
			//----------------------
		} catch(e) {
			alertHTML("2-"+e);
			// do nothing - error in the search attribute
		}
	}
};


//==================================
UIFactory["Get_Get_Resource"].prototype.parse = function(destid,type,langcode,data,disabled,srce,srce2,portfoliocode,target,semtag,semtag2,cachable) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	let self = this;
	var self_code = $(self.code_node).text();
	var self_value = $(self.value_node).text();
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//-----Nodes -------------------------------------------------------
	var nodes = $("node",data);
	if (nodes.length==0)
		nodes = $("portfolio",data); //  #portfoliogroup
	if (nodes.length==0)
		nodes = $("user",data); //  #usergroup
	//-----Node ordering-------------------------------------------------------
	var tableau1 = new Array();
	var tableau2 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		let ok = true;
		const langnotvisible = ($("metadata-wad",nodes[i]).attr('langnotvisible')==undefined)?'':$("metadata-wad",nodes[i]).attr('langnotvisible');
		if (langnotvisible!=karutaStr[languages[LANGCODE]]['language']) {
			var resource = null;
			var code = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			if (resource.length>0) {
				code = $('code',resource).text();
				libelle = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				tableau2[tableau2.length] = {'code':code,'libelle':libelle};
			} else if (portfoliocode.indexOf("#portfoliogroup")>-1) {
				const portfolioid = $(nodes[i]).attr("id");
				const code_label = UIFactory.Portfolio.getCodeLabel_byid(portfolioid,"1");
				tableau2[tableau2.length] = {'code':code_label.code,'libelle':code_label.label};
			} else if (portfoliocode.indexOf("#usergroup")>-1) {
				code  = userid = $(nodes[i]).attr("id");
				UIFactory.User.load(userid);
				if (Users_byid[userid]!=undefined)
					tableau2[tableau2.length] = {'code':Users_byid[userid].username,'libelle':Users_byid[userid].firstname+" " +Users_byid[userid].lastname};
				else
					ok = false;
			}
			if (ok)
				tableau1.push([code,nodes[i]]);
		}
	}
	var newTableau1 = tableau1.sort(sortOn1);
	var tabadded = [];
	//------------------------------------------------------------
	if (type=='select') {
		//--------------------------------
		var html = "";
		html += "<div id='btngroup"+self.id+"' class='btn-group select-label'>";
		html += "	<button type='button' class='btn select selected-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' onclick=\"UIFactory.Get_Get_Resource.reloadIfInLine('"+self.id+"','"+destid+"','"+type+"','"+langcode+"')\" class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		const btn_group = $(html);
		if ($("#btngroup"+self.id).length==0)
			$("#"+destid).append(btn_group);
		if ($("#dropdown-"+self.id).length>0)
			$("#dropdown-"+self.id).html("");
		//--------------------------------
//		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		html = "<div id='dropdown-"+self.id+"' class='dropdown-menu dropdown-menu-right'></div>";
		const dropdown  = $(html);
		$(btn_group).append(dropdown);
		//----------------- null value to erase
		html = "<a class='dropdown-item' uuid='' value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Get_Resource"].update(this,self,langcode);
		});
		$("#dropdown-"+self.id).append($(select_item_a));
		//--------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			let uuid = $(newTableau1[i][1]).attr('id');
			let style = "";
			let resource = null;
			let value = "";
			let code = "";
			let label = [];
			if (target=='userlabel' || target=='portfoliolabel') {
				code = "@"+tableau2[i].code;
				value = code;
				for (var j=0; j<languages.length;j++){
					label[j]= tableau2[i].libelle;
				}
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
//				label = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				for (var j=0; j<languages.length;j++){
					label[j]= $(srce+"[lang='"+languages[j]+"']",resource).text();
				}
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
				html = "<a class='dropdown-item sel"+code+"' uuid='"+uuid+"' value='"+value+"' code='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+label[j]+"\" ";
				}
				html += " style=\""+style+"\">";
				if (display_code)
					html += "<span class='li-code'>"+code+"</span>";
				if (display_label)
					html += "<span class='li-label'>"+label[langcode]+"</span>";
				html += "</a>";
				var select_item = $(html);
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
					if (display_value)
						html += value+" ";
					if (display_label)
						html += $(this).attr("label_"+languages[langcode]);
					$("#button_"+self.id).attr("style",style);
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Get_Resource"].update(this,self,langcode);
					//--------------------------------
				});
			}
			//-------------- update button -----
			if (code!="" && self_code==$('code',resource).text()) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_value)
					html += value+" ";
				if (display_label)
					html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				$("#button_"+self.id).attr("style",style);
				$("#button_"+self.id).html(html);
				$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
			}
			$("#dropdown-"+self.id).append($(select_item));
		}
//		$("#dropdown-"+self.id).append($(select));
//		$(btn_group).append(select);
		
	}
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		var radio_obj = $("<div class='get-radio'></div>");
		var input = "";
		input += "<input type='radio' name='radio_"+self.id+"' value='' uuid='' code='' ";
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
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(radio_obj).append(obj);
		$("#"+destid).append(radio_obj);
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
			input += "<div class='radio-div' value='"+$('value',resource).text()+"' uuid='"+uuid+"' code='"+$('code',resource).text()+"' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += "><input type='radio' name='radio_"+self.id+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			if (code!="" && self_code==$('code',resource).text())
				input += " checked ";
			input += " style=\""+style+"\"></div>";
			input += "<div  class='sel"+code+" radio-label' style=\""+style+"\">";
			if (display_code)
				input += "<span class='li-code'>"+code+"</span> ";
			if (display_label)
				input += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
			input += "</div></input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			// ---------------------- children ---------
			if (srce2=="")
				srce2 = srce;
			var semtag_parent = semtag.replace("!","");
			UIFactory.Get_Get_Resource.getChildren(radio_obj,langcode,self,srce2,portfoliocode,semtag2,semtag_parent,original_code,cachable,tabadded);
			//------------------------------------------
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		var input = "";
		input += "<div name='click_"+self.id+"' value='' code='' class='click-item' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;' ";
		}
		input += "> ";
		input +="<span  class='"+code+"'>&nbsp;</span></div>";
		var input_obj = $(input);
		$(input_obj).click(function (){
			$('.clicked',inputs_obj).removeClass('clicked');
			$(this).addClass('clicked');
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(inputs_obj).append(input_obj);
		//-----------------------
		var first = true;
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var style = "";
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
			input += "<div name='click_"+self.id+"' code='"+$('code',resource).text()+"' value='"+$('value',resource).text()+"' class='sel"+code+" click-item";
			if (self_code==$('code',resource).text())
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += " style=\""+style+"\">";
			if (display_code)
				input += code + " ";
			if (display_label)
				input +=$("label[lang='"+languages[langcode]+"']",resource).text();
			input += " </div>"
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
			// ---------------------- children ---------
			if (semtag2!="") {
				if (srce2=="")
					srce2 = srce;
				var semtag_parent = semtag.replace("!","");
				UIFactory.Get_Get_Resource.getChildren(inputs_obj,langcode,self,srce2,portfoliocode,semtag2,semtag_parent,original_code,cachable,tabadded);
			}
			//------------------------------------------
			$("#"+destid).append(inputs_obj);
		}
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		let html = "<div class='selectAll'><input type='checkbox' onchange='toggleCheckboxMultiple(this)'> "+karutaStr[LANG]['select-deselect']+"</div>";
		$("#"+destid).append(html);
		var inputs = "<div id='get_get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----search for already added------------------
		if (this.unique!=undefined && this.unique!="" && this.unique!="false") {
			if (this.targetid==undefined || this.targetid=="")
				this.targetid = this.parentid;
			var targetid = this.targetid;
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
		if (this.unique!=undefined && this.unique!="" && this.unique!="false") {
			for ( var i = 0; i < newTableau1.length; ++i) {
				const indx = tabadded.indexOf(newTableau1[i][0]);
				if (indx==-1)
					newTableau2.push(newTableau1[i]);
			}
		} else {
			newTableau2 = newTableau1;
		}
		//------------------------------------------------
		var previouscode = "";
		for ( var i = 0; i < newTableau2.length; ++i) {
			var uuid = $(newTableau2[i][1]).attr('id');
			var input = "";
			var style = "";
			var resource = null;
			//------------------------------
			if ($("asmResource",newTableau2[i][1]).length==3) {
				style = UIFactory.Node.getDataContentStyle(newTableau2[i][1].querySelector("metadata-epm"));
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau2[i][1]); 
			} else {
				style = UIFactory.Node.getDataLabelStyle(newTableau2[i][1].querySelector("metadata-epm"));
				resource = $("asmResource[xsi_type='nodeRes']",newTableau2[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			if (code!=previouscode){
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
				let original_code = code
				code = cleanCode(code);
				//------------------------------
				input += "<div id='"+code+"' style=\""+style+"\">";
				if (selectable) {
					input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' portfoliocode='"+portfoliocode+"' class='multiple-item";
					input += "' ";
					if (srce=="resource") {
						for (var j=0; j<languages.length;j++){
							var elts = $("label[lang='"+languages[langcode]+"']",resource).text().split("|");
							input += "label_"+languages[j]+"=\""+elts[2].substring(6)+"\" ";
						}
					}
					else {
						for (var j=0; j<languages.length;j++){
							input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
						}
					}
					if (disabled)
						input += "disabled";
					input += "> ";
				}
				if (display_code)
					input += code + " ";
					if (srce=="resource") {
						var elts = $("label[lang='"+languages[langcode]+"']",resource).text().split("|");
						input +="<span  class='"+code+"'>" + elts[2].substring(6) + "</span></div>";
					}
				else	
					input +="<span  class='"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
				var input_obj = $(input);
				$(inputs_obj).append(input_obj);
				// ---------------------- children ---------
				if (semtag2!="") {
					var semtag_parent = semtag.replace("!","");
					UIFactory.Get_Get_Resource.getChildren(inputs_obj,langcode,self,srce,portfoliocode,semtag2,semtag_parent,original_code,cachable,tabadded);
				}
				//------------------------------------------
			}
		}
		//------------------------------
		$("#"+destid).append(inputs_obj);
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type=='completion') {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var html ="";
		html += "<form id='form_"+self.id+"' autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice select-"+semtag+"'>";
		html += "<input id='button_"+langcode+self.id+"' type='text' class='btn btn-default select' code= '' value=''/>";
		html += "<button type='button' onclick=\"UIFactory.Get_Get_Resource.reloadIfInLine('"+self.id+"','"+destid+"','"+type+"','"+langcode+"')\" class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		if ($("#form_"+self.id).length==0)
			$("#"+destid).append(form);
		//---------------------------------------------------
		
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		//----------------- null value to erase
//		if (resettable) {
			html = "<a class='dropdown-item' value='' code='' uuid='' style='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
			var select_item = $(html);
			$(select_item).click(function (ev){
				document.getElementById("button_"+langcode+self.id).defaultValue = "";
				document.getElementById("button_"+langcode+self.id).value = "";
				document.getElementById("button_"+langcode+self.id).className = "btn btn-default select selected-label";
				UIFactory["Get_Resource"].update(this,self,langcode);
			});
			$(select).append($(select_item));
//		}
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
						html = "<input id='button_"+langcode+self.id+"' type='text' class='btn btn-default select' code= '' value=''>";
						if (display_code)
							html += code+" ";
						if (display_label)
							html += $(this).attr("label_"+languages[langcode]);
						html +="</input> ";
						$("#button_"+langcode+self.id).replaceWith($(html)[0]);
						$("#button_"+langcode+self.id).attr("style",style);
						$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
						$("#button_"+langcode+self.id).attr("value",$(this).attr("label_"+languages[langcode]));
						$("#button_"+langcode+self.id).attr("label_"+languages[langcode],$(this).attr("label_"+languages[langcode]));
						$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
						UIFactory["Get_Resource"].update(this,self,langcode);
						var onupdate = "UIFactory.Get_Get_Resource.update(input,self)";
						autocomplete(document.getElementById("button_"+langcode+self.id), tableau2,onupdate,self,langcode);
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
					$("#button_"+langcode+self.id).attr("label_"+languages[langcode],html);
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
				html = "<a class='dropdown-item' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
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
		var onupdate = "UIFactory.Get_Get_Resource.update(input,self)";
		autocomplete(document.getElementById("button_"+langcode+self.id), tableau2,onupdate,self,langcode);
	}};

//==================================
UIFactory["Get_Get_Resource"].getChildren = function(dest,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,cachable,tabadded)
//==================================
{
	var semtag2 = "";
	if (semtag.indexOf('+')>-1) {
		semtag2 = semtag.substring(semtag.indexOf('+')+1);
		semtag = semtag.substring(0,semtag.indexOf('+'));
	}
	//------------
	if (cachable && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!=undefined && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!="")
		UIFactory.Get_Get_Resource.parseChildren(dest,g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code],langcode,srce,portfoliocode,semtag,semtag_parent,code,semtag2,cachable,tabadded)
	else {
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code,
			success : function(data) {
				if (cachable)
					g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code] = data;
				UIFactory.Get_Get_Resource.parseChildren(dest,data,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,semtag2,cachable,tabadded)
			}
		});
	}
	//------------
}
//==================================
UIFactory["Get_Get_Resource"].parseChildren = function(dest,data,langcode,self,srce,portfoliocode,semtag,semtag_parent,code_parent,semtag2,cachable,tabadded)
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
	const subdiv = "<div code_parent='"+code_parent+"' class='subget_ressource'>";
	var subdiv_obj = $(subdiv);
	$(dest).append(subdiv_obj);

	//--------------------------------------------------------------------
	for ( var i = 0; i < newTableau2.length; ++i) {
		var uuid = $(newTableau2[i][1]).attr('id');
		//------------------------------
		var input = "";
		var style = "";
		var resource = null;
		//------------------------------
		if ($("asmResource",newTableau2[i][1]).length==3) {
			style = UIFactory.Node.getDataContentStyle(newTableau2[i][1].querySelector("metadata-epm"));
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau2[i][1]); 
		} else {
			style = UIFactory.Node.getDataLabelStyle(newTableau2[i][1].querySelector("metadata-epm"));
			resource = $("asmResource[xsi_type='nodeRes']",newTableau2[i][1]);
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
		if (code.indexOf("!")>-1 || semtag.indexOf("!")>-1 ) {
			selectable = false;
		}
//		code = cleanCode(code);
		//------------------------------
		input += "<div id='"+cleanCode(code)+"' code_parent='"+code_parent+"' style=\""+style+"\">";
		if (selectable) {
			input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
			input += "' ";
			for (var j=0; j<languages.length;j++){
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
		$(subdiv_obj).append(input_obj);
		if (semtag2!="") {
			var semtag_parent = semtag.replace("!","");
			UIFactory.Get_Get_Resource.getChildren(subdiv_obj,langcode,self,srce,portfoliocode,semtag2,semtag_parent,code,cachable,tabadded);
			// (dest,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,cachable,tabadded)
		}
	}
}
//==================================
UIFactory["Get_Get_Resource"].reloadIfInLine = function(uuid,destid,type,langcode)
//==================================
{
	var node = UICom.structure.ui[uuid];
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		node.resource.displayEditor(destid,type,langcode); //(destid,type,langcode,disabled,cachable)
//		node.resource.redisplayEditor(destid,type,langcode); //(destid,type,langcode,disabled,cachable)
}

/*
//==================================
UIFactory["Get_Get_Resource"].prototype.redisplayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = replaceVariable($("metadata-wad",this.node).attr('query'));
	if (queryattr_value!=undefined && queryattr_value!='') {
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce = queryattr_value.substring(srce_indx+1);
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode_end_indx = queryattr_value.indexOf('child')+queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+queryattr_value.indexOf('itself')+3; //  if not present give -1
			var portfoliocode = queryattr_value.substring(0,portfoliocode_end_indx);
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			if (portfoliocode.indexOf('.')<0 && portfoliocode!='self' && portfoliocode!='#self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self' || portfoliocode=='#self')
				portfoliocode = selfcode;
			//------------
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			// ------- search for parent ----
			if (query.indexOf('sibling')>-1) {
				parent = $(this.node).parent();
			}
			if (query.indexOf('parent.parent.parent')>-1) {
				parent = $(this.node).parent().parent().parent();//.parent();
			} else	if (query.indexOf('parent.parent')>-1) {
				parent = $(this.node).parent().parent();//.parent();
			} else if (query.indexOf('parent')>-1) {
				parent = $(this.node).parent();//.parent();
			}
//			alertHTML('query'+query+'--parentid'+$(parent).attr("id"));
			var code_parent = "";
			if (queryattr_value.indexOf('#')>0)
				code_parent = semtag_parent;
			else {
				var child = $("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent);
				var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
				if (child.length==0 && itself.length>0){
					code_parent = $($("code",itself)[0]).text();
				} else {
					var nodetype = $(child).prop("nodeName"); // name of the xml tag
					if (nodetype=='asmContext')
						code_parent = $($("code",child)[1]).text();
					else
						code_parent = $($("code",child)[0]).text();

				}
			}
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)).text();
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
			var url ="";
			if (portfoliocode=='?'){
				$(this.portfoliocode_node).text(code_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+code_parent+"&semtag="+semtag;
			}
			else if (portfoliocode=='parent?'){
				$(this.portfoliocode_node).text(portfoliocode_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
			} else {
				$(this.portfoliocode_node).text(portfoliocode);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;
			}
			var self = this;
			if  (portfoliocode.indexOf("#portfoliogroup")>-1) {
				$.ajax({
					async: false,
					type : "GET",
					dataType : "xml",
					portfoliocode:portfoliocode,
					url : serverBCK_API+"/portfoliogroups?group="+cleanCode(code_parent),
					success : function(data) {
						UIFactory["Get_Get_Resource"].reparse(destid,type,langcode,data,self,disabled,srce);

//						self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
					},
					error : function(jqxhr,textStatus) {
						$("#"+destid).html("No result");
					}
				});
			} else if  (portfoliocode.indexOf("#usergroup")>-1) {
				$.ajax({
					async: false,
					type : "GET",
					dataType : "xml",
					portfoliocode:portfoliocode,
					url : serverBCK_API+"/usersgroups?group="+cleanCode(code_parent),
					success : function(data) {
						UIFactory["Get_Get_Resource"].reparse(destid,type,langcode,data,self,disabled,srce);
//						self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
					},
					error : function(jqxhr,textStatus) {
						$("#"+destid).html("No result");
					}
				});
			} else {
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : url,
					portfoliocode:portfoliocode,
					semtag2:semtag2,
					success : function(data) {
						self.parse(destid,type,langcode,data,disabled,srce,srce2,this.portfoliocode,target,semtag,semtag2,cachable);
					},
					error : function(jqxhr,textStatus) {
						$("#"+destid).html("No result");
						UIFactory["Get_Get_Resource"].reparse(destid,type,langcode,data,self,disabled,srce);
//						self.parse(destid,type,langcode,null,disabled,srce,srce2,this.portfoliocod,target,semtag,semtag2,cachable);
					}
				});
			}

		} catch(e) {
			alertHTML("3-"+e);
			// do nothing - error in the search attribute
		}
	}
};

//==================================
UIFactory["Get_Get_Resource"].reparse = function(destid,type,langcode,data,self,disabled,srce) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var self_code = $(self.code_node).text();
	//---------------------
	//---------------------
	var self_value = $(self.value_node).text();
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//------------------------------------------------------------
	if (type=='select') {
		$("#dropdown-"+self.id).html("");
		var selected_value = "";
		//----------------- null value to erase
		var html = "<li></li>";
		var select_item = $(html);
		html = "<a   class='dropdown-item'  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		//-----------------
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Get_Resource"].update(this,self,langcode);
		});
		$(select_item).append($(select_item_a))
		$("#dropdown-"+self.id).append($(select_item));
		//--------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
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
			if (code.indexOf('-#')>-1) {
				html = "<div class='dropdown-divider'></div>";
			} else {
				html = "<li></li>";
			}
			var select_item = $(html);
			if (code.indexOf('-#')>-1) {
				html = "<a >" + $(srce+"[lang='"+languages[langcode]+"']",resource).text() + "</a>";
				$(select_item).html(html);
			} else {
				html = "<a class='dropdown-item sel"+code+"' uuid='"+uuid+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				
				if (code.indexOf("@")<0)
					html += code + " ";
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				/*
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					$(this).attr('class', '').addClass($(this).children(':selected').val());
					UIFactory["Get_Get_Resource"].update(this,self,langcode);
				});
				$(select_item).click(function (ev){
					//--------------------------------
					var code = $("a",this).attr('code');
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
						html += $("a",this).attr("label_"+languages[langcode]);
//					$("#button_"+self.id).attr("style",style);
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Get_Resource"].update(this,self,langcode);
					//--------------------------------
				});

				$(select_item).append($(select_item_a))
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
//					$("#button_"+self.id).attr("style",style);
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
			}
			$("#dropdown-"+self.id).append($(select_item));
		}
	}
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		var radio_obj = $("<div class='get-radio'></div>");
		var input = "";
		input += "<input type='radio' name='radio_"+self.id+"' value='' code='' ";
		if (disabled)
			input +="disabled='disabled' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;'";
		}
		input += ">&nbsp;&nbsp;";
		input += "</input>";
		var obj = $(input);
		$(obj).click(function (){
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(radio_obj).append(obj);
		$("#"+destid).append(radio_obj);
		//-------------------
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; i++) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			first = false;
			input += "<input type='radio' name='radio_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (code!="" && self_value==code)
				input += " checked ";
			input += ">";
			if (code.indexOf("@")<0)
				input += "&nbsp;&nbsp;"+ code;
			input += "&nbsp;&nbsp;"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		var input = "";
		input += "<div name='click_"+self.id+"' value='' code='' class='click-item' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;' ";
		}
		input += "> ";
		input +="<span  class='"+code+"'>&nbsp;</span></div>";
		var input_obj = $(input);
		$(input_obj).click(function (){
			$('.clicked',inputs_obj).removeClass('clicked');
			$(this).addClass('clicked');
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(inputs_obj).append(input_obj);
		//-----------------------
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; ++i) {
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			input += "<div name='click_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' class='click-item";
			if (self_value==code)
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (self_value==code)
				input += " clicked";
			input += "> ";
			if (code.indexOf("@")<0)
				input += code + " ";
			input +=$("label[lang='"+languages[langcode]+"']",resource).text()+" </div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
			$("#"+destid).append(inputs_obj);
		}
		//------------------------------------------------------------
	}
};
*/
//==================================
UIFactory["Get_Get_Resource"].prototype.save = function()
//==================================
{
	if (UICom.structure.ui[this.id].semantictag.indexOf("g-select-variable")>-1)
		updateVariable(this.node);
	if (this.clause=="xsi_type='Get_Get_Resource'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			this.refresh();
	}
	else {// Node - Get_Get_Resource {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}
	//---------------------
	if (this.reloadpage)
		UIFactory.Node.reloadUnit();
};

//==================================
UIFactory["Get_Get_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};

};

//==================================
UIFactory["Get_Get_Resource"].addMultiple = function(parentid,targetid,multiple_tags,get_get_resource_semtag,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
	var elts = multiple_tags.split(",");
	var part_code = elts[0];
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	if (get_get_resource_semtag==undefined || get_get_resource_semtag==null)
		get_get_resource_semtag = elts[1];
	var fct = elts[2];

	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Get_Resource.updateaddedpart;
	var param2 = get_get_resource_semtag;
	var param4 = false;
	var param5 = parentid;
	var param6 = fct;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4,param5,param6);
		if(fctjs!="")
			eval(fctjs);
	}
};


//==================================
UIFactory["Get_Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last,parentid,fct)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	if (value=="")
		value = $(selected_item).attr('portfoliocode');
	var code = $(selected_item).attr('code');
	if (fct=="+parentcode") {
		code += "$"+UICom.structure.ui[parentid].getCode();
	}
	var xml = "<asmResource xsi_type='Get_Get_Resource'>";
	xml += "<code>"+code+"</code>";
	xml += "<value>"+value+"</value>";
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		xml += "<label lang='"+languages[i]+"'>"+label+"</label>";
	}
	xml += "</asmResource>";
	$.ajax({
		async : false,
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
				async : false,
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
UIFactory["Get_Get_Resource"].importMultiple = function(parentid,targetid,srce,fct,fctjs)
//==================================
{
	if (fctjs==null)
		fctjs = "";
	else
		fctjs = decode(fctjs);
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined)
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
	var topid = $(parent).attr("id");
	if ($(parent).prop("nodeName") == "asmUnit"){
		callback = UIFactory.Node.reloadUnit;
		param2 = topid;
		if ($("#page").attr('uuid')!=topid)
			param3 = false;
	}
	else {
		callback = UIFactory.Node.reloadStruct;
		param2 = g_portfolio_rootid;
		if ($("#page").attr('uuid')!=topid)
			param3 = false;
	}
	for (var j=0; j<inputs.length;j++){
		var code = $(inputs[j]).attr('code');
		if (srce=='?' || srce=='parent-code' || srce=='##parentcode##')
			srce = $(inputs[j]).attr('portfoliocode');
		importBranch(parentid,srce,code,databack,callback,param2,param3);
		if(fctjs!="")
			eval(fctjs);
	}
	if (fct!=null && fct!="") {
		fct(parentid);
		UIFactory.Node.reloadUnit();
	}
	$('#edit-window').modal('hide');
}

//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//----------------------------------Menu Functions--------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//==================================
function get_get_multiple(parentid,targetid,title,query,partcode,get_get_resource_semtag)
//==================================
{
	// targetid not used with get_get_multiple
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.addMultiple('"+parentid+"','"+targetid+"','"+partcode+","+get_get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/"+partcode+","+get_get_resource_semtag;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');

}

//==================================
function import_ggmultiple(parentid,targetid,title,query,partcode,fct)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.importMultiple('"+parentid+"','"+targetid+"','"+partcode+"',"+fct+")";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/"+partcode;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');
}

//==================================
function functions_ggmultiple(parentid,targetid,title,query,functions)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var elts = functions.split("&");
	var js2 = "";
	for (var i=0;i<elts.length;i++){
		var items = elts[i].split(":");
		if (items[0]=="import_ggmultiple") {
			js2 += "UIFactory.Get_Get_Resource.importMultiple('"+parentid+"'";
			if (items.length>2)
				js2 += ",'"+items[2]+"'";
			else
				js2 += ",'"+targetid+"'";
			js2 += ",'"+items[1]+"');";
		}
		if (items[0]=="get_get_multiple") {
			js2 += "UIFactory.Get_Get_Resource.addMultiple('"+parentid+"'";
			if (items.length>3)
				js2 += ",'"+items[3]+"'";
			else
				js2 += ",'"+targetid+"'";
			js2 += ",'"+items[1]+"','"+items[2]+"');";
		}
	}
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/";
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');
}

//==================================
function import_get_get_multiple(parentid,targetid,title,parent_position,parent_semtag,query_portfolio,query_parent_semtag,query_semtag,query_object,actns,unique)
//==================================
{
	const acts = actns.split(';');
	if (unique==null)
		unique = '';
	let actions = [];
	for (let i=0;i<acts.length-1;i++) {
		actions.push(JSON.parse(acts[i].replaceAll("|","\"")));
	}
	let js1 = "javascript:$('#edit-window').modal('hide')";
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
		if (actions[i].type=="import-component") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Get_Resource.addMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode+"."+actions[i].semtag)+"','"+actions[i].updatedtag+"','"+fctjs+"');";
			}
		} else if (actions[i].type=="import-elts-from") {
			let targets = actions[i].trgts.split(',');
			for (let j=0;j<targets.length;j++) {
				if (targetid=="")
					targetid = targets[j];
				js2 += "UIFactory.Get_Get_Resource.importMultiple('"+actions[i].parentid+"','"+targets[j]+"','"+replaceVariable(actions[i].foliocode)+"',null,'"+fctjs+"');";
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
	var footer = "<button id='js2' js= \""+js2+"\" class='btn' onclick=\"$('#wait-window').modal('show');"+js1+"\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\"$('#edit-window').off('hidden');"+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure.ui[parentid].node,"xsi_type='nodeRes'");
	getgetResource.get_type = "import_comp";
	getgetResource.parent_position = parent_position;
	getgetResource.parent_semtag = parent_semtag;
	getgetResource.query_portfolio = query_portfolio;
	getgetResource.query_parent_semtag = query_parent_semtag;	
	getgetResource.query_semtag = query_semtag;
	getgetResource.query_object = query_object;
	getgetResource.targetid = targetid;
	getgetResource.unique = unique;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');
	//--------------------------------------
	$('#edit-window').on('hidden.bs.modal', function (e) {
		js2 = $("#js2").attr('js');
		eval(js2);$('#wait-window').modal('hide');
		$('#edit-window').off('hidden');
	})
	//--------------------------------------
}


