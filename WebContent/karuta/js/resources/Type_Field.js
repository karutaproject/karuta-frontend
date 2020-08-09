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
UIFactory["Field"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Field';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Field']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Field']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Field']",node));
	//--------------------
	if ($("user",$("asmResource[xsi_type='Field']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("user");
		$("asmResource[xsi_type='Field']",node)[0].appendChild(newelement);
	}
	this.user_node = $("user",$("asmResource[xsi_type='Field']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Field']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Field']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Field']",node));
		}
	}
	//--------------------
	this.display = {};
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
		this.save(true);
	}
	//--------------------
};

//==================================
UIFactory["Field"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['lastmodified'] = this.lastmodified_node.text();
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Field"].prototype.getView = function(dest,type,langcode)
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
	return html;
};

//==================================
UIFactory["Field"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Field"].prototype.update = function(langcode)
//==================================
{
	$(this.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (!this.multilingual) {
		var value = $(this.text_node[langcode]).text();
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.text_node[langcode]).text(value);
		}
	}
	//---------------------
	this.save();
};

//==================================
UIFactory["Field"].prototype.getEditor = function(type,langcode,disabled)
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
	var html = "";
	html += "<input type='text' class='form-control'";
	if (disabled)
		html += "disabled='disabled' ";
	html += "value=''>";
	var obj = $(html);
	$(obj).attr('value',value);
	var self = this;
	$(obj).change(function (){
		$(self.text_node[langcode]).text($(this).val());
		self.update(langcode);
	});
	return obj;
};

//==================================
UIFactory["Field"].prototype.displayEditor = function(dest,type,langcode,disabled)
//==================================
{
	var obj = this.getEditor(type,langcode,disabled);
	$("#"+dest).append(obj);
};

//==================================
UIFactory["Field"].prototype.save = function(version)
//==================================
{
	if (version ==null)
		version = false;
	if (!version && UICom.structure.ui[this.id]!=undefined && UICom.structure.ui[this.id].logcode!=undefined && UICom.structure.ui[this.id].logcode!="") {
		$(this.user_node).text(USER.firstname+" "+USER.lastname);
		UICom.structure.ui[this.id].log();
	}
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Field"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
