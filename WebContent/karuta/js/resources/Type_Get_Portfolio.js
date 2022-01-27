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
UIFactory["Get_Portfolio"] = function(node,condition)
//==================================
{
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Portfolio';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Get_Portfolio']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Get_Portfolio']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Portfolio']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='Get_Portfolio']",node));
	this.uuid_node = $("uuid",$("asmResource[xsi_type='Get_Portfolio']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Portfolio']",node));
		if (this.label_node[i].length==0) {
			var newelement = createXmlElement("label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Get_Portfolio']",node)[0].appendChild(newelement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Portfolio']",node));
		}
	}
	this.local_label_node = [];
	for (var i=0; i<languages.length;i++){
		this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Portfolio']",node));
		if (this.local_label_node[i].length==0) {
			var newelement = createXmlElement("local-label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Get_Portfolio']",node)[0].appendChild(newelement);
			this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Portfolio']",node));
		}
	}
	this.query = ($("metadata-wad",node).attr('query')==undefined)?'':$("metadata-wad",node).attr('query');
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Get_Portfolio"].prototype.getAttributes = function(type,langcode)
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
UIFactory["Get_Portfolio"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
		html = "<div  class='Get_Portfolio-link'>"+label+"</div>";
	return html;
};

//==================================
UIFactory["Get_Portfolio"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Get_Portfolio"].update = function(selected_item,itself,langcode,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().getTime());
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	$(itself.uuid_node).text(value);
	$(itself.code_node).text(code);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		$(itself.label_node[i]).text(label);
	}
	itself.save();
};

//==================================
UIFactory["Get_Portfolio"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	if (cachable==undefined || cachable==null)
		cachable = true;
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var self = this;
	var queryattr_value = this.query;
	if (queryattr_value!=undefined && queryattr_value!='') {
		queryattr_value = replaceVariable(queryattr_value);
		//------------
		var target_indx = queryattr_value.lastIndexOf('.');
		var target = queryattr_value.substring(target_indx+1);
		//------------
		var portfoliocode = queryattr_value.substring(0,target_indx);
		//------------
		if (cachable && g_Get_Portfolio_caches[queryattr_value]!=undefined && g_Get_Portfolio_caches[queryattr_value]!="")
			UIFactory["Get_Portfolio"].parse(destid,type,langcode,g_Get_Portfolio_caches[queryattr_value],self,disabled,resettable,target);
		else
			$.ajax({
				async : false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1&search="+portfoliocode,
				success : function(data) {
					if (cachable)
						g_Get_Portfolio_caches[queryattr_value] = data;
					UIFactory["Get_Portfolio"].parse(destid,type,langcode,data,self,disabled,resettable,target);
				}
			});
	}
	//---------------------------------------------------------
	if (g_userroles[0]=='designer' || USER.admin || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1 || editnoderoles.indexOf($(USER.username_node).text())>-1) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='label_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['local-label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='local_label_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.local_label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			self.updateLabel(langcode);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$("#"+destid).append($(htmlLabelGroupObj));
	}
};


//==================================
UIFactory["Get_Portfolio"].parse = function(destid,type,langcode,data,self,disabled,resettable,target) {
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
			UIFactory["Get_Portfolio"].update(this,self,langcode);
		});
		$(select).append($(select_item_a));
		//---------------------
		if (target=='label') {
			var items = $("portfolio",data);
			for ( var i = 0; i < items.length; i++) {
				var uuid = $(items[i]).attr('id');
				var code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				var label = {};
				for (var j=0; j<languages.length;j++){
					label[j] = $("label[lang="+languages[j]+"]",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				}
				html = "<a class='dropdown-item' value='"+uuid+"' code='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+label[j]+"\" ";
				}
				html += ">";
				html += "<div class='li-code'>"+code+"</div> <span class='li-label'>"+label[langcode]+"</span></a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					UIFactory["Get_Portfolio"].update(this,self,langcode);
				});
				$(select).append($(select_item_a));
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+label[langcode]);
					else
						$("#button_"+self.id).html(label[langcode]);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
			}
		}
		//---------------------
		$(btn_group).append($(select));
		
	}
};

//==================================
UIFactory["Get_Portfolio"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	if (this.blockparent!=null)
		this.blockparent.refresh();
	else
		this.refresh();
};

//==================================
UIFactory["Get_Portfolio"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
};

//==================================
UIFactory["Get_Portfolio"].prototype.bringUpToDate = function()
//==================================
{
	var queryattr_value = this.query;
	if (queryattr_value!=undefined && queryattr_value!='') {
		queryattr_value = replaceVariable(queryattr_value);
		//------------
		var target_indx = queryattr_value.lastIndexOf('.');
		var target = queryattr_value.substring(target_indx+1);
		//------------
		var portfoliocode = queryattr_value.substring(0,target_indx);
		//------------
		var self = this;
		if (g_Get_Portfolio_caches[queryattr_value]!=undefined && g_Get_Portfolio_caches[queryattr_value]!="") {
			var items = $("portfolio>asmRoot",data);
			for ( var i = 0; i < items.length; i++) {
				var code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
				if (code == portfoliocode) {
					$(self.uuid_node).text($(items[i]).attr('id'));
					for (var j=0; j<languages.length;j++){
						var label = $("label[lang="+languages[j]+"]",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
						$(self.label_node[j]).text(label);
					}
					self.save();
					break;
				}
			}
		} else
			$.ajax({
				async : false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1&search="+portfoliocode,
				success : function(data) {
					g_Get_Portfolio_caches[queryattr_value] = data;
					var items = $("portfolio>asmRoot",data);
					for ( var i = 0; i < items.length; i++) {
						var code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
						if (code == portfoliocode) {
							$(self.uuid_node).text($(items[i]).attr('id'));
							for (var j=0; j<languages.length;j++){
								var label = $("label[lang="+languages[j]+"]",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
								$(self.label_node[j]).text(label);
							}
							self.save();
							break;
						}
					}
				}
			});
	}
};

//==================================
UIFactory["Get_Portfolio"].bringUpToDate = function(portfolioid)
//==================================
{
	$("#wait-window").modal("show");
	g_Get_Portfolio_caches = [];
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
			var Get_Portfolios = $("asmContext:has(asmResource[xsi_type='Get_Portfolio'])",data);
			for (var j=0; j<Get_Portfolios.length; j++){
				UICom.structure.ui[$(Get_Portfolios[j]).attr('id')].resource.bringUpToDate();
			}
		}
	});
	$("#wait-window").modal("hide");
}
//==================================
UIFactory["Get_Portfolio"].testIfGet_Portfolio = function(data)
//==================================
{
	var Get_Portfolios = $("asmContext:has(asmResource[xsi_type='Get_Portfolio'])",data);
	if (Get_Portfolios.length>0)
		return true;
	else
		return false;
}
