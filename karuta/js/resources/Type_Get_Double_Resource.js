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
UIFactory["Get_Double_Resource"].update = function(select1,input,select2,itself,langcode,type)
//==================================
{
	if (type==undefined || type==null)
		type = 'select';
	
	if (type=='select') {
		var option1 = $(select1).find("option:selected");
		var value1 = $(option1).attr('value');
		var code1 = $(option1).attr('code');
		//---------------------
		if (itself.encrypted)
			value1 = "rc4"+encrypt(value1,g_rc4key);
		if (itself.encrypted)
			code1 = "rc4"+encrypt(code1,g_rc4key);
		//---------------------
		$(itself.value1_node).text(value1);
		$(itself.code1_node).text(code1);
		for (var i=0; i<languages.length;i++){
			var label1 = $(option1).attr('label_'+languages[i]);
			//---------------------
			if (itself.encrypted)
				label1 = "rc4"+encrypt(label1,g_rc4key);
			//---------------------
			$(itself.label1_node[i]).text(label1);
		}
		//-----------------------
		var option2 = $(select2).find("option:selected");
		var value2 = $(option2).attr('value');
		var code2 = $(option2).attr('code');
		//---------------------
		if (itself.encrypted)
			value2 = "rc4"+encrypt(value2,g_rc4key);
		if (itself.encrypted)
			code2 = "rc4"+encrypt(code2,g_rc4key);
		//---------------------
		$(itself.value2_node).text(value2);
		$(itself.code2_node).text(code2);
		for (var i=0; i<languages.length;i++){
			var label2 = $(option2).attr('label_'+languages[i]);
			//---------------------
			if (itself.encrypted)
				label2 = "rc4"+encrypt(label2,g_rc4key);
			//---------------------
			$(itself.label2_node[i]).text(label2);
		}
	}
	//--------------------------------
	if (g_userrole=="designer") {
		var value = $.trim($(input).val());
		$(itself.separator_node[langcode]).text(value);
	}


	itself.save();
};

//==================================
UIFactory["Get_Double_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled)
//==================================
{
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		var p1 = queryattr_value.indexOf('.');
		var p2 = queryattr_value.indexOf('.',p1+1);
		var p3 = queryattr_value.indexOf(';');
		var p4 = queryattr_value.indexOf('.',p3);
		var p5 = queryattr_value.indexOf('.',p4+1);
		//------------------
		var code1 = queryattr_value.substring(0,p1);
		if (code1=='self')
			code1 = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();		
		var semtag1 = queryattr_value.substring(p1+1,p2);
		//------------------
		var code2 = queryattr_value.substring(p3+1,p4);
		if (code2=='self')
			code2 = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();		
		var semtag2 = queryattr_value.substring(p4+1,p5);
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
						UIFactory["Get_Double_Resource"].parse(destid,type,langcode,data1,data2,self,disabled);
					}
				});
			}
		});
	}
};


//==================================
UIFactory["Get_Double_Resource"].parse = function(destid,type,langcode,data1,data2,self,disabled) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	var self_value1 = $(self.value1_node).text();
	if (self.encrypted)
		self_value1 = decrypt(self_value1.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	if (type=='select') {
		var select1 = "<select>";
		select1 += "<option value= '' code='' ";
		for (var j=0; j<languages.length;j++){
			select1 += "label_"+languages[j]+"='' ";
		}
		select1 += "</option></select>";
		var obj1 = $(select1);
		var nodes1 = $("node",data1);
		for ( var i = 0; i < $(nodes1).length; i++) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes1[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes1[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes1[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $("label[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes1[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (self_value1==code)
					option += " selected ";
				option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj1).append($(option));
		}
		//------------------------------------------
		var separator = $(self.separator_node[langcode]).text();
		var html = "";
		if (g_userrole!='designer'){
			html += "<span>"+separator+"</span>";			
		} else {
			html += "<input type='text' ";
			if (disabled)
				html += "disabled='disabled' ";
			html += "value=\""+separator+"\" >";
		}
		var input = $(html);
		//------------------------------------------
		var self_value2 = $(self.value2_node).text();
		if (self.encrypted)
			self_value2 = decrypt(self_value2.substring(3),g_rc4key);
		//---------------------
		var select2 = "<select>";
		select2 += "<option value= '' code='' ";
		for (var j=0; j<languages.length;j++){
			select2 += "label_"+languages[j]+"='' ";
		}
		select2 += "</option></select>";
		var obj2 = $(select2);
		var nodes2 = $("node",data2);
		for ( var i = 0; i < $(nodes2).length; i++) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes2[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes2[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes2[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $("label[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes2[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (self_value2==code)
					option += " selected ";
				option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj2).append($(option));
		}
		//------------------------------------------
		$(obj1).change(function (){
			UIFactory["Get_Double_Resource"].update(obj1,input,obj2,self,langcode);
		});
		$("#"+destid).append(obj1);
		//------------------------------------------
		if (g_userrole=='designer'){
			$(input).change(function (){
				UIFactory["Get_Double_Resource"].update(obj1,input,obj2,self,langcode);
			});
		}
		$("#"+destid).append($("<br>"));
		$("#"+destid).append(input);
		//------------------------------------------
		$(obj2).change(function (){
			UIFactory["Get_Double_Resource"].update(obj1,input,obj2,self,langcode);
		});
		$("#"+destid).append($("<br>"));
		$("#"+destid).append(obj2);			
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
