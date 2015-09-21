//========================================================
//========================================================
//===================== Bubble =======================
//========================================================
//========================================================
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

var Bubble_byid = {};
var Bubble_list = [];

var Bubble_bubbles_byid = {};
var Bubble_bubbles_list = [];

var dataBubble = ''; 

g_current_mapid = "";

//==================================
UIFactory["Bubble"] = function(node,no)
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	var level1_bubble = new UIFactory.Bubble.bubble(this.node,1);
	Bubble_bubbles_list[no] = new Array();
	Bubble_bubbles_list[no].push(level1_bubble);
	Bubble_bubbles_byid[this.id] = level1_bubble;
	this.data = level1_bubble.data;

	var level2s = $("asmUnitStructure:has(metadata[semantictag*='bubble_level2'])",node);
	for ( var i = 0; i < level2s.length; i++) {
		var level2_bubble = new UIFactory.Bubble.bubble(level2s[i],2);
		Bubble_bubbles_list[no].push(level2_bubble);
		Bubble_bubbles_byid[level2_bubble.id] = level2_bubble;

		var level3s = $("asmUnitStructure:has(metadata[semantictag*='bubble_level3'])",level2s[i]);
		for ( var j = 0; j < level3s.length; j++) {
			var level3_bubble = new UIFactory.Bubble.bubble(level3s[j],3);
			Bubble_bubbles_list[no].push(level3_bubble);
			Bubble_bubbles_byid[level3_bubble.id] = level3_bubble;

			level2_bubble.data.children[j] = level3_bubble.data;			
		}
		this.data.children[i] = level2_bubble.data;
	}
};

//==================================
UIFactory["Bubble"].bubble = function(node,level)
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.level = level;
	this.bubble_label_node = node;
	this.bubble_description_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_description'])",node).attr("id");
	this.bubble_color_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_color'])",node).attr("id");
	this.bubble_amount_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_amount'])",node).attr("id");
	if (level==3)
		this.url_nodes = [];
		
	this.data = { id:'', label: '',amount:'',color:'',children:''};
	this.data.id = this.id;
	this.data.label = UICom.structure["ui"][this.id].getLabel();
	if (UICom.structure["ui"][this.bubble_color_nodeid].resource.type=="Color")
		this.data.color = UICom.structure["ui"][this.bubble_color_nodeid].resource.getValue();
	else
		this.data.color = UICom.structure["ui"][this.bubble_color_nodeid].resource.getView();
	this.data.amount = UICom.structure["ui"][this.bubble_amount_nodeid].resource.getView();
	this.data.children = new Array();
};



//==================================
UIFactory["Bubble"].bubble.prototype.displayView = function(destid,type,lang)
//==================================
{
	var node = UICom.structure["ui"][this.id];
	var writenode = ($(node.node).attr('write')=='Y')? true:false;
	var editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null)
		type='detail';
	if (type=='detail') {
		if ( (writenode && editnoderoles.indexOf(g_userrole)>-1) || g_userrole=='designer') {
			html += "<button  class='editbutton btn btn-xs' onclick=\"javascript:Bubble_bubbles_byid['"+this.id+"'].displayEditor('"+destid+"');\" data-title='éditer' rel='tooltip'>";
			html += karutaStr[LANG]['Update'];
			html += "</button>";
		}
		html += "<div class='bubble_label'>"+UICom.structure["ui"][this.id].getView()+"</div>";
		html += "<div class='bubble_decription'>"+UICom.structure["ui"][this.bubble_description_nodeid].resource.getView()+"</div>";
		var urls = $("asmContext:has(metadata[semantictag*='level"+this.level+"_url'])",this.node);
		for (var i=0;i<urls.length;i++){
			if (i==0)  // first one
				html += "<h4 class='title'>"+karutaStr[LANG]['bubble-links']+"</h4>";
			var uuid = $(urls[i]).attr("id");
			html += "<div class='bubble_url'>"+UICom.structure["ui"][uuid].resource.getView()+"</div>";
			html += "</div>";
		}
	}
	var obj = $(html);
	$("#"+destid).append(obj);
};

