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

var g_URL2Unit_caches = {};

/// Define our type
//==================================
UIFactory["URL2Unit"] = function(node,condition)
//==================================
{
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URL2Unit';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='URL2Unit']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='URL2Unit']",node));
	//--------------------
	if ($("code",$("asmResource[xsi_type='URL2Unit']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("code");
		$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
	}
	this.code_node = $("code",$("asmResource[xsi_type='URL2Unit']",node));
	//--------------------
	this.uuid_node = $("uuid",$("asmResource[xsi_type='URL2Unit']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		if (this.label_node[i].length==0) {
			var newelement = createXmlElement("label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		}
	}
	this.local_label_node = [];
	for (var i=0; i<languages.length;i++){
		this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		if (this.local_label_node[i].length==0) {
			var newelement = createXmlElement("local-label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
			this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		}
	}
	this.query = ($("metadata-wad",node).attr('query')==undefined)?'':$("metadata-wad",node).attr('query');
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["URL2Unit"].prototype.getAttributes = function(type,langcode)
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
UIFactory["URL2Unit"].prototype.getView = function(dest,type,langcode)
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
	if (this.query.indexOf('self.')>-1)
		html = "<div  class='URL2Unit-link' onclick=\"javascript:$('#sidebar_"+this.uuid_node.text()+"').click()\">"+label+"</div>";
	else
		html = "<a href='page.htm?i="+this.uuid_node.text()+"&type=standard&lang="+LANG+"' class='URL2Unit-link' target='_blank'>"+label+"</a>";
	return html;
};

//==================================
UIFactory["URL2Unit"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["URL2Unit"].update = function(selected_item,itself,langcode,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	var value = $(selected_item).attr('value');
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	$(itself.uuid_node).text(value);
	//---------------------
	var code = $(selected_item).attr('code');
	if (itself.encrypted)
		code = "rc4"+encrypt(value,g_rc4key);
	$(itself.code_node).text(code);
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
UIFactory["URL2Unit"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
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
			if (g_display_type!="translate")
				cachable = false;
		}
		//------------
		var self = this;
		if (cachable && g_URL2Unit_caches[queryattr_value]!=undefined && g_URL2Unit_caches[queryattr_value]!="")
			UIFactory["URL2Unit"].parse(destid,type,langcode,g_URL2Unit_caches[queryattr_value],self,disabled,srce,resettable,target,semtag);
		else
			$.ajax({
				async : false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_URL2Unit_caches[queryattr_value] = data;
					UIFactory["URL2Unit"].parse(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag);
				}
			});
	}
};


//==================================
UIFactory["URL2Unit"].parse = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag) {
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
		var value = $(nodes[i]).attr('id');
		var libelle = $(srce+"[lang='"+languages[langcode]+"']",resource).text();
		tableau1[i] = [code,nodes[i]];
		tableau2[i] = {'code':code,'libelle':libelle,'value':value};
	}
	var newTableau1 = tableau1.sort(sortOn1);

	//------------------------------------------------------------
	if (type=='select') {
		var html = "";
//		var html = "<div class='btn-group'>";
//		html += "	<button type='button' class='btn select selected-label' id='button_"+langcode+self.id+"'>&nbsp;</button>";
//		html += "	<button type='button'  class='btn dropdown-toggle dropdown-toggle-split ' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
//		html += "</div>";
		html += "<div class='auto-complete btn-group roles-choice select-"+semtag+"'>";
		html += "<input id='button_"+langcode+self.id+"' onfocus=\"this.value=''\" type='text' class='form-control select' code= '' value='' />";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
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
			$("#button_"+langcode+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+langcode+self.id).attr('class', 'form-control select select-label');
			UIFactory["URL2Unit"].update(this,self,langcode);
		});
		$(select).append($(select_item_a));
		//--------------------
		var nodes = $("node",data);
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
						$("#button_"+langcode+self.id).val(code+" "+$(this).attr("label_"+languages[langcode]));
					else
						$("#button_"+langcode+self.id).val($(this).attr("label_"+languages[langcode]));
					var code = $(this).attr("code");
					if (code.indexOf("@")>-1) {
						code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
					}
					if (code.indexOf("#")>-1) {
						code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
					}
					$("#button_"+langcode+self.id).attr('class', 'form-control select select-label').addClass("sel"+code);
					UIFactory["URL2Unit"].update(this,self,langcode);
				});
				$(select).append($(select_item_a));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+langcode+self.id).val(code+" "+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
					else
						$("#button_"+langcode+self.id).val($(srce+"[lang='"+languages[langcode]+"']",resource).text());
					$("#button_"+langcode+self.id).attr('class', 'form-control select select-label').addClass("sel"+code);
				}
			}
		}
		//---------------------
		$(btn_group).append($(select));
		var input = document.getElementById("button_"+langcode+self.id);
		var onupdate = "UIFactory.URL2Unit.update(input,self)";
		autocomplete(input,tableau2,onupdate,self,langcode);
		
	}
};

//==================================
UIFactory["URL2Unit"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["URL2Unit"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};

//==================================
UIFactory["URL2Unit"].prototype.bringUpToDate = function()
//==================================
{
	var unit_code = $(this.code_node).text();
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
		}
		var self = this;
		if (g_URL2Unit_caches[queryattr_value]!=undefined) {
			var nodes = $("node",g_URL2Unit_caches[queryattr_value]);
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				if (code == unit_code) {
					$(self.uuid_node).text($(nodes[i]).attr('id'));
					for (var i=0; i<languages.length;i++){
						var label = $("label[lang='"+languages[i]+"']",resource).text();
						$(self.label_node[i]).text(label);
					}
					self.save();
					break;
				}
			}
		} else {
			//------------
			$.ajax({
				self :self,
				async : false,
				unit_code : unit_code,
				queryattr_value : queryattr_value,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					g_URL2Unit_caches[this.queryattr_value] = data;
					var nodes = $("node",g_URL2Unit_caches[this.queryattr_value]);
					for ( var i = 0; i < $(nodes).length; i++) {
						var resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
						var code = $('code',resource).text();
						if (code == this.unit_code) {
							$(self.uuid_node).text($(nodes[i]).attr('id'));
							for (var i=0; i<languages.length;i++){
								var label = $("label[lang='"+languages[i]+"']",resource).text();
								$(self.label_node[i]).text(label);
							}
							self.save();
							break;
						}
					}
				}
			});
		}
	}
};

//==================================
UIFactory["URL2Unit"].bringUpToDate = function(portfolioid)
//==================================
{
	$("#wait-window").modal("show");
	g_URL2Unit_caches = [];
	var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		beforeSend: function (XMLHttpRequest) {
			$("#wait-window").modal("show");
		},
	 	success : function(data) {
			UICom.parseStructure(data,true);
			setVariables(data);
			var url2units = $("asmContext:has(asmResource[xsi_type='URL2Unit'])",data);
			for (var j=0; j<url2units.length; j++){
				UICom.structure.ui[$(url2units[j]).attr('id')].resource.bringUpToDate();
			}
		}
	});
	$("#wait-window").modal("hide");
}

//==================================
UIFactory["URL2Unit"].testIfURL2Unit = function(data)
//==================================
{
	var url2units = $("asmContext:has(asmResource[xsi_type='URL2Unit'])",data);
	if (url2units.length>0)
		return true;
	else
		return false;
}

