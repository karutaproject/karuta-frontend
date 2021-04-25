
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
	var html = "<a class='button text-button btn' style='"+menus_style+"' onclick=\"";
	html += UIFactory.Node.getEltMenu(parentid,menus,targetid,title,databack,callback,param2,param3,param4);
	html += "</a>";
	return html;
};

//==================================================
UIFactory["Node"].getSpecificMenu = function(parentid,menus,targetid,title,databack,callback,param2,param3,param4)
//==================================================
{
	var menus_style = UICom.structure.ui[parentid].getMenuStyle();
	var html = "<div class='dropdown-item btn text-button' style='"+menus_style+"' onclick=\"";
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
			if (shares[i][0].indexOf(this.userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
				displayShare[i] = true;
			else
				displayShare[i] = false;
		}
		for (var i=0; i<items.length; i++){
			var urlS = serverBCK+"/direct?uuid="+this.id+"&role="+shares[i][1]+"&lang="+languages[langcode]+"&l="+shares[i][3]+"&d="+shares[i][4]+"&type=showtorole&showtorole="+shares[i][2]+"&sharerole="+shares[i][0];
			$.ajax({
				id : this.id,
				type : "POST",
				dataType : "text",
				contentType: "application/xml",
				url : urlS,
				success : function (data){
					var url = window.location.href;
					var serverURL = url.substring(0,url.lastIndexOf(appliname)+appliname.length);
					url = serverURL+"/application/htm/public.htm?i="+data+"&amp;lang="+languages[langcode];
					$("#2world-"+this.id).html("<a  class='fas fa-globe button' target='_blank' href='"+url+"' data-title='"+karutaStr[LANG]["button-2world"]+"' data-toggle='tooltip' data-placement='bottom'></a> ");
				}
			});
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
		if ((node.depth>0 || node.asmtype == 'asmUnitStructure') && node.menuroles != undefined && node.menuroles.length>10 && (node.menuroles.indexOf(node.userrole)>-1 || node.menuroles.indexOf($(USER.username_node).text())>-1 || (node.menuroles.containsArrayElt(g_userroles) && node.menuroles.indexOf("designer")<0) || USER.admin || g_userroles[0]=='designer') ){
			//--------------------------------
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
							var nodes = $("*:has(>metadata[semantictag='"+menus[i][4]+"'])",g_portfolio_current);
							if (nodes.length>0) {
								targetid = $(nodes[0]).attr("id");
								var parent = nodes[0];
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
					var targetid = node.id;
					if (menus[i][4]!=""){
						var nodes = $("*:has(>metadata[semantictag='"+menus[i][4]+"'])",g_portfolio_current);
						if (nodes.length>0) {
							targetid = $(nodes[0]).attr("id");
							var parent = nodes[0];
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
						}
					}
				if (menus[i][3].indexOf(node.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || menus[i][3].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer')
					html += UIFactory["Node"].getSingleMenu(node.id,menus[i],targetid,title,databack,callback,param2,param3,param4);
				//------------------
			}
		}
	} catch(e){
		alertHTML('Menu Error: check the format: '+e);
	}
	//------------- submit  -------------------
	if (node.submitroles!='none' && node.submitroles!='') {
		if ( node.submitted!='Y' && (
				(node.submitnode && ( node.submitroles.indexOf(g_userroles[0])>-1 || node.submitroles.indexOf($(USER.username_node).text())>-1)
				|| USER.admin
				|| g_userroles[0]=='designer'
				|| ( g_userroles[1]=='designer' && node.submitroles.indexOf(g_userroles[0])>-1)
				|| node.submitroles.indexOf(node.userrole)>-1 )))
		{
			html += "<span id='submit-"+node.id+"' style='"+menus_style+"' class='button text-button' onclick=\"javascript:confirmSubmit('"+node.id+"'";
			if (node.submitall=='Y')
				html += ",true";
			html += ")\" ";
			html += " >"+karutaStr[languages[langcode]]['button-submit']+"</span>";
		} else {
			if (node.submitted=='Y') {
				if (USER.admin || g_userroles[0]=='administrator') {
					html += "<span id='submit-"+node.id+"' class='button text-button' onclick=\"javascript:reset('"+node.id+"')\" ";
					html += " >"+karutaStr[languages[langcode]]['button-unsubmit']+"</span>";
				}
				html += "<div class='alert alert-success button text-button'>"+karutaStr[languages[langcode]]['submitted']+node.submitteddate+"</div>";
			} 
			else {
				html += "<div class='alert alert-danger button text-button'>"+karutaStr[languages[langcode]]['notsubmitted']+"</div>";			
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
					shares[i][6] = subitems[6]; // condition
				if (subitems.length>7)
					shares[i][7] = subitems[7]; // keywords : obj and/or mess
				if (shares[i][0].indexOf(node.userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
					displayShare[i] = true;
				else
					displayShare[i] = false;
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
					var shareoptions = (shares[i].length>7) ? shares[i][7] : "";
					if (shareto!='' && node.shareroles.indexOf('2world')<0) {
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
							var js = "sendSharingURL('"+node.id+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"'"+")";
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
							var js = "getSendSharingURL('"+node.id+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"','"+shareoptions+"')";
//							var js = "getSendSharingURL('"+node.id+"','"+sharewithrole+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"'"+")";
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
						if (node.shareroles.indexOf('2world')>-1) {
							html_toadd = "<span id='2world-"+node.id+"'></span>";
						} else {
							html_toadd = "<span class='button fas fa-share' style='"+menus_style+"' data-toggle='modal' data-target='#edit-window' onclick=\"getSendPublicURL('"+node.id+"','"+node.shareroles+"')\" data-title='"+karutaStr[LANG]["button-share"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
						}
					}
					if (shares[i].length==6 || (shares[i].length>6 && eval(shares[i][6])))
						html += html_toadd;
				}
			}
		} catch(e){
			alertHTML('Share Error: check the format: '+e);
		}
	}
	//--------------------------------------------------
	return html;
	}

//==================================================
UIFactory["Node"].getReportMenus = function(menulabels,menuroles,nodeid,targetid,langcode)
//==================================================
{
	var menus_style = "";
	var no_monomenu = 0;
	var html = "";
	try {
			//--------------------------------
			var mlabels = [];
			var labelitems = menulabels.split(";");
			for (var i=0; i<labelitems.length; i++){
				var subitems = labelitems[i].split(",");
				mlabels[i] = [];
				mlabels[i][0] = subitems[0]; // label
				mlabels[i][1] = subitems[1]; // roles
			}
			//--------------------------------
			var menus = [];
			var displayMenu = false;
			if (menuroles.indexOf('function')<0)
				menuroles = replaceVariable(menuroles);
			var items = menuroles.split(";");
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
				if ( (menus[i][3].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer'){
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
				if ( menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
						nbmenus++;
			}
			var monomenu = (nbmenus==1);
			//--------------------------------
			if (displayMenu && !monomenu) {
				//-----------------------
				html += "<span class='dropdown'>";
				html += "	<button class='btn dropdown-toggle add-button' style='"+menus_style+"' type='button' id='specific_"+nodeid+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
				//-----------
				if (mlabels[0][0]!='none' && mlabels[0][0]!='') {
					for (var i=0; i<mlabels.length; i++){
						if (mlabels[i][1].containsArrayElt(g_userroles) || mlabels[i][1].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer') {
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
				html += "	<div class='dropdown-menu dropdown-menu-right' style='"+menus_style+"' aria-labelledby='specific_"+nodeid+"'>";
				//--------------------------menu items--------------------------------------
				var databack = false;
				for (var i=0; i<menus.length; i++){
					var callback = "UIFactory.Node.reloadUnit";
//					if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' )
//						callback = "UIFactory.Node.reloadStruct";
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
							var nodes = $("*:has(>metadata[semantictag='"+menus[i][4]+"'])",g_portfolio_current);
							if (nodes.length>0) {
								targetid = $(nodes[0]).attr("id");
								var parent = nodes[0];
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
							}
						}
						//-------------------------------------------------------------
						if (menus[i][3].containsArrayElt(g_userroles) || menus[i][3].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer')
							html += UIFactory["Node"].getSpecificMenu(nodeid,menus[i],targetid,title,databack,callback,param2,param3,param4);
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
//				if (node.asmtype=='asmStructure' || node.asmtype=='asmRoot' ) {
//					callback = "UIFactory.Node.reloadStruct";
//					param2 = "'"+g_portfolio_rootid+"'";
//				}
				var i = no_monomenu;
				//-------------------
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
					var targetid = nodeid;
					if (menus[i][4]!=""){
						var nodes = $("*:has(>metadata[semantictag='"+menus[i][4]+"'])",g_portfolio_current);
						if (nodes.length>0) {
							targetid = $(nodes[0]).attr("id");
							var parent = nodes[0];
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
						}
					}
				if (menus[i][3].containsArrayElt(g_userroles) || menus[i][3].indexOf($(USER.username_node).text())>-1 || USER.admin || g_userroles[0]=='designer')
					html += UIFactory["Node"].getSingleMenu(nodeid,menus[i],targetid,title,databack,callback,param2,param3,param4);
				//------------------
			}
		
	} catch(e){
		alertHTML('Menu Error: check the format: '+e);
	}
	return html;
}
