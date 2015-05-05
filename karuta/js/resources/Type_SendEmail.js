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
UIFactory["SendEmail"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'SendEmail';
	this.firstname_node = [];
	for (var i=0; i<languages.length;i++){
		this.firstname_node[i] = $("firstname[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		if (this.firstname_node[i].length==0) {
			var newelement = createXmlElement("firstname");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='SendEmail']",node)[0].appendChild(newelement);
			this.firstname_node[i] = $("firstname[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		}
	}
	this.lastname_node = [];
	for (var i=0; i<languages.length;i++){
		this.lastname_node[i] = $("lastname[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		if (this.lastname_node[i].length==0) {
			var newelement = createXmlElement("lastname_node");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='SendEmail']",node)[0].appendChild(newelement);
			this.lastname_node[i] = $("lastname_node[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		}
	}
	this.email_node = [];
	for (var i=0; i<languages.length;i++){
		this.email_node[i] = $("email[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		if (this.email_node[i].length==0) {
			var newelement = createXmlElement("email");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='SendEmail']",node)[0].appendChild(newelement);
			this.email_node[i] = $("email[lang='"+languages[i]+"']",$("asmResource[xsi_type='SendEmail']",node));
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["SendEmail"].prototype.getView = function(dest,type,langcode)
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
	html +=  "<div class='name_SendEmail'> "+$(this.firstname_node[langcode]).text()+" "+$(this.lastname_node[langcode]).text()+"</div>";
	html +=  "<div class='email_SendEmail'> "+$(this.email_node[langcode]).text()+"</div>";
	return html;
};


/// Editor
//==================================
UIFactory["SendEmail"].update = function(obj,itself,langcode)
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
	var firstname = $("input[name='firstname_SendEmail']",obj).val();
	$(itself.firstname_node[langcode]).text(firstname);
	var lastname = $("input[name='lastname_SendEmail']",obj).val();
	$(itself.lastname_node[langcode]).text(lastname);
	var email = $("input[name='email_SendEmail']",obj).val();
	$(itself.email_node[langcode]).text(email);
	itself.save();
};


//==================================
UIFactory["SendEmail"].prototype.getEditor = function(type,langcode)
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
	var obj = $("<span class='SendEmail_editor'></span>");
	//---------------------
	if(type=='default')
		if (g_userrole=='designer') {
			//------------------------
			$(obj).append($("<label>"+karutaStr[LANG]['firstname']+"</label>"));
			var input_firstname = $("<input type='text' name='firstname_SendEmail' value=\""+$(this.firstname_node[langcode]).text()+"\">");
			$(input_firstname).change(function (){
				UIFactory["SendEmail"].update(obj,self,langcode);
			});
			$(obj).append(input_firstname);
			//------------------------
			$(obj).append($("<label>"+karutaStr[LANG]['lastname']+"</label>"));
			var input_lastname = $("<input type='text' name='lastname_SendEmail' value=\""+$(this.lastname_node[langcode]).text()+"\">");
			$(input_lastname).change(function (){
				UIFactory["SendEmail"].update(obj,self,langcode);
			});
			$(obj).append(input_lastname);
			//------------------------
			$(obj).append($("<label>"+karutaStr[LANG]['email']+"</label>"));
			var input_email = $("<input type='text' name='email_SendEmail' value=\""+$(this.email_node[langcode]).text()+"\">");
			$(input_email).change(function (){
				UIFactory["SendEmail"].update(obj,self,langcode);
			});
			$(obj).append(input_email);
		} else{
			var html = "";
			html +=  "<div class='name_SendEmail'> "+$(this.firstname_node[langcode]).text()+" "+$(this.lastname_node[langcode]).text()+"</div>";
			html +=  "<div class='email_SendEmail'> "+$(this.email_node[langcode]).text()+"</div>";
			html += "<label>"+karutaStr[LANG]['subject']+"</label>";
			html += "<input type='text' style='width:100%' id='subject_SendEmail'>";
			html += "<label>"+karutaStr[LANG]['message']+"</label>";
			html += "<textarea id='message_SendEmail'></textarea>";
			$(obj).append($(html));
			var button_send= $("<button class='btn btn-large btn-primary'>"+karutaStr[LANG]['button-send']+"</button>");
			$(button_send).click(function (){
				UIFactory["SendEmail"].send(obj,self,langcode);
			});
			$(obj).append(button_send);
		}
	return obj;
};

//==================================
UIFactory["SendEmail"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};


//==================================
UIFactory["SendEmail"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};

//==================================
UIFactory["SendEmail"].send = function(obj,itself,langcode)
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
	var subject = $("#subject_SendEmail",obj).val();
	subject += " - "+karutaStr[LANG]['sent-by']+" "+USER.getView(null,"firstname-lastname");
	var message = $("#message_SendEmail",obj).val();
	//---------------------
	var xml ="<node>";
	xml +="<recipient>"+$(itself.email_node[langcode]).text()+"</recipient>";
	xml +="<subject>"+subject+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="</node>";

	$.ajax({
		type : "POST",
		dataType : "xml",
		url : "../../../"+serverFIL+"/mail",
		data: xml,
		success : function(data) {
			alert(karutaStr[LANG]['email-sent']);
			$("#edit-window").modal("hide");
		}
	});

};

