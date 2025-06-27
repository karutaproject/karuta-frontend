// Don't modify these two next lines, it's updated automatically by the maven package commands
var karuta_version = "@project.version@";
var karuta_date = "@build.timestamp@";

const karuta_version_eportfolium = 'eportfolium-3.82.1';
const karuta_date_eportfolium = '2025-06-27';

var karuta_backend_version = "?";
var karuta_backend_date = "?";
var karuta_fileserver_version = "?";
var karuta_fileserver_date = "?";

// 3.26.0 new functionality for svg report - 2024/02/22
// 3.27.0 new functionality sharing with qrcode - 2024/03/02
// 3.28.0 new functionality fontsizes added in svg report - 2024/03/02
// 3.29.0 new functionality URL2Portfolio autocompletion - 2024/03/09
// 3.30.0 Batch for-each-node enhancement  - 2024/03/15
// 3.31.0 configuration files loading  - 2024/03/16
// 3.32.0 Batch - new commands : clear-log, write-log, hide-log, reload-node, reload-unit - 2024/03/17
// 3.33.0 Change ownership search if more 200 users - 2024/03/20
// 3.34.0 Batch - Label filter on for-each-tree
// 3.35.0 Fix - CSS for media print
// 3.36.0 Report - Variable Enhancement
// 3.37.0 Feat - CSS for media print Enhancement 
// 3.38.0 Bug fixed - get_get_resource updated part of importmultiple
// 3.39.0 Bug fixed - all input texts are sanitized - script tag and javascript word are deleted
// 3.39.1 Bug fixed - get_resource - display_value did not work
// 3.40.0 Feat - get_resource and get_get_resource import multiple can use semtag+semtag2
// 3.41.0 Feat - New attribute Sharer for user
// 3.42.0 Feat - Batch Error Management
// 3.42.1 Fix  - Autoload when more than one portfolios are visible
// 3.43.0 Feat - Get_Resource - checkbox display
// 3.44.0 Feat - new function for designer : setNoceCodeWithDate(nodeid) - 2024-04-04
// 3.44.1 Fix  - error due to the JS function resourceCodecontains which had two definitions. test if value': is present or not - 2024-04-24
// 3.45.0 Feat - verification of not existing code when duplicatte or instantiate - 2024-04-24
// 3.46.0 Feat - userrole added on PUT for porfolios with multi-roles - 2024-04-24
// 3.47.0 Feat - new jquery function for report and batch : hasChildSemtagAndResourceTextContains, hasChildSemtagAndResourceTextNotEmpty - 2024-04-29
// 3.48.0 Feat - Report - Collapsable Section can be open or closed - 2024-04-28
// 3.49.0 Feat - Batch - new component : for-each-group-user - 2024-04-30
// 3.49.1 Fix  - Type Dashboard Editor - CSV rôle was missing - 2024-06-17
// 3.50.0 Feat - Multi-role - userrole in GET Node - 2024-06-17
// 3.50.1 Fix  - Batch - for-each-tree search code and label of direct child - 2024-06-19
// 3.50.2 Fix  - Get_Get_Resource - click : no pointer if not selectable - 2024-06-20
// 3.51.0 Feat - Multi-role - userrole management in direct  - 2024-06-26
// 3.51.1 Fix  - Mistyping  in user creation - 2024-06-30
// 3.52.0 Feat - Multi-role - userrole management - 2024-06-30
// 3.53.0 Feat - class with role added when select role to be able to hide some role - 2024-07-03
// 3.53.1 Fix  - if user was designer and another role in a portfolio, designer was the default role - 2024-07-09
// 3.53.2 Fix  - sometimes get-get-resource not updated - references has been changed - 2024-07-17
// 3.54.0 Feat - Batch - new function to update node comments 2024-08-03
// 3.54.1 Fix  - Public.js for multi-role management 2024-08-20
// 3.55.0 Feat - Adding Technical Support Email Subject  2024-08-26
// 3.55.1 Fix -  Get_Resource - portfolio cleancode deleted (@ in portfoliocode was deleted) 2024-09-03
// 3.56.0 Fix-Feat -  Fix type_node (username test) - Fix Get_resource (when image file is missing) - Feat - js when eltDisplayed  2024-11-01
// 3.56.1 Fix - importnode did not work with tree reference - 2024-11-05
// 3.57.0 Feat - Stack for current node and imported node in batch
// 3.57.1 Fix - Error with designer playing role and node editable in line
// 3.57.2 Fix - Error with designer playing role and node visible by designer only
// 3.57.3 Fix - QRCode was sometimes displayed twice
// 3.57.4 Fix - Help was displayed for role played by designer when help role is designer
// 3.58.0 Feat - Management of plugins
// 3.58.1 Fix - Management of plugins : Menu elts - Roles : Error when menuroles equals <menus/>
// 3.58.2 Fix - Batch - error when reexecute create-tree - 2024-12-03
// 3.59.0 Feat - Configuration CSS - var page-title-text-color added - Print porfolio functionality - 2024-12-16
// 3.60.0 Feat - Configuration CSS - var page-title-text-color added - played role management - 2024-12-23
// 3.61.0 Feat - Get_Resource checkbox in view mode - 2024-12-31
// 3.62.0 Feat - New:  semanictag not-visible-in-menu - 2025-01-19
// 3.63.0 FEAT new way to build project - version is added in html for js and css files
// 3.64.0 FEAT using variable in table variables in report is possible
// 3.65.0 FEAT - new way to erase variables in report reference
// 3.66.0 FEAT - new CSS class ellipsis
// 3.66.1 FIX - new CSS to hide print button on root except if for print portfolio
// 3.67.0 FEAT - submenu in asmstructure - FIX - table date sorter﻿
// 3.68.0 FEAT - recursive horizontal submenu in asmstructure
// 3.69.0 FEAT - menu can be limited to one level using one-level-menu class
// 3.69.1 FIX - variables with $ in report
// 3.70.0 FEAT - Batch for-each-tree built-in variables treecode and treelabel are available
// 3.70.1 FIX   - create folder - veification of existng code by the server
// 3.71.0 FEAT   -  Report : new for-each-usergroup, for-each-portfoliogroup - Batch: new for-each-group-portfolio
// 3.72.0 FEAT   -  Get_resource : usergroup  / portfoliogroup
// 3.72.1 FIX   -  Get_Get_resource : error when inline and using variables in query
// 3.73.0 FEAT   -  enhancement Get_Resource and Get_Get_resource
// 3.74.0 FEAT   -  Get_Get_resource usergroup and portfoliogroup
// 3.75.0 FEAT - Calendar can be used in form and batch
// 3.75.1 FIX - Calendar Date.parse
// 3.76.0 FEAT  -  Batch and usergroup enhancement
// 3.77.0 FEAT  -  Batch enhancement
// 3.78.0 FEAT  -  BATCH join-leave group modified to be used with get_resource and get_get_resource group in form
// 3.79.0 FIX - Get_resource in node
// 3.79.1 FIX - Get_resource in node
// 3.79.2 FIX - Report submission in report
// 3.79.3 FIX - Get_Resource special characters in inline mode
// 3.80.0 FEAT - Get_Resource on portfolios - Batch archive folder
// 3.80.1 FIX - Batch import-node - no import if test exists and returns nothing
// 3.80.2 FIX - url not well defined when sharing 2world
// 3.81.0 FEAT - Report Rounded Percentage addes
// 3.81.1 FIX - display portfolios of a user
// 3.81.2 FIX - Import multiple and nodes allready added
// 3.81.3 FIX - Batch - test in import-node
// 3.82.0 FEAT - Report sort in for-each-portfolio with ##current_portfoliogroup## keyword
// 3.82.1 FIX - Batch - join-usergroup with variable