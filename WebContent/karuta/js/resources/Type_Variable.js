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

/// Define our type
//==================================
UIFactory["Variable"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Variable';
	//--------------------
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Variable']",node));
	this.name_node = $("name",$("asmResource[xsi_type='Variable']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Variable']",node));
	this.display = {};
	//--------------------
	this.multilingual = false;
};

//==================================
UIFactory["Variable"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['lastmodified'] = this.lastmodified_node.text();
		result['name'] = this.name_node.text();
		result['value'] = this.value_node.text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Variable"].prototype.getView = function(dest,type,langcode)
//==================================
{
	if (dest!=null) {
		this.display[dest]=type;
	}
	var html = $(this.name_node).text()+ " = "+$(this.value_node).text();
	if (html==" = ")
		html="";
	return html;
};

//==================================
UIFactory["Variable"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Variable"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Variable"].prototype.displayEditor = function(dest,type,langcode,disabled)
//==================================
{
	if (disabled==null)
		disabled = false;
	//---------------------
	var htmlFormObj = $("<form class='form-horizontal' style='margin-top:10px'></form>");
	//---------------------
	var name = $(this.name_node).text();
	var htmlNameGroupObj = $("<div class='form-group'></div>")
	var htmlNameLabelObj = $("<label for='Name_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['var-name']+"</label>");
	var htmlNameDivObj = $("<div class='col-sm-9'></div>");
	var htmlNameInputObj = $("<input id='name_"+this.id+"' type='text' class='form-control' value=\""+name+"\">");
	var self = this;
	$(htmlNameInputObj).change(function (){
		$($("metadata",self.node)[0]).attr('semantictag','g-variable '+$(this).val());
		UICom.UpdateMetadata(self.id);
		$(self.name_node).text($(this).val());
		self.save();
	});
	$(htmlNameDivObj).append($(htmlNameInputObj));
	$(htmlNameGroupObj).append($(htmlNameLabelObj));
	$(htmlNameGroupObj).append($(htmlNameDivObj));
	$(htmlFormObj).append($(htmlNameGroupObj));
	//---------------------
	var value = $(this.value_node).text();
	var htmlValueGroupObj = $("<div class='form-group'></div>")
	var htmlValueLabelObj = $("<label for='Value_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['var-value']+"</label>");
	var htmlValueDivObj = $("<div class='col-sm-9'></div>");
	var htmlValueInputObj = $("<input id='Value_"+this.id+"' type='text' class='form-control' value=\""+value+"\">");
	$(htmlValueInputObj).change(function (){
		$(self.value_node).text($(this).val());
		self.save();
	});
	$(htmlValueDivObj).append($(htmlValueInputObj));
	$(htmlValueGroupObj).append($(htmlValueLabelObj));
	$(htmlValueGroupObj).append($(htmlValueDivObj));
	$(htmlFormObj).append($(htmlValueGroupObj));
	//---------------------
	$("#"+dest).append(htmlFormObj);
	//---------------------
};

//==================================
UIFactory["Variable"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Variable"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null));
	};

};
