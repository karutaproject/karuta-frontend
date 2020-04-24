/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}
 
//==================================
UIFactory["ProxyBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'ProxyBlock';
	//--------------------
	this.proxy_nodeid = $("asmContext:has(metadata[semantictag*='proxy'])",node).attr('id');
	//--------------------
	this.image_nodeid = $("asmContext:has(metadata[semantictag='image'])",node).attr('id');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["ProxyBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var proxy_element = UICom.structure["ui"][this.proxy_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if (type=='standard'){
//		html = $(proxy_element.resource.label_node[langcode]).text();
	}
	return html;
};

//==================================
UIFactory["ProxyBlock"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var proxy_element = UICom.structure["ui"][this.proxy_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if (type=='standard'){
//		html = $(proxy_element.resource.label_node[langcode]).text();
	}
	$("#"+dest).html(html);
};

//==================================
UIFactory["ProxyBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var proxy = UICom.structure["ui"][this.proxy_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	$("#"+destid).append($("<h4>Image</h4>"));
	image.resource.displayEditor(destid,type,langcode);
	//---------------------
	$("#"+destid).append($("<h4>Proxy</h4>"));
	proxy.resource.displayEditor(destid,type,langcode);
}




//==================================
UIFactory["ProxyBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