//==================================
UIFactory["Bubble"].bubble.prototype.displayEditor = function(destid,type,lang) {
//==================================
	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null)
		type='detail';
	if (type=='detail') {
		//-------------------------
		html = "<div class='form-horizontal'></div>";
		var form_horizontal = $(html)
		html = "<div><button  class='editbutton btn btn-xs' onclick=\"javascript:Bubble_bubbles_byid['"+this.id+"'].displayView('"+destid+"');\" data-title='éditer' rel='tooltip'>";
		html += karutaStr[LANG]['quit-edit'];
		html += "</button><h4>"+karutaStr[LANG]['bubble-information']+"</h4></div>";
		$(form_horizontal).html(html);
		//-------------------------
		$(form_horizontal).append($("<div class='form-group'><label class='col-sm-3 control-label'>Libellé</label><div id='label_"+this.id+"' class='col-sm-9'></div></div>"));
		$(form_horizontal).append($("<div class='form-group'><label class='col-sm-3 control-label'>Description</label><div id='description_"+this.id+"' class='col-sm-9'></div></div>"));
		$(form_horizontal).append($("<div class='form-group'><label class='col-sm-3 control-label'>Pondération</label><div id='amount_"+this.id+"' class='col-sm-9'></div></div>"));
		$(form_horizontal).append($("<div class='form-group'><label class='col-sm-3 control-label'>Couleur</label><div id='color_"+this.id+"' class='col-sm-9'></div></div>"));
		$("#"+destid).append(form_horizontal);
		$("#label_"+this.id).append(UICom.structure.ui[this.id].getNodeLabelEditor());
		UICom.structure["ui"][this.bubble_description_nodeid].resource.displayEditor('description_'+this.id);
		$("#amount_"+this.id).append(UICom.structure["ui"][this.bubble_amount_nodeid].resource.getEditor());
		$("#color_"+this.id).append(UICom.structure["ui"][this.bubble_color_nodeid].resource.getEditor());
		$(".pickcolor").colorpicker();
		//----------------- children ----------------------
		if (this.level<3) {
			//  if databack is true callback(data,param2,param3,param4) else callback(param2,param3,param4)
			var databack = false;
			var callback = "UIFactory.Bubble.reloadparse";
			var param2 = "'"+destid+"'";
			var param3 = "'"+this.id+"'";
			var param4 = "null";
			var level_plus = this.level+1;
			var js1 = "importBranch('"+this.id+"','_karuta_resources_','bubble_level"+level_plus+"',"+databack+","+callback+","+param2+","+param3+","+param4+")";
			html = "<button class='btn btn-xs' onclick=\""+js1+";\">"+karutaStr[LANG]['bubble-add-bubble']+"'"+UICom.structure["ui"][this.id].getLabel('none')+"'</button>";

			var children = $("asmUnitStructure:has(metadata[semantictag*='bubble_level"+level_plus+"'])",this.node);
			for (var i=0;i<children.length;i++){
				var uuid = $(children[i]).attr("id");
				var js2 = "Bubble_bubbles_byid['"+uuid+"'].displayEditor('"+destid+"')";
				html += "<div class='bubble_label'>"+UICom.structure["ui"][uuid].getLabel();
				html += "<button  class='editbutton btn btn-xs'  style='cursor:pointer' onclick=\""+js2+"\"><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>";
				if (i>2) {
					var callback2 = "UIFactory.Bubble.reloadparse";
					var param2_2 = "'"+destid+"'";
					var param2_3 = "'"+this.id+"'";
					html += "<button  class='editbutton btn btn-xs'  style='cursor:pointer' onclick=\"javascript: confirmDel('"+uuid+"','Bubble',null,null,'"+callback2+"',"+param2_2+","+param2_3+")\" data-title='supprimer' rel='tooltip'><span class='glyphicon glyphicon-remove'></span></button>";
				}
				html += "</div>";
			}
			$("#"+destid).append($(html));
		}
		//----------------- competence ----------------------
		if (this.level==3) {
			//  if databack is true callback(data,param2,param3,param4) else callback(param2,param3,param4)
			var databack = false;
			var callback = "UIFactory.Bubble.reloadparse";
			var param2 = "'"+destid+"'";
			var param3 = "'"+this.id+"'";
			var param4 = "null";
			var js1 = "importBranch('"+this.id+"','_karuta_resources_','level"+this.level+"_url',"+databack+","+callback+","+param2+","+param3+","+param4+")";
			html = "<button class='editbutton btn btn-xs' onclick=\""+js1+";\">"+karutaStr[LANG]['bubble-add-link']+"</button>";
			html += "<h4>"+karutaStr[LANG]['bubble-links']+"</h4>";

			var urls = $("asmContext:has(metadata[semantictag*='level"+this.level+"_url'])",this.node);
			for (var i=0;i<urls.length;i++){
				var uuid = $(urls[i]).attr("id");
				var callback2 = "UIFactory.Bubble.refreshedit";
				var param2_2 = "'"+destid+"'";
				var param2_3 = "'"+this.id+"'";
				html += "<div class='bubble_link_editor'>";
				html += "<button  class='editbutton btn btn-xs'  style='cursor:pointer' onclick=\"javascript: confirmDel('"+uuid+"','Bubble',null,null,'"+callback2+"',"+param2_2+","+param2_3+")\" data-title='supprimer' rel='tooltip'><span class='glyphicon glyphicon-remove'></span></button>";
				html += "<div id='edit_"+uuid+"'>";
				html += "</div>";
				html += "</div><!-- bubble_link_editor -->";
			}
			$("#"+destid).append($(html));
			for (var i=0;i<urls.length;i++){
				var uuid = $(urls[i]).attr("id");
				$("#edit_"+uuid).append(UICom.structure.ui[uuid].resource.getEditor());
			}
		}
	}
};

