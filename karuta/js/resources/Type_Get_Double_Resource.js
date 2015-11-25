/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Get_Double_Resource"] = function(node,condition)
//==================================
{
	var clause = "xsi_type='Get_Double_Resource'";
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Double_Resource';
	//-----------------------
	this.value1_node = $("value1",$("asmResource[xsi_type='Get_Double_Resource']",node));
	this.code1_node = $("code1",$("asmResource["+clause+"]",node));
	this.label1_node = [];
	for (var i=0; i<languages.length;i++){
		this.label1_node[i] = $("label1[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
		if (this.label1_node[i].length==0) {
			if (i==0 && $("label1",$("asmResource[xsi_type='Get_Double_Resource']",node)).length==1) { // for WAD6 imported portfolio
				this.label1_node[i] = $("text",$("asmResource[xsi_type='Get_Double_Resource']",node));
			} else {
				var newelement = createXmlElement("label1");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Double_Resource']",node)[0].appendChild(newelement);
				this.label1_node[i] = $("label1[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
			}
		}
	}
	//-----------------------
	this.value2_node = $("value2",$("asmResource[xsi_type='Get_Double_Resource']",node));
	this.code2_node = $("code2",$("asmResource["+clause+"]",node));
	this.label2_node = [];
	for (var i=0; i<languages.length;i++){
		this.label2_node[i] = $("label2[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
		if (this.label2_node[i].length==0) {
			if (i==0 && $("label2",$("asmResource[xsi_type='Get_Double_Resource']",node)).length==1) { // for WAD6 imported portfolio
				this.label2_node[i] = $("text",$("asmResource[xsi_type='Get_Double_Resource']",node));
			} else {
				var newelement = createXmlElement("label2");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Double_Resource']",node)[0].appendChild(newelement);
				this.label2_node[i] = $("label2[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
			}
		}
	}
	//-----------------------
	this.separator_node = [];
	for (var i=0; i<languages.length;i++){
		this.separator_node[i] = $("separator[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
		if (this.separator_node[i].length==0) {
			var newelement = createXmlElement("separator");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='Get_Double_Resource']",node)[0].appendChild(newelement);
			this.separator_node[i] = $("separator[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Double_Resource']",node));
		}
	}
	//-----------------------
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Get_Double_Resource"].prototype.getAttributes = function(type,langcode)
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
		result['value1'] = this.value1_node.text();
		result['code1'] = this.code1_node.text();
		result['label1'] = this.label1_node[langcode].text();
		result['separator'] = this.separator_node[langcode].text();
		result['value2'] = this.value2_node.text();
		result['code2'] = this.code2_node.text();
		result['label2'] = this.label2_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Get_Double_Resource"].prototype.getView = function(dest,type,langcode)
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
	//---------------------	
	var label1 = this.label1_node[langcode].text();
	if (this.encrypted)
		label1 = decrypt(label1.substring(3),g_rc4key);
	var label2 = this.label2_node[langcode].text();
	if (this.encrypted)
		label2 = decrypt(label2.substring(3),g_rc4key);
	//---------------------	
	 var html = "";
	 html += "<span class='Item1'>"+label1+" </span>";
	 html += this.separator_node[langcode].text();
	 html +=  "<span class='Item2'> "+label2+"</span>";
	 return html;
};



/// Editor
//==================================
UIFactory["Get_Double_Resource"].update = function(itself,langcode,type)
//==================================
{
	if (itself.encrypted) {
		$(itself.label1_node).text("rc4"+encrypt($(itself.label1_node).text(),g_rc4key));
		$(itself.code1_node).text("rc4"+encrypt($(itself.code1_node).text(),g_rc4key));
		$(itself.value1_node).text("rc4"+encrypt($(itself.value1_node).text(),g_rc4key));
		$(itself.label2_node).text("rc4"+encrypt($(itself.label2_node).text(),g_rc4key));
		$(itself.code2_node).text("rc4"+encrypt($(itself.code2_node).text(),g_rc4key));
		$(itself.value2_node).text("rc4"+encrypt($(itself.value2_node).text(),g_rc4key));
	}
	itself.save();
};

//==================================
UIFactory["Get_Double_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------------
		var separator_indx = queryattr_value.indexOf(';');
		var part1 = queryattr_value.substring(0,separator_indx);
		var part2 = queryattr_value.substring(separator_indx+1);
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		//------------------
		var srce1_indx = part1.lastIndexOf('.');
		var srce1 = part1.substring(srce1_indx+1);
		var semtag1_indx = part1.substring(0,srce1_indx).lastIndexOf('.');
		var semtag1 = part1.substring(semtag1_indx+1,srce1_indx);
		var code1 = part1.substring(0,semtag1_indx);
		if (code1.indexOf('.')<0 && code1!='self')  // There is no project, we add the project of the current portfolio
			code1 = selfcode.substring(0,selfcode.indexOf('.')) + "." + code1;
		if (code1=='self')
			code1 = selfcode;
		//------------------
		var srce2_indx = part2.lastIndexOf('.');
		var srce2 = part2.substring(srce2_indx+2);
		var semtag2_indx = part2.substring(0,srce2_indx).lastIndexOf('.');
		var semtag2 = part2.substring(semtag2_indx+2,srce2_indx);
		var code2 = part2.substring(0,semtag2_indx);
		if (code2.indexOf('.')<0 && code2!='self')  // There is no project, we add the project of the current portfolio
			code2 = selfcode.substring(0,selfcode.indexOf('.')) + "." + code2;
		if (code2=='self')
			code2 = selfcode;
		//------------------
		var self = this;
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code1 + "&semtag="+semtag1,
			success : function(data1) {				
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code2 + "&semtag="+semtag2,
					success : function(data2) {				
						UIFactory["Get_Double_Resource"].parse(destid,type,langcode,data1,data2,self,disabled,srce1,srce2);
					}
				});
			}
		});
		//------------------
	}
};


