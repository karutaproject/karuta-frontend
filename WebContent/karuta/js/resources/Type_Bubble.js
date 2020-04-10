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

var g_current_mapid = "";
var g_bubble_put = true;
var g_bubble_id = null;
var g_bubble_destid = null;

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
	this.metadatawad = $("metadata-wad",node);
	this.level = level;
//	this.bubble_label_node = node;
	this.bubble_label_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_label'])",node).attr("id");
	this.bubble_description_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_description'])",node).attr("id");
	this.bubble_color_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_color'])",node).attr("id");
	this.bubble_amount_nodeid = $("asmContext:has(metadata[semantictag='level"+level+"_amount'])",node).attr("id");
	if (level==3)
		this.url_nodes = [];
		
	this.data = { id:'', label: '',amount:'',color:'',children:'', token:''};
	this.data.id = this.id;
	this.data.token = this.id;
	if (this.bubble_label_nodeid!=undefined)
		this.data.label = UICom.structure["ui"][this.bubble_label_nodeid].resource.getView();
	else
		this.data.label = UICom.structure["ui"][this.id].getLabel(null,"none");
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
	g_bubble_id = this.id;
	g_bubble_destid = destid;
	var node = UICom.structure["ui"][this.bubble_label_nodeid];
	var editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null)
		type='detail';
	if (type=='detail') {   //editnoderoles.containsArrayElt(g_userroles)
		if (editresroles.containsArrayElt(g_userroles) || g_userroles[0]=='designer') {
			html += "<div class='btn-group bubble-button'>&nbsp;<span class='button fas fa-pencil-alt' onclick=\"javascript:Bubble_bubbles_byid['"+this.id+"'].displayEditor('"+destid+"');\"></span></div>";
		}
		html += "<div class='bubble_label'>"+UICom.structure["ui"][this.bubble_label_nodeid].resource.getView()+"</div>";
		html += "<div class='bubble_decription'>"+UICom.structure["ui"][this.bubble_description_nodeid].resource.getView()+"</div>";
		var urls = $("asmContext:has(metadata[semantictag*='level"+this.level+"_url'])",this.node);
		for (var i=0;i<urls.length;i++){
			if (i==0)  // first one
				html += "<h4 class='title'>Liens</h4>" 
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
	isbubbleput(true);

	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null)
		type='detail';
	if (type=='detail') {
		$("#"+destid).append($("<div class='btn-group bubble-button' ><a class='button' onclick=\"javascript:Bubble_bubbles_byid['"+this.id+"'].displayView('"+destid+"');updateBubbleTreeMap();\">"+karutaStr[LANG]["leave-edit-mode"]+"</a></div>"));
		$("#"+destid).append($("<br/><br/>"));
		$("#"+destid).append($("<div class='form-horizontal' id='editform_"+this.id+"'></div>"));
		displayControlGroup_getEditor('editform_'+this.id,karutaStr[LANG]["bubble-label"],"label_"+this.id,this.bubble_label_nodeid);
		displayControlGroup_getEditor('editform_'+this.id,karutaStr[LANG]["bubble-weight"],"amount_"+this.id,this.bubble_amount_nodeid);
		displayControlGroup_getEditor('editform_'+this.id,karutaStr[LANG]["bubble-color"],"color_"+this.id,this.bubble_color_nodeid);
		$("#"+'editform_'+this.id).append($("<label class='inline'>"+karutaStr[LANG]["bubble-information"]+"</label>"));
		UICom.structure["ui"][this.bubble_description_nodeid].resource.displayEditor('editform_'+this.id,'x100');
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
			var js1 = "importBranch('"+this.id+"','karuta.karuta-other-resources','bubble_level"+level_plus+"',"+databack+","+callback+","+param2+","+param3+","+param4+")";
			html += "<div class='bubble-children'>"
				html += "<div class='btn-group bubble-button'><a class='button' onclick=\""+js1+";\">"+karutaStr[LANG]["bubble-add-bubble"]+"</a></div>";
			html += "<div class='bubble-children-label'>"+karutaStr[LANG]["bubble-level"]+"&nbsp;"+level_plus+"</div>"
			var children = $("asmUnitStructure:has(metadata[semantictag*='bubble_level"+level_plus+"'])",this.node);
			for (var i=0;i<children.length;i++){
				var uuid = $(children[i]).attr("id");
				var label_uuid = Bubble_bubbles_byid[uuid].bubble_label_nodeid;
				html += "<div class='child-bubble_label'><span>"+UICom.structure["ui"][label_uuid].resource.getView()+"</span>";
				if (children.length>3 && i>2) {
					var callback2 = "UIFactory.Bubble.reloadparse";
					var param2_2 = "'"+destid+"'";
					var param2_3 = "'"+this.id+"'";
					html += " &nbsp;<div class='btn-group bubble-del-bubble'><span  class='button fas fa-trash'  style='cursor:pointer' onclick=\"javascript: confirmDel('"+uuid+"','Bubble',null,null,'"+callback2+"',"+param2_2+","+param2_3+")\"></span></div>";
				}
				html += "</div>";
			}
			html += "</div>";
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
			var js1 = "importBranch('"+this.id+"','karuta.karuta-other-resources','level"+this.level+"_url',"+databack+","+callback+","+param2+","+param3+","+param4+")";
			html += "<div class='bubble-children'>"
				html += "<div class='btn-group bubble-button'><a class='button' onclick=\""+js1+";\">"+karutaStr[LANG]["bubble-add-link"]+"</a></div>";
			html += "<div class='bubble-children-label'>Liens</div>"

			var urls = $("asmContext:has(metadata[semantictag*='level"+this.level+"_url'])",this.node);
			for (var i=0;i<urls.length;i++){
				var uuid = $(urls[i]).attr("id");
				var callback2 = "UIFactory.Bubble.refreshedit";
				var param2_2 = "'"+destid+"'";
				var param2_3 = "'"+this.id+"'";
				html += "<div id='edit_"+uuid+"'>";
				html += "<div class='btn-group bubble-del-url-button'><span  class='button fas fa-trash'  style='cursor:pointer' onclick=\"javascript: confirmDel('"+uuid+"','Bubble',null,null,'"+callback2+"',"+param2_2+","+param2_3+")\"></span></div>";
				html += "</div>";
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
	$("#wait-window").modal('hide');			
};

//==================================
UIFactory["Bubble"].refreshedit = function(param1,param2) 
//==================================
{
	Bubble_bubbles_byid[param2].displayEditor(param1);
};

//==================================
UIFactory["Bubble"].parse = function(data) 
//==================================
{
	Bubble_byid = {};
	Bubble_list = [];

	Bubble_bubbles_byid = {};
	Bubble_bubbles_list = [];

	var niveau1s = $("asmUnitStructure:has(metadata[semantictag*='bubble_level1'])",data);
	if (niveau1s.length>0){
		for ( var i = 0; i < niveau1s.length; i++) {
			var uuid = $(niveau1s[i]).attr('id');
			Bubble_list[i] = Bubble_byid[uuid] = new UIFactory["Bubble"](niveau1s[i],i);
		}
	} else {
		var uuid = $(data).attr('id');
		Bubble_list[0] = Bubble_byid[uuid] = new UIFactory["Bubble"](data,0);		
	}
};

//==================================
UIFactory["Bubble"].reloadparse = function(param2,param3,param4) 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/" + g_portfolioid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data);
			//------ carte ----------
			UIFactory["Bubble"].parse(data);
			//-----------------------
			if (param2!=null){
				Bubble_bubbles_byid[param3].displayEditor(param2);
				isbubbleput(false);
				updateBubbleTreeMap();
				isbubbleput(true);
			}

		}
	});
};

