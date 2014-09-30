<?xml version="1.0" encoding="UTF-8"?>
<!-- Authors: Olivier Gerbé, Thi Lan Anh Dinh - 2013 -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- ============= ============= ============= -->
<xsl:template name="first">
	<xsl:param name="text"/>
	<xsl:param name="pDelim"/>
	<xsl:param name="pElemName" select="'word'" />
	<xsl:value-of select="substring-before($text,$pDelim)" />

</xsl:template>

<xsl:template name="second">
	<xsl:param name="text"/>
	<xsl:param name="pDelim"/>
	<xsl:param name="pElemName" select="'word'" />
	<xsl:value-of select="substring-before(substring-after($text,$pDelim),$pDelim)" />
</xsl:template>

<xsl:template name="third">
	<xsl:param name="text"/>
	<xsl:param name="pDelim"/>
	<xsl:param name="pElemName" select="'word'" />
	<xsl:value-of select="substring-before(substring-after(substring-after($text,$pDelim),$pDelim),$pDelim)" />
</xsl:template>

<xsl:template name="fourth">
	<xsl:param name="text"/>
	<xsl:param name="pDelim"/>
	<xsl:param name="pElemName" select="'word'" />
	<xsl:value-of select="substring-after(substring-after(substring-after($text,$pDelim),$pDelim),$pDelim)" />
</xsl:template>

<xsl:template name="split">
	<xsl:param name="pText" select="." />
	<xsl:param name="pDelim" select="', '" />
	<xsl:param name="pElemName" select="'word'" />

	<xsl:if test="string-length($pText)">
		<xsl:element name="{$pElemName}">
			<xsl:value-of select="substring-before(concat($pText,$pDelim),$pDelim)" />
		</xsl:element>

		<xsl:call-template name="split">
			<xsl:with-param name="pText" select="substring-after($pText,$pDelim)" />
			<xsl:with-param name="pDelim" select="$pDelim" />
			<xsl:with-param name="pElemName" select="$pElemName" />
		</xsl:call-template>
	</xsl:if>
</xsl:template>

<!-- ============= ============= ============= -->

<xsl:template name="getAttribute_Veriffunction">
	<xsl:param name="nodeparent"></xsl:param>
	&lt;input type="hidden" id="form-veriffunction-<xsl:value-of select="$nodeparent/@id"/>" value='<xsl:value-of select="$nodeparent/metadata-wad/@veriffunction"/>'/&gt;
</xsl:template>
	
<xsl:template name="getAttributes">
	<xsl:if test="@help">
		help="<xsl:value-of select="@help" />"
	</xsl:if>
	<xsl:if test="@menuroles">
		menuroles="<xsl:value-of select="@menuroles" />"
	</xsl:if>
	<xsl:apply-templates select="@*[not(local-name()=help) and not(local-name()=menuroles)]" />
</xsl:template>

<!-- ============= ============= ============= -->

<xsl:template match="@*">
	<xsl:text> </xsl:text>
	<xsl:value-of select="local-name()" />="<xsl:value-of select="." />"
</xsl:template>

<xsl:template name="str2lastIndex">
	<xsl:param name="string" />
	<xsl:param name="char" />
	<xsl:choose>
		<xsl:when test="contains($string, $char)">
			<xsl:variable name="lastIndexOfA">
				<xsl:call-template name="lastIndexOf">
					<xsl:with-param name="string" select="$string" />
					<xsl:with-param name="char" select="$char" />
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$lastIndexOfA=''">
					<xsl:value-of select="$string" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="tmp">
						<xsl:value-of select="$char" />
						<xsl:value-of select="$lastIndexOfA" />
					</xsl:variable>
					<xsl:value-of select="substring-before($string,$tmp)" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$string" />
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- define a lastIndexOf named template -->
<xsl:template name="lastIndexOf">
   <xsl:param name="string" />
   <xsl:param name="char" />
   <xsl:choose>
      <xsl:when test="contains($string, $char)">
         <xsl:call-template name="lastIndexOf">
            <xsl:with-param name="string"
                            select="substring-after($string, $char)" />
            <xsl:with-param name="char" select="$char" />
         </xsl:call-template>
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$string" /></xsl:otherwise>
   </xsl:choose>
</xsl:template>

<!-- define a lastIndexOfAB(a,b) named template -->
<xsl:template name="lastIndexOfAB">
   <!-- declare that it takes two parameters - the string and the char -->
   <xsl:param name="string" />
   <xsl:param name="a" />
   <xsl:param name="b" />

		<xsl:variable name="lastIndexOfA">
				<xsl:call-template name="lastIndexOf">
					 <xsl:with-param name="string" select="$string" />
					 <xsl:with-param name="char" select="$a" />
				</xsl:call-template>
		</xsl:variable>
   <xsl:choose>
      <xsl:when test="contains($lastIndexOfA, $b)">
      		<xsl:value-of select="substring-before($lastIndexOfA,$b)" />
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$lastIndexOfA" /></xsl:otherwise>
   </xsl:choose>
</xsl:template>

<!-- define a replace(s,p,pr) named template -->
<xsl:template name="replace">
  <xsl:param name="ptext"/>
  <xsl:param name="ppattern"/>
  <xsl:param name="preplacement"/>

  <xsl:choose>
     <xsl:when test="not(contains($ptext, $ppattern))">
      <xsl:value-of select="$ptext"/>
     </xsl:when>
     <xsl:otherwise>
       <xsl:value-of select="substring-before($ptext, $ppattern)"/>
       <xsl:value-of select="$preplacement"/>
       <xsl:call-template name="replace">
         <xsl:with-param name="ptext"
           select="substring-after($ptext, $ppattern)"/>
         <xsl:with-param name="ppattern" select="$ppattern"/>
         <xsl:with-param name="preplacement" select="$preplacement"/>
       </xsl:call-template>
     </xsl:otherwise>
  </xsl:choose>
</xsl:template>

</xsl:stylesheet>