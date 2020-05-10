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

var g_URL2Portfolio_caches = {};

/// Define our type
//==================================
UIFactory["URL2Portfolio"] = function(node,condition)
//==================================
{
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URL2Portfolio';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='URL2Portfolio']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='URL2Portfolio']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='URL2Portfolio']",node));
	//--------------------
	this.uuid_node = $("uuid",$("asmResource[xsi_type='URL2Portfolio']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Portfolio']",node));
		if (this.label_node[i].length==0) {
			var newelement = createXmlElement("label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Portfolio']",node)[0].appendChild(newelement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Portfolio']",node));
		}
	}
	this.local_label_node = [];
	for (var i=0; i<languages.length;i++){
		this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Portfolio']",node));
		if (this.local_label_node[i].length==0) {
			var newelement = createXmlElement("local-label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Portfolio']",node)[0].appendChild(newelement);
			this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Portfolio']",node));
		}
	}
	this.query = ($("metadata-wad",node).attr('query')==undefined)?'':$("metadata-wad",node).attr('query');
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["URL2Portfolio"].prototype.getAttributes = function(type,langcode)
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
		result['uuid'] = this.uuid_node[langcode].text();
		result['label'] = this.label_node[langcode].text();
		result['local_label'] = this.local_label_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["URL2Portfolio"].prototype.getView = function(dest,type,langcode)
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
	var label = this.label_node[langcode].text();
	var local_label = this.local_label_node[langcode].text();
	if (local_label!="")
		label = local_label;
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	if (label=='')
		label = "---";
	var html ="";
		html = "<div  class='URL2Portfolio-link' onclick=\"display_main_page('"+this.uuid_node.text()+"')\">"+label+"</div>";
	return html;
};

//==================================
UIFactory["URL2Portfolio"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["URL2Portfolio"].update = function(selected_item,itself,langcode,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var value = $(selected_item).attr('value');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	//---------------------
	$(itself.uuid_node).text(value);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i]).text(label);
	}
	itself.save();
};

//==================================
UIFactory["URL2Portfolio"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
//==================================
{
	if (cachable==undefined || cachable==null)
		cachable = true;
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = this.query;
	if (queryattr_value!=undefined && queryattr_value!='') {
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
		if (cachable && g_URL2Portfolio_caches[queryattr_value]!=undefined && g_URL2Portfolio_caches[queryattr_value]!="")
			UIFactory["URL2Portfolio"].parse(destid,type,langcode,g_URL2Portfolio_caches[queryattr_value],self,disabled,srce,resettable,target,semtag);
		else
			$.ajax({
				async : false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_URL2Portfolio_caches[queryattr_value] = data;
					UIFactory["URL2Portfolio"].parse(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag);
				}
			});
	}
};


//==================================
UIFactory["URL2Portfolio"].parse = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag) {
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
	//---------------------
	if (type==undefined || type==null)
		type = 'select';

	//------------------------------------------------------------
	if (type=='select') {
		var html = "<div class='btn-group'>";
		html += "	<button type='button' class='btn select selected-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "	<button type='button' class='btn dropdown-toggle dropdown-toggle-split ' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		if (resettable) { //----------------- null value to erase
			html = "<a class='dropdown-item' value='' code='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
		}
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["URL2Portfolio"].update(this,self,langcode);
		});
		$(select).append($(select_item_a));
		//--------------------
		var nodes = $("node",data);
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = null;
				if ($("asmResource",nodes[i]).length==3) // test if asmcontext
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				var display_code = true;
				if (code.indexOf("@")>-1) {
					display_code = false;
					code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
				}
				if (code.indexOf("#")>-1) {
					code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
				}
				var select_item = $(html);
				html = "<a class='dropdown-item' value='"+$(nodes[i]).attr('id')+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				if (display_code)
					html += "<div class='li-code'>"+code+"</div> <span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></a>";
				else
					html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></a>";
				
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+$(this).attr("label_"+languages[langcode]));
					else
						$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					var code = $(this).attr("code");
					if (code.indexOf("@")>-1) {
						code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
					}
					if (code.indexOf("#")>-1) {
						code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
					}
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["URL2Portfolio"].update(this,self,langcode);
				});
				$(select).append($(select_item_a));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
					else
						$("#button_"+self.id).html($(srce+"[lang='"+languages[langcode]+"']",resource).text());
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
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
					UIFactory["URL2Portfolio"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		
	}
};

//==================================
UIFactory["URL2Portfolio"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["URL2Portfolio"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
