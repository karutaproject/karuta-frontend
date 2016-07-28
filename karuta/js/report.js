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

var trace = false;
var xmlDoc = null;
var userid = null; // current user
var aggregates = {};


var jquerySpecificFunctions = {};
jquerySpecificFunctions['.sort()'] = ".sortElements(function(a, b){ return $(a).text() > $(b).text() ? 1 : -1; })";
jquerySpecificFunctions['.invsort()'] = ".sortElements(function(a, b){ return $(a).text() < $(b).text() ? 1 : -1; })";
jquerySpecificFunctions['.filename_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\").has(\"filename:not(:empty)\")";
jquerySpecificFunctions['.url_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\").has(\"url:not(:empty)\")";
jquerySpecificFunctions['.text_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\").has(\"text:not(:empty)\")";
jquerySpecificFunctions['.filename_url_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\").has(\"url:not(:empty),filename:not(:empty)\")";
jquerySpecificFunctions['.filename_url_text_not_empty()'] = ".has(\"asmResource[xsi_type!='context'][xsi_type!='nodeRes']\").has(\"text:not(:empty),url:not(:empty),filename:not(:empty)\")";

Selector = function(jquery,type,filter1,filter2)
{
	this.jquery = jquery;
	this.type = type;
	this.filter1 = filter1;
	this.filter2 = filter2;
};

//==================================
function getSelector(select,test)
//==================================
{
	if (test==null)
	 test = "";
	var selects = select.split("."); // nodetype.semtag.[node|resource] or .[node|resource]
	if (selects[0]=="")
		selects[0] = "*";
	var jquery = selects[0];
	var filter1 = null;
	var filter2 = null;
	if (selects[1]!="") {
		jquery +=":has(metadata[semantictag*='"+selects[1]+"'])";
		filter1 = function(){return $(this).children("metadata[semantictag*='"+selects[1]+"']").length>0};
	}
	var filter2 = test; // test = .has("metadata-wad[submitted='Y']").last()
	for (fct in jquerySpecificFunctions) {
		if (test.indexOf(fct)>-1)
			filter2 = filter2.replace(fct,jquerySpecificFunctions[fct]);
	}
	var type = "";
	if (selects.length>2)
		type = selects[2];
	var selector = new Selector(jquery,type,filter1,filter2);
	return selector;
}

//==================================
function processPortfolio(no,xmlReport,destid,data,line)
//==================================
{
	var children = $(":root",xmlReport).children();
//	var children = $(">*",xmlReport);
	no += destid;
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="table")
			processTable(no+"_"+i,children[i],destid,data,line);
		if (tagname=="row")
			processRow(no+"_"+i,children[i],destid,data,line);
		if (tagname=="cell")
			processCell(no+"_"+i,children[i],destid,data,line);
		if (tagname=="node_resource")
			processNodeResource(children[i],destid,data,line);
		if (tagname=="text")
			processText(children[i],destid,data,line);
		if (tagname=="url2unit")
			processURL2Unit(children[i],destid,data,line);
		if (tagname=="for-each-node")
			processNode(no+"_"+i,children[i],destid,data,line);
		if (tagname=="for-each-portfolio")
			getPortfolios(no+"_"+i,children[i],destid,data,line);
	}
}

//==================================
function report_process(xmlDoc,json)
//==================================
{
	$.ajaxSetup({async: false});
	var children = $(":root",xmlDoc).children();
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="for-each-line")
			processLine(i,children[i],'report-content');
		if (tagname=="for-each-person")
			getUsers(i,children[i],'report-content');
		if (tagname=="for-each-portfolio")
			getPortfolios(i,children[i],'report-content');
		if (tagname=="table")
			processTable(i,children[i],'report-content');
		if (tagname=="aggregate")
			processAggregate(children[i],'report-content');
		if (tagname=="text")
			processText(children[i],'report-content');
		if (tagname=="url2unit")
			processURL2Unit(children[i],'report-content');
	}
	$.ajaxSetup({async: true});
}

//==================================
function processLine(no,xmlDoc,destid,data,line)
//==================================
{
	var ref_init = $(xmlDoc).attr("ref-init");
	//---------------------
	var children = $(">*",xmlDoc);
	for (var i=0; i<json.lines.length; i++){
		if (ref_init!=undefined) {
			var ref_inits = ref_init.split("/"); // ref1/ref2/...
			for (var k=0;k<ref_inits.length;k++)
				aggregates[ref_inits[k]] = new Array();
		}
		for (var j=0; j<children.length;j++){
			var tagname = $(children[j])[0].tagName;
			if (tagname=="for-each-person")
				getUsers(no+"_"+i,children[j],destid,data,i);
			if (tagname=="for-each-portfolio")
				getPortfolios(no+"_"+i,children[j],destid,data,i);
			if (tagname=="table")
				processTable(no+"_"+i,children[j],destid,data,i);
			if (tagname=="row")
				processRow(no+"_"+i,children[j],destid,data,i);
			if (tagname=="aggregate")
				processAggregate(children[i],destid,data,i);
		}
	}
}

