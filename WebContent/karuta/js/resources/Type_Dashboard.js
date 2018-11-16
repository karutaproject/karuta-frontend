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
UIFactory["Dashboard"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Dashboard';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("csv",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("csv");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.csv_node = $("csv",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("pdf",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("pdf");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.pdf_node = $("pdf",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	if ($("img",$("asmResource[xsi_type='Dashboard']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("img");
		$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
	}
	this.img_node = $("img",$("asmResource[xsi_type='Dashboard']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Dashboard']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Dashboard']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Dashboard']",node));
		}
	}
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Dashboard"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
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
UIFactory["Dashboard"].prototype.getView = function(dest,langcode)
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
UIFactory["Dashboard"].update = function(itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Dashboard"].prototype.getEditor = function(type,langcode,disabled)
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
	if (type==null)
		type = 'default';
	var self = this;
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	if(type=='default') {
		//-----------------------------------------------------
		var htmlTextGroupObj = $("<div class='form-group'></div>")
		var htmlTextLabelObj = $("<label for='text_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['dashboard-code']+"</label>");
		var htmlTextDivObj = $("<div class='col-sm-9'></div>");
		var htmlTextInputObj = $("<input id='text_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+this.text_node[langcode].text()+"\">");
		$(htmlTextInputObj).change(function (){
			$(self.text_node[langcode]).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlTextDivObj).append($(htmlTextInputObj));
		$(htmlTextGroupObj).append($(htmlTextLabelObj));
		$(htmlTextGroupObj).append($(htmlTextDivObj));
		$(htmlFormObj).append($(htmlTextGroupObj));
		//-----------------------------------------------------
		var htmlCsvGroupObj = $("<div class='form-group'></div>")
		var htmlCsvLabelObj = $("<label for='csv_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['csv']+"</label>");
		var htmlCsvDivObj = $("<div class='col-sm-9'></div>");
		var htmlCsvInputObj = $("<input id='csv_"+this.id+"' type='text' class='form-control' value=\""+this.csv_node.text()+"\">");
		$(htmlCsvInputObj).change(function (){
			$(self.csv_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlCsvDivObj).append($(htmlCsvInputObj));
		$(htmlCsvGroupObj).append($(htmlCsvLabelObj));
		$(htmlCsvGroupObj).append($(htmlCsvDivObj));
		$(htmlFormObj).append($(htmlCsvGroupObj));
		//-----------------------------------------------------
		var htmlpdfGroupObj = $("<div class='form-group'></div>")
		var htmlpdfLabelObj = $("<label for='pdf_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['pdf']+"</label>");
		var htmlpdfDivObj = $("<div class='col-sm-9'></div>");
		var htmlpdfInputObj = $("<input id='pdf_"+this.id+"' type='text' class='form-control' value=\""+this.pdf_node.text()+"\">");
		$(htmlpdfInputObj).change(function (){
			$(self.pdf_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlpdfDivObj).append($(htmlpdfInputObj));
		$(htmlpdfGroupObj).append($(htmlpdfLabelObj));
		$(htmlpdfGroupObj).append($(htmlpdfDivObj));
		$(htmlFormObj).append($(htmlpdfGroupObj));
		//-----------------------------------------------------
		var htmlimgGroupObj = $("<div class='form-group'></div>")
		var htmlimgLabelObj = $("<label for='img_"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['img']+"</label>");
		var htmlimgDivObj = $("<div class='col-sm-9'></div>");
		var htmlimgInputObj = $("<input id='img_"+this.id+"' type='text' class='form-control' value=\""+this.img_node.text()+"\">");
		$(htmlimgInputObj).change(function (){
			$(self.img_node).text($(this).val());
			UIFactory["Dashboard"].update(self,langcode);
		});
		$(htmlimgDivObj).append($(htmlimgInputObj));
		$(htmlimgGroupObj).append($(htmlimgLabelObj));
		$(htmlimgGroupObj).append($(htmlimgDivObj));
		$(htmlFormObj).append($(htmlimgGroupObj));
	}
	//------------------------
	return htmlFormObj;

};


//==================================
UIFactory["Dashboard"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Dashboard"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
