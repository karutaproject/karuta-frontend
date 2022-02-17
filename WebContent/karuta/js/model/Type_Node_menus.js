let getObjs = ['label', 'text']

let menuElts = {};
menuElts ["menu"]= "<menu del='y'><menulabel/></menu>";
menuElts ["item"]= "<item del='y'><itemlabel/><roles/><condition/></item>";
menuElts ["function"]= "<function del='y'><js/></function>";
menuElts ["import"]= "<import del='y'><srce><foliocode/><semtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import>";
menuElts ["import-today-date"]= "<import-today-date del='y'><nop/><trgt><position>##currentnode##</position><semtag/></trgt></import-today-date>";
menuElts ["import-component-w-today-date"]= "<import-component-w-today-date del='y'><srce><foliocode/><semtag/><updatedtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-component-w-today-date>";
menuElts ["moveTO"]= "<moveTO del='y'><start-semtag/><destination-semtag/></moveTO>";
menuElts ["import-component"]= "<import-component del='y'><srce><foliocode/><semtag/><updatedtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-component>";
menuElts ["import-proxy"]= "<import-proxy del='y'><srce><foliocode/><semtag/><updatedtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-proxy>";
menuElts ["import-elts"]= "<import-elts del='y'><srce><foliocode disabled='y'>search code</foliocode></srce></import-elts>";
menuElts ["import-elts-from"]= "<import-elts-from del='y'><srce><foliocode/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-elts-from>";
menuElts ["import-elts-from-source"]= "<import-elts-from-source del='y'><srce><foliocode/><semtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-elts-from-source>";
menuElts ["import-elts-from-search"]= "<import-elts-from-search del='y'><srce><foliocode disabled='y'>search code</foliocode><semtag/></srce><trgt><position>##currentnode##</position><semtag/></trgt></import-elts-from-search>";
menuElts ["action"]= "<action del='y'><srce><portfoliocode/><semtag/></srce></action>";
menuElts ["srce"]= "<srce del='n'><foliocode/><semtag/></srce>";
menuElts ["trgt"]= "<trgt del='y'><position>##currentnode##</position><semtag/></trgt>";
menuElts ["get_single"]= "<get_single del='y'><srce><foliocode/><semtag/></srce></get_single>";
//menuElts ["get_multiple"]= "<get_multiple del='y'><search><foliocode/><semtag/></search><import2><srce><foliocode/><semtag/></srce></import2></get_multiple>";
menuElts ["import_get_multiple"]= "<import_get_multiple del='y'><boxlabel></boxlabel><unique>true</unique><search><foliocode/><semtag/><object/></search><g_actions><nop/></g_actions></import_get_multiple>";
menuElts ["import_get_get_multiple"]= "<import_get_get_multiple del='y'><boxlabel></boxlabel><unique>true</unique><parent><position/><semtag/></parent><gg_search><nop/></gg_search><gg_actions><nop/></gg_actions></import_get_get_multiple>";
menuElts ["execReportforBatchCSV"]= "<execReportforBatchCSV del='y'><report-code/></execReportforBatchCSV>";
menuElts ["search-source"]= "<search-source del='y'><foliocode/><parent-semtag></parent-semtag><semtag/><object disabled='y'>label</object></search-source>";
menuElts ["search-in-parent"]= "<search-in-parent del='y'><foliocode disabled='y'>##parentcode##</foliocode><semtag/><object/></search-in-parent>";
menuElts ["search-w-parent"]= "<search-w-parent del='y'><foliocode>##parentcode##</foliocode><semtag/><object/></search-w-parent>";


let menuItems = {};
menuItems['menus']= ["menu"];
menuItems['import']= ["trgt","function"];
menuItems['import-component']= ["trgt","function"];
menuItems['import-elts']= ["trgt","function"];
menuItems['trgt']= ["function"];
menuItems['import-elts-from']= ["trgt"];
menuItems['import-today-date']= ["trgt","function"];
menuItems['import-component-w-today-date']= ["trgt","function"];
menuItems['get_single']= ["trgt"];
menuItems['menu']= ["item"];
menuItems['item']= ["import","function","moveTO","import_get_multiple","import_get_get_multiple","execReportforBatchCSV","import-today-date","import-component-w-today-date"];
menuItems['g_actions']= ["import-component","import-elts-from","import-proxy"];
menuItems['gg_search']= ["search-source","#or","search-in-parent","#or","search-w-parent"];
menuItems['gg_actions']= ["import-component","import-elts-from","#line","import","import-component-w-today-date","import-today-date"];

let menueltslist =[];

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------------- MENUS ------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].getEltMenu = function(parentid,menus,targetid,title,databack,callback,param2,param3,param4)
//==================================================
{
	var html ="";
	var srce = menus[0];
	var tag = menus[1];
	if (srce=="self")
		srce = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	if (srce=='multiple'){
		var menuelts = tag.split("//");
		for (var j=1;j<menuelts.length;j++){
			if (menuelts[j].indexOf("/")>-1) {
				var items = tag.split("/");
				html += items[0] +"('"+parentid+"','"+targetid+"','"+title.replaceAll("'","##apos##")+"'";
				if (items.length>1)
					html += ",";
				for (var i=1;i<items.length;i++){
					html += "'" + items[j] + "'";
					if (i<items.length-1)
						html += ",";
				}
				html += ");"
			} else {
				var semtags = menuelts.split("+");
				for (var i=0;i<semtags.length;i++){
					if (semtags[i].length>0)
						if (targetid!="")
							html += "importBranch('"+targetid+"','"+srce.trim()+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
						else
							html += "importBranch('"+parentid+"','"+srce.trim()+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
				}
			}
		}
	} else if (srce=='function'){
		var items = tag.split("/");
		html += items[0] +"('"+parentid+"','"+targetid+"','"+title.replaceAll("'","##apos##")+"'";
		if (items.length>1)
			html += ",";
		for (var i=1;i<items.length;i++){
			html += "'" + items[i] + "'";
			if (i<items.length-1)
				html += ",";
		}
		html += ");"
	} else {
		var semtags = tag.split("+");
		for (var i=0;i<semtags.length;i++){
			if (semtags[i].length>0)
				if (targetid!="")
					html += "importBranch('"+targetid+"','"+srce.trim()+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
				else
					html += "importBranch('"+parentid+"','"+srce.trim()+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
		}
	}
	html += "\">";
	html += title;
	return html;
}
//==================================================
UIFactory["Node"].getSingleMenu = function(parentid,menus,targetid,title,databack,callback,param2,param3,param4)
//==================================================
{	// note: #xxx is to avoid to scroll to the top of the page
	var menus_style = UICom.structure.ui[parentid].getMenuStyle();
	var html = "<a class='button add-button btn' style='"+menus_style+"' onclick=\"";
	html += UIFactory.Node.getEltMenu(parentid,menus,targetid,title,databack,callback,param2,param3,param4);
	html += "</a>";
	return html;
};

//==================================================
UIFactory["Node"].getSpecificMenu = function(parentid,menus,targetid,title,databack,callback,param2,param3,param4)
//==================================================
{
	var menus_style = UICom.structure.ui[parentid].getMenuStyle();
	var html = "<div class='dropdown-item btn add-button' style='"+menus_style+"' onclick=\"";
	html += UIFactory.Node.getEltMenu(parentid,menus,targetid,title,databack,callback,param2,param3,param4);
	html += "</div>";
	return html;
};

//==================================================
UIFactory["Node"].getItemMenu = function(parentid,srce,tag,title,databack,callback,param2,param3,param4,freenode)
//==================================================
{	// note: # is to avoid to scroll to the top of the page
	if (srce=="self")
		srce = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	var html = "<div class='dropdown-item' onclick=\"";
	var semtags = tag.split(" ");
	for (var i=0;i<semtags.length;i++){
		if (semtags[i].length>0)
		html += "importBranch('"+parentid+"','"+srce.trim()+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
	}
	html += "\">";
	html += karutaStr[LANG][title];
	html += "</div>";
	return html;
};