//==================================
function processNode(no,xmlDoc,destid,data,line)
//==================================
{
	var select = $(xmlDoc).attr("select");
	var test = $(xmlDoc).attr("test");
	if (select!=undefined) {
		var selector = getSelector(select,test);
		var nodes = $(selector.jquery,data).filter(selector.filter1);
		nodes = eval("nodes"+selector.filter2);
		
		for (var i=0; i<nodes.length;i++){
			//---------------------------
			var ref_init = $(xmlDoc).attr("ref-init");
			if (ref_init!=undefined) {
				var ref_inits = ref_init.split("/"); // ref1/ref2/...
				for (var k=0;k<ref_inits.length;k++)
					aggregates[ref_inits[k]] = new Array();
			}
			//---------------------------
			var children = $(">*",xmlDoc);
			for (var j=0; j<children.length;j++){
				var tagname = $(children[j])[0].tagName;
				if (tagname=="for-each-node")
					processNode(no+"_"+i+"_"+j,children[j],destid,nodes[i],i);
				if (tagname=="table")
					processTable(no+"_"+i+"_"+j,children[j],destid,nodes[i],i);
				if (tagname=="row")
					processRow(no+"_"+i+"_"+j,children[j],destid,nodes[i],i);
				if (tagname=="cell")
					processCell(no+"_"+i+"_"+j,children[j],destid,nodes[i],i);
				if (tagname=="aggregate")
					processAggregate(children[j],destid,nodes[i],i);
				if (tagname=="node_resource")
					processNodeResource(children[j],destid,nodes[i],i);
				if (tagname=="text")
					processText(children[j],destid,nodes[i],i);
				if (tagname=="url2unit")
					processURL2Unit(children[j],destid,nodes[i],i);
				if (tagname=="aggregate")
					processAggregate(children[j],destid,nodes[i],i);
			}
		};
	}
}

//==================================
function processTable(no,xmlDoc,destid,data,line)
//==================================
{
	//---------------------------
	var ref_init = $(xmlDoc).attr("ref-init");
	if (ref_init!=undefined) {
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var k=0;k<ref_inits.length;k++)
			aggregates[ref_inits[k]] = new Array();
	}
	//---------------------------
	var style = $(xmlDoc).attr("style");
	var html = "<table id='table_"+no+"' style='"+style+"'></table>";
	$("#"+destid).append($(html));
	var children = $(">*",xmlDoc);
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="for-each-line")
			processLine(no+"_"+i,xmlDoc,'table_'+no,data,'table_'+no);
		if (tagname=="for-each-person")
			getUsers(no+"_"+i,children[i],'table_'+no,data,line);
		if (tagname=="for-each-portfolio")
			getPortfolios(no+"_"+i,children[i],'table_'+no,data,line);
		if (tagname=="row")
			processRow(no+"_"+i,children[i],'table_'+no,data,line);
		if (tagname=="for-each-node")
			processNode(no+"_"+i,children[i],'table_'+no,data,line);
	};
}

//==================================
function processRow(no,xmlDoc,destid,data,line)
//==================================
{
	//---------------------------
	var ref_init = $(xmlDoc).attr("ref-init");
	if (ref_init!=undefined) {
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var k=0;k<ref_inits.length;k++)
			aggregates[ref_inits[k]] = new Array();
	}
	//---------------------------
	var style = $(xmlDoc).attr("style");
	var html = "<tr id='tr_"+no+"' style='"+style+"'></tr>";
	$("#"+destid).append($(html));
	var children = $(">*",xmlDoc);
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="for-each-person")
			getUsers(no,children[i],'tr_'+no,data,line);
		if (tagname=="for-each-portfolio")
			getPortfolios(no,children[i],'tr_'+no,data,line);
		if (tagname=="cell")
			processCell(no+"_"+i,children[i],'tr_'+no,data,line);
		if (tagname=="for-each-node")
			processNode(no+"_"+i,children[i],'tr_'+no,data,line);
	}
}

