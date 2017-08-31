<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

<xsl:param name="lang">fr</xsl:param>
<xsl:param name="tree">1</xsl:param>
<xsl:param name="publish">0</xsl:param>
<xsl:param name="url"/>
<xsl:param name="ppath"/>
<xsl:param name="url-appli"/>
<xsl:param name="urlimage"/>

<xsl:include href="xmlportfolio2fo_base.xsl"/>

  <xsl:template match="/">
    <fo:root font-family="Helvetica">
      <fo:layout-master-set>
		<fo:simple-page-master master-name="default-sequence" page-height="11in" page-width="8.5in" margin-left="2cm" margin-right="1.8cm" margin-top="2cm" margin-bottom="1cm">
			<fo:region-body region-name="Content" margin-bottom="0.7in"/>
			<fo:region-after region-name="Footer" extent="0.4in" />
		</fo:simple-page-master>
     </fo:layout-master-set>
		<xsl:if test="$tree ='1'">
			<xsl:call-template name="tree"/>
		</xsl:if>
    	<xsl:apply-templates select="//asmRoot"/>
    </fo:root>
  </xsl:template>
	
</xsl:stylesheet>