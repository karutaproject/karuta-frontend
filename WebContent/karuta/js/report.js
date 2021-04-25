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

var userid = null; // current user
var report_refresh = true;
var csvline = "";

var csvreport = [];
var report_not_in_a_portfolio = false;

var dashboard_infos = {};
var dashboard_current = null;
var dashboard_id = null;
var portfolioid_current = null;

var g_report_actions = {};
var g_report_users = {};
var g_graphs = {};
var g_unique_functions = {};
var current_nodes = null;

var jqueryReportSpecificFunctions = {};
jqueryReportSpecificFunctions['.sortUTC()'] = ".sort(function(a, b){ return $(\"utc\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"utc\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.invsortUTC()'] = ".sort(function(a, b){ return $(\"utc\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"utc\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.sortResource()'] = ".sort(function(a, b){ return $(\"text[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"text[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.sortResourceText(#'] = ".sort(function(a, b){ return $(\"#1[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"#1[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.sortResource(#'] = ".sort(function(a, b){ return $(\"#1[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"#1[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.sortResourceValue()'] = ".sort(function(a, b){ return $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.sortResourceCode()'] = ".sort(function(a, b){ return $(\"code\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"code\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.invsortResourceText()'] = ".sort(function(a, b){ return $(\"text[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"text[lang='#lang#']\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.invsortResourceValue()'] = ".sort(function(a, b){ return $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.invsortResourceCode()'] = ".sort(function(a, b){ return $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(a))).text() > $(\"value\",$(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.sortNodeLabel()'] = ".sort(function(a, b){ return $(\"label[lang='#lang#']\",$(\"asmResource[xsi_type='nodeRes']\",$(a))).text() > $(\"label[lang='#lang#']\",$(\"asmResource[xsi_type='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.sortNodeCode()'] = ".sort(function(a, b){ return $(\"code\",$(\"asmResource[xsi_type='nodeRes']\",$(a))).text() > $(\"code\",$(\"asmResource[xsi_type='nodeRes']\",$(b))).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.invsortNodeLabel()'] = ".sort(function(a, b){ return $(\"label[lang='#lang#']\",$(\"asmResource[xsi_type='nodeRes']\",$(a))).text() > $(\"label[lang='#lang#']\",$(\"asmResource[xsi_type='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.invsortNodeCode()'] = ".sort(function(a, b){ return $(\"code\",$(\"asmResource[xsi_type='nodeRes']\",$(a))).text() > $(\"code\",$(\"asmResource[xsi_type='nodeRes']\",$(b))).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.sort()'] = ".sort(function(a, b){ return $(a).text() < $(b).text() ? 1 : -1; })";
jqueryReportSpecificFunctions['.invsort()'] = ".sort(function(a, b){ return $(a).text() < $(b).text() ? -1 : 1; })";
jqueryReportSpecificFunctions['.filename_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > filename[lang='#lang#']:not(:empty)\")";
jqueryReportSpecificFunctions['.filename_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > filename[lang='#lang#']:empty\")";
jqueryReportSpecificFunctions['.url_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > url[lang='#lang#']:not(:empty)\")";
jqueryReportSpecificFunctions['.url_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > url[lang='#lang#']:empty\")";
jqueryReportSpecificFunctions['.text_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > text[lang='#lang#']:not(:empty)\")";
jqueryReportSpecificFunctions['.text_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > text[lang='#lang#']:empty\")";
jqueryReportSpecificFunctions['.submitted()'] = ".has(\"metadata-wad[submitted='Y']\")";
jqueryReportSpecificFunctions['.code_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > code:empty\")";
jqueryReportSpecificFunctions['.code_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > code:not(:empty)\")";
jqueryReportSpecificFunctions['.filename_or_url_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > filename[lang='#lang#']:not(:empty),asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > url[lang='#lang#']:not(:empty)\")";
jqueryReportSpecificFunctions['.filename_or_text_or_url_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > filename[lang='#lang#']:not(:empty),asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > text[lang='#lang#']:not(:empty),asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > url[lang='#lang#']:empty\")";
jqueryReportSpecificFunctions['.filename_or_text_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > filename[lang='#lang#']:not(:empty),asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > text[lang='#lang#']:not(:empty)\")";
jqueryReportSpecificFunctions['.url_or_text_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes'] > url[lang='#lang#']:not(:empty),asmResource[xsi_type!='context'][xsi_type!='nodeRes']  > text[lang='#lang#']:not(:empty)\")";
//---------------
jqueryReportSpecificFunctions['.uniqueNodeLabel()'] = "";
jqueryReportSpecificFunctions['.uniqueNodeCode()'] = "";
jqueryReportSpecificFunctions['.uniqueResourceCode()'] = "";
jqueryReportSpecificFunctions['.uniqueResourceValue()'] = "";
jqueryReportSpecificFunctions['.uniqueResourceText()'] = "";
//---------------
jqueryReportSpecificFunctions['.resourceTextContains('] = "asmResource[xsi_type!='context'][xsi_type!='nodeRes']>text[lang='#lang#']:contains(";
jqueryReportSpecificFunctions['.resourceCodeContains('] = "asmResource[xsi_type!='context'][xsi_type!='nodeRes']>code:contains(";
jqueryReportSpecificFunctions['.resourceValueContains('] = "asmResource[xsi_type!='context'][xsi_type!='nodeRes']>value:contains(";
jqueryReportSpecificFunctions['.nodeLabelContains('] = "asmResource[xsi_type='nodeRes']>label[lang='#lang#']:contains(";
jqueryReportSpecificFunctions['.nodeCodeContains('] = "asmResource[xsi_type='nodeRes']>code:contains(";
jqueryReportSpecificFunctions['.resourceFilenameContains('] = "asmResource[xsi_type!='context'][xsi_type!='nodeRes']>filename[lang='#lang#']:contains(";
//---------------

Selector = function(jquery,type,filter1,filter2,unique)
{
	this.jquery = jquery;
	this.type = type;
	this.filter1 = filter1;
	this.filter2 = filter2;
	this.unique = unique
};

//==================================
function r_replaceVariable(text)
//==================================
{
	var n=0;
	var text_original = text;
	while (text!=undefined && text.indexOf("{##")>-1 && n<100) {
		var test_string = text.substring(text.indexOf("{##")+3); // test_string = abcd{##variable##}efgh.....
		var variable_name = test_string.substring(0,test_string.indexOf("##}"));
		if (g_variables[variable_name]!=undefined)
			text = text.replace("{##"+variable_name+"##}", g_variables[variable_name]);
		n++; // to avoid infinite loop
	}
	while (text!=undefined && text.indexOf("##")>-1 && n<100) {
		var test_string = text.substring(text.indexOf("##")+2); // test_string = abcd##variable##efgh.....
		var variable_name = test_string.substring(0,test_string.indexOf("##"));
		if (g_variables[variable_name]!=undefined)
			text = text.replace("##"+variable_name+"##", g_variables[variable_name]);
		if (text.indexOf("[")>-1) {
			var variable_value = variable_name.substring(0,variable_name.indexOf("["))
			var i = text.substring(text.indexOf("[")+1,text.indexOf("]"));
			i = r_replaceVariable(i);
			var variable_array1 = text.replace("["+i+"]","");
			if (g_variables[variable_value]!=undefined && g_variables[variable_value].length>=i)
				text = g_variables[variable_value][i];
			}
		n++; // to avoid infinite loop
	}
	return text;
}

//==================================
function r_getTest(test)
//==================================
{
	for (fct in jqueryReportSpecificFunctions) {
		if (test.indexOf(fct)>-1) {
			test = ".has(\"" + test.replace(fct,jqueryReportSpecificFunctions[fct]) + "\")";
			if (test.indexOf("#lang#")>-1)
				test = test.replace(/#lang#/g,languages[LANGCODE]);
		}
	}
	return test;
}

//==================================
function r_getSelector(select,test)
//==================================
{
	if (test==null)
	 test = "";
	//-------------------------
	var unique = null;
	if (test.indexOf(".uniqueNodeLabel")>-1)
		unique = "uniqueNodeLabel";
	if (test.indexOf(".uniqueNodeCode")>-1)
		unique = "uniqueNodeCode";
	if (test.indexOf(".uniqueResourceCode")>-1)
		unique = "uniqueResourceCode";
	if (test.indexOf(".uniqueResourceValue")>-1)
		unique = "uniqueResourceValue";
	if (test.indexOf(".uniqueResourceText")>-1)
		unique = "uniqueResourceText";
	//-------------------------
	var selects = select.split("."); // nodetype.semtag.[node|resource] or .[node|resource]
	if (selects[0]=="")
		selects[0] = "*";
	var jquery = ""; //selects[0];
	var filter1 = null;
	var filter2 = null;
	if (selects[1]!="") {
		jquery +="*:has(>metadata[semantictag*='"+selects[1]+"'])";
		filter1 = function(){return $(this).children("metadata[semantictag*='"+selects[1]+"']").length>0};
	}	else {
		jquery +=":has(>metadata)";
		filter1 = function(){return $(this).children("metadata").length>0};
	}
	var filter2 = test; // test = .has("metadata-wad[submitted='Y']").last()
	for (fct in jqueryReportSpecificFunctions) {
		if (test.indexOf(fct)>-1) {
			filter2 = filter2.replace(fct,jqueryReportSpecificFunctions[fct]);
			if (filter2.indexOf("#lang#")>-1)
				filter2 = filter2.replace(/#lang#/g,languages[LANGCODE]);
			if (test.indexOf("sortResource(#")>-1){
				var1 = test.substring(test.indexOf("(#")+1,test.lastIndexOf(")"));
				filter2 = filter2.replace(/#1/g,var1);
			}
		}
	}
	var type = "";
	if (selects.length>2)
		type = selects[2];
	var selector = new Selector(jquery,type,filter1,filter2,unique);
	return selector;
}

//====================================================================
//====================================================================

//==================================
g_unique_functions['uniqueNodeCode'] = function (index,node)
//==================================
{
	if (index>0) {
		var current = $("code",$("asmResource[xsi_type='nodeRes']",$(g_current_nodes[index]))).text();
		var previous = $("code",$("asmResource[xsi_type='nodeRes']",$(g_current_nodes[index-1]))).text();
		return current!=previous;
	} else 
		return true;
}

//==================================
g_unique_functions['uniqueNodeLabel'] = function (index,node)
//==================================
{
	if (index>0) {
		var current = $("label[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type='nodeRes']",$(g_current_nodes[index]))).text();
		var previous = $("label[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type='nodeRes']",$(g_current_nodes[index-1]))).text();
		return current!=previous;
	} else 
		return true;
}

//==================================
g_unique_functions['uniqueResourceValue'] = function (index,node)
//==================================
{
	if (index>0) {
		var current = $("value",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index]))).text();
		var previous = $("value",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index-1]))).text();
		return current!=previous;
	} else 
		return true;
}

//==================================
g_unique_functions['uniqueResourceCode'] = function (index,node)
//==================================
{
	if (index>0) {
		var current = $("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index]))).text();
		var previous = $("code",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index-1]))).text();
		return current!=previous;
	} else 
		return true;
}

//==================================
g_unique_functions['uniqueResourceText'] = function (index,node)
//==================================
{
	if (index>0) {
		var current = $("text[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index]))).text();
		var previous = $("text[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type!='context'][xsi_type!='nodeRes']",$(g_current_nodes[index-1]))).text();
		return current!=previous;
	} else 
		return true;
}

//====================================================================
//====================================================================
//====================================================================

//==================================
function r_processPortfolio(no,xmlReport,destid,data,line)
//==================================
{
	$.ajaxSetup({async: false});
	if (no==0){
		dashboard_current = destid;
		dashboard_infos[destid] = {'xmlReport':xmlReport,'data':data};
	}
	var children = $(":root",xmlReport).children();
	processReportActions(destid,children,data);
	$.ajaxSetup({async: true});
}

//==================================
function r_report_process(xmlDoc,json)
//==================================
{
	$.ajaxSetup({async: false});
	var children = $(":root",xmlDoc).children();
	processReportActions("report-content",children);
	$.ajaxSetup({async: true});
}

//=================================================
function processReportActions(destid,actions,data)
//=================================================
{
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid,actions[i],i.toString(),data);
	};
};

//===============================================================
//===============================================================
//===============================================================
//===============================================================

//==================================
function refresh_report(dashboard_current)
//==================================
{
	$("#"+dashboard_current).html("");
	r_processPortfolio(0,dashboard_infos[dashboard_current].xmlReport,dashboard_current,dashboard_infos[dashboard_current].data,0);
	$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
}

//==================================
function report_processCode()
//==================================
{
	var model_code = $("#report-model_code").val();
	report_getModelAndProcess(model_code);
}

//==================================
function report_getModelAndPortfolio(model_code,node,destid,g_dashboard_models)
//==================================
{
	var xml_model = "";
	var xml_model = "";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/"+model_code,
		success : function(data) {
			setVariables(data);
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to report model
			var urlS = serverBCK_API+"/nodes/"+nodeid+"?xsl-file="+appliname+"/karuta/xsl/karuta2report.xsl&lang="+LANG;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : urlS,
				success : function(data) {
					g_dashboard_models[model_code] = data;
					try {
						r_processPortfolio(0,data,destid,node,0);
					}
					catch(err) {
						alertHTML("Error in Dashboard : " + err.message);
					}
					$("#wait-window").hide();
					$("#wait-window").modal('hide');
				}
			 });
		}
	});
}