//==================================================
UIFactory["Node"].prototype.displayMenus = function(dest,langcode)
//==================================================
{
	var html = this.getMenus(langcode);
	$(dest).html(html);
	//------------ Public URL -----------------
	if ($("#2world-"+this.id).length){
		var shares = [];
		var displayShare = [];
		var items = this.shareroles.split(";");
		for (var i=0; i<items.length; i++){
			var subitems = items[i].split(",");
				//----------------------
			shares[i] = [];
			shares[i][0] = subitems[0]; // sharing role
			if (subitems.length>1) {
				shares[i][1] = subitems[1]; // recepient role
				shares[i][2] = subitems[2]; // roles or emails
				shares[i][3] = subitems[3]; // level
				shares[i][4] = subitems[4]; // duration
				shares[i][5] = subitems[5]; // labels
			} else {
				shares[i][1] = ""; // recepient role
				shares[i][2] = ""; // roles or emails
				shares[i][3] = ""; // level
				shares[i][4] = ""; // duration
				shares[i][5] = ""; // labels
			}
			if (subitems.length>6)
				shares[i][6] = subitems[6]; // target
			if (subitems.length>7)
				shares[i][7] = subitems[7]; // keywords : obj and/or mess
			if (subitems.length>8)
				shares[i][8] = subitems[8]; // condition
			//----------------------
			if (shares[i][0].indexOf(this.userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
				displayShare[i] = true;
			else
				displayShare[i] = false;
			//----------------------
			var targetid = this.id; //by default the node itself
			if (shares[i].length>6 && shares[i][6]!=""){
				target = getTarget (node,menus[i][6]);
				if (target.length>0)
					targetid = $(target[0]).attr("id");
			}
		}
		for (var i=0; i<items.length; i++){
			if (shares[i][2]=='2world') {
				var urlS = serverBCK+"/direct?uuid="+targetid+"&role="+shares[i][1]+"&lang="+languages[langcode]+"&l="+shares[i][3]+"&d="+shares[i][4]+"&type=showtorole&showtorole="+shares[i][2]+"&sharerole="+shares[i][0];
				$.ajax({
					id : this.id,
					type : "POST",
					dataType : "text",
					contentType: "application/xml",
					url : urlS,
					success : function (data){
						var url = window.location.href;
						var serverURL = url.substring(0,url.lastIndexOf(appliname+"/")+appliname.length);
						url = serverURL+"/karuta/htm/public.htm?i="+data+"&amp;lang="+languages[langcode];
						$("#2world-"+this.id).html("<a  class='fas fa-globe button' target='_blank' href='"+url+"' data-title='"+karutaStr[LANG]["button-2world"]+"' data-toggle='tooltip' data-placement='bottom'></a> ");
					}
				});
			}
		}
	}
}

//==================================================
UIFactory["Node"].prototype.getMenus = function(langcode)
//==================================================
{
	return UIFactory.Node.getMenus(this,langcode);
}
//==================================================
UIFactory["Node"].getMenus = function(node,langcode)
//==================================================
{
	var html = "";
	var menus_style = node.getMenuStyle();
	//------------- node menus button ---------------
	if ((USER.admin || g_userroles[0]=='designer') && (node.asmtype != 'asmContext' && (node.depth>0 || node.asmtype == 'asmUnitStructure'))) {
		html += "<span class='dropdown'>";
		html += "	<button class='btn dropdown-toggle add-button' style='"+menus_style+"' type='button' id='add_"+node.id+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		html += 		karutaStr[languages[langcode]]['Add'];
		html += "	</button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='add_"+node.id+"'>";
		//--------------------------------
		if (node.asmtype == 'asmRoot' || node.asmtype == 'asmStructure') {
			var databack = false;
			var callback = "UIFactory.Node.reloadStruct";
			var param2 = "'"+g_portfolio_rootid+"'";
			var param3 = null;
			var param4 = null;
			html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmStructure','asmStructure',databack,callback,param2,param3,param4);
			html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmUnit','asmUnit',databack,callback,param2,param3,param4);
		}
		var databack = false;
		var callback = "UIFactory.Node.reloadUnit";
		var param2 = "'"+g_portfolioid+"'";
		var param3 = null;
		var param4 = null;
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','asmUnitStructure','asmUnitStructure',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','TextField','TextField',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Field','Field',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Document','Document',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','URL','URL',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Calendar','Calendar',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Image','Image',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Video','Video',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Audio','Audio',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Oembed','Oembed',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Color','Color',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','URL2Unit','URL2Unit',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','URL2Portfolio','URL2Portfolio',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Comments','Comments',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','SendEmail','SendEmail',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Dashboard','Dashboard',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Report','Report',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','DocumentBlock','DocumentBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','URLBlock','URLBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','ImageBlock','ImageBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','URL2UnitBlock','URL2UnitBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','URL2PortfolioBlock','URL2PortfolioBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-structured-resources','TextFieldBlock','TextFieldBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-bubbles','bubble_level1','BubbleMap',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'europass.parts','EuropassL','Europass',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Item','Item',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Resource','Get_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Get_Resource','Get_Get_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Double_Resource','Get_Double_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Proxy','Proxy',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','g-variable','Variable',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Proxy','Get_Proxy',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(node.id,'karuta.karuta-resources','Get_Portfolio','Get_Portfolio',databack,callback,param2,param3,param4);
		//--------------------------------
		if (plugin_resources.length>0){
			html += "<hr>";
			for (var i=0; i<plugin_resources.length; i++) {
				html += UIFactory.Node.getItemMenu(node.id,plugin_resources[i].location,plugin_resources[i].tag,plugin_resources[i].label,databack,callback,param2,param3,param4);
			}
		}
		//--------------------------------
		html += "	</div>"; // class='dropdown-menu'
		html += "</span>"; // class='dropdown'
	}
	//------------- specific menu ---------------
	var no_monomenu = 0;
	try {
		if ((g_menuinreport || node.depth>0 || node.asmtype == 'asmUnitStructure' || node.asmtype == 'asmContext') && node.menuroles != undefined && node.menuroles.length>10 && (node.menuroles.indexOf(node.userrole)>-1 || node.menuroles.indexOf($(USER.username_node).text())>-1 || (node.menuroles.containsArrayElt(g_userroles) && node.menuroles.indexOf("designer")<0) || USER.admin || g_userroles[0]=='designer') ){
			//--------------------------------
			if (node.menuroles.charAt(0)!="<") {
				var mlabels = [];
				var labelitems = node.menulabels.split(";");
				for (var i=0; i<labelitems.length; i++){
					var subitems = labelitems[i].split(",");
					mlabels[i] = [];
					mlabels[i][0] = subitems[0]; // label
					mlabels[i][1] = subitems[1]; // roles
				}
				//--------------------------------
				var menus = [];
				var displayMenu = false;
				if (node.menuroles.indexOf('function')<0)
					node.menuroles = replaceVariable(node.menuroles);
				var items = node.menuroles.split(";");
				for (var i=0; i<items.length; i++){
					var subitems = items[i].split(",");
					menus[i] = [];
					if (subitems[0]=="#line") {
						menus[i][0] = subitems[0]; // portfolio code
						menus[i][1] = ""; // semantic tag
						menus[i][2] = ""; // label
						menus[i][3] = ""; // roles
						menus[i][4] = ""; // target
						menus[i][5] = ""; // condition
	
					} else {
						menus[i][0] = subitems[0]; // portfolio code
						menus[i][1] = subitems[1]; // semantic tag
						menus[i][2] = subitems[2]; // label
						menus[i][3] = subitems[3]; // roles
						if (subitems.length>4)
							menus[i][4] = subitems[4]; // target
						else
							menus[i][4] = ""; // target
						if (subitems.length>5)
							menus[i][5] = subitems[5]; // condition
						else
							menus[i][5] = ""; // condition
					}
					if (menus[i][3].indexOf(node.userrole)>-1 || menus[i][3].indexOf($(USER.username_node).text())>-1 || (menus[i][3].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer'){
						if (menus[i][5]==""){
							displayMenu = true;  // node.userrole may be included in semantictag
							no_monomenu = i;
						}
						else if(eval(menus[i][5])){
							displayMenu = true;
							no_monomenu = i;
						}
					}
				}
				//--------------------------------
				var nbmenus = 0;
				for (var i=0; i<menus.length; i++){
					if (menus[i][3].indexOf(node.userrole)>-1 || menus[i][3].indexOf($(USER.username_node).text())>-1 || menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
							nbmenus++;
				}
				var monomenu = (nbmenus==1);
				//--------------------------------
				if (displayMenu && !monomenu) {
					//-----------------------
					html += "<span class='dropdown'>";
					html += "	<button class='btn dropdown-toggle add-button' style='"+menus_style+"' type='button' id='specific_"+node.id+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
					//-----------
					if (mlabels[0][0]!='none' && mlabels[0][0]!='') {
						for (var i=0; i<mlabels.length; i++){
							if (mlabels[i][1].indexOf(node.userrole)>-1 || mlabels[i][1].containsArrayElt(g_userroles) || mlabels[i][1].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer') {
								var titles = [];
								var title = "";
								try {
									titles = mlabels[i][0].split("/");
									if (mlabels[i][0].indexOf("@")>-1) { // lang@fr/lang@en/...
										for (var j=0; j<titles.length; j++){
											if (titles[j].indexOf("@"+languages[langcode])>-1)
												title = titles[j].substring(0,titles[j].indexOf("@"));
										}
									} else { // lang1/lang2/...
										title = titles[langcode];  // lang1/lang2/...
									}
								} catch(e){
									title = mlabels[i][0];
								}
								html += title;
							}
						}
					} else {
							html += karutaStr[languages[langcode]]['menu'];
					}
					//-----------
					html += "	</button>";
					html += "	<div class='dropdown-menu dropdown-menu-right' style='"+menus_style+"' aria-labelledby='specific_"+node.id+"'>";
					//--------------------------menu items--------------------------------------
					var databack = false;
					for (var i=0; i<menus.length; i++){
						var callback = "UIFactory.Node.reloadUnit";
						if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' )
							callback = "UIFactory.Node.reloadStruct";
						var param2 = null;
						var param3 = null;
						var param4 = null;
						if (menus[i][0]=="#line") {
							html += "<div class='dropdown-divider'></div>";
						} else {
							var titles = [];
							var title = "";
							try {
								titles = menus[i][2].split("/");
								if (menus[i][2].indexOf("@")>-1) { // lang@fr/lang@en/...
									for (var j=0; j<titles.length; j++){
										if (titles[j].indexOf("@"+languages[langcode])>-1)
											title = titles[j].substring(0,titles[j].indexOf("@"));
									}
								} else { // lang1/lang2/...
									title = titles[langcode];  // lang1/lang2/...
								}
							} catch(e){
								title = menus[i][2];
							}
							//---------------------target----------------------------------------
							var targetid = "";
							if (menus[i][4]!=""){
								target = getTarget (node,menus[i][4]);
								if (target.length>0) {
									targetid = $(target[0]).attr("id");
									//---------- search for parent to reload after import------
									var parent = target[0];
									while ($(parent).prop("nodeName")!="asmUnit" && $(parent).prop("nodeName")!="asmStructure" && $(parent).prop("nodeName")!="asmRoot") {
										parent = $(parent).parent();
									}
									var parentid = $(parent).attr("id");
									if ($(parent).prop("nodeName") == "asmUnit"){
										callback = "UIFactory.Node.reloadUnit";
										param2 = "'"+parentid+"'";
										if ($("#page").attr('uuid')!=parentid)
											param3 = false;
									}
									else {
										callback = "UIFactory.Node.reloadStruct";
										param2 = "'"+g_portfolio_rootid+"'";
										if ($("#page").attr('uuid')!=parentid)
											param3 = false;
									}
									//---------------------------------------------------------
								}
	
							}
							//-------------------------------------------------------------
							if (menus[i][3].indexOf(node.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || menus[i][3].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer')
								html += UIFactory["Node"].getSpecificMenu(node.id,menus[i],targetid,title,databack,callback,param2,param3,param4);
						}
					}
					//----------------------------------------------------------------
					html += "		</div>"; // class='dropdown-menu'
					html += "	</span><!-- class='dropdown -->";
				}
				if (displayMenu && monomenu) {
					var databack = false;
					var param2 = null;
					var param3 = null;
					var param4 = null;
					var callback = "UIFactory.Node.reloadUnit";
					if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' ) {
						callback = "UIFactory.Node.reloadStruct";
						param2 = "'"+g_portfolio_rootid+"'";
					}
					var i = no_monomenu;
					//-------------------
					var titles = [];
					var title = "";
					try {
						for (var j=0;j<menus[i][2].length;j++){
							if (menus[i][2].charAt(j)=='/' && j>3 && menus[i][2].charAt(j-3) == '@')
								menus[i][2] = menus[i][2].substring(0, j) + '|' + menus[i][2].substring(j + 1);
						}
						titles = menus[i][2].split("|");
						if (menus[i][2].indexOf("@")>-1) { // lang@fr/lang@en/...
							for (var j=0; j<titles.length; j++){
								if (titles[j].indexOf("@"+languages[langcode])>-1)
									title = titles[j].substring(0,titles[j].indexOf("@"));
							}
						} else { // lang1/lang2/...
							title = titles[langcode];  // lang1/lang2/...
						}
					} catch(e){
						title = menus[i][2];
					}
					//---------------------target----------------------------------------
					var targetid = "";
					if (menus[i][4]!=""){
						target = getTarget (node,menus[i][4]);
						if (target.length>0) {
							targetid = $(target[0]).attr("id");
							//---------- search for parent to reload after import------
							var parent = target[0];
							while ($(parent).prop("nodeName")!="asmUnit" && $(parent).prop("nodeName")!="asmStructure" && $(parent).prop("nodeName")!="asmRoot") {
								parent = $(parent).parent();
							}
							var parentid = $(parent).attr("id");
							if ($(parent).prop("nodeName") == "asmUnit"){
								callback = "UIFactory.Node.reloadUnit";
								param2 = "'"+parentid+"'";
								if ($("#page").attr('uuid')!=parentid)
									param3 = false;
							}
							else {
								callback = "UIFactory.Node.reloadStruct";
								param2 = "'"+g_portfolio_rootid+"'";
								if ($("#page").attr('uuid')!=parentid)
									param3 = false;
							}
							//---------------------------------------------------------
						}
					}
					if (menus[i][3].indexOf(node.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || menus[i][3].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer')
						html += UIFactory["Node"].getSingleMenu(node.id,menus[i],targetid,title,databack,callback,param2,param3,param4);
					//------------------
				}
			} else { //new menus ============================================================================================================
				//------------------
				var databack = false;
				var param2 = null;
				var param3 = null;
				var param4 = null;
				var callback = "UIFactory.Node.reloadUnit";
				if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' ) {
					callback = "UIFactory.Node.reloadStruct";
					param2 = "'"+g_portfolio_rootid+"'";
				}
				//------------------
				var parser = new DOMParser();
				var xmlMenuDoc = parser.parseFromString(node.menuroles,"text/xml");
				var menus = $("menu",xmlMenuDoc);
				for (var i=0;i<menus.length;i++){
					let menulabel = $("menulabel",menus[i]).text();
					var items = $("item",menus[i]);
					var nbitems = 0;
					for (var j=0;j<items.length;j++) {
						var roles = $("roles",items[j]).text();
						var condition = ($("condition",items[j]).length>0)?$("condition",items[j]).text():"";
						if (UIFactory.Node.testDisplay(node,roles,condition))
							nbitems++;
					}
					if (nbitems>1){
						var parentid = node.id; // default value
						html += "<span class='dropdown'>";
						html += "	<button class='btn dropdown-toggle add-button' style='"+menus_style+"' type='button' id='specific_"+node.id+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
						html += UIFactory.Node.getMenuLabel(menulabel,langcode);
						html += "	</button>";
						html += "	<div class='dropdown-menu dropdown-menu-right' style='"+menus_style+"' aria-labelledby='specific_"+node.id+"'>";
						for (var j=0;j<items.length;j++) {
							var condition = ($("condition",items[j]).length>0)?$("condition",items[j]).text():"";
							if (UIFactory.Node.testDisplay(node,roles,condition)) {
								let title = UIFactory.Node.getMenuLabel($("itemlabel",items[j]).text(),langcode);
								let temphtml = "<div class='dropdown-item' onclick=\"##\">" + title + "</div>";
								html += temphtml.replace("##",UIFactory.Node.getXmlItemMenu(node,parentid,items[j],title,databack,callback,param2,param3,param4));
							}
						}
						html += "	</div>"; // class='dropdown-menu'
//						html += "	</span><!-- class='dropdown -->";

					} else if (nbitems>0){
						for (var j=0;j<items.length;j++) {
							var condition = ($("condition",items[j]).length>0)?$("condition",items[j]).text():"";
							if (UIFactory.Node.testDisplay(node,roles,condition)) {
//								if(menulabel!="")
//									title = UIFactory.Node.getMenuLabel(menulabel,langcode);
//								else
									title = UIFactory.Node.getMenuLabel($("itemlabel",items[j]).text(),langcode);
								let temphtml = "<button class='button add-button btn' style='"+menus_style+"' onclick=\"##\">" + title + "</button> ";
								//---------------------target----------------------------------------
								var parentid = node.id; // default value
								var targetid = "";
								if ($("target",items[0]).length>0){
									target = getTarget (node,$("target",items[0]).text());
									if (target.length>0) {
										targetid = $(target[0]).attr("id");
										//---------- search for parent to reload after import------
										var parent = target[0];
										while ($(parent).prop("nodeName")!="asmUnit" && $(parent).prop("nodeName")!="asmStructure" && $(parent).prop("nodeName")!="asmRoot") {
											parent = $(parent).parent();
										}
										parentid = $(parent).attr("id");
										if ($(parent).prop("nodeName") == "asmUnit"){
											callback = "UIFactory.Node.reloadUnit";
											param2 = "'"+parentid+"'";
											if ($("#page").attr('uuid')!=parentid)
												param3 = false;
										}
										else {
											callback = "UIFactory.Node.reloadStruct";
											param2 = "'"+g_portfolio_rootid+"'";
											if ($("#page").attr('uuid')!=parentid)
												param3 = false;
										}
										//---------------------------------------------------------
									}
								}
								html += temphtml.replace("##",UIFactory.Node.getXmlItemMenu(node,parentid,items[j],title,databack,callback,param2,param3,param4));
							}
						}
					}
				}
				//------------------
			}
		}
	} catch(e){
		alertHTML('Menu Error: check the format: '+e);
	}
	//------------- submit  -------------------
	if (node.submitroles!='none' && node.submitroles!='') {
		//------------------
		var labels = [];
		labels[0] = karutaStr[languages[langcode]]['button-submit'];
		labels[1] = karutaStr[languages[langcode]]['button-unsubmit'];
		labels[2] = karutaStr[languages[langcode]]['submitted'];
		labels[3] = karutaStr[languages[langcode]]['notsubmitted'];
		if (node.textssubmit!="") {
			var texts = node.textssubmit.split(";");
			for (var j=0; j<texts.length; j++){
				var textlang = texts[j].split("/");
				for (var k=0; k<textlang.length; k++){
					if (textlang[k].indexOf("@"+languages[langcode])>-1)
						labels[j] = textlang[k].substring(0,textlang[k].indexOf("@"));
				}
			}
		}
		//------------------
		if ( node.submitted!='Y' && (
				(node.submitnode && ( node.submitroles.indexOf(g_userroles[0])>-1 || node.submitroles.indexOf($(USER.username_node).text())>-1)
				|| USER.admin
				|| g_userroles[0]=='designer'
				|| ( g_userroles[1]=='designer' && node.submitroles.indexOf(g_userroles[0])>-1)
				|| node.submitroles.indexOf(node.userrole)>-1 )))
		{
			html += "<span id='submit-"+node.id+"' style='"+menus_style+"' class='submitbutton button add-button' onclick=\"javascript:confirmSubmit('"+node.id+"'";
			if (node.submitall=='Y')
				html += ",true";
			html += ")\" ";
			html += " >"+labels[0]+"</span>";
		} else {
			if (node.submitted=='Y') {
				if (node.unsubmitnode && ( node.unsubmitroles.indexOf(g_userroles[0])>-1 || node.unsubmitroles.indexOf($(USER.username_node).text())>-1)
				|| USER.admin
				|| g_userroles[0]=='designer'
				|| ( g_userroles[1]=='designer' && node.unsubmitroles.indexOf(g_userroles[0])>-1)
				|| node.unsubmitroles.indexOf(node.userrole)>-1 ) {
					html += "<span id='submit-"+node.id+"' class='button add-button' onclick=\"javascript:reset('"+node.id+"')\" ";
					html += " >"+labels[1]+"</span>";
				}
				html += "<div class='alert submitted button add-button'>"+labels[2] + " " +node.submitteddate+"</div>";
			}
			else {
				html += "<div class='alert not-submitted button add-button'>"+labels[3]+"</div>";
			}
		}
	}
	//------------- share node button ---------------
	if (node.depth>0 && node.shareroles!='none' && node.shareroles!='' && g_portfolioid!='') {
		try {
			var shares = [];
			var displayShare = [];
			var items = node.shareroles.split(";");
			for (var i=0; i<items.length; i++){
				var subitems = items[i].split(",");
				//----------------------
				shares[i] = [];
				shares[i][0] = subitems[0]; // sharing role
				if (subitems.length>1) {
					shares[i][1] = subitems[1]; // recepient role
					shares[i][2] = subitems[2]; // roles or emails
					shares[i][3] = subitems[3]; // level
					shares[i][4] = subitems[4]; // duration
					shares[i][5] = subitems[5]; // labels
				} else {
					shares[i][1] = ""; // recepient role
					shares[i][2] = ""; // roles or emails
					shares[i][3] = ""; // level
					shares[i][4] = ""; // duration
					shares[i][5] = ""; // labels
				}
				if (subitems.length>6)
					shares[i][6] = subitems[6]; // target
				if (subitems.length>7)
					shares[i][7] = subitems[7]; // keywords : obj and/or mess
				if (subitems.length>8)
					shares[i][8] = subitems[8]; // condition
				//----------------------
				if (shares[i][0].indexOf(node.userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
					displayShare[i] = true;
				else
					displayShare[i] = false;
				//----------------------
			}
			for (var i=0; i<shares.length; i++){
				if (displayShare[i]) {
					var html_toadd = "";
					var sharerole = shares[i][0];
					var sharewithrole = shares[i][1];
					var shareto = shares[i][2];
					var sharelevel = shares[i][3];
					var shareduration = shares[i][4];
					var sharelabel = shares[i][5];
					var targetid = node.id; //by default the node itself
					if (shares[i].length>6 && shares[i][6]!=""){
						target = getTarget (node,shares[i][6]);
						if (target.length>0)
							targetid = $(target[0]).attr("id");
					}
					var shareoptions = (shares[i].length>7) ? shares[i][7] : "";
					if (shareto!='' && shareto.indexOf('2world')<0) {
						if (shareto!='?' && shareduration!='?') {
							var sharetoemail = "";
							var sharetoroles = "";
							var sharetos = shareto.split(" ");
							for (var k=0;k<sharetos.length;k++) {
								if (sharetos[k].indexOf("@")>0)
									sharetoemail += sharetos[k]+" ";
								else
									sharetoroles += sharetos[k]+" ";
							}
							var js = "sendSharingURL('"+targetid+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"'"+")";
							if (sharelabel!='') {
								var label = "";
								var labels = sharelabel.split("/");
								for (var j=0; j<labels.length; j++){
									if (labels[j].indexOf("@"+languages[langcode])>-1)
										label = labels[j].substring(0,labels[j].indexOf("@"));
								}
								html_toadd = " <span class='button sharing-button' style='"+menus_style+"' onclick=\""+js+"\"> "+label+"</span>";
							} else {
								html_toadd = " <span class='button sharing-button' style='"+menus_style+"' onclick=\""+js+"\">"+karutaStr[languages[langcode]]['send']+"</span>";
							}
						} else {
							if (shareto!='?') {
								var sharetoemail = "";
								var sharetoroles = "";
								var sharetos = shareto.split(" ");
								for (var k=0;k<sharetos.length;k++) {
									if (sharetos[k].indexOf("@")>0)
										sharetoemail += sharetos[k]+" ";
									else
										sharetoroles += sharetos[k]+" ";
								}
							} else {
								sharetoemail = shareto;
							}
							var js = "getSendSharingURL('"+node.id+"','"+targetid+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"','"+shareoptions+"')";
							if (sharelabel!='') {
								var label = "";
								var labels = sharelabel.split("/");
								for (var j=0; j<labels.length; j++){
									if (labels[j].indexOf("@"+languages[langcode])>-1)
										label = labels[j].substring(0,labels[j].indexOf("@"));
								}
								html_toadd = " <span class='button sharing-button' style='"+menus_style+"' data-toggle='modal' data-target='#edit-window' onclick=\""+js+"\"> "+label+"</span>";
							} else {
								html_toadd = " <span class='button sharing-button' style='"+menus_style+"' data-toggle='modal' data-target='#edit-window' onclick=\""+js+"\">"+karutaStr[languages[langcode]]['send']+"</span>";
							}
						}
					} else {
						if (shareto.indexOf('2world')>-1) {
							html_toadd = "<span id='2world-"+node.id+"'></span>";
						}
						if (shareto.indexOf('?')>-1) {
							html_toadd = "<span class='button sharing-button fas fa-share' style='"+menus_style+"' data-toggle='modal' data-target='#edit-window' onclick=\"getSendPublicURL('"+targetid+"','"+node.shareroles+"')\" data-title='"+karutaStr[LANG]["button-share"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
						}
					}
					if (shares[i].length<=8)
						html += html_toadd;
					else if (shares[i].length>8){
						if (shares[i][8].indexOf ('(')<0)
							shares[i][8] += "('"+node.id+"')"
						if (eval(shares[i][8]))
							html += html_toadd;
					}
						
				}
			}
		} catch(e){
			alertHTML('Share Error: check the format: '+e);
		}
	}
	//--------------------------------------------------
	return html;
	}


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------------- NEW MENU EDITOR --------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================
UIFactory["Node"].prototype.displayMetadataWadMenusEditor = function(destid,attribute,destmenu)
//==================================
{
	var nodeid = this.id;
	var text = $(this.metadatawad).attr(attribute);
	if (text==undefined)
		text = "";
	html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' class='form-control' style='height:50px'>"+text+"</textarea></div>";
	$("#"+destid).append($(html));
	//---------------------------
	$("#"+nodeid+"_"+attribute).change(function(){UIFactory.Node.updateMetadataWadMenuAttribute(nodeid,attribute);UICom.structure.ui[nodeid].displayMenuEditor("edit-window-body-menu")});
	//---------------------------
};

//==================================================
UIFactory["Node"].updateMetadataWadMenuAttribute = function(nodeid,attribute)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	var value = $.trim($("#"+nodeid+"_"+attribute).val());
	$($("metadata-wad",node)[0]).attr(attribute,value);
	UICom.UpdateMetaWad(nodeid);
};

//-------------------------------------------------------------------------s
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//==================================
UIFactory["Node"].addMenuElt = function(tag,noitem,nodeid,destmenu)
//==================================
{	
	const parser = new DOMParser();
	const elt = parser.parseFromString(menuElts[tag],"text/xml");
	$(menueltslist[noitem])[0].append(elt.getElementsByTagName(tag)[0]);
	var value= xml2string(xmlDoc);
	var node = UICom.structure["ui"][nodeid].node;
	$($("metadata-wad",node)[0]).attr('menuroles',value);
	UICom.UpdateMetaWad(nodeid);
	UICom.structure.ui[nodeid].setMetadata();
	UICom.structure.ui[nodeid].displayMenuEditor("edit-window-body-menu");
}

//==================================
UIFactory["Node"].removeMenuElt = function(noitem,nodeid,destmenu)
//==================================
{	
	$(menueltslist[noitem])[0].remove();
	var value= xml2string(xmlDoc);
	var node = UICom.structure["ui"][nodeid].node;
	$($("metadata-wad",node)[0]).attr('menuroles',value);
	UICom.UpdateMetaWad(nodeid);
	UICom.structure.ui[nodeid].setMetadata();
	UICom.structure.ui[nodeid].displayMenuEditor("edit-window-body-menu");
}



//==================================================
UIFactory["Node"].updateMetadataXmlMenuAttribute = function(eltidx,destmenu,nodeid)
//==================================================
{
	const element = menueltslist[eltidx];
	var node = UICom.structure["ui"][nodeid].node;
	var attribute=$(element).prop("nodeName");
	var eltvalue = $.trim($("#"+nodeid+"_"+eltidx+attribute).val());
	$(element).text(eltvalue);
	var value= xml2string(xmlDoc);
	$($("metadata-wad",node)[0]).attr('menuroles',value);
	UICom.UpdateMetaWad(nodeid);
	UICom.structure.ui[nodeid].setMetadata();
	UICom.structure.ui[nodeid].displayMenuEditor("edit-window-body-menu");
};

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

//==================================
UIFactory["Node"].prototype.displayXmlMenuEditor = function(cntidx,destmenu)
//==================================
{
	const nodeid = this.id;
	const eltidx = menueltslist.length-1;
	const element = menueltslist[eltidx];

	const attribute=$(element).prop("nodeName");
	const disabled=$(element).attr("disabled");
	const value = $(element).text();
	let html = "";
	html += "<div class='input-group "+attribute+"'>";
	html += "	<div class='input-group-prepend'>";
	html += "		<span class='input-group-text'>"+karutaStr[languages[LANGCODE]][attribute]+"</span>";
	html += "	</div>";
	html += "	<input id='"+nodeid+"_"+eltidx+attribute+"' ";
	if (disabled=='y')
		html += " disabled=true ";
	html += " type='text' class='form-control "+attribute+"' aria-label='"+karutaStr[languages[LANGCODE]][attribute]+"' aria-describedby='"+attribute+nodeid+"'  value=\""+value+"\">";
	html += "</div>";
	$("#content"+cntidx).append(html);
	//---------------------------
	$("#"+nodeid+"_"+eltidx+attribute).change(function(){UIFactory.Node.updateMetadataXmlMenuAttribute(eltidx,destmenu,nodeid)});
	//---------------------------
};

//==================================
UIFactory["Node"].prototype.displayXMLSelectRole= function(cntidx,destmenu) 
//==================================
{
	const nodeid = this.id;
	const eltidx = menueltslist.length-1;
	const element = menueltslist[eltidx];

	const attribute=$(element).prop("nodeName");
	const value = $(element).text();

	const langcode = LANGCODE;
	let html = "";
	html += "<div class='input-group '>";
	html += "	<div class='input-group-prepend'>";
	html += "		<div class='input-group-text'>";
	html += karutaStr[languages[langcode]][attribute];
	html += "		</div>";
	html += "	</div>";
	html += "	<input autocomplete='off' id='"+nodeid+"_"+eltidx+attribute+"' onchange=\"UIFactory.Node.updateMetadataXmlMenuAttribute('"+eltidx+"','"+destmenu+"','"+nodeid+"')\" type='text' class='form-control' value=\""+value+"\" >";
	html += "	<div class='input-group-append'>";
	html += "		<button class='btn btn-select-role dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
	html += "		<div class='dropdown-menu dropdown-menu-right button-role-caret'>";
	html += "			<a class='dropdown-item' value='' onclick=\"$('#"+nodeid+"_"+eltidx+attribute+"').val('');$('#"+nodeid+"_"+eltidx+attribute+"').change();\")>&nbsp;</a>";
	//---------------------
	let rolesarray = [];
	for (let role in UICom.roles) {
		html += "		<a  class='dropdown-item' value='"+role+"' onclick=\"var v=$('#"+nodeid+"_"+eltidx+attribute+"').val();$('#"+nodeid+"_"+eltidx+attribute+"').val(v+' "+role+"');$('#"+nodeid+"_"+eltidx+attribute+"').change();\")>"+role+"</a>";
		rolesarray[rolesarray.length] = {'libelle':role};
	}
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$("#content"+cntidx).append(html);
	//---------------------------
//	document.getElementById(nodeid+"_"+eltidx+attribute).onchange = function() {UIFactory.Node.updateMetadataXmlMenuAttribute(eltidx,destmenu,nodeid)};
//	let onupdate = "UIFactory.Node.updateMetadataXmlMenuAttribute('"+eltidx+"','"+destmenu+"','"+nodeid+"')";
//	addautocomplete(document.getElementById(nodeid+"_"+eltidx+attribute), rolesarray);
}

//==================================
UIFactory["Node"].prototype.displayXMLSelect= function(cntidx,destmenu,items) 
//==================================
{
	const nodeid = this.id;
	const eltidx = menueltslist.length-1;
	const element = menueltslist[eltidx];

	const attribute=$(element).prop("nodeName");
	const value = $(element).text();

	const langcode = LANGCODE;
	let html = "";
	html += "<div class='input-group '>";
	html += "	<div class='input-group-prepend'>";
	html += "		<div class='input-group-text'>";
	html += karutaStr[languages[langcode]][attribute];
	html += "		</div>";
	html += "	</div>";
	html += "	<input id='"+nodeid+"_"+eltidx+attribute+"' type='text' class='form-control' value=\""+value+"\" ";
	html += "	<div class='input-group-append'>";
	html += "		<button class='btn btn-select-role dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
	html += "		<div class='dropdown-menu dropdown-menu-right button-role-caret'>";
	html += "			<a class='dropdown-item' value='' onclick=\"$('#"+nodeid+"_"+eltidx+attribute+"').val('');$('#"+nodeid+"_"+eltidx+attribute+"').change();\")>&nbsp;</a>";
	//---------------------
	for (let i=0;i<items.length;i++) {
		html += "		<a  class='dropdown-item' value='"+items[i]+"' onclick=\"var v=$('#"+nodeid+"_"+eltidx+attribute+"').val();$('#"+nodeid+"_"+eltidx+attribute+"').val(v+' "+items[i]+"');$('#"+nodeid+"_"+eltidx+attribute+"').change();\")>"+items[i]+"</a>";
	}
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$("#content"+cntidx).append(html);
	//---------------------------
	$("#"+nodeid+"_"+eltidx+attribute).change(function(){UIFactory.Node.updateMetadataXmlMenuAttribute(eltidx,element,destmenu,nodeid)});
	//---------------------------
}

//==================================================
UIFactory["Node"].prototype.displayEltMenu = function(cntidx,destmenu)
//==================================================
{
	let html = "";
	let eltidx = menueltslist.length-1;
	let elt = menueltslist[eltidx];
	let tag = $(elt).prop("tagName");
	let del = $(elt).attr("del");

	html += "<div class='"+tag+"title' style='margin-top:14px;border-top:1px dashed #ced4da'>";
	if (menuItems[tag]!=undefined && menuItems[tag].length>0){
		html += "<div class='dropdown '>";
		html += "<button class='btn dropdown-toggle add-button' style='background-color:transparent;float:right;' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Ajouter</button>";
		html += "<div class='dropdown-menu'>";
		for (let i=0;i<menuItems[tag].length;i++){
			if (menuItems[tag][i]=="#line")
				html += "<div class='dropdown-divider'/>";
			else if (menuItems[tag][i]=="#or")
				html += "<div class='dropdown-item' disabled>OR</div>";
			else
				html += "<div class='dropdown-item' onclick=\"UIFactory.Node.addMenuElt('"+menuItems[tag][i]+"','"+eltidx+"','"+this.id+"','"+destmenu+"')\">"+menuItems[tag][i]+"</div>";
		}
		html += "</div></div>";
	}
	html += "<span>"+tag+"</span>";
	if (del!=undefined && del=='y')
		html +="<i style='' class='button fas fa-trash-alt' onclick=\"UIFactory.Node.removeMenuElt('"+eltidx+"','"+this.id+"','"+destmenu+"')\" data-title='Supprimer' data-toggle='tooltip' data-placement='bottom' data-original-title='' title=''></i>";
	html += "</div>";
	html += "<div id='content"+eltidx+"' class='menucontent'></div>"
	$("#content"+cntidx).append(html);
}

//==================================================
UIFactory["Node"].prototype.displaySubMenuEditor = function(cntidx,destmenu)
//==================================================
{
	let eltidx = menueltslist.length-1;
	this.displayEltMenu(cntidx,destmenu);
	const elts = $(">*",menueltslist[eltidx]);
	for (var k=0;k<elts.length;k++){
		menueltslist.push(elts[k]);
		let tag = $(elts[k]).prop("tagName");
		if ($(">*",elts[k]).length>0){
			this.displaySubMenuEditor (eltidx,destmenu)
		} else {
			if (tag!="nop")
				if (tag.indexOf('role')>-1)
					this.displayXMLSelectRole(eltidx,destmenu);
				else
					this.displayXmlMenuEditor(eltidx,destmenu);
		}
	}
};



//==================================================
UIFactory["Node"].prototype.displayMenuEditor = function(destmenu)
//==================================================
{
	var langcode = LANGCODE;
	var html = "";
	html += "<form id='metadata-menu' class='metadata-menu'></form>";
	html += "<div id='content-1' class='metadata'></div>";
	$("#"+destmenu).html($(html));
	var name = this.asmtype;
	if (this.menuroles==undefined)
		UICom.structure.ui[this.id].setMetadata();
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure'  || name=='asmContext') {
		if (this.menuroles.charAt(0)=="<") {
			//---------------------- NEW Menu----------------------------
			menueltslist = [];
			let parser = new DOMParser();
			if (this.menuroles=="" || this.menuroles=="none")
				this.menuroles = "<menus></menus>";
			this.displayMetadataWadMenusEditor('metadata-menu','menuroles',destmenu);
			xmlDoc = parser.parseFromString(this.menuroles,"text/xml");
			menueltslist.push($("menus",xmlDoc)[0]);
			this.displaySubMenuEditor(-1,destmenu);
		} else {
			//---------------------- OLD Menu----------------------------
			html  = "<label>"+karutaStr[languages[langcode]]['menuroles'];
			if (languages.length>1){
				var first = true;
				for (var i=0; i<languages.length;i++){
					if (!first)
						html += "/";
					html += karutaStr[languages[i]]['menuroles2'];
					first = false;
				}
			} else {
				html += karutaStr[languages[langcode]]['menuroles2'];
			}
			html += karutaStr[languages[langcode]]['menuroles3']+"</label>";
			$("#metadata-menu").append($(html));
			this.displayMetadatawWadTextAttributeEditor('metadata-menu','menuroles');
			//-----------------------
			html  = "<label>"+karutaStr[languages[langcode]]['menulabels'];
			if (languages.length>1){
				var first = true;
				for (var i=0; i<languages.length;i++){
					if (!first)
						html += "/";
					html += karutaStr[languages[i]]['menulabels2'];
					first = false;
				}
			} else {
				html += karutaStr[languages[langcode]]['menulabels2'];
			}
			html += karutaStr[languages[langcode]]['menulabels3']+"</label>";
			$("#metadata-menu").append($(html));
			this.displayMetadatawWadTextAttributeEditor('metadata-menu','menulabels');
			//------------------------------------------
			menueltslist = [];
			if (this.menuroles=="" || this.menuroles=="none") {
				let parser = new DOMParser();
				this.menuroles = "<menus></menus>";
				xmlDoc = parser.parseFromString(this.menuroles,"text/xml");
				menueltslist.push($("menus",xmlDoc)[0]);
				this.displaySubMenuEditor(-1,destmenu);
			}
			//------------------------------------------
		}
	}
};

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------


//==================================================
UIFactory["Node"].testDisplay = function(node,roles,condition)
//==================================================
{
	var display = false;
	condition = replaceVariable(condition,node);
	if (roles.indexOf(node.userrole)>-1 || roles.indexOf($(USER.username_node).text())>-1 || (roles.containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer'){
		if (condition==""){
			display = true;
		}
		else if(eval(condition)){
			display = true;
		}
	}
	return display;
}

//==================================================
UIFactory["Node"].getMenuLabel = function(menulabel,langcode)
//==================================================
{
	let titles = [];
	let title = karutaStr[languages[langcode]]['menu'];
	let notfound = true;
	menulabel = replaceVariable(menulabel);
	while (menulabel!="" && notfound)
		try {
			let firsta = menulabel.indexOf("@");
			let firstslash = menulabel.indexOf("/",firsta);
			if (firstslash==-1)
				firstslash = menulabel.length;
			if (menulabel.substring(0,firstslash).indexOf("@"+languages[langcode])>-1) {
				title = menulabel.substring(0,firsta);
				notfound = false;
			}
			else
				menulabel = menulabel.substring(firstslash+1);
		} catch(e){
			// do nothing
		}
	return title;
}

//==================================================
UIFactory["Node"].getXmlItemMenu = function(node,parentid,item,title,databack,callback,param2,param3,param4)
//==================================================
{
	let onclick = "";
	const itemelts = $(">*",item);
	for (let i=0;i<itemelts.length;i++){
		const type = $(itemelts[i]).prop("tagName");
		//------------------------- function --------------------
		if (type=='function') {
			let js = $("js",itemelts[i]).text();
			js = replaceVariable(js,node);
			onclick += js + ";";
		}
		//--------------- execReport_BatchCSV( --------------------
		else if (type=='execReportforBatchCSV') {
			let codeReport = replaceVariable( ($("report-code",itemelts[i]).length>0)?$("report-code",itemelts[i]).text():"" );
			onclick += "execReport_BatchCSV('"+parentid+"',null,null,'"+codeReport+"',true);";
		}
		//------------------------- moveTO --------------------
		else if (type=='moveTO') {
			let actualparentid = $(node.node).parent().attr('id');
			// --------- start/destination ------------
			let start = replaceVariable( ($("start-semtag",itemelts[i]).length>0)?$("start-semtag",itemelts[i]).text():"" );
			let startid = $(getTarget (node,start)).attr("id");
			let dest = replaceVariable( ($("destination-semtag",itemelts[i]).length>0)?$("destination-semtag",itemelts[i]).text():"" );
			let destid = $(getTarget (node,dest)).attr("id");
			if (actualparentid == startid)
				onclick = "UIFactory.Node.moveTo('"+parentid+"','"+destid+"');UIFactory.Node.loadNode('"+startid+"');UIFactory.Node.loadNode('"+destid+"')";
			else
				onclick = "UIFactory.Node.moveTo('"+parentid+"','"+startid+"');UIFactory.Node.loadNode('"+startid+"');UIFactory.Node.loadNode('"+destid+"')";
		// --------- fcts ------------
			let jss = $("js", $(">function",itemelts[i]));
			if (jss.length>0) {
				for (let j=0;j<jss.length;j++){
					onclick += replaceVariable($(jss[j]).text()+";",node);
				}
			}
		}

		//-----------------------------------------------------------
		//-------- import import-component-w-today-date -------------
		//-----------------------------------------------------------
		else if (type=='import' || type=='import-component-w-today-date') {
			// --------- srce ------------
			let srce = $("srce",itemelts[i])[0];
			let foliocode = replaceVariable( ($("foliocode",srce).length>0)?$("foliocode",srce).text():"" );
			let semtag = replaceVariable( ($("semtag",srce).length>0)?$("semtag",srce).text():"" );
//			let calendar_semtag = replaceVariable( ($("calendar-semtag",itemelts[i]).length>0)?$("calendar-semtag",itemelts[i]).text():"" );
			// --------- targets ------------
			let trgts = $("trgt",itemelts[i]);
			if (trgts.length>0) {
				for (let j=0;j<trgts.length;j++){
					let position = $("position",trgts[j]).text();
					let trgtsemtag = $("semtag",trgts[j]).text();
					let target = getTarget (node,position+"."+trgtsemtag);
					let databack = null;
					let callback = null;
					let param2 = null;
					//----------------
					$.ajaxSetup({async: false});
					if (type=='import-component-w-today-date') {
						databack = true;
						callback = 'UIFactory.Calendar.updateaddedpart';
						param2 = replaceVariable( ($("calendar-semtag",itemelts[i]).length>0)?$("calendar-semtag",itemelts[i]).text():"" );
					}
					if (type=='import') {
						databack = false;
						callback = "UIFactory.Node.reloadUnit";
						if (node.asmtype == 'asmRoot' || node.asmtype == 'asmStructure') {
							callback = "UIFactory.Node.reloadStruct";
						}
						param2 = g_portfolio_rootid;
					}
					//----------------
					var semtags = semtag.split("+");
					for (let k=0;k<semtags.length;k++){
						let targetid = parentid; // default value
						if (semtags[k].length>0) {
							if (target.length>0) {
								targetid = $(target[0]).attr("id");
							} else if (position=='##lastimported##') {
									targetid = position;
							}
						}
						onclick += "importBranch('"+targetid+"','"+foliocode+"','"+semtags[k]+"',"+databack+","+callback+",'"+param2+"');"
					}
					// --------- fcts ------------
					let jss = $("js",trgts[j]);
					if (jss.length>0) {
						for (let k=0;k<jss.length;k++){
							onclick += replaceVariable($(jss[k]).text()+";",node);
						}
					}
				}
			}
			// --------- fcts ------------
			let jss = $("js", $(">function",itemelts[i]));
			if (jss.length>0) {
				for (let j=0;j<jss.length;j++){
					onclick += replaceVariable($(jss[j]).text()+";",node);
				}
			}
		}

		//-----------------------------------------------------------
		//------------------------- get_multiple --------------------
		//-----------------------------------------------------------
		else if (type=='import_get_multiple') {
			let actions = "";
			let imports = "";
			// --------- boxlabel ------------
			let boxlabel = replaceVariable( ($("boxlabel",itemelts[i]).length>0)?$("boxlabel",itemelts[i]).text():"" );
			// --------- unique ------------
			let unique = ($("unique",itemelts[i]).length>0)?$("unique",itemelts[i]).text():"";
			// --------- search ------------
			let search = $("search",itemelts[i])[0];
			let search_foliocode = replaceVariable( ($("foliocode",search).length>0)?$("foliocode",search).text():"" );
			let search_semtag = replaceVariable( ($("semtag",search).length>0)?$("semtag",search).text():"" );
			let search_object = replaceVariable( ($("object",search).length>0)?$("object",search).text():"" );
			// --------import-comp ------
			imports = $("import-component",itemelts[i]);
			if (imports.length>0) {
				for (let j=0;j<imports.length;j++){
					let srce = $("srce",imports[j])[0];
					let foliocode = replaceVariable( ($("foliocode",srce).length>0)?$("foliocode",srce).text():"" );
					let semtag = replaceVariable( ($("semtag",srce).length>0)?$("semtag",srce).text():"" );
					let updatedtag = replaceVariable( ($("updatedtag",srce).length>0)?$("updatedtag",srce).text():"" );
					let fctarray = UIFactory.Node.getFunctionArray(node,imports[j]);
					let trgtarray = UIFactory.Node.getTargetArray(node,parentid,imports[j]);
					actions += "{|type|:|import_component|,|parentid|:|"+parentid+"|,|foliocode|:|"+foliocode+"|,|semtag|:|"+semtag+"|,|updatedtag|:|"+updatedtag+"|,|trgts|:|"+trgtarray.toString()+"|,|fcts|:|"+fctarray.toString()+"|};";
				}
				onclick += "import_get_multiple('"+parentid+"','','"+boxlabel+"','"+search_foliocode+"','"+search_semtag+"','"+search_object+"','"+actions+"','"+unique+"');";
			}
			// --------import-elts ------
			imports = $("import-elts",itemelts[i]);
			if (imports.length>0) {
				for (let j=0;j<imports.length;j++){
					let fctarray = UIFactory.Node.getFunctionArray(node,itemelts[i]);
					let trgtarray = UIFactory.Node.getTargetArray(node,parentid,itemelts[i]);
					actions += "{|type|:|import_elts|,|parentid|:|"+parentid+"|,|foliocode|:|"+search_foliocode+"|,|trgts|:|"+trgtarray.toString()+"|,|fcts|:|"+fctarray.toString()+"|};";
				}
				onclick += "import_get_multiple('"+parentid+"','','"+boxlabel+"','"+search_foliocode+"','"+search_semtag+"','"+search_object+"','"+actions+"','"+unique+"');";
			}
			// --------import-elts-from ------
			imports = $("import-elts-from",itemelts[i]);
			if (imports.length>0) {
				for (let j=0;j<imports.length;j++){
					let srce = $("srce",imports[j])[0];
					let foliocode = replaceVariable( ($("foliocode",srce).length>0)?$("foliocode",srce).text():"" );
					let fctarray = UIFactory.Node.getFunctionArray(node,itemelts[i]);
					let trgtarray = UIFactory.Node.getTargetArray(node,parentid,itemelts[i]);
					actions += "{|type|:|import_elts-from|,|parentid|:|"+parentid+"|,|foliocode|:|"+foliocode+"|,|trgts|:|"+trgtarray.toString()+"|,|fcts|:|"+fctarray.toString()+"|};";
				}
				onclick += "import_get_multiple('"+parentid+"','','"+boxlabel+"','"+search_foliocode+"','"+search_semtag+"','"+search_object+"','"+actions+"','"+unique+"');";
			}
		}
		//-----------------------------------------------------------
		//------------------------- get_get_multiple ----------------
		//-----------------------------------------------------------
		else if (type=='import_get_get_multiple') {
			// --------- boxlabel ------------
			let boxlabel = replaceVariable( ($("boxlabel",itemelts[i]).length>0)?$("boxlabel",itemelts[i]).text():"" );
			// --------- unique ------------
			let unique = ($("unique",itemelts[i]).length>0)?$("unique",itemelts[i]).text():"";
			// --------- parent ------------
			let parent = $("parent",itemelts[i])[0];
			let parent_position = replaceVariable( ($("position",parent).length>0)?$("position",parent).text():"" );
			let parent_semtag = replaceVariable( ($("semtag",parent).length>0)?$("semtag",parent).text():"" );
			// --------- search ------------
			let search = "";
			if ($("search-source",itemelts[i]).length>0)
				search = $("search-source",itemelts[i])[0];
			else if ($("search-in-parent",itemelts[i]).length>0)
				search = $("search-in-parent",itemelts[i])[0];
			else if ($("search-w-parent",itemelts[i]).length>0)
				search = $("search-w-parent",itemelts[i])[0];
			let search_foliocode = replaceVariable( ($("foliocode",search).length>0)?$("foliocode",search).text():"" );
			let search_parent_semtag = replaceVariable( ($("parent-semtag",search).length>0)?$("parent-semtag",search).text():"" );
			let search_semtag = replaceVariable( ($("semtag",search).length>0)?$("semtag",search).text():"" );
			let search_object = replaceVariable( ($("object",search).length>0)?$("object",search).text():"" );
			// -------- actions ------------
			let actions = UIFactory.Node.getActions(parentid,node,itemelts[i]);
			// -----------------------------
			onclick += "import_get_get_multiple('"+parentid+"','','"+boxlabel+"','"+parent_position+"','"+parent_semtag+"','"+search_foliocode+"','"+search_parent_semtag+"','"+search_semtag+"','"+search_object+"','"+actions+"','"+unique+"');";
			//------------------------------------
		}
	}
	return onclick;
}

//==================================================
UIFactory["Node"].getActions = function(parentid,node,item)
//==================================================
{
	let result = "";
	let children = $("gg_actions>*",item);
	for (let child=0;child<children.length;child++){
		let tag = $(children[child]).prop("tagName");
		if (tag!="nop")
			result += UIFactory.Node.getAction(parentid,node,children[child]);
	}
	return result ;
}
//==================================================
UIFactory["Node"].getAction = function(parentid,node,action)
//==================================================
{
	let result = "";
	let tag = $(action).prop("tagName");
//	if (tag=="import-component" || tag=="import" || tag=="import-elts-from" || tag=='import-component-w-today-date') {
		let srce = $("srce",action)[0];
		let foliocode = replaceVariable( ($("foliocode",srce).length>0)?$("foliocode",srce).text():"" );
		let semtag = replaceVariable( ($("semtag",srce).length>0)?$("semtag",srce).text():"" );
		let updatedtag = replaceVariable( ($("updatedtag",srce).length>0)?$("updatedtag",srce).text():"" );
		let fctarray = UIFactory.Node.getFunctionArray(node,action);
		let trgtarray = UIFactory.Node.getTargetArray(node,parentid,action);
		result += "{|type|:|"+tag+"|,|parentid|:|"+parentid+"|,|foliocode|:|"+foliocode+"|,|semtag|:|"+semtag+"|,|updatedtag|:|"+updatedtag+"|,|trgts|:|"+trgtarray.toString()+"|,|fcts|:|"+fctarray.toString()+"|};";
//	}

	return result;
}

//==================================================
UIFactory["Node"].getTargetArray = function(node,parentid,item)
//==================================================
{
	let trgtarray = [];
	let trgts = $("trgt",item);
	if (trgts.length>0) {
		for (let k=0;k<trgts.length;k++){
			let position = $("position",trgts[k]).text();
			let trgtsemtag = $("semtag",trgts[k]).text();
			let trgtelt = (position!="")?position+"."+trgtsemtag:trgtsemtag;
			let target = getTarget (node,trgtelt);
			if (target.length>0) {
				let targetid = $(target[0]).attr("id");
				trgtarray.push(targetid);
			} else if (position=='##lastimported##') {
				trgtarray.push(position);
			} else {
				trgtarray.push(parentid);
			}
			
		}
	}
	return trgtarray;
}

//==================================================
UIFactory["Node"].getFunctionArray = function(node,item)
//==================================================
{
	let fctarray = [];
	let fcts = $("function",item);
	if (fcts.length>0) {
		for (let k=0;k<fcts.length;k++){
			fctarray.push(replaceVariable(encode($(fcts[k]).text()),node));
			//fctarray.push(replaceVariable($(fcts[k]).text().replaceAll("(","<<").replaceAll(")",">>"),node));
		}
	}
	return fctarray;
}
