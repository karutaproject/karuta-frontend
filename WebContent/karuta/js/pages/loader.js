//==============================
function loadCSS(url)
//==============================
{
	var head  = document.getElementsByTagName('head')[0];
	var css  = document.createElement('link');
	css.rel  = 'stylesheet';
	css.type = 'text/css';
	css.href = url;
	head.appendChild(css);

//	document.write("<link rel='stylesheet' type='text/css' href='"+url+"'></link>");
};

//==============================
function loadLESS(url)
//==============================
{
	var head  = document.getElementsByTagName('head')[0];
	var css  = document.createElement('link');
	css.rel  = 'stylesheet/less';
	css.type = 'text/css';
	css.href = url;
	head.appendChild(css);

//	document.write("<link rel='stylesheet/less' type='text/css' href='"+url+"'></link>");
};

/*
///==============================
var asynccount = [];
function loadJS(url, group, cb)
//==============================
{
  var bin = ""; // Default group
  if( group != null ) bin = group;
  var execCB = function(){
    asynccount[bin]--;
    if( asynccount[bin] == 0 && cb != null ) cb();
  };

  if( asynccount[bin] == null ) asynccount[bin] = 0;
  asynccount[bin]++;

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
//	script.defer = true;
	script.src = url;
	script.onload = execCB;
	document.getElementsByTagName('head')[0].appendChild(script);
//	document.write("<script src='"+url+"'></script>");
};
//*/