//==================================
UIFactory["Bubble"].remove = function(uuid,parentid,destid,callback,param1,param2)
//==================================
{
	$("#"+uuid,g_portfolio_current).remove();
	UICom.DeleteNode(uuid,callback,param1,param2);
};

//==================================
UIFactory["Bubble"].refreshedit = function(param1,param2) 
//==================================
{
	Bubble_bubbles_byid[param2].displayEditor(param1);
	$('#wait-window').modal('hide');
};

//==================================
UIFactory["Bubble"].parse = function(data) 
//==================================
{
	Bubble_byid = {};
	Bubble_list = [];

	Bubble_bubbles_byid = {};
	Bubble_bubbles_list = [];
/*
	var niveau1s = $("asmUnitStructure:has(metadata[semantictag*='bubble_level1'])",data);
	for ( var i = 0; i < niveau1s.length; i++) {
		var uuid = $(niveau1s[i]).attr('id');
		Bubble_list[i] = Bubble_byid[uuid] = new UIFactory["Bubble"](niveau1s[i],i);
	}
*/
	var uuid = $(data).attr('id');
	Bubble_byid[uuid] = new UIFactory["Bubble"](data,0);
};

//==================================
UIFactory["Bubble"].reloadparse = function(param2,param3) 
//==================================
{
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data);
			//------ cartes ----------
			var niveau1s = $("asmUnitStructure:has(metadata[semantictag*='bubble_level1'])",data);
			for ( var i = 0; i < niveau1s.length; i++) {
				var uuid = $(niveau1s[i]).attr('id');
				Bubble_byid[uuid] = new UIFactory["Bubble"](niveau1s[i],i);
			}
			//-----------------------
			if (param2!=null) {
				Bubble_bubbles_byid[param3].displayEditor(param2);
				$("#bubble_iframe_"+g_current_mapid).contents().find("#PageRefresh").click();
			}
			$('#wait-window').modal('hide');
		}
	});
	$.ajaxSetup({async: true});
};

//====================================
function clickBubble(node)
//====================================
{
	Bubble_bubbles_byid[node.id].displayView("bubble_display_"+g_current_mapid);
}


