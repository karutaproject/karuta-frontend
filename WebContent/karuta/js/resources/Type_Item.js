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
UIFactory["Item"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Item';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Item']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Item']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Item']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='Item']",node));
	//--------------------
	if ($("value",$("asmResource[xsi_type='Item']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("value");
		$("asmResource[xsi_type='Item']",node)[0].appendChild(newelement);
	}
	this.value_node = $("value",$("asmResource[xsi_type='Item']",node));
	//--------------------
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Item']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Item']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Item']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Item']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Item']",node));
			}
		}
	}
	//--------------------
	if ($("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - if multilingual we set all languages
		this.version_node.text("3.0");
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.label_node[langcode]).text($(this.label_node[0]).text());
		}
		this.save();
	}
	//--------------------
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
};

//==================================
UIFactory["Item"].prototype.getAttributes = function(type,langcode)
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
		result['code'] = this.code_node.text();
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display

//==================================
UIFactory["Item"].prototype.getCode = function()
//==================================
{
	return this.code_node.text();
};

//==================================
UIFactory["Item"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest] = true;
	}
	return this.value_node.text();
};

//==================================
UIFactory["Item"].prototype.getLabel = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = 'span';
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = "";
	var code = $(this.code_node).text();
	var label = this.label_node[langcode].text();
	if (type=="div")
		html +=   "<div>"+label+"</div>";
	if (type=="span")
		html +=  "<span class='label_Item "+code+"'> "+label+"</span>";
	if (type=="none")
		html += label;
	return html;
};

//==================================
UIFactory["Item"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (type==null)
		type = "default";
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var node = UICom.structure["ui"][this.id];
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var resnopencil = ($(node.metadatawad).attr('resnopencil')==undefined)?'N':$(node.metadatawad).attr('resnopencil');
	var displayCodeValue = (editresroles.containsArrayElt(g_userroles) || editresroles.indexOf(this.userrole)>-1 || editresroles.indexOf($(USER.username_node).text())>-1) && resnopencil=='N';
	var label = this.label_node[langcode].text();
	var code = $(this.code_node).text();
	var value = $(this.value_node).text();
	var html = "";
	if (type=="default") {
		if (g_userroles[0]=='designer' || USER.admin || displayCodeValue) {
			html += "<div class='"+ code +" view-div'>"+ "<span name='code'>" +code + "</span> <span name='label'>"+label + "</span>";
			if (value!='')
				html += "<span name='value'> ["+ value + "] </span>";
			html += "</div> ";
		} else {
			html += "<div class='"+ code +" view-div'>";
			if (code.indexOf("#")>-1)
				html += "<span name='code'>" +cleanCode(code) + "</span> ";
			if (code.indexOf("%")<0)
				html += " <span name='label'>"+label + "</span> ";
			if (code.indexOf("&")>-1)
				html += "<span name='value'> ["+ value + "] </span>";
			html += "</div>";
		}
	}
	if (type=="span") {
		html += "<span class='"+ code +" view-div'>";
		if (code.indexOf("#")>-1)
			html += "<span name='code'>" +cleanCode(code) + "</span> ";
		if (code.indexOf("%")<0)
			html += " <span name='label'>"+label + "</span> ";
		if (code.indexOf("&")>-1)
			html += "<span name='value'> ["+ value + "] </span>";
		html += "</span>";
	}
	if (type=="none") {
		if (code.indexOf("#")>-1)
			html += cleanCode(code) + " ";
		if (code.indexOf("%")<0)
			html += label;
		if (code.indexOf("&")>-1)
			html += " ["+ value + "]";
		html += "</span>";
	}
	return html;
};

//==================================
UIFactory["Item"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Item"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (!itself.multilingual) {
		var value = $(itself.label_node[langcode]).text();
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.label_node[langcode]).text(value);
		}
	}
	//---------------------
	itself.save();
};


//==================================
UIFactory["Item"].prototype.getEditor = function(type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	var self = this;
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	if(type=='default') {
		//-----------------------------------------------------
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='item_code_"+this.id+"' class='col-sm-3 control-label'>Item - Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='item_code_"+this.id+"' type='text' class='form-control' name='code_Item' value=\""+this.code_node.text()+"\">");
		$(htmlCodeInputObj).change(function (){
			$(self.code_node).text($(this).val());
			UIFactory["Item"].update(self,langcode);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
		//-----------------------------------------------------
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='item_label_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>Item - "+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='item_label_"+this.id+"_"+langcode+"' type='text' class='form-control' name='label_Item' value=\""+this.label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			$(self.label_node[langcode]).text($(this).val());
			UIFactory["Item"].update(self,langcode);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
		//-----------------------------------------------------
		var htmlValueGroupObj = $("<div class='form-group'></div>")
		var htmlValueLabelObj = $("<label for='item_value_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>Item - "+karutaStr[LANG]['value']+"</label>");
		var htmlValueDivObj = $("<div class='col-sm-9'></div>");
		var htmlValueInputObj = $("<input id='item_value_"+this.id+"_"+langcode+"' type='text' class='form-control' name='value_Item' value=\""+this.value_node.text()+"\">");
		$(htmlValueInputObj).change(function (){
			$(self.value_node).text($(this).val());
			UIFactory["Item"].update(self,langcode);
		});
		$(htmlValueDivObj).append($(htmlValueInputObj));
		$(htmlValueGroupObj).append($(htmlValueLabelObj));
		$(htmlValueGroupObj).append($(htmlValueDivObj));
		$(htmlFormObj).append($(htmlValueGroupObj));
		//-----------------------------------------------------
	}
	//------------------------
	return htmlFormObj;
};

//==================================
UIFactory["Item"].prototype.displayEditor = function(dest,type,langcode,disabled,translate)
//==================================
{
	var obj = this.getEditor(type,langcode,disabled);
	$("#"+dest).append(obj);
};

//==================================
UIFactory["Item"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};


//==================================
UIFactory["Item"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
