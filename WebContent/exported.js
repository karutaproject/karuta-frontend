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
	removeElement("navigation-bar");
	removeElement("wait-window");
	removeElement("collapse-2");
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
	removeClass('selected');
	hideElement('buttons-menus');
	hideElement('metainfo');
	cleanSidebar();
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

function removeClass(classname) {
	var elts = document.getElementsByClassName(classname);
	while( elts.length )  // Selector is re-evaluated with classList remove
	{
		var b = elts[0];
		b.classList.remove(classname);
	}
}

function removeElement(childid) {
	var child = document.getElementById(childid);
	child.parentNode.removeChild(child);
}

function hideElement(classname) {
	  var elts = document.getElementsByClassName(classname);
	  for(i=0; i<elts.length; i++) {
		  elts[i].style.display = 'none';
	  }
	}

//==================================
function toggleSideBar()
//==================================
{
	var sidebar = document.getElementById("sidebar");
	var contenu = document.getElementById("contenu");
	if (sidebar.style.display == 'none')
	{
		sidebar.style.display = 'block';
		contenu.classList.remove("col-md-12");
		contenu.classList.add("col-md-9");
	} else {
		sidebar.style.display = 'none';
		contenu.classList.remove("col-md-9");
		contenu.classList.add("col-md-12");
	}
}

//==================================
function toggleSidebarPlusMinus(uuid) { // click on PlusMinus
//==================================
	var node = document.getElementById("toggle_"+uuid);
	var collapse = document.getElementById("collapse"+uuid);

	if (collapse.style.display=='block')
	{
		node.classList.remove("glyphicon-minus");
		node.classList.add("glyphicon-plus")
		document.getElementById("collapse"+uuid).style.display='none';
	} else {
		node.classList.remove("glyphicon-plus");
		node.classList.add("glyphicon-minus")
		document.getElementById("collapse"+uuid).style.display='block';
	}
}

//==================================
function toggleContent(uuid) {
//==================================
	var node = document.getElementById("toggleContent_"+uuid);
	if (node.classList.contains("glyphicon-plus")) {
		node.classList.remove("glyphicon-plus");
		node.classList.add("glyphicon-minus")
		document.getElementById("content-"+uuid).style.display='block';
	} else {
		node.classList.remove("glyphicon-minus");
		node.classList.add("glyphicon-plus")
		document.getElementById("content-"+uuid).style.display='none';
	}
}

//==================================
function cleanSidebar()
//==================================
{
	var elts = document.getElementsByClassName("glyphicon-minus");
	for(i=0; i<elts.length; i++) {
		var nodeid = elts[i].getAttribute('id');
		if (nodeid.indexOf('toggle_')>-1){
			var uuid = nodeid.substring(nodeid.indexOf('toggle_')+7);
			elts[i].classList.add("glyphicon-plus")
			elts[i].classList.remove("glyphicon-minus");
			document.getElementById("collapse"+uuid).style.display='none';
		}
	}
	var elts1 = document.getElementsByClassName("glyphicon-plus");
	for(i=0; i<elts1.length; i++) {
		var nodeid = elts1[i].getAttribute('id');
		if (nodeid.indexOf('toggle_')>-1){
			var uuid = nodeid.substring(nodeid.indexOf('toggle_')+7);
			document.getElementById("collapse"+uuid).style.display='none';
		}
	}

}