//==================================
function report_getModelAndProcess(model_code,json)
//==================================
/// csv +report
{
	$('#wait-window').show();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+model_code,
		success : function(data) {
			var items = $("portfolio",data);
			var uuid = $(items[0]).attr('id');
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios/portfolio/"+uuid,
				success : function(data) {
					var nodeid = $("asmRoot",data).attr("id");
					// ---- transform karuta portfolio to report model
					var urlS = serverBCK_API+"/nodes/"+nodeid+"?xsl-file="+appliname+"/karuta/xsl/karuta2report.xsl&lang="+LANG;
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : urlS,
						success : function(data) {
							r_report_process(data,json);
							$("#wait-window").hide();
							$("#wait-window").modal('hide');
						}
					 });
				}
			});
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});

}

//===============================================================
//===============================================================
//===============================================================
//===============================================================

//==================================
function xml2PDF(content)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var data = $('#'+content).html();
	data = data.replace(/&nbsp;/g, ' ');
	data = data.replace(/<hr>/g, '<hr/>');
	data = data.replace(/<br>/g, '<br/>');
	data = data.replace(/<hr>/g, '<hr/>');
	data = data.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"&amp;#160;\">]><div>" + data + "</div>";
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var urlS =  "../../../"+serverBCK+"/xsl?xsl="+appliname+"/karuta/xsl/html2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/pdf";
	postAndDownload(urlS,data);
}

//==================================
function displayPDFButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>3</span></h4><button onclick=\"javascript:xml2PDF('report-pdf')\">PDF</button>";
	$("#report-pdf").html(html);
}

//==================================
function xml2RTF(content)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var data = $('#'+content).html();
	data = data.replace(/&nbsp;/g, ' ');
	data = data.replace(/<hr>/g, '<hr/>');
	data = data.replace(/<br>/g, '<br/>');
	data = data.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"&amp;#160;\">]><div>" + data + "</div>";
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var urlS =  "../../../"+serverBCK+"/xsl?xsl="+appliname+"/karuta/xsl/html2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverBCK+";url-appli:"+serverURL+"/"+appliname+"&format=application/rtf";
	postAndDownload(urlS,data);
}

//==================================
function displayRTFButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>3</span></h4><button onclick=\"javascript:xml2RTF('report-pdf')\">RTF/Word</button>";
	$("#report-pdf").html(html);
}


//==================================
function xml2CSV(content)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var data = $('#'+content).html();
	data = data.replace(/<hr>/g, '<hr/>');
	data = data.replace(/<br>/g, '<br/>');
	data = data.replace(/<br\/>/g, '\n');
	data = data.replace(/(<img[^>]*?[^\/]\s*)(>)/g, "$1/$2");
	data = data.replace(/"(?![^<]*>)/g, '""');
	data = data.replace(/(<span[^>]*>)(?!<\/span)([\s\S]*?)(<\/span>)/g, "$1\"$2\"$3");
	data = data.replace('&nbsp;', ' ');
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"\">]><div>" + data + "</div>";
	var url =  "../../../"+serverBCK+"/xsl?xsl="+appliname+"/karuta/xsl/html2csv.xsl&parameters=lang:"+LANG+"&format=application/csv";
	postAndDownload(url,data);
}

//==================================
function displayCSVButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>4</span></h4><button onclick=\"javascript:xml2CSV('report-content')\">CSV</button>";
	$("#report-csv").html(html);
}

//==================================
function html2IMG(contentid)
//==================================
{
	var js1 = "javascript:$('#image-window').modal('hide')";
	var buttons = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#image-window-header").html($(buttons));
	$("#image-window-footer").html($(buttons));
	$("#image-window-body").html("");
	$("#image-window").modal('show');
	var svgnode = $("svg",document.getElementById(contentid));
	if(svgnode.length>0) {
		var img = SVGToPNG(svgnode);
		$("#image-window-body").append(img);
	} else {
		var htmlnode = document.getElementById(contentid);
		var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>";
		svg += "<foreignObject width='100%' height='100%'>";
		svg += xml2string(htmlnode);
		svg += "</foreignObject>";
		svg += "</svg>";
		var htmlcanvas = "<canvas id='canvas' width='400' height='400'></canvas>"
		html2canvas(htmlnode).then(function(canvas) {
			var src_img = canvas.toDataURL();
			var img = document.createElement('img');
			img.src = src_img;
			document.getElementById("image-window-body").appendChild(img);
	});

	}
}

//===============================================================
//===============================================================
//===============================================================
//===============================================================

//==================================
function register_report(uuid)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var node_resource = UICom.structure["ui"][uuid].resource;
	var startday = node_resource.startday_node.text();
	var time = node_resource.time_node.text();
	var freq = node_resource.freq_node.text();
	var comments = node_resource.comments_node[LANGCODE].text();
	var data={code:uuid,portfolioid:g_portfolioid,startday:startday,time:time,freq:freq,comments:comments};
	var url = serverBCK+"/report";
	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType: "text",
		success : function(data) {
			alertHTML("OK - rapport inscrit");
		},
		error : function(jqxhr, textStatus, err) {
			alertHTML("Erreur - rapport non inscrit:"+textStatus+"/"+jqxhr.status+"/"+jqxhr.statusText);
		}
	});
}

//==================================
function genDashboardContent(destid,uuid,parent,root_node)
//==================================
{
	dashboard_id = uuid;
	var spinning = true;
	var dashboard_code = r_replaceVariable(UICom.structure["ui"][uuid].resource.getView());
	var folder_code = dashboard_code.substring(0,dashboard_code.indexOf('.'));
	var part_code = dashboard_code.substring(dashboard_code.indexOf('.'));
	var model_code = "";
	if (part_code.indexOf('/')>-1){
		var parameters = part_code.substring(part_code.indexOf('/')+1).split('/');
		for (var i=0; i<parameters.length;i++){
			g_variables[parameters[i].substring(0,parameters[i].indexOf(":"))] = parameters[i].substring(parameters[i].indexOf(":")+1);
		}
		model_code = folder_code + part_code.substring(0,part_code.indexOf("/"));
	} else {
		model_code = folder_code + part_code;
	}
	if (model_code.indexOf("@local")>-1){
		root_node = parent.node;
		model_code = model_code.substring(0,model_code.indexOf("@local"))+model_code.substring(model_code.indexOf("@local")+6);
	}
	if (model_code.indexOf("@norefresh")>-1){
		report_refresh = false;
		model_code = removeStr(model_code,"@norefresh");
	}
	if (model_code.indexOf("@nospinning")>-1){
		spinning = false;
		model_code = model_code.substring(0,model_code.indexOf("@nospinning"))+model_code.substring(model_code.indexOf("@nospinning")+11);
	}
	var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	if (model_code.indexOf('.')<0 && model_code!='self' && model_code!='')  // There is no project, we add the project of the current portfolio
		model_code = selfcode.substring(0,selfcode.indexOf('.')) + "." + model_code;
	try {
		if (g_dashboard_models[model_code]!=null && g_dashboard_models[model_code]!=undefined)
			r_processPortfolio(0,g_dashboard_models[model_code],destid,root_node,0,spinning);
		else
			report_getModelAndPortfolio(model_code,root_node,destid,g_dashboard_models,spinning);
	}
	catch(err) {
		alertHTML("Error in Dashboard : " + err.message);
	}
	if (spinning)
		$("#wait-window").show(1000,function(){sleep(1000);$("#wait-window").hide(1000)});
};

//#######################################################################################################################################
//#######################################################################################################################################
//############################################### G_REPORT_ACTIONS ######################################################################
//#######################################################################################################################################
//#######################################################################################################################################


//=============================================================================
//=============================================================================
//======================= IF-THEN-ELSE ========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['if-then-else'] = function (destid,action,no,data)
//==================================
{
	var test = $(action).attr("test");
	if (test!=undefined) 
		test = r_replaceVariable(test);
	var then_actions = $($('then-part',action)[0]).children();
	var else_actions = $($('else-part',action)[0]).children();
	if (eval(test)){
		for (var i=0; i<then_actions.length;i++){
			var tagname = $(then_actions[i])[0].tagName;
			g_report_actions[tagname](destid,then_actions[i],no+'-'+i.toString(),data);
		};
	}
	else {
		for (var i=0; i<else_actions.length;i++){
			var tagname = $(else_actions[i])[0].tagName;
			g_report_actions[tagname](destid,else_actions[i],no+'-'+i.toString(),data);
		};
	}
}

//=============================================================================
//=============================================================================
//======================= FOR-EACH-LINE =======================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['for-each-line'] = function (destid,action,no,data)
//==================================
{
	var countvar = $(action).attr("countvar");
	var ref_init = $(action).attr("ref-init");
	//---------------------
	var actions = $(action).children();
	$("#line-number").html('0');
	$("#number_lines").html(json.lines.length);
	for (var j=0; j<json.lines.length; j++){
		if (countvar!=undefined) {
			g_variables[countvar] = j;
		}
		if (ref_init!=undefined) {
			$("#line-number").html(j+1);
			ref_init = r_replaceVariable(ref_init);
			var ref_inits = ref_init.split("/"); // ref1/ref2/...
			for (var k=0;k<ref_inits.length;k++)
				g_variables[ref_inits[k]] = new Array();
		}
		for (var i=0; i<actions.length;i++){
			var tagname = $(actions[i])[0].tagName;
			g_report_actions[tagname](destid,actions[j],no+'-'+j.toString()+'-'+i.toString(),data);
		}
	}
}

