/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
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
UIFactory["Proxy"].prototype.displayView = function(dest,type,lang)
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
UIFactory["Proxy"].update = function(itself,lang,type,portfolio_label)
//==================================
{
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
		var p1 = queryattr_value.indexOf('.');
		var p2 = queryattr_value.indexOf('.',p1+1);
		var code = queryattr_value.substring(0,p1);
		var semtag = queryattr_value.substring(p1+1,p2);
		var srce = queryattr_value.substring(p2+1);
		var self = this;
		if (code!='all') {
			if (code=='self')
				code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
				success : function(data) {
					UIFactory["Proxy"].parse(destid,type,langcode,data,self,code,srce);
				}
			});
		} else {  // code==all
			// retrieve active portfolios
			$.ajaxSetup({async: false});
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/portfolios?active=1",
				success : function(data) {
					UIFactory["Portfolio"].parse(data);
					for ( var i = 0; i < portfolios_list.length; i++) {
						code = portfolios_list[i].code_node.text();
						label = portfolios_list[i].label_node[langcode].text();
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
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
									html += "<div id='"+code+"'></div>";
									$("#"+destid).append($(html));
									UIFactory["Proxy"].parse(code,type,langcode,data,self,label,srce);
								}
							}
						});
					}
				},
				error : function(jqxhr,textStatus) {
					alert("Server Error UIFactory.Proxy.prototype.displayEditor: "+textStatus);
				}
			});
			$.ajaxSetup({async: true});
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
		html = "<a href='#' value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Proxy"].update(this,self,langcode);
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
				html = "<a href='#' value='"+value+"' code='"+value+"' ";
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
