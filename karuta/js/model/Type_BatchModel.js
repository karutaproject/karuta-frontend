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

var batchmodel_list = [];

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["BatchModel"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	//------------------------------
	this.code = $($("code",node)[0]).text();
	//------------------------------
	this.batch_model_description_nodeid = $("asmContext:has(metadata[semantictag='batch_model_description'])",node).attr('id');
	this.batch_model_file_nodeid = $("asmContext:has(metadata[semantictag='batch_model_file'])",node).attr('id');
	this.display = {};
};




//==================================
UIFactory["BatchModel"].prototype.getView = function(dest,type,lang)
//==================================
{
	if (lang==null)
		lang = LANG;
	if (dest!=null) {
		this.display[dest]=lang;
	}
	var html = "";
	if (type=='list') {
		html += "<tr><td><input type='radio' name='batch_model' value='"+this.batch_model_file_nodeid+"'/></td>";
		html += "<td><b>" + UICom.structure["ui"][this.id].getLabel() +"</b>";
		html += UICom.structure["ui"][this.batch_model_description_nodeid].resource.getView() +"</td></tr>";
	}
	if (type=='desc') {
		html += "<h5>" + UICom.structure["ui"][this.id].getLabel() +"</h5>";
		html += UICom.structure["ui"][this.batch_model_description_nodeid].resource.getView();
	}
	return html;
};



//==================================
UIFactory["BatchModel"].parse = function(data) 
//==================================
{
	batchmodel_list = [];
	var units = $("asmUnit:has(metadata[semantictag='batch_model'])",data);
	for ( var i = 0; i < units.length; i++) {
		batchmodel_list[i] = new UIFactory["BatchModel"](units[i]);
	}
};

//==================================
UIFactory["BatchModel"].displayAll = function(destid,type)
//==================================
{
	var html ="<table id='batchmodel_list_table'>";
	for ( var i = 0; i < batchmodel_list.length; i++) {
		html += batchmodel_list[i].getView(null,'list');
	};
	html += "</table>";
	$("#"+destid).html(html);
};

//==================================
UIFactory["BatchModel"].displayByCode = function(destid,type,code)
//==================================
{
	var html ="";
	for ( var i = 0; i < batchmodel_list.length; i++) {
		if (batchmodel_list[i].code==code)
			html += batchmodel_list[i].getView(null,type);
	};
	$("#"+destid).html(html);
};

//==================================
UIFactory["BatchModel"].getByCode = function(code)
//==================================
{
	var node = null;
	for ( var i = 0; i < batchmodel_list.length; i++) {
		if (batchmodel_list[i].code==code)
			node = batchmodel_list[i];
	};
	return node;
};