//=============================================================================
//=============================================================================
//======================= FOR-EACH-NODE =======================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['for-each-node'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	var test = $(action).attr("test");
	var countvar = $(action).attr("countvar");
	if (test!=undefined) 
		test = r_replaceVariable(test);
	if (select!=undefined) {
		select = r_replaceVariable(select);
		var selector = null;
		if (test.indexOf('notFound')<0)
			selector = r_getSelector(select,test);
		else 
			selector = r_getSelector(select,"");		
		var nodes = $(selector.jquery,data).filter(selector.filter1);
		selector.filter2 = r_replaceVariable(selector.filter2);
		nodes = eval("$(nodes)"+selector.filter2);
		if (nodes.length==0) { // try the node itself
			var nodes = $(selector.jquery,data).addBack().filter(selector.filter1);
			nodes = eval("nodes"+selector.filter2);
		}
		if (selector.unique!=null) {
			g_current_nodes = nodes;
			nodes = nodes.filter(g_unique_functions[selector.unique]);
		}
		//---------------------------
		var actions = $(action).children();
		if (test.indexOf('notFound')<0) {
			for (var j=0; j<nodes.length;j++){
				//----------------------------------
				if (countvar!=undefined) {
					g_variables[countvar] = j;
				}
				//----------------------------------
				var ref_init = $(action).attr("ref-init");
				if (ref_init!=undefined) {
					ref_init = r_replaceVariable(ref_init);
					var ref_inits = ref_init.split("/"); // ref1/ref2/...
					for (var k=0;k<ref_inits.length;k++)
						g_variables[ref_inits[k]] = new Array();
				}
				//----------------------------------
				for (var i=0; i<actions.length;i++){
					var tagname = $(actions[i])[0].tagName;
					g_report_actions[tagname](destid,actions[i],no+'-'+j.toString()+'-'+i.toString(),nodes[j]);
				}
				//----------------------------------
			};
		}
		else if (nodes.length==0){
			for (var i=0; i<actions.length;i++){
				var tagname = $(actions[i])[0].tagName;
				g_report_actions[tagname](destid,actions[i],no,data);
			}
		}
	}
}

//=============================================================================
//=============================================================================
//================================= LOOP ======================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['loop'] = function (destid,action,no,data)
//==================================
{
	var first = parseInt($(action).attr("first"));
	if (!$.isNumeric(first)) {
		first = $(action).attr("first");
		first = r_replaceVariable(first);
		first = eval(first);
	}
	var last = parseInt($(action).attr("last"));
	if (!$.isNumeric(last)) {
		last = $(action).attr("last");
		last = r_replaceVariable(last);
		last = eval(last);
	}
	for (var j=first; j<last+1;j++){
		//---------------------------
		var variable = $(action).attr("variable");
		if (variable!=undefined) {
				g_variables[variable] = j;
		}
		//---------------------------
		var ref_init = $(action).attr("ref-init");
		if (ref_init!=undefined) {
			ref_init = r_replaceVariable(ref_init);
			var ref_inits = ref_init.split("/"); // ref1/ref2/...
			for (var k=0;k<ref_inits.length;k++)
				g_variables[ref_inits[k]] = new Array();
		}
		//---------------------------
		var actions = $(action).children();
		for (var i=0; i<actions.length;i++){
			var tagname = $(actions[i])[0].tagName;
			g_report_actions[tagname](destid,actions[i],no+'-'+j.toString()+'-'+i.toString(),data);
		}
	};
}

//=============================================================================
//=============================================================================
//================================= GOPARENT ==================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['goparent'] = function (destid,action,no,data)
//==================================
{
	var parent = $(data).parent();
	//---------------------------
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid,actions[i],no+'-'+i.toString(),parent);
	}

}

//=============================================================================
//=============================================================================
//============================ SHARING ========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['show-sharing'] = function (destid,action,no,data)
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid_current,
		success : function(data) {
			UIFactory["Portfolio"].displayUnSharing(destid,data,true);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in show-sharing : "+jqxhr.responseText);
		}
	});
}

//==================================
g_report_actions['display-sharing'] = function (destid,action,no,data)
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid_current,
		success : function(data) {
			UIFactory["Portfolio"].displaySharedUsers(destid,data);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in display-sharing : "+jqxhr.responseText);
		}
	});
}

//=============================================================================
//=============================================================================
//======================= TABLE - ROW - CELL ==================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['table'] = function (destid,action,no,data)
//==================================
{
	//---------------------------
	var ref_init = $(action).attr("ref-init");
	if (ref_init!=undefined) {
		ref_init = r_replaceVariable(ref_init);
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var k=0;k<ref_inits.length;k++)
			g_variables[ref_inits[k]] = new Array();
	}
	//---------------------------
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var html = "<table id='"+destid+'-'+no+"' style='"+style+"' class='"+cssclass+"'></table>";
	$("#"+destid).append($(html));
	//---------------------------
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid+'-'+no,actions[i],i.toString(),data);
	};
	//-----------SORT----------------
	if (cssclass!=undefined && cssclass.indexOf('sort-table')>-1)
		sortTable(destid+'-'+no);
}

//==================================
g_report_actions['row'] = function (destid,action,no,data)
//==================================
{
	//---------------------------
	var ref_init = $(action).attr("ref-init");
	if (ref_init!=undefined) {
		ref_init = r_replaceVariable(ref_init);
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var k=0;k<ref_inits.length;k++)
			g_variables[ref_inits[k]] = new Array();
	}
	//---------------------------
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var html = "<tr id='"+destid+'-'+no+"' style='"+style+"' class='"+cssclass+"'></table>";
	$("#"+destid).append($(html));
	//---------------------------
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid+'-'+no,actions[i],i.toString(),data);
	};
}

//==================================
g_report_actions['cell'] = function (destid,action,no,data)
//==================================
{
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var attr_help = $(action).attr("help");
	var colspan = $(action).attr("colspan");

	var html = "<td id='"+destid+'-'+no+"' style='"+style+"' class='"+cssclass+"'";
	if (colspan!=null && colspan!='0')
		html += "colspan='"+colspan+"' "
	html += "><span id='help_"+destid+'-'+no+"' class='ihelp'></span>";
	if (cssclass!=undefined && cssclass.indexOf('sort-th')>-1)
		html+= "<i class='fas fa-sort' aria-hidden='true'></i> ";
	html += "</td>";
	$("#"+destid).append($(html));
	if (attr_help!=undefined && attr_help!="") {
		var help_text = "";
		var helps = attr_help.split("//"); // lang1/lang2/...
		if (attr_help.indexOf("@")>-1) { // lang@fr/lang@en/...
			for (var j=0; j<helps.length; j++){
				if (helps[j].indexOf("@"+languages[LANGCODE])>-1)
					help_text = helps[j].substring(0,helps[j].indexOf("@"));
			}
		} else { // lang1/lang2/...
			help_text = helps[LANGCODE];  // lang1/lang2/...
		}
		var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='fas fa-question-circle'></span></a> ";
		$("#help_"+destid+'-'+no).html(help);
		$(".popinfo").popover({ 
			placement : 'bottom',
			container : 'body',
			title:karutaStr[LANG]['help-label'],
			html : true,
			trigger:'click hover',
			content: help_text
		});
	}
	//---------------------------
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid+'-'+no,actions[i],i.toString(),data);
	};
}

//=============================================================================
//=============================================================================
//======================= FOR-EACH-PERSON =====================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['for-each-person'] = function (destid,action,no,data)
//==================================
{
	var countvar = $(action).attr("countvar");
	var select = $(action).attr("select");
	if (select=="#logged_user") {
		userid = USER.id;
		var actions = $(action).children();
		for (var i=0; i<actions.length;i++){
			var tagname = $(actions[i])[0].tagName;
			g_report_actions[tagname](destid,actions[i],no+'-'+i.toString(),userid);
		};
	} else {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
				select = r_replaceVariable(select);
				var attribute = "";
				var value = "";
				var comparator = "";
				if (select.indexOf("=")>-1){
					attribute = select.substring(0,select.indexOf("="));
					value = select.substring(select.indexOf("=")+1);
					comparator = "=";
				}
				if (select.indexOf("*=")>-1) {
					attribute = select.substring(0,select.indexOf("*="));
					value = select.substring(select.indexOf("*=")+2);
					comparator = "*=";
				}
				var condition = false;
				for ( var j = 0; j < UsersActive_list.length; j++) {
					if (countvar!=undefined) {
						g_variables[countvar] = j;
					}
					//------------------------------------
					var ref_init = $(action).attr("ref-init");
					if (ref_init!=undefined) {
						ref_init = r_replaceVariable(ref_init);
						var ref_inits = ref_init.split("/"); // ref1/ref2/...
						for (var i=0;i<ref_inits.length;i++)
							g_variables[ref_inits[i]] = new Array();
					}
					//------------------------------------
					if (comparator=="=")
						condition = $(UsersActive_list[j].attributes[attribute]).text() == value;
					if (comparator=="*=")
						condition = $(UsersActive_list[j].attributes[attribute]).text().indexOf(value)>-1;
					//------------------------------------
					if (condition){
						userid = UsersActive_list[j].id;
						var actions = $(action).children();
						for (var i=0; i<actions.length;i++){
							var tagname = $(actions[i])[0].tagName;
							g_report_actions[tagname](destid,actions[i],no+j.toString()+'-'+i.toString(),userid);
						};
					}
						//------------------------------------
				}
			}
		});
	}
}

//=============================================================================
//============================= USER ==========================================
//======================  username firstname lastname =========================
//=============================firstname-lastname==============================
//=============================================================================

//==================================
g_report_actions['login'] = function (destid,action,no,data,is_out_csv)
//==================================
{
	var text ="";
	if (userid!=null)
		text = Users_byid[userid].username;
	else
		text = USER.username;
	//----------------
	if (is_out_csv!=null && is_out_csv) {
		if (typeof csvseparator == 'undefined') // for backward compatibility
			csvseparator = ";";
		csvline += text + csvseparator;		
	} else {
		text = "<span id='"+destid+'-'+no+"'>"+text+"</span>";
		$("#"+destid).append($(text));		
	}
}

//==================================
g_report_actions['firstname'] = function (destid,action,no,data,is_out_csv)
//==================================
{
	var text ="";
	if (userid!=null)
		text = Users_byid[userid].firstname;
	else
		text = USER.firstname;
	//----------------
	if (is_out_csv!=null && is_out_csv) {
		if (typeof csvseparator == 'undefined') // for backward compatibility
			csvseparator = ";";
		csvline += text + csvseparator;		
	} else {
		text = "<span id='"+destid+'-'+no+"'>"+text+"</span>";
		$("#"+destid).append($(text));		
	}
}

