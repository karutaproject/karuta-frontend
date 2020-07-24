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
UIFactory["CompetencyEvaluation"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'CompetencyEvaluation';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='CompetencyEvaluation']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='CompetencyEvaluation']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.value_node = $("value",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.label_node = [];
	this.label_node['fr'] = $("label[lang='fr']",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.label_node['en'] = $("label[lang='en']",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.code_eval_node = $("code_eval",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.value_eval_node = $("value_eval",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.label_eval_node = [];
	this.label_eval_node['fr'] = $("label_eval[lang='fr']",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	this.label_eval_node['en'] = $("label_eval[lang='en']",$("asmResource[xsi_type='CompetencyEvaluation']",node));
	var query = $("metadata-wad",node).attr('query');
	if (query!=null) {
		this.query_com = query.substring(0,query.indexOf(';'));
		this.query_eval = query.substring(query.indexOf(';')+1);
	}
	this.display = {};
//	alertHTML(this.id+"/"+this.value_eval_node.text());
};

/// Display
//==================================
UIFactory["CompetencyEvaluation"].prototype.getView = function(dest,type,lang)
//==================================

	{
		if (lang==null)
			lang = LANG;
		if (dest!=null) {
			this.display[dest] = lang;
		}
		var value = this.label_eval_node[lang].text();
		value = $.trim(value.replace(/[\n\r]/g, ''));
		var badge_type = "";
		if (value == '1')
			badge_type = "badge-important";
		if (value == '2')
			badge_type = "badge-warning";
		if (value == '3')
			badge_type = "badge-success";
		var html = "<span class='badge "+badge_type+"'>"+value+"</span> <span>"+this.label_node[lang].text()+"</span>";
		return html;
	};


//==================================
UIFactory["CompetencyEvaluation"].prototype.displayView = function(dest,type,lang)
//==================================
	{
		var html = this.getView(dest,type,lang);
		document.getElementById(dest).innerHTML = html;
	};


/// Editor
//==================================
UIFactory["CompetencyEvaluation"].update = function(obj,itself,lang,type,name)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var selected = "";
	var value = "";
	var code = "";
	var label_fr = "";
	var label_en = "";
	if(type=='select') {
		selected = $(obj).find("option:selected");
		value = $(selected).attr('value');
		code = $(selected).attr('code');
		label_fr = $(selected).attr('label_fr');
		label_en = $(selected).attr('label_en');
	}
	if(type=='radio') {
		selected = $('input[name='+name+']:checked',obj);
		value = $(selected).attr('value');
		code = $(selected).attr('code');
		label_fr = $(selected).attr('label_fr');
		label_en = $(selected).attr('label_en');
	}
	if(name=='comp') {
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		$(itself.label_node['fr']).text(label_fr);
		$(itself.label_node['en']).text(label_en);
	}
	if(name=='eval') {
		$(itself.value_eval_node).text(value);
		$(itself.code_eval_node).text(code);
		$(itself.label_eval_node['fr']).text(label_fr);
		$(itself.label_eval_node['en']).text(label_en);
	}
	itself.save();
};

//==================================
UIFactory["CompetencyEvaluation"].prototype.displayEditor = function(dest,type,lang)
//==================================
{
	var self = this;
	// ------------------------
	var p1 = this.query_com.indexOf('.');
	var p2 = this.query_com.indexOf('.',p1+1);
	var code = this.query_com.substring(0,p1);
	var semtag = this.query_com.substring(p1+1,p2);
	var value_com = $(this.value_node).text();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../"+serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
		success : function(data) {
			UIFactory["CompetencyEvaluation"].parse(dest,data,lang,self,type,'comp',value_com);
		}
	});
	// ------------------------
	p1 = this.query_eval.indexOf('.');
	p2 = this.query_eval.indexOf('.',p1+1);
	code = this.query_eval.substring(0,p1);
	semtag = this.query_eval.substring(p1+1,p2);
	var value_eval = $(this.value_eval_node).text();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../"+serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
		success : function(data) {
			UIFactory["CompetencyEvaluation"].parse(dest,data,lang,self,type,'eval',value_eval);
		}
	});
	// ------------------------
};

//==================================
UIFactory["CompetencyEvaluation"].parse = function(destid,data,lang,self,type,name,code) {
//==================================
	if (lang==null)
		lang = LANG;
	if (type==null || type=='select') {
		var select = "<select name='"+name+"'><option/></select>";
		var $select = $(select);
		$($select).change(function (){
			UIFactory["CompetencyEvaluation"].update($select,self,lang,type,name);
		});
		$(obj).append($select);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; ++i) {
			var option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+$('code',nodes[i]).text()+"' " +
					"label_fr='"+$("label[lang='fr']",nodes[i]).text()+"' " +
					"label_en='"+$("label[lang='en']",nodes[i]).text()+"' ";
			if (code== $('code',nodes[i]).text())
				option += " selected ";
			option += ">"+$("label[lang='"+lang+"']",nodes[i]).text()+"</option>";
			$(obj).append($(option));
		}
	}
	if (type=='radio') {
		var div = "<div></div>";
		var obj = $(div);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; ++i) {
			var semtag = $("metadata",nodes[i]).attr('semantictag');
			if (semtag.indexOf('_parent')<0) {
				var input = "<input name='"+name+"' type='radio' code='"+$(nodes[i]).attr('id')+"' value='"+$('code',nodes[i]).text()+"' " +
						"label_fr=\""+$("label[lang='fr']",nodes[i]).text()+"\" " +
						"label_en=\""+$("label[lang='en']",nodes[i]).text()+"\" ";
				if (code== $('code',nodes[i]).text())
					input += " checked ";
				input += "> "+$("label[lang='"+lang+"']",nodes[i]).text()+"<br/>";
				$(obj).append($(input));
			}
		}
		$(obj).change(function (){
			UIFactory["CompetencyEvaluation"].update(obj,self,lang,type,name);
		});
	}
	$("#"+destid).append(obj);
	var saved = $("<span id='"+self.id+"_saved'></span>");// to write 'saved'
	$("#"+destid).append(saved);

};
//==================================
UIFactory["CompetencyEvaluation"].prototype.save = function()
//==================================
{
	UICom.UpdateNode(this.node);
	this.refresh();
};

//==================================
UIFactory["CompetencyEvaluation"].prototype.remove = function()
//==================================
{
	UICom.DeleteNode(this.id);
	$("#"+this.id,g_portfolio_current).remove();
};

//==================================
UIFactory["CompetencyEvaluation"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
