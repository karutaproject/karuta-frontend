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

//==================================
UIFactory["Dashboard"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.parent = $(node).parent()
	this.type = 'Dashboard';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("csv",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("csv");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.csv_node = $("csv",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("pdf",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("pdf");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.pdf_node = $("pdf",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("rtf",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("rtf");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.rtf_node = $("rtf",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("img",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("img");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.img_node = $("img",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Dashboard']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Dashboard']",node));
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
			$(this.text_node[langcode]).text($(this.text_node[0]).text());
		}
		this.save();
	}
	//--------------------
	this.display = {};
};

//==================================
UIFactory["Dashboard"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Dashboard"].prototype.getView = function(dest,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	return $(this.text_node[langcode]).text();
};

//==================================
UIFactory["Dashboard"].prototype.displayView = function(dest,langcode)
//==================================
{
	var uuid = this.id;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = $(this.text_node[langcode]).text();
	$("#"+dest).html(html);
//	report_not_in_a_portfolio = false;
	//-----------------------------------------------------
	$("#extra_"+uuid).append($("<div id='extra_button_"+uuid+"' class='dashboard-buttons btn-group'></div>"));
	$("#extra_"+uuid).append($("<div id='dashboard_"+uuid+"' class='createreport'></div>"));
	var root_node = g_portfolio_current;
	var parent_node = UICom.structure.ui[$(this.parent).attr("id")];
	genDashboardContent("dashboard_"+uuid,uuid,parent_node,root_node);
//	var dashboardContent = $("dashboard_"+uuid).html();
//	var dashboardContentPNG = html2IMG('dashboard_"+uuid+"');
	if (g_userroles[0]!='designer')
		$("#sub_node_"+uuid).hide();
	//---------- display csv or pdf -------
	var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
	if (csv_roles.indexOf('all')>-1 || csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
		$("#extra_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
	}
	var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
	if (pdf_roles.indexOf('all')>-1 || pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
		$("#extra_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div>"));				
	}
	var rtf_roles = $(UICom.structure["ui"][uuid].resource.rtf_node).text();
	if (rtf_roles.indexOf('all')>-1 || rtf_roles.containsArrayElt(g_userroles) || (rtf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
		$("#extra_button_"+uuid).append($("<div class='rtf-button button' onclick=\"javascript:xml2RTF('dashboard_"+uuid+"')\">RTF/Word</div>"));				
	}
	var img_roles = $(UICom.structure["ui"][uuid].resource.img_node).text();
	if (img_roles.indexOf('all')>-1 || img_roles.containsArrayElt(g_userroles) || (img_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
		$("#extra_button_"+uuid).append($("<div class='img-button button' onclick=\"javascript:html2IMG('dashboard_"+uuid+"')\">PNG</div>"));
	}
};

/// Editor
//==================================
UIFactory["Dashboard"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (!itself.multilingual) {
		var value = $(itself.text_node[langcode]).text();
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.text_node[langcode]).text(value);
		}
	}
	//---------------------
	itself.save();
};

//==================================
UIFactory["Dashboard"].prototype.getEditor = function(type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	var self = this;
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	if(type=='default') {
		//-----------------------------------------------------
		var htmlTextGroupObj = $("<div class='form-group'></div>")
		var htmlTextLabelObj = $("<label for='text_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['dashboard-code']+"</label>");
		var htmlTextDivObj = $("<div class='col-sm-9'></div>");
		var htmlTextInputObj = $("<input id='text_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.text_node[langcode].text()+"\">");
		$(htmlTextInputObj).change(function (){
			$(self.text_node[langcode]).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlTextDivObj).append($(htmlTextInputObj));
		$(htmlTextGroupObj).append($(htmlTextLabelObj));
		$(htmlTextGroupObj).append($(htmlTextDivObj));
		$(htmlFormObj).append($(htmlTextGroupObj));
		//-----------------------------------------------------
		var htmlCsvGroupObj = $("<div class='form-group'></div>")
		var htmlCsvLabelObj = $("<label for='csv_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['csv']+"</label>");
		var htmlCsvDivObj = $("<div class='col-sm-9'></div>");
		var htmlCsvInputObj = $("<input id='csv_"+this.id+"' type='text' class='form-control' value=\""+this.csv_node.text()+"\">");
		$(htmlCsvInputObj).change(function (){
			$(self.csv_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlCsvDivObj).append($(htmlCsvInputObj));
		$(htmlCsvGroupObj).append($(htmlCsvLabelObj));
		$(htmlCsvGroupObj).append($(htmlCsvDivObj));
		$(htmlFormObj).append($(htmlCsvGroupObj));
		//-----------------------------------------------------
		var htmlpdfGroupObj = $("<div class='form-group'></div>")
		var htmlpdfLabelObj = $("<label for='pdf_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['pdf']+"</label>");
		var htmlpdfDivObj = $("<div class='col-sm-9'></div>");
		var htmlpdfInputObj = $("<input id='pdf_"+this.id+"' type='text' class='form-control' value=\""+this.pdf_node.text()+"\">");
		$(htmlpdfInputObj).change(function (){
			$(self.pdf_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlpdfDivObj).append($(htmlpdfInputObj));
		$(htmlpdfGroupObj).append($(htmlpdfLabelObj));
		$(htmlpdfGroupObj).append($(htmlpdfDivObj));
		$(htmlFormObj).append($(htmlpdfGroupObj));
		//-----------------------------------------------------
		var htmlrtfGroupObj = $("<div class='form-group'></div>")
		var htmlrtfLabelObj = $("<label for='rtf_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['rtf']+"</label>");
		var htmlrtfDivObj = $("<div class='col-sm-9'></div>");
		var htmlrtfInputObj = $("<input id='rtf_"+this.id+"' type='text' class='form-control' value=\""+this.rtf_node.text()+"\">");
		$(htmlrtfInputObj).change(function (){
			$(self.rtf_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlrtfDivObj).append($(htmlrtfInputObj));
		$(htmlrtfGroupObj).append($(htmlrtfLabelObj));
		$(htmlrtfGroupObj).append($(htmlrtfDivObj));
		$(htmlFormObj).append($(htmlrtfGroupObj));
		//-----------------------------------------------------
		var htmlimgGroupObj = $("<div class='form-group'></div>")
		var htmlimgLabelObj = $("<label for='img_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['img']+"</label>");
		var htmlimgDivObj = $("<div class='col-sm-9'></div>");
		var htmlimgInputObj = $("<input id='img_"+this.id+"' type='text' class='form-control' value=\""+this.img_node.text()+"\">");
		$(htmlimgInputObj).change(function (){
			$(self.img_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlimgDivObj).append($(htmlimgInputObj));
		$(htmlimgGroupObj).append($(htmlimgLabelObj));
		$(htmlimgGroupObj).append($(htmlimgDivObj));
		$(htmlFormObj).append($(htmlimgGroupObj));
	}
	//------------------------
	return htmlFormObj;

};


//==================================
UIFactory["Dashboard"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Dashboard"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
