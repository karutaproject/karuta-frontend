//==================================
UIFactory["Node2"] = function( node )
//==================================
{
	try {
		this.id = $(node).attr('id');
		this.xsi_type = $(node).attr('xsi_type');
		this.node = node;
		this.asmtype = $(node).prop("nodeName");
		this.code_node = $($("code",node)[0]);
		var flag_error = 'a';
		//--------------------
		if ($("value",$("asmResource[xsi_type='nodeRes']",node)).length==0){  // for backward compatibility
			var newelement = createXmlElement("value");
			flag_error = 'b';
			$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newelement);
		}
		this.value_node = $("value",$("asmResource[xsi_type='nodeRes']",node)[0]);
		//------------------------------
		this.userrole = $(node).attr('role');
		if (this.userrole==undefined || this.userrole=='')
			this.userrole = "norole";
		//------------------------------
		this.label_node = [];
		for (var i=0; i<languages.length;i++){
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			if (this.label_node[i].length==0) {
				flag_error = 'c';
				var newElement = createXmlElement("label");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='nodeRes']",node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='nodeRes']",node)[0]);
			}
			if (this.label_node[i].text()=="" && (this.asmtype=="asmRoot" || this.asmtype=="asmStructure" || this.asmtype=="asmUnit" ))
				this.label_node[i].text("&nbsp;"); // to be able to edit it
		}
		flag_error = 'd';
		//------------------------------
		var resource = null;
		this.resource_type = null;
		this.resource = null;
		if (this.asmtype=='asmContext') {
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",node);
			this.resource_type = $(resource).attr("xsi_type");
			this.resource = new UIFactory[this.resource_type](node);
		}
		//------------------------------
		this.context = $("asmResource[xsi_type='context']",node);
		this.context_text_node = [];
		//------------------------------
		for (var i=0; i<languages.length;i++){
			this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='context']",node)[0]);
			if (this.context_text_node[i].length==0) {
				var newElement = createXmlElement("text");
				$(newElement).attr('lang', languages[i]);
				$("asmResource[xsi_type='context']",node)[0].appendChild(newElement);
				this.context_text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='context']",node)[0]);
			}
		}
		//------------------------------
		this.metadata = $("metadata",node);
		this.metadatawad = $("metadata-wad",node);
		this.metadataepm = $("metadata-epm",node);
		this.semantictag = $("metadata",node).attr('semantictag');
		if (this.semantictag==undefined) // for backward compatibility - node without semantictag attribute
			this.semantictag='';
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
		//------------------------------
		this.display = {}; // to refresh after changes
		this.display_label = {}; // to refresh after changes
		this.display_node = {}; // to refresh after changes (metadataepm)
		this.display_context = {}; // to refresh after changes (metadataepm)
		//------------------------------
		this.structured_resource = null;
		if (this.xsi_type!=undefined && this.xsi_type!='' && this.xsi_type != this.asmtype) { // structured resource
			this.structured_resource = new UIFactory[this.xsi_type](node);
		}
		//------------------------------
		this.loaded = !(g_complex); // if not complex all nodes are loaded
		//------ For display -----------------------
		this.edit = null;
		this.inline = null;
		this.menu = null;
		this.inblock = null;
		this.writenode = null;
		this.semtag = null;
		this.collapsed = null;
		this.displayed = null;
		this.collapsible = null;
		this.collapsible = null;
		this.editnoderoles = null;
		this.commentnoderoles = null;
		this.showtoroles = null;
		this.editresroles = null;
		this.inline_metadata = null;
		this.seenoderoles = null;
		this.shareroles = null;
		this.seeqrcoderoles = null;
		this.contentfreenode = null;
		this.privatevalue = null;
		this.submitted = null;
		this.cssclass = null;
	catch(err) {
		alertHTML("UIFactory['Node']--flag_error:"+flag_error+"--"+err.message+"--id:"+this.id+"--resource_type:"+this.resource_type+"--asmtype:"+this.asmtype);
	}
};


