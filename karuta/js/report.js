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

Selector = function(jquery,type,filter)
{
	this.jquery = jquery;
	this.type = type;
	this.filter = filter;
};

//==================================
function getSelector(select,test)
//==================================
{
	var selects = select.split("."); // nodetype.semtag.[node|resource] or .[node|resource]
		if (selects[0]=="")
			selects[0] = "*";
		var jquery = selects[0];
		var filter = "";
		if (selects[1]!="") {
			jquery +=":has(metadata[semantictag='"+selects[1]+"'])";
			filter = function(){return $(this).children("metadata[semantictag='"+selects[1]+"']").length>0};
		}
		if (test!=null && test!='')
			jquery +=":has("+test+")";
		var type = selects[2];
		var selector = new Selector(jquery,type,filter);
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
		if (tagname=="for-each-node")
			processNode(no+"_"+i,children[i],destid,data,line);
	}
}

//==================================
function process(xmlDoc,json)
//==================================
{
	var children = $(":root",xmlDoc).children();
	for (var i=0; i<children.length;i++){
		var tagname = $(children[i])[0].tagName;
		if (tagname=="for-each-line")
			processLine(i,children[i],'content');
		if (tagname=="for-each-person")
			getUsers(i,children[i],'content');
		if (tagname=="for-each-portfolio")
			getPortfolios(i,children[i],'content');
		if (tagname=="table")
			processTable(i,children[i],'content');
		if (tagname=="aggregate")
			processAggregate(children[i],'content');
		if (tagname=="text")
			processText(children[i],'content');
	}
	displayPDFButton();
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
		var nodes = $(selector.jquery,data).filter(selector.filter);
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
					processAggregate(children[i],destid,nodes[i],i);
				if (tagname=="node_resource")
					processNodeResource(children[i],destid,nodes[i],i);
				if (tagname=="text")
					processText(children[i],destid,nodes[i],i);
				if (tagname=="aggregate")
					processAggregate(children[i],destid,nodes[i],i);
			}
		};
	}
}

//==================================
function processTable(no,xmlDoc,destid,data,line)
//==================================
{
	var ref_init = $(xmlDoc).attr("ref-init");
	if (ref_init!=undefined) {
		var ref_inits = ref_init.split("/"); // ref1/ref2/...
		for (var i=0;i<ref_inits.length;i++)
			aggregates[ref_inits[i]] = new Array();
	}
	var html = "<table id='table_"+no+"'></table>";
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
	var html = "<tr id='tr_"+no+"'></tr>";
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
	var html = "<td id='td_"+no+"'></td>";
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
				url : "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?resources=true",
				success : function(data) {
					UICom.parseStructure(data,true);
					var children = $(">*",xmlDoc);
					for (var i=0; i<children.length;i++){
						var tagname = $(children[i])[0].tagName;
						if (tagname=="table")
							processTable(no+"_"+j+"_"+i,children[i],destid,data,line);
						if (tagname=="row")
							processRow(no+"_"+j+"_"+i,children[i],destid,data,line);
						if (tagname=="cell")
							processCell(no+"_"+j+"_"+i,children[i],destid,data,line);
						if (tagname=="node_resource")
							processNodeResource(children[i],destid,data,line);
						if (tagname=="text")
							processText(children[i],destid,data,line);
						if (tagname=="for-each-node")
							processNode(no+"_"+j+"_"+i,children[i],destid,data,line);
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
		style = $(xmlDoc).attr("style");
		var selector = getSelector(select);
		var node = $(selector.jquery,data);
		if (node.length==0) // try the node itself
			node = $(selector.jquery,data).addBack();
		if (select.substring(0,2)=="..") // node itself
			node = data;
		if (node.length>0 || select.substring(0,1)=="."){
			var nodeid = $(node).attr("id");
			if (selector.type=='resource')
				text = UICom.structure["ui"][nodeid].resource.getView();
			if (selector.type=='resource code')
				text = UICom.structure["ui"][nodeid].resource.getValue();
			if (selector.type=='node label')
				text = UICom.structure["ui"][nodeid].getLabel();
		}
		if (ref!=undefined && ref!="") {
			if (aggregates[ref]==undefined)
				aggregates[ref] = new Array();
			aggregates[ref][aggregates[ref].length] = text;
		}
	} catch(e){
		text = "&mdash;";
	}
	text = "<span>"+text+"</span>";
	$("#"+destid).attr("style",style);
	$("#"+destid).append($(text));
}

//==================================
function processText(xmlDoc,destid,data)
//==================================
{
	var text = $(xmlDoc).text();
	var style = $(xmlDoc).attr("style");
	text = "<span>"+text+"</span>";
	$("#"+destid).attr("style",style);
	$("#"+destid).append($(text));
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
	if (type=="sum"){
		var sum = 0;
		for (var i=0;i<aggregates[select].length;i++){
			sum += parseInt(aggregates[select][i]);
		}
		text = sum;
	}
	if (type=="avg"){
		var sum = 0;
		for (var i=0;i<aggregates[select].length;i++){
			sum += parseInt(aggregates[select][i]);
		}
		text = sum/aggregates[select].length;
	}
	if (ref!=undefined && ref!="") {
		if (aggregates[ref]==undefined)
			aggregates[ref] = new Array();
		aggregates[ref][aggregates[ref].length] = text;
	}
	text = "<span>"+text+"</span>";
	$("#"+destid).attr("style",style);
	$("#"+destid).append($(text));
}
//===============================================================
//===============================================================
//===============================================================
//===============================================================

//==================================
function processCode()
//==================================
{
	var model_code = $("#model_code").val();
	getModelAndProcess(model_code);
}

//==================================
function getModelAndPortfolio(model_code,node,destid,g_dashboard_models)
//==================================
{
	var xml_model = "";
	$("#wait-window").modal('show');
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
					processPortfolio(0,data,destid,node,0);
					$("#wait-window").modal('hide');
				}
			 });
		}
	});
}

//==================================
function getModelAndProcess(model_code,json)
//==================================
{
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
					process(data,json);
				}
			 });
		}
	});
}

//==================================
function xml2PDF()
//==================================
{
	var data = $('#content').html();
	data = data.replace('&nbsp;', ' ');
	var url =  "../../../"+serverFIL+"/xsl?xsl="+appliname+"/karuta/xsl/html2fo.xsl&format=application/pdf";
	postAndDownload(url,data);
}

//==================================
function displayPDFButton()
//==================================
{
	var html = "<h4 class='line'><span class='badge'>3</span></h4><button onclick='javascript:xml2PDF()''>pdf</button>";
	$("#pdf").html(html);
}
