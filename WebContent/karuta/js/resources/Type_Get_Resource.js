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
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	if (this.clause=="xsi_type='Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
	this.multiple = "";
	this.simple = "";
};

//==================================
UIFactory["Get_Resource"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (dest!=null) {
		this.display[dest]=langcode;
	}
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
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	if (type=='batchform')
		return label;
	var html = "";
	html += "<span class='"+cleanCode(code)+" view-div' ";
	if (indashboard)
		html += " style='background-position:center'";
	html += ">";
	if (code.indexOf("#")>-1)
		html += cleanCode(code) + " ";
	if (code.indexOf("%")<0) {
		if (label.indexOf("fileid-")>-1)
			html += UICom.structure["ui"][label.substring(7)].resource.getView();
		else
			html += label;
	}
	if (code.indexOf("&")>-1)
		html += " ["+$(this.value_node).text()+ "] ";
	html += "</span>";
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
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node[0]).text(value);
	$(itself.code_node[0]).text(code);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i][0]).text(label);
	}
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
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		var target = queryattr_value.substring(srce_indx+1); // label or text
		//------------
		var portfoliocode = r_replaceVariable(queryattr_value.substring(0,semtag_indx));
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self') {
			portfoliocode = selfcode;
			cachable = false;
		}
		//------------
		var self = this;
		if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
			UIFactory["Get_Resource"].parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],self,disabled,srce,resettable,target,semtag,multiple_tags);
		else {
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_Get_Resource_caches[queryattr_value] = data;
					UIFactory["Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags);
				}
			});
		}
	}
};


//==================================
UIFactory["Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag,multiple_tags) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
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
	if (type=='select') {
		var html = "";
		html += "<div class='btn-group select-label select-"+semtag+"'>";		
		html += "	<button type='button' class='btn select selected-label' id='button_"+langcode+self.id+"'>&nbsp;</button>";
		html += "	<button type='button' class='btn dropdown-toggle dropdown-toggle-split select' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		if (resettable) {//----------------- null value to erase
			html = "<a class='dropdown-item' value='' code='' ";
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
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
					html = "<a class='dropdown-item "+code+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
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
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code);
				}
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				html = "<a class='dropdown-item' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item = $(html);
				$(select_item).click(function (ev){
					$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				//-------------- update button -----
				if ((code!="" && self_code==$('code',resource).text()) || (self_label==$(srce+"[lang='"+languages[langcode]+"']",resource).text())) {
					var html = "";
					html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
					$("#button_"+langcode+self.id).html(html);
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code);
				}
				$(select_item).append($(select_item))
				$(select).append($(select_item));
			}
		}
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
					$("#button_"+langcode+self.id).attr('class', 'btn select selected-label').addClass("sel"+code);
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
					$("#button_"+langcode+self.id).attr('class', 'btn  select selected-label').addClass("sel"+code);
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
					html += "label_"+languages[j]+"=\"resource:"+uuid + "|semtag:"+semtag+"\" ";
				}
				html += ">";
				
				if (display_code)
					html += code+" ";
				if (display_label)
					html += UICom.structure["ui"][uuid].resource.getView(null,'span');
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+langcode+self.id).html(UICom.structure["ui"][$(this).attr("label_"+languages[langcode]).substring(7)].resource.getView());
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
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
					$("#button_"+langcode+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
			}
		}		//---------------------
		$(btn_group).append($(select));
		
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		if (resettable) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			input += "<input type='radio' name='radio_"+self.id+"' value='' code='' ";
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
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
			input += ">";
			input += "<div  class='sel"+code+" radio-label'>"
			if (display_code)
				input += code + " ";
			if (display_label){
				if (target=='label')
					input += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
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
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		if (resettable){
			var input = "";
			input += "<div name='click_"+self.id+"' value='' code='' class='click-item";
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
			var input = "";
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
			input += "> ";
			input += "<span  class='"+code+"'>"
			if (display_code)
				input += code + " ";
			if (display_label)
				input += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
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
		//------------------------------------------------------------
	}
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
		//------------------------
		var inputs = "<div id='get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
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
			if (code.indexOf("!")>-1) {
				selectable = false;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div>";
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
			$(inputs_obj).append(input_obj);
		}
		//------------------------------
		$("#"+destid).append(inputs_obj);
	}
	//------------------------------------------------------------
	if (type=='completion') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice select-"+semtag+"'>";
		html += "<input id='button_"+self.id+"' type='text' class='btn btn-default select' code= '' value=''/>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		//---------------------------------------------------
		
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		if (resettable) //----------------- null value to erase
			html = "<li></li>";
		else
			html ="";
		var select_item = $(html);
		html = "<a  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Resource"].update(this,self,langcode);
		});
		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
						$("#button_"+self.id).html(html);
						$("#button_"+self.id).attr("value",html);
						$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
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
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr("value",html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < newTableau1.length; i++) {
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				html = "<li></li>";
				var select_item = $(html);
				html = "<a  value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		var onupdate = "UIFactory.Get_Resource.update(input,self)";
		autocomplete(document.getElementById("button_"+self.id), tableau2,onupdate,self,langcode);
	}
	
	//------------------------------------------------------------
	if (type=='simple') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice select-"+semtag+"'>";
		html += "<input id='button_"+self.id+"' type='text' class='btn btn-default select' code= '' value=''/>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		//---------------------------------------------------
		
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < newTableau1.length; i++) {
				//------------------------------
				var resource = null;
				if ($("asmResource",newTableau1[i][1]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr("code",$('code',resource).text());
					$("#button_"+self.id).attr("value",html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					for (var j=0; j<languages.length;j++){
						$("#button_"+self.id).attr("label_"+languages[j],$(srce+"[lang='"+languages[j]+"']",resource).text());
					}
					//--------------------------------
				});
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		autocomplete(document.getElementById("button_"+self.id), tableau2,onupdate,self,langcode);
	}
};