//==================================
UIFactory["Bubble"].getPublicURL = function(mapid,sharerole)
//==================================
{
	var map_url = "";
	var urlS = serverBCK+'/direct?uuid='+mapid+'&role=all&lang=fr&l=4&d=unlimited&type=showtorole&showtorole=all&sharerole='+sharerole;
	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		mapid : mapid,
		success : function (data){
			var url = window.location.href;
			var serverURL = url.substring(0,url.lastIndexOf(appliname)+appliname.length);
			map_url = serverURL+"/application/htm/public.htm?i="+data;
			$("#qrcode-image").qrcode({text:map_url,size:100,background: 'white'});
			var text = document.getElementById("qrcode-image").toDataURL("image/jpeg");
			putQRcodeforCV(text);
			$("#map-link_"+this.mapid).attr('href',map_url);
		}
	});
}

//====================================
function isbubbleput(v)
//====================================
{
	g_bubble_put=v;
}

//====================================
function getIframeObj(id)
//====================================
{
	var el = document.getElementById(id);
	var obj_c = null; 
	if(el.contentWindow){
		obj_c = el.contentWindow;
	}else if(el.contentDocument){
	   obj_c = el.contentDocument;
	}
	return obj_c;
}

//====================================
function loadBubbleTreeMap()
//====================================
{
	var obj_c = getIframeObj("bubble_iframe"); 
	if (obj_c.map == null)
		obj_c.createBubbleTreeMap(g_current_mapid);
}

//====================================
function updateBubbleTreeMap()
//====================================
{
	var obj_c = getIframeObj("bubble_iframe"); 
	obj_c.displayBubbleTreeMap(g_current_mapid);
/*
	var el = document.getElementById("bubble_iframe");
	if(el.contentWindow){
	   el.contentWindow.displayBubbleTreeMap(g_current_mapid);
	}else if(el.contentDocument){
	   el.contentDocument.displayBubbleTreeMap(g_current_mapid);
	}
	*/
}

//====================================
function clickBubble(node)
//====================================
{
	Bubble_bubbles_byid[node.id].displayView("bubble_display_"+g_current_mapid);
}

//====================================
UIFactory["Bubble"].getLinkQRcode = function(uuid)
//====================================
{
	var html = "<div class='btn-group'>"+karutaStr[LANG]["bubble-share-map"]+"<a class='button' id='map-link_"+uuid+"'  href='' target='_blank'>"+karutaStr[LANG]["bubble-share-link"]+"</a> <span class='button' id='qrcode-link_"+uuid+"' onclick=\"$('#qrcode-window').modal('show')\">"+karutaStr[LANG]["bubble-share-qrcode"]+"</span></div>";
	return html;
}
//====================================
function qrCodeBox()
//====================================
{
	var html = "";
	html += "<div id='qrcode-window' class='modal'>";
	html += "	<div id='qrcode-window-header' class='modal-header'>QR Code</div>";
	html += "	<div id='qrcode-window-body' class='modal-body' style='text-align:center'>";
	html += "		<canvas width='100' height='100' id='qrcode-image'></canvas>";
	html += "	</div>";
	html += "	<div id='qrcode-window-window-footer' class='modal-footer'><button class='btn' onclick=\"$('#qrcode-window').modal('hide')\">"+karutaStr[LANG]["Close"]+"</button></div>";
	html += "</div>";
	return html;
}

//==================================
function putQRcodeforCV(qrcode)
//==================================
{
	var qrcode_nodeid = $("asmContext:has(metadata[semantictag='qrcode'])",g_portfolio_current).attr('id');
	var xml = "<asmResource xsi_type='Field'>";
	xml += "<text lang='"+LANG+"'>"+qrcode+"</text>";
	xml += "</asmResource>";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/resources/resource/" + qrcode_nodeid,
		success : function(data) {
		}
	});
}
