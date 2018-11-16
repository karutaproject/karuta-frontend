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


var b64array = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function toB64(input) {
  input = toUTF8(input);
  var base64 = '';
  var i = 0;
  do {
    var c1 = input.charCodeAt(i++);
    var c2 = input.charCodeAt(i++);
    var c3 = input.charCodeAt(i++);
    var enc1 = (c1 & 0xFC) >> 2;
    var enc2 = ((c1 & 0x03) << 4) | ((c2 & 0xF0) >> 4);
    var enc3 = ((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6);
    var enc4 = (c3 & 0x3F);
    if (isNaN(c2)) enc3 = enc4 = 64;
    else if (isNaN(c3)) enc4 = 64;
    base64 = base64 +
    b64array.charAt(enc1) +
    b64array.charAt(enc2) +
    b64array.charAt(enc3) +
    b64array.charAt(enc4);
  } while (i < input.length);
  return base64;
}

// Convert string to UTF-8, since the base64 decode function only takes that
// and accents disappear, which make decoding malfunction
function toUTF8(str)
{
  var retval = "";
  for( var i=0; i<str.length; ++i )
  {
    var c = str.charCodeAt(i);
    if( c <= 127 )
      retval += str[i];
    else if( c > 127 && c < 2048 )
    {
      retval += String.fromCharCode((c >> 6) | 192);
      retval += String.fromCharCode((c & 63) | 128);
    }
    else
    {
      retval += String.fromCharCode((c >> 12) | 224);
      retval += String.fromCharCode(((c >> 6) & 63) | 128);
      retval += String.fromCharCode((c & 63) | 128);
    }
  }
  return retval;
}

// Make some CSS copy to plug in the image tag
function fetchCSS( svgnode )
{
	var lines = $('line[class]', svgnode);
	var csshash = {};
	for(var i=0; i<lines.length; ++i)
	{
		var line = lines[i];
		var name = $(line).attr("class");
		/// Asking pre-know attribute, might not work if more needed
		csshash[name] = $(line).css(["stroke","stroke-width", "stroke-linecap"]);
	}

	var cssdef = "";
	var rules = "";
	for(var i in csshash)
	{
		var css = csshash[i];
		var csd = "line."+i+"{ stroke:"+css["stroke"]+"; stroke-width:"+css["stroke-width"]+"; stroke-linecap:"+css["stroke-linecap"]+"; }\n"
		rules += csd;
	}
	
	var cssdef = $('<style type="text/css"><![CDATA['+rules+']]></style>');
	return cssdef
}

function SVGToIMG( svgnode ,imgid)
{
	var css = fetchCSS(svgnode);
	$(svgnode).append(css);
	var svghtml = $(svgnode).attr('version', 1.1).attr('xmlns', 'http://www.w3.org/2000/svg');
	svghtml = $(svghtml).prop("outerHTML");
	var image = $("<img id='"+imgid+"'></img>");
	var imgsrc = 'data:image/svg+xml;base64,' + toB64(svghtml);
	$(image).attr('src', imgsrc);
	$(svgnode).remove(css);
	return image;
}


function SVGToPNG( svgnode )
{
	var DOMURL = window.URL || window.webkitURL || window;

	// Prepare SVG
	// !!Important!! Add needed width, height attribute in svg tag,
	// otherwise nothing is drawn on the canvas
	// Also, CSS and namespace
	var css = fetchCSS(svgnode);
	$(svgnode).prepend(css);
	$(svgnode).attr('version', 1.1).attr('xmlns', 'http://www.w3.org/2000/svg');
	$(svgnode).attr("height", 2100).attr("width", 2100);
	var data = $(svgnode).prop("outerHTML");

	// Dimension for 8.5"x11" page with 1.5" margin (2*0.75) at 300DPI
	// -> 2100x2100 (supposed it's a square area)
	// Prepare canvas
	var canvas = $("<canvas/>").attr("width","2100").attr("height", "2100");
	// Ensure canvas is displayed within page width
	// It's a raw element resize, saving image will be the full dimensions
	$(canvas).css("width","100%");
	var ctx = $(canvas)[0].getContext("2d");
	
	// Convert SVG
	var im = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);
	
	im.onload = function()
	{
		ctx.drawImage(im, 0, 0);
		DOMURL.revokeObjectURL(url);
		
		// Remove css and svg dimensions so it stays dynamic for phone users
		// The namespace can stay though
		$(svgnode).removeAttr("height").removeAttr("width");
		$(svgnode).remove(css);
	};
	im.src = url;
	
	return canvas;
}