//==================================
g_report_actions['lastname'] = function (destid,action,no,data,is_out_csv)
//==================================
{
	var text ="";
	if (userid!=null)
		text = Users_byid[userid].lastname;
	else
		text = USER.lastname;
	//----------------
	if (is_out_csv!=null && is_out_csv) {
		if (typeof csvseparator == 'undefined') // for backward compatibility
			csvseparator = ";";
		csvline += text + csvseparator;		
	} else {
		text = "<span id='"+destid+'-'+no+"'>"+text+"</span>";
		$("#"+destid).append($(text));		
	}
}

//==================================
g_report_actions['firstname-lastname'] = function (destid,action,no,data,is_out_csv)
//==================================
{
	var text1 ="";
	if (userid!=null)
		text1 = Users_byid[userid].firstname;
	else
		text1 = USER.firstname;
	//----------------
	var text2 ="";
	if (userid!=null)
		text2 = Users_byid[userid].lastname;
	else
		text2 = USER.lastname;
	//----------------
	if (is_out_csv!=null && is_out_csv) {
		if (typeof csvseparator == 'undefined') // for backward compatibility
			csvseparator = ";";
		csvline += text1 +"-" + text2 + csvseparator;		
	} else {
		var text = "<span id='"+destid+'-'+no+"'>"+text1 + "&nbsp" +text2 + "</span>";
		$("#"+destid).append($(text));		
	}
}

//=============================================================================
//=============================================================================
//======================FOR-EACH-PORTFOLIO ====================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['for-each-portfolio'] = function (destid,action,no,data)
//==================================
{
	var countvar = $(action).attr("countvar");
	if (userid==null)
		userid = USER.id;
	var searchvalue = "";
	var select = $(action).attr("select");
	select = r_replaceVariable(select);
	if (select.indexOf("code*=")>-1) {
		if (select.indexOf("'")>-1)
			searchvalue = select.substring(7,select.length-1);  // inside quote
		else if (select.indexOf("//")>-1)
			searchvalue = eval("json."+select.substring(8));
		else
			searchvalue = eval("json.lines["+line+"]."+select.substring(6));
	}
	var items_list = [];
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&search="+searchvalue,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			var items = $("portfolio",data);
			var value = "";
			var condition = "";
			var portfolioid = "";
			//----------------------------------
			var sortag = $(action).attr("sortag");
			var sortelt = $(action).attr("sortelt");
			var tableau = new Array();
			var sortvalue = "";
			if (sortag!=undefined && sortag!="") {
				for ( var j = 0; j < items.length; j++) {
					portfolioid = $(items[i]).attr('id');
					var code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
					//------------------------------------
					if (select.indexOf("code*=")>-1) {
						if (select.indexOf("'")>-1)
							value = select.substring(7,select.length-1);  // inside quote
						else if (select.indexOf("//")>-1)
							value = eval("json."+select.substring(8));
						else
							value = eval("json.lines["+line+"]."+select.substring(6));
						condition = code.indexOf(value)>-1;
					}
					if (select.indexOf("code=")>-1) {
						if (select.indexOf("'")>-1)
							value = select.substring(6,select.length-1);  // inside quote
						else if (select.indexOf("//")>-1)
							value = eval("json."+select.substring(7));
						else
							value = eval("json.lines["+line+"]."+select.substring(5));
						condition = code==value;
					}
					if (select.length==0) {
						condition = true;;
					}
					//------------------------------------
					if (condition && sortag!=""){
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+sortag,
							success : function(data) {
								var text = ";"
								if (sortelt=='resource code') {
									sortvalue = $("code",data)[0].text();
								}
								if (sortelt=='value') {
									sortvalue = $("value",data)[0].text();
								}
								if (sortelt=='node label') {
									sortvalue = $("label[lang='"+languages[LANGCODE]+"']",data)[0].text();
								}
								if (sortelt=='resource') {
									sortvalue = $("text[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",data)).text();
								}
								tableau[tableau.length] = [sortvalue,portfolioid];
							}
						});
					}
					//------------------------------------
				}
				var newTableau = tableau.sort(sortOn1);
				for ( var i = 0; i < newTableau.length; i++) {
					items_list[i] = portfolios_byid[newTableau[i][1]]
				}
				items_list.length = newTableau.length;
			} else {
				for ( var i = 0; i < items.length; i++) {
					items_list[i] = portfolios_byid[$(items[i]).attr('id')]
				}
			}
			//----------------------------------
			for ( var j = 0; j < items_list.length; j++) {
				if (countvar!=undefined) {
					g_variables[countvar] = j;
				}
				var ref_init = $(action).attr("ref-init");
				if (ref_init!=undefined) {
					ref_init = r_replaceVariable(ref_init);
					var ref_inits = ref_init.split("/"); // ref1/ref2/...
					for (var i=0;i<ref_inits.length;i++)
						g_variables[ref_inits[i]] = new Array();
				}
				var code = items_list[j].code_node.text();
				//------------------------------------
				if (select.indexOf("code*=")>-1) {
					if (select.indexOf("'")>-1)
						value = select.substring(7,select.length-1);  // inside quote
					else if (select.indexOf("//")>-1)
						value = eval("json."+select.substring(8));
					else
						value = eval("json.lines["+line+"]."+select.substring(6));
					condition = code.indexOf(value)>-1;
				}
				if (select.indexOf("code=")>-1) {
					if (select.indexOf("'")>-1)
						value = select.substring(6,select.length-1);  // inside quote
					else if (select.indexOf("//")>-1)
						value = eval("json."+select.substring(7));
					else
						value = eval("json.lines["+line+"]."+select.substring(5));
					condition = code==value;
				}
				if (select.length==0) {
					condition = true;;
				}
				if (select.substring(0,1) == "{") {
					var toeval = select.substring(1,select.length-1);
					condition = eval(toeval);
				}
				//------------------------------------
				if (condition){
					portfolioid = items_list[j].id;
					portfolioid_current = portfolioid;
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						j : j,
						url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
						success : function(data) {
							if (report_not_in_a_portfolio){
								UICom.structure["tree"] = {};
								UICom.structure["ui"] = {};
							}
							UICom.parseStructure(data,true, null, null,true);
							var actions = $(action).children();
							for (var i=0; i<actions.length;i++){
								var tagname = $(actions[i])[0].tagName;
								g_report_actions[tagname](destid,actions[i],no+'-'+j.toString()+i.toString(),data);
							};
						}
					});
				}
					//------------------------------------
			}		}
	});
}

//==================================
g_report_actions['for-each-portfolio-js'] = function (destid,action,no,data)
//==================================
{
	var countvar = $(action).attr("countvar");
	if (userid==null)
		userid = USER.id;
	var searchvalue = "";
	var select = $(action).attr("select");
	select = r_replaceVariable(select);

	var portfolioids = eval(select); // return array of portfolioids
	
	//----------------------------------
	for ( var j = 0; j < portfolioids.length; j++) {
		if (countvar!=undefined) {
			g_variables[countvar] = j;
		}
		var ref_init = $(action).attr("ref-init");
		if (ref_init!=undefined) {
			ref_init = r_replaceVariable(ref_init);
			var ref_inits = ref_init.split("/"); // ref1/ref2/...
			for (var i=0;i<ref_inits.length;i++)
				g_variables[ref_inits[i]] = new Array();
		}
		portfolioid = portfolioids[j];
		portfolioid_current = portfolioid;
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			j : j,
			url : serverBCK_API+"/portfolios/portfolio/" + portfolioid + "?resources=true",
			success : function(data) {
				if (report_not_in_a_portfolio){
					UICom.structure["tree"] = {};
					UICom.structure["ui"] = {};
				}
				UICom.parseStructure(data,true, null, null,true);
				var actions = $(action).children();
				for (var i=0; i<actions.length;i++){
					var tagname = $(actions[i])[0].tagName;
					g_report_actions[tagname](destid,actions[i],no+'-'+j.toString()+i.toString(),data);
				};
			}
		});
	}
}

//=============================================================================
//=============================================================================
//======================FOR-EACH-PORTFOLIO-NODE ===============================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['for-each-portfolios-nodes'] = function (destid,action,no,data)
//==================================
{
	var countvar = $(action).attr("countvar");
	var userid = data;
	if (userid==null)
		userid = USER.id;
	var items_list = [];
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&user="+userid,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			var items = $("portfolio",data);
			var select = $(action).attr("select");
			select = r_replaceVariable(select);
			var value = "";
			var condition = "";
			var portfolioid = "";
			//----------------------------------
			var nodetag = $(action).attr("nodetag");
			var sortag = $(action).attr("sortag");
			var sortelt = $(action).attr("sortelt");
			var tableau = new Array();
			var sortvalue = "";
			if (sortag!=undefined && sortag!="") {
				for ( var j = 0; j < items.length; j++) {
					portfolioid = $(items[i]).attr('id');
					var code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",items[i])).text();
					if (select.indexOf("code*=")>-1) {
						if (select.indexOf("'")>-1)
							value = select.substring(7,select.length-1);  // inside quote
						else
							value = eval("json.lines["+line+"]."+select.substring(6));
						condition = code.indexOf(value)>-1;
					}
					if (select.indexOf("code=")>-1) {
						if (select.indexOf("'")>-1)
							value = select.substring(6,select.length-1);  // inside quote
						else
							value = eval("json.lines["+line+"]."+select.substring(5));
						condition = code==value;
					}
					//------------------------------------
					if (condition && sortag!=""){
						$.ajax({
							async:false,
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+sortag,
							success : function(data) {
								if (sortelt=='resource code') {
									sortvalue = $("code",data)[0].text();
								}
								if (sortelt=='value') {
									sortvalue = $("value",data)[0].text();
								}
								if (sortelt=='node label') {
									sortvalue = $("label[lang='"+languages[LANGCODE]+"']",data)[0].text();
								}
								if (sortelt=='resource') {
									sortvalue = $("text[lang='"+languages[LANGCODE]+"']",$("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",data)).text();
								}
								tableau[tableau.length] = [sortvalue,portfolioid];
							}
						});
					}
					//------------------------------------
				}
				var newTableau = tableau.sort(sortOn1);
				for ( var i = 0; i < newTableau.length; i++) {
					items_list[i] = portfolios_byid[newTableau[i][1]]
				}
				items_list.length = newTableau.length;
			} else {
				for ( var i = 0; i < items.length; i++) {
					items_list[i] = portfolios_byid[$(items[i]).attr('id')]
				}
			}
			//----------------------------------
			for ( var j = 0; j < items_list.length; j++) {
				if (countvar!=undefined) {
					g_variables[countvar] = j;
				}
				//------------------------------------
				var code = items_list[j].code_node.text();
				if (select.indexOf("code*=")>-1) {
					value = select.substring(7,select.length-1);  // inside quote
					condition = code.indexOf(value)>-1;
				}
				if (select.indexOf("code=")>-1) {
					value = select.substring(6,select.length-1);  // inside quote
					condition = code==value;
				}
				if (select.length==0) {
					condition = true;;
				}
				//------------------------------------
				if (condition){
					//--------------------------------
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+nodetag,
						success : function(data) {
							var nodes = $("node",data);
							for (var l=0; l<nodes.length;l++){
								//----------------------------------
								if (countvar!=undefined) {
									g_variables[countvar] = j;
								}
								//----------------------------------
								var ref_init = $(action).attr("ref-init");
								if (ref_init!=undefined) {
									ref_init = r_replaceVariable(ref_init);
									var ref_inits = ref_init.split("/"); // ref1/ref2/...
									for (var k=0;k<ref_inits.length;k++)
										g_variables[ref_inits[k]] = new Array();
								}
								//----------------------------------
								var nodeid = $(nodes[l]).attr('id');
								$.ajax({
									async:false,
									type : "GET",
									dataType : "xml",
									j : j,
									url : serverBCK_API+"/nodes/node/"+nodeid,
									success : function(data) {
										//-----------------------------
										if (report_not_in_a_portfolio){
											UICom.structure["tree"] = {};
											UICom.structure["ui"] = {};
										}
										UICom.parseStructure(data,true, null, null,true);
										//-----------------------------
										var actions = $(action).children();
										for (var i=0; i<actions.length;i++){
											var tagname = $(actions[i])[0].tagName;
											g_report_actions[tagname](destid,actions[i],no+'-'+j.toString()+i.toString(),data);
										};
										//-----------------------------
									}
								});
								//----------------------------------
							};
						}
					});
				}
			}
		}
	});
}