//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node2"].prototype.displayStandard2 = function(root,dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock)
//==============================================================================
//==============================================================================
//==============================================================================
{
	if (edit==null || edit==undefined)
		this.edit = false;
	if (inline==null || inline==undefined)
		this.inline = false;
	if (menu==null || menu==undefined)
		this.menu = true;
	if (inblock==null || inblock==undefined)
		this.inblock = false;
	//---------------------------------------
	var data = root.node;
	var uuid = $(data).attr("id");
	var node = UICom.structure["ui"][uuid];
	// ---- store info to redisplay after change ---
	this.display_node[dest] = {"uuid":uuid,"root":root,"dest":dest,"depth":depth,"langcode":langcode,"edit":edit,"inline":inline,"backgroundParent":backgroundParent,"display":"standard"};
	//------------------metadata----------------------------
	var nodetype = $(data).prop("nodeName"); // name of the xml tag
	this.writenode = ($(node.node).attr('write')=='Y')? true:false;
	this.semtag =  ($("metadata",data)[0]==undefined || $($("metadata",data)[0]).attr('semantictag')==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	this.collapsed = 'N';
	if (!g_designerrole)
		this.collapsed = (sessionStorage.getItem('collapsed'+uuid)==undefined)?'N':sessionStorage.getItem('collapsed'+uuid);
	else
		this.collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
	this.displayed = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	this.collapsible = ($(node.metadatawad).attr('collapsible')==undefined)?'N':$(node.metadatawad).attr('collapsible');
	this.editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	this.commentnoderoles = ($(node.metadatawad).attr('commentnoderoles')==undefined)?'':$(node.metadatawad).attr('commentnoderoles');
	this.showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	this.editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	this.inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		inline = true;
	this.seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	this.shareroles = ($(node.metadatawad).attr('shareroles')==undefined)? 'all' : $(node.metadatawad).attr('shareroles');
	this.seeqrcoderoles = ($(node.metadatawad).attr('seeqrcoderoles')==undefined)?'':$(node.metadatawad).attr('seeqrcoderoles');
	this.contentfreenode = ($(node.metadatawad).attr('contentfreenode')==undefined)?'':$(node.metadatawad).attr('contentfreenode');
	this.privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	this.submitted = ($(node.metadatawad).attr('submitted')==undefined)?'none':$(node.metadatawad).attr('submitted');
	if (this.submitted=='Y') {
		menu = false;
	}
	this.cssclass = ($(node.metadataepm).attr('cssclass')==undefined)?'':$(node.metadataepm).attr('cssclass');
	//-------------------- test if visible
	visible =  ( this.displayed=='N' && (g_userroles[0]=='designer'  || USER.admin))
				|| ( this.displayed=='Y' && ( this.seenoderoles.indexOf(USER.username)>-1 
									|| this.seenoderoles.indexOf("all")>-1 
									|| this.seenoderoles.containsArrayElt(g_userroles) 
									|| (this.showtoroles.indexOf("all")>-1 && !this.privatevalue) 
									|| (this.showtoroles.containsArrayElt(g_userroles) && !this.privatevalue) 
									|| g_userroles[0]=='designer')
					)
				);
	if (visible) {
		var structure_node =   node.resource==null 
							|| node.resource.type!='Proxy' 
							|| (node.resource.type=='Proxy' && this.writenode && this.editresroles.containsArrayElt(g_userroles)) 
							|| (g_userroles[0]=='designer' || USER.admin));
		if (structure_node) {
			var readnode = true; // if we got the node the node is readable
			if (g_designerrole)
				readnode = (g_userroles[0]=='designer' || this.seenoderoles.indexOf(USER.username_node.text())>-1 || this.seenoderoles.containsArrayElt(g_userroles) || (this.showtoroles.containsArrayElt(g_userroles) && !this.privatevalue) || this.seenoderoles.indexOf('all')>-1)? true : false;
			if( depth < 0 || !readnode) return;
			//----------------edit control on proxy target ------------
			if (proxies_edit[uuid]!=undefined) {
					var proxy_parent = proxies_parent[uuid];
					if (proxy_parent==dest.substring(8) || dest=='contenu') { // dest = content_{parentid}
						proxy_target = true;
						edit = menu = (proxies_edit[uuid].containsArrayElt(g_userroles) || g_userroles[0]=='designer');
					}
			}
			//==================================DIV NODE =============================================================
			var html = "<div id='node_"+uuid+"' class='standard asmnode "+nodetype+" "+this.semtag+" "+this.cssclass+" ";
			if (this.privatevalue)
				html+= "private ";
			if(this.resource!=null)
				html += this.resource.type;
			html += "'></div>";
			//----------------------------------
			$("#"+dest).append($(html));

			//============================== ASMCONTEXT =============================
			if (nodetype == "asmContext"){
				node.displayAsmContext("node_"+uuid);
			}
			//============================== NODE ===================================
			else { // other than asmContext
				node.displayAsmStruct("node_"+uuid,depth);
			}
			//==========================================================================
			//==============================fin NODE ===================================
			//==========================================================================
			if ( $("#node_"+uuid).length>0 )
				$("#node_"+uuid).replaceWith($(html));
			else
				$("#"+dest).append($(html));
			//---------------------------- BUTTONS AND BACKGROUND COLOR ---------------------------------------------
			var buttons_color = eval($(".button").css("color"));
			var buttons_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
			if (buttons_background_style!="") {
				var buttons_background_color = buttons_background_style.substring(buttons_background_style.indexOf(":")+1,buttons_background_style.indexOf(";"));
				if (buttons_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			var buttons_node_background_style = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
			if (buttons_node_background_style!="") {
				var buttons_node_background_color = buttons_node_background_style.substring(buttons_node_background_style.indexOf(":")+1,buttons_node_background_style.indexOf(";"));
				if (buttons_node_background_color==buttons_color)
					if (buttons_color!="#000000")
						changeCss("#node_"+uuid+" .button", "color:black;");
					else
						changeCss("#node_"+uuid+" .button", "color:white;");
			}
			//-----------------------------------------------------------------------
			if (nodetype == "asmContext" && node.resource.type=='Image') {
				$("#image_"+uuid).click(function(){
					imageHTML("<img class='img-responsive' style='margin-left:auto;margin-right:auto' uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+uuid+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'>");
				});
			}
			//--------------------collapsed------------------------------------------
			if (collapsible=='Y') {
				if (collapsed=='Y') {
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-plus collapsible");
					$("#content-"+uuid).hide();
				}
				else {
					$("#toggleContent_"+uuid).attr("class","glyphicon glyphicon-minus collapsible");
					$("#content-"+uuid).show();
				}
			}
			//--------------------set editor------------------------------------------
			if ($("#display_editor_"+uuid).length>0) {
				UICom.structure["ui"][uuid].resource.displayEditor("display_editor_"+uuid,null,null,null,true);
			}
			if ($("#get_editor_"+uuid).length>0) {
				$("#get_editor_"+uuid).append(UICom.structure["ui"][uuid].resource.getEditor());
			}
			//----------- Comments -----------
			if (edit && inline && writenode)
				UIFactory["Node"].displayCommentsEditor('comments_'+uuid,UICom.structure["ui"][uuid]);
			else
				UIFactory["Node"].displayComments('comments_'+uuid,UICom.structure["ui"][uuid]);
			//----------- help -----------
			if ($("metadata-wad",data)[0]!=undefined && $($("metadata-wad",data)[0]).attr('help')!=undefined && $($("metadata-wad",data)[0]).attr('help')!=""){
				if (depth>0 || nodetype == "asmContext") {
					var help_text = "";
					var attr_help = $($("metadata-wad",data)[0]).attr('help');
					var helps = attr_help.split("/"); // lang1/lang2/...
					if (attr_help.indexOf("@")>-1) { // lang@fr/lang@en/...
						for (var j=0; j<helps.length; j++){
							if (helps[j].indexOf("@"+languages[langcode])>-1)
								help_text = helps[j].substring(0,helps[j].indexOf("@"));
						}
					} else { // lang1/lang2/...
						help_text = helps[langcode];  // lang1/lang2/...
					}
					var help = " <a href='javascript://' class='popinfo'><span style='font-size:12px' class='glyphicon glyphicon-question-sign'></span></a> ";
					$("#help_"+uuid).html(help);
					$(".popinfo").popover({ 
					    placement : 'right',
					    container : 'body',
					    title:karutaStr[LANG]['help-label'],
					    html : true,
					    trigger:'click hover',
					    content: help_text
					});
				}
			}
			//----------------------------------------------
			$("#free-toolbar-menu_"+uuid).click(function(){
				if ($(".free-toolbar",$("#content-"+uuid)).css('visibility')=='hidden') {
					$(".free-toolbar",$("#content-"+uuid)).css('visibility','visible');
					g_free_toolbar_visibility = 'visible';
				}
				else {
					$(".free-toolbar",$("#content-"+uuid)).css('visibility','hidden');
					g_free_toolbar_visibility = 'hidden';
				}
			});
			//---------- video ------------------
			if (!audiovideohtml5 && UICom.structure["ui"][uuid].resource!=null && UICom.structure["ui"][uuid].resource.setParameter != undefined)
				UICom.structure["ui"][uuid].resource.setParameter();
			//------------ Dashboard -----------------
			if (nodetype == "asmContext" && node.resource.type=='Dashboard') {
				report_not_in_a_portfolio = false;
				$("#"+dest).append($("<div class='row'><div id='csv_button_"+uuid+"' class='dashboard-buttons col-md-offset-1 col-md-2 btn-group'></div><div id='pdf_button_"+uuid+"' class='col-md-1 btn-group'></div><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div></div>"));
				var root_node = g_portfolio_current;
				genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
				//---------- display csv or pdf -------
				var html_csv_pdf = ""
				var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
				if (csv_roles.indexOf('all')>-1 || csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
					$("#csv_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
				}
				var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
				if (pdf_roles.indexOf('all')>-1 || pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
					$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div><div class='pdf-button button' onclick=\"javascript:xml2RTF('dashboard_"+uuid+"')\">RTF/Word</div>"));				
				}
				var img_roles = $(UICom.structure["ui"][uuid].resource.img_node).text();
				if (img_roles.indexOf('all')>-1 || img_roles.containsArrayElt(g_userroles) || (img_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
					$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:html2IMG('dashboard_"+uuid+"')\">PNG</div>"));
				}
			}
			//------------ Report -----------------
			if (nodetype == "asmContext" && node.resource.type=='Report') {
				$("#"+dest).append($("<div class='row'><div id='exec_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='dashboard_"+uuid+"' class='createreport col-md-offset-1 col-md-11'></div><div id='csv_button_"+uuid+"' class='col-md-offset-1 col-md-2 btn-group'></div><div id='pdf_button_"+uuid+"' class='col-md-1 btn-group'></div></div>"));
				var model_code = UICom.structure["ui"][uuid].resource.getView();
				var node_resource = UICom.structure["ui"][uuid].resource;
				var startday = node_resource.startday_node.text();
				var time = node_resource.time_node.text();
				var freq = node_resource.freq_node.text();
				var comments = node_resource.comments_node[LANGCODE].text();
//				var data={code:uuid,portfolioid:g_portfolioid,startday:startday,time:time,freq:freq,comments:comments};

				if (model_code!='') {
					$.ajax({
						type : "GET",
						url : serverBCK+"/report/"+uuid+".html",
						dataType: 'html',
						success : function(data) {
							var content_report =  $(data).find("#dashboard_"+uuid).html();
							$("#dashboard_"+uuid).html(content_report);
						},
						error : function(jqxhr,textStatus) {
							register_report(uuid);
							var root_node = g_portfolio_current;
							genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);
						}
					});
					$("#exec_button_"+uuid).html($("<div class='exec-button button'>"+karutaStr[LANG]['exec']+"</div>"));
					$("#exec_button_"+uuid).click(function(){$("#dashboard_"+uuid).html('');genDashboardContent("dashboard_"+uuid,uuid,parent,root_node);});
					//---------- display csv or pdf -------
					var csv_roles = $(UICom.structure["ui"][uuid].resource.csv_node).text();
					if (csv_roles.containsArrayElt(g_userroles) || (csv_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='csv-button button' onclick=\"javascript:xml2CSV('dashboard_"+uuid+"')\">CSV</div>"));				
					}
					var pdf_roles = $(UICom.structure["ui"][uuid].resource.pdf_node).text();
					if (pdf_roles.containsArrayElt(g_userroles) || (pdf_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:xml2PDF('dashboard_"+uuid+"')\">PDF</div><div class='pdf-button button' onclick=\"javascript:xml2RTF('dashboard_"+uuid+"')\">RTF/Word</div>"));				
					}
					var img_roles = $(UICom.structure["ui"][uuid].resource.img_node).text();
					if (img_roles.containsArrayElt(g_userroles) || (img_roles!='' && (g_userroles[0]=='designer' || USER.admin))) {
						$("#csv_button_"+uuid).append($("<div class='pdf-button button' onclick=\"javascript:html2IMG('dashboard_"+uuid+"')\">IMG</div>"));
					}
				}
				if (g_userroles[0]!='designer')
					$("#node_"+uuid).hide();
			}
			//------------ Bubble Map -----------------
			if (semtag=='bubble_level1' && (seeqrcoderoles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')){
				var map_info = UIFactory.Bubble.getLinkQRcode(uuid);
				$('#map-info_'+uuid).html(map_info);
				$('body').append(qrCodeBox());
				UIFactory.Bubble.getPublicURL(uuid,g_userroles[0]);
			}
			//------------ Public URL -----------------
			if ($("#2world-"+uuid).length){
				var shares = [];
				var displayShare = [];
				var items = shareroles.split(";");
				for (var i=0; i<items.length; i++){
					var subitems = items[i].split(",");
					shares[i] = [];
					shares[i][0] = subitems[0]; // sharing role
					if (subitems.length>1) {
						shares[i][1] = subitems[1]; // recepient role
						shares[i][2] = subitems[2]; // roles or emails
						shares[i][3] = subitems[3]; // level
						shares[i][4] = subitems[4]; // duration
						shares[i][5] = subitems[5]; // labels
					} else {
						shares[i][1] = "all"; // recepient role
						shares[i][2] = "2world"; // roles or emails
						shares[i][3] = "4"; // level
						shares[i][4] = "unlimited"; // duration
						shares[i][5] = "URL"; // labels
					}
					if (subitems.length>6)
						shares[i][6] = subitems[6]; // condition
					if (shares[i][0].indexOf(userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
						displayShare[i] = true;
					else
						displayShare[i] = false;
				}
				for (var i=0; i<items.length; i++){
					var urlS = serverBCK+"/direct?uuid="+uuid+"&role="+shares[i][1]+"&lang="+languages[langcode]+"&l="+shares[i][3]+"&d="+shares[i][4]+"&type=showtorole&showtorole="+shares[i][2]+"&sharerole="+shares[i][0];
					$.ajax({
						type : "POST",
						dataType : "text",
						contentType: "application/xml",
						url : urlS,
						success : function (data){
							var url = window.location.href;
							var serverURL = url.substring(0,url.lastIndexOf('karuta')-1);
							url = serverURL+"/application/htm/public.htm?i="+data+"&amp;lang="+languages[langcode];
							$("#2world-"+uuid).html("<a  class='glyphicon glyphicon-globe button' target='_blank' href='"+url+"' data-title='"+karutaStr[LANG]["button-2world"]+"' data-tooltip='true' data-placement='bottom'></a> ");
						}
					});
				}
			}
			// ================================= For each child ==========================
			var backgroundParent = UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
			if (semtag.indexOf('asmColumns')>-1) {
					//----------------- COLUMNS ------------------------
					var blockid = $(root.node).attr("id");
					style = UIFactory["Node"].getContentStyle(blockid);
					html = "<div class='row asmColumn' style='"+style+"'>";
					var blocks = $(root.node).children("asmUnitStructure:has(metadata[semantictag*='asmColumn'])");
					var lgcolumn = Math.floor(12/blocks.length);
					for (var i=0; i<blocks.length; i++) {
						var blockid = $(blocks[i]).attr("id");
						html += "<div id='column_"+blockid+"' class='col-md-"+lgcolumn+"' style='height:100%;"+style+"'>";
						html += "</div><!-- class='col-md' -->";
					}
					html += "</div><!-- class='row' -->";
					$("#content-"+uuid).append(html);
					for (var i=0; i<blocks.length; i++) {
						var blockid = $(blocks[i]).attr("id");
						var child = UICom.structure["tree"][blockid];
						UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root);
					}
					//---------------------------------------
			} else if (semtag.indexOf('asm-block')>-1) {
				//----------------- BLOCKS ------------------------
				var blockid = $(root.node).attr("id");
				var max = semtag.substring(semtag.indexOf('asm-block')+10,semtag.indexOf('asm-block')+12);
				if (max>12)
					max=12;
				var lgcolumn = Math.floor(12/max);
				var blocks = $(root.node).children("asmUnitStructure,asmContext");
				html = "<div class='row asmBlockContainer'>";
				for (var i=0; i<blocks.length; i++) {
					if (i!=0 && i%max==0) {
						html += "</div><!-- class='row' -->";
						html += "<div class='row asmBlockContainer'>";
					}
					var blockid = $(blocks[i]).attr("id");
					var blockstyle = UIFactory["Node"].getContentStyle(blockid);
					html += "<div class='col-md-"+lgcolumn+" col-sm-"+lgcolumn+"'>";
					html += "<div id='column_"+blockid+"' class='block' style='"+blockstyle+"'>";
					html += "</div><!-- class='block' -->";
					html += "</div><!-- class='col-md' -->";
				}
				html += "</div><!-- class='row' -->";
				$("#content-"+uuid).append(html);
				for (var i=0; i<blocks.length; i++) {
					var blockid = $(blocks[i]).attr("id");
					var child = UICom.structure["tree"][blockid];
					var nodename = $(child.node).prop("nodeName"); // name of the xml tag
					var childnode = UICom.structure["ui"][blockid];
					var childsemtag = $(childnode.metadata).attr('semantictag');
					var block = false;
					if (nodename == "asmContext" || childsemtag.indexOf('no-title')>-1)
						UIFactory["Node"].displayBlock(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root,menu);
					else {
						if (childnode.structured_resource!=null) {
							var html = "<div id='structured_resource_"+blockid+"'>"+childnode.structured_resource.getView('structured_resource_'+blockid,null,langcode)+"</div>";
							var block = true;
							html += UICom.structure["ui"][blockid].getButtons(null,null,null,inline,depth,edit,menu,block);
							//-------------- metainfo -------------------------
							if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
								html += "<div id='metainfo_"+blockid+"' class='metainfo'></div><!-- metainfo -->";
							}
							$('#column_'+blockid).append($(html));
							if (g_userroles[0]=='designer' || USER.admin) {  
								UIFactory["Node"].displayMetainfo("metainfo_"+blockid,childnode.node);
							}
							//-----------------------------------------------------------------------------
							if (childnode.structured_resource.type="ImageBlock") {
								$("#image_"+blockid).click(function(){
									imageHTML("<img class='img-responsive' style='margin-left:auto;margin-right:auto' src='../../../"+serverBCK+"/resources/resource/file/"+childnode.structured_resource.image_nodeid+"?lang="+languages[langcode]+"'>");
								});
							}
					} else
							UIFactory["Node"].displayStandard(child,'column_'+blockid,depth-1,langcode,edit,inline,backgroundParent,root,menu,true);
					}
				}
				//---------------------------------------
			} else {
				var alreadyDisplayed = false;
				if (typeof europass_installed != 'undefined' && europass_installed && semtag=="EuropassL"){
					alreadyDisplayed = true;
					if( node.structured_resource != null )
					{
						node.structured_resource.displayView('content-'+uuid,langcode,'detail',uuid,menu);
					}
					else
					{
						console.error("Europass not shown");
						// FIXME: Need visual feedback for missing data
					}
				}
				if (!alreadyDisplayed && semtag!='bubble_level1') {
					for( var i=0; i<root.children.length; ++i ) {
						// Recurse
						var child = UICom.structure["tree"][root.children[i]];
						var childnode = UICom.structure["ui"][root.children[i]];
						var childsemtag = $(childnode.metadata).attr('semantictag');
						var freenode = ($(childnode.metadatawad).attr('freenode')==undefined)?'':$(childnode.metadatawad).attr('freenode');
						if (contentfreenode == 'Y' || freenode == 'Y')
							UIFactory["Node"].displayFree(child, 'content-'+uuid, depth-1,langcode,edit,inline);
						else
							UIFactory["Node"].displayStandard(child, 'content-'+uuid, depth-1,langcode,edit,inline,backgroundParent,root,menu);
					}
				}
			}
			// ==============================================================================
			//------------- javascript dashboard --------------------
			if (depth>1 && $($("metadata",data)[0]).attr('semantictag')!=undefined) {
				var semtag =  $($("metadata",data)[0]).attr('semantictag');
				if (semtag.indexOf('dashboardjs')>-1){
					var dashboard_function = $($("metadata",data)[0]).attr('semantictag').substring(10)+"(UICom.root.node,'content-'+uuid)";
					$("#"+dest).append(eval(dashboard_function));
					$(".popinfo").popover({ 
					    placement : 'bottom',
					    html : true
					});
				}
			}
			//-------------------------------------------------------
			$('a[data-toggle=tooltip]').tooltip({html:true});
			$('[data-tooltip="true"]').tooltip();
			$(".pickcolor").colorpicker();
			//----------------------------
		}
		if ( (g_userroles[0]=='designer' && semtag.indexOf('welcome-unit')>-1) || (semtag.indexOf('welcome-unit')>-1 && semtag.indexOf('-editable')>-1 && semtag.containsArrayElt(g_userroles)) ) {
			html = "<a  class='glyphicon glyphicon-edit' onclick=\"if(!g_welcome_edit){g_welcome_edit=true;} else {g_welcome_edit=false;};$('#contenu').html('');displayPage('"+uuid+"',100,'standard','"+langcode+"',true)\" data-title='"+karutaStr[LANG]["button-welcome-edit"]+"' data-tooltip='true' data-placement='bottom'></a>";
			$("#welcome-edit").html(html);
		}
		$('[data-tooltip="true"]').tooltip();
	} //---- end of private
};

