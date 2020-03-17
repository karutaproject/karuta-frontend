//==================================
function loadAndDisplayFolderChildren(dest,uuid,langcode) {
//==================================
	//loadAndDisplayFolderChildren('collapse_projectb0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c','b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c');
}

//==================================
function loadAndDisplayFolderContent2(dest,uuid,langcode) {
//==================================
	//loadAndDisplayFolderContent('folder-portfolios','LA-test');
	//loadAndDisplayFolderContent2('project','collapse_projectb0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c','b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c');
}

//==================================
function loadAndDisplayFolderContent(dest,uuid,page,langcode) {
//==================================
	//loadAndDisplayFolderContent('folder-portfolios','LA-test');
	//loadAndDisplayFolderContent2('collapse_projectb0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c','b0454ab3-1e8c-4b9e-8ab4-a6a6b966f26c');
}

//==================================
function toggleElt(closeSign,openSign,eltid) { // click on open/closeSign
//==================================
	var elt = document.getElementById("toggle_"+eltid);
	elt.classList.toggle(openSign);
	elt = document.getElementById("collapse_"+eltid);
	elt.classList.toggle('active');
	if ($("#toggle_"+eltid).hasClass(openSign))
	{
		localStorage.setItem('sidebar'+eltid,'open');
	} else {
		localStorage.setItem('sidebar'+eltid,'closed');
	}
}

//==================================
function toggleOpenElt(closeSign,openSign,eltid)
{ // click on label
//==================================
	if (!($("#toggle_"+eltid).hasClass(openSign)))
	{
		localStorage.setItem('sidebar'+eltid,'open');
//		$("#toggle_"+type+uuid).removeClass(openSign)
		$("#toggle_"+eltid).addClass(openSign)
		$("#collapse_"+eltid).addClass("active");
	}
}

//==================================
function selectElt(type,uuid)
{ // click on label
//==================================
	$('.active').removeClass('active');
	$('#'+type+'_'+uuid).addClass('active');
}

//==================================
function selectElts(type,list)
{ // click on label
//==================================
	$('.'+type).removeClass('active');
	for (var i=0;i<list.length;i++) {
		$('#'+type+'_'+list[i]).addClass('active');
	}
}

