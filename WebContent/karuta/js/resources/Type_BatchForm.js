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
UIFactory["BatchForm"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'BatchForm';
	//--------------------
	this.execroles_nodeid = $("asmContext:has(metadata[semantictag='execroles'])",node).attr('id');
	this.model_code_nodeid = $("asmContext:has(metadata[semantictag='model_code'])",node).attr('id');
	//--------------------
	this.batchform_line0_node = $("asmUnitStructure:has(metadata[semantictag*='BatchFormLine0'])",node);
	this.batchform_lines_node = $("asmUnitStructure:has(metadata[semantictag*='BatchFormLines'])",node);
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["BatchForm"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var execroles = UICom.structure["ui"][this.execroles_nodeid].resource.getView();
	var model_code = UICom.structure["ui"][this.model_code_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	return html;
};

//==================================
UIFactory["BatchForm"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var execroles = UICom.structure["ui"][this.execroles_nodeid].resource.getView();
	var model_code = UICom.structure["ui"][this.model_code_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	$("#"+dest).html(html);
};

//==================================
UIFactory["BatchForm"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var execroles = UICom.structure["ui"][this.execroles_nodeid];
	var model_code = UICom.structure["ui"][this.model_code_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
}

//==================================
UIFactory["BatchForm"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};

//==================================
UIFactory["BatchForm"].prototype.getButtons = function(dest,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var execroles = UICom.structure["ui"][this.execroles_nodeid].resource.getView();
	var html = "<div class='btn-group'>";
	if (execroles.containsArrayElt(g_userroles)|| USER.admin || g_userroles[0]=='designer'){
		html += "<span id='exec-"+this.id+"' class='button text-button' onclick=\"javascript:UIFactory.BatchForm.execBatch('"+this.id+"')\" ";
		html += " >"+karutaStr[languages[langcode]]['exec']+"</span>";
	}
	html += "</div><!-- class='btn-group' -->";
	if (html!="")
		html = "<div class='buttons-menus' id='btn-spec-"+this.id+"'>" + html + "</div><!-- #btn-+node.id -->";
	return html;

};

//==================================================
UIFactory['BatchForm'].execBatch = function(nodeid)
//==================================================
{
	UIFactory.BatchForm.display_execBatch();
	//---------------------
	var node = UICom.structure.ui[nodeid].structured_resource;
	var model_code = UICom.structure["ui"][node.model_code_nodeid].resource.getView();
	initBatchVars();
	g_json = UIFactory['BatchForm'].getInputsLine(node.batchform_line0_node);
	g_json['model_code'] = model_code;
	g_json['lines'] = [];
	var lines_inputs = $("asmUnitStructure:has(metadata[semantictag*='BatchFormLine'])",node.batchform_lines_node);
	for ( var i = 0; i < lines_inputs.length; i++) {
		g_json.lines[g_json.lines.length] = UIFactory['BatchForm'].getInputsLine(lines_inputs[i]);
	}
	//------------------------------
	getModelAndProcess(g_json.model_code);
	//---------------------
	$("#wait-window").modal('hide');
};

//==================================================
UIFactory['BatchForm'].getInputsLine = function(node)
//==================================================
{
	line_inputs = $("asmContext:has(metadata[semantictag*='BatchFormInput'])",node);
	var g_json_line = {};
	for ( var j = 0; j < line_inputs.length; j++) {
		var inputid = $(line_inputs[j]).attr('id');
		code = UICom.structure["ui"][inputid].getCode();
		g_json_line[code] = UICom.structure["ui"][inputid].resource.getView(null,'batchform');
	}
	return g_json_line;
};

//==================================
UIFactory["BatchForm"].display_execBatch = function()
//==================================
{
//	$("#wait-window").modal('show');
	$("#main-exec-batch").html('');
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	$("#edit-window-title").html("KARUTA - "+karutaStr[LANG]['batch']);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='batch-log' style='margin-left:20px;margin-top:20px'></div>";
	$("#edit-window-body").html(html);
	//---------------------
	$('#edit-window').modal('show');
};
