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


/// Define our type
//==================================
UIFactory["Item"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Item';
	this.code_node = $("code",$("asmResource[xsi_type='Item']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Item']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Item']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Item']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Item']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Item']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display

//==================================
UIFactory["Item"].prototype.getCode = function()
//==================================
{
	return this.code_node.text();
};

//==================================
UIFactory["Item"].prototype.getView = function(dest,type,langcode)
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
	var html = "";
	html += "<span class='code_Item'>"+$(this.code_node).text()+" </span>";
	html +=  "<span class='label_Item'> "+$(this.label_node[langcode]).text()+"</span>";
	return html;
};

/// Editor
//==================================
UIFactory["Item"].update = function(obj,itself,langcode)
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
	var code = $("input[name='code_Item']",obj).val();
	$(itself.code_node).text(code);
	var label = $("input[name='label_Item']",obj).val();
	$(itself.label_node[langcode]).text(label);
	itself.save();
};


//==================================
UIFactory["Item"].prototype.getEditor = function(type,langcode)
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
	if (type==null)
		type = 'default';
	var self = this;
	var obj = $("<span class='item_editor'></span>");
	if(type=='default') {
		$(obj).append($("<label>Item - Code</label>"));
		var input_code = $("<input type='text' name='code_Item' value=\""+$(this.code_node).text()+"\">");
		$(input_code).change(function (){
			UIFactory["Item"].update(obj,self,langcode);
		});
		$(obj).append(input_code);
		//------------------------
		$(obj).append($("<label>Item - "+karutaStr[LANG]['label']+"</label>"));
		var input_label = $("<input type='text' name='label_Item' value=\""+$(this.label_node[langcode]).text()+"\">");
		$(input_label).change(function (){
			UIFactory["Item"].update(obj,self,langcode);
		});
		$(obj).append(input_label);
	}
	//------------------------
	return obj;
};

//==================================
UIFactory["Item"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};


//==================================
UIFactory["Item"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
