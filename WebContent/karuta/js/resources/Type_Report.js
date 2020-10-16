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
UIFactory["Report"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Report';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Report']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Report']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Report']",node));
	//--------------------
	if ($("csv",$("asmResource[xsi_type='Report']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("csv");
		$("asmResource[xsi_type='Report']",node)[0].appendChild(newelement);
	}
	this.csv_node = $("csv",$("asmResource[xsi_type='Report']",node));
	//--------------------
	if ($("pdf",$("asmResource[xsi_type='Report']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("pdf");
		$("asmResource[xsi_type='Report']",node)[0].appendChild(newelement);
	}
	this.pdf_node = $("pdf",$("asmResource[xsi_type='Report']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Report']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Report']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Report']",node));
		}
	}
	//--------------------
	this.startday_node = $("startday",$("asmResource[xsi_type='Report']",node));
	this.time_node = $("time",$("asmResource[xsi_type='Report']",node));
	this.freq_node = $("freq",$("asmResource[xsi_type='Report']",node));
	this.exec_node = $("exec",$("asmResource[xsi_type='Report']",node));
	this.comments_node =  [];
	for (var i=0; i<languages.length;i++){
		this.comments_node[i] = $("comments[lang='"+languages[i]+"']",$("asmResource[xsi_type='Report']",node));
		if (this.comments_node[i].length==0) {
			var newelement = createXmlElement("comments");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Report']",node)[0].appendChild(newelement);
			this.comments_node[i] = $("comments[lang='"+languages[i]+"']",$("asmResource[xsi_type='Report']",node));
		}
	}
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Report"].prototype.getAttributes = function(type,langcode)
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
		result['text'] = this.text_node[langcode].text();

		result['startday'] = this.startday_node.text();
		result['time'] = this.time_node.text();
		result['freq'] = this.freq_node.text();
		result['comments'] = this.comments_node[langcode].text();
}
	return result;
}

/// Display
//==================================
UIFactory["Report"].prototype.getView = function(dest,langcode)
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
UIFactory["Report"].prototype.displayView = function(dest,langcode)
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
	$("#"+dest).html($(this.text_node[langcode]).text());
	//----------------------------------------
	$("#extra_"+uuid).append($("<div class='row'><div id='exec_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div><div id='csv_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='pdf_button_"+uuid+"' class='col-md-1 btn-group'></div></div>"));
	var model_code = UICom.structure["ui"][uuid].resource.getView();
	var root_node = g_portfolio_current;
	if (model_code!='') {
		$.ajax({
			type : "GET",
			url : serverBCK+"/report/"+uuid+".html",
			dataType: 'html',
			success : function(data) {
				var content_report =  $(data).find("#dashboard_"+uuid).html();
				$("#dashboard_"+uuid).html(content_report);
			},
			error : function(jqxhr,textStatus) {
				register_report(uuid);
				var root_node = g_portfolio_current;
				genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);
			}
		});
		$("#exec_button_"+uuid).html($("<div class='exec-button button'>"+karutaStr[LANG]['exec']+"</div>"));
		$("#exec_button_"+uuid).click(function(){$("#dashboard_"+uuid).html('');genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);});
		//---------- display csv or pdf -------
		var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
		if (csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
			$("#csv_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
		}
		var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
		if (pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
			$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div><div class='pdf-button button' onclick=\"javascript:xml2RTF('dashboard_"+uuid+"')\">RTF/Word</div>"));				
		}
		var img_roles = $(UICom.structure["ui"][uuid].resource.img_node).text();
		if (img_roles.containsArrayElt(g_userroles) || (img_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
			$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:html2IMG('dashboard_"+uuid+"')\">IMG</div>"));
		}
	}
	if (g_userroles[0]!='designer')
		$("#sub_node_"+uuid).hide();
};
/// Editor
//==================================
UIFactory["Report"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Report"].updateAttribute = function(uuid,attName,val,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	$($(attName,$(itself.resource.node))).text(val);
	itself.save();
};

