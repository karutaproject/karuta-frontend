/* =======================================================
	Copyright 2017 - ePortfolium - Licensed under the
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

window.onload = function()
{
	/// Remove wait div
	var wait = document.getElementById("wait-window");
	wait.parentElement.removeChild(wait);
	
	/// Fix welcome page
	var blocks = document.getElementsByClassName("welcome-block");
	while( blocks.length )  // Selector is re-evaluated with classList remove
	{
		var b = blocks[0];
		b.classList.remove("welcome-block");
	}
	
	/// Fix other nodes
	var blocks = document.getElementsByClassName("asmnode");
	while( blocks.length )  // Selector is re-evaluated with classList remove
	{
		var b = blocks[0];
		b.classList.remove("asmnode");
	}
	
	var nodes = document.getElementsByClassName("navbar-collapse");
	for( var i=0; i<nodes.length; i++ )
	{
		var nod = nodes[i];
		nod.setAttribute("class", "navbar-collapse");
	}
	
	var nodes = document.getElementsByClassName("panel-collapse");
	for( var i=0; i<nodes.length; i++ )
	{
		var nod = nodes[i];
		nod.setAttribute("class", "panel-collapse");
	}
}

function toggleSidebarPlus(id)
{
};

function displayPage(id)
{
	/// Fetch saved page
	/// div id=
	var div = document.getElementById("export_sidebar_"+id);
	/// Replace the currently displayed one
	var content = document.querySelector("#contenu");
	while( content.firstChild )
		content.removeChild(content.firstChild);

	// Should copy the child nodes of div, but it's still OK
	content.appendChild(div.cloneNode(true));
};