//==============================
function loadKarutaPage(url)
//==============================
{
	//--------------------------------------------------------------
	loadCSS(url+"/other/bootstrap/css/bootstrap.min.css");
	loadCSS(url+"/other/css/jquery-ui.css");
	loadCSS(url+"/other/css/font-awesome/css/font-awesome.min.css");
	loadCSS(url+"/other/colorpicker/css/evol.colorpicker.min.css");
	//--------------------------------------------------------------
	var karuta_config = "../../../"+appliname+"/application/css/color.less";
	less = {
		    globalVars: {
		    	'KARUTA-CONFIG': "'"+karuta_config+"'"
		    }
		  };
	loadLESS(url+"/application/css/color.less");
	loadLESS(url+"/karuta/css/karuta.less");
	loadJS(url+"/other/js/less.min.js")
	//--------------------------------------------------------------
//	loadJS(url+"/karuta/js/karuta.js");
//	loadJS(url+"/karuta/js/UICom.js");
	loadJS(url+"/karuta/js/batch.js");
	loadJS(url+"/karuta/js/report.js");
	//--------------------------------------------------------------
//	loadJS(url+"/karuta/js/pages/karuta-page.js");
//	loadJS(url+"/karuta/js/pages/list.js");
	loadJS(url+"/karuta/js/pages/main.js");
//	loadJS(url+"/karuta/js/pages/users.js");
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/pages/usersgroups.js");
	loadJS(url+"/karuta/js/pages/portfoliosgroups.js");
	loadJS(url+"/karuta/js/pages/execbatch.js");
	loadJS(url+"/karuta/js/pages/execreport.js");
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/resources/Type_Calendar.js");
	loadJS(url+"/karuta/js/resources/Type_Comments.js");
	loadJS(url+"/karuta/js/resources/Type_Document.js");
	loadJS(url+"/karuta/js/resources/Type_DocumentBlock.js");
	loadJS(url+"/karuta/js/resources/Type_Proxy.js");
	loadJS(url+"/karuta/js/resources/Type_ProxyBlock.js");
	loadJS(url+"/karuta/js/resources/Type_Get_Proxy.js");
	loadJS(url+"/karuta/js/resources/Type_TextField.js");
	loadJS(url+"/karuta/js/resources/Type_Field.js");
	loadJS(url+"/karuta/js/resources/Type_Image.js");
	loadJS(url+"/karuta/js/resources/Type_ImageBlock.js");
	loadJS(url+"/karuta/js/resources/Type_Get_Resource.js");
	loadJS(url+"/karuta/js/resources/Type_Get_Double_Resource.js");
	loadJS(url+"/karuta/js/resources/Type_Get_Get_Resource.js");
	loadJS(url+"/karuta/js/resources/Type_URL.js");
	loadJS(url+"/karuta/js/resources/Type_URLBlock.js");
	loadJS(url+"/karuta/js/resources/Type_Item.js");
	loadJS(url+"/karuta/js/resources/Type_Video.js");
	loadJS(url+"/karuta/js/resources/Type_CompetencyEvaluation.js");
	loadJS(url+"/karuta/js/resources/Type_Oembed.js");
	loadJS(url+"/karuta/js/resources/Type_Audio.js");
	loadJS(url+"/karuta/js/resources/Type_SendEmail.js");
	loadJS(url+"/karuta/js/resources/Type_URL2Unit.js");
	loadJS(url+"/karuta/js/resources/Type_Dashboard.js");
	loadJS(url+"/karuta/js/resources/Type_Report.js");
	loadJS(url+"/karuta/js/resources/Type_BatchForm.js");
	loadJS(url+"/karuta/js/resources/Type_Color.js");
	loadJS(url+"/karuta/js/resources/Type_Action.js");
	loadJS(url+"/karuta/js/resources/Type_ROME.js");
	//--------------------------------------------------------------
//	var sp = function(){
//		loadJS(url+"/other/js/jquery.spin.js");
//	};
	//--------------------------------------------------------------
	var jqw = function(){
		loadJS(url+"/other/colorpicker/js/evol.colorpicker.min.js");
		loadJS(url+"/other/js/jquery.fileupload.js");
	};
	//--------------------------------------------------------------
	var dp = function(){
		loadJS(url+"/other/bootstrap-datepicker/bootstrap-datepicker.fr.js");
	};
//	var jqd = function(){
		loadJS(url+"/other/js/jquery-ui-1.10.3.custom.min.js");
//		loadJS(url+"/other/bootstrap/js/bootstrap.min.js");
		loadJS(url+"/other/js/jquery.ui.touch-punch.min.js");
//		loadJS(url+"/other/js/spin.js", "sp", sp);
		//--------------------------------------------------------------
		loadJS(url+"/other/js/jquery.ui.widget.js", "jqw", jqw);
		loadJS(url+"/other/js/jquery.iframe-transport.js");
		loadJS(url+"/other/bootstrap-datepicker/bootstrap-datepicker.js", "dp", dp);
		loadCSS(url+"/other/bootstrap-datepicker/datepicker.css");
		//--------------------------------------------------------------
		loadJS(url+"/other/js/js.cookie.js");
		loadJS(url+"/other/js/jquery.sortElements.js");
		//--------------------------------------------------------------
		loadJS(url+"/other/js/jquery_hotkeys.js");
		loadJS(url+"/other/js/JQueryRC4.js");
		//--------------------------------------------------------------
		loadCSS(url+"/other/wysihtml5/bootstrap3-wysihtml5.min.css");
		loadJS(url+"/other/wysihtml5/bootstrap3-wysihtml5.all.min.js");
		//--------------------------------------------------------------		
		if (typeof bubble_installed!="undefined" && bubble_installed) {
						loadJS(url+"/karuta/js/resources/Type_Bubble.js");
						loadJS(url+"/other/js/jquery-qrcode-0.14.0.js");
		}
//	};
//	loadJS(url+"/other/js/jquery-1.10.2.min.js", "jq", jqd);
	//--------------------------------------------------------------
	//--------------------------------------------------------------
//	loadJS(url+"/karuta/js/model/Type_Portfolio.js");
//	loadJS(url+"/karuta/js/model/Type_Node.js");
//	loadJS(url+"/karuta/js/model/Type_User.js");
	loadJS(url+"/karuta/js/model/Type_UsersGroup.js");
	loadJS(url+"/karuta/js/model/Type_PortfoliosGroup.js");
	//--------------------------------------------------------------
	if (!audiovideohtml5) {
		loadCSS(url+"/other/jplayer/jplayer.blue.monday.css");
		loadJS(url+"/other/jplayer/jquery.jplayer.min.js");
	}
	//--------------------------------------------------------------
//	loadJS(url+"/karuta/js/version.js");
	//--------------------------------------------------------------
	loadJS(url+"/karuta/js/SVGToIMG.js");
	loadJS(url+"/karuta/js/export.js");
	//--------------------------------------------------------------
	loadJS(url+"/other/html2canvas/html2canvas.js");
	loadJS(url+"/other/html2canvas/html2canvas.svg.js");
	//--------------------------------------------------------------		
//	if (typeof europass_installed!="undefined" && europass_installed) {
//		loadJS(url+"/karuta/js/resources/Type_EuropassL.js");
//	}
	//--------------------------------------------------------------
	if (typeof elgg_installed!="undefined" && elgg_installed) {
		loadCSS(url+"/socialnetwork-elgg/css/elgg.css");
		loadCSS(url+"/socialnetwork-elgg/css/socialnetwork.css");
		loadJS(url+"/socialnetwork-elgg/js/socialnetwork.js");
		loadJS(url+"/socialnetwork-elgg/js/moment-with-locales.min.js");
	}
	//--------------------------------------------------------------
	loadCSS(url+"/application/css/specific.css");

}

