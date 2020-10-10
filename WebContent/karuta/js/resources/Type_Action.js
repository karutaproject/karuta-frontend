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
UIFactory["Action"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Action';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Action']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Action']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Action']",node));
	//--------------------
	this.role_node = $("role",$("asmResource[xsi_type='Action']",node));
	this.action_node = $("action",$("asmResource[xsi_type='Action']",node));	
	this.query_node = $("action-query",$("asmResource[xsi_type='Action']",node));	
	//------ target --------
	this.code_node = $("code",$("asmResource[xsi_type='Action']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Action']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Action']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Action']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Action']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Action']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Action']",node));
			}
		}
	}
	//-----------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Action"].prototype.getAttributes = function(type,langcode)
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
		result['role'] = this.role_node.text();
		result['action'] = this.action_node.text();
		result['query'] = this.query_node.text();
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Action"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = this.label_node[langcode].text() + " ("+this.action_node.text() + " - " + this.role_node.text() + ")";
	return html;
};

//==================================
UIFactory["Action"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var html = this.label_node[langcode].text() + " ("+this.action_node.text() + " - " + this.role_node.text() + ")";
	$(dest).html(html);
};


/// Editor
//==================================
UIFactory["Action"].update = function(itself,lang,type,portfolio_label)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Action"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		var code = queryattr_value.substring(0,semtag_indx);
		//------------
		var self = this;
		if (code!='all') {
			if (code=='self')
				code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
				success : function(data) {
					UIFactory["Action"].parse(destid,type,langcode,data,self,code,srce);
				}
			});
		} else {  // code==all
			// retrieve active portfolios
			$("#wait-window").modal('show');
			$.ajaxSetup({async: false});
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1",
				success : function(data) {
					UIFactory["Portfolio"].parse(data);
					for ( var i = 0; i < portfolios_list.length; i++) {
						code = portfolios_list[i].code_node.text();
						label = portfolios_list[i].label_node[langcode].text();
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
							success : function(data) {
								var nodes = $("node",data);
								var display = false;
								for ( var i = 0; i < $(nodes).length; ++i) {
									var semtag = $("metadata",nodes[i]).attr('semantictag');
									if (semtag.indexOf("Action-")<0)
										display = true;
								}
								if (nodes.length>0 && display) {									
									var html = "";
									html += "<div class='portfolio-Action' style='margin-top:20px'>"+label+"</div>";
									var placeid = code.replace(/\./g, '_'); 
									html += "<div id='"+placeid+"'></div>";
									$("#"+destid).append($(html));
									UIFactory["Action"].parse(placeid,type,langcode,data,self,label,srce);
								}
							}
						});
					}
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Server Error UIFactory.Action.prototype.displayEditor: "+textStatus);
					$("#wait-window").modal('hide');
				}
			});
			$.ajaxSetup({async: true});
			$("#wait-window").modal('hide');
		}
	}
};

//==================================
UIFactory["Action"].parse = function(destid,type,langcode,data,self,portfolio_label,srce) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	var formobj = $("<div class='form-horizontal'></div>");
	$("#"+destid).append($(formobj));
	//----------------------- role -----------------------------
	
	var htmlCodeGroupObj = $("<div class='form-group'></div>")
	var htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>Role</label>");
	var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
	var role = $(self.role_node).text();
	var html = "<input type='text' class='form-control' value=''/>";
	var htmlCodeInputObj = $(html);
	$(htmlCodeInputObj).attr('value',role);
	$(htmlCodeInputObj).change(function (){
		$(self.role_node).text($(this).val());
		UIFactory["Action"].update(self);
	});
	$(htmlCodeDivObj).append($(htmlCodeInputObj));
	$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
	$(htmlCodeGroupObj).append($(htmlCodeDivObj));
	$(formobj).append($(htmlCodeGroupObj));
	//----------------------- action -----------------------------
	var self_action = $(self.action_node).text();
	htmlCodeGroupObj = $("<div class='form-group'></div>")
	htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>Action</label>");
	htmlCodeDivObj = $("<div class='col-sm-9'></div>");
	html = "<div class='btn-group'>";
	html += "<button type='button' class='btn btn-default select select-label' id='action_"+self.id+"'>&nbsp;</button>";
	html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
	html += "</div>";
	var btn_group = $(html);
	$(htmlCodeDivObj).append($(btn_group));
	$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
	$(htmlCodeGroupObj).append($(htmlCodeDivObj));
	$(formobj).append($(htmlCodeGroupObj));
	html = "<ul class='dropdown-menu' role='menu'></ul>";
	var select  = $(html);
	//--------------------
	var actions = ['&nbsp;','showto'];
	for ( var i = 0; i < $(actions).length; i++) {
		var html = "<li></li>";
		var select_item = $(html);
		html = "<a  action='"+actions[i]+"' >" + actions[i] + "</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#action_"+self.id).html($(this).attr("action"));
			$(self.action_node).text($(this).attr("action"));
			UIFactory["Action"].update(self);
		});
		$(select_item).append($(select_item_a))
		//-------------- update button -----
		if (self_action==actions[i]) {
			$("#action_"+self.id).html(actions[i]);
		}
		$(select).append($(select_item));
	}
	$(btn_group).append($(select));
	//----------------------- target ---------------------------------------------
	var self_value = $(self.value_node).text();
	htmlCodeGroupObj = $("<div class='form-group'></div>")
	htmlCodeLabelObj = $("<label for='code_"+this.id+"' class='col-sm-3 control-label'>Target</label>");
	htmlCodeDivObj = $("<div class='col-sm-9'></div>");
	if (type=='select') {
		//--------------------------------------------------------------
		var html = "<div class='btn-group'>";
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(htmlCodeDivObj).append($(btn_group));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(formobj).append($(htmlCodeGroupObj));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//----------------- null value to erase
		html = "<li></li>";
		var select_item = $(html);
		html = "<a  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Action"].update(self);
		});
		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//--------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var semtag = $("metadata",nodes[i]).attr('semantictag');
			if (semtag.indexOf("Action-")<0){
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var value = $(nodes[i]).attr('id');
				var html = "<li></li>";
				var select_item = $(html);
				html = "<a  value='"+value+"' code='"+value+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html(portfolio_label+"."+$(this).attr("label_"+languages[langcode]));
					for (var i=0; i<languages.length;i++){
						$(self.label_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code_node).text($(this).attr("code"));
					$(self.value_node).text($(this).attr("value"));
					UIFactory["Action"].update(self);
				});
				$(select_item).append($(select_item_a))
				//-------------- update button -----
				if (value!="" && self_value==value) {
					$("#button_"+self.id).html(portfolio_label+"."+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
				}
				$(select).append($(select_item));
			}
		$(btn_group).append($(select));
		}
	}
};

//==================================
UIFactory["Action"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Action"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		this.displayView(dest,null,this.display[dest])
	};

};