//==================================
function processCell(no,xmlDoc,destid,data,line)
//==================================
{
	var style = $(xmlDoc).attr("style");
	var html = "<td id='td_"+no+"' style='"+style+"'></td>";
	$("#"+destid).append($(html));
	var children = $(">*",xmlDoc);
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="for-each-person")
			getUsers(no,children[i],'td_'+no,data,line);
		if (tagname=="for-each-portfolio")
			getPortfolios(no,children[i],'td_'+no,data,line);
		if (tagname=="table")
			processTable(no,children[i],'td_'+no,data,line);
		if (tagname=="node_resource")
			processNodeResource(children[i],'td_'+no,data,line);
		if (tagname=="text")
			processText(children[i],'td_'+no,data,line);
		if (tagname=="url2unit")
			processURL2Unit(children[i],'td_'+no,data,line);
		if (tagname=="aggregate")
			processAggregate(children[i],'td_'+no,data,line);
		if (tagname=="for-each-node")
			processNode(no,children[i],'td_'+no,data,line);
	}
}

//==================================
function getUsers(no,xmlDoc,destid,data,line)
//==================================
{
	var ref_init = $(xmlDoc).attr("ref-init");
	if (ref_init!=undefined) {
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var i=0;i<ref_inits.length;i++)
			aggregates[ref_inits[i]] = new Array();
	}
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/users",
		success : function(data) {
			processUsers(no,xmlDoc,destid,data,line);
		}
	});
}

//==================================
function processUsers(no,xmlDoc,destid,data,line)
//==================================
{
	UIFactory["User"].parse(data);
	var select = $(xmlDoc).attr("select");
	var value = "";
	if (select.indexOf("username=")>-1)
		if (select.indexOf("'")>-1)
			value = select.substring(10,select.length-1);  // inside quote
		else
			value = eval("json.lines["+line+"]."+select.substring(9));
	var condition = false;
	for ( var j = 0; j < UsersActive_list.length; j++) {
		var username = UsersActive_list[j].username_node.text();
		if (select.indexOf("username=")>-1) {
			condition = username.indexOf(value)>-1;
		}
		//------------------------------------
		if (condition){
			userid = UsersActive_list[j].id;
			var children = $(">*",xmlDoc);
			for (var i=0; i<children.length;i++){
				var tagname = $(children[i])[0].tagName;
				if (tagname=="for-each-portfolio")
					getPortfolios(no+"_"+j,children[i],destid,data,line);
				if (tagname=="table")
					processTable(no+"_"+j,children[i],destid,data,line);
				if (tagname=="row")
					processRow(no+"_"+j,children[i],destid,data,line);
				if (tagname=="cell")
					processCell(no+"_"+j,children[i],destid,data,line);
				if (tagname=="node_resource")
					processNodeResource(children[i],destid,data,line);
				if (tagname=="text")
					processText(children[i],destid,data,line);
				if (tagname=="for-each-node")
					processNode(no+"_"+j,children[i],destid,data,line);
			}
		}
			//------------------------------------
	}
}

//==================================
function getPortfolios(no,xmlDoc,destid,data,line)
//==================================
{
	var ref_init = $(xmlDoc).attr("ref-init");
	if (ref_init!=undefined) {
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var i=0;i<ref_inits.length;i++)
			aggregates[ref_inits[i]] = new Array();
	}
	if (userid==null)
		userid = USER.id;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios?active=1&user="+userid,
		success : function(data) {
			processPortfolios(no,xmlDoc,destid,data,line);
		}
	});
}

//==================================
function processPortfolios(no,xmlDoc,destid,data,line)
//==================================
{
	UIFactory["Portfolio"].parse(data);
	var select = $(xmlDoc).attr("select");
	var value = "";
	var condition = "";
	var portfolioid = "";
	for ( var j = 0; j < portfolios_list.length; j++) {
		var code = portfolios_list[j].code_node.text();
//		alertHTML(j+"-"+code);
		if (select.indexOf("code*=")>-1) {
			value = select.substring(7,select.length-1);  // inside quote
			condition = code.indexOf(value)>-1;
		}
		if (select.indexOf("code=")>-1) {
			value = select.substring(6,select.length-1);  // inside quote
			condition = code==value;
		}
		//------------------------------------
		if (condition){
			portfolioid = portfolios_list[j].id;
			$.ajax({
				type : "GET",
				dataType : "xml",
				j : j,
				url : "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?resources=true",
				success : function(data) {
					UICom.parseStructure(data,true, null, null,true);
					var children = $(">*",xmlDoc);
					for (var i=0; i<children.length;i++){
						var tagname = $(children[i])[0].tagName;
						if (tagname=="table")
							processTable(no+"p_"+this.j+"_"+i,children[i],destid,data,line);
						if (tagname=="row")
							processRow(no+"p_"+this.j+"_"+i,children[i],destid,data,line);
						if (tagname=="cell")
							processCell(no+"p_"+this.j+"_"+i,children[i],destid,data,line);
						if (tagname=="node_resource")
							processNodeResource(children[i],destid,data,line);
						if (tagname=="text")
							processText(children[i],destid,data,line);
						if (tagname=="for-each-node")
							processNode(no+"p_"+this.j+"_"+i,children[i],destid,data,line);
					}
				}
			});
		}
			//------------------------------------
	}
}

