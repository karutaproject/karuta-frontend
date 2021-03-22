/* =======================================================
	Copyright 2020 - ePortfolium - Licensed under the
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
UIFactory["Calendar"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Calendar';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Calendar']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Calendar']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Calendar']",node));
	//--------------------
	this.minViewMode_node = $("minViewMode",$("asmResource[xsi_type='Calendar']",node));
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Calendar']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
		}
	}
	this.format_node = [];
	for (var i=0; i<languages.length;i++){
		this.format_node[i] = $("format[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
		if (this.format_node[i].length==0) {
			var newelement = createXmlElement("format");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Calendar']",node)[0].appendChild(newelement);
			this.format_node[i] = $("format[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
		}
	}
	//--------------------
	if ($("utc",$("asmResource[xsi_type='Calendar']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("utc");
		$("asmResource[xsi_type='Calendar']",node)[0].appendChild(newelement);
	}
	this.utc = $("utc",$("asmResource[xsi_type='Calendar']",node))
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
			$(this.format_node[langcode]).text($(this.format_node[0]).text());
		}
		this.save();
	}
	//--------------------
	this.display = {};
};

//==================================
UIFactory["Calendar"].prototype.getAttributes = function(type,langcode)
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
		result['minViewMode'] = this.minViewMode_node[langcode].text();
		result['text'] = this.text_node[langcode].text();
		result['format'] = this.format_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Calendar"].prototype.getView = function(dest,type,langcode)
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
UIFactory["Calendar"].prototype.displayView = function(dest,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = $(this.text_node[langcode]).text();
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Calendar"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (!itself.multilingual) {
		var text = $(itself.text_node[langcode]).text();
		var format = $(itself.format_node[langcode]).text();
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.text_node[langcode]).text(text);
			$(itself.format_node[langcode]).text(format);
		}
	}
	//---------------------
	itself.save();
};

//==================================
UIFactory["Calendar"].prototype.displayEditor = function(dest,type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (disabled==null)
		disabled = false;
	//---------------------
	var html = "<form class='form-horizontal' role='form'></form>";
	var form = $(html);
	//------
	html = "<input type='text' name='datepicker' class='datepicker form-control' style='width:150px;' ";
	if (disabled)
		html += "disabled='disabled' ";
	html += "value=\""+$(this.text_node[langcode]).text()+"\" >";
	var input1 = $(html);
	var self = this;
	$(input1).change(function (){
		$(self.text_node[langcode]).text($(this).val());
		UIFactory["Calendar"].update(self,langcode);
	});
	var format = $(this.format_node[langcode]).text();
	if (format.length<2)
		format = "yyyy/mm/dd";
	var minViewMode = $(this.minViewMode_node).text();
	if (minViewMode.length==0)
		minViewMode = "days";
	$(input1).datepicker({minViewMode:minViewMode,format:format,language:LANG});
	$(input1).datepicker().on('changeDate', function (ev) {
		$(self.utc).text(ev.date.getTime());
	});
	$(form).append(input1);
	//------
	if (g_userroles[0]=='designer' || USER.admin){
		var group2 = $("<div class='form-group calendar-format'><label class='col-sm-3 control-label'>Display Format</label></div>");
		var div2 = $("<div class='col-sm-9'></div>");
		html = "<input type='text' class='form-control' style='width:150px;' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += "value=\""+$(this.format_node[langcode]).text()+"\" >";
		var input2 = $(html);
		var self = this;
		$(input2).change(function (){
			$(self.format_node[langcode]).text($(this).val());
			UIFactory["Calendar"].update(self,langcode);
		});
		$(div2).append(input2);
		$(group2).append(div2);
		$(form).append(group2);
		//---
		var group3 = $("<div class='form-group calendar-format'><label class='col-sm-3 control-label'>Pick Format</label></div>");
		var div3 = $("<div class='col-sm-9'></div>");
		html = "<input type='radio' name='radio"+this.id+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		if ($(this.minViewMode_node).text()=='days')
			html += "checked='true' ";
		html += "value='days'  > Days </input>";
		var input3_1 = $(html);
		$(input3_1).click(function (){
			$(self.minViewMode_node).text($(this).val());
			UIFactory["Calendar"].update(self,langcode);
		});
		$(div3).append(input3_1);
		html = "<input type='radio' name='radio"+this.id+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		if ($(this.minViewMode_node).text()=='months')
			html += "checked='true' ";
		html += "value='months' > Months </input>";
		var input3_2 = $(html);
		$(input3_2).click(function (){
			$(self.minViewMode_node).text($(this).val());
			UIFactory["Calendar"].update(self,langcode);
		});
		$(div3).append(input3_2);
		html = "<input type='radio' name='radio"+this.id+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		if ($(this.minViewMode_node).text()=='years')
			html += "checked='true' ";
		html += "value='years' > Years </input>";
		var input3_3 = $(html);
		$(input3_3).click(function (){
			$(self.minViewMode_node).text($(this).val());
			UIFactory["Calendar"].update(self,langcode);
		});
		$(div3).append(input3_3);
		$(group3).append(div3);
		$(form).append(group3);
		}
	//-----
	$("#"+dest).append(form);
};


//==================================
UIFactory["Calendar"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Calendar"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};

//============================================================
//============================================================
//============================================================
//============================================================

//==================================
function importAndSetDateToday(parentid,targetid,label,srce,part_semtag,calendar_semtag)
//==================================
{
	$.ajaxSetup({async: false});
	var databack = true;
	var callback = UIFactory.Calendar.updateaddedpart;
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	importBranch(parentid,replaceVariable(srce),part_semtag,databack,callback,calendar_semtag);
};


//==================================
UIFactory["Calendar"].updateaddedpart = function(data,calendar_semtag)
//==================================
{
	var partid = data;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+partid,
		success : function(data) {
			var node = $("asmContext:has(metadata[semantictag='"+calendar_semtag+"'])",data);
			if (node.length==0)
				node = $( ":root",data ); //node itself
			var nodeid = $(node).attr('id');
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			//---------------------------
			var resource = $("asmResource[xsi_type='Calendar']",node);
			var today = new Date();
			var label = today.toLocaleString().substring(0,10);
			var utc = today.getTime();
			$("text[lang='"+LANG+"']",resource).text(label);
			$("utc",resource).text(utc);
			var data = "<asmResource xsi_type='Calendar'>" + $(resource).html() + "</asmResource>";
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			//---------------------------
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : strippeddata,
				url : url_resource,
				success : function(data) {
						UIFactory.Node.reloadUnit();
				}
			});
		}
	});
}