//=============================================================================
//=============================================================================
//====================== NodeResource =========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['node_resource'] = function (destid,action,no,data)
//==================================
{
	var text = "";
	var style = "";
	var attr_help = "";
	var prefix_id = "";
	try {
		var select = $(action).attr("select");
		select = r_replaceVariable(select);
		var ref = $(action).attr("ref");
		ref = r_replaceVariable(ref);
		var editresroles = $(action).attr("editresroles");
		var delnoderoles = $(action).attr("delnoderoles");
		style = r_replaceVariable($(action).attr("style"));
		var selector = r_getSelector(select);
		var node = $(selector.jquery,data);
		if (node.length==0) // try the node itself
			node = $(selector.jquery,data).addBack();
		if (select.substring(0,2)=="..") // node itself
			node = data;
		if (node.length>0 || select.substring(0,1)=="."){
			var nodeid = $(node).attr("id");
			//----------------------------
			var node = UICom.structure["ui"][nodeid];
			var writenode = ($(node.node).attr('write')=='Y')? true:false;
			if (editresroles.indexOf("user")>-1)
				editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
			if (g_designerrole || writenode) {
				writenode = (editresroles.containsArrayElt(g_userroles) || editresroles.indexOf($(USER.username_node).text())>-1 )
			}
			var deletenode = ($(node.node).attr('delete')=='Y')? true:false;
			if (delnoderoles.indexOf("user")>-1)
				delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'':$(node.metadatawad).attr('delnoderoles');
			if (g_designerrole || deletenode) {
				deletenode = (delnoderoles.containsArrayElt(g_userroles) || delnoderoles.indexOf($(USER.username_node).text())>-1);
			}
			var inline = false;
			var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
			if (inline_metadata=='Y')
				inline = true;
			//----------------------------
			if (selector.type=='resource') {
				try {
					text = UICom.structure["ui"][nodeid].resource.getView("dashboard_"+nodeid,'none',null,true);
				} catch(e){
					text = UICom.structure["ui"][nodeid].structured_resource.getView("dashboard_"+nodeid,null,null,true);
				}
				
			}
			if (selector.type=='resource code') {
				text = UICom.structure["ui"][nodeid].resource.getCode();
			}
			if (selector.type=='resource value') {
				text = UICom.structure["ui"][nodeid].resource.getValue("dashboard_value_"+nodeid);
				prefix_id += "value_";
			}
			if (selector.type=='resource label') {
				text = UICom.structure["ui"][nodeid].resource.getLabel();
			}
			if (selector.type=='node label') {
				text = UICom.structure["ui"][nodeid].getLabel();
			}
			if (selector.type=='node code') {
				text = UICom.structure["ui"][nodeid].getCode();
			}
			if (selector.type=='loginfo') {
				var lastmodified = UICom.structure["ui"][nodeid].resource.lastmodified_node.text();
				var user = UICom.structure["ui"][nodeid].resource.user_node.text();
				try {
					text = lastmodified+" - user : "+user;
					}
				catch(error) {text="/"};
			}
			if (selector.type=='node value') {
				text = UICom.structure["ui"][nodeid].getValue();
			}
			if (selector.type=='uuid') {
				text = nodeid;
			}
			if (selector.type=='node context') {
				text = UICom.structure["ui"][nodeid].getContext("dashboard_context_"+nodeid);
				prefix_id += "context_";
			}
			if (ref!=undefined && ref!="") {
				ref = r_replaceVariable(ref);
				if (g_variables[ref]==undefined)
					g_variables[ref] = new Array();
				g_variables[ref][g_variables[ref].length] = text;
			}
			text = "<span id='dashboard_node_resource"+nodeid+"' style='"+style+"'>"+text+"</span>";
			if (g_edit && writenode) {
				text += "<span class='button fas fa-pencil-alt' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+nodeid+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
			}
			if (g_edit && deletenode) {
				var type = UICom.structure["ui"][nodeid].asmtype;
				text += deleteButton(nodeid,type,null,null,'UIFactory.Node.reloadUnit',null,null);
			}
			//----------------------------
			if (g_edit && inline & writenode) {
				//-----------------------
				if(UICom.structure["ui"][nodeid].resource!=null) {
					try {
						var test = UICom.structure["ui"][nodeid].resource.getEditor();
						text = "<span id='report_get_editor_"+nodeid+"' style='"+style+"'></span>";
					}
					catch(e) {
						text = "<span id='report_display_editor_"+nodeid+"' style='"+style+"'></span>";
					}
				}
			}
			if ($(node.metadatawad).attr('help')!=undefined && $(node.metadatawad).attr('help')!=""){
				attr_help = $(node.metadatawad).attr('help');
			}
		}
	} catch(e){
		text = "<span id='dashboard_"+nodeid+"'></span>";
	}
	//------------------------------
	text += "<span id='reshelp_"+nodeid+"'></span>"
	$("#"+destid).append($(text));
	//--------------------set editor------------------------------------------
	if ($("#report_display_editor_"+nodeid).length>0) {
		UICom.structure["ui"][nodeid].resource.displayEditor("report_display_editor_"+nodeid);
	}

/*
	// -------- if resource changed refresh the report - editor not inline
	if (report_refresh && $("#dashboard_node_resource"+nodeid).length>0 && editresroles.length>0) {
		$("#dashboard_"+prefix_id+nodeid).on('DOMSubtreeModified',function (){
			refresh_report(dashboard_current);
		});
	}
*/

	// -------- if resource changed refresh the report - editor not inline
	if (report_refresh && $("#dashboard_node_resource"+nodeid).length>0 && editresroles.length>0) {
		$("#dashboard_node_resource"+nodeid).attr('dashboard',dashboard_current);
		var config = { attributes: true, childList: true, characterData: true, subtree:true }
		var observer = new MutationObserver(function(mutations) {
			var nodeid = mutations[0].target.parentNode.parentNode.attributes['id'].value;
			var dashboardid = document.getElementById("dashboard_node_resource"+nodeid).attributes['dashboard'].value;
			this.disconnect();
			refresh_report(dashboardid);
		});
		//-----------
		var target = $("#"+nodeid,data)[0];
		if ($("#"+nodeid,data).length==0)
			target = data; //node itself
		//-----------
		observer.observe(target, config);
	}

	// -------- if resource changed refresh the report - editor inline
	if (report_refresh && $("#report_get_editor_"+nodeid).length>0) {
		$("#report_get_editor_"+nodeid).append(UICom.structure["ui"][nodeid].resource.getEditor());
		var input = $('input',$("#report_get_editor_"+nodeid));
		$(input).attr('dashboard',dashboard_current);
		$(input).change(function (){
			refresh_report(this.attributes['dashboard'].value);
		});
	}
}

//=============================================================================
//=============================================================================
//====================== MENU =========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['menu'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	select = r_replaceVariable(select);
	var mtext = $("mtext",action).text();
	mtext = r_replaceVariable(mtext);
	var selector = r_getSelector(select);
	var node = $(selector.jquery,data);
	if (node.length==0) // try the node itself
		node = $(selector.jquery,data).addBack();
	if (select.substring(0,2)=="..") // node itself
		node = data;
	if (g_edit && (node.length>0 || select.substring(0,1)==".")){
		var nodeid = targetid = $(node).attr("id");
		if(UICom.structure.ui[nodeid].menuroles==undefined) // in case of display before the node
			UICom.structure.ui[nodeid].setMetadata();
		UICom.structure.ui[nodeid].displayMenus("#"+destid,LANGCODE);
//		var html = UIFactory.Node.getReportMenus("",mtext,nodeid,targetid,LANGCODE)
//		$("#"+destid).append(html);
	}

}
//=============================================================================
//=============================================================================
//====================== Variable =============================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['variable'] = function (destid,action,no,data)
//==================================
{
	var text = "";
	var style = "";
	var attr_help = "";
	var prefix_id = "";
	try {
		var varlabel = $(action).attr("varlabel");
		var ref = $(action).attr("ref");
		var aggregatetype = $(action).attr("aggregatetype");
		//------------ aggregate ------------------
		if (aggregatetype!=undefined && aggregatetype!="") {
			var select = $(action).attr("aggregationselect");
			select = r_replaceVariable(select);
			if (aggregatetype=="sum" && g_variables[select]!=undefined){
				var sum = 0;
				for (var i=0;i<g_variables[select].length;i++){
					if ($.isNumeric(g_variables[select][i]))
						sum += parseFloat(g_variables[select][i]);
				}
				text = sum;
			}
			if (aggregatetype=="avg" && g_variables[select]!=undefined){
				var sum = 0;
				for (var i=0;i<g_variables[select].length;i++){
					if ($.isNumeric(g_variables[select][i]))
						sum += parseFloat(g_variables[select][i]);
				}
				text = sum/g_variables[select].length;
				if (text.toString().indexOf(".")>-1)
					text = text.toFixed(2);
				
			}
			if (ref!=undefined && ref!="") {
				ref = r_replaceVariable(ref);
				if (g_variables[ref]==undefined)
					g_variables[ref] = new Array();
				g_variables[ref][g_variables[ref].length] = text;
			}
			if (!$.isNumeric(text))
				text="";
		} else {
			var select = $(action).attr("select");
			if (select!=undefined && select.length>0) {
				//---------- node-resource -----------
				select = r_replaceVariable(select);
				var selector = r_getSelector(select);
				var node = $(selector.jquery,data);
				if (node.length==0) // try the node itself
					node = $(selector.jquery,data).addBack();
				if (select.substring(0,2)=="..") // node itself
					node = data;
				if (node.length>0 || select.substring(0,1)=="."){
					var nodeid = $(node).attr("id");
					//----------------------------
					var node = UICom.structure["ui"][nodeid];
					//----------------------------
					if (selector.type=='resource') {
						text = UICom.structure["ui"][nodeid].resource.getView("dashboard_"+nodeid,null,null,true);
					}
					if (selector.type=='resource code') {
						text = UICom.structure["ui"][nodeid].resource.getCode();
					}
					if (selector.type=='resource value') {
						text = UICom.structure["ui"][nodeid].resource.getValue("dashboard_value_"+nodeid);
						prefix_id += "value_";
					}
					if (selector.type=='resource label') {
						text = UICom.structure["ui"][nodeid].resource.getLabel();
					}
					if (selector.type=='node label') {
						text = UICom.structure["ui"][nodeid].getLabel();
					}
					if (selector.type=='node code') {
						text = UICom.structure["ui"][nodeid].getCode();
					}
					if (selector.type=='node value') {
						text = UICom.structure["ui"][nodeid].getValue();
					}
					if (selector.type=='uuid') {
						text = nodeid;
					}
					if (selector.type=='node context') {
						text = UICom.structure["ui"][nodeid].getContext("dashboard_context_"+nodeid);
						prefix_id += "context_";
					}
				}
			} else {
				//------------ text ------------------
				text = $(action).text();
				text = r_replaceVariable(text);
			}
		}
	} catch(e){
		text = "";
	}
	//------------------------------
	g_variables[varlabel] = text;
	if (ref!=undefined && ref!="") {
		if (g_variables[ref]==undefined)
			g_variables[ref] = new Array();
		g_variables[ref][g_variables[ref].length] = text;
	}
}

