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
UIFactory["Proxy"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Proxy';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Proxy']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Proxy']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Proxy']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='Proxy']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Proxy']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Proxy']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Proxy']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Proxy']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Proxy']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Proxy']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Proxy"].prototype.getAttributes = function(type,langcode)
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
UIFactory["Proxy"].prototype.getView = function(dest,type,langcode)
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
UIFactory["Proxy"].prototype.displayView = function(dest,type,langcode)
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
	var html = this.label_node[langcode].text();
	$("#"+dest).html(html);
};


/// Editor
//==================================
UIFactory["Proxy"].update = function(itself,lang,type,portfolio_label)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Proxy"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		//------------
		var portfoliocode = queryattr_value.substring(0,semtag_indx);
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && portfoliocode!='self' && portfoliocode!='all')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self')
			portfoliocode = selfcode;
		//------------
		var self = this;
		if (portfoliocode!='all') {
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					UIFactory["Proxy"].parse(destid,type,langcode,data,self,portfoliocode,srce);
				}
			});
		} else {  // code==all
			// retrieve active portfolios
			$("#wait-window").modal('show');
			$.ajaxSetup({async: false});
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1",
				success : function(data) {
					UIFactory["Portfolio"].parse(data);
					for ( var i = 0; i < portfolios_list.length; i++) {
						code = portfolios_list[i].code_node.text();
						label = portfolios_list[i].label_node[langcode].text();
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
							success : function(data) {
								var nodes = $("node",data);
								var display = false;
								for ( var i = 0; i < $(nodes).length; ++i) {
									var semtag = $("metadata",nodes[i]).attr('semantictag');
									if (semtag.indexOf("proxy-")<0)
										display = true;
								}
								if (nodes.length>0 && display) {									
									var html = "";
									html += "<div class='portfolio-proxy' style='margin-top:20px'>"+label+"</div>";
									var placeid = code.replace(/\./g, '_'); 
									html += "<div id='"+placeid+"'></div>";
									$("#"+destid).append($(html));
									UIFactory["Proxy"].parse(placeid,type,langcode,data,self,label,srce);
								}
							}
						});
					}
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Server Error UIFactory.Proxy.prototype.displayEditor: "+textStatus);
					$("#wait-window").modal('hide');
				}
			});
			$.ajaxSetup({async: true});
			$("#wait-window").modal('hide');
		}
	}
};

//==================================
UIFactory["Proxy"].parse = function(destid,type,langcode,data,self,portfolio_label,srce) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	var self_value = $(self.value_node).text();
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	var formobj = $("<div class='form-horizontal'></div>");
	$("#"+destid).append($(formobj));
	if (type=='select') {
		//--------------------------------------------------------------
		var html = "<div class='btn-group'>";
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(formobj).append($(btn_group));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//----------------- null value to erase
		html = "<li></li>";
		var select_item = $(html);
		html = "<a  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html(portfolio_label+"."+$(this).attr("label_"+languages[langcode]));
			for (var i=0; i<languages.length;i++){
				$(self.label_node[i]).text($(this).attr("label_"+languages[i]));
			}
			$(self.code_node).text($(this).attr("code"));
			$(self.value_node).text($(this).attr("value"));
			UIFactory["Proxy"].update(self,langcode);
		});
		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//--------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var semtag = $("metadata",nodes[i]).attr('semantictag');
			if (semtag.indexOf("proxy-")<0){
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var value = $(nodes[i]).attr('id');
				var html = "<li></li>";
				var select_item = $(html);
				html = "<a  value='"+value+"' code='"+value+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html(portfolio_label+"."+$(this).attr("label_"+languages[langcode]));
					for (var i=0; i<languages.length;i++){
						$(self.label_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code_node).text($(this).attr("code"));
					$(self.value_node).text($(this).attr("value"));
					UIFactory["Proxy"].update(self,langcode);
				});
				$(select_item).append($(select_item_a))
				//-------------- update button -----
				if (value!="" && self_value==value) {
					$("#button_"+self.id).html(portfolio_label+"."+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
				}
				$(select).append($(select_item));
			}
		$(btn_group).append($(select));
		}
	}
};

//==================================
UIFactory["Proxy"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Proxy"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