//==================================
function processNodeResource(xmlDoc,destid,data)
//==================================
{
	var text = "";
	var style = "";
	try {
		var select = $(xmlDoc).attr("select");
		var ref = $(xmlDoc).attr("ref");
		var editresroles = $(xmlDoc).attr("editresroles");
		style = $(xmlDoc).attr("style");
		var selector = getSelector(select);
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
			if (g_designerrole || writenode) {
				writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
			}
			var inline = false;
			var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
			if (inline_metadata=='Y')
				inline = true;
			//----------------------------
			if (inline & writenode) {
				//-----------------------
				if(UICom.structure["ui"][nodeid].resource!=null) {
					try {
						var test = UICom.structure["ui"][nodeid].resource.getEditor();
						text += "<span id='report_get_editor_"+nodeid+"' style='"+style+"'></span>";
					}
					catch(e) {
						text += "<span id='report_display_editor_"+nodeid+"' style='"+style+"'></span>";
					}
				}
			} else {
				var prefix_id = "";
				if (selector.type=='resource') {
					text = UICom.structure["ui"][nodeid].resource.getView("dashboard_"+nodeid);
				}
				if (selector.type=='resource code') {
					text = UICom.structure["ui"][nodeid].resource.getCode();
				}
				if (selector.type=='resource value') {
					text = UICom.structure["ui"][nodeid].resource.getValue("dashboard_value_"+nodeid);
					prefix_id += "value_";
				}
				if (selector.type=='node label') {
					text = UICom.structure["ui"][nodeid].getLabel();
				}
				if (selector.type=='node value') {
					text = UICom.structure["ui"][nodeid].getValue();
				}
				if (selector.type=='node context') {
					text = UICom.structure["ui"][nodeid].getContext("dashboard_context_"+nodeid);
					prefix_id += "context_";
				}
				if (ref!=undefined && ref!="") {
					if (aggregates[ref]==undefined)
						aggregates[ref] = new Array();
					aggregates[ref][aggregates[ref].length] = text;
				}
				text = "<span id='dashboard_"+prefix_id+nodeid+"' style='"+style+"'>"+text+"</span>";
				if (writenode) {
					text += "<span class='button glyphicon glyphicon-pencil' data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+nodeid+"')\" data-title='"+karutaStr[LANG]["button-edit"]+"' data-tooltip='true' data-placement='bottom'></span>";
				}
			}
		}
	} catch(e){
		text = "<span id='dashboard_"+nodeid+"'>&mdash;</span>";
	}
	//------------------------------
	$("#"+destid).append($(text));
	//--------------------set editor------------------------------------------
	if ($("#report_display_editor_"+nodeid).length>0) {
		UICom.structure["ui"][nodeid].resource.displayEditor("report_display_editor_"+nodeid);
	}
	if ($("#report_get_editor_"+nodeid).length>0) {
		$("#report_get_editor_"+nodeid).append(UICom.structure["ui"][nodeid].resource.getEditor());
	}
}

//==================================
function processText(xmlDoc,destid,data)
//==================================
{
	var nodeid = $(data).attr("id");
	var text = $(xmlDoc).text();
	var style = $(xmlDoc).attr("style");
	var ref = $(xmlDoc).attr("ref");
	if (ref!=undefined && ref!="") {
		if (aggregates[ref]==undefined)
			aggregates[ref] = new Array();
		aggregates[ref][aggregates[ref].length] = text;
	}
	text = "<span id='"+nodeid+"'>"+text+"</span>";
	$("#"+destid).append($(text));
	$("#"+nodeid).attr("style",style);
}

//==================================
function processURL2Unit(xmlDoc,destid,data)
//==================================
{
	var nodeid = $(data).attr("id");
	var targetid = "";
	var text = "";
	var style = $(xmlDoc).attr("style");
	var select = $(xmlDoc).attr("select");
	var selector = getSelector(select);
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
	text = "<span id='"+nodeid+"' class='report-url2unit' onclick=\"$('#sidebar_"+targetid+"').click()\">"+label+"</span>";
	$("#"+destid).append($(text));
	$("#"+nodeid).attr("style",style);
}