//=============================================================================
//=============================================================================
//====================== CSV ==================================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['csv-line'] = function (destid,action,no,data)
//==================================
{
	csvline = "";
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		var is_out_csv = true;
		g_report_actions[tagname](destid,actions[i],no+'-'+i.toString(),data,is_out_csv);
	};
	csvreport[csvreport.length]=csvline;
	$.ajax({
		type : "POST",
		contentType: "text",
		dataType : "text",
		data : csvline,
		url : serverBCK+"/logging?n=1&user=false&info=false",
		success : function() {
		}
	});
}


//==================================
g_report_actions['csv-value'] = function (destid,action,no,data)
//==================================
{
	var text = "";
	var style = "";
	var attr_help = "";
	var prefix_id = "";
	try {
		//----------selector---------------------
		var select = $(action).attr("select");
		while (select.indexOf("##")>-1) {
			var test_string = select.substring(select.indexOf("##")+2); // test_string = abcd##variable##efgh.....
			var variable_name = test_string.substring(0,test_string.indexOf("##"));
			select = select.replace("##"+variable_name+"##", g_variables[variable_name]);
		}
		var selector = r_getSelector(select);
		var node = $(selector.jquery,data);
		if (node.length==0) // try the node itself
			node = $(selector.jquery,data).addBack();
		if (select.substring(0,2)=="..") // node itself
			node = data;
		//---------------test-----------------
		var test = $(action).attr("test");
		if (test!=undefined) {
			test = r_replaceVariable(test);
			test = getTest(test);
			node = eval("$(node)"+test);
		}
		//------------------------------
		if (node.length>0 || select.substring(0,1)=="."){
			var nodeid = $(node).attr("id");
			//----------------------------
			var node = UICom.structure["ui"][nodeid];
			//----------------------------
			if (selector.type=='resource') {
				text = UICom.structure["ui"][nodeid].resource.getView("dashboard_"+nodeid,null,null,true);
			}
			if (selector.type=='resource code') {
				text = UICom.structure["ui"][nodeid].resource.getCode();
			}
			if (selector.type=='resource value') {
				text = UICom.structure["ui"][nodeid].resource.getValue("dashboard_value_"+nodeid);
				prefix_id += "value_";
			}
			if (selector.type=='resource label') {
				text = UICom.structure["ui"][nodeid].resource.getLabel();
			}
			if (selector.type=='node label') {
				text = UICom.structure["ui"][nodeid].getLabel();
			}
			if (selector.type=='node code') {
				text = UICom.structure["ui"][nodeid].getCode();
			}
			if (selector.type=='node value') {
				text = UICom.structure["ui"][nodeid].getValue();
			}
			if (selector.type=='uuid') {
				text = nodeid;
			}
			if (selector.type=='node context') {
				text = UICom.structure["ui"][nodeid].getContext("dashboard_context_"+nodeid);
			}
		}
	} catch(e){
		text = "-";
	}
	//------------------------------
	if (typeof csvseparator == 'undefined') // for backward compatibility
		csvseparator = ";";
	text = r_replaceVariable(text);
	csvline += text + csvseparator;
	// to display for testing
	$("#"+destid).append(text);

}

//=============================================================================
//=============================================================================
//====================== QRCODE ===============================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['qrcode'] = function (destid,action,no,data)
//==================================
{
	var text = "";
	var style = "";
	var attr_help = "";
	try {
		var selector = r_getSelector('asmContext.qrcode','');
		var node = $(selector.jquery,data);
		if (node.length>0 || select.substring(0,1)=="."){
			var nodeid = $(node).attr("id");
			//----------------------------
			var url = UICom.structure["ui"][nodeid].resource.getView(null,null,null,true);
			text = "<img src=\""+url+"\">";
		}
	} catch(e){
		text = "<span id='dashboard_"+nodeid+"'>&mdash;</span>";
	}
	//------------------------------
	$("#"+destid).append($(text));
}

//=============================================================================
//=============================================================================
//====================== EUROPASS =============================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['europass'] = function (destid,action,no,data)
//==================================
{
	var style = "";
	var attr_help = "";
	var selector = r_getSelector('asmUnitStructure.EuropassL','');
	var nodes = $(selector.jquery,data);
	if (nodes.length>0 || select.substring(0,1)=="."){
		for (var enode=0;enode<nodes.length;enode++) {
			var semantictag = $("metadata",nodes[enode]).attr('semantictag');
			if (semantictag=='EuropassL') {
				var nodeid = $(nodes[enode]).attr("id");
				var text = "<table id='"+destid+"europass' style='width:100%;margin-top:30px;'></table>";
				$("#"+destid).append($(text));
				var europass_node = UICom.structure["ui"][nodeid];
				//----------------------------
				europass_node.structured_resource.displayView(destid+"europass",null,'report',nodeid,null,false);
			}
		}
	}
}

//=============================================================================
//=============================================================================
//========================== TEXT =============================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['text'] = function (destid,action,no,data,is_out_csv)
//==================================
{
	var nodeid = $(data).attr("id");
	var text = $(action).text();
	text = r_replaceVariable(text);
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var ref = $(action).attr("ref");
	if (ref!=undefined && ref!="") {
		ref = r_replaceVariable(ref);
		if (g_variables[ref]==undefined)
			g_variables[ref] = new Array();
		g_variables[ref][g_variables[ref].length] = text;
	}
	//-----------------
	if (is_out_csv!=null && is_out_csv) {
		if (typeof csvseparator == 'undefined') // for backward compatibility
			csvseparator = ";";
		csvline += text + csvseparator;		
	}
	//-----------------
	text = "<span id='txt"+nodeid+"' style='"+style+"' class='"+cssclass+"'>"+text+"</span>";
	$("#"+destid).append($(text));
}


//=============================================================================
//=============================================================================
//====================== JSFUNCTION ===========================================
//=============================================================================
//=============================================================================


//==================================
g_report_actions['jsfunction'] = function (destid,action,no,data)
//==================================
{
	var jsfunction = $(action).attr("function");
	eval (jsfunction);
	// ???????
}

//=============================================================================
//=============================================================================
//======================== PREVIEW2UNIT =======================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['preview2unit'] = function (destid,action,no,data)
//==================================
{
	var nodeid = $(data).attr("id");
	var targetid = "";
	var text = "";
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var select = $(action).attr("select");
	select = r_replaceVariable(select);
	var selector = r_getSelector(select);
	var node = $(selector.jquery,data);
	if (node.length==0) // try the node itself
		node = $(selector.jquery,data).addBack();
	if (select.substring(0,2)=="..") // node itself
		node = data;
	if (node.length>0 || select.substring(0,1)=="."){
		var nodeid = $(node).attr("id");
		targetid = UICom.structure["ui"][nodeid].getUuid();
		label = UICom.structure["ui"][nodeid].getLabel(null,'none');
	}
	text = "<span id='"+nodeid+"' style='"+style+"' class='report-preview2unit "+cssclass+"'>"+label+"</span>&nbsp;";
	text += "<span class='button fas fa-binoculars' onclick=\"previewPage('"+targetid+"',100,'standard') \" data-title='"+karutaStr[LANG]["preview"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
	$("#"+destid).append($(text));
	$("#"+nodeid).attr("style",style);
}

//=============================================================================
//=============================================================================
//======================== URL2UNIT ===========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['url2unit'] = function (destid,action,no,data)
//==================================
{
	var nodeid = $(data).attr("id");
	var targetid = "";
	var text = "";
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var select = $(action).attr("select");
	select = r_replaceVariable(select);
	var selector = r_getSelector(select);
	var node = $(selector.jquery,data);
	if (node.length==0) // try the node itself
		node = $(selector.jquery,data).addBack();
	if (select.substring(0,2)=="..") // node itself
		node = data;
	if (node.length>0 || select.substring(0,1)=="."){
		var nodeid = $(node).attr("id");
		targetid = UICom.structure["ui"][nodeid].getUuid();
		label = UICom.structure["ui"][nodeid].getLabel(null,'none');
	}
	text = "<span id='"+nodeid+"' style='"+style+"' class='report-url2unit "+cssclass+"' onclick=\"$('#sidebar_"+targetid+"').click()\">"+label+"</span>";
	$("#"+destid).append($(text));
	$("#"+nodeid).attr("style",style);
}

//=============================================================================
//=============================================================================
//======================== URL2PORTFOLIO ======================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['url2portfolio'] = function (destid,action,no,data)
//==================================
{
	var nodeid = $(data).attr("id");
	var uuid = "";
	var label = "";
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var code = $(action).attr("code");
	code = r_replaceVariable(code);
	var url = serverBCK_API+"/portfolios/portfolio/code/" + code;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			uuid = $("asmRoot",data).attr("id");
			label = $("label[lang='"+languages[LANGCODE]+"']",$("asmRoot>asmResource[xsi_type='nodeRes']",data)[0]).text();
		}
	});
	text = "<span id='"+nodeid+"' style='"+style+"' class='URL2Portfolio-link "+cssclass+"' onclick=\"display_main_page('"+uuid+"')\">"+label+"</span>";
	$("#"+destid).append($(text));
	$("#"+nodeid).attr("style",style);
}


//=============================================================================
//=============================================================================
//======================== AGGREGATE ==========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['aggregate'] = function (destid,action,no,data)
//==================================
{
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var ref = $(action).attr("ref");
	ref = r_replaceVariable(ref);
	var type = $(action).attr("type");
	var select = $(action).attr("select");
	select = r_replaceVariable(select);
	var text = "";
	if (type=="sum" && g_variables[select]!=undefined){
		var sum = 0;
		for (var i=0;i<g_variables[select].length;i++){
			if ($.isNumeric(g_variables[select][i]))
				sum += parseFloat(g_variables[select][i]);
		}
		text = sum;
	}
	if (type=="avg" && g_variables[select]!=undefined){
		var sum = 0;
		for (var i=0;i<g_variables[select].length;i++){
			if ($.isNumeric(g_variables[select][i]))
				sum += parseFloat(g_variables[select][i]);
		}
		text = sum/g_variables[select].length;
		if (text.toString().indexOf(".")>-1)
			text = text.toFixed(2);
		
	}
	if (ref!=undefined && ref!="") {
		if (g_variables[ref]==undefined)
			g_variables[ref] = new Array();
		g_variables[ref][g_variables[ref].length] = text;
	}
	if (!$.isNumeric(text))
		text="";
	text = "<span style='"+style+"' class='"+cssclass+"'>"+text+"</span>";
	$("#"+destid).append($(text));
}

