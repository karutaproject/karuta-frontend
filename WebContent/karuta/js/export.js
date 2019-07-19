/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */


// Call it from inside a portfolio
function export_html()
{
	$("#export-window").show();
	$("#export-html").html("");
	var exportdiv= $("#export-html");
	// List links on the left
	var leftsidebar = $('a[id^="sidebar_"]', document);
	$("#export-window-body").html(leftsidebar.length+1);
	// Displaying div
	var divcontent = $("#contenu");

	/// Make a copy of the main page
	var body = $("body", document);
	var bhtml = $(body).html();
	var exp_left = $("<div></div>");
	$(exp_left).attr('id', 'export_sidebar');
	$(exp_left).append(bhtml);
	$(exportdiv).append(exp_left);
	
	var uuid = UICom.rootid;
	
	// Asking a page to render
	var clicking = function(link)
	{
		// Fetch link id
		var id = $(link).attr("id");
		var start = id.indexOf("_")+1;
		var uuid = id.slice(start);
		var printy = function()
		{
			// Post-proc content so it doesn't break display
			var ids = $("div[id^=node_]", divcontent);
			$(ids).removeAttr("id");
			
			/// Fetch html content
			var content = $(divcontent).html();
			var id = $(link).attr("id");
			/// Create a div for it
			var divc = $("<div></div>");
			$(divc).attr('id', 'export_'+id);
			$(exportdiv).append(divc);		
			$(divc).html(content);
		}
		$("#export-window").show();
		displayPage(uuid,1,'standard','0',true)
		$("#export-window").show();		
		// Delay so everything has time to render
		setTimeout(printy, 1000);
		$("#export-window").show();
	}
	
	var timer;
	
	/// Go through link list
	var clearqueue = function()
	{
		if( leftsidebar.length > 0 )
		{
			var item = leftsidebar.slice(0);
			leftsidebar = leftsidebar.slice(1, leftsidebar.length);
			clicking(item);
			$("#export-window-body").html(leftsidebar.length+1);
		}
		else  // No more link to click
		{
			$("#wait-window-body").html("");
			clearInterval(timer);
			
			// Send data to the backend
			// Create temp form
			var content = document.documentElement.outerHTML;
			$("#navigation-bar",content).remove();
			// Fake form so we can get the zip file back, simple .post won't do
			var form = $("<form method='POST' action='/"+serverBCK+"/export'><input id='pid' name='pid'></input><input id='content' name='content'></input><input type='submit' value='send'></form>");
			$("html", document).append(form);
			$("#pid",form).val(g_portfolioid);
			$("#content",form).val(content);
			$(form).submit();
			$(form).remove();
			$("#export-html").html("");
			$("#export-window").hide();
		}
	};
	
	/// |---------|---------|---------|---------|---------|---------|
	/// [click             ][print   ][click             ][print   ]
	timer = setInterval(clearqueue, 5000);
}