//==================================================
UIFactory["Node2"].prototype.displayAsmContext = function(dest)
//==================================================
{
	if (g_designerrole) {
		writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!writenode)
			writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
	}
	if (g_userroles[0]=='designer') {
		writenode = (editnoderoles.containsArrayElt(g_userroles))? true : false;
		if (!writenode)
			writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
		if (!writenode)
			writenode = (g_userroles[0]=='designer')? true : false;
	}
	var parent_semtag = "";
	if (parent!=null)
		parent_semtag =  ($("metadata",parent.node)[0]==undefined || $($("metadata",parent.node)[0]).attr('semantictag')==undefined)?'': $($("metadata",parent.node)[0]).attr('semantictag');
	var editable_in_line = node.resource.type!='Proxy' && node.resource.type!='Audio' && node.resource.type!='Video' && node.resource.type!='Document' && node.resource.type!='Image' && node.resource.type!='URL';

	if (type=="standard") {
		var html += "<div class='row row-resource'>";
		//-------------- node -----------------------------
		html += "<div id='std_node_"+uuid+"' class='";
		if (parent_semtag.indexOf('asm-block')<0)
			html += "col-md-offset-1 ";
		html += "col-md-2 node-label inside-full-height'>";
		//----------------label------------------------------
		style = UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
		html += "<div id='label_"+uuid+"' class='inside-full-height' style='"+style+"'>";
		html += "</div><!-- inside-full-height -->";
		html += "</div><!-- col-md-2 -->";
		//-------------- resource -------------------------
		if (parent_semtag.indexOf('asm-block')<0)
			html += "<div class='col-md-8' >";
		else
			html += "<div class='col-md-10' >";
		html += "<table><tr>";
		style = UIFactory["Node"].getContentStyle(uuid);
		html += "<td  width='80%' class='resource";
		if (edit && inline && writenode && editable_in_line)
			html += " edit-inline";
		html += "' ";
		html += " style='"+style+"' ";
		html += ">";
		html += "<div id='resource_"+uuid+"' class='inside-full-height ";
		if (node.resource_type!=null)
			html+= "resource-"+node.resource_type;
		html+= "' >";
		html += "</div><!-- inside-full-height -->";
		//-------------- comments -------------------------
		html += "<div id='comments_"+uuid+"' class='comments'></div><!-- comments -->";
		html += "</td>";
	
		//-------------- buttons --------------------------
		html += "<td id='buttons-"+uuid+"' class='buttons same-height'></td>";
		//--------------------------------------------------
		html += "</tr></table>";
		html += "</div><!-- col-md-8  -->";
		if (parent_semtag.indexOf('asm-block')<0)
			html += "<div class='col-md-1'>&nbsp;</div><!-- col-md-1  -->";
		html += "</div><!-- inner row -->";
		//-------------- metainfo -------------------------
		if (g_edit && (g_userroles[0]=='designer' || USER.admin)) {
			html += "<div class='row'><div id='metainfo_"+uuid+"' class='col-md-offset-1 col-md-10 metainfo'></div><!-- metainfo --></div>";
		}
		$("#"+dest).append (html);
	}
	//-------------------------------------------------
	UICom.structure["ui"][uuid].displayLabel("label_"+uuid);
	if (edit && inline && writenode && editable_in_line)
		UICom.structure["ui"][uuid].resource.displayEditor('resource_"+uuid+"');
	else
		UICom.structure["ui"][uuid].resource.displayView('resource_"+uuid+"');
	$("#buttons-"+uuid).append(UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu));
	//-------------------------------------------------
}