//=============================================================================
//=============================================================================
//======================== OPERATION ==========================================
//=============================================================================
//=============================================================================

//==================================
g_report_actions['operation'] = function (destid,action,no,data)
//==================================
{
	var style = r_replaceVariable($(action).attr("style"));
	var cssclass = r_replaceVariable($(action).attr("class"));
	var ref = $(action).attr("ref");
	ref = r_replaceVariable(ref);
	var type = $(action).attr("type");
	var select1 = $(action).attr("select1");
	var select2 = $(action).attr("select2");
	select1 = r_replaceVariable(select1);
	select2 = r_replaceVariable(select2);
	var result = "";
	if ( type=="addition" && $.isNumeric(select1) && $.isNumeric(select1) ){
		result = Number(select1) + Number(select2);
	}
	if ( type=="subtraction" && $.isNumeric(select1) && $.isNumeric(select2) ){
		result = Number(select1) - Number(select2);
	}
	if ( type=="multiplication" && $.isNumeric(select1) && $.isNumeric(select2) ){
		result = Number(select1) * Number(select2);
	}
	if ( type=="division" && $.isNumeric(select1) && $.isNumeric(select2) && select2!=0){
		result = Number(select1) / Number(select2);
		if (result.toString().indexOf(".")>-1)
			result = result.toFixed(2);
	}
	if ( type=="percentage" && $.isNumeric(select1) && $.isNumeric(select2) && select2!=0){
		result = Number(select1) / Number(select2) * 100;
		if (result.toString().indexOf(".")>-1)
			result = result.toFixed(2);
	}
	if (ref!=undefined && ref!="") {
		if (g_variables[ref]==undefined)
			g_variables[ref] = new Array();
		g_variables[ref][g_variables[ref].length] = result;
	}
	if (!$.isNumeric(result))
		result="";
	if ( type=="percentage")
		result = result.toString() + "%";
	result = "<span style='"+style+"' class='"+cssclass+"'>"+result+"</span>";
	$("#"+destid).append($(result));
}


//=========================================================================
//=========================================================================
//======================= SVG =============================================
//=========================================================================
//=========================================================================


var svgfontname = 'Arial';
var svgfontsize = 16;
var svgcenter = {'x':600,'y':600};
var svgaxislength = 600;

function makeSVG(tag, attrs,val) {
	var elt= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs)
		elt.setAttribute(k, attrs[k]);
	if (val !=null) {
		var textNode = document.createTextNode(val);
		elt.appendChild(textNode);
	}
	return elt;
}

function svgrotate(center, x, y, angle) {
	var radians = (Math.PI / 180) * (0-angle),
	cos = Math.cos(radians),
	sin = Math.sin(radians),
	nx = (cos * (x - center.x)) + (sin * (y - center.y)) + center.x,
	ny = (cos * (y - center.y)) - (sin * (x - center.x)) + center.y;
	return {'x':nx,'y':ny};
}

function getWidthOfText(txt, fontname, fontsize){
	  var c=document.createElement('canvas');
	  var ctx=c.getContext('2d');
	  ctx.font = fontsize + 'px' + fontname;
	  var length = ctx.measureText(txt).width;
	  return length;
}
	
function drawAxis(destid,label,fontname,fontsize,angle,center,axislength){
	//-----------------
	var line = makeSVG('line',{'x1':center.x,'y1':center.y,'x2':center.x-axislength,'y2':center.y,'transform':"rotate("+angle+" "+center.x+" "+center.y+")",'stroke':'black','stroke-width': 2});
	document.getElementById(destid).appendChild(line);
	//-----------------
	var x = center.x-axislength;
	var y = center.y - (fontsize/2);
	if (angle>90 && angle<=270) {
		var l =  getWidthOfText(label, fontname, fontsize);
		x=center.x+axislength-l*1.6;
		angle = angle-180;
	}
	var text = makeSVG('text',{'x':x,'y':y,'transform':"rotate("+angle+" "+center.x+" "+center.y+")",'font-size':fontsize,'font-family':fontname},label);
	document.getElementById(destid).appendChild(text);
	//-----------------
}

function drawValue(destid,value,angle,center,cssclass){
	var point = svgrotate(center, svgaxislength-value, center.y, angle);
	var line = makeSVG('line',{'x1':point.x,'y1':point.y,'x2':point.x,'y2':point.y,'class':cssclass});
	document.getElementById(destid).appendChild(line);
}

function drawGraduationLine(destid,no,min,max,angle,center,cssclass){
	var delta = Math.abs(max-min);
	var x = svgaxislength-(svgaxislength/delta*no);
	var line = makeSVG('line',{'x1':x,'y1':center.y-5,'x2':x,'y2':center.y+5,'transform':"rotate("+angle+" "+center.x+" "+center.y+")",'stroke':'black','stroke-width': 1});
	document.getElementById(destid).appendChild(line);
}

function drawGraduationLabel(destid,no,min,max,angle,center,cssclass){
	var delta = Math.abs(max-min);
	var x = svgaxislength-(svgaxislength/delta*no);
	var point = svgrotate(center, x, center.y+20, angle);
	var text = makeSVG('text',{'x':point.x,'y':point.y,'font-size':svgfontsize,'font-family':svgfontname},(max>min)?no+min:min-no);
	document.getElementById(destid).appendChild(text);
}


function drawLine(destid,value1,angle1,value2,angle2,center,cssclass){
	var point1 = svgrotate(center, svgaxislength-value1, center.y, angle1);
	var point2 = svgrotate(center, svgaxislength-value2, center.y, angle2);
	var line = makeSVG('line',{'x1':point1.x,'y1':point1.y,'x2':point2.x,'y2':point2.y,'class':cssclass});
	document.getElementById(destid).appendChild(line);
}

function getTextSize(destid,text,svgfontsize,svgfontname) {
	var size = 0;
	var textsvg = makeSVG('text',{'x':-100,'id':'x123','y':-100,'font-size':svgfontsize,'font-family':svgfontname},text);
		document.getElementById(destid).appendChild(textsvg);
		size = document.getElementById('x123').getComputedTextLength();
		document.getElementById('x123').remove();
	return size;
}

function getPoints(data,select) {
	var points = [];
	var selector = r_getSelector(select,null);
	var nodes = $(selector.jquery,data).filter(selector.filter1);
	nodes = eval("nodes"+selector.filter2);
	var angle = 360 / nodes.length;
	for (var i=0; i<nodes.length;i++){
		//---------------------------
		var nodeid = $(nodes[i]).attr("id");
		if (selector.type=='resource') {
			text = UICom.structure["ui"][nodeid].resource.getView("svg_"+nodeid,'none');
		} else if (selector.type=='resource code') {
			text = UICom.structure["ui"][nodeid].resource.getCode();
		} else if (selector.type=='resource value') {
			text = UICom.structure["ui"][nodeid].resource.getValue("svg_value_"+nodeid);
		} else if (selector.type=='resource label') {
			text = UICom.structure["ui"][nodeid].resource.getLabel(null,'none');
		} else if (selector.type=='node label') {
			text = UICom.structure["ui"][nodeid].getLabel(null,'none');
		} else if (selector.type=='node value') {
			text = UICom.structure["ui"][nodeid].getValue();
		} else if (selector.type=='node code') {
			text = UICom.structure["ui"][nodeid].getCode();
		} else if (selector.type=='node context') {
			text = UICom.structure["ui"][nodeid].getContext("svg_context_"+nodeid,'none');
		}
		if (text.length>0)
			points[points.length] = {'value': parseInt(text),'x':0,'y':0};
		else
			points[points.length] = {'value': null};
	};
	return points;
}

function getResText(data,select) {
	var texts = [];
	var selector = r_getSelector(select,null);
	var nodes = $(selector.jquery,data).filter(selector.filter1);
	nodes = eval("nodes"+selector.filter2);
	if (nodes.length==0)
		nodes = $(data); //node itself
	for (var i=0; i<nodes.length;i++){
		//---------------------------
		var nodeid = $(nodes[i]).attr("id");
		if (selector.type=='resource') {
			text = UICom.structure["ui"][nodeid].resource.getView("svg_"+nodeid,'none');
		} else if (selector.type=='resource code') {
			text = UICom.structure["ui"][nodeid].resource.getCode();
		} else if (selector.type=='resource value') {
			text = UICom.structure["ui"][nodeid].resource.getValue("svg_value_"+nodeid);
		} else if (selector.type=='resource label') {
			text = UICom.structure["ui"][nodeid].resource.getLabel(null,'none');
		} else if (selector.type=='node label') {
			text = UICom.structure["ui"][nodeid].getLabel(null,'none');
		} else if (selector.type=='node value') {
			text = UICom.structure["ui"][nodeid].getValue();
		} else if (selector.type=='node code') {
			text = UICom.structure["ui"][nodeid].getCode();
		} else if (selector.type=='node context') {
			text = UICom.structure["ui"][nodeid].getContext("svg_context_"+nodeid,'none');
		}
		texts[texts.length] = text;
	};
	return texts;
}


//==================================
g_report_actions['svg'] = function (destid,action,no,data)
//==================================
{
	var width = $(action).attr("min-width");
	var html = "<svg id='"+destid+'-'+no+"' width='"+width+"' viewbox='0 0 1200 1200'></svg>";
	var svg = $(html);
	$("#"+destid).append(svg);
	//----------------------------------
	var actions = $(action).children();
	for (var i=0; i<actions.length;i++){
		var tagname = $(actions[i])[0].tagName;
		g_report_actions[tagname](destid+'-'+no,actions[i],i.toString(),data)
	}
}

//==================================
g_report_actions['draw-web-title'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	var txt = $(action).attr("text");
	if (select!=undefined) {
		select = replaceVariable(select);
		var text = getResText(data,select)[0];
		var size = getTextSize(destid,text+txt,svgfontsize*2,svgfontname)
		var svgtext = makeSVG('text',{'x':1100-size,'y':40,'font-size':svgfontsize*2,'font-family':svgfontname},text+txt);
		document.getElementById(destid).appendChild(svgtext);
	}
}
//==================================
g_report_actions['draw-web-axis'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	if (select!=undefined) {
		
		select = replaceVariable(select);
		var texts = getResText(data,select);
		var angle = 360 / texts.length;
		for (var i=0; i<texts.length;i++){
			drawAxis(destid,texts[i],svgfontname,svgfontsize,angle*i,svgcenter,svgaxislength);
		}
	}
}