//==================================
function processAggregate(aggregate,destid)
//==================================
{
	var style = $(xmlDoc).attr("style");
	var ref = $(aggregate).attr("ref");
	var type = $(aggregate).attr("type");
	var select = $(aggregate).attr("select");
	var text = "";
	if (type=="sum" && aggregates[select]!=undefined){
		var sum = 0;
		for (var i=0;i<aggregates[select].length;i++){
			if ($.isNumeric(aggregates[select][i]))
				sum += parseFloat(aggregates[select][i]);
		}
		text = sum;
	}
	if (type=="avg" && aggregates[select]!=undefined){
		var sum = 0;
		for (var i=0;i<aggregates[select].length;i++){
			if ($.isNumeric(aggregates[select][i]))
				sum += parseFloat(aggregates[select][i]);
		}
		text = sum/aggregates[select].length;
	}
	if (ref!=undefined && ref!="") {
		if (aggregates[ref]==undefined)
			aggregates[ref] = new Array();
		aggregates[ref][aggregates[ref].length] = text;
	}
	if (!$.isNumeric(text))
		text="";
	text = "<span>"+text+"</span>";
	$("#"+destid).append($(text));
	$("#"+destid).attr("style",style);
}
//===============================================================
//===============================================================
//===============================================================
//===============================================================

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
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/code/"+model_code,
		success : function(data) {
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to report model
			var urlS = "../../../"+serverBCK+"/nodes/"+nodeid+"?xsl-file="+appliname+"/karuta/xsl/karuta2report.xsl&lang="+LANG;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : urlS,
				success : function(data) {
					g_dashboard_models[model_code] = data;
					try {
						processPortfolio(0,data,destid,node,0);
					}
					catch(err) {
						alertHTML("Error in Dashboard : " + err.message);
					}
					$("#wait-window").modal('hide');
				}
			 });
		}
	});
}

//==================================
function report_getModelAndProcess(model_code,json)
//==================================
{
	$('#wait-window').show();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/code/"+model_code,
		success : function(data) {
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to report model
			var urlS = "../../../"+serverBCK+"/nodes/"+nodeid+"?xsl-file="+appliname+"/karuta/xsl/karuta2report.xsl&lang="+LANG;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : urlS,
				success : function(data) {
					report_process(data,json);
				}
			 });
		}
	});
}

//==================================
function xml2PDF(content)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var data = $('#'+content).html();
	data = data.replace(/&nbsp;/g, ' ');
	data = data.replace(/<br>/g, '<br/>');
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"&amp;#160;\">]><div>" + data + "</div>";
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var urlS =  "../../../"+serverFIL+"/xsl?xsl="+appliname+"/karuta/xsl/html2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverFIL+";url-appli:"+serverURL+"/"+appliname+"&format=application/pdf";
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
	data = data.replace(/<br>/g, '<br/>');
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"&amp;#160;\">]><div>" + data + "</div>";
	var url = window.location.href;
	var serverURL = url.substring(0,url.indexOf(appliname)-1);
	var urlS =  "../../../"+serverFIL+"/xsl?xsl="+appliname+"/karuta/xsl/html2fo.xsl&parameters=lang:"+LANG+";url:"+serverURL+"/"+serverFIL+";url-appli:"+serverURL+"/"+appliname+"&format=application/rtf";
	postAndDownload(urlS,data);
}

//==================================
function displayRTFButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>3</span></h4><button onclick=\"javascript:xml2RTF('report-pdf')\">RTF</button>";
	$("#report-pdf").html(html);
}


//==================================
function xml2CSV(content)
//==================================
{
	$("#wait-window").show(2000,function(){$("#wait-window").hide(1000)});
	var data = $('#'+content).html();
	data = data.replace('&nbsp;', ' ');
	data = "<!DOCTYPE xsl:stylesheet [<!ENTITY nbsp \"&amp;#160;\">]><div>" + data + "</div>";
	var url =  "../../../"+serverFIL+"/xsl?xsl="+appliname+"/karuta/xsl/html2csv.xsl&parameters=lang:"+LANG+"&format=application/csv";
	postAndDownload(url,data);
}

//==================================
function displayCSVButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>4</span></h4><button onclick=\"javascript:xml2CSV('report-content')\">CSV</button>";
	$("#report-csv").html(html);
}


