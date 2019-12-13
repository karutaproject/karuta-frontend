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
UIFactory["Get_Proxy"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Proxy';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Get_Proxy']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Get_Proxy']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Proxy']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='Get_Proxy']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Get_Proxy']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Proxy']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Get_Proxy']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Get_Proxy']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Proxy']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Proxy']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Get_Proxy"].prototype.getAttributes = function(type,langcode)
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
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Get_Proxy"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	return this.label_node[langcode].text();
};

//==================================
UIFactory["Get_Proxy"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	$(dest).html(this.label_node[langcode].text());
};


/// Editor
//==================================
UIFactory["Get_Proxy"].update = function(selected_item,itself,lang,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	if (lang==null)
		lang = LANG;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	var semtag = $(selected_item).attr('semtag');
	code = cleanCode(code);
	if (code!="") {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
			success : function(data) {
				UIFactory["Get_Proxy"].update2(data,itself,lang,type,code);
			}
		});
	}
	else {
		$(itself.code_node).text("");
		for (var j=0; j<languages.length;j++){
			$(itself.label_node[j]).text("");
		}
		$(itself.value_node).text("");
		itself.save();

	}

};
//==================================
UIFactory["Get_Proxy"].update2 = function(data,itself,lang,type,code)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var nodes = $("node",data);
	var resource = null;
	if ($("asmResource",nodes[0]).length==3)
		resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[0]); 
	else
		resource = $("asmResource[xsi_type='nodeRes']",nodes[0]);
	$(itself.code_node).text(code);
	for (var j=0; j<languages.length;j++){
		var label = $("label[lang='"+languages[j]+"']",resource).text();
		$(itself.label_node[j]).text(label);
	}
	var value = $(nodes[0]).attr("id");
	$(itself.value_node).text(value);
	itself.save();
};
//==================================
UIFactory["Get_Proxy"].prototype.displayEditor = function(destid,type,lang)
//==================================
{
	var query = $("metadata-wad",this.node).attr('query');
	if (query!=undefined && query!='') {
		var parts = query.split("/");
		var queryattr_value = parts[0];
		var proxy_semtag = parts[1]
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		var portfoliocode = queryattr_value.substring(0,semtag_indx);
		var target = queryattr_value.substring(srce_indx+1); // label or text
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self')
			portfoliocode = selfcode;
		//------------
		var self = this;
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
			success : function(data) {
				UIFactory["Get_Proxy"].parse(destid,type,lang,data,self,srce,true,target,proxy_semtag);
			}
		});
	}
};

//==================================
UIFactory["Get_Proxy"].parse = function(destid,type,langcode,data,self,srce,resettable,target,proxy_semtag) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//---------------------
	var self_code = $(self.code_node).text();
	if (self.encrypted)
		self_code = decrypt(self_code.substring(3),g_rc4key);
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
	if (type=='select') {
		var html = "<div class='btn-group choice-group'>";		
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
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
			UIFactory["Get_Proxy"].update(this,self,langcode);
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
				var value = $('value',resource).text();
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
				html = "<a  semtag='"+proxy_semtag+"' value='"+value+"' code='"+code+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				if (display_code)
					html += "<span class='li-code'>"+code+"</span>";
				if (display_label)
					html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
				html += "</a>";			
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
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
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Proxy"].update(this,self,langcode);
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
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
				$(select).append($(select_item));
			}
			$(btn_group).append($(select));
		}
		if (type=='selectX') {
		var select = "<select>";
		select += "<option code='' value='' ";
		for (var j=0; j<languages.length;j++){
			select += "label_"+languages[j]+"='' ";
		}
		select += "</option></select>";
		var obj = $(select);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			var value = $('value',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $("label[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option semtag='"+proxy_semtag+"' code='"+code+"' value='"+value+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if ($(self.value_node).text()==code)
					option += " selected ";
				option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj).append($(option));
		}
		$(obj).change(function (){
			UIFactory["Get_Proxy"].update(obj,self,langcode);
		});
		$("#"+destid).append(obj);
	}
	}
};

//==================================
UIFactory["Get_Proxy"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,proxy_reload);
	this.refresh();
};

//==================================
function proxy_reload()
//==================================
{
	UIFactory['Node'].reloadUnit();
}
//==================================
UIFactory["Get_Proxy"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
