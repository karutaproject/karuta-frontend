
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------------- MENUS ------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].getSingleMenu = function(parentid,srce,tag,title,databack,callback,param2,param3,param4)
//==================================================
{	// note: #xxx is to avoid to scroll to the top of the page
	if (srce=="self")
		srce = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	var html = "<a class='button text-button' onclick=\"";
	if (srce=='function'){
		var items = tag.split("/");
		html += items[0] +"('"+parentid+"','"+title+"'";
		if (items.length>1)
			html += ",";
		for (var i=1;i<items.length;i++){
			html += "'" + items[i] + "'";
			if (i<items.length-1)
				html += ",";
		}
		html += ");"
	} else {
		var semtags = tag.split(" ");
		for (var i=0;i<semtags.length;i++){
			if (semtags[i].length>0)
			html += "importBranch('"+parentid+"','"+srce+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
		}
	}
	html += "\">";
	html += title;
	html += "</a>";
	return html;
};

//==================================================
UIFactory["Node"].getSpecificMenu = function(parentid,srce,tag,title,databack,callback,param2,param3,param4)
//==================================================
{	// note: #xxx is to avoid to scroll to the top of the page
	if (srce=="self")
		srce = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	var html = "<a class='dropdown-item button text-button' onclick=\"";
	if (srce=='function'){
		var items = tag.split("/");
		html += items[0] +"('"+parentid+"','"+title+"'";
		if (items.length>0)
			html += ",";
		for (var i=1;i<items.length;i++){
			html += "'" + items[i] + "'";
			if (i<items.length-1)
				html += ",";
		}
		html += ");"
	} else {
		var semtags = tag.split(" ");
		for (var i=0;i<semtags.length;i++){
			if (semtags[i].length>0)
			html += "importBranch('"+parentid+"','"+srce+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
		}
	}
	html += "\">";
	html += title;
	html += "</a>";
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
		html += "importBranch('"+parentid+"','"+srce+"','"+semtags[i]+"',"+databack+","+callback+","+param2+","+param3+","+param4+");"
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
	var html = "";
	//------------- node menus button ---------------
	if ((USER.admin || g_userroles[0]=='designer') && (this.asmtype != 'asmContext' && (this.depth>0 || this.asmtype == 'asmUnitStructure'))) {
		html += "<span class='dropdown'>";
		html += "	<button class='btn dropdown-toggle add-button' type='button' id='add_"+this.id+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		html += 		karutaStr[languages[langcode]]['Add'];
		html += "	</button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='add_"+this.id+"'>";
		//--------------------------------
		if (this.asmtype == 'asmRoot' || this.asmtype == 'asmStructure') {
			var databack = false;
			var callback = "UIFactory['Node'].reloadStruct";
			var param2 = "'"+g_portfolio_rootid+"'";
			var param3 = null;
			var param4 = null;
			html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','asmStructure','asmStructure',databack,callback,param2,param3,param4);
			html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','asmUnit','asmUnit',databack,callback,param2,param3,param4);
		}
		var databack = false;
		var callback = "UIFactory.Node.reloadUnit";
		var param2 = "'"+g_portfolioid+"'";
		var param3 = null;
		var param4 = null;
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','asmUnitStructure','asmUnitStructure',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','TextField','TextField',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Field','Field',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Document','Document',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','URL','URL',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Calendar','Calendar',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Image','Image',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Video','Video',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Audio','Audio',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Oembed','Oembed',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Color','Color',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','URL2Unit','URL2Unit',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Comments','Comments',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','SendEmail','SendEmail',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Dashboard','Dashboard',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Report','Report',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-structured-resources','DocumentBlock','DocumentBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-structured-resources','URLBlock','URLBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-structured-resources','ImageBlock','ImageBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-structured-resources','URL2UnitBlock','URL2UnitBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-structured-resources','TextFieldBlock','TextFieldBlock',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-bubbles','bubble_level1','BubbleMap',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'europass.parts','EuropassL','Europass',databack,callback,param2,param3,param4);
		html += "<hr>";
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Item','Item',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Get_Resource','Get_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Get_Get_Resource','Get_Get_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Get_Double_Resource','Get_Double_Resource',databack,callback,param2,param3,param4);
		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Proxy','Proxy',databack,callback,param2,param3,param4);