//==================================
UIFactory["Get_Resource"].prototype.save = function()
//==================================
{
	if (this.clause=="xsi_type='Get_Resource'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			this.refresh();
	}
	else {// Node - Get_Resource {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}	
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
};

//==================================
UIFactory["Get_Resource"].addSimple = function(parentid,multiple_tags)
//==================================
{
	$.ajaxSetup({async: false});
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var input = $("#button_"+parentid);
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Resource.updateaddedpart;
	var param2 = get_resource_semtag;
	var param3 = input;
	var param4 = true;
	importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4);
};

//==================================
UIFactory["Get_Resource"].addMultiple = function(parentid,multiple_tags)
//==================================
{
	$.ajaxSetup({async: false});
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Resource.updateaddedpart;
	var param2 = get_resource_semtag;
	var param4 = false;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4);
	}
};

//==================================
UIFactory["Get_Resource"].importMultiple = function(parentid,srce)
//==================================
{
	$.ajaxSetup({async: false});
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one import a part
	var databack = true;
	var callback = UIFactory.Node.reloadUnit;
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
		importBranch(parentid,encodeURIComponent(srce),encodeURIComponent(code),databack,callback);
	}
};

//==================================
UIFactory["Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
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
//			var nodeid = $("asmContext:has(metadata[semantictag='"+get_resource_semtag+"'])",data).attr('id');
			var node = $("*:has(metadata[semantictag='"+get_resource_semtag+"'])",data);
			if (node.length==0)
				node = $( ":root",data ); //node itself
			var nodeid = $(node).attr('id');
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $( ":root",data )[ 0 ].nodeName;
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
function get_simple(parentid,title,query,partcode,get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.addSimple('"+parentid+"','"+partcode+","+get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
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
function get_multiple(parentid,title,query,partcode,get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.addMultiple('"+parentid+"','"+partcode+","+get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
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

//==================================
function import_multiple(parentid,title,query,partcode,get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.importMultiple('"+parentid+"','"+partcode+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
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
