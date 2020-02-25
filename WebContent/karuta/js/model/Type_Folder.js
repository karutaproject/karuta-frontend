/* =======================================================
	Copyright 2020 - ePortfolium - Licensed under the
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
	
var folders_byid = {};
var folders_list = [];
var loadedFolders = {};


/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Folder"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
}

//==================================
UIFactory["Folder"].displayAll = function(dest,type,langcode)
//==================================
{
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};