//==================================================
UIFactory["Node"].prototype.displayAsmStruct = function(dest,depth)
//==================================================
{
	var depth = metainfos[depth];
	var collapsible = metainfos['collapsible'];
	var nodetype = this.asmtype;
	
	if nodetype(=='asmUnitStructure')
		depth=100;	
	style = "";
	if (depth>0) {
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'padding-top',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-size',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-weight',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'font-style',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'text-align',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'background-color',false);
		if (g_userroles[0]!='designer')
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'othercss',false);
	} else {
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-size',true);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-weight',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-font-style',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-text-align',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-background-color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'inparent-othercss',false);
	}
	
	html += "<div class='row row-node row-node-"+nodetype+"' >";
	//-------------------- collapsible -------------------
	if (collapsible=='Y')
		html += "<div onclick=\"javascript:toggleContent('"+uuid+"')\" class='col-md-1 collapsible'><span id='toggleContent_"+uuid+"' class='button glyphicon glyphicon-expand'></span></div>";
	else
		html += "<div class='col-md-1'>&nbsp;</div>";
	
	//-------------- node -----------------------------
	if (depth!=1 && depth<10 && nodetype=='asmStructure') {
			html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7 same-height'>";
			html += "<a  onclick=\"displayPage('"+uuid+"',1,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>";
	}
	else if (depth!=1 && depth<10 && nodetype=='asmUnit') {
			html += "<div id='prt_node_"+uuid+"' class='node-label col-md-7 same-height' style='"+style+"'>";
			html += "<a  onclick=\"displayPage('"+uuid+"',100,'standard','"+langcode+"',"+g_edit+")\">"+UICom.structure["ui"][uuid].getLabel('prt_node_'+uuid,'span')+"</a>"+"<span id='help_"+uuid+"' class='ihelp'></span>";
		}
	else {
		html += "<div id='std_node_"+uuid+"' class='node-label col-md-7  same-height' style='"+style+"'>";
		//-------------------------------------------------
		var gotView = false;
		if (semtag=='bubble_level1'){
			html += " "+UICom.structure["ui"][uuid].getBubbleView('std_node_'+uuid);
			gotView = true;
		}
		if (!gotView)
			html += " "+UICom.structure["ui"][uuid].getView('std_node_'+uuid);
	}
	//------------------------------------------------
	html += "<div class='separator-line'></div>"
	//-------------- context -------------------------
	html += "<div id='comments_"+uuid+"' class='comments'></div><!-- comments -->";
	//-------------- metainfo -------------------------
	html += "<div id='metainfo_"+uuid+"' class='metainfo'></div><!-- metainfo -->";
	//-----------------------------------------------
	html += "</div><!-- col-md-8 -->";
	//-------------- buttons --------------------------
	if (semtag.indexOf("bubble_level1")>-1)
		menu = false;
	html += "<div id='buttons-"+uuid+"' class='col-md-4 buttons'>";
	html += UICom.structure["ui"][uuid].getButtons(null,null,null,inline,depth,edit,menu);
	if (node.xsi_type == "BatchForm") {
		html += node.structured_resource.getButtons();
	}
	html += "</div><!-- col-md-4  -->";
	html += "</div><!-- row -->";
	//--------------------------------------------------*/
	if (root.children.length>0 && depth>0) {
		html += "<div id='content-"+uuid+"' class='content' ";
		style = "position:relative;";
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-background-color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-font-style',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-color',false);
		style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-padding-top',true);
		if (g_userroles[0]!='designer')
			style += UIFactory["Node"].displayMetadataEpm(metadataepm,'node-othercss',false);
		html +=" style='"+style+"'";
		html += "></div>";
		//-----------------------------------------
	}
	html += "</div><!-- nodetype -->";
	$("#"+dest).append (html);

}