//==================================
g_report_actions['draw-web-line'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	var legendselect = $(action).attr("legendselect");
	var min = parseInt($(action).attr("min"));
	var max = parseInt($(action).attr("max"));
	var pos = $(action).attr("pos");
	if (pos==undefined)
		pos = 0;
	if (select!=undefined) {
		select = replaceVariable(select);
		var points = getPoints(data,select);
		var angle = 360 / points.length;
		for (var i=0; i<points.length;i++){
			if (points[i].value!=null) {
				points[i] = {'value': ((points[i].value - min)/(max-min))*svgaxislength, 'angle':angle*i};
				drawValue(destid,points[i].value,points[i].angle,svgcenter,'svg-web-value'+pos);
				}
			if (pos==0){ // draw gaduations
				for (var j=0;j<=Math.abs(max-min);j++) {
					if (j>0)
						drawGraduationLine(destid,j,min,max,angle*i,svgcenter,'svg-web-line'+no);
					if (i==0)
						drawGraduationLabel(destid,j,min,max,angle*i,svgcenter,'svg-web-line'+no);
				}
			}
			if (i>0 && points[i-1].value!=null && points[i].value!=null)
				drawLine(destid,points[i-1].value,points[i-1].angle,points[i].value,points[i].angle,svgcenter,'svg-web-line'+pos);
		}
		if (points[i-1].value!=null && points[0].value!=null)
			drawLine(destid,points[i-1].value,points[i-1].angle,points[0].value,points[0].angle,svgcenter,'svg-web-line'+pos);
		// draw legend
		if (legendselect!=undefined) {
			var text = getResText(data,legendselect)[0];
			var line = makeSVG('line',{'x1':10,'y1':975-20*pos,'x2':10,'y2':975-20*pos,'class':'svg-web-value'+pos});
			document.getElementById(destid).appendChild(line);
			var svgtext = makeSVG('text',{'x':20,'y':980-20*pos,'font-size':svgfontsize,'font-family':svgfontname},text);
			document.getElementById(destid).appendChild(svgtext);
		}

	}
}

//==================================
g_report_actions['draw-xy-axis'] = function (destid,action,no,data)
//==================================
{
	var select = $(action).attr("select");
	var legendselect = $(action).attr("legendselect");
	var graphid = $(action).attr("ref");
	var graphtype = $(action).attr("graphtype");
	var xlegend = $(action).attr("xlegend");
	var ylegend = $(action).attr("ylegend");
	var xaxis = parseInt($(action).attr("xaxis"));
	var yaxis = parseInt($(action).attr("yaxis"));
	var xmin = parseInt($(action).attr("xmin"));
	var xmax = parseInt($(action).attr("xmax"));
	var xnbgraduation = parseInt($(action).attr("x-nbgraduation"));
	var xdisplaygraduation = parseInt($(action).attr("x-displaygraduation"));
	var xlegendtext = $(action).attr("xlegendtext");
	var ymin = parseInt($(action).attr("ymin"));
	var ymax = parseInt($(action).attr("ymax"));
	var ynbgraduation = parseInt($(action).attr("y-nbgraduation"));
	var ydisplaygraduation = parseInt($(action).attr("y-displaygraduation"));
	var ylegendtext = $(action).attr("ylegendtext");
	if (xaxis==undefined)
		xaxis = 0;
	if (yaxis==undefined)
		yaxis = 0;
	// store graph axis information
	if (graphid!="")
		g_graphs [graphid] = {'xaxis':xaxis,'yaxis':yaxis,'xmin':xmin,'xmax':xmax,'ymin':ymin,'ymax':ymax,'xnbgraduation':xnbgraduation,'ynbgraduation':ynbgraduation,'xdisplaygraduation':xdisplaygraduation,'ydisplaygraduation':ydisplaygraduation,'nbdata':0}
	//--------------------------
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':0,'y1':0,'x2':1200,'y2':0,'stroke':'red','stroke-width': 2}));
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':0,'y1':0,'x2':0,'y2':1200,'stroke':'red','stroke-width': 2}));
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':0,'y1':1200,'x2':1200,'y2':1200,'stroke':'red','stroke-width': 2}));
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':1200,'y1':1200,'x2':1200,'y2':0,'stroke':'red','stroke-width': 2}));
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':0,'y1':0,'x2':1200,'y2':1200,'stroke':'red','stroke-width': 2}));
//	document.getElementById(destid).appendChild(makeSVG('line',{'x1':0,'y1':1200,'x2':1200,'y2':0,'stroke':'red','stroke-width': 2}));
	// x axis
	var yline = makeSVG('line',{'x1':100+xaxis,'y1':100,'x2':100+xaxis,'y2':1100,'stroke':'black','stroke-width': 2});
	document.getElementById(destid).appendChild(yline);
	// x axis graduation
	if (xnbgraduation>0) {
		for (var j=0;j<=xnbgraduation;j++) {
			var x = 100+xaxis + (1000-xaxis) / xnbgraduation * j ;
			var line = makeSVG('line',{'x1':x,'y1':1100-yaxis-5,'x2':x,'y2':1100-yaxis+5,'stroke':'black','stroke-width': 1});
			document.getElementById(destid).appendChild(line);
			// x graduation label
			if (xdisplaygraduation=='1') {
				var label = (xmax - xmin) / xnbgraduation * j ;
				var text = makeSVG('text',{'x':x,'y':1100-yaxis+25,'font-size':svgfontsize,'font-family':svgfontname},label);
				document.getElementById(destid).appendChild(text);
			}
		}
	}
	// x legend
	if (xlegendtext!=""){
		var size = getTextSize(destid,xlegendtext,svgfontsize,svgfontname);
		var text = makeSVG('text',{'x':1100-size,'y':1100-yaxis+75,'font-size':svgfontsize+4,'font-family':svgfontname},xlegendtext);
		document.getElementById(destid).appendChild(text);
	}
	// y axis
	var xline = makeSVG('line',{'x1':100,'y1':1100-yaxis,'x2':1100,'y2':1100-yaxis,'stroke':'black','stroke-width': 2});
	document.getElementById(destid).appendChild(xline);
	// y axis graduation
	if (ynbgraduation>0) {
		for (var j=0;j<=ynbgraduation;j++) {
			var y = 1100-yaxis - (1000-yaxis) / ynbgraduation * j  ;
			var line = makeSVG('line',{'x1':100+xaxis-5,'y1':y,'x2':100+xaxis+5,'y2':y,'stroke':'black','stroke-width': 1});
			document.getElementById(destid).appendChild(line);
			// y graduation label
			if (ydisplaygraduation=='1') {
				var label = (ymax - ymin) / ynbgraduation * j ;
				var text = makeSVG('text',{'x':100+xaxis-25,'y':y,'font-size':svgfontsize,'font-family':svgfontname},label);
				document.getElementById(destid).appendChild(text);
			}
		}
	}
	if (ylegendtext!=""){
		var text = makeSVG('text',{'x':50+xaxis,'y':75,'font-size':svgfontsize+4,'font-family':svgfontname},ylegendtext);
		document.getElementById(destid).appendChild(text);
	}

}

//==================================
g_report_actions['draw-data'] = function (destid,action,no,data)
//==================================
{
	var graphid = $(action).attr("ref");
	var graphtype = $(action).attr("graphtype");
	var pointvariable = $(action).attr("point-variable");
	var pointselect = $(action).attr("point-select");
	var legendvariable = $(action).attr("legend-variable");
	var legendselect = $(action).attr("legend-select");
	var gradvariable = $(action).attr("grad-variable");
	var gradselect = $(action).attr("grad-select");
	//-----------------
	var xaxis = g_graphs[graphid].xaxis;
	var yaxis = g_graphs[graphid].yaxis;
	var xnbgraduation = g_graphs[graphid].xnbgraduation;
	var ymin = g_graphs[graphid].ymin;
	var ymax = g_graphs[graphid].ymax;
	var nbdata = g_graphs[graphid].nbdata++;
	//----------------
	if (pointselect!=undefined || pointvariable!="") {
		var points = [];
		if (pointselect!=undefined){
			pointselect = r_replaceVariable(pointselect);
			// draw points
			points = getPoints(data,pointselect);
		}
		if (pointvariable!="") {
			for (var i=0; i<g_variables[pointvariable].length;i++){
				points[points.length] = {'value': parseInt(g_variables[pointvariable][i]),'x':0,'y':0};
			}
		}
		if (graphtype=='point' || graphtype=='line') {
			for (var i=0; i<points.length;i++){
				if (points[i].value!=null){
					points[i].x = 100+xaxis + (1000-xaxis) / xnbgraduation * (i+1) ;
					points[i].y = 1100-yaxis - (1000-yaxis) / (ymax-ymin) * points[i].value ;
					var line = makeSVG('line',{'x1':points[i].x,'y1':points[i].y,'x2':points[i].x,'y2':points[i].y,'class':'svg-web-value'+nbdata});
					document.getElementById(destid).appendChild(line);
				}
				if (i>0 && points[i-1].value!=null && points[i].value!=null && graphtype=='line') {
					var line = makeSVG('line',{'x1':points[i-1].x,'y1':points[i-1].y,'x2':points[i].x,'y2':points[i].y,'class':'svg-web-line'+nbdata});
					document.getElementById(destid).appendChild(line);
				}
			}
		}
		if (graphtype=='bar') {
			for (var i=0; i<points.length;i++){
				if (points[i].value!=null){
					points[i].x = 90+xaxis+ (20*nbdata) + (1000-xaxis) / xnbgraduation * (i+1) ;
					points[i].y = 1100-yaxis - (1000-yaxis) / (ymax-ymin) * points[i].value ;
					var rect = makeSVG('rect',{'x':points[i].x,'y':points[i].y,'width':20,'height':(1000-yaxis) / (ymax-ymin) * points[i].value,'class':'svg-web-rect'+nbdata});
					document.getElementById(destid).appendChild(rect);
				}
			}
		}
		// draw legend
		if (legendselect!=undefined || legendvariable!="") {
			var texts = [];
			if (legendselect!=undefined){
				legendselect = r_replaceVariable(legendselect);
				texts = getResText(data,legendselect);
			}
			if (legendvariable!="") {
				for (var i=0; i<g_variables[legendvariable].length;i++){
					texts[texts.length] = g_variables[legendvariable][i];
				}
			}
			for (var i=0; i<texts.length;i++){
				var line = makeSVG('line',{'x1':100,'y1':1140+20*nbdata,'x2':100,'y2':1140+20*nbdata,'class':'svg-web-value'+nbdata});
				document.getElementById(destid).appendChild(line);
				var svgtext = makeSVG('text',{'x':120,'y':1145+20*nbdata,'font-size':svgfontsize,'font-family':svgfontname},texts[i]);
				document.getElementById(destid).appendChild(svgtext);
			}
		}
		// draw x graduation
		if (gradselect!=undefined || gradvariable!="") {
			var texts = [];
			if (gradselect!=undefined){
				gradselect = r_replaceVariable(gradselect);
				texts = getResText(data,gradselect);
			}
			if (gradvariable!="") {
				for (var i=0; i<g_variables[gradvariable].length;i++){
					texts[texts.length] = g_variables[gradvariable][i];
				}
			}
			for (var i=0; i<texts.length;i++){
				var x = 100+xaxis + (20*nbdata) + (1000-xaxis) / xnbgraduation * (i+1) ;
				var y = 1120 ;
				var svgtext = makeSVG('text',{'x':x,'y':y,'transform':"rotate(45 "+x+" "+y+")",'font-size':svgfontsize,'font-family':svgfontname},texts[i]);
				document.getElementById(destid).appendChild(svgtext);
			}
		}
	}
}





