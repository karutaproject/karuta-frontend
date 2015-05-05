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

//==================================
UIFactory["Calendar"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Calendar';
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
		if (this.text_node[i].length==0) {
			if (i==0 && $("text",$("asmResource[xsi_type='Calendar']",node)).length==1) { // for WAD6 imported portfolio
				this.text_node[i] = $("text",$("asmResource[xsi_type='Calendar']",node));
			} else {
				var newelement = createXmlElement("text");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Calendar']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Calendar']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["Calendar"].prototype.getView = function(dest,langcode)
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
	return $(this.text_node[langcode]).text();
};

/// Editor
//==================================
UIFactory["Calendar"].update = function(input,itself,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
		var value = $.trim($(input).val());
		$(itself.text_node[langcode]).text(value);
		itself.save();
};

//==================================
UIFactory["Calendar"].prototype.getEditor = function(type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	var html = "";
	html += "<input type='text' name='datepicker' ";
	if (disabled)
		html += "disabled='disabled' ";
	html += "value=\""+$(this.text_node[langcode]).text()+"\" >";
	var obj = $(html);
	var self = this;
	$(obj).change(function (){
		UIFactory["Calendar"].update(obj,self,langcode);
	});
	return obj;
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