//		html += UIFactory["Node"].getItemMenu(this.id,'karuta.karuta-resources','Get_Proxy','Get_Proxy',databack,callback,param2,param3,param4);
		//--------------------------------
		if (plugin_resources.length>0){
			html += "<hr>";
			for (var i=0; i<plugin_resources.length; i++) {
				html += UIFactory.Node.getItemMenu(this.id,plugin_resources[i].location,plugin_resources[i].tag,plugin_resources[i].label,databack,callback,param2,param3,param4);
			}
		}
		//--------------------------------
		html += "	</div>"; // class='dropdown-menu'
		html += "</span>"; // class='dropdown'
	}
	//------------- specific menu ---------------
	var no_monomenu = 0;
	try {
		if ((this.depth>0 || this.asmtype == 'asmUnitStructure') && this.menuroles != undefined && this.menuroles.length>10 && (this.menuroles.indexOf(this.userrole)>-1 || (this.menuroles.containsArrayElt(g_userroles) && this.menuroles.indexOf("designer")<0) || USER.admin || g_userroles[0]=='designer') ){
			//--------------------------------
			var mlabels = [];
			var labelitems = this.menulabels.split(";");
			for (var i=0; i<labelitems.length; i++){
				var subitems = labelitems[i].split(",");
				mlabels[i] = [];
				mlabels[i][0] = subitems[0]; // label
				mlabels[i][1] = subitems[1]; // roles
			}
			//--------------------------------
			var menus = [];
			var displayMenu = false;
			var items = this.menuroles.split(";");
			for (var i=0; i<items.length; i++){
				var subitems = items[i].split(",");
				menus[i] = [];
				if (subitems[0]=="#line") {
					menus[i][0] = subitems[0]; // portfolio code
					menus[i][1] = ""; // semantic tag
					menus[i][2] = ""; // label
					menus[i][3] = ""; // roles
					menus[i][4] = ""; // condition
					
				} else {
					menus[i][0] = subitems[0]; // portfolio code
					menus[i][1] = subitems[1]; // semantic tag
					menus[i][2] = subitems[2]; // label
					menus[i][3] = subitems[3]; // roles
					if (subitems.length>4)
						menus[i][4] = subitems[4]; // condition
					else
						menus[i][4] = ""; // condition
				}
				while (menus[i][0].indexOf("##")>-1) {
					var test_string = menus[i][0].substring(menus[i][0].indexOf("##")+2); // test_string = abcd##variable##efgh.....
					var variable_name = test_string.substring(0,test_string.indexOf("##"));
					menus[i][0] = menus[i][0].replace("##"+variable_name+"##", g_variables[variable_name]);
				}
				if (menus[i][3].indexOf(this.userrole)>-1 || (menus[i][3].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer'){
					if (menus[i][4]==""){
						displayMenu = true;  // this.userrole may be included in semantictag
						no_monomenu = i;
					}
					else if(eval(menus[i][4])){
						displayMenu = true;
						no_monomenu = i;
					}
				}
			}
			//--------------------------------
			var nbmenus = 0;
			for (var i=0; i<menus.length; i++){
				if (menus[i][3].indexOf(this.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
						nbmenus++;
			}
			var monomenu = (nbmenus==1);
			//--------------------------------
			if (displayMenu && !monomenu) {
				//-----------------------
				html += "<div class='dropdown'>";
				html += "	<button class='btn dropdown-toggle add-button' type='button' id='specific_"+this.id+"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
				//-----------
				if (mlabels[0][0]!='none' && mlabels[0][0]!='') {
					for (var i=0; i<mlabels.length; i++){
						if (mlabels[i][1].indexOf(this.userrole)>-1 || mlabels[i][1].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer') {
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
				html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='specific_"+this.id+"'>";
				//-----------------------
				var databack = false;
				var callback = "UIFactory.Node.reloadUnit";
				if (this.asmtype=='asmStructure' || this.asmtype=='asmRoot' )
					callback = "UIFactory.Node.reloadStruct";
				var param2 = "'"+g_portfolio_rootid+"'";
				var param3 = null;
				var param4 = null;
				for (var i=0; i<menus.length; i++){
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
						if (menus[i][3].indexOf(this.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
							html += UIFactory["Node"].getSpecificMenu(this.id,menus[i][0],menus[i][1],title,databack,callback,param2,param3,param4);
					}
				}
				//-----------------------
				html += "		</div>"; // class='dropdown-menu'
				html += "	</div><!-- class='dropdown -->";
			}
			if (displayMenu && monomenu) {
				var databack = false;
				var callback = "UIFactory.Node.reloadUnit";
				if (this.asmtype=='asmStructure' || this.asmtype=='asmRoot' )
					callback = "UIFactory.Node.reloadStruct";
				var param2 = "'"+g_portfolio_rootid+"'";
				var param3 = null;
				var param4 = null;
				var i = no_monomenu;
				//-------------------
				var titles = [];
				var title = "";
				try {
					titles = menus[i][2].split("/");
					if (menus[i][2].indexOf("@")>-1) { // lang@fr/lang@en/...
						for (var j=0; j<titles.length; j++){
							if (titles[j].indexOf(languages[langcode])>-1)
								title = titles[j].substring(0,titles[j].indexOf("@"));
						}
					} else { // lang1/lang2/...
						title = titles[langcode];  // lang1/lang2/...
					}
				} catch(e){
					title = menus[i][2];
				}
				if (menus[i][3].indexOf(this.userrole)>-1 || menus[i][3].containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer')
					html += UIFactory["Node"].getSingleMenu(this.id,menus[i][0],menus[i][1],title,databack,callback,param2,param3,param4);
				//------------------
			}
		}
	} catch(e){
		alertHTML('Menu Error: check the format: '+e);
	}
	//------------- submit  -------------------
	if (this.submitroles!='none' && this.submitroles!='') {
		if ( this.submitted!='Y' && (
				(this.submitnode && ( this.submitroles.indexOf(g_userroles[0])>-1 || this.submitroles.indexOf($(USER.username_node).text())>-1)
				|| USER.admin
				|| g_userroles[0]=='designer'
				|| ( g_userroles[1]=='designer' && this.submitroles.indexOf(g_userroles[0])>-1)
				|| this.submitroles.indexOf(this.userrole)>-1 )))
		{
			html += "<span id='submit-"+this.id+"' class='button text-button' onclick=\"javascript:confirmSubmit('"+this.id+"'";
			if (this.submitall=='Y')
				html += ",true";
			html += ")\" ";
			html += " >"+karutaStr[languages[langcode]]['button-submit']+"</span>";
		} else {
			if (this.submitted=='Y') {
				if (USER.admin || g_userroles[0]=='administrator') {
					html += "<span id='submit-"+this.id+"' class='button text-button' onclick=\"javascript:reset('"+this.id+"')\" ";
					html += " >"+karutaStr[languages[langcode]]['button-unsubmit']+"</span>";
				}
				html += "<div class='alert alert-success button text-button'>"+karutaStr[languages[langcode]]['submitted']+this.submitteddate+"</div>";
			} 
			else {
				html += "<div class='alert alert-danger button text-button'>"+karutaStr[languages[langcode]]['notsubmitted']+"</div>";			
			}
		}
	}
	//------------- share node button ---------------
	if (this.depth>0 && this.shareroles!='none' && this.shareroles!='' && g_portfolioid!='') {
		try {
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
				if (shares[i][0].indexOf(this.userrole)>-1 || (shares[i][0].containsArrayElt(g_userroles) && g_userroles[0]!='designer') || USER.admin || g_userroles[0]=='designer')
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
					if (shareto!='' && this.shareroles.indexOf('2world')<0) {
						if (shareto!='?' && shareduration!='?' && shareoptions!="") {
							var sharetoemail = "";
							var sharetoroles = "";
							var sharetos = shareto.split(" ");
							for (var k=0;k<sharetos.length;k++) {
								if (sharetos[k].indexOf("@")>0)
									sharetoemail += sharetos[k]+" ";
								else
									sharetoroles += sharetos[k]+" ";
							}
							var js = "sendSharingURL('"+this.id+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"'"+")";
							if (sharelabel!='') {
								var label = "";
								var labels = sharelabel.split("/");
								for (var j=0; j<labels.length; j++){
									if (labels[j].indexOf(languages[langcode])>-1)
										label = labels[j].substring(0,labels[j].indexOf("@"));
								}
								html_toadd = " <span class='button sharing-button' onclick=\""+js+"\"> "+label+"</span>";
							} else {
								html_toadd = " <span class='button sharing-button' onclick=\""+js+"\">"+karutaStr[languages[langcode]]['send']+"</span>";
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
							var js = "getSendSharingURL('"+this.id+"','"+sharewithrole+"','"+sharetoemail+"','"+sharetoroles+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"','"+shareoptions+"')";
//							var js = "getSendSharingURL('"+node.id+"','"+sharewithrole+"',"+langcode+",'"+sharelevel+"','"+shareduration+"','"+sharerole+"'"+")";
							if (sharelabel!='') {
								var label = "";
								var labels = sharelabel.split("/");
								for (var j=0; j<labels.length; j++){
									if (labels[j].indexOf(languages[langcode])>-1)
										label = labels[j].substring(0,labels[j].indexOf("@"));
								}
								html_toadd = " <span class='button sharing-button' data-toggle='modal' data-target='#edit-window' onclick=\""+js+"\"> "+label+"</span>";
							} else {
								html_toadd = " <span class='button sharing-button' data-toggle='modal' data-target='#edit-window' onclick=\""+js+"\">"+karutaStr[languages[langcode]]['send']+"</span>";
							}
						}
					} else {
						if (this.shareroles.indexOf('2world')>-1) {
							html_toadd = "<span id='2world-"+this.id+"'></span>";
						} else {
							html_toadd = "<span class='button fas fa-share' data-toggle='modal' data-target='#edit-window' onclick=\"getSendPublicURL('"+this.id+"','"+this.shareroles+"')\" data-title='"+karutaStr[LANG]["button-share"]+"' data-toggle='tooltip' data-placement='bottom'></span>";
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

