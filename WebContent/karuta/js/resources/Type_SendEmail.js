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
UIFactory["SendEmail"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'SendEmail';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='SendEmail']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='SendEmail']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='SendEmail']",node));
	//--------------------
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

//==================================
UIFactory["SendEmail"].prototype.getAttributes = function(type,langcode)
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
		result['firstname'] = this.firstname_node[langcode].text();
		result['lastname'] = this.lastname_node[langcode].text();
		result['email'] = this.email_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["SendEmail"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = "";
	html +=  "<div class='name_SendEmail'> "+$(this.firstname_node[langcode]).text()+" "+$(this.lastname_node[langcode]).text()+"</div>";
	html +=  "<div class='email_SendEmail'> "+$(this.email_node[langcode]).text()+"</div>";
	return html;
};

//==================================
UIFactory["SendEmail"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = "";
	html +=  "<div class='name_SendEmail'> "+$(this.firstname_node[langcode]).text()+" "+$(this.lastname_node[langcode]).text()+"</div>";
	html +=  "<div class='email_SendEmail'> "+$(this.email_node[langcode]).text()+"</div>";
	$("#"+dest).html(html);
};


/// Editor
//==================================
UIFactory["SendEmail"].update = function(obj,itself,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
	if (type==null)
		type = 'default';
	var self = this;
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	//---------------------
	if(type=='default')
		if (g_userroles[0]=='designer' || USER.admin) {
			//------------------------
			var htmlFirstGroupObj = $("<div class='form-group'></div>");
			var htmlFirstLabelObj = $("<label for='firstname"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['firstname']+"</label>");
			var htmlFirstDivObj = $("<div class='col-sm-9'></div>");
			var htmlFirstInputObj = $("<input id='firstname"+this.id+"' type='text' class='form-control' name='firstname_SendEmail' value=\""+this.firstname_node[langcode].text()+"\">");
			$(htmlFirstInputObj).change(function (){
				$(self.firstname_node[langcode]).text($(this).val());
				self.save();
			});
			$(htmlFirstDivObj).append($(htmlFirstInputObj));
			$(htmlFirstGroupObj).append($(htmlFirstLabelObj));
			$(htmlFirstGroupObj).append($(htmlFirstDivObj));
			$(htmlFormObj).append($(htmlFirstGroupObj));
			//------------------------
			var htmlLastGroupObj = $("<div class='form-group'></div>");
			var htmlLastLabelObj = $("<label for='lastname"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['lastname']+"</label>");
			var htmlLastDivObj = $("<div class='col-sm-9'></div>");
			var htmlLastInputObj = $("<input id='lastname"+this.id+"' type='text' class='form-control' name='lastname_SendEmail' value=\""+this.lastname_node[langcode].text()+"\">");
			$(htmlLastInputObj).change(function (){
				$(self.lastname_node[langcode]).text($(this).val());
				self.save();
			});
			$(htmlLastDivObj).append($(htmlLastInputObj));
			$(htmlLastGroupObj).append($(htmlLastLabelObj));
			$(htmlLastGroupObj).append($(htmlLastDivObj));
			$(htmlFormObj).append($(htmlLastGroupObj));
			//------------------------
			var htmlEmailGroupObj = $("<div class='form-group'></div>");
			var htmlEmailLabelObj = $("<label for='email"+this.id+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['email']+"</label>");
			var htmlEmailDivObj = $("<div class='col-sm-9'></div>");
			var htmlEmailInputObj = $("<input id='email"+this.id+"' type='text' class='form-control' name='email_SendEmail' value=\""+this.email_node[langcode].text()+"\">");
			$(htmlEmailInputObj).change(function (){
				$(self.email_node[langcode]).text($(this).val());
				self.save();
			});
			$(htmlEmailDivObj).append($(htmlEmailInputObj));
			$(htmlEmailGroupObj).append($(htmlEmailLabelObj));
			$(htmlEmailGroupObj).append($(htmlEmailDivObj));
			$(htmlFormObj).append($(htmlEmailGroupObj));
			$(htmlFormObj).append($("<hr/>"));
			//------------------------
		} else{
			var html = "";
			html +=  "<div class='receiver_SendEmail'>";
			html +=  "<div class='name_SendEmail'> "+$(this.firstname_node[langcode]).text()+" "+$(this.lastname_node[langcode]).text()+"</div>";
			html +=  "<div class='email_SendEmail'> "+$(this.email_node[langcode]).text()+"</div>";
			html +=  "</div>";
			html += "<label>"+karutaStr[LANG]['subject']+"</label>";
			html += "<input type='text' class='form-control' style='width:100%' id='subject_SendEmail'>";
			html += "<label>"+karutaStr[LANG]['message']+"</label>";
			html += "<textarea class='form-control' id='message_SendEmail'></textarea>";
			$(htmlFormObj).append($(html));
			var button_send= $("<a class='btn btn-large btn-primary' style='margin-top:5px'>"+karutaStr[LANG]['button-send']+"</a>");
			$(button_send).click(function (){
				UIFactory["SendEmail"].send(htmlFormObj,self,langcode);
			});
			$(htmlFormObj).append(button_send);
		}
	return htmlFormObj;
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
	var subject = $("#subject_SendEmail",obj).val();
	subject += " - "+karutaStr[LANG]['sent-by']+" "+USER.getView(null,"firstname-lastname");
	var message = $("#message_SendEmail",obj).val();
	//---------------------
	var xml ="<node>";
	xml +="<recipient>" + replaceVariable($(itself.email_node[langcode]).text()) + "</recipient>";
	xml +="<subject>"+subject+"</subject>";
	xml +="<message>"+message+"</message>";
	xml +="<sender>"+$(USER.email_node).text()+"</sender>";
	xml +="<recipient_cc></recipient_cc><recipient_bcc></recipient_bcc>";
	xml +="</node>";

	$.ajax({
		type : "POST",
		contentType: "application/xml",
		url : serverBCK+"/mail",
		data: xml,
		success : function() {
			alertHTML(karutaStr[LANG]['email-sent']);
			$("#edit-window").modal("hide");
		}
	});
};