//==================================
UIFactory["Get_Double_Resource"].parse = function(destid,type,langcode,data1,data2,self,disabled,srce1,srce2) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	var self_code1 = $(self.code1_node).text();
	if (self.encrypted)
		self_code1 = decrypt(code1_node.substring(3),g_rc4key);
	var separator = $(self.separator_node[langcode]).text();
	var self_code2 = $(self.code2_node).text();
	if (self.encrypted)
		self_code2 = decrypt(code2_node.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//------------------------------------------------------------
	var formobj = $("<div class='form-horizontal'></div>");
	$("#"+destid).append($(formobj));
	if (type=='select') {
		//--------------------------------------------------------------
		{
			var html = "<div class='btn-group choice-group'>";
			html += "<button type='button' class='btn btn-default select select-label' id='button1_"+self.id+"'>&nbsp;</button>";
			html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
			html += "</div>";
			var btn_group = $(html);
			$(formobj).append($(btn_group));
			html = "<ul class='dropdown-menu' role='menu'></ul>";
			var select  = $(html);
			//----------------- null value to erase
			html = "<li></li>";
			var select_item = $(html);
			html = "<a href='#' value='' code='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				$("#button1_"+self.id).html($(this).attr("label_"+languages[langcode]));
				for (var i=0; i<languages.length;i++){
					$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code1_node).text($(this).attr("code"));
				$(self.value1_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//--------------------
			var nodes = $("node",data1);
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				if (code.indexOf('-#')>-1) {
					html = "<li class='divider'></li><li></li>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				if (code.indexOf('-#')>-1) {
					html = "<a href='#'>" + $(srce1+"[lang='"+languages[langcode]+"']",resource).text() + "</a>";
					$(select_item).html(html);
				} else {
					html = "<a href='#' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+$(srce1+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					html += ">";
					
					if (code.indexOf("@")<0)
						html += code + " ";
					html += $(srce1+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
					var select_item_a = $(html);
					$(select_item_a).click(function (ev){
						$("#button1_"+self.id).html($(this).attr("label_"+languages[langcode]));
						for (var i=0; i<languages.length;i++){
							$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
						}
						$(self.code1_node).text($(this).attr("code"));
						$(self.value1_node).text($(this).attr("value"));
						UIFactory["Get_Double_Resource"].update(self,langcode);
					});
					$(select_item).append($(select_item_a))
					//-------------- update button -----
					if (code!="" && self_code1==code) {
						$("#button1_"+self.id).html($(srce1+"[lang='"+languages[langcode]+"']",resource).text());
					}
				}
				$(select).append($(select_item));
			}
			$(btn_group).append($(select));
		}
		//--------------------------------------------------------------
		{
			if (g_userrole!='designer'){
				$(formobj).append($("<span>"+separator+"</span>"));			
			} else {
//				var html = "<input type='text' class='form-control' id='separator_"+self.id+"' style='margin-top:20px;width:200px;' ";
				var html = "<input type='text' class='form-control' id='separator_"+self.id+"' style='margin-top:5px; margin-bottom:5px; width:200px;' ";
				if (disabled)
					html += "disabled='disabled' ";
				html += "value=\""+separator+"\" >";
				var input = $(html);
				$(input).change(function (){
					$(self.separator_node[langcode]).text($(this).val());
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(formobj).append($(input));			
			}
		}
		//--------------------------------------------------------------
		{
			var html = "<div class='btn-group choice-group'>";
			html += "<button type='button' class='btn btn-default select select-label' id='button2_"+self.id+"'>&nbsp;</button>";
			html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
			html += "</div>";
			var btn_group = $(html);
			$(formobj).append($(btn_group));
			html = "<ul class='dropdown-menu' role='menu'></ul>";
			var select  = $(html);
			//----------------- null value to erase
			html = "<li></li>";
			var select_item = $(html);
			html = "<a href='#' value='' code='' ";
			for (var j=0; j<languages.length;j++) {
				html += "label_"+languages[j]+"='&nbsp;' ";
			}
			html += ">";
			html += "&nbsp;</a>";
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				$("#button2_"+self.id).html($(this).attr("label_"+languages[langcode]));
				for (var i=0; i<languages.length;i++){
					$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code2_node).text($(this).attr("code"));
				$(self.value2_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//--------------------
			var nodes = $("node",data2);
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				if (code.indexOf('-#')>-1) {
					html = "<li class='divider'></li><li></li>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				if (code.indexOf('-#')>-1) {
					html = "<a href='#'>" + $(srce2+"[lang='"+languages[langcode]+"']",resource).text() + "</a>";
					$(select_item).html(html);
				} else {
					html = "<a href='#' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' ";
					for (var j=0; j<languages.length;j++){
						html += "label_"+languages[j]+"=\""+$(srce2+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					html += ">";
					
					if (code.indexOf("@")<0)
						html += code + " ";
					html += $(srce2+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
					var select_item_a = $(html);
					$(select_item_a).click(function (ev){
						$("#button2_"+self.id).html($(this).attr("label_"+languages[langcode]));
						for (var i=0; i<languages.length;i++){
							$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
						}
						$(self.code2_node).text($(this).attr("code"));
						$(self.value2_node).text($(this).attr("value"));
						UIFactory["Get_Double_Resource"].update(self,langcode);
					});
					$(select_item).append($(select_item_a))
					//-------------- update button -----
					if (code!="" && self_code2==code) {
						$("#button2_"+self.id).html($(srce2+"[lang='"+languages[langcode]+"']",resource).text());
					}
				}
				$(select).append($(select_item));
			}
			$(btn_group).append($(select));
		}
	}
	//======================================================================================
	if (type.indexOf('radio')>-1) {
		{
			var nodes = $("node",data1);
			var radio_gr1 = $("<div class='choice-group'></div>");			
			//-------------------
			var radio_obj1 = $("<div class='get-radio'></div>");
			var input = "";
			input += "<input type='radio' name='radio1_"+self.id+"' value='' code='' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='' ";
			}
			if (self_code1=='')
				input += " checked ";
			input += ">&nbsp;&nbsp;</input>";
			var obj = $(input);
			$(obj).click(function (){
				for (var i=0; i<languages.length;i++){
					$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code1_node).text($(this).attr("code"));
				$(self.value1_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(radio_obj1).append(obj);
			$(radio_gr1).append(radio_obj1);
			//-------------------			
			for ( var i = 0; i < $(nodes).length; i++) {
				var radio_obj1 = $("<div class='get-radio'></div>");
				var input = "";
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				first = false;
				input += "<input type='radio' name='radio1_"+self.id+"' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' ";
				if (disabled)
					input +="disabled='disabled' ";
				for (var j=0; j<languages.length;j++){
					input += "label_"+languages[j]+"=\""+$(srce1+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (code!="" && self_code1==code)
					input += " checked ";
				input += ">&nbsp;&nbsp;"+$(srce1+"[lang='"+languages[langcode]+"']",resource).text()+"</input>";
				var obj = $(input);
				$(obj).click(function (){
					for (var i=0; i<languages.length;i++){
						$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code1_node).text($(this).attr("code"));
					$(self.value1_node).text($(this).attr("value"));
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(radio_obj1).append(obj);
				$(radio_gr1).append(radio_obj1);
			}
			$(formobj).append(radio_gr1);
		}
		//--------------------------------------------------------------
		{
			if (g_userrole!='designer'){
				$(formobj).append($("<span>"+separator+"</span>"));			
			} else {
				var html = "<input type='text' class='form-control' id='separator_"+self.id+"' style='width:200px;' ";
				if (disabled)
					html += "disabled='disabled' ";
				html += "value=\""+separator+"\" >";
				var input = $(html);
				$(input).change(function (){
					$(self.separator_node[langcode]).text($(this).val());
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(formobj).append($(input));			
			}
		}
		//--------------------------------------------------------------
		{
			var nodes = $("node",data2);
			var radio_gr2 = $("<div class='choice-group'></div>");			
			//-------------------
			var radio_obj2 = $("<div class='get-radio'></div>");
			var input = "";
			input += "<input type='radio' name='radio2_"+self.id+"' value='' code='' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='' ";
			}
			if (self_code2=='')
				input += " checked ";
			input += ">&nbsp;&nbsp;</input>";
			var obj = $(input);
			$(obj).click(function (){
				for (var i=0; i<languages.length;i++){
					$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code2_node).text($(this).attr("code"));
				$(self.value2_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(radio_obj2).append(obj);
			$(radio_gr2).append(radio_obj2);
			//-------------------			
			for ( var i = 0; i < $(nodes).length; i++) {
				var radio_obj = $("<div class='get-radio'></div>");
				var input = "";
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				first = false;
				input += "<input type='radio' name='radio2_"+self.id+"' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' ";
				if (disabled)
					input +="disabled='disabled' ";
				for (var j=0; j<languages.length;j++){
					input += "label_"+languages[j]+"=\""+$(srce2+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (code!="" && self_code2==code)
					input += " checked ";
				input += ">&nbsp;&nbsp;"+$(srce2+"[lang='"+languages[langcode]+"']",resource).text()+"</input>";
				var obj = $(input);
				$(obj).click(function (){
					for (var i=0; i<languages.length;i++){
						$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code2_node).text($(this).attr("code"));
					$(self.value2_node).text($(this).attr("value"));
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(radio_obj).append(obj);
				$(radio_gr2).append(radio_obj);
			}
			$(formobj).append(radio_gr2);
		}
	}
	//======================================================================================
	if (type.indexOf('click')>-1) {
		{
			var inputs = "<div class='click choice-group'></div>";
			var inputs_obj1 = $(inputs);
			//----------------------------
			var input = "";
			input += "<div name='click_"+self.id+"' value='' code='' class='click-item";
			if (self_code1=='')
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;' ";
			}
			input += "> ";
			input +="&nbsp; </div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj1).removeClass('clicked');
				$(this).addClass('clicked');
				for (var i=0; i<languages.length;i++){
					$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code1_node).text($(this).attr("code"));
				$(self.value1_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(inputs_obj1).append(input_obj);
			//----------------------------
			var nodes = $("node",data1);
			for ( var i = 0; i < $(nodes).length; ++i) {
				var input = "";
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				input += "<div name='click_"+self.id+"' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' class='click-item";
				if (self_code1==code)
					input += " clicked";
				input += "' ";
				for (var j=0; j<languages.length;j++){
					input += "label_"+languages[j]+"=\""+$(srce1+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				input += "> ";
				if (code.indexOf("@")<0)
					input += code + " ";
				input +=$(srce1+"[lang='"+languages[langcode]+"']",resource).text()+" </div>";
				var input_obj = $(input);
				$(input_obj).click(function (){
					$('.clicked',inputs_obj1).removeClass('clicked');
					$(this).addClass('clicked');
					for (var i=0; i<languages.length;i++){
						$(self.label1_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code1_node).text($(this).attr("code"));
					$(self.value1_node).text($(this).attr("value"));
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(inputs_obj1).append(input_obj);
			}
			$(formobj).append(inputs_obj1);
		}
		//--------------------------------------------------------------
		{
			if (g_userrole!='designer'){
				$(formobj).append($("<span>"+separator+"</span>"));			
			} else {
				var html = "<input type='text' class='form-control' id='separator_"+self.id+"' style='width:200px;' ";
				if (disabled)
					html += "disabled='disabled' ";
				html += "value=\""+separator+"\" >";
				var input = $(html);
				$(input).change(function (){
					$(self.separator_node[langcode]).text($(this).val());
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(formobj).append($(input));			
			}
		}
		//--------------------------------------------------------------
		{
			var inputs = "<div class='click'></div>";
			var inputs_obj2 = $(inputs);
			//----------------------------
			var input = "";
			input += "<div name='click_"+self.id+"' value='' code='' class='click-item";
			if (self_code2=='')
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;' ";
			}
			input += "> ";
			input +="&nbsp; </div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj2).removeClass('clicked');
				$(this).addClass('clicked');
				for (var i=0; i<languages.length;i++){
					$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
				}
				$(self.code2_node).text($(this).attr("code"));
				$(self.value2_node).text($(this).attr("value"));
				UIFactory["Get_Double_Resource"].update(self,langcode);
			});
			$(inputs_obj2).append(input_obj);
			//----------------------------
			var nodes = $("node",data2);
			for ( var i = 0; i < $(nodes).length; ++i) {
				var input = "";
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				input += "<div name='click_"+self.id+"' value='"+$(nodes[i]).attr('id')+"' code='"+code+"' class='click-item";
				if (self_code2==code)
					input += " clicked";
				input += "' ";
				for (var j=0; j<languages.length;j++){
					input += "label_"+languages[j]+"=\""+$(srce2+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				input += "> ";
				if (code.indexOf("@")<0)
					input += code + " ";
				input +=$(srce2+"[lang='"+languages[langcode]+"']",resource).text()+" </div>";
				var input_obj = $(input);
				$(input_obj).click(function (){
					$('.clicked',inputs_obj2).removeClass('clicked');
					$(this).addClass('clicked');
					for (var i=0; i<languages.length;i++){
						$(self.label2_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code2_node).text($(this).attr("code"));
					$(self.value2_node).text($(this).attr("value"));
					UIFactory["Get_Double_Resource"].update(self,langcode);
				});
				$(inputs_obj2).append(input_obj);
				$(formobj).append(inputs_obj2);
			}
		}
	}

};

//==================================
UIFactory["Get_Double_Resource"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Get_Double_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