//==================================
UIFactory["Report"].prototype.getEditor = function(type,langcode,disabled)
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
		var htmlTextLabelObj = $("<label for='text_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['report-code']+"</label>");
		var htmlTextDivObj = $("<div class='col-sm-9'></div>");
		var htmlTextInputObj = $("<input id='text_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.text_node[langcode].text()+"\">");
		$(htmlTextInputObj).change(function (){
			$(self.text_node[langcode]).text($(this).val());
			UIFactory["Report"].update(self,langcode);
		});
		$(htmlTextDivObj).append($(htmlTextInputObj));
		$(htmlTextGroupObj).append($(htmlTextLabelObj));
		$(htmlTextGroupObj).append($(htmlTextDivObj));
		$(htmlFormObj).append($(htmlTextGroupObj));
		//-----------------------------------------------------
		var startday = ['mon','tue','wed','thu','fri','sat','sun'];
		var htmlstartdayGroupObj = $("<div class='form-group'></div>")
		var htmlstartdayLabelObj = $("<label class='col-sm-3 control-label'>"+karutaStr[LANG]['startday']+"</label>");
		var htmlstartdayDivObj = $("<div class='col-sm-9'></div>");
		var html_input = "";
		var value_input = this.startday_node.text();
		for (var i=0; i<startday.length;i++){
			html_input += "    <input type='radio' name='startday_"+this.id+"' value='"+startday[i]+"' onchange=\"javascript:UIFactory['Report'].updateAttribute('"+this.id+"','startday',this.value)\"";
			if (value_input==startday[i] || value_input=='')
				html_input +=" checked";
			html_input +="> "+startday[i];
		}
		html_input +="<br/>";
		$(htmlstartdayDivObj).append($(html_input));
		$(htmlstartdayGroupObj).append($(htmlstartdayLabelObj));
		$(htmlstartdayGroupObj).append($(htmlstartdayDivObj));
		$(htmlFormObj).append($(htmlstartdayGroupObj));
		//-----------------------------------------------------
		var htmltimeGroupObj = $("<div class='form-group'></div>")
		var htmltimeLabelObj = $("<label for='time_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['time']+"</label>");
		var htmltimeDivObj = $("<div class='col-sm-9'></div>");
		var htmltimeInputObj = $("<input id='time_"+this.id+"' type='text' class='form-control' value=\""+this.time_node.text()+"\">");
		$(htmltimeInputObj).change(function (){
			$(self.time_node).text($(this).val());
			UIFactory["Report"].update(self,langcode);
		});
		$(htmltimeDivObj).append($(htmltimeInputObj));
		$(htmltimeGroupObj).append($(htmltimeLabelObj));
		$(htmltimeGroupObj).append($(htmltimeDivObj));
		$(htmlFormObj).append($(htmltimeGroupObj));
		//-----------------------------------------------------
		var freq = ['day','week','month'];
		var htmlfreqGroupObj = $("<div class='form-group'></div>")
		var htmlfreqLabelObj = $("<label class='col-sm-3 control-label'>"+karutaStr[LANG]['freq']+"</label>");
		var htmlfreqDivObj = $("<div class='col-sm-9'></div>");
		html_input = "";
		value_input = this.freq_node.text();
		for (var i=0; i<freq.length;i++){
			html_input += "    <input type='radio' name='freq_"+this.id+"' value='"+freq[i]+"' onchange=\"javascript:UIFactory['Report'].updateAttribute('"+this.id+"','freq',this.value)\"";
			if (value_input==freq[i] || value_input=='')
				html_input +=" checked";
			html_input +="> "+freq[i];
		}
		html_input +="<br/>";
		$(htmlfreqDivObj).append($(html_input));
		$(htmlfreqGroupObj).append($(htmlfreqLabelObj));
		$(htmlfreqGroupObj).append($(htmlfreqDivObj));
		$(htmlFormObj).append($(htmlfreqGroupObj));
		//-----------------------------------------------------
		/*
		var htmlexecGroupObj = $("<div class='form-group'></div>")
		var htmlexecLabelObj = $("<label for='exec_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['execroles']+"</label>");
		var htmlexecDivObj = $("<div class='col-sm-9'></div>");
		var htmlexecInputObj = $("<input id='exec_"+this.id+"' type='text' class='form-control' value=\""+this.exec_node.text()+"\">");
		$(htmlexecInputObj).change(function (){
			$(self.exec_node).text($(this).val());
			UIFactory["Report"].update(self,langcode);
		});
		$(htmlexecDivObj).append($(htmlexecInputObj));
		$(htmlexecGroupObj).append($(htmlexecLabelObj));
		$(htmlexecGroupObj).append($(htmlexecDivObj));
		$(htmlFormObj).append($(htmlexecGroupObj));
		*/
		//-----------------------------------------------------
		/*
		var htmlcommentsGroupObj = $("<div class='form-group'></div>")
		var htmlcommentsLabelObj = $("<label for='comments_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['comments']+"</label>");
		var htmlcommentsDivObj = $("<div class='col-sm-9'></div>");
		var htmlcommentsInputObj = $("<input id='comments_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.comments_node[langcode].text()+"\">");
		$(htmlcommentsInputObj).change(function (){
			$(self.comments_node[langcode]).text($(this).val());
			UIFactory["Report"].update(self,langcode);
		});
		$(htmlcommentsDivObj).append($(htmlcommentsInputObj));
		$(htmlcommentsGroupObj).append($(htmlcommentsLabelObj));
		$(htmlcommentsGroupObj).append($(htmlcommentsDivObj));
		$(htmlFormObj).append($(htmlcommentsGroupObj));
//		*/
		//-----------------------------------------------------
		var htmlCsvGroupObj = $("<div class='form-group'></div>")
		var htmlCsvLabelObj = $("<label for='csv_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['csv']+"</label>");
		var htmlCsvDivObj = $("<div class='col-sm-9'></div>");
		var htmlCsvInputObj = $("<input id='csv_"+this.id+"' type='text' class='form-control' value=\""+this.csv_node.text()+"\">");
		$(htmlCsvInputObj).change(function (){
			$(self.csv_node).text($(this).val());
			UIFactory["Report"].update(self,langcode);
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
			UIFactory["Report"].update(self,langcode);
		});
		$(htmlpdfDivObj).append($(htmlpdfInputObj));
		$(htmlpdfGroupObj).append($(htmlpdfLabelObj));
		$(htmlpdfGroupObj).append($(htmlpdfDivObj));
		$(htmlFormObj).append($(htmlpdfGroupObj));
	}
	//------------------------
	var js1 = "javascript:register_report('"+this.id+"')";
	var footer = " <button class='btn btn-success' onclick=\""+js1+";\">"+karutaStr[LANG]['register']+"</button>";
	$("#edit-window-footer").append($(footer));
	//------------------------
	return htmlFormObj;

};


//==================================
UIFactory["Report"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Report"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
