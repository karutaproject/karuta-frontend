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


/// Define our type
//==================================
UIFactory["Color"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Color';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Color']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Color']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Color']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Color']",node));
		if (this.text_node[i].length==0) {
			if (i==0 && $("text",$("asmResource[xsi_type='Color']",node)).length==1) { // for WAD6 imported portfolio
				this.text_node[i] = $("text",$("asmResource[xsi_type='Color']",node));
			} else {
				var newelement = createXmlElement("text");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Color']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Color']",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
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
		}
		this.save();
	}
	//--------------------
	this.display = {};
};

//==================================
UIFactory["Color"].prototype.getAttributes = function(type,langcode)
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
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

/// Display

//==================================
UIFactory["Color"].prototype.getValue = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var value = $(this.text_node[langcode]).text();
	if (this.encrypted)
		value = decrypt(html.substring(3),g_rc4key);
//	if (value.charAt(0) != "#") value = "#"+value;
	return value;
};

//==================================
UIFactory["Color"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var value = $(this.text_node[langcode]).text();
	if (this.encrypted)
		value = decrypt(html.substring(3),g_rc4key);
	var html = "<span style='display:inline-block;width:1.5em;background-color:"+value+"'>&nbsp;&nbsp;&nbsp;</span>&nbsp;"+value; 
	return html;
};

//==================================
UIFactory["Color"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var value = $(this.text_node[langcode]).text();
	if (this.encrypted)
		value = decrypt(html.substring(3),g_rc4key);
	var html = "<span style='display:inline-block;width:1.5em;background-color:"+value+"'>&nbsp;&nbsp;&nbsp;</span>&nbsp;"+value; 
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Color"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	if (!itself.multilingual) {
		var text = $(itself.text_node[langcode]).text();
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.text_node[langcode]).text(text);
		}
	}
	itself.save();
}

//==================================
UIFactory["Color"].prototype.getEditor = function(type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (disabled==null)
		disabled = false;
	//---------------------
	var value = $(this.text_node[langcode]).text();
	if (this.encrypted)
		value = decrypt(value.substring(3),g_rc4key);
	var obj = $("<div></div>");
	var obj1 = $("<div style='margin-bottom:30px'></div>");
	var input = "<input type='text' class='pickcolor' style='width:150px;' ";
	if (disabled)
		input += "disabled='disabled' ";
	input += "value=\""+value+"\" >";
	var input_obj = $(input);
	var self = this;
	$(input_obj).on("change.color", function(event, color){
		$(self.text_node[langcode]).text($(this).val());
		UIFactory["Color"].update(self,langcode);
	});
	$(obj1).append($(input_obj));
	$(obj).append($(obj1));
	
	return obj;
};

//==================================
UIFactory["Color"].prototype.displayEditor = function(dest,type,langcode,disabled)
//==================================
{
	var obj = this.getEditor(type,langcode,disabled);
	$("#"+dest).append(obj);
}
//==================================
UIFactory["Color"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Color"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
